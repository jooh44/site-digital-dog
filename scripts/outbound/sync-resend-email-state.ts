import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { Resend } from 'resend'
import { extractEmailAddress } from '../../lib/outbound/emailCampaign.ts'
import {
  findLatestEmailJobByRecipient,
  openLeadEngineDatabase,
  updateEmailJobStatus,
  upsertEmailResponse,
} from '../../lib/outbound/leadEngineStore.ts'

const { values } = parseArgs({
  options: {
    limit: { type: 'string' },
    unmatchedOutput: { type: 'string' },
  },
})

const limit = values.limit ? Number.parseInt(values.limit, 10) : 100
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')
const summaryPath = join(outputDirectory, 'sync-resend-email-state-summary.json')
const unmatchedOutputPath = values.unmatchedOutput
  ? resolve(process.cwd(), values.unmatchedOutput)
  : join(outputDirectory, 'sync-resend-unmatched-emails.json')

void main()

async function main() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required to sync email state.')
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const db = openLeadEngineDatabase()

  try {
    mkdirSync(outputDirectory, { recursive: true })
    const syncNow = new Date().toISOString()
    let statusUpdates = 0
    let matchedEmails = 0
    let unmatchedEmails = 0
    const matchMethods: Record<string, number> = {}
    const unmatched: Array<Record<string, unknown>> = []
    
    console.log('Fetching emails from Resend...')
    const allResendEmails: any[] = []
    const { data, error } = await resend.emails.list({ limit })

    if (error) {
      throw new Error(error.message)
    }

    if (data?.data) {
      allResendEmails.push(...data.data)
    }

    console.log(`Found ${allResendEmails.length} emails in Resend. Syncing with local DB...`)

    for (const resendEmail of allResendEmails) {
      const nextStatus = mapEmailEventToLocalStatus(resendEmail.last_event)
      const recipient = extractEmailAddress(resendEmail.to?.[0] ?? '')

      const match = findLocalJobForResendEmail(db, resendEmail, recipient)

      if (!match) {
        unmatchedEmails += 1
        unmatched.push({
          createdAt: resendEmail.created_at ?? null,
          id: resendEmail.id,
          lastEvent: resendEmail.last_event ?? null,
          recipient,
          scheduledAt: resendEmail.scheduled_at ?? null,
          subject: resendEmail.subject ?? null,
        })
        continue
      }

      matchedEmails += 1
      matchMethods[match.method] = (matchMethods[match.method] ?? 0) + 1

      if (match.job.status !== nextStatus || match.job.resendEmailId !== resendEmail.id) {
        db.prepare(`
          UPDATE email_jobs
          SET status = ?,
              resend_email_id = ?,
              updated_at = ?
          WHERE id = ?
        `).run(nextStatus, resendEmail.id, syncNow, match.job.id)
        statusUpdates += 1
      }
    }

    // 2. Sync Inbound
    let inboundCount = 0
    const { data: receivingList } = await resend.emails.receiving.list({ limit: 50 })
    if (receivingList) {
      for (const inbound of receivingList.data) {
        const fromEmail = extractEmailAddress(inbound.from)
        const matchedJob = findLatestEmailJobByRecipient(db, fromEmail)
        upsertEmailResponse(db, {
          resendInboundEmailId: inbound.id,
          emailJobId: matchedJob?.id ?? null,
          emailCampaignId: matchedJob?.emailCampaignId ?? null,
          organizationId: matchedJob?.organizationId ?? null,
          fromEmail,
          toEmail: extractEmailAddress(inbound.to[0] ?? ''),
          subject: inbound.subject,
          receivedAt: inbound.created_at,
          rawPayloadJson: JSON.stringify(inbound),
        }, syncNow)
        inboundCount += 1
      }
    }

    const summary = {
      resendEmailsSeen: allResendEmails.length,
      matchedEmails,
      unmatchedEmails,
      statusUpdates,
      inboundEmailsSeen: inboundCount,
      matchMethods,
      unmatchedOutputPath,
      syncedAt: syncNow,
    }

    writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`)
    writeFileSync(unmatchedOutputPath, `${JSON.stringify(unmatched, null, 2)}\n`)
    console.log(JSON.stringify(summary, null, 2))
  } finally {
    db.close()
  }
}

function findLocalJobForResendEmail(
  db: ReturnType<typeof openLeadEngineDatabase>,
  resendEmail: any,
  recipient: string
): { job: { id: number; resendEmailId: string | null; status: string }; method: string } | null {
  const byId = db.prepare(`
    SELECT id, resend_email_id AS resendEmailId, status
    FROM email_jobs
    WHERE resend_email_id = ?
    LIMIT 1
  `).get(resendEmail.id) as { id: number; resendEmailId: string | null; status: string } | undefined

  if (byId) {
    return { job: byId, method: 'resend_id' }
  }

  if (!recipient) {
    return null
  }

  const scheduledAt = normalizeResendTimestamp(resendEmail.scheduled_at)
  const byRecipientAndSchedule = scheduledAt
    ? db.prepare(`
        SELECT id, resend_email_id AS resendEmailId, status
        FROM email_jobs
        WHERE to_email = ?
          AND scheduled_at = ?
        ORDER BY id DESC
        LIMIT 1
      `).get(recipient, scheduledAt) as { id: number; resendEmailId: string | null; status: string } | undefined
    : undefined

  if (byRecipientAndSchedule) {
    return { job: byRecipientAndSchedule, method: 'recipient_scheduled_at' }
  }

  const byRecipientActive = db.prepare(`
    SELECT id, resend_email_id AS resendEmailId, status
    FROM email_jobs
    WHERE to_email = ?
      AND status != 'canceled'
    ORDER BY COALESCE(scheduled_at, created_at) DESC, id DESC
    LIMIT 1
  `).get(recipient) as { id: number; resendEmailId: string | null; status: string } | undefined

  if (byRecipientActive) {
    return { job: byRecipientActive, method: 'recipient_active_latest' }
  }

  return null
}

function normalizeResendTimestamp(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function mapEmailEventToLocalStatus(lastEvent: string): string {
  switch (lastEvent) {
    case 'bounced':
    case 'canceled':
    case 'clicked':
    case 'complained':
    case 'delivered':
    case 'delivery_delayed':
    case 'failed':
    case 'opened':
    case 'queued':
    case 'scheduled':
    case 'sent':
      return lastEvent
    default:
      return 'scheduled'
  }
}

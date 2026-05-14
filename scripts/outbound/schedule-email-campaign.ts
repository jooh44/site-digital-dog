import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { Resend } from 'resend'
import { buildScheduleTimestamps } from '../../lib/outbound/emailCampaign.ts'
import {
  getEmailCampaign,
  listEmailJobsForCampaign,
  markEmailJobFailed,
  markEmailJobScheduled,
  openLeadEngineDatabase,
  updateEmailCampaignStatus,
} from '../../lib/outbound/leadEngineStore.ts'

const { values } = parseArgs({
  options: {
    dryRun: { type: 'boolean' },
    emailCampaignId: { type: 'string' },
    limit: { type: 'string' },
    startAt: { type: 'string' },
  },
})

const emailCampaignId = values.emailCampaignId ?? 'camp-advocacia-trabalhista-curitiba-email-01'
const dryRun = values.dryRun ?? false
const limit = values.limit ? Number.parseInt(values.limit, 10) : undefined
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')

void main()

async function main() {
  const db = openLeadEngineDatabase()

  mkdirSync(outputDirectory, { recursive: true })

  try {
    const campaign = getEmailCampaign(db, emailCampaignId)

    if (!campaign) {
      throw new Error(`Email campaign ${emailCampaignId} was not found in SQLite.`)
    }

    const pendingJobs = listEmailJobsForCampaign(db, emailCampaignId, ['draft', 'failed'])
    const selectedJobs = limit && limit > 0 ? pendingJobs.slice(0, limit) : pendingJobs

    if (selectedJobs.length === 0) {
      console.log(JSON.stringify({
        dryRun,
        emailCampaignId,
        pendingJobs: 0,
        status: 'nothing_to_schedule',
      }, null, 2))
    } else {
      const startAt = values.startAt ?? campaign.plannedStartAt ?? new Date(Date.now() + 10 * 60_000).toISOString()
      if (values.startAt) {
        db.prepare(`
          UPDATE email_campaigns
          SET planned_start_at = ?,
              updated_at = ?
          WHERE id = ?
        `).run(startAt, new Date().toISOString(), emailCampaignId)
      }
      const scheduledAtList = buildScheduleTimestamps(startAt, campaign.cadenceMinutes, selectedJobs.length)
      const planPath = join(outputDirectory, `${emailCampaignId}-schedule-plan.json`)

      writeFileSync(planPath, `${JSON.stringify({
        dryRun,
        emailCampaignId,
        generatedAt: new Date().toISOString(),
        jobs: selectedJobs.map((job, index) => ({
          jobId: job.id,
          scheduledAt: scheduledAtList[index],
          subject: job.subject,
          toEmail: job.toEmail,
        })),
        startAt,
      }, null, 2)}\n`)

      if (dryRun) {
        console.log(JSON.stringify({
          dryRun,
          emailCampaignId,
          planPath,
          scheduledJobs: selectedJobs.length,
          startAt,
        }, null, 2))
      } else {
        if (!process.env.RESEND_API_KEY) {
          throw new Error('RESEND_API_KEY is required to schedule emails.')
        }

        const resend = new Resend(process.env.RESEND_API_KEY)
        const failures: Array<{ error: string; jobId: number; toEmail: string }> = []

        for (let index = 0; index < selectedJobs.length; index += 1) {
          const job = selectedJobs[index]
          const scheduledAt = scheduledAtList[index]
          const idempotencyKey = `digital-dog:${emailCampaignId}:job:${job.id}:${scheduledAt}`

          try {
            const { data, error } = await resend.emails.send({
              from: campaign.fromEmail,
              to: job.toEmail,
              replyTo: campaign.replyToEmail ? [campaign.replyToEmail] : undefined,
              subject: job.subject,
              html: job.htmlBody,
              text: job.textBody ?? undefined,
              scheduledAt,
            }, {
              idempotencyKey,
            })

            if (error || !data?.id) {
              throw new Error(error?.message ?? 'Resend did not return an email id.')
            }

            markEmailJobScheduled(db, job.id, scheduledAt, data.id, idempotencyKey, new Date().toISOString())
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown Resend scheduling error.'
            markEmailJobFailed(db, job.id, message, new Date().toISOString())
            failures.push({
              error: message,
              jobId: job.id,
              toEmail: job.toEmail,
            })
          }
        }

        updateEmailCampaignStatus(
          db,
          emailCampaignId,
          failures.length === 0 ? 'scheduled' : 'needs_attention',
          new Date().toISOString()
        )

        console.log(JSON.stringify({
          emailCampaignId,
          failures,
          planPath,
          scheduledJobs: selectedJobs.length - failures.length,
          startAt,
        }, null, 2))
      }
    }
  } finally {
    db.close()
  }
}

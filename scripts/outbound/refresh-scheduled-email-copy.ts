import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { Resend } from 'resend'
import { buildEmailDraft } from '../../lib/outbound/emailCampaign.ts'
import {
  getEmailCampaign,
  listEmailJobsForCampaign,
  listShortlistRowsByOrganizationIds,
  markEmailJobFailed,
  markEmailJobScheduled,
  openLeadEngineDatabase,
  updateEmailCampaignStatus,
} from '../../lib/outbound/leadEngineStore.ts'
import type { EmailCampaignManifest, FollowupEmailCampaignManifest } from '../../lib/outbound/types.ts'

const { values } = parseArgs({
  options: {
    emailCampaignId: { type: 'string' },
    manifest: { type: 'string' },
  },
})

const emailCampaignId = values.emailCampaignId ?? 'camp-advocacia-trabalhista-curitiba-email-01'
const manifestPath = values.manifest ?? './scripts/outbound/input/camp-advocacia-trabalhista-curitiba-email-campaign.json'

void main()

async function main() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required to refresh scheduled email copy.')
  }

  const db = openLeadEngineDatabase()
  const resend = new Resend(process.env.RESEND_API_KEY)
  const nowIso = new Date().toISOString()

  try {
    const campaign = getEmailCampaign(db, emailCampaignId)

    if (!campaign) {
      throw new Error(`Email campaign ${emailCampaignId} was not found in SQLite.`)
    }

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as EmailCampaignManifest | FollowupEmailCampaignManifest
    const jobs = listEmailJobsForCampaign(db, emailCampaignId)
      .filter((job) => job.status === 'scheduled' && Boolean(job.resendEmailId) && Boolean(job.scheduledAt))

    if (jobs.length === 0) {
      console.log(JSON.stringify({
        emailCampaignId,
        refreshedJobs: 0,
        status: 'nothing_to_refresh',
      }, null, 2))
      return
    }

    const leads = listShortlistRowsByOrganizationIds(db, jobs.map((job) => job.organizationId))
    const leadByOrganizationId = new Map(leads.map((lead) => [lead.id, lead]))
    const failures: Array<{ error: string; jobId: number; step: 'cancel' | 'reschedule' }> = []
    let refreshedJobs = 0

    for (const job of jobs) {
      const lead = leadByOrganizationId.get(job.organizationId)

      if (!lead) {
        failures.push({
          error: `Lead not found for organization ${job.organizationId}.`,
          jobId: job.id,
          step: 'reschedule',
        })
        continue
      }

      try {
        await resend.emails.cancel(job.resendEmailId!)
      } catch (error) {
        failures.push({
          error: error instanceof Error ? error.message : 'Unknown cancel error.',
          jobId: job.id,
          step: 'cancel',
        })
        continue
      }

      const nextDraft = buildEmailDraft(manifest, lead)
      const nextScheduledAt = job.scheduledAt!
      const nextIdempotencyKey = `digital-dog:${emailCampaignId}:job:${job.id}:${nextScheduledAt}:refresh:${Date.now()}`

      db.prepare(`
        UPDATE email_jobs
        SET subject = ?,
            html_body = ?,
            text_body = ?,
            personalization_json = ?,
            resend_email_id = NULL,
            resend_idempotency_key = NULL,
            status = 'draft',
            error_message = NULL,
            updated_at = ?
        WHERE id = ?
      `).run(
        nextDraft.subject,
        nextDraft.htmlBody,
        nextDraft.textBody,
        nextDraft.personalizationJson,
        nowIso,
        job.id
      )

      try {
        const { data, error } = await resend.emails.send({
          from: campaign.fromEmail,
          to: job.toEmail,
          replyTo: campaign.replyToEmail ? [campaign.replyToEmail] : undefined,
          subject: nextDraft.subject,
          html: nextDraft.htmlBody,
          text: nextDraft.textBody,
          scheduledAt: nextScheduledAt,
        }, {
          idempotencyKey: nextIdempotencyKey,
        })

        if (error || !data?.id) {
          throw new Error(error?.message ?? 'Resend did not return an email id during refresh.')
        }

        markEmailJobScheduled(db, job.id, nextScheduledAt, data.id, nextIdempotencyKey, new Date().toISOString())
        refreshedJobs += 1
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown resend refresh error.'
        markEmailJobFailed(db, job.id, message, new Date().toISOString())
        failures.push({
          error: message,
          jobId: job.id,
          step: 'reschedule',
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
      manifestPath,
      refreshedJobs,
      totalScheduledJobs: jobs.length,
    }, null, 2))
  } finally {
    db.close()
  }
}

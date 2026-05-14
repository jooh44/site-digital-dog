import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { buildEmailDraft } from '../../lib/outbound/emailCampaign.ts'
import {
  listFollowupEligibleEmailJobs,
  listShortlistRowsByOrganizationIds,
  openLeadEngineDatabase,
  upsertEmailCampaign,
  upsertEmailJob,
} from '../../lib/outbound/leadEngineStore.ts'
import type { FollowupEmailCampaignManifest } from '../../lib/outbound/types.ts'

const { values } = parseArgs({
  options: {
    input: { type: 'string' },
  },
})

const inputPath = resolve(
  values.input ?? join(process.cwd(), 'scripts', 'outbound', 'input', 'camp-advocacia-trabalhista-curitiba-email-followup-01.json')
)
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')
const manifest = JSON.parse(readFileSync(inputPath, 'utf8')) as FollowupEmailCampaignManifest
const db = openLeadEngineDatabase()

mkdirSync(outputDirectory, { recursive: true })

try {
  const now = new Date()
  const thresholdIso = new Date(now.valueOf() - manifest.minimumHoursAfterPreviousEmail * 60 * 60 * 1000).toISOString()
  const baseJobs = listFollowupEligibleEmailJobs(db, manifest.baseEmailCampaignId, thresholdIso, manifest.limit ?? 50)
  const leads = listShortlistRowsByOrganizationIds(db, baseJobs.map((job) => job.organizationId))
  const leadsByOrganizationId = new Map(leads.map((lead) => [lead.id, lead]))
  const preparedAt = new Date().toISOString()

  upsertEmailCampaign(db, {
    id: manifest.emailCampaignId,
    leadCampaignId: manifest.leadCampaignId,
    name: manifest.name,
    fromEmail: manifest.fromEmail,
    replyToEmail: manifest.replyToEmail,
    timezone: manifest.timezone,
    cadenceMinutes: manifest.cadenceMinutes,
    plannedStartAt: manifest.plannedStartAt,
    notes: manifest.notes,
    status: 'draft',
  }, preparedAt)

  const draftJobs = []

  for (const baseJob of baseJobs) {
    const lead = leadsByOrganizationId.get(baseJob.organizationId)

    if (!lead?.primaryEmail) {
      continue
    }

    const draft = buildEmailDraft(manifest, lead)
    const jobId = upsertEmailJob(db, {
      emailCampaignId: manifest.emailCampaignId,
      organizationId: lead.id,
      sequenceStep: baseJob.sequenceStep + 1,
      sourceJobId: baseJob.id,
      toEmail: lead.primaryEmail,
      subject: draft.subject,
      htmlBody: draft.htmlBody,
      textBody: draft.textBody,
      personalizationJson: draft.personalizationJson,
      status: 'draft',
    }, preparedAt)

    draftJobs.push({
      id: jobId,
      officeName: lead.officeName ?? lead.canonicalName,
      organizationId: lead.id,
      primaryEmail: lead.primaryEmail,
      sequenceStep: baseJob.sequenceStep + 1,
      sourceJobId: baseJob.id,
      subject: draft.subject,
    })
  }

  const jsonPath = join(outputDirectory, `${manifest.emailCampaignId}-email-review.json`)
  writeFileSync(jsonPath, `${JSON.stringify({
    baseEmailCampaignId: manifest.baseEmailCampaignId,
    emailCampaignId: manifest.emailCampaignId,
    generatedAt: preparedAt,
    inputPath,
    preparedJobs: draftJobs.length,
    thresholdIso,
    draftJobs,
  }, null, 2)}\n`)

  console.log(JSON.stringify({
    emailCampaignId: manifest.emailCampaignId,
    inputPath,
    jsonPath,
    preparedJobs: draftJobs.length,
    thresholdIso,
  }, null, 2))
} finally {
  db.close()
}

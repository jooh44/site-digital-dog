import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { buildEmailDraft } from '../../lib/outbound/emailCampaign.ts'
import {
  listEmailEligibleTargetsForCampaign,
  openLeadEngineDatabase,
  upsertEmailCampaign,
  upsertEmailJob,
} from '../../lib/outbound/leadEngineStore.ts'
import type { EmailCampaignManifest, ShortlistRow } from '../../lib/outbound/types.ts'

const { values } = parseArgs({
  options: {
    input: { type: 'string' },
  },
})

const inputPath = resolve(
  values.input ?? join(process.cwd(), 'scripts', 'outbound', 'input', 'camp-advocacia-trabalhista-curitiba-email-campaign.json')
)
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')
const manifest = JSON.parse(readFileSync(inputPath, 'utf8')) as EmailCampaignManifest
const nowIso = new Date().toISOString()
const db = openLeadEngineDatabase()

mkdirSync(outputDirectory, { recursive: true })

try {
  const eligibleLeads = listEmailEligibleTargetsForCampaign(
    db,
    manifest.leadCampaignId,
    500,
    manifest.excludePreviouslyContacted ?? true
  )
  const selectedLeads = selectLeads(manifest, eligibleLeads)
  const minBatchSize = manifest.minBatchSize ?? 1

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
    status: selectedLeads.length >= minBatchSize ? 'draft' : 'waiting_for_batch',
  }, nowIso)

  if (selectedLeads.length < minBatchSize) {
    const jsonPath = join(outputDirectory, `${manifest.emailCampaignId}-email-review.json`)
    writeFileSync(jsonPath, `${JSON.stringify({
      generatedAt: nowIso,
      inputPath,
      leadCampaignId: manifest.leadCampaignId,
      emailCampaignId: manifest.emailCampaignId,
      excludePreviouslyContacted: manifest.excludePreviouslyContacted ?? true,
      eligibleCount: selectedLeads.length,
      minBatchSize,
      status: 'waiting_for_batch',
    }, null, 2)}\n`)

    console.log(JSON.stringify({
      emailCampaignId: manifest.emailCampaignId,
      eligibleCount: selectedLeads.length,
      minBatchSize,
      status: 'waiting_for_batch',
    }, null, 2))
    process.exit(0)
  }

  const draftJobs = selectedLeads.map((lead) => {
    const draft = buildEmailDraft(manifest, lead)
    const jobId = upsertEmailJob(db, {
      emailCampaignId: manifest.emailCampaignId,
      organizationId: lead.id,
      toEmail: lead.primaryEmail!,
      subject: draft.subject,
      htmlBody: draft.htmlBody,
      textBody: draft.textBody,
      personalizationJson: draft.personalizationJson,
      status: 'draft',
    }, nowIso)

    return {
      id: jobId,
      city: lead.city,
      officeName: lead.officeName ?? lead.canonicalName,
      organizationId: lead.id,
      primaryEmail: lead.primaryEmail,
      subject: draft.subject,
      websiteDomain: lead.websiteDomain,
    }
  })

  const jsonPath = join(outputDirectory, `${manifest.emailCampaignId}-email-review.json`)
  const csvPath = join(outputDirectory, `${manifest.emailCampaignId}-email-review.csv`)

  writeFileSync(jsonPath, `${JSON.stringify({
    generatedAt: nowIso,
    inputPath,
    leadCampaignId: manifest.leadCampaignId,
    emailCampaignId: manifest.emailCampaignId,
    excludePreviouslyContacted: manifest.excludePreviouslyContacted ?? true,
    minBatchSize,
    selectedCount: draftJobs.length,
    draftJobs,
  }, null, 2)}\n`)
  writeFileSync(csvPath, `${toCsv(draftJobs)}\n`)

  console.log(JSON.stringify({
    csvPath,
    emailCampaignId: manifest.emailCampaignId,
    inputPath,
    jsonPath,
    preparedJobs: draftJobs.length,
  }, null, 2))
} finally {
  db.close()
}

function selectLeads(manifest: EmailCampaignManifest, leads: ShortlistRow[]): ShortlistRow[] {
  const organizationIds = new Set(manifest.organizationIds ?? [])
  const externalIds = new Set(manifest.externalIds ?? [])

  const filteredLeads = leads.filter((lead) => {
    const organizationMatch = organizationIds.size === 0 || organizationIds.has(lead.id)
    const externalMatch = externalIds.size === 0 || externalIds.has(lead.externalId)
    return organizationMatch && externalMatch
  })

  if (manifest.limit && manifest.limit > 0) {
    return filteredLeads.slice(0, manifest.limit)
  }

  return filteredLeads
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) {
    return ''
  }

  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]

  for (const row of rows) {
    lines.push(headers.map((header) => csvCell(row[header])).join(','))
  }

  return lines.join('\n')
}

function csvCell(value: unknown): string {
  const raw = value === null || value === undefined ? '' : String(value)
  const escaped = raw.replace(/"/g, '""')
  return `"${escaped}"`
}

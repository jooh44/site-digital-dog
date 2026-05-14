import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { Resend } from 'resend'
import { buildEmailDraft, resolveLeadOfficeName } from '../../lib/outbound/emailCampaign.ts'
import { isLikelyOfficialWebsiteUrl, validateEmailDomain } from '../../lib/outbound/domainQuality.ts'
import {
  listEmailEligibleTargetsForCampaign,
  listEmailJobsForCampaign,
  listShortlistRowsByOrganizationIds,
  markOrganizationEmailInvalid,
  markOrganizationEmailValidated,
  markEmailJobCanceled,
  markEmailJobFailed,
  markEmailJobScheduled,
  openLeadEngineDatabase,
  upsertEmailCampaign,
  upsertEmailJob,
  updateEmailCampaignStatus,
} from '../../lib/outbound/leadEngineStore.ts'
import type { EmailCampaignManifest, ShortlistRow } from '../../lib/outbound/types.ts'

const DEFAULT_SLOT_HOURS = ['08:40', '09:30', '10:20', '11:10', '12:00', '13:40', '14:30', '15:20', '16:10', '17:00'] as const
const SAO_PAULO_OFFSET_MINUTES = -180
const SAO_PAULO_OFFSET_SUFFIX = '-03:00'
const DEFAULT_MANIFESTS = [
  'scripts/outbound/input/camp-advocacia-multicidades-email-campaign-01.json',
  'scripts/outbound/input/camp-advocacia-trabalhista-curitiba-email-campaign-02.json',
  'scripts/outbound/input/camp-advocacia-sao-paulo-email-campaign-01.json',
] as const

const { values } = parseArgs({
  options: {
    dryRun: { type: 'boolean' },
    manifests: { type: 'string' },
    output: { type: 'string' },
    slotCapacity: { type: 'string' },
    slotHours: { type: 'string' },
    slots: { type: 'string' },
    now: { type: 'boolean' },
  },
})

const dryRun = values.dryRun ?? false
const slotHours = parseSlotHours(values.slotHours)
const slotCount = values.slots ? Number.parseInt(values.slots, 10) : slotHours.length
const slotCapacity = values.slotCapacity ? Number.parseInt(values.slotCapacity, 10) : 10
const scheduleNow = values.now ?? false
const manifestPaths = (values.manifests?.split(',').map((value) => value.trim()).filter(Boolean) ?? [...DEFAULT_MANIFESTS])
  .map((value) => resolve(process.cwd(), value))
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')
const outputPath = values.output
  ? resolve(process.cwd(), values.output)
  : join(outputDirectory, 'slot-scheduler-summary.json')

void main()

async function main() {
  mkdirSync(outputDirectory, { recursive: true })

  if (!dryRun && !process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required to schedule slots.')
  }

  const db = openLeadEngineDatabase()
  const resend = dryRun ? null : new Resend(process.env.RESEND_API_KEY!)
  const startedAt = new Date()
  const nowIso = startedAt.toISOString()

  try {
    const baseManifests = manifestPaths.map(loadManifest)
    const sanitizationSummary = dryRun
      ? { canceledJobs: 0, refreshedJobs: 0, skippedJobs: 0 }
      : await sanitizeScheduledJobs(db, resend!, baseManifests, nowIso)
    const occupancy = getSlotOccupancy(db, startedAt)
    const maxPerSlot = slotCapacity
    const upcomingSlots = buildUpcomingSlots(startedAt, slotCount, slotHours)
      .filter((slot) => (occupancy.get(formatSlotKey(slot)) || 0) < maxPerSlot)
    
    if (scheduleNow) {
      upcomingSlots.unshift(new Date(startedAt.getTime() + 2 * 60_000))
    }
    
    const allocations: Array<Record<string, unknown>> = []

    for (const slotDate of upcomingSlots) {
      const currentCount = occupancy.get(formatSlotKey(slotDate)) || 0
      const remainingCapacity = maxPerSlot - currentCount

      const best = pickBestManifestForSlot(db, baseManifests, remainingCapacity)

      if (!best) {
        allocations.push({
          reason: 'no_batch_ready',
          slot: buildSaoPauloSlotString(slotDate),
        })
        continue
      }

      const slotManifest = buildSlotManifest(best.manifest, slotDate)
      const { jobs, skippedInvalidEmails, validatedEmails } = await buildDraftJobs(db, slotManifest, best.leads, nowIso, { dryRun })

      if (dryRun) {
        allocations.push({
          dryRun: true,
          emailCampaignId: slotManifest.emailCampaignId,
          leadCampaignId: slotManifest.leadCampaignId,
          preparedJobs: jobs.length,
          skippedInvalidEmails,
          validatedEmails,
          slot: buildSaoPauloSlotString(slotDate),
        })
        continue
      }

      const failures: Array<{ error: string; jobId: number; toEmail: string }> = []

      for (let index = 0; index < jobs.length; index += 1) {
        const job = jobs[index]
        const scheduledAt = new Date(slotDate.getTime() + (currentCount + index) * (slotManifest.cadenceMinutes ?? 10) * 60_000).toISOString()
        const idempotencyKey = `digital-dog:${slotManifest.emailCampaignId}:job:${job.id}:${scheduledAt}`

        try {
          const { data, error } = await sendWithRetry(resend!, {
            from: slotManifest.fromEmail,
            html: job.htmlBody,
            idempotencyKey,
            replyTo: slotManifest.replyToEmail ? [slotManifest.replyToEmail] : undefined,
            scheduledAt,
            subject: job.subject,
            text: job.textBody ?? undefined,
            to: job.toEmail,
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

        await sleep(350)
      }

      updateEmailCampaignStatus(
        db,
        slotManifest.emailCampaignId,
        failures.length === 0 ? 'scheduled' : 'needs_attention',
        new Date().toISOString()
      )

      allocations.push({
        emailCampaignId: slotManifest.emailCampaignId,
        failures,
        leadCampaignId: slotManifest.leadCampaignId,
        scheduledJobs: jobs.length - failures.length,
        skippedInvalidEmails,
        validatedEmails,
        slot: buildSaoPauloSlotString(slotDate),
      })

      occupancy.set(formatSlotKey(slotDate), currentCount + jobs.length - failures.length)
    }

    const summary = {
      startedAt: nowIso,
      finishedAt: new Date().toISOString(),
      dryRun,
      manifestPaths,
      sanitizationSummary,
      requestedSlots: slotCount,
      slotCapacity,
      slotHours,
      scheduledSlots: allocations.filter((entry) => typeof entry.emailCampaignId === 'string').length,
      allocations,
    }

    writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`)
    console.log(JSON.stringify(summary, null, 2))
  } finally {
    db.close()
  }
}

async function sendWithRetry(
  resend: Resend,
  input: {
    from: string
    html: string
    idempotencyKey: string
    replyTo?: string[]
    scheduledAt: string
    subject: string
    text?: string
    to: string
  }
) {
  const request = {
    from: input.from,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    html: input.html,
    text: input.text,
    scheduledAt: input.scheduledAt,
  }

  const first = await resend.emails.send(request, { idempotencyKey: input.idempotencyKey })

  if (!first.error || !/too many requests/i.test(first.error.message ?? '')) {
    return first
  }

  await sleep(1500)
  return resend.emails.send(request, { idempotencyKey: input.idempotencyKey })
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function loadManifest(path: string): EmailCampaignManifest {
  return JSON.parse(readFileSync(path, 'utf8')) as EmailCampaignManifest
}

function buildUpcomingSlots(now: Date, count: number, hours: string[]) {
  const slots: Date[] = []
  const startDay = getSaoPauloDayAnchor(now)
  let dayOffset = 0

  while (slots.length < count) {
    for (const slot of hours) {
      const [hour, minute] = slot.split(':').map((value) => Number.parseInt(value, 10))
      const candidate = new Date(buildSaoPauloIso(startDay, dayOffset, hour, minute))

      if (candidate.getTime() <= now.getTime() + 60_000) {
        continue
      }

      slots.push(candidate)

      if (slots.length >= count) {
        break
      }
    }

    dayOffset += 1
  }

  return slots
}

function parseSlotHours(value: string | undefined) {
  const hours = value
    ? value.split(',').map((item) => item.trim()).filter(Boolean)
    : [...DEFAULT_SLOT_HOURS]

  for (const hour of hours) {
    if (!/^\d{2}:\d{2}$/.test(hour)) {
      throw new Error(`Invalid slot hour "${hour}". Use HH:mm, comma-separated.`)
    }
  }

  return hours
}

function formatSlotKey(date: Date) {
  const parts = getSaoPauloParts(date)
  const year = parts.year
  const month = String(parts.month).padStart(2, '0')
  const day = String(parts.day).padStart(2, '0')
  const hours = String(parts.hour).padStart(2, '0')
  const minutes = String(parts.minute).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function buildSlotManifest(manifest: EmailCampaignManifest, slotDate: Date): EmailCampaignManifest {
  const parts = getSaoPauloParts(slotDate)
  const year = parts.year
  const month = String(parts.month).padStart(2, '0')
  const day = String(parts.day).padStart(2, '0')
  const hours = String(parts.hour).padStart(2, '0')
  const minutes = String(parts.minute).padStart(2, '0')
  const slotSuffix = `${year}${month}${day}-${hours}${minutes}`
  const slotLabel = `${day}/${month} ${hours}:${minutes}`

  return {
    ...manifest,
    emailCampaignId: `${manifest.emailCampaignId}-slot-${slotSuffix}`,
    name: `${manifest.name} • ${slotLabel}`,
    plannedStartAt: buildSaoPauloSlotString(slotDate),
  }
}

function pickBestManifestForSlot(
  db: ReturnType<typeof openLeadEngineDatabase>,
  manifests: EmailCampaignManifest[],
  capacity: number
): { leads: ShortlistRow[]; manifest: EmailCampaignManifest } | null {
  let best: { leads: ShortlistRow[]; manifest: EmailCampaignManifest } | null = null

  for (const manifest of manifests) {
    const eligible = listEmailEligibleTargetsForCampaign(
      db,
      manifest.leadCampaignId,
      100,
      manifest.excludePreviouslyContacted ?? true
    )
    const selected = selectLeads(manifest, eligible).filter(isAutonomousEmailEligible)
    const batchSize = Math.min(manifest.limit ?? capacity, capacity)
    const candidates = selected.slice(0, batchSize)

    if (candidates.length === 0) {
      continue
    }

    if (!best || candidates.length > best.leads.length) {
      best = {
        leads: candidates,
        manifest,
      }
    }
  }

  return best
}

async function buildDraftJobs(
  db: ReturnType<typeof openLeadEngineDatabase>,
  manifest: EmailCampaignManifest,
  leads: ShortlistRow[],
  nowIso: string,
  options: { dryRun?: boolean } = {}
) {
  if (!options.dryRun) {
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
    }, nowIso)
  }

  const jobs: Array<{
    htmlBody: string
    id: number
    subject: string
    textBody: string | undefined
    toEmail: string
  }> = []
  let skippedInvalidEmails = 0
  let validatedEmails = 0

  for (const lead of leads) {
    const validation = await validateEmailDomain(lead.primaryEmail)

    if (!validation.valid) {
      skippedInvalidEmails += 1
      if (!options.dryRun) {
        markOrganizationEmailInvalid(
          db,
          lead.id,
          validation.reason ?? 'email_domain_invalid',
          new Date().toISOString()
        )
      }
      continue
    }

    validatedEmails += 1
    if (!options.dryRun) {
      markOrganizationEmailValidated(db, lead.id, new Date().toISOString())
    }

    const draft = buildEmailDraft(manifest, lead)
    const jobId = options.dryRun
      ? -(jobs.length + 1)
      : upsertEmailJob(db, {
          emailCampaignId: manifest.emailCampaignId,
          organizationId: lead.id,
          toEmail: lead.primaryEmail!,
          subject: draft.subject,
          htmlBody: draft.htmlBody,
          textBody: draft.textBody,
          personalizationJson: draft.personalizationJson,
          status: 'draft',
        }, nowIso)

    jobs.push({
      htmlBody: draft.htmlBody,
      id: jobId,
      subject: draft.subject,
      textBody: draft.textBody,
      toEmail: lead.primaryEmail!,
    })
  }

  return {
    jobs,
    skippedInvalidEmails,
    validatedEmails,
  }
}

function selectLeads(manifest: EmailCampaignManifest, leads: ShortlistRow[]): ShortlistRow[] {
  const organizationIds = new Set(manifest.organizationIds ?? [])
  const externalIds = new Set(manifest.externalIds ?? [])

  const filtered = leads.filter((lead) => {
    const organizationMatch = organizationIds.size === 0 || organizationIds.has(lead.id)
    const externalMatch = externalIds.size === 0 || externalIds.has(lead.externalId)
    return organizationMatch && externalMatch
  })

  if (manifest.limit && manifest.limit > 0) {
    return filtered.slice(0, manifest.limit)
  }

  return filtered
}

function isAutonomousEmailEligible(lead: ShortlistRow) {
  if (!lead.primaryEmail) {
    return false
  }

  if (!resolveLeadOfficeName(lead)) {
    return false
  }

  if (lead.websiteUrl && !isLikelyOfficialWebsiteUrl(lead.websiteUrl)) {
    return false
  }

  if (lead.websiteUrl) {
    const emailDomain = getRegistrableDomain(`https://${lead.primaryEmail.split('@')[1] ?? ''}`)
    const websiteDomain = getRegistrableDomain(lead.websiteUrl)

    if (emailDomain && websiteDomain && emailDomain !== websiteDomain) {
      return false
    }
  }

  return true
}

async function sanitizeScheduledJobs(
  db: ReturnType<typeof openLeadEngineDatabase>,
  resend: Resend,
  manifests: EmailCampaignManifest[],
  nowIso: string
) {
  const leadCampaignIds = Array.from(new Set(manifests.map((manifest) => manifest.leadCampaignId).filter(Boolean)))

  if (leadCampaignIds.length === 0) {
    return { canceledJobs: 0, refreshedJobs: 0, skippedJobs: 0 }
  }

  const placeholders = leadCampaignIds.map(() => '?').join(', ')
  const scheduledJobs = db.prepare(`
    SELECT
      ej.id,
      ej.email_campaign_id AS emailCampaignId,
      ej.organization_id AS organizationId,
      ej.personalization_json AS personalizationJson,
      ej.resend_email_id AS resendEmailId,
      ej.scheduled_at AS scheduledAt,
      ej.subject,
      ej.text_body AS textBody,
      ej.to_email AS toEmail,
      ec.lead_campaign_id AS leadCampaignId
    FROM email_jobs ej
    INNER JOIN email_campaigns ec
      ON ec.id = ej.email_campaign_id
    WHERE ej.status = 'scheduled'
      AND ej.scheduled_at IS NOT NULL
      AND ej.scheduled_at > ?
      AND ec.lead_campaign_id IN (${placeholders})
    ORDER BY ej.scheduled_at ASC, ej.id ASC
  `).all(nowIso, ...leadCampaignIds) as Array<{
    emailCampaignId: string
    id: number
    leadCampaignId: string
    organizationId: string
    personalizationJson: string | null
    resendEmailId: string | null
    scheduledAt: string
    subject: string
    textBody: string | null
    toEmail: string
  }>

  if (scheduledJobs.length === 0) {
    return { canceledJobs: 0, refreshedJobs: 0, skippedJobs: 0 }
  }

  const leadByOrganizationId = new Map(
    listShortlistRowsByOrganizationIds(db, scheduledJobs.map((job) => job.organizationId))
      .map((lead) => [lead.id, lead])
  )
  const manifestByLeadCampaignId = new Map(manifests.map((manifest) => [manifest.leadCampaignId, manifest]))

  let canceledJobs = 0
  let refreshedJobs = 0
  let skippedJobs = 0

  for (const job of scheduledJobs) {
    const lead = leadByOrganizationId.get(job.organizationId)
    const manifest = manifestByLeadCampaignId.get(job.leadCampaignId)

    if (!lead || !manifest) {
      skippedJobs += 1
      continue
    }

    const trustedOfficeName = resolveLeadOfficeName(lead)

    if (!trustedOfficeName) {
      await cancelScheduledJob(db, resend, job, nowIso, 'sanitized: unresolved office name for outbound copy')
      canceledJobs += 1
      continue
    }

    const storedOfficeName = extractStoredOfficeName(job.personalizationJson)
    if (storedOfficeName === trustedOfficeName) {
      continue
    }

    try {
      if (job.resendEmailId) {
        await resend.emails.cancel(job.resendEmailId)
      }
    } catch (error) {
      skippedJobs += 1
      continue
    }

    const refreshedManifest = {
      ...manifest,
      emailCampaignId: job.emailCampaignId,
    }
    const nextDraft = buildEmailDraft(refreshedManifest, lead)
    const nextIdempotencyKey = `digital-dog:${job.emailCampaignId}:job:${job.id}:${job.scheduledAt}:sanitize`

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
        from: refreshedManifest.fromEmail,
        to: job.toEmail,
        replyTo: refreshedManifest.replyToEmail ? [refreshedManifest.replyToEmail] : undefined,
        subject: nextDraft.subject,
        html: nextDraft.htmlBody,
        text: nextDraft.textBody,
        scheduledAt: job.scheduledAt,
      }, {
        idempotencyKey: nextIdempotencyKey,
      })

      if (error || !data?.id) {
        throw new Error(error?.message ?? 'Resend did not return an email id during sanitization.')
      }

      markEmailJobScheduled(db, job.id, job.scheduledAt, data.id, nextIdempotencyKey, new Date().toISOString())
      refreshedJobs += 1
    } catch (error) {
      markEmailJobCanceled(
        db,
        job.id,
        new Date().toISOString(),
        error instanceof Error ? error.message : 'Sanitization reschedule failed.'
      )
      canceledJobs += 1
    }
  }

  return { canceledJobs, refreshedJobs, skippedJobs }
}

async function cancelScheduledJob(
  db: ReturnType<typeof openLeadEngineDatabase>,
  resend: Resend,
  job: {
    id: number
    resendEmailId: string | null
  },
  nowIso: string,
  reason: string
) {
  try {
    if (job.resendEmailId) {
      await resend.emails.cancel(job.resendEmailId)
    }
  } catch {}

  markEmailJobCanceled(db, job.id, nowIso, reason)
}

function extractStoredOfficeName(value: string | null) {
  if (!value) {
    return ''
  }

  try {
    const parsed = JSON.parse(value) as { officeName?: string | null }
    return parsed.officeName?.trim() ?? ''
  } catch {
    return ''
  }
}

function getSlotOccupancy(
  db: ReturnType<typeof openLeadEngineDatabase>,
  now: Date
) {
  const rows = db.prepare(`
    SELECT ec.planned_start_at AS plannedStartAt, COUNT(ej.id) as scheduledJobs
    FROM email_campaigns ec
    LEFT JOIN email_jobs ej ON ej.email_campaign_id = ec.id AND ej.status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained')
    WHERE ec.planned_start_at IS NOT NULL
      AND ec.planned_start_at > ?
      AND ec.status IN ('draft', 'scheduled', 'waiting_for_batch', 'needs_attention')
    GROUP BY ec.planned_start_at
  `).all(now.toISOString()) as Array<{ plannedStartAt: string; scheduledJobs: number }>

  const map = new Map<string, number>()
  for (const row of rows) {
    if (row.plannedStartAt) {
      map.set(formatSlotKey(new Date(row.plannedStartAt)), row.scheduledJobs)
    }
  }
  return map
}

function getSaoPauloDayAnchor(date: Date) {
  const shifted = new Date(date.getTime() + SAO_PAULO_OFFSET_MINUTES * 60_000)
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate(), 0, 0, 0))
}

function buildSaoPauloIso(anchor: Date, dayOffset: number, hour: number, minute: number) {
  const local = new Date(Date.UTC(
    anchor.getUTCFullYear(),
    anchor.getUTCMonth(),
    anchor.getUTCDate() + dayOffset,
    0,
    0,
    0
  ))
  const year = local.getUTCFullYear()
  const month = String(local.getUTCMonth() + 1).padStart(2, '0')
  const day = String(local.getUTCDate()).padStart(2, '0')
  const hours = String(hour).padStart(2, '0')
  const minutes = String(minute).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}:00${SAO_PAULO_OFFSET_SUFFIX}`
}

function getSaoPauloParts(date: Date) {
  const shifted = new Date(date.getTime() + SAO_PAULO_OFFSET_MINUTES * 60_000)
  return {
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    month: shifted.getUTCMonth() + 1,
    year: shifted.getUTCFullYear(),
  }
}

function buildSaoPauloSlotString(date: Date) {
  const parts = getSaoPauloParts(date)
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}T${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}:00${SAO_PAULO_OFFSET_SUFFIX}`
}

function getRegistrableDomain(value: string) {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./i, '').toLowerCase()
    const parts = hostname.split('.').filter(Boolean)

    if (parts.length < 2) {
      return hostname
    }

    const two = parts.slice(-2).join('.')
    const three = parts.slice(-3).join('.')
    const brSuffixes = ['com.br', 'adv.br', 'net.br', 'org.br', 'emp.br']

    if (brSuffixes.includes(two)) {
      return parts.slice(-3).join('.')
    }

    if (brSuffixes.includes(three)) {
      return parts.slice(-4).join('.')
    }

    return parts.slice(-2).join('.')
  } catch {
    return null
  }
}

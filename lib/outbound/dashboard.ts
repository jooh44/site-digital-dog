import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getWebsiteIssueLabel } from './domainQuality.ts'
import { openLeadEngineDatabase } from './leadEngineStore.ts'
import type { CodexUsageSummary } from './types.ts'

// ─── Funnel counts ───

type FunnelCounts = {
  /** Total orgs captured (excl. ignored_non_icp) */
  captured: number
  /** Have website_url */
  withSite: number
  /** Have primary_email */
  withEmail: number
  /** Emails ready but never sent (fresh pool) */
  freshEmails: number
  /** Email jobs currently scheduled in Resend */
  scheduled: number
  /** Email jobs sent/delivered/opened/clicked */
  dispatched: number
  /** Bounced or complained */
  failed: number
  /** Responded leads */
  responded: number
}

// ─── Today quota ───

type TodayQuota = {
  target: number
  sent: number
  scheduled: number
  slots: SlotInfo[]
}

type SlotInfo = {
  time: string
  sent: number
  scheduled: number
  failed: number
}

// ─── Workers ───

type WorkerStatus = {
  name: string
  healthy: boolean
  lastRunAt: string | null
  minutesSinceLastRun: number | null
  detail: string
}

// ─── Gemini enricher ───

type GeminiStats = {
  totalRuns: number
  emailsFound: number
  pending: number
  lastRunAt: string | null
  recentFinds: Array<{ orgName: string; email: string; foundAt: string }>
}

// ─── Pipeline bottlenecks ───

type PipelineBottlenecks = {
  noSite: number
  siteNoEmail: number
  suspectSite: number
  needsManualReview: number
  outsideIcp: number
}

// ─── Campaign ───

type CampaignRow = {
  cadenceMinutes: number
  id: string
  leadCampaignId: string
  name: string
  plannedStartAt: string | null
  scheduledJobs: number
  sentSignals: number
  status: string
}

type ResponseRow = {
  emailCampaignId: string | null
  fromEmail: string
  officeName: string | null
  receivedAt: string
  subject: string | null
  toEmail: string
}

type LeadRow = {
  canonicalName: string
  city: string | null
  emailStatus: string | null
  id: string
  instagramUrl: string | null
  latestEmailCampaignName: string | null
  latestEmailScheduledAt: string | null
  latestEmailSubject: string | null
  latestResponseAt: string | null
  officeName: string | null
  primaryEmail: string | null
  primaryPhone: string | null
  primaryWhatsapp: string | null
  responded: number
  sourceConfidence: number
  status: string
  websiteDomain: string | null
  websiteUrl: string | null
}

type AutoCaptureCycleSnapshot = {
  cleanup: {
    clearedEmail: number
    clearedInstagram: number
    clearedWebsite: number
    downgraded: number
  }
  codexFallback: {
    matched: number
    misses: number
    model: string | null
    reason: string | null
    weeklyCredits: number
  }
  countsDelta: {
    manual: number
    raw: number
    ready: number
    withEmail: number
    withInstagram: number
  }
  directWebDiscovery: {
    addedOrUpdated: number
    candidates: number
    error: string | null
    reason: string | null
  }
  discovery: {
    addedOrganizations: number
    pauseDiscovery: boolean
    reason: string | null
  }
  durationSeconds: number | null
  finishedAt: string | null
  officialSite: {
    candidates: number
    enriched: number
    failures: number
    reason: string | null
  }
  startedAt: string | null
  webSearch: {
    candidates: number
    matched: number
    misses: number
    reason: string | null
  }
}

// ─── Full dashboard ───

export type LeadEngineDashboardData = {
  latestCycle: AutoCaptureCycleSnapshot | null
  funnel: FunnelCounts
  todayQuota: TodayQuota
  bottlenecks: PipelineBottlenecks
  workers: WorkerStatus[]
  gemini: GeminiStats
  codexUsage: {
    latestSession: CodexUsageSummary
    weekly: CodexUsageSummary
  }
  resendSync: {
    syncedAt: string | null
    resendEmailsSeen: number
    matchedEmails: number
    unmatchedEmails: number
  }
  campaigns: CampaignRow[]
  recentResponses: ResponseRow[]
  leadsReady: LeadRow[]
  recentLogs: string[]
}

// ─── Main ───

export function getLeadEngineDashboardData(): LeadEngineDashboardData {
  const db = openLeadEngineDatabase()

  try {
    // ── Funnel ──
    const funnelRaw = db.prepare(`
      SELECT
        SUM(CASE WHEN status != 'ignored_non_icp' THEN 1 ELSE 0 END) AS captured,
        SUM(CASE WHEN status != 'ignored_non_icp' AND website_url IS NOT NULL AND website_url != '' THEN 1 ELSE 0 END) AS withSite,
        SUM(CASE WHEN status != 'ignored_non_icp' AND primary_email IS NOT NULL AND primary_email != '' THEN 1 ELSE 0 END) AS withEmail,
        SUM(CASE WHEN status != 'ignored_non_icp' AND primary_email IS NOT NULL AND primary_email != '' AND NOT EXISTS (
          SELECT 1 FROM email_jobs ej WHERE ej.organization_id = o.id AND ej.status != 'canceled'
        ) THEN 1 ELSE 0 END) AS freshEmails,
        (SELECT COUNT(*) FROM email_jobs WHERE status = 'scheduled') AS scheduled,
        (SELECT COUNT(*) FROM email_jobs WHERE status IN ('sent', 'queued', 'delivery_delayed')) AS queued,
        (SELECT COUNT(*) FROM email_jobs WHERE status IN ('delivered', 'opened', 'clicked')) AS delivered,
        (SELECT COUNT(*) FROM email_jobs WHERE status IN ('bounced', 'complained', 'failed')) AS failed,
        (SELECT COUNT(DISTINCT organization_id) FROM email_responses) AS responded
      FROM organizations o
    `).get() as Record<string, number>

    const funnel: FunnelCounts & { delivered: number; queued: number } = {
      captured: Number(funnelRaw.captured ?? 0),
      withSite: Number(funnelRaw.withSite ?? 0),
      withEmail: Number(funnelRaw.withEmail ?? 0),
      freshEmails: Number(funnelRaw.freshEmails ?? 0),
      scheduled: Number(funnelRaw.scheduled ?? 0),
      dispatched: Number(funnelRaw.delivered ?? 0) + Number(funnelRaw.queued ?? 0),
      delivered: Number(funnelRaw.delivered ?? 0),
      queued: Number(funnelRaw.queued ?? 0),
      failed: Number(funnelRaw.failed ?? 0),
      responded: Number(funnelRaw.responded ?? 0),
    }

    // ── Today quota ──
    const todayStart = getTodayStartBRT()
    const todayEnd = getTodayEndBRT()

    const todaySent = db.prepare(`
      SELECT COUNT(*) AS c FROM email_jobs
      WHERE status IN ('sent', 'delivered', 'opened', 'clicked')
        AND scheduled_at >= ? AND scheduled_at < ?
    `).get(todayStart, todayEnd) as { c: number }

    const todayScheduled = db.prepare(`
      SELECT COUNT(*) AS c FROM email_jobs
      WHERE status = 'scheduled'
        AND scheduled_at >= ? AND scheduled_at < ?
    `).get(todayStart, todayEnd) as { c: number }

    const slotHours = ['09:00', '12:00', '14:00', '16:00']
    const now = new Date()
    const slots: SlotInfo[] = slotHours.map(hour => {
      const slotTime = buildBRTSlotIso(hour)
      const slotEnd = new Date(new Date(slotTime).getTime() + 2 * 60 * 60 * 1000).toISOString()

      const sentCount = db.prepare(`
        SELECT COUNT(*) AS c FROM email_jobs
        WHERE scheduled_at >= ? AND scheduled_at < ?
          AND status IN ('sent', 'delivered', 'opened', 'clicked')
      `).get(slotTime, slotEnd) as { c: number }

      const scheduledCount = db.prepare(`
        SELECT COUNT(*) AS c FROM email_jobs
        WHERE scheduled_at >= ? AND scheduled_at < ?
          AND status = 'scheduled'
      `).get(slotTime, slotEnd) as { c: number }

      const failedCount = db.prepare(`
        SELECT COUNT(*) AS c FROM email_jobs
        WHERE scheduled_at >= ? AND scheduled_at < ?
          AND status IN ('bounced', 'complained', 'failed')
      `).get(slotTime, slotEnd) as { c: number }

      return {
        time: hour,
        sent: Number(sentCount.c ?? 0),
        scheduled: Number(scheduledCount.c ?? 0),
        failed: Number(failedCount.c ?? 0),
      }
    })

    const todayQuota: TodayQuota = {
      target: 40,
      sent: Number(todaySent.c ?? 0),
      scheduled: Number(todayScheduled.c ?? 0),
      slots,
    }

    // ── Bottlenecks ──
    const bottleneckRaw = db.prepare(`
      SELECT
        SUM(CASE WHEN status != 'ignored_non_icp' AND (website_url IS NULL OR website_url = '') THEN 1 ELSE 0 END) AS noSite,
        SUM(CASE WHEN status != 'ignored_non_icp' AND website_url IS NOT NULL AND website_url != '' AND (primary_email IS NULL OR primary_email = '') THEN 1 ELSE 0 END) AS siteNoEmail,
        SUM(CASE WHEN status = 'needs_manual_review' THEN 1 ELSE 0 END) AS needsManualReview,
        SUM(CASE WHEN status = 'ignored_non_icp' THEN 1 ELSE 0 END) AS outsideIcp
      FROM organizations
    `).get() as Record<string, number>

    // For suspect sites, we need to check in JS
    const allLeadsForSuspect = db.prepare(`
      SELECT website_url AS websiteUrl FROM organizations WHERE status != 'ignored_non_icp' AND website_url IS NOT NULL AND website_url != ''
    `).all() as Array<{ websiteUrl: string }>
    const suspectSite = allLeadsForSuspect.filter(l => getWebsiteIssueLabel(l.websiteUrl) === 'site_suspeito').length

    const bottlenecks: PipelineBottlenecks = {
      noSite: Number(bottleneckRaw.noSite ?? 0),
      siteNoEmail: Number(bottleneckRaw.siteNoEmail ?? 0),
      suspectSite,
      needsManualReview: Number(bottleneckRaw.needsManualReview ?? 0),
      outsideIcp: Number(bottleneckRaw.outsideIcp ?? 0),
    }

    // ── Workers ──
    const workers: WorkerStatus[] = []

    // Auto-capture worker — uses heartbeat file
    let captureLastAt: string | null = null
    try {
      const hbPath = join(process.cwd(), 'scripts', 'outbound', 'output', 'auto-capture-heartbeat.json')
      const hb = JSON.parse(readFileSync(hbPath, 'utf8')) as Record<string, any>
      captureLastAt = resolveHeartbeatTimestamp(hb)
    } catch { /* ok */ }

    const captureMinutes = captureLastAt
      ? Number(((Date.now() - new Date(captureLastAt).getTime()) / 60_000).toFixed(1))
      : null

    workers.push({
      name: 'Motor de Captação',
      healthy: captureMinutes !== null ? captureMinutes < 6 : false,
      lastRunAt: captureLastAt,
      minutesSinceLastRun: captureMinutes,
      detail: 'OAB → site → email',
    })

    // Gemini enricher worker — uses heartbeat file (updates every loop, even on no_seed)
    let geminiLastAt: string | null = null
    let geminiStatus = 'unknown'
    try {
      const hbPath = join(process.cwd(), 'scripts', 'outbound', 'output', 'gemini-enricher-heartbeat.json')
      const hb = JSON.parse(readFileSync(hbPath, 'utf8')) as Record<string, any>
      geminiLastAt = typeof hb.lastRunAt === 'string' ? hb.lastRunAt : null
      geminiStatus = typeof hb.status === 'string' ? hb.status : 'unknown'
    } catch { /* ok */ }

    const geminiMinutes = geminiLastAt
      ? Number(((Date.now() - new Date(geminiLastAt).getTime()) / 60_000).toFixed(1))
      : null

    workers.push({
      name: 'Gemini Enricher',
      healthy: geminiMinutes !== null ? geminiMinutes < 6 : false,
      lastRunAt: geminiLastAt,
      minutesSinceLastRun: geminiMinutes,
      detail: geminiStatus === 'idle' ? 'Sem seeds — aguardando' : 'Caçando emails',
    })

    // Slot scheduler worker
    let schedulerLastAt: string | null = null
    try {
      const summaryPath = join(process.cwd(), 'scripts', 'outbound', 'output', 'slot-scheduler-summary.json')
      const summary = JSON.parse(readFileSync(summaryPath, 'utf8')) as Record<string, any>
      schedulerLastAt = typeof summary.finishedAt === 'string' ? summary.finishedAt : null
    } catch { /* ok */ }

    const schedulerMinutes = schedulerLastAt
      ? Number(((Date.now() - new Date(schedulerLastAt).getTime()) / 60_000).toFixed(1))
      : null

    workers.push({
      name: 'Agendador de Slots',
      healthy: schedulerMinutes !== null ? schedulerMinutes < 6 : false,
      lastRunAt: schedulerLastAt,
      minutesSinceLastRun: schedulerMinutes,
      detail: 'Preenche slots do Resend',
    })

    // Instagram/WhatsApp enricher worker
    let igWaLastAt: string | null = null
    let igWaStatus = 'unknown'
    try {
      const hbPath = join(process.cwd(), 'scripts', 'outbound', 'output', 'instagram-whatsapp-enricher-heartbeat.json')
      const hb = JSON.parse(readFileSync(hbPath, 'utf8')) as Record<string, any>
      igWaLastAt = typeof hb.lastRunAt === 'string' ? hb.lastRunAt : null
      igWaStatus = typeof hb.status === 'string' ? hb.status : 'unknown'
    } catch { /* ok */ }

    const igWaMinutes = igWaLastAt
      ? Number(((Date.now() - new Date(igWaLastAt).getTime()) / 60_000).toFixed(1))
      : null

    workers.push({
      name: 'IG/WhatsApp',
      healthy: igWaMinutes !== null ? igWaMinutes < 15 : false,
      lastRunAt: igWaLastAt,
      minutesSinceLastRun: igWaMinutes,
      detail: igWaStatus === 'idle' ? 'Sem seeds' : 'Buscando IG/WA',
    })

    // ── Gemini stats ──
    const geminiAgg = db.prepare(`
      SELECT
        COUNT(*) AS totalRuns,
        COALESCE(SUM(result_found), 0) AS emailsFound
      FROM llm_review_runs
      WHERE provider = 'gemini'
        AND tool_name = 'gemini_email_enricher'
    `).get() as { totalRuns: number; emailsFound: number }

    const geminiPending = db.prepare(`
      SELECT COUNT(*) AS c FROM organizations
      WHERE status != 'ignored_non_icp'
        AND (primary_email IS NULL OR primary_email = '')
        AND (website_url IS NOT NULL AND website_url != '' OR instagram_url IS NOT NULL AND instagram_url != '')
    `).get() as { c: number }

    const recentGeminiFinds = db.prepare(`
      SELECT
        o.canonical_name AS orgName,
        e.value AS email,
        e.created_at AS foundAt
      FROM evidence e
      JOIN organizations o ON o.id = e.organization_id
      WHERE e.evidence_type = 'gemini_email'
      ORDER BY e.created_at DESC
      LIMIT 8
    `).all() as Array<{ orgName: string; email: string; foundAt: string }>

    const gemini: GeminiStats = {
      totalRuns: Number(geminiAgg.totalRuns ?? 0),
      emailsFound: Number(geminiAgg.emailsFound ?? 0),
      pending: Number(geminiPending.c ?? 0),
      lastRunAt: geminiLastAt,
      recentFinds: recentGeminiFinds,
    }

    // ── Codex usage ──
    const latestSession = db.prepare(`
      WITH latest_session AS (
        SELECT session_id
        FROM llm_review_runs
        WHERE provider = 'codex'
        GROUP BY session_id
        HAVING
          COALESCE(SUM(input_tokens), 0) > 0
          OR COALESCE(SUM(output_tokens), 0) > 0
          OR COALESCE(SUM(cached_input_tokens), 0) > 0
          OR COALESCE(SUM(estimated_credits), 0) > 0
        ORDER BY MAX(started_at) DESC
        LIMIT 1
      )
      SELECT
        COALESCE(SUM(input_tokens), 0) AS inputTokens,
        COALESCE(SUM(cached_input_tokens), 0) AS cachedInputTokens,
        COALESCE(SUM(output_tokens), 0) AS outputTokens,
        COALESCE(SUM(estimated_credits), 0) AS estimatedCredits,
        COUNT(*) AS runs,
        COALESCE(SUM(result_found), 0) AS resultFoundRuns,
        (SELECT session_id FROM latest_session) AS sessionId
      FROM llm_review_runs
      WHERE session_id = (SELECT session_id FROM latest_session)
    `).get() as CodexUsageSummary

    const weekly = db.prepare(`
      SELECT
        COALESCE(SUM(input_tokens), 0) AS inputTokens,
        COALESCE(SUM(cached_input_tokens), 0) AS cachedInputTokens,
        COALESCE(SUM(output_tokens), 0) AS outputTokens,
        COALESCE(SUM(estimated_credits), 0) AS estimatedCredits,
        COUNT(*) AS runs,
        COALESCE(SUM(result_found), 0) AS resultFoundRuns,
        NULL AS sessionId
      FROM llm_review_runs
      WHERE provider = 'codex'
        AND started_at >= ?
    `).get(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) as CodexUsageSummary

    let resendSync = {
      syncedAt: null as string | null,
      resendEmailsSeen: 0,
      matchedEmails: 0,
      unmatchedEmails: 0,
    }

    try {
      const syncSummaryPath = join(process.cwd(), 'scripts', 'outbound', 'output', 'sync-resend-email-state-summary.json')
      const summary = JSON.parse(readFileSync(syncSummaryPath, 'utf8')) as Record<string, unknown>
      resendSync = {
        syncedAt: typeof summary.syncedAt === 'string' ? summary.syncedAt : null,
        resendEmailsSeen: Number(summary.resendEmailsSeen ?? 0),
        matchedEmails: Number(summary.matchedEmails ?? 0),
        unmatchedEmails: Number(summary.unmatchedEmails ?? 0),
      }
    } catch { /* ok */ }

    // ── Campaigns ──
    const campaigns = db.prepare(`
      SELECT
        ec.id,
        ec.lead_campaign_id AS leadCampaignId,
        ec.name,
        ec.status,
        ec.cadence_minutes AS cadenceMinutes,
        ec.planned_start_at AS plannedStartAt,
        SUM(CASE WHEN ej.status = 'scheduled' THEN 1 ELSE 0 END) AS scheduledJobs,
        SUM(CASE WHEN ej.status IN ('sent', 'delivered', 'opened', 'clicked') THEN 1 ELSE 0 END) AS sentSignals
      FROM email_campaigns ec
      LEFT JOIN email_jobs ej ON ej.email_campaign_id = ec.id
      GROUP BY ec.id
      ORDER BY ec.created_at DESC
    `).all() as CampaignRow[]

    // ── Recent responses ──
    const recentResponses = db.prepare(`
      SELECT
        er.email_campaign_id AS emailCampaignId,
        er.from_email AS fromEmail,
        (
          SELECT e.value
          FROM evidence e
          WHERE e.organization_id = er.organization_id
            AND e.evidence_type = 'official_office_name'
          ORDER BY e.id DESC
          LIMIT 1
        ) AS officeName,
        er.received_at AS receivedAt,
        er.subject,
        er.to_email AS toEmail
      FROM email_responses er
      ORDER BY er.received_at DESC, er.id DESC
      LIMIT 10
    `).all() as ResponseRow[]

    // ── Leads ──
    const leadsReady = db.prepare(`
      SELECT
        o.id AS id,
        o.instagram_url AS instagramUrl,
        o.canonical_name AS canonicalName,
        o.city AS city,
        (
          SELECT ej.status
          FROM email_jobs ej
          WHERE ej.organization_id = o.id
          ORDER BY ej.sequence_step DESC, ej.id DESC
          LIMIT 1
        ) AS emailStatus,
        (
          SELECT ec.name
          FROM email_jobs ej
          INNER JOIN email_campaigns ec ON ec.id = ej.email_campaign_id
          WHERE ej.organization_id = o.id
          ORDER BY ej.sequence_step DESC, ej.id DESC
          LIMIT 1
        ) AS latestEmailCampaignName,
        (
          SELECT COALESCE(ej.scheduled_at, ec.planned_start_at)
          FROM email_jobs ej
          INNER JOIN email_campaigns ec ON ec.id = ej.email_campaign_id
          WHERE ej.organization_id = o.id
          ORDER BY ej.sequence_step DESC, ej.id DESC
          LIMIT 1
        ) AS latestEmailScheduledAt,
        (
          SELECT ej.subject
          FROM email_jobs ej
          WHERE ej.organization_id = o.id
          ORDER BY ej.sequence_step DESC, ej.id DESC
          LIMIT 1
        ) AS latestEmailSubject,
        (
          SELECT er.received_at
          FROM email_responses er
          WHERE er.organization_id = o.id
          ORDER BY er.received_at DESC, er.id DESC
          LIMIT 1
        ) AS latestResponseAt,
        (
          SELECT e.value
          FROM evidence e
          WHERE e.organization_id = o.id
            AND e.evidence_type = 'official_office_name'
          ORDER BY e.id DESC
          LIMIT 1
        ) AS officeName,
        o.primary_email AS primaryEmail,
        o.primary_phone AS primaryPhone,
        o.primary_whatsapp AS primaryWhatsapp,
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM email_responses er
            WHERE er.organization_id = o.id
          ) THEN 1
          ELSE 0
        END AS responded,
        o.source_confidence AS sourceConfidence,
        o.status AS status,
        o.website_domain AS websiteDomain,
        o.website_url AS websiteUrl
      FROM organizations o
      WHERE o.status != 'ignored_non_icp'
      ORDER BY o.created_at DESC, o.id DESC
      LIMIT 1000
    `).all() as LeadRow[]

    // ── Logs ──
    let recentLogs: string[] = []
    try {
      const logPath = join(process.cwd(), 'scripts', 'outbound', 'output', 'auto-capture-loop.log')
      const logContent = readFileSync(logPath, 'utf8')
      const lines = logContent.split('\n').filter(Boolean)
      recentLogs = lines.slice(-30)
    } catch { /* ok */ }

    let latestCycle: AutoCaptureCycleSnapshot | null = null
    try {
      const cycleSummaryPath = join(process.cwd(), 'scripts', 'outbound', 'output', 'auto-capture-cycle-summary.json')
      const summary = JSON.parse(readFileSync(cycleSummaryPath, 'utf8')) as Record<string, any>
      const initialCounts = asRecord(summary.initialCounts)
      const finalCounts = asRecord(summary.finalCounts)
      const startedAt = asString(summary.startedAt)
      const finishedAt = asString(summary.finishedAt)
      const durationSeconds = startedAt && finishedAt
        ? Math.max(0, Math.round((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000))
        : null

      latestCycle = {
        cleanup: {
          clearedEmail: asNumber(asRecord(summary.cleanupSummary).clearedEmail),
          clearedInstagram: asNumber(asRecord(summary.cleanupSummary).clearedInstagram),
          clearedWebsite: asNumber(asRecord(summary.cleanupSummary).clearedWebsite),
          downgraded: asNumber(asRecord(summary.cleanupSummary).downgraded),
        },
        codexFallback: {
          matched: asNumber(asRecord(summary.codexFallbackSummary).matched),
          misses: asNumber(asRecord(summary.codexFallbackSummary).misses),
          model: asString(asRecord(summary.codexFallbackSummary).model),
          reason: asString(asRecord(summary.codexFallbackSummary).reason),
          weeklyCredits: asNumber(asRecord(summary.codexFallbackSummary).weeklyCredits),
        },
        countsDelta: {
          manual: asNumber(finalCounts.manualCount) - asNumber(initialCounts.manualCount),
          raw: asNumber(finalCounts.rawCount) - asNumber(initialCounts.rawCount),
          ready: asNumber(finalCounts.readyCount) - asNumber(initialCounts.readyCount),
          withEmail: asNumber(finalCounts.withEmail) - asNumber(initialCounts.withEmail),
          withInstagram: asNumber(finalCounts.withInstagram) - asNumber(initialCounts.withInstagram),
        },
        directWebDiscovery: {
          addedOrUpdated: asNumber(asRecord(summary.directWebDiscoverySummary).addedOrUpdated),
          candidates: asNumber(asRecord(summary.directWebDiscoverySummary).candidates),
          error: asString(asRecord(summary.directWebDiscoverySummary).error),
          reason: asString(asRecord(summary.directWebDiscoverySummary).reason),
        },
        discovery: {
          addedOrganizations: asNumber(asRecord(summary.discoverySummary).addedOrganizations),
          pauseDiscovery: Boolean(asRecord(summary.discoveryBackpressure).pauseDiscovery),
          reason: asString(asRecord(summary.discoverySummary).reason),
        },
        durationSeconds,
        finishedAt,
        officialSite: {
          candidates: asNumber(asRecord(summary.officialSiteSummary).candidates),
          enriched: asNumber(asRecord(summary.officialSiteSummary).enriched),
          failures: asNumber(asRecord(summary.officialSiteSummary).failures),
          reason: asString(asRecord(summary.officialSiteSummary).reason),
        },
        startedAt,
        webSearch: {
          candidates: asNumber(asRecord(summary.webSearchSummary).candidates),
          matched: asNumber(asRecord(summary.webSearchSummary).matched),
          misses: asNumber(asRecord(summary.webSearchSummary).misses),
          reason: asString(asRecord(summary.webSearchSummary).reason),
        },
      }
    } catch { /* ok */ }

    return {
      latestCycle,
      funnel,
      todayQuota,
      bottlenecks,
      workers,
      gemini,
      codexUsage: { latestSession, weekly },
      resendSync,
      campaigns,
      recentResponses,
      leadsReady,
      recentLogs,
    }
  } finally {
    db.close()
  }
}

function resolveHeartbeatTimestamp(payload: Record<string, unknown>): string | null {
  if (typeof payload.lastRunAt === 'string') {
    return payload.lastRunAt
  }

  if (typeof payload.timestamp === 'string') {
    return payload.timestamp
  }

  return null
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {}
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

// ─── Helpers ───

function getTodayStartBRT() {
  const now = new Date()
  const brt = new Date(now.getTime() - 3 * 60 * 60 * 1000)
  const y = brt.getUTCFullYear()
  const m = String(brt.getUTCMonth() + 1).padStart(2, '0')
  const d = String(brt.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}T00:00:00-03:00`
}

function getTodayEndBRT() {
  const now = new Date()
  const brt = new Date(now.getTime() - 3 * 60 * 60 * 1000)
  const y = brt.getUTCFullYear()
  const m = String(brt.getUTCMonth() + 1).padStart(2, '0')
  const d = String(brt.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}T23:59:59-03:00`
}

function buildBRTSlotIso(hourMinute: string) {
  const now = new Date()
  const brt = new Date(now.getTime() - 3 * 60 * 60 * 1000)
  const y = brt.getUTCFullYear()
  const m = String(brt.getUTCMonth() + 1).padStart(2, '0')
  const d = String(brt.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}T${hourMinute}:00-03:00`
}

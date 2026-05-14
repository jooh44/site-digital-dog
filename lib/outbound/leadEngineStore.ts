import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { DEFAULT_LEAD_ENGINE_DB_PATH, DEFAULT_LEAD_ENGINE_SCHEMA_PATH } from './paths.ts'
import type {
  CampaignRecordInput,
  CodexFallbackMatch,
  CodexFallbackSeed,
  GeminiEmailSeed,
  CnsaRegistryLead,
  EmailCampaignRecordInput,
  EmailCampaignRow,
  EmailJobRecordInput,
  EmailJobRow,
  EmailResponseRecordInput,
  EmailResponseRow,
  LlmReviewRunCompletionInput,
  LlmReviewRunRecordInput,
  OfficialSiteEnrichment,
  OabRegistryLead,
  RegistrySourceChannel,
  SearchRunRecordInput,
  ShortlistRow,
  WebSearchOrganizationMatch,
} from './types.ts'

type LeadEnginePaths = {
  dbPath?: string
  schemaPath?: string
}

type OrganizationIdRow = {
  id: string
}

type OrganizationSourceRow = {
  id: number
  organization_id: string
}

type EvidenceRow = {
  id: number
}

type EmailJobIdentityRow = {
  id: number
  organization_id?: string
  status: string
}

type EmailResponseIdentityRow = {
  id: number
}

type LlmReviewRunIdentityRow = {
  id: number
}

type RegistryLeadRecord = {
  canonicalName: string
  city: string
  externalId: string
  rawPayloadJson: string
  registryProvider: string
  registryRoleLabel: string
  sourceChannel: RegistrySourceChannel
  sourceConfidence: number
  sourceTitlePrefix: string
  sourceType: string
  sourceUrl: string
  specialtyLabel: string
  state: string
}

export function openLeadEngineDatabase(paths: LeadEnginePaths = {}): DatabaseSync {
  const dbPath = paths.dbPath ?? DEFAULT_LEAD_ENGINE_DB_PATH
  const schemaPath = paths.schemaPath ?? DEFAULT_LEAD_ENGINE_SCHEMA_PATH

  if (!existsSync(dirname(dbPath))) {
    mkdirSync(dirname(dbPath), { recursive: true })
  }

  const db = new DatabaseSync(dbPath)
  db.exec(`PRAGMA busy_timeout = 10000`)
  configureLeadEngineConnection(db)
  db.exec(`PRAGMA foreign_keys = ON`)
  ensureLeadEngineSchema(db, schemaPath)
  migrateLeadEngineDatabase(db)

  return db
}

function configureLeadEngineConnection(db: DatabaseSync): void {
  try {
    db.exec(`PRAGMA journal_mode = WAL`)
    db.exec(`PRAGMA synchronous = NORMAL`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown sqlite pragma error'
    console.warn(`[lead-engine] SQLite WAL setup skipped for this connection: ${message}`)
  }
}

export function upsertCampaign(db: DatabaseSync, input: CampaignRecordInput, nowIso: string): void {
  const existing = db.prepare('SELECT id FROM campaigns WHERE id = ?').get(input.id) as OrganizationIdRow | undefined

  if (existing) {
    db.prepare(`
      UPDATE campaigns
      SET name = ?,
          niche = ?,
          city = ?,
          size_range = ?,
          status = ?,
          notes = ?,
          updated_at = ?
      WHERE id = ?
    `).run(
      input.name,
      input.niche,
      input.city,
      input.sizeRange ?? null,
      input.status ?? 'active',
      input.notes ?? null,
      nowIso,
      input.id
    )

    return
  }

  db.prepare(`
    INSERT INTO campaigns (
      id, name, niche, city, size_range, status, owner, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'johny', ?, ?, ?)
  `).run(
    input.id,
    input.name,
    input.niche,
    input.city,
    input.sizeRange ?? null,
    input.status ?? 'active',
    input.notes ?? null,
    nowIso,
    nowIso
  )
}

export function createSearchRun(db: DatabaseSync, input: SearchRunRecordInput, nowIso: string): number {
  const result = db.prepare(`
    INSERT INTO search_runs (
      campaign_id,
      source_channel,
      tool_name,
      query_text,
      status,
      notes,
      started_at,
      created_at
    ) VALUES (?, ?, ?, ?, 'running', ?, ?, ?)
  `).run(
    input.campaignId,
    input.sourceChannel,
    input.toolName,
    input.queryText,
    input.notes ?? null,
    nowIso,
    nowIso
  )

  return Number(result.lastInsertRowid)
}

export function completeSearchRun(
  db: DatabaseSync,
  searchRunId: number,
  resultCount: number,
  nowIso: string,
  notes?: string
): void {
  db.prepare(`
    UPDATE search_runs
    SET status = 'completed',
        result_count = ?,
        notes = ?,
        finished_at = ?
    WHERE id = ?
  `).run(resultCount, notes ?? null, nowIso, searchRunId)
}

export function failSearchRun(db: DatabaseSync, searchRunId: number, nowIso: string, notes?: string): void {
  db.prepare(`
    UPDATE search_runs
    SET status = 'failed',
        result_count = 0,
        notes = ?,
        finished_at = ?
    WHERE id = ?
  `).run(notes ?? null, nowIso, searchRunId)
}

export function upsertOabRegistryLead(db: DatabaseSync, lead: OabRegistryLead, searchRunId: number, nowIso: string): string {
  const organizationId = upsertRegistryLead(
    db,
    {
      canonicalName: lead.canonicalName,
      city: lead.city,
      externalId: lead.externalId,
      rawPayloadJson: JSON.stringify(lead),
      registryProvider: lead.registryProvider,
      registryRoleLabel: lead.inscriptionTypeLabel,
      sourceChannel: 'oab_registry',
      sourceConfidence: lead.sourceConfidence,
      sourceTitlePrefix: 'OAB registry',
      sourceType: 'public_registry_listing',
      sourceUrl: lead.sourceUrl,
      specialtyLabel: lead.specialtyLabel,
      state: lead.state,
    },
    searchRunId,
    nowIso
  )

  if (lead.officeName) {
    upsertEvidenceRecord(
      db,
      organizationId,
      'registry_office_name',
      lead.officeName,
      lead.sourceUrl,
      'oab_registry',
      nowIso
    )
  }

  if (lead.subsection) {
    upsertEvidenceRecord(
      db,
      organizationId,
      'registry_subsection',
      lead.subsection,
      lead.sourceUrl,
      'oab_registry',
      nowIso
    )
  }

  return organizationId
}

export function upsertCnsaRegistryLead(db: DatabaseSync, lead: CnsaRegistryLead, searchRunId: number, nowIso: string): string {
  return upsertRegistryLead(
    db,
    {
      canonicalName: lead.canonicalName,
      city: lead.city,
      externalId: lead.externalId,
      rawPayloadJson: JSON.stringify(lead),
      registryProvider: lead.registryProvider,
      registryRoleLabel: lead.registryTypeLabel,
      sourceChannel: 'cnsa_registry',
      sourceConfidence: lead.sourceConfidence,
      sourceTitlePrefix: 'CNSA registry',
      sourceType: 'manual_society_registry_seed',
      sourceUrl: lead.sourceUrl,
      specialtyLabel: lead.specialtyLabel,
      state: lead.state,
    },
    searchRunId,
    nowIso
  )
}

export function upsertOfficialSiteLead(
  db: DatabaseSync,
  lead: OfficialSiteEnrichment,
  searchRunId: number,
  nowIso: string
): string {
  const registrySource = db.prepare(`
    SELECT id, organization_id
    FROM organization_sources
    WHERE source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery') AND external_id = ?
    ORDER BY id DESC
    LIMIT 1
  `).get(lead.externalId) as OrganizationSourceRow | undefined

  if (!registrySource?.organization_id) {
    throw new Error(`Official site seed ${lead.externalId} has no matching registry lead in SQLite.`)
  }

  const existingSource = db.prepare(`
    SELECT id, organization_id
    FROM organization_sources
    WHERE source_channel = 'official_site' AND external_id = ?
  `).get(lead.externalId) as OrganizationSourceRow | undefined

  upsertOfficialSiteOrganizationRecord(db, registrySource.organization_id, lead, nowIso)
  upsertOfficialSiteSourceRecord(db, registrySource.organization_id, lead, searchRunId, nowIso, existingSource)
  db.prepare(`
    DELETE FROM contacts
    WHERE organization_id = ? AND source_channel = 'official_site'
  `).run(registrySource.organization_id)

  for (const contact of lead.contacts) {
    upsertContactRecord(db, registrySource.organization_id, contact, nowIso)
  }

  for (const evidence of lead.evidence) {
    upsertEvidenceRecord(
      db,
      registrySource.organization_id,
      evidence.type,
      evidence.value,
      evidence.sourceUrl,
      'official_site',
      nowIso
    )
  }

  return registrySource.organization_id
}

export function upsertWebSearchMatch(
  db: DatabaseSync,
  lead: WebSearchOrganizationMatch,
  searchRunId: number,
  nowIso: string
): string {
  const registrySource = db.prepare(`
    SELECT id, organization_id
    FROM organization_sources
    WHERE source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery') AND external_id = ?
    ORDER BY id DESC
    LIMIT 1
  `).get(lead.externalId) as OrganizationSourceRow | undefined

  if (!registrySource?.organization_id) {
    throw new Error(`Web search seed ${lead.externalId} has no matching registry lead in SQLite.`)
  }

  const existingSource = db.prepare(`
    SELECT id, organization_id
    FROM organization_sources
    WHERE source_channel = 'google_web_search' AND external_id = ?
  `).get(lead.externalId) as OrganizationSourceRow | undefined

  db.prepare(`
    UPDATE organizations
    SET website_url = COALESCE(NULLIF(website_url, ''), ?),
        website_domain = COALESCE(NULLIF(website_domain, ''), ?),
        instagram_url = COALESCE(NULLIF(instagram_url, ''), ?),
        status = CASE
          WHEN status = 'raw' AND (? IS NOT NULL OR ? IS NOT NULL) THEN 'needs_manual_review'
          ELSE status
        END,
        updated_at = ?
    WHERE id = ?
  `).run(
    lead.websiteUrl ?? null,
    lead.websiteDomain ?? null,
    lead.instagramUrl ?? null,
    lead.websiteUrl ?? null,
    lead.instagramUrl ?? null,
    nowIso,
    registrySource.organization_id
  )

  if (existingSource) {
    db.prepare(`
      UPDATE organization_sources
      SET search_run_id = ?,
          source_type = 'search_engine_result',
          source_url = ?,
          source_title = ?,
          confidence = ?,
          raw_payload_json = ?,
          last_seen_at = ?
      WHERE id = ?
    `).run(
      searchRunId,
      lead.sourceUrl,
      lead.websiteDomain ?? lead.instagramUrl ?? lead.sourceUrl,
      lead.sourceConfidence,
      lead.rawPayloadJson,
      nowIso,
      existingSource.id
    )
  } else {
    db.prepare(`
      INSERT INTO organization_sources (
        organization_id,
        search_run_id,
        source_channel,
        source_type,
        external_id,
        source_url,
        source_title,
        confidence,
        raw_payload_json,
        first_seen_at,
        last_seen_at
      ) VALUES (?, ?, 'google_web_search', 'search_engine_result', ?, ?, ?, ?, ?, ?, ?)
    `).run(
      registrySource.organization_id,
      searchRunId,
      lead.externalId,
      lead.sourceUrl,
      lead.websiteDomain ?? lead.instagramUrl ?? lead.sourceUrl,
      lead.sourceConfidence,
      lead.rawPayloadJson,
      nowIso,
      nowIso
    )
  }

  if (lead.websiteUrl) {
    upsertEvidenceRecord(
      db,
      registrySource.organization_id,
      'web_search_website_url',
      lead.websiteUrl,
      lead.sourceUrl,
      'google_web_search',
      nowIso
    )
  }

  if (lead.contactPageUrl) {
    upsertEvidenceRecord(
      db,
      registrySource.organization_id,
      'web_search_contact_page',
      lead.contactPageUrl,
      lead.sourceUrl,
      'google_web_search',
      nowIso
    )
  }

  if (lead.instagramUrl) {
    upsertEvidenceRecord(
      db,
      registrySource.organization_id,
      'web_search_instagram_url',
      lead.instagramUrl,
      lead.sourceUrl,
      'google_web_search',
      nowIso
    )
  }

  return registrySource.organization_id
}

export function upsertCodexFallbackMatch(
  db: DatabaseSync,
  lead: CodexFallbackMatch,
  searchRunId: number,
  nowIso: string
): string {
  const registrySource = db.prepare(`
    SELECT id, organization_id
    FROM organization_sources
    WHERE source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery') AND external_id = ?
    ORDER BY id DESC
    LIMIT 1
  `).get(lead.externalId) as OrganizationSourceRow | undefined

  if (!registrySource?.organization_id) {
    throw new Error(`Codex fallback seed ${lead.externalId} has no matching registry lead in SQLite.`)
  }

  const existingSource = db.prepare(`
    SELECT id, organization_id
    FROM organization_sources
    WHERE source_channel = 'codex_fallback' AND external_id = ?
  `).get(lead.externalId) as OrganizationSourceRow | undefined
  const currentOrganization = db.prepare(`
    SELECT
      instagram_url AS instagramUrl,
      primary_email AS primaryEmail,
      status,
      website_url AS websiteUrl
    FROM organizations
    WHERE id = ?
  `).get(registrySource.organization_id) as {
    instagramUrl: string | null
    primaryEmail: string | null
    status: string
    websiteUrl: string | null
  } | undefined

  const hasSignal = Boolean(
    lead.websiteUrl ||
    lead.instagramUrl ||
    lead.primaryPhone ||
    lead.primaryWhatsapp
  )
  const nextStatus = currentOrganization?.primaryEmail &&
    (lead.websiteUrl || currentOrganization.websiteUrl || lead.instagramUrl || currentOrganization.instagramUrl)
    ? 'ready_for_review'
    : hasSignal
      ? 'needs_manual_review'
      : currentOrganization?.status ?? null

  db.prepare(`
    UPDATE organizations
    SET website_url = COALESCE(NULLIF(website_url, ''), ?),
        website_domain = COALESCE(NULLIF(website_domain, ''), ?),
        instagram_url = COALESCE(NULLIF(instagram_url, ''), ?),
        primary_phone = COALESCE(NULLIF(primary_phone, ''), ?),
        primary_whatsapp = COALESCE(NULLIF(primary_whatsapp, ''), ?),
        source_confidence = MAX(source_confidence, ?),
        status = CASE
          WHEN ? IS NULL THEN status
          ELSE ?
        END,
        updated_at = ?
    WHERE id = ?
  `).run(
    lead.websiteUrl ?? null,
    lead.websiteDomain ?? null,
    lead.instagramUrl ?? null,
    lead.primaryPhone ?? null,
    lead.primaryWhatsapp ?? null,
    lead.sourceConfidence,
    nextStatus,
    nextStatus,
    nowIso,
    registrySource.organization_id
  )

  const sourceTitle = lead.officeName ?? `Codex fallback - ${lead.canonicalName}`

  if (existingSource) {
    db.prepare(`
      UPDATE organization_sources
      SET search_run_id = ?,
          source_type = 'llm_official_match',
          source_url = ?,
          source_title = ?,
          confidence = ?,
          raw_payload_json = ?,
          last_seen_at = ?
      WHERE id = ?
    `).run(
      searchRunId,
      lead.sourceUrl,
      sourceTitle,
      lead.sourceConfidence,
      lead.rawPayloadJson,
      nowIso,
      existingSource.id
    )
  } else {
    db.prepare(`
      INSERT INTO organization_sources (
        organization_id,
        search_run_id,
        source_channel,
        source_type,
        external_id,
        source_url,
        source_title,
        confidence,
        raw_payload_json,
        first_seen_at,
        last_seen_at
      ) VALUES (?, ?, 'codex_fallback', 'llm_official_match', ?, ?, ?, ?, ?, ?, ?)
    `).run(
      registrySource.organization_id,
      searchRunId,
      lead.externalId,
      lead.sourceUrl,
      sourceTitle,
      lead.sourceConfidence,
      lead.rawPayloadJson,
      nowIso,
      nowIso
    )
  }

  const evidenceRows = [
    ['codex_office_name', lead.officeName],
    ['codex_website_url', lead.websiteUrl],
    ['codex_contact_page', lead.contactPageUrl],
    ['codex_instagram_url', lead.instagramUrl],
    ['codex_phone', lead.primaryPhone],
    ['codex_whatsapp', lead.primaryWhatsapp],
    ['codex_rationale', lead.rationale],
  ] as const

  for (const [evidenceType, value] of evidenceRows) {
    if (!value) {
      continue
    }

    upsertEvidenceRecord(
      db,
      registrySource.organization_id,
      evidenceType,
      value,
      lead.sourceUrl,
      'codex_fallback',
      nowIso
    )
  }

  return registrySource.organization_id
}

export function listShortlistForCampaign(db: DatabaseSync, campaignId: string, limit = 15): ShortlistRow[] {
  return db.prepare(`
    WITH latest_registry_source AS (
      SELECT
        os.organization_id,
        MAX(os.id) AS source_id
      FROM organization_sources os
      JOIN search_runs sr ON sr.id = os.search_run_id
      WHERE sr.campaign_id = ? AND os.source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery')
      GROUP BY os.organization_id
    ),
    latest_official_source AS (
      SELECT
        os.organization_id,
        MAX(os.id) AS source_id
      FROM organization_sources os
      JOIN search_runs sr ON sr.id = os.search_run_id
      WHERE sr.campaign_id = ? AND os.source_channel = 'official_site'
      GROUP BY os.organization_id
    )
    SELECT
      sr.campaign_id AS campaignId,
      o.canonical_name AS canonicalName,
      o.city AS city,
      os.external_id AS externalId,
      o.id AS id,
      o.instagram_url AS instagramUrl,
      COALESCE(o.primary_whatsapp, o.primary_phone) AS manualNumber,
      CASE
        WHEN o.status = 'ready_for_review' THEN 'review'
        WHEN o.website_url IS NOT NULL THEN 'manual_review'
        ELSE 'official_site_lookup'
      END AS nextStep,
      (
        SELECT e.value
        FROM evidence e
        WHERE e.organization_id = o.id
          AND e.evidence_type = 'official_office_name'
        ORDER BY e.id DESC
        LIMIT 1
      ) AS officeName,
      official.source_title AS officialSiteTitle,
      official.source_url AS officialSiteUrl,
      o.primary_email AS primaryEmail,
      o.primary_phone AS primaryPhone,
      o.primary_whatsapp AS primaryWhatsapp,
      os.source_url AS registryUrl,
      o.source_confidence AS sourceConfidence,
      os.source_title AS sourceTitle,
      (
        SELECT e.value
        FROM evidence e
        WHERE e.organization_id = o.id
          AND e.evidence_type = 'specialty'
        ORDER BY e.id DESC
        LIMIT 1
      ) AS specialtyLabel,
      o.state AS state,
      o.status AS status,
      o.website_domain AS websiteDomain,
      o.website_url AS websiteUrl
    FROM latest_registry_source ls
    JOIN organization_sources os ON os.id = ls.source_id
    JOIN organizations o ON o.id = ls.organization_id
    JOIN search_runs sr ON sr.id = os.search_run_id
    LEFT JOIN latest_official_source los ON los.organization_id = ls.organization_id
    LEFT JOIN organization_sources official ON official.id = los.source_id
    ORDER BY
      CASE
        WHEN o.status = 'ready_for_review' THEN 0
        WHEN o.status = 'needs_manual_review' THEN 1
        ELSE 2
      END ASC,
      o.source_confidence DESC,
      o.canonical_name ASC
    LIMIT ?
  `).all(campaignId, campaignId, limit) as ShortlistRow[]
}

export function listEmailEligibleTargetsForCampaign(
  db: DatabaseSync,
  campaignId: string,
  limit = 25,
  excludePreviouslyContacted = true
): ShortlistRow[] {
  return db.prepare(`
    WITH latest_registry_source AS (
      SELECT
        os.organization_id,
        MAX(os.id) AS source_id
      FROM organization_sources os
      JOIN search_runs sr ON sr.id = os.search_run_id
      WHERE sr.campaign_id = ? AND os.source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery')
      GROUP BY os.organization_id
    ),
    latest_official_source AS (
      SELECT
        os.organization_id,
        MAX(os.id) AS source_id
      FROM organization_sources os
      JOIN search_runs sr ON sr.id = os.search_run_id
      WHERE sr.campaign_id = ? AND os.source_channel = 'official_site'
      GROUP BY os.organization_id
    )
    SELECT
      sr.campaign_id AS campaignId,
      o.canonical_name AS canonicalName,
      o.city AS city,
      os.external_id AS externalId,
      o.id AS id,
      o.instagram_url AS instagramUrl,
      COALESCE(o.primary_whatsapp, o.primary_phone) AS manualNumber,
      'email_review' AS nextStep,
      (
        SELECT e.value
        FROM evidence e
        WHERE e.organization_id = o.id
          AND e.evidence_type = 'official_office_name'
        ORDER BY e.id DESC
        LIMIT 1
      ) AS officeName,
      official.source_title AS officialSiteTitle,
      official.source_url AS officialSiteUrl,
      o.primary_email AS primaryEmail,
      o.primary_phone AS primaryPhone,
      o.primary_whatsapp AS primaryWhatsapp,
      os.source_url AS registryUrl,
      o.source_confidence AS sourceConfidence,
      os.source_title AS sourceTitle,
      (
        SELECT e.value
        FROM evidence e
        WHERE e.organization_id = o.id
          AND e.evidence_type = 'specialty'
        ORDER BY e.id DESC
        LIMIT 1
      ) AS specialtyLabel,
      o.state AS state,
      o.status AS status,
      o.website_domain AS websiteDomain,
      o.website_url AS websiteUrl
    FROM latest_registry_source ls
    JOIN organization_sources os ON os.id = ls.source_id
    JOIN organizations o ON o.id = ls.organization_id
    JOIN search_runs sr ON sr.id = os.search_run_id
    LEFT JOIN latest_official_source los ON los.organization_id = ls.organization_id
    LEFT JOIN organization_sources official ON official.id = los.source_id
    WHERE o.status IN ('ready_for_review', 'needs_manual_review')
      AND o.primary_email IS NOT NULL
      AND o.primary_email != ''
      AND (
        ? = 0
        OR NOT EXISTS (
          SELECT 1
          FROM email_jobs ej
          WHERE ej.organization_id = o.id
            AND ej.status != 'canceled'
        )
      )
    ORDER BY o.source_confidence DESC, o.canonical_name ASC
    LIMIT ?
  `).all(campaignId, campaignId, excludePreviouslyContacted ? 1 : 0, limit) as ShortlistRow[]
}

export function markOrganizationEmailValidated(db: DatabaseSync, organizationId: string, nowIso: string): void {
  db.prepare(`
    UPDATE organizations
    SET email_validated_at = ?,
        updated_at = ?
    WHERE id = ?
  `).run(nowIso, nowIso, organizationId)
}

export function markOrganizationEmailInvalid(
  db: DatabaseSync,
  organizationId: string,
  reason: string,
  nowIso: string
): void {
  db.prepare(`
    UPDATE organizations
    SET status = 'email_invalid',
        email_validated_at = ?,
        updated_at = ?
    WHERE id = ?
  `).run(nowIso, nowIso, organizationId)

  db.prepare(`
    INSERT INTO suppressions (
      organization_id,
      suppression_type,
      reason,
      created_at
    ) VALUES (?, 'email_invalid', ?, ?)
  `).run(organizationId, reason, nowIso)
}

export function listShortlistRowsByOrganizationIds(db: DatabaseSync, organizationIds: string[]): ShortlistRow[] {
  const validIds = organizationIds.filter(Boolean)

  if (validIds.length === 0) {
    return []
  }

  const placeholders = validIds.map(() => '?').join(', ')

  return db.prepare(`
    SELECT
      '' AS campaignId,
      o.canonical_name AS canonicalName,
      o.city AS city,
      (
        SELECT os.external_id
        FROM organization_sources os
        WHERE os.organization_id = o.id
        ORDER BY os.id DESC
        LIMIT 1
      ) AS externalId,
      o.id AS id,
      o.instagram_url AS instagramUrl,
      COALESCE(o.primary_whatsapp, o.primary_phone) AS manualNumber,
      'email_review' AS nextStep,
      (
        SELECT e.value
        FROM evidence e
        WHERE e.organization_id = o.id
          AND e.evidence_type = 'official_office_name'
        ORDER BY e.id DESC
        LIMIT 1
      ) AS officeName,
      (
        SELECT os.source_title
        FROM organization_sources os
        WHERE os.organization_id = o.id
          AND os.source_channel = 'official_site'
        ORDER BY os.id DESC
        LIMIT 1
      ) AS officialSiteTitle,
      (
        SELECT os.source_url
        FROM organization_sources os
        WHERE os.organization_id = o.id
          AND os.source_channel = 'official_site'
        ORDER BY os.id DESC
        LIMIT 1
      ) AS officialSiteUrl,
      o.primary_email AS primaryEmail,
      o.primary_phone AS primaryPhone,
      o.primary_whatsapp AS primaryWhatsapp,
      (
        SELECT os.source_url
        FROM organization_sources os
        WHERE os.organization_id = o.id
        ORDER BY os.id DESC
        LIMIT 1
      ) AS registryUrl,
      o.source_confidence AS sourceConfidence,
      (
        SELECT os.source_title
        FROM organization_sources os
        WHERE os.organization_id = o.id
        ORDER BY os.id DESC
        LIMIT 1
      ) AS sourceTitle,
      (
        SELECT e.value
        FROM evidence e
        WHERE e.organization_id = o.id
          AND e.evidence_type = 'specialty'
        ORDER BY e.id DESC
        LIMIT 1
      ) AS specialtyLabel,
      o.state AS state,
      o.status AS status,
      o.website_domain AS websiteDomain,
      o.website_url AS websiteUrl
    FROM organizations o
    WHERE o.id IN (${placeholders})
    ORDER BY o.canonical_name ASC
  `).all(...validIds) as ShortlistRow[]
}

export function listCodexFallbackSeeds(
  db: DatabaseSync,
  limit: number,
  retryAfterIso: string
): CodexFallbackSeed[] {
  return db.prepare(`
    SELECT
      os.external_id AS externalId,
      COALESCE(
        (
          SELECT e.value
          FROM evidence e
          WHERE e.organization_id = o.id
            AND e.evidence_type IN ('official_office_name', 'registry_office_name')
          ORDER BY e.id DESC
          LIMIT 1
        ),
        o.canonical_name
      ) AS canonicalName,
      o.city AS city,
      (
        SELECT e.value
        FROM evidence e
        WHERE e.organization_id = o.id
          AND e.evidence_type IN ('official_office_name', 'registry_office_name')
        ORDER BY e.id DESC
        LIMIT 1
      ) AS officeName,
      (
        SELECT e.value
        FROM evidence e
        WHERE e.organization_id = o.id
          AND e.evidence_type = 'specialty'
        ORDER BY e.id DESC
        LIMIT 1
      ) AS specialtyLabel,
      o.state AS state
    FROM organizations o
    INNER JOIN organization_sources os
      ON os.organization_id = o.id
     AND os.id = (
       SELECT MAX(os2.id)
       FROM organization_sources os2
       WHERE os2.organization_id = o.id
         AND os2.source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery')
     )
    WHERE (o.website_url IS NULL OR o.website_url = '')
      AND (o.instagram_url IS NULL OR o.instagram_url = '')
      AND (o.primary_email IS NULL OR o.primary_email = '')
      AND (
        EXISTS (
          SELECT 1
          FROM evidence e2
          WHERE e2.organization_id = o.id
            AND e2.evidence_type = 'registry_office_name'
            AND e2.value IS NOT NULL
            AND e2.value != ''
        )
        OR UPPER(o.canonical_name) LIKE '%ADVOGADOS%'
        OR UPPER(o.canonical_name) LIKE '%ADVOCACIA%'
        OR UPPER(o.canonical_name) LIKE '%SOCIEDADE%'
      )
      AND NOT EXISTS (
        SELECT 1
        FROM llm_review_runs lr
        WHERE lr.organization_id = o.id
          AND lr.tool_name IN ('codex_exec_official_match', 'gemini_exec_official_match')
          AND lr.started_at >= ?
      )
    ORDER BY
      CASE WHEN o.state = 'SP' THEN 0 ELSE 1 END,
      o.source_confidence DESC,
      o.updated_at ASC
    LIMIT ?
  `).all(retryAfterIso, limit) as CodexFallbackSeed[]
}

export function listGeminiEmailSeeds(
  db: DatabaseSync,
  limit: number,
  retryAfterIso: string
): GeminiEmailSeed[] {
  return db.prepare(`
    SELECT
      o.id AS organizationId,
      os.external_id AS externalId,
      COALESCE(
        (
          SELECT e.value
          FROM evidence e
          WHERE e.organization_id = o.id
            AND e.evidence_type IN ('official_office_name', 'registry_office_name')
          ORDER BY e.id DESC
          LIMIT 1
        ),
        o.canonical_name
      ) AS canonicalName,
      o.city AS city,
      (
        SELECT e.value
        FROM evidence e
        WHERE e.organization_id = o.id
          AND e.evidence_type IN ('official_office_name', 'registry_office_name')
        ORDER BY e.id DESC
        LIMIT 1
      ) AS officeName,
      o.state AS state,
      o.website_url AS websiteUrl,
      o.instagram_url AS instagramUrl
    FROM organizations o
    INNER JOIN organization_sources os
      ON os.organization_id = o.id
     AND os.id = (
       SELECT MAX(os2.id)
       FROM organization_sources os2
       WHERE os2.organization_id = o.id
         AND os2.source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery')
     )
    WHERE (o.primary_email IS NULL OR o.primary_email = '')
      AND (
        (o.website_url IS NOT NULL AND o.website_url != '')
        OR (o.instagram_url IS NOT NULL AND o.instagram_url != '')
      )
      AND NOT EXISTS (
        SELECT 1
        FROM llm_review_runs lr
        WHERE lr.organization_id = o.id
          AND lr.tool_name = 'gemini_email_enricher'
          AND lr.started_at >= ?
      )
      AND (
        SELECT COUNT(*)
        FROM llm_review_runs lr2
        WHERE lr2.organization_id = o.id
          AND lr2.tool_name IN ('gemini_email_enricher', 'gemini_email_premium_enricher')
          AND lr2.result_found = 0
      ) < 3
    ORDER BY
      o.source_confidence DESC,
      o.updated_at ASC
    LIMIT ?
  `).all(retryAfterIso, limit) as GeminiEmailSeed[]
}

export function listPremiumGeminiEmailSeeds(
  db: DatabaseSync,
  limit: number,
  retryAfterIso: string
): GeminiEmailSeed[] {
  return db.prepare(`
    SELECT
      o.id AS organizationId,
      os.external_id AS externalId,
      COALESCE(
        (
          SELECT e.value
          FROM evidence e
          WHERE e.organization_id = o.id
            AND e.evidence_type IN ('official_office_name', 'registry_office_name')
          ORDER BY e.id DESC
          LIMIT 1
        ),
        o.canonical_name
      ) AS canonicalName,
      o.city AS city,
      (
        SELECT e.value
        FROM evidence e
        WHERE e.organization_id = o.id
          AND e.evidence_type IN ('official_office_name', 'registry_office_name')
        ORDER BY e.id DESC
        LIMIT 1
      ) AS officeName,
      o.state AS state,
      o.website_url AS websiteUrl,
      o.instagram_url AS instagramUrl
    FROM organizations o
    INNER JOIN organization_sources os
      ON os.organization_id = o.id
     AND os.id = (
       SELECT MAX(os2.id)
       FROM organization_sources os2
       WHERE os2.organization_id = o.id
         AND os2.source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery')
     )
    WHERE (o.primary_email IS NULL OR o.primary_email = '')
      AND o.website_url IS NOT NULL
      AND o.website_url != ''
      AND o.status IN ('needs_manual_review', 'ready_for_review')
      AND o.source_confidence >= 0.72
      AND (
        o.instagram_url IS NOT NULL
        OR EXISTS (
          SELECT 1
          FROM evidence e
          WHERE e.organization_id = o.id
            AND e.evidence_type IN ('official_office_name', 'registry_office_name')
            AND (
              UPPER(e.value) LIKE '%ADVOGADOS%'
              OR UPPER(e.value) LIKE '%ADVOCACIA%'
              OR UPPER(e.value) LIKE '%SOCIEDADE%'
              OR UPPER(e.value) LIKE '%JURIDIC%'
            )
        )
      )
      AND NOT EXISTS (
        SELECT 1
        FROM llm_review_runs lr
        WHERE lr.organization_id = o.id
          AND lr.tool_name = 'gemini_email_premium_enricher'
          AND lr.started_at >= ?
      )
      AND (
        SELECT COUNT(*)
        FROM llm_review_runs lr2
        WHERE lr2.organization_id = o.id
          AND lr2.tool_name IN ('gemini_email_enricher', 'gemini_email_premium_enricher')
          AND lr2.result_found = 0
      ) < 3
    ORDER BY
      CASE WHEN o.instagram_url IS NOT NULL AND o.instagram_url != '' THEN 0 ELSE 1 END,
      o.source_confidence DESC,
      o.updated_at ASC
    LIMIT ?
  `).all(retryAfterIso, limit) as GeminiEmailSeed[]
}

export function upsertGeminiEmailMatch(
  db: DatabaseSync,
  organizationId: string,
  email: string,
  sourceUrl: string,
  nowIso: string,
  options: {
    evidenceType?: string
    sourceChannel?: string
  } = {}
): void {
  db.prepare(`
    UPDATE organizations
    SET primary_email = ?,
        status = CASE
          WHEN website_url IS NOT NULL AND website_url != '' THEN 'ready_for_review'
          ELSE 'needs_manual_review'
        END,
        updated_at = ?
    WHERE id = ? AND (primary_email IS NULL OR primary_email = '')
  `).run(email, nowIso, organizationId)
  upsertEvidenceRecord(
    db,
    organizationId,
    options.evidenceType ?? 'gemini_email',
    email,
    sourceUrl,
    options.sourceChannel ?? 'gemini_email_enricher',
    nowIso
  )
}

export function createLlmReviewRun(
  db: DatabaseSync,
  input: LlmReviewRunRecordInput,
  nowIso: string
): number {
  const result = db.prepare(`
    INSERT INTO llm_review_runs (
      provider,
      tool_name,
      session_id,
      thread_id,
      search_run_id,
      organization_id,
      model,
      status,
      prompt_text,
      started_at,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, NULL, ?, ?, ?, 'running', ?, ?, ?, ?)
  `).run(
    input.provider,
    input.toolName,
    input.sessionId,
    input.searchRunId ?? null,
    input.organizationId ?? null,
    input.model,
    input.promptText ?? null,
    nowIso,
    nowIso,
    nowIso
  )

  return Number(result.lastInsertRowid)
}

export function completeLlmReviewRun(
  db: DatabaseSync,
  llmReviewRunId: number,
  input: LlmReviewRunCompletionInput
): void {
  db.prepare(`
    UPDATE llm_review_runs
    SET thread_id = COALESCE(?, thread_id),
        status = ?,
        input_tokens = ?,
        cached_input_tokens = ?,
        output_tokens = ?,
        estimated_credits = ?,
        result_found = ?,
        response_json = ?,
        notes = ?,
        finished_at = ?,
        updated_at = ?
    WHERE id = ?
  `).run(
    input.threadId ?? null,
    input.status,
    input.inputTokens ?? 0,
    input.cachedInputTokens ?? 0,
    input.outputTokens ?? 0,
    input.estimatedCredits ?? 0,
    input.resultFound ? 1 : 0,
    input.responseJson ?? null,
    input.notes ?? null,
    input.finishedAt,
    input.finishedAt,
    llmReviewRunId
  )
}

export function failLlmReviewRun(
  db: DatabaseSync,
  llmReviewRunId: number,
  finishedAt: string,
  notes?: string | null,
  threadId?: string | null
): void {
  completeLlmReviewRun(db, llmReviewRunId, {
    finishedAt,
    notes,
    responseJson: null,
    resultFound: false,
    status: 'failed',
    threadId: threadId ?? null,
  })
}

export function upsertEmailCampaign(db: DatabaseSync, input: EmailCampaignRecordInput, nowIso: string): void {
  const existing = db.prepare('SELECT id FROM email_campaigns WHERE id = ?').get(input.id) as OrganizationIdRow | undefined

  if (existing) {
    db.prepare(`
      UPDATE email_campaigns
      SET lead_campaign_id = ?,
          name = ?,
          from_email = ?,
          reply_to_email = ?,
          timezone = ?,
          cadence_minutes = ?,
          planned_start_at = ?,
          status = ?,
          notes = ?,
          updated_at = ?
      WHERE id = ?
    `).run(
      input.leadCampaignId,
      input.name,
      input.fromEmail,
      input.replyToEmail ?? null,
      input.timezone ?? 'America/Sao_Paulo',
      input.cadenceMinutes ?? 10,
      input.plannedStartAt ?? null,
      input.status ?? 'draft',
      input.notes ?? null,
      nowIso,
      input.id
    )

    return
  }

  db.prepare(`
    INSERT INTO email_campaigns (
      id,
      lead_campaign_id,
      name,
      from_email,
      reply_to_email,
      timezone,
      cadence_minutes,
      planned_start_at,
      status,
      notes,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.id,
    input.leadCampaignId,
    input.name,
    input.fromEmail,
    input.replyToEmail ?? null,
    input.timezone ?? 'America/Sao_Paulo',
    input.cadenceMinutes ?? 10,
    input.plannedStartAt ?? null,
    input.status ?? 'draft',
    input.notes ?? null,
    nowIso,
    nowIso
  )
}

export function getEmailCampaign(db: DatabaseSync, emailCampaignId: string): EmailCampaignRow | undefined {
  return db.prepare(`
    SELECT
      id,
      lead_campaign_id AS leadCampaignId,
      name,
      channel,
      from_email AS fromEmail,
      reply_to_email AS replyToEmail,
      timezone,
      cadence_minutes AS cadenceMinutes,
      planned_start_at AS plannedStartAt,
      status,
      notes,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM email_campaigns
    WHERE id = ?
  `).get(emailCampaignId) as EmailCampaignRow | undefined
}

export function upsertEmailJob(db: DatabaseSync, input: EmailJobRecordInput, nowIso: string): number {
  const existing = db.prepare(`
    SELECT id, status
    FROM email_jobs
    WHERE email_campaign_id = ? AND organization_id = ?
    LIMIT 1
  `).get(input.emailCampaignId, input.organizationId) as EmailJobIdentityRow | undefined

  if (existing) {
    const shouldPreserveDeliveryState = [
      'scheduled',
      'sent',
      'delivered',
      'opened',
      'clicked',
      'delivery_delayed',
    ].includes(existing.status)
    const nextStatus = shouldPreserveDeliveryState ? existing.status : input.status ?? 'draft'

    db.prepare(`
      UPDATE email_jobs
      SET to_email = CASE
            WHEN status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'delivery_delayed') THEN to_email
            ELSE ?
          END,
          sequence_step = CASE
            WHEN status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'delivery_delayed') THEN sequence_step
            ELSE ?
          END,
          source_job_id = CASE
            WHEN status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'delivery_delayed') THEN source_job_id
            ELSE ?
          END,
          subject = CASE
            WHEN status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'delivery_delayed') THEN subject
            ELSE ?
          END,
          html_body = CASE
            WHEN status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'delivery_delayed') THEN html_body
            ELSE ?
          END,
          text_body = CASE
            WHEN status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'delivery_delayed') THEN text_body
            ELSE ?
          END,
          personalization_json = CASE
            WHEN status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'delivery_delayed') THEN personalization_json
            ELSE ?
          END,
          scheduled_at = CASE
            WHEN status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'delivery_delayed') THEN scheduled_at
            ELSE ?
          END,
          resend_email_id = CASE
            WHEN status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'delivery_delayed') THEN resend_email_id
            ELSE ?
          END,
          resend_idempotency_key = CASE
            WHEN status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'delivery_delayed') THEN resend_idempotency_key
            ELSE ?
          END,
          status = ?,
          error_message = ?,
          updated_at = ?
      WHERE id = ?
  `).run(
      input.toEmail.trim().toLowerCase(),
      input.sequenceStep ?? 1,
      input.sourceJobId ?? null,
      input.subject,
      input.htmlBody,
      input.textBody ?? null,
      input.personalizationJson ?? null,
      input.scheduledAt ?? null,
      input.resendEmailId ?? null,
      input.resendIdempotencyKey ?? null,
      nextStatus,
      input.errorMessage ?? null,
      nowIso,
      existing.id
    )

    return existing.id
  }

  const result = db.prepare(`
    INSERT INTO email_jobs (
      email_campaign_id,
      organization_id,
      sequence_step,
      source_job_id,
      to_email,
      subject,
      html_body,
      text_body,
      personalization_json,
      scheduled_at,
      resend_email_id,
      resend_idempotency_key,
      status,
      error_message,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.emailCampaignId,
    input.organizationId,
    input.sequenceStep ?? 1,
    input.sourceJobId ?? null,
    input.toEmail.trim().toLowerCase(),
    input.subject,
    input.htmlBody,
    input.textBody ?? null,
    input.personalizationJson ?? null,
    input.scheduledAt ?? null,
    input.resendEmailId ?? null,
    input.resendIdempotencyKey ?? null,
    input.status ?? 'draft',
    input.errorMessage ?? null,
    nowIso,
    nowIso
  )

  return Number(result.lastInsertRowid)
}

export function listEmailJobsForCampaign(
  db: DatabaseSync,
  emailCampaignId: string,
  statuses?: string[]
): EmailJobRow[] {
  const validStatuses = statuses?.filter(Boolean) ?? []

  if (validStatuses.length === 0) {
    return db.prepare(`
      SELECT
        id,
        email_campaign_id AS emailCampaignId,
        organization_id AS organizationId,
        sequence_step AS sequenceStep,
        source_job_id AS sourceJobId,
        to_email AS toEmail,
        subject,
        html_body AS htmlBody,
        text_body AS textBody,
        personalization_json AS personalizationJson,
        scheduled_at AS scheduledAt,
        resend_email_id AS resendEmailId,
        resend_idempotency_key AS resendIdempotencyKey,
        status,
        error_message AS errorMessage,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM email_jobs
      WHERE email_campaign_id = ?
      ORDER BY id ASC
    `).all(emailCampaignId) as EmailJobRow[]
  }

  const placeholders = validStatuses.map(() => '?').join(', ')

  return db.prepare(`
    SELECT
      id,
      email_campaign_id AS emailCampaignId,
      organization_id AS organizationId,
      sequence_step AS sequenceStep,
      source_job_id AS sourceJobId,
      to_email AS toEmail,
      subject,
      html_body AS htmlBody,
      text_body AS textBody,
      personalization_json AS personalizationJson,
      scheduled_at AS scheduledAt,
      resend_email_id AS resendEmailId,
      resend_idempotency_key AS resendIdempotencyKey,
      status,
      error_message AS errorMessage,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM email_jobs
    WHERE email_campaign_id = ?
      AND status IN (${placeholders})
    ORDER BY id ASC
  `).all(emailCampaignId, ...validStatuses) as EmailJobRow[]
}

export function getEmailJobByResendEmailId(db: DatabaseSync, resendEmailId: string): EmailJobRow | undefined {
  return db.prepare(`
    SELECT
      id,
      email_campaign_id AS emailCampaignId,
      organization_id AS organizationId,
      sequence_step AS sequenceStep,
      source_job_id AS sourceJobId,
      to_email AS toEmail,
      subject,
      html_body AS htmlBody,
      text_body AS textBody,
      personalization_json AS personalizationJson,
      scheduled_at AS scheduledAt,
      resend_email_id AS resendEmailId,
      resend_idempotency_key AS resendIdempotencyKey,
      status,
      error_message AS errorMessage,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM email_jobs
    WHERE resend_email_id = ?
    LIMIT 1
  `).get(resendEmailId) as EmailJobRow | undefined
}

export function findLatestEmailJobByRecipient(db: DatabaseSync, recipientEmail: string): EmailJobRow | undefined {
  return db.prepare(`
    SELECT
      id,
      email_campaign_id AS emailCampaignId,
      organization_id AS organizationId,
      sequence_step AS sequenceStep,
      source_job_id AS sourceJobId,
      to_email AS toEmail,
      subject,
      html_body AS htmlBody,
      text_body AS textBody,
      personalization_json AS personalizationJson,
      scheduled_at AS scheduledAt,
      resend_email_id AS resendEmailId,
      resend_idempotency_key AS resendIdempotencyKey,
      status,
      error_message AS errorMessage,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM email_jobs
    WHERE to_email = ?
    ORDER BY COALESCE(scheduled_at, created_at) DESC, id DESC
    LIMIT 1
  `).get(recipientEmail.trim().toLowerCase()) as EmailJobRow | undefined
}

export function listFollowupEligibleEmailJobs(
  db: DatabaseSync,
  baseEmailCampaignId: string,
  scheduledBeforeIso: string,
  limit = 25
): EmailJobRow[] {
  return db.prepare(`
    SELECT
      ej.id,
      ej.email_campaign_id AS emailCampaignId,
      ej.organization_id AS organizationId,
      ej.sequence_step AS sequenceStep,
      ej.source_job_id AS sourceJobId,
      ej.to_email AS toEmail,
      ej.subject,
      ej.html_body AS htmlBody,
      ej.text_body AS textBody,
      ej.personalization_json AS personalizationJson,
      ej.scheduled_at AS scheduledAt,
      ej.resend_email_id AS resendEmailId,
      ej.resend_idempotency_key AS resendIdempotencyKey,
      ej.status,
      ej.error_message AS errorMessage,
      ej.created_at AS createdAt,
      ej.updated_at AS updatedAt
    FROM email_jobs ej
    WHERE ej.email_campaign_id = ?
      AND ej.scheduled_at IS NOT NULL
      AND ej.scheduled_at <= ?
      AND ej.status IN ('scheduled', 'sent', 'delivered', 'opened', 'clicked', 'delivery_delayed')
      AND NOT EXISTS (
        SELECT 1
        FROM email_responses er
        WHERE er.organization_id = ej.organization_id
          AND er.email_campaign_id = ej.email_campaign_id
      )
    ORDER BY ej.scheduled_at ASC
    LIMIT ?
  `).all(baseEmailCampaignId, scheduledBeforeIso, limit) as EmailJobRow[]
}

export function upsertEmailResponse(db: DatabaseSync, input: EmailResponseRecordInput, nowIso: string): number {
  const existing = db.prepare(`
    SELECT id
    FROM email_responses
    WHERE resend_inbound_email_id = ?
    LIMIT 1
  `).get(input.resendInboundEmailId) as EmailResponseIdentityRow | undefined

  if (existing) {
    return existing.id
  }

  const result = db.prepare(`
    INSERT INTO email_responses (
      resend_inbound_email_id,
      email_job_id,
      email_campaign_id,
      organization_id,
      from_email,
      to_email,
      subject,
      received_at,
      raw_payload_json,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.resendInboundEmailId,
    input.emailJobId ?? null,
    input.emailCampaignId ?? null,
    input.organizationId ?? null,
    input.fromEmail.trim().toLowerCase(),
    input.toEmail.trim().toLowerCase(),
    input.subject ?? null,
    input.receivedAt,
    input.rawPayloadJson ?? null,
    nowIso
  )

  return Number(result.lastInsertRowid)
}

export function listEmailResponsesForCampaign(db: DatabaseSync, emailCampaignId: string): EmailResponseRow[] {
  return db.prepare(`
    SELECT
      id,
      resend_inbound_email_id AS resendInboundEmailId,
      email_job_id AS emailJobId,
      email_campaign_id AS emailCampaignId,
      organization_id AS organizationId,
      from_email AS fromEmail,
      to_email AS toEmail,
      subject,
      received_at AS receivedAt,
      raw_payload_json AS rawPayloadJson,
      created_at AS createdAt
    FROM email_responses
    WHERE email_campaign_id = ?
    ORDER BY received_at DESC, id DESC
  `).all(emailCampaignId) as EmailResponseRow[]
}

export function updateEmailJobStatus(db: DatabaseSync, jobId: number, status: string, nowIso: string, errorMessage?: string | null): void {
  db.prepare(`
    UPDATE email_jobs
    SET status = ?,
        error_message = ?,
        updated_at = ?
    WHERE id = ?
  `).run(status, errorMessage ?? null, nowIso, jobId)
}

export function markEmailJobScheduled(
  db: DatabaseSync,
  jobId: number,
  scheduledAt: string,
  resendEmailId: string,
  resendIdempotencyKey: string,
  nowIso: string
): void {
  db.prepare(`
    UPDATE email_jobs
    SET scheduled_at = ?,
        resend_email_id = ?,
        resend_idempotency_key = ?,
        status = 'scheduled',
        error_message = NULL,
        updated_at = ?
    WHERE id = ?
  `).run(scheduledAt, resendEmailId, resendIdempotencyKey, nowIso, jobId)
}

export function markEmailJobFailed(db: DatabaseSync, jobId: number, errorMessage: string, nowIso: string): void {
  db.prepare(`
    UPDATE email_jobs
    SET status = 'failed',
        error_message = ?,
        updated_at = ?
    WHERE id = ?
  `).run(errorMessage, nowIso, jobId)
}

export function markEmailJobCanceled(db: DatabaseSync, jobId: number, nowIso: string, errorMessage?: string | null): void {
  db.prepare(`
    UPDATE email_jobs
    SET scheduled_at = NULL,
        resend_email_id = NULL,
        resend_idempotency_key = NULL,
        status = 'canceled',
        error_message = ?,
        updated_at = ?
    WHERE id = ?
  `).run(errorMessage ?? null, nowIso, jobId)
}

export function updateEmailCampaignStatus(db: DatabaseSync, emailCampaignId: string, status: string, nowIso: string): void {
  db.prepare(`
    UPDATE email_campaigns
    SET status = ?,
        updated_at = ?
    WHERE id = ?
  `).run(status, nowIso, emailCampaignId)
}

function upsertRegistryLead(
  db: DatabaseSync,
  lead: RegistryLeadRecord,
  searchRunId: number,
  nowIso: string
): string {
  const existingSource = db.prepare(`
    SELECT id, organization_id
    FROM organization_sources
    WHERE source_channel = ? AND external_id = ?
  `).get(lead.sourceChannel, lead.externalId) as OrganizationSourceRow | undefined

  let organizationId = existingSource?.organization_id

  if (!organizationId) {
    const existingOrganization = db.prepare(`
      SELECT id
      FROM organizations
      WHERE normalized_name = ? AND city = ? AND state = ?
      ORDER BY updated_at DESC
      LIMIT 1
    `).get(normalizeOrganizationName(lead.canonicalName), lead.city, lead.state) as OrganizationIdRow | undefined

    organizationId = existingOrganization?.id ?? buildOrganizationId(lead.externalId)
  }

  upsertOrganizationRecord(db, organizationId, lead, nowIso)
  upsertOrganizationSourceRecord(db, organizationId, lead, searchRunId, nowIso, existingSource)
  upsertEvidenceRecord(db, organizationId, 'specialty', lead.specialtyLabel, lead.sourceUrl, lead.sourceChannel, nowIso)
  upsertEvidenceRecord(db, organizationId, 'registry_role', lead.registryRoleLabel, lead.sourceUrl, lead.sourceChannel, nowIso)
  upsertEvidenceRecord(
    db,
    organizationId,
    'registry_provider',
    lead.registryProvider,
    lead.sourceUrl,
    lead.sourceChannel,
    nowIso
  )

  return organizationId
}

function upsertOrganizationRecord(db: DatabaseSync, organizationId: string, lead: RegistryLeadRecord, nowIso: string): void {
  const existingOrganization = db.prepare('SELECT id FROM organizations WHERE id = ?').get(organizationId) as
    | OrganizationIdRow
    | undefined

  if (existingOrganization) {
    db.prepare(`
      UPDATE organizations
      SET canonical_name = ?,
          normalized_name = ?,
          city = ?,
          state = ?,
          source_confidence = MAX(source_confidence, ?),
          updated_at = ?
      WHERE id = ?
    `).run(
      lead.canonicalName,
      normalizeOrganizationName(lead.canonicalName),
      lead.city,
      lead.state,
      lead.sourceConfidence,
      nowIso,
      organizationId
    )

    return
  }

    const name = lead.canonicalName || (lead as any).name || (lead as any).officeName || ''
    db.prepare(`
    INSERT INTO organizations (
      id,
      canonical_name,
      normalized_name,
      city,
      state,
      source_confidence,
      status,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'raw', ?, ?)
  `).run(
    String(organizationId),
    String(name),
    String(normalizeOrganizationName(name)),
    String(lead.city || ''),
    String(lead.state || ''),
    Number(lead.sourceConfidence || 0),
    String(nowIso),
    String(nowIso)
  )
}

function upsertOrganizationSourceRecord(
  db: DatabaseSync,
  organizationId: string,
  lead: RegistryLeadRecord,
  searchRunId: number,
  nowIso: string,
  existingSource?: OrganizationSourceRow
): void {
  const sourceTitle = `${lead.sourceTitlePrefix} - ${lead.canonicalName}`

  if (existingSource) {
    db.prepare(`
      UPDATE organization_sources
      SET search_run_id = ?,
          source_url = ?,
          source_title = ?,
          confidence = ?,
          raw_payload_json = ?,
          last_seen_at = ?
      WHERE id = ?
    `).run(
      searchRunId,
      lead.sourceUrl,
      sourceTitle,
      lead.sourceConfidence,
      lead.rawPayloadJson,
      nowIso,
      existingSource.id
    )

    return
  }

  db.prepare(`
    INSERT INTO organization_sources (
      organization_id,
      search_run_id,
      source_channel,
      source_type,
      external_id,
      source_url,
      source_title,
      confidence,
      raw_payload_json,
      first_seen_at,
      last_seen_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    String(organizationId),
    Number(searchRunId || 0),
    String(lead.sourceChannel || ''),
    String(lead.sourceType || ''),
    String(lead.externalId || ''),
    String(lead.sourceUrl || ''),
    String(sourceTitle || ''),
    Number(lead.sourceConfidence || 0),
    lead.rawPayloadJson ? String(lead.rawPayloadJson) : null,
    String(nowIso),
    String(nowIso)
  )
}

function upsertOfficialSiteOrganizationRecord(
  db: DatabaseSync,
  organizationId: string,
  lead: OfficialSiteEnrichment,
  nowIso: string
): void {
  const currentOrganization = db.prepare(`
    SELECT
      instagram_url AS instagramUrl,
      primary_email AS primaryEmail,
      primary_phone AS primaryPhone,
      primary_whatsapp AS primaryWhatsapp,
      status,
      website_url AS websiteUrl
    FROM organizations
    WHERE id = ?
  `).get(organizationId) as {
    instagramUrl: string | null
    primaryEmail: string | null
    primaryPhone: string | null
    primaryWhatsapp: string | null
    status: string
    websiteUrl: string | null
  } | undefined
  const isStrongOfficialMatch = lead.sourceConfidence >= 0.95
  const effectiveWebsiteUrl = lead.websiteUrl ?? currentOrganization?.websiteUrl ?? null
  const effectiveInstagramUrl = lead.instagramUrl ?? currentOrganization?.instagramUrl ?? null
  const effectivePrimaryEmail = lead.primaryEmail ?? currentOrganization?.primaryEmail ?? null
  const effectivePrimaryPhone = lead.primaryPhone ?? currentOrganization?.primaryPhone ?? null
  const effectivePrimaryWhatsapp = lead.primaryWhatsapp ?? currentOrganization?.primaryWhatsapp ?? null
  const hasSignals = Boolean(
    effectiveWebsiteUrl ||
    effectiveInstagramUrl ||
    effectivePrimaryEmail ||
    effectivePrimaryPhone ||
    effectivePrimaryWhatsapp
  )
  const nextStatus = isStrongOfficialMatch && effectiveWebsiteUrl && effectivePrimaryEmail
    ? 'ready_for_review'
    : hasSignals
      ? 'needs_manual_review'
      : currentOrganization?.status ?? 'raw'

  db.prepare(`
    UPDATE organizations
    SET website_url = COALESCE(?, website_url),
        website_domain = COALESCE(?, website_domain),
        instagram_url = COALESCE(?, instagram_url),
        primary_email = COALESCE(?, primary_email),
        primary_phone = COALESCE(?, primary_phone),
        primary_whatsapp = COALESCE(?, primary_whatsapp),
        source_confidence = MAX(source_confidence, ?),
        status = ?,
        updated_at = ?
    WHERE id = ?
  `).run(
    lead.websiteUrl,
    lead.websiteDomain,
    lead.instagramUrl ?? null,
    lead.primaryEmail ?? null,
    lead.primaryPhone ?? null,
    lead.primaryWhatsapp ?? null,
    lead.sourceConfidence,
    nextStatus,
    nowIso,
    organizationId
  )
}

function upsertOfficialSiteSourceRecord(
  db: DatabaseSync,
  organizationId: string,
  lead: OfficialSiteEnrichment,
  searchRunId: number,
  nowIso: string,
  existingSource?: OrganizationSourceRow
): void {
  const sourceTitle = lead.sourceTitle ?? `Official site - ${lead.canonicalName}`

  if (existingSource) {
    db.prepare(`
      UPDATE organization_sources
      SET search_run_id = ?,
          source_url = ?,
          source_title = ?,
          confidence = ?,
          raw_payload_json = ?,
          last_seen_at = ?
      WHERE id = ?
    `).run(
      searchRunId,
      lead.sourceUrl,
      sourceTitle,
      lead.sourceConfidence,
      lead.rawPayloadJson,
      nowIso,
      existingSource.id
    )

    return
  }

  db.prepare(`
    INSERT INTO organization_sources (
      organization_id,
      search_run_id,
      source_channel,
      source_type,
      external_id,
      source_url,
      source_title,
      confidence,
      raw_payload_json,
      first_seen_at,
      last_seen_at
    ) VALUES (?, ?, 'official_site', 'law_firm_profile_page', ?, ?, ?, ?, ?, ?, ?)
  `).run(
    organizationId,
    searchRunId,
    lead.externalId,
    lead.sourceUrl,
    sourceTitle,
    lead.sourceConfidence,
    lead.rawPayloadJson,
    nowIso,
    nowIso
  )
}

function upsertContactRecord(
  db: DatabaseSync,
  organizationId: string,
  contact: OfficialSiteEnrichment['contacts'][number],
  nowIso: string
): void {
  const normalizedValue = contact.contactType === 'email'
    ? contact.value.trim().toLowerCase()
    : contact.value.trim()

  db.prepare(`
    INSERT INTO contacts (
      organization_id,
      contact_type,
      value,
      label,
      source_channel,
      source_url,
      confidence,
      is_primary,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, 'official_site', ?, ?, ?, ?, ?)
    ON CONFLICT(organization_id, contact_type, value) DO UPDATE SET
      label = COALESCE(excluded.label, contacts.label),
      source_channel = excluded.source_channel,
      source_url = excluded.source_url,
      confidence = MAX(contacts.confidence, excluded.confidence),
      is_primary = MAX(contacts.is_primary, excluded.is_primary),
      updated_at = excluded.updated_at
  `).run(
    organizationId,
    contact.contactType,
    normalizedValue,
    contact.label ?? null,
    contact.sourceUrl,
    contact.confidence,
    contact.isPrimary ? 1 : 0,
    nowIso,
    nowIso
  )
}

function upsertEvidenceRecord(
  db: DatabaseSync,
  organizationId: string,
  evidenceType: string,
  value: string,
  sourceUrl: string,
  sourceChannel: string,
  nowIso: string
): void {
  const existingEvidence = db.prepare(`
    SELECT id
    FROM evidence
    WHERE organization_id = ? AND evidence_type = ? AND value = ? AND source_channel = ?
    LIMIT 1
  `).get(organizationId, evidenceType, value, sourceChannel) as EvidenceRow | undefined

  if (existingEvidence) {
    return
  }

  db.prepare(`
    INSERT INTO evidence (
      organization_id,
      evidence_type,
      value,
      source_channel,
      source_url,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(organizationId, evidenceType, value, sourceChannel, sourceUrl, nowIso)
}

function buildOrganizationId(seed: string): string {
  return `org_${createHash('sha1').update(seed).digest('hex').slice(0, 16)}`
}

function normalizeOrganizationName(value: string | undefined | null): string {
  if (!value) return ''
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]+/g, '')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .toUpperCase()
}

function migrateLeadEngineDatabase(db: DatabaseSync): void {
  const organizationColumns = db.prepare(`PRAGMA table_info(organizations)`).all() as Array<{ name: string }>
  const organizationColumnNames = new Set(organizationColumns.map((column) => column.name))

  if (!organizationColumnNames.has('instagram_url')) {
    db.exec(`ALTER TABLE organizations ADD COLUMN instagram_url TEXT`)
  }

  if (!organizationColumnNames.has('primary_whatsapp')) {
    db.exec(`ALTER TABLE organizations ADD COLUMN primary_whatsapp TEXT`)
  }

  if (!organizationColumnNames.has('email_validated_at')) {
    db.exec(`ALTER TABLE organizations ADD COLUMN email_validated_at TEXT`)
  }

  const emailJobColumns = db.prepare(`PRAGMA table_info(email_jobs)`).all() as Array<{ name: string }>
  const emailJobColumnNames = new Set(emailJobColumns.map((column) => column.name))

  if (!emailJobColumnNames.has('sequence_step')) {
    db.exec(`ALTER TABLE email_jobs ADD COLUMN sequence_step INTEGER NOT NULL DEFAULT 1`)
  }

  if (!emailJobColumnNames.has('source_job_id')) {
    db.exec(`ALTER TABLE email_jobs ADD COLUMN source_job_id INTEGER`)
  }

  if (!tableExists(db, 'llm_review_runs')) {
    db.exec(`
      CREATE TABLE llm_review_runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider TEXT NOT NULL,
        tool_name TEXT NOT NULL,
        session_id TEXT NOT NULL,
        thread_id TEXT,
        search_run_id INTEGER,
        organization_id TEXT,
        model TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'running',
        input_tokens INTEGER NOT NULL DEFAULT 0,
        cached_input_tokens INTEGER NOT NULL DEFAULT 0,
        output_tokens INTEGER NOT NULL DEFAULT 0,
        estimated_credits REAL NOT NULL DEFAULT 0,
        result_found INTEGER NOT NULL DEFAULT 0,
        prompt_text TEXT,
        response_json TEXT,
        notes TEXT,
        started_at TEXT NOT NULL,
        finished_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (search_run_id) REFERENCES search_runs(id),
        FOREIGN KEY (organization_id) REFERENCES organizations(id)
      )
    `)
  }

  const llmReviewColumns = db.prepare(`PRAGMA table_info(llm_review_runs)`).all() as Array<{ name: string }>
  const llmReviewColumnNames = new Set(llmReviewColumns.map((column) => column.name))

  if (!llmReviewColumnNames.has('search_run_id')) {
    db.exec(`ALTER TABLE llm_review_runs ADD COLUMN search_run_id INTEGER`)
  }

  if (!llmReviewColumnNames.has('result_found')) {
    db.exec(`ALTER TABLE llm_review_runs ADD COLUMN result_found INTEGER NOT NULL DEFAULT 0`)
  }

  if (!indexExists(db, 'idx_llm_review_runs_session')) {
    db.exec(`CREATE INDEX idx_llm_review_runs_session ON llm_review_runs(session_id, started_at DESC)`)
  }

  if (!indexExists(db, 'idx_llm_review_runs_organization')) {
    db.exec(`CREATE INDEX idx_llm_review_runs_organization ON llm_review_runs(organization_id, started_at DESC)`)
  }
}

function ensureLeadEngineSchema(db: DatabaseSync, schemaPath: string): void {
  if (
    tableExists(db, 'campaigns') &&
    tableExists(db, 'organizations') &&
    tableExists(db, 'search_runs') &&
    tableExists(db, 'organization_sources') &&
    tableExists(db, 'email_jobs')
  ) {
    return
  }

  db.exec(readFileSync(schemaPath, 'utf8'))
}

function tableExists(db: DatabaseSync, tableName: string): boolean {
  const row = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table' AND name = ?
    LIMIT 1
  `).get(tableName) as { name?: string } | undefined

  return row?.name === tableName
}

function indexExists(db: DatabaseSync, indexName: string): boolean {
  const row = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'index' AND name = ?
    LIMIT 1
  `).get(indexName) as { name?: string } | undefined

  return row?.name === indexName
}

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { openLeadEngineDatabase } from '../../lib/outbound/leadEngineStore.ts'

type SocialSellingSeedRow = {
  city: string | null
  instagramUrl: string
  leadEngineStatus: string
  notionStage: string
  organizationId: string
  profileName: string
  sourceChannels: string[]
  sourceConfidence: number
  state: string | null
  updatedAt: string
  websiteUrl: string | null
  primaryEmail: string | null
  primaryPhone: string | null
  primaryWhatsapp: string | null
}

const DEFAULT_NOTION_EXPORT_LIMIT = 2000

const { values } = parseArgs({
  options: {
    includeIgnored: { type: 'boolean', default: false },
    limit: { type: 'string' },
  },
})

const includeIgnored = values.includeIgnored
const limit = values.limit ? Number.parseInt(values.limit, 10) : DEFAULT_NOTION_EXPORT_LIMIT
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')

mkdirSync(outputDirectory, { recursive: true })

const db = openLeadEngineDatabase()

const rows = db.prepare(`
  SELECT
    o.id AS organizationId,
    o.canonical_name AS canonicalName,
    o.city AS city,
    o.state AS state,
    o.website_url AS websiteUrl,
    o.instagram_url AS instagramUrl,
    o.primary_email AS primaryEmail,
    o.primary_phone AS primaryPhone,
    o.primary_whatsapp AS primaryWhatsapp,
    o.status AS leadEngineStatus,
    o.source_confidence AS sourceConfidence,
    o.updated_at AS updatedAt,
    COALESCE(GROUP_CONCAT(DISTINCT os.source_channel), '') AS sourceChannels
  FROM organizations o
  LEFT JOIN organization_sources os
    ON os.organization_id = o.id
  WHERE o.instagram_url IS NOT NULL
    AND o.instagram_url != ''
    AND (? = 1 OR o.status NOT IN ('ignored_non_icp', 'opt_out', 'email_invalid'))
    AND NOT EXISTS (
      SELECT 1
      FROM suppressions s
      WHERE s.organization_id = o.id
        AND s.suppression_type IN ('opt_out', 'email_invalid')
    )
  GROUP BY o.id
  ORDER BY
    CASE
      WHEN o.status = 'ready_for_review' THEN 0
      WHEN o.status = 'raw' THEN 1
      WHEN o.status = 'needs_manual_review' THEN 2
      ELSE 3
    END,
    o.source_confidence DESC,
    o.updated_at DESC
  LIMIT COALESCE(?, -1)
`).all(includeIgnored ? 1 : 0, limit) as Array<{
  organizationId: string
  canonicalName: string
  city: string | null
  state: string | null
  websiteUrl: string | null
  instagramUrl: string
  primaryEmail: string | null
  primaryPhone: string | null
  primaryWhatsapp: string | null
  leadEngineStatus: string
  sourceConfidence: number
  updatedAt: string
  sourceChannels: string
}>

const seeds: SocialSellingSeedRow[] = rows
  .filter((row) => hasValidInstagramHandle(row.instagramUrl))
  .map((row) => ({
    city: row.city,
    instagramUrl: row.instagramUrl,
    leadEngineStatus: row.leadEngineStatus,
    notionStage: 'Seguir',
    organizationId: row.organizationId,
    profileName: buildProfileName(row.canonicalName, row.instagramUrl),
    sourceChannels: row.sourceChannels ? row.sourceChannels.split(',').filter(Boolean) : [],
    sourceConfidence: row.sourceConfidence,
    state: row.state,
    updatedAt: row.updatedAt,
    websiteUrl: row.websiteUrl,
    primaryEmail: row.primaryEmail,
    primaryPhone: row.primaryPhone,
    primaryWhatsapp: row.primaryWhatsapp,
  }))

const jsonPath = join(outputDirectory, 'social-selling-instagram-leads.json')
const csvPath = join(outputDirectory, 'social-selling-instagram-leads.csv')

writeFileSync(jsonPath, `${JSON.stringify(seeds, null, 2)}\n`)
writeFileSync(csvPath, `${toCsv(seeds)}\n`)
db.close()

console.log(
  JSON.stringify(
    {
      csvPath,
      exportedRows: seeds.length,
      includeIgnored,
      jsonPath,
      limit,
    },
    null,
    2
  )
)

function buildProfileName(canonicalName: string, instagramUrl: string): string {
  const handle = extractInstagramHandle(instagramUrl)
  return handle ? `${canonicalName} (@${handle})` : canonicalName
}

function extractInstagramHandle(instagramUrl: string): string | null {
  try {
    const url = new URL(instagramUrl)
    const handle = url.pathname.split('/').filter(Boolean)[0]
    return handle || null
  } catch {
    return null
  }
}

function hasValidInstagramHandle(instagramUrl: string): boolean {
  const handle = extractInstagramHandle(instagramUrl)
  if (!handle) {
    return false
  }

  return !new Set(['accounts', 'explore', 'p', 'reel', 'reels', 'share', 'stories', 'tv']).has(handle)
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) {
    return ''
  }

  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]

  for (const row of rows) {
    lines.push(
      headers
        .map((header) => {
          const value = row[header]
          const normalized = Array.isArray(value) ? value.join('|') : value
          return csvCell(normalized)
        })
        .join(',')
    )
  }

  return lines.join('\n')
}

function csvCell(value: unknown): string {
  const raw = value === null || value === undefined ? '' : String(value)
  const escaped = raw.replace(/"/g, '""')
  return `"${escaped}"`
}

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import {
  completeSearchRun,
  createSearchRun,
  failSearchRun,
  openLeadEngineDatabase,
  upsertCampaign,
  upsertOabRegistryLead,
} from '../../lib/outbound/leadEngineStore.ts'
import { fetchOabPrRegistryLeads } from '../../lib/outbound/oabPrRegistry.ts'
import { fetchOabSpRegistryLeads } from '../../lib/outbound/oabSpRegistry.ts'

const PR_CITY_CONFIG = [
  { city: 'CURITIBA', campaignId: 'camp-advocacia-trabalhista-curitiba', campaignName: 'Advocacia Trabalhista Curitiba' },
  { city: 'LONDRINA', campaignId: 'camp-advocacia-trabalhista-londrina', campaignName: 'Advocacia Trabalhista Londrina' },
  { city: 'MARINGA', campaignId: 'camp-advocacia-trabalhista-maringa', campaignName: 'Advocacia Trabalhista Maringa' },
  { city: 'CASCAVEL', campaignId: 'camp-advocacia-trabalhista-cascavel', campaignName: 'Advocacia Trabalhista Cascavel' },
  { city: 'PONTA GROSSA', campaignId: 'camp-advocacia-trabalhista-ponta-grossa', campaignName: 'Advocacia Trabalhista Ponta Grossa' },
  { city: 'FOZ DO IGUACU', campaignId: 'camp-advocacia-trabalhista-foz-do-iguacu', campaignName: 'Advocacia Trabalhista Foz do Iguacu' },
  {
    city: 'SAO JOSE DOS PINHAIS',
    campaignId: 'camp-advocacia-trabalhista-sao-jose-dos-pinhais',
    campaignName: 'Advocacia Trabalhista Sao Jose dos Pinhais',
  },
  { city: 'COLOMBO', campaignId: 'camp-advocacia-trabalhista-colombo', campaignName: 'Advocacia Trabalhista Colombo' },
  { city: 'GUARAPUAVA', campaignId: 'camp-advocacia-trabalhista-guarapuava', campaignName: 'Advocacia Trabalhista Guarapuava' },
  { city: 'PARANAGUA', campaignId: 'camp-advocacia-trabalhista-paranagua', campaignName: 'Advocacia Trabalhista Paranagua' },
  { city: 'TOLEDO', campaignId: 'camp-advocacia-trabalhista-toledo', campaignName: 'Advocacia Trabalhista Toledo' },
  { city: 'UMUARAMA', campaignId: 'camp-advocacia-trabalhista-umuarama', campaignName: 'Advocacia Trabalhista Umuarama' },
  { city: 'APUCARANA', campaignId: 'camp-advocacia-trabalhista-apucarana', campaignName: 'Advocacia Trabalhista Apucarana' },
  { city: 'CAMPO LARGO', campaignId: 'camp-advocacia-trabalhista-campo-largo', campaignName: 'Advocacia Trabalhista Campo Largo' },
] as const

const DEFAULT_SP_PREFIXES = [
  'ALME',
  'ANDR',
  'ANTO',
  'BRUN',
  'CARL',
  'COST',
  'DANI',
  'EDUA',
  'FERN',
  'GABR',
  'JOSE',
  'MARI',
  'PAUL',
  'PEDR',
  'RAFA',
  'RODR',
  'SANT',
  'SILV',
  'SOUZ',
] as const

const SP_CAMPAIGN = {
  cityId: '617',
  cityName: 'SAO PAULO',
  campaignId: 'camp-advocacia-sao-paulo-oabsp',
  campaignName: 'Advocacia Sao Paulo',
}

const { values } = parseArgs({
  options: {
    includeSp: { type: 'boolean' },
    prMaxPerCity: { type: 'string' },
    spPrefixes: { type: 'string' },
    targetOrganizations: { type: 'string' },
  },
})

const targetOrganizations = values.targetOrganizations ? Number.parseInt(values.targetOrganizations, 10) : 200
const prMaxPerCity = values.prMaxPerCity ? Number.parseInt(values.prMaxPerCity, 10) : 18
const includeSp = values.includeSp ?? true
const spPrefixes = values.spPrefixes
  ? values.spPrefixes
      .split(',')
      .map((prefix) => prefix.trim().toUpperCase())
      .filter(Boolean)
  : [...DEFAULT_SP_PREFIXES]
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')
const summaryPath = join(outputDirectory, 'bulk-lead-discovery-summary.json')

void main()

async function main() {
  mkdirSync(outputDirectory, { recursive: true })

  const db = openLeadEngineDatabase()
  const startedAt = new Date().toISOString()
  const summary: Record<string, unknown> = {
    startedAt,
    includeSp,
    prMaxPerCity,
    spPrefixes,
    targetOrganizations,
    initialOrganizations: getOrganizationCount(db),
    prRuns: [] as unknown[],
    spRuns: [] as unknown[],
  }

  try {
    for (const config of PR_CITY_CONFIG) {
      const before = getOrganizationCount(db)

      if (before >= targetOrganizations) {
        break
      }

      const result = await runPrCityDiscovery(db, config, prMaxPerCity)
      const after = getOrganizationCount(db)

      ;(summary.prRuns as unknown[]).push({
        ...result,
        organizationsAfter: after,
        organizationsBefore: before,
      })
    }

    if (includeSp) {
      for (const prefix of spPrefixes) {
        const before = getOrganizationCount(db)

        if (before >= targetOrganizations && (summary.spRuns as unknown[]).length > 0) {
          break
        }

        const result = await runSpPrefixDiscovery(db, prefix)
        const after = getOrganizationCount(db)

        ;(summary.spRuns as unknown[]).push({
          ...result,
          organizationsAfter: after,
          organizationsBefore: before,
        })
      }
    }

    Object.assign(summary, buildFinalCounts(db), {
      finishedAt: new Date().toISOString(),
      summaryPath,
    })

    writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`)
    console.log(JSON.stringify(summary, null, 2))
  } finally {
    db.close()
  }
}

async function runPrCityDiscovery(
  db: ReturnType<typeof openLeadEngineDatabase>,
  config: (typeof PR_CITY_CONFIG)[number],
  maxResults: number
) {
  const nowIso = new Date().toISOString()

  upsertCampaign(
    db,
    {
      id: config.campaignId,
      name: config.campaignName,
      niche: 'advocacia-trabalhista',
      city: config.city,
      sizeRange: `solo-${maxResults}`,
      notes: 'Bulk OAB PR discovery run for database growth.',
      status: 'active',
    },
    nowIso
  )

  const searchRunId = createSearchRun(
    db,
    {
      campaignId: config.campaignId,
      sourceChannel: 'oab_registry',
      toolName: 'oab_pr_bulk_directory',
      queryText: `cidade=${config.city}&especialidade=6&situacao=A&max=${maxResults}`,
      notes: 'Bulk discovery pass over OAB PR public directory.',
    },
    nowIso
  )

  try {
    const result = await fetchOabPrRegistryLeads({
      campaignId: config.campaignId,
      campaignName: config.campaignName,
      city: config.city,
      specialtyCode: '6',
      specialtyLabel: 'Trabalhista',
      situation: 'A',
      state: 'PR',
      maxResults,
      sizeRange: `solo-${maxResults}`,
      notes: 'Bulk OAB PR discovery run for database growth.',
    })

    for (const lead of result.leads) {
      upsertOabRegistryLead(db, lead, searchRunId, new Date().toISOString())
    }

    completeSearchRun(
      db,
      searchRunId,
      result.leads.length,
      new Date().toISOString(),
      'Bulk OAB PR city discovery completed.'
    )

    return {
      campaignId: config.campaignId,
      city: config.city,
      resultCount: result.leads.length,
      searchRunId,
      source: 'oab_pr',
    }
  } catch (error) {
    failSearchRun(
      db,
      searchRunId,
      new Date().toISOString(),
      error instanceof Error ? error.message : 'Unknown OAB PR bulk discovery error.'
    )
    throw error
  }
}

async function runSpPrefixDiscovery(db: ReturnType<typeof openLeadEngineDatabase>, prefix: string) {
  const nowIso = new Date().toISOString()

  upsertCampaign(
    db,
    {
      id: SP_CAMPAIGN.campaignId,
      name: SP_CAMPAIGN.campaignName,
      niche: 'advocacia',
      city: SP_CAMPAIGN.cityName,
      sizeRange: 'bulk-prefix-discovery',
      notes: 'Bulk OAB SP prefix search for Sao Paulo lead discovery.',
      status: 'active',
    },
    nowIso
  )

  const searchRunId = createSearchRun(
    db,
    {
      campaignId: SP_CAMPAIGN.campaignId,
      sourceChannel: 'oab_registry',
      toolName: 'oab_sp_prefix_search',
      queryText: `prefix=${prefix}&cityId=${SP_CAMPAIGN.cityId}`,
      notes: 'Public OAB SP consultation via session-backed name prefix search.',
    },
    nowIso
  )

  try {
    const result = await fetchOabSpRegistryLeads({
      cityId: SP_CAMPAIGN.cityId,
      cityName: SP_CAMPAIGN.cityName,
      namePrefixes: [prefix],
      specialtyLabel: 'Advocacia',
      specialtyCode: 'advocacia',
    })

    for (const lead of result.leads) {
      upsertOabRegistryLead(db, lead, searchRunId, new Date().toISOString())
    }

    completeSearchRun(
      db,
      searchRunId,
      result.leads.length,
      new Date().toISOString(),
      result.querySummaries.join(' | ') || 'Bulk OAB SP prefix discovery completed.'
    )

    return {
      campaignId: SP_CAMPAIGN.campaignId,
      city: SP_CAMPAIGN.cityName,
      prefix,
      resultCount: result.leads.length,
      searchRunId,
      source: 'oab_sp',
    }
  } catch (error) {
    failSearchRun(
      db,
      searchRunId,
      new Date().toISOString(),
      error instanceof Error ? error.message : 'Unknown OAB SP prefix discovery error.'
    )
    throw error
  }
}

function getOrganizationCount(db: ReturnType<typeof openLeadEngineDatabase>): number {
  const row = db.prepare('SELECT COUNT(*) AS count FROM organizations').get() as { count: number }
  return Number(row.count ?? 0)
}

function buildFinalCounts(db: ReturnType<typeof openLeadEngineDatabase>) {
  const row = db
    .prepare(`
      SELECT
        COUNT(*) AS organizations,
        SUM(CASE WHEN primary_email IS NOT NULL AND primary_email != '' THEN 1 ELSE 0 END) AS withEmail,
        SUM(CASE WHEN instagram_url IS NOT NULL AND instagram_url != '' THEN 1 ELSE 0 END) AS withInstagram,
        SUM(CASE WHEN primary_whatsapp IS NOT NULL AND primary_whatsapp != '' THEN 1 ELSE 0 END) AS withWhatsapp
      FROM organizations
    `)
    .get() as {
      organizations: number
      withEmail: number | null
      withInstagram: number | null
      withWhatsapp: number | null
    }

  return {
    organizations: Number(row.organizations ?? 0),
    withEmail: Number(row.withEmail ?? 0),
    withInstagram: Number(row.withInstagram ?? 0),
    withWhatsapp: Number(row.withWhatsapp ?? 0),
  }
}

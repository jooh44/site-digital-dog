import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { isBlockedEmailDomain, isLikelyOfficialWebsiteUrl } from '../../lib/outbound/domainQuality.ts'
import {
  completeLlmReviewRun,
  completeSearchRun,
  createLlmReviewRun,
  createSearchRun,
  failLlmReviewRun,
  failSearchRun,
  listCodexFallbackSeeds,
  openLeadEngineDatabase,
  upsertCampaign,
  upsertCodexFallbackMatch,
  upsertOfficialSiteLead,
  upsertOabRegistryLead,
  upsertWebSearchMatch,
} from '../../lib/outbound/leadEngineStore.ts'
import { enrichOrganizationViaCodexFallback, estimateCodexCredits } from '../../lib/outbound/codexFallback.ts'
import { enrichOrganizationViaGoogleSearch, runGoogleSearchQuery } from '../../lib/outbound/googleWebSearch.ts'
import { enrichOfficialSiteSeed } from '../../lib/outbound/officialSite.ts'
import { fetchOabSpRegistryLeads } from '../../lib/outbound/oabSpRegistry.ts'
import type { OfficialSiteSeed, WebSearchSeed } from '../../lib/outbound/types.ts'

const SP_CAMPAIGN = {
  cityId: '617',
  cityName: 'SAO PAULO',
  campaignId: 'camp-advocacia-sao-paulo-oabsp',
  campaignName: 'Advocacia Sao Paulo',
} as const

const OPS_CAMPAIGN = {
  campaignId: 'ops-auto-capture',
  campaignName: 'Ops Auto Capture',
  city: 'MULTI',
} as const

type DirectDiscoveryCity = {
  city: string
  label: string
  state: string
}

type DirectDiscoveryQuery = DirectDiscoveryCity & {
  query: string
}

const DIRECT_DISCOVERY_CITIES: DirectDiscoveryCity[] = [
  { city: 'SAO PAULO', label: 'São Paulo', state: 'SP' },
  { city: 'CAMPINAS', label: 'Campinas', state: 'SP' },
  { city: 'RIBEIRAO PRETO', label: 'Ribeirão Preto', state: 'SP' },
  { city: 'SOROCABA', label: 'Sorocaba', state: 'SP' },
  { city: 'SAO JOSE DOS CAMPOS', label: 'São José dos Campos', state: 'SP' },
  { city: 'SANTOS', label: 'Santos', state: 'SP' },
  { city: 'RIO DE JANEIRO', label: 'Rio de Janeiro', state: 'RJ' },
  { city: 'NITEROI', label: 'Niterói', state: 'RJ' },
  { city: 'BELO HORIZONTE', label: 'Belo Horizonte', state: 'MG' },
  { city: 'UBERLANDIA', label: 'Uberlândia', state: 'MG' },
  { city: 'CURITIBA', label: 'Curitiba', state: 'PR' },
  { city: 'LONDRINA', label: 'Londrina', state: 'PR' },
  { city: 'MARINGA', label: 'Maringá', state: 'PR' },
  { city: 'PORTO ALEGRE', label: 'Porto Alegre', state: 'RS' },
  { city: 'CAXIAS DO SUL', label: 'Caxias do Sul', state: 'RS' },
  { city: 'FLORIANOPOLIS', label: 'Florianópolis', state: 'SC' },
  { city: 'JOINVILLE', label: 'Joinville', state: 'SC' },
  { city: 'BRASILIA', label: 'Brasília', state: 'DF' },
  { city: 'GOIANIA', label: 'Goiânia', state: 'GO' },
  { city: 'SALVADOR', label: 'Salvador', state: 'BA' },
  { city: 'RECIFE', label: 'Recife', state: 'PE' },
  { city: 'FORTALEZA', label: 'Fortaleza', state: 'CE' },
  { city: 'VITORIA', label: 'Vitória', state: 'ES' },
  { city: 'CUIABA', label: 'Cuiabá', state: 'MT' },
  { city: 'CAMPO GRANDE', label: 'Campo Grande', state: 'MS' },
  { city: 'MANAUS', label: 'Manaus', state: 'AM' },
  { city: 'BELEM', label: 'Belém', state: 'PA' },
  { city: 'SAO LUIS', label: 'São Luís', state: 'MA' },
  { city: 'NATAL', label: 'Natal', state: 'RN' },
  { city: 'JOAO PESSOA', label: 'João Pessoa', state: 'PB' },
]

const DIRECT_WEB_DISCOVERY_QUERIES: DirectDiscoveryQuery[] = DIRECT_DISCOVERY_CITIES.flatMap((city) => ([
  { ...city, query: `site:adv.br "contato@" "${city.label}" "advogados"` },
  { ...city, query: `site:com.br "advocacia" "${city.label}" "contato"` },
  { ...city, query: `site:adv.br "direito trabalhista" "${city.label}" "contato"` },
  { ...city, query: `site:adv.br "direito previdenciário" "${city.label}" "contato"` },
  { ...city, query: `site:adv.br "sociedade de advogados" "${city.label}" "contato"` },
]))

const DEFAULT_SP_PREFIXES = [
  'ABRE',
  'AGUI',
  'ALBU',
  'ALCA',
  'ALME',
  'ALVE',
  'AMAR',
  'ANDR',
  'ANTO',
  'ARAU',
  'AZEV',
  'BARB',
  'BARR',
  'BATI',
  'BERN',
  'BORG',
  'BRUN',
  'BUEN',
  'CAMP',
  'CARL',
  'CARS',
  'CAST',
  'CAVA',
  'CERV',
  'CHAV',
  'CORR',
  'COST',
  'CRUZ',
  'DANI',
  'DIAS',
  'DOMI',
  'DUAR',
  'EDUA',
  'FARI',
  'FERN',
  'FIGU',
  'FONS',
  'FREI',
  'GABR',
  'GARC',
  'GOME',
  'GONC',
  'HENR',
  'JOAO',
  'JOSE',
  'JUNI',
  'LIMA',
  'LOPE',
  'LUCA',
  'LUIZ',
  'MACH',
  'MAGA',
  'MARC',
  'MARI',
  'MART',
  'MATE',
  'MELO',
  'MEND',
  'MORA',
  'MORE',
  'MOUR',
  'NASC',
  'NUNE',
  'OLIV',
  'PACH',
  'PAUL',
  'PEDR',
  'PERE',
  'PINT',
  'PIRES',
  'RAFA',
  'RAMO',
  'REIS',
  'RIBE',
  'ROBE',
  'ROCH',
  'RODR',
  'SAMP',
  'SANT',
  'SILV',
  'SOAR',
  'SOUZ',
  'TAVA',
  'TEIX',
  'TORR',
  'VARG',
  'VIEI',
] as const

const WEB_SEARCH_RETRY_COOLDOWN_HOURS = 18
const OFFICIAL_SITE_RETRY_COOLDOWN_HOURS = 24
const OFFICIAL_SITE_INSTAGRAM_RECOVERY_COOLDOWN_HOURS = 6

const { values } = parseArgs({
  options: {
    codexFallbackCooldownHours: { type: 'string' },
    codexFallbackLimit: { type: 'string' },
    codexFallbackModel: { type: 'string' },
    codexSessionCreditLimit: { type: 'string' },
    codexWeeklyCreditLimit: { type: 'string' },
    directWebDiscoveryLimit: { type: 'string' },
    maxRawBacklog: { type: 'string' },
    maxRawToReviewRatio: { type: 'string' },
    officialSiteLimit: { type: 'string' },
    output: { type: 'string' },
    spPrefixesPerCycle: { type: 'string' },
    targetOrganizations: { type: 'string' },
    webSearchLimit: { type: 'string' },
  },
})

const targetOrganizations = values.targetOrganizations ? Number.parseInt(values.targetOrganizations, 10) : 320
const codexFallbackCooldownHours = values.codexFallbackCooldownHours ? Number.parseInt(values.codexFallbackCooldownHours, 10) : 168
const codexFallbackLimit = values.codexFallbackLimit ? Number.parseInt(values.codexFallbackLimit, 10) : 1
const codexFallbackModel = values.codexFallbackModel ?? 'gemini-2.5-flash'
const codexSessionCreditLimit = values.codexSessionCreditLimit ? Number.parseFloat(values.codexSessionCreditLimit) : 2
const codexWeeklyCreditLimit = values.codexWeeklyCreditLimit ? Number.parseFloat(values.codexWeeklyCreditLimit) : 25
const directWebDiscoveryLimit = values.directWebDiscoveryLimit ? Number.parseInt(values.directWebDiscoveryLimit, 10) : 8
const maxRawBacklog = values.maxRawBacklog ? Number.parseInt(values.maxRawBacklog, 10) : 600
const maxRawToReviewRatio = values.maxRawToReviewRatio ? Number.parseInt(values.maxRawToReviewRatio, 10) : 15
const spPrefixesPerCycle = values.spPrefixesPerCycle ? Number.parseInt(values.spPrefixesPerCycle, 10) : 2
const webSearchLimit = values.webSearchLimit ? Number.parseInt(values.webSearchLimit, 10) : 6
const officialSiteLimit = values.officialSiteLimit ? Number.parseInt(values.officialSiteLimit, 10) : 40
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')
const outputPath = values.output
  ? join(process.cwd(), values.output)
  : join(outputDirectory, 'auto-capture-cycle-summary.json')
const codexCooldownPath = join(outputDirectory, 'codex-fallback-cooldown.json')

void main()

async function main() {
  mkdirSync(outputDirectory, { recursive: true })

  const db = openLeadEngineDatabase()
  const startedAt = new Date().toISOString()
  const heartbeatPath = join(outputDirectory, 'auto-capture-heartbeat.json')
  const writeHeartbeat = () => {
    const nowIso = new Date().toISOString()
    writeFileSync(heartbeatPath, JSON.stringify({
      lastRunAt: nowIso,
      status: 'active',
      timestamp: nowIso,
    }))
  }
  writeHeartbeat()

  try {
    const codexSessionId = `codex-fallback-${startedAt}`
    const staleRunSummary = failStaleLlmRuns(db)
    const canonicalRepairSummary = promoteSpOfficeNames(db)
    const nonIcpSummary = quarantineNonIcpPeopleLeads(db)
    const cleanupSummary = cleanupSuspiciousWebsiteMatches(db)
    const readyStateRepairSummary = repairInvalidReadyForReviewStates(db)
    const initialCounts = getCounts(db)
    ensureOpsCampaign(db)
    const discoveryBackpressure = evaluateDiscoveryBackpressure(initialCounts, {
      maxRawBacklog,
      maxRawToReviewRatio,
    })
    const spPrefixes = discoveryBackpressure.pauseDiscovery
      ? []
      : pickNextSpPrefixes(db, spPrefixesPerCycle, DEFAULT_SP_PREFIXES)
    writeHeartbeat()
    const discoverySummary = await runSpDiscovery(
      db,
      spPrefixes,
      initialCounts.organizations,
      targetOrganizations,
      discoveryBackpressure
    )
    writeHeartbeat()
    const directWebDiscoverySummary = await runDirectWebDiscovery(db, directWebDiscoveryLimit)
    writeHeartbeat()
    const officialSiteSummary = await runOfficialSiteEnrichment(db, officialSiteLimit)
    const webSearchSummary = await runWebSearchEnrichment(db, webSearchLimit)
    const codexFallbackSummary = await runCodexFallbackEnrichment(db, {
      campaignId: OPS_CAMPAIGN.campaignId,
      cooldownHours: codexFallbackCooldownHours,
      limit: codexFallbackLimit,
      model: codexFallbackModel,
      sessionCreditLimit: codexSessionCreditLimit,
      sessionId: codexSessionId,
      weeklyCreditLimit: codexWeeklyCreditLimit,
    })
    const officialSiteFastTrackSummary = codexFallbackSummary.matched > 0
      ? await runOfficialSiteEnrichment(db, Math.max(4, Math.min(officialSiteLimit, codexFallbackSummary.matched * 3)))
      : {
          candidates: 0,
          enriched: 0,
          failures: 0,
          reason: 'no_fast_track',
        }
    const finalCounts = getCounts(db)

    const summary = {
      startedAt,
      finishedAt: new Date().toISOString(),
      targetOrganizations,
      staleRunSummary,
      canonicalRepairSummary,
      nonIcpSummary,
      cleanupSummary,
      readyStateRepairSummary,
      initialCounts,
      finalCounts,
      discoveryBackpressure,
      discoverySummary,
      directWebDiscoverySummary,
      webSearchSummary,
      officialSiteSummary,
      officialSiteFastTrackSummary,
      codexFallbackSummary,
    }

    writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`)
    console.log(JSON.stringify(summary, null, 2))
  } finally {
    db.close()
  }
}

function failStaleLlmRuns(db: ReturnType<typeof openLeadEngineDatabase>) {
  const cutoffIso = new Date(Date.now() - 15 * 60_000).toISOString()
  const result = db.prepare(`
    UPDATE llm_review_runs
    SET status = 'failed',
        notes = COALESCE(notes, 'stale running run closed by auto-capture watchdog'),
        finished_at = ?,
        updated_at = ?
    WHERE status = 'running'
      AND started_at < ?
  `).run(new Date().toISOString(), new Date().toISOString(), cutoffIso)

  return {
    failed: Number(result.changes ?? 0),
  }
}

async function runSpDiscovery(
  db: ReturnType<typeof openLeadEngineDatabase>,
  prefixes: string[],
  currentOrganizations: number,
  target: number,
  discoveryBackpressure: ReturnType<typeof evaluateDiscoveryBackpressure>
) {
  if (discoveryBackpressure.pauseDiscovery) {
    return {
      executedPrefixes: [],
      reason: 'backpressure_pause',
      addedOrganizations: 0,
      results: [],
    }
  }

  if (prefixes.length === 0 || currentOrganizations >= target) {
    return {
      executedPrefixes: [],
      reason: currentOrganizations >= target ? 'target_reached' : 'no_prefix_left',
      addedOrganizations: 0,
      results: [],
    }
  }

  const results: Array<Record<string, unknown>> = []
  const beforeAll = getOrganizationCount(db)
  let promotedOffices = 0
  let skippedPersons = 0

  upsertCampaign(
    db,
    {
      id: SP_CAMPAIGN.campaignId,
      name: SP_CAMPAIGN.campaignName,
      niche: 'advocacia',
      city: SP_CAMPAIGN.cityName,
      sizeRange: 'bulk-prefix-discovery',
      notes: 'Automatic low-CPU discovery cycle for Sao Paulo.',
      status: 'active',
    },
    new Date().toISOString()
  )

  for (const prefix of prefixes) {
    const nowIso = new Date().toISOString()
    const searchRunId = createSearchRun(
      db,
      {
        campaignId: SP_CAMPAIGN.campaignId,
        sourceChannel: 'oab_registry',
        toolName: 'oab_sp_prefix_search_auto',
        queryText: `prefix=${prefix}&cityId=${SP_CAMPAIGN.cityId}`,
        notes: 'Automatic low-CPU SP prefix discovery.',
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
        const officeLead = toSpOfficeLead(lead)

        if (!officeLead) {
          skippedPersons += 1
          continue
        }

        upsertOabRegistryLead(db, officeLead, searchRunId, new Date().toISOString())
        promotedOffices += 1
      }

      completeSearchRun(
        db,
        searchRunId,
        result.leads.length,
        new Date().toISOString(),
        result.querySummaries.join(' | ') || 'Automatic SP discovery completed.'
      )

      results.push({
        prefix,
        promotedOffices,
        resultCount: result.leads.length,
        skippedPersons,
        searchRunId,
      })
    } catch (error) {
      failSearchRun(
        db,
        searchRunId,
        new Date().toISOString(),
        error instanceof Error ? error.message : 'Unknown automatic SP discovery error.'
      )

      results.push({
        prefix,
        error: error instanceof Error ? error.message : 'Unknown automatic SP discovery error.',
        resultCount: 0,
        searchRunId,
      })
    }
  }

  const afterAll = getOrganizationCount(db)

  return {
    executedPrefixes: prefixes,
    addedOrganizations: afterAll - beforeAll,
    promotedOffices,
    reason: 'completed',
    results,
    skippedPersons,
  }
}

async function runWebSearchEnrichment(db: ReturnType<typeof openLeadEngineDatabase>, limit: number) {
  const seeds = listWebSearchSeeds(db, limit * 4).slice(0, limit)

  if (seeds.length === 0) {
    return {
      candidates: 0,
      matched: 0,
      misses: 0,
      reason: 'no_seed',
    }
  }

  const searchRunId = createSearchRun(
    db,
    {
      campaignId: 'ops-auto-capture',
      sourceChannel: 'google_web_search',
      toolName: 'google_search_cli_fallback_auto',
      queryText: seeds.map((seed) => `${seed.canonicalName} ${seed.city ?? ''}`.trim()).join(' | '),
      notes: 'Automatic low-CPU enrichment pass for site and Instagram discovery.',
    },
    new Date().toISOString()
  )

  let matched = 0
  let misses = 0

  try {
    for (const seed of seeds) {
      try {
        const enriched = await enrichOrganizationViaGoogleSearch(seed, { timeout: 12000, limit: 3 })

        if (!enriched) {
          markWebSearchMiss(db, seed, searchRunId, new Date().toISOString(), 'no_official_result')
          misses += 1
          continue
        }

        upsertWebSearchMatch(db, enriched, searchRunId, new Date().toISOString())
        matched += 1
      } catch (error) {
        markWebSearchMiss(
          db,
          seed,
          searchRunId,
          new Date().toISOString(),
          error instanceof Error ? error.message.slice(0, 240) : 'web_search_error'
        )
        misses += 1
      }
    }

    completeSearchRun(
      db,
      searchRunId,
      matched,
      new Date().toISOString(),
      `Automatic web-search enrichment matched ${matched} of ${seeds.length}.`
    )
  } catch (error) {
    failSearchRun(
      db,
      searchRunId,
      new Date().toISOString(),
      error instanceof Error ? error.message : 'Unknown automatic web-search enrichment error.'
    )
    throw error
  }

  return {
    candidates: seeds.length,
    matched,
    misses,
    reason: 'completed',
  }
}

async function runOfficialSiteEnrichment(db: ReturnType<typeof openLeadEngineDatabase>, limit: number) {
  const seeds = listOfficialSiteSeeds(db, limit * 3)
    .filter((seed) => Boolean(seed.websiteUrl && isLikelyOfficialWebsiteUrl(seed.websiteUrl)))
    .slice(0, limit)

  if (seeds.length === 0) {
    return {
      candidates: 0,
      enriched: 0,
      failures: 0,
      reason: 'no_seed',
    }
  }

  const searchRunId = createSearchRun(
    db,
    {
      campaignId: 'ops-auto-capture',
      sourceChannel: 'official_site',
      toolName: 'official_site_auto',
      queryText: seeds.map((seed) => seed.externalId).join(' | '),
      notes: 'Automatic low-CPU official-site enrichment pass.',
    },
    new Date().toISOString()
  )

  let enrichedCount = 0
  let failures = 0

  try {
    const results = await runWithConcurrency(seeds, 4, async (seed) => {
      try {
        const enriched = await enrichOfficialSiteSeed(seed)
        upsertOfficialSiteLead(db, enriched, searchRunId, new Date().toISOString())
        return true
      } catch {
        return false
      }
    })

    enrichedCount = results.filter(Boolean).length
    failures = results.length - enrichedCount

    completeSearchRun(
      db,
      searchRunId,
      enrichedCount,
      new Date().toISOString(),
      `Automatic official-site enrichment completed: ${enrichedCount}/${seeds.length}.`
    )
  } catch (error) {
    failSearchRun(
      db,
      searchRunId,
      new Date().toISOString(),
      error instanceof Error ? error.message : 'Unknown automatic official-site enrichment error.'
    )
    throw error
  }

  return {
    candidates: seeds.length,
    enriched: enrichedCount,
    failures,
    reason: 'completed',
  }
}

async function runDirectWebDiscovery(db: ReturnType<typeof openLeadEngineDatabase>, limit: number) {
  if (limit <= 0) {
    return {
      addedOrUpdated: 0,
      candidates: 0,
      queries: [],
      reason: 'disabled',
    }
  }

  const queries = pickDirectWebDiscoveryQueries(db, limit)
  const searchRunId = createSearchRun(
    db,
    {
      campaignId: OPS_CAMPAIGN.campaignId,
      sourceChannel: 'google_web_discovery',
      toolName: 'google_search_direct_web_discovery',
      queryText: queries.map((entry) => `${entry.city}/${entry.state}: ${entry.query}`).join(' | '),
      notes: 'Direct SERP discovery for law-firm websites with visible contact signals.',
    },
    new Date().toISOString()
  )

  let candidates = 0
  let addedOrUpdated = 0
  let failureReason: string | null = null

  try {
    for (const discoveryQuery of queries) {
      const response = await runGoogleSearchQuery(discoveryQuery.query, { limit: 8, timeout: 45000 })
      const results = response.results.filter(isDirectLawFirmResult)

      for (const result of results) {
        candidates += 1
        const websiteUrl = normalizeDirectWebsiteUrl(result.link)
        const officialWebsiteUrl = websiteUrl && isLikelyOfficialWebsiteUrl(websiteUrl) ? websiteUrl : null
        const email = officialWebsiteUrl
          ? pickDirectEmail(result.title, result.snippet, officialWebsiteUrl) ?? pickAnyDirectEmail(result.title, result.snippet)
          : pickAnyDirectEmail(result.title, result.snippet)

        if (!officialWebsiteUrl && !email) {
          continue
        }

        const changed = upsertDirectWebDiscoveryLead(db, {
          city: discoveryQuery.city,
          email,
          query: discoveryQuery.query,
          sourceUrl: result.link,
          state: discoveryQuery.state,
          title: result.title,
          websiteUrl: officialWebsiteUrl,
        }, searchRunId, new Date().toISOString())

        if (changed) {
          addedOrUpdated += 1
        }
      }
    }

    completeSearchRun(
      db,
      searchRunId,
      addedOrUpdated,
      new Date().toISOString(),
      `Direct web discovery updated ${addedOrUpdated} from ${candidates} candidates.`
    )
  } catch (error) {
    failureReason = error instanceof Error ? error.message : 'Unknown direct web discovery error.'
    failSearchRun(
      db,
      searchRunId,
      new Date().toISOString(),
      failureReason
    )
  }

  return {
    addedOrUpdated,
    candidates,
    error: failureReason,
    queries: queries.map((entry) => ({
      city: entry.city,
      query: entry.query,
      state: entry.state,
    })),
    reason: failureReason ? 'failed' : 'completed',
  }
}

function pickDirectWebDiscoveryQueries(db: ReturnType<typeof openLeadEngineDatabase>, limit: number) {
  const row = db.prepare(`
    SELECT COUNT(*) AS count
    FROM search_runs
    WHERE source_channel = 'google_web_discovery'
  `).get() as { count: number }
  const offset = Number(row.count ?? 0) % DIRECT_WEB_DISCOVERY_QUERIES.length
  const queries: DirectDiscoveryQuery[] = []

  for (let index = 0; index < Math.min(limit, DIRECT_WEB_DISCOVERY_QUERIES.length); index += 1) {
    queries.push(DIRECT_WEB_DISCOVERY_QUERIES[(offset + index) % DIRECT_WEB_DISCOVERY_QUERIES.length])
  }

  return queries
}

function isDirectLawFirmResult(result: { link: string; snippet: string; title: string }) {
  const haystack = normalizeOrganizationName([result.title, result.snippet, result.link].join(' '))
  return (
    haystack.includes('ADVOG') ||
    haystack.includes('ADVOCACIA') ||
    haystack.includes('JURID') ||
    haystack.includes('DIREITO')
  )
}

function upsertDirectWebDiscoveryLead(
  db: ReturnType<typeof openLeadEngineDatabase>,
  lead: {
    city: string
    email: string | null
    query: string
    sourceUrl: string
    state: string
    title: string
    websiteUrl: string | null
  },
  searchRunId: number,
  nowIso: string
) {
  const websiteDomain = lead.websiteUrl ? new URL(lead.websiteUrl).hostname.replace(/^www\./i, '').toLowerCase() : null
  const email = lead.email?.toLowerCase() ?? null
  const emailDomain = email?.split('@')[1]?.toLowerCase() ?? null
  const existing = websiteDomain ? db.prepare(`
    SELECT id
    FROM organizations
    WHERE website_domain = ?
    ORDER BY updated_at DESC
    LIMIT 1
  `).get(websiteDomain) as { id: string } | undefined : email ? db.prepare(`
    SELECT id
    FROM organizations
    WHERE lower(primary_email) = ?
    ORDER BY updated_at DESC
    LIMIT 1
  `).get(email) as { id: string } | undefined : undefined
  const organizationId = existing?.id ?? `org_web_${hashText(websiteDomain ?? email ?? lead.sourceUrl).slice(0, 16)}`
  const officeName = cleanDirectOfficeName(lead.title, websiteDomain)
  const status = email ? 'ready_for_review' : 'needs_manual_review'
  const confidence = websiteDomain && emailDomain && getRegistrableDomainFromHostname(emailDomain) === getRegistrableDomainFromHostname(websiteDomain)
    ? 0.9
    : email
      ? 0.76
      : 0.7

  db.prepare(`
    INSERT INTO organizations (
      id,
      canonical_name,
      normalized_name,
      city,
      state,
      website_url,
      website_domain,
      primary_email,
      source_confidence,
      status,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      canonical_name = CASE
        WHEN organizations.canonical_name IS NULL OR organizations.canonical_name = '' THEN excluded.canonical_name
        ELSE organizations.canonical_name
      END,
      website_url = excluded.website_url,
      website_domain = excluded.website_domain,
      primary_email = COALESCE(NULLIF(organizations.primary_email, ''), excluded.primary_email),
      source_confidence = MAX(organizations.source_confidence, excluded.source_confidence),
      status = CASE
        WHEN organizations.status = 'ready_for_review' THEN organizations.status
        WHEN COALESCE(NULLIF(organizations.primary_email, ''), excluded.primary_email) IS NOT NULL
          THEN 'ready_for_review'
        ELSE excluded.status
      END,
      updated_at = excluded.updated_at
  `).run(
    organizationId,
    officeName,
    normalizeOrganizationName(officeName),
    lead.city,
    lead.state,
    lead.websiteUrl,
    websiteDomain,
    email,
    confidence,
    status,
    nowIso,
    nowIso
  )

  const externalId = websiteDomain ? `web:${websiteDomain}` : `web-email:${hashText(email ?? lead.sourceUrl).slice(0, 16)}`
  const existingSource = db.prepare(`
    SELECT id
    FROM organization_sources
    WHERE source_channel = 'google_web_discovery'
      AND external_id = ?
    ORDER BY id DESC
    LIMIT 1
  `).get(externalId) as { id: number } | undefined
  const payload = JSON.stringify({
    city: lead.city,
    discoveredAt: nowIso,
    email,
    query: lead.query,
    sourceUrl: lead.sourceUrl,
    state: lead.state,
    title: lead.title,
    websiteUrl: lead.websiteUrl,
  })

  if (existingSource) {
    db.prepare(`
      UPDATE organization_sources
      SET organization_id = ?,
          search_run_id = ?,
          source_url = ?,
          source_title = ?,
          confidence = ?,
          raw_payload_json = ?,
          last_seen_at = ?
      WHERE id = ?
    `).run(organizationId, searchRunId, lead.sourceUrl, lead.title, confidence, payload, nowIso, existingSource.id)
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
      ) VALUES (?, ?, 'google_web_discovery', ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      organizationId,
      searchRunId,
      websiteDomain ? 'direct_serp_law_firm_site' : 'direct_serp_law_firm_email',
      externalId,
      lead.sourceUrl,
      lead.title,
      confidence,
      payload,
      nowIso,
      nowIso
    )
  }

  return true
}

function normalizeDirectWebsiteUrl(value: string) {
  try {
    const url = new URL(value)
    url.hash = ''
    url.search = ''
    return `${url.origin}/`
  } catch {
    return null
  }
}

function pickDirectEmail(title: string, snippet: string, websiteUrl: string) {
  const domain = new URL(websiteUrl).hostname.replace(/^www\./i, '').toLowerCase()
  const domainRoot = getRegistrableDomainFromHostname(domain)
  const emails = [title, snippet].join(' ').match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) ?? []

  for (const email of emails) {
    const emailDomain = email.split('@')[1]?.toLowerCase()

    if (emailDomain && getRegistrableDomainFromHostname(emailDomain) === domainRoot) {
      return email.toLowerCase()
    }
  }

  return null
}

function pickAnyDirectEmail(title: string, snippet: string) {
  const emails = [title, snippet].join(' ').match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) ?? []
  const blockedPrefixes = ['abuse@', 'admin@', 'bounce@', 'mailer-daemon@', 'noreply@', 'no-reply@', 'postmaster@', 'webmaster@']

  for (const email of emails) {
    const normalized = email.toLowerCase()

    if (blockedPrefixes.some((prefix) => normalized.startsWith(prefix))) {
      continue
    }

    if (isBlockedEmailDomain(normalized)) {
      continue
    }

    return normalized
  }

  return null
}

function cleanDirectOfficeName(title: string, websiteDomain: string | null) {
  const cleaned = title
    .replace(/\s*[-|•]\s*(home|início|contato|site oficial).*$/i, '')
    .replace(/\s*[-|•]\s*.*$/i, '')
    .trim()

  if (cleaned.length >= 4 && cleaned.length <= 90) {
    return cleaned.toUpperCase()
  }

  if (websiteDomain) {
    return websiteDomain.replace(/\.(adv|com)\.br$/i, '').replace(/\.[a-z.]+$/i, '').replace(/[-_]+/g, ' ').toUpperCase()
  }

  return 'ESCRITORIO DE ADVOCACIA'
}

function hashText(value: string) {
  return createHash('sha1').update(value).digest('hex')
}

function getRegistrableDomainFromHostname(hostname: string) {
  const parts = hostname.replace(/^www\./i, '').toLowerCase().split('.').filter(Boolean)

  if (parts.length <= 2) {
    return parts.join('.')
  }

  const suffix = parts.slice(-2).join('.')
  const brSuffixes = ['com.br', 'adv.br', 'net.br', 'org.br', 'emp.br']

  if (brSuffixes.includes(suffix)) {
    return parts.slice(-3).join('.')
  }

  return parts.slice(-2).join('.')
}

function markWebSearchMiss(
  db: ReturnType<typeof openLeadEngineDatabase>,
  seed: WebSearchSeed,
  searchRunId: number,
  nowIso: string,
  reason: string
) {
  const source = db.prepare(`
    SELECT organization_id AS organizationId
    FROM organization_sources
    WHERE source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery')
      AND external_id = ?
    ORDER BY id DESC
    LIMIT 1
  `).get(seed.externalId) as { organizationId: string } | undefined

  if (!source?.organizationId) {
    return
  }

  const existing = db.prepare(`
    SELECT id
    FROM organization_sources
    WHERE source_channel = 'google_web_search_miss'
      AND external_id = ?
    ORDER BY id DESC
    LIMIT 1
  `).get(seed.externalId) as { id: number } | undefined

  const payload = JSON.stringify({
    attemptedAt: nowIso,
    canonicalName: seed.canonicalName,
    city: seed.city,
    reason,
  })

  if (existing) {
    db.prepare(`
      UPDATE organization_sources
      SET search_run_id = ?,
          source_url = NULL,
          source_title = ?,
          confidence = 0,
          raw_payload_json = ?,
          last_seen_at = ?
      WHERE id = ?
    `).run(searchRunId, `Google web search miss - ${seed.canonicalName}`, payload, nowIso, existing.id)
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
      ) VALUES (?, ?, 'google_web_search_miss', 'search_engine_miss', ?, NULL, ?, 0, ?, ?, ?)
    `).run(
      source.organizationId,
      searchRunId,
      seed.externalId,
      `Google web search miss - ${seed.canonicalName}`,
      payload,
      nowIso,
      nowIso
    )
  }

  db.prepare(`
    UPDATE organizations
    SET updated_at = ?
    WHERE id = ?
  `).run(nowIso, source.organizationId)
}

function cleanupSuspiciousWebsiteMatches(db: ReturnType<typeof openLeadEngineDatabase>) {
  const rows = db.prepare(`
    SELECT
      o.canonical_name AS canonicalName,
      o.id AS organizationId,
      o.instagram_url AS instagramUrl,
      o.primary_email AS primaryEmail,
      o.primary_phone AS primaryPhone,
      o.primary_whatsapp AS primaryWhatsapp,
      o.website_url AS websiteUrl
    FROM organizations o
    WHERE (o.website_url IS NOT NULL AND o.website_url != '')
       OR (o.primary_email IS NOT NULL AND o.primary_email != '')
  `).all() as Array<{
    canonicalName: string
    instagramUrl: string | null
    organizationId: string
    primaryEmail: string | null
    primaryPhone: string | null
    primaryWhatsapp: string | null
    websiteUrl: string
  }>

  let clearedEmail = 0
  let clearedInstagram = 0
  let clearedWebsite = 0

  for (const row of rows) {
    const hasSuspiciousWebsite = Boolean(row.websiteUrl && !isLikelyOfficialWebsiteUrl(row.websiteUrl))
    const hasSuspiciousInstagram = isSuspiciousInstagramUrl(row.instagramUrl)
    const hasBlockedEmail = isBlockedEmailDomain(row.primaryEmail)
    const hasMismatchedEmail = Boolean(
      row.primaryEmail &&
      getRegistrableDomain(row.primaryEmail) &&
      getRegistrableDomain(row.websiteUrl) &&
      getRegistrableDomain(row.primaryEmail) !== getRegistrableDomain(row.websiteUrl)
    )

    if (!hasSuspiciousWebsite && !hasSuspiciousInstagram && !hasBlockedEmail && !hasMismatchedEmail) {
      continue
    }

    const nextWebsiteUrl = hasSuspiciousWebsite ? null : row.websiteUrl
    const nextWebsiteDomain = nextWebsiteUrl ? new URL(nextWebsiteUrl).hostname.replace(/^www\./i, '').toLowerCase() : null
    const nextInstagramUrl = hasSuspiciousWebsite || hasSuspiciousInstagram ? null : row.instagramUrl
    const nextPrimaryEmail = hasBlockedEmail || hasMismatchedEmail ? null : row.primaryEmail
    const nextStatus = nextPrimaryEmail && nextWebsiteUrl
      ? 'ready_for_review'
      : nextWebsiteUrl || nextInstagramUrl || row.primaryPhone || row.primaryWhatsapp
        ? 'needs_manual_review'
        : 'raw'

    db.prepare(`
      UPDATE organizations
      SET website_url = ?,
          website_domain = ?,
          instagram_url = ?,
          primary_email = ?,
          status = ?,
          updated_at = ?
      WHERE id = ?
    `).run(
      nextWebsiteUrl,
      nextWebsiteDomain,
      nextInstagramUrl,
      nextPrimaryEmail,
      nextStatus,
      new Date().toISOString(),
      row.organizationId
    )

    if (hasSuspiciousWebsite) {
      clearedWebsite += 1
    }

    if (hasSuspiciousInstagram) {
      clearedInstagram += 1
    }

    if (hasBlockedEmail || hasMismatchedEmail) {
      clearedEmail += 1
    }
  }

  return {
    clearedEmail,
    clearedInstagram,
    clearedWebsite,
    downgraded: downgradeLowConfidenceAutoEmailMatches(db),
  }
}

function repairInvalidReadyForReviewStates(db: ReturnType<typeof openLeadEngineDatabase>) {
  const result = db.prepare(`
    UPDATE organizations
    SET status = CASE
          WHEN website_url IS NOT NULL
           AND website_url != ''
           AND primary_email IS NOT NULL
           AND primary_email != '' THEN 'ready_for_review'
          WHEN website_url IS NOT NULL
           AND website_url != '' THEN 'needs_manual_review'
          WHEN instagram_url IS NOT NULL
           AND instagram_url != '' THEN 'needs_manual_review'
          WHEN primary_phone IS NOT NULL
           AND primary_phone != '' THEN 'needs_manual_review'
          WHEN primary_whatsapp IS NOT NULL
           AND primary_whatsapp != '' THEN 'needs_manual_review'
          ELSE 'raw'
        END,
        updated_at = ?
    WHERE status = 'ready_for_review'
      AND (
        website_url IS NULL
        OR website_url = ''
        OR primary_email IS NULL
        OR primary_email = ''
      )
  `).run(new Date().toISOString())

  return {
    repaired: Number(result.changes ?? 0),
  }
}

function getRegistrableDomain(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const normalized = value.includes('@')
    ? value.split('@').pop()?.trim().toLowerCase() ?? ''
    : (() => {
        try {
          return new URL(value).hostname.replace(/^www\./i, '').toLowerCase()
        } catch {
          return ''
        }
      })()

  if (!normalized) {
    return null
  }

  const parts = normalized.split('.').filter(Boolean)

  if (parts.length <= 2) {
    return normalized
  }

  const joinedTail = parts.slice(-2).join('.')
  const publicSuffixThree = new Set(['adv.br', 'com.br', 'emp.br', 'net.br', 'org.br'])

  if (publicSuffixThree.has(joinedTail) && parts.length >= 3) {
    return parts.slice(-3).join('.')
  }

  return parts.slice(-2).join('.')
}

function isSuspiciousInstagramUrl(value: string | null | undefined) {
  if (!value) {
    return false
  }

  try {
    const url = new URL(value)
    const handle = url.pathname.split('/').filter(Boolean)[0]?.toLowerCase()

    if (!handle) {
      return true
    }

    return new Set([
      'accounts',
      'explore',
      'p',
      'reel',
      'reels',
      'share',
      'stories',
      'tv',
    ]).has(handle)
  } catch {
    return true
  }
}

function downgradeLowConfidenceAutoEmailMatches(db: ReturnType<typeof openLeadEngineDatabase>) {
  const result = db.prepare(`
    UPDATE organizations
    SET status = 'needs_manual_review',
        updated_at = ?
    WHERE status = 'ready_for_review'
      AND source_confidence < 0.95
      AND primary_email IS NOT NULL
      AND primary_email != ''
      AND NOT EXISTS (
        SELECT 1
        FROM email_jobs ej
        WHERE ej.organization_id = organizations.id
          AND ej.status != 'canceled'
      )
  `).run(new Date().toISOString())

  return Number(result.changes ?? 0)
}

function promoteSpOfficeNames(db: ReturnType<typeof openLeadEngineDatabase>) {
  const rows = db.prepare(`
    SELECT
      o.id AS organizationId,
      o.canonical_name AS canonicalName,
      e.value AS officeName
    FROM organizations o
    JOIN evidence e
      ON e.organization_id = o.id
     AND e.evidence_type = 'registry_office_name'
    WHERE o.state = 'SP'
      AND o.canonical_name != e.value
      AND NOT EXISTS (
        SELECT 1
        FROM email_jobs ej
        WHERE ej.organization_id = o.id
          AND ej.status != 'canceled'
      )
    GROUP BY o.id, o.canonical_name, e.value
  `).all() as Array<{ canonicalName: string; officeName: string; organizationId: string }>

  let promoted = 0

  for (const row of rows) {
    db.prepare(`
      UPDATE organizations
      SET canonical_name = ?,
          normalized_name = ?,
          website_url = NULL,
          website_domain = NULL,
          instagram_url = NULL,
          primary_email = NULL,
          primary_phone = NULL,
          primary_whatsapp = NULL,
          status = 'raw',
          updated_at = ?
      WHERE id = ?
    `).run(row.officeName, normalizeOrganizationName(row.officeName), new Date().toISOString(), row.organizationId)

    db.prepare(`
      DELETE FROM organization_sources
      WHERE organization_id = ?
        AND source_channel IN ('google_web_search', 'official_site', 'codex_fallback')
    `).run(row.organizationId)

    db.prepare(`
      DELETE FROM evidence
      WHERE organization_id = ?
        AND (
          evidence_type LIKE 'web_search_%'
          OR evidence_type LIKE 'official_%'
          OR evidence_type LIKE 'codex_%'
        )
    `).run(row.organizationId)

    promoted += 1
  }

  return { promoted }
}

function quarantineNonIcpPeopleLeads(db: ReturnType<typeof openLeadEngineDatabase>) {
  const result = db.prepare(`
    UPDATE organizations
    SET status = 'ignored_non_icp',
        updated_at = ?
    WHERE status = 'raw'
      AND (website_url IS NULL OR website_url = '')
      AND (primary_email IS NULL OR primary_email = '')
      AND (primary_phone IS NULL OR primary_phone = '')
      AND (primary_whatsapp IS NULL OR primary_whatsapp = '')
      AND (
        canonical_name IS NULL
        OR TRIM(canonical_name) = ''
        OR UPPER(canonical_name) LIKE '%ESTAGI%'
        OR UPPER(canonical_name) LIKE '%ESTAGIARI%'
        OR (
          NOT (
            UPPER(canonical_name) LIKE '%ADVOGADOS%'
            OR UPPER(canonical_name) LIKE '%ADVOCACIA%'
            OR UPPER(canonical_name) LIKE '%SOCIEDADE%'
            OR UPPER(canonical_name) LIKE '%CONSULTORES%'
          )
          AND EXISTS (
            SELECT 1
            FROM evidence e
            WHERE e.organization_id = organizations.id
              AND e.evidence_type = 'registry_role'
              AND (
                LOWER(e.value) LIKE 'advogad%'
                OR LOWER(e.value) LIKE 'estagi%'
              )
          )
        )
      )
      AND NOT EXISTS (
        SELECT 1
        FROM evidence e
        WHERE e.organization_id = organizations.id
          AND e.evidence_type = 'registry_office_name'
          AND e.value IS NOT NULL
          AND e.value != ''
      )
      AND NOT EXISTS (
        SELECT 1
        FROM email_jobs ej
        WHERE ej.organization_id = organizations.id
          AND ej.status != 'canceled'
      )
  `).run(new Date().toISOString())

  return {
    quarantined: Number(result.changes ?? 0),
  }
}

function toSpOfficeLead(lead: {
  canonicalName: string
  city: string
  externalId: string
  inscriptionTypeCode: string
  inscriptionTypeLabel: string
  officeName?: string | null
  oabNumber: string
  queryUrl: string
  registryProvider: string
  sourceConfidence: number
  sourceUrl: string
  specialtyCode: string
  specialtyLabel: string
  state: string
  subsection?: string | null
}) {
  const officeName = lead.officeName?.trim()

  if (!officeName) {
    return null
  }

  return {
    ...lead,
    canonicalName: officeName,
    externalId: `SP:SOC:${slugify(officeName)}`,
    inscriptionTypeCode: 'SOC',
    inscriptionTypeLabel: 'Sociedade',
    officeName,
    sourceConfidence: Math.max(lead.sourceConfidence, 0.9),
  }
}

async function runCodexFallbackEnrichment(
  db: ReturnType<typeof openLeadEngineDatabase>,
  options: {
    campaignId: string
    cooldownHours: number
    limit: number
    model: string
    sessionCreditLimit: number
    sessionId: string
    weeklyCreditLimit: number
  }
) {
  const effectiveModel = options.model.toLowerCase().includes('gemini') ? options.model : 'gemini-2.5-flash'
  const isGemini = effectiveModel.toLowerCase().includes('gemini')

  if (options.limit <= 0) {
    return {
      matched: 0,
      misses: 0,
      model: effectiveModel,
      reason: 'disabled',
      sessionCredits: 0,
      sessionId: options.sessionId,
      weeklyCredits: getWeeklyCodexCredits(db),
    }
  }

  const weeklyCredits = getWeeklyCodexCredits(db)
  if (!isGemini && weeklyCredits >= options.weeklyCreditLimit) {
    return {
      matched: 0,
      misses: 0,
      model: effectiveModel,
      reason: 'weekly_credit_cap',
      sessionCredits: 0,
      sessionId: options.sessionId,
      weeklyCredits: Number(weeklyCredits.toFixed(4)),
    }
  }

  const cooldownUntil = readCodexCooldownUntil()
  if (!isGemini && cooldownUntil && new Date(cooldownUntil).getTime() > Date.now()) {
    return {
      matched: 0,
      misses: 0,
      model: effectiveModel,
      reason: 'quota_cooldown',
      sessionCredits: 0,
      sessionId: options.sessionId,
      weeklyCredits: Number(weeklyCredits.toFixed(4)),
    }
  }

  const retryAfterIso = new Date(Date.now() - options.cooldownHours * 60 * 60 * 1000).toISOString()
  const seeds = listCodexFallbackSeeds(db, options.limit, retryAfterIso)

  if (seeds.length === 0) {
    return {
      matched: 0,
      misses: 0,
      model: effectiveModel,
      reason: 'no_seed',
      sessionCredits: 0,
      sessionId: options.sessionId,
      weeklyCredits: Number(weeklyCredits.toFixed(4)),
    }
  }

  const searchRunId = createSearchRun(
    db,
    {
      campaignId: options.campaignId,
      sourceChannel: 'codex_fallback',
      toolName: isGemini ? 'gemini_exec_official_match' : 'codex_exec_official_match',
      queryText: seeds.map((seed) => `${seed.canonicalName} ${seed.city ?? ''}`).join(' | '),
      notes: isGemini
        ? 'Low-volume Gemini fallback for official site and Instagram discovery.'
        : 'Low-volume LLM fallback for official site and Instagram discovery.',
    },
    new Date().toISOString()
  )

  const matches: Array<Record<string, unknown>> = []
  const misses: Array<Record<string, unknown>> = []
  let sessionCredits = 0

  try {
    for (const seed of seeds) {
      if (sessionCredits >= options.sessionCreditLimit) {
        misses.push({
          canonicalName: seed.canonicalName,
          externalId: seed.externalId,
          reason: 'session_credit_cap',
        })
        continue
      }

      const runId = createLlmReviewRun(db, {
        model: effectiveModel,
        organizationId: resolveOrganizationIdByExternalId(db, seed.externalId),
        provider: isGemini ? 'gemini' : 'codex',
        searchRunId,
        sessionId: options.sessionId,
        toolName: isGemini ? 'gemini_exec_official_match' : 'codex_exec_official_match',
      }, new Date().toISOString())

      try {
        const result = await enrichOrganizationViaCodexFallback(seed, { model: effectiveModel, search: true })
        const estimatedCredits = isGemini ? 0 : estimateCodexCredits(effectiveModel, result.usage)
        const finishedAt = new Date().toISOString()

        if (result.match) {
          const organizationId = upsertCodexFallbackMatch(db, result.match, searchRunId, finishedAt)
          matches.push({
            canonicalName: seed.canonicalName,
            estimatedCredits,
            externalId: seed.externalId,
            instagramUrl: result.match.instagramUrl,
            organizationId,
            primaryPhone: result.match.primaryPhone,
            primaryWhatsapp: result.match.primaryWhatsapp,
            websiteUrl: result.match.websiteUrl,
          })
        } else {
          misses.push({
            canonicalName: seed.canonicalName,
            estimatedCredits,
            externalId: seed.externalId,
            reason: isGemini
              ? 'No reliable official signal found by Gemini fallback.'
              : 'No reliable official signal found by Codex fallback.',
          })
        }

        completeLlmReviewRun(db, runId, {
          cachedInputTokens: result.usage.cachedInputTokens,
          estimatedCredits,
          finishedAt,
          inputTokens: result.usage.inputTokens,
          notes: result.match?.rationale ?? null,
          outputTokens: result.usage.outputTokens,
          responseJson: result.rawResponseJson,
          resultFound: Boolean(result.match),
          status: 'completed',
          threadId: result.threadId,
        })

        sessionCredits += estimatedCredits
      } catch (error) {
        const finishedAt = new Date().toISOString()
        const message = error instanceof Error ? error.message : 'Unknown fallback error.'
        if (!isGemini && isCodexQuotaError(message)) {
          writeCodexCooldownUntil(new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), message)
        }
        failLlmReviewRun(db, runId, finishedAt, message)
        misses.push({
          canonicalName: seed.canonicalName,
          error: message,
          externalId: seed.externalId,
        })
      }
    }

    completeSearchRun(
      db,
      searchRunId,
      matches.length,
      new Date().toISOString(),
      misses.length === 0
        ? (isGemini ? 'Gemini fallback completed.' : 'Codex fallback completed.')
        : (isGemini
            ? `Gemini fallback completed with ${misses.length} miss(es).`
            : `Codex fallback completed with ${misses.length} miss(es).`)
    )
  } catch (error) {
    failSearchRun(
      db,
      searchRunId,
      new Date().toISOString(),
      error instanceof Error ? error.message : 'Unknown fallback error.'
    )
    throw error
  }

  return {
    matched: matches.length,
    matches,
    misses,
    model: effectiveModel,
    reason: 'completed',
    sessionCredits: Number(sessionCredits.toFixed(4)),
    sessionId: options.sessionId,
    weeklyCredits: isGemini
      ? Number(weeklyCredits.toFixed(4))
      : Number((weeklyCredits + sessionCredits).toFixed(4)),
  }
}

function readCodexCooldownUntil() {
  if (!existsSync(codexCooldownPath)) {
    return null
  }

  try {
    const payload = JSON.parse(readFileSync(codexCooldownPath, 'utf8')) as { cooldownUntil?: string }
    return payload.cooldownUntil ?? null
  } catch {
    return null
  }
}

function writeCodexCooldownUntil(cooldownUntil: string, reason: string) {
  writeFileSync(
    codexCooldownPath,
    `${JSON.stringify({ cooldownUntil, reason, updatedAt: new Date().toISOString() }, null, 2)}\n`
  )
}

function isCodexQuotaError(message: string) {
  return /usage limit|purchase more credits|upgrade to pro|codex\/settings\/usage/i.test(message)
}

function pickNextSpPrefixes(
  db: ReturnType<typeof openLeadEngineDatabase>,
  limit: number,
  allPrefixes: readonly string[]
) {
  const rows = db
    .prepare(`
      SELECT query_text AS queryText
      FROM search_runs
      WHERE tool_name IN ('oab_sp_prefix_search', 'oab_sp_prefix_search_auto')
      ORDER BY id ASC
    `)
    .all() as Array<{ queryText: string }>

  const used = new Set(
    rows
      .map((row) => row.queryText.match(/prefix=([A-Z]+)/)?.[1]?.trim().toUpperCase())
      .filter((value): value is string => Boolean(value))
  )

  return allPrefixes.filter((prefix) => !used.has(prefix)).slice(0, limit)
}

function ensureOpsCampaign(db: ReturnType<typeof openLeadEngineDatabase>) {
  upsertCampaign(
    db,
    {
      id: OPS_CAMPAIGN.campaignId,
      name: OPS_CAMPAIGN.campaignName,
      niche: 'ops',
      city: OPS_CAMPAIGN.city,
      sizeRange: 'automatic',
      notes: 'Operational campaign used by the low-CPU auto-capture loop.',
      status: 'active',
    },
    new Date().toISOString()
  )
}

function listWebSearchSeeds(db: ReturnType<typeof openLeadEngineDatabase>, limit: number): WebSearchSeed[] {
  const retryAfterIso = new Date(Date.now() - WEB_SEARCH_RETRY_COOLDOWN_HOURS * 60 * 60 * 1000).toISOString()

  return db
    .prepare(`
      SELECT
        os.external_id AS externalId,
        COALESCE(
          (
            SELECT e.value
            FROM evidence e
            WHERE e.organization_id = o.id
              AND e.evidence_type IN ('registry_office_name', 'official_office_name')
            ORDER BY e.id DESC
            LIMIT 1
          ),
          o.canonical_name
        ) AS canonicalName,
        o.city AS city,
        o.website_domain AS websiteDomain,
        o.website_url AS websiteUrl
      FROM organizations o
      INNER JOIN organization_sources os
        ON os.organization_id = o.id
       AND os.id = (
         SELECT MAX(os2.id)
         FROM organization_sources os2
         WHERE os2.organization_id = o.id
           AND os2.source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery')
       )
      WHERE (o.website_url IS NULL OR o.website_url = '' OR o.instagram_url IS NULL OR o.instagram_url = '')
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
          FROM organization_sources os3
          WHERE os3.organization_id = o.id
            AND os3.source_channel IN ('google_web_search', 'google_web_search_miss')
            AND os3.last_seen_at >= ?
        )
      ORDER BY
        CASE WHEN o.state = 'SP' THEN 0 ELSE 1 END,
        o.source_confidence DESC,
        o.updated_at ASC
      LIMIT ?
    `)
    .all(retryAfterIso, limit) as WebSearchSeed[]
}

function listOfficialSiteSeeds(db: ReturnType<typeof openLeadEngineDatabase>, limit: number): OfficialSiteSeed[] {
  const retryAfterIso = new Date(Date.now() - OFFICIAL_SITE_RETRY_COOLDOWN_HOURS * 60 * 60 * 1000).toISOString()
  const instagramRetryAfterIso = new Date(
    Date.now() - OFFICIAL_SITE_INSTAGRAM_RECOVERY_COOLDOWN_HOURS * 60 * 60 * 1000
  ).toISOString()

  return db
    .prepare(`
      SELECT
        os.external_id AS externalId,
        o.canonical_name AS canonicalName,
        (
          SELECT e.value
          FROM evidence e
          WHERE e.organization_id = o.id
            AND e.evidence_type IN ('registry_office_name', 'official_office_name')
          ORDER BY e.id DESC
          LIMIT 1
        ) AS officeName,
        o.website_url AS websiteUrl,
        (
          SELECT e.value
          FROM evidence e
          WHERE e.organization_id = o.id
            AND e.evidence_type IN ('web_search_contact_page', 'official_contact_page')
          ORDER BY e.id DESC
          LIMIT 1
        ) AS contactPageUrl
      FROM organizations o
      INNER JOIN organization_sources os
        ON os.organization_id = o.id
       AND os.id = (
         SELECT MAX(os2.id)
         FROM organization_sources os2
         WHERE os2.organization_id = o.id
           AND os2.source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery')
       )
      WHERE o.website_url IS NOT NULL
        AND o.website_url != ''
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
        AND (
          o.primary_email IS NULL OR o.primary_email = ''
          OR o.instagram_url IS NULL OR o.instagram_url = ''
          OR (
            (o.primary_phone IS NULL OR o.primary_phone = '')
            AND (o.primary_whatsapp IS NULL OR o.primary_whatsapp = '')
          )
        )
        AND NOT EXISTS (
          SELECT 1
          FROM organization_sources os4
          WHERE os4.organization_id = o.id
            AND os4.source_channel = 'official_site'
            AND os4.last_seen_at >= CASE
              WHEN o.instagram_url IS NULL OR o.instagram_url = '' THEN ?
              ELSE ?
            END
        )
      ORDER BY
        CASE
          WHEN o.instagram_url IS NULL OR o.instagram_url = '' THEN 0
          ELSE 1
        END,
        CASE
          WHEN o.primary_email IS NOT NULL AND o.primary_email != '' THEN 0
          ELSE 1
        END,
        CASE
          WHEN NOT EXISTS (
            SELECT 1
            FROM organization_sources os3
            WHERE os3.organization_id = o.id
              AND os3.source_channel = 'official_site'
          ) THEN 0
          ELSE 1
        END,
        CASE WHEN o.state = 'SP' THEN 0 ELSE 1 END,
        o.updated_at ASC
      LIMIT ?
    `)
    .all(instagramRetryAfterIso, retryAfterIso, limit)
    .map((row) => ({
      ...row,
      sourceUrl: row.contactPageUrl || row.websiteUrl,
    })) as OfficialSiteSeed[]
}

function getOrganizationCount(db: ReturnType<typeof openLeadEngineDatabase>) {
  const row = db.prepare('SELECT COUNT(*) AS count FROM organizations').get() as { count: number }
  return Number(row.count ?? 0)
}

function getCounts(db: ReturnType<typeof openLeadEngineDatabase>) {
  const row = db
    .prepare(`
      SELECT
        COUNT(*) AS organizations,
        SUM(CASE WHEN state = 'PR' THEN 1 ELSE 0 END) AS pr,
        SUM(CASE WHEN state = 'SP' THEN 1 ELSE 0 END) AS sp,
        SUM(CASE WHEN status = 'raw' THEN 1 ELSE 0 END) AS rawCount,
        SUM(CASE WHEN status = 'ready_for_review' THEN 1 ELSE 0 END) AS readyCount,
        SUM(CASE WHEN status = 'needs_manual_review' THEN 1 ELSE 0 END) AS manualCount,
        SUM(CASE WHEN primary_email IS NOT NULL AND primary_email != '' THEN 1 ELSE 0 END) AS withEmail,
        SUM(CASE WHEN instagram_url IS NOT NULL AND instagram_url != '' THEN 1 ELSE 0 END) AS withInstagram,
        SUM(CASE WHEN primary_whatsapp IS NOT NULL AND primary_whatsapp != '' THEN 1 ELSE 0 END) AS withWhatsapp,
        SUM(CASE WHEN primary_phone IS NOT NULL AND primary_phone != '' THEN 1 ELSE 0 END) AS withPhone
      FROM organizations
    `)
    .get() as {
      organizations: number
      pr: number | null
      sp: number | null
      rawCount: number | null
      readyCount: number | null
      manualCount: number | null
      withEmail: number | null
      withInstagram: number | null
      withWhatsapp: number | null
      withPhone: number | null
    }

  return {
    organizations: Number(row.organizations ?? 0),
    pr: Number(row.pr ?? 0),
    sp: Number(row.sp ?? 0),
    rawCount: Number(row.rawCount ?? 0),
    readyCount: Number(row.readyCount ?? 0),
    manualCount: Number(row.manualCount ?? 0),
    withEmail: Number(row.withEmail ?? 0),
    withInstagram: Number(row.withInstagram ?? 0),
    withWhatsapp: Number(row.withWhatsapp ?? 0),
    withPhone: Number(row.withPhone ?? 0),
  }
}

function getWeeklyCodexCredits(db: ReturnType<typeof openLeadEngineDatabase>) {
  const row = db.prepare(`
    SELECT COALESCE(SUM(estimated_credits), 0) AS credits
    FROM llm_review_runs
    WHERE provider = 'codex'
      AND started_at >= ?
  `).get(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) as { credits: number | null }

  return Number(row.credits ?? 0)
}

function resolveOrganizationIdByExternalId(db: ReturnType<typeof openLeadEngineDatabase>, externalId: string) {
  const row = db.prepare(`
    SELECT organization_id AS organizationId
    FROM organization_sources
    WHERE source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery')
      AND external_id = ?
    ORDER BY id DESC
    LIMIT 1
  `).get(externalId) as { organizationId?: string } | undefined

  return row?.organizationId ?? null
}

function evaluateDiscoveryBackpressure(
  counts: ReturnType<typeof getCounts>,
  thresholds: {
    maxRawBacklog: number
    maxRawToReviewRatio: number
  }
) {
  const reviewBuffer = counts.readyCount + counts.manualCount
  const rawToReviewRatio = counts.rawCount / Math.max(reviewBuffer, 1)
  const pauseDiscovery = counts.rawCount >= thresholds.maxRawBacklog && rawToReviewRatio >= thresholds.maxRawToReviewRatio

  return {
    pauseDiscovery,
    metrics: {
      rawCount: counts.rawCount,
      rawToReviewRatio: Number(rawToReviewRatio.toFixed(2)),
      reviewBuffer,
    },
    thresholds,
  }
}

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  task: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let cursor = 0

  async function worker() {
    while (cursor < items.length) {
      const currentIndex = cursor
      cursor += 1
      results[currentIndex] = await task(items[currentIndex])
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()))
  return results
}

function normalizeOrganizationName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]+/g, '')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .toUpperCase()
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]+/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

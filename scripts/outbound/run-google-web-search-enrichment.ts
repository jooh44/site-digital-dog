import { join } from 'node:path'
import { mkdirSync, writeFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import {
  completeSearchRun,
  createSearchRun,
  failSearchRun,
  listShortlistForCampaign,
  openLeadEngineDatabase,
  upsertWebSearchMatch,
} from '../../lib/outbound/leadEngineStore.ts'
import { buildWebSearchSeeds, enrichOrganizationViaGoogleSearch } from '../../lib/outbound/googleWebSearch.ts'

const { values } = parseArgs({
  options: {
    campaignId: { type: 'string' },
    limit: { type: 'string' },
    onlyMissingSite: { type: 'boolean' },
  },
})

const campaignId = values.campaignId ?? 'camp-advocacia-trabalhista-curitiba'
const limit = values.limit ? Number.parseInt(values.limit, 10) : 10
const onlyMissingSite = values.onlyMissingSite ?? true
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')
const outputPath = join(outputDirectory, `${campaignId}-google-web-search-enrichment.json`)

void main()

async function main() {
  const nowIso = new Date().toISOString()
  const db = openLeadEngineDatabase()
  mkdirSync(outputDirectory, { recursive: true })

  const shortlist = listShortlistForCampaign(db, campaignId, Math.max(limit * 3, limit))
  const filtered = shortlist
    .filter((lead) => {
      if (!onlyMissingSite) {
        return true
      }

      return !lead.websiteUrl || !lead.instagramUrl
    })
    .slice(0, limit)

  const seeds = buildWebSearchSeeds(filtered)

  const searchRunId = createSearchRun(db, {
    campaignId,
    sourceChannel: 'google_web_search',
    toolName: 'google_search_cli_fallback',
    queryText: seeds.map((seed) => `${seed.canonicalName} ${seed.city ?? ''}`).join(' | '),
    notes: 'Fallback web search to discover official site, Instagram and contact-page hints.',
  }, nowIso)

  const matches: Array<Record<string, unknown>> = []
  const misses: Array<Record<string, unknown>> = []

  try {
    for (const seed of seeds) {
      try {
        const enriched = await enrichOrganizationViaGoogleSearch(seed)

        if (!enriched) {
          misses.push({
            canonicalName: seed.canonicalName,
            externalId: seed.externalId,
            reason: 'No useful web search result matched the office identity.',
          })
          continue
        }

        const organizationId = upsertWebSearchMatch(db, enriched, searchRunId, new Date().toISOString())

        matches.push({
          canonicalName: seed.canonicalName,
          externalId: seed.externalId,
          instagramUrl: enriched.instagramUrl,
          organizationId,
          websiteUrl: enriched.websiteUrl,
        })
      } catch (error) {
        misses.push({
          canonicalName: seed.canonicalName,
          error: error instanceof Error ? error.message : 'Unknown google web search error.',
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
        ? 'Google web-search fallback completed.'
        : `Google web-search fallback completed with ${misses.length} miss(es).`
    )

    writeFileSync(outputPath, `${JSON.stringify({
      campaignId,
      matches,
      misses,
      onlyMissingSite,
      searchRunId,
    }, null, 2)}\n`)

    console.log(JSON.stringify({
      campaignId,
      matched: matches.length,
      misses: misses.length,
      outputPath,
      searchRunId,
    }, null, 2))
  } catch (error) {
    failSearchRun(
      db,
      searchRunId,
      new Date().toISOString(),
      error instanceof Error ? error.message : 'Unknown google web search fallback error.'
    )
    throw error
  } finally {
    db.close()
  }
}

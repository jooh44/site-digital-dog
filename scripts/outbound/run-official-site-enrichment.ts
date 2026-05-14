import { basename, join, resolve } from 'node:path'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import {
  completeSearchRun,
  createSearchRun,
  failSearchRun,
  openLeadEngineDatabase,
  upsertOfficialSiteLead,
} from '../../lib/outbound/leadEngineStore.ts'
import { enrichOfficialSiteSeed } from '../../lib/outbound/officialSite.ts'
import type { OfficialSiteSeed } from '../../lib/outbound/types.ts'

const { values } = parseArgs({
  options: {
    campaignId: { type: 'string' },
    input: { type: 'string' },
  },
})

const campaignId = values.campaignId ?? 'camp-advocacia-trabalhista-curitiba'
const inputPath = resolve(
  values.input ?? join(process.cwd(), 'scripts', 'outbound', 'input', `${campaignId}-official-site-seeds.json`)
)
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')
const outputStem = buildOutputStem(campaignId, inputPath)
const outputPath = join(outputDirectory, `${outputStem}-official-site-enrichment.json`)
void main()

async function main() {
  const nowIso = new Date().toISOString()
  const db = openLeadEngineDatabase()
  const seeds = JSON.parse(readFileSync(inputPath, 'utf8')) as OfficialSiteSeed[]

  mkdirSync(outputDirectory, { recursive: true })

  const searchRunId = createSearchRun(db, {
    campaignId,
    sourceChannel: 'official_site',
    toolName: 'manual_verified_official_site_fetch',
    queryText: basename(inputPath),
    notes: 'Uses manually verified official-site seeds derived from the OAB-first shortlist. Places stays disabled.',
  }, nowIso)

  const enrichedLeads: Array<Record<string, unknown>> = []
  const failures: Array<Record<string, unknown>> = []

  try {
    for (const seed of seeds) {
      try {
        const enriched = await enrichOfficialSiteSeed(seed)
        const organizationId = upsertOfficialSiteLead(db, enriched, searchRunId, new Date().toISOString())

        enrichedLeads.push({
          canonicalName: seed.canonicalName,
          externalId: seed.externalId,
          officeName: enriched.officeName,
          organizationId,
          primaryEmail: enriched.primaryEmail,
          primaryPhone: enriched.primaryPhone,
          primaryWhatsapp: enriched.primaryWhatsapp,
          sourceUrl: enriched.sourceUrl,
          websiteUrl: enriched.websiteUrl,
        })
      } catch (error) {
        failures.push({
          canonicalName: seed.canonicalName,
          error: error instanceof Error ? error.message : 'Unknown official site error.',
          externalId: seed.externalId,
        })
      }
    }

    const notes = failures.length === 0
      ? 'Official-site enrichment completed and persisted into SQLite.'
      : `Official-site enrichment completed with ${failures.length} seed failure(s).`

    completeSearchRun(db, searchRunId, enrichedLeads.length, new Date().toISOString(), notes)

    writeFileSync(outputPath, `${JSON.stringify({
      campaignId,
      enrichedLeads,
      failures,
      inputPath,
      searchRunId,
    }, null, 2)}\n`)

    console.log(JSON.stringify({
      campaignId,
      enrichedCount: enrichedLeads.length,
      failures: failures.length,
      outputPath,
      searchRunId,
    }, null, 2))
  } catch (error) {
    failSearchRun(
      db,
      searchRunId,
      new Date().toISOString(),
      error instanceof Error ? error.message : 'Unknown official site enrichment error.'
    )

    throw error
  } finally {
    db.close()
  }
}

function buildOutputStem(campaignId: string, inputPath: string): string {
  const inputName = basename(inputPath, '.json')

  if (inputName === `${campaignId}-official-site-seeds`) {
    return campaignId
  }

  return inputName
    .replace(/-seeds$/i, '')
    .replace(/-official-site$/i, '')
}

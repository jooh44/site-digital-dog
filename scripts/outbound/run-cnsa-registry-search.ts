import { basename, join, resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import {
  completeSearchRun,
  createSearchRun,
  failSearchRun,
  openLeadEngineDatabase,
  upsertCampaign,
  upsertCnsaRegistryLead,
} from '../../lib/outbound/leadEngineStore.ts'
import type { CnsaRegistryLead, CnsaRegistrySeed } from '../../lib/outbound/types.ts'

const { values } = parseArgs({
  options: {
    campaignId: { type: 'string' },
    campaignName: { type: 'string' },
    city: { type: 'string' },
    input: { type: 'string' },
    specialtyLabel: { type: 'string' },
    state: { type: 'string' },
  },
})

const campaignId = values.campaignId ?? 'camp-advocacia-trabalhista-curitiba'
const campaignName = values.campaignName ?? 'Advocacia Trabalhista Curitiba'
const city = (values.city ?? 'CURITIBA').toUpperCase()
const specialtyLabel = values.specialtyLabel ?? 'Trabalhista'
const state = normalizeState(values.state)
const inputPath = resolve(
  values.input ?? join(process.cwd(), 'scripts', 'outbound', 'input', `${campaignId}-cnsa-registry-seeds.json`)
)
const nowIso = new Date().toISOString()
const db = openLeadEngineDatabase()
const seeds = JSON.parse(readFileSync(inputPath, 'utf8')) as CnsaRegistrySeed[]

upsertCampaign(db, {
  id: campaignId,
  name: campaignName,
  niche: 'advocacia-trabalhista',
  city,
  sizeRange: 'sociedades-10-50',
  notes: 'DIG-4 society-level seeding through CNSA-compatible manual seeds without Places.',
  status: 'active',
}, nowIso)

const searchRunId = createSearchRun(db, {
  campaignId,
  sourceChannel: 'cnsa_registry',
  toolName: 'manual_verified_cnsa_seed',
  queryText: basename(inputPath),
  notes: 'Uses manually verified society seeds because the public CNSA search is protected by reCAPTCHA.',
}, nowIso)

try {
  for (const seed of seeds) {
    const lead: CnsaRegistryLead = {
      canonicalName: seed.canonicalName,
      city: (seed.city ?? city).toUpperCase(),
      externalId: seed.externalId,
      queryUrl: seed.registryUrl ?? 'https://cnsa.oab.org.br/',
      registryProvider: seed.registryProvider ?? 'cnsa_public_search_manual_seed',
      registryTypeLabel: seed.registryTypeLabel ?? 'SOCIEDADE DE ADVOGADOS',
      sourceConfidence: 0.9,
      sourceUrl: seed.registryUrl ?? 'https://cnsa.oab.org.br/',
      specialtyLabel: seed.specialtyLabel ?? specialtyLabel,
      state: (seed.state ?? state).toUpperCase(),
    }

    upsertCnsaRegistryLead(db, lead, searchRunId, new Date().toISOString())
  }

  completeSearchRun(
    db,
    searchRunId,
    seeds.length,
    new Date().toISOString(),
    'Society-level seeds persisted into cnsa_registry. Official-site enrichment remains the next runtime step.'
  )

  console.log(JSON.stringify({
    campaignId,
    city,
    inputPath,
    resultCount: seeds.length,
    searchRunId,
    sourceChannel: 'cnsa_registry',
    sourceProvider: 'cnsa_public_search_manual_seed',
    nextStep: 'official_site_enrichment',
  }, null, 2))
} catch (error) {
  failSearchRun(
    db,
    searchRunId,
    new Date().toISOString(),
    error instanceof Error ? error.message : 'Unknown cnsa registry error.'
  )

  throw error
} finally {
  db.close()
}

function normalizeState(value?: string): 'PR' {
  if (!value) {
    return 'PR'
  }

  if (value.toUpperCase() !== 'PR') {
    throw new Error('This slice is scoped to Curitiba/PR.')
  }

  return 'PR'
}

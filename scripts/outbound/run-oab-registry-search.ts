import { parseArgs } from 'node:util'
import {
  createSearchRun,
  completeSearchRun,
  failSearchRun,
  openLeadEngineDatabase,
  upsertCampaign,
  upsertOabRegistryLead,
} from '../../lib/outbound/leadEngineStore.ts'
import { fetchOabPrRegistryLeads } from '../../lib/outbound/oabPrRegistry.ts'
import type { OabRegistrySearchInput } from '../../lib/outbound/types.ts'

const { values } = parseArgs({
  options: {
    campaignId: { type: 'string' },
    campaignName: { type: 'string' },
    city: { type: 'string' },
    specialtyCode: { type: 'string' },
    specialtyLabel: { type: 'string' },
    situation: { type: 'string' },
    state: { type: 'string' },
    maxResults: { type: 'string' },
    sizeRange: { type: 'string' },
  },
})

const input: OabRegistrySearchInput = {
  campaignId: values.campaignId ?? 'camp-advocacia-trabalhista-curitiba',
  campaignName: values.campaignName ?? 'Advocacia Trabalhista Curitiba',
  city: (values.city ?? 'CURITIBA').toUpperCase(),
  specialtyCode: values.specialtyCode ?? '6',
  specialtyLabel: values.specialtyLabel ?? 'Trabalhista',
  situation: normalizeSituation(values.situation),
  state: normalizeState(values.state),
  maxResults: values.maxResults ? Number.parseInt(values.maxResults, 10) : 15,
  sizeRange: values.sizeRange ?? 'solo-10',
  notes: 'DIG-3 OAB-first fire test without Places.',
}

void main()

async function main() {
  const nowIso = new Date().toISOString()
  const db = openLeadEngineDatabase()

  upsertCampaign(db, {
    id: input.campaignId,
    name: input.campaignName,
    niche: 'advocacia-trabalhista',
    city: input.city,
    sizeRange: input.sizeRange,
    notes: input.notes,
    status: 'active',
  }, nowIso)

  const searchRunId = createSearchRun(db, {
    campaignId: input.campaignId,
    sourceChannel: 'oab_registry',
    toolName: 'oab_pr_public_directory',
    queryText: `cidade=${input.city}&especialidade=${input.specialtyCode}&situacao=${input.situation}`,
    notes: 'Uses the public OAB PR registry list. Per-record detail pages stay outside this slice because they are protected by Turnstile.',
  }, nowIso)

  try {
    const result = await fetchOabPrRegistryLeads(input)

    for (const lead of result.leads) {
      upsertOabRegistryLead(db, lead, searchRunId, new Date().toISOString())
    }

    completeSearchRun(
      db,
      searchRunId,
      result.leads.length,
      new Date().toISOString(),
      'Registry discovery completed. Official-site enrichment remains the next slice because OAB per-record detail pages are challenge-gated.'
    )

    console.log(JSON.stringify({
      campaignId: input.campaignId,
      city: input.city,
      searchRunId,
      sourceChannel: 'oab_registry',
      sourceProvider: 'oab_pr_public_directory',
      resultCount: result.leads.length,
      queryUrl: result.queryUrl,
      nextStep: 'official_site_lookup',
    }, null, 2))
  } catch (error) {
    failSearchRun(
      db,
      searchRunId,
      new Date().toISOString(),
      error instanceof Error ? error.message : 'Unknown OAB registry error.'
    )

    throw error
  } finally {
    db.close()
  }
}

function normalizeSituation(value?: string): '' | 'A' | 'F' {
  if (value === 'F' || value === '') {
    return value
  }

  return 'A'
}

function normalizeState(value?: string): 'PR' {
  if (value && value.toUpperCase() !== 'PR') {
    throw new Error('This slice only supports the OAB PR public directory.')
  }

  return 'PR'
}

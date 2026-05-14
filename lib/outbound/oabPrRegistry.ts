import { normalizeWhitespace, decodeHtmlEntities } from './html.ts'
import type {
  OabRegistryLead,
  OabRegistrySearchInput,
  OabRegistrySearchResult,
} from './types.ts'

const OAB_PR_BASE_URL = 'https://www.oabpr.org.br'
const OAB_PR_LIST_PATH = '/servicos-consulta-de-advogados/lista-de-advogados/'
const OAB_PR_PROVIDER = 'oab_pr_public_directory'

export function buildOabPrRegistryListUrl(input: Pick<OabRegistrySearchInput, 'city' | 'specialtyCode' | 'situation'>): string {
  const url = new URL(OAB_PR_LIST_PATH, OAB_PR_BASE_URL)
  url.searchParams.set('cidade', input.city)
  url.searchParams.set('especialidade', input.specialtyCode)
  url.searchParams.set('situacao', input.situation)
  return url.toString()
}

export async function fetchOabPrRegistryLeads(input: OabRegistrySearchInput): Promise<OabRegistrySearchResult> {
  if (input.state !== 'PR') {
    throw new Error('Only the OAB PR public directory is implemented in this slice.')
  }

  const queryUrl = buildOabPrRegistryListUrl(input)
  const response = await fetch(queryUrl, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'User-Agent': 'digital-dog-outbound/0.1',
    },
  })

  if (!response.ok) {
    throw new Error(`OAB PR registry request failed with status ${response.status}.`)
  }

  const html = await response.text()
  const leads = parseOabPrRegistryListHtml(html, input)
  const maxResults = input.maxResults ?? leads.length

  return {
    leads: leads.slice(0, maxResults),
    queryUrl,
  }
}

export function parseOabPrRegistryListHtml(html: string, input: OabRegistrySearchInput): OabRegistryLead[] {
  const rowPattern =
    /<tr>\s*<td><a href="([^"]*consulta-de-advogado\/\?[^"]+)">([^<]+)<\/a><\/td>\s*<td><a href="[^"]+">([^<]+)<\/a><\/td>\s*<\/tr>/gim

  const deduped = new Map<string, OabRegistryLead>()
  const queryUrl = buildOabPrRegistryListUrl(input)

  for (const match of Array.from(html.matchAll(rowPattern))) {
    const detailPath = decodeHtmlEntities(match[1] ?? '')
    const registrationLabel = normalizeWhitespace(decodeHtmlEntities(match[2] ?? ''))
    const canonicalName = normalizeWhitespace(decodeHtmlEntities(match[3] ?? ''))

    const detailUrl = new URL(detailPath, OAB_PR_BASE_URL)
    const oabNumber = detailUrl.searchParams.get('oabn')?.trim() ?? registrationLabel.split(' - ')[0]?.trim()
    const inscriptionTypeCode = detailUrl.searchParams.get('tpinsc')?.trim() ?? 'A'
    const inscriptionTypeLabel = registrationLabel.includes(' - ')
      ? registrationLabel.split(' - ').slice(1).join(' - ').trim()
      : 'ADVOGADO'

    if (!oabNumber || !canonicalName) {
      continue
    }

    const externalId = `PR:${inscriptionTypeCode}:${oabNumber}`

    deduped.set(externalId, {
      canonicalName,
      city: input.city,
      externalId,
      inscriptionTypeCode,
      inscriptionTypeLabel,
      oabNumber,
      queryUrl,
      registryProvider: OAB_PR_PROVIDER,
      sourceConfidence: 0.82,
      sourceUrl: detailUrl.toString(),
      specialtyCode: input.specialtyCode,
      specialtyLabel: input.specialtyLabel,
      state: input.state,
    })
  }

  return Array.from(deduped.values())
}

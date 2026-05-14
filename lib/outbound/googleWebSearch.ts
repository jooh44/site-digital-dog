import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { isLikelyOfficialWebsiteUrl } from './domainQuality.ts'
import { DEFAULT_GOOGLE_SEARCH_TOOL_PATH } from './paths.ts'
import type { ShortlistRow, WebSearchOrganizationMatch, WebSearchResult, WebSearchSeed } from './types.ts'

const execFileAsync = promisify(execFile)

type GoogleSearchResponse = {
  query: string
  results: WebSearchResult[]
}

type SearchExecutionOptions = {
  limit?: number
  stateFile?: string
  timeout?: number
  toolPath?: string
}

export async function enrichOrganizationViaGoogleSearch(
  seed: WebSearchSeed,
  options: SearchExecutionOptions = {}
): Promise<WebSearchOrganizationMatch | null> {
  const queries = buildSearchQueries(seed)
  const queryOutputs: Array<{ query: string; results: WebSearchResult[] }> = []

  for (const query of queries) {
    const response = await runGoogleSearchQuery(query, options)
    queryOutputs.push({ query, results: response.results })
  }

  const mergedResults = dedupeSearchResults(queryOutputs.flatMap((entry) => entry.results))
  const websiteCandidate = pickWebsiteCandidate(seed, mergedResults)
  const instagramCandidate = pickInstagramCandidate(seed, mergedResults)

  if (!websiteCandidate && !instagramCandidate) {
    return null
  }

  const websiteUrl = websiteCandidate ? normalizeWebsiteUrl(websiteCandidate.link) : null
  const websiteDomain = websiteUrl ? getDomainFromUrl(websiteUrl) : null
  const instagramUrl = instagramCandidate ? normalizeInstagramUrl(instagramCandidate.link) : null
  const contactPageUrl = websiteUrl ? buildContactPageUrl(websiteUrl, mergedResults) : null
  const sourceUrl = websiteUrl ?? instagramUrl ?? websiteCandidate?.link ?? instagramCandidate?.link ?? seed.websiteUrl ?? seed.websiteDomain ?? ''

  return {
    canonicalName: seed.canonicalName,
    city: seed.city ?? null,
    contactPageUrl,
    externalId: seed.externalId,
    instagramUrl,
    rawPayloadJson: JSON.stringify({
      executedAt: new Date().toISOString(),
      queryOutputs,
      selected: {
        contactPageUrl,
        instagramUrl,
        websiteUrl,
      },
    }),
    sourceConfidence: computeSourceConfidence({ hasInstagram: Boolean(instagramUrl), hasWebsite: Boolean(websiteUrl) }),
    sourceUrl,
    websiteDomain,
    websiteUrl,
  }
}

export function buildWebSearchSeeds(shortlist: ShortlistRow[]): WebSearchSeed[] {
  return shortlist.map((lead) => ({
    canonicalName: lead.officeName ?? lead.canonicalName,
    city: lead.city,
    externalId: lead.externalId,
    officeName: lead.officeName,
    websiteDomain: lead.websiteDomain,
    websiteUrl: lead.websiteUrl,
  }))
}

export async function runGoogleSearchQuery(
  query: string,
  options: SearchExecutionOptions
): Promise<GoogleSearchResponse> {
  const toolPath = options.toolPath ?? DEFAULT_GOOGLE_SEARCH_TOOL_PATH
  const entryPath = `${toolPath}/dist/src/index.js`
  const stateFile = options.stateFile ?? `${toolPath}/browser-state.json`
  const args = [
    entryPath,
    '--limit',
    String(options.limit ?? 5),
    '--timeout',
    String(options.timeout ?? 15000),
    '--state-file',
    stateFile,
    query,
  ]

  const { stdout } = await execFileAsync('node', args, {
    cwd: toolPath,
    env: {
      ...process.env,
      LOG_LEVEL: process.env.LOG_LEVEL ?? 'silent',
    },
    maxBuffer: 1024 * 1024 * 8,
    timeout: (options.timeout ?? 15000) + 15000,
  })

  return JSON.parse(extractJsonPayload(stdout)) as GoogleSearchResponse
}

function buildSearchQueries(seed: WebSearchSeed) {
  const office = JSON.stringify(seed.officeName ?? seed.canonicalName)
  const city = seed.city ? ` ${JSON.stringify(seed.city)}` : ''

  return [
    `${office}${city} advogado`,
    `${office}${city} site oficial`,
    `${office}${city} site:instagram.com`,
  ]
}

function pickWebsiteCandidate(seed: WebSearchSeed, results: WebSearchResult[]) {
  return results
    .filter((result) => {
      const url = safeUrl(result.link)

      if (!url) {
        return false
      }

      const hostname = url.hostname.replace(/^www\./i, '').toLowerCase()

      if (!isLikelyOfficialWebsiteUrl(result.link)) {
        return false
      }

      if (seed.websiteDomain && hostname === seed.websiteDomain.replace(/^www\./i, '').toLowerCase()) {
        return true
      }

      return scoreSearchResult(seed, result) >= 3
    })
    .sort((left, right) => scoreSearchResult(seed, right) - scoreSearchResult(seed, left))[0]
}

function pickInstagramCandidate(seed: WebSearchSeed, results: WebSearchResult[]) {
  return results
    .filter((result) => {
      const url = safeUrl(result.link)

      if (!url) {
        return false
      }

      if (!url.hostname.includes('instagram.com')) {
        return false
      }

      return scoreSearchResult(seed, result) >= 2
    })
    .sort((left, right) => scoreSearchResult(seed, right) - scoreSearchResult(seed, left))[0]
}

function buildContactPageUrl(websiteUrl: string, results: WebSearchResult[]) {
  const contactResult = results.find((result) => {
    const url = safeUrl(result.link)
    if (!url) {
      return false
    }

    const normalized = url.pathname.toLowerCase()
    return normalized.includes('contato') || normalized.includes('fale-conosco') || normalized.includes('contate')
  })

  if (contactResult) {
    return contactResult.link
  }

  return new URL('/contato', websiteUrl).toString()
}

function computeSourceConfidence({ hasInstagram, hasWebsite }: { hasInstagram: boolean; hasWebsite: boolean }) {
  if (hasWebsite && hasInstagram) {
    return 0.88
  }

  if (hasWebsite) {
    return 0.8
  }

  return 0.7
}

function scoreSearchResult(seed: WebSearchSeed, result: WebSearchResult) {
  const haystack = normalizeForSearch([result.title, result.snippet, result.link].join(' '))
  const primaryName = normalizeForSearch(seed.officeName ?? seed.canonicalName)
  const city = normalizeForSearch(seed.city ?? '')
  let score = 0

  for (const token of primaryName.split(' ').filter((token) => token.length >= 3)) {
    if (haystack.includes(token)) {
      score += 1
    }
  }

  if (city && haystack.includes(city)) {
    score += 1
  }

  if (haystack.includes('advogados') || haystack.includes('advocacia')) {
    score += 1
  }

  return score
}

function normalizeWebsiteUrl(value: string) {
  const url = safeUrl(value)
  if (!url) {
    return null
  }

  url.hash = ''
  url.search = ''
  if (!url.pathname || url.pathname === '/') {
    url.pathname = '/'
    return url.toString()
  }

  return `${url.origin}${url.pathname.replace(/\/+$/g, '') || '/'}`
}

function normalizeInstagramUrl(value: string) {
  const url = safeUrl(value)
  if (!url) {
    return null
  }

  const parts = url.pathname.split('/').filter(Boolean)
  if (parts.length === 0) {
    return null
  }

  const handle = parts[0].toLowerCase()

  if (isReservedInstagramPath(handle)) {
    return null
  }

  return `https://www.instagram.com/${handle}/`
}

function getDomainFromUrl(value: string) {
  const url = safeUrl(value)
  return url ? url.hostname.replace(/^www\./i, '') : null
}

function dedupeSearchResults(results: WebSearchResult[]) {
  const seen = new Set<string>()
  const deduped: WebSearchResult[] = []

  for (const result of results) {
    const key = result.link.trim().toLowerCase()
    if (!key || seen.has(key)) {
      continue
    }

    seen.add(key)
    deduped.push(result)
  }

  return deduped
}

function extractJsonPayload(stdout: string) {
  const lines = stdout.trim().split('\n').filter(Boolean)

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const slice = lines.slice(index).join('\n')

    try {
      JSON.parse(slice)
      return slice
    } catch {
      continue
    }
  }

  throw new Error('Google search tool did not return a JSON payload.')
}

function normalizeForSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]+/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function safeUrl(value: string) {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function isReservedInstagramPath(value: string) {
  return new Set([
    'accounts',
    'explore',
    'p',
    'reel',
    'reels',
    'share',
    'stories',
    'tv',
  ]).has(value)
}

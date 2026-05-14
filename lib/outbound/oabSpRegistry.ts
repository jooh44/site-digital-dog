import { decodeHtmlEntities, normalizeWhitespace } from './html.ts'
import type { OabRegistryLead } from './types.ts'

const OAB_SP_BASE_URL = 'https://www2.oabsp.org.br/asp/consultaInscritos/'
const OAB_SP_FORM_URL = new URL('consulta01.asp', OAB_SP_BASE_URL).toString()
const OAB_SP_RESULT_URL = new URL('consulta_advogado_nome_result.asp', OAB_SP_BASE_URL).toString()
const OAB_SP_PROVIDER = 'oab_sp_name_search'

export type OabSpRegistrySearchInput = {
  cityId: string
  cityName: string
  namePrefixes: string[]
  specialtyLabel: string
  specialtyCode?: string
}

export type OabSpRegistrySearchResult = {
  leads: OabRegistryLead[]
  querySummaries: string[]
}

export async function fetchOabSpRegistryLeads(input: OabSpRegistrySearchInput): Promise<OabSpRegistrySearchResult> {
  const session = await createSession()
  const deduped = new Map<string, OabRegistryLead>()
  const querySummaries: string[] = []

  for (const rawPrefix of input.namePrefixes) {
    const prefix = rawPrefix.trim().toUpperCase()

    if (prefix.length < 4) {
      continue
    }

    const response = await session.fetch(OAB_SP_RESULT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Referer: OAB_SP_FORM_URL,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: new URLSearchParams({
        pagina: '0',
        tipo_consulta: '2',
        nome_advogado: prefix,
        parte_nome: '1',
        idCidade: input.cityId,
        cbxadv: '1',
        id_tipoinscricao: '1',
      }),
    })

    if (!response.ok) {
      throw new Error(`OAB SP registry request failed for prefix ${prefix} with status ${response.status}.`)
    }

    const html = await response.text()
    const leads = parseOabSpRegistryResultHtml(html, {
      cityName: input.cityName,
      prefix,
      specialtyCode: input.specialtyCode ?? 'advocacia',
      specialtyLabel: input.specialtyLabel,
    })

    querySummaries.push(`prefix=${prefix}&cityId=${input.cityId}&results=${leads.length}`)

    for (const lead of leads) {
      deduped.set(lead.externalId, lead)
    }
  }

  return {
    leads: Array.from(deduped.values()),
    querySummaries,
  }
}

type ParseOptions = {
  cityName: string
  prefix: string
  specialtyCode: string
  specialtyLabel: string
}

export function parseOabSpRegistryResultHtml(html: string, options: ParseOptions): OabRegistryLead[] {
  const profileBlocks = html
    .split(/<div class='perfil'[^>]*>/i)
    .slice(1)
    .map((block) => block.split('</div>', 1)[0] ?? '')
    .filter((block) => /OAB SP/i.test(block))
  const leads: OabRegistryLead[] = []

  for (const block of profileBlocks) {
    const canonicalName = matchText(block, /<span><strong>([^<]+)<\/strong><\/span>/i)
    const officeName = matchText(block, /consultaSociedades03\.asp\?param=[^']+'>([^<]+)</i)
    const plainText = toPlainText(block)
    const oabNumber = plainText.match(/OAB SP[^:\n]*:\s*([0-9]+)/i)?.[1]?.trim() ?? null
    const inscriptionTypeLabel = plainText.match(/OAB SP[^:\n]*:\s*[0-9]+\s*-\s*([^\n]+)/i)?.[1]?.trim() ?? null
    const subsection = plainText.match(/Subse[^:\n]*:\s*([^\n]+)/i)?.[1]?.trim() ?? null

    if (!canonicalName || !oabNumber) {
      continue
    }

    const externalId = `SP:A:${oabNumber}`
    const sourceUrl = `${OAB_SP_RESULT_URL}?prefix=${encodeURIComponent(options.prefix)}&city=${encodeURIComponent(options.cityName)}`

    leads.push({
      canonicalName,
      city: options.cityName,
      externalId,
      inscriptionTypeCode: 'A',
      inscriptionTypeLabel: inscriptionTypeLabel || 'Definitivo',
      officeName,
      oabNumber,
      queryUrl: sourceUrl,
      registryProvider: OAB_SP_PROVIDER,
      sourceConfidence: officeName ? 0.84 : 0.76,
      sourceUrl,
      specialtyCode: options.specialtyCode,
      specialtyLabel: options.specialtyLabel,
      state: 'SP',
      subsection,
    })
  }

  return leads
}

function matchText(block: string, pattern: RegExp): string | null {
  const raw = block.match(pattern)?.[1]

  if (!raw) {
    return null
  }

  return normalizeRegistryText(raw)
}

function toPlainText(block: string): string {
  const raw = decodeHtmlEntities(
    block
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )

  return repairMojibake(raw)
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

function normalizeRegistryText(value: string): string {
  return normalizeWhitespace(repairMojibake(decodeHtmlEntities(value)))
}

function repairMojibake(value: string): string {
  if (!/[ÃÂ]/.test(value)) {
    return value
  }

  try {
    return Buffer.from(value, 'latin1').toString('utf8')
  } catch {
    return value
  }
}

async function createSession() {
  const cookieHeaders: string[] = []

  await fetch(OAB_SP_FORM_URL, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'User-Agent': 'digital-dog-outbound/0.1',
    },
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`OAB SP form bootstrap failed with status ${response.status}.`)
    }

    for (const cookie of response.headers.getSetCookie()) {
      cookieHeaders.push(cookie.split(';', 1)[0])
    }

    await response.arrayBuffer()
  })

  return {
    fetch(url: string, init: RequestInit = {}) {
      const headers = new Headers(init.headers)

      if (cookieHeaders.length > 0) {
        headers.set('Cookie', cookieHeaders.join('; '))
      }

      if (!headers.has('User-Agent')) {
        headers.set('User-Agent', 'digital-dog-outbound/0.1')
      }

      return fetch(url, {
        ...init,
        headers,
      })
    },
  }
}

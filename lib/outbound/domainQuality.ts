import { resolveMx } from 'node:dns/promises'

const BLOCKED_HOST_PATTERNS = [
  'linkedin.com',
  'facebook.com',
  'glassdoor.com',
  'glassdoor.com.br',
  'econodata.com.br',
  'infojobs.com.br',
  'trabalhabrasil.com.br',
  'empregos.com.br',
  'vagas.com.br',
  'google.com',
  '10melhoresempresas.com.br',
  'advdinamico.com.br',
  'analise.com',
  'cnpj.biz',
  'cnpj.info',
  'cnpja.com',
  'serasaexperian.com.br',
  'oab.org.br',
  'jusbrasil.com.br',
  'escavador.com',
  'juridicocerto.com',
  'solides.com.br',
  'solutudo.com.br',
  'telelistas.net',
  'reclameaqui.com.br',
  'empresascnpj.com',
  'consultas.plus',
  'casadosdados.com.br',
  'empresaqui.com.br',
  'imprensaoficial.com.br',
  'contabilizei.com.br',
  'diariooficial.sp.gov.br',
  'indeed.com',
  'apontador.com.br',
  'guiamais.com.br',
  'catho.com.br',
]

const BLOCKED_EMAIL_DOMAINS = [
  'aasp.org.br',
  'analise.com',
  'contabilizei.com.br',
  'econodata.com.br',
  'gmail.com',
  'hotmail.com',
  'juridicocerto.com',
  'outlook.com',
  'uol.com.br',
  'yahoo.com',
]

const PUBLIC_SUFFIX_THREE = new Set([
  'adv.br',
  'com.br',
  'emp.br',
  'net.br',
  'org.br',
])

const BLOCKED_PATH_PARTS = [
  '/vaga',
  '/vagas',
  '/jobs',
  '/job',
  '/company',
  '/pagamento-mensal',
  '/salarios',
  '/in/',
  '/people/',
]

export function isLikelyOfficialWebsiteUrl(value: string | null | undefined): boolean {
  const url = safeUrl(value)

  if (!url) {
    return false
  }

  const hostname = url.hostname.replace(/^www\./i, '').toLowerCase()
  const path = url.pathname.toLowerCase()

  if (hostname.includes('instagram.com')) {
    return false
  }

  if (BLOCKED_HOST_PATTERNS.some((pattern) => hostname === pattern || hostname.endsWith(`.${pattern}`))) {
    return false
  }

  if (BLOCKED_PATH_PARTS.some((part) => path.includes(part))) {
    return false
  }

  return true
}

export function getWebsiteIssueLabel(value: string | null | undefined): string | null {
  if (!value) {
    return 'sem_site'
  }

  const url = safeUrl(value)

  if (!url) {
    return 'site_invalido'
  }

  if (!isLikelyOfficialWebsiteUrl(value)) {
    return 'site_suspeito'
  }

  return null
}

export function isBlockedEmailDomain(value: string | null | undefined): boolean {
  const domain = normalizeEmailDomain(value)

  if (!domain) {
    return false
  }

  return BLOCKED_EMAIL_DOMAINS.some((entry) => domain === entry || domain.endsWith(`.${entry}`))
}

export type EmailDomainValidationResult = {
  domain: string | null
  reason: string | null
  valid: boolean
}

export async function validateEmailDomain(value: string | null | undefined): Promise<EmailDomainValidationResult> {
  const domain = normalizeEmailDomain(value)

  if (!domain) {
    return {
      domain: null,
      reason: 'invalid_email_format',
      valid: false,
    }
  }

  if (isBlockedEmailDomain(value)) {
    return {
      domain,
      reason: 'blocked_email_domain',
      valid: false,
    }
  }

  try {
    const records = await resolveMx(domain)
    const hasMx = records.some((record) => Boolean(record.exchange))

    return {
      domain,
      reason: hasMx ? null : 'mx_not_found',
      valid: hasMx,
    }
  } catch {
    return {
      domain,
      reason: 'mx_lookup_failed',
      valid: false,
    }
  }
}

export function getRegistrableDomain(value: string | null | undefined): string | null {
  const domain = normalizeEmailDomain(value) ?? normalizeHost(value)

  if (!domain) {
    return null
  }

  const parts = domain.split('.').filter(Boolean)

  if (parts.length < 2) {
    return domain
  }

  const joinedTail = parts.slice(-2).join('.')

  if (PUBLIC_SUFFIX_THREE.has(joinedTail) && parts.length >= 3) {
    return parts.slice(-3).join('.')
  }

  return parts.slice(-2).join('.')
}

function normalizeEmailDomain(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  if (!value.includes('@')) {
    return null
  }

  const domain = value.split('@').pop()?.trim().toLowerCase() ?? ''
  return domain ? domain.replace(/^www\./i, '') : null
}

function normalizeHost(value: string | null | undefined): string | null {
  const url = safeUrl(value) ?? safeUrl(value ? `https://${value}` : null)

  if (!url) {
    return null
  }

  return url.hostname.replace(/^www\./i, '').toLowerCase()
}

function safeUrl(value: string | null | undefined) {
  if (!value) {
    return null
  }

  try {
    return new URL(value)
  } catch {
    return null
  }
}

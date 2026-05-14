import type { EmailCampaignManifest, FollowupEmailCampaignManifest, ShortlistRow } from './types.ts'

type EmailDraft = {
  subject: string
  htmlBody: string
  personalizationJson: string
  textBody: string
}

type EmailTemplateContext = Record<string, string>

const GENERIC_OFFICE_NAMES = new Set([
  'advogado',
  'areas de atuacao',
  'contato',
  'direito trabalhista',
  'escritorio de advocacia empresarial',
  'fale conosco',
  'home',
  'pagina inicial',
  'quem somos',
])

const MAX_OFFICE_NAME_LENGTH = 90
const MAX_OFFICE_NAME_WORDS = 12

export function buildEmailDraft(
  manifest: EmailCampaignManifest | FollowupEmailCampaignManifest,
  lead: ShortlistRow
): EmailDraft {
  const context = buildEmailTemplateContext(lead)
  const subject = renderTemplate(manifest.subjectTemplate, context)
  const introLines = renderLines(manifest.introLines, context)
  const bodyLines = renderLines(manifest.bodyLines ?? [], context)
  const closingLines = renderLines(manifest.closingLines ?? [], context)
  const ctaLabel = manifest.ctaLabel ? renderTemplate(manifest.ctaLabel, context) : ''
  const ctaUrl = manifest.ctaUrl ? renderTemplate(manifest.ctaUrl, context) : ''
  const signatureLines = buildSignatureLines(manifest, context)

  const htmlParts: string[] = []

  for (const line of [...introLines, ...bodyLines]) {
    htmlParts.push(`<p style="margin:0 0 14px">${escapeHtml(line)}</p>`)
  }

  if (ctaLabel && ctaUrl) {
    htmlParts.push(
      `<p style="margin:0 0 14px"><a href="${escapeHtmlAttribute(ctaUrl)}" ` +
      'style="color:#0f172a;text-decoration:underline;font-weight:600">' +
      `${escapeHtml(ctaLabel)}</a></p>`
    )
  }

  for (const line of closingLines) {
    htmlParts.push(`<p style="margin:0 0 14px">${escapeHtml(line)}</p>`)
  }

  htmlParts.push(
    `<p style="margin:18px 0 0">${signatureLines.map((line) => escapeHtml(line)).join('<br />')}</p>`
  )

  const textLines = [
    ...introLines,
    ...bodyLines,
    ...(ctaLabel && ctaUrl ? [`${ctaLabel}: ${ctaUrl}`] : []),
    ...closingLines,
    '',
    ...signatureLines,
  ]

  return {
    subject,
    htmlBody:
      '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#111827;max-width:640px">' +
      `${htmlParts.join('')}` +
      '</div>',
    personalizationJson: JSON.stringify({
      campaignId: manifest.emailCampaignId,
      city: context.city,
      officeName: context.officeName,
      organizationId: lead.id,
      primaryEmail: lead.primaryEmail,
      specialtyLabel: context.specialtyLabel,
      websiteDomain: context.websiteDomain,
    }),
    textBody: textLines.join('\n'),
  }
}

export function extractEmailAddress(value: string): string {
  const match = value.match(/<([^>]+)>/)
  if (match?.[1]) {
    return match[1].trim().toLowerCase()
  }

  return value.trim().toLowerCase()
}

export function buildEmailTemplateContext(lead: ShortlistRow): EmailTemplateContext {
  const officeName = resolveLeadOfficeName(lead) ?? toTitleCase(lead.canonicalName)
  const canonicalName = toTitleCase(lead.canonicalName)
  const city = toTitleCase(lead.city)
  const state = (lead.state ?? '').trim().toUpperCase()
  const websiteDomain = lead.websiteDomain ?? ''
  const websiteUrl = lead.websiteUrl ?? ''
  const officialSiteUrl = lead.officialSiteUrl ?? ''
  const registryUrl = lead.registryUrl
  const specialtyLabel = lead.specialtyLabel ?? ''

  return {
    canonicalName,
    city,
    displayName: officeName,
    officialSiteUrl,
    officeName,
    primaryEmail: lead.primaryEmail ?? '',
    registryUrl,
    specialtyLabel,
    state,
    websiteDomain,
    websiteUrl,
  }
}

export function resolveLeadOfficeName(
  lead: Pick<ShortlistRow, 'canonicalName' | 'officeName' | 'officialSiteTitle'>
): string | null {
  const candidates = [
    lead.officeName,
    lead.canonicalName,
    lead.officialSiteTitle,
  ]

  for (const candidate of candidates) {
    const sanitized = sanitizeOfficeName(candidate)

    if (sanitized) {
      return sanitized
    }
  }

  return null
}

function sanitizeOfficeName(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  let sanitized = value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.]{3,}\s*$/g, '')
    .replace(/…+\s*$/g, '')

  sanitized = sanitized.replace(/^(contato|fale conosco|home|p[áa]gina inicial|quem somos)\s*[-–—:|]\s*/i, '')
  sanitized = sanitized.replace(/\s*[-–—:|]\s*(contato|fale conosco|home|p[áa]gina inicial|quem somos|site profissional.*|carrega a.*)$/i, '')
  sanitized = sanitized.replace(/\s*:\s*(p[áa]gina inicial|home)$/i, '')
  sanitized = sanitized.trim()

  if (!sanitized) {
    return null
  }

  if (isGenericOfficeName(sanitized) || looksLikeOfficeDescription(sanitized)) {
    return null
  }

  return toTitleCase(sanitized)
}

function isGenericOfficeName(value: string): boolean {
  const normalized = normalizeOfficeName(value)

  if (!normalized) {
    return true
  }

  if (GENERIC_OFFICE_NAMES.has(normalized)) {
    return true
  }

  if (/^(advogado|direito|escritorio)\b/.test(normalized) && !/(advogados|advocacia|sociedade|associados|consultoria|juridic)/.test(normalized)) {
    return true
  }

  return false
}

function normalizeOfficeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function looksLikeOfficeDescription(value: string): boolean {
  const compact = value.trim()
  const wordCount = compact.split(/\s+/).filter(Boolean).length

  if (compact.length > MAX_OFFICE_NAME_LENGTH) {
    return true
  }

  if (wordCount > MAX_OFFICE_NAME_WORDS) {
    return true
  }

  if (/[.!?;]/.test(compact) && wordCount > 4) {
    return true
  }

  return false
}

export function buildScheduleTimestamps(startAt: string, cadenceMinutes: number, count: number): string[] {
  const startAtMs = new Date(startAt).valueOf()

  if (Number.isNaN(startAtMs)) {
    throw new Error(`Invalid startAt provided for scheduling: ${startAt}`)
  }

  const safeCadenceMinutes = cadenceMinutes > 0 ? cadenceMinutes : 10

  return Array.from({ length: count }, (_, index) => {
    return new Date(startAtMs + index * safeCadenceMinutes * 60_000).toISOString()
  })
}

export function renderTemplate(template: string, context: EmailTemplateContext): string {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => context[key] ?? '')
}

function buildSignatureLines(
  manifest: EmailCampaignManifest | FollowupEmailCampaignManifest,
  context: EmailTemplateContext
): string[] {
  const lines = [manifest.signature.name]

  if (manifest.signature.role) {
    lines.push(renderTemplate(manifest.signature.role, context))
  }

  if (manifest.signature.phone) {
    lines.push(renderTemplate(manifest.signature.phone, context))
  }

  if (manifest.signature.email) {
    lines.push(renderTemplate(manifest.signature.email, context))
  }

  if (manifest.signature.website) {
    lines.push(renderTemplate(manifest.signature.website, context))
  }

  return lines.filter(Boolean)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeHtmlAttribute(value: string): string {
  return escapeHtml(value)
}

function renderLines(lines: string[], context: EmailTemplateContext): string[] {
  return lines
    .map((line) => renderTemplate(line, context).trim())
    .filter(Boolean)
}

function toTitleCase(value: string): string {
  return value
    .toLocaleLowerCase('pt-BR')
    .split(/\s+/)
    .map((segment) => {
      if (!segment) {
        return segment
      }

      return segment.charAt(0).toLocaleUpperCase('pt-BR') + segment.slice(1)
    })
    .join(' ')
}

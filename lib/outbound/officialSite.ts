import { decodeHtmlEntities, normalizeWhitespace } from './html.ts'
import { getRegistrableDomain } from './domainQuality.ts'
import type {
  OfficialSiteContact,
  OfficialSiteEnrichment,
  OfficialSiteEvidence,
  OfficialSiteSeed,
} from './types.ts'

const CONTACT_PAGE_PATHS = [
  '/contato/',
  '/contato',
  '/fale-conosco/',
  '/fale-conosco',
  '/contato.php',
  '/contact/',
  '/contact',
  '/escritorio/contato/',
  '/escritorio/contato',
]
const FETCH_TIMEOUT_MS = 8000
const RENDER_TIMEOUT_MS = 12000
const GENERIC_EMAIL_PREFIXES = new Set([
  'adm',
  'administrativo',
  'atendimento',
  'comercial',
  'contato',
  'hello',
  'info',
  'juridico',
  'marketing',
  'oi',
  'sac',
  'suporte',
])

type ContactType = OfficialSiteContact['contactType']

type FetchedPage = {
  contactLinks: string[]
  emails: string[]
  finalUrl: string
  instagramUrls: string[]
  phones: string[]
  requestedUrl: string
  siteName: string | null
  text: string
  title: string | null
  whatsappNumbers: string[]
  whatsappUrls: string[]
}

export type OfficialSiteContactProbe = {
  contactPageUrl: string | null
  contacts: OfficialSiteContact[]
  instagramUrl: string | null
  primaryEmail: string | null
  sourceUrl: string
  visitedUrls: string[]
  websiteUrl: string
}

export async function enrichOfficialSiteSeed(seed: OfficialSiteSeed): Promise<OfficialSiteEnrichment> {
  const normalizedSourceUrl = normalizeUrl(seed.sourceUrl)
  const normalizedWebsiteUrl = normalizeRootUrl(seed.websiteUrl ?? `${new URL(normalizedSourceUrl).origin}/`)
  const candidateUrls = dedupeValues([
    normalizedSourceUrl,
    seed.contactPageUrl ? normalizeUrl(seed.contactPageUrl) : null,
    normalizedWebsiteUrl,
    ...CONTACT_PAGE_PATHS.map((path) => new URL(path, normalizedWebsiteUrl).toString()),
  ])

  const pageMap = new Map<string, FetchedPage>()

  for (const url of candidateUrls) {
    const page = await fetchOfficialHtmlPage(url)

    if (page) {
      pageMap.set(page.finalUrl, page)
    }
  }

  const discoveredContactUrls = dedupeValues(
    Array.from(pageMap.values()).flatMap((page) => page.contactLinks.map((link) => normalizeUrl(link)))
  )

  for (const url of discoveredContactUrls) {
    if (pageMap.has(url)) {
      continue
    }

    const page = await fetchOfficialHtmlPage(url)

    if (page) {
      pageMap.set(page.finalUrl, page)
    }
  }

  const pages = Array.from(pageMap.values())
  const renderedPages = pages.some((page) => page.emails.length > 0)
    ? []
    : await fetchRenderedFallbackPages(candidateUrls.slice(0, 3))

  for (const page of renderedPages) {
    if (!pageMap.has(page.finalUrl)) {
      pageMap.set(page.finalUrl, page)
    }
  }

  const allPages = Array.from(pageMap.values())

  const sourcePage = allPages.find((page) => page.requestedUrl === normalizedSourceUrl) ?? allPages[0]

  if (!sourcePage) {
    throw new Error(`Unable to fetch the official site seed for ${seed.externalId}: ${normalizedSourceUrl}`)
  }

  const contactPage = allPages.find((page) => isContactPage(page.finalUrl))
  const officeName = seed.officeName ?? sourcePage.siteName ?? allPages.map((page) => page.siteName).find(Boolean) ?? null
  const contacts = mergeContacts(buildContactCandidates(seed, allPages, sourcePage, contactPage))
  const primaryEmail = pickPrimaryContact(contacts, 'email')
  const primaryPhone = pickPrimaryContact(contacts, 'phone')
  const primaryWhatsapp = pickPrimaryContact(contacts, 'whatsapp')
  const instagramUrl = allPages.flatMap((page) => page.instagramUrls).find(Boolean) ?? null
  const whatsappUrl = allPages.flatMap((page) => page.whatsappUrls).find(Boolean) ?? null
  const sourceConfidence = includesCanonicalName(sourcePage.text, seed.canonicalName) ? 0.95 : 0.92

  const finalizedContacts = contacts.map((contact) => ({
    ...contact,
    isPrimary: (
      (contact.contactType === 'email' && primaryEmail !== null && contact.value === primaryEmail) ||
      (contact.contactType === 'phone' && primaryPhone !== null && contact.value === primaryPhone) ||
      (contact.contactType === 'whatsapp' && primaryWhatsapp !== null && contact.value === primaryWhatsapp)
    ),
  }))

  const evidence: OfficialSiteEvidence[] = []

  if (officeName) {
    evidence.push({
      type: 'official_office_name',
      value: officeName,
      sourceUrl: sourcePage.finalUrl,
    })
  }

  if (sourcePage.title) {
    evidence.push({
      type: 'official_profile_title',
      value: sourcePage.title,
      sourceUrl: sourcePage.finalUrl,
    })
  }

  if (contactPage) {
    evidence.push({
      type: 'official_contact_page',
      value: contactPage.finalUrl,
      sourceUrl: contactPage.finalUrl,
    })
  }

  if (primaryWhatsapp) {
    evidence.push({
      type: 'official_whatsapp_number',
      value: primaryWhatsapp,
      sourceUrl: contactPage?.finalUrl ?? sourcePage.finalUrl,
    })
  }

  if (whatsappUrl) {
    evidence.push({
      type: 'official_whatsapp_url',
      value: whatsappUrl,
      sourceUrl: contactPage?.finalUrl ?? sourcePage.finalUrl,
    })
  }

  if (instagramUrl) {
    evidence.push({
      type: 'official_instagram_url',
      value: instagramUrl,
      sourceUrl: sourcePage.finalUrl,
    })
  }

  return {
    canonicalName: seed.canonicalName,
    contactPageUrl: contactPage?.finalUrl ?? seed.contactPageUrl ?? null,
    contacts: finalizedContacts,
    evidence,
    externalId: seed.externalId,
    instagramUrl,
    officeName,
    primaryEmail,
    primaryPhone,
    primaryWhatsapp,
    rawPayloadJson: JSON.stringify({
      fetchedAt: new Date().toISOString(),
      pages: allPages.map((page) => ({
        emails: page.emails,
        finalUrl: page.finalUrl,
        instagramUrls: page.instagramUrls,
        phones: page.phones,
        requestedUrl: page.requestedUrl,
        siteName: page.siteName,
        title: page.title,
        whatsappNumbers: page.whatsappNumbers,
        whatsappUrls: page.whatsappUrls,
      })),
      seed,
    }),
    sourceConfidence,
    sourceTitle: sourcePage.title,
    sourceUrl: sourcePage.finalUrl,
    websiteDomain: new URL(normalizedWebsiteUrl).hostname.replace(/^www\./i, ''),
    websiteUrl: normalizedWebsiteUrl,
    whatsappUrl,
  }
}

export async function probeOfficialSiteContacts(
  input: {
    contactPageUrl?: string | null
    sourceUrl: string
    websiteUrl?: string | null
  },
  options: {
    renderFallback?: boolean
  } = {}
): Promise<OfficialSiteContactProbe | null> {
  const normalizedSourceUrl = normalizeUrl(input.sourceUrl)
  const normalizedWebsiteUrl = normalizeRootUrl(input.websiteUrl ?? `${new URL(normalizedSourceUrl).origin}/`)
  const candidateUrls = dedupeValues([
    normalizedSourceUrl,
    input.contactPageUrl ? normalizeUrl(input.contactPageUrl) : null,
    normalizedWebsiteUrl,
    ...CONTACT_PAGE_PATHS.map((path) => new URL(path, normalizedWebsiteUrl).toString()),
  ])

  const pageMap = new Map<string, FetchedPage>()

  for (const url of candidateUrls) {
    const page = await fetchOfficialHtmlPage(url)

    if (page) {
      pageMap.set(page.finalUrl, page)
    }
  }

  const discoveredContactUrls = dedupeValues(
    Array.from(pageMap.values()).flatMap((page) => page.contactLinks.map((link) => normalizeUrl(link)))
  )

  for (const url of discoveredContactUrls) {
    if (pageMap.has(url)) {
      continue
    }

    const page = await fetchOfficialHtmlPage(url)

    if (page) {
      pageMap.set(page.finalUrl, page)
    }
  }

  if (options.renderFallback) {
    const renderedPages = Array.from(pageMap.values()).some((page) => page.emails.length > 0)
      ? []
      : await fetchRenderedFallbackPages(candidateUrls.slice(0, 3))

    for (const page of renderedPages) {
      if (!pageMap.has(page.finalUrl)) {
        pageMap.set(page.finalUrl, page)
      }
    }
  }

  const pages = Array.from(pageMap.values())
  const sourcePage = pages.find((page) => page.requestedUrl === normalizedSourceUrl) ?? pages[0]

  if (!sourcePage) {
    return null
  }

  const contactPage = pages.find((page) => isContactPage(page.finalUrl))
  const contacts = mergeContacts(
    buildContactCandidates(
      {
        canonicalName: '',
        externalId: 'official-site-probe',
        sourceUrl: normalizedSourceUrl,
        websiteUrl: normalizedWebsiteUrl,
      },
      pages,
      sourcePage,
      contactPage
    )
  )

  return {
    contactPageUrl: contactPage?.finalUrl ?? input.contactPageUrl ?? null,
    contacts,
    instagramUrl: pages.flatMap((page) => page.instagramUrls).find(Boolean) ?? null,
    primaryEmail: pickPrimaryContact(contacts, 'email'),
    sourceUrl: sourcePage.finalUrl,
    visitedUrls: pages.map((page) => page.finalUrl),
    websiteUrl: normalizedWebsiteUrl,
  }
}

async function fetchRenderedFallbackPages(urls: string[]): Promise<FetchedPage[]> {
  if (urls.length === 0) {
    return []
  }

  try {
    const { chromium } = await import('playwright')
    const browser = await chromium.launch({ headless: true })
    const pages: FetchedPage[] = []

    try {
      const context = await browser.newContext({
        locale: 'pt-BR',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      })

      for (const url of urls) {
        const page = await context.newPage()

        try {
          await page.goto(url, { timeout: RENDER_TIMEOUT_MS, waitUntil: 'domcontentloaded' })
          await page.waitForTimeout(1200)
          const html = await page.content()
          const { emails, instagramUrls, phones, whatsappNumbers, whatsappUrls } = extractContactsFromHtml(html)
          const finalUrl = normalizeUrl(page.url())

          if (emails.length === 0 && phones.length === 0 && whatsappNumbers.length === 0 && instagramUrls.length === 0) {
            continue
          }

          pages.push({
            contactLinks: extractContactLinks(html, finalUrl),
            emails,
            finalUrl,
            instagramUrls,
            phones,
            requestedUrl: url,
            siteName: extractSiteName(html, extractTitle(html)),
            text: extractVisibleText(html),
            title: extractTitle(html),
            whatsappNumbers,
            whatsappUrls,
          })
        } catch {
          continue
        } finally {
          await page.close().catch(() => undefined)
        }
      }

      await context.close().catch(() => undefined)
    } finally {
      await browser.close().catch(() => undefined)
    }

    return pages
  } catch {
    return []
  }
}

export function decodeCloudflareEmail(encoded: string): string {
  if (!/^[0-9a-fA-F]+$/.test(encoded) || encoded.length < 4 || encoded.length % 2 !== 0) {
    return ''
  }

  const key = Number.parseInt(encoded.slice(0, 2), 16)
  let decoded = ''

  for (let index = 2; index < encoded.length; index += 2) {
    decoded += String.fromCharCode(Number.parseInt(encoded.slice(index, index + 2), 16) ^ key)
  }

  return decoded
}

export function extractContactsFromHtml(html: string): {
  emails: string[]
  instagramUrls: string[]
  phones: string[]
  whatsappNumbers: string[]
  whatsappUrls: string[]
} {
  const decodedHtml = decodeCloudflareEmailsInHtml(decodeHtmlEntities(html))
  const normalizedHtml = normalizeWhitespace(decodedHtml)
  const emails = dedupeValues([
    ...matchEmails(normalizedHtml),
  ])
  const instagramUrls = matchInstagram(decodedHtml)
  const phones = matchPhones(decodedHtml)
  const { numbers: whatsappNumbers, urls: whatsappUrls } = matchWhatsApp(decodedHtml)

  return { emails, instagramUrls, phones, whatsappNumbers, whatsappUrls }
}

function extractContactLinks(html: string, baseUrl: string): string[] {
  const matches = [...Array.from(html.matchAll(/href=["']([^"']+)["']/gi))].map((match) => match[1] ?? '')

  return dedupeValues(
    matches
      .map((value) => normalizeHrefToUrl(value, baseUrl))
      .filter((value): value is string => Boolean(value))
      .filter((value) => {
        const pathname = safeUrl(value)?.pathname.toLowerCase() ?? ''
        return pathname.includes('contato') || pathname.includes('contact') || pathname.includes('fale-conosco')
      })
  )
}

async function fetchOfficialHtmlPage(url: string): Promise<FetchedPage | null> {
  try {
    const response = await fetch(url, {
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })

    if (!response.ok) {
      return null
    }

    const contentType = response.headers.get('content-type') ?? ''

    if (!contentType.includes('text/html')) {
      return null
    }

    const html = await response.text()
    const { emails, instagramUrls, phones, whatsappNumbers, whatsappUrls } = extractContactsFromHtml(html)
    const contactLinks = extractContactLinks(html, response.url)
    const title = extractTitle(html)
    const siteName = extractSiteName(html, title)

    return {
      contactLinks,
      emails,
      finalUrl: normalizeUrl(response.url),
      instagramUrls,
      phones,
      requestedUrl: url,
      siteName,
      text: extractVisibleText(html),
      title,
      whatsappNumbers,
      whatsappUrls,
    }
  } catch {
    return null
  }
}

function buildContactCandidates(
  seed: OfficialSiteSeed,
  pages: FetchedPage[],
  sourcePage: FetchedPage,
  contactPage?: FetchedPage
): OfficialSiteContact[] {
  return pages.flatMap((page) => {
    return [
      ...page.emails.map((value) => ({
        confidence: page.finalUrl === sourcePage.finalUrl ? 0.95 : page.finalUrl === contactPage?.finalUrl ? 0.91 : 0.88,
        contactType: 'email' as const,
        label: page.finalUrl === sourcePage.finalUrl ? 'profile_page' : isContactPage(page.finalUrl) ? 'contact_page' : 'website_page',
        sourceUrl: page.finalUrl,
        value,
      })),
      ...page.phones.map((value) => ({
        confidence: page.finalUrl === contactPage?.finalUrl ? 0.95 : page.finalUrl === sourcePage.finalUrl ? 0.91 : 0.88,
        contactType: 'phone' as const,
        label: page.finalUrl === sourcePage.finalUrl ? 'profile_page' : isContactPage(page.finalUrl) ? 'contact_page' : 'website_page',
        sourceUrl: page.finalUrl,
        value,
      })),
      ...page.whatsappNumbers.map((value) => ({
        confidence: page.finalUrl === contactPage?.finalUrl ? 0.98 : page.finalUrl === sourcePage.finalUrl ? 0.94 : 0.9,
        contactType: 'whatsapp' as const,
        label: page.finalUrl === sourcePage.finalUrl ? 'profile_page' : isContactPage(page.finalUrl) ? 'contact_page' : 'whatsapp_link',
        sourceUrl: page.finalUrl,
        value,
      })),
    ]
  }).filter((contact) => {
    if (contact.contactType !== 'email') {
      return true
    }

    const emailDomain = getRegistrableDomain(contact.value)
    const websiteDomain = getRegistrableDomain(seed.websiteUrl ?? seed.sourceUrl)

    return emailDomain !== null && websiteDomain !== null && emailDomain === websiteDomain
  })
}

function dedupeValues(values: Array<string | null | undefined>): string[] {
  const uniqueValues = new Set<string>()

  for (const value of values) {
    if (!value) {
      continue
    }

    uniqueValues.add(value)
  }

  return Array.from(uniqueValues)
}

function mergeContacts(contacts: OfficialSiteContact[]): OfficialSiteContact[] {
  const deduped = new Map<string, OfficialSiteContact>()

  for (const contact of contacts) {
    const normalizedValue = contact.contactType === 'email'
      ? contact.value.trim().toLowerCase()
      : contact.value.trim()
    const key = `${contact.contactType}:${normalizedValue}`
    const existing = deduped.get(key)

    if (!existing || contact.confidence > existing.confidence) {
      deduped.set(key, {
        ...contact,
        value: normalizedValue,
      })
    }
  }

  return Array.from(deduped.values())
}

function pickPrimaryContact(contacts: OfficialSiteContact[], contactType: ContactType): string | null {
  const candidates = contacts.filter((contact) => contact.contactType === contactType)

  if (candidates.length === 0) {
    return null
  }

  if (contactType === 'phone') {
    const rankedPhones = Array.from(candidates).sort((left, right) => {
      const labelDelta = contactLabelPriority(right.label) - contactLabelPriority(left.label)

      if (labelDelta !== 0) {
        return labelDelta
      }

      return right.confidence - left.confidence
    })

    return rankedPhones[0]?.value ?? null
  }

  if (contactType === 'whatsapp') {
    const rankedWhatsApp = Array.from(candidates).sort((left, right) => {
      const labelDelta = contactLabelPriority(right.label) - contactLabelPriority(left.label)

      if (labelDelta !== 0) {
        return labelDelta
      }

      return right.confidence - left.confidence
    })

    return rankedWhatsApp[0]?.value ?? null
  }

  const rankedEmails = Array.from(candidates).sort((left, right) => {
    const genericDelta = Number(isGenericEmail(left.value)) - Number(isGenericEmail(right.value))

    if (genericDelta !== 0) {
      return genericDelta
    }

    const labelDelta = contactLabelPriority(right.label) - contactLabelPriority(left.label)

    if (labelDelta !== 0) {
      return labelDelta
    }

    return right.confidence - left.confidence
  })

  return rankedEmails[0]?.value ?? null
}

function normalizeRootUrl(value: string): string {
  const url = new URL(value)
  url.hash = ''
  url.search = ''
  url.pathname = '/'
  return url.toString()
}

function normalizeUrl(value: string): string {
  const url = new URL(value)
  url.hash = ''
  return url.toString()
}

function decodeCloudflareEmailsInHtml(html: string): string {
  return html.replace(/data-cfemail="([0-9a-fA-F]+)"/g, (_, encoded: string) => {
    const decoded = decodeCloudflareEmail(encoded)
    return decoded ? `data-cfemail="${encoded}" data-decoded-email="${decoded}"` : _
  })
}

function matchEmails(value: string): string[] {
  return Array.from(value.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g))
    .map((match) => match[0].toLowerCase())
    .filter((email) => !email.includes('example.com'))
}

function matchPhones(value: string): string[] {
  const telLinks = Array.from(value.matchAll(/href=["']tel:([^"']+)["']/gi)).map((match) => match[1])
  const contextualNumbers = [
    ...Array.from(value.matchAll(/(?:tel(?:efone)?|fone|whats(?:app)?|cel(?:ular)?|contato)[^0-9+]{0,25}((?:\+?55[\s./-]*)?\(?\d{2}\)?[\s./-]*9?\d{4}[\s./-]*\d{4})/gi)),
  ].map((match) => match[1])

  return dedupeValues([...telLinks, ...contextualNumbers])
    .map((candidate) => normalizePhone(candidate))
    .filter((phone): phone is string => phone !== null)
}

function matchWhatsApp(value: string): { numbers: string[]; urls: string[] } {
  const urlMatches = [
    ...Array.from(value.matchAll(/https?:\/\/(?:wa\.me|api\.whatsapp\.com)\/[^\s"'<>]+/gi)),
    ...Array.from(value.matchAll(/whatsapp:\/\/send\?[^\s"'<>]+/gi)),
    ...Array.from(value.matchAll(/href=["'](https?:\/\/(?:wa\.me|api\.whatsapp\.com)\/[^"']+)["']/gi)),
    ...Array.from(value.matchAll(/href=["'](whatsapp:\/\/send\?[^"']+)["']/gi)),
  ].map((match) => match[1] ?? match[0])

  const rawNumbers = [
    ...urlMatches,
    ...Array.from(
      value.matchAll(/(?:whats(?:app)?)[^0-9+]{0,25}((?:\+?55[\s./-]*)?\(?\d{2}\)?[\s./-]*9?\d{4}[\s./-]*\d{4})/gi)
    ).map((match) => match[1]),
  ]

  const normalizedNumbers = dedupeValues(rawNumbers.map((candidate) => extractWhatsAppNumber(candidate)))
    .map((candidate) => normalizePhone(candidate))
    .filter((phone): phone is string => phone !== null)

  return {
    numbers: normalizedNumbers,
    urls: dedupeValues(urlMatches.map((candidate) => normalizeWhatsAppUrl(candidate))),
  }
}

function matchInstagram(value: string): string[] {
  const matches = [
    ...Array.from(value.matchAll(/https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9._-]+\/?/gi)),
    ...Array.from(value.matchAll(/href=["'](https?:\/\/(?:www\.)?instagram\.com\/[^"']+)["']/gi)),
  ].map((match) => match[1] ?? match[0])

  return dedupeValues(matches.map((candidate) => normalizeInstagramUrl(candidate)))
}

function normalizePhone(value: string): string | null {
  let digits = value.replace(/\D+/g, '')

  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    digits = digits.slice(2)
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  return null
}

function normalizeInstagramUrl(value: string): string | null {
  try {
    const url = new URL(value)
    const handle = url.pathname.split('/').filter(Boolean)[0]?.toLowerCase()

    if (!handle) {
      return null
    }

    if (isReservedInstagramPath(handle)) {
      return null
    }

    return `https://www.instagram.com/${handle}/`
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

function normalizeHrefToUrl(value: string, baseUrl: string): string | null {
  if (!value || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:')) {
    return null
  }

  try {
    return new URL(value, baseUrl).toString()
  } catch {
    return null
  }
}

function safeUrl(value: string): URL | null {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return match ? normalizeWhitespace(decodeHtmlEntities(match[1])) : null
}

function extractSiteName(html: string, title: string | null): string | null {
  const ogSiteName = extractMetaContent(html, 'property', 'og:site_name')

  if (ogSiteName) {
    return ogSiteName
  }

  if (title?.includes('|')) {
    return normalizeWhitespace(title.split('|').slice(1).join('|'))
  }

  if (title?.includes(' - ')) {
    return normalizeWhitespace(title.split(' - ').slice(1).join(' - '))
  }

  return null
}

function extractMetaContent(html: string, attributeName: string, attributeValue: string): string | null {
  const doubleQuotePattern = new RegExp(
    `<meta[^>]*${attributeName}="${escapeRegExp(attributeValue)}"[^>]*content="([^"]+)"[^>]*>`,
    'i'
  )
  const singleQuotePattern = new RegExp(
    `<meta[^>]*${attributeName}='${escapeRegExp(attributeValue)}'[^>]*content='([^']+)'[^>]*>`,
    'i'
  )
  const match = html.match(doubleQuotePattern) ?? html.match(singleQuotePattern)

  return match ? normalizeWhitespace(decodeHtmlEntities(match[1])) : null
}

function extractVisibleText(html: string): string {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  const withoutTags = withoutScripts.replace(/<[^>]+>/g, ' ')

  return normalizeWhitespace(decodeHtmlEntities(withoutTags))
}

function extractWhatsAppNumber(value: string): string | null {
  const phoneParamMatch = value.match(/[?&]phone=([0-9]+)/i)

  if (phoneParamMatch?.[1]) {
    return phoneParamMatch[1]
  }

  const waMeMatch = value.match(/wa\.me\/([0-9]+)/i)

  if (waMeMatch?.[1]) {
    return waMeMatch[1]
  }

  const digits = value.replace(/\D+/g, '')
  return digits.length >= 10 ? digits : null
}

function includesCanonicalName(text: string, canonicalName: string): boolean {
  return normalizeName(text).includes(normalizeName(canonicalName))
}

function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]+/g, '')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .toUpperCase()
}

function isContactPage(url: string): boolean {
  return /\/(contato|fale-conosco)(\/|\.php|$)/i.test(new URL(url).pathname)
}

function isGenericEmail(value: string): boolean {
  const prefix = value.split('@')[0] ?? ''
  return GENERIC_EMAIL_PREFIXES.has(prefix)
}

function contactLabelPriority(value?: string): number {
  if (value === 'whatsapp_link') {
    return 3
  }

  if (value === 'contact_page') {
    return 2
  }

  if (value === 'profile_page') {
    return 1
  }

  return 0
}

function normalizeWhatsAppUrl(value: string): string {
  try {
    return new URL(value).toString()
  } catch {
    return value
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

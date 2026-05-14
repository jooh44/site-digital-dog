import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import {
  completeLlmReviewRun,
  failLlmReviewRun,
  listGeminiEmailSeeds,
  listPremiumGeminiEmailSeeds,
  completeSearchRun,
  createLlmReviewRun,
  createSearchRun,
  openLeadEngineDatabase,
  upsertGeminiEmailMatch,
} from '../../lib/outbound/leadEngineStore.ts'
import { getRegistrableDomain, isBlockedEmailDomain, isLikelyOfficialWebsiteUrl } from '../../lib/outbound/domainQuality.ts'
import { probeOfficialSiteContacts, type OfficialSiteContactProbe } from '../../lib/outbound/officialSite.ts'
import type { GeminiEmailSeed } from '../../lib/outbound/types.ts'

const { values: flags } = parseArgs({
  options: {
    limit: { type: 'string', default: '20' },
    cooldownHours: { type: 'string', default: '1' },
    dailyLimit: { type: 'string', default: '5' },
    dryRun: { type: 'boolean' },
    model: { type: 'string' },
    premium: { type: 'boolean' },
    timeoutMs: { type: 'string', default: '45000' },
  },
})

const LIMIT = Number(flags.limit)
const COOLDOWN_HOURS = Number(flags.cooldownHours)
const DAILY_LIMIT = Number(flags.dailyLimit)
const PREMIUM_MODE = Boolean(flags.premium)
const DRY_RUN = Boolean(flags.dryRun)
const MODEL = flags.model ?? (PREMIUM_MODE ? 'gemini-2.5-pro' : 'gemini-2.5-flash')
const TIMEOUT_MS = Number(flags.timeoutMs)
const TOOL_NAME = PREMIUM_MODE ? 'gemini_email_premium_enricher' : 'gemini_email_enricher'
const SESSION_ID = PREMIUM_MODE ? 'gemini-email-premium' : 'gemini-email-loop'
const HEARTBEAT_FILE = PREMIUM_MODE ? 'gemini-premium-email-heartbeat.json' : 'gemini-enricher-heartbeat.json'

const db = openLeadEngineDatabase()

function buildPrompt(seed: GeminiEmailSeed, probe: OfficialSiteContactProbe | null) {
  const site = probe?.websiteUrl ?? seed.websiteUrl ?? 'desconhecido'
  const instagram = seed.instagramUrl ?? 'desconhecido'
  const contactPage = probe?.contactPageUrl ?? 'desconhecida'
  const visitedUrls = probe?.visitedUrls.length ? probe.visitedUrls.join(', ') : 'nenhuma'
  const knownEmails = probe
    ? probe.contacts
        .filter((contact) => contact.contactType === 'email')
        .map((contact) => `${contact.value} @ ${contact.sourceUrl}`)
        .join('; ')
    : ''

  return [
    `Analise APENAS o dominio oficial do escritório "${seed.canonicalName}" em ${seed.city ?? seed.state ?? 'Brasil'}.`,
    `Site oficial já conhecido: ${site}. Pagina de contato conhecida: ${contactPage}. Instagram já conhecido: ${instagram}.`,
    `URLs oficiais já verificadas automaticamente: ${visitedUrls}.`,
    knownEmails
      ? `Emails encontrados no HTML oficial: ${knownEmails}. Escolha somente o email institucional principal, se houver.`
      : 'A extração HTML direta não encontrou email institucional confiável.',
    'Nao use diretorios, perfis de terceiros, marketplaces, redes de indicacao, nem emails de contador, parceiro, associacao ou plataforma.',
    'O email precisa estar no dominio do site oficial do proprio escritorio.',
    'Se a evidencia no dominio oficial nao for suficiente, responda null.',
    'Responda SOMENTE com JSON: {"websiteUrl":"https://dominio.com/","email":"x@dominio.com"} ou {"websiteUrl":null,"email":null}',
  ].join(' ')
}

async function runGeminiExec(promptText: string, model: string): Promise<{
  email: string | null
  rawResponseJson: string | null
  websiteUrl: string | null
}> {
  const args = ['-m', model, '-p', promptText, '--approval-mode', 'yolo', '--skip-trust']

  return new Promise((resolve, reject) => {
    const child = spawn('gemini', args, {
      detached: true,
      env: { ...process.env, TERM: 'dumb' },
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    const chunks: string[] = []
    const stderrChunks: string[] = []
    const timeout = setTimeout(() => {
      child.stdout.destroy()
      child.stderr.destroy()
      killProcessGroup(child.pid, 'SIGKILL')
      reject(new Error(`Gemini timed out after ${TIMEOUT_MS}ms.`))
    }, TIMEOUT_MS)

    child.stdout.on('data', (chunk) => chunks.push(String(chunk)))
    child.stderr.on('data', (chunk) => stderrChunks.push(String(chunk)))

    child.on('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })

    child.on('close', (code) => {
      clearTimeout(timeout)

      const output = chunks.join('')
      const jsonMatch = output.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || output.match(/(\{[\s\S]*\})/)
      const rawResponseJson = jsonMatch ? jsonMatch[1] : null

      if (!rawResponseJson && code !== 0) {
        reject(new Error(stderrChunks.join('').trim() || `Exit code ${code}`))
        return
      }

      if (!rawResponseJson) {
        reject(new Error('Failed to extract JSON from output.'))
        return
      }

      try {
        const parsed = JSON.parse(rawResponseJson)
        resolve({
          email: parsed.email && typeof parsed.email === 'string' ? parsed.email.trim() : null,
          rawResponseJson,
          websiteUrl: parsed.websiteUrl && typeof parsed.websiteUrl === 'string' ? parsed.websiteUrl.trim() : null,
        })
      } catch (e) {
        reject(new Error('Failed to parse JSON.'))
      }
    })
  })
}

function killProcessGroup(pid: number | undefined, signal: NodeJS.Signals) {
  if (!pid) {
    return
  }

  try {
    process.kill(-pid, signal)
  } catch {
    try {
      process.kill(pid, signal)
    } catch {}
  }
}

async function main() {
  const retryAfterIso = new Date(Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000).toISOString()
  const dailyRemaining = PREMIUM_MODE ? Math.max(0, DAILY_LIMIT - countRunsToday(TOOL_NAME)) : LIMIT
  const effectiveLimit = Math.min(LIMIT, dailyRemaining)
  const seedPoolLimit = Math.max(effectiveLimit * 4, effectiveLimit)
  const seeds = (PREMIUM_MODE
    ? listPremiumGeminiEmailSeeds(db, seedPoolLimit, retryAfterIso)
    : listGeminiEmailSeeds(db, seedPoolLimit, retryAfterIso))
    .filter(isValidGeminiSeed)
    .filter((seed) => !PREMIUM_MODE || Boolean(seed.websiteUrl && isLikelyOfficialWebsiteUrl(seed.websiteUrl)))
    .slice(0, effectiveLimit)

  writeHeartbeat({
    dailyRemaining,
    model: MODEL,
    mode: PREMIUM_MODE ? 'premium' : 'standard',
    status: seeds.length === 0 ? 'idle' : 'working',
    seeds: seeds.length,
  })

  if (seeds.length === 0) {
    console.log(JSON.stringify({
      dailyRemaining,
      model: MODEL,
      mode: PREMIUM_MODE ? 'premium' : 'standard',
      reason: dailyRemaining === 0 ? 'daily_limit_reached' : 'no_seed',
    }, null, 2))
    return
  }

  if (DRY_RUN) {
    console.log(JSON.stringify({
      dailyRemaining,
      dryRun: true,
      model: MODEL,
      mode: PREMIUM_MODE ? 'premium' : 'standard',
      seeds,
    }, null, 2))
    return
  }

  const searchRunId = createSearchRun(
    db,
    {
      campaignId: 'camp-advocacia-sao-paulo-oabsp',
      sourceChannel: 'gemini_email',
      toolName: TOOL_NAME,
      queryText: seeds.map(s => s.canonicalName).join(' | '),
      notes: PREMIUM_MODE
        ? 'Premium Gemini email enrichment for high-signal leads.'
        : 'Hybrid official-site probe plus Gemini email fallback',
    },
    new Date().toISOString()
  )

  let foundCount = 0
  let missCount = 0
  const results = []

  for (const seed of seeds) {
    let runId: number | null = null

    try {
      const directProbe = await probeSeedOfficialSite(seed)
      const directEmail = directProbe?.primaryEmail ?? null

      if (directProbe?.websiteUrl) {
        upsertGeminiWebsite(db, seed.organizationId, directProbe.websiteUrl, new Date().toISOString())
      }

      if (directProbe && directEmail && isValidGeminiEmail(seed, directEmail, directProbe.websiteUrl)) {
        const finishedAt = new Date().toISOString()
        upsertGeminiEmailMatch(
          db,
          seed.organizationId,
          directEmail,
          directProbe.contactPageUrl ?? directProbe.sourceUrl,
          finishedAt,
          {
            evidenceType: 'official_site_email',
            sourceChannel: 'official_site_email_probe',
          }
        )
        foundCount++
        results.push({
          name: seed.canonicalName,
          email: directEmail,
          strategy: 'official_site_probe',
          websiteUrl: directProbe.websiteUrl,
        })
        continue
      }

      const promptText = buildPrompt(seed, directProbe)
      runId = createLlmReviewRun(db, {
        model: MODEL,
        organizationId: seed.organizationId,
        promptText,
        provider: 'gemini',
        searchRunId,
        sessionId: SESSION_ID,
        toolName: TOOL_NAME,
      }, new Date().toISOString())
      const result = await runGeminiExec(promptText, MODEL)
      const finishedAt = new Date().toISOString()
      const resolvedWebsiteUrl = getValidWebsiteUrl(seed, result.websiteUrl, directProbe?.websiteUrl ?? null)
      const hasValidEmail = Boolean(result.email && isValidGeminiEmail(seed, result.email, resolvedWebsiteUrl))

      if (resolvedWebsiteUrl) {
        upsertGeminiWebsite(db, seed.organizationId, resolvedWebsiteUrl, finishedAt)
      }

      if (result.email && isValidGeminiEmail(seed, result.email, resolvedWebsiteUrl)) {
        upsertGeminiEmailMatch(db, seed.organizationId, result.email, resolvedWebsiteUrl ?? seed.websiteUrl ?? 'gemini-search', finishedAt)
        foundCount++
        results.push({
          name: seed.canonicalName,
          email: result.email,
          strategy: 'gemini_fallback',
          websiteUrl: resolvedWebsiteUrl ?? seed.websiteUrl ?? null,
        })
      } else {
        missCount++
        results.push({
          name: seed.canonicalName,
          email: result.email,
          strategy: 'gemini_fallback',
          reason: result.email ? 'invalid_email_for_official_domain' : 'no_email_found',
        })
      }

      completeLlmReviewRun(db, runId, {
        finishedAt,
        resultFound: hasValidEmail,
        status: 'completed',
        responseJson: result.rawResponseJson,
      })
    } catch (error) {
      const finishedAt = new Date().toISOString()
      const message = error instanceof Error ? error.message : 'Unknown error'
      if (runId !== null) {
        failLlmReviewRun(db, runId, finishedAt, message)
      }
      missCount++
      results.push({ name: seed.canonicalName, error: message })

      if (isGeminiQuotaError(message)) {
        writeHeartbeat({
          status: 'quota_exhausted',
          seeds: seeds.length,
          lastError: message,
        })
        break
      }
    }
  }

  completeSearchRun(db, searchRunId, foundCount, new Date().toISOString(), `Found ${foundCount}, Missed ${missCount}`)

  writeHeartbeat({
    status: foundCount > 0 ? 'completed_with_finds' : 'completed_no_finds',
    seeds: seeds.length,
    found: foundCount,
    missed: missCount,
  })

  console.log(JSON.stringify({
    processed: seeds.length,
    found: foundCount,
    missed: missCount,
    results,
  }, null, 2))
}

function writeHeartbeat(extra: Record<string, unknown>) {
  const dir = join(process.cwd(), 'scripts', 'outbound', 'output')
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    join(dir, HEARTBEAT_FILE),
    JSON.stringify({ ...extra, lastRunAt: new Date().toISOString() }, null, 2) + '\n'
  )
}

function countRunsToday(toolName: string) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const row = db.prepare(`
    SELECT COUNT(*) AS count
    FROM llm_review_runs
    WHERE tool_name = ?
      AND started_at >= ?
  `).get(toolName, start.toISOString()) as { count: number }

  return Number(row.count ?? 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

function isValidGeminiSeed(seed: GeminiEmailSeed) {
  if (seed.websiteUrl && isLikelyOfficialWebsiteUrl(seed.websiteUrl)) {
    return isOfficeLikeName(seed.officeName ?? seed.canonicalName)
  }

  if (!seed.instagramUrl || !seed.instagramUrl.includes('instagram.com')) {
    return false
  }

  return isOfficeLikeName(seed.officeName ?? seed.canonicalName)
}

function isGeminiQuotaError(value: string) {
  return /quota|capacity|429|QUOTA_EXHAUSTED/i.test(value)
}

function isOfficeLikeName(value: string) {
  const upper = value.toUpperCase()
  return (
    upper.includes('ADVOGADOS') ||
    upper.includes('ADVOCACIA') ||
    upper.includes('SOCIEDADE') ||
    upper.includes('JURIDIC') ||
    upper.includes('CONSULTORES')
  )
}

function isValidGeminiEmail(seed: GeminiEmailSeed, email: string, resolvedWebsiteUrl?: string | null) {
  const normalized = email.trim().toLowerCase()
  const parts = normalized.split('@')

  if (parts.length !== 2) {
    return false
  }

  const domain = parts[1]

  if (isBlockedEmailDomain(domain)) {
    return false
  }

  const websiteUrl = resolvedWebsiteUrl ?? seed.websiteUrl

  if (!websiteUrl || !isLikelyOfficialWebsiteUrl(websiteUrl)) {
    return false
  }

  const websiteDomain = getRegistrableDomain(websiteUrl)
  const emailDomain = getRegistrableDomain(`https://${domain}`)

  if (!websiteDomain || !emailDomain) {
    return false
  }

  return websiteDomain === emailDomain
}

function getValidWebsiteUrl(seed: GeminiEmailSeed, value: string | null, fallbackWebsiteUrl?: string | null) {
  if (value && isLikelyOfficialWebsiteUrl(value)) {
    return normalizeRootUrl(value)
  }

  if (fallbackWebsiteUrl && isLikelyOfficialWebsiteUrl(fallbackWebsiteUrl)) {
    return normalizeRootUrl(fallbackWebsiteUrl)
  }

  if (seed.websiteUrl && isLikelyOfficialWebsiteUrl(seed.websiteUrl)) {
    return seed.websiteUrl
  }

  return null
}

function upsertGeminiWebsite(
  db: ReturnType<typeof openLeadEngineDatabase>,
  organizationId: string,
  websiteUrl: string,
  nowIso: string
) {
  const domain = new URL(websiteUrl).hostname.replace(/^www\./i, '').toLowerCase()

  db.prepare(`
    UPDATE organizations
    SET website_url = ?,
        website_domain = ?,
        status = CASE
          WHEN status = 'raw' THEN 'needs_manual_review'
          ELSE status
        END,
        updated_at = ?
    WHERE id = ?
  `).run(websiteUrl, domain, nowIso, organizationId)
}

function normalizeRootUrl(value: string) {
  const url = new URL(value)
  url.hash = ''
  url.search = ''

  if (!url.pathname || url.pathname === '/') {
    url.pathname = '/'
    return url.toString()
  }

  return `${url.origin}/`
}

async function probeSeedOfficialSite(seed: GeminiEmailSeed) {
  if (!seed.websiteUrl || !isLikelyOfficialWebsiteUrl(seed.websiteUrl)) {
    return null
  }

  return probeOfficialSiteContacts(
    {
      sourceUrl: seed.websiteUrl,
      websiteUrl: seed.websiteUrl,
    },
    {
      renderFallback: false,
    }
  )
}

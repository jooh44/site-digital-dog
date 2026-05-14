import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import type { CodexFallbackMatch, CodexFallbackSeed } from './types.ts'

const DEFAULT_MODEL = 'gemini-2.5-flash'
const OUTPUT_SCHEMA_PATH = join(process.cwd(), 'scripts', 'outbound', 'codex-fallback-output-schema.json')
const CODEX_WORKDIR = '/tmp/codex-lead-fallback'
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')
const codexCooldownPath = join(outputDirectory, 'codex-fallback-cooldown.json')

type CodexExecUsage = {
  cachedInputTokens: number
  inputTokens: number
  outputTokens: number
}

type CodexFallbackExecution = {
  match: CodexFallbackMatch | null
  promptText: string
  rawResponseJson: string | null
  threadId: string | null
  usage: CodexExecUsage
}

type CodexFallbackOptions = {
  model?: string
  search?: boolean
  timeoutMs?: number
}

type CodexCliResponse = {
  confidence: number
  contact_page_url: string | null
  instagram_url: string | null
  office_name: string | null
  primary_phone: string | null
  primary_whatsapp: string | null
  rationale: string | null
  source_url: string | null
  website_url: string | null
}

export async function enrichOrganizationViaCodexFallback(
  seed: CodexFallbackSeed,
  options: CodexFallbackOptions = {}
): Promise<CodexFallbackExecution> {
  const promptText = buildPrompt(seed)
  const model = resolveFallbackModel(options.model)
  const rawResponse = await runCodexExec(promptText, model, options)
  const parsed = rawResponse.rawResponseJson ? parseCodexResponse(rawResponse.rawResponseJson) : null
  const websiteUrl = parsed?.website_url ? normalizeWebsiteUrl(parsed.website_url) : null
  const instagramUrl = parsed?.instagram_url ? normalizeInstagramUrl(parsed.instagram_url) : null
  const sourceUrl = parsed?.source_url ? normalizeSourceUrl(parsed.source_url) : websiteUrl ?? instagramUrl ?? null
  const websiteDomain = websiteUrl ? getDomainFromUrl(websiteUrl) : null

  const match = !parsed || (!websiteUrl && !instagramUrl && !parsed.primary_phone && !parsed.primary_whatsapp)
    ? null
    : {
        canonicalName: seed.canonicalName,
        city: seed.city ?? null,
        contactPageUrl: parsed.contact_page_url ? normalizeSourceUrl(parsed.contact_page_url) : null,
        externalId: seed.externalId,
        instagramUrl,
        officeName: parsed.office_name?.trim() || seed.officeName || null,
        primaryPhone: normalizePhone(parsed.primary_phone),
        primaryWhatsapp: normalizePhone(parsed.primary_whatsapp),
        rawPayloadJson: JSON.stringify({
          executedAt: new Date().toISOString(),
          model,
          parsed,
          promptText,
          usage: rawResponse.usage,
        }),
        rationale: parsed.rationale?.trim() || null,
        sourceConfidence: clampConfidence(parsed.confidence),
        sourceUrl: sourceUrl ?? `codex-fallback:${seed.externalId}`,
        websiteDomain,
        websiteUrl,
      } satisfies CodexFallbackMatch

  return {
    match,
    promptText,
    rawResponseJson: rawResponse.rawResponseJson,
    threadId: rawResponse.threadId,
    usage: rawResponse.usage,
  }
}

export function estimateCodexCredits(model: string, usage: CodexExecUsage) {
  const rateCard = {
    'gpt-5.4': { cachedInput: 6.25, input: 62.5, output: 375 },
    'gpt-5.4-mini': { cachedInput: 1.875, input: 18.75, output: 113 },
    'gpt-5.3-codex': { cachedInput: 4.375, input: 43.75, output: 350 },
  }[model.toLowerCase()]

  if (!rateCard) {
    return 0
  }

  const credits =
    (usage.inputTokens / 1_000_000) * rateCard.input +
    (usage.cachedInputTokens / 1_000_000) * rateCard.cachedInput +
    (usage.outputTokens / 1_000_000) * rateCard.output

  return Number(credits.toFixed(4))
}

async function runCodexExec(
  promptText: string,
  model: string,
  options: CodexFallbackOptions
): Promise<{
  rawResponseJson: string | null
  threadId: string | null
  usage: CodexExecUsage
}> {
  const timeoutMs = options.timeoutMs ?? 180_000
  const schema = readFileSync(OUTPUT_SCHEMA_PATH, 'utf-8')
  const fullPrompt = `${promptText}\n\nIMPORTANT: Return ONLY valid JSON, exactly matching this schema:\n${schema}\n\nDo not add any conversational text or markdown blocks, just the raw JSON.`
  const effectiveModel = resolveFallbackModel(model)
  const args = ['-m', effectiveModel, '-p', fullPrompt, '--approval-mode', 'yolo', '--skip-trust']

  return new Promise((resolve, reject) => {
    const child = spawn('gemini', args, {
      env: {
        ...process.env,
        TERM: 'dumb',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    const chunks: string[] = []
    const stderrChunks: string[] = []
    const timeout = setTimeout(() => {
      child.stdout.destroy()
      child.stderr.destroy()
      child.kill('SIGKILL')
      reject(new Error(`Gemini fallback timed out after ${timeoutMs}ms.`))
    }, timeoutMs)

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

      let fallbackError: string | null = null
      if (code !== 0) {
        fallbackError = stderrChunks.join('').trim() || `Gemini fallback failed with exit code ${code}.`
      }

      if (!rawResponseJson && code === 0) {
        fallbackError = 'Failed to extract JSON from Gemini output: ' + output
      }

      if (fallbackError && !rawResponseJson) {
        reject(new Error(fallbackError))
        return
      }

      resolve({
        rawResponseJson,
        threadId: 'gemini-fallback',
        usage: {
          cachedInputTokens: 0,
          inputTokens: 0,
          outputTokens: 0,
        },
      })
    })
  })
}

function resolveFallbackModel(model?: string | null) {
  if (model && model.toLowerCase().includes('gemini')) {
    return model
  }

  return DEFAULT_MODEL
}

export async function runCodexFallbackEnrichment(
  db: any,
  options: {
    campaignId: string
    cooldownHours: number
    limit: number
    model: string
    sessionCreditLimit: number
    sessionId: string
    weeklyCreditLimit: number
  }
) {
  // Bypass credits and cooldown for Gemini
  const isGemini = options.model.toLowerCase().includes('gemini')

  if (options.limit <= 0) {
    return {
      matched: 0,
      misses: 0,
      model: options.model,
      reason: 'disabled',
      sessionCredits: 0,
      sessionId: options.sessionId,
      weeklyCredits: getWeeklyCodexCredits(db),
    }
  }

  if (!isGemini) {
    const weeklyCredits = getWeeklyCodexCredits(db)
    if (weeklyCredits >= options.weeklyCreditLimit) {
      return {
        matched: 0,
        misses: 0,
        model: options.model,
        reason: 'weekly_credit_cap',
        sessionCredits: 0,
        sessionId: options.sessionId,
        weeklyCredits: Number(weeklyCredits.toFixed(4)),
      }
    }

    const cooldownUntil = readCodexCooldownUntil()
    if (cooldownUntil && new Date(cooldownUntil).getTime() > Date.now()) {
      return {
        matched: 0,
        misses: 0,
        model: options.model,
        reason: 'quota_cooldown',
        sessionCredits: 0,
        sessionId: options.sessionId,
        weeklyCredits: Number(weeklyCredits.toFixed(4)),
      }
    }
  }

  const retryAfterIso = new Date(Date.now() - options.cooldownHours * 60 * 60 * 1000).toISOString()
  const seeds = listCodexFallbackSeeds(db, options.limit, retryAfterIso)

  if (seeds.length === 0) {
    return {
      matched: 0,
      misses: 0,
      model: options.model,
      reason: 'no_seed',
      sessionCredits: 0,
      sessionId: options.sessionId,
      weeklyCredits: getWeeklyCodexCredits(db),
    }
  }

  const searchRunId = createSearchRun(
    db,
    {
      campaignId: options.campaignId,
      sourceChannel: 'codex_fallback',
      toolName: isGemini ? 'gemini_exec_official_match' : 'codex_exec_official_match',
      queryText: seeds.map((seed: any) => `${seed.canonicalName} ${seed.city ?? ''}`).join(' | '),
      notes: isGemini ? 'Low-volume Gemini fallback for official site discovery.' : 'Low-volume LLM fallback for official site and Instagram discovery.',
    },
    new Date().toISOString()
  )

  const matches: Array<Record<string, unknown>> = []
  const misses: Array<Record<string, unknown>> = []
  let sessionCredits = 0

  for (const seed of seeds) {
    if (!isGemini && sessionCredits >= options.sessionCreditLimit) {
      misses.push({
        canonicalName: seed.canonicalName,
        externalId: seed.externalId,
        reason: 'session_credit_cap',
      })
      continue
    }

    const runId = createLlmReviewRun(db, {
      model: options.model,
      organizationId: resolveOrganizationIdByExternalId(db, seed.externalId),
      provider: isGemini ? 'gemini' : 'codex',
      searchRunId,
      sessionId: options.sessionId,
      toolName: isGemini ? 'gemini_exec_official_match' : 'codex_exec_official_match',
    }, new Date().toISOString())

    try {
      const result = await enrichOrganizationViaCodexFallback(seed, { model: options.model, search: true })
      const estimatedCredits = isGemini ? 0 : estimateCodexCredits(options.model, result.usage)
      const finishedAt = new Date().toISOString()

      if (result.match) {
        const organizationId = upsertCodexFallbackMatch(db, result.match, searchRunId, finishedAt)
        matches.push({
          canonicalName: seed.canonicalName,
          estimatedCredits,
          externalId: seed.externalId,
          instagramUrl: result.match.instagramUrl,
          organizationId,
          primaryPhone: result.match.primaryPhone,
          primaryWhatsapp: result.match.primaryWhatsapp,
          websiteUrl: result.match.websiteUrl,
        })
      } else {
        misses.push({
          canonicalName: seed.canonicalName,
          estimatedCredits,
          externalId: seed.externalId,
          reason: 'No reliable official signal found.',
        })
      }

      completeLlmReviewRun(db, runId, {
        cachedInputTokens: result.usage.cachedInputTokens,
        estimatedCredits,
        finishedAt,
        inputTokens: result.usage.inputTokens,
        notes: result.match?.rationale ?? null,
        outputTokens: result.usage.outputTokens,
        responseJson: result.rawResponseJson,
        resultFound: Boolean(result.match),
        status: 'completed',
        threadId: result.threadId,
      })

      sessionCredits += estimatedCredits
    } catch (error) {
      const finishedAt = new Date().toISOString()
      const message = error instanceof Error ? error.message : 'Unknown fallback error.'
      if (!isGemini && isCodexQuotaError(message)) {
        writeCodexCooldownUntil(new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), message)
      }
      failLlmReviewRun(db, runId, finishedAt, message)
      misses.push({
        canonicalName: seed.canonicalName,
        error: message,
        externalId: seed.externalId,
      })
    }
  }

  completeSearchRun(
    db,
    searchRunId,
    matches.length,
    new Date().toISOString(),
    misses.length === 0
      ? 'Fallback completed.'
      : `Fallback completed with ${misses.length} miss(es).`
  )

  return {
    matched: matches.length,
    matches,
    misses,
    model: options.model,
    reason: 'completed',
    sessionCredits: Number(sessionCredits.toFixed(4)),
    sessionId: options.sessionId,
    weeklyCredits: isGemini ? getWeeklyCodexCredits(db) : Number((getWeeklyCodexCredits(db) + sessionCredits).toFixed(4)),
  }
}

function readCodexCooldownUntil() {
  if (!existsSync(codexCooldownPath)) {
    return null
  }
  try {
    const payload = JSON.parse(readFileSync(codexCooldownPath, 'utf8')) as { cooldownUntil?: string }
    return payload.cooldownUntil ?? null
  } catch {
    return null
  }
}

function writeCodexCooldownUntil(cooldownUntil: string, reason: string) {
  writeFileSync(
    codexCooldownPath,
    `${JSON.stringify({ cooldownUntil, reason, updatedAt: new Date().toISOString() }, null, 2)}\n`
  )
}

function isCodexQuotaError(message: string) {
  return /usage limit|purchase more credits|upgrade to pro|codex\/settings\/usage/i.test(message)
}

function buildPrompt(seed: CodexFallbackSeed) {
  const specialty = seed.specialtyLabel ? `- Especialidade: ${seed.specialtyLabel}` : null
  const office = seed.officeName && seed.officeName !== seed.canonicalName ? `- Nome institucional: ${seed.officeName}` : null

  return [
    'Encontre sinais oficiais e publicos para um escritorio de advocacia brasileiro.',
    '',
    'Objetivo:',
    '- identificar o site oficial do escritorio',
    '- identificar o Instagram oficial, se existir',
    '- identificar telefone principal e WhatsApp principal, se aparecerem em fonte oficial',
    '- retornar null quando houver duvida real',
    '',
    'Lead:',
    `- Nome canonico: ${seed.canonicalName}`,
    office,
    `- Cidade/estado: ${seed.city ?? 'desconhecida'} / ${seed.state ?? 'desconhecido'}`,
    specialty,
    '',
    'Regras:',
    '- use web search para pesquisar fontes publicas',
    '- prefira dominio proprio do escritorio e perfil oficial do Instagram',
    '- ignore diretorios, agregadores e perfis nao oficiais, exceto para confirmar um dominio oficial ja encontrado',
    '- nao invente dados',
    '- se nao tiver certeza razoavel, devolva null no campo',
    '- confidence deve ser um numero entre 0 e 1',
    '- source_url deve apontar para a melhor fonte oficial encontrada',
    '',
    'Retorne apenas JSON seguindo o schema.',
  ].filter(Boolean).join('\n')
}

function parseCodexResponse(rawResponseJson: string): CodexCliResponse {
  return JSON.parse(rawResponseJson) as CodexCliResponse
}

function clampConfidence(value: number) {
  if (!Number.isFinite(value)) {
    return 0.72
  }
  return Math.max(0, Math.min(1, Number(value.toFixed(2))))
}

function normalizeWebsiteUrl(value: string) {
  try {
    const url = new URL(value)
    if (!/^https?:$/i.test(url.protocol)) {
      return null
    }
    url.hash = ''
    url.search = ''
    return `${url.origin}${url.pathname.replace(/\/+$/g, '') || '/'}`
  } catch {
    return null
  }
}

function normalizeInstagramUrl(value: string) {
  try {
    const url = new URL(value)
    if (!url.hostname.includes('instagram.com')) {
      return null
    }
    const handle = url.pathname.split('/').filter(Boolean)[0]
    return handle ? `https://www.instagram.com/${handle}/` : null
  } catch {
    return null
  }
}

function normalizeSourceUrl(value: string) {
  try {
    const url = new URL(value)
    return /^https?:$/i.test(url.protocol) ? url.toString() : null
  } catch {
    return null
  }
}

function getDomainFromUrl(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./i, '')
  } catch {
    return null
  }
}

function normalizePhone(value: string | null) {
  if (!value) {
    return null
  }
  const normalized = value.replace(/\s+/g, ' ').trim()
  return normalized.length >= 8 ? normalized : null
}

// These functions were missing or need to be imported from leadEngineStore but were originally in this file
// Re-implementing or assuming they exist in the context for now based on previous file content
// Actually, I need to check where they are defined.

import {
  createLlmReviewRun,
  createSearchRun,
  completeLlmReviewRun,
  completeSearchRun,
  failLlmReviewRun,
  failSearchRun,
  listCodexFallbackSeeds,
  upsertCodexFallbackMatch,
} from './leadEngineStore.ts'

function getWeeklyCodexCredits(db: any) {
  const row = db.prepare(`
    SELECT COALESCE(SUM(estimated_credits), 0) AS credits
    FROM llm_review_runs
    WHERE provider = 'codex'
      AND started_at >= ?
  `).get(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) as { credits: number | null }
  return Number(row.credits ?? 0)
}

function resolveOrganizationIdByExternalId(db: any, externalId: string) {
  const row = db.prepare(`
    SELECT organization_id AS organizationId
    FROM organization_sources
    WHERE source_channel IN ('oab_registry', 'cnsa_registry', 'google_web_discovery')
      AND external_id = ?
    ORDER BY id DESC
    LIMIT 1
  `).get(externalId) as { organizationId?: string } | undefined
  return row?.organizationId ?? null
}

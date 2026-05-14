import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import {
  openLeadEngineDatabase,
  createLlmReviewRun,
  completeLlmReviewRun,
  failLlmReviewRun,
  createSearchRun,
  completeSearchRun,
} from '../../lib/outbound/leadEngineStore.ts'

const { values: flags } = parseArgs({
  options: {
    limit: { type: 'string', default: '10' },
    cooldownHours: { type: 'string', default: '24' },
    dryRun: { type: 'boolean' },
    model: { type: 'string', default: 'gemini-2.5-flash' },
    timeoutMs: { type: 'string', default: '45000' },
  },
})

const LIMIT = Number(flags.limit)
const COOLDOWN_HOURS = Number(flags.cooldownHours)
const DRY_RUN = Boolean(flags.dryRun)
const MODEL = flags.model!
const TIMEOUT_MS = Number(flags.timeoutMs)
const TOOL_NAME = 'gemini_instagram_whatsapp_enricher'
const HEARTBEAT_FILE = 'instagram-whatsapp-enricher-heartbeat.json'

const db = openLeadEngineDatabase()

type InstagramWhatsAppSeed = {
  organizationId: string
  canonicalName: string
  city: string | null
  state: string | null
  websiteUrl: string | null
  instagramUrl: string | null
  primaryWhatsapp: string | null
}

function listSeeds(limit: number, retryAfterIso: string): InstagramWhatsAppSeed[] {
  return db.prepare(`
    SELECT
      o.id AS organizationId,
      o.canonical_name AS canonicalName,
      o.city AS city,
      o.state AS state,
      o.website_url AS websiteUrl,
      o.instagram_url AS instagramUrl,
      o.primary_whatsapp AS primaryWhatsapp
    FROM organizations o
    WHERE o.status != 'ignored_non_icp'
      AND (
        (o.instagram_url IS NULL OR o.instagram_url = '')
        OR (o.primary_whatsapp IS NULL OR o.primary_whatsapp = '')
      )
      AND (o.website_url IS NOT NULL AND o.website_url != '')
      AND NOT EXISTS (
        SELECT 1
        FROM llm_review_runs lr
        WHERE lr.organization_id = o.id
          AND lr.tool_name = '${TOOL_NAME}'
          AND lr.started_at >= ?
      )
      AND (
        SELECT COUNT(*)
        FROM llm_review_runs lr2
        WHERE lr2.organization_id = o.id
          AND lr2.tool_name = '${TOOL_NAME}'
          AND lr2.result_found = 0
      ) < 2
    ORDER BY
      CASE WHEN o.primary_email IS NOT NULL AND o.primary_email != '' THEN 0 ELSE 1 END,
      o.source_confidence DESC,
      o.updated_at ASC
    LIMIT ?
  `).all(retryAfterIso, limit) as InstagramWhatsAppSeed[]
}

function buildPrompt(seed: InstagramWhatsAppSeed): string {
  const site = seed.websiteUrl ?? 'desconhecido'
  const ig = seed.instagramUrl ?? 'não encontrado ainda'
  const wa = seed.primaryWhatsapp ?? 'não encontrado ainda'

  return [
    `Procure o Instagram oficial e WhatsApp do escritório de advocacia "${seed.canonicalName}" em ${seed.city ?? seed.state ?? 'Brasil'}.`,
    `Site oficial já conhecido: ${site}. Instagram atual: ${ig}. WhatsApp atual: ${wa}.`,
    'Busque no site oficial, Google, e redes sociais.',
    'O Instagram deve ser o perfil oficial do escritório (não perfil pessoal do advogado, a menos que seja o mesmo nome do escritório).',
    'O WhatsApp deve ser número comercial encontrado no site oficial, Google Meu Negócio, ou bio do Instagram.',
    'Formato WhatsApp: código de país + DDD + número, ex: 5541999887766.',
    'Se não encontrar evidência confiável, responda null.',
    'Responda SOMENTE com JSON: {"instagram_url":"https://instagram.com/handle","whatsapp":"5541999887766"} — use null para campos não encontrados.',
  ].join(' ')
}

type GeminiResult = {
  instagram_url: string | null
  whatsapp: string | null
  rawJson: string | null
}

async function runGemini(promptText: string): Promise<GeminiResult> {
  const args = ['-m', MODEL, '-p', promptText, '--approval-mode', 'yolo', '--skip-trust']

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
      try { process.kill(-child.pid!, 'SIGKILL') } catch { try { process.kill(child.pid!, 'SIGKILL') } catch {} }
      reject(new Error(`Gemini timed out after ${TIMEOUT_MS}ms.`))
    }, TIMEOUT_MS)

    child.stdout.on('data', (chunk) => chunks.push(String(chunk)))
    child.stderr.on('data', (chunk) => stderrChunks.push(String(chunk)))

    child.on('error', (error) => { clearTimeout(timeout); reject(error) })

    child.on('close', (code) => {
      clearTimeout(timeout)
      const output = chunks.join('')
      const jsonMatch = output.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || output.match(/(\{[\s\S]*\})/)
      const rawJson = jsonMatch ? jsonMatch[1] : null

      if (!rawJson && code !== 0) {
        reject(new Error(stderrChunks.join('').trim() || `Exit code ${code}`))
        return
      }
      if (!rawJson) {
        reject(new Error('Failed to extract JSON from output.'))
        return
      }

      try {
        const parsed = JSON.parse(rawJson)
        resolve({
          instagram_url: parsed.instagram_url && typeof parsed.instagram_url === 'string' ? normalizeInstagramUrl(parsed.instagram_url) : null,
          whatsapp: parsed.whatsapp && typeof parsed.whatsapp === 'string' ? normalizeWhatsApp(parsed.whatsapp) : null,
          rawJson,
        })
      } catch {
        reject(new Error('Failed to parse JSON.'))
      }
    })
  })
}

function normalizeInstagramUrl(raw: string): string | null {
  const match = raw.match(/instagram\.com\/([a-zA-Z0-9._]+)/)
  if (!match) return null
  const handle = match[1].toLowerCase().replace(/\/$/, '')
  if (['explore', 'p', 'reel', 'stories', 'accounts'].includes(handle)) return null
  return `https://www.instagram.com/${handle}/`
}

function normalizeWhatsApp(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 13) return null
  // Ensure starts with 55 (Brazil)
  const full = digits.startsWith('55') ? digits : `55${digits}`
  if (full.length < 12 || full.length > 13) return null
  return full
}

function isQuotaError(value: string) {
  return /quota|capacity|429|QUOTA_EXHAUSTED/i.test(value)
}

function writeHeartbeat(extra: Record<string, unknown>) {
  const dir = join(process.cwd(), 'scripts', 'outbound', 'output')
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    join(dir, HEARTBEAT_FILE),
    JSON.stringify({ ...extra, lastRunAt: new Date().toISOString() }, null, 2) + '\n'
  )
}

async function main() {
  const retryAfterIso = new Date(Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000).toISOString()
  const seeds = listSeeds(LIMIT, retryAfterIso)

  writeHeartbeat({ status: seeds.length === 0 ? 'idle' : 'working', seeds: seeds.length, model: MODEL })

  if (seeds.length === 0) {
    console.log(JSON.stringify({ reason: 'no_seeds', model: MODEL }))
    return
  }

  if (DRY_RUN) {
    console.log(JSON.stringify({ dryRun: true, seeds, model: MODEL }, null, 2))
    return
  }

  const searchRunId = createSearchRun(db, {
    campaignId: 'ops-instagram-whatsapp-enrichment',
    sourceChannel: 'gemini_instagram_whatsapp',
    toolName: TOOL_NAME,
    queryText: seeds.map(s => s.canonicalName).join(' | '),
    notes: 'Gemini-powered Instagram URL and WhatsApp discovery for leads with website but missing social/phone.',
  }, new Date().toISOString())

  let foundCount = 0
  let missCount = 0
  const results: Array<Record<string, unknown>> = []

  for (const seed of seeds) {
    let runId: number | null = null
    try {
      const promptText = buildPrompt(seed)
      runId = createLlmReviewRun(db, {
        model: MODEL,
        organizationId: seed.organizationId,
        promptText,
        provider: 'gemini',
        searchRunId,
        sessionId: 'instagram-whatsapp-loop',
        toolName: TOOL_NAME,
      }, new Date().toISOString())

      const result = await runGemini(promptText)
      const finishedAt = new Date().toISOString()
      const hasNew = Boolean(
        (result.instagram_url && !seed.instagramUrl) ||
        (result.whatsapp && !seed.primaryWhatsapp)
      )

      if (result.instagram_url && !seed.instagramUrl) {
        db.prepare(`
          UPDATE organizations SET instagram_url = ?, updated_at = ?
          WHERE id = ? AND (instagram_url IS NULL OR instagram_url = '')
        `).run(result.instagram_url, finishedAt, seed.organizationId)
      }

      if (result.whatsapp && !seed.primaryWhatsapp) {
        db.prepare(`
          UPDATE organizations SET primary_whatsapp = ?, updated_at = ?
          WHERE id = ? AND (primary_whatsapp IS NULL OR primary_whatsapp = '')
        `).run(result.whatsapp, finishedAt, seed.organizationId)
      }

      if (hasNew) foundCount++
      else missCount++

      completeLlmReviewRun(db, runId, {
        finishedAt,
        resultFound: hasNew,
        status: 'completed',
        responseJson: result.rawJson,
      })

      results.push({
        name: seed.canonicalName,
        instagram: result.instagram_url,
        whatsapp: result.whatsapp,
        isNew: hasNew,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      if (runId !== null) failLlmReviewRun(db, runId, new Date().toISOString(), message)
      missCount++
      results.push({ name: seed.canonicalName, error: message })

      if (isQuotaError(message)) {
        writeHeartbeat({ status: 'quota_exhausted', lastError: message })
        break
      }
    }
  }

  completeSearchRun(db, searchRunId, foundCount, new Date().toISOString(), `Found ${foundCount}, Missed ${missCount}`)
  writeHeartbeat({ status: foundCount > 0 ? 'completed_with_finds' : 'completed_no_finds', seeds: seeds.length, found: foundCount, missed: missCount })
  console.log(JSON.stringify({ processed: seeds.length, found: foundCount, missed: missCount, results }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import {
  completeLlmReviewRun,
  completeSearchRun,
  createLlmReviewRun,
  createSearchRun,
  failLlmReviewRun,
  failSearchRun,
  listCodexFallbackSeeds,
  openLeadEngineDatabase,
  upsertCampaign,
  upsertCodexFallbackMatch,
} from '../../lib/outbound/leadEngineStore.ts'
import { enrichOrganizationViaCodexFallback, estimateCodexCredits } from '../../lib/outbound/codexFallback.ts'

const { values } = parseArgs({
  options: {
    campaignId: { type: 'string' },
    cooldownHours: { type: 'string' },
    limit: { type: 'string' },
    model: { type: 'string' },
    output: { type: 'string' },
    sessionCreditLimit: { type: 'string' },
    sessionId: { type: 'string' },
    weeklyCreditLimit: { type: 'string' },
  },
})

const campaignId = values.campaignId ?? 'ops-auto-capture'
const cooldownHours = values.cooldownHours ? Number.parseInt(values.cooldownHours, 10) : 168
const limit = values.limit ? Number.parseInt(values.limit, 10) : 1
const model = values.model ?? 'gemini-2.5-flash'
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')
const outputPath = values.output
  ? join(process.cwd(), values.output)
  : join(outputDirectory, `${campaignId}-codex-fallback-enrichment.json`)
const sessionId = values.sessionId ?? `codex-fallback-${new Date().toISOString()}`
const sessionCreditLimit = values.sessionCreditLimit ? Number.parseFloat(values.sessionCreditLimit) : 2
const weeklyCreditLimit = values.weeklyCreditLimit ? Number.parseFloat(values.weeklyCreditLimit) : 25

void main()

async function main() {
  const nowIso = new Date().toISOString()
  const db = openLeadEngineDatabase()
  mkdirSync(outputDirectory, { recursive: true })
  const effectiveModel = model.toLowerCase().includes('gemini') ? model : 'gemini-2.5-flash'
  const isGemini = effectiveModel.toLowerCase().includes('gemini')

  upsertCampaign(db, {
    id: campaignId,
    name: 'Ops Auto Capture',
    niche: 'ops',
    city: 'MULTI',
    sizeRange: 'automatic',
    notes: 'Operational campaign for local fallback automation.',
    status: 'active',
  }, nowIso)

  const budget = getCodexBudgetStatus(db, sessionId)
  if (!isGemini && budget.weeklyCredits >= weeklyCreditLimit) {
    const summary = {
      campaignId,
      matched: 0,
      misses: 0,
      model: effectiveModel,
      reason: 'weekly_credit_cap',
      sessionCredits: budget.sessionCredits,
      sessionId,
      weeklyCredits: budget.weeklyCredits,
    }
    writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`)
    console.log(JSON.stringify(summary, null, 2))
    db.close()
    return
  }

  const retryAfterIso = new Date(Date.now() - cooldownHours * 60 * 60 * 1000).toISOString()
  const seeds = listCodexFallbackSeeds(db, limit, retryAfterIso)

  if (seeds.length === 0) {
    const summary = {
      campaignId,
      matched: 0,
      misses: 0,
      model: effectiveModel,
      reason: 'no_seed',
      sessionCredits: budget.sessionCredits,
      sessionId,
      weeklyCredits: budget.weeklyCredits,
    }
    writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`)
    console.log(JSON.stringify(summary, null, 2))
    db.close()
    return
  }

  const searchRunId = createSearchRun(db, {
    campaignId,
    notes: isGemini
      ? 'Gemini fallback for unresolved official-site discovery.'
      : 'Codex fallback for unresolved official-site discovery.',
    queryText: seeds.map((seed) => `${seed.canonicalName} ${seed.city ?? ''}`).join(' | '),
    sourceChannel: 'codex_fallback',
    toolName: isGemini ? 'gemini_exec_official_match' : 'codex_exec_official_match',
  }, nowIso)

  const matches: Array<Record<string, unknown>> = []
  const misses: Array<Record<string, unknown>> = []
  let sessionCredits = budget.sessionCredits

  try {
    for (const seed of seeds) {
      if (!isGemini && sessionCredits >= sessionCreditLimit) {
        misses.push({
          canonicalName: seed.canonicalName,
          externalId: seed.externalId,
          reason: 'session_credit_cap',
        })
        continue
      }

      const runId = createLlmReviewRun(db, {
        model: effectiveModel,
        organizationId: resolveOrganizationId(db, seed.externalId),
        provider: isGemini ? 'gemini' : 'codex',
        searchRunId,
        sessionId,
        toolName: isGemini ? 'gemini_exec_official_match' : 'codex_exec_official_match',
      }, new Date().toISOString())

      try {
        const result = await enrichOrganizationViaCodexFallback(seed, { model: effectiveModel, search: true })
        const estimatedCredits = isGemini ? 0 : estimateCodexCredits(effectiveModel, result.usage)
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
            reason: isGemini
              ? 'No reliable official signal found by Gemini fallback.'
              : 'No reliable official signal found by Codex fallback.',
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
        ? (isGemini ? 'Gemini fallback completed.' : 'Codex fallback completed.')
        : (isGemini
            ? `Gemini fallback completed with ${misses.length} miss(es).`
            : `Codex fallback completed with ${misses.length} miss(es).`)
    )

    const summary = {
      campaignId,
      matched: matches.length,
      matches,
      misses,
      model: effectiveModel,
      outputPath,
      searchRunId,
      sessionCredits: Number(sessionCredits.toFixed(4)),
      sessionId,
      weeklyCredits: isGemini
        ? Number(budget.weeklyCredits.toFixed(4))
        : Number((budget.weeklyCredits + sessionCredits).toFixed(4)),
    }

    writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`)
    console.log(JSON.stringify(summary, null, 2))
  } catch (error) {
    failSearchRun(
      db,
      searchRunId,
      new Date().toISOString(),
      error instanceof Error ? error.message : 'Unknown fallback error.'
    )
    throw error
  } finally {
    db.close()
  }
}

function resolveOrganizationId(db: ReturnType<typeof openLeadEngineDatabase>, externalId: string) {
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

function getCodexBudgetStatus(db: ReturnType<typeof openLeadEngineDatabase>, sessionId: string) {
  const sessionRow = db.prepare(`
    SELECT COALESCE(SUM(estimated_credits), 0) AS credits
    FROM llm_review_runs
    WHERE provider = 'codex'
      AND session_id = ?
  `).get(sessionId) as { credits: number | null }

  const weekStartIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const weeklyRow = db.prepare(`
    SELECT COALESCE(SUM(estimated_credits), 0) AS credits
    FROM llm_review_runs
    WHERE provider = 'codex'
      AND started_at >= ?
  `).get(weekStartIso) as { credits: number | null }

  return {
    sessionCredits: Number(sessionRow.credits ?? 0),
    weeklyCredits: Number(weeklyRow.credits ?? 0),
  }
}

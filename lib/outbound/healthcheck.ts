import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { openLeadEngineDatabase } from './leadEngineStore.ts'

type HealthWorker = {
  healthy: boolean
  lastRunAt: string | null
  minutesSinceLastRun: number | null
  name: string
  status: string
}

export type LeadEngineHealth = {
  database: {
    integrity: string
    journalMode: string
    ok: boolean
  }
  healthy: boolean
  checkedAt: string
  workers: HealthWorker[]
}

export function getLeadEngineHealth(): LeadEngineHealth {
  const db = openLeadEngineDatabase()

  try {
    const integrity = db.prepare(`PRAGMA integrity_check`).get() as { integrity_check: string }
    const journalMode = db.prepare(`PRAGMA journal_mode`).get() as { journal_mode: string }
    const databaseOk = integrity.integrity_check === 'ok'
    const workers = [
      readWorkerHeartbeat('lead-engine-auto-capture', 'auto-capture-heartbeat.json', 6),
      readWorkerHeartbeat('lead-engine-gemini-email', 'gemini-enricher-heartbeat.json', 6),
      readWorkerHeartbeat('lead-engine-slot-scheduler', 'slot-scheduler-summary.json', 6),
    ]

    return {
      checkedAt: new Date().toISOString(),
      database: {
        integrity: integrity.integrity_check,
        journalMode: journalMode.journal_mode,
        ok: databaseOk,
      },
      healthy: databaseOk && workers.every((worker) => worker.healthy),
      workers,
    }
  } finally {
    db.close()
  }
}

function readWorkerHeartbeat(name: string, fileName: string, maxAgeMinutes: number): HealthWorker {
  const path = join(process.cwd(), 'scripts', 'outbound', 'output', fileName)

  if (!existsSync(path)) {
    return {
      healthy: false,
      lastRunAt: null,
      minutesSinceLastRun: null,
      name,
      status: 'missing_heartbeat',
    }
  }

  const payload = JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
  const lastRunAt = resolveHeartbeatTimestamp(payload)
  const minutesSinceLastRun = lastRunAt
    ? Number(((Date.now() - new Date(lastRunAt).getTime()) / 60_000).toFixed(1))
    : null

  return {
    healthy: minutesSinceLastRun !== null && minutesSinceLastRun <= maxAgeMinutes,
    lastRunAt,
    minutesSinceLastRun,
    name,
    status: typeof payload.status === 'string' ? payload.status : 'unknown',
  }
}

function resolveHeartbeatTimestamp(payload: Record<string, unknown>) {
  for (const key of ['cycleFinishedAt', 'finishedAt', 'lastRunAt', 'updatedAt']) {
    const value = payload[key]
    if (typeof value === 'string') {
      return value
    }
  }

  return null
}

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn } from 'node:child_process'
import { parseArgs } from 'node:util'

type DaemonMode = 'auto-capture' | 'gemini-email' | 'instagram-whatsapp' | 'slot-scheduler'

type Step = {
  args: string[]
  label: string
  timeoutMs?: number
}

const { values } = parseArgs({
  options: {
    intervalMs: { type: 'string' },
    mode: { type: 'string' },
  },
})

const mode = parseMode(values.mode)
const intervalMs = values.intervalMs ? Number.parseInt(values.intervalMs, 10) : getDefaultInterval(mode)
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')
const heartbeatPath = join(outputDirectory, `${mode}-heartbeat.json`)

let stopped = false
let running = false
let activeChildPid: number | undefined

mkdirSync(outputDirectory, { recursive: true })

process.on('SIGINT', stop)
process.on('SIGTERM', stop)

void runLoop()

async function runLoop() {
  while (!stopped) {
    const cycleStartedAt = new Date().toISOString()

    if (running) {
      writeHeartbeat({
        cycleStartedAt,
        lastError: 'previous_cycle_still_running',
        mode,
        status: 'skipped',
      })
      await sleep(intervalMs)
      continue
    }

    running = true
    let status = 'ok'
    let lastError: string | null = null

    try {
      for (const step of getSteps(mode)) {
        await runStep(step)
      }
    } catch (error) {
      status = 'failed'
      lastError = error instanceof Error ? error.message : 'unknown daemon error'
      console.error(`[${new Date().toISOString()}] ${mode} failed: ${lastError}`)
    } finally {
      running = false
      writeHeartbeat({
        cycleFinishedAt: new Date().toISOString(),
        cycleStartedAt,
        lastError,
        mode,
        status,
      })
    }

    if (!stopped) {
      await sleep(intervalMs)
    }
  }
}

function parseMode(value: string | undefined): DaemonMode {
  if (value === 'gemini-email' || value === 'slot-scheduler' || value === 'auto-capture' || value === 'instagram-whatsapp') {
    return value
  }

  return 'auto-capture'
}

function getDefaultInterval(currentMode: DaemonMode) {
  if (currentMode === 'slot-scheduler') return 60_000
  if (currentMode === 'gemini-email') return 300_000
  if (currentMode === 'instagram-whatsapp') return 600_000
  return 90_000
}

function getSteps(currentMode: DaemonMode): Step[] {
  if (currentMode === 'instagram-whatsapp') {
    return [{
      args: ['run', 'outbound:ig-whatsapp', '--', '--limit=5', '--cooldownHours=24', '--timeoutMs=45000'],
      label: 'instagram/whatsapp enrichment',
      timeoutMs: 300_000,
    }]
  }

  if (currentMode === 'gemini-email') {
    return [{
      args: ['run', 'outbound:gemini-email', '--', '--limit=1', '--cooldownHours=1', '--timeoutMs=45000'],
      label: 'gemini email enrichment',
    }]
  }

  if (currentMode === 'slot-scheduler') {
    return [
      { args: ['run', 'outbound:sync-email-state'], label: 'sync resend state' },
      {
        args: ['run', 'outbound:slot-scheduler', '--', '--slots=10', '--slotCapacity=10'],
        label: 'schedule fixed slots',
        timeoutMs: 120_000,
      },
    ]
  }

  return [{
    args: [
      'run',
      'outbound:auto-capture',
      '--',
      '--targetOrganizations=3000',
      '--spPrefixesPerCycle=4',
      '--directWebDiscoveryLimit=8',
      '--webSearchLimit=6',
      '--officialSiteLimit=40',
      '--codexFallbackLimit=2',
      '--codexFallbackModel=gemini-2.5-flash',
      '--maxRawBacklog=600',
      '--maxRawToReviewRatio=15',
    ],
    label: 'auto-capture',
    timeoutMs: 600_000,
  }]
}

function runStep(step: Step) {
  return new Promise<void>((resolve, reject) => {
    console.log(`[${new Date().toISOString()}] ${step.label} start`)
    const child = spawn('npm', step.args, {
      detached: true,
      env: process.env,
      stdio: 'inherit',
    })
    activeChildPid = child.pid
    const timeout = step.timeoutMs
      ? setTimeout(() => {
          killProcessGroup(child.pid, 'SIGTERM')
          setTimeout(() => killProcessGroup(child.pid, 'SIGKILL'), 5000).unref()
          reject(new Error(`${step.label} timed out after ${step.timeoutMs}ms`))
        }, step.timeoutMs)
      : null

    child.on('error', (error) => {
      if (timeout) clearTimeout(timeout)
      activeChildPid = undefined
      reject(error)
    })

    child.on('exit', (code, signal) => {
      if (timeout) clearTimeout(timeout)
      activeChildPid = undefined

      if (code === 0) {
        console.log(`[${new Date().toISOString()}] ${step.label} ok`)
        resolve()
        return
      }

      reject(new Error(`${step.label} exited with code=${code ?? 'null'} signal=${signal ?? 'null'}`))
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

function writeHeartbeat(payload: Record<string, unknown>) {
  writeFileSync(heartbeatPath, `${JSON.stringify(payload, null, 2)}\n`)
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function stop() {
  stopped = true
  killProcessGroup(activeChildPid, 'SIGTERM')

  if (!running) {
    process.exit(0)
  }
}

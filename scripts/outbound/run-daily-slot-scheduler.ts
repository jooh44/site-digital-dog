import { execFileSync } from 'node:child_process'

void main()

function main() {
  const stdout = execFileSync(
    'node',
    [
      '--env-file=.env.local',
      '--experimental-strip-types',
      '--experimental-default-type=module',
      'scripts/outbound/run-slot-scheduler.ts',
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 8,
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  ).trim()

  process.stdout.write(`${stdout}\n`)
}

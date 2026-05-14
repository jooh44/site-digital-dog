import { getLeadEngineHealth } from '../../lib/outbound/healthcheck.ts'

const health = getLeadEngineHealth()
console.log(JSON.stringify(health, null, 2))

if (!health.healthy) {
  process.exitCode = 1
}

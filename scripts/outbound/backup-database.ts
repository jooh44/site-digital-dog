import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs'
import { basename, join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { DEFAULT_LEAD_ENGINE_DB_PATH } from '../../lib/outbound/paths.ts'

const backupsDirectory = join(process.cwd(), '..', '_ops', 'lead-engine', 'backups')
const keep = Number.parseInt(process.env.LEAD_ENGINE_BACKUP_KEEP ?? '7', 10)
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const outputPath = join(backupsDirectory, `${basename(DEFAULT_LEAD_ENGINE_DB_PATH)}.${timestamp}.sqlite`)

if (!existsSync(DEFAULT_LEAD_ENGINE_DB_PATH)) {
  throw new Error(`Lead engine DB not found at ${DEFAULT_LEAD_ENGINE_DB_PATH}`)
}

mkdirSync(backupsDirectory, { recursive: true })

const db = new DatabaseSync(DEFAULT_LEAD_ENGINE_DB_PATH, { readOnly: true })

try {
  db.exec(`VACUUM INTO ${quoteSqlString(outputPath)}`)
} finally {
  db.close()
}

const backups = readdirSync(backupsDirectory)
  .filter((file) => file.startsWith(`${basename(DEFAULT_LEAD_ENGINE_DB_PATH)}.`) && file.endsWith('.sqlite'))
  .sort()

const stale = backups.slice(0, Math.max(0, backups.length - keep))
for (const file of stale) {
  unlinkSync(join(backupsDirectory, file))
}

console.log(JSON.stringify({
  backupPath: outputPath,
  kept: backups.length - stale.length,
  removed: stale.length,
}, null, 2))

function quoteSqlString(value: string) {
  return `'${value.replace(/'/g, "''")}'`
}

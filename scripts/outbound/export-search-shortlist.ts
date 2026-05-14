import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { listShortlistForCampaign, openLeadEngineDatabase } from '../../lib/outbound/leadEngineStore.ts'

const { values } = parseArgs({
  options: {
    campaignId: { type: 'string' },
    limit: { type: 'string' },
  },
})

const campaignId = values.campaignId ?? 'camp-advocacia-trabalhista-curitiba'
const limit = values.limit ? Number.parseInt(values.limit, 10) : 15
const outputDirectory = join(process.cwd(), 'scripts', 'outbound', 'output')

mkdirSync(outputDirectory, { recursive: true })

const db = openLeadEngineDatabase()
const shortlist = listShortlistForCampaign(db, campaignId, limit)

const jsonPath = join(outputDirectory, `${campaignId}-shortlist.json`)
const csvPath = join(outputDirectory, `${campaignId}-shortlist.csv`)

writeFileSync(jsonPath, `${JSON.stringify(shortlist, null, 2)}\n`)
writeFileSync(csvPath, `${toCsv(shortlist)}\n`)
db.close()

console.log(JSON.stringify({
  campaignId,
  csvPath,
  jsonPath,
  exportedRows: shortlist.length,
}, null, 2))

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) {
    return ''
  }

  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]

  for (const row of rows) {
    lines.push(headers.map((header) => csvCell(row[header])).join(','))
  }

  return lines.join('\n')
}

function csvCell(value: unknown): string {
  const raw = value === null || value === undefined ? '' : String(value)
  const escaped = raw.replace(/"/g, '""')
  return `"${escaped}"`
}

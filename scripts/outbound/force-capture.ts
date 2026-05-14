import { createHash } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'
import { fetchOabSpRegistryLeads } from '../../lib/outbound/oabSpRegistry.ts'

const db = new DatabaseSync('/home/johny/Documentos/projetos/_ops/lead-engine/lead-engine.sqlite')

void main()

async function main() {
  const prefixes = ['SILVA', 'SOUZA', 'SANTOS', 'OLIVEIRA', 'PEREIRA', 'RODRIGUES']

  try {
    for (const prefix of prefixes) {
      console.log('--- Capturando prefixo:', prefix)

      try {
        const result = await fetchOabSpRegistryLeads({
          cityId: '617',
          cityName: 'SAO PAULO',
          namePrefixes: [prefix],
          specialtyLabel: 'Advocacia',
          specialtyCode: 'advocacia',
        })

        console.log('Encontrados na OAB:', result.leads.length)

        for (const lead of result.leads) {
          const orgId = `org_${createHash('sha1').update(String(lead.externalId)).digest('hex').slice(0, 16)}`
          const now = new Date().toISOString()

          try {
            db.prepare(`
              INSERT OR IGNORE INTO organizations (id, canonical_name, normalized_name, city, state, status, created_at, updated_at, source_confidence)
              VALUES (?, ?, ?, 'SAO PAULO', 'SP', 'raw', ?, ?, 1.0)
            `).run(orgId, lead.canonicalName, lead.canonicalName.toUpperCase(), now, now)

            db.prepare(`
              INSERT OR IGNORE INTO organization_sources (organization_id, source_channel, external_id, created_at)
              VALUES (?, 'oab_registry', ?, ?)
            `).run(orgId, String(lead.externalId), now)
          } catch {
            // Keep the batch running if an individual insert fails.
          }
        }
      } catch (error) {
        console.error('Erro no prefixo:', prefix, error)
      }
    }

    console.log('Força tarefa concluída.')
  } finally {
    db.close()
  }
}

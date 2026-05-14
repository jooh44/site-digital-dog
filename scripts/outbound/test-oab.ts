import {
  completeSearchRun,
  createSearchRun,
  openLeadEngineDatabase,
  upsertCampaign,
  upsertOabRegistryLead,
} from '../../lib/outbound/leadEngineStore.ts'
import { fetchOabSpRegistryLeads } from '../../lib/outbound/oabSpRegistry.ts'

const db = openLeadEngineDatabase()

void main()

async function main() {
  upsertCampaign(db, {
    id: 'ops-auto-capture',
    name: 'Ops Auto Capture',
    status: 'active',
    city: 'SAO PAULO',
    niche: 'advocacia',
    sizeRange: 'bulk',
  } as any, new Date().toISOString())

  const prefixes = ['SILVA', 'SOUZA', 'SANTOS']

  try {
    for (const prefix of prefixes) {
      console.log('Capturando prefixo:', prefix)
      const searchRunId = createSearchRun(db, {
        campaignId: 'ops-auto-capture',
        sourceChannel: 'oab_registry',
        toolName: 'oab_manual_force',
        queryText: `prefix=${prefix}`,
      }, new Date().toISOString())

      const result = await fetchOabSpRegistryLeads({
        cityId: '617',
        cityName: 'SAO PAULO',
        namePrefixes: [prefix],
        specialtyLabel: 'Advocacia',
        specialtyCode: 'advocacia',
      })

      console.log('Found:', result.leads.length)
      for (const lead of result.leads) {
        upsertOabRegistryLead(db, lead, searchRunId, new Date().toISOString())
      }

      completeSearchRun(db, searchRunId, result.leads.length, new Date().toISOString(), 'Batch complete')
    }

    console.log('Fim da força tarefa.')
  } finally {
    db.close()
  }
}

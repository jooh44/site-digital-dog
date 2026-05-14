import { openLeadEngineDatabase } from '../../lib/outbound/leadEngineStore.ts'

const db = openLeadEngineDatabase()

const jobs = db.prepare(`SELECT id, email_campaign_id, status FROM email_jobs`).all() as any[]
console.log('Total email jobs:', jobs.length)
const jobsByStatus = jobs.reduce((acc, job) => {
  acc[job.status] = (acc[job.status] || 0) + 1
  return acc
}, {} as any)
console.log('Jobs by status:', jobsByStatus)

const campaigns = db.prepare(`SELECT id, status, planned_start_at FROM email_campaigns`).all() as any[]
console.log('Campaigns:', campaigns)

db.close()

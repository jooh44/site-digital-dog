import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("/home/johny/Documentos/projetos/_ops/lead-engine/lead-engine.sqlite");

console.log("--- PR Leads Ready for Review ---");
const leads = db.prepare(`
  SELECT id, canonical_name, primary_email, status 
  FROM organizations 
  WHERE state = 'PR' AND status = 'ready_for_review'
`).all();
console.log(leads);

console.log("\n--- Check if they were already in any job ---");
const leadIds = leads.map(l => `'${l.id}'`).join(',');
if (leadIds) {
    const jobs = db.prepare(`SELECT organization_id, email_campaign_id, status FROM email_jobs WHERE organization_id IN (${leadIds})`).all();
    console.log(jobs);
}

db.close();

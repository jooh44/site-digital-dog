import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("/home/johny/Documentos/projetos/_ops/lead-engine/lead-engine.sqlite");

console.log("--- Ready for Review with Email ---");
const readyLeads = db.prepare(`
  SELECT state, count(*) as count 
  FROM organizations 
  WHERE status = 'ready_for_review' 
    AND primary_email IS NOT NULL 
    AND primary_email != ''
  GROUP BY state
`).all();
console.log(readyLeads);

console.log("\n--- Email Jobs Status ---");
const jobStatus = db.prepare(`
  SELECT status, count(*) as count 
  FROM email_jobs 
  GROUP BY status
`).all();
console.log(jobStatus);

console.log("\n--- Active Campaigns ---");
const campaigns = db.prepare(`SELECT id, name, status FROM email_campaigns WHERE status = 'active'`).all();
console.log(campaigns);

db.close();

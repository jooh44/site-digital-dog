import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("/home/johny/Documentos/projetos/_ops/lead-engine/lead-engine.sqlite");
const stmt = db.prepare(`SELECT * FROM email_jobs WHERE organization_id = 'org_f35b96b33174b581'`);
console.log(stmt.all());
db.close();

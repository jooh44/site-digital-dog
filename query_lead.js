import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("/home/johny/Documentos/projetos/_ops/lead-engine/lead-engine.sqlite");
const stmt = db.prepare(`SELECT id, canonical_name, website_url, primary_email, status, source_confidence FROM organizations WHERE canonical_name LIKE '%ESPINOLA%' OR canonical_name LIKE '%BERTIN%' LIMIT 10`);
console.log(stmt.all());
const evStmt = db.prepare(`SELECT * FROM evidence WHERE organization_id IN (SELECT id FROM organizations WHERE canonical_name LIKE '%ESPINOLA%' OR canonical_name LIKE '%BERTIN%' LIMIT 10)`);
console.log(evStmt.all());
db.close();

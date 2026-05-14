import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("/home/johny/Documentos/projetos/_ops/lead-engine/lead-engine.sqlite");

console.log("--- All Email Campaigns ---");
const campaigns = db.prepare(`SELECT * FROM email_campaigns`).all();
console.log(campaigns);

db.close();

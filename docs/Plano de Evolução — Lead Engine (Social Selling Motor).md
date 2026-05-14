# Plano de Evolução — Lead Engine (Social Selling Motor)

## Contexto

O sistema atual é um motor de captação de leads de advogados brasileiros que roda localmente via bash loop (`while true; sleep 90`), scrapa registros da OAB PR/SP, enriquece com scraping de sites oficiais + Google SERP + Gemini CLI, agenda emails via Resend em 4 slots BRT, e exibe tudo num dashboard SSR em `/ops/captacao`. O objetivo é evoluir isso para um motor robusto de social selling da Digital Dog — mais confiável, com integração Notion automatizada, inteligência de Instagram, e campanhas mais inteligentes.

---

## Tier 1 — Confiabilidade & Operabilidade

### 1.1 PM2 no lugar do bash loop
- **Novo**: `ecosystem.config.cjs` na raiz — 3 processos: `auto-capture`, `gemini-enricher`, `slot-scheduler`
- **Novo**: `scripts/outbound/run-auto-capture-daemon.ts` — Node.js com `setInterval` + signal handling (`SIGTERM`/`SIGINT`), substituindo o bash loop
- **Mod**: `package.json` — scripts `outbound:start`, `outbound:stop`, `outbound:logs`
- **Deprecar**: `run-auto-capture-loop.sh`, `stop-outbound-services.sh`
- Esforço: **Pequeno** (1 dia)

### 1.2 SQLite WAL mode
- **Mod**: `lib/outbound/leadEngineStore.ts` — adicionar `PRAGMA journal_mode = WAL` e `PRAGMA synchronous = NORMAL`, subir `busy_timeout` para 10000ms
- Esforço: **Mínimo** (30 min)

### 1.3 Backup automático do banco
- **Novo**: `scripts/outbound/backup-database.ts` — copia o DB para `_ops/lead-engine/backups/`, mantém últimos 7
- Adicionar como cron job no PM2
- Esforço: **Pequeno** (meio dia)

### 1.4 Health check (sem alerta externo por agora)
- **Novo**: `lib/outbound/healthcheck.ts` — lê heartbeats, checa PM2, verifica integridade do DB
- Exibe status consolidado no dashboard (já existente nos "worker pills")
- Alerta externo (Telegram/WhatsApp) pode ser adicionado futuramente quando necessário
- Esforço: **Mínimo** (incluso no 1.1)

---

## Tier 2 — Qualidade de Dados & Eficiência

### 2.1 Validação de email antes do envio (MX check)
- **Mod**: `lib/outbound/domainQuality.ts` — `validateEmailDomain()` usando `node:dns/promises` (zero deps)
- **Mod**: `run-slot-scheduler.ts` — validar MX antes de agendar, marcar `email_invalid` se sem MX
- **Schema**: coluna `organizations.email_validated_at`
- Esforço: **Pequeno** (1 dia)

### 2.2 Deduplicação fuzzy
- **Novo**: `lib/outbound/dedup.ts` — normalização de nomes (acentos, sufixos jurídicos), merge por domínio ou email compartilhado
- **Novo**: `scripts/outbound/run-dedup-pass.ts` — limpeza batch dos dados existentes
- Plugar no ciclo de captura após enriquecimento
- Esforço: **Médio** (2-3 dias)

### 2.3 Split do leadEngineStore.ts (71KB)
- Extrair em módulos: `store/connection.ts`, `store/organizations.ts`, `store/email-jobs.ts`, `store/llm-runs.ts`
- `leadEngineStore.ts` vira barrel file re-exportando tudo
- Esforço: **Médio** (2-3 dias, ajuste de imports em 17 scripts)

---

## Tier 3 — Integração Notion (Automatizada)

### 3.1 Sync bidirecional com Notion
- **Dep**: `@notionhq/client`
- **Novo**: `lib/outbound/notionSync.ts` — push orgs com Instagram para Notion database, pull status de volta
- **Novo**: `scripts/outbound/sync-notion-crm.ts` — roda a cada 5 min via PM2
- **Schema**: coluna `organizations.notion_page_id`, tabela `sync_state`
- **Env vars**: `NOTION_API_KEY`, `NOTION_DATABASE_ID`
- Mapeamento: Name→title, City→select, Instagram→url, Email→email, Status→select, Confidence→number
- Conflitos: Notion ganha em `stage` (decisão CRM manual), SQLite ganha em dados de enriquecimento
- Esforço: **Médio** (3-4 dias)

---

## Tier 4 — Inteligência de Instagram

### 4.1 Enriquecimento de perfil via Gemini
- **Novo**: `lib/outbound/instagramIntel.ts` — usa Gemini CLI com web search para coletar: bio, estimativa de seguidores, frequência de posts, categoria, contato na bio
- **Novo**: `scripts/outbound/run-instagram-enrichment.ts` — 5-10 leads por ciclo
- **Schema**: tabela `instagram_profiles` (bio_text, follower_count, post_count, engagement_tier, bio_email, bio_phone, etc.)
- Segue o mesmo padrão do `codexFallback.ts` (spawn Gemini CLI + schema JSON)
- Esforço: **Médio** (3-5 dias)

### 4.2 ICP scoring baseado em Instagram
- **Novo**: `lib/outbound/icpScoring.ts` — pontuação composta: conta business (+10), followers 500-5000 (+15), ativo últimos 30 dias (+10), especialidade match (+10), dormant (-20)
- Combinar com `source_confidence` existente para `icp_score` final
- Esforço: **Pequeno** (1 dia)

---

## Tier 5 — Dashboard Evoluído

### 5.1 Eliminar reload de página inteira
- **Novo**: `app/api/ops/dashboard-data/route.ts` — retorna dados do dashboard como JSON
- **Mod**: `app/ops/captacao/page.tsx` — split em server component (render inicial) + client component (polling a cada 30s via `useEffect`), remover o hack `<script dangerouslySetInnerHTML>`
- Esforço: **Médio** (2-3 dias)

### 5.2 Página de detalhe do lead
- **Novo**: `app/ops/captacao/[id]/page.tsx` — todos os sources, contacts, evidence, email history, perfil Instagram, status Notion
- **Novo**: `app/api/ops/leads/[id]/route.ts` — GET detail, PATCH status/notes
- Esforço: **Médio** (3-4 dias)

### 5.3 Ações rápidas no dashboard
- **Mod**: `lead-quick-actions.tsx` — botões: "Marcar ICP", "Ignorar", "Re-enriquecer", "Abrir no Notion", "Abrir Instagram"
- **Novo**: `app/api/ops/leads/[id]/actions/route.ts` — POST para ações
- Esforço: **Pequeno** (1-2 dias)

---

## Tier 6 — Inteligência de Campanha

### 6.1 A/B test de subject lines
- **Mod**: `lib/outbound/types.ts` — `subjectVariants?: string[]` no manifest
- **Mod**: `lib/outbound/emailCampaign.ts` — seleção aleatória de variante
- **Schema**: coluna `email_jobs.variant_id`
- **Mod**: `dashboard.ts` — `getVariantPerformance()` com open/click/response rate por variante
- Esforço: **Médio** (2-3 dias)

### 6.2 Otimização de horário de envio
- **Novo**: `lib/outbound/sendTimeOptimizer.ts` — analisa open/response rate por slot, gera distribuição ponderada (mín 20% por slot para exploração)
- **Mod**: `run-slot-scheduler.ts` — usar pesos em vez de distribuição uniforme
- Esforço: **Pequeno** (1-2 dias)

### 6.3 Personalização via Gemini
- **Mod**: `lib/outbound/emailCampaign.ts` — `generatePersonalizedIntro()` usando Gemini CLI com contexto do site/Instagram do lead
- Limite diário: 20 personalizações/dia
- Esforço: **Médio** (2-3 dias)

---

## Sequenciamento

| Fase | Itens | Duração | Pré-req |
|------|-------|---------|---------|
| Semana 1 | 1.1 PM2, 1.2 WAL, 1.3 Backup | 2 dias | — |
| Semana 1-2 | 2.1 MX check, 2.3 Split store | 3-4 dias | Fase 1 |
| Semana 2-3 | 3.1 Notion sync | 4 dias | Store limpo |
| Semana 3-4 | 4.1 Instagram Gemini, 4.2 ICP score | 4-5 dias | PM2 rodando |
| Semana 4-5 | 5.1 Polling, 5.2 Lead detail, 5.3 Ações | 4-5 dias | Store limpo |
| Semana 5-6 | 6.1 A/B, 6.2 Send-time, 6.3 Personalização | 4-5 dias | Instagram intel |
| Contínuo | 1.4 Health, 2.2 Dedup | Background | Qualquer fase |

**Total estimado: 6-8 semanas** em ritmo sustentável de solo dev.

---

## Verificação

Para cada tier implementado:
1. Rodar `npm run build` — deve compilar sem erros TS
2. Rodar o dashboard em `localhost:3000/ops/captacao` — verificar dados renderizando
3. Para PM2: `pm2 status` deve mostrar 3 processos online
4. Para Notion: verificar se leads aparecem no database do Notion
5. Para Instagram: verificar se `instagram_profiles` está populando no DB
6. Para campanhas: verificar se `email_jobs` tem `variant_id` preenchido

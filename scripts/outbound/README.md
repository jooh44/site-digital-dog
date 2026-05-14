# Outbound Scripts

## Objetivo

Esta pasta concentra o runtime tecnico do motor de captacao.

O primeiro slice foi discovery. O segundo slice agora prepara e agenda campanhas de email em cima do shortlist review-ready.

## Ordem recomendada de implementacao

1. `run-oab-registry-search.ts`
2. `run-cnsa-registry-search.ts`
3. `run-official-site-enrichment.ts`
4. `run-google-web-search-enrichment.ts`
5. `export-search-shortlist.ts`
6. `prepare-email-campaign.ts`
7. `sync-resend-email-state.ts`
8. `prepare-followup-email-campaign.ts`
9. `schedule-email-campaign.ts`

## Regra

- estes scripts escrevem no SQLite em `/home/johny/Documentos/projetos/_ops/lead-engine/lead-engine.sqlite`
- o vault nao e a fonte de verdade da discovery
- a qualificacao vem depois
- o painel interno de leitura fica em `/ops/captacao` quando a app estiver rodando localmente

## Comandos atuais

- `npm run outbound:oab-search`
- `npm run outbound:cnsa-search`
- `npm run outbound:official-site`
- `npm run outbound:web-search`
- `npm run outbound:auto-capture`
- `npm run outbound:auto-capture-loop`
- `npm run outbound:shortlist`
- `npm run outbound:prepare-email`
- `npm run outbound:slot-scheduler`
- `npm run outbound:sync-email-state`
- `npm run outbound:prepare-followup`
- `npm run outbound:followup-cycle`
- `npm run outbound:schedule-email`
- `npm run outbound:stop-services`

## O que o primeiro slice faz

- usa o diretorio publico da OAB/PR para a campanha piloto `advocacia trabalhista curitiba`
- persiste leads brutos deduplicados no SQLite canonico
- exporta shortlist em `scripts/outbound/output/`

## Limite conhecido deste slice

- o diretorio nacional do CFOAB exige reCAPTCHA
- a pagina de detalhe por registro na OAB/PR exige Turnstile
- por isso, este slice entrega discovery `oab_registry` e deixa `official_site` como proximo adapter de enrichment

## Slice de enrichment atual

- usa seeds manuais verificadas por URL oficial para os primeiros casos
- extrai dominio, Instagram, e-mail, telefone e sinais de WhatsApp de pagina de perfil e/ou contato
- atualiza `organizations`, `organization_sources`, `contacts` e `evidence` no SQLite canonico

## Slice de fallback web search

- usa o repo local `_tools/google-search` como fallback gratuito
- faz queries por escritorio para achar `site oficial`, `instagram` e pistas de pagina de contato
- grava `instagram_url` em `organizations`
- quando nao achar WhatsApp, o telefone continua sendo o numero operacional de fallback
- nao substitui OAB + site oficial; so preenche lacunas

## Slice automatico e leve

- `npm run outbound:auto-capture` roda um ciclo curto e sequencial
- prioriza novos prefixes de Sao Paulo pela OAB/SP
- depois tenta descobrir `site` e `instagram` para poucos leads por vez
- prioriza `official-site` antes do fallback web
- o fallback IA entra so quando ainda faltar sinal oficial e dentro de limite de sessao/semana
- o objetivo e aumentar a base sem pesar CPU
- `npm run outbound:auto-capture-loop` executa esse ciclo a cada 3 minutos e grava log em `scripts/outbound/output/auto-capture-loop.log`

## Slice de campanha por email

- usa apenas leads `ready_for_review` com `primary_email`
- persiste campanha e jobs em `email_campaigns` e `email_jobs`
- persiste respostas recebidas em `email_responses`
- gera arquivos de revisao em `scripts/outbound/output/`
- agenda o envio no Resend com `scheduledAt` e `idempotencyKey`
- mantem o WhatsApp fora da automacao
- o scheduler automatico tenta preencher slots fixos em `09:00`, `12:00`, `14:00` e `16:00`
- lotes futuros com menos de 10 emails sao cancelados e devolvidos para a fila

## Slice de follow-up

- sincroniza status do Resend via API
- consulta inbound da Resend e grava respostas por remetente
- prepara follow-up apenas para quem segue sem resposta
- reutiliza o mesmo scheduler para agendar a proxima onda

## Fluxo local recomendado

1. discovery:
   - `npm run outbound:oab-search`
   - `npm run outbound:cnsa-search`
   - `npm run outbound:official-site`
   - `npm run outbound:web-search`
   - `npm run outbound:shortlist`
2. revisar o shortlist exportado
3. ajustar `scripts/outbound/input/camp-advocacia-trabalhista-curitiba-email-campaign.json`
4. preparar jobs:
   - `npm run outbound:prepare-email`
5. revisar `scripts/outbound/output/*-email-review.json`
6. validar o plano de agendamento sem enviar:
   - `npm run outbound:schedule-email -- --dryRun`
7. agendar de fato:
   - `npm run outbound:schedule-email`
8. para follow-up autonomo:
   - `npm run outbound:sync-email-state`
   - `npm run outbound:prepare-followup`
   - `npm run outbound:schedule-email -- --emailCampaignId=camp-advocacia-trabalhista-curitiba-email-02`
9. ou usar o atalho de ciclo:
   - `npm run outbound:followup-cycle`

## Slice DIG-4

- `cnsa.oab.org.br` continua sendo a referencia oficial para sociedades, mas a busca publica exige reCAPTCHA
- por isso o runtime agora aceita um arquivo de seeds societarios verificados e os persiste em `cnsa_registry`
- o mesmo arquivo pode alimentar o enrichment de `official_site`, desde que contenha `externalId`, `sourceUrl` e `websiteUrl`

---
status: complete
completedAt: '2026-04-22'
workflowType: architecture
project_name: 'modulo-busca-high-icp'
user_name: 'Johny'
date: '2026-04-22'
inputDocuments:
  - _bmad-output/planning-artifacts/prd-motor-captacao-high-icp-2026-04-22.md
  - _bmad-output/planning-artifacts/architecture-motor-captacao-high-icp-2026-04-22.md
  - docs/plano-captacao-email-linkedin-advocacia.md
---

# Architecture - Modulo de Busca High-ICP

## Executive Summary

O primeiro modulo do motor de captacao deve ser o modulo de busca e persistencia de leads brutos. Ele nao qualifica profundamente, nao gera email e nao toca outreach. Ele faz uma coisa: encontra escritorios com potencial, consolida evidencias minimas e salva isso em uma base organizada para os proximos modulos consumirem.

Arquiteturalmente, este modulo deve ser **registry-first e website-first**, nao browser-first. OAB/CNA/CNSA entram como fonte primaria. Site oficial entra como verificacao e enrichment minimo. Playwright entra apenas como fallback para paginas JavaScript-heavy ou para coletar dados publicos que o parser simples nao consiga extrair.

Para armazenamento, a decisao correta para o MVP e **SQLite como base canonica de busca**. Planilha, JSON e markdown entram como exportacao, visualizacao ou curadoria, mas nao como fonte de verdade da descoberta.

---

## Module Goal

O modulo deve responder, com consistencia:

- quais escritorios foram encontrados
- de onde vieram
- quais sinais minimos existem
- quais contatos publicos estao disponiveis
- o que ja foi visto antes
- o que precisa seguir para qualificacao

---

## Scope

### In Scope

- definicao de campanhas de busca
- conectores de busca por canal
- normalizacao e dedupe
- armazenamento de leads brutos
- registro de evidencias e contatos publicos
- exportacao para revisao humana ou modulos seguintes

### Out of Scope

- scoring detalhado de dor
- qualificação comercial profunda
- geracao de mensagens
- envio de email
- qualquer automacao em LinkedIn ou WhatsApp

---

## Channel Architecture

### Priority 1 - OAB / CNA / CNSA

**Papel:** seed source principal.

**Por que entra primeiro:**

- e uma fonte publica oficial do proprio dominio juridico
- reduz dependencia de APIs pagas e de scraping arriscado
- encaixa melhor no nicho advocacia do que diretorios genericos
- aumenta a legitimidade da lista desde a origem

**Uso recomendado:**

1. usar CNA para localizar e verificar profissionais
2. usar CNSA quando a busca envolver sociedades de advogados
3. cruzar com cidade, area e site oficial quando possivel

### Priority 2 - Site oficial do escritorio

**Papel:** verificacao e enriquecimento minimo.

**Buscar:**

- email publico
- telefone
- pagina da equipe
- areas de atuacao
- cidade/endereco
- sinais basicos de autoridade

**Ferramenta padrao:** HTTP parse simples primeiro. Playwright apenas se necessario.

### Priority 3 - OAB seccional / diretorios oficiais regionais

**Papel:** camada regional de verificacao e complemento.

**Uso recomendado:**

- encontrar caminhos regionais de consulta
- confirmar cidade e subsecao quando a fonte nacional nao bastar
- complementar a descoberta oficial

### Priority 4 - Google Search manual/assistido

**Papel:** resolver lacunas de website, encontrar perfil oficial e descobrir paginas especificas.

**Observacao critica:** nao usar scraping de SERP como espinha dorsal do modulo. Google aqui entra como apoio humano ou semiassistido em baixissimo volume.

### Priority 5 - Perfis publicos e diretorios secundarios

**Papel:** enriquecimento leve e confirmacao de presenca digital.

**Inclui:**

- perfis publicos que o proprio Google ou o site oficial exibirem
- diretorios juridicos ou locais encontrados pela busca

**Regra:** canal secundario. Nao usar como seed core do MVP.

### OpenStreetMap / Nominatim

**Papel:** geocodificacao e normalizacao leve de endereco, quando necessario.

**Regra:** uso baixo volume, no maximo 1 req/s no servico publico, apenas como apoio.

### Instagram

Usar apenas se:

- o site oficial apontar para o perfil, ou
- o Google evidenciar um perfil publico claramente oficial

Nao usar Instagram como canal primario de discovery no MVP.

### LinkedIn

Usar apenas como contexto e verificacao de pessoa-alvo, nunca como base automatizada de descoberta principal.

---

## Tooling Decisions

### Primary Tooling

- `Node.js/TypeScript` para conectores e normalizacao
- `SQLite` para persistencia
- `HTTP parsing` para sites oficiais
- `Playwright` como fallback de browser automation
- `Nominatim` apenas para geocodificacao/normalizacao leve

### Playwright Policy

Playwright sera usado apenas em tres cenarios:

1. site oficial com renderizacao JS que quebra parser HTTP simples
2. pagina de equipe/contato escondida atras de interacao leve
3. necessidade de screenshot ou evidencia visual pontual

**Nao usar Playwright como ferramenta primaria para Google Search nem Google Maps.**

### Parser Policy

- primeiro tentar HTTP + parse leve
- depois Playwright
- evitar browser quando a API ou HTML simples resolver

---

## Search Pipeline

```text
Campaign seed
  -> Query builder
  -> Source adapter
  -> Raw results
  -> Normalization
  -> Deduplication
  -> Contact extraction
  -> Evidence persistence
  -> Export to qualification queue
```

### Campaign Seed

Inputs:

- nicho
- cidade
- faixa de porte
- observacoes de ICP

### Query Builder

Exemplos:

- `"advogado trabalhista Curitiba"`
- `"escritorio de advocacia trabalhista Curitiba"`
- `"advogado trabalhista agua verde curitiba"`

Regras:

- uma intencao por query
- cidade explicita
- sem misturar muitos filtros na mesma string

### Source Adapter

Cada canal deve ter um adapter proprio:

- `oab_registry`
- `official_site`
- `regional_official_directory`
- `google_assisted`
- `secondary_directory`

### Normalization

Normalizar:

- nome do escritorio
- dominio
- telefone
- cidade
- endereco
- external IDs

### Deduplication

Ordem recomendada de dedupe:

1. `oab_id` ou identificador oficial equivalente
2. dominio do site
3. email publico
4. nome + cidade com heuristica

### Contact Extraction

Extrair e salvar:

- email
- telefone
- website
- perfis publicos

### Export

Saida do modulo de busca:

- leads brutos confiaveis em banco
- shortlist exportavel para qualificacao

---

## Storage Decision

### Canonical Store

**Decisao:** SQLite local em `/home/johny/Documentos/projetos/_ops/lead-engine/lead-engine.sqlite`

### Why SQLite

- zero infraestrutura para comecar
- suporta dedupe, filtros e joins direito
- facil de versionar via schema e backups
- melhor que JSON para consulta
- melhor que planilha para integridade
- muito mais simples que Postgres no MVP

### What Not to Use as Canonical Store

**Planilha**

- boa para review
- ruim para dedupe, versionamento e automacao

**JSON**

- bom para payload bruto
- ruim para query e relacionamentos

**Markdown**

- bom para dossie curado
- ruim para fase de descoberta em volume

**Postgres**

- valido depois
- pesado cedo demais para este slice

### Hybrid Model

- **SQLite** = fonte de verdade da descoberta e fila tecnica
- **Vault markdown** = memoria curada dos leads aprovados e dossies
- **CSV/Sheet** = visao de revisao, se necessario

---

## Database Design

### Required Tables

- `campaigns`
- `search_runs`
- `organizations`
- `organization_sources`
- `contacts`
- `evidence`
- `suppressions`

### Minimum Meaning of Each Table

**campaigns**

recorte da rodada de busca

**search_runs**

execucoes por canal/query

**organizations**

lead canonico deduplicado

**organization_sources**

de onde aquele lead veio e com qual ID externo

**contacts**

emails, telefones e perfis publicos

**evidence**

sinais observados que sustentam a existencia do lead

**suppressions**

bloqueios futuros para evitar retrabalho ou contato indevido

---

## Data Contracts

### Organization Must Have

- nome canonico
- cidade
- pelo menos um rastro de origem
- status

### Promotion Rule to Qualification Module

Um lead so sobe para o modulo de qualificacao se tiver:

- nome minimamente confirmado
- cidade confirmada
- website ou fonte publica forte
- pelo menos um canal publico de contato

---

## Module Boundaries

### Search Module Owns

- busca
- dedupe
- persistencia inicial
- evidencias minimas

### Qualification Module Owns

- score comercial
- leitura de dores
- gaps
- tese de abordagem

### Message Module Owns

- assunto
- email
- follow-ups
- mensagens manuais

### Outreach Module Owns

- envio
- cadencia
- supressao operacional
- inbox triage

---

## Reliability Rules

- toda execucao de busca gera `search_run`
- toda origem de lead deixa rastro em `organization_sources`
- nenhum overwrite silencioso de contato
- dedupe sempre preserva historico de origem
- falha de adapter nunca deve apagar resultado previo

---

## Deliverability Note

Inbox placement nao vai ser resolvida com HTML sofisticado sozinho.

O que mais pesa no inicio:

- autenticacao correta do dominio
- subdominio dedicado
- warm-up gradual
- bounce baixo
- complaint baixo
- relevancia real da mensagem

HTML personalizado e imagem personalizada podem virar arma para leads A+, mas devem entrar depois do plain-text/light HTML estar validado. Comecar pesado em imagem piora risco mais do que ajuda.

---

## First Build Slice

### Slice 1

- campanha manual
- adapter `oab_registry`
- persistencia em SQLite
- export de shortlist

### Slice 2

- crawler do site oficial
- extracao de contato
- dedupe por dominio/email/nome+cidade

### Slice 3

- verificacao regional e geocodificacao leve
- export para modulo de qualificacao

---

## Test of Fire

O primeiro teste de fogo do modulo deve ser:

1. rodar uma campanha `advocacia trabalhista curitiba`
2. coletar 30 a 50 resultados brutos via OAB e sites oficiais
3. deduplicar
4. persistir em SQLite
5. exportar 10 a 15 leads limpos para a fila de qualificacao

Se isso funcionar com qualidade, o resto do pipeline pode crescer em cima.

---

## Module Builder Decision

O `bmad-module-builder` e util aqui, mas **ainda nao para scaffold final**.

Motivo:

- os limites entre busca, qualificacao, mensagem e outreach ainda estao sendo fechados
- vale primeiro provar o modulo de busca com schema e adapter real

Momento certo para o builder:

- depois que o modulo de busca tiver adapter, schema e fluxo validados
- ai sim faz sentido empacotar discovery/qualification/outreach como modulo BMAD reaproveitavel

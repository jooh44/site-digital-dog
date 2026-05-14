---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: complete
completedAt: '2026-04-22'
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-motor-captacao-high-icp-2026-04-22.md
  - _bmad-output/planning-artifacts/prd-motor-captacao-high-icp-2026-04-22.md
  - docs/plano-captacao-email-linkedin-advocacia.md
  - /home/johny/Documentos/projetos/docs/index.md
workflowType: architecture
project_name: 'motor-captacao-high-icp'
user_name: 'Johny'
date: '2026-04-22'
---

# Architecture Decision Document - Motor de Captacao High-ICP

## Executive Summary

O Motor de Captacao High-ICP deve nascer como um sistema operacional leve, humano-no-loop e com separacao clara entre descoberta tecnica e memoria curada. A fonte de verdade nao sera Paperclip, nem CRM externo, nem planilha dispersa. Para a fase de descoberta, a fonte canonica sera um banco local simples. Para a fase de curadoria e operacao humana, a fonte canonica sera um vault local em markdown.

O Paperclip entra depois como control plane para orquestracao, fila, approvals e distribuicao de agentes. O envio automatizado permitido no MVP e apenas email via Resend. LinkedIn e WhatsApp ficam fora da automacao de envio; entram apenas como contexto de pesquisa e como mensagens preparadas para execucao manual.

Arquiteturalmente, este sistema se divide em tres camadas:

1. **Data Layer** - banco local para busca, dedupe e estado tecnico
2. **Knowledge Layer** - vault local consultavel e indexado
3. **Execution Layer** - funcoes e scripts para enrichment, scoring, mensagem e envio por email
4. **Control Layer** - aprovacao humana agora, Paperclip no futuro

---

## Architecture Goals

### Primary Goals

- manter memoria operacional navegavel
- reduzir tempo de preparo por lead
- separar pesquisa, decisao, envio e triagem
- permitir que agentes trabalhem sem perder contexto
- preservar seguranca de plataforma e reputacao de dominio

### Constraints

- zero automacao de envio em LinkedIn
- zero automacao de envio em WhatsApp
- baixo volume e alta personalizacao
- stack inicial simples o suficiente para operar sem infra pesada
- compatibilidade com evolucao futura para Paperclip

---

## System Context

### Business Context

O sistema atende a operacao comercial da Digital Dog para prospeccao consultiva de escritorios de advocacia. O valor esta em:

- pesquisa bem feita
- qualificacao real
- mensagem contextual
- fila pequena de leads bons

### Technical Context

- workspace raiz ja possui um indice central em `/home/johny/Documentos/projetos/docs`
- `digital-dog` ja possui `Resend` em uso
- o PRD do motor de captacao e separado do PRD do site
- o workspace contem varios repos e precisa de uma memoria comum acima deles

---

## Core Architectural Decisions

### Decision 1 - Hybrid Source of Truth

**Decisao:** usar uma arquitetura hibrida:

- descoberta e dedupe em banco local
- curadoria e operacao em vault local

**Racional:**

- busca em volume pede query, dedupe e integridade relacional
- operacao humana e agentes se beneficiam de leitura estilo Obsidian
- evita usar planilha como core cedo demais
- continua simples o suficiente para o MVP

### Decision 2 - Split Between Memory and Runtime

**Decisao:** separar memoria operacional do runtime de automacao.

**Memory Layer**

- fica em `_vault/`
- contem campanhas, leads, playbooks, agentes e templates
- e o ponto principal de consulta curada

**Data Layer**

- fica em `_ops/lead-engine/`
- contem o SQLite e o schema da descoberta
- e o ponto principal de persistencia para leads brutos, origens e contatos

**Runtime Layer**

- fica dentro do repo `digital-dog`
- no futuro deve viver em um modulo dedicado, como `digital-dog/lib/outbound/` e `digital-dog/app/api/outbound/`
- usa banco local para fase tecnica e vault para fase curada

**Racional:**

- impede que a logica comercial fique misturada ao site publico
- permite evolucao do runtime sem perder historico
- deixa claro o que e conhecimento e o que e execucao

### Decision 3 - Human Approval as a Hard Gate

**Decisao:** nenhum email e enviado sem aprovacao humana explicita.

Estados obrigatorios:

- `drafted`
- `ready_for_review`
- `approved`
- `sent`

**Racional:**

- protege reputacao
- evita erro de personalizacao
- mantem o sistema coerente com o ICP high-ticket

### Decision 4 - Email as the Only Automated Outreach Channel

**Decisao:** o MVP automatiza apenas email via Resend.

**Racional:**

- respeita as restricoes operacionais definidas no PRD
- encaixa no stack existente
- e o canal com melhor relacao risco/controle para este caso

### Decision 5 - File-First Lead Dossiers

**Decisao:** cada lead relevante tera um dossier em markdown com frontmatter estruturado.

**Racional:**

- facilita busca, leitura e edicao
- permite usar o mesmo lead em varios fluxos
- reduz dependencia de UI antes da hora

---

## Proposed Directory Structure

### Workspace Layer

```text
/home/johny/Documentos/projetos/
  docs/
    index.md
    projetos/
  _vault/
    index.md
    campaigns/
      index.md
      2026-04-advocacia-curitiba-trabalhista/
        index.md
        lead-list.md
        decisions.md
    leads/
      index.md
      advocacia/
        gioia-like-example.md
    agents/
      index.md
    playbooks/
      index.md
    templates/
      campaign-template.md
      lead-template.md
```

### Runtime Layer Inside `digital-dog`

```text
digital-dog/
  lib/
    outbound/
      types.ts
      scoring.ts
      dossier.ts
      prompts.ts
      suppression.ts
  app/
    api/
      outbound/
        send-email/route.ts
        triage-reply/route.ts
  scripts/
    outbound/
      import-leads.mjs
      build-dossiers.mjs
```

### Boundary Rule

- `_ops/lead-engine/` e descoberta tecnica e persistencia inicial
- `_vault/` e memoria curada e operacao
- `digital-dog/` e execucao de software e integracoes

---

## Vault Design

## Vault Entry Points

- `_vault/index.md` - painel de entrada
- `_vault/campaigns/index.md` - fila de campanhas
- `_vault/leads/index.md` - navegacao por leads
- `_vault/playbooks/index.md` - ICPs, copy rules, criterios
- `_vault/agents/index.md` - papeis e contratos de entrada/saida
- `_ops/lead-engine/schema.sql` - contrato tecnico da descoberta

### Campaign Folder Contract

Cada campanha deve conter:

- `index.md` - resumo da campanha
- `lead-list.md` - lista resumida e status
- `decisions.md` - notas de filtro e aprendizados

### Lead Dossier Contract

Cada lead deve conter no minimo:

- identidade do escritorio
- canais publicos
- score explicavel
- dores observadas
- fatos observaveis
- message pack
- status atual
- proximo passo

---

## Data Architecture

### Campaign Frontmatter

```yaml
id: camp-2026-04-adv-curitiba-trab-01
name: Advocacia Trabalhista Curitiba
niche: advocacia-trabalhista
city: Curitiba
size_range: 2-10
status: active
owner: johny
created_at: 2026-04-22
```

### Lead Frontmatter

```yaml
id: lead-adv-curitiba-001
campaign_id: camp-2026-04-adv-curitiba-trab-01
firm_name: Exemplo Advogados
practice_area: trabalhista
city: Curitiba
website_url: https://example.com
public_email: contato@example.com
public_phone: "+55..."
public_profiles:
  - https://linkedin.com/...
target_person: Nome do socio
score: 78
status: ready_for_review
approved: false
last_touch_channel: none
last_touch_at: null
next_action: revisar email
```

### Message Pack Shape

```yaml
message_pack:
  subject_a: "Assunto A"
  subject_b: "Assunto B"
  email_initial: "..."
  email_followup_1: "..."
  email_followup_2: "..."
  linkedin_manual: "..."
  whatsapp_manual: "..."
```

### Suppression Record

Uma lista simples de supressao deve existir no runtime ou em arquivo auxiliar para:

- opt-out
- bounce
- dominio bloqueado
- lead sem fit definitivo

---

## Workflow Architecture

### End-to-End Flow

```text
Campaign definition
  -> Lead discovery
  -> Enrichment
  -> Qualification score
  -> Lead dossier
  -> Message generation
  -> Human review
  -> Email send via Resend
  -> Reply triage
  -> Next action / archive / suppression
```

### State Model

Estados padrao:

- `new`
- `researching`
- `qualified`
- `drafted`
- `ready_for_review`
- `approved`
- `sent`
- `replied`
- `followup_due`
- `paused`
- `no_fit`
- `opt_out`
- `bounce`
- `won`
- `lost`

### Allowed Automation

- discovery assistido
- enrichment
- score
- dossier
- drafts
- email send
- reply triage

### Explicitly Manual

- mensagem no LinkedIn
- mensagem no WhatsApp
- qualquer abordagem de alto risco reputacional
- aprovacao final dos leads A+

---

## Agent Contracts

### CEO / Orchestrator

**Input:** campanhas, resultados, backlog

**Output:** prioridades da semana, nicho e cidade foco

### Lead Researcher

**Input:** definicao da campanha

**Output:** lista inicial de leads e links publicos

### ICP Qualifier

**Input:** lead bruto + pesquisa

**Output:** score explicavel e recomendacao

### Message Strategist

**Input:** dores observadas + contexto

**Output:** angulo de abordagem

### Email Writer

**Input:** lead aprovado para redacao

**Output:** message pack

### RevOps

**Input:** logs de envio e respostas

**Output:** estados, supressao, metricas e proximas acoes

### Human Operator

**Input:** dossier completo

**Output:** aprovacao, envio manual complementar, contato manual

---

## Integration Architecture

### Public Web Research

Fontes permitidas no MVP:

- Google Search
- Google Maps
- site oficial do escritorio
- pagina de equipe
- blog e artigos
- perfis publicos

**Regra:** a evidencia principal deve vir de fonte publica do proprio escritorio sempre que possivel.

### Resend

Uso:

- envio individual
- reply-to real
- notificacao e rastreamento minimo

Dependencias:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `REPLY_TO_EMAIL`
- subdominio dedicado de outbound

### Paperclip (Future)

Papel futuro:

- ler campanhas e leads do vault
- criar issues por lead ou campanha
- distribuir papeis por agente
- aplicar approval gates
- registrar heartbeat e progresso

**Regra importante:** Paperclip nao substitui o vault. Ele coordena o trabalho em cima dele.

---

## Security and Compliance

### Secrets

Segredos nunca entram no vault. Ficam apenas em runtime:

- API keys
- dominios autenticados
- credenciais de inbox

### Data Handling

- guardar apenas dados necessarios para prospeccao
- registrar opt-out de forma imediata
- nao replicar contato em varios arquivos sem necessidade

### Platform Safety

- nao construir automacao de comportamento humano
- nao automatizar acoes de LinkedIn
- nao automatizar envio de WhatsApp

---

## Implementation Strategy

### Phase 1 - Vault Foundation

- criar `_vault/`
- padronizar templates
- registrar campanhas e leads manualmente/assistido

### Phase 2 - Runtime Foundation

- criar tipos e funcoes de score
- criar builder de dossier
- criar sender de email via Resend

### Phase 3 - Operator Loop

- aprovar leads
- enviar emails
- triar respostas
- registrar aprendizados por campanha

### Phase 4 - Paperclip

- conectar agentes ao vault
- transformar campanha/lead em unidade orquestrada

---

## Recommended First Build Slice

O primeiro slice implementavel deve ser:

1. `_vault/` com templates e indice
2. campanha piloto de advocacia
3. lead dossier padrao
4. score simples
5. sender de email via Resend

Esse slice e suficiente para operar de forma real sem esperar a stack completa.

---

## Open Decisions

- se os leads ficarao todos em markdown puro ou com json auxiliar para automacao
- se replies serao persistidos no vault ou em storage separado
- se o runtime inicial mora no `digital-dog` ou em repo proprio depois

---

## Final Recommendation

O caminho correto para este sistema e:

- **memoria local primeiro**
- **descoberta tecnica simples junto**
- **runtime simples depois**
- **Paperclip por cima**

Se inverter isso, voce ganha orquestracao antes de ganhar clareza. Esse e o tipo de sofisticacao que parece avancada, mas atrasa a operacao.

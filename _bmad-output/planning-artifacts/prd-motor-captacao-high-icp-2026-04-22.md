---
classification:
  projectType: internal_ops_system
  domain: outbound_b2b
  complexity: medium
  projectContext: brownfield-business-greenfield-product
  integrations: [Resend, public web sources, LinkedIn public research]
  notes: Human-in-the-loop for LinkedIn and WhatsApp. Email-first for outreach.
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-motor-captacao-high-icp-2026-04-22.md
  - docs/plano-captacao-email-linkedin-advocacia.md
  - _bmad-output/innovation-strategy-2026-03-27.md
workflowType: prd
date: 2026-04-22
author: Codex
---

# Product Requirements Document - Motor de Captacao High-ICP

**Author:** Codex
**Date:** 2026-04-22

## Executive Summary

O Motor de Captacao High-ICP e um sistema operacional interno da Digital Dog para prospeccao B2B consultiva de baixo volume e alta qualidade. O produto deve encontrar escritorios de advocacia com alto potencial, enriquecer contexto publico, qualificar o lead, preparar a mensagem inicial e manter memoria operacional do pipeline sem automatizar comportamento arriscado em WhatsApp ou LinkedIn.

O canal principal de outreach sera email via Resend. LinkedIn entra como camada de pesquisa e contexto. WhatsApp e LinkedIn seguem humanos no loop: o sistema prepara a melhor mensagem possivel, mas Johny faz a abordagem final quando decidir.

Este PRD cobre a maquina interna de prospeccao. Ele nao substitui o PRD do site da Digital Dog.

## Project Classification

| Campo | Valor |
|---|---|
| **Tipo** | Sistema interno de operacao comercial |
| **Dominio** | Outbound B2B para servicos high-ticket |
| **Complexidade** | Media |
| **Contexto** | Brownfield de negocio + greenfield de produto interno |
| **Beachhead** | Escritorios de advocacia de 2 a 15 advogados |

## Success Criteria

### User Success

Johny recebe uma fila pequena e confiavel de leads com contexto suficiente para decidir rapido se vale abordar. Cada lead aprovado chega com:

- identificacao do escritorio
- canais publicos relevantes
- dor observada
- score simples
- email inicial pronto
- sugestao de texto para abordagem manual em LinkedIn e WhatsApp

### Business Success

| Metrica | Meta inicial | Prazo |
|---|---|---|
| Leads qualificados por semana | 10 a 30 | 30 dias |
| Emails enviados por dia | 5 a 15 | desde o inicio |
| Bounce rate | abaixo de 4% | continuo |
| Complaint rate | proximo de zero | continuo |
| Tempo medio de preparo por lead | menor que pesquisa manual completa | 30 dias |
| Conversas qualificadas originadas do processo | crescimento semanal | 60 dias |

### Technical Success

- estrutura navegavel por agentes e humanos
- envio individual por email funcionando com Resend
- estados de pipeline persistidos sem ambiguidade
- suppressions e opt-outs respeitados
- separacao clara entre automacao segura e etapas humanas

## Product Scope

### MVP

O MVP deve entregar:

- criacao de micro-campanhas por nicho, cidade e porte
- descoberta de leads usando fontes publicas e estaveis
- enrichment manual/assistido com dados publicos
- score de qualificação
- dossier por lead
- geracao de email inicial + 2 follow-ups
- sugestao de abordagem manual para LinkedIn e WhatsApp
- fila de aprovacao antes do envio
- envio via Resend
- triagem simples de respostas
- estados do pipeline e historico minimo

### Out of Scope

- mensagens automaticas em LinkedIn
- mensagens automaticas em WhatsApp
- scraping agressivo de plataformas
- automacao de comportamento humano
- cadencias complexas multicanal
- CRM enterprise completo

### Future Scope

- Paperclip como control plane de agentes
- vault navegavel estilo Obsidian para memoria central
- dashboards operacionais
- enriquecimento semi-automatico de portfolio e casos por nicho
- expansao para saude, vet e outros nichos high-ticket

## User Journeys

### Journey 1 — Criar uma micro-campanha

Johny define um recorte: area juridica, cidade e faixa de porte. O sistema cria uma campanha e guarda o foco da pesquisa.

### Journey 2 — Gerar uma lista inicial

O sistema agrega escritorios a partir de Google, Maps, site oficial e perfis publicos. O objetivo e chegar a uma lista inicial de 30 a 50 nomes por micro-campanha.

### Journey 3 — Qualificar e priorizar

Cada lead recebe enrichment e score. O sistema reduz a lista para um conjunto menor de leads acionaveis.

### Journey 4 — Preparar abordagem

Para cada lead aprovado, o sistema gera um dossier com fatos observaveis, angulo sugerido e mensagens prontas para email, LinkedIn manual e WhatsApp manual.

### Journey 5 — Enviar e acompanhar

Johny revisa, aprova e o sistema envia o email pelo Resend. Depois registra resposta, bounce, opt-out ou ausencia de resposta.

## Functional Requirements

### FR1 — Campaign Definition

O sistema deve permitir definir uma micro-campanha por:

- nicho juridico
- cidade/regiao
- porte desejado
- observacoes de ICP

Output esperado:

- identificador da campanha
- filtros aplicados
- status da campanha

### FR2 — Lead Discovery

O sistema deve registrar leads com base em fontes publicas, no minimo:

- nome do escritorio
- area principal
- cidade
- URL do site
- email publico ou pagina de contato
- telefone publico
- URL de perfil publico relevante quando existir

### FR3 — Lead Enrichment

O sistema deve anexar ao lead:

- socios ou pessoas-alvo sugeridas
- porte estimado
- qualidade do site
- sinais de SEO local
- sinais de autoridade/conteudo
- dores observadas
- notas livres

### FR4 — Qualification Score

O sistema deve calcular um score simples de 0 a 100 a partir de:

- fit de nicho e cidade
- dor digital observada
- capacidade de compra
- clareza de contato
- timing percebido

O score precisa ser explicavel, nao apenas um numero fechado.

### FR5 — Lead Dossier

O sistema deve gerar um resumo acionavel por lead contendo:

- porque este lead e relevante
- o que foi observado
- qual e o melhor angulo de abordagem
- quais canais publicos podem ser usados por Johny
- que riscos ou duvidas existem

### FR6 — Message Generation

O sistema deve gerar:

- assunto A
- assunto B
- email inicial com ate 120 palavras
- follow-up 1
- follow-up 2
- mensagem curta para LinkedIn manual
- mensagem curta para WhatsApp manual

Toda mensagem precisa referenciar ao menos um fato observavel do lead.

### FR7 — Human Approval Gate

Nenhuma mensagem pode ser enviada sem um estado explicito de aprovacao humana.

Johny deve poder:

- aprovar
- reprovar
- editar
- pausar

### FR8 — Email Sending

O sistema deve enviar emails individuais via Resend com:

- sender apropriado
- reply-to real
- rastreamento minimo
- respeito a suppressions

### FR9 — Reply Triage

O sistema deve classificar respostas em:

- interessado
- talvez depois
- sem fit
- bounce
- remover
- sem resposta

### FR10 — Pipeline State

O sistema deve manter ao menos os estados:

- novo
- pesquisando
- qualificado
- pronto para revisao
- aprovado
- enviado
- respondeu
- sem resposta
- pausa
- sem fit
- opt-out
- bounce
- ganho
- perdido

### FR11 — Memory and Retrieval

O sistema deve organizar os registros de forma navegavel para consulta posterior por agentes e por Johny, com caminho claro de entrada por campanha e por lead.

## Non-Functional Requirements

### Compliance and Safety

- outbound deve permanecer de baixo volume e alta personalizacao
- WhatsApp e LinkedIn nao podem ter envio automatico
- leads com opt-out devem entrar em supressao imediatamente
- a operacao deve priorizar fontes publicas e estaveis

### Maintainability

- estrutura simples o suficiente para operar sem stack pesada no inicio
- arquivos e estados legiveis por humano
- facil evolucao para Paperclip depois

### Reliability

- historico de status nao pode se perder
- email enviado deve ficar associado ao lead correto
- falhas de envio precisam ser registradas

## Agent Roles

### CEO / Orchestrator

Define foco da semana, aprova prioridades e acompanha resultado.

### Lead Researcher

Monta a lista inicial e coleta fontes publicas.

### ICP Qualifier

Pontua e explica o score do lead.

### Message Strategist

Define o angulo de abordagem a partir das dores observadas.

### Email Writer

Produz email inicial e follow-ups.

### RevOps

Mantem pipeline, suppressions, logs e metricas.

### Human Closer

Johny faz a revisao final e a abordagem manual quando necessario.

## Data Model (Initial)

### Campaign

- id
- nome
- nicho
- cidade
- porte
- status
- notes

### Lead

- id
- campaign_id
- firm_name
- practice_area
- city
- website_url
- public_email
- public_phone
- public_profiles
- target_person
- firm_size_estimate
- score
- status

### Lead Research Notes

- observed_pain
- local_seo_notes
- content_notes
- authority_notes
- risks
- evidence_links

### Message Pack

- subject_a
- subject_b
- email_initial
- email_followup_1
- email_followup_2
- linkedin_manual
- whatsapp_manual

## Release Plan

### Release 1 — Foundation

- campanha
- lead schema
- dossier
- score explicavel

### Release 2 — Outreach

- aprovacao humana
- geracao de mensagens
- envio via Resend
- triagem inicial

### Release 3 — Operating System

- vault navegavel
- metricas
- playbooks por nicho
- Paperclip

## Open Decisions

- formato inicial do vault/CRM: markdown puro, json auxiliar, ou ambos
- onde armazenar os dossies: repo da digital-dog ou vault raiz da operacao
- trigger de envio: manual assistido ou fila semi-automatica
- modelo exato por agente quando Paperclip entrar

## Next Step

Com este PRD, o proximo workflow recomendado e **[CA] Create Architecture** para definir:

- estrutura do vault
- formato dos arquivos
- integracao com Resend
- fluxo de estados
- papeis dos agentes na pratica
- ponto de entrada futuro do Paperclip

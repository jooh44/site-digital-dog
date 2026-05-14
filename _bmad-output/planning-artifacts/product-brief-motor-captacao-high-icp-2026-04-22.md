---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - _bmad-output/innovation-strategy-2026-03-27.md
  - docs/plano-captacao-email-linkedin-advocacia.md
  - _bmad-output/planning-artifacts/prd.md
date: 2026-04-22
author: Codex
---

# Product Brief: Motor de Captacao High-ICP

## Executive Summary

O Motor de Captacao High-ICP da Digital Dog e uma operacao interna para gerar conversas qualificadas com escritorios de advocacia sem depender de trafego pago pesado, outreach em massa ou automacao arriscada dentro de plataformas sensiveis. O sistema combina pesquisa, enrichment, qualificacao, preparacao de mensagem e organizacao de pipeline para que Johny execute apenas a parte mais valiosa: a abordagem final, com contexto real e alta personalizacao.

O canal principal sera email. LinkedIn entra como camada de inteligencia e contexto. WhatsApp permanece humano, manual e deliberado. O objetivo nao e disparar volume; e transformar uma lista fria em dossiers acionaveis com angulo de abordagem, provas observadas e mensagens prontas para envio.

O primeiro beachhead e advocacia, com foco em escritorios pequenos e medios que tenham perfil de compra, presenca digital fraca ou mediana e dor clara de posicionamento, autoridade ou captacao organica.

---

## Core Vision

### Problem Statement

Hoje o maior gargalo da Digital Dog nao esta na entrega, mas na entrada de novos clientes. Trafego pago proprio ainda nao tem verba suficiente para operar com folga, e outreach manual puro consome tempo demais para um operador solo. Ao mesmo tempo, outreach agressivo em LinkedIn ou WhatsApp cria risco de plataforma e distrai do ponto principal: qualidade.

### Why Existing Approaches Fall Short

- Lista fria sem pesquisa gera mensagem generica e baixa resposta
- Automacao pesada em LinkedIn e WhatsApp cria risco desnecessario
- CRM sem inteligencia vira apenas uma planilha com nomes
- Ferramentas isoladas nao constroem memoria operacional reaproveitavel
- O PRD atual da Digital Dog cobre o site de captacao, nao a maquina interna de prospeccao

### Proposed Solution

Criar um motor interno, file-first e compativel com Paperclip, que opere em 4 camadas:

1. **Lead discovery** — encontrar escritorios e socios com base em nicho, cidade, porte e sinais publicos
2. **Qualification** — avaliar fit comercial, dor digital, capacidade de compra e contexto de abordagem
3. **Message preparation** — gerar email inicial, follow-ups e sugestoes de mensagens para LinkedIn e WhatsApp manual
4. **Pipeline memory** — registrar estado, resposta, proximo passo e aprendizados por lead

### Key Differentiators

1. **Qualidade acima de volume** — o sistema nasce para poucos contatos por dia, nao para escala cega
2. **Humano no loop onde importa** — agentes preparam; Johny decide e aborda
3. **File-first, nao ferramenta-first** — a memoria principal vive em markdown/estrutura navegavel, com Paperclip entrando como orquestrador depois
4. **Foco em ICP alto** — o motor filtra antes de gastar energia com outreach
5. **Beachhead regulado** — advocacia favorece abordagem informacional, contextual e mais sofisticada

---

## Target User

### Primary User

**Johny, operador comercial e estrategista da Digital Dog**

Precisa sair da dependencia de indicacoes e terceirizacao sem virar operador de spam. Quer receber uma fila pequena e confiavel de oportunidades, cada uma com:

- nome do escritorio
- area de atuacao
- cidade
- site
- redes/public profiles relevantes
- email publico
- pessoa-alvo sugerida
- motivo do fit
- principal dor observada
- mensagem pronta para email
- sugestao de abordagem manual para LinkedIn ou WhatsApp

### Secondary User

**Agentes internos da operacao**

Nao sao usuarios humanos no sentido tradicional, mas participantes do fluxo. Precisam de contexto estruturado e entrada/saida previsivel para operar sem desperdicarem tokens nem perderem rastreabilidade.

---

## Jobs To Be Done

Quando eu estiver sem verba para crescer com trafego pago, eu quero uma maquina de prospeccao altamente qualificada para encontrar escritorios certos, entender o contexto deles e me entregar a melhor abordagem possivel, para que eu consiga abrir conversas de alto valor sem queimar meu nome nem meu tempo.

---

## Scope

### MVP Scope

O MVP deste motor deve entregar:

- lista de leads por micro-campanha
- enrichment com dados publicos confiaveis
- score simples de ICP
- dossier por lead
- rascunho de email inicial e follow-ups
- sugestao de texto para abordagem manual em LinkedIn e WhatsApp
- fila de aprovacao humana antes do envio
- envio individual por email via Resend
- triagem inicial de replies e estados do pipeline

### Out of Scope for MVP

- envio automatico em LinkedIn
- envio automatico em WhatsApp
- scraping agressivo ou disfarce de comportamento humano
- campanhas em massa
- automacao multicanal complexa
- BI completo de performance paga

### Phase 2

- Paperclip como control plane
- memoria/knowledge base navegavel em estilo vault
- score mais sofisticado por nicho/cidade
- enriquecimento semi-automatico de portfolio e casos
- dashboards operacionais

---

## User Journey

### Journey 1 — Micro-campanha de descoberta

Johny define um foco, como "escritorios trabalhistas de Curitiba com 2 a 10 advogados". O sistema gera uma lista inicial com fontes publicas, elimina ruido e devolve um conjunto menor com potencial real.

### Journey 2 — Dossier acionavel

Para cada lead aprovado, o sistema entrega um resumo curto e util: o que o escritorio faz, qual a dor aparente, qual o angulo de abordagem e quais perfis ou canais publicos valem atencao. Johny nao precisa pesquisar do zero.

### Journey 3 — Mensagem pronta para abordagem

O agente gera um email enxuto e contextualizado, alem de um texto que Johny poderia usar manualmente no LinkedIn ou WhatsApp se fizer sentido. O texto parte de observacoes reais e nao de elogio vazio.

### Journey 4 — Pipeline vivo

Depois do envio, o lead passa por estados simples: novo, qualificado, pronto para envio, enviado, respondeu, sem fit, bounce, pausa, ganho, perdido. O sistema mantem memoria minima suficiente para nao repetir trabalho nem esquecer follow-up.

---

## Success Metrics

### Operational Success

- Johny consegue revisar e aprovar uma fila diaria sem sobrecarga
- cada lead aprovado chega com contexto suficiente para abordagem manual ou envio imediato
- a operacao fica reutilizavel e navegavel por outros agentes

### Early KPIs

- 5 a 15 emails/dia, com alta personalizacao
- 1 a 3 micro-campanhas por semana
- bounce rate abaixo do limite operacional seguro
- complaint rate proximo de zero
- tempo de preparacao por lead significativamente menor do que pesquisa manual completa
- taxa de resposta melhor do que benchmark interno atual

### Strategic Success

- o canal outbound passa a gerar caixa para financiar trafego pago depois
- a Digital Dog constroi um processo repetivel de captacao para nichos regulados
- o motor pode ser replicado depois para saude, vet e outros ICPs high-ticket

---

## Risks and Constraints

- qualidade de lista ruim destrói reputacao de dominio
- personalizacao superficial vira spam premium, nao outreach premium
- excesso de automacao em plataformas sensiveis aumenta risco sem aumentar valor
- falta de memoria compartilhada faz os agentes repetirem pesquisa inutilmente
- misturar esse motor com o PRD atual do site da Digital Dog cria confusao de escopo

---

## Product Principles

1. **Pesquisar antes de escrever**
2. **Filtrar antes de enviar**
3. **Poucos leads bons vencem muitos leads medianos**
4. **Toda abordagem precisa de um fato observavel**
5. **WhatsApp e LinkedIn sao assistidos, nao automatizados**
6. **A memoria do processo precisa ser navegavel por humanos e agentes**

---

## Recommended Next Step

Este brief valida o conceito e separa o problema corretamente. O proximo passo e transformar isso em um PRD dedicado com:

- schema de lead e pipeline
- papeis dos agentes
- gates humanos
- integracoes reais com Resend
- regras de supressao, opt-out e triagem
- formato do vault/CRM para consulta por agentes

Depois do PRD, a etapa correta e arquitetura da stack operacional.

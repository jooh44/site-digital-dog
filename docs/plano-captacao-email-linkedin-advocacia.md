# Plano de Captacao B2B
## Email first + LinkedIn assistido para advocacia

**Data:** 2026-04-22
**Contexto:** gargalo principal da Digital Dog esta em captacao. A prioridade e gerar caixa com prospeccao de alta qualidade e baixo custo antes de escalar em trafego pago.

---

## 1. Objetivo

Construir um motor de prospeccao enxuto para escritorios de advocacia usando:

- email como canal principal
- LinkedIn como camada de pesquisa, priorizacao e contexto
- WhatsApp apenas como follow-up manual e seguro
- agentes para preparar, enriquecer, classificar, escrever e organizar

O sistema nao deve depender de automacao agressiva dentro do LinkedIn nem de WhatsApp Web automatizado.

---

## 2. Principio central

Automatizar o entorno da captacao, nao o comportamento humano dentro das plataformas sensiveis.

Traducao pratica:

- **Pode automatizar:** busca inteligente, enrichment, score, CRM, rascunho de email, classificacao de replies, follow-up scheduler, relatorios.
- **Nao deve automatizar:** scraping pesado do LinkedIn, envio automatico de conexoes, mensagens automaticas no LinkedIn, comportamento disfarcado de humano no WhatsApp.

---

## 3. Canais e funcao de cada um

### 3.1 Email

Canal principal de outbound.

Uso:

- primeiro contato
- follow-up curto
- envio de prova social
- convite para diagnostico

Vantagem:

- baixo custo
- controlavel
- medivel
- mais aceito pelo publico juridico

### 3.2 LinkedIn

Camada de inteligencia e warming.

Uso:

- encontrar escritorios e socios
- entender porte, nicho e linguagem
- detectar sinais de atividade
- priorizar leads
- apoiar abordagem manual quando fizer sentido

Nao usar como canal automatizado de outreach.

### 3.3 WhatsApp

Canal manual de follow-up ou continuidade apos sinal positivo.

Uso:

- responder quando o lead pedir
- manter conversa apos reply no email
- fechar horario de reuniao

Nao usar para prospeccao fria automatizada.

---

## 4. ICP inicial

Focar primeiro em escritorios que tenham:

- 2 a 15 advogados
- sede em capitais ou cidades medias com competicao digital real
- areas de atuacao com busca recorrente e intencao comercial
- site fraco, genérico ou inexistente
- pouca prova de autoridade em IA, SEO local ou estrutura digital

### Faixas prioritarias

1. trabalhista
2. previdenciario
3. familia e sucessoes
4. empresarial para PMEs
5. consumidor / civel regional

### Faixas para deixar depois

- penal high-end
- tributario boutique
- mega bancas
- escritórios sem site, sem email publico e sem qualquer rastro digital util

---

## 5. Fonte de leads

### 5.1 Fonte primaria

Usar fontes publicas e estaveis:

- Google Maps
- Google Search
- site oficial do escritorio
- pagina de equipe
- blog / artigos / noticias
- perfis publicos de LinkedIn

### 5.2 Fonte secundaria

LinkedIn Sales Navigator para:

- salvar buscas por nicho e cidade
- acompanhar novos resultados
- acompanhar mudancas de funcao ou atividade
- salvar contas e leads

### 5.3 Regra operacional

LinkedIn entra para localizar e priorizar.
Os dados operacionais principais devem vir de fonte publica do proprio escritorio sempre que possivel.

---

## 6. Workflow alvo

### Etapa 1 - Descoberta

Input:

- nicho
- cidade
- porte desejado

Output:

- lista inicial de 30 a 50 escritorios por micro-campanha

Campos minimos:

- nome do escritorio
- cidade
- area principal
- URL do site
- URL do LinkedIn da firma ou do socio
- telefone publico
- email publico ou pagina de contato

### Etapa 2 - Enrichment

O agente pesquisa e adiciona:

- numero estimado de advogados
- socios principais
- se publica conteudo ou nao
- qualidade do site
- sinais de SEO local
- sinais de AIO / GEO
- linguagem da marca
- possiveis dores visiveis

### Etapa 3 - Score

Score simples de 0 a 100.

Componentes:

- **Fit**: nicho, cidade, porte
- **Dor digital**: site fraco, autoridade baixa, copy fraca, zero AIO
- **Capacidade de compra**: estrutura minima, equipe, marca, portfolio juridico
- **Reachability**: email publico valido e ponto de contato claro
- **Timing**: recente mudanca de marca, expansao, postagens, contratacoes, novo site mal feito

### Etapa 4 - Preparacao do email

Gerar:

- assunto A
- assunto B
- email de primeiro contato
- follow-up 1
- follow-up 2
- nota interna de personalizacao

Regra:

- ate 120 palavras no primeiro email
- 1 observacao especifica real
- 1 dor plausivel
- 1 proposta clara
- 1 CTA simples

### Etapa 5 - Revisao humana

Antes do envio, voce aprova:

- se o lead vale o tiro
- se a personalizacao esta correta
- se o tom nao ficou vendedor demais

### Etapa 6 - Envio

Enviar um por um via Resend com:

- sender em subdominio de outbound
- reply-to no inbox real
- tracking minimo
- opt-out claro

### Etapa 7 - Triagem de resposta

Classificacao automatizada:

- interessado
- talvez depois
- sem fit
- sem resposta
- bounce
- pedir remocao

### Etapa 8 - Acao seguinte

- interessado -> agenda / diagnostico
- talvez depois -> cadencia longa
- sem fit -> arquiva
- sem resposta -> encerra apos poucos toques
- opt-out -> supressao imediata

---

## 7. Cadencia recomendada

Manter curta e limpa.

### Sequencia base

1. **D0** - email 1 curto e altamente contextual
2. **D3 ou D4** - bump curto, sem reinventar a mensagem
3. **D8 ou D9** - prova social ou observacao mais concreta
4. **D14** - encerramento educado

Maximo inicial: 4 toques por lead.

Nao insistir alem disso sem sinal.

---

## 8. Papel do LinkedIn

### O que fazer

- usar Sales Navigator para buscar contas e leads
- salvar buscas por nicho, cidade e porte
- salvar contas relevantes
- olhar perfis manualmente para contexto
- seguir perfis ou interagir manualmente quando fizer sentido

### O que nao fazer

- auto-view em massa
- auto-connect
- auto-message
- scraping com extensoes ou bots
- exportacao agressiva de dados do LinkedIn

### Melhor desenho

**LinkedIn assistido**

Pipeline:

1. voce ou um agente abre a busca
2. salva contas e leads prioritarios
3. transfere apenas os escolhidos para o CRM interno
4. enrichment real acontece fora do LinkedIn, com base no site e em fontes publicas

---

## 9. Email infra

### Setup recomendado

- usar subdominio dedicado, ex.: `outbound.digitaldog.pet` ou `hello.digitaldog.pet`
- SPF e DKIM ativos
- DMARC configurado
- return-path customizado
- inbox real separado para replies

### Regras

- nao usar o dominio principal da operacao para volume maior sem isolamento
- aquecer gradualmente
- nao disparar lista crua
- validar emails antes de enviar
- remover bounces e opt-outs imediatamente

### Metas de saude

- bounce muito baixo
- complaint praticamente zero
- foco em reply rate e reunioes, nao em open rate

---

## 10. CRM minimo

Nao precisa Salesforce nem HubSpot no inicio.

Campos minimos:

- lead_id
- account_name
- site_url
- linkedin_url
- city
- niche
- size_estimate
- score
- primary_contact_name
- primary_contact_role
- email
- email_status
- campaign
- last_touch_at
- next_touch_at
- stage
- owner
- notes

Stages:

- discovered
- enriched
- scored
- approved
- emailed
- replied
- qualified
- diagnostic_booked
- closed_won
- closed_lost
- opt_out

---

## 11. Agentes necessarios

### 11.1 Lead Researcher

Responsabilidade:

- buscar escritorios
- consolidar dados publicos
- preencher CRM inicial

### 11.2 Lead Qualifier

Responsabilidade:

- calcular score
- identificar fit
- separar prioridade A / B / C

### 11.3 Email Writer

Responsabilidade:

- escrever email inicial
- escrever follow-ups
- manter tom sobrio e juridicamente adequado

### 11.4 Reply Triage

Responsabilidade:

- ler respostas
- classificar interesse
- sugerir proxima acao

### 11.5 RevOps

Responsabilidade:

- higiene da base
- supressao
- dashboards
- medir reply rate, bounce, booked calls, win rate

---

## 12. KPIs certos

Medir:

- contas pesquisadas por semana
- leads aprovados por semana
- taxa de email valido
- taxa de resposta
- taxa de resposta positiva
- diagnosticos agendados
- proposta enviada
- cliente fechado

Nao otimizar cedo demais por:

- open rate
- clique
- vanity metrics do LinkedIn

---

## 13. Roadmap

### Fase 1 - Fundacao

- definir ICP
- configurar subdominio de outbound
- ligar Resend corretamente
- criar CRM simples
- definir score
- criar 2 campanhas piloto

### Fase 2 - Motor de lista

- montar buscas por cidade e nicho
- criar rotina semanal de discovery
- salvar contas e leads
- enriquecer a base

### Fase 3 - Motor de email

- gerar emails personalizados
- revisar manualmente
- enviar em baixo volume
- medir resposta real

### Fase 4 - Operacao assistida

- classificar respostas automaticamente
- priorizar follow-up
- integrar agenda e diagnostico
- registrar objeções e sinais recorrentes

### Fase 5 - Escala segura

- mais nichos
- mais cidades
- portfolio forte no site
- playbooks por nicho
- ads depois que houver caixa e aprendizagem comercial

---

## 14. Decisao pratica

Se for escolher apenas uma arquitetura agora:

**Email first + LinkedIn assistido + WhatsApp manual**

Essa e a operacao mais barata, mais defensavel e menos fragil para a Digital Dog neste momento.


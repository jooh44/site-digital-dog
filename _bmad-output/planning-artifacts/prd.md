---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-01b-continue', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
classification:
  projectType: web_app
  domain: general
  complexity: low-medium
  projectContext: brownfield-tech-greenfield-product
  integrations: [Meta Pixel, WhatsApp, GA4]
  notes: Sem Calendly - agendamento via formulário ou WhatsApp direto
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-digital-dog-2026-03-09.md
  - _bmad-output/planning-artifacts/research/market-posicionamento-digital-dog-research-2026-03-09.md
  - _bmad-output/story-2026-03-10.md
  - _bmad-output/brainstorming/brainstorming-session-2026-03-09-1900.md
  - _bmad-output/planning-artifacts/sprint-change-proposal-2026-03-09.md
workflowType: 'prd'
briefCount: 1
researchCount: 1
brainstormingCount: 0
projectDocsCount: 0
---

# Product Requirements Document - digital-dog

**Author:** Johny
**Date:** 2026-03-10

## Executive Summary

O site da Digital Dog é o motor de captação da operação — uma landing page de alta conversão projetada para transformar visitantes vindos de Meta Ads em Diagnósticos Digitais agendados. O produto não é um portfólio institucional: é infraestrutura de vendas. Cada elemento de UX, copy e técnico serve a um único objetivo: o visitante solicita o Diagnóstico.

**Usuários-alvo:** Donos de negócio local e regional — advogados, veterinários, médicos, consultores e empreendedores — que já tentaram, já pagaram e ainda não têm nada construído de fato. Gerenciam múltiplos fornecedores sem coesão e buscam um parceiro que entenda o negócio antes de propor qualquer solução.

**Problema resolvido:** PMEs brasileiras recebem soluções genéricas de agências que chegam com a resposta pronta, sem diagnóstico real. Nenhum ativo é construído. Quando o contrato acaba, o cliente volta à estaca zero — dependente de tráfego pago, invisível no orgânico e nas buscas por IA.

### O Diferencial

A Digital Dog não compete na categoria "agência". Opera numa categoria própria: Arquitetura Digital — o ecossistema completo (marca, site, SEO+AIO, automações, identidade visual) entregue por um único ponto de inteligência. O diferencial está no método: o **Diagnóstico Digital vem antes de qualquer solução** — mapeamento real da jornada comportamental do cliente na internet, antes de propor qualquer estratégia.

O ativo entregue ao cliente não é uma campanha — é infraestrutura que valoriza com o tempo, reduz dependência de tráfego pago e posiciona o negócio para ser encontrado por pessoas *e* por IA (ChatGPT, Gemini, Perplexity).

## Project Classification

| Campo | Valor |
|---|---|
| **Tipo** | Web App — landing page / site institucional (Next.js, SSG, mobile-first) |
| **Domínio** | Serviços de marketing digital / arquitetura digital |
| **Complexidade** | Baixa-Média (sem regulação; integrações: Meta Pixel, WhatsApp, GA4) |
| **Contexto** | Brownfield técnico (stack Next.js + Vercel existente) + Greenfield de produto (novo posicionamento) |

## Success Criteria

### User Success

O visitante chega via Meta Ads, entende em segundos o que a Digital Dog oferece e tem um único caminho claro: preencher o formulário de Diagnóstico. Sucesso para o usuário é:

- Clareza imediata sobre o posicionamento e proposta de valor
- Fricção zero no caminho CTA → formulário
- Após preenchimento: recebe número do WhatsApp para tirar dúvidas — conversão com continuidade humana

### Business Success

| Métrica | Meta | Prazo |
|---|---|---|
| Taxa landing → formulário preenchido | ≥ 20% | Desde lançamento |
| Taxa diagnóstico → proposta aceita | ≥ 40% | Desde lançamento |
| Custo por diagnóstico agendado (Meta Ads) | ≤ R$80 | Desde lançamento |
| Clientes ativos de Arquitetura Digital | 3–5 | 6 meses |
| MRR manutenção/automações | R$1.500–3.000 | 6 meses |

### Technical Success

Core Web Vitals aprovados (LCP < 2.5s, CLS < 0.1, INP < 200ms), PageSpeed Mobile ≥ 90, Meta Pixel e GA4 disparando eventos corretamente, formulário funcional com submit → WhatsApp. Ver NFRs para critérios completos.

### Measurable Outcomes

O MVP está validado quando:
1. Site no ar com Meta Pixel ativo e formulário de Diagnóstico funcionando
2. Primeira campanha Meta Ads rodando
3. Primeiro Diagnóstico Digital agendado via site
4. Primeiro cliente de Arquitetura Digital convertido

## Product Scope

### MVP — Minimum Viable Product

Site de captação completo como motor de conversão para Meta Ads:

- **Homepage/Landing Page** — hero com Fred (mascote visual), posicionamento, CTA único para formulário
- **Serviços** — Arquitetura de Marca + Arquitetura Tecnológica detalhadas
- **Portfólio** — logos e identidades visuais com CMS para atualizações fáceis
- **Diagnóstico Digital** — formulário de agendamento + trigger de WhatsApp pós-submit
- **Hub de Ferramentas** — placeholder/teaser apenas (sinaliza o futuro sem entregar o que não existe)
- **Integrações:** Meta Pixel, GA4, WhatsApp (pós-formulário)
- **SEO base:** Schema Markup, AIO, llms.txt — base mínima, não foco principal neste momento

### Growth Features (Pós-MVP)

- Hub de Ferramentas com área de login para clientes
- Fred funcional como copiloto: dashboards, relatórios em tempo real, insights com IA
- "Busca do Jornal" — monitoramento competitivo de concorrentes (scraping via WebMCP, scrapers ou navegador nativo)
- Blog/conteúdo editorial para SEO de longo prazo
- Portal do cliente com visibilidade do projeto
- CRM de follow-up de leads

### Vision — Plataforma All-in-One

A Digital Dog como ecossistema proprietário de lock-in estratégico:

- **Fred como copiloto de plataforma** — entende todo o contexto do cliente, entrega relatórios em tempo real, insights com IA e monitoramento competitivo contínuo
- **Vet-OS** — sistema veterinário proprietário: gestão de clínica, consultas inteligentes e teleconsultas (maior projeto em desenvolvimento)
- **Plataforma de cliente** — dashboards personalizados por segmento e escopo, inteligência de negócio integrada
- **Expansão vertical** — replicar o modelo para outros segmentos regulamentados (advocacia, medicina, odontologia)

## User Journeys

### Journey 1 — Dr. Ricardo: O Anúncio que Tocou na Ferida *(visitante Meta Ads — caminho de sucesso)*

É quinta à noite. Ricardo está no celular, entre uma petição e outra, rolando o feed. Um Reels aparece: *"Seu concorrente que abriu há 6 meses já aparece antes de você no ChatGPT."* Ele para. Digita o próprio nome no ChatGPT. Confirma o que já suspeitava — não está lá.

Clica no anúncio. A landing page abre mobile. O hero fala diretamente com ele: *"Ações isoladas não constroem negócios. Ecossistemas constroem."* Desce a página. Portfólio convence — marcas reais, segmentos variados. Serviços explicam o que ele estaria comprando. CTA: **"Quero meu Diagnóstico Digital."** Clica. Formulário simples: nome, negócio, desafio atual. Submit. Recebe o número do WhatsApp. Manda uma mensagem: *"Vi o anúncio. Quero entender melhor antes de agendar."* Conversa. Agenda.

**Capabilities reveladas:** hero persuasivo mobile, portfólio navegável, formulário simples, trigger de WhatsApp pós-submit, rastreamento Meta Pixel no submit.

---

### Journey 2 — Dra. Carla: A Cética que Já Foi Enganada *(visitante Meta Ads — edge case: alta desconfiança)*

Carla já teve três agências. Vê o anúncio, clica — mas desta vez não vai preencher nada sem antes investigar. Rola a página inteira. Para no portfólio: *"Esses logos são reais? Tem pet shop aqui."* Vai para Serviços. Lê com atenção. Tenta achar o preço — não tem. *"Inteligente. Querem conversar antes."* Volta ao hero. Lê o copy três vezes. Decide que o posicionamento é diferente do que já viu.

Preenche o formulário mas coloca no campo "desafio": *"Já investi muito sem resultado. Precisa me convencer."* Recebe o WhatsApp. Não manda mensagem ainda. Dois dias depois, indica a página para uma amiga veterinária enquanto ainda pensa. Na semana seguinte, manda mensagem. Agenda.

**Capabilities reveladas:** portfólio com diversidade de segmentos, copy de serviços sem jargão, campo de texto livre no formulário, tolerância a ciclo de decisão longo (2–4 meses para PMEs é normal). O site funciona como âncora de credibilidade durante esse período — sem pressão, sem urgência artificial, sem gatilhos de escassez que quebram confiança.

---

### Journey 3 — João Dentista: A Pesquisa Silenciosa *(visitante por indicação)*

João é dentista. Um colega comenta: *"Tem uma empresa chamada Digital Dog que fez um trampo incrível no meu consultório."* João não responde na hora. À noite, abre o Google: *"Digital Dog arquitetura digital"*. Encontra o site. Chega pelo Google, não pelo anúncio.

Passa mais tempo no site do que Ricardo — ele está validando, não sendo persuadido. Foca no portfólio. Verifica se tem caso de saúde ou profissional liberal. Lê os serviços com calma. O site precisa sustentar o crédito que a indicação já deu. Preenche o formulário com contexto rico. Recebe o WhatsApp. Agenda direto — a indicação já fez o trabalho pesado.

**Capabilities reveladas:** site funciona sem depender do anúncio como contexto, SEO básico para o nome da marca, portfólio com diversidade de segmentos, GA4 distinguindo fonte orgânica de paga.

---

### Journey 4 — Johny: O Lead Chegou *(admin Digital Dog — operação)*

Johny recebe notificação de novo lead. Vê nome, negócio e o texto que a pessoa escreveu no formulário. Identifica perfil. Entra em contato via WhatsApp (número liberado pós-formulário) ou aguarda a mensagem chegar. Agenda o Diagnóstico. Após o projeto fechar, volta ao CMS do portfólio e publica o novo logo do cliente.

**Capabilities reveladas:** notificação de lead (email), dados do formulário acessíveis, CMS de portfólio simples para atualização sem dev.

**Nota operacional:** No MVP, o número do WhatsApp liberado pós-formulário é o canal de contato direto. CRM para gestão de pipeline e follow-up automatizado entra na fase Growth.

---

### Journey 5 — O Retorno: Quase Converteu, Voltou *(visitante retargeting — Meta Ads)*

Ricardo abriu a landing page na segunda. Leu até o meio, o telefone tocou, fechou. Esqueceu. Na quinta, aparece um anúncio diferente no feed — outro ângulo: *"Você sabe de onde vêm seus clientes? Descubra com o Diagnóstico."* Lembra que já tinha visto isso. Clica de novo.

Desta vez vai direto ao formulário. O site sustenta a segunda visita — não parece desatualizado, não tem pop-up de pressão, não tem contador regressivo. Preenche. Converte.

**Capabilities reveladas:** Meta Pixel rastreando visitantes que não converteram (PageView sem Submit), audiência de retargeting configurada, criativos distintos para retargeting vs aquisição fria. Site sem elementos de urgência artificial.

---

### Journey Requirements Summary

| Capability | Origem |
|---|---|
| Hero mobile persuasivo com CTA único | Journeys 1, 2, 3 |
| Portfólio navegável com diversidade de segmentos | Journeys 1, 2, 3 |
| Formulário simples com campo de texto livre | Journeys 1, 2, 3 |
| Trigger de WhatsApp pós-submit do formulário | Journeys 1, 2 |
| Meta Pixel: evento Submit + PageView sem Submit | Journeys 1, 5 |
| GA4 com rastreamento de fonte (pago vs orgânico) | Journeys 1, 3 |
| CMS de portfólio para Johny atualizar | Journey 4 |
| Notificação de lead por email | Journey 4 |
| Site sem urgência artificial ou pressão | Journeys 2, 3, 5 |
| SEO básico para nome da marca (Google direto) | Journey 3 |

## Domain-Specific Requirements

### LGPD (Lei Geral de Proteção de Dados)

O formulário de Diagnóstico coleta dados pessoais (nome, empresa, telefone, descrição do desafio). Requisitos mínimos:

- Política de Privacidade acessível no site (link no rodapé e no formulário)
- Consentimento explícito no formulário (checkbox ou linguagem clara de aceite)
- Finalidade declarada: dados usados exclusivamente para contato de agendamento do Diagnóstico
- Público inclui advogados (familiarizados com a legislação) — compliance não é opcional

## Innovation & Novel Patterns

### Áreas de Inovação Detectadas

**1. AIO/GEO como metodologia e prova de conceito simultâneas**
O site da Digital Dog é estruturado com llms.txt, Schema Markup e Entity Authority desde o dia 1 — tornando-o o primeiro case da própria metodologia que vende. Uma agência de AIO/GEO cujo site aparece no ChatGPT e no Perplexity é prova de competência antes de qualquer reunião. Diferencial emergente no Brasil com poucos competidores ativos em 2026.

**2. Fred: Agente de BI Competitivo com WebMCP**
A "Busca do Jornal" — monitoramento de concorrentes em tempo real via WebMCP (Model Context Protocol para navegação web), scraping e navegador nativo. Diferente de dashboards tradicionais: o Fred navega ativamente, entende o contexto do cliente e entrega inteligência competitiva contínua. Lock-in por inteligência acumulada — quanto mais tempo o cliente usa, mais contexto o Fred detém.

**3. Plataforma all-in-one com lock-in por valor**
Não é agrupamento de serviços — é criação de dependência saudável via tecnologia proprietária. O ecossistema cresce com o cliente: quanto mais integrado, mais caro é sair. Lock-in por valor entregue, não por contrato.

**4. Vet-OS — Sistema veterinário com IA nativa**
Gestão de clínica + consultas inteligentes + teleconsultas numa única plataforma com IA integrada desde a arquitetura. Diferente das soluções veterinárias existentes (gestão sem IA) e das soluções de IA sem operação clínica.

### Abordagem de Validação

- **AIO/GEO:** O próprio site da Digital Dog é o teste — aparece no ChatGPT/Perplexity para buscas relevantes? Sim = validado.
- **Fred/WebMCP:** Protótipo interno testado no contexto de um cliente real antes de oferecer como produto
- **Vet-OS:** Desenvolvimento paralelo ao site; primeiro cliente beta = validação do modelo

### Mitigação de Riscos de Inovação

| Risco | Mitigação |
|---|---|
| WebMCP ainda em maturação como protocolo | Manter fallback com scraping tradicional + navegador nativo; arquitetura planejada para suportá-lo nativamente quando estabilizar |
| Fred acumular contexto errado | Revisão humana dos insights antes de entregar ao cliente no início |
| Vet-OS escopo muito amplo para MVP | Desenvolvimento isolado, não bloqueia o site da Digital Dog |
| AIO/GEO: algoritmos de IA mudam | Estratégia baseada em autoridade de conteúdo real, não em hacks técnicos |

## Web App Specific Requirements

### Arquitetura Técnica

Site de captação Next.js com renderização estática (SSG) para máxima performance nos anúncios Meta. Experiência visual diferenciada com scroll animations e reveals implementados como progressive enhancement — nunca bloqueando conteúdo core.

**Rendering:** SSG via Next.js — páginas pré-renderizadas no build. Dynamic imports para bibliotecas de animação (evitar impacto no bundle inicial). Code splitting por rota para manter LCP < 2.5s.

**Animation Stack:**
- GSAP — scroll animations, reveals, transições entre seções
- Three.js — elementos visuais 3D pontuais *(somente below the fold — nunca no hero; bundle 600kb+ compete com LCP above the fold)*
- `prefers-reduced-motion` respeitado — animações desativadas para quem tem sensibilidade
- CLS = 0: nenhuma animação pode causar layout shift — impacto direto no Ad Quality Score do Meta
- Animações inicializadas via `useEffect` com cleanup — sem acesso a `window`/`document` durante SSR

**Responsive Design:**
- Mobile-first como baseline
- Breakpoints: mobile (< 768px), tablet (768–1024px), desktop (> 1024px)
- Tap targets mínimo 44x44px
- Safari iOS: prioridade máxima (tráfego Meta Ads)

### Formulário de Diagnóstico Digital

- Barra de progresso visual durante o preenchimento
- Campos: nome, negócio, segmento, desafio atual (texto livre)
- Validação em tempo real
- **Tela pós-submit:** primeira aparição do Fred — tom humano e acolhedor, revela número do WhatsApp. Momento de pico emocional onde a confiança se consolida.
- Meta Pixel: evento de conversão disparado no submit bem-sucedido

### SEO Base

Schema Markup (LocalBusiness, FAQ, Service), llms.txt para AIO/GEO, Entity Authority básica, meta tags e Open Graph.

### Considerações de Implementação

- Imagens: Next.js Image component com lazy loading nativo
- Fontes: `font-display: swap` para evitar FOUT
- Portfólio CMS: decisão de arquitetura (Sanity/Contentful vs MDX estático) — a definir na fase de Arquitetura
- Browser support: Chrome, Safari, Firefox, Edge — últimas 2 versões; sem suporte a browsers legados

## Project Scoping & Phased Development

### MVP Strategy

**Abordagem:** Revenue MVP — site de captação como motor de vendas
**Equipe:** Johny (dev + SEO + estratégia) + designer parceiro + Joel (automações quando necessário)
**Critério de corte:** *"Sem isso, o lead não chega ou não converte?"* Se sim → MVP. Se não → Growth ou Vision.

**Jornadas suportadas pelo MVP:** Journeys 1, 2, 3, 4 e 5

| Feature MVP | Justificativa |
|---|---|
| Homepage/LP — hero, posicionamento, CTA | Destino do anúncio. Sem isso, nada funciona |
| Animações GSAP (scroll reveals, hero) | Diferenciação visual que justifica o clique |
| Serviços — Arquitetura de Marca + Tecnológica | O cliente precisa entender o que está comprando |
| Portfólio com CMS simples | Prova social; Johny atualiza sem dev |
| Formulário interativo + barra de progresso | Conversão central do MVP |
| Tela pós-submit com Fred + WhatsApp | Pico emocional — onde a confiança se consolida |
| Meta Pixel (PageView + Submit) | Base dos anúncios e retargeting |
| GA4 com rastreamento de fonte | Saber de onde vêm os leads |
| Notificação de lead por email | Johny sabe que chegou lead |
| SEO base (Schema Markup, llms.txt, AIO) | Motor orgânico começa no dia 1 |
| LGPD (Política de Privacidade + consentimento) | Compliance não opcional com público jurídico |
| Hub de Ferramentas — placeholder/teaser | Sinaliza futuro sem entregar o que não existe |

**Fora do MVP (confirmado):** Three.js (opcional se não afetar LCP), Fred funcional, blog, CRM, Calendly.

### Phase 2 — Growth (Pós-MVP)

Hub de Ferramentas com login, Fred como copiloto (dashboards + insights IA), "Busca do Jornal" (WebMCP + scraping), CRM de follow-up, blog/SEO de longo prazo.

### Phase 3 — Vision (Expansão)

Fred copiloto completo com contexto acumulado + WebMCP como protocolo nativo, Vet-OS, plataforma all-in-one, expansão para outros verticais regulamentados.

### Riscos do Projeto

| Risco | Tipo | Mitigação |
|---|---|---|
| GSAP + Three.js afeta LCP | Técnico | Three.js somente below the fold; LCP testado antes de lançar |
| Ciclo de decisão longo (2–4 meses) | Mercado | Retargeting + site como âncora de credibilidade |
| Portfólio vazio no lançamento | Mercado | Priorizar CMS para publicar logos existentes antes de lançar |
| Escopo solo dev — tempo limitado | Recurso | MVP lean; animações são enhancement, não bloqueadores |
| WebMCP (W3C) ainda em proposta | Protocolo | Monitorar spec; arquitetura planejada para suportá-lo quando estabilizar |

## Functional Requirements

### Apresentação e Posicionamento

- FR1: Visitante pode ver o posicionamento e a proposta de valor da Digital Dog na primeira dobra da página sem precisar rolar
- FR2: Visitante pode navegar pelo site em dispositivo móvel com experiência equivalente e funcional à versão desktop
- FR3: Visitante pode ver animações de scroll que enriquecem a experiência visual sem bloquear o acesso ao conteúdo principal
- FR4: Visitante com preferência por movimento reduzido pode navegar pelo site sem animações
- FR5: Visitante pode identificar o Fred (mascote) como elemento visual de identidade da marca

### Serviços e Conteúdo

- FR6: Visitante pode conhecer os serviços de Arquitetura de Marca oferecidos pela Digital Dog
- FR7: Visitante pode conhecer os serviços de Arquitetura Tecnológica oferecidos pela Digital Dog
- FR8: Visitante pode acessar uma seção de Hub de Ferramentas com teaser do que será disponibilizado futuramente

### Portfólio e Prova Social

- FR9: Visitante pode visualizar logos e identidades visuais de clientes no portfólio da Digital Dog
- FR10: Visitante pode perceber a diversidade de segmentos de negócio atendidos a partir do portfólio
- FR11: Johny pode adicionar, editar e remover itens do portfólio via CMS sem necessidade de código

### Captação e Conversão (Formulário)

- FR12: Visitante pode solicitar um Diagnóstico Digital preenchendo um formulário
- FR13: Visitante pode acompanhar visualmente o progresso do preenchimento do formulário
- FR14: Visitante pode inserir uma descrição livre do seu desafio atual no formulário
- FR15: Visitante recebe feedback de validação em tempo real durante o preenchimento do formulário
- FR16: Visitante vê uma confirmação personalizada com o Fred após submissão bem-sucedida do formulário
- FR17: Visitante recebe o contato de WhatsApp da Digital Dog após submissão bem-sucedida do formulário
- FR30: O sistema notifica o visitante sobre falha no envio do formulário e permite nova tentativa sem perda dos dados

### Comunicação Pós-Conversão

- FR18: Johny recebe notificação por email com os dados do lead a cada nova submissão do formulário

### Analytics e Rastreamento

- FR19: O sistema registra a visualização de página (PageView) no Meta Pixel para todos os visitantes
- FR20: O sistema registra a conversão (Submit) no Meta Pixel quando o formulário é submetido com sucesso
- FR21: O sistema identifica visitantes que visualizaram o site sem converter, para fins de retargeting via Meta Ads
- FR22: O sistema rastreia a origem do visitante (tráfego pago vs orgânico) via GA4
- FR23: O sistema registra a submissão do formulário como evento de conversão no GA4

### SEO e Visibilidade Orgânica

- FR24: O site declara informações estruturadas da Digital Dog via Schema Markup (LocalBusiness, FAQ, Service)
- FR25: O site disponibiliza um arquivo llms.txt para indexação e citação por IAs generativas
- FR26: O site tem metadados e Open Graph configurados para SEO e compartilhamento em redes sociais

### Compliance e Privacidade (LGPD)

- FR27: Visitante pode acessar a Política de Privacidade da Digital Dog a partir do rodapé e do formulário
- FR28: Visitante fornece consentimento explícito para coleta de dados ao submeter o formulário
- FR29: O sistema coleta dados pessoais exclusivamente para a finalidade declarada de agendamento do Diagnóstico Digital

### Acessibilidade

- FR31: O site é navegável via teclado e compatível com leitores de tela para as capacidades core

## Non-Functional Requirements

### Performance

- **NFR-P1:** O site atinge Core Web Vitals aprovados em dispositivos móveis — LCP < 2.5s, CLS < 0.1, INP < 200ms — para não penalizar o Ad Quality Score do Meta Ads
- **NFR-P2:** O PageSpeed Mobile é ≥ 90 pontos no Google PageSpeed Insights no momento do lançamento
- **NFR-P3:** O bundle JavaScript inicial não ultrapassa 200kb gzipped para garantir carregamento aceitável em conexão 4G

### Segurança

- **NFR-S1:** Todas as transmissões de dados entre visitante e servidor são protegidas via HTTPS/TLS
- **NFR-S2:** Os dados coletados pelo formulário são transmitidos de forma segura, sem exposição em logs públicos ou respostas retornadas ao cliente
- **NFR-S3:** O site declara os cookies e dados de tracking utilizados (Meta Pixel, GA4) em linguagem acessível na Política de Privacidade

### Disponibilidade

- **NFR-AV1:** O site mantém disponibilidade mínima de 99,9% de uptime, especialmente durante períodos com campanha ativa no Meta Ads

### Acessibilidade

- **NFR-A1:** O site atinge conformidade WCAG 2.1 nível AA para as capacidades core: navegação, leitura de conteúdo e submissão do formulário
- **NFR-A2:** O contraste de cores em textos de conteúdo principal é de no mínimo 4,5:1 para garantir legibilidade

### Confiabilidade das Integrações

- **NFR-I1:** O Meta Pixel dispara eventos de PageView e Submit em 100% das ocorrências relevantes, sem perda silenciosa de eventos
- **NFR-I2:** O GA4 registra corretamente a fonte de origem do visitante (parâmetros UTM) para todos os visitantes rastreáveis
- **NFR-I3:** A notificação de lead por email é entregue dentro de 5 minutos após cada submissão bem-sucedida do formulário
- **NFR-I4:** O CMS do portfólio reflete mudanças publicadas por Johny no site em menos de 5 minutos após a publicação

---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
status: complete
completedAt: '2026-03-12'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# digital-dog - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for digital-dog, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitante pode ver o posicionamento e a proposta de valor da Digital Dog na primeira dobra da página sem precisar rolar
FR2: Visitante pode navegar pelo site em dispositivo móvel com experiência equivalente e funcional à versão desktop
FR3: Visitante pode ver animações de scroll que enriquecem a experiência visual sem bloquear o acesso ao conteúdo principal
FR4: Visitante com preferência por movimento reduzido pode navegar pelo site sem animações
FR5: Visitante pode identificar o Fred (mascote) como elemento visual de identidade da marca
FR6: Visitante pode conhecer os serviços de Arquitetura de Marca oferecidos pela Digital Dog
FR7: Visitante pode conhecer os serviços de Arquitetura Tecnológica oferecidos pela Digital Dog
FR8: Visitante pode acessar uma seção de Hub de Ferramentas com teaser do que será disponibilizado futuramente
FR9: Visitante pode visualizar logos e identidades visuais de clientes no portfólio da Digital Dog
FR10: Visitante pode perceber a diversidade de segmentos de negócio atendidos a partir do portfólio
FR11: Johny pode adicionar, editar e remover itens do portfólio via CMS sem necessidade de código
FR12: Visitante pode solicitar um Diagnóstico Digital preenchendo um formulário
FR13: Visitante pode acompanhar visualmente o progresso do preenchimento do formulário
FR14: Visitante pode inserir uma descrição livre do seu desafio atual no formulário
FR15: Visitante recebe feedback de validação em tempo real durante o preenchimento do formulário
FR16: Visitante vê uma confirmação personalizada com o Fred após submissão bem-sucedida do formulário
FR17: Visitante recebe o contato de WhatsApp da Digital Dog após submissão bem-sucedida do formulário
FR18: Johny recebe notificação por email com os dados do lead a cada nova submissão do formulário
FR19: O sistema registra a visualização de página (PageView) no Meta Pixel para todos os visitantes
FR20: O sistema registra a conversão (Submit) no Meta Pixel quando o formulário é submetido com sucesso
FR21: O sistema identifica visitantes que visualizaram o site sem converter, para fins de retargeting via Meta Ads
FR22: O sistema rastreia a origem do visitante (tráfego pago vs orgânico) via GA4
FR23: O sistema registra a submissão do formulário como evento de conversão no GA4
FR24: O site declara informações estruturadas da Digital Dog via Schema Markup (LocalBusiness, FAQ, Service)
FR25: O site disponibiliza um arquivo llms.txt para indexação e citação por IAs generativas
FR26: O site tem metadados e Open Graph configurados para SEO e compartilhamento em redes sociais
FR27: Visitante pode acessar a Política de Privacidade da Digital Dog a partir do rodapé e do formulário
FR28: Visitante fornece consentimento explícito para coleta de dados ao submeter o formulário
FR29: O sistema coleta dados pessoais exclusivamente para a finalidade declarada de agendamento do Diagnóstico Digital
FR30: O sistema notifica o visitante sobre falha no envio do formulário e permite nova tentativa sem perda dos dados
FR31: O site é navegável via teclado e compatível com leitores de tela para as capacidades core

### NonFunctional Requirements

NFR-P1: O site atinge Core Web Vitals aprovados em dispositivos móveis — LCP < 2.5s, CLS < 0.1, INP < 200ms — para não penalizar o Ad Quality Score do Meta Ads
NFR-P2: O PageSpeed Mobile é ≥ 90 pontos no Google PageSpeed Insights no momento do lançamento
NFR-P3: O bundle JavaScript inicial não ultrapassa 200kb gzipped para garantir carregamento aceitável em conexão 4G
NFR-S1: Todas as transmissões de dados entre visitante e servidor são protegidas via HTTPS/TLS
NFR-S2: Os dados coletados pelo formulário são transmitidos de forma segura, sem exposição em logs públicos ou respostas retornadas ao cliente
NFR-S3: O site declara os cookies e dados de tracking utilizados (Meta Pixel, GA4) em linguagem acessível na Política de Privacidade
NFR-AV1: O site mantém disponibilidade mínima de 99,9% de uptime, especialmente durante períodos com campanha ativa no Meta Ads
NFR-A1: O site atinge conformidade WCAG 2.1 nível AA para as capacidades core: navegação, leitura de conteúdo e submissão do formulário
NFR-A2: O contraste de cores em textos de conteúdo principal é de no mínimo 4,5:1 para garantir legibilidade
NFR-I1: O Meta Pixel dispara eventos de PageView e Submit em 100% das ocorrências relevantes, sem perda silenciosa de eventos
NFR-I2: O GA4 registra corretamente a fonte de origem do visitante (parâmetros UTM) para todos os visitantes rastreáveis
NFR-I3: A notificação de lead por email é entregue dentro de 5 minutos após cada submissão bem-sucedida do formulário
NFR-I4: O CMS do portfólio reflete mudanças publicadas por Johny no site em menos de 5 minutos após a publicação

### Additional Requirements

#### Da Arquitetura

- **Fixes obrigatórios (antes de qualquer feature):** remover `output: 'standalone'` do next.config.js; remover Prisma e framer-motion do package.json; remover scripts `db:generate`, `db:migrate`, `db:studio`; atualizar metadata do layout.tsx (título/descrição referenciando veterinária → Arquitetura Digital)
- **ConsentProvider (LGPD — PRIORIDADE 1):** React Context global em `app/layout.tsx` controlando carregamento condicional de Meta Pixel e GA4; banner discreto no rodapé/bottom bar — nunca bloqueando o hero. Pré-requisito para qualquer trabalho em analytics
- **Fred SVG inline:** SVG do Fred deve ser inline no DOM (não `<img>`) para GSAP drawSVG funcionar no pós-submit
- **GSAP only (remover Framer Motion):** GSAP cobre todos os casos — ScrollTrigger para scroll reveals, drawSVG para Fred, timelines para hero entrance e transições de form. `prefers-reduced-motion` verificado via `matchMedia` antes de qualquer animação
- **React Hook Form + Zod:** Schemas Zod por step em `features/diagnostico/schemas/`. sessionStorage com try/catch + fallback in-memory (Safari modo privado)
- **MDX estático + portfolioItems.ts:** Portfolio sem CMS externo; Johny edita `features/portfolio/data/portfolioItems.ts` + git push → deploy automático Vercel (~2 min). Atende NFR-I4.
- **Resend para email de lead:** API Route `app/api/diagnostico/submit/route.ts`. Free tier 3.000/mês. Infraestrutura obrigatória: SPF + DKIM no domínio remetente antes do lançamento
- **SSG como padrão:** `generateStaticParams` + `export const dynamic = 'force-static'`; API Routes serverless apenas para form submit e email
- **Regras SSR obrigatórias:** Todo componente com GSAP, window, document ou sessionStorage deve ter `'use client'`; acessos a browser APIs apenas dentro de `useEffect` ou com guard `typeof window !== 'undefined'`
- **Estrutura feature-based:** `features/{feature}/components/`, `features/shared/`, `app/api/`, `public/`
- **Environment variables:** Server-only: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NOTIFICATION_EMAIL`; Client-safe: `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_WHATSAPP_MESSAGE`
- **Three.js removido do MVP:** Remover `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` e deletar `app/playground/`
- **useFormPersistence hook:** `features/diagnostico/hooks/useFormPersistence.ts` — único ponto de contato com sessionStorage no feature de diagnóstico
- **Service layer:** `features/diagnostico/services/submitDiagnostico.ts` — testável com mock, extensível para DB futuro

#### Da UX

- **Modal multi-step** (não navegação de página): formulário abre como overlay modal sobre a homepage; sem roteamento
- **Step 1 = seleção visual (cards):** sem digitação obrigatória no primeiro step — tap em card de segmento. Máximo 3 campos por step
- **Progressive disclosure:** cada step do formulário revela apenas o necessário; WhatsApp pedido apenas no step 4
- **WhatsApp float sempre visível:** botão flutuante rastreado por UTM como canal secundário de conversão
- **Navegação progressiva (nav):** logo completo em repouso → ao scroll ~80px, texto do logo sai suavemente, só Fred permanece; menu mobile: overlay full-screen, sem slide lateral
- **Remover AnimatedGradient com orbs:** substituir por grid técnico SVG sutil
- **Seção How It Works como diagrama de ecossistema:** nós conectados por linhas SVG animadas (Marca ↔ Site ↔ SEO ↔ AIO ↔ Automações) — não timeline linear numerada
- **Fred posicionado na nav header** (não centralizado e grande no hero)
- **Consentimento LGPD:** banner no rodapé/bottom bar — nunca bloqueando o hero acima da dobra
- **Estética dark tech editorial:** sem glow pulsante em múltiplos elementos; botões com border 1px solid, fill suave no hover; divisórias de seção com linha 1px rgba
- **Custom cursor:** progressive enhancement apenas para dispositivos pointer (mouse); inativo em touch
- **Ausência como design:** sem urgência artificial, sem pop-ups de pressão, sem contadores regressivos
- **Tom pós-submit:** texto em primeira pessoa humanizado — *"Recebi. Vou estudar o seu negócio antes de ligar."* — nunca linguagem de sistema

### FR Coverage Map

| FR | Épico | Descrição |
|---|---|---|
| FR1 | Epic 2 | Hero above the fold |
| FR2 | Epic 1 | Estrutura de navegação mobile |
| FR3 | Epic 2 | Scroll animations GSAP |
| FR4 | Epic 2 | `prefers-reduced-motion` |
| FR5 | Epic 1 + 2 | Fred na nav (E1) e hero (E2) |
| FR6 | Epic 2 | Arquitetura de Marca |
| FR7 | Epic 2 | Arquitetura Tecnológica |
| FR8 | Epic 2 | Hub de Ferramentas placeholder |
| FR9 | Epic 2 | Galeria de portfólio |
| FR10 | Epic 2 | Diversidade de segmentos |
| FR11 | Epic 2 | CMS portfólio para Johny |
| FR12 | Epic 3 | Formulário multi-step |
| FR13 | Epic 3 | Barra de progresso |
| FR14 | Epic 3 | Campo de texto livre (Step 2 do form) |
| FR15 | Epic 3 | Validação em tempo real |
| FR16 | Epic 3 | Fred animado pós-submit |
| FR17 | Epic 3 | WhatsApp revelado pós-submit |
| FR18 | Epic 3 | Email de lead para Johny |
| FR19 | Epic 4 | Meta Pixel PageView |
| FR20 | Epic 4 | Meta Pixel Submit |
| FR21 | Epic 4 | Retargeting Meta Ads |
| FR22 | Epic 4 | GA4 UTM source tracking |
| FR23 | Epic 4 | GA4 conversão form |
| FR24 | Epic 5 | Schema Markup |
| FR25 | Epic 5 | llms.txt |
| FR26 | Epic 1 | Meta tags e Open Graph |
| FR27 | Epic 1+3+5 | Rodapé (E1), form (E3), página completa (E5) |
| FR28 | Epic 3 | Consentimento explícito no form |
| FR29 | Epic 3 | Finalidade declarada dos dados |
| FR30 | Epic 3 | Erro sem perda de dados |
| FR31 | Epic 5 | Acessibilidade teclado/screen reader |

## Epic List

### Epic 1: Fundação — Site Funcional com Identidade Digital Dog
Visitante acessa um site rápido com a identidade visual correta da Digital Dog, navegação global (Header com Fred + Footer com link de Privacidade), compliance LGPD básico (ConsentProvider) e base técnica limpa — pré-requisito para todas as features subsequentes.
**FRs cobertos:** FR2, FR5 (nav), FR26, FR27 (rodapé)
**Arquitetura:** correções obrigatórias (next.config, Prisma/framer-motion/Three.js removidos, metadata atualizada), ConsentProvider, Header, Footer, WhatsApp Float, layout global

### Epic 2: Homepage — Jornada Completa de Posicionamento
Visitante chegando via Meta Ads pode experienciar toda a homepage da Digital Dog — hero com proposta de valor imediata, serviços detalhados, portfólio navegável com diversidade de segmentos, diagrama de ecossistema (How It Works), Hub placeholder — chegando naturalmente à decisão de solicitar o Diagnóstico. Johny pode atualizar o portfólio sem código.
**FRs cobertos:** FR1, FR3, FR4, FR5 (hero), FR6, FR7, FR8, FR9, FR10, FR11
**NFRs endereçados:** NFR-P1, NFR-P2, NFR-P3, NFR-I4

### Epic 3: Captação — Formulário de Diagnóstico Digital
Visitante pode solicitar o Diagnóstico Digital via formulário multi-step conversacional (4 steps, progressive disclosure, barra de progresso), viver o pico emocional com Fred animado drawSVG pós-submit, receber o WhatsApp da Digital Dog, e Johny recebe notificação por email imediatamente. Erros não causam perda de dados.
**FRs cobertos:** FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR27 (form), FR28, FR29, FR30
**NFRs endereçados:** NFR-S2, NFR-I3

### Epic 4: Analytics e Rastreamento de Campanhas
Digital Dog pode medir com precisão o desempenho das campanhas Meta Ads — PageView em 100% dos visitantes, evento Submit na conversão, identificação de visitantes para retargeting — e rastrear origem de leads (pago vs orgânico) via GA4 com UTM.
**FRs cobertos:** FR19, FR20, FR21, FR22, FR23
**NFRs endereçados:** NFR-I1, NFR-I2

### Epic 5: SEO, AIO/GEO, Acessibilidade e Prontidão para Lançamento
O site aparece em buscas pelo nome da marca, é indexado por IAs generativas (ChatGPT, Perplexity) via llms.txt, declara informações estruturadas via Schema Markup, é acessível via teclado e leitor de tela, e tem a Política de Privacidade completa para compliance LGPD.
**FRs cobertos:** FR24, FR25, FR27 (página completa), FR31
**NFRs endereçados:** NFR-A1, NFR-A2, NFR-P1, NFR-P2, NFR-P3 (auditoria final), NFR-S3

---

## Epic 1: Fundação — Site Funcional com Identidade Digital Dog

Visitante acessa um site rápido com a identidade visual correta da Digital Dog, navegação global (Header com Fred + Footer com link de Privacidade), compliance LGPD básico (ConsentProvider) e base técnica limpa — pré-requisito para todas as features subsequentes.

### Story 1.1: Setup Técnico — Limpeza da Base e Novas Dependências

Como desenvolvedor,
quero uma base Next.js limpa com dependências legadas removidas e novas adicionadas,
para que o desenvolvimento prossiga sem conflitos ou código morto.

**Acceptance Criteria:**

**Given** o repositório com a base brownfield existente
**When** o setup técnico é aplicado
**Then** `output: 'standalone'` foi removido do `next.config.js`
**And** `prisma`, `@prisma/client`, `framer-motion`, `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` foram removidos do `package.json`
**And** scripts `db:generate`, `db:migrate`, `db:studio` foram removidos do `package.json`
**And** `react-hook-form`, `zod`, `@hookform/resolvers`, `resend` foram adicionados ao `package.json`
**And** `app/playground/` foi deletado
**And** `npm run build` executa sem erros ou warnings críticos
**And** a metadata em `app/layout.tsx` foi atualizada: title "Digital Dog | Arquitetura Digital" e description refletindo o posicionamento de Arquitetura Digital (não mais referências a veterinária)

### Story 1.2: ConsentProvider — Gerenciamento de Consentimento LGPD

Como visitante,
quero ser informado sobre coleta de dados de forma não intrusiva,
para que possa decidir sobre minha privacidade sem ter a experiência bloqueada.

**Acceptance Criteria:**

**Given** o visitante acessa qualquer página pela primeira vez sem consentimento prévio registrado no localStorage
**When** a página carrega
**Then** um banner discreto aparece no rodapé/bottom bar informando sobre cookies (Meta Pixel, GA4)
**And** o banner NUNCA bloqueia ou sobrepõe o conteúdo above the fold
**And** os scripts do Meta Pixel e GA4 NÃO estão presentes no DOM antes do consentimento

**Given** o visitante clica em "Aceitar" no banner
**When** o consentimento é registrado
**Then** a escolha é persistida em `localStorage` com a chave `dd_consent`
**And** o banner desaparece e não volta a aparecer em visitas futuras ao mesmo dispositivo
**And** Meta Pixel e GA4 podem ser carregados condicionalmente a partir deste momento

**Given** o visitante retorna ao site com consentimento já registrado
**When** a página carrega
**Then** o banner NÃO é exibido

**Given** o visitante usa teclado ou leitor de tela
**When** o banner é exibido
**Then** o banner é totalmente acessível via Tab/Enter
**And** o botão de aceite tem label ARIA adequado

### Story 1.3: Header — Navegação Global com Fred

Como visitante,
quero um header claro com a identidade da Digital Dog,
para que possa me orientar e navegar facilmente em qualquer dispositivo. (FR2, FR5)

**Acceptance Criteria:**

**Given** o visitante acessa o site em desktop (≥ 768px)
**When** a página carrega (scroll = 0)
**Then** o header exibe logo completo: SVG do Fred inline + wordmark "Digital Dog | Arquitetura Digital"
**And** os links de navegação são visíveis: Serviços, Portfólio, Diagnóstico
**And** um CTA "Solicitar Diagnóstico" está visível no header

**Given** o visitante faz scroll de ~80px para baixo em desktop
**When** o header fica fixo no topo
**Then** o wordmark some suavemente com transição CSS, permanecendo apenas o SVG do Fred
**And** o header mantém `backdrop-blur-sm` e borda inferior sutil `rgba(255,255,255,0.06)`

**Given** o visitante acessa em mobile (< 768px)
**When** a página carrega
**Then** o header exibe apenas o SVG do Fred e o ícone hambúrguer

**Given** o visitante toca no ícone hambúrguer em mobile
**When** o menu abre
**Then** um overlay full-screen é exibido com links grandes e fundo near-black com blur
**And** o overlay fecha ao tocar em qualquer link ou no botão de fechar (×)

**Given** o visitante navega via teclado
**When** o foco está no header
**Then** todos os links e o hambúrguer são acessíveis via Tab/Enter com foco visível

### Story 1.4: Footer — Rodapé com Link de Política de Privacidade

Como visitante,
quero um rodapé com informações essenciais e links,
para que possa encontrar a Política de Privacidade facilmente. (FR27)

**Acceptance Criteria:**

**Given** o visitante rola até o final de qualquer página
**When** o footer é exibido
**Then** o logo da Digital Dog, copyright e o link "Política de Privacidade" estão visíveis
**And** o link "Política de Privacidade" está presente e clicável (pode apontar para `#` ou `/privacidade` como placeholder nesta story — página completa no Epic 5)
**And** o footer é responsivo e funcional em mobile (< 768px) e desktop

**Given** o visitante navega via teclado
**When** o foco chega ao footer
**Then** todos os links são acessíveis via Tab/Enter com foco visível

### Story 1.5: WhatsApp Float — Botão de Contato Global

Como visitante,
quero um botão flutuante de WhatsApp sempre visível,
para que possa iniciar contato direto com a Digital Dog a qualquer momento.

**Acceptance Criteria:**

**Given** o visitante está em qualquer página do site
**When** a página carrega
**Then** o botão flutuante do WhatsApp está visível no canto inferior direito
**And** o tap target é de no mínimo 44×44px em mobile
**And** o botão não obscurece conteúdo crítico como CTAs principais ou o ConsentProvider banner

**Given** o visitante toca/clica no botão
**When** a ação é executada
**Then** o WhatsApp abre (web ou app nativo) com `NEXT_PUBLIC_WHATSAPP_NUMBER` e mensagem inicial pré-preenchida via `NEXT_PUBLIC_WHATSAPP_MESSAGE`
**And** o link usa o formato `https://wa.me/{number}?text={message}` com encoding correto

**Given** as variáveis de ambiente `NEXT_PUBLIC_WHATSAPP_NUMBER` e `NEXT_PUBLIC_WHATSAPP_MESSAGE` não estão configuradas
**When** o componente renderiza
**Then** o botão não é exibido (falha silenciosa sem erro no console)

### Story 1.6: Metadados Globais e Open Graph

Como a Digital Dog,
quero que todas as páginas exibam metadados corretos ao serem compartilhadas ou encontradas via busca,
para que a marca seja representada corretamente em redes sociais e resultados de pesquisa. (FR26)

**Acceptance Criteria:**

**Given** qualquer página do site é compartilhada em rede social (Facebook, WhatsApp, LinkedIn)
**When** o link é visualizado com preview
**Then** o título é "Digital Dog | Arquitetura Digital"
**And** a description reflete o posicionamento de Arquitetura Digital (não veterinária)
**And** uma imagem OG válida (≥ 1200×630px) em `public/og-image.png` é referenciada e exibida

**Given** o site é indexado por mecanismos de busca
**When** a página aparece nos resultados
**Then** `<title>` é "Digital Dog | Arquitetura Digital"
**And** `<meta name="description">` é relevante e tem entre 120–160 caracteres
**And** `<link rel="canonical">` aponta para a URL canônica da página
**And** `<meta name="robots" content="index, follow">` está presente

**Given** o desenvolvedor inspeciona o `<head>` da página
**When** verifica os meta tags
**Then** `og:title`, `og:description`, `og:image`, `og:url`, `og:type` estão presentes e corretos
**And** `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` estão presentes

---

## Epic 2: Homepage — Jornada Completa de Posicionamento

Visitante chegando via Meta Ads pode experienciar toda a homepage da Digital Dog — hero com proposta de valor imediata, serviços detalhados, portfólio navegável com diversidade de segmentos, diagrama de ecossistema (How It Works), Hub placeholder — chegando naturalmente à decisão de solicitar o Diagnóstico. Johny pode atualizar o portfólio sem código.

### Story 2.1: Hero Section — Proposta de Valor Acima da Dobra

Como visitante,
quero ver imediatamente o posicionamento e a proposta de valor da Digital Dog ao abrir o site,
para que entenda em segundos o que a empresa oferece e tenha um caminho claro de ação. (FR1, FR5)

**Acceptance Criteria:**

**Given** o visitante acessa a homepage em qualquer dispositivo
**When** a página carrega (sem scroll)
**Then** a headline principal está visível acima da dobra: "Ações isoladas não constroem negócios. Ecossistemas constroem."
**And** o subheadline "Marca, tecnologia e presença — num único ecossistema, com um único ponto de inteligência." está visível
**And** o CTA primário "Quero meu Diagnóstico Digital →" está visível e clicável
**And** o CTA secundário "Ver como funciona" está visível e ancora à seção How It Works
**And** o SVG do Fred está visível como elemento de identidade da marca (no header, conforme Story 1.3)

**Given** o visitante acessa em mobile (< 768px)
**When** a página carrega
**Then** toda a hierarquia de conteúdo (headline + subheadline + CTAs) está legível sem scroll horizontal
**And** o tap target dos CTAs é ≥ 44×44px

**Given** o visitante tem `prefers-reduced-motion: reduce` ativado
**When** a página carrega
**Then** a animação de entrada do hero (GSAP timeline) é desativada
**And** todo o conteúdo permanece visível e acessível estaticamente (FR4)

**Given** a página carrega com JavaScript habilitado
**When** a animação de entrada do hero é executada (GSAP)
**Then** headline, subheadline e CTAs aparecem com stagger suave
**And** o background exibe grid técnico SVG sutil (não AnimatedGradient com orbs)
**And** CLS = 0: nenhum elemento causa layout shift durante a animação

### Story 2.2: Narrativa de Posicionamento — Pain Points e Quatro Pilares

Como visitante,
quero entender o problema que a Digital Dog resolve e como sua abordagem é diferente,
para que consiga avaliar se a proposta faz sentido para o meu negócio. (FR6, FR7)

**Acceptance Criteria:**

**Given** o visitante rola além do hero
**When** chega à seção de Pain Points
**Then** a narrativa do problema de mercado fragmentado está visível (ex: "Sites sem estratégia. Posts sem marca. Anúncios sem base.")
**And** o contraste entre o modelo fragmentado e o ecossistema Digital Dog está claro
**And** a seção é legível em mobile com hierarquia tipográfica preservada

**Given** o visitante continua rolando
**When** chega à seção dos Quatro Pilares (ou proposta de valor central)
**Then** os dois pilares principais estão apresentados: Arquitetura de Marca e Arquitetura Tecnológica (FR6, FR7)
**And** cada pilar tem título, descrição concisa e diferencial
**And** um link/CTA direciona para a seção de Serviços detalhados

**Given** o visitante tem JavaScript habilitado e `prefers-reduced-motion` não ativo
**When** rola até cada elemento da seção
**Then** os elementos revelam com scroll animation (GSAP ScrollTrigger) sem causar CLS (FR3, FR4)

### Story 2.3: Metodologia — How It Works — Diagrama de Ecossistema

Como visitante,
quero entender como o ecossistema da Digital Dog funciona na prática,
para que visualize o sistema completo antes de solicitar o Diagnóstico. (FR3, FR4)

**Acceptance Criteria:**

**Given** o visitante rola até a seção How It Works
**When** a seção entra no viewport
**Then** um diagrama de ecossistema é exibido com nós conectados: Marca ↔ Site ↔ SEO ↔ AIO ↔ Automações
**And** as linhas conectoras entre os nós são SVG animadas (stroke-dasharray + stroke-dashoffset via GSAP ScrollTrigger)
**And** o diagrama NÃO é uma timeline linear numerada

**Given** o visitante tem `prefers-reduced-motion: reduce` ativado
**When** a seção é exibida
**Then** o diagrama é mostrado estático, sem animação de linhas
**And** todos os nós e labels são legíveis (FR4)

**Given** o visitante acessa em mobile
**When** visualiza o diagrama
**Then** o diagrama é responsivo e legível sem overflow horizontal
**And** os nós têm tap target ≥ 44×44px se interativos

**Given** o CTA secundário "Ver como funciona" do hero é clicado
**When** o scroll ancora
**Then** o viewport desloca suavemente até a seção How It Works

### Story 2.4: Prova Social — Cases e Depoimentos

Como visitante,
quero ver evidências reais de resultados da Digital Dog,
para que possa avaliar a credibilidade da empresa antes de solicitar o Diagnóstico.

**Acceptance Criteria:**

**Given** o visitante rola até a seção de Prova Social
**When** a seção é exibida
**Then** ao menos 2 cases ou depoimentos de clientes reais são apresentados
**And** cada item exibe: nome do cliente/negócio, segmento e resultado ou declaração
**And** a seção é visualmente coerente com a estética dark tech editorial

**Given** o visitante acessa em mobile
**When** visualiza os cards de prova social
**Then** os cards são legíveis e não causam overflow horizontal
**And** se houver scroll horizontal em carousel, o comportamento é suave e com snap

**Given** o visitante tem JavaScript habilitado e `prefers-reduced-motion` não ativo
**When** rola até a seção
**Then** os elementos revelam com GSAP ScrollTrigger sem causar CLS (FR3)

**Given** não há cases ou depoimentos disponíveis no lançamento
**When** a seção é exibida
**Then** um placeholder visual é exibido como fallback sem quebrar o layout

### Story 2.5: Portfólio — Galeria de Clientes com CMS via Arquivo

Como visitante,
quero visualizar o portfólio de clientes da Digital Dog com diversidade de segmentos,
para que possa avaliar a abrangência e qualidade do trabalho. (FR9, FR10)

Como Johny,
quero adicionar e remover itens do portfólio editando um arquivo TypeScript,
para que possa manter o portfólio atualizado sem precisar de deploy manual especializado. (FR11)

**Acceptance Criteria:**

**Given** o visitante rola até a seção Portfólio
**When** a seção é exibida
**Then** logos e/ou identidades visuais de clientes são visíveis em grade ou carrossel
**And** ao menos 3 segmentos de negócio diferentes são representados (FR10)

**Given** Johny adiciona um novo item em `features/portfolio/data/portfolioItems.ts` e faz push
**When** o Vercel completa o redeploy (≤ 2 min)
**Then** o novo item aparece na galeria do portfólio (NFR-I4)

**Given** Johny remove um item do `portfolioItems.ts` e faz push
**When** o redeploy é concluído
**Then** o item removido não aparece mais na galeria

**Given** o visitante acessa em mobile
**When** visualiza o portfólio
**Then** a galeria é responsiva, com no mínimo 2 colunas em mobile
**And** as imagens carregam com Next.js Image component (lazy loading nativo)

**Given** uma imagem de portfólio falha ao carregar
**When** o componente renderiza
**Then** um placeholder visual é exibido sem quebrar o layout

### Story 2.6: Serviços, FAQ e Hub de Ferramentas

Como visitante,
quero conhecer em detalhe os serviços oferecidos e tirar dúvidas comuns,
para que possa tomar uma decisão informada sobre solicitar o Diagnóstico. (FR6, FR7, FR8)

**Acceptance Criteria:**

**Given** o visitante rola até a seção de Serviços
**When** a seção é exibida
**Then** Arquitetura de Marca está detalhada com: descrição, entregáveis e diferencial (FR6)
**And** Arquitetura Tecnológica está detalhada com: descrição, entregáveis e diferencial (FR7)
**And** cada serviço tem um CTA ou link para o formulário de Diagnóstico

**Given** o visitante acessa a seção FAQ
**When** clica em uma pergunta
**Then** a resposta expande com animação suave (accordion)
**And** ao expandir uma nova resposta, a anterior pode fechar (comportamento configurável)
**And** o FAQ é acessível via teclado (Tab para navegar, Enter/Space para expandir)

**Given** o visitante rola até a seção Hub de Ferramentas
**When** a seção é exibida
**Then** um teaser/placeholder é exibido sinalizando features futuras (FR8)
**And** o conteúdo comunica que o Hub está chegando, sem prometer funcionalidades não existentes
**And** o Fred pode aparecer como personagem associado ao Hub

**Given** o visitante acessa em mobile
**When** visualiza Serviços, FAQ e Hub
**Then** todas as seções são responsivas e legíveis sem overflow

### Story 2.7: CTA Final e Montagem Completa da Homepage

Como visitante,
quero ser conduzido naturalmente a uma decisão de ação ao final da página,
para que o caminho até o Diagnóstico Digital seja claro e sem fricção.

**Acceptance Criteria:**

**Given** o visitante chega ao final da homepage
**When** a seção CTA Final é exibida
**Then** um CTA proeminente "Quero meu Diagnóstico Digital →" está visível
**And** a copy reforça o posicionamento sem urgência artificial
**And** o botão dispara o modal de diagnóstico (integração com Epic 3) ou ancora ao formulário

**Given** todas as sections do Epic 2 foram implementadas
**When** a homepage completa é visualizada
**Then** a ordem das seções é: Hero → Pain Points/Posicionamento → How It Works → Prova Social → Portfólio → Serviços/FAQ/Hub → CTA Final
**And** as transições entre seções usam divisórias `1px solid rgba(255,255,255,0.08)`
**And** `npm run build` passa sem erros com todas as sections integradas

**Given** a homepage é carregada em mobile (< 768px)
**When** o visitante navega toda a página
**Then** LCP < 2.5s, CLS = 0 na seção hero (NFR-P1)
**And** o bundle JavaScript inicial não ultrapassa 200kb gzipped (NFR-P3)

---

## Epic 3: Captação — Formulário de Diagnóstico Digital

Visitante pode solicitar o Diagnóstico Digital via formulário multi-step conversacional (4 steps, progressive disclosure, barra de progresso), viver o pico emocional com Fred animado drawSVG pós-submit, receber o WhatsApp da Digital Dog, e Johny recebe notificação por email imediatamente. Erros não causam perda de dados.

### Story 3.1: API Route de Submissão e Email de Lead

Como desenvolvedor,
quero uma API Route segura que processa o submit do formulário e envia email de notificação para Johny,
para que os dados do lead cheguem com segurança e sem exposição de informações sensíveis. (FR18)

**Acceptance Criteria:**

**Given** uma requisição POST válida chega em `app/api/diagnostico/submit/route.ts`
**When** os dados são processados
**Then** o schema Zod valida todos os campos obrigatórios (segmento, negócio, desafio, nome, email, whatsapp, consentimento)
**And** um email de notificação é enviado via Resend para `NOTIFICATION_EMAIL` com todos os dados do lead
**And** a API retorna HTTP 200 com payload mínimo `{ success: true }` — sem PII na resposta (NFR-S2)
**And** o email é entregue em até 5 minutos após a requisição (NFR-I3)

**Given** a requisição POST contém dados inválidos ou incompletos
**When** a validação Zod falha
**Then** a API retorna HTTP 400 com mensagem de erro genérica (sem expor detalhes internos)
**And** nenhum email é enviado

**Given** o serviço Resend retorna erro (timeout, rate limit, etc.)
**When** o email falha
**Then** a API retorna HTTP 500 com mensagem de erro genérica
**And** o erro é logado no servidor (não exposto ao cliente)
**And** nenhum dado do lead fica exposto em logs de resposta HTTP

**Given** as variáveis de ambiente `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NOTIFICATION_EMAIL` estão configuradas
**When** a API Route inicializa
**Then** a conexão com Resend é estabelecida sem erros de build

### Story 3.2: Modal e Formulário Multi-Step — Steps 1 e 2

Como visitante,
quero iniciar o preenchimento do formulário de Diagnóstico de forma fluida e sem fricção,
para que o processo seja fácil e eu não abandone antes de completar. (FR12, FR13, FR14)

**Acceptance Criteria:**

**Given** o visitante clica em qualquer CTA "Solicitar Diagnóstico" ou "Quero meu Diagnóstico Digital"
**When** o CTA é acionado
**Then** um modal overlay abre suavemente sobre a homepage sem navegação de página
**And** o background da página fica com overlay semi-transparente + blur

**Given** o modal está aberto no Step 1
**When** o visitante visualiza o formulário
**Then** uma barra de progresso visível indica "Step 1 de 4" (FR13)
**And** o Step 1 exibe cards visuais de segmento de negócio para seleção (ex: Veterinária, Advocacia, Consultoria, Saúde, Varejo, Outro)
**And** NENHUM campo de digitação é obrigatório no Step 1 — apenas tap em um card
**And** ao selecionar um card, o Step 2 abre automaticamente

**Given** o visitante está no Step 2
**When** o formulário é exibido
**Then** os campos "Nome do negócio" e "Desafio atual" (textarea de texto livre) são apresentados (FR14)
**And** no máximo 3 campos estão visíveis no Step 2
**And** a barra de progresso indica "Step 2 de 4"
**And** um botão "Voltar" discreto permite retornar ao Step 1 sem perder o card selecionado

**Given** o visitante preenche o Step 2 e avança, depois retorna ao site sem completar
**When** retorna e abre o modal novamente
**Then** o estado do formulário (segmento e campos preenchidos) é restaurado via `sessionStorage` com fallback in-memory para Safari modo privado

**Given** o visitante fecha o modal (tecla ESC ou clique fora)
**When** o modal fecha
**Then** o estado do formulário é preservado no `sessionStorage` para retomada posterior
**And** o foco retorna ao elemento que abriu o modal (acessibilidade)

### Story 3.3: Steps 3 e 4, Validação em Tempo Real e Consentimento LGPD

Como visitante,
quero completar o formulário com validação clara e consentir com a coleta de dados de forma informada,
para que confie no processo e finalize o envio sem dúvidas. (FR15, FR27, FR28, FR29)

**Acceptance Criteria:**

**Given** o visitante está no Step 3
**When** o formulário é exibido
**Then** os campos "Nome completo", "Email" e "Telefone/WhatsApp" são apresentados
**And** a barra de progresso indica "Step 3 de 4"
**And** o campo de email exibe validação em tempo real (formato válido) ao sair do campo (FR15)
**And** o campo de telefone exibe validação em tempo real (formato BR) ao sair do campo

**Given** o visitante está no Step 4
**When** o formulário é exibido
**Then** a barra de progresso indica "Step 4 de 4"
**And** o campo de WhatsApp é apresentado com contexto: "Para onde enviar o diagnóstico"
**And** uma checkbox de consentimento LGPD explícito está presente: "Concordo que a Digital Dog use meus dados para contato sobre o Diagnóstico Digital" (FR28)
**And** um link "Política de Privacidade" está visível e clicável dentro do texto de consentimento (FR27)
**And** a finalidade da coleta é declarada no texto do consentimento (FR29)
**And** o botão de submit só fica ativo quando todos os campos obrigatórios são válidos e o consentimento está marcado

**Given** o visitante tenta avançar com campos inválidos
**When** a validação falha
**Then** mensagens de erro específicas e claras são exibidas abaixo de cada campo inválido (FR15)
**And** o foco é movido para o primeiro campo com erro (acessibilidade)

**Given** o visitante navega o formulário via teclado
**When** usa Tab/Enter/Space
**Then** todos os steps, campos e botões são acessíveis sem mouse

### Story 3.4: Tela de Sucesso, Fred Animado e WhatsApp Revelado

Como visitante,
quero receber confirmação humanizada após o envio e ter acesso ao WhatsApp da Digital Dog,
para que o pico emocional pós-submit consolide minha confiança e eu tenha um próximo passo claro. (FR16, FR17, FR30)

**Acceptance Criteria:**

**Given** o visitante clica em "Enviar" no Step 4 com todos os campos válidos
**When** a requisição para `app/api/diagnostico/submit` é enviada
**Then** um estado de loading é exibido no botão durante o processamento

**Given** a API retorna HTTP 200 (sucesso)
**When** a resposta é recebida
**Then** a tela de sucesso substitui o formulário dentro do modal
**And** o SVG do Fred é exibido inline e animado via GSAP `drawSVG` (stroke animation sequenciada) (FR16)
**And** a copy em primeira pessoa é exibida: "Recebi. Vou estudar o seu negócio antes de ligar."
**And** o número de WhatsApp `NEXT_PUBLIC_WHATSAPP_NUMBER` com mensagem `NEXT_PUBLIC_WHATSAPP_MESSAGE` é revelado como CTA principal (FR17)
**And** `prefers-reduced-motion`: se ativo, Fred aparece estático sem animação drawSVG

**Given** a API retorna HTTP 400 ou 500 (erro)
**When** a resposta de erro é recebida
**Then** uma mensagem de erro amigável é exibida: "Algo deu errado. Tente novamente."
**And** o formulário permanece com todos os dados preenchidos para nova tentativa (FR30)
**And** o botão de submit é reativado para nova tentativa
**And** nenhum dado do formulário é perdido

---

## Epic 4: Analytics e Rastreamento de Campanhas

Digital Dog pode medir com precisão o desempenho das campanhas Meta Ads — PageView em 100% dos visitantes, evento Submit na conversão, identificação de visitantes para retargeting — e rastrear origem de leads (pago vs orgânico) via GA4 com UTM.

### Story 4.1: Meta Pixel — PageView, Conversão e Audiência de Retargeting

Como a Digital Dog,
quero que o Meta Pixel registre 100% dos pageviews e submissões do formulário,
para que possa medir o desempenho das campanhas e construir audiências de retargeting. (FR19, FR20, FR21)

**Acceptance Criteria:**

**Given** o visitante acessa qualquer página do site com consentimento LGPD registrado
**When** a página carrega
**Then** o script do Meta Pixel (ID `NEXT_PUBLIC_META_PIXEL_ID`) é carregado no DOM
**And** o evento `PageView` é disparado automaticamente (FR19)
**And** o Pixel está ausente do DOM para visitantes sem consentimento (dependência: Story 1.2)

**Given** o visitante acessa o site sem consentimento LGPD
**When** a página carrega
**Then** o script do Meta Pixel NÃO é carregado
**And** nenhum evento é disparado antes do consentimento

**Given** o visitante preenche e submete o formulário com sucesso (Story 3.4)
**When** a tela de sucesso é exibida
**Then** o evento `Lead` (ou `Submit`) é disparado no Meta Pixel com o valor correto (FR20)
**And** o evento é disparado exatamente uma vez por submissão bem-sucedida (NFR-I1)

**Given** o visitante acessa o site e visualiza a página sem submeter o formulário
**When** o Meta Pixel registra a sessão
**Then** o visitante é identificado como "viu mas não converteu" via audience pixel — sem Submit (FR21)
**And** isso permite criar audiências de retargeting no Meta Ads Manager

**Given** o desenvolvedor verifica o Meta Pixel Helper (extensão Chrome)
**When** navega pelo site e submete o formulário
**Then** PageView aparece em 100% dos carregamentos de página com consentimento (NFR-I1)
**And** o evento de conversão aparece exatamente após o submit bem-sucedido

### Story 4.2: GA4 — Rastreamento de Origem e Conversão

Como a Digital Dog,
quero que o GA4 registre a origem de cada visitante e a conversão do formulário,
para que possa distinguir leads de tráfego pago vs orgânico e medir o ROI das campanhas. (FR22, FR23)

**Acceptance Criteria:**

**Given** o visitante acessa o site via link com parâmetros UTM (ex: `?utm_source=facebook&utm_medium=cpc&utm_campaign=diagnostico`)
**When** a página carrega com consentimento LGPD registrado
**Then** o GA4 (ID `NEXT_PUBLIC_GA4_ID`) é carregado e registra a sessão
**And** os parâmetros UTM são capturados e associados à sessão no GA4 (FR22, NFR-I2)

**Given** o visitante acessa o site via busca orgânica (sem UTM)
**When** o GA4 registra a sessão
**Then** a origem é corretamente identificada como `organic` ou `direct` (FR22)

**Given** o visitante acessa o site sem consentimento LGPD
**When** a página carrega
**Then** o script do GA4 NÃO é carregado (dependência: Story 1.2)

**Given** o visitante submete o formulário com sucesso (Story 3.4)
**When** a tela de sucesso é exibida
**Then** um evento de conversão `generate_lead` (ou equivalente) é disparado no GA4 (FR23)
**And** o evento inclui a origem UTM da sessão quando disponível
**And** o evento é disparado exatamente uma vez por submissão bem-sucedida (NFR-I2)

**Given** o desenvolvedor verifica o GA4 DebugView
**When** navega pelo site com parâmetros UTM e submete o formulário
**Then** a sessão com UTM correto aparece no DebugView
**And** o evento de conversão aparece com os metadados corretos

---

## Epic 5: SEO, AIO/GEO, Acessibilidade e Prontidão para Lançamento

O site aparece em buscas pelo nome da marca, é indexado por IAs generativas (ChatGPT, Perplexity) via llms.txt, declara informações estruturadas via Schema Markup, é acessível via teclado e leitor de tela, e tem a Política de Privacidade completa para compliance LGPD.

### Story 5.1: Schema Markup — Dados Estruturados para SEO

Como a Digital Dog,
quero que o site declare informações estruturadas via Schema Markup,
para que mecanismos de busca compreendam e exibam dados ricos sobre a empresa. (FR24)

**Acceptance Criteria:**

**Given** qualquer página do site é indexada por mecanismos de busca
**When** o crawler processa o `<head>`
**Then** um JSON-LD `LocalBusiness` está presente com: nome "Digital Dog", tipo de negócio, descrição, URL e dados de contato
**And** um JSON-LD `Service` está presente para Arquitetura de Marca e Arquitetura Tecnológica
**And** um JSON-LD `FAQPage` está presente com as perguntas e respostas da seção FAQ da homepage

**Given** o desenvolvedor testa o Schema com o Google Rich Results Test
**When** a URL da homepage é testada
**Then** nenhum erro crítico é reportado
**And** os tipos `LocalBusiness`, `Service` e `FAQPage` são reconhecidos

**Given** o Schema é implementado via Next.js metadata API ou componente Script
**When** o build é executado
**Then** `npm run build` passa sem erros
**And** o JSON-LD é válido (sem campos obrigatórios ausentes por tipo)

### Story 5.2: llms.txt e AIO/GEO — Indexação por IAs Generativas

Como a Digital Dog,
quero que o site seja indexado por IAs generativas como ChatGPT e Perplexity,
para que a marca apareça em buscas por IA como prova de competência em AIO/GEO. (FR25)

**Acceptance Criteria:**

**Given** uma IA generativa (ChatGPT, Perplexity, Gemini) rastreia o site
**When** acessa `https://digitaldog.com.br/llms.txt`
**Then** o arquivo existe e retorna HTTP 200
**And** o conteúdo inclui: nome da empresa, posicionamento, serviços oferecidos, área geográfica, URL canônica e informações de contato
**And** o formato segue o padrão llms.txt (texto simples estruturado)

**Given** o arquivo `public/llms.txt` existe no repositório
**When** o build do Next.js é executado
**Then** o arquivo é servido corretamente como arquivo estático em `/llms.txt`

**Given** o arquivo llms.txt é verificado por uma ferramenta de validação AIO
**When** o conteúdo é analisado
**Then** a Digital Dog é identificável como entidade de negócio em "arquitetura digital" para o mercado brasileiro

### Story 5.3: Política de Privacidade — Página Completa LGPD

Como visitante,
quero acessar a Política de Privacidade completa da Digital Dog,
para que possa entender como meus dados são usados antes de decidir compartilhá-los. (FR27)

**Acceptance Criteria:**

**Given** o visitante clica em "Política de Privacidade" no rodapé (Story 1.4) ou no formulário (Story 3.3)
**When** o link é acionado
**Then** a página `/privacidade` é carregada com a Política de Privacidade completa

**Given** a página `/privacidade` é exibida
**When** o visitante a lê
**Then** os seguintes tópicos estão presentes:
  - Quais dados são coletados (nome, email, telefone, WhatsApp, segmento, desafio)
  - Para qual finalidade (agendamento do Diagnóstico Digital exclusivamente — FR29)
  - Quais cookies e scripts de tracking são utilizados (Meta Pixel, GA4) e por quê (NFR-S3)
  - Como o visitante pode exercer seus direitos LGPD (acesso, correção, exclusão)
  - Dados de contato para solicitações de privacidade

**Given** o visitante acessa a página `/privacidade` em mobile
**When** a página é exibida
**Then** o texto é legível com fonte ≥ 16px e espaçamento de linha adequado
**And** a página tem `<title>` e `<meta description>` próprios para SEO

**Given** o visitante navega a página via teclado
**When** usa Tab/Enter
**Then** todos os links e elementos interativos são acessíveis

### Story 5.4: Auditoria de Acessibilidade WCAG 2.1 AA

Como visitante com necessidades especiais,
quero navegar pelo site usando apenas o teclado ou leitor de tela,
para que possa acessar todas as capacidades core sem dependência do mouse. (FR31)

**Acceptance Criteria:**

**Given** o desenvolvedor executa auditoria com axe-core ou Lighthouse Accessibility
**When** a homepage e o formulário são auditados
**Then** nenhuma violação WCAG 2.1 AA crítica é reportada (NFR-A1)
**And** o score de Accessibility no Lighthouse é ≥ 90

**Given** o visitante usa apenas o teclado (Tab, Shift+Tab, Enter, Space, Escape)
**When** navega pela homepage e pelo formulário de diagnóstico
**Then** todos os links, botões, cards de seleção, accordion do FAQ e campos de formulário são alcançáveis e acionáveis
**And** o indicador de foco é visível em todos os elementos interativos (outline nunca removido sem substituto)
**And** o modal do formulário pode ser aberto e fechado via teclado (Escape para fechar)

**Given** o visitante usa leitor de tela (NVDA, VoiceOver)
**When** navega pelo site
**Then** a ordem de leitura é lógica e segue a ordem visual
**And** imagens decorativas têm `alt=""` e imagens informativas têm `alt` descritivo
**And** botões e links têm labels descritivos (não "clique aqui")
**And** o ConsentProvider banner é anunciado pelo leitor de tela

**Given** o desenvolvedor verifica o contraste de cores
**When** analisa textos de conteúdo principal com ferramenta de contraste
**Then** a relação de contraste é ≥ 4,5:1 para texto normal e ≥ 3:1 para texto grande (NFR-A2)

**Given** o site tem um link "Pular para o conteúdo principal"
**When** o primeiro Tab na página é pressionado
**Then** um skip-link visível aparece permitindo pular o header para o conteúdo principal

### Story 5.5: Auditoria de Performance e Prontidão para Lançamento

Como a Digital Dog,
quero que o site atinja os thresholds de performance definidos antes do lançamento,
para que o Ad Quality Score do Meta Ads não seja penalizado e a experiência mobile seja excelente. (NFR-P1, NFR-P2, NFR-P3)

**Acceptance Criteria:**

**Given** o desenvolvedor executa o Google PageSpeed Insights na homepage em mobile
**When** o relatório é gerado
**Then** LCP < 2,5s (NFR-P1)
**And** CLS < 0,1 (NFR-P1)
**And** INP < 200ms (NFR-P1)
**And** Score de Performance Mobile ≥ 90 (NFR-P2)

**Given** o desenvolvedor analisa o bundle JavaScript com `next build` + `@next/bundle-analyzer`
**When** o relatório de bundle é gerado
**Then** o bundle JavaScript inicial (First Load JS) é ≤ 200kb gzipped (NFR-P3)
**And** GSAP e demais bibliotecas de animação são carregados via dynamic import (não no bundle inicial)

**Given** o site está pronto para lançamento
**When** o checklist de prontidão é verificado
**Then** todos os itens abaixo estão confirmados:
  - `npm run build` passa sem erros ou warnings críticos
  - Variáveis de ambiente de produção configuradas (Vercel): `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_WHATSAPP_MESSAGE`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NOTIFICATION_EMAIL`
  - SPF e DKIM configurados no domínio remetente (Resend)
  - `robots.txt` em `public/robots.txt` com `Allow: /` e `Sitemap:` referenciado
  - `sitemap.xml` gerado ou configurado
  - HTTPS ativo no domínio de produção (NFR-S1)
  - Meta Pixel e GA4 verificados em produção com ferramentas de debug
  - Formulário de diagnóstico testado end-to-end em produção
  - Email de lead chegando para Johny em < 5 minutos (NFR-I3)

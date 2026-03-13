---
stepsCompleted: ['step-01-document-discovery', 'step-02-prd-analysis', 'step-03-epic-coverage-validation', 'step-04-ux-alignment', 'step-05-epic-quality-review', 'step-06-final-assessment']
status: complete
status: in-progress
date: '2026-03-11'
documents:
  prd: prd.md
  architecture: architecture.md
  epics: epics.md
  ux: ux-design-specification.md
---

# Implementation Readiness Assessment Report

**Date:** 2026-03-11
**Project:** digital-dog

---

## PRD Analysis

### Requisitos Funcionais (FRs)

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

**Total FRs: 31**

### Requisitos Não-Funcionais (NFRs)

NFR-P1: O site atinge Core Web Vitals aprovados em dispositivos móveis — LCP < 2.5s, CLS < 0.1, INP < 200ms
NFR-P2: O PageSpeed Mobile é ≥ 90 pontos no Google PageSpeed Insights no momento do lançamento
NFR-P3: O bundle JavaScript inicial não ultrapassa 200kb gzipped
NFR-S1: Todas as transmissões de dados entre visitante e servidor são protegidas via HTTPS/TLS
NFR-S2: Os dados coletados pelo formulário são transmitidos de forma segura, sem exposição em logs públicos ou respostas retornadas ao cliente
NFR-S3: O site declara os cookies e dados de tracking utilizados (Meta Pixel, GA4) em linguagem acessível na Política de Privacidade
NFR-AV1: O site mantém disponibilidade mínima de 99,9% de uptime, especialmente durante períodos com campanha ativa no Meta Ads
NFR-A1: O site atinge conformidade WCAG 2.1 nível AA para as capacidades core
NFR-A2: O contraste de cores em textos de conteúdo principal é de no mínimo 4,5:1
NFR-I1: O Meta Pixel dispara eventos de PageView e Submit em 100% das ocorrências relevantes
NFR-I2: O GA4 registra corretamente a fonte de origem do visitante (parâmetros UTM)
NFR-I3: A notificação de lead por email é entregue dentro de 5 minutos após cada submissão bem-sucedida
NFR-I4: O CMS do portfólio reflete mudanças publicadas por Johny no site em menos de 5 minutos após a publicação

**Total NFRs: 13**

### Requisitos Adicionais (Técnicos/Restrições)

- Mobile-first; breakpoints: < 768px, 768–1024px, > 1024px; tap targets mínimo 44x44px
- Safari iOS como prioridade máxima (tráfego Meta Ads)
- SSG via Next.js; API Routes serverless apenas para form submit e email
- GSAP para animações (Three.js REMOVIDO do MVP conforme arquitetura)
- `prefers-reduced-motion` respeitado em todas as animações
- `font-display: swap` para fontes
- CLS = 0 — nenhuma animação pode causar layout shift (impacto no Ad Quality Score)
- Consentimento LGPD como pré-requisito para carregamento de Meta Pixel e GA4

### Avaliação de Completude do PRD

✅ PRD bem estruturado com 31 FRs numerados e 13 NFRs categorizados.
✅ Jornadas de usuário claramente documentadas (5 journeys).
✅ Critérios de sucesso mensuráveis definidos.
⚠️ Nota: O PRD menciona Three.js na seção de arquitetura técnica, mas os requisitos adicionais da arquitetura instruem sua remoção do MVP. Isso já está refletido nos épicos.

---

## Epic Coverage Validation

### Matriz de Cobertura — FRs vs Épicos/Stories

| FR | Requisito (resumo) | Cobertura nos Épicos | Status |
|---|---|---|---|
| FR1 | Posicionamento acima da dobra | Epic 2 → Story 2.1 (Hero) | ✅ Coberto |
| FR2 | Navegação mobile equivalente ao desktop | Epic 1 → Story 1.3 (Header) + responsividade em todas as stories | ✅ Coberto |
| FR3 | Animações de scroll sem bloquear conteúdo | Epic 2 → Stories 2.1, 2.2, 2.3, 2.4 (GSAP ScrollTrigger) | ✅ Coberto |
| FR4 | `prefers-reduced-motion` — sem animações | Epic 2 → Stories 2.1, 2.2, 2.3 (GSAP com matchMedia) | ✅ Coberto |
| FR5 | Fred como identidade visual da marca | Epic 1 → Story 1.3 (nav) + Epic 2 → Story 2.1 (hero) | ✅ Coberto |
| FR6 | Serviços de Arquitetura de Marca | Epic 2 → Story 2.6 (Serviços, FAQ e Hub) | ✅ Coberto |
| FR7 | Serviços de Arquitetura Tecnológica | Epic 2 → Story 2.6 (Serviços, FAQ e Hub) | ✅ Coberto |
| FR8 | Hub de Ferramentas — teaser only | Epic 2 → Story 2.6 (Hub Teaser) | ✅ Coberto |
| FR9 | Portfólio — logos e identidades visuais | Epic 2 → Story 2.5 (Portfólio) | ✅ Coberto |
| FR10 | Diversidade de segmentos no portfólio | Epic 2 → Story 2.5 (Portfólio) | ✅ Coberto |
| FR11 | CMS portfólio sem código para Johny | Epic 2 → Story 2.5 (portfolioItems.ts + git push) | ✅ Coberto |
| FR12 | Formulário de Diagnóstico Digital | Epic 3 → Story 3.2 (Modal + Steps 1–2) | ✅ Coberto |
| FR13 | Barra de progresso no formulário | Epic 3 → Stories 3.2, 3.3 (progress bar "X de 4") | ✅ Coberto |
| FR14 | Campo de texto livre — desafio atual | Epic 3 → Story 3.3 (Step 3) | ✅ Coberto |
| FR15 | Validação em tempo real | Epic 3 → Story 3.3 (React Hook Form + Zod) | ✅ Coberto |
| FR16 | Confirmação com Fred pós-submit | Epic 3 → Story 3.4 (SuccessScreen + drawSVG) | ✅ Coberto |
| FR17 | WhatsApp revelado pós-submit | Epic 3 → Story 3.4 (WhatsApp CTA) | ✅ Coberto |
| FR18 | Email de lead para Johny | Epic 3 → Story 3.1 (API Route + Resend) | ✅ Coberto |
| FR19 | Meta Pixel — PageView | Epic 4 → Story 4.1 | ✅ Coberto |
| FR20 | Meta Pixel — evento Submit | Epic 4 → Story 4.1 | ✅ Coberto |
| FR21 | Audiência de retargeting (PageView sem Submit) | Epic 4 → Story 4.1 | ✅ Coberto |
| FR22 | GA4 — rastreamento de origem UTM | Epic 4 → Story 4.2 | ✅ Coberto |
| FR23 | GA4 — evento de conversão form | Epic 4 → Story 4.2 | ✅ Coberto |
| FR24 | Schema Markup (LocalBusiness, FAQ, Service) | Epic 5 → Story 5.1 | ✅ Coberto |
| FR25 | llms.txt para IAs generativas | Epic 5 → Story 5.2 | ✅ Coberto |
| FR26 | Meta tags e Open Graph | Epic 1 → Story 1.6 | ✅ Coberto |
| FR27 | Política de Privacidade acessível | Epic 1 → Story 1.4 (footer) + Epic 3 → Story 3.3 (form) + Epic 5 → Story 5.3 (página completa) | ✅ Coberto |
| FR28 | Consentimento explícito no formulário | Epic 3 → Story 3.3 (checkbox LGPD) | ✅ Coberto |
| FR29 | Finalidade declarada dos dados | Epic 3 → Story 3.3 (texto de consentimento) | ✅ Coberto |
| FR30 | Erro sem perda de dados + nova tentativa | Epic 3 → Story 3.3 (erro handling) | ✅ Coberto |
| FR31 | Acessibilidade teclado/screen reader | Epic 5 → Story 5.4 (Auditoria WCAG 2.1 AA) | ✅ Coberto |

### Requisitos Faltando na Cobertura

**Nenhum FR sem cobertura encontrado.** ✅

### Observações de Rastreabilidade

⚠️ **Observação 1 — ConsentProvider sem FR direto:**
Story 1.2 (ConsentProvider) é pré-requisito arquitetural para FR19–FR23 (carregamento condicional de Meta Pixel/GA4), mas não possui mapeamento explícito para um único FR. É coberta implicitamente pelas requirements de LGPD e pelos critérios das Stories 4.1 e 4.2. Rastreabilidade indireta — sem impacto na implementação, mas vale documentar.

⚠️ **Observação 2 — NFR-I4 (CMS ≤ 5 min) sem critério de aceite explícito:**
Story 2.5 menciona "Vercel re-deploya (~2 min)" mas não declara explicitamente o threshold de 5 min como critério de aceite verificável. Risco de conformidade baixo na prática, mas a AC poderia ser mais precisa.

### Estatísticas de Cobertura

- **Total de FRs no PRD:** 31
- **FRs cobertos nos épicos:** 31
- **Percentual de cobertura:** **100%** ✅
- **FRs com cobertura em múltiplos épicos (cross-cutting):** FR2, FR3, FR4, FR5, FR27

---

## UX Alignment Assessment

### Status do Documento UX

✅ **Encontrado:** `ux-design-specification.md` (52K) — documento completo com 14 steps concluídos.
Baseado no PRD e nos componentes existentes do codebase brownfield.

### Alinhamentos Confirmados (UX ↔ PRD ↔ Épicos)

| Elemento UX | Status |
|---|---|
| Hero com grid técnico SVG (sem AnimatedGradient) | ✅ Alinhado — Story 2.1 AC |
| Fred posicionado na nav (não centralizado no hero) | ✅ Alinhado — Story 1.3 |
| Progressive reduction nav (logo completo → só Fred no scroll) | ✅ Alinhado — Story 1.3 AC |
| Modal multi-step com 4 steps e barra de progresso | ✅ Alinhado — Stories 3.2, 3.3 |
| GSAP drawSVG para Fred pós-submit | ✅ Alinhado — Story 3.4 |
| prefers-reduced-motion em todas as animações | ✅ Alinhado — múltiplas stories |
| Lenis smooth scroll | ✅ Alinhado — Story 2.7 |
| Custom cursor como progressive enhancement (só desktop/pointer) | ✅ Alinhado — Story 2.1 AC |
| How It Works como diagrama de ecossistema SVG | ✅ Alinhado — Story 2.3 |
| Sem urgência artificial, sem pop-ups de pressão | ✅ Alinhado — épicos reflectem |
| LGPD ConsentProvider (pré-requisito para analytics) | ✅ Alinhado — Story 1.2 |
| WhatsApp float com UTM | ✅ Alinhado — Story 1.5 AC |
| Tab target mínimo 44x44px | ✅ Alinhado — mencionado em stories |
| Conteúdo e tom pós-submit humanizado | ✅ Alinhado — Story 3.4 AC |

### ⚠️ Misalinhamentos Encontrados

#### MISALINHAMENTO 1 — Ordem dos Steps do Formulário (**CRÍTICO**)

| Dimensão | UX Spec | Épicos (Stories 3.2 + 3.3) |
|---|---|---|
| **Step 1** | Segmento (card tap) | Segmento (card tap) ✅ |
| **Step 2** | Desafio (textarea livre) | **Nome do negócio** ❌ |
| **Step 3** | Nome + Nome do negócio | **Desafio atual (textarea)** ❌ |
| **Step 4** | WhatsApp + Email (opt) + LGPD | WhatsApp + LGPD |

A UX Spec coloca o desafio no Step 2 e nome/negócio no Step 3 — criando "reciprocidade antes do contato" (o visitante compartilha o desafio antes de ser pedido o WhatsApp). A épica inverteu a ordem. Esse detalhe não é cosmético: **compromete a psicologia de progressive commitment da jornada**.

**Recomendação:** Atualizar Stories 3.2 e 3.3 para alinhar com a UX Spec (desafio=step 2, nome=step 3).

---

#### MISALINHAMENTO 2 — Campo de Email Opcional no Step 4 (**MÉDIO**)

| Dimensão | UX Spec | Épicos |
|---|---|---|
| Step 4 | WhatsApp (obrigatório) + **Email (opcional)** + LGPD | WhatsApp + LGPD (sem email) |
| API (Story 3.1) | Notificação com dados incl. email do lead | Notificação sem email do lead |

A UX Spec inclui um campo de email opcional no Step 4 e define o lead como potencial canal de follow-up por email. As stories e a API route omitem esse campo.

**Recomendação:** Decidir se o email opcional entra no MVP. Se sim: atualizar Stories 3.3 e 3.1. Se não: atualizar o UX Spec para remover o campo.

---

#### MISALINHAMENTO 3 — HeroAISimulation.tsx não declarado nas ACs da Story 2.1 (**MÉDIO**)

| Dimensão | UX Spec | Story 2.1 AC |
|---|---|---|
| Hero direito | `HeroAISimulation.tsx` — painel Google/ChatGPT com loop animado de clients aparecendo no Gemini | Menciona apenas "Fred identificável" e "grid técnico SVG" |

O componente `HeroAISimulation.tsx` é o elemento UX mais diferenciador do site (demonstra o produto antes de qualquer texto), mas não consta nos critérios de aceite da Story 2.1. Um dev implementando apenas as ACs poderia omitir essa feature crítica.

**Recomendação:** Adicionar AC explícita na Story 2.1 para o painel de simulação IA.

---

#### MISALINHAMENTO 4 — Framer Motion vs GSAP em `TechBackground` (**BAIXO**)

| Dimensão | UX Spec | Arquitetura/Épicos |
|---|---|---|
| `TechBackground` parallax | "Framer Motion `useScroll` + `useTransform`" | **Framer Motion REMOVIDO** — GSAP only |
| Modal entry animation | "Framer Motion fade-in" | Story 3.2: "animação de entrada GSAP" ✅ |

A UX spec ainda menciona Framer Motion para o `TechBackground` (parallax do grid SVG no hero), mas a arquitetura removeu o Framer Motion do projeto. O modal já foi corrigido nas ACs (GSAP), mas o TechBackground não.

**Recomendação:** A implementação deve usar GSAP ScrollTrigger para o parallax do TechBackground (não Framer Motion). O UX spec está desatualizado nesse ponto específico; não precisa ser atualizado antes de implementar.

### Resumo dos Riscos UX

| Misalinhamento | Impacto | Prioridade |
|---|---|---|
| Ordem dos Steps do Form | Compromete psicologia de conversão | 🔴 CRÍTICO — corrigir antes de implementar |
| Email opcional no Step 4 | Campos e API incompletos | 🟡 MÉDIO — decidir antes de implementar |
| HeroAISimulation nas ACs | Feature crítica pode ser omitida | 🟡 MÉDIO — adicionar AC antes de implementar |
| TechBackground Framer Motion | Referência técnica desatualizada | 🟢 BAIXO — dev deve ignorar e usar GSAP |

---

## Epic Quality Review

### Epic 1: Fundação — Site Funcional com Identidade Digital Dog

**User Value:** ✅ Visitante acessa site rápido com identidade correta + navegação funcional.
**Independência:** ✅ Não depende de nenhum outro épico.
**Brownfield:** ✅ Story 1.1 ("Como desenvolvedor") é aceitável para projeto brownfield.

| Story | ACs BDD | Status | Issues |
|---|---|---|---|
| 1.1 Setup Técnico | ✅ | ✅ PASSA | Nenhum |
| 1.2 ConsentProvider | ✅ | ✅ PASSA | Nenhum |
| 1.3 Header | ✅ | ✅ PASSA | Nenhum |
| 1.4 Footer | ✅ | ✅ PASSA | Nenhum |
| 1.5 WhatsApp Float | ⚠️ | 🟡 MENOR | AC não menciona captura de UTM (UX Spec exige) |
| 1.6 Metadados OG | ✅ | ✅ PASSA | Nenhum |

---

### Epic 2: Homepage — Jornada Completa de Posicionamento

**User Value:** ✅ Visitante experimenta jornada completa de posicionamento.
**Independência:** ✅ Usa saída do Epic 1. Sem dependência do Epic 3+.

| Story | ACs BDD | Status | Issues |
|---|---|---|---|
| 2.1 Hero | ⚠️ | 🔴 CRÍTICO | `HeroAISimulation.tsx` ausente nas ACs |
| 2.2 Pain Points + Quatro Pilares | ✅ | ✅ PASSA | Nenhum |
| 2.3 How It Works | ✅ | ✅ PASSA | Nenhum |
| 2.4 Prova Social | ✅ | ✅ PASSA | Nenhum |
| 2.5 Portfólio | ✅ | ✅ PASSA | Nenhum |
| 2.6 Serviços + FAQ + Hub | ✅ | 🟡 MENOR | 3 features em 1 story — potencialmente grande |
| 2.7 CTA Final + Assembly | ⚠️ | 🟡 MENOR | CWV duplicado com Story 5.5; assembly story aceitável |

**🔴 Violação Crítica — Story 2.1:**
O painel `HeroAISimulation.tsx` (Google/ChatGPT demonstrando clients no Gemini) é o elemento mais diferenciador do site, mas não está nas ACs. Um dev pode implementar hero sem ele.
**Correção:** Adicionar AC explícita para o painel de simulação IA no lado direito do hero.

---

### Epic 3: Captação — Formulário de Diagnóstico Digital

**User Value:** ✅ Visitante completa diagnóstico; Johny recebe lead.
**Independência:** ✅ Usa Epic 1 (ConsentProvider). Sem dependência do Epic 4+.

| Story | ACs BDD | Status | Issues |
|---|---|---|---|
| 3.1 API Route + Email | ✅ | ✅ PASSA | Testável isoladamente |
| 3.2 Modal Steps 1–2 | ⚠️ | 🔴 CRÍTICO | Ordem dos steps incorreta vs UX Spec |
| 3.3 Steps 3–4 + LGPD | ⚠️ | 🔴 CRÍTICO | Ordem incorreta + campo email opcional ausente |
| 3.4 Tela de Sucesso | ✅ | ✅ PASSA | Nenhum |

**🔴 Violação Crítica — Stories 3.2 e 3.3:**
Steps invertidos vs UX Spec. Correto: Step 2=Desafio, Step 3=Nome/Negócio.

**🟠 Problema Maior — Stories 3.3 e 3.1:**
Campo de email opcional (Step 4) ausente nas stories e na API. Decisão necessária antes de implementar.

---

### Epic 4: Analytics e Rastreamento de Campanhas

**User Value:** ✅ (valor de negócio para Digital Dog) — mede campanhas e retargeting.
**Independência:** ✅ Depende de Story 1.2 (ConsentProvider) — explicitado nas ACs.

| Story | ACs BDD | Status | Issues |
|---|---|---|---|
| 4.1 Meta Pixel | ✅ | ✅ PASSA | Nenhum |
| 4.2 GA4 | ✅ | ✅ PASSA | Nenhum |

**Epic 4: APROVADO SEM PROBLEMAS ✅**

---

### Epic 5: SEO, AIO/GEO, Acessibilidade e Prontidão para Lançamento

**User Value:** ✅ Site encontrável; acessível a todos; compliance LGPD; prontidão para campanha.
**Independência:** ✅ Epic final de qualidade/lançamento. Audit stories corretamente posicionadas.

| Story | ACs BDD | Status | Issues |
|---|---|---|---|
| 5.1 Schema Markup | ✅ | ✅ PASSA | Nenhum |
| 5.2 llms.txt | ✅ | ✅ PASSA | Nenhum |
| 5.3 Política de Privacidade | ✅ | ✅ PASSA | Nenhum |
| 5.4 Auditoria WCAG | ✅ | ✅ PASSA | Audit story corretamente posicionada |
| 5.5 Auditoria Performance | ⚠️ | 🟡 MENOR | CWV duplicado com Story 2.7 |

---

### Sumário de Qualidade — Todos os Épicos

| Nível | Problema | Stories afetadas |
|---|---|---|
| 🔴 CRÍTICO | HeroAISimulation ausente nas ACs | Story 2.1 |
| 🔴 CRÍTICO | Ordem dos steps do form invertida (Steps 2↔3) | Stories 3.2, 3.3 |
| 🟠 MAIOR | Campo de email opcional ausente | Stories 3.3, 3.1 |
| 🟡 MENOR | UTM no WhatsApp Float não especificado | Story 1.5 |
| 🟡 MENOR | 3 features agrupadas | Story 2.6 |
| 🟡 MENOR | CWV duplicados entre stories | Stories 2.7 e 5.5 |

---

## Sumário e Recomendações Finais

### Status Geral de Prontidão

> **✅ READY — Problemas Críticos Corrigidos em 2026-03-12**

O planejamento do projeto digital-dog é sólido, bem estruturado e 100% rastreável do PRD até os épicos. Os 2 problemas críticos foram **corrigidos diretamente nos épicos em 2026-03-12**.

---

### Correções Aplicadas (2026-03-12)

**1. Ordem dos Steps do Formulário (Stories 3.2 e 3.3)** ✅ CORRIGIDO
- Story 3.2: Step 2 → **Desafio Atual** (textarea com placeholder empático) — FR14 e FR15 movidos para cá
- Story 3.3: Step 3 → **Nome + Nome do Negócio** (dois campos de input)
- Título e descrição da Story 3.3 atualizados; dados do POST explicitados como: `(segmento, desafio, nome, negócio, whatsapp)`

**2. HeroAISimulation adicionado às ACs da Story 2.1** ✅ CORRIGIDO
- Novo bloco de AC: painel `HeroAISimulation` no lado direito do hero, alternando entre Google (Gemini AI Overview) e ChatGPT
- Loop com 3 queries e 3 clientes reais (Aumivet, Morgan & Ted, RZ Vet) usando GSAP TextPlugin
- Comportamento `prefers-reduced-motion` documentado → versão estática

---

### Problema Maior — ✅ DECIDIDO EM 2026-03-12

**3. Campo de Email Opcional no Step 4** — **REMOVIDO DO MVP**
- Decisão: campo de email do lead não entra no MVP.
- Épicos já estavam corretos (sem o campo). UX Spec estava desatualizada nesse ponto.
- Step 4 = WhatsApp (obrigatório) + checkbox LGPD. Sem campo de email.

---

### Próximos Passos

1. **[NICE TO HAVE]** Adicionar UTM capture como AC na Story 1.5
3. **[OPCIONAL]** Remover CWV da Story 2.7 (manter apenas em Story 5.5 como audit final)
4. **[IMPLEMENTAR]** Iniciar pela Story 1.1 — projeto está pronto para desenvolvimento

---

### Pontos Fortes do Planejamento

- ✅ **100% dos 31 FRs cobertos** nos épicos — rastreabilidade completa
- ✅ **13 NFRs bem distribuídos** entre as stories relevantes
- ✅ **Arquitetura técnica sólida** — GSAP only, SSG, feature-based, React Hook Form + Zod
- ✅ **Épicos com valor de usuário** claro e progressivo (Epic 1→5 bem sequenciado)
- ✅ **Epic 4 (Analytics) impecável** — as melhores ACs do conjunto
- ✅ **Contexto brownfield bem tratado** — Story 1.1 adequada para o cenário

---

### Nota Final

Esta avaliação identificou **7 issues** em **4 categorias** (2 críticos, 1 maior, 4 menores). Todos os críticos são correções simples nos épicos (não requere revisão do PRD ou da Arquitetura). Após as correções apontadas, o projeto estará pronto para iniciar a implementação começando pela Story 1.1.

**Relatório gerado:** `_bmad-output/planning-artifacts/implementation-readiness-report-2026-03-11.md`
**Avaliado por:** Claude Code — PM/SM Expert Mode
**Data:** 2026-03-11

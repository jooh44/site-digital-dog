---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: complete
completedAt: '2026-03-11'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/product-brief-digital-dog-2026-03-09.md
  - _bmad-output/planning-artifacts/research/market-posicionamento-digital-dog-research-2026-03-09.md
workflowType: 'architecture'
project_name: 'digital-dog'
user_name: 'Johny'
date: '2026-03-11'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (31 FRs em 9 categorias):**

- **Apresentação e Posicionamento (FR1–FR5):** Hero mobile acima da dobra com proposta de
  valor imediata, experiência mobile equivalente ao desktop, scroll animations como
  progressive enhancement, suporte a `prefers-reduced-motion`, presença visual do Fred.
  Componentes devem funcionar sem JavaScript como baseline (SSG puro).

- **Serviços e Conteúdo (FR6–FR8):** Arquitetura de Marca, Arquitetura Tecnológica e Hub de
  Ferramentas (placeholder). Conteúdo estático — sem necessidade de CMS nessas páginas.

- **Portfólio e Prova Social (FR9–FR11):** Galeria navegável com diversidade de segmentos.
  FR11 (Johny atualiza sem código) é o driver da decisão CMS — única área que requer
  edição sem deploy. Frequência baixa de atualização favorece MDX estático sobre CMS headless.

- **Captação e Conversão — Formulário (FR12–FR17, FR30):** Multi-step form 4 etapas com
  progressive disclosure, barra de progresso, campo de texto livre, validação em tempo real.
  Estado persistido via `sessionStorage` entre steps. Tela pós-submit com Fred (SVG inline
  obrigatório para drawSVG via GSAP) + revelação do WhatsApp. Fluxo crítico de conversão.
  ⚠️ SVG do Fred (logo/mascote) ainda a ser fornecido — pendente para implementação da
  animação drawSVG pós-submit.

- **Comunicação Pós-Conversão (FR18):** Email de lead para Johny com dados do formulário.
  Serviço de email externo via API Route do Next.js. Requer configuração de SPF/DKIM no
  domínio remetente para garantir entregabilidade (risco de spam para leads).

- **Analytics e Rastreamento (FR19–FR23):** Meta Pixel (PageView + Submit, 100% confiável),
  GA4 com UTM tracking, audiência de retargeting. Scripts carregados condicionalmente ao
  consentimento LGPD via ConsentProvider global.

- **SEO e Visibilidade Orgânica (FR24–FR26):** Schema Markup, llms.txt, Open Graph/meta tags.
  Conteúdo estático gerado no build. O llms.txt e Schema Markup são estratégicos — prova
  de competência AIO/GEO ao vivo, validando o posicionamento da Digital Dog antes de
  qualquer reunião comercial.

- **Compliance LGPD (FR27–FR29):** ConsentProvider global bloqueia Meta Pixel e GA4 por
  padrão. Banner de consentimento no rodapé/bottom bar — nunca bloqueando o hero acima da
  dobra (impacto direto no Ad Quality Score do Meta Ads e na percepção imediata).

- **Acessibilidade (FR31):** WCAG 2.1 AA para capacidades core — navegação via teclado,
  leitura de conteúdo, submissão do formulário.

**Non-Functional Requirements (drivers arquiteturais):**

- Performance: LCP < 2.5s, CLS < 0.1 (animações não causam layout shift),
  INP < 200ms, PageSpeed Mobile ≥ 90, bundle JS inicial < 200kb gzip.
  SSG + dynamic imports para GSAP/Three.js são mandatórios.
- Segurança: HTTPS/TLS; dados do formulário não expostos em logs ou respostas ao cliente.
- Disponibilidade: 99.9% uptime durante campanhas Meta Ads ativas.
- Integrações: Meta Pixel 100% dos eventos, email lead < 5 min (considerar cold starts
  Vercel + configuração SPF/DKIM), CMS atualiza em < 5 min.
- Acessibilidade: WCAG 2.1 AA para fluxos core.

**Scale & Complexity:**

- Primary domain: Web App (Next.js SSG, Vercel, static-first)
- Complexity level: Baixa-Média
- Architectural components estimados: ~8–10

### Technical Constraints & Dependencies

- **Framework:** Next.js (App Router) — brownfield; SSG mandatório para performance
- **Hosting:** Vercel — CDN global, preview URLs, serverless functions (API Routes)
- **Animation:** GSAP (scroll + drawSVG para Fred inline SVG); Three.js opcional
  below-the-fold com dynamic import. `prefers-reduced-motion` obrigatório.
- **Fred SVG:** Deve ser inline no DOM (não `<img>`) para drawSVG funcionar via GSAP.
  ⚠️ Arquivo SVG pendente — a ser fornecido pelo Johny.
- **Mobile-first / Safari iOS:** Prioridade máxima (origem do tráfego Meta Ads).
- **Formulário Multi-step:** `sessionStorage` para persistir estado entre etapas.
- **CMS de Portfólio:** Decisão a ser tomada — MDX estático favorecido pela baixa
  frequência de atualizações vs Sanity/Contentful (custo + dependência externa).
- **Email de Lead:** API Route Next.js + serviço externo (Resend/SendGrid).
  Infraestrutura: SPF + DKIM obrigatórios no domínio remetente.
- **LGPD / Consentimento:** ConsentProvider (React Context) global no layout —
  Meta Pixel e GA4 carregados condicionalmente.

### Cross-Cutting Concerns Identified

1. **Performance vs Animações:** GSAP e Three.js via dynamic import — nunca bloqueando LCP.
2. **ConsentProvider global:** Controla ativação de Meta Pixel e GA4; banner discreto
   no rodapé para não competir com hero.
3. **Analytics em todo o site:** Meta Pixel e GA4 no layout global; eventos específicos
   em componentes (Submit do formulário, PageView).
4. **LGPD compliance:** Afeta formulário, cookies, Meta Pixel, GA4 e Política de Privacidade.
5. **Responsividade universal:** Mobile < 768px, tablet 768–1024px, desktop > 1024px.
   Safari iOS como browser de teste prioritário.
6. **Acessibilidade:** Teclado e screen readers em todos os componentes interativos.
7. **Estado do formulário:** sessionStorage entre steps; recuperação de erro sem perda
   de dados (FR30).
8. **llms.txt como ativo estratégico:** Não apenas SEO — prova de competência AIO/GEO
   ao vivo para prospects que pesquisam no Perplexity/ChatGPT.

## Starter Template Evaluation

### Primary Technology Domain

Web App — Next.js 14.2 App Router (brownfield: stack já estabelecida)

### Context: Brownfield Project

Este projeto tem base técnica existente (Next.js + Tailwind + GSAP). O "starter"
é a stack atual. Esta seção documenta as decisões já tomadas e os ajustes necessários
antes de iniciar o desenvolvimento das novas features.

### Decisões Arquiteturais Já Estabelecidas

**Language & Runtime:**
- TypeScript 5.6 com strict mode — todos os componentes tipados
- Node.js via Vercel serverless (API Routes)

**Framework:**
- Next.js 14.2 — App Router (não Pages Router)
- SSG como padrão: `generateStaticParams` + `export const dynamic = 'force-static'`
  onde aplicável; API Routes serverless para form submit e email

**Styling Solution:**
- Tailwind CSS 3 com design tokens configurados:
  - Cores: `primary-blue (#00bcd4)`, `dark-blue (#0a0e1a)`, `gradient-orange (#ff6b35)`,
    `gradient-pink (#ff1744)`
  - Fontes: Space Grotesk (headings) + Inter (body) com `font-display: swap`
  - Shadows: card glow com cyan rgba
- Utilitários: clsx + tailwind-merge para composição de classes

**Animation Stack:**
- GSAP 3.14 — scroll reveals (ScrollTrigger), drawSVG (Fred pós-submit), timelines
- Framer Motion 12 — micro-interações UI (hover states, transições de estado de componente)
- Lenis — smooth scroll global
- Three.js + R3F/Drei — elementos 3D below-the-fold (dynamic import obrigatório)
- `prefers-reduced-motion` aplicado em todos os contextos de animação

**Code Organization:**
```
features/
  homepage/components/   # Seções da homepage (Hero, FourPillars, etc.)
  layout/components/     # Header, Footer
  shared/ui/             # Componentes reutilizáveis (Button, Card, etc.)
app/                     # Next.js App Router
  api/                   # API Routes (form submit, email)
  (pages)/               # Rotas da aplicação
public/                  # Assets estáticos, SVGs, imagens
```

**Development Tooling:**
- ESLint com eslint-config-next
- TypeScript strict como type checker
- Alias `@/*` mapeado para `./`

### Ajustes Necessários na Base Existente

**Antes de iniciar novas features:**

1. **Remover `output: 'standalone'` do next.config.js** — incompatível com Vercel nativo;
   manter sem output para SSR/SSG híbrido gerenciado pelo Vercel
2. **Remover Prisma do package.json** — devDependency morta; `db:generate`,
   `db:migrate`, `db:studio` scripts também devem ser removidos
3. **Atualizar metadata no layout.tsx** — título e descrição ainda referenciam
   "Medicina Veterinária"; atualizar para novo posicionamento de Arquitetura Digital
4. **Implementar ConsentProvider** — Meta Pixel atualmente injetado sem controle
   de consentimento; migrar para carregamento condicional pós-consentimento

### Decisões Pendentes (a resolver neste workflow)

- **CMS de Portfólio:** MDX estático vs Sanity/Contentful
- **Email Service:** Resend vs SendGrid para notificação de lead
- **Form State Management:** React Hook Form vs useState local para multi-step form

## Core Architectural Decisions

### Decision Priority Analysis

**Decisões Críticas (bloqueiam implementação):**
- Portfolio: MDX estático + portfolioItems.ts config
- Email service: Resend
- Form state: React Hook Form + Zod
- Animation: GSAP only (remover Framer Motion)
- Fixes obrigatórios: remover output standalone, remover Prisma,
  atualizar metadata, implementar ConsentProvider

**Decisões Importantes (moldam arquitetura):**
- ConsentProvider global para LGPD (Meta Pixel + GA4 condicionais)
- Fred SVG inline no DOM (não `<img>`) para drawSVG
- sessionStorage com try/catch + fallback in-memory para estado do form
- Regra SSR: window/document/sessionStorage apenas dentro de useEffect
- Todos os componentes com GSAP marcados com `'use client'`

**Decisões Deferidas (pós-MVP):**
- Autenticação de usuário (Hub de Ferramentas — Growth phase)
- CRM de leads (Growth phase)
- Blog/conteúdo editorial (Vision phase)

---

### Data Architecture

**Portfolio CMS:**
- Decisão: MDX estático + arquivo de configuração centralizado
- Abordagem: `portfolioItems.ts` com array de items tipados; imagens em `public/portfolio/`
- Johny gerencia diretamente: adiciona imagem + atualiza o arquivo de config + git push → deploy automático no Vercel
- Racional: zero dependências externas, zero custo, zero API calls no build.
  Baixa frequência de atualização — simplicidade supera conveniência de painel visual
- NFR-I4 atendido: Vercel re-deploya em ~2 min após push

```ts
export interface PortfolioItem {
  id: string
  client: string
  segment: string
  description: string
  logoPath: string       // /portfolio/nome-cliente.webp
  featured: boolean
}

export const portfolioItems: PortfolioItem[] = [...]
```

---

### Authentication & Security

**Autenticação:**
- MVP: sem autenticação de usuário (sem área logada)
- Growth: autenticação a ser decidida quando Hub de Ferramentas for implementado

**LGPD — ConsentProvider (PRIORIDADE 1 — antes de qualquer outra feature):**
- ⚠️ Meta Pixel está atualmente no `<head>` sem controle de consentimento — violação LGPD
- Decisão: React Context global (`ConsentProvider`) em `app/layout.tsx`
- Meta Pixel e GA4 carregados condicionalmente ao consentimento
- Banner discreto no rodapé/bottom bar — nunca bloqueando o hero
- ConsentProvider é pré-requisito para qualquer trabalho em analytics

```tsx
// Padrão de implementação
<ConsentProvider>
  {/* Meta Pixel e GA4 renderizados condicionalmente aqui */}
  {children}
</ConsentProvider>
```

**Segurança do Formulário:**
- Inputs validados e sanitizados com Zod na API Route antes de processar
- Dados não retornados ao cliente após submit (apenas status)
- `RESEND_API_KEY` é server-only — NUNCA com prefixo `NEXT_PUBLIC_`

---

### API & Communication Patterns

**Email Service — Resend:**
- Decisão: Resend para notificação de lead
- Integração: `app/api/diagnostico/submit/route.ts` → Resend SDK
- Free tier: 3.000 emails/mês
- Infraestrutura obrigatória antes do lançamento: SPF + DKIM no domínio remetente
- Template: React Email para HTML da notificação

**Comportamento de Falha do Resend:**
- Se Resend falhar: API Route retorna erro 500
- UX: formulário mostra mensagem de erro com botão "Tentar novamente" (não perde dados)
- Servidor: erro logado no Vercel Logs
- Sem retry automático no MVP; form preserva estado para o usuário retentar

**Respostas padronizadas de API:**
```ts
{ success: true, data?: T }           // Sucesso
{ success: false, error: string }     // Erro — nunca expõe stack trace
```

---

### Frontend Architecture

**Form State Management — React Hook Form + Zod:**
- Instalação: `npm i react-hook-form zod @hookform/resolvers`
- Schema Zod por step em `features/diagnostico/schemas/`
- `useForm` com `zodResolver` em cada step
- Estrutura de componentes (separação para testabilidade):

```
features/diagnostico/
  components/
    DiagnosticoForm.tsx    # Orquestrador de estado e steps
    Step1Negocio.tsx       # Componente burro, recebe props
    Step2Desafio.tsx
    Step3Contato.tsx
    Step4Whatsapp.tsx
    SuccessScreen.tsx      # Fred + WhatsApp (independente do form)
    FredSVG.tsx            # SVG inline — ⚠️ pendente fornecimento
  schemas/
    step1.schema.ts
    step2.schema.ts
    step3.schema.ts
    step4.schema.ts
```

**sessionStorage com fallback (Safari modo privado):**
```ts
function safeSessionStorage() {
  try {
    return window.sessionStorage
  } catch {
    return null  // Safari privado bloqueia sessionStorage — fallback in-memory
  }
}
```

**Animation — GSAP Only:**
- Remover do projeto: `framer-motion`
- GSAP cobre todos os casos:
  - ScrollTrigger: scroll reveals em todas as seções
  - drawSVG: animação do Fred pós-submit (SVG inline obrigatório)
  - Timelines: hero entrance, transições entre steps do form
  - Micro-interações UI: hover states via `gsap.quickTo`
- `prefers-reduced-motion` verificado via `matchMedia` antes de qualquer animação
- Three.js: mantido, dynamic import obrigatório (below-the-fold apenas)

**Regras SSR — Obrigatórias para todos os componentes:**
- Todo componente que usa GSAP, window, document ou sessionStorage:
  → `'use client'` no topo (App Router default = Server Component)
- Todo acesso a `window`/`document`/`sessionStorage`:
  → dentro de `useEffect` OU com guard `typeof window !== 'undefined'`
- Violação causa erro de hidratação no SSG

**Estrutura de Componentes:**
```
features/
  homepage/components/    # Hero, FourPillars, HowItWorks, etc.
  diagnostico/components/ # DiagnosticoForm, Steps, SuccessScreen, FredSVG
  diagnostico/schemas/    # Zod schemas por step
  portfolio/              # PortfolioGrid + portfolioItems.ts
  layout/components/      # Header, Footer
  shared/
    ui/                   # Button, Card, Badge, Input, etc.
    hooks/                # useConsent, useGSAP helpers
    providers/            # ConsentProvider
```

---

### Infrastructure & Deployment

**Environment Variables — Separação Client vs Server:**

| Variável | Tipo | Motivo |
|---|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | Client-safe | Usado no browser |
| `NEXT_PUBLIC_GA4_ID` | Client-safe | Usado no browser |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Client-safe | Exibido no browser |
| `NEXT_PUBLIC_WHATSAPP_MESSAGE` | Client-safe | Exibido no browser |
| `RESEND_API_KEY` | Server-only ⚠️ | Nunca expor ao client |
| `RESEND_FROM_EMAIL` | Server-only | Usado na API Route |
| `NOTIFICATION_EMAIL` | Server-only | Email destino dos leads |

**Fixes obrigatórios (antes de qualquer nova feature):**
1. `next.config.js`: remover `output: 'standalone'`
2. `package.json`: remover `prisma`, `@prisma/client`, `framer-motion`;
   remover scripts `db:*`; adicionar `react-hook-form`, `zod`, `@hookform/resolvers`, `resend`
3. `app/layout.tsx`: atualizar metadata; migrar MetaPixel para dentro do ConsentProvider
4. Implementar ConsentProvider antes de qualquer outra feature

**Vercel:**
- Deploy automático a cada push para `main`
- Preview URLs para cada branch
- Environment variables configuradas no painel Vercel

---

### Decision Impact Analysis

**Sequência de implementação:**
1. Fixes obrigatórios (next.config, package.json, metadata) + ConsentProvider (LGPD)
2. Resend + API Route `/api/diagnostico/submit`
3. DiagnosticoForm (Steps 1–4 com RHF + Zod + sessionStorage)
4. SuccessScreen com Fred drawSVG (quando SVG disponível)
5. PortfolioSection com portfolioItems.ts
6. Animações GSAP (scroll reveals, hero entrance)
7. Three.js elements (below-fold, dynamic import)

**Dependências críticas:**
- ConsentProvider → pré-requisito para Meta Pixel e GA4
- Fred SVG inline → pré-requisito para drawSVG (SuccessScreen bloqueado)
- SPF + DKIM no domínio → pré-requisito para lançamento
- `'use client'` + guards SSR → pré-requisito para qualquer componente com GSAP

## Implementation Patterns & Consistency Rules

### Pontos de Conflito Identificados

8 áreas onde agentes de IA poderiam fazer escolhas diferentes e incompatíveis sem regras explícitas.

---

### Naming Patterns

**Arquivos e Pastas:**

| Caso | Aplicação | Exemplo |
|---|---|---|
| PascalCase | Componentes React | `Hero.tsx`, `DiagnosticoForm.tsx` |
| camelCase | Hooks e utilitários | `useGSAP.ts`, `portfolioItems.ts` |
| kebab-case | Rotas e pastas de rota | `app/diagnostico/`, `app/api/submit/` |
| camelCase | Schemas Zod | `step1.schema.ts` |

**Exemplos corretos vs errados:**
```
✅ features/homepage/components/Hero.tsx
✅ features/shared/hooks/useConsent.ts
✅ features/diagnostico/schemas/step1.schema.ts
✅ app/api/diagnostico/submit/route.ts
✅ public/portfolio/rzvet-logo.webp

❌ features/homepage/components/hero.tsx       (minúsculo para componente)
❌ features/shared/hooks/UseConsent.ts         (PascalCase para hook)
❌ features/diagnostico/Schemas/step1.ts       (PascalCase para pasta)
```

**TypeScript Naming:**
```ts
interface PortfolioItem { ... }          // interfaces: PascalCase
type FormStep = 1 | 2 | 3 | 4           // types: PascalCase

export function Hero() { ... }           // componentes: named export, PascalCase
export function useConsent() { ... }     // hooks: camelCase com prefixo 'use'
export function cn(...) { ... }          // utils: camelCase

const MAX_FORM_STEPS = 4                 // constantes literais: UPPER_SNAKE_CASE
```

---

### Structure Patterns

**Regra de `'use client'` — Árvore de Decisão:**
```
Componente usa GSAP?              → 'use client' obrigatório
Componente usa useState/useEffect? → 'use client' obrigatório
Componente usa window/document?   → 'use client' obrigatório
Componente é só markup/data?      → Server Component (sem diretiva)
```

**Regra SSR — Obrigatória em todo client component:**
```ts
// ✅ CORRETO — browser APIs dentro de useEffect
useEffect(() => {
  const storage = safeSessionStorage()
}, [])

// ✅ CORRETO — guard explícito
if (typeof window === 'undefined') return null

// ❌ ERRADO — acesso direto fora de useEffect (quebra no SSG)
const width = window.innerWidth
```

**Localização de arquivos:**
```
Componente React:       features/{feature}/components/NomeComponente.tsx
Hook customizado:       features/shared/hooks/useNomeHook.ts
Schema Zod:             features/{feature}/schemas/nome.schema.ts
Provider Context:       features/shared/providers/NomeProvider.tsx
Utilitário genérico:    features/shared/utils/nomeFuncao.ts
Config/dados estáticos: features/{feature}/data/nomeItems.ts
Testes:                 co-locados — NomeComponente.test.tsx ao lado do componente
Assets estáticos:       public/{categoria}/nome-descritivo.webp
```

**Imports — Sempre usar alias `@/`:**
```ts
// ✅ CORRETO
import { Hero } from '@/features/homepage/components/Hero'
import { cn } from '@/features/shared/utils/cn'

// ❌ ERRADO — path relativo entre features
import { Hero } from '../../../features/homepage/components/Hero'
```

---

### Format Patterns

**Componentes React — Estrutura Interna:**
```tsx
'use client'  // apenas se necessário

// 1. Imports externos (react, next, libs)
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// 2. Imports internos (@/features/...)
import { cn } from '@/features/shared/utils/cn'

// 3. Types/interfaces locais
interface HeroProps { title: string }

// 4. Named export obrigatório (nunca default export)
export function Hero({ title }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => { /* animações */ }, containerRef)
    return () => ctx.revert()  // cleanup obrigatório
  }, [])

  return <div ref={containerRef}>...</div>
}
```

**GSAP — Padrão de Inicialização:**
```ts
// ✅ SEMPRE: gsap.context() + ref do container + cleanup
useEffect(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  const ctx = gsap.context(() => {
    gsap.from(/* ... */)
    ScrollTrigger.create(/* ... */)
  }, containerRef)

  return () => ctx.revert()  // mata animações e ScrollTriggers do contexto
}, [])

// ❌ NUNCA inicializar GSAP fora de useEffect
gsap.from('.hero', { opacity: 0 })  // quebra no SSG
```

**Tailwind — Composição de Classes:**
```ts
// ✅ SEMPRE usar cn() para composição condicional
import { cn } from '@/features/shared/utils/cn'

<button className={cn(
  'px-6 py-3 rounded-xl font-medium transition-colors',
  isActive && 'bg-primary-blue text-white',
  disabled && 'opacity-50 cursor-not-allowed'
)}>

// ❌ NUNCA concatenação manual de strings
<button className={`px-6 py-3 ${isActive ? 'bg-primary-blue' : ''}`}>
```

**API Routes — Formato Obrigatório:**
```ts
// app/api/diagnostico/submit/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = schema.parse(body)       // ZodError se inválido
    // lógica aqui
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Dados inválidos' }, { status: 400 })
    }
    console.error('[submit] erro:', error)  // log servidor, nunca ao cliente
    return NextResponse.json({ success: false, error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
```

---

### Communication Patterns

**Estado do Formulário Multi-step:**
```ts
// DiagnosticoForm é o orquestrador — Steps recebem dados via props
interface FormState {
  step: 1 | 2 | 3 | 4
  data: Partial<DiagnosticoData>
  isSubmitting: boolean
  error: string | null
}

// Persistência com try/catch (Safari modo privado bloqueia sessionStorage)
function persistFormState(state: FormState) {
  try {
    sessionStorage.setItem('diagnostico-form', JSON.stringify(state))
  } catch {
    // falha silenciosa — estado in-memory continua funcionando
  }
}
```

**Loading State:**
```tsx
const [isSubmitting, setIsSubmitting] = useState(false)

<button disabled={isSubmitting}>
  {isSubmitting ? 'Enviando...' : 'Solicitar Diagnóstico'}
</button>
```

---

### Process Patterns

**Tratamento de Erros — Hierarquia:**
```
1. Validação Zod (client + server) → erro de campo específico, inline
2. Erro de rede/API               → mensagem genérica + botão retry, sem perda de dados
3. Erro inesperado                → log no Vercel Logs; UX mostra "Algo deu errado. Tente novamente."
4. NUNCA mostrar stack traces, detalhes internos ou mensagens técnicas ao usuário
```

**Next.js Image — Obrigatório:**
```tsx
// ✅ SEMPRE next/image para imagens raster
import Image from 'next/image'
<Image src="/portfolio/cliente.webp" alt="Logo Cliente" width={200} height={100} />

// ❌ NUNCA <img> tag (exceto SVG inline para GSAP drawSVG)
```

---

### Enforcement Guidelines

**Todo agente de IA DEVE:**
- Usar `'use client'` em qualquer componente com hooks React, GSAP ou browser APIs
- Inicializar GSAP dentro de `useEffect` com `gsap.context()` + `return () => ctx.revert()`
- Verificar `prefers-reduced-motion` antes de qualquer animação GSAP
- Usar `cn()` para composição de classes Tailwind condicionais
- Usar alias `@/` para todos os imports que cruzam pastas
- Exportar componentes como named exports (nunca `export default`)
- Validar inputs de API Routes com Zod antes de processar
- Nunca usar prefixo `NEXT_PUBLIC_` em variáveis server-only
- Usar `next/image` para todas as imagens raster

**Anti-patterns proibidos:**
```
❌ gsap.from() fora de useEffect
❌ window.anything fora de useEffect ou guard typeof
❌ export default function Componente
❌ import { x } from '../../../shared/...' (use @/features/...)
❌ <img src="..."> para imagens raster (use next/image)
❌ NEXT_PUBLIC_RESEND_API_KEY
❌ className={`${condition ? 'class' : ''}`} (use cn())
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
digital-dog/
├── .env.local                          # Vars de ambiente locais (não commitado)
├── .env.example                        # Template de vars (commitado)
├── next.config.js                      # Sem output standalone
├── tailwind.config.ts                  # Design tokens já configurados
├── tsconfig.json                       # strict mode, alias @/*
├── package.json
│
├── app/                                # Next.js App Router
│   ├── globals.css
│   ├── layout.tsx                      # RootLayout: fonts, ConsentProvider, Header, Footer, WhatsAppFloat
│   ├── page.tsx                        # Homepage — importa seções de features/homepage
│   ├── diagnostico/
│   │   └── page.tsx                    # Página standalone do formulário (opcional)
│   ├── politica-de-privacidade/
│   │   └── page.tsx                    # FR27 — Política de Privacidade (LGPD)
│   ├── servicos/
│   │   └── page.tsx                    # FR6, FR7 — Arquitetura de Marca + Tecnológica
│   ├── hub/
│   │   └── page.tsx                    # FR8 — Hub de Ferramentas (placeholder/teaser)
│   ├── robots.txt                      # SEO básico
│   ├── sitemap.ts                      # Sitemap gerado automaticamente
│   ├── opengraph-image.tsx             # FR26: Open Graph image gerado por Next.js
│   └── api/
│       ├── health/
│       │   └── route.ts                # Health check (já existe)
│       └── diagnostico/
│           └── submit/
│               └── route.ts            # FR12–FR18: validação Zod + Resend email
│
├── features/
│   ├── homepage/
│   │   └── components/
│   │       ├── Hero.tsx                # FR1–FR5: hero mobile, Fred visual, CTA
│   │       ├── FourPillars.tsx         # Posicionamento: 4 pilares da Arquitetura Digital
│   │       ├── HowItWorks.tsx          # Metodologia: Diagnóstico → Estratégia → Execução
│   │       ├── CaseStudies.tsx         # Prova social: casos reais
│   │       ├── PortfolioSection.tsx    # FR9–FR10: galeria de logos (usa PortfolioGrid)
│   │       ├── Testimonials.tsx        # Prova social
│   │       ├── ComparisonTable.tsx     # Diferenciação vs agências tradicionais
│   │       ├── FAQ.tsx                 # FAQ sobre Diagnóstico e serviços
│   │       ├── PainPoints.tsx          # Dores: problemas que o cliente já teve
│   │       └── CTAFinal.tsx            # CTA final da homepage → formulário
│   │
│   ├── diagnostico/
│   │   ├── components/
│   │   │   ├── DiagnosticoForm.tsx     # FR12–FR17: orquestrador do multi-step form
│   │   │   ├── Step1Negocio.tsx        # Step 1: nome + tipo de negócio
│   │   │   ├── Step2Segmento.tsx       # Step 2: segmento de mercado
│   │   │   ├── Step3Desafio.tsx        # Step 3: desafio atual (texto livre — FR14)
│   │   │   ├── Step4Contato.tsx        # Step 4: nome + WhatsApp (FR17)
│   │   │   ├── ProgressBar.tsx         # FR13: barra de progresso visual
│   │   │   ├── SuccessScreen.tsx       # FR16–FR17: Fred + WhatsApp pós-submit
│   │   │   └── FredSVG.tsx             # Fred inline SVG para drawSVG — ⚠️ pendente SVG
│   │   ├── schemas/
│   │   │   ├── step1.schema.ts         # Zod schema step 1
│   │   │   ├── step2.schema.ts         # Zod schema step 2
│   │   │   ├── step3.schema.ts         # Zod schema step 3
│   │   │   └── step4.schema.ts         # Zod schema step 4
│   │   └── types/
│   │       └── diagnostico.types.ts    # DiagnosticoData, FormState types
│   │
│   ├── portfolio/
│   │   ├── components/
│   │   │   ├── PortfolioGrid.tsx       # FR9–FR10: grade de logos navegável
│   │   │   └── PortfolioItem.tsx       # Item individual de portfólio
│   │   └── data/
│   │       └── portfolioItems.ts       # FR11: fonte de dados — Johny edita aqui
│   │
│   ├── analytics/
│   │   └── components/
│   │       ├── MetaPixel.tsx           # FR19–FR21: Meta Pixel condicional ao consentimento
│   │       └── GA4Provider.tsx         # FR22–FR23: GA4 via @next/third-parties
│   │
│   ├── layout/
│   │   └── components/
│   │       ├── Header.tsx              # Navegação global
│   │       └── Footer.tsx              # FR27: link Política de Privacidade
│   │
│   └── shared/
│       ├── ui/
│       │   ├── Button.tsx
│       │   ├── Card.tsx
│       │   ├── Badge.tsx
│       │   ├── Input.tsx
│       │   ├── Accordion.tsx
│       │   ├── AnimatedGradient.tsx
│       │   ├── ImageWithFallback.tsx
│       │   └── WhatsAppFloat.tsx
│       ├── providers/
│       │   └── ConsentProvider.tsx     # FR27–FR29: LGPD — controla Meta Pixel + GA4
│       ├── hooks/
│       │   ├── useConsent.ts           # Hook para ler/escrever estado de consentimento
│       │   └── useGSAP.ts              # Hook helper para gsap.context + cleanup
│       └── utils/
│           ├── cn.ts                   # clsx + tailwind-merge helper
│           └── safeSessionStorage.ts   # try/catch para Safari modo privado
│
└── public/
    ├── portfolio/                      # FR9–FR11: logos dos clientes (webp)
    │   └── .gitkeep
    ├── fred/
    │   └── fred.svg                    # ⚠️ pendente fornecimento
    └── seo/
        └── llms.txt                    # FR25: AIO/GEO indexação por IAs
```

---

### Architectural Boundaries

**API Boundaries:**

| Endpoint | Método | Responsabilidade | FRs |
|---|---|---|---|
| `/api/diagnostico/submit` | POST | Valida (Zod) + email (Resend) + retorna status | FR12, FR18 |
| `/api/health` | GET | Health check Vercel | — |

Sem autenticação no MVP — todas as rotas são públicas.

**Component Boundaries — Fluxo de comunicação:**
```
app/layout.tsx
  └── ConsentProvider          # Client — gerencia consentimento LGPD
      ├── MetaPixel             # renderizado condicionalmente
      └── GA4Provider           # renderizado condicionalmente

app/page.tsx
  └── features/homepage/*      # Server Components onde possível
      └── DiagnosticoForm      # Client Component — RHF + GSAP
          ├── Step1–4          # Client — recebem props, não leem estado diretamente
          └── SuccessScreen    # Client — GSAP drawSVG do Fred
```

**Data Boundaries:**
```
portfolioItems.ts  → import direto em PortfolioSection (Server Component)
                     Sem API call, sem fetch
FormState          → sessionStorage (client) + in-memory fallback
                     Nunca persiste no servidor
Lead data          → POST /api/submit → Resend → email Johny
                     Não armazenado em DB no MVP
```

---

### Requirements to Structure Mapping

| FRs | Arquivo Principal |
|---|---|
| FR1–FR5 (hero, mobile, animações, Fred) | `features/homepage/components/Hero.tsx` |
| FR6–FR7 (serviços) | `app/servicos/page.tsx` |
| FR8 (hub placeholder) | `app/hub/page.tsx` |
| FR9–FR10 (portfólio galeria) | `features/portfolio/components/PortfolioGrid.tsx` |
| FR11 (Johny atualiza portfólio) | `features/portfolio/data/portfolioItems.ts` |
| FR12–FR15 (form multi-step) | `features/diagnostico/components/DiagnosticoForm.tsx` + Steps |
| FR16 (Fred pós-submit) | `features/diagnostico/components/SuccessScreen.tsx` |
| FR17 (WhatsApp pós-submit) | `features/diagnostico/components/SuccessScreen.tsx` |
| FR18 (email de lead) | `app/api/diagnostico/submit/route.ts` + Resend |
| FR19–FR21 (Meta Pixel) | `features/analytics/components/MetaPixel.tsx` + ConsentProvider |
| FR22–FR23 (GA4) | `features/analytics/components/GA4Provider.tsx` |
| FR24 (Schema Markup) | `app/layout.tsx` (JSON-LD inline) |
| FR25 (llms.txt) | `public/seo/llms.txt` |
| FR26 (Open Graph) | `app/layout.tsx` metadata + `app/opengraph-image.tsx` |
| FR27–FR29 (LGPD) | `features/shared/providers/ConsentProvider.tsx` + `app/politica-de-privacidade/` |
| FR30 (erro form sem perda) | `features/shared/utils/safeSessionStorage.ts` |
| FR31 (acessibilidade) | Transversal — todos os componentes interativos |

---

### Integration Points

**Fluxo de dados do formulário:**
```
Usuário preenche form
  → RHF valida com Zod por step
  → sessionStorage persiste estado (com fallback in-memory)
  → Step 4: submit → POST /api/diagnostico/submit
    → Zod valida server-side
    → Resend envia email para Johny
    → Meta Pixel dispara evento Submit (FR20)
    → GA4 registra conversão (FR23)
    → Resposta { success: true }
  → SuccessScreen: Fred drawSVG + WhatsApp revelado
```

**Integrações externas:**

| Serviço | Onde | Tipo |
|---|---|---|
| Resend | `app/api/diagnostico/submit/route.ts` | Server-side SDK |
| Meta Pixel | `features/analytics/MetaPixel.tsx` | Client script condicional |
| GA4 | `features/analytics/GA4Provider.tsx` | Client via @next/third-parties |
| Vercel | Deploy, Logs, Env Vars | Infraestrutura |

---

### .env.example

```bash
# Client-safe (prefixo NEXT_PUBLIC_)
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_WHATSAPP_MESSAGE=

# Server-only (sem prefixo NEXT_PUBLIC_)
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NOTIFICATION_EMAIL=
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
Todas as tecnologias escolhidas são mutuamente compatíveis. Next.js 14 App Router
com TypeScript strict suporta o padrão Server/Client Component com GSAP.
Resend SDK é server-only — não conflita com nenhuma dependência client-side.
React Hook Form + Zod são padrão estabelecido no ecossistema Next.js.
Remoção de Framer Motion e Three.js elimina dois riscos de bundle overflow.

**Pattern Consistency:**
- `gsap.context()` + `'use client'` + `useEffect` são consistentes com SSG
- `cn()` + Tailwind segue o padrão da base já existente
- Named exports em todos os componentes — consistente com App Router conventions
- Alias `@/` já configurado no tsconfig.json existente
- API Route fina + service layer — padrão de separação de responsabilidades

**Structure Alignment:**
Feature-based structure (`features/`) já existe e é mantida/expandida.
API Routes em `app/api/` alinhado com App Router conventions.
Separação Server Component / Client Component explícita por decisão arquitetural.

---

### Requirements Coverage Validation ✅

**Cobertura Funcional — 31/31 FRs cobertos:**

| Categoria | FRs | Status |
|---|---|---|
| Apresentação e Posicionamento | FR1–FR5 | ✅ Hero.tsx + SSG |
| Serviços e Conteúdo | FR6–FR8 | ✅ app/servicos/ + app/hub/ |
| Portfólio e Prova Social | FR9–FR11 | ✅ PortfolioGrid + portfolioItems.ts |
| Captação e Conversão | FR12–FR17, FR30 | ✅ DiagnosticoForm + Steps + useFormPersistence |
| Comunicação Pós-Conversão | FR18 | ✅ API Route + service layer + Resend |
| Analytics | FR19–FR23 | ✅ MetaPixel + GA4Provider + ConsentProvider |
| SEO e Visibilidade | FR24–FR26 | ✅ JSON-LD por página + llms.txt + OG |
| Compliance LGPD | FR27–FR29 | ✅ ConsentProvider + politica-de-privacidade/ |
| Acessibilidade | FR31 | ✅ Transversal — todos os componentes interativos |

**NFRs Cobertos:**
- Performance (P1–P3): SSG + dynamic imports + remoção Three.js (~600kb) + bundle < 200kb
- Segurança (S1–S3): Vercel HTTPS + Zod server validation + ConsentProvider + env vars
- Disponibilidade (AV1): Vercel CDN global — 99.9% SLA
- Integrações (I1–I4): Meta Pixel 100%, GA4 UTM, Resend < 5min, Vercel deploy < 5min

---

### Gap Analysis Results

**Gap 1 — Schema Markup (FR24) — Resolvido:**
Especificação completa por página:
- `LocalBusiness` + `Organization` → `app/layout.tsx` (todas as páginas)
- `Service` → `app/servicos/page.tsx`
- `FAQPage` → `features/homepage/components/FAQ.tsx` (inline JSON-LD)

**Gap 2 — Three.js — Resolvido:**
Remover do MVP: `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`.
⚠️ Ordem obrigatória: deletar `app/playground/` antes de remover do `package.json`.

**Gap 3 — CustomCursor — Resolvido:**
Manter como progressive enhancement — ativo apenas com
`window.matchMedia('(pointer: fine)').matches`. Sem impacto em mobile/touch.

**Gap 4 — useFormPersistence — Resolvido:**
Hook de alto nível em `features/diagnostico/hooks/useFormPersistence.ts`.
Encapsula persist/restore do FormState no sessionStorage com fallback in-memory.
Único ponto de contato com sessionStorage no feature de diagnóstico.

**Gap 5 — Service Layer — Resolvido:**
`features/diagnostico/services/submitDiagnostico.ts`
API Route delega para o service — testável com mock, extensível para DB futuro.

**Estrutura final de diagnostico:**
```
features/diagnostico/
  components/
    DiagnosticoForm.tsx
    Step1Negocio.tsx
    Step2Segmento.tsx
    Step3Desafio.tsx
    Step4Contato.tsx
    ProgressBar.tsx
    SuccessScreen.tsx
    FredSVG.tsx             # ⚠️ pendente SVG
  hooks/
    useFormPersistence.ts
  schemas/
    step1.schema.ts / step2.schema.ts / step3.schema.ts / step4.schema.ts
  services/
    submitDiagnostico.ts
  types/
    diagnostico.types.ts
```

---

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context analisado (31 FRs + NFRs)
- [x] Escala e complexidade avaliadas (baixa-média)
- [x] Constraints técnicas identificadas (SSG, Safari iOS, bundle limit)
- [x] Cross-cutting concerns mapeados (LGPD, performance, SSR guards)

**✅ Architectural Decisions**
- [x] Decisões críticas documentadas com versões
- [x] Stack técnica completamente especificada
- [x] Padrões de integração definidos (Resend, Meta Pixel, GA4)
- [x] Performance endereçada (SSG, remoção Three.js/FM, dynamic imports)

**✅ Implementation Patterns**
- [x] Naming conventions com exemplos e anti-patterns
- [x] Regra 'use client' com árvore de decisão
- [x] GSAP pattern com gsap.context() e cleanup
- [x] API Routes finas + service layer
- [x] sessionStorage com try/catch + hook de alto nível

**✅ Project Structure**
- [x] Árvore de diretórios completa e específica
- [x] Boundaries de componentes definidos
- [x] Integration points mapeados
- [x] Mapeamento FR → arquivo específico completo
- [x] Service layer e hooks de diagnóstico adicionados

---

### Architecture Readiness Assessment

**Status Geral: PRONTO PARA IMPLEMENTAÇÃO**

**Confidence Level:** Alto

**Pontos Fortes:**
- Stack brownfield aproveitada — zero rewrite desnecessário
- SSG como baseline garante performance desde o início
- ConsentProvider antes do analytics elimina risco LGPD no lançamento
- portfolioItems.ts — zero dependências externas, testável por import direto
- Steps como componentes burros — unit tests isolados
- Service layer separa HTTP de negócio — testável e extensível
- Remoção de Three.js + Framer Motion — bundle dentro do limite NFR-P3

**Áreas para Evolução Futura:**
- Autenticação quando Hub de Ferramentas for implementado (Growth)
- Three.js para elemento 3D específico a definir (Growth)
- CRM de leads + persistência em DB — service layer já prepara para isso
- Blog com MDX para SEO de longo prazo (Vision)

---

### Implementation Handoff

**Primeira ação de implementação:**
```bash
# 1. Deletar playground (imports das libs removidas)
rm -rf app/playground/

# 2. Atualizar package.json:
#    Remover: three, @react-three/fiber, @react-three/drei, @types/three,
#             framer-motion, prisma, @prisma/client
#    Adicionar: react-hook-form, zod, @hookform/resolvers, resend

# 3. Remover output: 'standalone' do next.config.js

# 4. Criar .env.local a partir do .env.example

# 5. Implementar ConsentProvider — antes de qualquer outra feature
```

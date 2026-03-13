---
project_name: 'digital-dog'
user_name: 'Johny'
date: '2026-03-11'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'code_quality', 'critical_rules']
existing_patterns_found: 12
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Visual Direction — Technical Brutalism (D1 + A1)

> **Referência canônica:** `features/homepage/components/Hero.tsx` + `HeroAISimulation.tsx`
> Toda nova seção deve ser coerente com o que foi implementado na Hero. Em caso de dúvida, abra o arquivo da Hero antes de começar.

### Estética Geral

**Technical Brutalism** — precisão editorial, contenção como autoridade. Zero ornamento sem função. Cada pixel e cada 0.08s de delay são intencionais. A estética se parece com uma revista de tecnologia de alto padrão rodando no escuro — não uma landing page de template.

- **Referências de nível:** Vercel, Perplexity, Claude.ai — hierarquia por peso tipográfico, não por cor
- **Filosofia:** "Awwwards sem o carnaval" — alto impacto, zero performance visual desnecessária
- **Direção base:** D1 Split Monolith (layout split técnico) + D2 Statement Column (tipografia como arquitetura)
- **Hero escolhido:** A1 — simulação AI na direita, copy + nav na esquerda

---

### Layout da Hero (estrutura canônica)

```
┌─────────────────────────────────┬──────────────────────────────┐
│  [Logo símbolo w-14]  [nav links + CTA border] │                              │
│                                 │   Simulação AI               │
│  • AIO · GEO · ARQUITETURA      │   (HeroAISimulation)         │
│                                 │   full-height, sem offset    │
│  Headline H1                    │                              │
│  clamp(2rem, 3.4vw, 3.4rem)     │   Browser chrome             │
│  font-extrabold tracking-[-0.03em]│  → Google/Gemini panel     │
│  leading-[1.07]                 │  → ChatGPT panel             │
│                                 │   Loop GSAP TextPlugin       │
│  Body text white/60             │                              │
│                                 │                              │
│  [CTA gradient button]          │                              │
│──────────────────────────────── │                              │
│  CLIENTES  Aumivet  Morgan  RZ  │                              │
└─────────────────────────────────┴──────────────────────────────┘
```

- **Grid:** `lg:grid-cols-[52fr_48fr]` — esquerda levemente maior
- **Altura:** `h-screen min-h-[600px]` no desktop, `min-h-screen` no mobile
- **Offset de nav:** `pt-16 lg:pt-0` — mobile tem Header fixo, desktop tem nav embutida na coluna
- **Nav desktop:** `hidden lg:flex` dentro da coluna esquerda — logo símbolo à esquerda, links à direita, tudo dentro do `px-14`
- **Coluna esquerda padding:** `px-8 lg:px-14` — o logo, a headline e os links compartilham o mesmo recuo esquerdo
- **Coluna direita:** zero padding-top — simulação começa no topo absoluto da seção

---

### Sistema de Cores

| Token Tailwind | Valor | Uso |
|---|---|---|
| background | `#0a0a0a` | Fundo de seção — preto fosco, **sem temperatura azulada** |
| `primary-blue` | `#00bcd4` | Estrutural: bordas de card, eyebrow dot, focus ring, CTA border na nav |
| gradient CTA | `#ff6b35 → #ff1744` | Ação exclusiva: botão CTA primário, sublinhado de keyword no H1 |
| `text-white/[0.93]` | — | Headlines H1/H2 |
| `text-white/60` | — | Corpo de texto, parágrafos |
| `text-white/35` | — | Texto muted (nomes de clientes, metadados) |
| `text-white/[0.16]` | — | Labels, eyebrows (ALL CAPS, tracking largo) |
| `border-white/[0.07]` | — | Divisórias de seção, separadores de coluna |
| `border-white/[0.04]` | — | Bordas ultra-sutis (browser chrome da simulação) |

**Regra do acento duplo:**
- **Cyan** → sempre frio, estrutural. Nunca em CTAs ou elementos de ação.
- **Gradiente** → sempre quente, ação. Nunca em bordas decorativas ou separadores.

---

### Tipografia

```tsx
// H1 — exatamente como na Hero
className="font-heading font-extrabold leading-[1.07] tracking-[-0.03em] text-white/[0.93]"
style={{ fontSize: 'clamp(2rem, 3.4vw, 3.4rem)' }}

// H2 (seções internas) — seguir o mesmo padrão de tracking negativo
// fontSize: clamp(1.75rem, 3vw, 2.75rem)

// Eyebrow (label de seção)
className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/[0.16]"
// precedido por: <span className="w-1 h-1 rounded-full bg-primary-blue" />

// Body
className="text-base text-white/60 leading-[1.75]"

// Label / meta pequeno
className="text-[10px] tracking-[0.1em] uppercase text-white/[0.16]"
```

---

### Componentes e Padrões

**Botão CTA primário** (como na Hero):
```tsx
className="inline-flex items-center gap-2.5 font-body text-sm font-semibold px-6 py-[13px] rounded-[7px] text-white min-h-[44px]"
style={{ background: 'linear-gradient(135deg, #ff6b35, #ff1744)' }}
```

**Botão CTA secundário / nav** (como "Solicitar Diagnóstico"):
```tsx
className="text-sm font-medium px-4 py-2 rounded border border-primary-blue text-primary-blue
           hover:bg-primary-blue hover:text-dark-blue transition-all duration-200"
// sem glow, sem sombra — fill suave só no hover
```

**Card (padrão D1):**
- `border-l-2 border-primary-blue` — acento cyan à esquerda
- `background: rgba(255,255,255,0.03)` + `backdrop-blur`
- `border: 1px solid rgba(255,255,255,0.08)` — borda fina, não container pesado
- Índice `01`, `02`... em cyan; divisor interno `1px solid rgba(255,255,255,0.06)`

**Divisória de seção:**
```tsx
className="border-t border-white/[0.07]"  // nunca gradiente, sempre 1px
```

---

### Anti-Patterns — NUNCA fazer

| ❌ Proibido | ✅ Alternativa |
|---|---|
| Blob gradients / orbs flutuantes no background | SVG técnico geométrico (grid, rings) |
| Múltiplos glows simultâneos | No máximo 1 drop-shadow sutil em elemento único |
| `box-shadow` pulsante em botão por default | Fill suave só no hover |
| Seção com gradiente dramático de fundo | `#0a0a0a` sólido + linha `1px` de separação |
| Menu mobile slide lateral | Overlay full-screen `bg-black/95 backdrop-blur-md` |
| Timeline vertical numerada para "Como Funciona" | Diagrama de ecossistema |
| Fred centralizado grande no hero | Fred como símbolo de nav, animação pós-submit |
| `framer-motion` em código novo | GSAP exclusivamente |
| `<img>` para raster | `next/image` |
| Gradiente em borda decorativa ou separador | `rgba(255,255,255,0.07)` sólido |

---

### Animações (GSAP)

- **Entrada de seção:** `clip-path` + `y-transform` em stagger — nunca fadeIn simples
- **Hover de card:** `border-left` transparent → cyan em `0.15s ease`
- **Simulação AI (Hero):** GSAP TextPlugin digitando queries, loop entre Google/ChatGPT
- **Velocidade:** suave, nunca urgente. Durations: `0.3–0.45s` micro, `0.8–1.2s` reveal de seção
- **Obrigatório em todo componente animado:**
```tsx
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
// + gsap.context() com cleanup no return do useEffect
```

---

## Technology Stack & Versions

| Tecnologia | Versão | Notas |
|---|---|---|
| Next.js | 14.2 | App Router — não Pages Router |
| React | 18.3 | |
| TypeScript | 5.6 | strict mode obrigatório |
| Tailwind CSS | 3.4 | design tokens em tailwind.config.ts |
| GSAP | 3.14 + @gsap/react 2.1 | sistema de animação principal |
| Lenis | @studio-freight/react-lenis | smooth scroll global |
| clsx + tailwind-merge | latest | via `lib/utils.ts` |
| lucide-react | 0.554 | ícones |
| React Hook Form | a instalar | forms multi-step |
| Zod | a instalar | validação de schemas |
| Resend | a instalar | email de notificação de lead |
| Vercel | — | deploy, serverless, env vars |

**Dependências a REMOVER antes de qualquer implementação:**
- `framer-motion` — substituído por GSAP
- `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` — fora do MVP
- `prisma`, `@prisma/client` — projeto sem banco de dados

---

## Critical Implementation Rules

### 🔴 Fixes Obrigatórios (fazer ANTES de qualquer feature)

1. **Deletar `app/playground/`** — contém imports de libs removidas; delete ANTES de remover do package.json, ou o build quebra
2. **Remover `output: 'standalone'`** de `next.config.js` — configurado para Docker (removido); Vercel não precisa disso
3. **Atualizar metadata** em `app/layout.tsx` — título ainda diz "Medicina Veterinária"; atualizar para posicionamento de Arquitetura Digital
4. **Remover Prisma** do `package.json` e scripts `db:*`
5. **Implementar `ConsentProvider`** antes de qualquer componente de analytics

---

### Paths e Imports

- `cn()` está em **`@/lib/utils`** — NÃO em `@/features/shared/utils/cn`
- Todos os outros imports usam `@/features/...`
- Nunca usar paths relativos entre features (`../../../`)
- Alias `@/*` → `./` (configurado em tsconfig.json)

```ts
// ✅ CORRETO
import { cn } from '@/lib/utils'
import { Hero } from '@/features/homepage/components/Hero'

// ❌ ERRADO
import { cn } from '@/features/shared/utils/cn'  // não existe
import { Hero } from '../../../features/homepage/components/Hero'
```

---

### TypeScript & Exports

- TypeScript strict mode ativo — sem `any` implícito, sem nulls soltos
- **Sempre named exports** — nunca `export default` em componentes
- `'use client'` obrigatório em TODO componente com hooks, GSAP, ou browser APIs
- App Router default = Server Component — qualquer acesso client-side precisa da diretiva

```ts
// ✅ CORRETO
export function Hero() { ... }
export function useConsent() { ... }

// ❌ ERRADO
export default function Hero() { ... }
```

---

### GSAP — Padrão Obrigatório

Framer Motion está sendo REMOVIDO do projeto. Todo código de animação usa GSAP.
**Nunca importar `framer-motion`** em código novo.

```ts
'use client'  // obrigatório

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function MinhaSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ✅ SEMPRE verificar prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // ✅ SEMPRE usar gsap.context() com ref + cleanup
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { opacity: 0, y: 30 })
      ScrollTrigger.create({ ... })
    }, ref)

    return () => ctx.revert()  // cleanup obrigatório
  }, [])

  return <div ref={ref}>...</div>
}
```

`globals.css` já desativa animações CSS com `prefers-reduced-motion`.
GSAP precisa do guard JS adicional acima.

---

### SSR / SSG Guards

Next.js SSG renderiza no servidor — `window`, `document`, `sessionStorage` não existem nesse contexto.

```ts
// ✅ CORRETO — dentro de useEffect
useEffect(() => {
  const width = window.innerWidth
  sessionStorage.setItem('key', 'value')
}, [])

// ✅ CORRETO — guard explícito
if (typeof window === 'undefined') return null

// ❌ ERRADO — fora de useEffect
const width = window.innerWidth  // ReferenceError no build
gsap.from('.hero', {})           // ReferenceError no build
```

---

### sessionStorage com Fallback

Safari em modo privado bloqueia sessionStorage. Sempre usar try/catch:

```ts
function safeGet(key: string): string | null {
  try { return sessionStorage.getItem(key) }
  catch { return null }
}

function safeSet(key: string, value: string): void {
  try { sessionStorage.setItem(key, value) }
  catch { /* fallback in-memory silencioso */ }
}
```

---

### Tailwind — Composição de Classes

```ts
// ✅ SEMPRE cn() para classes condicionais
import { cn } from '@/lib/utils'
<div className={cn('base-class', condition && 'conditional-class', className)}>

// ❌ NUNCA template literals para condicionais
<div className={`base-class ${condition ? 'yes' : ''}`}>
```

**Design tokens disponíveis:**
- Cores: `primary-blue`, `dark-blue`, `darker-blue`, `light-blue`, `gradient-orange`, `gradient-pink`
- Fontes: `font-heading` (Space Grotesk), `font-body` (Inter)
- Shadows: `shadow-card`, `shadow-card-hover`
- CSS vars: `--primary-blue`, `--gradient-primary`, etc. (em globals.css)

---

### Next.js Image

```tsx
// ✅ SEMPRE next/image para imagens raster
import Image from 'next/image'
<Image src="/portfolio/cliente.webp" alt="..." width={200} height={100} />

// ❌ NUNCA <img> tag para imagens raster
// Exceção: SVG inline para animação GSAP drawSVG (FredSVG.tsx)
```

---

### API Routes — Padrão Thin

API Routes são finas (HTTP only). Lógica de negócio vai em services.

```ts
// app/api/diagnostico/submit/route.ts
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = schema.parse(body)        // ZodError se inválido
    await submitDiagnostico(data)          // delega para service
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Dados inválidos' }, { status: 400 })
    }
    console.error('[submit]', error)       // log servidor apenas — nunca ao client
    return NextResponse.json({ success: false, error: 'Erro interno.' }, { status: 500 })
  }
}
```

---

### Environment Variables — Segurança

| Variável | Tipo | Regra |
|---|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | Client-safe | Usado no browser |
| `NEXT_PUBLIC_GA4_ID` | Client-safe | Usado no browser |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Client-safe | Exibido no browser |
| `NEXT_PUBLIC_WHATSAPP_MESSAGE` | Client-safe | Exibido no browser |
| `RESEND_API_KEY` | **Server-only** | ❌ NUNCA prefixo NEXT_PUBLIC_ |
| `RESEND_FROM_EMAIL` | **Server-only** | Usado na API Route |
| `NOTIFICATION_EMAIL` | **Server-only** | Email destino dos leads |

---

### ConsentProvider — Analytics Condicional

Meta Pixel e GA4 só carregam após consentimento LGPD.
**Nunca injetar Meta Pixel diretamente no `<head>` sem verificar consentimento.**

```tsx
// ✅ CORRETO — dentro do ConsentProvider
const { hasConsented } = useConsent()
return hasConsented ? <MetaPixel /> : null

// ❌ ERRADO — atual em layout.tsx (a ser corrigido como fix obrigatório #5)
<head><MetaPixel /></head>  // sem verificação de consentimento
```

---

### Portfólio — Fonte de Dados

Portfolio NÃO tem API. Dados vêm de import estático:

```ts
// ✅ CORRETO
import { portfolioItems } from '@/features/portfolio/data/portfolioItems'

// ❌ ERRADO
const items = await fetch('/api/portfolio')  // não existe
```

---

### Fred SVG — Animação drawSVG

O SVG do Fred deve ser **inline no DOM** (não `<img>`).
Requisito técnico do plugin GSAP `drawSVG` que anima os paths SVG.

```tsx
// ✅ CORRETO — SVG inline como componente React
export function FredSVG() {
  return <svg viewBox="..."><path id="fred-outline" d="..." /></svg>
}

// ❌ ERRADO — não permite drawSVG
<Image src="/fred/fred.svg" alt="Fred" width={200} height={200} />
```

⚠️ **Arquivo SVG pendente** — `FredSVG.tsx` e `SuccessScreen.tsx` bloqueados até o SVG ser fornecido.

---

### Estrutura de Arquivos

```
features/
  homepage/components/    → seções da homepage (Server Components onde possível)
  diagnostico/
    components/           → DiagnosticoForm, Steps, SuccessScreen, FredSVG
    hooks/                → useFormPersistence.ts
    schemas/              → step1-4.schema.ts (Zod)
    services/             → submitDiagnostico.ts
    types/                → diagnostico.types.ts
  portfolio/
    components/           → PortfolioGrid, PortfolioItem
    data/                 → portfolioItems.ts ← Johny edita aqui
  analytics/components/   → MetaPixel, GA4Provider
  layout/components/      → Header, Footer
  shared/
    ui/                   → componentes reutilizáveis
    providers/            → ConsentProvider
    hooks/                → useConsent, useGSAP
lib/
  utils.ts                → cn() helper (clsx + tailwind-merge)
app/
  layout.tsx              → RootLayout + ConsentProvider + fonts
  page.tsx                → Homepage
  api/diagnostico/submit/ → API Route (form submit + Resend)
public/
  portfolio/              → logos dos clientes (.webp)
  fred/                   → fred.svg (⚠️ pendente)
  seo/llms.txt            → AIO/GEO indexação
```

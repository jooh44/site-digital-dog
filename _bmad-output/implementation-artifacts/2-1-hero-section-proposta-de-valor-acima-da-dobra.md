# Story 2.1: Hero Section — Proposta de Valor Acima da Dobra

Status: review

## Story

Como visitante,
quero ver imediatamente o posicionamento e a proposta de valor da Digital Dog ao abrir o site,
para que entenda em segundos o que a empresa oferece e tenha um caminho claro de ação. (FR1, FR5)

## Acceptance Criteria

1. Headline visível above the fold em qualquer dispositivo: "Ações isoladas não constroem negócios. Ecossistemas constroem."
2. Subheadline visível: "Marca, tecnologia e presença — num único ecossistema, com um único ponto de inteligência."
3. CTA primário "Quero meu Diagnóstico Digital →" visível e clicável
4. CTA secundário "Ver como funciona" ancora à seção How It Works
5. SVG do Fred visível como elemento de identidade (via Header, conforme Story 1.3)
6. Mobile (< 768px): hierarquia legível sem scroll horizontal; CTAs com tap target ≥ 44×44px
7. `prefers-reduced-motion`: animação GSAP desativada; conteúdo visível estaticamente
8. Animação GSAP de entrada: stagger suave para headline, subheadline e CTAs
9. Background: grid técnico SVG sutil (NÃO AnimatedGradient com orbs)
10. CLS = 0 durante toda a animação de entrada

## Tasks / Subtasks

- [x] Criar `features/homepage/components/Hero.tsx` (AC: #1, #2, #3, #4, #6)
  - [x] `'use client'` — usa useRef, useEffect e GSAP
  - [x] Named export: `export function Hero()`
  - [x] Estrutura: `<section>` com `ref={containerRef}` para GSAP context
  - [x] Headline, subheadline, CTAs como elementos inicialmente visíveis (não hidden para SEO)
  - [x] CTA primário: abre modal de diagnóstico (integração futura Epic 3 — usar `onClick` com placeholder por ora)
  - [x] CTA secundário: `<a href="#how-it-works">` para smooth scroll
- [x] Background: grid técnico SVG (AC: #9)
  - [x] SVG inline ou componente separado com grid de linhas finas
  - [x] Cor: `rgba(0, 188, 212, 0.05)` (primary-blue com baixa opacidade)
  - [x] `aria-hidden="true"` no SVG decorativo
- [x] Animação GSAP de entrada (AC: #7, #8, #10)
  - [x] `useEffect` com `gsap.context()` + `return () => ctx.revert()`
  - [x] Verificar `prefers-reduced-motion` antes de qualquer animação
  - [x] `gsap.from()` com stagger: headline → subheadline → CTAs
  - [x] Opacidade inicial nos elementos APENAS quando não há `prefers-reduced-motion`
  - [x] CLS = 0: nenhum elemento com posicionamento dinâmico que cause shift
- [x] Adicionar `id="how-it-works"` à seção HowItWorks para o CTA secundário ancorar
- [x] Integrar Hero em `app/page.tsx`

## Dev Notes

### Estrutura do Componente

```tsx
// features/homepage/components/Hero.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/features/shared/utils/cn'

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return  // conteúdo já visível estaticamente

    const ctx = gsap.context(() => {
      gsap.from('[data-hero-animate]', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
      aria-label="Hero — Proposta de Valor"
    >
      {/* Background: grid técnico SVG */}
      <TechGridBackground />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1
          data-hero-animate
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-space-grotesk leading-tight mb-6"
        >
          Ações isoladas não constroem negócios.{' '}
          <span className="text-primary-blue">Ecossistemas constroem.</span>
        </h1>

        <p
          data-hero-animate
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 font-inter"
        >
          Marca, tecnologia e presença — num único ecossistema, com um único ponto de inteligência.
        </p>

        <div data-hero-animate className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* CTA Primário */}
          <button
            className="px-8 py-4 bg-primary-blue text-dark-blue font-semibold rounded-xl hover:bg-primary-blue/90 transition-all min-h-[44px] min-w-[44px]"
            onClick={() => { /* abrir modal diagnóstico — Epic 3 */ }}
          >
            Quero meu Diagnóstico Digital →
          </button>

          {/* CTA Secundário */}
          <a
            href="#how-it-works"
            className="px-8 py-4 border border-white/20 text-white/80 rounded-xl hover:border-white/40 hover:text-white transition-all min-h-[44px] flex items-center justify-center"
          >
            Ver como funciona
          </a>
        </div>
      </div>
    </section>
  )
}
```

### Background — Tech Grid SVG

Substituir AnimatedGradient (com orbs pulsantes removido por decisão UX) por grid técnico:

```tsx
function TechGridBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(0,188,212,0.05)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}
```

### GSAP — Regras de Implementação

```tsx
// ✅ SEMPRE: gsap.context() + ref do container + cleanup
useEffect(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  const ctx = gsap.context(() => {
    gsap.from('[data-hero-animate]', {
      opacity: 0, y: 20, duration: 0.6, stagger: 0.15, ease: 'power2.out'
    })
  }, containerRef)

  return () => ctx.revert()  // cleanup obrigatório
}, [])

// ❌ NUNCA: gsap fora de useEffect
gsap.from('.hero', { opacity: 0 })
```

### CLS = 0 — Como Garantir

Elementos NÃO devem começar com `opacity: 0` no CSS/Tailwind — isso causa CLS ao tornar visível. Em vez disso, GSAP seta `opacity: 0` programaticamente **dentro do useEffect**, após hidratação. No SSR/SSG, elementos são renderizados normalmente (visíveis).

```tsx
// ✅ Correto: elementos visíveis no SSG, GSAP anima na hidratação
<h1 data-hero-animate>...</h1>

// ❌ Errado: invisível no SSG (CLS ao aparecer)
<h1 data-hero-animate className="opacity-0">...</h1>
```

### Design Tokens

```
primary-blue: #00bcd4
dark-blue: #0a0e1a
Space Grotesk: headings
Inter: body
```

### Integração em app/page.tsx

```tsx
// app/page.tsx
import { Hero } from '@/features/homepage/components/Hero'
// outros imports por vir

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Seções adicionadas nas Stories 2.2–2.7 */}
    </>
  )
}
```

### Project Structure Notes

```
features/homepage/components/Hero.tsx  ← criar aqui
app/page.tsx                           ← integrar Hero
```

⚠️ `components/sections/Hero.tsx` já existia na base brownfield — o novo Hero vai em `features/homepage/components/Hero.tsx`. Verificar se o arquivo antigo ainda existe e pode ser ignorado/deletado.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#GSAP — Padrão de Inicialização]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Hero Section]
- [Source: _bmad-output/planning-artifacts/prd.md#FR1, FR5]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Reescrito `features/homepage/components/Hero.tsx` com novo posicionamento Digital Dog (removido conteúdo veterinário antigo + AnimatedGradient)
- `TechGridBackground`: SVG inline com grid 60×60px, stroke `rgba(0,188,212,0.05)`, `aria-hidden="true"`
- GSAP: `gsap.context()` + `prefers-reduced-motion` guard + cleanup `ctx.revert()` — padrão obrigatório aplicado
- CLS = 0 garantido: elementos sem `opacity-0` no HTML; GSAP anima apenas após hidratação client-side
- `id="how-it-works"` adicionado à seção em `HowItWorks.tsx` (substituindo `id="processo"`)
- `app/page.tsx` já importava Hero corretamente (`@/features/homepage/components/Hero`) — integração mantida
- Build passou sem erros TypeScript ou lint: `✓ Compiled successfully`
- Importação `cn` removida do Hero pois não havia classes condicionais — seguindo project-context (`@/lib/utils`, não `@/features/shared/utils/cn`)

### File List

- `features/homepage/components/Hero.tsx` — reescrito (Hero A1: split layout 52/48, eyebrow, h1 com gradient underline, CTA gradiente, trust strip)
- `features/homepage/components/HeroAISimulation.tsx` — criado (painel direito: simulação Google+Gemini AI Overview / ChatGPT, GSAP TextPlugin, loop 3 queries × 3 clientes)
- `features/homepage/components/HowItWorks.tsx` — `id="processo"` → `id="how-it-works"`
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — status atualizado

### Change Log

- 2026-03-12 (v2): Hero A1 implementado conforme decisão final do stakeholder (ux-design-specification.md). Split layout 52/48, simulação Google/ChatGPT com GSAP TextPlugin, cycling 3 queries reais, background matte black #0a0a0a.
- 2026-03-12 (v1): Implementação inicial descartada — não estava alinhada com direção visual A1.

# Story 2.3: Metodologia — How It Works — Diagrama de Ecossistema

Status: ready-for-dev

## Story

Como visitante,
quero entender como o ecossistema da Digital Dog funciona na prática,
para que visualize o sistema completo antes de solicitar o Diagnóstico. (FR3, FR4)

## Acceptance Criteria

1. Diagrama de ecossistema com nós conectados: Marca ↔ Site ↔ SEO ↔ AIO ↔ Automações
2. Linhas conectoras SVG animadas via GSAP ScrollTrigger (stroke-dasharray + stroke-dashoffset)
3. Diagrama NÃO é timeline linear numerada
4. `prefers-reduced-motion`: diagrama exibido estático sem animação de linhas, nós e labels legíveis
5. Mobile: responsivo sem overflow horizontal; nós com tap target ≥ 44×44px se interativos
6. CTA secundário "Ver como funciona" do hero ancora suavemente para esta seção
7. `id="how-it-works"` na seção para ancoragem

## Tasks / Subtasks

- [ ] Criar `features/homepage/components/HowItWorks.tsx` (AC: #1, #3, #7)
  - [ ] `'use client'` — usa GSAP e useRef
  - [ ] Named export: `export function HowItWorks()`
  - [ ] `id="how-it-works"` na tag `<section>`
  - [ ] Layout: diagrama centralizado com nós e linhas conectoras SVG
- [ ] Implementar SVG do diagrama de ecossistema (AC: #1, #2)
  - [ ] SVG responsivo com `viewBox` configurado
  - [ ] Linhas conectoras com `stroke-dasharray` para animação
  - [ ] Nós: círculos ou retângulos com label (Marca, Site, SEO, AIO, Automações)
  - [ ] Fred no centro como elemento de inteligência
- [ ] Animação GSAP das linhas (AC: #2)
  - [ ] `useEffect` + `gsap.context()` + `return () => ctx.revert()`
  - [ ] `prefers-reduced-motion` guard obrigatório
  - [ ] ScrollTrigger: start animation quando seção entra no viewport
  - [ ] Animar `stroke-dashoffset` de comprimento total → 0 com stagger por linha
- [ ] Responsividade mobile (AC: #5)
  - [ ] Diagrama adapta layout em mobile (nós menores, linhas ajustadas)
  - [ ] Alternativa mobile: layout vertical simplificado se SVG complexo demais para < 375px
- [ ] Verificar smooth scroll da âncora (AC: #6)
  - [ ] `scroll-behavior: smooth` em `html` ou Lenis smooth scroll (se instalado)

## Dev Notes

### Estrutura do SVG do Ecossistema

O diagrama deve ser um SVG inline (não `<img>`) para que GSAP possa manipular os elementos SVG individualmente.

```tsx
// features/homepage/components/HowItWorks.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Obter comprimento de cada linha para stroke-dasharray
      const lines = svgRef.current?.querySelectorAll('[data-connector-line]')
      lines?.forEach((line) => {
        const length = (line as SVGPathElement).getTotalLength?.() || 200
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            once: true,
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="py-24 px-4 border-t border-white/[0.08]"
    >
      <h2 className="text-3xl md:text-4xl font-bold font-space-grotesk text-center mb-16">
        O Ecossistema Digital Dog
      </h2>

      <div className="max-w-4xl mx-auto">
        <svg
          ref={svgRef}
          viewBox="0 0 800 400"
          className="w-full h-auto"
          aria-label="Diagrama do ecossistema Digital Dog: Marca, Site, SEO, AIO e Automações conectados"
        >
          {/* Linhas conectoras */}
          <line
            data-connector-line
            x1="160" y1="200" x2="320" y2="200"
            stroke="#00bcd4" strokeWidth="1.5" strokeOpacity="0.4"
          />
          {/* ... demais linhas ... */}

          {/* Nós */}
          {/* Marca, Site (centro), SEO, AIO, Automações */}
        </svg>
      </div>
    </section>
  )
}
```

### Layout do Diagrama (Desktop)

```
    [Marca]
       ↕
[AIO] ← [Fred/Site] → [SEO]
       ↕
  [Automações]
```

Ou layout em linha horizontal para desktop:
```
[Marca] — [Site] — [SEO] — [AIO] — [Automações]
            ↑
          [Fred]
```

### Layout Mobile

Para mobile (< 768px), o SVG pode ficar pequeno demais. Alternativas:
1. SVG responsivo com `viewBox` menor e nós maiores (recomendado)
2. Layout alternativo em coluna com CSS (evita SVG complexo em mobile)

```tsx
// Visível apenas em mobile - layout simplificado em coluna
<div className="md:hidden flex flex-col gap-4 items-center">
  {nodes.map(node => (
    <div key={node} className="border border-white/[0.08] rounded-xl px-6 py-3 text-sm">
      {node}
    </div>
  ))}
</div>

// SVG - visível apenas em desktop
<svg className="hidden md:block w-full h-auto" ...>
```

### Animação das Linhas SVG

A técnica `stroke-dasharray + stroke-dashoffset` é o padrão de "draw-on" para SVG:

```ts
// 1. Obter comprimento total da linha
const totalLength = line.getTotalLength()

// 2. Configurar: linha "apagada" (dashoffset = length)
gsap.set(line, { strokeDasharray: totalLength, strokeDashoffset: totalLength })

// 3. Animar para "aparecer" (dashoffset → 0)
gsap.to(line, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' })
```

⚠️ `getTotalLength()` funciona apenas no browser — chamar dentro de `useEffect`.

### `prefers-reduced-motion`

Com `prefers-reduced-motion: reduce`, o SVG é exibido com as linhas visíveis desde o início (sem `stroke-dashoffset` configurado), apenas os nós e labels são renderizados normalmente.

### Smooth Scroll

Se Lenis não estiver instalado/configurado, adicionar ao `globals.css`:
```css
html {
  scroll-behavior: smooth;
}
```

### Project Structure Notes

```
features/homepage/components/HowItWorks.tsx  ← criar aqui
app/page.tsx                                  ← integrar após FourPillars
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#How It Works]
- [Source: _bmad-output/planning-artifacts/architecture.md#GSAP — Padrão de Inicialização]
- [Source: _bmad-output/planning-artifacts/prd.md#FR3, FR4]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

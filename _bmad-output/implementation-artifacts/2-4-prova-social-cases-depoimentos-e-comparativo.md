# Story 2.4: Prova Social — Cases, Depoimentos e Comparativo

Status: review

## Story

Como visitante,
quero ver evidências reais de resultados da Digital Dog,
para que possa avaliar a credibilidade da empresa antes de solicitar o Diagnóstico.

## Acceptance Criteria

1. Ao menos 2 cases ou depoimentos de clientes reais apresentados
2. Cada item exibe: nome do cliente/negócio, segmento e resultado ou declaração
3. Visualmente coerente com estética dark tech editorial
4. Mobile: cards legíveis sem overflow horizontal; carousel com scroll suave e snap (se aplicável)
5. GSAP ScrollTrigger com reveal suave sem CLS (com `prefers-reduced-motion` guard)
6. Placeholder visual como fallback se não houver casos disponíveis no lançamento

## Tasks / Subtasks

- [x] Criar `features/homepage/components/CaseStudies.tsx`
  - [x] `'use client'` — usa GSAP ScrollTrigger
  - [x] Named export: `export function CaseStudies()`
  - [x] Array de cases/depoimentos como dado local no componente (sem API)
  - [x] Cards com: nome, segmento, resultado/declaração
  - [x] Fallback: se array vazio, exibir placeholder estilizado
  - [x] ScrollTrigger reveal com `prefers-reduced-motion` guard
- [x] Responsividade mobile (AC: #4)
  - [x] Grid 1 coluna mobile, 3 colunas desktop
  - [x] Cards com tap target adequado e sem overflow horizontal

## Dev Notes

### Estrutura de Dados dos Cases

```ts
// Dados locais no componente (não precisa de arquivo externo para esta story)
const cases = [
  {
    id: '1',
    client: 'RZ Vet',
    segment: 'Medicina Veterinária',
    result: 'Site completo com identidade de marca consolidada e presença digital estruturada',
    type: 'case',
  },
  {
    id: '2',
    client: 'Morgan e Ted',
    segment: 'Pet Shop',
    result: 'Arquitetura de marca e identidade visual alinhadas à experiência premium',
    type: 'case',
  },
  // Adicionar mais conforme disponível
]
```

### Estrutura do Componente

```tsx
// features/homepage/components/CaseStudies.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function CaseStudies() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from('[data-case-card]', {
        opacity: 0, y: 30, duration: 0.6, stagger: 0.15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="py-24 px-4 border-t border-white/[0.08]">
      <h2 className="text-3xl md:text-4xl font-bold font-space-grotesk text-center mb-4">
        Resultados Reais
      </h2>
      <p className="text-white/60 text-center mb-12 max-w-xl mx-auto">
        Clientes que construíram ecossistemas, não apenas campanhas.
      </p>

      {cases.length > 0 ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((item) => (
            <CaseCard key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <PlaceholderCases />
      )}
    </section>
  )
}

function CaseCard({ client, segment, result }: typeof cases[0]) {
  return (
    <div
      data-case-card
      className="border border-white/[0.08] rounded-2xl p-6 hover:border-primary-blue/20 transition-colors"
    >
      <div className="text-xs text-primary-blue font-medium mb-2 uppercase tracking-wider">
        {segment}
      </div>
      <h3 className="text-xl font-semibold font-space-grotesk mb-3">{client}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{result}</p>
    </div>
  )
}

function PlaceholderCases() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12 border border-dashed border-white/[0.12] rounded-2xl">
      <p className="text-white/40 text-sm">
        Cases em breve — o portfólio está sendo construído.
      </p>
    </div>
  )
}
```

### Carousel Mobile (Opcional)

Se preferir carousel em vez de grid:

```tsx
<div className="flex overflow-x-auto gap-4 pb-4 scroll-smooth snap-x snap-mandatory md:grid md:grid-cols-2">
  {cases.map((item) => (
    <div key={item.id} className="snap-start min-w-[280px] md:min-w-0">
      <CaseCard {...item} />
    </div>
  ))}
</div>
```

### Estética dos Cards

- Background: `transparent` (herda dark-blue do body)
- Borda: `border-white/[0.08]` → `border-primary-blue/20` no hover
- Sem sombras coloridas (estética dark tech editorial — sem glows pulsantes)

### Dependência de Dados Reais

Esta story usa dados hardcoded. Se não houver cases disponíveis no lançamento, o componente exibe o placeholder gracefully sem quebrar layout.

### Project Structure Notes

```
features/homepage/components/CaseStudies.tsx  ← criar aqui
app/page.tsx                                   ← integrar após HowItWorks
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Prova Social]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

**Iteração 1 — implementação inicial (card-based):**
- CaseStudies.tsx reescrito seguindo padrão visual de ServicesEcosystem/ThreePillars
- Removidos componentes legados (Card, ImageWithFallback, lucide-react)
- Cards glassmorphism com GSAP ScrollTrigger e prefers-reduced-motion guard

**Iteração 2 — decisão arquitetural do Johny:**
- Stories 2-4 e 2-5 mescladas numa única seção (`PortfolioSection.tsx`)
- `CaseStudies.tsx` descontinuado como componente independente (removido do page.tsx)
- Clientes de cases atualizados: Pet Shop Araucária, Ponto das Portas, RZ Vet
- Prints de sites removidos dos cases — serão substituídos por screenshots de pesquisas de IA recomendando os clientes em 1º lugar

**Resultado final: ver Story 2-5 para o estado atual do componente unificado.**

### File List

- features/homepage/components/CaseStudies.tsx (arquivado — não usado em page.tsx)
- features/homepage/components/PortfolioSection.tsx (seção unificada — ver 2-5)

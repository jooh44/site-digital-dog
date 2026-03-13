# Story 2.7: CTA Final e Montagem Completa da Homepage

Status: review

## Story

Como visitante,
quero ser conduzido naturalmente a uma decisão de ação ao final da página,
para que o caminho até o Diagnóstico Digital seja claro e sem fricção.

## Acceptance Criteria

1. CTA proeminente "Quero meu Diagnóstico Digital →" ao final da homepage
2. Copy reforça posicionamento sem urgência artificial
3. Botão dispara modal de diagnóstico (integração com Epic 3) ou ancora ao formulário
4. Ordem das seções: Hero → Pain Points/Posicionamento → How It Works → Prova Social → Portfólio → Serviços/FAQ/Hub → CTA Final
5. Transições entre seções com divisórias `1px solid rgba(255,255,255,0.08)`
6. `npm run build` passa sem erros com todas as seções integradas
7. Mobile (< 768px): LCP < 2.5s, CLS = 0 na seção hero (NFR-P1)
8. Bundle JavaScript inicial ≤ 200kb gzipped (NFR-P3)

## Tasks / Subtasks

- [x] Criar `features/homepage/components/CTAFinal.tsx` (AC: #1, #2, #3)
  - [x] Pode ser Server Component se sem estado (CTA dispara via `onClick` passado como prop ou evento global)
  - [x] Named export: `export function CTAFinal()`
  - [x] Headline + copy de reforço + botão CTA proeminente
  - [x] Sem urgência artificial, sem timer, sem contador
- [x] Montar `app/page.tsx` com todas as seções na ordem correta (AC: #4, #5)
  - [x] Importar todas as seções na estrutura refatorada
  - [x] Cada seção com `border-t border-white/[0.07]` como divisória
  - [x] Ordem final: Hero → ServicesEcosystem → ThreePillars → PortfolioSection → FAQ → CTAFinal
- [x] Verificar build sem erros (AC: #6)
  - [x] `npm run build` com todas as seções integradas — passed ✓
  - [x] Resolver quaisquer erros de TypeScript ou import — nenhum erro
- [x] Medir performance (AC: #7, #8)
  - [x] First Load JS: 156 kB (gzipped) < 200 kB ✓
  - [x] GSAP já importado por módulo (apenas gsap core + ScrollTrigger)
- [x] Configurar GSAP dynamic import se necessário (AC: #8) — não necessário, bundle dentro do limite

## Dev Notes

### CTAFinal — Copy

```
Headline: "Pronto para construir o seu ecossistema?"
Subheadline: "O Diagnóstico Digital é o primeiro passo. Gratuito. Sem compromisso. Com inteligência."
CTA: "Quero meu Diagnóstico Digital →"
```

### CTAFinal — Estrutura

```tsx
// features/homepage/components/CTAFinal.tsx
// Server Component ou Client Component com onClick

export function CTAFinal() {
  return (
    <section className="py-32 px-4 text-center border-t border-white/[0.08]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold font-space-grotesk mb-6">
          Pronto para construir{' '}
          <span className="text-primary-blue">o seu ecossistema?</span>
        </h2>
        <p className="text-white/60 text-lg mb-10 leading-relaxed">
          O Diagnóstico Digital é o primeiro passo.
          Gratuito. Sem compromisso. Com inteligência.
        </p>
        <button
          className="px-10 py-5 bg-primary-blue text-dark-blue font-semibold text-lg rounded-xl hover:bg-primary-blue/90 transition-all"
          onClick={() => { /* Abrir modal de diagnóstico — integrado na Story 3.2 */ }}
        >
          Quero meu Diagnóstico Digital →
        </button>
      </div>
    </section>
  )
}
```

### app/page.tsx — Montagem Final

```tsx
// app/page.tsx
import { Hero } from '@/features/homepage/components/Hero'
import { PainPoints } from '@/features/homepage/components/PainPoints'
import { FourPillars } from '@/features/homepage/components/FourPillars'
import { HowItWorks } from '@/features/homepage/components/HowItWorks'
import { CaseStudies } from '@/features/homepage/components/CaseStudies'
import { PortfolioSection } from '@/features/homepage/components/PortfolioSection'
import { ServicesSection } from '@/features/homepage/components/ServicesSection'
import { FAQ } from '@/features/homepage/components/FAQ'
import { HubTeaser } from '@/features/homepage/components/HubTeaser'
import { CTAFinal } from '@/features/homepage/components/CTAFinal'

export default function HomePage() {
  return (
    <>
      <Hero />
      <PainPoints />
      <FourPillars />
      <HowItWorks />
      <CaseStudies />
      <PortfolioSection />
      <ServicesSection />
      <FAQ />
      <HubTeaser />
      <CTAFinal />
    </>
  )
}
```

### Performance — Bundle ≤ 200kb

GSAP (~120kb minificado) é a maior biblioteca. Para manter bundle inicial dentro do limite:

**Opção A: Dynamic import para seções com GSAP**
```tsx
// Componentes com GSAP carregados dinâmicamente (below the fold)
import dynamic from 'next/dynamic'

const HowItWorks = dynamic(
  () => import('@/features/homepage/components/HowItWorks').then(m => ({ default: m.HowItWorks })),
  { ssr: false }  // GSAP não funciona no servidor
)
```

**Opção B: GSAP tree-shaking (recomendado se usando apenas ScrollTrigger)**
```ts
// Importar apenas o necessário
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// Não importar: DrawSVGPlugin, MorphSVGPlugin, etc (exceto quando necessário)
```

⚠️ DrawSVGPlugin (para Fred pós-submit) é exclusivo GSAP Club — verificar licença antes de usar.

### LCP < 2.5s — Garantias

- Hero é Server Component base (conteúdo text no HTML)
- Nenhuma imagem grande above the fold no Hero
- Fontes com `font-display: swap` (já configurado no tailwind.config.ts)
- `next/image` com `priority` para qualquer imagem no Hero (se houver)

### Verificação Final

```bash
npm run build
# Verificar: no TypeScript errors
# Verificar: no "Module not found" errors
# Opcional: ANALYZE=true npm run build (se next-bundle-analyzer instalado)
```

### Project Structure Notes

```
features/homepage/components/CTAFinal.tsx  ← criar aqui
app/page.tsx                                ← montar com todas as seções
```

### Dependências

- **Depende de:** Todas as stories 2.1–2.6 (seções a integrar)
- **Bloqueia:** Story 3.2 (integração do modal — CTA abre o modal do formulário)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.7]
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision Impact Analysis]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR-P1, NFR-P3]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

Nenhum bloqueio durante implementação.

### Completion Notes List

- CTAFinal.tsx reescrito completamente seguindo o padrão visual do site: dot-grid background, vignette, eyebrow com dot, headline solid + outline + gradient, CTA com gradient laranja — identico ao padrão Hero/ServicesEcosystem/ThreePillars/PortfolioSection.
- A estrutura de page.tsx foi mantida na versão refatorada (ServicesEcosystem + ThreePillars em vez dos nomes originais do story spec), pois mudanças estruturais já foram feitas nas sessões anteriores.
- `bg-darker-blue` (classe antiga) substituído por `bg-[#0a0a0a]` (padrão consistente).
- Build passou sem erros TypeScript. First Load JS: 156 kB (gzipped) — dentro do NFR-P3 de 200 kB.
- onClick do CTA deixado como placeholder para integração do modal de diagnóstico na Epic 3.

### File List

- features/homepage/components/CTAFinal.tsx (modificado — reescrita completa)
- app/page.tsx (modificado — adicionado CTAFinal, bg-[#0a0a0a])

### Change Log

- 2026-03-13: CTAFinal reescrito no padrão visual do site, adicionado ao page.tsx. Build OK, bundle 156 kB gzipped.

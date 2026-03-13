# Story 2.2: Narrativa de Posicionamento — Ecossistema de Serviços + Três Pilares

Status: done

> **⚠️ Desvio de design aprovado (2026-03-13):** A implementação original (PainPoints + FourPillars) foi descartada por não ressoar com a Hero. Substituída por ServicesEcosystem + ThreePillars — abordagem mais impactante e coesa com a estética editorial da seção Hero.

## Story

Como visitante,
quero entender o que a Digital Dog faz e como sua metodologia é diferente,
para que consiga avaliar se a proposta faz sentido para o meu negócio. (FR6, FR7)

## Acceptance Criteria (revisados)

1. 2ª dobra — ServicesEcosystem: 6 serviços apresentados como ecossistema integrado (grid 3×2), id="servicos"
2. Cada serviço tem número, ícone, título, subtítulo temático, descrição e tags
3. 3ª dobra — ThreePillars: 3 pilares com cards glassmorphism + background parallax + microanimações internas
4. Pilar da Marca: logo Digital Dog estática + paleta animada (staggered scaleX) + espécime tipográfico
5. Pilar Tecnológico: terminal animado com métricas (velocidade, SEO, AIO, ranking Google) + badges das IAs
6. Pilar de Marketing: SVG de mapa hiperlocalizado com radar pulsante, dots de clientes animados e label "RAIO DE ATUAÇÃO"
7. `prefers-reduced-motion` guard implementado nos dois componentes
8. GSAP ScrollTrigger com `once: true` nos dois componentes — zero CLS
9. Mobile: legível, cards empilhados, sem overflow horizontal
10. TypeScript: zero erros (`tsc --noEmit`)

## Completion Notes

- `PainPoints.tsx` e `FourPillars.tsx` mantidos no repositório mas não importados em `page.tsx`
- Criado `features/homepage/components/ServicesEcosystem.tsx` (nova 2ª dobra)
- Criado `features/homepage/components/ThreePillars.tsx` (nova 3ª dobra)
- `app/page.tsx` atualizado: `<PainPoints />` + `<FourPillars />` → `<ServicesEcosystem />` + `<ThreePillars />`
- Cores dos pilares: Marca=#ff6b35, Tecnológico=#00bcd4, Marketing=#7c4dff
- Glassmorphism: `backdrop-filter: blur(24px)`, `background: rgba(255,255,255,0.03)`, borda `rgba(255,255,255,0.08)`
- Parallax implementado via GSAP ScrollTrigger `scrub: true` no bgRef (y: 80px de deslocamento)
- Background ThreePillars: `#0a0a0a` + dot grid `rgba(255,255,255,0.016)` 26×26px — sem tint colorido
- CSS keyframes injetados via `document.createElement('style')` no useEffect (uma vez por mount)
- Logo Digital Dog usada no card Marca via `next/image` com `fill + object-contain`
- Todos os valores de opacidade Tailwind fora do scale padrão substituídos por `style={{ color: 'rgba(...)' }}`
- Opacidades inválidas corrigidas: `/88`, `/22`, `/28`, `/38`, `/52`, `/18` → inline styles

## File List

- `features/homepage/components/ServicesEcosystem.tsx` (criado)
- `features/homepage/components/ThreePillars.tsx` (criado)
- `app/page.tsx` (modificado — imports e ordem das seções)

## Change Log

- 2026-03-13: Implementação completa com desvio de design aprovado — ServicesEcosystem + ThreePillars substituem PainPoints + FourPillars (claude-opus-4-6 / claude-sonnet-4-6)

# Story 1.3: Header — Navegação Global com Fred

Status: review

## Story

Como visitante,
quero um header claro com a identidade da Digital Dog,
para que possa me orientar e navegar facilmente em qualquer dispositivo. (FR2, FR5)

## Acceptance Criteria

1. Desktop (≥ 768px) na carga: logo completo SVG do Fred inline + wordmark "Digital Dog | Arquitetura Digital" + links de navegação (Serviços, Portfólio, Diagnóstico) + CTA "Solicitar Diagnóstico"
2. Desktop ao scroll ~80px: wordmark some com transição CSS suave; apenas SVG do Fred permanece; header com `backdrop-blur-sm` e borda inferior `rgba(255,255,255,0.06)`
3. Mobile (< 768px) na carga: apenas SVG do Fred + ícone hambúrguer
4. Mobile ao tocar hambúrguer: overlay full-screen com links grandes e fundo near-black com blur
5. Overlay fecha ao tocar em link ou no botão × (fechar)
6. Todos os links e hambúrguer acessíveis via Tab/Enter com foco visível
7. Header é um Server Component (sem GSAP nativo — a animação de scroll usa CSS/Intersection Observer ou scroll listener leve)

## Tasks / Subtasks

- [x] Criar `features/layout/components/Header.tsx` (AC: #1, #2, #3)
  - [x] `'use client'` — usa useState para menu mobile e scroll listener
  - [x] Named export: `export function Header()`
  - [x] Logo: PNG `/images/logo_digital_dog.png` via next/image (SVG pendente — usuário confirmou usar PNG)
  - [x] Wordmark: "Digital Dog | Arquitetura Digital" com transição CSS ao scroll
  - [x] Links desktop: Serviços, Portfólio, Diagnóstico + CTA "Solicitar Diagnóstico"
  - [x] Scroll listener: `useEffect` com event listener 'scroll', `threshold` = 80px
- [x] Menu mobile overlay (AC: #4, #5)
  - [x] Estado `isMenuOpen: boolean` via useState
  - [x] Overlay: `fixed inset-0 z-50 bg-black/95 backdrop-blur-md`
  - [x] Links grandes: `text-2xl font-medium` com espaçamento generoso
  - [x] Botão × com `aria-label="Fechar menu"` e tamanho mínimo 44×44px
  - [x] Fechar ao clicar em link ou × (AC: #5)
- [x] Acessibilidade (AC: #6)
  - [x] `aria-label="Menu principal"` no `<nav>`
  - [x] `aria-expanded` no botão hambúrguer
  - [x] `aria-label="Fechar menu"` no botão ×
  - [x] Focus trap no overlay mobile
- [x] Integrar Header no `app/layout.tsx`
  - [x] Importar com `@/features/layout/components/Header` (já existia)

## Dev Notes

### Estrutura do Componente

```tsx
// features/layout/components/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/features/shared/utils/cn'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      isScrolled && 'backdrop-blur-sm border-b border-white/[0.06]'
    )}>
      {/* Logo + Nav + CTA */}
      {/* Menu mobile overlay */}
    </header>
  )
}
```

### Comportamento do Logo ao Scroll

```tsx
// Wordmark desaparece suavemente ao scroll
<span className={cn(
  'transition-all duration-300 overflow-hidden',
  isScrolled ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'
)}>
  Digital Dog | Arquitetura Digital
</span>
```

⚠️ Não usar GSAP para esta animação — é uma transição simples de CSS que não requer GSAP.context().

### SVG do Fred

O Fred SVG está em `public/fred/fred.svg`. Para usá-lo inline (necessário para estilização com CSS e para a animação drawSVG na Story 3.4):

```tsx
// Opção A: Importar como componente React (recomendado para inline)
import FredIcon from '@/public/fred/fred.svg'
// Requer configuração next.config.js para SVG como React component

// Opção B: Criar componente FredSVG.tsx que retorna o SVG inline
// features/shared/ui/FredIcon.tsx
```

⚠️ O arquivo `public/fred/fred.svg` ainda **não existe** (pendente fornecimento). Use um placeholder SVG temporário (círculo simples) para esta story. O SVG real será integrado posteriormente.

### Estética Dark Tech

- Background inicial: `transparent` (hero visível)
- Background ao scroll: `bg-dark-blue/80 backdrop-blur-sm`
- Borda inferior ao scroll: `border-b border-white/[0.06]`
- Links: `text-sm font-medium text-white/80 hover:text-white transition-colors`
- CTA: `border border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-dark-blue transition-all`

### Design Tokens Disponíveis (tailwind.config.ts)

```
primary-blue: #00bcd4
dark-blue: #0a0e1a
gradient-orange: #ff6b35
gradient-pink: #ff1744
```

### Fontes

```
Space Grotesk: headings (wordmark do header)
Inter: body/navigation links
```

### Acessibilidade — Focus Trap no Overlay

Quando o menu mobile está aberto, o foco deve ficar preso dentro do overlay para não vazar para o fundo da página. Implementar com `useEffect` verificando Tab/Shift+Tab.

### Project Structure Notes

```
features/layout/components/Header.tsx  ← criar aqui
app/layout.tsx                         ← importar Header e adicionar ao layout
```

Não existe pasta `components/layout/` — usar `features/layout/components/`.

### Dependências

- **Depende de:** Story 1.1 (base limpa)
- Fred SVG: placeholder temporário OK nesta story

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Navegação]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_Nenhum bloqueio. Usuário confirmou usar logo PNG (`/images/logo_digital_dog.png`) no lugar do SVG pendente._

### Completion Notes List

- Header completamente reescrito com base na story e no project-context.md.
- Logo via `next/image` com PNG existente; `drop-shadow` cyan para manter estética dark tech.
- Wordmark "Digital Dog | Arquitetura Digital" usa `max-w-0 opacity-0` no scroll ≥ 80px — transição CSS suave sem GSAP.
- Scroll threshold 80px conforme AC#2. Background `bg-dark-blue/80 backdrop-blur-sm border-white/[0.06]` ao scroll.
- Nav links: Serviços, Portfólio, Diagnóstico (âncoras `#`). CTA "Solicitar Diagnóstico".
- Mobile: hambúrguer com `aria-expanded`, overlay `fixed inset-0 z-50 bg-black/95 backdrop-blur-md`, links `text-2xl`.
- Focus trap via `querySelectorAll` dos elementos focáveis do overlay + Escape fecha o menu.
- Botões com tamanho mínimo 44×44px (touch target). `cn()` de `@/lib/utils` em todas as classes condicionais.
- Build Next.js: ✅ zero erros. ESLint: ✅ zero warnings.

### File List

- `features/layout/components/Header.tsx` (reescrito)

## Change Log

- 2026-03-12: Story 1.3 implementada — Header com logo PNG, wordmark com fade on scroll, nav desktop/mobile, overlay acessível com focus trap.

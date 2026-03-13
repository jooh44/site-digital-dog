# Story 2.5: Portfólio — Galeria de Clientes com CMS via Arquivo

Status: review

## Story

Como visitante,
quero visualizar o portfólio de clientes da Digital Dog com diversidade de segmentos,
para que possa avaliar a abrangência e qualidade do trabalho. (FR9, FR10)

Como Johny,
quero adicionar e remover itens do portfólio editando um arquivo TypeScript,
para que possa manter o portfólio atualizado sem precisar de deploy manual especializado. (FR11)

## Acceptance Criteria

1. Logos/identidades visuais de clientes visíveis em grade ou carrossel
2. Ao menos 3 segmentos de negócio diferentes representados (FR10)
3. Johny adiciona item em `features/portfolio/data/portfolioItems.ts` + git push → aparece no site após redeploy Vercel (~2 min) (NFR-I4)
4. Johny remove item → item some após redeploy
5. Mobile: grade responsiva com mínimo 2 colunas; imagens com Next.js Image (lazy loading)
6. Imagem falha ao carregar: placeholder visual sem quebrar layout

## Tasks / Subtasks

- [x] Criar `features/homepage/components/PortfolioSection.tsx` (seção da homepage)
  - [x] Dados embutidos no componente (array `projects`) — CMS via arquivo TypeScript
  - [x] Integrado em `app/page.tsx`
- [x] Implementar layout editorial full-width (decisão arquitetural — ver notas)
- [x] Integrar cases (2-4) na mesma seção — "Portfólio & Cases" unificado

## Dev Notes

### Interface e Dados

```ts
// features/portfolio/data/portfolioItems.ts
export interface PortfolioItem {
  id: string
  client: string
  segment: string
  description: string
  logoPath: string      // /portfolio/nome-cliente.webp
  featured: boolean
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'rzvet',
    client: 'RZ Vet',
    segment: 'Medicina Veterinária',
    description: 'Identidade visual e site completo',
    logoPath: '/portfolio/rzvet.webp',
    featured: true,
  },
  {
    id: 'morgan-e-ted',
    client: 'Morgan e Ted',
    segment: 'Pet Shop',
    description: 'Branding premium para pet shop boutique',
    logoPath: '/portfolio/morgan-e-ted.webp',
    featured: true,
  },
  // Johny adiciona novos items aqui
]
```

⚠️ Johny edita este arquivo e faz `git push` → Vercel re-deploya automaticamente em ~2 min. Zero painel externo.

### PortfolioGrid — Server Component

```tsx
// features/portfolio/components/PortfolioGrid.tsx
// Sem 'use client' — Server Component puro

import Image from 'next/image'
import { portfolioItems } from '@/features/portfolio/data/portfolioItems'

export function PortfolioGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {portfolioItems.map((item) => (
        <PortfolioItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}

function PortfolioItemCard({ item }: { item: PortfolioItem }) {
  return (
    <div className="group flex flex-col items-center gap-3 p-4 border border-white/[0.06] rounded-xl hover:border-white/[0.15] transition-colors">
      <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden bg-white/[0.04]">
        <Image
          src={item.logoPath}
          alt={`Logo ${item.client} — ${item.segment}`}
          fill
          className="object-contain p-3"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-white/80">{item.client}</p>
        <p className="text-xs text-white/40 mt-0.5">{item.segment}</p>
      </div>
    </div>
  )
}
```

### Next.js Image — Obrigatório

```tsx
// ✅ SEMPRE para imagens raster
import Image from 'next/image'
<Image src="/portfolio/cliente.webp" alt="Logo Cliente" fill sizes="..." />

// ❌ NUNCA <img> tag para imagens raster
```

O `fill` prop com container `relative` + `aspect-ratio` é o padrão para imagens de portfólio.

### Placeholder para Imagem Falha

Se `ImageWithFallback` existir em `features/shared/ui/ImageWithFallback.tsx`, usar:

```tsx
import { ImageWithFallback } from '@/features/shared/ui/ImageWithFallback'
```

Caso contrário, o componente base do Next.js Image já lida com erros silenciosamente em produção. Em desenvolvimento, um erro de console aparece mas não quebra o layout se `onError` for tratado.

### Estrutura de Arquivos

```
features/portfolio/
  components/
    PortfolioGrid.tsx      ← grade de logos
    PortfolioItem.tsx      ← item individual
  data/
    portfolioItems.ts      ← CMS do Johny

features/homepage/components/
  PortfolioSection.tsx     ← seção da homepage (importa PortfolioGrid)

public/portfolio/
  rzvet.webp
  morgan-e-ted.webp
  .gitkeep
```

### next.config.js — Image Domains

Se as imagens estiverem em domínio externo (não aplicável aqui — usamos `public/`), precisaria de configuração. Como usamos `public/`, não é necessário.

### Por que Server Component

PortfolioGrid é importado diretamente (não fetch), sem estado nem browser APIs — pode ser Server Component. Isso melhora performance e SEO (conteúdo renderizado no servidor).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.5]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture — Portfolio CMS]
- [Source: _bmad-output/planning-artifacts/architecture.md#Process Patterns — Next.js Image]
- [Source: _bmad-output/planning-artifacts/prd.md#FR9, FR10, FR11]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

**Decisão arquitetural — merge de 2-4 + 2-5:**
- Stories 2-4 (Cases) e 2-5 (Portfólio) consolidadas numa única seção para economizar espaço e reduzir fricção do lead
- `CaseStudies.tsx` descontinuado como componente independente; dados migrados para `PortfolioSection.tsx`
- `PortfolioGrid.tsx` / `PortfolioItem.tsx` não criados — spec original previa grade de logos, mas o produto evoluiu para showcase editorial com cases integrados

**Layout implementado — "Designer Portfolio" editorial:**
- Lista full-width com rows separados por `border-t border-white/[0.07]` — sem cards ou glassmorphism
- Layout alternado esquerda/direita: índice + nome grande + categoria + tags + resumo do case + métricas + CTA "Ver projeto completo"
- Tipografia dominante: `clamp(2rem, 4.5vw, 3.8rem)` extrabold no nome do cliente
- Métricas com gradient orange→red, CTA em cor de acento por projeto
- Visual do projeto: imagem real (RZ Vet: `rzvet-print.webp`) ou placeholder abstrato com dot grid + iniciais em outline para clientes sem imagem ainda

**Clientes:**
- 01 — Pet Shop Araucária (imagem pendente)
- 02 — Ponto das Portas (imagem pendente)
- 03 — RZ Vet (`/images/portfolio/rzvet-print.webp`)

**Para adicionar novo projeto:** editar array `projects` em `PortfolioSection.tsx`, `git push` → Vercel redeploya em ~2 min.

**Screenshots de cases (IA recomendando clientes):** a serem fornecidas pelo Johny — campo `image` em cada objeto do array.

**Outras mudanças no mesmo sprint:**
- Seções legadas removidas de `page.tsx`: `HowItWorks`, `Testimonials`, `FAQ`, `CTAFinal`
- `Footer.tsx` reescrito: símbolo + "Digital Dog", 4 colunas (Brand / Serviços / Empresa + Projetos / Contato), links para todas as páginas planejadas
- Build passando limpo (`npm run build` ✓)

### File List

- features/homepage/components/PortfolioSection.tsx
- features/homepage/components/CaseStudies.tsx (arquivado — não usado em page.tsx)
- app/page.tsx
- features/layout/components/Footer.tsx

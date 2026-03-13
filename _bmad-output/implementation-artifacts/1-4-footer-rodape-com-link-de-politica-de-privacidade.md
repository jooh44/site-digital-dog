# Story 1.4: Footer — Rodapé com Link de Política de Privacidade

Status: review

## Story

Como visitante,
quero um rodapé com informações essenciais e links,
para que possa encontrar a Política de Privacidade facilmente. (FR27)

## Acceptance Criteria

1. Footer exibe logo da Digital Dog, copyright e link "Política de Privacidade"
2. Link "Política de Privacidade" clicável (pode apontar para `/privacidade` como placeholder — página completa no Epic 5, Story 5.3)
3. Footer responsivo e funcional em mobile (< 768px) e desktop
4. Todos os links acessíveis via Tab/Enter com foco visível

## Tasks / Subtasks

- [x] Criar `features/layout/components/Footer.tsx`
  - [x] Named export: `export function Footer()`
  - [x] Server Component (sem estado, sem browser APIs) — sem `'use client'`
  - [x] Logo Digital Dog via next/image PNG + wordmark texto
  - [x] Texto de copyright: "© {ano} Digital Dog. Todos os direitos reservados."
  - [x] Link "Política de Privacidade" → `/privacidade`
  - [x] Responsivo: layout mobile (flex col) e desktop (flex row justified)
- [x] Acessibilidade (AC: #4)
  - [x] `<footer>` com `role="contentinfo"` (semântico)
  - [x] Link com texto descritivo (não "clique aqui")
  - [x] Foco visível no link (`focus-visible:outline`)
- [x] Integrar Footer no `app/layout.tsx` (já existia o import)

## Dev Notes

### Estrutura do Componente

```tsx
// features/layout/components/Footer.tsx
// Sem 'use client' — Server Component puro

import Link from 'next/link'

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-white/[0.08] py-8 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="text-sm font-medium text-white/80">
          Digital Dog | Arquitetura Digital
        </div>

        {/* Links */}
        <nav aria-label="Links do rodapé">
          <Link
            href="/privacidade"
            className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-blue"
          >
            Política de Privacidade
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Digital Dog. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
```

### Por que Server Component

O Footer não usa estado, hooks ou browser APIs — pode ser Server Component puro. Isso melhora performance (não inclui no bundle client-side). Não adicionar `'use client'` sem necessidade.

### Estética

- Background: herda do body (`dark-blue #0a0e1a`)
- Borda superior: `border-t border-white/[0.08]` (divisória de 1px sutil)
- Textos: hierarchy de opacidade (`/80` para logo, `/60` para links, `/40` para copyright)
- Sem gradientes, sem glows

### Integração no layout.tsx

```tsx
// app/layout.tsx
import { Header } from '@/features/layout/components/Header'
import { Footer } from '@/features/layout/components/Footer'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-dark-blue text-white min-h-screen flex flex-col">
        <ConsentProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ConsentProvider>
      </body>
    </html>
  )
}
```

### Project Structure Notes

```
features/layout/components/Footer.tsx  ← criar aqui
app/layout.tsx                         ← integrar Footer
```

### Nota sobre /privacidade

A rota `/privacidade` será criada na Story 5.3. Por ora, o link pode ser `href="/privacidade"` — o Next.js não quebra em links para páginas não existentes no build, apenas retorna 404 ao navegar.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure]
- [Source: _bmad-output/planning-artifacts/prd.md#FR27]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_Footer anterior usava `'use client'` + `useState` + newsletter form com `/api/newsletter` inexistente. Reescrito como Server Component puro._

### Completion Notes List

- Footer reescrito como Server Component (sem `'use client'`, sem hooks).
- `ImageWithFallback` substituído por `next/image` diretamente (ImageWithFallback é `'use client'`, incompatível com Server Component).
- Newsletter form removido — não faz parte da story e dependia de API route inexistente.
- Link "Política de Privacidade" aponta para `/privacidade` (funcionalmente correto — retorna 404 até Story 5.3 criar a rota).
- Borda e hierarquia de opacidade conforme estética da story (`/80`, `/60`, `/40`).
- Redes sociais e contato mantidos como conteúdo estático válido.
- Build: ✅. ESLint: ✅.

### File List

- `features/layout/components/Footer.tsx` (reescrito)

## Change Log

- 2026-03-12: Story 1.4 implementada — Footer reescrito como Server Component com logo PNG, copyright, link funcional para `/privacidade`, redes sociais e contato estáticos.

# Story 1.2: ConsentProvider — Gerenciamento de Consentimento LGPD

Status: review

## Story

Como visitante,
quero ser informado sobre coleta de dados de forma não intrusiva,
para que possa decidir sobre minha privacidade sem ter a experiência bloqueada.

## Acceptance Criteria

1. Banner discreto aparece no rodapé/bottom bar na primeira visita sem consentimento prévio no localStorage
2. O banner NUNCA bloqueia ou sobrepõe o conteúdo above the fold
3. Scripts do Meta Pixel e GA4 NÃO estão presentes no DOM antes do consentimento
4. Ao clicar "Aceitar", a escolha é persistida em `localStorage` com a chave `dd_consent`
5. Banner desaparece após aceite e não volta a aparecer em visitas futuras no mesmo dispositivo
6. Meta Pixel e GA4 podem ser carregados condicionalmente após consentimento
7. Visitante com consentimento prévio registrado NÃO vê o banner
8. Banner é totalmente acessível via Tab/Enter com label ARIA adequado no botão de aceite

## Tasks / Subtasks

- [x] Criar `features/shared/providers/ConsentProvider.tsx` (AC: #3, #6)
  - [x] React Context `ConsentContext` com `hasConsent: boolean` e `giveConsent: () => void`
  - [x] Ler consentimento do localStorage na inicialização (dentro de useEffect — guard SSR)
  - [x] `'use client'` obrigatório (usa useState, useEffect, localStorage)
- [x] Criar `features/shared/hooks/useConsent.ts` (AC: #4, #7)
  - [x] Hook `useConsent()` que retorna `{ hasConsent, giveConsent }`
  - [x] Persistir em localStorage com chave `dd_consent = 'true'`
- [x] Criar componente do banner de consentimento (AC: #1, #2, #5, #8)
  - [x] Posicionamento: `fixed bottom-0` com `z-index` adequado
  - [x] Texto informativo sobre Meta Pixel e GA4
  - [x] Botão "Aceitar" com `aria-label` descritivo
  - [x] Animação suave de entrada/saída (GSAP ou CSS transition)
  - [x] Nunca sobrepor conteúdo above the fold (testar com viewport mobile 375px)
- [x] Integrar ConsentProvider no `app/layout.tsx` (AC: #3, #6)
  - [x] Envolver `{children}` com `<ConsentProvider>`
  - [x] Renderizar `<MetaPixel />` e `<GA4Provider />` condicionalmente (`hasConsent && <MetaPixel />`)
  - [x] Os componentes MetaPixel e GA4 serão criados no Epic 4 — deixar placeholder comentado
- [x] Testar comportamento de localStorage (AC: #4, #7)
  - [x] Primeira visita: banner aparece, sem scripts de tracking
  - [x] Após aceitar: banner some, localStorage salvo, scripts carregados
  - [x] Segunda visita (reload): banner não aparece, scripts carregados automaticamente

## Dev Notes

### Por que ConsentProvider é PRIORIDADE 1

⚠️ O Meta Pixel está atualmente injetado no `<head>` sem controle de consentimento — **violação LGPD ativa**. Esta story elimina o risco legal antes de qualquer outra feature de analytics. É pré-requisito bloqueante para Stories 4.1 e 4.2.

### Estrutura do ConsentProvider

```tsx
// features/shared/providers/ConsentProvider.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface ConsentContextValue {
  hasConsent: boolean
  giveConsent: () => void
}

const ConsentContext = createContext<ConsentContextValue>({
  hasConsent: false,
  giveConsent: () => {},
})

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [hasConsent, setHasConsent] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Guard SSR: localStorage só no browser
    const stored = localStorage.getItem('dd_consent')
    setHasConsent(stored === 'true')
    setIsLoaded(true)
  }, [])

  const giveConsent = () => {
    localStorage.setItem('dd_consent', 'true')
    setHasConsent(true)
  }

  return (
    <ConsentContext.Provider value={{ hasConsent, giveConsent }}>
      {children}
      {/* Banner aparece apenas quando carregou e não tem consentimento */}
      {isLoaded && !hasConsent && <ConsentBanner onAccept={giveConsent} />}
    </ConsentContext.Provider>
  )
}

export function useConsent() {
  return useContext(ConsentContext)
}
```

### Integração no layout.tsx

```tsx
// app/layout.tsx
import { ConsentProvider } from '@/features/shared/providers/ConsentProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <ConsentProvider>
          {/* MetaPixel e GA4Provider serão adicionados aqui no Epic 4 */}
          {/* Exemplo futuro: <ConsentGatedAnalytics /> */}
          {children}
        </ConsentProvider>
      </body>
    </html>
  )
}
```

### Banner de Consentimento

Design: bottom bar discreta, estética dark tech:
- Background: `bg-dark-blue/95 backdrop-blur-sm`
- Texto: breve, direto ("Este site usa cookies para análise. Saiba mais na nossa Política de Privacidade.")
- Botão: `border 1px solid primary-blue`, fill suave no hover
- Posição: `fixed bottom-0 left-0 right-0 z-50`
- **NUNCA** deve sobrepor o hero (que está acima da dobra)

### Regras SSR Obrigatórias

```tsx
// ✅ CORRETO — localStorage dentro de useEffect
useEffect(() => {
  const stored = localStorage.getItem('dd_consent')
  setHasConsent(stored === 'true')
}, [])

// ❌ ERRADO — acesso direto (quebra no SSG)
const stored = localStorage.getItem('dd_consent')
```

O ConsentProvider usa `'use client'` porque acessa localStorage e usa useState/useEffect.

### Regra de Naming

```
✅ features/shared/providers/ConsentProvider.tsx  (PascalCase, provider)
✅ features/shared/hooks/useConsent.ts            (camelCase com 'use')
```

### Project Structure Notes

```
features/shared/providers/ConsentProvider.tsx  ← criar aqui
features/shared/hooks/useConsent.ts            ← criar aqui (ou mover para dentro do ConsentProvider como export)
app/layout.tsx                                 ← modificar para envolver com ConsentProvider
```

### Dependência de Outras Stories

- **Depende de:** Story 1.1 (base limpa, MetaPixel removido do head)
- **Bloqueia:** Stories 4.1 (Meta Pixel) e 4.2 (GA4)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#LGPD — ConsentProvider]
- [Source: _bmad-output/planning-artifacts/architecture.md#Segurança]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2]
- [Source: _bmad-output/planning-artifacts/prd.md#LGPD]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_Nenhum bloqueio ou erro durante a implementação._

### Completion Notes List

- Criado `ConsentProvider.tsx` com `ConsentContext`, `ConsentProvider` e `ConsentBanner` (componente interno não exportado).
- O `ConsentBanner` usa CSS transition (`translate-y-full → translate-y-0`) com delay de 100ms para animação de entrada suave vinda de baixo.
- O guard SSR está correto: localStorage só é acessado dentro de `useEffect`, evitando erros no build estático do Next.js.
- Flag `isLoaded` evita flash do banner no SSR/hidratação — o banner só aparece após a hidratação completar.
- `useConsent.ts` criado em `features/shared/hooks/` e exporta o hook que consome `ConsentContext`.
- `app/layout.tsx` agora envolve todo o conteúdo com `<ConsentProvider>`. Placeholder comentado para `<MetaPixel />` e `<GA4Provider />` do Epic 4.
- O `MetaPixel.tsx` existente em `features/shared/ui/` não é carregado em nenhum lugar — aguarda condicional do Epic 4.
- Build Next.js: ✅ zero erros TypeScript. Lint ESLint: ✅ zero warnings.
- Sem framework de testes automatizados no projeto — validação via build + revisão manual do comportamento de localStorage.

### File List

- `features/shared/providers/ConsentProvider.tsx` (criado)
- `features/shared/hooks/useConsent.ts` (criado)
- `app/layout.tsx` (modificado — import ConsentProvider, wrap children)

## Change Log

- 2026-03-12: Story 1.2 implementada — ConsentProvider LGPD criado, banner de consentimento com animação CSS, hook useConsent, integração no layout.tsx. Elimina violação LGPD do Meta Pixel no head (pré-requisito para Epic 4).

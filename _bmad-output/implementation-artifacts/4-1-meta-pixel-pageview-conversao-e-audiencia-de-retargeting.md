# Story 4.1: Meta Pixel — PageView, Conversão e Audiência de Retargeting

Status: ready-for-dev

## Story

Como a Digital Dog,
quero que o Meta Pixel registre 100% dos pageviews e submissões do formulário,
para que possa medir o desempenho das campanhas e construir audiências de retargeting. (FR19, FR20, FR21)

## Acceptance Criteria

1. Visitante com consentimento LGPD: script Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`) carregado; evento `PageView` disparado (FR19)
2. Visitante sem consentimento: Meta Pixel NÃO carregado; zero eventos disparados
3. Submit bem-sucedido: evento `Lead` (ou `Submit`) disparado exatamente uma vez (FR20, NFR-I1)
4. Visitante sem submit: identificado via PageView para audiência de retargeting (FR21)
5. Meta Pixel Helper (extensão Chrome): PageView em 100% dos carregamentos com consentimento; conversão exatamente após submit bem-sucedido

## Tasks / Subtasks

- [ ] Criar `features/analytics/components/MetaPixel.tsx` (AC: #1, #2)
  - [ ] `'use client'` — carrega script no browser
  - [ ] Named export: `export function MetaPixel()`
  - [ ] Usar `NEXT_PUBLIC_META_PIXEL_ID` como Pixel ID
  - [ ] Script de inicialização do Pixel + evento `PageView` automático
  - [ ] Verificar que `NEXT_PUBLIC_META_PIXEL_ID` existe — se não, retornar null (falha silenciosa)
- [ ] Integrar MetaPixel no ConsentProvider (AC: #1, #2)
  - [ ] `features/shared/providers/ConsentProvider.tsx`: renderizar `<MetaPixel />` condicionalmente: `{hasConsent && <MetaPixel />}`
- [ ] Implementar evento de conversão (AC: #3)
  - [ ] Criar `features/analytics/utils/trackEvent.ts` com função `trackMetaPixelEvent(eventName, params?)`
  - [ ] Chamar no `DiagnosticoForm.tsx` após submit bem-sucedido: `trackMetaPixelEvent('Lead')`
  - [ ] Garantir que dispara APENAS UMA VEZ por submit

## Dev Notes

### MetaPixel Component

```tsx
// features/analytics/components/MetaPixel.tsx
'use client'

import Script from 'next/script'

export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  if (!pixelId) return null

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
      >
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      {/* noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
```

⚠️ `strategy="afterInteractive"` garante que o Pixel não bloqueia o LCP (NFR-P1).

### Integração no ConsentProvider

```tsx
// features/shared/providers/ConsentProvider.tsx
// Adicionar a renderização condicional

import { MetaPixel } from '@/features/analytics/components/MetaPixel'

// Dentro do ConsentProvider JSX:
return (
  <ConsentContext.Provider value={{ hasConsent, giveConsent }}>
    {hasConsent && <MetaPixel />}
    {/* GA4Provider será adicionado na Story 4.2 */}
    {children}
    {isLoaded && !hasConsent && <ConsentBanner onAccept={giveConsent} />}
  </ConsentContext.Provider>
)
```

### Track Event — Evento de Conversão

```ts
// features/analytics/utils/trackEvent.ts
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
  }
}

export function trackMetaPixelEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', eventName, params)
}

export function trackGA4Event(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, params)
}
```

### Chamada do Evento Lead no DiagnosticoForm

```tsx
// Dentro do DiagnosticoForm.tsx — após submit bem-sucedido:
import { trackMetaPixelEvent } from '@/features/analytics/utils/trackEvent'

if (result.success) {
  trackMetaPixelEvent('Lead')  // Disparar UMA VEZ aqui
  clear()
  setStep('success')
}
```

### Garantir Evento Único

O evento é disparado APENAS no bloco `if (result.success)` após confirmar HTTP 200. Como o DiagnosticoForm controla o estado, múltiplos cliques são impedidos pelo `isSubmitting: true` durante o processamento.

### Audiência de Retargeting (FR21)

O PageView automático do Pixel já cria a audiência "visitou o site". Para audiência específica "viu mas não converteu": no Meta Ads Manager, criar audiência customizada com regra `PageView - Lead` (visitou mas não disparou Lead). Não é necessário código adicional.

### Variables de Ambiente

```bash
# .env.local
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
```

### Project Structure Notes

```
features/analytics/components/MetaPixel.tsx   ← criar
features/analytics/utils/trackEvent.ts        ← criar
features/shared/providers/ConsentProvider.tsx ← atualizar (adicionar MetaPixel condicional)
features/diagnostico/components/DiagnosticoForm.tsx ← atualizar (chamar trackMetaPixelEvent)
```

### Dependências

- **Depende de:** Story 1.2 (ConsentProvider já implementado)
- **Bloqueia:** Story 4.2 (GA4 usa a mesma infraestrutura de trackEvent)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Environment Variables]
- [Source: _bmad-output/planning-artifacts/prd.md#FR19, FR20, FR21, NFR-I1]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

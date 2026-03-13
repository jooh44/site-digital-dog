# Story 4.2: GA4 — Rastreamento de Origem e Conversão

Status: ready-for-dev

## Story

Como a Digital Dog,
quero que o GA4 registre a origem de cada visitante e a conversão do formulário,
para que possa distinguir leads de tráfego pago vs orgânico e medir o ROI das campanhas. (FR22, FR23)

## Acceptance Criteria

1. Visitante via link UTM com consentimento: GA4 (`NEXT_PUBLIC_GA4_ID`) carregado; parâmetros UTM capturados na sessão (FR22, NFR-I2)
2. Visitante orgânico (sem UTM): origem identificada como `organic` ou `direct`
3. Visitante sem consentimento LGPD: GA4 NÃO carregado
4. Submit bem-sucedido: evento `generate_lead` disparado no GA4 com metadados UTM da sessão (FR23, NFR-I2)
5. Evento disparado exatamente uma vez por submit bem-sucedido
6. GA4 DebugView: sessão com UTM e evento de conversão verificáveis

## Tasks / Subtasks

- [ ] Criar `features/analytics/components/GA4Provider.tsx` (AC: #1, #2, #3)
  - [ ] `'use client'` — carrega script no browser
  - [ ] Named export: `export function GA4Provider()`
  - [ ] Usar `@next/third-parties` para integração GA4 (melhor performance vs Script manual)
  - [ ] Ou usar `next/script` com gtag se `@next/third-parties` não estiver instalado
  - [ ] `NEXT_PUBLIC_GA4_ID` como medição ID
  - [ ] Retornar null se ID não configurado (falha silenciosa)
- [ ] Integrar GA4Provider no ConsentProvider (AC: #1, #3)
  - [ ] `{hasConsent && <GA4Provider />}` dentro do ConsentProvider
- [ ] Implementar evento de conversão (AC: #4, #5)
  - [ ] Usar `trackGA4Event` de `features/analytics/utils/trackEvent.ts` (criado na Story 4.1)
  - [ ] Chamar no `DiagnosticoForm.tsx` após submit bem-sucedido: `trackGA4Event('generate_lead', { event_category: 'form', event_label: 'diagnostico' })`

## Dev Notes

### GA4Provider com @next/third-parties (Recomendado)

```tsx
// features/analytics/components/GA4Provider.tsx
'use client'

import { GoogleAnalytics } from '@next/third-parties/google'

export function GA4Provider() {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID
  if (!gaId) return null

  return <GoogleAnalytics gaId={gaId} />
}
```

`@next/third-parties` já está no ecossistema Next.js — verificar se está no package.json. Se não estiver:
```bash
npm install @next/third-parties
```

O `GoogleAnalytics` da biblioteca carrega o script de forma otimizada (lazy, sem bloquear LCP).

### GA4Provider com Script Manual (Fallback)

```tsx
// Se @next/third-parties não disponível:
'use client'

import Script from 'next/script'

export function GA4Provider() {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID
  if (!gaId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            send_page_view: true,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  )
}
```

⚠️ `anonymize_ip: true` é boa prática de privacidade para LGPD.

### Integração no ConsentProvider

```tsx
// features/shared/providers/ConsentProvider.tsx
import { MetaPixel } from '@/features/analytics/components/MetaPixel'
import { GA4Provider } from '@/features/analytics/components/GA4Provider'

// Dentro do ConsentProvider:
return (
  <ConsentContext.Provider value={{ hasConsent, giveConsent }}>
    {hasConsent && <MetaPixel />}
    {hasConsent && <GA4Provider />}
    {children}
    {isLoaded && !hasConsent && <ConsentBanner onAccept={giveConsent} />}
  </ConsentContext.Provider>
)
```

### Rastreamento UTM (FR22)

O GA4 captura parâmetros UTM automaticamente quando presentes na URL:
- `utm_source=facebook`
- `utm_medium=cpc`
- `utm_campaign=diagnostico-digital`
- `utm_content=creative_v1`

Não é necessário código adicional — o GA4 processa UTMs nativamente. Verificar no DebugView se os parâmetros aparecem na sessão.

### Evento de Conversão no DiagnosticoForm

```tsx
// Dentro do DiagnosticoForm.tsx — após submit bem-sucedido
// (junto com trackMetaPixelEvent da Story 4.1)
import { trackMetaPixelEvent, trackGA4Event } from '@/features/analytics/utils/trackEvent'

if (result.success) {
  trackMetaPixelEvent('Lead')
  trackGA4Event('generate_lead', {
    event_category: 'form',
    event_label: 'diagnostico_digital',
    value: 1,
  })
  clear()
  setStep('success')
}
```

### GA4 DebugView — Verificação

Para testar:
1. Instalar extensão Chrome "Google Analytics Debugger"
2. Acessar site com `?utm_source=test&utm_medium=test`
3. Verificar no GA4 → Admin → DebugView: sessão com UTMs e evento `generate_lead`

### Variables de Ambiente

```bash
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

### Project Structure Notes

```
features/analytics/components/GA4Provider.tsx ← criar
features/shared/providers/ConsentProvider.tsx ← atualizar (adicionar GA4Provider condicional)
features/diagnostico/components/DiagnosticoForm.tsx ← atualizar (adicionar trackGA4Event)
```

### Dependências

- **Depende de:** Stories 1.2 (ConsentProvider) e 4.1 (trackEvent.ts e MetaPixel integrado)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#Environment Variables]
- [Source: _bmad-output/planning-artifacts/prd.md#FR22, FR23, NFR-I2]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

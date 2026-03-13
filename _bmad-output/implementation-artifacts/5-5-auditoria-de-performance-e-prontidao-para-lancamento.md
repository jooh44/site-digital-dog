# Story 5.5: Auditoria de Performance e Prontidão para Lançamento

Status: ready-for-dev

## Story

Como a Digital Dog,
quero que o site atinja os thresholds de performance definidos antes do lançamento,
para que o Ad Quality Score do Meta Ads não seja penalizado e a experiência mobile seja excelente. (NFR-P1, NFR-P2, NFR-P3)

## Acceptance Criteria

1. PageSpeed Insights Mobile: LCP < 2.5s, CLS < 0.1, INP < 200ms (NFR-P1)
2. Score de Performance Mobile ≥ 90 (NFR-P2)
3. Bundle JavaScript inicial ≤ 200kb gzipped; GSAP e animações via dynamic import (NFR-P3)
4. Checklist de prontidão completo: build passa, env vars configuradas, SPF+DKIM, robots.txt, sitemap, HTTPS, Meta Pixel + GA4 verificados, formulário testado, email de lead < 5min

## Tasks / Subtasks

- [ ] Executar auditoria de performance inicial (AC: #1, #2)
  - [ ] Google PageSpeed Insights na URL de produção/staging
  - [ ] Identificar LCP, CLS, INP, FID
  - [ ] Identificar recursos bloqueantes de render
- [ ] Otimizar bundle JS (AC: #3)
  - [ ] Verificar First Load JS com `npm run build` (output do Next.js)
  - [ ] Implementar dynamic imports para seções com GSAP (below the fold)
  - [ ] Verificar que nenhuma lib pesada está no bundle inicial
- [ ] Otimizar imagens (AC: #1)
  - [ ] Verificar que todas as imagens usam `next/image` com `sizes` correto
  - [ ] Imagem OG: `public/og-image.png` otimizada
  - [ ] Portfolio: imagens `.webp` com dimensões corretas
  - [ ] Nenhuma imagem above the fold sem `priority` prop
- [ ] Configurar sitemap (AC: #4)
  - [ ] Criar `app/sitemap.ts` com geração automática de sitemap.xml
- [ ] Executar checklist completo de prontidão para lançamento (AC: #4)
  - [ ] `npm run build` sem erros
  - [ ] Variáveis de ambiente Vercel configuradas
  - [ ] SPF + DKIM no domínio remetente (Resend)
  - [ ] `public/robots.txt` com Allow: / e Sitemap
  - [ ] HTTPS ativo no domínio de produção
  - [ ] Meta Pixel verificado com Meta Pixel Helper
  - [ ] GA4 verificado com DebugView
  - [ ] Formulário testado end-to-end em produção
  - [ ] Email de lead chegando para Johny em < 5 minutos
- [ ] Documentar resultados finais

## Dev Notes

### Análise de Bundle — Como Verificar

```bash
# Durante o build, Next.js reporta o tamanho das rotas:
npm run build

# Output exemplo:
# Route (app)                              Size     First Load JS
# ┌ ○ /                                  5.23 kB        102 kB
# ├ ○ /privacidade                        1.2 kB          85 kB
# └ λ /api/diagnostico/submit             0 B             0 B
# + First Load JS shared by all           78.5 kB
#   └ chunks/framework-...                78.5 kB

# Verificar se "First Load JS shared" ≤ 200 kB
```

### Dynamic Import para GSAP

Se o bundle inicial exceder 200kb, mover componentes com GSAP para dynamic imports:

```tsx
// app/page.tsx
import dynamic from 'next/dynamic'

// GSAP components carregados de forma lazy (not SSR)
const HowItWorks = dynamic(
  () => import('@/features/homepage/components/HowItWorks').then(m => ({ default: m.HowItWorks })),
  {
    ssr: false,
    loading: () => <div className="py-24 animate-pulse bg-white/[0.02]" />,
  }
)

const CaseStudies = dynamic(
  () => import('@/features/homepage/components/CaseStudies').then(m => ({ default: m.CaseStudies })),
  { ssr: false }
)
```

⚠️ `ssr: false` é necessário porque GSAP usa `window`. Componentes above the fold (Hero) NÃO devem ser lazy — afeta LCP.

### GSAP Tree-Shaking

Importar apenas o necessário:

```ts
// ✅ Importação tree-shakeable
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// Não importar: gsap/all (inclui tudo)

// Registrar plugins apenas uma vez
gsap.registerPlugin(ScrollTrigger)
```

### LCP — Garantias

O LCP no mobile geralmente é o maior elemento visível above the fold. No Hero:
- Texto (headline): não é LCP tipicamente
- Imagem: se tiver imagem no Hero, usar `<Image priority>` para pré-carregar

Se o Fred SVG estiver no Header (acima da dobra), verificar se está causando atraso.

### CLS — Verificação

Causas comuns de CLS a verificar:
1. Fontes: `font-display: swap` configurado? (já está no tailwind.config.ts)
2. Imagens sem dimensões definidas: garantir `width`/`height` ou `fill` + container com `aspect-ratio`
3. Animações GSAP: garantir que elementos não têm `opacity: 0` no HTML inicial
4. ConsentProvider banner: posicionado como `fixed` (não desloca o layout)

### Sitemap

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://digitaldog.com.br'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacidade`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
```

### Checklist Completo de Prontidão

**Build:**
- [ ] `npm run build` sem erros TypeScript
- [ ] `npm run build` sem warnings críticos
- [ ] First Load JS ≤ 200kb gzipped

**Infraestrutura Vercel:**
- [ ] `NEXT_PUBLIC_META_PIXEL_ID` configurado
- [ ] `NEXT_PUBLIC_GA4_ID` configurado
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` configurado
- [ ] `NEXT_PUBLIC_WHATSAPP_MESSAGE` configurado
- [ ] `RESEND_API_KEY` configurado (server-only)
- [ ] `RESEND_FROM_EMAIL` configurado (server-only)
- [ ] `NOTIFICATION_EMAIL` configurado (server-only)

**DNS/Email:**
- [ ] SPF configurado no domínio remetente (via painel DNS)
- [ ] DKIM configurado (via painel Resend → gerar chave → adicionar ao DNS)
- [ ] Aguardar propagação DNS (até 48h)

**SEO/Técnico:**
- [ ] `public/robots.txt` com Allow: / e Sitemap URL
- [ ] Sitemap acessível em `/sitemap.xml`
- [ ] HTTPS ativo (Vercel configura automaticamente)
- [ ] Canonical URL configurada corretamente

**Analytics:**
- [ ] Meta Pixel Helper: PageView em 100% dos loads (com consentimento)
- [ ] Meta Pixel Helper: evento Lead após submit bem-sucedido
- [ ] GA4 DebugView: sessão com UTM rastreada
- [ ] GA4 DebugView: evento `generate_lead` após submit

**Funcionalidade:**
- [ ] Formulário preenchido end-to-end em produção
- [ ] Email de notificação recebido por Johny em < 5 minutos
- [ ] WhatsApp abre corretamente pós-submit
- [ ] ConsentProvider banner exibido na primeira visita
- [ ] Portfólio exibindo logos

**Performance:**
- [ ] Google PageSpeed Insights Mobile ≥ 90
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms

### Project Structure Notes

```
app/sitemap.ts          ← criar
[verificação de todos os componentes existentes]
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.5]
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR-P1, NFR-P2, NFR-P3, NFR-I3]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

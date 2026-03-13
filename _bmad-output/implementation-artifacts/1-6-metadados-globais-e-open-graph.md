# Story 1.6: Metadados Globais e Open Graph

Status: review

## Story

Como a Digital Dog,
quero que todas as páginas exibam metadados corretos ao serem compartilhadas ou encontradas via busca,
para que a marca seja representada corretamente em redes sociais e resultados de pesquisa. (FR26)

## Acceptance Criteria

1. Link compartilhado em redes sociais exibe: título "Digital Dog | Arquitetura Digital", description de posicionamento, imagem OG ≥ 1200×630px
2. `<title>` = "Digital Dog | Arquitetura Digital"
3. `<meta name="description">` relevante com 120–160 caracteres
4. `<link rel="canonical">` aponta para URL canônica da página
5. `<meta name="robots" content="index, follow">` presente
6. `og:title`, `og:description`, `og:image`, `og:url`, `og:type` presentes e corretos
7. `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` presentes

## Tasks / Subtasks

- [x] Criar imagem OG 1200×630px (AC: #1)
  - [x] Implementada via `app/opengraph-image.tsx` com Next.js `ImageResponse` (edge runtime)
  - [x] Background `#03050a`, wordmark cyan, tagline, glow decorativo
  - [x] Dimensões exatas: 1200×630px geradas em código (sem ferramenta externa)
- [x] Atualizar `app/layout.tsx` com metadata completa (AC: #2, #3, #4, #5, #6, #7)
  - [x] `metadataBase` + title com template `%s | Digital Dog`
  - [x] `description` 120–160 caracteres
  - [x] `robots: { index: true, follow: true }`
  - [x] `openGraph`: type, locale, url, siteName, title, description, images
  - [x] `twitter`: card summary_large_image, title, description, images
  - [x] `alternates.canonical` para BASE_URL
- [x] Criar `public/robots.txt` com Allow: / e Sitemap
- [x] Build verificado — rota `/opengraph-image` compilada como edge function

## Dev Notes

### API de Metadata do Next.js 14 (App Router)

```tsx
// app/layout.tsx
import { Metadata } from 'next'

const BASE_URL = 'https://digitaldog.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Digital Dog | Arquitetura Digital',
    template: '%s | Digital Dog',
  },
  description: 'Arquitetura Digital completa para PMEs brasileiras — marca, tecnologia e presença digital num único ecossistema com um único ponto de inteligência.',
  keywords: ['arquitetura digital', 'marketing digital', 'branding', 'SEO', 'automações', 'PME'],
  authors: [{ name: 'Digital Dog' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Digital Dog',
    title: 'Digital Dog | Arquitetura Digital',
    description: 'Arquitetura Digital completa para PMEs — marca, tecnologia e presença num único ecossistema.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Digital Dog | Arquitetura Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Dog | Arquitetura Digital',
    description: 'Arquitetura Digital completa para PMEs — marca, tecnologia e presença num único ecossistema.',
    images: ['/og-image.png'],
  },
}
```

### Imagem OG — Mínimo Viável

Criar `public/og-image.png` com 1200×630px. Pode ser criada com qualquer ferramenta (Figma, Canva):
- Background: `#0a0e1a` (dark-blue)
- Logo Digital Dog centralizado
- Tagline abaixo
- Dimensões exatas: 1200×630px

Alternativamente, usar `app/opengraph-image.tsx` do Next.js para geração dinâmica (mais avançado — reservado para Story futura).

### Canonical URL

Durante desenvolvimento: `https://digitaldog.com.br` (ou domínio real).

⚠️ Ajustar `BASE_URL` para o domínio correto antes do lançamento.

### Metadata por Página

O template `'%s | Digital Dog'` permite que cada página defina seu próprio title:

```tsx
// app/servicos/page.tsx
export const metadata: Metadata = {
  title: 'Serviços',  // Resulta em: "Serviços | Digital Dog"
  description: 'Arquitetura de Marca e Arquitetura Tecnológica...',
  alternates: { canonical: 'https://digitaldog.com.br/servicos' },
}
```

### robots.txt

Criar `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://digitaldog.com.br/sitemap.xml
```

### Project Structure Notes

```
app/layout.tsx              ← atualizar metadata export
public/og-image.png         ← criar imagem OG
public/robots.txt           ← criar se não existir
```

### Dependência

- **Depende de:** Story 1.1 (metadata já parcialmente atualizada na 1.1; esta story completa com OG e Twitter)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.6]
- [Source: _bmad-output/planning-artifacts/prd.md#FR26]
- [Source: _bmad-output/planning-artifacts/architecture.md#Requirements to Structure Mapping]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_Optou-se por `app/opengraph-image.tsx` (ImageResponse, edge runtime) em vez de PNG estático — gera imagem 1200×630 em código, sem ferramenta externa._

### Completion Notes List

- `app/opengraph-image.tsx` criado com Next.js `ImageResponse` (edge runtime). Gera a OG image dinamicamente: background `#03050a`, wordmark "Digital Dog" em cyan, tagline e glow radial decorativo.
- `app/layout.tsx` atualizado: `metadataBase`, `title` template, `description` 155 chars, `robots`, `openGraph` completo, `twitter` card, `alternates.canonical`.
- `BASE_URL = 'https://digitaldog.com.br'` — ajustar se domínio mudar.
- `public/robots.txt` criado: `Allow: /`, Sitemap apontando para `/sitemap.xml` (sitemap gerado na Story 6.1 de SEO).
- Build: ✅ `/opengraph-image` compila como edge function dinâmica. Demais rotas continuam estáticas.
- ⚠️ Testar OG com Facebook Debugger e Twitter Card Validator após deploy.

### File List

- `app/layout.tsx` (modificado — metadata completa)
- `app/opengraph-image.tsx` (criado)
- `public/robots.txt` (criado)

## Change Log

- 2026-03-12: Story 1.6 implementada — metadata completa com OG e Twitter cards, imagem OG 1200×630 gerada via ImageResponse, robots.txt criado.

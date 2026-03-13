# Story 5.1: Schema Markup — Dados Estruturados para SEO

Status: ready-for-dev

## Story

Como a Digital Dog,
quero que o site declare informações estruturadas via Schema Markup,
para que mecanismos de busca compreendam e exibam dados ricos sobre a empresa. (FR24)

## Acceptance Criteria

1. JSON-LD `LocalBusiness` presente com: nome "Digital Dog", tipo de negócio, descrição, URL e dados de contato
2. JSON-LD `Service` para Arquitetura de Marca e Arquitetura Tecnológica
3. JSON-LD `FAQPage` com perguntas e respostas da seção FAQ da homepage
4. Google Rich Results Test: nenhum erro crítico; tipos reconhecidos
5. `npm run build` passa sem erros com Schema implementado

## Tasks / Subtasks

- [ ] Implementar `LocalBusiness` + `Organization` no `app/layout.tsx` (AC: #1)
  - [ ] JSON-LD via `<Script type="application/ld+json">` ou componente inline
  - [ ] Campos: name, @type, description, url, sameAs, contactPoint, address
  - [ ] `address`: adaptar conforme localização da Digital Dog
- [ ] Implementar `Service` JSON-LD em `app/page.tsx` ou nas seções relevantes (AC: #2)
  - [ ] Dois schemas Service: Arquitetura de Marca e Arquitetura Tecnológica
  - [ ] Campos: name, description, provider (referência ao Organization), serviceType
- [ ] Implementar `FAQPage` no componente `FAQ.tsx` (AC: #3)
  - [ ] JSON-LD inline no componente FAQ (co-localizado com os dados)
  - [ ] Extrair perguntas/respostas do array `faqs` já existente
- [ ] Verificar com Google Rich Results Test (AC: #4)
- [ ] Verificar `npm run build` (AC: #5)

## Dev Notes

### LocalBusiness + Organization — app/layout.tsx

```tsx
// app/layout.tsx
import Script from 'next/script'

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": "https://digitaldog.com.br/#organization",
      "name": "Digital Dog",
      "description": "Arquitetura Digital completa para PMEs — marca, tecnologia e presença num único ecossistema.",
      "url": "https://digitaldog.com.br",
      "logo": "https://digitaldog.com.br/og-image.png",
      "sameAs": [
        "https://www.instagram.com/digitaldog.arq",
        // adicionar LinkedIn, etc
      ],
      "areaServed": "Brasil",
      "serviceType": "Arquitetura Digital",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "Portuguese"
      },
    },
    {
      "@type": "Organization",
      "@id": "https://digitaldog.com.br/#org",
      "name": "Digital Dog",
      "url": "https://digitaldog.com.br",
    }
  ]
}

// Dentro do RootLayout:
<Script
  id="schema-org"
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

### Service Schema — app/page.tsx

```tsx
// app/page.tsx (ou ServicesSection.tsx)
const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Service",
      "position": 1,
      "name": "Arquitetura de Marca",
      "description": "Identidade visual completa, naming, posicionamento de marca e tom de voz para PMEs brasileiras.",
      "provider": { "@id": "https://digitaldog.com.br/#organization" },
      "serviceType": "Branding",
      "areaServed": "Brasil",
    },
    {
      "@type": "Service",
      "position": 2,
      "name": "Arquitetura Tecnológica",
      "description": "Site, SEO, AIO/GEO, automações e integrações — infraestrutura digital completa.",
      "provider": { "@id": "https://digitaldog.com.br/#organization" },
      "serviceType": "Web Development",
      "areaServed": "Brasil",
    }
  ]
}
```

### FAQPage Schema — No Componente FAQ.tsx

Co-localizar o schema com os dados do FAQ (não duplicar):

```tsx
// features/homepage/components/FAQ.tsx
// Adicionar após o JSX do FAQ:

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer,
    }
  }))
}

// No return do componente FAQ:
return (
  <>
    <section id="faq" ...>
      {/* Conteúdo do FAQ */}
    </section>
    <Script
      id="schema-faq"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  </>
)
```

⚠️ Componente FAQ é `'use client'` — `Script` do Next.js funciona em Client Components.

### Validação

```
1. Build: npm run build → deve passar sem erros
2. Local: acessar localhost:3000, inspecionar <head>, verificar JSON-LD presente
3. Produção: usar https://search.google.com/test/rich-results com URL do site
4. Verificar: tipos LocalBusiness, Service, FAQPage reconhecidos sem erros críticos
```

### Project Structure Notes

```
app/layout.tsx        ← adicionar Script com LocalBusiness JSON-LD
app/page.tsx          ← adicionar Script com Service JSON-LD (ou em ServicesSection.tsx)
features/homepage/components/FAQ.tsx  ← adicionar Script com FAQPage JSON-LD
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Gap Analysis — Schema Markup]
- [Source: _bmad-output/planning-artifacts/prd.md#FR24]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

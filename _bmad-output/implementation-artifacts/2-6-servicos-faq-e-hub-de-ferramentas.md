# Story 2.6: Serviços, FAQ e Hub de Ferramentas

Status: review

## Story

Como visitante,
quero conhecer em detalhe os serviços oferecidos e tirar dúvidas comuns,
para que possa tomar uma decisão informada sobre solicitar o Diagnóstico. (FR6, FR7, FR8)

## Acceptance Criteria

1. Arquitetura de Marca detalhada: descrição, entregáveis e diferencial (FR6)
2. Arquitetura Tecnológica detalhada: descrição, entregáveis e diferencial (FR7)
3. Cada serviço tem CTA/link para formulário de Diagnóstico
4. FAQ com accordion: clique expande resposta, acessível via teclado (Tab/Enter/Space)
5. Hub de Ferramentas: teaser/placeholder sinalizando features futuras (FR8) — sem prometer o que não existe
6. Mobile: todas as seções responsivas e legíveis sem overflow

## Tasks / Subtasks

- [x] Criar `features/homepage/components/FAQ.tsx`
  - [x] Server Component com estado do accordion como Client Component filho
  - [x] Named export: `export function FAQ()`
  - [x] Array de perguntas/respostas hardcoded
  - [x] Accordion acessível: `aria-expanded`, `aria-controls`, `id` nas respostas
  - [x] Animação suave de abertura (CSS transition height ou GSAP)
  - [x] JSON-LD `FAQPage` inline para SEO (Schema Markup — pré-visão do Epic 5)
- [x] Criar `features/homepage/components/ServicesSection.tsx`
  - [x] Pode ser Server Component (sem estado, sem browser APIs)
  - [x] Named export: `export function ServicesSection()`
  - [x] Cards de Arquitetura de Marca e Arquitetura Tecnológica
  - [x] CTA em cada card → abre modal de diagnóstico (ou href="#diagnostico")
  - [x] `id="nossos-servicos"` para ancoragem (id="servicos" já usado por ServicesEcosystem)
- [x] Criar `features/homepage/components/HubTeaser.tsx`
  - [x] Server Component
  - [x] Named export: `export function HubTeaser()`
  - [x] Mensagem: "O Hub de Ferramentas está chegando" + imagem do Fred
  - [x] Sem prometer funcionalidades inexistentes
- [x] Integrar em `app/page.tsx`

## Dev Notes

### FAQ — Accordion Acessível

O accordion precisa de interatividade → usar Client Component para o estado de abertura:

```tsx
// features/homepage/components/FAQ.tsx
'use client'

import { useState } from 'react'
import { cn } from '@/features/shared/utils/cn'

const faqs = [
  {
    id: 'o-que-e-diagnostico',
    question: 'O que é o Diagnóstico Digital?',
    answer: 'O Diagnóstico Digital é o primeiro passo do nosso método — um mapeamento real da jornada comportamental do seu cliente na internet, antes de propor qualquer estratégia ou solução.',
  },
  {
    id: 'quanto-tempo',
    question: 'Quanto tempo leva o Diagnóstico?',
    answer: 'Em média 45 minutos a 1 hora de conversa inicial. Após isso, enviamos um relatório detalhado com nossas análises e uma proposta personalizada.',
  },
  {
    id: 'qual-o-custo',
    question: 'O Diagnóstico tem custo?',
    answer: 'O Diagnóstico Digital é gratuito. Ele é o nosso investimento no relacionamento — só faz sentido propor uma solução depois de entender o seu negócio.',
  },
  {
    id: 'para-quem',
    question: 'Para quem é a Digital Dog?',
    answer: 'Para donos de negócios locais e regionais — advogados, médicos, veterinários, consultores — que já investiram em digital sem construir nada de fato. Que precisam de um parceiro que entende o negócio antes de propor qualquer coisa.',
  },
]

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="py-24 px-4 border-t border-white/[0.08]" id="faq">
      <h2 className="text-3xl md:text-4xl font-bold font-space-grotesk text-center mb-12">
        Perguntas Frequentes
      </h2>

      <div className="max-w-2xl mx-auto space-y-3">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
          />
        ))}
      </div>
    </section>
  )
}

function AccordionItem({
  faq, isOpen, onToggle
}: { faq: typeof faqs[0], isOpen: boolean, onToggle: () => void }) {
  return (
    <div className="border border-white/[0.08] rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.03] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-blue"
      >
        <span className="font-medium text-white/90 pr-4">{faq.question}</span>
        <span
          className={cn('text-white/40 transition-transform duration-300 flex-shrink-0', isOpen && 'rotate-180')}
          aria-hidden="true"
        >
          ↓
        </span>
      </button>

      <div
        id={`faq-answer-${faq.id}`}
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <p className="px-6 pb-4 text-white/60 text-sm leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  )
}
```

### ServicesSection — Copy

```
Arquitetura de Marca:
  "A identidade que define quem você é antes de falar qualquer coisa."
  Entregáveis: logo, naming, paleta, tipografia, tom de voz, posicionamento
  Diferencial: construída a partir do Diagnóstico — não de templates

Arquitetura Tecnológica:
  "A infraestrutura que faz o lead te encontrar."
  Entregáveis: site, SEO, AIO/GEO, automações, integrações
  Diferencial: cada peça conectada num ecossistema — não fornecedores separados
```

### HubTeaser — Copy

```
"O Hub de Ferramentas está chegando."
"Fred, nosso copiloto digital, vai trazer seus dados, concorrentes e oportunidades num painel único."
[Ícone do Fred] [Texto: "Em breve — cadastre-se para ser notificado"]
```

Sem formulário de cadastro nesta story — apenas copy + visual. O formulário de notificação é pós-MVP.

### FAQ — JSON-LD (Pré-visão do Epic 5)

Para antecipar o Schema Markup da Story 5.1, o FAQ pode já incluir JSON-LD:

```tsx
// Dentro do componente FAQ, após o JSX principal:
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
}
```

Mas isso é opcional nesta story — a Story 5.1 cobre Schema Markup completo.

### Project Structure Notes

```
features/homepage/components/FAQ.tsx              ← criar aqui
features/homepage/components/ServicesSection.tsx  ← criar aqui
features/homepage/components/HubTeaser.tsx        ← criar aqui
app/page.tsx                                       ← integrar após Portfólio
```

⚠️ `components/sections/FAQ.tsx` existe na base brownfield — o novo vai em `features/homepage/components/FAQ.tsx`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.6]
- [Source: _bmad-output/planning-artifacts/prd.md#FR6, FR7, FR8]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#FAQ, Serviços, Hub]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

Nenhum erro ou blocker durante a implementação.

### Completion Notes List

- FAQ.tsx reescrito do zero: conteúdo atualizado para o posicionamento atual da Digital Dog (PMEs, não só veterinários). Accordion acessível com `aria-expanded`, `aria-controls`, transição CSS `max-height`. JSON-LD FAQPage incluído. GSAP ScrollTrigger para reveal na entrada. Estilo glassmorphism dark seguindo padrão de ThreePillars.
- ServicesSection.tsx criado como Server Component: dois cards (Arquitetura de Marca #ff6b35 + Arquitetura Tecnológica #00bcd4) com entregáveis como badges, tagline, diferencial e CTA → `#diagnostico`. `id="nossos-servicos"` (evita conflito com ServicesEcosystem que já usa `id="servicos"`).
- HubTeaser.tsx criado como Server Component: logo do Fred + copy "O Hub de Ferramentas está chegando" + descrição do Fred como copiloto. Sem formulário de cadastro (pós-MVP). Dot grid background + glow sutil laranja.
- app/page.tsx integrado com ordem: Hero → ServicesEcosystem → ThreePillars → ServicesSection → PortfolioSection → FAQ → HubTeaser.
- Build Next.js limpa ✓, TypeScript sem erros ✓.

### File List

- features/homepage/components/FAQ.tsx (modificado — reescrito)
- features/homepage/components/ServicesSection.tsx (criado)
- features/homepage/components/HubTeaser.tsx (criado)
- app/page.tsx (modificado — novos imports + 3 seções integradas)

## Change Log

- 2026-03-13: Story 2.6 implementada — FAQ reescrito, ServicesSection criado, HubTeaser criado, integração em app/page.tsx

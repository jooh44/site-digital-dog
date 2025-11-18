# 🎯 Epic 2: Homepage Core - Preparação

**Data:** 17 de Novembro de 2025  
**Status:** 🟢 Ready for Development  
**Dependências:** ✅ Epic 1 Completo

---

## 📋 Resumo do Epic

**Objetivo:** Implementar as seções principais da homepage que comunicam o posicionamento da Digital Dog e guiam visitantes para conversão.

**Valor de Negócio:**
- Homepage funcional comunicando posicionamento único
- Seções de conversão implementadas
- Base para tráfego e leads iniciais
- Analytics básico configurado

---

## ✅ Base Técnica Disponível (Epic 1)

### Infraestrutura
- ✅ Next.js 14.2.18 + TypeScript 5.6.3
- ✅ React 18.3.1
- ✅ Tailwind CSS 3.4.14
- ✅ Design System implementado

### Componentes Base Criados
- ✅ `components/ui/Button.tsx` - Variantes primary/secondary
- ✅ `components/ui/Card.tsx` - Variantes default/service
- ✅ `components/ui/Input.tsx` - Com label e error states
- ✅ `components/ui/Badge.tsx` - Variantes outline/filled com pulse

### Design System Configurado
- ✅ Cores CSS variables (primary-blue, dark-blue, gradients)
- ✅ Tipografia (Space Grotesk para headings, Inter para body)
- ✅ Espaçamento (space-md, space-lg, space-xl, etc.)
- ✅ Border radius e box shadows
- ✅ Fontes otimizadas (next/font/google)

### Estrutura de Pastas
```
app/
├── layout.tsx          ✅ Root layout com fontes
├── page.tsx            ✅ Homepage placeholder
├── globals.css          ✅ Design system CSS variables
└── api/
    └── health/          ✅ Health check endpoint

components/
├── ui/                  ✅ Componentes base criados
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Badge.tsx
└── sections/            📋 Criar para seções da homepage

lib/
└── utils.ts             ✅ cn() utility function
```

---

## 📝 Stories do Epic 2

### Story 2.1: Hero Section
**Status:** Draft  
**Prioridade:** 🔴 Crítica

**Requisitos:**
- H1: "Arquitetura Digital Completa para Medicina Veterinária"
- Subtitle: "Não é só marketing. Não é apenas tecnologia. É o ecossistema completo que transforma sua clínica em uma máquina de crescimento sustentável — enquanto você cuida do que realmente importa: os pets."
- CTA Primário: "Quero um Diagnóstico Gratuito" → `/diagnostico`
- CTA Secundário: "Entenda Arquitetura Digital" → `/arquitetura-digital`
- Feature pills: Marca | Ecosistema Digital | Inteligência Dados
- Responsividade mobile-first
- Animações suaves (Framer Motion - instalar se necessário)

**Componentes Necessários:**
- `components/sections/Hero.tsx`
- Usar `Button` component existente
- Usar `Badge` component para feature pills

**Design System:**
- Hero Title: `clamp(1.4rem, 3.2vw, 3.2rem)` - weight 700
- Cores: primary-blue para texto, gradients para CTAs
- Espaçamento: space-3xl para seção

---

### Story 2.2: Pain Points Section
**Status:** Draft  
**Prioridade:** 🔴 Crítica

**Requisitos:**
- 6 cards de dores:
  1. Marketing sem ROI visível
  2. Sistemas que não conversam
  3. Invisibilidade online quando importa
  4. Tempo engolido por gestão
  5. Impossível competir com redes grandes
  6. Decisões no escuro
- Layout responsivo grid (3 colunas desktop, 1 mobile)
- Hover effects e transições
- Copywriting finalizado

**Componentes Necessários:**
- `components/sections/PainPoints.tsx`
- Usar `Card` component (variante service)
- Grid layout com Tailwind

**Design System:**
- Service Card: gradient azul sutil, border-left primary-blue
- Hover: translateY(-5px) + shadow-card-hover

---

### Story 2.3: Four Pillars Section
**Status:** Draft  
**Prioridade:** 🔴 Crítica

**Requisitos:**
- 4 Pilares:
  - 🎨 Arquitetura de Marca
  - 💻 Arquitetura Digital
  - 📈 Estrutura Comercial
  - 🧠 Inteligência de Dados
- Cards com ícones e descrições
- Layout responsivo
- Animações de entrada

**Componentes Necessários:**
- `components/sections/FourPillars.tsx`
- Ícones (usar Lucide React ou similar)
- Usar `Card` component

**Design System:**
- Section Header: Badge outline azul (pulse), Title primary-blue weight 700
- Cards: Service card variant

---

### Story 2.4: How It Works Timeline
**Status:** Draft  
**Prioridade:** 🔴 Crítica

**Requisitos:**
- Timeline de 6 etapas:
  1. Diagnóstico Estratégico (Semanas 1-2)
  2. Blueprint Personalizado (Semanas 2-3)
  3. Fundação (Mês 1-2)
  4. Construção (Mês 3-4)
  5. Lançamento (Mês 5)
  6. Otimização Contínua (Mês 6+)
- Design visual atrativo
- Responsividade mobile
- Scroll animations

**Componentes Necessários:**
- `components/sections/HowItWorks.tsx`
- Timeline component customizado
- Scroll animations (Framer Motion ou CSS)

**Design System:**
- Cores: primary-blue para linha, light-blue para texto
- Espaçamento: space-xl entre etapas

---

### Story 2.5: Final CTA Section
**Status:** Draft  
**Prioridade:** 🔴 Crítica

**Requisitos:**
- CTA final destacado
- Background gradient
- Texto: "Pronto para Transformar Sua Clínica?"
- CTA: "Agendar Diagnóstico Gratuito" → `/diagnostico`
- Analytics tracking

**Componentes Necessários:**
- `components/sections/CTAFinal.tsx`
- Usar `Button` component (primary variant)
- Background gradient (gradient-primary ou gradient-blue)

**Design System:**
- Background: gradient-primary ou gradient-blue
- Padding: space-3xl
- Texto: primary-blue ou white

---

### Story 2.6: Analytics Integration
**Status:** Draft  
**Prioridade:** 🔴 Crítica

**Requisitos:**
- Configurar GA4 básico
- Configurar Meta Pixel básico
- Eventos de pageview funcionando
- CTA click tracking

**Componentes Necessários:**
- `lib/analytics.ts` - Funções helper para GA4 e Pixel
- Atualizar `app/layout.tsx` com scripts
- Tracking de eventos em CTAs

**Dependências:**
- NEXT_PUBLIC_GA_ID (environment variable)
- NEXT_PUBLIC_FB_PIXEL_ID (environment variable)

---

## 🎨 Design System - Referências

### Cores Disponíveis
```css
--primary-blue: #00bcd4;
--dark-blue: #0a0e1a;
--darker-blue: #03050a;
--light-blue: #4dd0e1;
--glow-blue: rgba(0, 188, 212, 0.5);
--gradient-orange: #ff6b35;
--gradient-pink: #ff1744;
--gradient-primary: linear-gradient(135deg, #ff6b35 0%, #ff1744 100%);
--gradient-blue: linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%);
```

### Tipografia
- **Heading Font:** Space Grotesk (var(--font-heading))
- **Body Font:** Inter (var(--font-body))
- **Hero Title:** `clamp(1.4rem, 3.2vw, 3.2rem)` - weight 700
- **Section Title:** `clamp(1.85rem, 3.6vw, 3rem)` - weight 700

### Componentes Padrão
- **CTA Primário:** Button variant="primary" (gradient-primary)
- **CTA Secundário:** Button variant="secondary" (border primary-blue)
- **Service Card:** Card variant="service" (gradient azul, border-left)
- **Badge:** Badge variant="outline" com pulse opcional

---

## 📚 Documentação de Referência

### PRD
- [Requisitos Funcionais - Homepage](../prd/requisitos-funcionais-mvp.md#31-homepage-)
- [Design System](../prd/design-system.md)
- [Tom de Voz](../prd/tom-de-voz.md)

### Architecture
- [Design System Implementation](../architecture/design-system-implementation.md)
- [External Integrations](../architecture/external-integrations.md)
- [Performance Optimization](../architecture/performance-optimization.md)

### Stories
- [Story 2.1: Hero Section](../stories/2.1.hero-section.md)
- [Story 2.2: Pain Points Section](../stories/2.2.pain-points-section.md)
- [Story 2.3: Four Pillars Section](../stories/2.3.four-pillars-section.md)
- [Story 2.4: How It Works Timeline](../stories/2.4.how-it-works-timeline.md)
- [Story 2.5: Final CTA Section](../stories/2.5.final-cta-section.md)
- [Story 2.6: Analytics Integration](../stories/2.6.analytics-integration.md)

---

## 🚀 Próximos Passos

### Imediato
1. **Revisar Story 2.1** - Verificar requisitos completos
2. **Instalar dependências** (se necessário):
   - `framer-motion` para animações
   - `lucide-react` para ícones
   - `@next/third-parties` para GA4 e Meta Pixel
3. **Criar estrutura de pastas:**
   ```
   components/sections/
   ├── Hero.tsx
   ├── PainPoints.tsx
   ├── FourPillars.tsx
   ├── HowItWorks.tsx
   └── CTAFinal.tsx
   ```
4. **Iniciar Story 2.1** - Hero Section

### Checklist de Preparação
- [x] Epic 1 completo
- [x] Design System implementado
- [x] Componentes base criados
- [x] Estrutura de pastas configurada
- [ ] Revisar stories do Epic 2
- [ ] Instalar dependências adicionais (Framer Motion, Lucide, etc.)
- [ ] Preparar copywriting final
- [ ] Configurar environment variables (GA_ID, FB_PIXEL_ID)

---

## 📦 Dependências a Instalar

```bash
# Animações
npm install framer-motion

# Ícones
npm install lucide-react

# Analytics (Next.js otimizado)
npm install @next/third-parties
```

---

## 🎯 Definition of Done - Epic 2

- [ ] Hero section completa e responsiva
- [ ] Seção Dores com 6 cards implementados
- [ ] Seção 4 Pilares completa
- [ ] Timeline "Como Funciona" implementada
- [ ] CTA final funcional
- [ ] GA4 e Meta Pixel configurados e testados
- [ ] PageSpeed Mobile >85, Desktop >90
- [ ] Todas seções responsivas e testadas
- [ ] Quality Gate PASS para todas as stories

---

**Última Atualização:** 17 de Novembro de 2025  
**Status:** 🟢 Ready for Development  
**UX Analysis:** ✅ APROVADO - Diretrizes visuais definidas  
**Próxima Story:** 2.1 - Hero Section


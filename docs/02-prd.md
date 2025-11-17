# 📋 PRD - Digital Dog Website Transformation v1.1 FINAL

**Product Manager:** John (BMAD)  
**Data:** 17 de Novembro de 2025  
**Status:** ✅ APROVADO - Pronto para Fase IDE  
**Tipo:** Brownfield Full-Stack

---

## Document Control

| Item | Detalhes |
|------|----------|
| Projeto | Transformação Site digitaldog.pet |
| Escopo | Brownfield Full-Stack (site + integrações) |
| Stack | Cursor AI + Next.js 14+ TypeScript + VPS Deploy |
| Design System | Mantém design atual (index.html + styles.css) |
| Headline | "Arquitetura Digital Completa para Medicina Veterinária" |
| Tom Voz | Casual/Técnico/Emocional |
| Timeline | 12 semanas (MVP Fase 1) |

---

## 1. Visão do Produto

### Problema
Site atual digitaldog.pet não comunica diferenciação única nem converte visitantes em leads qualificados.

### Solução
Site estratégico que posiciona Digital Dog como única escolha para transformação digital completa (não apenas marketing tático) no setor veterinário.

### Posicionamento
**"Arquitetura Digital = Marca + Tech + Marketing + Dados integrados"**

Não somos: ❌ Agência | ❌ Software house | ❌ Consultoria  
Somos: ✅ Arquitetos de Transformação Digital completa

---

## 2. Personas

### Primária: Dra. Fernanda (Proprietária Clínica Médio Porte)
- Faturamento: >R$50k/mês, 8+ funcionários
- Dores: Marketing sem ROI, sistemas fragmentados, tempo em gestão
- Motivação: Crescer sustentável, diferenciar, ser referência

### Secundária: Dr. Carlos (Veterinário Autônomo)
- Faturamento: R$20-30k/mês
- Dores: Invisibilidade online, gestão precária
- Motivação: Profissionalizar, competir com clínicas

---

## 3. Requisitos Funcionais - MVP

### 3.1 Homepage (/)
**Hero Section:**
- H1: `Arquitetura Digital Completa para Medicina Veterinária`
- Subtitle: "Não é só marketing. Não é apenas tecnologia. É o ecossistema completo que transforma sua clínica em uma máquina de crescimento sustentável — enquanto você cuida do que realmente importa: os pets."
- CTA Primário: "Quero um Diagnóstico Gratuito" → `/diagnostico`
- CTA Secundário: "Entenda Arquitetura Digital" → `/arquitetura-digital`
- Feature pills: Marca | Ecosistema Digital | Inteligência Dados

**Seção Dores (6 cards):**
1. Marketing sem ROI visível
2. Sistemas que não conversam
3. Invisibilidade online quando importa
4. Tempo engolido por gestão
5. Impossível competir com redes grandes
6. Decisões no escuro

**Seção 4 Pilares:**
- 🎨 Arquitetura de Marca
- 💻 Arquitetura Digital
- 📈 Estrutura Comercial
- 🧠 Inteligência de Dados

**Seção Como Funciona (Timeline 6 etapas):**
1. Diagnóstico Estratégico (Semanas 1-2)
2. Blueprint Personalizado (Semanas 2-3)
3. Fundação (Mês 1-2)
4. Construção (Mês 3-4)
5. Lançamento (Mês 5)
6. Otimização Contínua (Mês 6+)

**Seção Cases:**
- 2-3 cases reais ou mockups
- Template: Foto, Nome clínica, Desafio, Solução, Resultados (métricas)

**Seção Depoimentos:**
- 3-4 quotes de veterinários
- Foto + Nome + Clínica + Estrelas

**Seção Comparativo (Tabela):**
- Colunas: Agências | Softwares | Consultorias | Digital Dog
- Linhas: Posicionamento, Site, Sistemas, Automação IA, Tráfego, Dados, Implementação, Suporte

**Seção FAQ (Accordion):**
- 8-10 perguntas comuns
- Schema markup para SEO

**CTA Final:**
- Background destaque
- "Pronto para Transformar Sua Clínica?"
- CTA: "Agendar Diagnóstico Gratuito"

### 3.2 Página Arquitetura Digital (/arquitetura-digital)
- H1: "O Que É Arquitetura Digital para Clínicas Veterinárias?"
- Seção 1: Problema marketing fragmentado
- Seção 2: 4 Pilares detalhados (200-300 palavras cada)
- Seção 3: vs. Abordagens tradicionais
- Seção 4: Como funciona (cases, métricas)
- 2000-2500 palavras total (SEO pillar page)

### 3.3 Página Serviços (/servicos)
- H1: "Como Transformamos Sua Clínica Veterinária"
- 4 Seções (1 por pilar):
  - O que fazemos
  - Entregáveis
  - Benefícios
  - Exemplo/mini case
- Navegação interna (ancoragem #pilar)

### 3.4 Página Sobre (/sobre)
- H1: "Acreditamos em Veterinários Empreendedores Como Agentes de Mudança"
- Nossa História
- Nossa Visão
- Nossos Valores (4-5 valores)
- Equipe (fotos, nomes, funções)
- Por que confiamos no setor veterinário

### 3.5 Página Diagnóstico (/diagnostico)
- H1: "Diagnóstico Estratégico Gratuito"
- Subtitle: "Descubra potencial da sua clínica em 45min"
- Seção: O que você vai receber (benefícios)
- Formulário pré-qualificação:
  - Nome, Email, Telefone, Clínica, Cidade/Estado
  - Faturamento mensal (select), Maior desafio (textarea)
  - Como conheceu, Newsletter opt-in
- Calendly embed (inline)
- Salvar form em DB (PostgreSQL)
- GA4 + Meta Pixel events (form_submit, calendly_booking)

### 3.6 Página Obrigado (/obrigado)
- H1: "Agendamento Confirmado!"
- Checklist preparação diagnóstico
- Links: Explore conteúdo, siga redes sociais
- Noindex (meta robots)
- GA4 event: conversion

### 3.7 Footer (Global)
- Logo + tagline
- Links rápidos (Home, Arquitetura, Serviços, Sobre, Diagnóstico)
- Recursos (placeholder)
- Contato (email, WhatsApp, endereço)
- Redes sociais
- Newsletter signup
- Copyright + links legais

---

## 4. Design System (Site Atual)

### Cores CSS Variables
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
- **Heading:** 'Space Grotesk', 'Poppins', sans-serif
- **Body:** 'Inter', sans-serif
- **Hero Title:** clamp(1.4rem, 3.2vw, 3.2rem) - weight 800
- **Section Title:** clamp(1.85rem, 3.6vw, 3rem) - weight 700

### Espaçamento
- --space-md: 1rem
- --space-lg: 1.5rem
- --space-xl: 2rem
- --space-2xl: 3rem
- --space-3xl: 4rem

### Componentes
**CTA Primário:**
- Background: gradient-primary (laranja→rosa)
- Padding: space-lg × space-xl
- Border-radius: radius-xl
- Hover: scale(0.97)

**CTA Secundário:**
- Border: 2px solid primary-blue
- Hover: bg primary-blue, glow

**Service Card:**
- Background: linear-gradient azul sutil
- Border-left: 3px solid primary-blue
- Hover: translateY(-5px) + shadow

**Section Header:**
- Pre-title: Badge outline azul (animation pulse)
- Title: primary-blue, weight 700
- Subtitle: light-blue, 1.25rem

---

## 5. Requisitos Não-Funcionais

### Performance
- PageSpeed Mobile ≥85
- PageSpeed Desktop ≥90
- LCP <2.5s, FCP <1.8s, CLS <0.1
- Total page size <2MB
- Imagens: WebP + lazy load

### Responsividade
- Breakpoints: 320px, 768px, 1024px, 1440px+
- Mobile-first design
- Touch targets ≥48px

### SEO
- Title/meta únicos por página
- H1 único, hierarquia H2-H3 lógica
- Alt text todas imagens
- Sitemap.xml, robots.txt
- Schema.org (Organization, Article, FAQ)
- Open Graph + Twitter Cards

### Acessibilidade (WCAG 2.1 AA)
- Contraste ≥4.5:1
- Navegação via teclado
- Focus visível
- Labels em inputs
- Alt text significativo

### Segurança
- HTTPS obrigatório
- Headers: CSP, X-Frame-Options, X-Content-Type
- CSRF tokens formulários
- Input sanitização
- Backup DB diário

### Analytics
- GA4: pageview, form_submit, calendly_booking, conversion, cta_click
- Meta Pixel: PageView, Lead, Schedule, CompleteRegistration

---

## 6. Stack Técnico

**Front-End:**
- Next.js 14+ (App Router) + TypeScript
- Styling: Tailwind CSS adaptado ao design system
- Animations: Framer Motion
- Forms: React Hook Form + Zod

**Back-End:**
- Next.js API Routes
- Database: PostgreSQL (VPS)
- ORM: Prisma

**Infraestrutura:**
- Deploy: Docker (Next.js + PostgreSQL) em VPS
- Web Server: Nginx (reverse proxy)
- SSL: Let's Encrypt
- CI/CD: GitHub Actions (auto-deploy)

**Integrações:**
- Calendly: Embed iframe
- Email: SendGrid/Resend (transacionais)
- Analytics: GA4 + Meta Pixel

---

## 7. Roadmap MVP (12 Semanas)

### Sprint 1: Foundation (Semanas 1-2)
- Repo GitHub setup
- Next.js + TypeScript + Tailwind
- Design system implementado (CSS variables, componentes)
- Prisma + PostgreSQL
- Docker compose
- CI/CD pipeline
- Primeiro deploy VPS

### Sprint 2: Homepage Core (Semanas 3-4)
- Hero, Dores, 4 Pilares, Como Funciona, CTA Final
- GA4 + Meta Pixel básico

### Sprint 3: Páginas Secundárias (Semanas 5-6)
- /arquitetura-digital
- /servicos
- /sobre
- Copywriting finalizado

### Sprint 4: Conversão (Semanas 7-8)
- /diagnostico (form + Calendly)
- /obrigado
- Forms salvando DB
- GA4/Pixel events completos
- Email transacional

### Sprint 5: Otimizações (Semanas 9-10)
- Cases, Depoimentos, Comparativo, FAQ
- Image optimization (WebP, lazy load)
- Code splitting
- PageSpeed >85 mobile, >90 desktop
- SEO completo (meta tags, schema, sitemap)

### Sprint 6: QA e Lançamento (Semanas 11-12)
- Testes funcionais, cross-browser, cross-device
- Accessibility audit (axe DevTools)
- Performance audit (Lighthouse)
- Security audit
- Content final review
- Legal (Política Privacidade, LGPD)
- DNS config, SSL ativo
- Deploy produção
- Smoke tests
- Anúncio lançamento
- Monitoramento intensivo

---

## 8. Métricas de Sucesso

### Baseline (2 semanas pós-launch)
- Visitantes únicos, taxa rejeição, tempo página
- Form submissions, Calendly bookings

### Mês 1-3
| Métrica | Meta Mês 1 | Meta Mês 3 |
|---------|------------|------------|
| Visitantes | 500+ | 1.500+ |
| Taxa conversão lead | 2%+ | 3%+ |
| Agendamentos Calendly | 5+ | 15+ |
| PageSpeed Mobile | >85 | >90 |

---

## 9. Tom de Voz

### Princípios
**Casual:** Contrações, perguntas diretas, emojis pontuais  
**Técnico:** Termos precisos (ROI, CRM, GA4), dados concretos  
**Emocional:** Empatia com dores, visão aspiracional, propósito claro

### Exemplos
❌ "Soluções Digitais Inovadoras"  
✅ "Arquitetura Digital Completa para Medicina Veterinária"

❌ "Aumente Sua Presença"  
✅ "Enquanto você atende, seu sistema digital atrai clientes 24h"

---

## 10. Riscos e Mitigações

| Risco | Impacto | Prob | Mitigação |
|-------|---------|------|-----------|
| Atraso dev (Cursor AI curve) | Alto | Média | Buffer 2 semanas, pair programming |
| Performance VPS insuficiente | Médio | Baixa | Load testing, upgrade plan se necessário |
| Baixa conversão inicial | Médio | Média | A/B tests, Hotjar, ajustes rápidos |
| Conteúdo não ressoa | Alto | Baixa | Validar copy com 2-3 vets antes launch |
| SEO demorar | Médio | Alta | Tráfego pago inicial compensar |

---

## 11. Dependências

### Externas Necessárias (Stakeholder)
- Brand colors, logo, fontes (Sprint 1) - ✅ Já tem (design system atual)
- Copywriting final (Sprint 2-3) - PM pode draftar
- Fotos equipe/clínica (Sprint 3)
- Cases reais + depoimentos (Sprint 5)
- Conta Calendly configurada (Sprint 4)
- GA4 property criada (Sprint 2)
- Meta Pixel criado (Sprint 2)
- DNS acesso VPS (Sprint 6)

---

## 12. Próximos Passos (Transição para IDE)

### Fase Completa: PLANNING ✅
1. ✅ Analyst: Project Brief
2. ✅ PM: PRD v1.1
3. ⏭️ **Architect: Architecture Document**
4. ⏭️ **UX Expert: Front-End Spec** (opcional)
5. ⏭️ **PO: Master Checklist** (validação alinhamento)
6. ⏭️ **PO: Shard PRD + Architecture** (criar Epics + Stories)

### Próxima Fase: DEVELOPMENT (IDE)
7. ⏭️ SM: Draftar próxima story
8. ⏭️ Dev: Implementar tasks
9. ⏭️ QA: Review + Quality Gate
10. ⏭️ Repetir até MVP completo

---

## 📎 Anexos

### Database Schema (Prisma)
```prisma
model Contact {
  id             String   @id @default(cuid())
  name           String
  email          String
  phone          String
  clinicName     String
  city           String
  state          String
  monthlyRevenue String
  mainChallenge  String   @db.Text
  referralSource String?
  acceptsEmails  Boolean  @default(false)
  createdAt      DateTime @default(now())
  @@map("contacts")
}

model Newsletter {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
  @@map("newsletter_subscribers")
}
```

### Env Variables
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/digitaldog_db"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_FB_PIXEL_ID="XXXXXXXXXXXXXXX"
EMAIL_API_KEY="SG.xxxxxx"
EMAIL_FROM="contato@digitaldog.pet"
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/digitaldog/diagnostico"
CSRF_SECRET="random-secret-key"
```

---

**Status:** ✅ PRD APROVADA - Pronto para Architecture + UX Spec  
**Próximo Agente:** Architect (Alex) → Criar docs/architecture.md

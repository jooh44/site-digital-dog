# Digital Dog — Memory

## Projeto
- **Nome:** Digital Dog
- **Domínio:** digitaldog.pet (Vercel)
- **Stack:** Next.js + TypeScript + Tailwind CSS + Vercel (sem banco de dados)
- **Repositório:** /home/johny/Documentos/projetos/digital-dog
- **Método:** BMad Method (módulo `bmm`)
- **Língua de comunicação:** PT_BR

## Posicionamento (Março 2026)
Agência de **arquitetura digital** — marca, tecnologia e presença num único ecossistema.
- Serviços: Identidade Visual, Site, SEO+AIO, Google Meu Negócio, Instagram, Automações
- 3 Pilares: Pilar da Marca (#ff6b35), Pilar Tecnológico (#00bcd4), Pilar de Marketing (#7c4dff)
- Mascote: **Fred** (logo) — rosto da marca, não aparece o fundador Johny
- Target: qualquer PME brasileira

## Status do Sprint (Epic 2)

### ✅ Concluídas
- **1.1** Setup técnico + limpeza da base
- **1.2** ConsentProvider LGPD
- **1.3** Header com Fred
- **1.4** Footer
- **1.5** WhatsApp Float
- **1.6** Metadados / Open Graph
- **2.1** Hero Section + HeroAISimulation (GSAP TextPlugin, Google+ChatGPT loop)
- **2.2** ServicesEcosystem (2ª dobra) + ThreePillars (3ª dobra) — **desvio aprovado** vs PainPoints+FourPillars originais

### 🔜 Próximas
- **2.3** HowItWorks — diagrama SVG de ecossistema com linhas animadas (`stroke-dashoffset`)
- **2.4** Prova social — CaseStudies, Testimonials, ComparisonTable
- **2.5** Portfolio — galeria de identidades visuais (arquivo `portfolioItems.ts`)
- **2.6** Serviços detalhados, FAQ e Hub de Ferramentas placeholder
- **2.7** CTA Final + montagem completa da homepage

## Arquitetura das Seções da Homepage (ordem atual)
```
1. Hero              — features/homepage/components/Hero.tsx + HeroAISimulation.tsx
2. ServicesEcosystem — features/homepage/components/ServicesEcosystem.tsx  (id="servicos")
3. ThreePillars      — features/homepage/components/ThreePillars.tsx
4. HowItWorks        — features/homepage/components/HowItWorks.tsx         (🔜 próxima story)
5. CaseStudies       — features/homepage/components/CaseStudies.tsx
6. PortfolioSection  — features/homepage/components/PortfolioSection.tsx
7. Testimonials      — features/homepage/components/Testimonials.tsx
8. FAQ               — features/homepage/components/FAQ.tsx
9. CTAFinal          — features/homepage/components/CTAFinal.tsx
```

## Design System

### Cores
- Fundo: `#0a0a0a`
- Texto principal: `rgba(255,255,255,0.92)` — **NUNCA usar classes Tailwind fora do scale padrão**
- Cyan/Tech: `#00bcd4`
- Laranja/Marca: `#ff6b35`
- Roxo/Marketing: `#7c4dff`
- Bordas: `rgba(255,255,255,0.07)`

### Regra crítica de opacidade Tailwind
Scale padrão: 0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100
**Valores fora do scale (`/22`, `/28`, `/38`, `/52`, `/88`) viram preto — sempre usar inline `style={{ color: 'rgba(...)' }}`**

### Tipografia
- Headings: `font-heading` (Space Grotesk), `font-extrabold`, `tracking-[-0.04em]`
- Body: `font-body` (Inter)
- Eyebrows: `text-[11px] font-semibold tracking-[0.14em] uppercase`

### Padrão de seção
```tsx
<section className="border-t border-white/[0.07] bg-[#0a0a0a] px-8 lg:px-14 py-24 lg:py-32">
  <div className="max-w-6xl mx-auto">
```

### GSAP (obrigatório)
- Registrar `ScrollTrigger` fora do componente com guard `typeof window !== 'undefined'`
- `gsap.context()` + `return () => ctx.revert()`
- `prefers-reduced-motion` guard antes de qualquer animação
- `once: true` no ScrollTrigger — zero CLS

## Estrutura de Arquivos
- `app/` — layout, page, globals.css
- `features/homepage/components/` — todas as seções
- `features/layout/components/` — Header, Footer
- `features/shared/ui/` — componentes reutilizáveis
- `public/images/` — logos + portfolio (NÃO DELETAR)
- `_bmad-output/implementation-artifacts/` — stories implementadas
- `_bmad-output/planning-artifacts/` — PRD, arquitetura, epics, UX spec

## Preferências do Usuário
- Usuário: Johny
- Não quer aparecer pessoalmente — Fred é o rosto
- Cada workflow BMAD roda em nova janela de contexto
- Estética: dark, editorial, sem glow excessivo, sem tints coloridos no bg

# Sprint Change Proposal — Pivot Estratégico Digital Dog

**Data:** 2026-03-09
**Autor:** Bob (Scrum Master) — BMAD Correct Course Workflow
**Projeto:** digital-dog
**Classificação:** Major — Replanejamento fundamental com PM/Arquiteto

---

## Seção 1 — Resumo da Mudança

### Problema / Gatilho

O projeto Digital Dog foi originalmente planejado como site de captação para clínicas veterinárias. Após reflexão estratégica do fundador, foi tomada a decisão deliberada de reposicionar a empresa como **agência de arquitetura digital para qualquer tipo de negócio**, utilizando o mesmo domínio (`digitaldog.pet`) e stack técnica.

Esta não é uma falha técnica — é um **pivot estratégico intencional** baseado em uma visão de mercado mais ampla.

### Contexto de Descoberta

- Decisão tomada antes do início da fase de implementação das features
- 100+ arquivos de docs, componentes e stories foram deletados via git
- Stack técnica e assets de marca foram preservados intencionalmente
- O fundador documentou o novo posicionamento em `INICIAR-AQUI.md`

### Contexto Crítico Adicional

> **MVP focado em conversão de leads para Meta Ads.** O site precisa funcionar como landing page de alta conversão, não apenas portfólio institucional. Os serviços, escopos e entregáveis precisam ser definidos em detalhe durante a criação do PRD.

---

## Seção 2 — Análise de Impacto

### 2.1 Impacto nos Épicos

**Todos os épicos originais são descartados:**

| Épico Original | Status |
|---|---|
| Epic 1 — Foundation & Setup (vet) | ❌ Descartado (infra reaproveitada, épico não) |
| Epic 2 — Homepage Core (vet) | ❌ Descartado |
| Epic 3 — Secondary Pages (vet) | ❌ Descartado |
| Epic 4 — Conversion Flow (vet) | ❌ Descartado |
| Epic 5 — Homepage Advanced (vet) | ❌ Descartado |
| Epic 6 — Optimization & Launch (vet) | ❌ Descartado |

**Novos épicos necessários (esboço):**

| # | Épico Novo | Prioridade |
|---|---|---|
| 1 | Foundation & Adaptation (reaproveitando stack existente) | Required |
| 2 | Homepage — Posicionamento, Hero com Fred, CTA conversão | Required |
| 3 | Portfólio — Projetos de identidade visual da Digital Dog | Required |
| 4 | Serviços — Arquitetura digital detalhada com escopos claros | Required |
| 5 | Conversão — CTA, formulário de lead, WhatsApp, Meta Pixel | Required |
| 6 | Hub de Ferramentas — Placeholder + teaser Fred IA | Opcional MVP |
| 7 | SEO/AIO & Performance | Required |

### 2.2 Impacto nos Artefatos

| Artefato | Impacto | Ação |
|---|---|---|
| PRD | Não existe | Criar do zero — foco em leads/Meta Ads |
| Arquitetura | Não existe | Criar — stack Vercel preservada como base |
| UX/Design | Não existe | Criar — foco em conversão, Fred como mascote |
| Épicos & Stories | Não existem | Criar do zero |
| `app/layout.tsx` | Modificado, reaproveitável | Revisar e adaptar no Epic 1 |
| `app/page.tsx` | Modificado, reaproveitável | Substituir conteúdo no Epic 2 |
| `next.config.js` | Preservado | Manter |
| `tailwind.config.ts` | Preservado | Revisar tokens no novo UX |
| `tsconfig.json` | Preservado | Manter |
| `public/images/` | Preservado | Manter — logos e portfólio da marca |
| Vercel CI/CD | Preservado | Manter |

### 2.3 Impacto Técnico

- **Nenhuma dívida técnica** a resolver — slate limpo
- Stack já validada e deployada na Vercel
- Sem banco de dados (modo estático) — adequado para MVP
- Portfólio: decisão CMS headless (Sanity/Contentful) vs MDX estático a definir na Arquitetura
- Integrações MVP a definir: WhatsApp, Meta Pixel, Calendly/similar, analytics

---

## Seção 3 — Abordagem Recomendada

**Opção selecionada: Replanejamento Completo (Option 3 — PRD MVP Review)**

### Justificativa

1. Não há artefatos existentes para ajustar ou fazer rollback
2. O slate já foi limpo intencionalmente via git
3. A infra técnica está operacional e validada — risco zero
4. O novo posicionamento é suficientemente diferente para exigir PRD, UX e Arquitetura novos

### Esforço e Risco

- **Esforço de replanejamento:** Médio (workflow BMAD guia todo o processo)
- **Risco técnico:** Baixo (stack validada, sem mudanças de infra)
- **Risco de negócio:** Baixo (decisão deliberada e fundamentada)

---

## Seção 4 — Propostas de Mudança Detalhadas

### 4.1 Ação Imediata — Formalizar o Pivot

**O que:** Registrar formalmente o descarte dos artefatos antigos e o início do novo ciclo de planejamento.

**Como:** Este documento serve como registro formal.

### 4.2 Próximo Passo — Criar Novo PRD

**Pontos críticos obrigatórios no PRD:**

- [ ] Definir serviços oferecidos com escopos e entregáveis claros (crítico para Meta Ads)
- [ ] Posicionamento: "Arquitetura Digital" — o que significa na prática
- [ ] Fred como mascote e estrela — personalidade, papel no site, roadmap pós-MVP
- [ ] Personas: qualquer negócio local/regional (não só veterinário)
- [ ] Meta de conversão: geração de leads via formulário / WhatsApp / Calendly
- [ ] Portfólio: logos e identidades visuais da Digital Dog (não do fundador)
- [ ] Hub de Ferramentas: seção futura (definir placeholder no MVP)
- [ ] Fred IA pós-MVP: Business Intelligence, farejador de mercado
- [ ] Público-alvo do Meta Ads: quem é, qual dor, qual oferta

### 4.3 Stack Decisões Pendentes (para Arquitetura)

- [ ] CMS headless (Sanity/Contentful) vs MDX estático para portfólio
- [ ] Solução de formulário de lead (Formspree, Resend, custom API?)
- [ ] Analytics: GA4 + Meta Pixel configurados
- [ ] Calendly ou similar para agendamento de diagnóstico

---

## Seção 5 — Handoff para Implementação

### Classificação: MAJOR

Este pivot exige envolvimento de PM e Arquiteto antes de qualquer desenvolvimento.

### Plano de Handoff

| Fase | Workflow | Agente | Prioridade |
|---|---|---|---|
| **Fase 0 — Pivot Formal** | `correct-course` ← *este documento* | Bob (SM) | ✅ Concluído |
| **Fase 1a — Brainstorm** (opcional) | `bmad-brainstorming` | Mary (BA) | Recomendado |
| **Fase 1b — Pesquisa de Mercado** (opcional) | `bmad-bmm-market-research` | Mary (BA) | Recomendado |
| **Fase 2a — Criar PRD** ⚠️ | `bmad-bmm-create-prd` | John (PM) | **Required** |
| **Fase 2b — Validar PRD** | `bmad-bmm-validate-prd` | John (PM) | Recomendado |
| **Fase 2c — Criar UX** ⚠️ | `bmad-bmm-create-ux-design` | Sally (UX) | **Fortemente recomendado** |
| **Fase 3a — Criar Arquitetura** ⚠️ | `bmad-bmm-create-architecture` | Winston (Arch) | **Required** |
| **Fase 3b — Criar Épicos e Stories** ⚠️ | `bmad-bmm-create-epics-and-stories` | John (PM) | **Required** |
| **Fase 3c — Check Readiness** ⚠️ | `bmad-bmm-check-implementation-readiness` | Winston (Arch) | **Required** |
| **Fase 4 — Sprint Planning** | `bmad-bmm-sprint-planning` | Bob (SM) | Required |

### Critérios de Sucesso para Implementação

1. PRD define claramente os serviços, escopos e entregáveis (base para Meta Ads)
2. UX especifica fluxo de conversão: visita → serviços → CTA → lead capturado
3. Arquitetura define decisões de CMS, formulário de lead e integrações
4. Epic 1 implementado em menos de 1 sprint (infra já existe)
5. Site no ar com Meta Pixel configurado e formulário funcional

---

## Aprovação

**Status:** Aguardando aprovação do Johny

**Próxima ação recomendada:** Iniciar `/bmad-bmm-create-prd` em nova janela de contexto

---

*Gerado por BMAD Correct Course Workflow — Bob (Scrum Master)*
*Digital Dog — Pivot Estratégico — Março 2026*

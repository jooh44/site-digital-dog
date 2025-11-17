# Epic 4: Conversion Flow

**Sprint:** 4 (Semanas 7-8)  
**Status:** 📋 Ready for Development  
**Prioridade:** 🔴 Crítica

## Objetivo

Implementar o funil de conversão completo: formulário de diagnóstico, integração com Calendly, página de agradecimento e salvamento de leads no banco de dados. Este epic é crítico para captura de leads qualificados.

## Valor de Negócio

- Funil de conversão funcional
- Captura de leads qualificados
- Integração com Calendly para agendamentos
- Base de dados de contatos iniciada
- Email transacional funcionando

## Stories

### Story 4.1: Diagnóstico Page
- Criar página /diagnostico
- Formulário pré-qualificação completo
- Validação com Zod + React Hook Form
- Layout responsivo e acessível

### Story 4.2: Calendly Integration
- Embed Calendly inline na página
- Configuração de URL e eventos
- Responsividade mobile
- Analytics tracking (calendly_booking)

### Story 4.3: Contact API Endpoint
- Criar POST /api/contact
- Validação com Zod schema
- Salvar em PostgreSQL via Prisma
- Error handling completo

### Story 4.4: Thank You Page
- Criar página /obrigado
- Checklist de preparação
- Links para conteúdo
- Noindex meta tag
- Conversion tracking

### Story 4.5: Email Integration
- Configurar Resend/SendGrid
- Email de confirmação para contato
- Email de boas-vindas newsletter
- Templates HTML responsivos

### Story 4.6: Analytics Events Complete
- Eventos GA4: form_submit, calendly_booking, conversion
- Eventos Meta Pixel: Lead, Schedule, CompleteRegistration
- Testes de tracking completos

## Definition of Done

- [ ] Página /diagnostico completa e funcional
- [ ] Formulário validando e salvando em DB
- [ ] Calendly embed funcionando
- [ ] Página /obrigado implementada
- [ ] API /api/contact funcionando
- [ ] Emails transacionais enviando
- [ ] Analytics events funcionando
- [ ] Testes end-to-end do fluxo completo

## Dependências

- Epic 1 completo (Database setup)
- Conta Calendly configurada
- Conta Resend/SendGrid criada
- GA4 e Meta Pixel IDs disponíveis

## Referências

- [PRD - Requisitos Funcionais MVP - Diagnóstico](../prd/requisitos-funcionais-mvp.md#35-página-diagnóstico-diagnostico)
- [Architecture - API Endpoints](../architecture/api-endpoints.md)
- [Architecture - External Integrations](../architecture/external-integrations.md)

---


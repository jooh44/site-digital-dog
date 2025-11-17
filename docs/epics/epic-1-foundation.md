# Epic 1: Foundation & Setup

**Sprint:** 1-2 (Semanas 1-2)  
**Status:** 📋 Ready for Development  
**Prioridade:** 🔴 Crítica

## Objetivo

Estabelecer a fundação técnica do projeto com Next.js 14, design system, database PostgreSQL e infraestrutura Docker completa. Este epic entrega a base necessária para todo desenvolvimento subsequente, incluindo CI/CD pipeline e primeiro deploy em VPS.

## Valor de Negócio

- Infraestrutura pronta para desenvolvimento ágil
- Base técnica sólida e escalável
- Pipeline de deploy automatizado
- Ambiente de desenvolvimento e produção configurados

## Stories

### Story 1.1: Repo Setup & Next.js Initialization
- Criar repositório GitHub
- Inicializar projeto Next.js 14 com TypeScript
- Configurar estrutura de pastas (App Router)
- Setup básico de Git e .gitignore

### Story 1.2: Design System Implementation
- Configurar Tailwind CSS com design system atual
- Implementar CSS variables (cores, tipografia, espaçamento)
- Criar componentes base (Button, Card, Input)
- Configurar fontes (Space Grotesk, Inter)

### Story 1.3: Database Setup
- Configurar Prisma com PostgreSQL
- Criar schema inicial (Contact, Newsletter)
- Setup migrations
- Configurar Prisma Client

### Story 1.4: Docker & Infrastructure
- Criar Dockerfile para Next.js
- Configurar docker-compose.yml (Next.js + PostgreSQL + Nginx)
- Setup Nginx reverse proxy
- Configurar volumes e networking

### Story 1.5: CI/CD Pipeline
- Configurar GitHub Actions
- Setup deploy automático para VPS
- Configurar secrets e variáveis de ambiente
- Testar pipeline completo

### Story 1.6: First Deploy
- Deploy inicial em VPS
- Configurar SSL (Let's Encrypt)
- Validar ambiente de produção
- Health check endpoint funcionando

## Definition of Done

- [ ] Projeto Next.js 14 + TypeScript configurado e rodando local
- [ ] Design system CSS implementado e testado
- [ ] Prisma + PostgreSQL funcionando localmente
- [ ] Docker compose rodando sem erros
- [ ] CI/CD pipeline ativo e testado
- [ ] Primeiro deploy em VPS concluído
- [ ] SSL ativo e site acessível via HTTPS
- [ ] Health check retornando status OK

## Dependências

- VPS configurada (Ubuntu 22.04, Docker instalado)
- GitHub repository criado
- DNS apontado para VPS (opcional neste momento)

## Referências

- [PRD - Stack Técnico](../prd/stack-tecnico.md)
- [Architecture - Deployment](../architecture/deployment.md)
- [Architecture - Database Schema](../architecture/database-schema.md)
- [Architecture - Design System](../architecture/design-system-implementation.md)

---


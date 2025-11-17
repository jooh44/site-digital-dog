# 📁 Como Usar no Seu Projeto

## Passo 1: Criar Estrutura de Projeto

```bash
# Criar pasta do projeto
mkdir digitaldog-website
cd digitaldog-website

# Criar estrutura BMad (se ainda não tiver)
npx bmad-method install
# Escolher: IDE de preferência (Cursor, Windsurf, etc)
# Escolher: Core + packs desejados
```

## Passo 2: Organizar Documentos

```bash
# Criar pasta docs (se não existe)
mkdir -p docs

# Copiar os 4 artefatos para docs/
# - 01-project-brief.md → docs/project-brief.md
# - 02-prd.md → docs/prd.md
# - 03-architecture.md → docs/architecture.md
# - 04-po-checklist.md → docs/po-checklist.md
```

## Passo 3: Iniciar Desenvolvimento com BMad Method

### **Opção A: Sharding Automático (Recomendado)**

No seu IDE (Cursor, Windsurf, etc), use o agente **PO**:

```bash
# Transformar em PO
@po

# Shard PRD
Shard o PRD em docs/prd.md para criar epics

# Shard Architecture
Shard o Architecture em docs/architecture.md para refinar stories técnicas
```

**Output esperado:**

```
docs/
├── prd.md
├── architecture.md
├── epics/
│   ├── epic-1-foundation.md
│   ├── epic-2-homepage-core.md
│   ├── epic-3-secondary-pages.md
│   ├── epic-4-conversion-flow.md
│   ├── epic-5-homepage-advanced.md
│   └── epic-6-optimization-launch.md
└── stories/
    ├── story-1.1-repo-setup.md
    ├── story-1.2-design-system.md
    └── ... (demais stories)
```

---

### **Opção B: Criação Manual de Epics/Stories (Se não usar sharding)**

Se preferir controle manual, crie baseado na estrutura sugerida em **04-po-checklist.md**:

```markdown
# docs/epics/epic-1-foundation.md

## Epic 1: Foundation & Setup

### Objetivo
Setup inicial do projeto com Next.js, design system, database e infraestrutura.

### Stories
1. Story 1.1: Repo setup
2. Story 1.2: Design system implementation
3. Story 1.3: Database setup
4. Story 1.4: Docker & CI/CD

### Definition of Done
- [ ] Projeto Next.js 14 + TypeScript configurado
- [ ] Design system CSS implementado
- [ ] Prisma + PostgreSQL funcionando
- [ ] Docker compose rodando local
- [ ] CI/CD pipeline ativo
- [ ] Primeiro deploy em VPS
```

---

## Passo 4: Iniciar Ciclo de Desenvolvimento

```bash
# Transformar em SM (Scrum Master)
@sm

# Draftar próxima story do Epic 1
Draft story 1.1 do Epic 1 (Foundation)

# Revisar e aprovar story
# [Usuário aprova]

# Transformar em Dev
@dev

# Implementar tasks da story
Implement story 1.1 tasks sequencialmente

# Marcar ready for review
# Dev marca como Ready for Review + adiciona notas

# (Opcional) Transformar em QA
@qa *review {story}

# Aprovar e commitar
# IMPORTANTE: git commit antes de próxima story!

# Repetir para próximas stories...
```

---


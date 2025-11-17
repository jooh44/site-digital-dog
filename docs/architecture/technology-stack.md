# 2. Technology Stack

## Front-End
```typescript
// Core
- Next.js 14.2+          // React framework com App Router
- React 18+              // UI library
- TypeScript 5.3+        // Type-safe JavaScript

// Styling
- Tailwind CSS 3.4+      // Utility-first CSS (adaptado ao design system)
- Framer Motion 11+      // Animações suaves
- CSS Modules            // Componentes customizados isolados

// Forms & Validation
- React Hook Form 7.51+  // Form state management
- Zod 3.22+              // Schema validation

// UI Components
- Lucide React 0.365+    // Icons (open-source)
- Radix UI               // Headless components (acessibilidade)

// Analytics
- @next/third-parties    // GA4 + Meta Pixel otimizados
```

## Back-End
```typescript
// API & Server
- Next.js API Routes     // Serverless functions
- Node.js 20 LTS         // Runtime

// Database & ORM
- PostgreSQL 16+         // Relational database
- Prisma 5.11+           // Type-safe ORM

// Email
- Resend 3.2+            // Transactional emails (SendGrid alternativa)

// External APIs
- Calendly API           // Agendamento (webhook futuro)
```

## Infrastructure
```yaml
# VPS Configuration
OS: Ubuntu 22.04 LTS
Container: Docker 25+
Orchestration: Docker Compose
Web Server: Nginx 1.24+ (reverse proxy)
SSL: Let's Encrypt (auto-renewal via Certbot)
Process Manager: PM2 5+ (se Node direto, opcional com Docker)

# VPS Access
Host: 46.202.147.75
User: root
SSH Script: ssh_run.py (local development)
GitHub Secrets: VPS_SSH_KEY (CI/CD)

# CI/CD
VCS: GitHub
Pipeline: GitHub Actions
Deploy: Auto-deploy on push to main
```

---


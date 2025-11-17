# 🏗️ Architecture Document - Digital Dog Website

**Architect:** Alex (BMAD)  
**Data:** 17 de Novembro de 2025  
**Status:** ✅ Ready for Development  
**Baseado em:** PRD v1.1 + Design System Atual

---

## 1. System Overview

### Project Type
**Brownfield Full-Stack Website** - Grande atualização mantendo design system existente

### Core Purpose
Criar site estratégico de alta conversão para posicionar Digital Dog como líder em Arquitetura Digital para setor veterinário brasileiro.

### Key Technical Decisions
- **Framework:** Next.js 14+ (App Router) para SEO e performance
- **Language:** TypeScript para type safety
- **Styling:** Tailwind CSS adaptado ao design system atual
- **Database:** PostgreSQL (produção VPS)
- **Deploy:** Docker containers em VPS própria
- **Development:** Cursor AI IDE

---

## 2. Technology Stack

### Front-End
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

### Back-End
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

### Infrastructure
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

## 3. System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare CDN                           │
│            (Cache assets, DDoS protection)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   VPS (Ubuntu 22.04)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          Nginx (Reverse Proxy + SSL)                  │  │
│  └───────────────────┬───────────────────────────────────┘  │
│                      │                                       │
│                      ↓                                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │      Docker Container: Next.js App                    │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Next.js 14 (App Router)                        │  │  │
│  │  │  - Server Components (SSR/SSG)                  │  │  │
│  │  │  - API Routes (/api/contact, /api/newsletter)  │  │  │
│  │  │  - Static Assets (images, fonts)               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────┬───────────────────────────────────┘  │
│                      │                                       │
│                      ↓                                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │     Docker Container: PostgreSQL 16                   │  │
│  │  - Database: digitaldog_db                            │  │
│  │  - Tables: contacts, newsletter_subscribers          │  │
│  │  - Backup: Daily cron job                            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              External Services (APIs)                       │
│  - Google Analytics 4 (tracking)                            │
│  - Meta Pixel (Facebook/Instagram ads)                      │
│  - Calendly (agendamento embed + webhook futuro)            │
│  - Resend/SendGrid (email transacional)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Directory Structure

```
digitaldog-website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
│
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (Header, Footer, Analytics)
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles + Design System CSS vars
│   │
│   ├── arquitetura-digital/
│   │   └── page.tsx
│   ├── servicos/
│   │   └── page.tsx
│   ├── sobre/
│   │   └── page.tsx
│   ├── diagnostico/
│   │   └── page.tsx
│   ├── obrigado/
│   │   └── page.tsx
│   │
│   └── api/                    # API Routes
│       ├── contact/
│       │   └── route.ts        # POST /api/contact
│       └── newsletter/
│           └── route.ts        # POST /api/newsletter
│
├── components/                 # React Components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   │
│   ├── sections/               # Homepage sections
│   │   ├── Hero.tsx
│   │   ├── PainPoints.tsx
│   │   ├── FourPillars.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── CaseStudies.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Comparison.tsx
│   │   ├── FAQ.tsx
│   │   └── CTAFinal.tsx
│   │
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── Accordion.tsx
│   │
│   └── forms/
│       ├── ContactForm.tsx
│       ├── NewsletterForm.tsx
│       └── CalendlyEmbed.tsx
│
├── lib/                        # Utility functions
│   ├── prisma.ts               # Prisma client singleton
│   ├── analytics.ts            # GA4/Pixel helpers
│   ├── email.ts                # Email sending (Resend)
│   └── validation.ts           # Zod schemas
│
├── public/                     # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-bg.webp
│   │   └── cases/
│   ├── fonts/                  # Self-hosted fonts (optional)
│   └── favicon.ico
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history
│
├── styles/
│   └── design-system.css       # Design System CSS variables
│
├── docs/                       # BMad artifacts (não commitados)
│   ├── prd.md
│   ├── architecture.md
│   ├── epics/
│   └── stories/
│
├── .env.local                  # Environment variables (não commitado)
├── .env.example                # Template env vars
├── .gitignore
├── docker-compose.yml          # Docker orchestration
├── Dockerfile                  # Next.js container
├── nginx.conf                  # Nginx configuration
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind customization
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## 5. Database Schema

### Prisma Schema
```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Contact {
  id              String   @id @default(cuid())
  name            String
  email           String
  phone           String
  clinicName      String   @map("clinic_name")
  city            String
  state           String
  monthlyRevenue  String   @map("monthly_revenue")
  mainChallenge   String   @db.Text @map("main_challenge")
  referralSource  String?  @map("referral_source")
  acceptsEmails   Boolean  @default(false) @map("accepts_emails")
  createdAt       DateTime @default(now()) @map("created_at")
  
  @@map("contacts")
  @@index([email])
  @@index([createdAt])
}

model Newsletter {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  
  @@map("newsletter_subscribers")
  @@index([createdAt])
}

// Futuro: CalendlyEvent para sync webhooks
model CalendlyEvent {
  id              String   @id @default(cuid())
  eventUuid       String   @unique @map("event_uuid")
  contactId       String?  @map("contact_id")
  inviteeName     String   @map("invitee_name")
  inviteeEmail    String   @map("invitee_email")
  scheduledAt     DateTime @map("scheduled_at")
  status          String   // scheduled, canceled, completed
  canceledAt      DateTime? @map("canceled_at")
  createdAt       DateTime @default(now()) @map("created_at")
  
  @@map("calendly_events")
  @@index([inviteeEmail])
  @@index([scheduledAt])
}
```

### Migrations
```bash
# Criar migration inicial
npx prisma migrate dev --name init

# Gerar Prisma Client
npx prisma generate

# Seed database (opcional)
npx prisma db seed
```

---

## 6. API Endpoints

### POST /api/contact
**Purpose:** Salvar lead do formulário diagnóstico

**Request Body:**
```typescript
{
  name: string;
  email: string;
  phone: string;
  clinicName: string;
  city: string;
  state: string;
  monthlyRevenue: string;
  mainChallenge: string;
  referralSource?: string;
  acceptsEmails: boolean;
}
```

**Response:**
```typescript
// Success (201)
{
  success: true;
  message: "Contato salvo com sucesso",
  contactId: "clxx..."
}

// Error (400/500)
{
  success: false;
  error: "Mensagem do erro"
}
```

**Validação:** Zod schema
**Side Effects:** 
- Salvar em DB (Prisma)
- Enviar email confirmação (Resend)
- Track GA4 event: form_submit
- Track Meta Pixel: Lead

---

### POST /api/newsletter
**Purpose:** Salvar email newsletter (footer)

**Request Body:**
```typescript
{
  email: string;
}
```

**Response:**
```typescript
// Success (201)
{
  success: true;
  message: "Email cadastrado com sucesso"
}

// Duplicate (409)
{
  success: false,
  error: "Email já cadastrado"
}
```

**Validação:** Email válido (Zod)
**Side Effects:**
- Salvar em DB (Prisma)
- Enviar email boas-vindas (Resend)
- Track GA4 event: newsletter_signup

---

## 7. External Integrations

### Google Analytics 4
**Implementation:**
```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Events Tracked:**
- `page_view` (automático)
- `form_start`, `form_submit`
- `calendly_booking`
- `conversion` (thank you page)
- `cta_click`
- `scroll_depth` (25%, 50%, 75%, 100%)

---

### Meta Pixel
**Implementation:**
```typescript
// Similar ao GA4, script em layout.tsx
<Script id="facebook-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
    fbq('track', 'PageView');
  `}
</Script>
```

**Events Tracked:**
- `PageView` (automático)
- `Lead` (form submission)
- `Schedule` (Calendly booking)
- `CompleteRegistration` (thank you page)

---

### Calendly
**Embed Implementation:**
```tsx
// components/forms/CalendlyEmbed.tsx
'use client';

import { useEffect } from 'react';

export default function CalendlyEmbed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url={process.env.NEXT_PUBLIC_CALENDLY_URL}
      style={{ minWidth: '320px', height: '700px' }}
    />
  );
}
```

**Webhook (Fase 2):**
```typescript
// app/api/calendly-webhook/route.ts
export async function POST(req: Request) {
  const event = await req.json();
  // Salvar CalendlyEvent no DB
  // Enviar notificação interna
  return Response.json({ received: true });
}
```

---

### Resend (Email)
**Implementation:**
```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_API_KEY);

export async function sendContactConfirmation(contact: Contact) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: contact.email,
    subject: 'Diagnóstico Agendado - Digital Dog',
    html: `
      <h1>Obrigado, ${contact.name}!</h1>
      <p>Recebemos seu formulário e aguardamos você no diagnóstico.</p>
      <p>Prepare-se para descobrir o potencial da sua clínica!</p>
    `
  });
}
```

---

## 8. Design System Implementation

### CSS Variables (Tailwind Extend)
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#00bcd4',
        'dark-blue': '#0a0e1a',
        'darker-blue': '#03050a',
        'light-blue': '#4dd0e1',
        'glow-blue': 'rgba(0, 188, 212, 0.5)',
        'gradient-orange': '#ff6b35',
        'gradient-pink': '#ff1744',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      spacing: {
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 10px 40px rgba(0, 0, 0, 0.2), 0 0 30px rgba(0, 188, 212, 0.1)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 188, 212, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
```

### Component Example (Button)
```tsx
// components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  const baseStyles = 'px-8 py-6 rounded-xl font-semibold text-lg transition-all duration-300';
  
  const variants = {
    primary: 'bg-gradient-to-r from-gradient-orange to-gradient-pink text-white hover:scale-95 shadow-lg',
    secondary: 'bg-transparent border-2 border-primary-blue text-light-blue hover:bg-primary-blue hover:text-white hover:shadow-[0_0_20px_rgba(0,188,212,0.5)]'
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## 9. Performance Optimization

### Image Optimization
```tsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/images/hero-bg.webp"
  alt="Digital Dog Hero"
  width={1920}
  height={1080}
  priority // Above fold
  quality={85}
/>

// Lazy load below fold
<Image
  src="/images/case-study.webp"
  alt="Case Study"
  width={800}
  height={600}
  loading="lazy"
/>
```

### Font Optimization
```tsx
// app/layout.tsx
import { Space_Grotesk, Inter } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### Code Splitting
```tsx
// Dynamic imports para componentes pesados
import dynamic from 'next/dynamic';

const CalendlyEmbed = dynamic(() => import('@/components/forms/CalendlyEmbed'), {
  ssr: false, // Não renderizar server-side
  loading: () => <div>Carregando agendamento...</div>
});
```

---

## 10. Security

### CORS Configuration
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://digitaldog.pet' },
          { key: 'Access-Control-Allow-Methods', value: 'POST' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};
```

### CSRF Protection
```typescript
// lib/csrf.ts
import { nanoid } from 'nanoid';

export function generateCSRFToken(): string {
  return nanoid(32);
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

// Usar em forms (hidden input)
<input type="hidden" name="csrf_token" value={csrfToken} />
```

### Rate Limiting
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map<string, number[]>();

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? 'unknown';
    const now = Date.now();
    const timestamps = rateLimit.get(ip) || [];
    
    // Allow 5 requests per minute
    const recent = timestamps.filter(t => now - t < 60000);
    
    if (recent.length >= 5) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
    
    recent.push(now);
    rateLimit.set(ip, recent);
  }
  
  return NextResponse.next();
}
```

---

## 11. Deployment

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://digitaldog:${DB_PASSWORD}@postgres:5432/digitaldog_db
      - NEXT_PUBLIC_GA_ID=${GA_ID}
      - NEXT_PUBLIC_FB_PIXEL_ID=${FB_PIXEL_ID}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=digitaldog
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=digitaldog_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - nextjs
    restart: unless-stopped

volumes:
  postgres_data:
```

### Dockerfile
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Nginx Configuration
```nginx
# nginx.conf
server {
    listen 80;
    server_name digitaldog.pet www.digitaldog.pet;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name digitaldog.pet www.digitaldog.pet;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://nextjs:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location /_next/static/ {
        proxy_pass http://nextjs:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup SSH
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.VPS_SSH_KEY }}
      
      - name: Deploy to VPS
        run: |
          ssh -o StrictHostKeyChecking=no ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} << 'EOF'
            cd /var/www/digitaldog-website
            git pull origin main
            docker-compose down
            docker-compose build
            docker-compose up -d
            docker-compose exec -T nextjs npx prisma migrate deploy
          EOF
```

### VPS SSH Access (Local Development)

Para acessar a VPS localmente durante desenvolvimento, use o script `ssh_run.py`:

**Credenciais:**
- **Host:** 46.202.147.75
- **User:** root
- **Script:** `ssh_run.py` (raiz do projeto)

**Uso:**
```bash
# Executar comando simples
python ssh_run.py "hostname"

# Verificar containers Docker
python ssh_run.py "docker ps"

# Ver logs do Next.js
python ssh_run.py "docker-compose logs nextjs"

# Reiniciar serviços
python ssh_run.py "docker-compose restart"

# Acessar banco de dados
python ssh_run.py "docker-compose exec postgres psql -U digitaldog -d digitaldog_db"

# Verificar espaço em disco
python ssh_run.py "df -h"

# Ver processos
python ssh_run.py "top -bn1 | head -20"
```

**Requisitos:**
- Python 3.6+
- Biblioteca `paramiko`: `pip install paramiko`

**Nota de Segurança:**
⚠️ O arquivo `ssh_run.py` contém credenciais em texto plano. **NÃO commitar** este arquivo no Git. Adicione ao `.gitignore`:
```
ssh_run.py
```

Para produção, use chaves SSH configuradas no GitHub Secrets.

---

## 12. Monitoring & Logging

### Error Tracking
```typescript
// Usar Sentry (opcional)
// npm install @sentry/nextjs

// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### Health Check Endpoint
```typescript
// app/api/health/route.ts
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    return Response.json(
      { status: 'error', database: 'disconnected' },
      { status: 500 }
    );
  }
}
```

---

## 13. Testing Strategy

### Unit Tests
```typescript
// Jest + React Testing Library
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders primary variant', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### E2E Tests
```typescript
// Playwright
// e2e/contact-flow.spec.ts
import { test, expect } from '@playwright/test';

test('should submit contact form successfully', async ({ page }) => {
  await page.goto('/diagnostico');
  await page.fill('input[name="name"]', 'Dr. Teste');
  await page.fill('input[name="email"]', 'teste@example.com');
  // ... preencher demais campos
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/obrigado');
});
```

---

## 14. Environment Variables

```bash
# .env.example (template)

# Database
DATABASE_URL="postgresql://digitaldog:password@localhost:5432/digitaldog_db"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_FB_PIXEL_ID="XXXXXXXXXXXXXXX"

# Email
EMAIL_API_KEY="re_xxxxxxxxxxxxxx"  # Resend API key
EMAIL_FROM="contato@digitaldog.pet"

# Calendly
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/digitaldog/diagnostico"

# Security
CSRF_SECRET="random-32-char-secret-change-in-production"

# Deployment (GitHub Secrets)
VPS_HOST="xxx.xxx.xxx.xxx"
VPS_USER="deploy"
VPS_SSH_KEY="-----BEGIN RSA PRIVATE KEY-----..."
DB_PASSWORD="secure-password-here"

# VPS SSH Access (Local Development)
# Script: ssh_run.py
# Host: 46.202.147.75
# User: root
# Usage: python ssh_run.py "command"
# Example: python ssh_run.py "docker ps"

# Optional: Sentry
NEXT_PUBLIC_SENTRY_DSN="https://xxxx@sentry.io/xxxxx"
```

---

## 15. Coding Standards

### TypeScript Guidelines
- Use strict mode (`"strict": true`)
- Prefer interfaces over types para objects
- Use enums para valores fixos
- Evitar `any` - usar `unknown` se necessário

### React Guidelines
- Use Server Components por padrão (App Router)
- Client Components apenas quando necessário (`'use client'`)
- Prefer composition over prop drilling
- Extract reusable logic to custom hooks

### File Naming
- Components: PascalCase (Button.tsx)
- Utilities: camelCase (analytics.ts)
- Pages: lowercase (page.tsx)
- Constants: UPPER_SNAKE_CASE

### Git Commit Messages
```
feat: Add Calendly embed component
fix: Resolve form validation issue
docs: Update architecture document
refactor: Simplify analytics tracking
test: Add Button component tests
chore: Update dependencies
```

---

## 16. Scalability Considerations

### Database Indexing
- Index on `contacts.email` (busca rápida)
- Index on `contacts.createdAt` (ordenação temporal)
- Index on `newsletter_subscribers.email` (unique constraint)

### Caching Strategy
- Static pages: ISR (Incremental Static Regeneration)
- Homepage: Revalidate every 3600s (1 hora)
- Blog posts (futuro): Revalidate on-demand via webhook

### CDN Strategy
- Cloudflare na frente do Nginx
- Cache assets estáticos (imagens, fonts, CSS, JS)
- Purge cache on deploy

---

## 17. Rollback Strategy

```bash
# Rollback rápido via Git + Docker
ssh user@vps
cd /var/www/digitaldog-website
git log --oneline -5  # Ver últimos commits
git reset --hard <commit-hash-anterior>
docker-compose down
docker-compose up -d --build
```

---

## 18. Documentation References

### Internal Docs
- [PRD v1.1](./prd.md) - Product Requirements
- [Project Brief](./project-brief.md) - Market Research
- [Front-End Spec](./frontend-spec.md) - UX guidelines (se criado)

### External Docs
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Resend API](https://resend.com/docs)
- [Calendly API](https://developer.calendly.com/)

---

## 19. Success Criteria

✅ **Architecture is successful if:**
- All pages load in <3s (LCP <2.5s)
- PageSpeed Score >85 mobile, >90 desktop
- Zero critical security vulnerabilities
- Database queries optimized (<100ms avg)
- Forms save to DB with 100% reliability
- Analytics tracking 100% functional
- Zero downtime deploys
- Backup/restore tested and working

---

## 20. Next Steps

### Immediate (Pré-Dev)
1. ✅ Architecture Document aprovado
2. Setup VPS (Ubuntu, Docker, Nginx, SSL)
3. Create GitHub repo + setup Secrets
4. Configure domain DNS → VPS IP

### Phase 1 (Sprint 1-2)
5. Initialize Next.js project structure
6. Implement design system (Tailwind config)
7. Setup Prisma + PostgreSQL
8. Create Docker compose + Dockerfile
9. Configure CI/CD pipeline
10. First deploy (hello world)

### Phase 2+ (Sprint 3-12)
11. Follow PRD roadmap
12. Implement pages + components
13. Integrate external services
14. QA testing
15. Production launch

---

**Status:** ✅ Architecture APPROVED - Ready for Development  
**Próximo Agente:** UX Expert (Sarah) → Frontend Spec (opcional)  
**ou:** Product Owner (PO) → Master Checklist + Sharding

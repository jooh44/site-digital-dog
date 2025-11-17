# 4. Directory Structure

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


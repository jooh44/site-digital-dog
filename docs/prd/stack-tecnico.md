# 6. Stack Técnico

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
- **Acesso SSH:** Script `ssh_run.py` (Host: 46.202.147.75, User: root)
  - Uso: `python ssh_run.py "comando"`
  - Exemplo: `python ssh_run.py "docker ps"`

**Integrações:**
- Calendly: Embed iframe
- Email: SendGrid/Resend (transacionais)
- Analytics: GA4 + Meta Pixel

---


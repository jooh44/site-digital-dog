// Server Component puro — sem 'use client'
import Image from 'next/image'
import Link from 'next/link'

const NAV_SERVICOS = [
  { label: 'Identidade Visual', href: '/servicos#identidade-visual' },
  { label: 'Site Estratégico', href: '/servicos#site' },
  { label: 'SEO + AIO', href: '/servicos#seo-aio' },
  { label: 'Google Meu Negócio', href: '/servicos#google-meu-negocio' },
  { label: 'Presença Social', href: '/servicos#social' },
  { label: 'Automações', href: '/servicos#automacoes' },
]

const NAV_EMPRESA = [
  { label: 'Sobre a Digital Dog', href: '/sobre' },
  { label: 'Arquitetura Digital', href: '/arquitetura-digital' },
  { label: 'Portfólio', href: '/#portfolio' },
  { label: 'Cases', href: '/#cases' },
  { label: 'Diagnóstico Gratuito', href: '/#diagnostico' },
]

const NAV_PROJETOS = [
  { label: 'Aumivet', href: '/projetos/aumivet' },
  { label: 'Morgan & Ted', href: '/projetos/morgan-e-ted' },
  { label: 'RZ Vet', href: '/projetos/rz-vet' },
]

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/digitaldog.pet/',
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/digitaldog',
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
      </svg>
    ),
  },
]

function FooterColLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.16em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.16)' }}>
      {children}
    </p>
  )
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls = "text-[13px] text-white/45 hover:text-white/90 transition-colors duration-150 leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00bcd4] rounded-sm"
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-white/[0.07] px-8 lg:px-14 xl:px-20"
      style={{ background: '#0a0a0a' }}
    >
      {/* ── Main grid ── */}
      <div className="pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-8">

          {/* ── Col 1: Brand ── */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="inline-flex items-center gap-3 w-fit group" aria-label="Digital Dog — início">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src="/images/logo_digital_dog-removebg-preview.png"
                  alt=""
                  fill
                  className="object-contain"
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="font-heading font-bold leading-none tracking-[-0.02em] group-hover:text-white transition-colors duration-200"
                  style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.82)' }}
                >
                  Digital Dog
                </span>
                <span
                  className="font-body leading-none"
                  style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}
                >
                  Arquitetura Digital
                </span>
              </div>
            </Link>

            <p className="text-[13px] leading-relaxed max-w-[220px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Arquitetura Digital para PMEs — marca, tecnologia e presença num único ecossistema.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mt-1">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="p-2 rounded-lg border border-white/[0.07] text-white/35 hover:text-white/90 hover:border-white/[0.15] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00bcd4]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Serviços ── */}
          <div>
            <FooterColLabel>Serviços</FooterColLabel>
            <ul className="flex flex-col gap-3">
              {NAV_SERVICOS.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Empresa ── */}
          <div>
            <FooterColLabel>Empresa</FooterColLabel>
            <ul className="flex flex-col gap-3">
              {NAV_EMPRESA.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <FooterColLabel>Projetos</FooterColLabel>
              <ul className="flex flex-col gap-3">
                {NAV_PROJETOS.map((item) => (
                  <li key={item.href}>
                    <FooterLink href={item.href}>{item.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Col 4: Contato ── */}
          <div>
            <FooterColLabel>Contato</FooterColLabel>
            <ul className="flex flex-col gap-3">
              <li>
                <FooterLink href="mailto:contato@digitaldog.pet">
                  contato@digitaldog.pet
                </FooterLink>
              </li>
              <li>
                <FooterLink href="https://api.whatsapp.com/send?phone=5547988109155" external>
                  WhatsApp
                </FooterLink>
              </li>
            </ul>

            <div className="mt-8">
              <FooterColLabel>Diagnóstico</FooterColLabel>
              <a
                href="/#diagnostico"
                className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.06em] uppercase transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00bcd4] rounded-sm"
                style={{ color: '#00bcd4' }}
              >
                Solicitar agora
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2.5 6h7M7 3.5l2.5 2.5L7 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="border-t border-white/[0.05] py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
          © {new Date().getFullYear()} Digital Dog. Todos os direitos reservados.
        </p>
        <nav aria-label="Links legais" className="flex items-center gap-6">
          <Link
            href="/privacidade"
            className="text-[11px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00bcd4] rounded-sm"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            Política de Privacidade
          </Link>
          <Link
            href="/termos"
            className="text-[11px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00bcd4] rounded-sm"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            Termos de Uso
          </Link>
        </nav>
      </div>
    </footer>
  )
}

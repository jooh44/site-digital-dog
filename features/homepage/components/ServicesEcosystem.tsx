'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const services = [
  {
    num: '01',
    title: 'Identidade Visual',
    subtitle: 'A fundação.',
    description: 'Logo, naming, cores, tipografia e brandbook. Antes de qualquer canal, sua marca precisa falar por si.',
    tags: ['Logo', 'Brandbook', 'Naming'],
    pillar: 'Marca',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Site Estratégico',
    subtitle: 'A vitrine.',
    description: 'Landing pages, portfólio e web apps feitos para converter. Rápidos, acessíveis e orientados a resultado.',
    tags: ['Landing Page', 'Web App', 'Performance'],
    pillar: 'Tecnologia',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'SEO + AIO',
    subtitle: 'A descoberta.',
    description: 'Ranqueado no Google e citado pelas IAs. Presença orgânica que não depende de anúncios pagos.',
    tags: ['Google', 'ChatGPT', 'Perplexity'],
    pillar: 'Tecnologia',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 8v6M8 11h6" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Google Meu Negócio',
    subtitle: 'A vizinhança.',
    description: 'Primeiros resultados para quem busca perto. Perfil otimizado, avaliações e tráfego local consistente.',
    tags: ['Maps', 'Local Pack', 'Avaliações'],
    pillar: 'Marketing',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Presença Social',
    subtitle: 'A conversa.',
    description: 'Feed, reels e stories com identidade e intenção. Conteúdo que representa sua marca — não apenas preenche a grade.',
    tags: ['Instagram', 'Feed', 'Reels'],
    pillar: 'Marketing',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Automações',
    subtitle: 'A escala.',
    description: 'WhatsApp, email, CRM e integrações. Processos que trabalham enquanto você atende o que importa.',
    tags: ['WhatsApp', 'Email', 'CRM'],
    pillar: 'Tecnologia',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
]

const pillarColors: Record<string, string> = {
  Marca: '#ff6b35',
  Tecnologia: '#00bcd4',
  Marketing: '#7c4dff',
}

export function ServicesEcosystem() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        opacity: 0,
        y: 36,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 78%',
          once: true,
        },
      })

      gsap.from('[data-card]', {
        opacity: 0,
        y: 28,
        duration: 0.65,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-grid]',
          start: 'top 80%',
          once: true,
        },
      })

      // Mobile active-on-scroll logic
      const isMobile = window.innerWidth < 1024
      if (isMobile) {
        const cards = gsap.utils.toArray<HTMLElement>('[data-card]')
        cards.forEach((card) => {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 70%',
            end: 'bottom 15%',
            toggleClass: 'is-active',
            // markers: true, // For debugging
          })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="servicos"
      ref={containerRef}
      className="border-t border-white/[0.07] bg-[#0a0a0a] px-8 lg:px-14 xl:px-20 py-24 lg:py-32"
      aria-label="Serviços — Ecossistema Digital Dog"
    >
      <div>

        {/* ── Eyebrow ── */}
        <div className="flex items-center gap-2 mb-14 lg:mb-20" data-reveal>
          <span className="w-1 h-1 rounded-full bg-[#00bcd4] flex-shrink-0" />
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/[0.16]">
            O Ecossistema
          </span>
        </div>

        {/* ── Headline + intro ── */}
        <div className="mb-20 lg:mb-28 grid lg:grid-cols-2 gap-8 lg:gap-14 items-end" data-reveal>
          <div className="overflow-hidden">
            <div
              className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] text-white/[0.93]"
              style={{ fontSize: 'clamp(3rem, 7.5vw, 7.5rem)' }}
            >
              Seis
            </div>
            <div
              className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em]"
              style={{
                fontSize: 'clamp(3rem, 7.5vw, 7.5rem)',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.2)',
                color: 'transparent',
              }}
            >
              serviços.
            </div>
            <div
              className="font-heading font-light leading-[1.1] tracking-[-0.02em] mt-4 lg:mt-6"
              style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.4rem)', color: '#00bcd4' }}
            >
              Um ecossistema.
            </div>
          </div>

          <div className="flex flex-col gap-4 pb-1">
            <p className="text-white/40 leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }}>
              Não são serviços avulsos vendidos num pacote. São peças de uma arquitetura projetada para funcionar em conjunto — cada ação fortalecendo a anterior.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Identidade visual que alimenta o site. Site que potencializa o SEO. SEO que amplifica o tráfego local. Tudo conectado, tudo seu.
            </p>
          </div>
        </div>

        {/* ── Service grid 3×2 ── */}
        <div
          data-grid
          className="border-l border-t border-white/[0.07]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => {
              const color = pillarColors[svc.pillar]
              return (
                <div
                  key={svc.num}
                  data-card
                  className="border-r border-b border-white/[0.07] p-8 lg:p-9 group relative overflow-hidden cursor-default"
                >
                  {/* Hover background accent */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 group-[.is-active]:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 0% 0%, ${color}08 0%, transparent 65%)` }}
                  />

                  {/* Decorative large number */}
                  <div
                    className="absolute top-5 right-7 font-heading font-extrabold leading-none select-none pointer-events-none"
                    style={{
                      fontSize: 'clamp(3.5rem, 5vw, 5rem)',
                      WebkitTextStroke: `1px ${color}12`,
                      color: 'transparent',
                    }}
                  >
                    {svc.num}
                  </div>

                  <div className="relative z-10">
                    {/* Icon + number + pillar */}
                    <div className="flex items-center justify-between mb-7">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg border transition-colors duration-300"
                          style={{
                            color,
                            borderColor: 'rgba(255,255,255,0.07)',
                          }}
                        >
                          {svc.icon}
                        </div>
                        <span
                          className="font-heading font-extrabold tabular-nums"
                          style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color, opacity: 0.45 }}
                        >
                          {svc.num}
                        </span>
                      </div>
                      <span
                        className="text-[9px] font-semibold tracking-[0.14em] uppercase transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-[.is-active]:opacity-100"
                        style={{ color }}
                      >
                        {svc.pillar}
                      </span>
                    </div>

                    {/* Title + subtitle */}
                    <h3
                      className="font-heading font-bold leading-snug mb-1 transition-colors duration-300"
                      style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)', color: 'rgba(255,255,255,0.92)' }}
                    >
                      {svc.title}
                    </h3>
                    <p
                      className="font-heading font-light mb-4 transition-colors duration-300"
                      style={{ fontSize: '0.8rem', color, opacity: 0.8 }}
                    >
                      {svc.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm leading-relaxed mb-6 transition-colors duration-300" style={{ color: 'rgba(255,255,255,0.52)' }}>
                      {svc.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {svc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9.5px] font-semibold tracking-[0.1em] uppercase px-2 py-1 rounded border"
                          style={{
                            color: 'rgba(255,255,255,0.22)',
                            borderColor: 'rgba(255,255,255,0.07)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom accent line on hover */}
                  <div
                    className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full group-[.is-active]:w-full transition-all duration-500"
                    style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Tagline + CTA ── */}
        <div className="pt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6" data-reveal>
          <a
            href="#diagnostico"
            className="inline-flex items-center gap-2.5 font-body text-sm font-semibold px-6 py-[13px] rounded-[7px] border border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-[#0a0a0a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00bcd4] min-h-[44px]"
          >
            Diagnóstico gratuito
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="text-white/20 text-sm leading-relaxed max-w-xs">
            Cada serviço é um ativo que pertence a você — mesmo que a gente saia de cena.
          </p>
        </div>

      </div>
    </section>
  )
}

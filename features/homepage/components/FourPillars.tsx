'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const pillars = [
  {
    num: '01',
    title: 'Arquitetura de Marca',
    subtitle: 'Identidade que comunica antes de qualquer palavra.',
    detail: 'Logo · naming · cores · tipografia · posicionamento',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Arquitetura Tecnológica',
    subtitle: 'Infraestrutura que cresce com você.',
    detail: 'Site · SEO · automações · integrações',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4M7 8h.01M10 8h4M7 11.5h10" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Presença Digital',
    subtitle: 'Visível para humanos e para IAs.',
    detail: 'Google · ChatGPT · Perplexity · redes sociais',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Diagnóstico Primeiro',
    subtitle: 'Estratégia antes de solução.',
    detail: 'Mapeamento real antes de propor qualquer coisa',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
      </svg>
    ),
  },
]

export function FourPillars() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
      })

      // Mobile active-on-scroll logic
      const isMobile = window.innerWidth < 1024
      if (isMobile) {
        const items = gsap.utils.toArray<HTMLElement>('[data-pillar]')
        items.forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 75%',
            end: 'bottom 20%',
            toggleClass: 'is-active',
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
      className="border-t border-white/[0.07] bg-[#0a0a0a] px-8 lg:px-14 py-24 lg:py-32"
      aria-label="Quatro Pilares — Arquitetura Digital"
    >
      <div className="max-w-6xl mx-auto">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-14 lg:mb-20" data-reveal>
          <span className="w-1 h-1 rounded-full bg-primary-blue flex-shrink-0" />
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/[0.16]">
            A Abordagem
          </span>
        </div>

        {/* Headline editorial com variação de peso + outline */}
        <div className="mb-20 lg:mb-28 overflow-hidden" data-reveal>

          {/* "QUATRO" — enorme, bold, branco */}
          <div
            className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] text-white/[0.93]"
            style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}
          >
            Quatro
          </div>

          {/* "PILARES." — outline (transparente com borda) */}
          <div
            className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.22)',
              color: 'transparent',
            }}
          >
            Pilares.
          </div>

          {/* "Um ecossistema." — menor, azul neon com glow */}
          <div
            className="font-heading font-light leading-[1.1] tracking-[-0.02em] mt-5 lg:mt-7"
            style={{
              fontSize: 'clamp(1.4rem, 2.8vw, 2.5rem)',
              color: '#00bcd4',
            }}
          >
            Um ecossistema.
          </div>

          {/* Subtítulo */}
          <p className="text-white/30 text-sm leading-relaxed mt-4 max-w-md">
            Não é um serviço isolado — é uma estrutura. Cada pilar sustenta os outros.
          </p>
        </div>

        {/* Grid editorial 2×2 com linhas cruzadas */}
        <div
          className="border-l border-t border-white/[0.07]"
          data-reveal
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {pillars.map((pillar) => (
              <div
                key={pillar.num}
                data-pillar
                className="border-r border-b border-white/[0.07] p-8 lg:p-10 group relative overflow-hidden"
              >
                {/* Número decorativo — grande, fundo */}
                <div
                  className="absolute top-6 right-8 font-heading font-extrabold leading-none select-none pointer-events-none transition-opacity duration-500 group-hover:opacity-100 group-[.is-active]:opacity-100"
                  style={{
                    fontSize: 'clamp(4rem, 6vw, 5.5rem)',
                    WebkitTextStroke: '1px rgba(0,188,212,0.08)',
                    color: 'transparent',
                    opacity: 0.6,
                  }}
                >
                  {pillar.num}
                </div>

                {/* Conteúdo do pilar */}
                <div className="relative z-10">
                  {/* Ícone + número pequeno */}
                  <div className="flex items-center gap-3 mb-8">
                    <div
                      className="p-2 rounded-lg border border-white/[0.07] group-hover:border-primary-blue/25 group-[.is-active]:border-primary-blue/25 transition-colors duration-300"
                      style={{ color: '#00bcd4' }}
                    >
                      {pillar.icon}
                    </div>
                    <span
                      className="font-heading font-extrabold tabular-nums"
                      style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.14em',
                        color: '#00bcd4',
                        opacity: 0.4,
                      }}
                    >
                      {pillar.num}
                    </span>
                  </div>

                  {/* Título */}
                  <h3
                    className="font-heading font-bold text-white/90 leading-snug mb-3 group-hover:text-white group-[.is-active]:text-white transition-colors duration-300"
                    style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)' }}
                  >
                    {pillar.title}
                  </h3>

                  {/* Subtítulo */}
                  <p className="text-white/50 text-sm leading-relaxed mb-4 group-hover:text-white/65 group-[.is-active]:text-white/65 transition-colors duration-300">
                    {pillar.subtitle}
                  </p>

                  {/* Detalhe técnico */}
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'rgba(0,188,212,0.35)' }}
                  >
                    {pillar.detail}
                  </p>
                </div>

                {/* Linha de accent no hover — bottom */}
                <div
                  className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full group-[.is-active]:w-full transition-all duration-500"
                  style={{ background: 'linear-gradient(90deg, #00bcd4, transparent)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-12 flex items-center gap-6" data-reveal>
          <a
            href="#diagnostico"
            className="inline-flex items-center gap-2.5 font-body text-sm font-semibold px-6 py-[13px] rounded-[7px] border border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-[#0a0a0a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue min-h-[44px]"
          >
            Solicitar diagnóstico gratuito
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <a
            href="/arquitetura-digital"
            className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue rounded"
          >
            Ver a metodologia completa →
          </a>
        </div>

      </div>
    </section>
  )
}

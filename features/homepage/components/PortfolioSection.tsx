'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const projects = [
  {
    index: '01',
    slug: 'pet-shop-araucaria',
    client: 'Pet Shop Araucária',
    category: 'Identidade Visual · SEO Local',
    tags: ['Marca', 'Google Meu Negócio', 'Redes Sociais'],
    summary:
      'Identidade de marca construída do zero com presença local consolidada. Google Meu Negócio otimizado, SEO local e conteúdo que posiciona antes do anúncio.',
    metrics: [
      { value: '1ª Pos.', label: 'Google Local' },
      { value: '+120%', label: 'Contatos/mês' },
    ],
    image: null as string | null,
    accent: '#00bcd4',
  },
  {
    index: '02',
    slug: 'ponto-das-portas',
    client: 'Ponto das Portas',
    category: 'Site Estratégico · Google Meu Negócio',
    tags: ['Site', 'SEO', 'Captação Local'],
    summary:
      'Presença digital estruturada do zero para empresa de esquadrias. Site focado em captação de orçamentos com posicionamento orgânico em buscas por região.',
    metrics: [
      { value: 'Top 3', label: 'Busca Local' },
      { value: '+90%', label: 'Orçamentos' },
    ],
    image: null as string | null,
    accent: '#7c4dff',
  },
  {
    index: '03',
    slug: 'rz-vet',
    client: 'RZ Vet',
    category: 'E-commerce · Tráfego Pago · UX/UI',
    tags: ['E-commerce', 'UX Redesign', 'Tráfego Pago'],
    summary:
      'Redesign completo do funil de compra com otimização de campanhas pagas. Crescimento exponencial em receita com ROAS consistente de 40× e faturamento recorrente.',
    metrics: [
      { value: '40×', label: 'ROAS Máximo' },
      { value: '+R$100k', label: 'Faturamento/mês' },
    ],
    image: null as string | null,
    accent: '#ff6b35',
  },
]

// Abstract visual for projects without images
function ProjectPlaceholder({ client, accent }: { client: string; accent: string }) {
  const initials = client
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: '#0d0d0d' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${accent}18 1px, transparent 1px)`,
          backgroundSize: '22px 22px',
        }}
      />
      {/* Center glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${accent}0d 0%, transparent 65%)`,
        }}
      />
      {/* Large initials */}
      <span
        className="relative font-heading font-extrabold leading-none select-none"
        style={{
          fontSize: 'clamp(4rem, 8vw, 7rem)',
          letterSpacing: '-0.04em',
          WebkitTextStroke: `1px ${accent}30`,
          color: 'transparent',
        }}
      >
        {initials}
      </span>
      {/* Corner label */}
      <span
        className="absolute bottom-4 right-5 text-[9px] font-semibold tracking-[0.14em] uppercase"
        style={{ color: `${accent}50` }}
      >
        Em breve
      </span>
    </div>
  )
}

export function PortfolioSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from('[data-pf-header]', {
        opacity: 0,
        y: 28,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 78%',
          once: true,
        },
      })

      // Cards stagger in
      gsap.from('[data-pf-row]', {
        opacity: 0,
        y: 40,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-pf-row]',
          start: 'top 85%',
          once: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="portfolio"
      className="border-t border-white/[0.07] bg-[#0a0a0a] px-8 lg:px-14 xl:px-20 pt-24 lg:pt-32 pb-0"
      aria-label="Portfólio & Cases — Digital Dog"
    >
      <div>

        {/* ── Header ── */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-end mb-20 lg:mb-28">
          <div>
            <div className="flex items-center gap-2 mb-12" data-pf-header>
              <span className="w-1 h-1 rounded-full bg-[#00bcd4] flex-shrink-0" />
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/[0.16]">
                Portfólio & Cases
              </span>
            </div>
            <div data-pf-header>
              <div
                className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] text-white/[0.93]"
                style={{ fontSize: 'clamp(2.8rem, 7vw, 7rem)' }}
              >
                Trabalho
              </div>
              <div
                className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] mt-1"
                style={{
                  fontSize: 'clamp(2.8rem, 7vw, 7rem)',
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.18)',
                  color: 'transparent',
                }}
              >
                executado.
              </div>
            </div>
          </div>
          <div className="pb-1" data-pf-header>
            <p className="text-white/40 leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }}>
              Cada projeto é um ecossistema digital completo — marca, site, SEO e presença integrados numa única arquitetura.
            </p>
          </div>
        </div>

        {/* ── Project grid 2 cols — connected lines ── */}
        <div
          data-grid
          className="border-l border-t border-white/[0.07]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.slug}
                data-pf-row
                className="group border-r border-b border-white/[0.07] flex flex-col relative overflow-hidden"
              >
                {/* Hover accent */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${project.accent}07 0%, transparent 65%)` }}
                />

                {/* Visual */}
                <div
                  className="relative overflow-hidden flex-shrink-0 border-b border-white/[0.07]"
                  style={{ height: '220px' }}
                >
                  {project.image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={project.image}
                        alt={`${project.client} — projeto Digital Dog`}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.45) 100%)' }}
                      />
                    </div>
                  ) : (
                    <ProjectPlaceholder client={project.client} accent={project.accent} />
                  )}
                </div>

                {/* Info */}
                <div className="relative z-10 flex flex-col gap-4 p-8 lg:p-9 flex-1">

                  {/* Index + Title */}
                  <div>
                    <span
                      className="text-[9px] font-semibold tracking-[0.18em] tabular-nums"
                      style={{ color: project.accent, opacity: 0.5 }}
                    >
                      {project.index}
                    </span>
                    <h3
                      className="font-heading font-extrabold leading-[0.92] tracking-[-0.03em] text-white/90 mt-1.5"
                      style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}
                    >
                      {project.client}
                    </h3>
                    <p
                      className="text-[10px] font-semibold tracking-[0.14em] uppercase mt-1.5"
                      style={{ color: 'rgba(255,255,255,0.2)' }}
                    >
                      {project.category}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-1 rounded"
                        style={{
                          color: project.accent,
                          background: `${project.accent}10`,
                          border: `1px solid ${project.accent}22`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Summary */}
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    {project.summary}
                  </p>

                  {/* Metrics + CTA */}
                  <div className="flex items-end justify-between pt-4 border-t border-white/[0.06]">
                    <div className="flex items-end gap-7">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="flex flex-col gap-0.5">
                          <span
                            className="font-heading font-extrabold leading-none tabular-nums"
                            style={{
                              fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
                              backgroundImage: 'linear-gradient(135deg, #ff6b35, #ff1744)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {m.value}
                          </span>
                          <span
                            className="text-[8.5px] font-semibold tracking-[0.12em] uppercase"
                            style={{ color: 'rgba(255,255,255,0.2)' }}
                          >
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <a
                      href={`/projetos/${project.slug}`}
                      className="inline-flex items-center gap-1.5 group/cta flex-shrink-0"
                      style={{ color: project.accent }}
                    >
                      <span className="text-[10px] font-semibold tracking-[0.08em] uppercase border-b border-transparent group-hover/cta:border-current transition-colors duration-200">
                        Ver projeto
                      </span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-0.5">
                        <path d="M2 6h8M7 3.5l2.5 2.5L7 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom strip ── */}
        <div className="border-t border-white/[0.07] py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p
            className="font-heading font-light leading-snug max-w-xs"
            style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }}
          >
            Mais projetos sendo documentados. Cada entrega vira referência.
          </p>
          <a
            href="/#diagnostico"
            className="flex-shrink-0 inline-flex items-center gap-2.5 font-body text-sm font-semibold px-6 py-[13px] rounded-[7px] text-white min-h-[44px]"
            style={{ background: 'linear-gradient(135deg, #ff6b35, #ff1744)' }}
          >
            Quero um projeto assim
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}

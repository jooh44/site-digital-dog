'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const projects = [
  {
    index: '01',
    slug: 'rz-vet',
    client: 'RZ Vet',
    clientSuffix: 'E-Commerce',
    category: 'E-commerce · Tráfego Pago · UX/UI',
    tags: ['E-commerce', 'UX Redesign', 'Tráfego Pago'],
    summary:
      'Redesign completo do funil de compra com otimização de campanhas pagas. Crescimento exponencial em receita com ROAS consistente de 40× e faturamento recorrente.',
    metrics: [
      { value: '40×', label: 'ROAS Máximo' },
      { value: '+R$100k', label: 'Faturamento/mês' },
      { value: 'Top 1', label: 'Google Curitiba' },
      { value: 'Top 3', label: 'AI Overview' },
    ],
    image: '/images/portfolio/case-rz-vet.jpeg' as string | null,
    logo: null as string | null,
    accent: '#ff6b35',
  },
  {
    index: '02',
    slug: 'ponto-das-portas',
    client: 'Ponto das Portas',
    clientSuffix: null as string | null,
    category: 'Site Estratégico · Google Meu Negócio',
    tags: ['Site', 'SEO', 'Captação Local'],
    summary:
      'Presença digital estruturada do zero para empresa de esquadrias. Site focado em captação de orçamentos com posicionamento orgânico em buscas por região.',
    metrics: [
      { value: 'Top 1', label: 'Google Local' },
      { value: 'Top 1', label: 'AI Overview' },
      { value: 'Zero Ads', label: 'Só Orgânico' },
    ],
    image: '/images/portfolio/case-ponto-das-portas.jpeg' as string | null,
    logo: null as string | null,
    accent: '#7c4dff',
  },
  {
    index: '03',
    slug: 'pet-shop-araucaria',
    client: 'Pet Shop Araucária',
    clientSuffix: null as string | null,
    category: 'Identidade Visual · SEO Local',
    tags: ['Marca', 'Google Meu Negócio', 'Redes Sociais'],
    summary:
      'Identidade de marca construída do zero com presença local consolidada. Google Meu Negócio otimizado, SEO local e conteúdo que posiciona antes do anúncio.',
    metrics: [
      { value: 'Top 1', label: 'Google Local' },
      { value: 'Top 3', label: 'AI Overview' },
      { value: '+75%', label: 'Base de Clientes' },
      { value: 'Prêmio', label: 'Melhores do Ano' },
    ],
    image: '/images/portfolio/case-pet-shop-araucaria.jpeg' as string | null,
    logo: null as string | null,
    accent: '#00bcd4',
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
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

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
    <>
    {/* ── Lightbox ── */}
    {lightbox && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.92)' }}
        onClick={() => setLightbox(null)}
      >
        <button
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          onClick={() => setLightbox(null)}
          aria-label="Fechar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div
          className="relative max-h-[90vh] max-w-[90vw]"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            style={{ display: 'block' }}
          />
        </div>
      </div>
    )}

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
                style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}
              >
                Funciona pra
              </div>
              <div
                className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] mt-1"
                style={{
                  fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.18)',
                  color: 'transparent',
                }}
              >
                qualquer negócio.
              </div>
            </div>
          </div>
          <div className="pb-1" data-pf-header>
            <p className="text-white/40 leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }}>
              Clínica, pet shop, e-commerce — não importa o segmento. A IA já recomenda nossos clientes em primeiro lugar.
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
                className="group border-r border-b border-white/[0.07] flex flex-col sm:flex-row relative overflow-hidden"
              >
                {/* Hover accent */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 0% 50%, ${project.accent}07 0%, transparent 65%)` }}
                />

                {/* Visual — lado esquerdo, altura total */}
                <div
                  className="relative flex-shrink-0 h-[220px] sm:h-auto sm:w-[42%] border-b border-white/[0.07] sm:border-b-0 sm:border-r sm:border-white/[0.07] overflow-hidden bg-[#0d0d0d] p-3"
                >
                  {project.image ? (
                    <div
                      className="absolute inset-3 cursor-zoom-in overflow-hidden rounded-sm"
                      onClick={() => setLightbox({ src: project.image!, alt: project.client })}
                    >
                      <Image
                        src={project.image}
                        alt={`${project.client} — projeto Digital Dog`}
                        fill
                        quality={92}
                        className="object-cover object-top transition-all duration-700 group-hover:scale-105 group-hover:blur-[2px]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Hint overlay — hover no desktop, sempre visível no mobile */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                        <span
                          className="relative z-10 text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 border border-white/10"
                          style={{
                            background: 'rgba(0,0,0,0.6)',
                            color: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 4px 24px -1px rgba(0,0,0,0.5)'
                          }}
                        >
                          <span className="hidden sm:inline">Clique para ampliar</span>
                          <span className="sm:hidden">Toque para ver</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0">
                      <ProjectPlaceholder client={project.client} accent={project.accent} />
                    </div>
                  )}
                </div>

                {/* Info — lado direito */}
                <div className="relative z-10 flex flex-col gap-4 p-6 lg:p-8 flex-1 min-w-0">

                  {/* Index + Title + Logo */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="text-[9px] font-semibold tracking-[0.18em] tabular-nums"
                        style={{ color: project.accent, opacity: 0.5 }}
                      >
                        {project.index}
                      </span>
                      {project.logo && (
                        <div className="flex-shrink-0 w-12 h-8 relative">
                          <Image
                            src={project.logo}
                            alt={`Logo ${project.client}`}
                            fill
                            className="object-contain object-right"
                          />
                        </div>
                      )}
                    </div>
                    <h3
                      className="font-heading font-extrabold leading-[0.92] tracking-[-0.03em] text-white/90 mt-1.5 flex items-baseline gap-3"
                      style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}
                    >
                      {project.client}
                      {project.clientSuffix && (
                        <span
                          className="text-[10px] font-semibold tracking-[0.12em] uppercase px-2 py-1 rounded"
                          style={{
                            background: `${project.accent}15`,
                            border: `1px solid ${project.accent}30`,
                            color: project.accent,
                          }}
                        >
                          {project.clientSuffix}
                        </span>
                      )}
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
                  <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.06]">
                    <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="flex flex-col gap-0.5">
                          <span
                            className="font-heading font-extrabold leading-none tabular-nums"
                            style={{
                              fontSize: 'clamp(1rem, 1.6vw, 1.4rem)',
                              backgroundImage: 'linear-gradient(135deg, #ff6b35, #ff1744)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {m.value}
                          </span>
                          <span
                            className="text-[8px] font-semibold tracking-[0.12em] uppercase"
                            style={{ color: 'rgba(255,255,255,0.2)' }}
                          >
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>

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
            Funciona para o meu?
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </section>
    </>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Prints de pesquisa (IA recomendando clientes em 1º lugar) serão adicionados aqui.
// Cada `image` receberá o path do screenshot quando disponível.
const cases = [
  {
    id: 'aumivet',
    client: 'Aumivet',
    segment: 'Clínica Veterinária',
    image: null as string | null, // screenshot IA em preparação
    challenge: 'Google sugeria concorrentes ao buscar pela própria marca — zero alcance orgânico.',
    solution: 'Novo site institucional com SEO técnico avançado. Recuperação completa da marca em 30 dias.',
    metrics: [
      { label: 'Busca Orgânica', value: '1ª Pos.' },
      { label: 'Agendamentos', value: '+110%' },
      { label: 'Cirurgias', value: 'Ref.' },
    ],
  },
  {
    id: 'morgan',
    client: 'Morgan & Ted',
    segment: 'Pet Shop',
    image: null as string | null,
    challenge: 'Negócio recém-aberto em mercado saturado. Baixa visibilidade para captar clientes locais.',
    solution: 'Landing page de alta conversão com agendamento via WhatsApp otimizado para móvel.',
    metrics: [
      { label: 'Google Local', value: 'Top 1' },
      { label: 'Agendamentos', value: '+150%' },
      { label: 'Tutores', value: 'Diários' },
    ],
  },
  {
    id: 'rzvet',
    client: 'RZ Vet',
    segment: 'E-commerce Pet',
    image: null as string | null,
    challenge: 'E-commerce estagnado, UX problemático e campanhas com ROI negativo.',
    solution: 'Redesign completo do funil de compra e otimização de tráfego pago.',
    metrics: [
      { label: 'AI Overviews', value: 'Top 3' },
      { label: 'Alcance', value: 'Nacional' },
      { label: 'Faturamento', value: '+100k' },
    ],
  },
]

export function CaseStudies() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from('[data-cs-reveal]', {
        opacity: 0,
        y: 32,
        duration: 0.75,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 78%',
          once: true,
        },
      })

      gsap.from('[data-cs-card]', {
        opacity: 0,
        y: 40,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-cs-grid]',
          start: 'top 80%',
          once: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="cases"
      className="border-t border-white/[0.07] bg-[#0a0a0a] px-8 lg:px-14 py-24 lg:py-32"
      aria-label="Cases de Sucesso — Digital Dog"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Eyebrow ── */}
        <div className="flex items-center gap-2 mb-14 lg:mb-20" data-cs-reveal>
          <span className="w-1 h-1 rounded-full bg-[#ff6b35] flex-shrink-0" />
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/[0.16]">
            Prova Social
          </span>
        </div>

        {/* ── Headline ── */}
        <div className="mb-16 lg:mb-24 grid lg:grid-cols-2 gap-8 lg:gap-14 items-end" data-cs-reveal>
          <div>
            <div className="overflow-hidden">
              <div
                className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] text-white/[0.93]"
                style={{ fontSize: 'clamp(2.8rem, 7vw, 7rem)' }}
              >
                Resultados
              </div>
              <div
                className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] mt-1"
                style={{
                  fontSize: 'clamp(2.8rem, 7vw, 7rem)',
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.18)',
                  color: 'transparent',
                }}
              >
                reais.
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 pb-1">
            <p className="text-white/40 leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }}>
              Não são promessas. São arquiteturas digitais construídas para durar — e os números provam isso.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Cada case é um ecossistema completo: marca, site, SEO e visibilidade trabalhando em conjunto.
            </p>
          </div>
        </div>

        {/* ── Cases Grid ── */}
        <div
          data-cs-grid
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5"
        >
          {cases.map((item) => (
            <div
              key={item.id}
              data-cs-card
              className="relative group flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Top accent line */}
              <div
                className="h-px w-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,53,0.6), transparent)' }}
              />

              {/* Evidence placeholder — receberá screenshot da IA */}
              <div
                className="relative w-full flex-shrink-0 flex items-center justify-center"
                style={{ height: '160px', background: 'rgba(0,0,0,0.35)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex flex-col items-center gap-2 px-6 text-center">
                  {/* Search bar outline — hint visual do que vem aí */}
                  <div
                    className="flex items-center gap-2 w-full max-w-[200px] px-3 py-1.5 rounded-md"
                    style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
                      <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M8 8l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span className="text-[9px] font-mono truncate" style={{ color: 'rgba(255,255,255,0.18)' }}>
                      {item.client.toLowerCase().replace('&', 'e').replace(' ', '')}...
                    </span>
                  </div>
                  {/* "em breve" hint */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: '#00bcd4',
                        animation: 'dd-cyan-pulse 1.6s ease-in-out infinite',
                      }}
                    />
                    <span
                      className="text-[9px] font-semibold tracking-[0.1em] uppercase"
                      style={{
                        color: '#00bcd4',
                        animation: 'dd-cyan-pulse 1.6s ease-in-out infinite',
                      }}
                    >
                      Em breve
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col p-6 gap-4 flex-1">

                {/* Segment + name */}
                <div>
                  <span
                    className="text-[9.5px] font-semibold tracking-[0.14em] uppercase"
                    style={{ color: 'rgba(255,107,53,0.65)' }}
                  >
                    {item.segment}
                  </span>
                  <h3
                    className="font-heading font-extrabold leading-none tracking-[-0.02em] text-white/90 mt-1"
                    style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}
                  >
                    {item.client}
                  </h3>
                </div>

                {/* Challenge + Solution */}
                <div className="flex flex-col gap-3 flex-1">
                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.12em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      Desafio
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)' }}>
                      {item.challenge}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.12em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      Solução
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)' }}>
                      {item.solution}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="border-t border-white/[0.07] pt-4 grid grid-cols-3 gap-3">
                  {item.metrics.map((m) => (
                    <div key={m.label} className="flex flex-col gap-0.5">
                      <span
                        className="font-heading font-extrabold leading-none tabular-nums"
                        style={{
                          fontSize: 'clamp(0.8rem, 1.3vw, 1rem)',
                          backgroundImage: 'linear-gradient(135deg, #ff6b35, #ff1744)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {m.value}
                      </span>
                      <span
                        className="text-[8.5px] font-semibold tracking-[0.08em] uppercase leading-tight"
                        style={{ color: 'rgba(255,255,255,0.22)' }}
                      >
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom accent line on hover */}
              <div
                className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: 'linear-gradient(90deg, rgba(255,107,53,0.6), transparent)' }}
              />
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/[0.07] pt-10"
          data-cs-reveal
        >
          <p
            className="font-heading font-light leading-snug max-w-sm"
            style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(1rem, 1.4vw, 1.2rem)' }}
          >
            Seu negócio pode ser o próximo caso de sucesso.
          </p>
          <a
            href="#diagnostico"
            className="flex-shrink-0 inline-flex items-center gap-2.5 font-body text-sm font-semibold px-6 py-[13px] rounded-[7px] text-white min-h-[44px]"
            style={{ background: 'linear-gradient(135deg, #ff6b35, #ff1744)' }}
          >
            Quero meu diagnóstico
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}

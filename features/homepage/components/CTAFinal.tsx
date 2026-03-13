'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useDiagnosticoModal } from '@/features/diagnostico/context/DiagnosticoModalContext'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function CTAFinal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { openModal } = useDiagnosticoModal()

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        gsap.from('[data-cta-reveal]', {
          opacity: 0,
          y: 32,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 78%',
            once: true,
          },
        })
      }

      // Trilhas SVG — stroke-dashoffset draw-in
      if (!prefersReduced && svgRef.current) {
        const paths = svgRef.current.querySelectorAll<SVGPathElement>('[data-trail]')
        paths.forEach((path, i) => {
          const len = path.getTotalLength()
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.6 + i * 0.15,
            delay: i * 0.22,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              once: true,
            },
          })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="diagnostico"
      ref={containerRef}
      className="relative overflow-hidden border-t border-white/[0.07] px-8 lg:px-14 xl:px-20 py-24 lg:py-32"
      aria-label="CTA Final — Diagnóstico Digital Dog"
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: '#0a0a0a',
          backgroundImage: `radial-gradient(rgba(255,255,255,0.016) 1px, transparent 1px)`,
          backgroundSize: '26px 26px',
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0a0a0a 0%, transparent 8%, transparent 92%, #0a0a0a 100%)',
        }}
      />

      {/* Circuit trails — right side, desktop only */}
      <svg
        ref={svgRef}
        viewBox="0 0 400 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-0 inset-y-0 h-full pointer-events-none hidden lg:block"
        style={{ width: 'clamp(260px, 30vw, 420px)' }}
        aria-hidden="true"
        preserveAspectRatio="xMaxYMid meet"
      >
        {/* Trail 1 — cyan, topo */}
        <path
          data-trail
          d="M400,65 L305,65 L305,108 L220,108"
          stroke="#00bcd4"
          strokeWidth="0.85"
          strokeLinecap="square"
          strokeOpacity="0.38"
        />
        <circle cx="220" cy="108" r="2.2" fill="#00bcd4" fillOpacity="0.45" />

        {/* Trail 2 — orange, upper-mid */}
        <path
          data-trail
          d="M400,178 L335,178 L335,220 L248,220 L248,262 L330,262"
          stroke="#ff6b35"
          strokeWidth="0.85"
          strokeLinecap="square"
          strokeOpacity="0.30"
        />
        <circle cx="330" cy="262" r="2.2" fill="#ff6b35" fillOpacity="0.38" />

        {/* Trail 3 — cyan, centro */}
        <path
          data-trail
          d="M400,318 L285,318 L285,358 L358,358 L358,398 L255,398"
          stroke="#00bcd4"
          strokeWidth="0.85"
          strokeLinecap="square"
          strokeOpacity="0.24"
        />
        <circle cx="255" cy="398" r="2.2" fill="#00bcd4" fillOpacity="0.32" />

        {/* Trail 4 — orange, base */}
        <path
          data-trail
          d="M400,448 L320,448 L320,490"
          stroke="#ff6b35"
          strokeWidth="0.85"
          strokeLinecap="square"
          strokeOpacity="0.18"
        />
        <circle cx="320" cy="490" r="2" fill="#ff6b35" fillOpacity="0.25" />
      </svg>

      <div className="relative z-10 max-w-3xl">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-14 lg:mb-20" data-cta-reveal>
          <span className="w-1 h-1 rounded-full bg-[#ff6b35] flex-shrink-0" />
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/[0.16]">
            O Próximo Passo
          </span>
        </div>

        {/* Headline */}
        <div className="mb-12 lg:mb-16" data-cta-reveal>
          <div
            className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] text-white/[0.93]"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 7rem)' }}
          >
            Pronto para
          </div>
          <div
            className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] mt-1"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 7rem)',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.18)',
              color: 'transparent',
            }}
          >
            construir o seu
          </div>
          <div
            className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] mt-1"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 7rem)',
              backgroundImage: 'linear-gradient(135deg, #ff6b35, #ff1744)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ecossistema?
          </div>
        </div>

        {/* Sub + CTA */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-8"
          data-cta-reveal
        >
          <p
            className="text-white/40 leading-relaxed max-w-sm"
            style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }}
          >
            O Diagnóstico Digital é o primeiro passo. Gratuito. Sem compromisso. Com inteligência.
          </p>
          <button
            className="inline-flex items-center gap-2.5 font-body text-sm font-semibold px-6 py-[13px] rounded-[7px] text-white flex-shrink-0 min-h-[44px] transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            style={{ background: 'linear-gradient(135deg, #ff6b35, #ff1744)' }}
            onClick={openModal}
          >
            Quero meu Diagnóstico Digital
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  )
}

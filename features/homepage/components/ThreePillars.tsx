'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* ─────────────────────────────────────────────
   CSS KEYFRAMES (injected once per mount)
───────────────────────────────────────────── */
const KEYFRAMES = `
@keyframes dd-radar {
  0%   { transform: scale(0.15); opacity: 0.8; }
  100% { transform: scale(1);    opacity: 0;   }
}
@keyframes dd-pin-pulse {
  0%, 100% { transform: scale(1);   opacity: 1;   }
  50%       { transform: scale(1.6); opacity: 0.4; }
}
@keyframes dd-dot-in {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1);   opacity: 0.85; }
}
@keyframes dd-swatch-in {
  from { transform: scaleX(0); opacity: 0; }
  to   { transform: scaleX(1); opacity: 1; }
}
@keyframes dd-logo-breathe {
  0%, 100% { box-shadow: 0 0 0   0px rgba(255,107,53,0.0); }
  50%       { box-shadow: 0 0 28px 4px rgba(255,107,53,0.35); }
}
@keyframes dd-terminal-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes dd-line-in {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes dd-bar-grow {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}
@keyframes dd-rank-up {
  0%   { transform: translateY(0px);  }
  35%  { transform: translateY(-54px); }
  100% { transform: translateY(-54px); }
}
@keyframes dd-glow-card {
  0%, 100% { opacity: 0.35; }
  50%       { opacity: 0.7;  }
}
@keyframes dd-tag-scan {
  0%, 100% { opacity: 0.35; box-shadow: none; }
  10%      { opacity: 1;    box-shadow: 0 0 10px currentColor; }
  22%      { opacity: 0.35; box-shadow: none; }
}
`

/* ─────────────────────────────────────────────
   ANIMATION — Pilar da Marca (Brand Identity)
───────────────────────────────────────────── */
function BrandAnimation() {
  const palette = [
    { color: '#ff6b35', label: 'Principal' },
    { color: '#ff1744', label: 'Acento' },
    { color: '#0a0a0a', label: 'Fundo' },
    { color: '#f0ece4', label: 'Off-white' },
    { color: '#00bcd4', label: 'Digital' },
  ]

  return (
    <div className="relative w-full flex flex-col gap-4 px-1 py-2" aria-hidden="true">

      {/* Logo mark */}
      <div className="flex items-center gap-3">
        <div className="relative w-11 h-11 flex-shrink-0">
          <Image
            src="/images/logo_digital_dog-removebg-preview.png"
            alt="Digital Dog"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <div className="text-white/80 text-xs font-semibold font-heading tracking-tight">Digital Dog</div>
          <div className="text-[10px] font-body" style={{ color: 'rgba(255,255,255,0.42)' }}>Identidade Visual</div>
        </div>
      </div>

      {/* Color palette — staggered reveal */}
      <div>
        <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-white/20 mb-2">Paleta</p>
        <div className="flex gap-1.5 h-7">
          {palette.map((swatch, i) => (
            <div
              key={swatch.color}
              className="flex-1 rounded-sm"
              style={{
                background: swatch.color,
                border: swatch.color === '#f0ece4' ? '1px solid rgba(255,255,255,0.12)' : undefined,
                transformOrigin: 'left center',
                animation: `dd-swatch-in 0.45s ease-out both`,
                animationDelay: `${0.1 + i * 0.12}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Typography specimen */}
      <div className="border-t border-white/[0.06] pt-3">
        <div className="flex items-baseline gap-3">
          <span
            className="font-heading font-black text-white/70 leading-none"
            style={{ fontSize: '1.8rem', letterSpacing: '-0.04em' }}
          >
            Aa
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-white/35 font-heading">Space Grotesk</span>
            <div className="flex gap-2">
              {['700', '500', '300'].map((w) => (
                <span key={w} className="text-[8px] font-body tracking-wider" style={{ color: 'rgba(255,255,255,0.28)' }}>{w}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brandbook badge */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#ff6b35' }} />
        <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-white/25">
          Brandbook incluso
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ANIMATION — Pilar Tecnológico (Leads chegando)
───────────────────────────────────────────── */
const leads = [
  {
    initials: 'JS',
    name: 'João S.',
    action: 'pediu orçamento',
    source: 'Google',
    time: '2 min',
    delay: '0.2s',
  },
  {
    initials: 'MA',
    name: 'Maria A.',
    action: 'enviou mensagem',
    source: 'Site',
    time: '18 min',
    delay: '0.55s',
  },
  {
    initials: 'CR',
    name: 'Carlos R.',
    action: 'quer contato',
    source: 'ChatGPT',
    time: '1 h',
    delay: '0.9s',
  },
]

function TechAnimation() {
  return (
    <div className="relative w-full px-1 py-1" aria-hidden="true">

      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 rounded-t-lg"
        style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#28c840', boxShadow: '0 0 6px #28c840' }}
          />
          <span className="text-[9.5px] font-semibold text-white/45">Contatos de hoje</span>
        </div>
        <span className="text-[9px] font-bold tabular-nums" style={{ color: '#00bcd4' }}>+3</span>
      </div>

      {/* Lead cards */}
      <div
        className="rounded-b-lg divide-y"
        style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,255,255,0.04)' }}
      >
        {leads.map((lead) => (
          <div
            key={lead.name}
            className="flex items-center gap-3 px-3 py-2.5"
            style={{
              borderColor: 'rgba(255,255,255,0.04)',
              animation: 'dd-line-in 0.45s ease-out both',
              animationDelay: lead.delay,
            }}
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[8px] font-bold"
              style={{ background: 'rgba(0,188,212,0.15)', color: '#00bcd4' }}
            >
              {lead.initials}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-white/75">{lead.name}</span>
                <span className="text-[9px] text-white/30">{lead.action}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="text-[8px] font-semibold tracking-wide px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(0,188,212,0.1)', color: '#00bcd4' }}
                >
                  {lead.source}
                </span>
                <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{lead.time} atrás</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer stat */}
      <div
        className="flex items-center justify-between mt-3 px-1"
        style={{ animation: 'dd-line-in 0.4s ease-out both', animationDelay: '1.1s' }}
      >
        <span className="text-[8.5px] text-white/25">orgânicos esta semana</span>
        <div className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 7l3-4 3 4" stroke="#28c840" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[9px] font-bold" style={{ color: '#28c840' }}>+12</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ANIMATION — Pilar de Marketing (MAP)
───────────────────────────────────────────── */
function HyperLocalMap() {
  const customerDots = [
    { cx: 68,  cy: 52,  delay: '0.4s' },
    { cx: 126, cy: 47,  delay: '0.7s' },
    { cx: 148, cy: 78,  delay: '1.0s' },
    { cx: 140, cy: 108, delay: '1.3s' },
    { cx: 88,  cy: 118, delay: '1.6s' },
    { cx: 58,  cy: 98,  delay: '1.9s' },
    { cx: 105, cy: 138, delay: '2.2s' },
    { cx: 162, cy: 60,  delay: '2.5s' },
  ]

  // City block rects [x, y, w, h]
  const blocks = [
    [28, 18,  22, 12], [62, 18,  18, 12], [94, 18,  24, 12], [132, 18, 18, 12], [164, 18, 26, 12],
    [28, 42,  16, 18], [58, 42,  14, 8 ], [86, 42,  16, 14], [118, 42, 20, 10], [152, 42, 24, 16],
    [28, 72,  20, 14], [62, 72,  12, 18], [92, 72,  16, 10], [122, 72, 26, 18], [162, 72, 22, 12],
    [28, 98,  18, 16], [58, 98,  22, 12], [94, 98,  14, 20], [124, 98, 18, 14], [156, 98, 28, 18],
    [28, 126, 24, 14], [64, 126, 16, 14], [96, 126, 20, 12], [130, 126,14, 16], [160, 126,22, 14],
  ]

  return (
    <div className="relative w-full h-52 overflow-hidden rounded-lg" aria-hidden="true">
      <svg
        viewBox="0 0 210 160"
        className="w-full h-full"
        style={{ display: 'block' }}
      >
        {/* City grid lines */}
        {[32, 64, 96, 128].map((y) => (
          <line key={`h${y}`} x1="10" y1={y} x2="200" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
        ))}
        {[48, 88, 128, 168].map((x) => (
          <line key={`v${x}`} x1={x} y1="8" x2={x} y2="155" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
        ))}

        {/* City blocks */}
        {blocks.map(([x, y, w, h], i) => (
          <rect
            key={i}
            x={x} y={y} width={w} height={h}
            fill="rgba(255,255,255,0.025)"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
        ))}

        {/* Soft area fill */}
        <circle cx="105" cy="82" r="42" fill="rgba(255,107,53,0.04)" />

        {/* Radar expanding rings */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="105" cy="82" r="52"
            fill="none"
            stroke="#ff6b35"
            strokeWidth="0.9"
            style={{
              transformOrigin: '105px 82px',
              animation: `dd-radar 3.2s ease-out infinite`,
              animationDelay: `${i * 1.07}s`,
            }}
          />
        ))}

        {/* Dashed lines to nearest dots */}
        {customerDots.slice(0, 4).map((dot, i) => (
          <line
            key={i}
            x1="105" y1="82"
            x2={dot.cx} y2={dot.cy}
            stroke="rgba(0,188,212,0.12)"
            strokeWidth="0.6"
            strokeDasharray="3 4"
          />
        ))}

        {/* Customer dots */}
        {customerDots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx} cy={dot.cy} r="2.8"
            fill="#00bcd4"
            style={{
              transformOrigin: `${dot.cx}px ${dot.cy}px`,
              animation: `dd-dot-in 0.5s ease-out both`,
              animationDelay: dot.delay,
            }}
          />
        ))}

        {/* Center pin outer ring */}
        <circle
          cx="105" cy="82" r="10"
          fill="none"
          stroke="#ff6b35"
          strokeWidth="1"
          opacity="0.5"
          style={{
            transformOrigin: '105px 82px',
            animation: 'dd-pin-pulse 2.2s ease-in-out infinite',
          }}
        />
        {/* Center pin fill */}
        <circle cx="105" cy="82" r="5" fill="#ff6b35" />
        <circle cx="105" cy="82" r="2.5" fill="rgba(255,255,255,0.9)" />

        {/* Radius label */}
        <text x="105" y="150" textAnchor="middle" fill="rgba(255,107,53,0.55)" fontSize="7.5" fontFamily="sans-serif" fontWeight="600" letterSpacing="1">
          RAIO DE ATUAÇÃO
        </text>
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const pillars = [
  {
    num: '01',
    label: 'Pilar da',
    title: 'Marca',
    description: 'Logo, identidade visual, brandbook e naming. A linguagem que diferencia antes mesmo de qualquer palavra.',
    services: ['Identidade Visual', 'Brandbook', 'Naming', 'UI Kit'],
    accent: '#ff6b35',
    animation: <BrandAnimation />,
  },
  {
    num: '02',
    label: 'Pilar',
    title: 'Tecnológico',
    description: 'Site estratégico, SEO, AIO e automações. A infraestrutura que entrega sua marca para humanos e IAs.',
    services: ['Site / Web App', 'SEO + AIO', 'Automações', 'Integrações'],
    accent: '#00bcd4',
    animation: <TechAnimation />,
  },
  {
    num: '03',
    label: 'Pilar de',
    title: 'Marketing',
    description: 'Tráfego hiperlocalizado, Google Meu Negócio e presença social. Clientes encontrando você — não o contrário.',
    services: ['Google Meu Negócio', 'Tráfego Local', 'Instagram', 'Tráfego Pago'],
    accent: '#7c4dff',
    animation: <HyperLocalMap />,
  },
]

export function ThreePillars() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const styleInjected = useRef(false)

  useEffect(() => {
    // Inject keyframes once
    if (!styleInjected.current) {
      const style = document.createElement('style')
      style.textContent = KEYFRAMES
      document.head.appendChild(style)
      styleInjected.current = true
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Parallax background layer
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          y: 80,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Headline reveal
      gsap.from('[data-tp-reveal]', {
        opacity: 0,
        y: 36,
        duration: 0.75,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 78%',
          once: true,
        },
      })

      // Cards stagger
      gsap.from('[data-tp-card]', {
        opacity: 0,
        y: 48,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-tp-grid]',
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
      className="relative overflow-hidden border-t border-white/[0.07] py-24 lg:py-36 px-8 lg:px-14 xl:px-20"
      aria-label="Três Pilares — Metodologia Digital Dog"
    >
      {/* ── Parallax Background Layer ── */}
      <div
        ref={bgRef}
        className="absolute inset-x-0 pointer-events-none select-none"
        style={{
          top: '-80px',
          bottom: '-80px',
          background: '#0a0a0a',
          backgroundImage: `radial-gradient(rgba(255,255,255,0.016) 1px, transparent 1px)`,
          backgroundSize: '26px 26px',
        }}
      />

      {/* ── Vignette edges ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0a0a0a 0%, transparent 8%, transparent 92%, #0a0a0a 100%)',
        }}
      />

      <div className="relative z-10">

        {/* ── Eyebrow ── */}
        <div className="flex items-center gap-2 mb-14 lg:mb-20" data-tp-reveal>
          <span className="w-1 h-1 rounded-full bg-[#7c4dff] flex-shrink-0" />
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/[0.16]">
            A Metodologia
          </span>
        </div>

        {/* ── Headline ── */}
        <div className="mb-16 lg:mb-24 max-w-3xl" data-tp-reveal>
          <div className="overflow-hidden">
            <div
              className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] text-white/[0.93]"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 7rem)' }}
            >
              Três pilares.
            </div>
            <div
              className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] mt-1"
              style={{
                fontSize: 'clamp(2.8rem, 7vw, 7rem)',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.18)',
                color: 'transparent',
              }}
            >
              Uma arquitetura.
            </div>
          </div>
          <p
            className="text-white/30 leading-relaxed mt-6 max-w-xl"
            style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}
          >
            Cada pilar sustenta os outros dois. Marca sem tecnologia não escala. Tecnologia sem marketing não converte. Marketing sem marca não fideliza.
          </p>
        </div>

        {/* ── Three Pillars Grid ── */}
        <div
          data-tp-grid
          className="border-l border-t border-white/[0.07]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              data-tp-card
              className="relative group flex flex-col border-r border-b border-white/[0.07] overflow-hidden cursor-default"
            >
              {/* Card glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${pillar.accent}10 0%, transparent 65%)`,
                }}
              />

              {/* Top accent bar */}
              <div
                className="h-px w-full flex-shrink-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${pillar.accent}60, transparent)`,
                  animation: 'dd-glow-card 4s ease-in-out infinite',
                  animationDelay: `${parseInt(pillar.num) * 0.6}s`,
                }}
              />

              <div className="flex flex-col p-6 gap-5 flex-1 relative z-10">

                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="font-heading font-extrabold tabular-nums"
                      style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color: pillar.accent, opacity: 0.5 }}
                    >
                      {pillar.num}
                    </span>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: pillar.accent, opacity: 0.6 }}
                    />
                  </div>

                  <div>
                    <p
                      className="font-heading font-light leading-none"
                      style={{ fontSize: '0.75rem', color: pillar.accent, opacity: 0.65, marginBottom: '2px' }}
                    >
                      {pillar.label}
                    </p>
                    <h3
                      className="font-heading font-extrabold leading-none tracking-[-0.03em] text-white/90"
                      style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)' }}
                    >
                      {pillar.title}
                    </h3>
                  </div>
                </div>

                {/* Animation area */}
                <div
                  className="overflow-hidden flex-shrink-0"
                  style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: pillar.num === '03' ? '0' : '12px 10px',
                  }}
                >
                  {pillar.animation}
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed flex-1 transition-colors duration-300" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {pillar.description}
                </p>

                {/* Services included */}
                <div className="flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-4">
                  {pillar.services.map((svc, i) => {
                    const total = pillar.services.length * 1.2
                    return (
                      <span
                        key={svc}
                        className="text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-1"
                        style={{
                          color: pillar.accent,
                          background: `${pillar.accent}10`,
                          border: `1px solid ${pillar.accent}22`,
                          animation: `dd-tag-scan ${total}s ${i * 1.2}s ease-in-out infinite both`,
                        }}
                      >
                        {svc}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* ── Bottom CTA strip ── */}
        <div
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/[0.07] pt-10"
          data-tp-reveal
        >
          <p
            className="font-heading font-light leading-snug max-w-sm"
            style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(1rem, 1.4vw, 1.2rem)' }}
          >
            O diagnóstico revela qual pilar precisa de mais atenção no seu negócio.
          </p>
          <a
            href="#diagnostico"
            className="flex-shrink-0 inline-flex items-center gap-2.5 font-body text-sm font-semibold px-6 py-[13px] rounded-[7px] transition-all duration-200 focus:outline-none focus:ring-2 min-h-[44px]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
            }}
          >
            Quero meu diagnóstico
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}

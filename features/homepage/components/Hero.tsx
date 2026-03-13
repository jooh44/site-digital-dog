'use client'

import Image from 'next/image'
import { HeroAISimulation } from './HeroAISimulation'

const NAV_LINKS = [
  { name: 'Serviços', href: '#servicos' },
  { name: 'Portfólio', href: '#portfolio' },
  { name: 'Diagnóstico', href: '#diagnostico' },
]

export function Hero() {
  return (
    <section
      className="grid lg:grid-cols-[52fr_48fr] min-h-screen lg:h-screen lg:min-h-[600px] pt-16 lg:pt-0"
      style={{ background: '#0a0a0a' }}
      aria-label="Hero — Digital Dog Arquitetura Digital"
    >
      {/* ── LEFT COLUMN ── */}
      <div className="flex flex-col px-8 py-12 lg:px-14 lg:py-0 border-b lg:border-b-0 lg:border-r border-white/[0.07]">

        {/* Desktop nav row — hidden on mobile (Header handles mobile) */}
        <div className="hidden lg:flex items-center justify-between pt-7 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 flex-shrink-0">
              <Image
                src="/images/logo_digital_dog-removebg-preview.png"
                alt="Digital Dog"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span
                className="font-heading font-bold leading-none tracking-[-0.02em]"
                style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.88)' }}
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
          </div>
          <nav className="flex items-center gap-6" aria-label="Menu principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue rounded"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#diagnostico"
              className="text-sm font-medium px-4 py-2 rounded border border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-dark-blue transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              Solicitar Diagnóstico
            </a>
          </nav>
        </div>

        {/* WIP Banner */}
        <div className="hidden lg:flex items-center gap-2 mt-6 flex-shrink-0">
          <span
            className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] uppercase px-3 py-1.5 rounded"
            style={{
              border: '1px solid rgba(255,107,53,0.25)',
              color: 'rgba(255,107,53,0.65)',
              background: 'rgba(255,107,53,0.05)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#ff6b35', animation: 'dd-pin-pulse 2s ease-in-out infinite' }}
            />
            Trabalho em desenvolvimento
          </span>
        </div>

        {/* Hero content */}
        <div className="flex flex-col justify-center flex-1">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1 h-1 rounded-full bg-primary-blue flex-shrink-0" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/[0.16]">
              AIO · GEO · ARQUITETURA DIGITAL
            </span>
          </div>

          {/* H1 */}
          <h1
            className="font-heading font-extrabold leading-[1.07] tracking-[-0.03em] text-white/[0.93] mb-5"
            style={{ fontSize: 'clamp(2.3rem, 4vw, 4rem)' }}
          >
            Quando seu cliente
            <br />
            consultar a IA, o seu
            <br />
            negócio vai{' '}
            <span
              style={{
                backgroundImage: 'linear-gradient(135deg, #ff6b35, #ff1744)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '0 100%',
                backgroundSize: '100% 2.5px',
                paddingBottom: '3px',
              }}
            >
              aparecer
            </span>
            ?
          </h1>

          {/* Sub */}
          <p className="text-base text-white/60 leading-[1.75] max-w-[400px] mb-10">
            Seus concorrentes já estão sendo indexados. A Digital Dog constrói a infraestrutura que coloca o seu negócio
            como referência no Google, ChatGPT e Gemini.
          </p>

          {/* CTA primário */}
          <button
            className="inline-flex items-center gap-2.5 font-body text-sm font-semibold px-6 py-[13px] rounded-[7px] text-white w-fit min-h-[44px]"
            style={{ background: 'linear-gradient(135deg, #ff6b35, #ff1744)' }}
            onClick={() => {
              /* abrir modal diagnóstico — Epic 3 */
            }}
          >
            Quero meu Diagnóstico Digital
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Trust strip */}
        <div className="pt-5 pb-7 lg:pb-8 border-t border-white/[0.07] flex items-center gap-4 flex-wrap flex-shrink-0">
          <span className="text-[10px] tracking-[0.1em] uppercase text-white/[0.16] whitespace-nowrap">Clientes</span>
          <div className="flex gap-3 flex-wrap">
            {['Aumivet', 'Morgan & Ted', 'RZ Vet'].map((name) => (
              <span key={name} className="text-[12px] font-medium text-white/35">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN — AI Simulation (full height, no offset) ── */}
      <HeroAISimulation />
    </section>
  )
}

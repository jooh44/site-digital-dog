'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const painItems = [
  { label: 'Sites sem estratégia', description: 'Bonitos, mas invisíveis. Sem posicionamento.' },
  { label: 'Posts sem marca', description: 'Volume sem identidade. Ninguém lembra de você.' },
  { label: 'Anúncios sem base', description: 'Tráfego que não converte. Dinheiro que vai embora.' },
  { label: 'Fornecedores sem coesão', description: 'Ninguém vê o todo. Cada um cuida do seu pedaço.' },
]

const contrastItems = {
  before: [
    'Vários fornecedores, zero integração',
    'Estratégia não documentada',
    'Recomeço a cada troca',
    'Dependência contínua de terceiros',
  ],
  after: [
    'Um sistema coeso, do diagnóstico ao ar',
    'Estratégia documentada e transferível',
    'Ativos que pertencem a você',
    'Independência crescente com o tempo',
  ],
}

export function PainPoints() {
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
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="border-t border-white/[0.07] bg-[#0a0a0a] px-8 lg:px-14 py-24 lg:py-32"
      aria-label="Problema — modelo fragmentado"
    >
      <div className="max-w-6xl mx-auto">

        {/* Eyebrow — espelha padrão da Hero */}
        <div className="flex items-center gap-2 mb-14 lg:mb-20" data-reveal>
          <span className="w-1 h-1 rounded-full bg-primary-blue flex-shrink-0" />
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/[0.16]">
            O Problema
          </span>
        </div>

        {/* Headline editorial — tipografia com variação extrema de peso */}
        <div className="mb-20 lg:mb-28 overflow-hidden" data-reveal>
          {/* "Você já" — bold, branco */}
          <div
            className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] text-white/[0.93]"
            style={{ fontSize: 'clamp(3.5rem, 8.5vw, 8.5rem)' }}
          >
            Você já
          </div>

          {/* "investiu." — bold, azul neon com glow */}
          <div
            className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(3.5rem, 8.5vw, 8.5rem)',
              color: '#00bcd4',
            }}
          >
            investiu.
          </div>

          {/* espaçamento entre os dois blocos */}
          <div className="mt-5 lg:mt-7" />

          {/* "E ainda não tem" — thin/light, branco desbotado */}
          <div
            className="font-heading font-light leading-[0.88] tracking-[-0.02em] text-white/25"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 4.5rem)' }}
          >
            E ainda não tem nada
          </div>

          {/* "construído." — outline text: preenchimento transparente, borda suave */}
          <div
            className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(1.8rem, 4.5vw, 4.5rem)',
              WebkitTextStroke: '1px rgba(255,255,255,0.16)',
              color: 'transparent',
            }}
          >
            construído.
          </div>
        </div>

        {/* Pain items — tabela editorial com linhas horizontais */}
        <div data-reveal>
          {painItems.map((item, i) => (
            <div
              key={item.label}
              className="border-t border-white/[0.07] py-5 grid gap-x-8 items-start"
              style={{ gridTemplateColumns: '2.5rem 1fr auto' }}
            >
              {/* Número como elemento tipográfico */}
              <span
                className="font-heading font-extrabold tabular-nums leading-tight mt-0.5"
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  color: '#00bcd4',
                  opacity: 0.45,
                }}
              >
                0{i + 1}
              </span>

              {/* Label — seminegrito, branco */}
              <span className="font-heading font-semibold text-white/90 leading-snug" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)' }}>
                {item.label}
              </span>

              {/* Descrição — right-aligned, subtil */}
              <span className="text-white/30 text-sm leading-relaxed text-right hidden md:block max-w-xs">
                {item.description}
              </span>

              {/* Descrição mobile — abaixo do label */}
              <span className="text-white/30 text-sm leading-relaxed col-start-2 mt-1 md:hidden">
                {item.description}
              </span>
            </div>
          ))}
          {/* Linha de fechamento */}
          <div className="border-t border-white/[0.07]" />
        </div>

        {/* Frase de transição — quote editorial com "zero" em azul */}
        <div className="py-16 lg:py-24 max-w-4xl" data-reveal>
          <p
            className="font-heading font-light text-white/45 leading-[1.15] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(1.6rem, 3.2vw, 3rem)' }}
          >
            &ldquo;Quando o contrato acaba,
            <br />
            você volta à estaca{' '}
            <span
              className="font-extrabold"
              style={{
                color: '#00bcd4',
              }}
            >
              zero.
            </span>
            &rdquo;
          </p>
        </div>

        {/* Contraste — grid com borda divisória editorial */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-white/[0.07]" data-reveal>

          {/* Coluna esquerda — Fragmentado */}
          <div className="py-10 md:pr-12 md:border-r border-white/[0.07]">
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/18 mb-7">
              Modelo fragmentado
            </p>
            <ul className="space-y-3.5">
              {contrastItems.before.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/30 text-sm leading-relaxed">
                  <span className="flex-shrink-0 text-white/15 mt-px">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna direita — Digital Dog */}
          <div className="py-10 md:pl-12 border-t md:border-t-0 border-white/[0.07]">
            <p
              className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-7"
              style={{ color: 'rgba(0,188,212,0.45)' }}
            >
              Ecossistema Digital Dog
            </p>
            <ul className="space-y-3.5">
              {contrastItems.after.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/65 text-sm leading-relaxed">
                  <span className="flex-shrink-0 mt-px" style={{ color: '#00bcd4' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA sutil */}
        <div className="pt-10" data-reveal>
          <a
            href="#servicos"
            className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary-blue rounded"
            style={{ color: '#00bcd4' }}
          >
            Conheça a abordagem Digital Dog
            <span aria-hidden="true">↓</span>
          </a>
        </div>

      </div>
    </section>
  )
}

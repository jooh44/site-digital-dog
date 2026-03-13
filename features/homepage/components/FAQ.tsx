'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const faqs = [
  {
    id: 'o-que-e-diagnostico',
    question: 'O que é o Diagnóstico Digital?',
    answer:
      'O Diagnóstico Digital é o primeiro passo do nosso método — um mapeamento real da jornada comportamental do seu cliente na internet, antes de propor qualquer estratégia ou solução.',
  },
  {
    id: 'quanto-tempo',
    question: 'Quanto tempo leva o Diagnóstico?',
    answer:
      'Em média 45 minutos a 1 hora de conversa inicial. Após isso, enviamos um relatório detalhado com nossas análises e uma proposta personalizada.',
  },
  {
    id: 'qual-o-custo',
    question: 'O Diagnóstico tem custo?',
    answer:
      'O Diagnóstico Digital é gratuito. Ele é o nosso investimento no relacionamento — só faz sentido propor uma solução depois de entender o seu negócio.',
  },
  {
    id: 'para-quem',
    question: 'Para quem é a Digital Dog?',
    answer:
      'Para donos de negócios locais e regionais — advogados, médicos, veterinários, consultores — que já investiram em digital sem construir nada de fato. Que precisam de um parceiro que entende o negócio antes de propor qualquer coisa.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from('[data-faq-reveal]', {
        opacity: 0,
        y: 32,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 78%',
          once: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="faq"
      ref={containerRef}
      className="relative overflow-hidden border-t border-white/[0.07] py-24 lg:py-32 px-8 lg:px-14 xl:px-20"
    >
      {/* JSON-LD FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Dot grid background — padrão do site */}
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

      {/* Decorative ? — desktop only */}
      <div
        className="absolute right-8 xl:right-14 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
        aria-hidden="true"
        style={{
          fontSize: 'clamp(16rem, 22vw, 24rem)',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          lineHeight: 1,
          WebkitTextStroke: '1.5px rgba(255,255,255,0.055)',
          color: 'transparent',
          letterSpacing: '-0.04em',
        }}
      >
        ?
      </div>

      <div className="relative z-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-12 lg:mb-16" data-faq-reveal>
          <span className="w-1 h-1 rounded-full bg-[#00bcd4] flex-shrink-0" />
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/[0.16]">
            Perguntas Frequentes
          </span>
        </div>

        {/* Headline */}
        <div className="mb-14 lg:mb-20 max-w-2xl" data-faq-reveal>
          <div
            className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] text-white/[0.93]"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 5rem)' }}
          >
            Ficou alguma
          </div>
          <div
            className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] mt-1"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 5rem)',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.18)',
              color: 'transparent',
            }}
          >
            dúvida?
          </div>
        </div>

        {/* Accordion */}
        <div className="lg:w-1/2 border-l border-t border-white/[0.07]">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id
            return (
              <div
                key={faq.id}
                data-faq-reveal
                className="border-r border-b border-white/[0.07] overflow-hidden"
                style={{
                  background: isOpen ? 'rgba(0,188,212,0.03)' : 'transparent',
                  transition: 'background 0.3s',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-btn-${faq.id}`}
                  className="w-full flex items-center justify-between px-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00bcd4] focus-visible:outline-offset-2"
                >
                  <span className="font-heading font-semibold pr-4 text-sm lg:text-base" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {faq.question}
                  </span>
                  <span
                    className="flex-shrink-0 transition-transform duration-300"
                    style={{
                      color: 'rgba(255,255,255,0.35)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                    aria-hidden="true"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 6l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? '200px' : '0' }}
                >
                  <p
                    className="px-6 pb-5 text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

const DATA = [
  {
    mode: 'google' as const,
    query: 'advogado direito civil Curitiba melhor avaliado',
    urlBar: 'google.com/search?q=advogado+Curitiba+PR',
    geminiText:
      'O escritório Mendes & Associados se destaca em Curitiba pela reputação sólida e forte presença digital. Especializado em direito civil e trabalhista, aparece consistentemente nas buscas locais e no Google Maps com ótimas avaliações.',
    bizIcon: '⚖️',
    bizName: 'Mendes & Associados',
    bizMeta: 'Advocacia · Curitiba, PR · mendes-advocacia.com.br',
    bizRat: '4.9',
    regUrl: 'mendes-advocacia.com.br › areas-de-atuacao',
    regTitle: 'Mendes & Associados — Direito Civil, Trabalhista e Previdenciário',
  },
  {
    mode: 'chatgpt' as const,
    query: 'Qual o melhor advogado em Curitiba com boa reputação?',
    urlBar: 'chatgpt.com',
    gptUser: 'Qual o melhor advogado em Curitiba, PR? Preciso de alguém confiável.',
    gptAi:
      'Em Curitiba, o escritório Mendes & Associados é frequentemente recomendado pela reputação consolidada, atendimento especializado e forte presença digital. Confira as principais opções:',
    gptCardName: 'Mendes & Associados',
    gptCardMeta: 'Direito Civil & Trabalhista · OAB/PR · alta avaliação local',
  },
]

// OpenAI logo SVG — path oficial, renderização nítida
function OpenAIIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 41 41"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      style={{ shapeRendering: 'geometricPrecision' }}
    >
      <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-7.504-3.366 10.079 10.079 0 0 0-9.63 6.977 9.967 9.967 0 0 0-6.65 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.504 3.366 10.078 10.078 0 0 0 9.63-6.977 9.967 9.967 0 0 0 6.65-4.834 10.079 10.079 0 0 0-1.24-11.818ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L5.044 23.86a7.504 7.504 0 0 1-.747-10.24Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l10.048 5.801a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.283Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.497v4.998l-4.331 2.5-4.331-2.5V18Z" />
    </svg>
  )
}

export function HeroAISimulation() {
  const urlRef = useRef<HTMLDivElement>(null)
  const googleRef = useRef<HTMLDivElement>(null)
  const gptRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const searchBarRef = useRef<HTMLDivElement>(null)
  const queryRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const gCountRef = useRef<HTMLDivElement>(null)
  const geminiBoxRef = useRef<HTMLDivElement>(null)
  const geminiTextRef = useRef<HTMLDivElement>(null)
  const gBizRef = useRef<HTMLDivElement>(null)
  const gBizIconRef = useRef<HTMLSpanElement>(null)
  const gBizNameRef = useRef<HTMLDivElement>(null)
  const gBizMetaRef = useRef<HTMLDivElement>(null)
  const gBizRatRef = useRef<HTMLSpanElement>(null)
  const gRegularRef = useRef<HTMLDivElement>(null)
  const gRegUrl1Ref = useRef<HTMLDivElement>(null)
  const gRegTitle1Ref = useRef<HTMLDivElement>(null)

  const gptUserMsgRef = useRef<HTMLDivElement>(null)
  const gptUserTextRef = useRef<HTMLDivElement>(null)
  const gptAiMsgRef = useRef<HTMLDivElement>(null)
  const gptAiTextRef = useRef<HTMLDivElement>(null)
  const gptTypingRef = useRef<HTMLDivElement>(null)
  const gptDot1Ref = useRef<HTMLSpanElement>(null)
  const gptDot2Ref = useRef<HTMLSpanElement>(null)
  const gptDot3Ref = useRef<HTMLSpanElement>(null)
  const gptCardRef = useRef<HTMLDivElement>(null)
  const gptCardNameRef = useRef<HTMLDivElement>(null)
  const gptCardMetaRef = useRef<HTMLDivElement>(null)

  const idxRef = useRef(0)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const mountedRef = useRef(true)
  const isInViewRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      if (urlRef.current) urlRef.current.textContent = DATA[0].urlBar
      if (queryRef.current) queryRef.current.textContent = DATA[0].query
      if (cursorRef.current) gsap.set(cursorRef.current, { opacity: 0 })
      if (gCountRef.current) gsap.set(gCountRef.current, { opacity: 1 })
      if (geminiBoxRef.current) gsap.set(geminiBoxRef.current, { opacity: 1, y: 0 })
      if (geminiTextRef.current) geminiTextRef.current.textContent = DATA[0].geminiText!
      if (gBizRef.current) gsap.set(gBizRef.current, { opacity: 1, y: 0 })
      if (gBizIconRef.current) gBizIconRef.current.textContent = DATA[0].bizIcon!
      if (gBizNameRef.current) gBizNameRef.current.textContent = DATA[0].bizName!
      if (gBizMetaRef.current) gBizMetaRef.current.textContent = DATA[0].bizMeta!
      if (gBizRatRef.current) gBizRatRef.current.textContent = DATA[0].bizRat!
      if (gRegularRef.current) gsap.set(gRegularRef.current, { opacity: 1 })
      if (gRegUrl1Ref.current) gRegUrl1Ref.current.textContent = DATA[0].regUrl!
      if (gRegTitle1Ref.current) gRegTitle1Ref.current.textContent = DATA[0].regTitle!
      return
    }

    function runLoop() {
      if (!mountedRef.current || !isInViewRef.current) return

      const d = DATA[idxRef.current]
      idxRef.current = (idxRef.current + 1) % DATA.length

      if (tlRef.current) tlRef.current.kill()

      const tl = gsap.timeline({
        onComplete: () => {
          if (mountedRef.current && isInViewRef.current) {
            gsap.delayedCall(1.5, runLoop)
          }
        },
      })
      tlRef.current = tl

      const urlEl = urlRef.current
      const googleEl = googleRef.current
      const gptEl = gptRef.current
      if (!urlEl || !googleEl || !gptEl) return

      if (d.mode === 'google') {
        tl.set(gptEl, { opacity: 0, pointerEvents: 'none' }, 0)
        tl.set(googleEl, { opacity: 1 }, 0)
        tl.set(queryRef.current, { text: '' }, 0)
        tl.set(gCountRef.current, { opacity: 0 }, 0)
        tl.set(geminiBoxRef.current, { opacity: 0, y: 8 }, 0)
        tl.set(gBizRef.current, { opacity: 0, y: 6 }, 0)
        tl.set(gRegularRef.current, { opacity: 0 }, 0)
        tl.set(cursorRef.current, { opacity: 1 }, 0)
        tl.set(geminiTextRef.current, { text: '' }, 0)

        tl.call(() => {
          if (urlEl) urlEl.textContent = d.urlBar
          if (gBizIconRef.current) gBizIconRef.current.textContent = d.bizIcon!
          if (gBizNameRef.current) gBizNameRef.current.textContent = d.bizName!
          if (gBizMetaRef.current) gBizMetaRef.current.textContent = d.bizMeta!
          if (gBizRatRef.current) gBizRatRef.current.textContent = d.bizRat!
          if (gRegUrl1Ref.current) gRegUrl1Ref.current.textContent = d.regUrl!
          if (gRegTitle1Ref.current) gRegTitle1Ref.current.textContent = d.regTitle!
        }, [], 0)

        tl.to(cursorRef.current, { opacity: 0, repeat: 3, yoyo: true, duration: 0.4 }, 0.3)
        tl.to(queryRef.current, { duration: 2.2, text: d.query, ease: 'none' }, 1.0)
        tl.to(searchBarRef.current, { borderColor: 'rgba(138,180,248,0.6)', duration: 0.1, yoyo: true, repeat: 1 }, '+=0.15')
        tl.set(cursorRef.current, { opacity: 0 })
        tl.to(gCountRef.current, { opacity: 1, duration: 0.3 }, '+=0.3')
        tl.to(geminiBoxRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '+=0.2')
        tl.to(geminiTextRef.current, { duration: 3.0, text: d.geminiText!, ease: 'none' }, '<+0.2')
        tl.to(gBizRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '<+2.0')
        tl.to(gRegularRef.current, { opacity: 1, duration: 0.5 }, '<+0.3')
        tl.to({}, { duration: 3.5 })
        tl.to([geminiBoxRef.current, gCountRef.current, gRegularRef.current], { opacity: 0, duration: 0.4 })
        tl.to(queryRef.current, { opacity: 0, duration: 0.25 }, '<')
        tl.set(queryRef.current, { opacity: 1 })
      } else {
        const dots = [gptDot1Ref.current, gptDot2Ref.current, gptDot3Ref.current]

        tl.call(() => {
          if (urlEl) urlEl.textContent = d.urlBar
          if (gptCardNameRef.current) gptCardNameRef.current.textContent = d.gptCardName!
          if (gptCardMetaRef.current) gptCardMetaRef.current.textContent = d.gptCardMeta!
        }, [], 0)

        tl.set(googleEl, { opacity: 0 }, 0)
        tl.set(gptUserTextRef.current, { text: '' }, 0)
        tl.set(gptAiTextRef.current, { text: '' }, 0)
        tl.set([gptUserMsgRef.current, gptAiMsgRef.current], { opacity: 0, y: 8 }, 0)
        tl.set(gptTypingRef.current, { opacity: 0 }, 0)
        tl.set(gptCardRef.current, { opacity: 0, y: 4 }, 0)
        tl.set(dots, { opacity: 0 }, 0)
        tl.set(gptEl, { opacity: 1, pointerEvents: 'auto' }, 0)

        tl.to(gptUserMsgRef.current, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.5)
        tl.to(gptUserTextRef.current, { duration: 1.8, text: d.gptUser!, ease: 'none' }, 0.6)
        tl.to(gptTypingRef.current, { opacity: 1, duration: 0.2 }, '+=0.3')
        tl.to(dots, { opacity: 1, duration: 0.2, stagger: 0.2 }, '<')
        tl.to(dots, { opacity: 0.3, duration: 0.2, stagger: 0.2, repeat: 2, yoyo: true }, '<+0.3')
        tl.to(gptTypingRef.current, { opacity: 0, duration: 0.15 })
        tl.to(gptAiMsgRef.current, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' })
        tl.to(gptAiTextRef.current, { duration: 2.6, text: d.gptAi!, ease: 'none' }, '<+0.1')
        tl.to(gptCardRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.25')
        tl.to({}, { duration: 3.5 })
        tl.to(gptEl, { opacity: 0, duration: 0.4 })
        tl.set(gptEl, { pointerEvents: 'none' })
        tl.to(googleEl, { opacity: 1, duration: 0.3 })
      }
    }

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => {
        isInViewRef.current = true
        runLoop()
      },
      onLeave: () => {
        isInViewRef.current = false
        if (tlRef.current) tlRef.current.kill()
      },
      onEnterBack: () => {
        isInViewRef.current = true
        runLoop()
      },
      onLeaveBack: () => {
        isInViewRef.current = false
        if (tlRef.current) tlRef.current.kill()
      },
    })

    return () => {
      mountedRef.current = false
      st.kill()
      if (tlRef.current) tlRef.current.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden flex flex-col"
      style={{ background: '#0a0a0a', borderLeft: '1px solid rgba(255,255,255,0.07)' }}
      aria-hidden="true"
    >
      {/* ── Browser chrome ── */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-3.5 py-[10px]"
        style={{ background: '#111111', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex gap-[5px]">
          <span className="w-[11px] h-[11px] rounded-full" style={{ background: '#ff5f57' }} />
          <span className="w-[11px] h-[11px] rounded-full" style={{ background: '#febc2e' }} />
          <span className="w-[11px] h-[11px] rounded-full" style={{ background: '#28c840' }} />
        </div>
        <div
          ref={urlRef}
          className="flex-1 mx-2.5 py-[5px] px-3 rounded-md text-[11px] tracking-[0.01em] truncate"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}
        >
          google.com/search?q=
        </div>
      </div>

      {/* ══════════════════════════════════════
          GOOGLE PANEL
      ══════════════════════════════════════ */}
      <div ref={googleRef} className="flex-1 overflow-hidden flex flex-col" style={{ background: '#0a0a0a' }}>
        <div className="px-6 pt-5 pb-1 flex flex-col gap-3 flex-shrink-0">

          {/* Google logo */}
          <div className="flex items-center font-body font-bold tracking-[-0.5px]" style={{ fontSize: '22px' }}>
            <span style={{ color: '#4285F4' }}>G</span>
            <span style={{ color: '#EA4335' }}>o</span>
            <span style={{ color: '#FBBC05' }}>o</span>
            <span style={{ color: '#4285F4' }}>g</span>
            <span style={{ color: '#34A853' }}>l</span>
            <span style={{ color: '#EA4335' }}>e</span>
          </div>

          {/* Search bar */}
          <div
            ref={searchBarRef}
            className="flex items-center gap-2.5 rounded-3xl px-[18px] py-2.5"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'rgba(255,255,255,0.55)' }}>
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span ref={queryRef} className="flex-1 text-sm" style={{ color: '#ffffff' }} />
            <span
              ref={cursorRef}
              className="inline-block w-[1.5px] h-[14px] align-middle ml-[1px]"
              style={{ background: '#8ab4f8' }}
            />
            <button
              className="flex items-center gap-1.5 text-xs rounded px-2 py-1"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" />
                <path d="M11 11L14 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Pesquisar
            </button>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="flex px-6 mt-1 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {['Tudo', 'Imagens', 'Mapas', 'Notícias', 'Vídeos'].map((tab, i) => (
            <div
              key={tab}
              className="px-3 py-2.5 text-[12px] whitespace-nowrap cursor-default"
              style={{
                color: i === 0 ? '#8ab4f8' : 'rgba(255,255,255,0.65)',
                borderBottom: i === 0 ? '2.5px solid #8ab4f8' : '2.5px solid transparent',
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Results area */}
        <div className="flex-1 overflow-y-auto px-6 py-3" style={{ scrollbarWidth: 'none' }}>

          {/* Result count */}
          <div ref={gCountRef} className="text-[11px] mb-3" style={{ opacity: 0, color: 'rgba(255,255,255,0.45)' }}>
            Cerca de 142.000 resultados (0,34 segundos)
          </div>

          {/* ── Gemini AI Overview ── */}
          <div
            ref={geminiBoxRef}
            className="relative rounded-xl p-4 mb-4"
            style={{
              background: 'rgba(138,180,248,0.06)',
              border: '1px solid rgba(138,180,248,0.2)',
              opacity: 0,
              transform: 'translateY(8px)',
            }}
          >
            {/* Gradient accent bar */}
            <div
              className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
              style={{ background: 'linear-gradient(to bottom, #4285F4, #a8c7fa, #34A853)' }}
            />

            {/* Gemini header */}
            <div className="flex items-center gap-2 mb-3 pl-1">
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
                <defs>
                  <linearGradient id="gstar2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4285F4" />
                    <stop offset="100%" stopColor="#a8c7fa" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#gstar2)"
                  d="M14 3 L15 12.5 Q15.5 14 14 14.5 Q12.5 14 13 12.5 Z M14 25 L13 15.5 Q12.5 14 14 13.5 Q15.5 14 15 15.5 Z M3 14 L12.5 15 Q14 15.5 14.5 14 Q14 12.5 12.5 13 Z M25 14 L15.5 13 Q14 12.5 13.5 14 Q14 15.5 15.5 15 Z"
                />
              </svg>
              <span className="text-[12px] font-semibold tracking-[0.01em]" style={{ color: '#a8c7fa' }}>
                Visão geral de IA · Gemini
              </span>
            </div>

            {/* Gemini text — alto contraste */}
            <div
              ref={geminiTextRef}
              className="text-[12.5px] leading-[1.75] mb-3.5 min-h-[52px] pl-1"
              style={{ color: 'rgba(255,255,255,0.88)' }}
            />

            {/* Source chips — estilo real Google AI Overview */}
            <div
              ref={gBizRef}
              style={{ opacity: 0, transform: 'translateY(6px)' }}
            >
              {/* Refs ocultos mas ainda mutados pelo GSAP/DATA */}
              <span ref={gBizIconRef} className="hidden" />
              <span ref={gBizRatRef} className="hidden" />

              <p className="text-[10.5px] mb-2" style={{ color: 'rgba(255,255,255,0.38)' }}>
                Fontes
              </p>

              <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {/* Chip dinâmico — fonte principal */}
                <div
                  className="flex-shrink-0 rounded-xl p-2.5 flex flex-col gap-1"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    width: '140px',
                  }}
                >
                  {/* Favicon + domínio */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-4 h-4 rounded-sm flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ background: '#4285F4' }}
                    >
                      A
                    </div>
                    <div
                      ref={gBizMetaRef}
                      className="text-[10px] truncate"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                    />
                  </div>
                  {/* Título da fonte */}
                  <div
                    ref={gBizNameRef}
                    className="text-[11px] leading-snug line-clamp-2"
                    style={{ color: 'rgba(255,255,255,0.82)' }}
                  />
                </div>

                {/* Chips estáticos decorativos */}
                <div
                  className="flex-shrink-0 rounded-xl p-2.5 flex flex-col gap-1"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    width: '130px',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-4 h-4 rounded-sm flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ background: '#EA4335' }}
                    >
                      G
                    </div>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      google.com
                    </span>
                  </div>
                  <span className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.82)' }}>
                    Mapa e avaliações locais
                  </span>
                </div>

                <div
                  className="flex-shrink-0 rounded-xl p-2.5 flex flex-col gap-1"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    width: '130px',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-4 h-4 rounded-sm flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ background: '#34A853' }}
                    >
                      R
                    </div>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      reclameaqui.com.br
                    </span>
                  </div>
                  <span className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.82)' }}>
                    Reputação e avaliações
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Resultados orgânicos ── */}
          <div ref={gRegularRef} style={{ opacity: 0 }}>

            {/* Resultado 1 */}
            <div className="mb-5">
              {/* Favicon + URL */}
              <div className="flex items-center gap-2 mb-0.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                >
                  A
                </div>
                <div ref={gRegUrl1Ref} className="text-[11.5px]" style={{ color: 'rgba(255,255,255,0.6)' }} />
              </div>
              {/* Title — azul link */}
              <div
                ref={gRegTitle1Ref}
                className="text-[14px] font-medium mb-1 leading-snug cursor-pointer"
                style={{ color: '#8ab4f8' }}
              />
              {/* Snippet */}
              <div className="text-[12px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Escritório especializado com alta taxa de êxito. Atendimento personalizado para pessoas físicas e
                empresas...
              </div>
            </div>

            {/* Resultado 2 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-0.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                >
                  J
                </div>
                <div className="text-[11.5px]" style={{ color: 'rgba(255,255,255,0.6)' }}>jusbrasil.com.br</div>
              </div>
              <div className="text-[14px] font-medium mb-1 leading-snug" style={{ color: '#8ab4f8' }}>
                Melhores advogados da região — avaliações e contatos
              </div>
              <div className="text-[12px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Encontre advogados especializados com avaliações, OAB e áreas de atuação...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          CHATGPT PANEL
      ══════════════════════════════════════ */}
      <div
        ref={gptRef}
        className="absolute inset-0 flex"
        style={{ top: '40px', opacity: 0, pointerEvents: 'none' }}
      >
        {/* ── Sidebar esquerda ── */}
        <div
          className="flex-shrink-0 flex flex-col pt-3 pb-4 px-2 gap-1"
          style={{ width: '52px', background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Logo ChatGPT */}
          <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 text-white">
            <OpenAIIcon size={20} />
          </div>
          {/* Novo chat */}
          <div
            className="flex items-center justify-center w-8 h-8 mx-auto rounded-lg cursor-default"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            title="Novo chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          {/* Conversations mock */}
          <div className="mt-3 flex flex-col gap-2 px-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[3px] rounded-full"
                style={{ background: `rgba(255,255,255,${i === 1 ? 0.18 : 0.07})`, width: `${i === 1 ? 28 : i === 2 ? 22 : 18}px` }}
              />
            ))}
          </div>
        </div>

        {/* ── Área principal ── */}
        <div className="flex-1 flex flex-col" style={{ background: '#0a0a0a' }}>

          {/* Header */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Model selector */}
            <button
              className="flex items-center gap-1.5 text-[13px] font-semibold rounded-lg px-2 py-1 cursor-default"
              style={{ color: 'rgba(255,255,255,0.9)', background: 'transparent' }}
            >
              ChatGPT
              <span
                className="text-[11px] font-medium px-1.5 py-0.5 rounded-md"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
              >
                4o
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="ml-auto flex items-center gap-3">
              {/* Share icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* More icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <circle cx="12" cy="5" r="1.2" fill="currentColor" />
                <circle cx="12" cy="12" r="1.2" fill="currentColor" />
                <circle cx="12" cy="19" r="1.2" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Thread */}
          <div
            className="flex-1 overflow-y-auto py-6 flex flex-col gap-6"
            style={{ scrollbarWidth: 'none', paddingLeft: '20px', paddingRight: '20px' }}
          >
            {/* User message — pill à direita, sem avatar */}
            <div
              ref={gptUserMsgRef}
              className="flex justify-end"
              style={{ opacity: 0, transform: 'translateY(8px)' }}
            >
              <div
                ref={gptUserTextRef}
                className="px-4 py-2.5 rounded-3xl max-w-[80%] text-[13px] leading-[1.65]"
                style={{ background: '#1a1a1a', color: 'rgba(255,255,255,0.95)' }}
              />
            </div>

            {/* Typing — ícone pequeno + três pontos */}
            <div ref={gptTypingRef} className="flex items-center gap-2.5" style={{ opacity: 0 }}>
              <div className="w-5 h-5 flex-shrink-0 text-white flex items-center justify-center">
                <OpenAIIcon size={16} />
              </div>
              <div className="flex gap-1 items-center">
                <span ref={gptDot1Ref} className="w-[5px] h-[5px] rounded-full" style={{ background: 'rgba(255,255,255,0.55)', opacity: 0 }} />
                <span ref={gptDot2Ref} className="w-[5px] h-[5px] rounded-full" style={{ background: 'rgba(255,255,255,0.55)', opacity: 0 }} />
                <span ref={gptDot3Ref} className="w-[5px] h-[5px] rounded-full" style={{ background: 'rgba(255,255,255,0.55)', opacity: 0 }} />
              </div>
            </div>

            {/* AI response — ícone pequeno + texto sem bolha */}
            <div
              ref={gptAiMsgRef}
              className="flex items-start gap-2.5"
              style={{ opacity: 0, transform: 'translateY(8px)' }}
            >
              <div className="w-5 h-5 flex-shrink-0 mt-[3px] text-white flex items-center justify-center">
                <OpenAIIcon size={16} />
              </div>
              <div className="flex-1">
                <div
                  ref={gptAiTextRef}
                  className="text-[13px] leading-[1.8]"
                  style={{ color: 'rgba(255,255,255,0.88)' }}
                />

                {/* Lista de resultados — 3 opções como ChatGPT real */}
                <div
                  ref={gptCardRef}
                  className="mt-3 rounded-xl overflow-hidden"
                  style={{
                    border: '1px solid rgba(255,255,255,0.09)',
                    opacity: 0,
                    transform: 'translateY(4px)',
                  }}
                >
                  {/* Resultado 1 — dinâmico */}
                  <div
                    className="flex items-start gap-3 px-3 py-2.5"
                    style={{ background: '#111111', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <span className="text-[11px] font-bold mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.7)' }}>1</span>
                    <div className="min-w-0">
                      <div
                        ref={gptCardNameRef}
                        className="font-semibold text-[12.5px] leading-snug"
                        style={{ color: '#ffffff' }}
                      />
                      <div
                        ref={gptCardMetaRef}
                        className="text-[11px] mt-0.5 leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.65)' }}
                      />
                    </div>
                  </div>

                  {/* Resultado 2 — estático */}
                  <div
                    className="flex items-start gap-3 px-3 py-2.5"
                    style={{ background: '#111111', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <span className="text-[11px] font-bold mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }}>2</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-[12.5px] leading-snug" style={{ color: '#ffffff' }}>
                        Saad &amp; Partners
                      </div>
                      <div className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        Causas corporativas · negociações coletivas
                      </div>
                    </div>
                  </div>

                  {/* Resultado 3 — estático */}
                  <div
                    className="flex items-start gap-3 px-3 py-2.5"
                    style={{ background: '#111111' }}
                  >
                    <span className="text-[11px] font-bold mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }}>3</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-[12.5px] leading-snug" style={{ color: '#ffffff' }}>
                        Riva Advocacia
                      </div>
                      <div className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        Direito do trabalhador · atendimento ágil
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input bar */}
          <div className="px-4 pb-3 pt-2 flex-shrink-0">
            <div
              className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5"
              style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span className="text-[12.5px] flex-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Enviar uma mensagem ao ChatGPT
              </span>
              {/* Mic + Send */}
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M5 10a7 7 0 0 0 14 0M12 19v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                    <path d="M10 16V4M4 10l6-6 6 6" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-center text-[9.5px] mt-1.5" style={{ color: 'rgba(255,255,255,0.18)' }}>
              O ChatGPT pode cometer erros. Verifique informações importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

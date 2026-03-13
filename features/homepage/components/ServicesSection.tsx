const services = [
  {
    tag: 'Pacote 01',
    title: 'Arquitetura de Marca',
    tagline: 'A identidade que define quem você é antes de falar qualquer coisa.',
    deliverables: ['Logo & Naming', 'Paleta de Cores', 'Tipografia', 'Tom de Voz', 'Posicionamento', 'Brandbook'],
    differentiator: 'Construída a partir do Diagnóstico — não de templates.',
    accent: '#ff6b35',
  },
  {
    tag: 'Pacote 02',
    title: 'Arquitetura Tecnológica',
    tagline: 'A infraestrutura que faz o lead te encontrar.',
    deliverables: ['Site Estratégico', 'SEO + AIO/GEO', 'Automações', 'Integrações', 'Google Meu Negócio', 'Analytics'],
    differentiator: 'Cada peça conectada num ecossistema — não fornecedores separados.',
    accent: '#00bcd4',
  },
]

export function ServicesSection() {
  return (
    <section
      id="nossos-servicos"
      className="border-t border-white/[0.07] py-24 lg:py-32 px-8 lg:px-14"
    >
      <div className="max-w-6xl mx-auto">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-12 lg:mb-16">
          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#ff6b35' }} />
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/[0.16]">
            Os Serviços
          </span>
        </div>

        {/* Headline */}
        <div className="mb-14 lg:mb-20 max-w-3xl">
          <div
            className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] text-white/[0.93]"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 5rem)' }}
          >
            Dois pacotes.
          </div>
          <div
            className="font-heading font-extrabold leading-[0.88] tracking-[-0.04em] mt-1"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 5rem)',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.18)',
              color: 'transparent',
            }}
          >
            Um ecossistema.
          </div>
          <p
            className="leading-relaxed mt-6 max-w-xl"
            style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)', color: 'rgba(255,255,255,0.3)' }}
          >
            Você pode contratar separado. Mas quando combinados, os dois pacotes constroem um ativo
            digital permanente — marca e tecnologia trabalhando juntas.
          </p>
        </div>

        {/* Two Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          {services.map((svc) => (
            <div
              key={svc.title}
              className="relative group flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Top accent bar */}
              <div
                className="h-px w-full flex-shrink-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${svc.accent}60, transparent)`,
                }}
              />

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${svc.accent}12 0%, transparent 65%)`,
                  border: `1px solid ${svc.accent}20`,
                }}
              />

              <div className="relative z-10 p-8 flex flex-col gap-6 flex-1">

                {/* Tag + Title */}
                <div>
                  <span
                    className="text-[9px] font-semibold tracking-[0.14em] uppercase"
                    style={{ color: svc.accent, opacity: 0.6 }}
                  >
                    {svc.tag}
                  </span>
                  <h3
                    className="font-heading font-extrabold leading-none tracking-[-0.03em] text-white/90 mt-2"
                    style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)' }}
                  >
                    {svc.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mt-3"
                    style={{ color: svc.accent + 'CC' }}
                  >
                    {svc.tagline}
                  </p>
                </div>

                {/* Deliverables */}
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.14em] uppercase text-white/20 mb-3">
                    Entregáveis
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {svc.deliverables.map((d) => (
                      <span
                        key={d}
                        className="text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-1 rounded"
                        style={{
                          color: svc.accent,
                          background: `${svc.accent}10`,
                          border: `1px solid ${svc.accent}22`,
                        }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Differentiator */}
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-1 h-1 rounded-full flex-shrink-0 mt-2"
                    style={{ background: svc.accent }}
                  />
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {svc.differentiator}
                  </p>
                </div>

                {/* CTA */}
                <div className="border-t border-white/[0.06] pt-5">
                  <a
                    href="#diagnostico"
                    className="inline-flex items-center gap-2.5 font-body text-sm font-semibold px-6 py-[13px] rounded-[7px] transition-all duration-200 focus:outline-none focus:ring-2 min-h-[44px]"
                    style={{
                      background: `${svc.accent}14`,
                      border: `1px solid ${svc.accent}30`,
                      color: svc.accent,
                    }}
                  >
                    Quero este pacote
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M3 7h8M8 4l3 3-3 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

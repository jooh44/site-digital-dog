import Image from 'next/image'

export function HubTeaser() {
  return (
    <section className="border-t border-white/[0.07] py-20 lg:py-24 px-8 lg:px-14 xl:px-20">
      <div>
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Background dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Subtle orange glow at center */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 20% 50%, rgba(255,107,53,0.05) 0%, transparent 60%)',
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 p-10 lg:p-16">

            {/* Fred mascot */}
            <div className="flex-shrink-0">
              <div
                className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{
                  background: 'rgba(255,107,53,0.07)',
                  border: '1px solid rgba(255,107,53,0.15)',
                }}
              >
                <Image
                  src="/images/logo_digital_dog-removebg-preview.png"
                  alt="Fred — copiloto da Digital Dog"
                  width={96}
                  height={96}
                  className="object-contain p-3"
                />
              </div>
            </div>

            {/* Text content */}
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#ff6b35' }}
                />
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/[0.16]">
                  Em breve
                </span>
              </div>

              <h3
                className="font-heading font-extrabold tracking-[-0.03em] text-white/90 leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}
              >
                O Hub de Ferramentas está chegando.
              </h3>

              <p
                className="text-sm leading-relaxed max-w-lg"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                Fred, nosso copiloto digital, vai reunir seus dados, concorrentes e oportunidades
                num painel único. Tudo o que você precisa para tomar decisões — sem planilha,
                sem achismo.
              </p>

              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <div
                  className="w-1 h-1 rounded-full"
                  style={{ background: 'rgba(255,107,53,0.4)' }}
                />
                <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/20">
                  Cadastre-se para ser notificado — em breve
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

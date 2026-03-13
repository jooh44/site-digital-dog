'use client'

const segmentos = [
  { id: 'veterinaria', label: 'Veterinária', icon: '🐾' },
  { id: 'advocacia', label: 'Advocacia', icon: '⚖️' },
  { id: 'saude', label: 'Saúde', icon: '🏥' },
  { id: 'consultoria', label: 'Consultoria', icon: '💼' },
  { id: 'varejo', label: 'Varejo', icon: '🛍️' },
  { id: 'outro', label: 'Outro', icon: '✦' },
]

interface Props {
  defaultValue?: string
  onNext: (segmento: string) => void
}

export function Step1Negocio({ defaultValue, onNext }: Props) {
  return (
    <div>
      <h2
        className="font-heading font-extrabold text-white/90 leading-tight tracking-[-0.02em] mb-1.5"
        style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}
      >
        Qual é o seu segmento?
      </h2>
      <p className="text-sm text-white/40 mb-6">
        Selecione a opção que melhor descreve o seu negócio.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {segmentos.map((s) => {
          const isSelected = defaultValue === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onNext(s.id)}
              className="group flex flex-col items-center justify-center gap-2.5 min-h-[76px] rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
              style={{
                background: isSelected ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.03)',
                borderColor: isSelected ? 'rgba(255,107,53,0.45)' : 'rgba(255,255,255,0.07)',
              }}
              aria-pressed={isSelected}
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {s.icon}
              </span>
              <span
                className="text-xs font-semibold transition-colors"
                style={{ color: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)' }}
              >
                {s.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

import type { FormStep } from '@/features/diagnostico/types/diagnostico.types'

interface Props {
  currentStep: FormStep
  totalSteps?: number
}

export function ProgressBar({ currentStep, totalSteps = 4 }: Props) {
  const percent = (currentStep / totalSteps) * 100

  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/25">
          Diagnóstico Digital
        </span>
        <span className="text-[10px] font-semibold tabular-nums text-white/25">
          {currentStep} de {totalSteps}
        </span>
      </div>
      <div className="h-px bg-white/[0.07] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percent}%`,
            background: 'linear-gradient(90deg, #ff6b35, #ff1744)',
          }}
        />
      </div>
    </div>
  )
}

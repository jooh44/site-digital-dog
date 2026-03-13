'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step2Schema, type Step2Data } from '@/features/diagnostico/schemas/step2.schema'
import { cn } from '@/lib/utils'

interface Props {
  defaultValues?: Partial<Step2Data>
  onNext: (data: Step2Data) => void
  onBack: () => void
}

export function Step2Segmento({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <h2
        className="font-heading font-extrabold text-white/90 leading-tight tracking-[-0.02em] mb-1.5"
        style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}
      >
        Conte sobre o negócio
      </h2>
      <p className="text-sm text-white/40 mb-6">
        Duas perguntas rápidas para personalizar o diagnóstico.
      </p>

      <div className="space-y-4">
        {/* Nome do negócio */}
        <div>
          <label
            htmlFor="negocio"
            className="block text-[10px] font-semibold tracking-[0.1em] uppercase text-white/35 mb-2"
          >
            Nome do negócio
          </label>
          <input
            id="negocio"
            {...register('negocio')}
            autoComplete="organization"
            placeholder="Ex: Clínica Saúde Total"
            className={cn(
              'w-full px-4 py-3 bg-white/[0.04] border rounded-lg text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors',
              errors.negocio ? 'border-red-500/50' : 'border-white/[0.09]'
            )}
          />
          {errors.negocio && (
            <p className="text-red-400 text-xs mt-1.5" role="alert">
              {errors.negocio.message}
            </p>
          )}
        </div>

        {/* Desafio atual */}
        <div>
          <label
            htmlFor="desafio"
            className="block text-[10px] font-semibold tracking-[0.1em] uppercase text-white/35 mb-2"
          >
            Qual é o seu maior desafio digital hoje?
          </label>
          <textarea
            id="desafio"
            {...register('desafio')}
            rows={3}
            placeholder="Ex: Não apareço no Google, não sei como atrair clientes online..."
            className={cn(
              'w-full px-4 py-3 bg-white/[0.04] border rounded-lg text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors resize-none',
              errors.desafio ? 'border-red-500/50' : 'border-white/[0.09]'
            )}
          />
          {errors.desafio && (
            <p className="text-red-400 text-xs mt-1.5" role="alert">
              {errors.desafio.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-white/[0.09] rounded-lg text-sm text-white/45 hover:text-white/75 hover:border-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          ← Voltar
        </button>
        <button
          type="submit"
          className="flex-[2] py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b35]"
          style={{ background: 'linear-gradient(135deg, #ff6b35, #ff1744)' }}
        >
          Próximo →
        </button>
      </div>
    </form>
  )
}

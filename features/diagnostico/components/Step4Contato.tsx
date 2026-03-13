'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { step4Schema, type Step4Data } from '@/features/diagnostico/schemas/step4.schema'
import { cn } from '@/lib/utils'

interface Props {
  onSubmit: (data: Step4Data) => Promise<void>
  onBack: () => void
  isSubmitting: boolean
  error: string | null
}

export function Step4Contato({ onSubmit, onBack, isSubmitting, error }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    mode: 'onChange',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2
        className="font-heading font-extrabold text-white/90 leading-tight tracking-[-0.02em] mb-1.5"
        style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}
      >
        Quase lá!
      </h2>
      <p className="text-sm text-white/40 mb-6">
        Só falta o seu consentimento para enviarmos o diagnóstico.
      </p>

      {/* Resumo do que será recebido */}
      <div
        className="rounded-xl p-4 mb-6 text-sm leading-relaxed text-white/50"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        Você receberá um diagnóstico personalizado sobre a presença digital do seu negócio — sem spam, sem compromisso.
      </div>

      {/* Checkbox LGPD */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register('consentimento')}
            className="mt-0.5 min-w-[18px] min-h-[18px] accent-[#ff6b35] cursor-pointer"
            aria-invalid={!!errors.consentimento}
            aria-describedby={errors.consentimento ? 'consent-error' : undefined}
          />
          <span className="text-sm text-white/55 leading-relaxed group-hover:text-white/70 transition-colors">
            Concordo que a Digital Dog use meus dados (nome, email, WhatsApp){' '}
            <strong className="text-white/70">exclusivamente para contato</strong> relacionado ao agendamento do Diagnóstico Digital.{' '}
            <Link
              href="/privacidade"
              target="_blank"
              className="text-[#00bcd4] underline underline-offset-2 hover:text-[#00bcd4]/80 transition-colors"
            >
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
        {errors.consentimento && (
          <p id="consent-error" className="text-red-400 text-xs mt-2 ml-7" role="alert">
            {errors.consentimento.message}
          </p>
        )}
      </div>

      {/* Erro global de API */}
      {error && (
        <div
          className="rounded-lg px-4 py-3 mb-4 text-sm text-red-300"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 py-3 border border-white/[0.09] rounded-lg text-sm text-white/45 hover:text-white/75 hover:border-white/20 transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          ← Voltar
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          aria-disabled={!isValid || isSubmitting}
          className={cn(
            'flex-[2] py-3 rounded-lg text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b35]',
            isValid && !isSubmitting
              ? 'text-white hover:opacity-90'
              : 'text-white/30 cursor-not-allowed'
          )}
          style={{
            background: isValid && !isSubmitting
              ? 'linear-gradient(135deg, #ff6b35, #ff1744)'
              : 'rgba(255,255,255,0.06)',
          }}
        >
          {isSubmitting ? 'Enviando...' : 'Solicitar Diagnóstico'}
        </button>
      </div>
    </form>
  )
}

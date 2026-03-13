'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { step2Schema, type Step2Data } from '@/features/diagnostico/schemas/step2.schema'
import { cn } from '@/lib/utils'

function IconWhatsApp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

interface Props {
  defaultValues?: Partial<Pick<Step2Data, 'whatsapp'>>
  onSubmit: (data: Step2Data) => Promise<void>
  onBack: () => void
  isSubmitting: boolean
  error: string | null
}

export function Step2Segmento({ defaultValues, onSubmit, onBack, isSubmitting, error }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { whatsapp: defaultValues?.whatsapp, consentimento: false },
    mode: 'onChange',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2
        className="font-heading font-extrabold text-white/90 leading-tight tracking-[-0.02em] mb-1.5"
        style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}
      >
        Onde te envio?
      </h2>
      <p className="text-sm text-white/40 mb-6">
        O diagnóstico chega pelo WhatsApp, em até 24h.
      </p>

      {/* WhatsApp */}
      <div className="mb-5">
        <label htmlFor="whatsapp" className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-white/35 mb-2">
          <span className="text-white/25"><IconWhatsApp /></span>
          WhatsApp (com DDD)
        </label>
        <input
          id="whatsapp"
          type="tel"
          {...register('whatsapp')}
          autoComplete="tel"
          placeholder="(47) 99999-9999"
          aria-invalid={!!errors.whatsapp}
          className={cn(
            'w-full px-4 py-3 bg-white/[0.04] border rounded-lg text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors',
            errors.whatsapp ? 'border-red-500/50' : 'border-white/[0.09]'
          )}
        />
        {errors.whatsapp && (
          <p className="text-red-400 text-xs mt-1.5" role="alert">{errors.whatsapp.message}</p>
        )}
      </div>

      {/* Consentimento LGPD */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register('consentimento')}
            className="mt-0.5 min-w-[18px] min-h-[18px] accent-[#ff6b35] cursor-pointer"
            aria-invalid={!!errors.consentimento}
            aria-describedby={errors.consentimento ? 'consent-error' : undefined}
          />
          <span className="text-sm text-white/50 leading-relaxed group-hover:text-white/65 transition-colors">
            Concordo que a Digital Dog use meus dados{' '}
            <strong className="text-white/65">exclusivamente para contato</strong> relacionado ao Diagnóstico Digital.{' '}
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
            isValid && !isSubmitting ? 'text-white hover:opacity-90' : 'text-white/30 cursor-not-allowed'
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

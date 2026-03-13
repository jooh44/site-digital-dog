'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FieldErrors } from 'react-hook-form'
import { step3Schema, type Step3Data } from '@/features/diagnostico/schemas/step3.schema'
import { cn } from '@/lib/utils'

interface Props {
  defaultValues?: Partial<Step3Data>
  onNext: (data: Step3Data) => void
  onBack: () => void
}

export function Step3Desafio({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues,
    mode: 'onBlur',
  })

  const onError = (errs: FieldErrors<Step3Data>) => {
    const first = Object.keys(errs)[0] as keyof Step3Data
    if (first) setFocus(first)
  }

  return (
    <form onSubmit={handleSubmit(onNext, onError)} noValidate>
      <h2
        className="font-heading font-extrabold text-white/90 leading-tight tracking-[-0.02em] mb-1.5"
        style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}
      >
        Seus dados de contato
      </h2>
      <p className="text-sm text-white/40 mb-6">
        Para enviar o diagnóstico personalizado.
      </p>

      <div className="space-y-4">
        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block text-[10px] font-semibold tracking-[0.1em] uppercase text-white/35 mb-2">
            Seu nome
          </label>
          <input
            id="nome"
            {...register('nome')}
            autoComplete="name"
            placeholder="Ex: João Silva"
            aria-invalid={!!errors.nome}
            className={cn(
              'w-full px-4 py-3 bg-white/[0.04] border rounded-lg text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors',
              errors.nome ? 'border-red-500/50' : 'border-white/[0.09]'
            )}
          />
          {errors.nome && (
            <p className="text-red-400 text-xs mt-1.5" role="alert">{errors.nome.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-[10px] font-semibold tracking-[0.1em] uppercase text-white/35 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            autoComplete="email"
            placeholder="seunome@email.com"
            aria-invalid={!!errors.email}
            className={cn(
              'w-full px-4 py-3 bg-white/[0.04] border rounded-lg text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors',
              errors.email ? 'border-red-500/50' : 'border-white/[0.09]'
            )}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1.5" role="alert">{errors.email.message}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label htmlFor="whatsapp" className="block text-[10px] font-semibold tracking-[0.1em] uppercase text-white/35 mb-2">
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

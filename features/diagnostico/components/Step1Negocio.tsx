'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FieldErrors } from 'react-hook-form'
import { step1Schema, type Step1Data } from '@/features/diagnostico/schemas/step1.schema'
import { cn } from '@/lib/utils'

function IconPerson() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 12.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function IconBuilding() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="10" height="11" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 13V9h4v4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <rect x="4" y="4" width="2" height="2" rx="0.3" stroke="currentColor" strokeWidth="1.1" />
      <rect x="8" y="4" width="2" height="2" rx="0.3" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

function IconTag() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7.5 1.5H12.5V6.5L7 12a1 1 0 01-1.414 0L1.5 7.914A1 1 0 011.5 6.5L7.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="10" cy="4" r="0.8" fill="currentColor" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1.5C4.79 1.5 3 3.29 3 5.5c0 3 4 7 4 7s4-4 4-7c0-2.21-1.79-4-4-4Z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

interface FieldProps {
  id: string
  label: string
  icon: React.ReactNode
  placeholder: string
  error?: string
  autoComplete?: string
  registration: ReturnType<ReturnType<typeof useForm<Step1Data>>['register']>
}

function Field({ id, label, icon, placeholder, error, autoComplete, registration }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-white/35 mb-2">
        <span className="text-white/25">{icon}</span>
        {label}
      </label>
      <input
        id={id}
        {...registration}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn(
          'w-full px-4 py-3 bg-white/[0.04] border rounded-lg text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors',
          error ? 'border-red-500/50' : 'border-white/[0.09]'
        )}
      />
      {error && (
        <p className="text-red-400 text-xs mt-1.5" role="alert">{error}</p>
      )}
    </div>
  )
}

interface Props {
  defaultValues?: Partial<Step1Data>
  onNext: (data: Step1Data) => void
}

export function Step1Negocio({ defaultValues, onNext }: Props) {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  })

  const onError = (errs: FieldErrors<Step1Data>) => {
    const first = Object.keys(errs)[0] as keyof Step1Data
    if (first) setFocus(first)
  }

  return (
    <form onSubmit={handleSubmit(onNext, onError)} noValidate>
      <h2
        className="font-heading font-extrabold text-white/90 leading-tight tracking-[-0.02em] mb-1.5"
        style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}
      >
        Sobre o seu negócio
      </h2>
      <p className="text-sm text-white/40 mb-6">
        Com isso já consigo montar o diagnóstico antes de te ligar.
      </p>

      <div className="space-y-4">
        <Field
          id="nome"
          label="Seu nome"
          icon={<IconPerson />}
          placeholder="Ex: João Silva"
          autoComplete="name"
          error={errors.nome?.message}
          registration={register('nome')}
        />
        <Field
          id="tipoNegocio"
          label="Tipo de negócio"
          icon={<IconTag />}
          placeholder="Ex: Pet shop, clínica, restaurante..."
          error={errors.tipoNegocio?.message}
          registration={register('tipoNegocio')}
        />
        <Field
          id="empresa"
          label="Nome da empresa"
          icon={<IconBuilding />}
          placeholder="Ex: Pet Shop Araucária"
          autoComplete="organization"
          error={errors.empresa?.message}
          registration={register('empresa')}
        />
        <Field
          id="cidade"
          label="Cidade"
          icon={<IconPin />}
          placeholder="Ex: Curitiba, PR"
          error={errors.cidade?.message}
          registration={register('cidade')}
        />
      </div>

      <button
        type="submit"
        className="w-full mt-6 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b35]"
        style={{ background: 'linear-gradient(135deg, #ff6b35, #ff1744)' }}
      >
        Próximo →
      </button>
    </form>
  )
}

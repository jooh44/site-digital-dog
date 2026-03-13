'use client'

import { useState, useEffect } from 'react'
import { ProgressBar } from './ProgressBar'
import { Step1Negocio } from './Step1Negocio'
import { Step2Segmento } from './Step2Segmento'
import { SuccessScreen } from './SuccessScreen'
import { useFormPersistence } from '@/features/diagnostico/hooks/useFormPersistence'
import type { FormState } from '@/features/diagnostico/types/diagnostico.types'
import type { Step1Data } from '@/features/diagnostico/schemas/step1.schema'
import type { Step2Data } from '@/features/diagnostico/schemas/step2.schema'

const INITIAL_STATE: FormState = {
  step: 1,
  data: {},
  isSubmitting: false,
  error: null,
}

export function DiagnosticoForm() {
  const { persist, restore, clear } = useFormPersistence()
  const [state, setState] = useState<FormState>(INITIAL_STATE)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const saved = restore()
    if (saved && !saved.isSubmitting) setState({ ...saved, error: null })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateState = (updates: Partial<FormState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates }
      persist(next)
      return next
    })
  }

  const handleStep1Next = (data: Step1Data) => {
    updateState({ step: 2, data: { ...state.data, ...data } })
  }

  const handleStep2Submit = async (data: Step2Data) => {
    const payload = {
      nome: state.data.nome ?? '',
      tipoNegocio: state.data.tipoNegocio ?? '',
      empresa: state.data.empresa ?? '',
      cidade: state.data.cidade ?? '',
      whatsapp: data.whatsapp,
      consentimento: true as const,
    }

    updateState({ isSubmitting: true, error: null })

    try {
      const res = await fetch('/api/diagnostico/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (result.success) {
        clear()
        setIsSuccess(true)
      } else {
        updateState({
          isSubmitting: false,
          error: result.error ?? 'Algo deu errado. Tente novamente.',
        })
      }
    } catch {
      updateState({
        isSubmitting: false,
        error: 'Falha na conexão. Verifique sua internet e tente novamente.',
      })
    }
  }

  const handleBack = () => {
    updateState({ step: 1, error: null })
  }

  if (isSuccess) {
    return <SuccessScreen />
  }

  return (
    <div>
      <ProgressBar currentStep={state.step} totalSteps={2} />

      {state.step === 1 && (
        <Step1Negocio
          defaultValues={{
            nome: state.data.nome,
            tipoNegocio: state.data.tipoNegocio,
            empresa: state.data.empresa,
            cidade: state.data.cidade,
          }}
          onNext={handleStep1Next}
        />
      )}

      {state.step === 2 && (
        <Step2Segmento
          defaultValues={{ whatsapp: state.data.whatsapp }}
          onSubmit={handleStep2Submit}
          onBack={handleBack}
          isSubmitting={state.isSubmitting}
          error={state.error}
        />
      )}
    </div>
  )
}

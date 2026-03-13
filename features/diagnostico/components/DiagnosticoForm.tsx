'use client'

import { useState, useEffect } from 'react'
import { ProgressBar } from './ProgressBar'
import { Step1Negocio } from './Step1Negocio'
import { Step2Segmento } from './Step2Segmento'
import { Step3Desafio } from './Step3Desafio'
import { Step4Contato } from './Step4Contato'
import { SuccessScreen } from './SuccessScreen'
import { useFormPersistence } from '@/features/diagnostico/hooks/useFormPersistence'
import type { FormState } from '@/features/diagnostico/types/diagnostico.types'
import type { Step2Data } from '@/features/diagnostico/schemas/step2.schema'
import type { Step3Data } from '@/features/diagnostico/schemas/step3.schema'
import type { Step4Data } from '@/features/diagnostico/schemas/step4.schema'

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

  const handleStep1Next = (segmento: string) => {
    updateState({ step: 2, data: { ...state.data, segmento } })
  }

  const handleStep2Next = (data: Step2Data) => {
    updateState({ step: 3, data: { ...state.data, ...data } })
  }

  const handleStep3Next = (data: Step3Data) => {
    updateState({ step: 4, data: { ...state.data, ...data } })
  }

  const handleStep4Submit = async (_data: Step4Data) => {
    const payload = {
      segmento: state.data.segmento ?? '',
      negocio: state.data.negocio ?? '',
      desafio: state.data.desafio ?? '',
      nome: state.data.nome ?? '',
      email: state.data.email ?? '',
      whatsapp: state.data.whatsapp ?? '',
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
    updateState({ step: (state.step - 1) as FormState['step'], error: null })
  }

  if (isSuccess) {
    return <SuccessScreen />
  }

  return (
    <div>
      <ProgressBar currentStep={state.step} />

      {state.step === 1 && (
        <Step1Negocio defaultValue={state.data.segmento} onNext={handleStep1Next} />
      )}

      {state.step === 2 && (
        <Step2Segmento
          defaultValues={{ negocio: state.data.negocio, desafio: state.data.desafio }}
          onNext={handleStep2Next}
          onBack={handleBack}
        />
      )}

      {state.step === 3 && (
        <Step3Desafio
          defaultValues={{ nome: state.data.nome, email: state.data.email, whatsapp: state.data.whatsapp }}
          onNext={handleStep3Next}
          onBack={handleBack}
        />
      )}

      {state.step === 4 && (
        <Step4Contato
          onSubmit={handleStep4Submit}
          onBack={handleBack}
          isSubmitting={state.isSubmitting}
          error={state.error}
        />
      )}
    </div>
  )
}

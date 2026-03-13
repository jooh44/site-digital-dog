'use client'

import { useState, useEffect } from 'react'
import { ProgressBar } from './ProgressBar'
import { Step1Negocio } from './Step1Negocio'
import { Step2Segmento } from './Step2Segmento'
import { useFormPersistence } from '@/features/diagnostico/hooks/useFormPersistence'
import type { FormState } from '@/features/diagnostico/types/diagnostico.types'
import type { Step2Data } from '@/features/diagnostico/schemas/step2.schema'

const INITIAL_STATE: FormState = {
  step: 1,
  data: {},
  isSubmitting: false,
  error: null,
}

export function DiagnosticoForm() {
  const { persist, restore } = useFormPersistence()
  const [state, setState] = useState<FormState>(INITIAL_STATE)

  // Restore from sessionStorage on mount
  useEffect(() => {
    const saved = restore()
    if (saved) setState(saved)
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
    // Steps 3 e 4 implementados na Story 3-3
  }

  const handleBack = () => {
    updateState({ step: (state.step - 1) as FormState['step'] })
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

      {state.step >= 3 && (
        <div className="text-center py-10 text-white/30 text-sm">
          Carregando próximos passos...
        </div>
      )}
    </div>
  )
}

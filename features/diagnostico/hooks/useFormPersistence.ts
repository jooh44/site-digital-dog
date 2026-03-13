'use client'

import { safeSessionStorage } from '@/features/shared/utils/safeSessionStorage'
import type { FormState } from '@/features/diagnostico/types/diagnostico.types'

const STORAGE_KEY = 'dd-diagnostico-form'

export function useFormPersistence() {
  const persist = (state: FormState) => {
    const storage = safeSessionStorage()
    if (!storage) return
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Silencioso — quota exceeded ou outros erros
    }
  }

  const restore = (): FormState | null => {
    const storage = safeSessionStorage()
    if (!storage) return null
    try {
      const stored = storage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as FormState) : null
    } catch {
      return null
    }
  }

  const clear = () => {
    const storage = safeSessionStorage()
    storage?.removeItem(STORAGE_KEY)
  }

  return { persist, restore, clear }
}

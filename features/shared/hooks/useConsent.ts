'use client'

import { useContext } from 'react'
import { ConsentContext } from '@/features/shared/providers/ConsentProvider'

export function useConsent() {
  return useContext(ConsentContext)
}

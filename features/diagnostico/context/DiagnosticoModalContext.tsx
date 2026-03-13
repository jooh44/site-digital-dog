'use client'

import { createContext, useContext, useRef, useState } from 'react'
import { DiagnosticoModal } from '@/features/diagnostico/components/DiagnosticoModal'

interface ModalContextValue {
  openModal: () => void
}

const DiagnosticoModalContext = createContext<ModalContextValue | null>(null)

export function DiagnosticoModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const openModal = () => {
    previousFocusRef.current = document.activeElement as HTMLElement
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    // Restore focus to the element that triggered the modal
    setTimeout(() => previousFocusRef.current?.focus(), 0)
  }

  return (
    <DiagnosticoModalContext.Provider value={{ openModal }}>
      {children}
      <DiagnosticoModal isOpen={isOpen} onClose={closeModal} />
    </DiagnosticoModalContext.Provider>
  )
}

export function useDiagnosticoModal() {
  const ctx = useContext(DiagnosticoModalContext)
  if (!ctx) throw new Error('useDiagnosticoModal deve ser usado dentro de DiagnosticoModalProvider')
  return ctx
}

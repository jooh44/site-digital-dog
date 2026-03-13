'use client'

import { useEffect, useRef } from 'react'
import { DiagnosticoForm } from './DiagnosticoForm'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function DiagnosticoModal({ isOpen, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'

    // Move focus into the panel
    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Formulário de Diagnóstico Digital"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-2xl outline-none"
        style={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#ff6b35] flex-shrink-0" />
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/25">
              Diagnóstico Digital
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            aria-label="Fechar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          <DiagnosticoForm />
        </div>
      </div>
    </div>
  )
}

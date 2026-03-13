'use client'

import { createContext, useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ConsentContextValue {
  hasConsent: boolean
  giveConsent: () => void
}

export const ConsentContext = createContext<ConsentContextValue>({
  hasConsent: false,
  giveConsent: () => {},
})

function ConsentBanner({ onAccept }: { onAccept: () => void }) {
  const [visible, setVisible] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      role="region"
      aria-label="Aviso de cookies e privacidade"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-darker-blue/95 backdrop-blur-sm border-t border-white/10',
        'transition-transform duration-300 ease-out',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-300 leading-relaxed">
          Este site usa cookies para análise de desempenho (Meta Pixel e Google Analytics).
          Saiba mais em nossa{' '}
          <a
            href="/politica-de-privacidade"
            className="text-primary-blue hover:underline focus:outline-none focus:ring-1 focus:ring-primary-blue rounded"
          >
            Política de Privacidade
          </a>
          .
        </p>
        <button
          ref={btnRef}
          onClick={onAccept}
          aria-label="Aceitar uso de cookies e análise de dados"
          className={cn(
            'flex-shrink-0 px-5 py-2 text-sm font-medium rounded',
            'border border-primary-blue text-primary-blue',
            'hover:bg-primary-blue hover:text-white',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-darker-blue'
          )}
        >
          Aceitar
        </button>
      </div>
    </div>
  )
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [hasConsent, setHasConsent] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Guard SSR: localStorage só existe no browser
    const stored = localStorage.getItem('dd_consent')
    setHasConsent(stored === 'true')
    setIsLoaded(true)
  }, [])

  const giveConsent = () => {
    localStorage.setItem('dd_consent', 'true')
    setHasConsent(true)
  }

  return (
    <ConsentContext.Provider value={{ hasConsent, giveConsent }}>
      {children}
      {/* Banner aparece apenas após hidratação e sem consentimento */}
      {isLoaded && !hasConsent && <ConsentBanner onAccept={giveConsent} />}
    </ConsentContext.Provider>
  )
}

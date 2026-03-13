'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { name: 'Serviços', href: '#servicos' },
  { name: 'Portfólio', href: '#portfolio' },
  { name: 'Diagnóstico', href: '#diagnostico' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Scroll listener — threshold 80px (AC: #2)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Focus trap no overlay mobile (AC: #6)
  useEffect(() => {
    if (!isMenuOpen) return
    const overlay = overlayRef.current
    if (!overlay) return

    const focusable = overlay.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsMenuOpen(false); return }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }

    overlay.addEventListener('keydown', handleKeyDown)
    return () => overlay.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <header
      className={cn(
        'lg:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled && 'bg-dark-blue/80 backdrop-blur-sm border-b border-white/[0.06]'
      )}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Menu principal"
      >
        {/* Logo + Wordmark (AC: #1, #2) */}
        <Link href="/" className="flex items-center">
          <div className="relative w-9 h-9 flex-shrink-0">
            <Image
              src="/images/logo_digital_dog-removebg-preview.png"
              alt="Digital Dog"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop navigation (AC: #1) */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-dark-blue rounded"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#diagnostico"
            className={cn(
              'text-sm font-medium px-4 py-2 rounded border border-primary-blue text-primary-blue',
              'hover:bg-primary-blue hover:text-dark-blue transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-dark-blue'
            )}
          >
            Solicitar Diagnóstico
          </a>
        </div>

        {/* Botão hambúrguer — mobile only (AC: #3, #6) */}
        <button
          type="button"
          className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-dark-blue rounded"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <Menu size={24} aria-hidden="true" />
        </button>
      </nav>

      {/* Mobile overlay (AC: #4, #5, #6) */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md md:hidden flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação mobile"
        >
          {/* Botão fechar (AC: #5, #6) */}
          <div className="flex justify-end p-4">
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fechar menu"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue rounded"
            >
              <X size={28} aria-hidden="true" />
            </button>
          </div>

          {/* Links grandes (AC: #4) */}
          <nav
            className="flex flex-col items-center justify-center flex-1 gap-8"
            aria-label="Menu mobile"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-medium text-white/90 hover:text-primary-blue transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue rounded px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#diagnostico"
              className={cn(
                'mt-2 text-xl font-semibold px-8 py-3 rounded border border-primary-blue text-primary-blue',
                'hover:bg-primary-blue hover:text-dark-blue transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-black'
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Solicitar Diagnóstico
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

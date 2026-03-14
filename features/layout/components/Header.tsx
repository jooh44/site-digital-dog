'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLenis } from '@studio-freight/react-lenis'

const NAV_LINKS = [
  { name: 'Serviços', href: '#servicos' },
  { name: 'Portfólio', href: '#portfolio' },
  { name: 'Diagnóstico', href: '#diagnostico' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll quando sidebar aberta — Integrado com Lenis
  useEffect(() => {
    if (isMenuOpen) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.body.style.overflow = ''
    }
    return () => { 
      lenis?.start()
      document.body.style.overflow = '' 
    }
  }, [isMenuOpen, lenis])

  // Focus trap na sidebar
  useEffect(() => {
    if (!isMenuOpen) return
    const sidebar = sidebarRef.current
    if (!sidebar) return

    const focusable = sidebar.querySelectorAll<HTMLElement>(
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

    sidebar.addEventListener('keydown', handleKeyDown)
    return () => sidebar.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault()
    setIsMenuOpen(false)
    
    // Pequeno delay para a sidebar fechar antes de scrollar (melhor performance visual)
    setTimeout(() => {
      lenis?.scrollTo(href, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      })
    }, 300)
  }

  return (
    <header
      className={cn(
        'lg:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled && 'backdrop-blur-sm border-b border-white/[0.06]'
      )}
      style={isScrolled ? { background: 'rgba(10,10,10,0.85)' } : undefined}
    >
      <nav
        className="px-4 sm:px-6 flex items-center justify-between h-16"
        aria-label="Menu principal"
      >
        {/* Logo + Wordmark */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 flex-shrink-0">
            <Image
              src="/images/logo_digital_dog-removebg-preview.png"
              alt="Digital Dog"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span
              className="font-heading font-bold leading-none tracking-[-0.02em]"
              style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.88)' }}
            >
              Digital Dog
            </span>
            <span
              className="font-body leading-none"
              style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}
            >
              Arquitetura Digital
            </span>
          </div>
        </Link>

        {/* Botão hambúrguer */}
        <button
          type="button"
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-dark-blue rounded"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </nav>

      {/* Backdrop + Sidebar */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <div
            id="mobile-menu"
            ref={sidebarRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="fixed top-0 right-0 h-full z-50 flex flex-col"
            style={{
              width: '72vw',
              maxWidth: '280px',
              background: '#111111',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              animation: 'slideInRight 0.22s ease-out',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Topo da sidebar — logo + fechar */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image
                    src="/images/logo_digital_dog-removebg-preview.png"
                    alt="Digital Dog"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="font-heading font-bold leading-none tracking-[-0.02em]"
                    style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.88)' }}
                  >
                    Digital Dog
                  </span>
                  <span
                    className="font-body leading-none"
                    style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}
                  >
                    Arquitetura Digital
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Fechar menu"
                className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-white/50 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue rounded"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Links de navegação */}
            <nav className="flex flex-col flex-1 px-3 py-5 gap-0.5" aria-label="Menu mobile">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[15px] font-medium text-white/75 hover:text-white hover:bg-white/[0.05] rounded-lg px-3 py-3 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="px-4 pb-8 flex-shrink-0">
              <a
                href="#diagnostico"
                className={cn(
                  'block text-center text-[14px] font-semibold px-6 py-3 rounded-lg border border-primary-blue text-primary-blue',
                  'hover:bg-primary-blue hover:text-dark-blue transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-[#111]'
                )}
                onClick={(e) => handleNavClick(e, '#diagnostico')}
              >
                Solicitar Diagnóstico
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

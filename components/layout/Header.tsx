'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useMotionValueEvent, LayoutGroup } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Menu, X } from 'lucide-react'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'Arquitetura', href: '#arquitetura' },
  { name: 'Serviços', href: '#servicos' },
  { name: 'Portfólio', href: '#portfolio' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  // Scroll suave personalizado e detecção de seção ativa
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation
        .map(nav => {
          if (nav.href.startsWith('#')) {
            const id = nav.href.substring(1)
            const el = document.getElementById(id)
            // Se for portfolio, tenta pegar a versão mobile se a desktop não estiver visível/existente
            if (id === 'portfolio' && (!el || el.offsetParent === null)) {
               return document.getElementById('portfolio-mobile')
            }
            return el
          }
          return null
        })
        .filter(Boolean) as HTMLElement[]

      let current = ''
      
      // Lógica para detectar qual seção está mais visível na tela
      // Encontrar a última seção que já passou pelo ponto de ativação
      let lastActive = ''
      
      for (const section of sections) {
        const sectionTop = section.offsetTop
        // Ajuste fino: ativa a seção quando ela está a 1/3 do topo da tela
        const activationPoint = window.scrollY + (window.innerHeight / 3)

        if (activationPoint >= sectionTop) {
           let id = '#' + section.id
           if (id === '#portfolio-mobile') id = '#portfolio'
           lastActive = id
        }
      }
      
      if (lastActive) {
         current = lastActive
      }

      // Fallback para Home quando estiver bem no topo
      if (window.scrollY < 50) {
         current = '#home'
      }

      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    // Chamada inicial para definir estado correto ao carregar
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.substring(1)
      // Tenta encontrar a seção desktop ou mobile se for portfolio
      let element = document.getElementById(targetId)
      if (targetId === 'portfolio' && window.innerWidth < 1024) {
          element = document.getElementById('portfolio-mobile')
      }

      if (element) {
        const offsetTop = element.offsetTop
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        })
        setMobileMenuOpen(false)
      }
    }
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled 
          ? 'bg-darker-blue/90 border-b border-primary-blue/20 py-2 backdrop-blur-md' 
          : 'bg-transparent border-b border-transparent py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group relative z-50" onClick={(e) => handleNavClick(e as any, '#home')}>
            <div className={`relative transition-all duration-300 ${isScrolled ? 'w-36 h-16' : 'w-48 h-20 md:w-64 md:h-24'}`}>
              <ImageWithFallback
                src="/images/logo_digital_dog.png"
                alt="Digital Dog Logo"
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(0,188,212,0.3)]"
                priority
                quality={85}
                fallbackText="Digital Dog"
                showPlaceholder={true}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="flex items-center bg-darker-blue/40 backdrop-blur-sm rounded-full border border-primary-blue/10 px-2 py-1 mr-4 relative group/nav">
              <div className="absolute inset-0 rounded-full bg-darker-blue/40 -z-20" />
              <LayoutGroup id="navbar-animation">
                  {navigation.map((item) => {
                    const isActive = activeSection === item.href
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`relative px-5 py-2 text-sm font-medium transition-colors duration-300 z-10 ${isActive ? 'text-white' : 'text-light-blue hover:text-white'}`}
                      >
                        <span className="relative z-10">{item.name}</span>
                        {/* Active Background */}
                        {isActive && (
                            <motion.span
                                layoutId="activeNav"
                                className="absolute inset-0 rounded-full bg-primary-blue/20 border border-primary-blue/30 -z-10"
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 350, 
                                    damping: 30 
                                }}
                            />
                        )}
                        {/* Hover Background (only if not active) */}
                        {!isActive && (
                            <span className="absolute inset-0 rounded-full bg-primary-blue/5 scale-0 transition-transform duration-200 group-hover:scale-100 -z-10" />
                        )}
                      </a>
                    )
                  })}
              </LayoutGroup>
            </div>
            
            <a 
              href="https://api.whatsapp.com/send?phone=5547988109155&text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20gratuito%20para%20minha%20cl%C3%ADnica%20veterin%C3%A1ria."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="primary" 
                className={`transition-all duration-300 ${
                  isScrolled ? 'min-h-[40px] px-6' : 'min-h-[48px] px-8 text-base shadow-[0_0_20px_rgba(0,188,212,0.4)]'
                }`}
              >
                Diagnóstico Gratuito
              </Button>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden relative z-50 p-2 text-light-blue hover:text-primary-blue transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-40 bg-darker-blue/95 backdrop-blur-xl lg:hidden flex flex-col items-center justify-center"
            >
               {/* Background Elements */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-blue/10 rounded-full blur-[80px]" />
                  <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#ff6b35]/10 rounded-full blur-[80px]" />
               </div>

              <div className="w-full max-w-xs space-y-6 text-center relative z-10">
                {navigation.map((item, index) => {
                   const isActive = activeSection === item.href
                   return (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <a
                        href={item.href}
                        className={`block text-2xl font-heading font-bold transition-colors py-2 ${isActive ? 'text-primary-blue' : 'text-light-blue hover:text-primary-blue'}`}
                        onClick={(e) => handleNavClick(e, item.href)}
                        >
                        {item.name}
                        </a>
                    </motion.div>
                   )
                })}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-8"
                >
                  <a 
                    href="https://api.whatsapp.com/send?phone=5547988109155&text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20gratuito%20para%20minha%20cl%C3%ADnica%20veterin%C3%A1ria."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="primary" className="w-full min-h-[56px] text-lg shadow-[0_0_30px_rgba(0,188,212,0.3)]">
                      Diagnóstico Gratuito
                    </Button>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Monitor, Code, Globe, Zap } from 'lucide-react'

interface PortfolioItem {
  id: number
  name: string
  description: string
  image: string
  url?: string
  category: string
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    name: 'Clínica Veterinária PetCare',
    description: 'Site completo com sistema de agendamento integrado e área do cliente',
    image: '/images/portfolio/petcare.jpg',
    url: 'https://petcare.example.com',
    category: 'Veterinária',
  },
  {
    id: 2,
    name: 'Vet & Cia',
    description: 'E-commerce para produtos veterinários com integração de pagamento',
    image: '/images/portfolio/vetecia.jpg',
    url: 'https://vetecia.example.com',
    category: 'E-commerce',
  },
  {
    id: 3,
    name: 'Animal Hospital Premium',
    description: 'Portal institucional com blog e sistema de newsletter',
    image: '/images/portfolio/premium.jpg',
    url: 'https://premium.example.com',
    category: 'Institucional',
  },
  {
    id: 4,
    name: 'Vet Center',
    description: 'Plataforma completa com CRM integrado e dashboard de métricas',
    image: '/images/portfolio/vetcenter.jpg',
    url: 'https://vetcenter.example.com',
    category: 'Plataforma',
  },
  {
    id: 5,
    name: 'Clínica Animal Care',
    description: 'Site responsivo com foco em conversão e agendamento online',
    image: '/images/portfolio/animalcare.jpg',
    url: 'https://animalcare.example.com',
    category: 'Veterinária',
  },
]

const placeholderIcons = [Monitor, Code, Globe, Zap, Monitor]

export function PortfolioSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Distância mínima para considerar swipe
  const minSwipeDistance = 50

  // Auto-play
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % portfolioItems.length)
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPaused])

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
      }
    }
  }, [])

  // Pausar e agendar resume
  const pauseAndResume = useCallback(() => {
    setIsPaused(true)
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
      resumeTimeoutRef.current = null
    }, 10000)
  }, [])

  // Handlers de navegação
  const nextSlide = useCallback(() => {
    pauseAndResume()
    setCurrentIndex((prev) => (prev + 1) % portfolioItems.length)
  }, [pauseAndResume])

  const prevSlide = useCallback(() => {
    pauseAndResume()
    setCurrentIndex((prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length)
  }, [pauseAndResume])

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return
    pauseAndResume()
    setCurrentIndex(index)
  }, [currentIndex, pauseAndResume])

  // Handlers de touch para swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    pauseAndResume()
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  const currentItem = portfolioItems[currentIndex]
  const PlaceholderIcon = placeholderIcons[currentIndex % placeholderIcons.length]

  return (
    <section className="relative py-16 md:py-24 px-4 bg-darker-blue">
      {/* Linha divisória */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <div
          className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-primary-blue to-transparent opacity-60 blur-sm"
          style={{
            boxShadow: '0 0 20px rgba(0, 188, 212, 0.5), 0 0 40px rgba(0, 188, 212, 0.3)',
          }}
        />
        <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-primary-blue to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading font-bold text-primary-blue text-3xl md:text-4xl lg:text-5xl mb-4">
            Nossos Sites Criados
          </h2>
          <p className="font-body text-light-blue text-lg md:text-xl max-w-3xl mx-auto">
            Conheça alguns dos projetos que desenvolvemos para clínicas veterinárias
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-xl bg-darker-blue select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Slide */}
            <div className="absolute inset-0 w-full h-full transition-opacity duration-300">
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-primary-blue/20 bg-gradient-to-br from-dark-blue to-darker-blue">
                {/* Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,188,212,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary-blue/20 rounded-full blur-2xl" />
                      <PlaceholderIcon className="w-32 h-32 md:w-40 md:h-40 text-primary-blue/60 relative z-10" />
                    </div>
                    <div className="mt-6 text-center px-4">
                      <div className="inline-block px-4 py-2 rounded-lg bg-primary-blue/10 border border-primary-blue/30">
                        <span className="font-body text-primary-blue/80 text-sm">
                          Preview em breve
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-darker-blue via-darker-blue/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 z-20">
                  <div className="max-w-4xl mx-auto">
                    <p className="font-body text-xs uppercase tracking-wider mb-2 bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
                      {currentItem.category}
                    </p>
                    <h3 className="font-heading font-bold text-primary-blue text-xl md:text-2xl lg:text-3xl mb-2">
                      {currentItem.name}
                    </h3>
                    <p className="font-body text-light-blue text-sm md:text-base mb-4 max-w-2xl">
                      {currentItem.description}
                    </p>
                    {currentItem.url && (
                      <a
                        href={currentItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-blue/20 hover:bg-primary-blue/30 border border-primary-blue/50 hover:border-primary-blue text-primary-blue font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,188,212,0.4)]"
                      >
                        <span>Visitar Site</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-blue/30 hover:bg-primary-blue/40 border border-primary-blue/60 hover:border-primary-blue backdrop-blur-md flex items-center justify-center text-primary-blue transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,188,212,0.5)] active:scale-95"
              aria-label="Slide anterior"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-blue/30 hover:bg-primary-blue/40 border border-primary-blue/60 hover:border-primary-blue backdrop-blur-md flex items-center justify-center text-primary-blue transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,188,212,0.5)] active:scale-95"
              aria-label="Próximo slide"
              type="button"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center items-center gap-2 mt-6 md:mt-8">
            {portfolioItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-12 h-2 bg-primary-blue shadow-[0_0_10px_rgba(0,188,212,0.5)]'
                    : 'w-2 h-2 bg-primary-blue/30 hover:bg-primary-blue/50'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
                type="button"
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4">
            <span className="font-body text-light-blue/70 text-sm">
              {currentIndex + 1} / {portfolioItems.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}


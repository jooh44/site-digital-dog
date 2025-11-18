'use client'

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Network, TrendingUp, Brain, LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Pillar {
  id: number
  icon: LucideIcon
  title: string
  description: string
}

const pillars: Pillar[] = [
  {
    id: 1,
    icon: Palette,
    title: 'Arquitetura de Marca',
    description: 'Construímos uma identidade visual e verbal que comunica sua essência e diferencia sua clínica no mercado. Não é apenas um logo — é a base emocional que conecta você com seus clientes.',
  },
  {
    id: 2,
    icon: Network,
    title: 'Arquitetura Digital',
    description: 'Sistemas integrados que conversam entre si. Site, CRM, redes sociais, agenda — tudo conectado em um ecossistema que funciona enquanto você cuida dos pets.',
  },
  {
    id: 3,
    icon: TrendingUp,
    title: 'Estrutura Comercial',
    description: 'Processos de vendas e marketing que geram resultados mensuráveis. Do primeiro contato até a fidelização, cada etapa é otimizada para converter e reter clientes.',
  },
  {
    id: 4,
    icon: Brain,
    title: 'Inteligência de Dados',
    description: 'Decisões baseadas em dados reais, não em "achismo". Analytics, relatórios e insights que mostram o que funciona e o que precisa ser ajustado na sua estratégia.',
  },
]

export function FourPillars() {
  return (
    <section className="relative py-16 md:py-24 px-4 bg-darker-blue">
      {/* Linha divisória neon azul */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-primary-blue to-transparent opacity-60 blur-sm"
          style={{ 
            boxShadow: '0 0 20px rgba(0, 188, 212, 0.5), 0 0 40px rgba(0, 188, 212, 0.3)' 
          }}
        />
        {/* Linha principal */}
        <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-primary-blue to-transparent" />
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* SVG Gradient Definitions */}
        <svg width="0" height="0" className="absolute">
          <defs>
            {pillars.map((pillar) => (
              <linearGradient key={pillar.id} id={`gradient-icon-${pillar.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff6b35" />
                <stop offset="50%" stopColor="#ff1744" />
                <stop offset="100%" stopColor="#ff6b35" />
              </linearGradient>
            ))}
          </defs>
        </svg>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="outline" pulse className="mb-4">
            Nossos Pilares
          </Badge>
          <h2 className="font-heading font-bold text-primary-blue mb-4" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
            Os 4 Pilares da{' '}
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
              Arquitetura Digital
            </span>
          </h2>
          <p className="font-body text-light-blue text-lg md:text-xl max-w-2xl mx-auto">
            Não é só marketing. Não é apenas tecnologia. É o ecossistema completo que transforma sua clínica.
          </p>
        </motion.div>

        {/* Pillars Grid - 2x2 simétrico */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon
            return (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                IconComponent={IconComponent}
                index={index}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PillarCard({ 
  pillar, 
  IconComponent, 
  index 
}: { 
  pillar: Pillar
  IconComponent: LucideIcon
  index: number
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const handleMouseEnter = () => {
      const svg = wrapper.querySelector('svg')
      if (svg) {
        // Atualizar todos os elementos SVG (path, circle, rect, line, etc.)
        const allElements = svg.querySelectorAll('path, circle, rect, line, polyline, polygon')
        allElements.forEach((element) => {
          ;(element as SVGElement).setAttribute('stroke', '#00bcd4')
        })
      }
    }

    const handleMouseLeave = () => {
      const svg = wrapper.querySelector('svg')
      if (svg) {
        // Atualizar todos os elementos SVG (path, circle, rect, line, etc.)
        const allElements = svg.querySelectorAll('path, circle, rect, line, polyline, polygon')
        allElements.forEach((element) => {
          ;(element as SVGElement).setAttribute('stroke', `url(#gradient-icon-${pillar.id})`)
        })
      }
    }

    wrapper.addEventListener('mouseenter', handleMouseEnter)
    wrapper.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      wrapper.removeEventListener('mouseenter', handleMouseEnter)
      wrapper.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [pillar.id])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1 
      }}
    >
      <motion.div
        ref={wrapperRef}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="h-full relative group"
      >
        <Card
          variant="service"
          className="h-full flex flex-col bg-gradient-to-br from-dark-blue to-darker-blue border-l-4 border-transparent transition-all duration-200 relative overflow-hidden group-hover:border-primary-blue"
        >
          {/* Icon */}
          <div className="mb-4 relative z-10">
            <IconComponent 
              className="w-10 h-10 md:w-12 md:h-12 transition-all duration-200 [&>path]:transition-all [&>path]:duration-200" 
              style={{
                stroke: `url(#gradient-icon-${pillar.id})`,
              }}
              strokeWidth={1.5}
              fill="none"
              aria-label={pillar.title}
            />
          </div>
                  
          {/* Title */}
          <h3 className="font-heading font-semibold text-primary-blue text-xl mb-3 relative z-10">
            {pillar.title}
          </h3>
                  
          {/* Description */}
          <p className="font-body text-light-blue/80 text-base leading-relaxed flex-grow relative z-10">
            {pillar.description}
          </p>
        </Card>
      </motion.div>
    </motion.div>
  )
}


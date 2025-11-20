'use client'

import React from 'react'
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
    description: 'Construímos uma identidade visual e verbal que comunica sua essência e diferencia sua clínica no mercado. Não é apenas um logo, é a base emocional que conecta você com seus clientes.',
  },
  {
    id: 2,
    icon: Network,
    title: 'Arquitetura Digital',
    description: 'Sistemas integrados que conversam entre si. Site, CRM, redes sociais, agenda: tudo conectado em um ecossistema que funciona enquanto você cuida dos pets.',
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
    <section id="arquitetura" className="relative py-20 md:py-32 px-4 bg-darker-blue overflow-hidden">
      {/* Efeitos de Fundo Sutis */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-blue/5 rounded-full blur-[120px]" />
      </div>

      {/* Linha divisória neon azul */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden z-10">
        <div 
          className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-primary-blue to-transparent opacity-60 blur-sm"
          style={{ 
            boxShadow: '0 0 20px rgba(0, 188, 212, 0.5), 0 0 40px rgba(0, 188, 212, 0.3)' 
          }}
        />
        <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-primary-blue to-transparent" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
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
          className="text-center mb-16 md:mb-24"
        >
          <Badge variant="outline" pulse className="mb-6">
            Nossos Pilares
          </Badge>
          <h2 className="font-heading font-bold text-primary-blue mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Os 4 Pilares da{' '}
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
              Arquitetura Digital
            </span>
          </h2>
          <p className="font-body text-light-blue text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Não é só marketing. Não é apenas tecnologia. É o ecossistema completo que transforma sua clínica.
          </p>
        </motion.div>

        {/* Pillars Grid - Clean & Tech */}
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
      }}
      className="h-full"
    >
      <div className="group relative h-full">
        {/* Hover Glow Effect - Sutil e Elegante */}
        <div className="absolute -inset-0.5 bg-gradient-to-b from-primary-blue/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
        
        <Card
          variant="service"
          className="relative h-full flex flex-col bg-dark-blue/50 backdrop-blur-sm border border-primary-blue/10 p-6 md:p-8 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-dark-blue/80 group-hover:border-primary-blue/30"
        >
          {/* Icon Box */}
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-blue/5 border border-primary-blue/10 group-hover:bg-primary-blue/10 group-hover:border-primary-blue/30 transition-all duration-300">
            <IconComponent 
              className="w-8 h-8 text-primary-blue transition-transform duration-300 group-hover:scale-110" 
              strokeWidth={1.5}
              aria-label={pillar.title}
            />
          </div>
                  
          {/* Title */}
          <h3 className="font-heading font-bold text-light-blue text-xl mb-4 group-hover:text-primary-blue transition-colors">
            {pillar.title}
          </h3>
                  
          {/* Description */}
          <p className="font-body text-light-blue/60 text-sm leading-relaxed flex-grow group-hover:text-light-blue/80 transition-colors">
            {pillar.description}
          </p>

          {/* Bottom Line Accent */}
          <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary-blue/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </Card>
      </div>
    </motion.div>
  )
}

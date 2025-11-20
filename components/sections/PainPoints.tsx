'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const painPoints = [
  {
    id: 1,
    title: 'Marketing sem ROI visível',
    highlight: 'ROI',
    description: 'Você investe em campanhas, mas não consegue medir o retorno real. O dinheiro vai embora sem resultados concretos.',
  },
  {
    id: 2,
    title: 'Sistemas que não conversam',
    highlight: 'não conversam',
    description: 'CRM, site, redes sociais, agenda: tudo separado. Informações fragmentadas que geram caos e perda de tempo.',
  },
  {
    id: 3,
    title: 'Invisibilidade online quando importa',
    highlight: 'importa',
    description: 'Quando o cliente precisa de você, você não aparece. Perde oportunidades porque não está visível no momento certo.',
  },
  {
    id: 4,
    title: 'Tempo engolido por gestão',
    highlight: 'engolido',
    description: 'Você deveria estar cuidando dos pets, mas passa horas resolvendo problemas de sistemas e processos.',
  },
  {
    id: 5,
    title: 'Impossível competir com redes grandes',
    highlight: 'Impossível',
    description: 'Clínicas grandes dominam o mercado. Você se sente pequeno e sem chance de competir de igual para igual.',
  },
  {
    id: 6,
    title: 'Decisões no escuro',
    highlight: 'escuro',
    description: 'Você toma decisões baseadas em "achismo". Sem dados reais, sem visibilidade do que realmente funciona.',
  },
]

// Helper para destacar palavras específicas com gradiente
function highlightText(text: string, highlight: string): React.ReactNode {
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
  return parts.map((part, index) => 
    part.toLowerCase() === highlight.toLowerCase() ? (
      <span key={index} className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
        {part}
      </span>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  )
}

export function PainPoints() {
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
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="outline" pulse className="mb-4">
            Dores Reais
          </Badge>
          <h2 className="font-heading font-bold text-primary-blue mb-4" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
            Você Reconhece Alguma Dessas{' '}
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
              Dores?
            </span>
          </h2>
          <p className="font-body text-light-blue text-lg md:text-xl max-w-2xl mx-auto">
            Se você se identifica com pelo menos uma, você precisa de Arquitetura Digital, não apenas marketing ou tecnologia isolada.
          </p>
        </motion.div>

        {/* Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {painPoints.map((painPoint, index) => (
            <motion.div
              key={painPoint.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="h-full relative group"
              >
                <Card
                  variant="service"
                  className="h-full flex flex-col bg-gradient-to-br from-dark-blue to-darker-blue border-l-4 border-transparent transition-all duration-200 relative overflow-hidden"
                >
                  <h3 className="font-heading font-semibold text-primary-blue text-xl mb-3 relative z-10">
                    {highlightText(painPoint.title, painPoint.highlight)}
                  </h3>
                  
                  <p className="font-body text-light-blue/80 text-base leading-relaxed flex-grow relative z-10">
                    {painPoint.description}
                  </p>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


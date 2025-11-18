'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'

const stages = [
  {
    id: 1,
    number: '01',
    title: 'Diagnóstico Estratégico',
    timeframe: 'Semanas 1-2',
    description: 'Análise profunda da sua clínica: posicionamento atual, sistemas existentes, pontos fortes e oportunidades. Entendemos seu negócio antes de propor soluções.',
  },
  {
    id: 2,
    number: '02',
    title: 'Blueprint Personalizado',
    timeframe: 'Semanas 2-3',
    description: 'Criamos um plano estratégico completo e personalizado para sua clínica. Roadmap claro com entregas, prazos e métricas de sucesso definidas desde o início.',
  },
  {
    id: 3,
    number: '03',
    title: 'Fundação',
    timeframe: 'Mês 1-2',
    description: 'Construção da base: identidade visual, arquitetura de sistemas, integrações essenciais. Tudo preparado para suportar o crescimento sustentável.',
  },
  {
    id: 4,
    number: '04',
    title: 'Construção',
    timeframe: 'Mês 3-4',
    description: 'Desenvolvimento do ecossistema completo: site otimizado, automações inteligentes, funis de conversão e estratégias de conteúdo alinhadas com sua marca.',
  },
  {
    id: 5,
    number: '05',
    title: 'Lançamento',
    timeframe: 'Mês 5',
    description: 'Go-live com tudo funcionando perfeitamente. Campanhas de lançamento, treinamento da equipe e início da geração de leads qualificados.',
  },
  {
    id: 6,
    number: '06',
    title: 'Otimização Contínua',
    timeframe: 'Mês 6+',
    description: 'Melhoria constante baseada em dados reais. Ajustes estratégicos, otimizações de performance e evolução contínua do seu ecossistema digital.',
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  
  // Scroll progress dentro da seção (0 a 1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center']
  })
  
  // Transformar progresso em altura da linha preenchida (0% a 100%)
  const lineProgress = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%'])

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 px-4 bg-darker-blue">
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
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="outline" pulse className="mb-4">
            Como Funciona
          </Badge>
          <h2 className="font-heading font-bold text-primary-blue mb-4" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
            A Jornada de{' '}
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
              Transformação
            </span>
          </h2>
          <p className="font-body text-light-blue text-lg md:text-xl max-w-2xl mx-auto">
            Do diagnóstico inicial até a otimização contínua, cada etapa é pensada para transformar sua clínica em uma máquina de crescimento.
          </p>
        </motion.div>

        {/* Timeline - Desktop: Centralizada com layout [número] | [timeline] | [textos] */}
        <div className="relative">
          {/* Desktop Layout - Grid 3 colunas: [número] | [timeline] | [textos] */}
          <div className="hidden lg:flex lg:justify-center">
            <div className="grid lg:grid-cols-[auto_auto_500px] lg:gap-8 lg:max-w-5xl">
              {/* Coluna de números à esquerda */}
              <div className="space-y-24 lg:space-y-28">
                {stages.map((stage) => (
                  <div key={`num-${stage.id}`} className="text-right flex items-start justify-end min-h-[120px]">
                    <span className="text-4xl lg:text-5xl font-bold text-primary-blue/30 font-mono leading-none">
                      {stage.number}
                    </span>
                  </div>
                ))}
              </div>

              {/* Timeline centralizada */}
              <div className="relative flex justify-center">
                <div className="relative w-0.5 min-h-full">
                  {/* Linha de fundo (estática) */}
                  <div className="absolute top-0 bottom-0 left-0 right-0 w-0.5 bg-primary-blue/20">
                    <div 
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-blue/20 to-transparent opacity-40 blur-sm"
                    />
                  </div>

                  {/* Linha preenchida (animada com scroll) */}
                  <motion.div 
                    className="absolute top-0 left-0 right-0 w-0.5 bg-gradient-to-b from-primary-blue via-primary-blue to-primary-blue origin-top"
                    style={{ 
                      height: lineProgress,
                      boxShadow: '0 0 10px rgba(0, 188, 212, 0.5), 0 0 20px rgba(0, 188, 212, 0.3)'
                    }}
                  >
                    <div 
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-blue to-transparent opacity-60 blur-sm"
                    />
                  </motion.div>

                  {/* Círculos na linha - alinhados com os títulos */}
                  <div className="space-y-24 lg:space-y-28">
                    {stages.map((stage) => (
                      <div key={`dot-container-${stage.id}`} className="relative flex items-start justify-center pt-[52px] min-h-[120px]">
                        <motion.div
                          className="relative z-10 -translate-x-[1px]"
                          initial={{ 
                            scale: 0.6,
                            opacity: 0.2
                          }}
                          whileInView={{ 
                            scale: 1,
                            opacity: 1
                          }}
                          viewport={{ once: false, margin: '-100px' }}
                          transition={{ 
                            duration: 0.6,
                            type: "spring",
                            stiffness: 150
                          }}
                        >
                          <div 
                            className="w-6 h-6 rounded-full bg-primary-blue"
                            style={{
                              filter: 'drop-shadow(0 0 8px rgba(0, 188, 212, 0.6)) drop-shadow(0 0 16px rgba(0, 188, 212, 0.4))'
                            }}
                          />
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coluna de conteúdo - largura limitada */}
              <div className="space-y-24 lg:space-y-28">
                {stages.map((stage, index) => (
                  <motion.div
                    key={stage.id}
                    className="flex items-start min-h-[120px]"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: '-100px' }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.1 
                    }}
                  >
                    <div className="w-full">
                      <h3 className="font-heading font-semibold text-primary-blue text-2xl mb-3">
                        {stage.title}
                      </h3>
                      <p className="font-body text-light-blue/80 text-base leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout - Vertical melhorado */}
          <div className="lg:hidden">
            <div className="relative">
              {/* Linha vertical da timeline à esquerda */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-blue/20">
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-blue/20 to-transparent opacity-40 blur-sm"
                />
              </div>

              {/* Linha preenchida (animada com scroll) */}
              <motion.div 
                className="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-primary-blue via-primary-blue to-primary-blue origin-top"
                style={{ 
                  height: lineProgress,
                  boxShadow: '0 0 10px rgba(0, 188, 212, 0.5), 0 0 20px rgba(0, 188, 212, 0.3)'
                }}
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-blue to-transparent opacity-60 blur-sm"
                />
              </motion.div>

              {/* Stages List */}
              <div className="space-y-16 md:space-y-20 pl-8 md:pl-10">
                {stages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className="relative"
                    >
                      {/* Círculo da timeline - centralizado na linha vertical */}
                      <div className="absolute -left-8 md:-left-10 top-[38px] md:top-[42px] z-10 overflow-visible" style={{ width: '32px', height: '24px', marginLeft: '-12px' }}>
                        <motion.div
                          className="w-6 h-6 rounded-full bg-primary-blue absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          initial={{ 
                            opacity: 0.15
                          }}
                          whileInView={{ 
                            opacity: 1
                          }}
                          viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
                          transition={{ 
                            duration: 0.5,
                            ease: "easeOut"
                          }}
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(0, 188, 212, 0.6)) drop-shadow(0 0 16px rgba(0, 188, 212, 0.4))'
                          }}
                        />
                      </div>

                      {/* Stage Content */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: '-100px' }}
                        transition={{ 
                          duration: 0.5, 
                          delay: 0.1 
                        }}
                        className="flex-1"
                      >
                        {/* Número */}
                        <div className="mb-2">
                          <span className="text-2xl md:text-3xl font-bold text-primary-blue/30 font-mono">
                            {stage.number}
                          </span>
                        </div>
                        {/* Título - alinhado com a bolinha */}
                        <h3 className="font-heading font-semibold text-primary-blue text-xl md:text-2xl mb-3">
                          {stage.title}
                        </h3>
                        <p className="font-body text-light-blue/80 text-sm md:text-base leading-relaxed">
                          {stage.description}
                        </p>
                      </motion.div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


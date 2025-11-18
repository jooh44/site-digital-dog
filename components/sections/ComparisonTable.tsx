'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'

interface ComparisonFeature {
  feature: string
  agencias: string
  softwares: string
  consultorias: string
  digitalDog: string
}

const comparisonData: ComparisonFeature[] = [
  {
    feature: 'Posicionamento',
    agencias: 'Marketing tático',
    softwares: 'Gestão operacional',
    consultorias: 'Estratégia pontual',
    digitalDog: 'Arquitetura Digital completa',
  },
  {
    feature: 'Site',
    agencias: 'Landing pages',
    softwares: 'Não oferecem',
    consultorias: 'Recomendam terceiros',
    digitalDog: 'Site estratégico integrado',
  },
  {
    feature: 'Sistemas',
    agencias: 'Não oferecem',
    softwares: 'Sistema isolado',
    consultorias: 'Não oferecem',
    digitalDog: 'Ecossistema integrado',
  },
  {
    feature: 'Automação IA',
    agencias: 'Limitada',
    softwares: 'Não oferecem',
    consultorias: 'Não oferecem',
    digitalDog: 'Automações inteligentes',
  },
  {
    feature: 'Tráfego',
    agencias: 'Tráfego pago',
    softwares: 'Não oferecem',
    consultorias: 'Não oferecem',
    digitalDog: 'SEO + Tráfego pago',
  },
  {
    feature: 'Dados',
    agencias: 'Métricas básicas',
    softwares: 'Relatórios internos',
    consultorias: 'Análises pontuais',
    digitalDog: 'Inteligência de dados completa',
  },
  {
    feature: 'Implementação',
    agencias: 'Projetos pontuais',
    softwares: 'Setup inicial',
    consultorias: 'Consultoria sem execução',
    digitalDog: 'Implementação completa',
  },
  {
    feature: 'Suporte',
    agencias: 'Suporte limitado',
    softwares: 'Suporte técnico',
    consultorias: 'Acompanhamento pontual',
    digitalDog: 'Suporte contínuo mensal',
  },
]

export function ComparisonTable() {
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
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-heading font-bold text-primary-blue text-3xl md:text-4xl lg:text-5xl mb-4">
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
              Digital Dog
            </span>{' '}
            vs. Concorrentes
          </h2>
          <p className="font-body text-light-blue text-lg md:text-xl max-w-3xl mx-auto">
            Veja por que somos a única escolha para transformação digital completa
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="space-y-6">
          {comparisonData.map((item, index) => (
            <motion.div
              key={item.feature}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card variant="service" className="p-6 md:p-8">
                {/* Feature Title */}
                <h3 className="font-heading font-bold text-primary-blue text-lg md:text-xl mb-6">
                  {item.feature}
                </h3>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Agências */}
                  <div className="bg-darker-blue/50 rounded-lg p-4 border border-primary-blue/10">
                    <p className="font-heading font-semibold text-light-blue text-xs uppercase tracking-wider mb-2">
                      Agências
                    </p>
                    <p className="font-body text-light-blue/80 text-sm">
                      {item.agencias}
                    </p>
                  </div>

                  {/* Softwares */}
                  <div className="bg-darker-blue/50 rounded-lg p-4 border border-primary-blue/10">
                    <p className="font-heading font-semibold text-light-blue text-xs uppercase tracking-wider mb-2">
                      Softwares
                    </p>
                    <p className="font-body text-light-blue/80 text-sm">
                      {item.softwares}
                    </p>
                  </div>

                  {/* Consultorias */}
                  <div className="bg-darker-blue/50 rounded-lg p-4 border border-primary-blue/10">
                    <p className="font-heading font-semibold text-light-blue text-xs uppercase tracking-wider mb-2">
                      Consultorias
                    </p>
                    <p className="font-body text-light-blue/80 text-sm">
                      {item.consultorias}
                    </p>
                  </div>

                  {/* Digital Dog - Highlighted */}
                  <div className="bg-primary-blue/20 rounded-lg p-4 border-2 border-primary-blue/40 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gradient-orange to-gradient-pink" />
                    <p className="font-heading font-bold text-primary-blue text-xs uppercase tracking-wider mb-2">
                      Digital Dog
                    </p>
                    <p className="font-body font-semibold text-primary-blue text-sm">
                      {item.digitalDog}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface CaseStudy {
  id: number
  clinicName: string
  photo: string
  challenge: string
  solution: string
  results: {
    metric: string
    value: string
  }[]
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    clinicName: 'Clínica Veterinária PetCare',
    photo: '/images/cases/petcare.jpg',
    challenge: 'Marketing fragmentado sem resultados mensuráveis. Múltiplos sistemas que não conversavam entre si, gerando retrabalho e perda de oportunidades.',
    solution: 'Implementamos arquitetura digital completa: site otimizado, CRM integrado, automações de marketing e dashboard de métricas em tempo real. Tudo conectado em um único ecossistema.',
    results: [
      { metric: 'Aumento de Leads', value: '+180%' },
      { metric: 'Taxa de Conversão', value: '+65%' },
      { metric: 'ROI Marketing', value: '340%' },
    ],
  },
  {
    id: 2,
    clinicName: 'Vet & Cia',
    photo: '/images/cases/vetecia.jpg',
    challenge: 'Invisibilidade online em um mercado competitivo. Dificuldade para competir com grandes redes e falta de dados para tomar decisões estratégicas.',
    solution: 'Desenvolvemos posicionamento de marca diferenciado, estratégia de conteúdo SEO, campanhas de tráfego pago otimizadas e sistema de analytics completo para decisões data-driven.',
    results: [
      { metric: 'Visibilidade Online', value: '+250%' },
      { metric: 'Agendamentos Online', value: '+120%' },
      { metric: 'Crescimento Faturamento', value: '+45%' },
    ],
  },
  {
    id: 3,
    clinicName: 'Animal Hospital Premium',
    photo: '/images/cases/premium.jpg',
    challenge: 'Sistemas desconectados causando retrabalho. Equipe gastando tempo em gestão manual ao invés de focar no atendimento aos pets.',
    solution: 'Arquitetura digital integrada: site responsivo, sistema de agendamento automático, CRM com histórico completo e automações que reduziram trabalho manual em 70%.',
    results: [
      { metric: 'Eficiência Operacional', value: '+70%' },
      { metric: 'Satisfação Cliente', value: '+85%' },
      { metric: 'Tempo em Gestão', value: '-60%' },
    ],
  },
]

export function CaseStudies() {
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
            Cases de{' '}
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
              Sucesso
            </span>
          </h2>
          <p className="font-body text-light-blue text-lg md:text-xl max-w-3xl mx-auto">
            Veja como transformamos clínicas veterinárias em máquinas de crescimento sustentável
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {caseStudies.map((caseStudy, index) => (
            <motion.div
              key={caseStudy.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                variant="service"
                className="h-full flex flex-col hover:border-primary-blue hover:shadow-[0_0_30px_rgba(0,188,212,0.3)] transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative w-full h-48 md:h-56 mb-4 rounded-lg overflow-hidden bg-dark-blue">
                  <Image
                    src={caseStudy.photo}
                    alt={caseStudy.clinicName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={(e) => {
                      // Fallback para placeholder se imagem não existir
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                  {/* Placeholder se imagem não carregar */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-blue/20 to-primary-blue/10">
                    <Building2 className="w-12 h-12 text-primary-blue/40" />
                  </div>
                </div>

                {/* Clinic Name */}
                <h3 className="font-heading font-bold text-primary-blue text-xl mb-4">
                  {caseStudy.clinicName}
                </h3>

                {/* Challenge */}
                <div className="mb-4 flex-1">
                  <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-2 bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
                    Desafio
                  </h4>
                  <p className="font-body text-light-blue/80 text-sm leading-relaxed">
                    {caseStudy.challenge}
                  </p>
                </div>

                {/* Solution */}
                <div className="mb-4 flex-1">
                  <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-2 bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
                    Solução
                  </h4>
                  <p className="font-body text-light-blue/80 text-sm leading-relaxed">
                    {caseStudy.solution}
                  </p>
                </div>

                {/* Results */}
                <div className="mt-auto pt-4 border-t border-primary-blue/20">
                  <h4 className="font-heading font-semibold text-primary-blue text-sm uppercase tracking-wider mb-3">
                    Resultados
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {caseStudy.results.map((result, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-primary-blue/10 rounded-lg px-3 py-2"
                      >
                        <span className="font-body text-light-blue/80 text-sm">
                          {result.metric}
                        </span>
                        <span className="font-heading font-bold text-sm bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
                          {result.value}
                        </span>
                      </div>
                    ))}
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


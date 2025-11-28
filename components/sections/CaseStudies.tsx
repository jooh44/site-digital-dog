'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

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
    clinicName: 'Aumivet',
    photo: '/images/portfolio/aumivet.webp',
    challenge: 'Problemas graves de indexação e posicionamento local. O Google sugeria concorrentes ao buscar pela marca, zerando o alcance orgânico.',
    solution: 'Auditoria SEO técnica, desenvolvimento de site institucional multi-páginas com blog de conteúdo e reposicionamento total de marca nas redes sociais.',
    results: [
      { metric: 'Busca Orgânica', value: '1ª Posição' },
      { metric: 'Agendamentos', value: '+110%' },
      { metric: 'Cirurgias', value: 'Referência' },
    ],
  },
  {
    id: 2,
    clinicName: 'Morgan & Ted',
    photo: '/images/portfolio/morgan-e-ted.webp',
    challenge: 'Negócio recém-aberto em mercado saturado (São José dos Pinhais). Baixa visibilidade digital dificultava a atração de novos tutores.',
    solution: 'Estratégia de SEO Local agressiva, otimização do Google Meu Negócio e site focado em captura para dominar as buscas na região.',
    results: [
      { metric: 'Google SJP', value: 'Top 1' },
      { metric: 'Agendamentos', value: '+150%' },
      { metric: 'Novos Tutores', value: 'Diários' },
    ],
  },
  {
    id: 3,
    clinicName: 'RZ VET',
    photo: '/images/portfolio/rz-vet.webp',
    challenge: 'E-commerce com faturamento estagnado, problemas de usabilidade (UX) e campanhas de anúncios que não traziam retorno real (ROI).',
    solution: 'Redesign completo focado em UX/UI, gestão de tráfego de alta performance (+R$ 1 mi gerenciados) e otimização de conversão.',
    results: [
      { metric: 'ROAS Máximo', value: '40x' },
      { metric: 'Faturamento', value: '+100k/mês' },
      { metric: 'Crescimento', value: '30% a.a.' },
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
            Alguns Cases de{' '}
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
              Sucesso
            </span>
          </h2>
          <p className="font-body text-light-blue text-lg md:text-xl max-w-3xl mx-auto">
            Veja como transformamos negócios pet em máquinas de crescimento sustentável
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
                  <ImageWithFallback
                    src={caseStudy.photo}
                    alt={caseStudy.clinicName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={85}
                    fallbackText={caseStudy.clinicName}
                    showPlaceholder={true}
                  />
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
                  <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-3 bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
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


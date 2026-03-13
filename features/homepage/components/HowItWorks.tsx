'use client'

import React from 'react'
import { Badge } from '@/features/shared/ui/Badge'

const stages = [
  {
    id: 1,
    number: '01',
    title: 'Briefing Expresso',
    timeframe: 'Dia 1',
    description: 'Uma reunião rápida para entender sua necessidade e coletar seus materiais. Sem burocracia, focado em agir rápido.',
  },
  {
    id: 2,
    number: '02',
    title: 'Desenvolvimento Ágil',
    timeframe: 'Dias 2-6',
    description: 'Nossa equipe constrói sua estrutura usando tecnologias modernas (Next.js, Tailwind). Design premium e performance garantida.',
  },
  {
    id: 3,
    number: '03',
    title: 'Entrega e Treinamento',
    timeframe: 'Dia 7',
    description: 'Seu site no ar. Nós te ensinamos a atualizar o básico e você já pode começar a rodar anúncios imediatamente.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 md:py-24 px-4 bg-darker-blue">
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
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="outline" pulse className="mb-4">
            Como Funciona
          </Badge>
          <h2 className="font-heading font-bold text-primary-blue mb-4" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
            Seu Novo Site em{' '}
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
              3 Passos Simples
            </span>
          </h2>
          <div className="inline-block px-4 py-2 mt-2 rounded-full bg-primary-blue/10 border border-primary-blue/20">
            <span className="font-heading font-bold text-[#ff6b35] uppercase tracking-wide text-sm md:text-base">
              🚀 Projetos entregues a partir de 7 dias
            </span>
          </div>
        </div>

        {/* Timeline - Desktop: Centralizada com layout [número] | [timeline] | [textos] */}
        <div className="relative">
          {/* Desktop Layout - Grid 3 colunas: [número] | [timeline] | [textos] */}
          <div className="hidden lg:flex lg:justify-center">
            <div className="grid lg:grid-cols-[auto_auto_500px] lg:gap-8 lg:max-w-5xl">
              {/* Coluna de números à esquerda */}
              <div className="space-y-24 lg:space-y-28">
                {stages.map((stage) => (
                  <div key={`num-${stage.id}`} className="text-right flex items-start justify-end min-h-[120px]">
                    <span className="text-4xl lg:text-5xl font-bold font-mono leading-none bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
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

                  {/* Linha preenchida (estática) */}
                  <div
                    className="absolute top-0 left-0 right-0 w-0.5 h-full bg-gradient-to-b from-primary-blue via-primary-blue to-primary-blue"
                    style={{
                      boxShadow: '0 0 10px rgba(0, 188, 212, 0.5), 0 0 20px rgba(0, 188, 212, 0.3)'
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-blue to-transparent opacity-60 blur-sm"
                    />
                  </div>

                  {/* Círculos na linha - alinhados com os títulos */}
                  <div className="space-y-24 lg:space-y-28">
                    {stages.map((stage) => (
                      <div key={`dot-container-${stage.id}`} className="relative flex items-start justify-center pt-[52px] min-h-[120px]">
                        <div className="relative z-10 -translate-x-[1px]">
                          <div
                            className="w-6 h-6 rounded-full bg-primary-blue"
                            style={{}}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coluna de conteúdo - largura limitada */}
              <div className="space-y-24 lg:space-y-28">
                {stages.map((stage) => (
                  <div
                    key={stage.id}
                    className="flex items-start min-h-[120px]"
                  >
                    <div className="w-full">
                      <h3 className="font-heading font-semibold text-primary-blue text-2xl mb-3">
                        {stage.title}
                      </h3>
                      <p className="font-body text-light-blue/80 text-base leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>
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

              {/* Linha preenchida (estática) */}
              <div
                className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-primary-blue via-primary-blue to-primary-blue"
                style={{}}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-blue to-transparent opacity-60 blur-sm"
                />
              </div>

              {/* Stages List */}
              <div className="space-y-16 md:space-y-20 pl-8 md:pl-10">
                {stages.map((stage) => (
                  <div
                    key={stage.id}
                    className="relative"
                  >
                    {/* Círculo da timeline - centralizado na linha vertical */}
                    <div className="absolute -left-8 md:-left-10 top-[38px] md:top-[42px] z-10 overflow-visible" style={{ width: '32px', height: '24px', marginLeft: '-12px' }}>
                      <div
                        className="w-6 h-6 rounded-full bg-primary-blue absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{}}
                      />
                    </div>

                    {/* Stage Content */}
                    <div className="flex-1">
                      {/* Número */}
                      <div className="mb-2">
                        <span className="text-2xl md:text-3xl font-bold font-mono bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
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
                    </div>
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

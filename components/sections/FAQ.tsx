'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Accordion } from '@/components/ui/Accordion'
import { Card } from '@/components/ui/Card'

interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'O que é Arquitetura Digital?',
    answer: 'Arquitetura Digital é um ecossistema completo que integra 4 pilares fundamentais: Arquitetura de Marca (posicionamento estratégico), Arquitetura Digital (sistemas integrados), Estrutura Comercial (funil de conversão) e Inteligência de Dados (métricas e decisões data-driven). Não é apenas marketing ou tecnologia isolada - é a transformação sistêmica da sua clínica veterinária.',
  },
  {
    id: '2',
    question: 'Quanto tempo leva para ver resultados?',
    answer: 'Os primeiros resultados começam a aparecer já no primeiro mês com a implementação da fundação (site, sistemas básicos). No mês 3-4, com a construção completa e lançamento, você verá aumento significativo em leads e agendamentos. A otimização contínua (mês 6+) garante crescimento sustentável e escalável.',
  },
  {
    id: '3',
    question: 'Preciso ter conhecimento técnico para usar?',
    answer: 'Não! Nossa arquitetura digital é pensada para funcionar enquanto você cuida dos pets. Tudo é automatizado e integrado. Você recebe relatórios simples e claros, e nossa equipe oferece suporte contínuo para qualquer dúvida. Focamos em resultados, não em complexidade técnica.',
  },
  {
    id: '4',
    question: 'Como funciona o diagnóstico gratuito?',
    answer: 'O diagnóstico é uma reunião estratégica onde analisamos sua clínica, entendemos seus desafios e objetivos, e apresentamos um blueprint personalizado de transformação digital. É 100% gratuito, sem compromisso, e você leva um plano completo mesmo se não contratar nossos serviços.',
  },
  {
    id: '5',
    question: 'Qual a diferença entre Digital Dog e uma agência tradicional?',
    answer: 'Agências focam apenas em marketing tático (anúncios, redes sociais). A Digital Dog oferece arquitetura digital completa: marca + tecnologia + marketing + dados integrados. Não vendemos projetos pontuais - construímos um ecossistema que cresce com sua clínica.',
  },
  {
    id: '6',
    question: 'E se eu já tenho um site ou sistema?',
    answer: 'Perfeito! Avaliamos o que você já tem e integramos na arquitetura digital. Não descartamos investimentos anteriores - otimizamos e conectamos tudo em um ecossistema unificado. Muitas vezes conseguimos aproveitar 70-80% do que já existe.',
  },
  {
    id: '7',
    question: 'Quanto custa a Arquitetura Digital?',
    answer: 'O investimento varia conforme o tamanho e necessidades da sua clínica. Após o diagnóstico gratuito, apresentamos uma proposta personalizada e transparente. Trabalhamos com modelos flexíveis que se adaptam ao seu faturamento e crescimento. Agende seu diagnóstico para receber uma proposta específica.',
  },
  {
    id: '8',
    question: 'Vocês trabalham apenas com clínicas veterinárias?',
    answer: 'Sim! Somos especialistas exclusivamente no setor veterinário. Isso significa que entendemos profundamente suas dores, desafios e oportunidades. Nossa experiência com dezenas de clínicas nos permite entregar soluções que realmente funcionam para o seu mercado.',
  },
  {
    id: '9',
    question: 'Como é o suporte após a implementação?',
    answer: 'Oferecemos suporte contínuo mensal que inclui: monitoramento de métricas, otimizações, atualizações, relatórios de performance e suporte técnico. Você não fica sozinho após o lançamento - acompanhamos e otimizamos continuamente para garantir crescimento sustentável.',
  },
  {
    id: '10',
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim, não trabalhamos com fidelidade forçada. Acreditamos que nosso trabalho deve falar por si só. Você pode cancelar quando quiser, mas nossa experiência mostra que clientes que seguem o processo completo veem resultados exponenciais e optam por continuar.',
  },
]

// Schema markup para SEO
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export function FAQ() {
  return (
    <>
      {/* Schema markup JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
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

        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-heading font-bold text-primary-blue text-3xl md:text-4xl lg:text-5xl mb-4">
              Perguntas{' '}
              <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
                Frequentes
              </span>
            </h2>
            <p className="font-body text-light-blue text-lg md:text-xl max-w-3xl mx-auto">
              Tire suas dúvidas sobre Arquitetura Digital para clínicas veterinárias
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="service" className="p-6 md:p-8">
              <Accordion items={faqItems} />
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  )
}


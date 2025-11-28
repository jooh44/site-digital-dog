'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { AnimatedGradient } from '@/components/ui/AnimatedGradient'

const featurePills = [
  'Ecosistema Digital'
]

export function Hero() {
  return (
    <section id="home" className="relative min-h-[95vh] flex items-center justify-center px-4 pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
      {/* Background base escuro */}
      <div className="absolute inset-0 bg-darker-blue" />
      
      {/* Gradiente animado estilo Framer - profissional */}
      <AnimatedGradient />
      
      <div className="relative max-w-6xl mx-auto w-full z-10">
        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8 md:mb-12"
        >
          {featurePills.map((pill, index) => (
            <motion.span
              key={pill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              className="px-4 py-2 rounded-full border border-primary-blue/30 bg-primary-blue/5 text-light-blue text-sm md:text-base font-medium backdrop-blur-sm"
            >
              {pill}
            </motion.span>
          ))}
        </motion.div>

        {/* H1 Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center font-heading font-bold text-primary-blue mb-6 md:mb-8 relative"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            lineHeight: '1.1',
          }}
        >
          {/* Efeito de brilho de fundo */}
          <div className="absolute inset-0 blur-3xl bg-primary-blue/10 rounded-full -z-10 transform scale-150 opacity-50" />
          
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
              Arquitetura Digital
            </span>
          </span>{' '}
          <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
            Completa
          </span>{' '}
          <span className="text-light-blue drop-shadow-lg">
            para Medicina Veterinária
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center font-body text-light-blue/90 text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-10 md:mb-12 relative"
          style={{
            lineHeight: '1.6',
          }}
        >
          Não é só marketing. Não é apenas tecnologia. É o <span className="text-primary-blue font-semibold">ecossistema completo</span> que transforma sua clínica em uma máquina de crescimento sustentável, enquanto você cuida do que realmente importa: os pets.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
        >
          <a 
            href="https://api.whatsapp.com/send?phone=5547988109155&text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20gratuito%20para%20minha%20cl%C3%ADnica%20veterin%C3%A1ria." 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="primary"
              className="w-full sm:w-auto min-h-[48px] px-6 md:px-8 py-4 md:py-6 text-base md:text-lg"
            >
              Quero um Diagnóstico Gratuito
            </Button>
          </a>
          <a href="#arquitetura" className="w-full sm:w-auto" onClick={(e) => {
             e.preventDefault();
             document.getElementById('arquitetura')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <Button
              variant="secondary"
              className="w-full sm:w-auto min-h-[48px] px-6 md:px-8 py-4 md:py-6 text-base md:text-lg"
            >
              Entenda Arquitetura Digital
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}


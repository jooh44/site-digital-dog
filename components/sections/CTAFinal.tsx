'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

// Analytics helper - will be expanded in Story 2.6
function trackCTAClick() {
  // GA4 tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', 'cta_click', {
      event_category: 'engagement',
      event_label: 'final_cta',
      location: 'homepage_final'
    })
  }
  
  // Meta Pixel tracking (optional)
  if (typeof window !== 'undefined' && (window as any).fbq) {
    ;(window as any).fbq('track', 'Lead', {
      content_name: 'Final CTA - Agendar Diagnóstico Gratuito'
    })
  }
}

export function CTAFinal() {
  return (
    <section id="diagnostico" className="relative py-20 md:py-28 px-4 bg-darker-blue">
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

      <div className="relative max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Headline */}
          <h2 className="font-heading font-bold text-primary-blue mb-6 md:mb-8" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
            Pronto para{' '}
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
              Transformar
            </span>{' '}
            Sua Clínica?
          </h2>
          
          {/* Subtitle */}
          <p className="font-body text-light-blue text-lg md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto">
            Agende seu diagnóstico gratuito e descubra como podemos transformar sua clínica em uma máquina de crescimento sustentável.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a 
              href="https://api.whatsapp.com/send?phone=5547988109155&text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20gratuito%20para%20minha%20cl%C3%ADnica%20veterin%C3%A1ria."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick()}
              className="inline-block"
              aria-label="Agendar Diagnóstico Gratuito - Falar no WhatsApp"
            >
              <Button
                variant="primary"
                className="min-h-[56px] px-8 md:px-12 py-4 md:py-6 text-base md:text-lg font-semibold shadow-2xl hover:shadow-[0_0_30px_rgba(255,107,53,0.6)]"
              >
                Agendar Diagnóstico Gratuito
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}


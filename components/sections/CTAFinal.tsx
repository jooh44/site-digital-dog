'use client'

import React from 'react'
import Link from 'next/link'
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
    <section className="relative py-20 md:py-28 px-4 bg-darker-blue">
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
            Pronto para Transformar Sua Clínica?
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
            <Link 
              href="/diagnostico" 
              onClick={trackCTAClick}
              className="inline-block"
              aria-label="Agendar Diagnóstico Gratuito - Ir para página de diagnóstico"
            >
              <Button
                variant="primary"
                className="min-h-[56px] px-8 md:px-12 py-4 md:py-6 text-base md:text-lg font-semibold shadow-2xl hover:shadow-[0_0_30px_rgba(255,107,53,0.6)]"
              >
                Agendar Diagnóstico Gratuito
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}


'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Monitor, Code, Globe, Zap } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'

interface PortfolioItem {
  id: number
  name: string
  description: string
  image: string
  url?: string
  category: string
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    name: 'Clínica Veterinária PetCare',
    description: 'Site completo com sistema de agendamento integrado e área do cliente',
    image: '/images/portfolio/petcare.jpg',
    url: 'https://petcare.example.com',
    category: 'Veterinária',
  },
  {
    id: 2,
    name: 'Vet & Cia',
    description: 'E-commerce para produtos veterinários com integração de pagamento',
    image: '/images/portfolio/vetecia.jpg',
    url: 'https://vetecia.example.com',
    category: 'E-commerce',
  },
  {
    id: 3,
    name: 'Animal Hospital Premium',
    description: 'Portal institucional com blog e sistema de newsletter',
    image: '/images/portfolio/premium.jpg',
    url: 'https://premium.example.com',
    category: 'Institucional',
  },
  {
    id: 4,
    name: 'Vet Center',
    description: 'Plataforma completa com CRM integrado e dashboard de métricas',
    image: '/images/portfolio/vetcenter.jpg',
    url: 'https://vetcenter.example.com',
    category: 'Plataforma',
  },
  {
    id: 5,
    name: 'Clínica Animal Care',
    description: 'Site responsivo com foco em conversão e agendamento online',
    image: '/images/portfolio/animalcare.jpg',
    url: 'https://animalcare.example.com',
    category: 'Veterinária',
  },
]

const placeholderIcons = [Monitor, Code, Globe, Zap, Monitor]

export function PortfolioSection() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"])
  const smoothX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <>
      {/* Desktop View - Horizontal Scroll Parallax */}
      <section id="portfolio" ref={targetRef} className="relative hidden lg:block h-[300vh] bg-darker-blue">
         {/* Linha divisória */}
        <div className="absolute top-0 left-0 right-0 h-px overflow-hidden z-20">
          <div
            className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-primary-blue to-transparent opacity-60 blur-sm"
            style={{
              boxShadow: '0 0 20px rgba(0, 188, 212, 0.5), 0 0 40px rgba(0, 188, 212, 0.3)',
            }}
          />
          <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-primary-blue to-transparent" />
        </div>

        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          
          <motion.div style={{ x: smoothX }} className="flex gap-12 px-24">
            {/* Intro Card */}
            <div className="relative h-[550px] w-[450px] shrink-0 flex items-center justify-center">
               <div className="text-left space-y-4">
                  <h3 className="text-5xl font-bold text-light-blue leading-tight">
                     Sites e <br />
                     Landing Pages de <br />
                     <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
                        Alta Conversão
                     </span>
                  </h3>
                  <p className="text-light-blue/70 text-lg max-w-xs">
                     Deslize para ver como transformamos clínicas veterinárias.
                  </p>
                  <div className="animate-bounce text-primary-blue mt-8">
                     <ChevronRight size={40} />
                  </div>
               </div>
            </div>

            {portfolioItems.map((item, index) => {
               const PlaceholderIcon = placeholderIcons[index % placeholderIcons.length]
               return (
                  <div key={item.id} className="group relative h-[550px] w-[800px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-dark-blue to-darker-blue border border-primary-blue/20 hover:border-primary-blue/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,188,212,0.2)]">
                    {/* Content Layout */}
                    <div className="grid grid-cols-2 h-full">
                        {/* Image/Icon Area */}
                        <div className="relative h-full bg-black/20 flex items-center justify-center overflow-hidden">
                           <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,188,212,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-50" />
                           
                           {/* Icon with Glow */}
                           <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                              <div className="absolute inset-0 bg-primary-blue/20 blur-[60px] rounded-full" />
                              <PlaceholderIcon className="w-32 h-32 text-primary-blue/80 drop-shadow-[0_0_15px_rgba(0,188,212,0.5)]" />
                           </div>
                        </div>

                        {/* Info Area */}
                        <div className="p-8 flex flex-col justify-center relative">
                           {/* Category Badge */}
                           <div className="absolute top-8 left-8">
                              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                                 {item.category}
                              </span>
                           </div>

                           <div className="space-y-4">
                              <h3 className="text-4xl font-bold text-light-blue font-heading leading-tight group-hover:text-primary-blue transition-colors">
                                 {item.name}
                              </h3>
                              <p className="text-light-blue/70 text-lg leading-relaxed">
                                 {item.description}
                              </p>
                              
                              <div className="pt-4">
                                 {item.url ? (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-blue font-semibold hover:underline decoration-2 underline-offset-4 transition-all">
                                       Ver Projeto <ExternalLink size={16} />
                                    </a>
                                 ) : (
                                    <span className="text-light-blue/40 text-sm flex items-center gap-2">
                                       <Monitor size={14} /> Em breve
                                    </span>
                                 )}
                              </div>
                           </div>
                        </div>
                    </div>
                  </div>
               )
            })}
          </motion.div>
        </div>
      </section>

      {/* Mobile View - Vertical Stack */}
      <section id="portfolio-mobile" className="relative lg:hidden py-16 px-4 bg-darker-blue">
         {/* Linha divisória */}
         <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
            <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-primary-blue to-transparent opacity-60 blur-sm" />
            <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-primary-blue to-transparent" />
         </div>

         <div className="max-w-md mx-auto space-y-12">
            <div className="text-center space-y-4 mb-8">
               <Badge variant="outline" pulse>
                  Portfólio
               </Badge>
               <h2 className="font-heading font-bold text-primary-blue text-3xl">
                  Sites e Landing Pages de <br />
                  <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
                     Alta Conversão
                  </span>
               </h2>
            </div>

            {portfolioItems.map((item, index) => {
               const PlaceholderIcon = placeholderIcons[index % placeholderIcons.length]
               return (
                  <motion.div
                     key={item.id}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-50px" }}
                     transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                     <div className="bg-dark-blue rounded-2xl overflow-hidden border border-primary-blue/10 shadow-lg">
                        <div className="relative h-48 bg-black/20 flex items-center justify-center">
                           <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,188,212,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-50" />
                           <PlaceholderIcon className="w-16 h-16 text-primary-blue/80" />
                           <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                                 {item.category}
                              </span>
                           </div>
                        </div>
                        <div className="p-6 space-y-3">
                           <h3 className="text-xl font-bold text-light-blue font-heading">
                              {item.name}
                           </h3>
                           <p className="text-light-blue/70 text-sm leading-relaxed">
                              {item.description}
                           </p>
                           <div className="pt-2">
                              {item.url ? (
                                 <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-blue text-sm font-semibold">
                                    Ver Projeto <ExternalLink size={14} />
                                 </a>
                              ) : (
                                 <span className="text-light-blue/40 text-xs flex items-center gap-2">
                                    <Monitor size={12} /> Em breve
                                 </span>
                              )}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )
            })}
         </div>
      </section>
    </>
  )
}

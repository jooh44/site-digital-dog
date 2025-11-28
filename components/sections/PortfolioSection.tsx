'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

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
    name: 'Aumivet',
    description: 'Site institucional multi-páginas com blog de conteúdo e reposicionamento total de marca. Resultado: 1ª posição no Google e +110% em agendamentos.',
    image: '/images/portfolio/aumivet-print.webp',
    category: 'Veterinária',
  },
  {
    id: 2,
    name: 'Morgan & Ted',
    description: 'Estratégia de SEO Local agressiva com site focado em captura. Resultado: Top 1 no Google SJP e +150% em agendamentos.',
    image: '/images/portfolio/morgan-e-ted-print.webp',
    category: 'Veterinária',
  },
  {
    id: 3,
    name: 'RZ VET',
    description: 'Redesign completo focado em UX/UI e gestão de tráfego de alta performance. Resultado: ROAS máximo de 40x e +100k/mês em faturamento.',
    image: '/images/portfolio/rzvet-print.webp',
    category: 'E-commerce',
  },
  {
    id: 4,
    name: 'Mundo Bicho',
    description: 'Plataforma completa com foco em conversão e experiência do usuário otimizada para o mercado pet.',
    image: '/images/portfolio/mundo-bicho.webp',
    category: 'Plataforma',
  },
  {
    id: 5,
    name: 'Vet em Casa',
    description: 'Site responsivo com sistema de agendamento online e área do cliente integrada para atendimento domiciliar.',
    image: '/images/portfolio/vet-em-casa.webp',
    category: 'Veterinária',
  },
]


export function PortfolioSection() {
  const targetRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ width: 0, viewport: 0 })

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  })

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDims({
          width: containerRef.current.scrollWidth,
          viewport: window.innerWidth
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scrollRange = dims.width - dims.viewport
  const targetX = scrollRange > 0 ? -scrollRange : 0

  const x = useTransform(scrollYProgress, [0, 1], ["0px", `${targetX}px`])
  const smoothX = useSpring(x, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <>
      {/* Desktop View - Horizontal Scroll Parallax */}
      <section id="portfolio" ref={targetRef} className="relative hidden lg:block h-[600vh] bg-darker-blue">
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
          
          <motion.div ref={containerRef} style={{ x: smoothX }} className="flex gap-12 pl-24 pr-24">
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
                     Scroll para ver como transformamos negócios Pet
                  </p>
                  <div className="animate-bounce text-primary-blue mt-8">
                     <ChevronRight size={40} />
                  </div>
               </div>
            </div>

            {portfolioItems.map((item, index) => {
               return (
                  <div key={item.id} className="group relative shrink-0 overflow-hidden rounded-2xl bg-white border border-primary-blue/20 hover:border-primary-blue/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,188,212,0.2)] inline-block">
                     <ImageWithFallback
                        src={item.image}
                        alt={`Screenshot do site ${item.name}`}
                        width={1920}
                        height={1080}
                        className="h-[550px] w-auto group-hover:scale-[1.02] transition-transform duration-500"
                        quality={85}
                        priority={index < 2}
                        fallbackText={`Screenshot ${item.name}`}
                        showPlaceholder={true}
                     />
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
               return (
                  <motion.div
                     key={item.id}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-50px" }}
                     transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                     <div className="bg-white rounded-2xl overflow-hidden border border-primary-blue/10 shadow-lg">
                        <div className="relative w-full overflow-hidden">
                           <ImageWithFallback
                              src={item.image}
                              alt={`Screenshot do site ${item.name}`}
                              width={0}
                              height={0}
                              sizes="100vw"
                              className="w-full h-auto"
                              quality={85}
                              fallbackText={`Screenshot ${item.name}`}
                              showPlaceholder={true}
                           />
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

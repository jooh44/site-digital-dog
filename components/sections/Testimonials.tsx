'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'

interface Testimonial {
  id: number
  quote: string
  photo: string
  name: string
  clinic: string
  rating: number // 1-5
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: 'A Digital Dog transformou completamente nossa presença digital. Em 6 meses, aumentamos nossos agendamentos em 120% e finalmente temos visibilidade real no mercado. O melhor investimento que fizemos.',
    photo: '/images/testimonials/dra-fernanda.jpg',
    name: 'Dra. Fernanda Silva',
    clinic: 'Clínica Veterinária PetCare',
    rating: 5,
  },
  {
    id: 2,
    quote: 'Antes trabalhávamos com sistemas desconectados e perdíamos muito tempo. Agora tudo está integrado e automatizado. Conseguimos focar no que realmente importa: cuidar dos pets.',
    photo: '/images/testimonials/dr-carlos.jpg',
    name: 'Dr. Carlos Mendes',
    clinic: 'Vet & Cia',
    rating: 5,
  },
  {
    id: 3,
    quote: 'A arquitetura digital que a Digital Dog criou para nós foi fundamental. Não é só marketing ou tecnologia isolada - é um ecossistema completo que realmente funciona. ROI de 340% no primeiro ano.',
    photo: '/images/testimonials/dra-patricia.jpg',
    name: 'Dra. Patrícia Alves',
    clinic: 'Animal Hospital Premium',
    rating: 5,
  },
  {
    id: 4,
    quote: 'Finalmente encontramos uma empresa que entende o setor veterinário. A Digital Dog não só entregou resultados, mas nos ensinou a pensar estrategicamente sobre nosso negócio digital.',
    photo: '/images/testimonials/dr-ricardo.jpg',
    name: 'Dr. Ricardo Santos',
    clinic: 'Vet Center',
    rating: 5,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'text-gradient-orange' : 'text-light-blue/30'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials() {
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
            O Que Dizem{' '}
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff1744] to-[#ff6b35] bg-clip-text text-transparent">
              Nossos Clientes
            </span>
          </h2>
          <p className="font-body text-light-blue text-lg md:text-xl max-w-3xl mx-auto">
            Depoimentos reais de veterinários que transformaram suas clínicas com a Digital Dog
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                variant="service"
                className="h-full flex flex-col hover:border-primary-blue hover:shadow-[0_0_30px_rgba(0,188,212,0.3)] transition-all duration-300"
              >
                {/* Quote */}
                <div className="mb-6 flex-1">
                  <svg
                    className="w-8 h-8 text-primary-blue/40 mb-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.433.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.995 3.638-3.995 5.849h3.983v10h-9.984z" />
                  </svg>
                  <p className="font-body text-light-blue/90 text-sm leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-primary-blue/20">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-dark-blue flex-shrink-0">
                    <Image
                      src={testimonial.photo}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    {/* Placeholder se imagem não carregar */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-blue/30 to-primary-blue/20">
                      <span className="text-primary-blue/60 font-heading text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-semibold text-primary-blue text-sm truncate">
                      {testimonial.name}
                    </p>
                    <p className="font-body text-light-blue/70 text-xs truncate">
                      {testimonial.clinic}
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


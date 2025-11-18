'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Arquitetura', href: '/arquitetura-digital' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Diagnóstico', href: '/diagnostico' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-darker-blue/95 backdrop-blur-sm border-b border-primary-blue/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group -m-2 p-0">
            <div className="relative w-32 h-32 md:w-36 md:h-36 m-2 md:m-0.5">
              <Image
                src="/images/logo_digital_dog.png"
                alt="Digital Dog Logo"
                fill
                className="object-contain group-hover:opacity-80 transition-opacity"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-body text-light-blue hover:text-primary-blue transition-colors duration-200 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
            <Link href="/diagnostico">
              <Button variant="primary" className="min-h-[40px] px-6 py-2 text-sm">
                Diagnóstico Gratuito
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-primary-blue hover:text-primary-blue/80 focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-4 space-y-1 border-t border-primary-blue/20">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-3 text-base font-medium text-light-blue hover:text-primary-blue hover:bg-primary-blue/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2">
                  <Link href="/diagnostico" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full min-h-[48px]">
                      Diagnóstico Gratuito
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}


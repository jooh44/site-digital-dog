'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const navigation = {
  quickLinks: [
    { name: 'Home', href: '#home' },
    { name: 'Arquitetura', href: '#arquitetura' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Diagnóstico', href: '#diagnostico' },
  ],
  resources: [
    { name: 'Blog', href: '#' }, // Placeholder
    { name: 'Cases', href: '#portfolio' },
    { name: 'FAQ', href: '#faq' },
  ],
}

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/digitaldog.pet/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/feed/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/digitaldog',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubmitMessage('Obrigado! Você foi inscrito na nossa newsletter.')
        setEmail('')
      } else {
        setSubmitMessage('Erro ao inscrever. Tente novamente.')
      }
    } catch (error) {
      setSubmitMessage('Erro ao inscrever. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-darker-blue border-t border-primary-blue/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Logo + Tagline */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-4 group -m-2 p-0">
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <Image
                  src="/images/logo_digital_dog.png"
                  alt="Digital Dog Logo"
                  fill
                  className="object-contain group-hover:opacity-80 transition-opacity"
                />
              </div>
            </Link>
            <p className="text-sm text-light-blue/80 font-body mt-4">
              Transformando clínicas veterinárias em máquinas de crescimento sustentável.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-heading font-semibold text-primary-blue text-sm uppercase tracking-wider mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              {navigation.quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-light-blue/80 hover:text-primary-blue transition-colors text-sm font-body"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="font-heading font-semibold text-primary-blue text-sm uppercase tracking-wider mb-4">
              Recursos
            </h3>
            <ul className="space-y-3">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-light-blue/80 hover:text-primary-blue transition-colors text-sm font-body"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato + Newsletter */}
          <div>
            <h3 className="font-heading font-semibold text-primary-blue text-sm uppercase tracking-wider mb-4">
              Contato
            </h3>
            <ul className="space-y-3 mb-6">
              <li>
                <a
                  href="mailto:contato@digitaldog.pet"
                  className="text-light-blue/80 hover:text-primary-blue transition-colors text-sm font-body"
                >
                  contato@digitaldog.pet
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5547988109155"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light-blue/80 hover:text-primary-blue transition-colors text-sm font-body"
                >
                  WhatsApp
                </a>
              </li>
              <li className="text-light-blue/80 text-sm font-body">
                São Paulo, SP
              </li>
            </ul>

            {/* Newsletter Signup */}
            <div>
              <h4 className="font-heading font-semibold text-primary-blue text-sm mb-3">
                Newsletter
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-sm"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] text-sm"
                >
                  {isSubmitting ? 'Enviando...' : 'Inscrever'}
                </Button>
                {submitMessage && (
                  <p className="text-xs text-primary-blue font-body">
                    {submitMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="mt-8 pt-8 border-t border-primary-blue/20">
          <div className="flex items-center justify-between flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light-blue/60 hover:text-primary-blue transition-colors"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <p className="text-xs text-light-blue/60 font-body text-center md:text-right">
              © {new Date().getFullYear()} Digital Dog. Todos os direitos reservados.
            </p>
          </div>
        </div>

          {/* Links Legais */}
        <div className="mt-6 pt-6 border-t border-primary-blue/20">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-light-blue/60 font-body">
            <Link href="#" className="hover:text-primary-blue transition-colors cursor-not-allowed opacity-50">
              Política de Privacidade
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-primary-blue transition-colors cursor-not-allowed opacity-50">
              Termos de Uso
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-primary-blue transition-colors cursor-not-allowed opacity-50">
              LGPD
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


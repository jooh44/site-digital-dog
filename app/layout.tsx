import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Header } from '@/features/layout/components/Header'
import { Footer } from '@/features/layout/components/Footer'
import { WhatsAppFloat } from '@/features/shared/ui/WhatsAppFloat'
import { ConsentProvider } from '@/features/shared/providers/ConsentProvider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
})

const BASE_URL = 'https://digitaldog.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Digital Dog | Arquitetura Digital',
    template: '%s | Digital Dog',
  },
  description: 'Arquitetura Digital completa para PMEs brasileiras — marca, tecnologia e presença digital num único ecossistema com um único ponto de inteligência.',
  keywords: ['arquitetura digital', 'marketing digital', 'branding', 'SEO', 'automações', 'PME'],
  authors: [{ name: 'Digital Dog', url: BASE_URL }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Digital Dog',
    title: 'Digital Dog | Arquitetura Digital',
    description: 'Arquitetura Digital completa para PMEs — marca, tecnologia e presença num único ecossistema.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Digital Dog | Arquitetura Digital' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Dog | Arquitetura Digital',
    description: 'Arquitetura Digital completa para PMEs — marca, tecnologia e presença num único ecossistema.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body">
        <ConsentProvider>
          {/* MetaPixel e GA4Provider serão adicionados condicionalmente no Epic 4 */}
          {/* Exemplo: {hasConsent && <MetaPixel />} */}
          <Header />
          {children}
          <Footer />
          <WhatsAppFloat />
        </ConsentProvider>
      </body>
    </html>
  )
}

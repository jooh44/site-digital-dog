import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat'
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

export const metadata: Metadata = {
  title: 'Digital Dog - Arquitetura Digital para Medicina Veterinária',
  description: 'Transforme sua clínica veterinária em uma máquina de crescimento sustentável',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body">
        <CustomCursor />
        <Header />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  )
}


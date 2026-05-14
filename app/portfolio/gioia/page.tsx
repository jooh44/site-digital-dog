import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import { GioiaCasePage } from '@/features/cases/components/GioiaCasePage'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Case Gioia',
  description:
    'Case da Gioia na Digital Dog: rebrand juridico, site institucional e lancamento coordenado da nova marca num unico sistema de presenca.',
  alternates: {
    canonical: '/portfolio/gioia',
  },
  openGraph: {
    title: 'Case Gioia | Digital Dog',
    description:
      'Arquitetura de marca para a Gioia: identidade visual, site institucional e lancamento coordenado da nova fase da marca.',
    url: 'https://digitaldog.com.br/portfolio/gioia',
    type: 'article',
    images: [
      {
        url: '/images/cases/gioia/mockup-pasta.jpg',
        width: 1920,
        height: 1080,
        alt: 'Case Gioia na Digital Dog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Gioia | Digital Dog',
    description:
      'Rebrand juridico, site institucional e lancamento coordenado da nova marca da Gioia em uma pagina editorial.',
    images: ['/images/cases/gioia/mockup-pasta.jpg'],
  },
}

export default function GioiaPortfolioPage() {
  return <GioiaCasePage serifClassName={playfairDisplay.className} />
}

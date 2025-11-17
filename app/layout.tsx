import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}


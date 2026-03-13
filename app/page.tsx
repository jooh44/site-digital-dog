import { Hero } from '@/features/homepage/components/Hero'
import { ServicesEcosystem } from '@/features/homepage/components/ServicesEcosystem'
import { ThreePillars } from '@/features/homepage/components/ThreePillars'
import { PortfolioSection } from '@/features/homepage/components/PortfolioSection'
import { FAQ } from '@/features/homepage/components/FAQ'

export default function Home() {
  return (
    <main className="min-h-screen bg-darker-blue">
      <Hero />
      <ServicesEcosystem />
      <ThreePillars />
      <PortfolioSection />
      <FAQ />
    </main>
  )
}

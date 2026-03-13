import { Hero } from '@/features/homepage/components/Hero'
import { ServicesEcosystem } from '@/features/homepage/components/ServicesEcosystem'
import { ThreePillars } from '@/features/homepage/components/ThreePillars'
import { PortfolioSection } from '@/features/homepage/components/PortfolioSection'
import { FAQ } from '@/features/homepage/components/FAQ'
import { CTAFinal } from '@/features/homepage/components/CTAFinal'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Hero />
      <ServicesEcosystem />
      <ThreePillars />
      <PortfolioSection />
      <FAQ />
      <CTAFinal />
    </main>
  )
}

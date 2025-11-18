import { Hero } from '@/components/sections/Hero'
import { PainPoints } from '@/components/sections/PainPoints'
import { FourPillars } from '@/components/sections/FourPillars'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { CaseStudies } from '@/components/sections/CaseStudies'
import { PortfolioSection } from '@/components/sections/PortfolioSection'
import { Testimonials } from '@/components/sections/Testimonials'
import { ComparisonTable } from '@/components/sections/ComparisonTable'
import { FAQ } from '@/components/sections/FAQ'
import { CTAFinal } from '@/components/sections/CTAFinal'

export default function Home() {
  return (
    <main className="min-h-screen bg-darker-blue">
      <Hero />
      <PainPoints />
      <FourPillars />
      <HowItWorks />
      <CaseStudies />
      <PortfolioSection />
      <Testimonials />
      <ComparisonTable />
      <FAQ />
      <CTAFinal />
    </main>
  )
}


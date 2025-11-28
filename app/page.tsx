import { Hero } from '@/components/sections/Hero'
import { FourPillars } from '@/components/sections/FourPillars'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { CaseStudies } from '@/components/sections/CaseStudies'
import { PortfolioSection } from '@/components/sections/PortfolioSection'
import { Testimonials } from '@/components/sections/Testimonials'
import { FAQ } from '@/components/sections/FAQ'
import { CTAFinal } from '@/components/sections/CTAFinal'

export default function Home() {
  return (
    <main className="min-h-screen bg-darker-blue">
      <Hero />
      <FourPillars />
      <HowItWorks />
      <CaseStudies />
      <PortfolioSection />
      <Testimonials />
      <FAQ />
      <CTAFinal />
    </main>
  )
}


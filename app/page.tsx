import { Hero } from '@/components/sections/Hero'
import { PainPoints } from '@/components/sections/PainPoints'

export default function Home() {
  return (
    <main className="min-h-screen bg-darker-blue">
      <Hero />
      <PainPoints />
    </main>
  )
}


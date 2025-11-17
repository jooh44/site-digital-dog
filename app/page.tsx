import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

export default function Home() {
  return (
    <main className="min-h-screen bg-darker-blue p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading font-bold text-primary-blue">
            Digital Dog
          </h1>
          <p className="text-light-blue text-lg">
            Arquitetura Digital para Medicina Veterinária
          </p>
        </div>

        {/* Design System Test Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold text-primary-blue">
            Design System Components
          </h2>

          {/* Buttons */}
          <Card>
            <h3 className="text-xl font-heading font-semibold text-primary-blue mb-4">
              Buttons
            </h3>
            <div className="flex gap-4 flex-wrap">
              <Button variant="primary">CTA Primário</Button>
              <Button variant="secondary">CTA Secundário</Button>
            </div>
          </Card>

          {/* Input */}
          <Card>
            <h3 className="text-xl font-heading font-semibold text-primary-blue mb-4">
              Input
            </h3>
            <Input 
              label="Nome"
              placeholder="Digite seu nome"
              required
            />
          </Card>

          {/* Badge */}
          <Card>
            <h3 className="text-xl font-heading font-semibold text-primary-blue mb-4">
              Badges
            </h3>
            <div className="flex gap-4 flex-wrap">
              <Badge variant="outline">Outline Badge</Badge>
              <Badge variant="filled">Filled Badge</Badge>
              <Badge variant="outline" pulse>Pulse Badge</Badge>
            </div>
          </Card>

          {/* Service Card */}
          <Card variant="service">
            <h3 className="text-xl font-heading font-semibold text-light-blue mb-2">
              Service Card
            </h3>
            <p className="text-light-blue/80">
              Este é um exemplo de card de serviço com gradiente azul e borda lateral.
            </p>
          </Card>
        </div>
      </div>
    </main>
  )
}


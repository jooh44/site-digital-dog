# Story 3.4: Tela de Sucesso, Fred Animado e WhatsApp Revelado

Status: ready-for-dev

## Story

Como visitante,
quero receber confirmação humanizada após o envio e ter acesso ao WhatsApp da Digital Dog,
para que o pico emocional pós-submit consolide minha confiança e eu tenha um próximo passo claro. (FR16, FR17, FR30)

## Acceptance Criteria

1. Loading exibido no botão durante processamento do submit
2. API HTTP 200: tela de sucesso substitui formulário dentro do modal
3. SVG do Fred exibido inline e animado via GSAP `drawSVG` (stroke animation sequenciada)
4. Copy em primeira pessoa: "Recebi. Vou estudar o seu negócio antes de ligar."
5. WhatsApp revelado como CTA principal após sucesso
6. `prefers-reduced-motion`: Fred aparece estático sem animação drawSVG
7. API HTTP 400/500: mensagem de erro amigável + formulário mantém dados para nova tentativa + botão submit reativado (FR30)
8. Nenhum dado do formulário é perdido em caso de erro

## Tasks / Subtasks

- [ ] Criar `features/diagnostico/components/FredSVG.tsx` (AC: #3)
  - [ ] SVG inline do Fred (placeholder temporário se SVG real não disponível)
  - [ ] `'use client'` — GSAP drawSVG manipula o SVG
  - [ ] Named export: `export function FredSVG()`
  - [ ] Props: `animate: boolean` (false se prefers-reduced-motion)
  - [ ] useRef no SVG + gsap.context() + cleanup
- [ ] Criar `features/diagnostico/components/SuccessScreen.tsx` (AC: #2, #3, #4, #5, #6)
  - [ ] `'use client'` — usa GSAP e variáveis de ambiente
  - [ ] Named export: `export function SuccessScreen()`
  - [ ] Verificar `prefers-reduced-motion` antes de passar `animate` ao FredSVG
  - [ ] Copy humanizada em primeira pessoa
  - [ ] Link WhatsApp com `NEXT_PUBLIC_WHATSAPP_NUMBER` e `NEXT_PUBLIC_WHATSAPP_MESSAGE`
- [ ] Atualizar `DiagnosticoForm.tsx` (orquestrador) (AC: #1, #7, #8)
  - [ ] Estado `isSubmitting: boolean` no botão do Step 4
  - [ ] Submit: chamar `fetch('/api/diagnostico/submit', ...)`
  - [ ] HTTP 200: setar `state.step = 'success'` → exibir SuccessScreen
  - [ ] HTTP 400/500: setar `state.error = mensagem` → manter formulário com dados
  - [ ] Reativar botão submit em caso de erro
  - [ ] Dados preservados no state e no sessionStorage
- [ ] Atualizar Step 4 para exibir estado de loading e erro global (AC: #1, #7)

## Dev Notes

### ⚠️ Fred SVG — Status Pendente

O arquivo `public/fred/fred.svg` **ainda não existe** — pendente fornecimento pelo Johny.

**Por ora:**
1. Criar `FredSVG.tsx` com SVG placeholder (círculo simples com paths para demonstrar drawSVG)
2. A animação drawSVG funcionará assim que o SVG real for fornecido e integrado

```tsx
// FredSVG.tsx temporário com placeholder
function FredSVGPlaceholder() {
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#00bcd4" strokeWidth="2" />
      <text x="50" y="55" textAnchor="middle" fill="#00bcd4" fontSize="12">Fred</text>
    </svg>
  )
}
```

### FredSVG com drawSVG (quando SVG real disponível)

```tsx
// features/diagnostico/components/FredSVG.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

// ⚠️ DrawSVGPlugin é plugin GSAP Club — verificar licença
if (typeof window !== 'undefined') {
  gsap.registerPlugin(DrawSVGPlugin)
}

interface FredSVGProps {
  animate?: boolean
}

export function FredSVG({ animate = true }: FredSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!animate || !svgRef.current) return

    const ctx = gsap.context(() => {
      const paths = svgRef.current!.querySelectorAll('path, circle, line')

      // DrawSVG: animar cada path de 0% → 100%
      gsap.from(paths, {
        drawSVG: '0%',
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.inOut',
      })
    }, svgRef)

    return () => ctx.revert()
  }, [animate])

  return (
    <svg
      ref={svgRef}
      className="w-32 h-32 mx-auto"
      viewBox="0 0 200 200"
      aria-label="Fred, o mascote da Digital Dog"
      role="img"
    >
      {/* SVG paths do Fred serão inseridos aqui quando disponível */}
    </svg>
  )
}
```

**ALTERNATIVA sem DrawSVGPlugin (Club):** Usar `stroke-dasharray + stroke-dashoffset` manualmente (mesma técnica usada nas linhas do HowItWorks):

```tsx
useEffect(() => {
  if (!animate) return
  const ctx = gsap.context(() => {
    const paths = svgRef.current!.querySelectorAll('[data-draw]')
    paths.forEach((path) => {
      const len = (path as SVGPathElement).getTotalLength?.() || 100
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      gsap.to(path, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' })
    })
  }, svgRef)
  return () => ctx.revert()
}, [animate])
```

### SuccessScreen

```tsx
// features/diagnostico/components/SuccessScreen.tsx
'use client'

import { FredSVG } from './FredSVG'

export function SuccessScreen() {
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const whatsappMessage = encodeURIComponent(
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Solicitei o Diagnóstico Digital. Quando podemos conversar?'
  )

  return (
    <div className="text-center py-6">
      <FredSVG animate={!prefersReduced} />

      <h3 className="text-2xl font-bold font-space-grotesk mt-6 mb-3">
        Recebi.
      </h3>
      <p className="text-white/70 leading-relaxed mb-8">
        Vou estudar o seu negócio antes de ligar.
        Enquanto isso, se quiser conversar:
      </p>

      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#25D366]/90 transition-all"
        >
          Continuar pelo WhatsApp →
        </a>
      )}
    </div>
  )
}
```

### Tratamento de Erro no DiagnosticoForm

```tsx
// Dentro do DiagnosticoForm.tsx — handler de submit
const handleFormSubmit = async (data: DiagnosticoData) => {
  setIsSubmitting(true)
  setError(null)

  try {
    const response = await fetch('/api/diagnostico/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (result.success) {
      // Limpar sessionStorage
      clear()
      // Mostrar tela de sucesso
      setStep('success')
    } else {
      setError('Algo deu errado. Tente novamente.')
      // Dados preservados automaticamente — state não foi alterado
    }
  } catch {
    setError('Falha na conexão. Verifique sua internet e tente novamente.')
  } finally {
    setIsSubmitting(false)  // Reativa botão sempre (AC: #7)
  }
}
```

### FR30 — Sem Perda de Dados

Os dados do formulário vivem no `FormState` em memória (e no sessionStorage). Em caso de erro:
- `setError(mensagem)` — exibe erro
- `setIsSubmitting(false)` — reativa botão
- Dados no state permanecem intactos — usuário não perde o que digitou

### Estética do Pico Emocional

A tela de sucesso deve transmitir humanidade, não sistema:
- Tom: primeira pessoa, humanizado, sem jargão
- Visual: Fred animado (não ícone de checkmark genérico)
- CTA WhatsApp: verde, bold, destaque — é o próximo passo natural
- Sem textos de sistema como "Formulário enviado com sucesso" ou "Operação concluída"

### Project Structure Notes

```
features/diagnostico/components/FredSVG.tsx       ← criar (placeholder + animação)
features/diagnostico/components/SuccessScreen.tsx ← criar
features/diagnostico/components/DiagnosticoForm.tsx ← atualizar (lógica de submit + estados)
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.4]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture — FredSVG]
- [Source: _bmad-output/planning-artifacts/architecture.md#Communication Patterns — Loading State]
- [Source: _bmad-output/planning-artifacts/prd.md#FR16, FR17, FR30]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Pós-submit]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

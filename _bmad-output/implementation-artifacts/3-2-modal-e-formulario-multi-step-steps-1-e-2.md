# Story 3.2: Modal e Formulário Multi-Step — Steps 1 e 2

Status: review

## Story

Como visitante,
quero iniciar o preenchimento do formulário de Diagnóstico de forma fluida e sem fricção,
para que o processo seja fácil e eu não abandone antes de completar. (FR12, FR13, FR14)

## Acceptance Criteria

1. Qualquer CTA "Solicitar Diagnóstico" abre modal overlay sobre a homepage (sem navegação de página)
2. Background da página: overlay semi-transparente + blur
3. Step 1: barra de progresso "Step 1 de 4" + cards visuais de segmento (sem digitação obrigatória) + ao selecionar, avança automaticamente para Step 2
4. Step 2: campos "Nome do negócio" e "Desafio atual" (textarea) + máximo 3 campos + progresso "Step 2 de 4" + botão "Voltar" sem perder seleção do Step 1
5. Estado preservado no `sessionStorage` com fallback in-memory (Safari modo privado)
6. Fechar modal (ESC ou clique fora): estado preservado no sessionStorage; foco retorna ao elemento que abriu o modal

## Tasks / Subtasks

- [x] Criar tipos em `features/diagnostico/types/diagnostico.types.ts`
  - [x] `FormStep: 1 | 2 | 3 | 4`
  - [x] `DiagnosticoData` com todos os campos do formulário
  - [x] `FormState` com step, data, isSubmitting, error
- [x] Criar Zod schemas por step
  - [x] `features/diagnostico/schemas/step1.schema.ts` — segmento (string, obrigatório)
  - [x] `features/diagnostico/schemas/step2.schema.ts` — negocio + desafio
- [x] Criar `features/shared/utils/safeSessionStorage.ts`
  - [x] Função `safeSessionStorage()` com try/catch para Safari privado
- [x] Criar `features/diagnostico/hooks/useFormPersistence.ts`
  - [x] Hook para persist/restore do FormState no sessionStorage
  - [x] Chave: `'dd-diagnostico-form'`
  - [x] Fallback in-memory se sessionStorage indisponível
- [x] Criar `features/diagnostico/components/ProgressBar.tsx` (AC: #3, #4)
  - [x] Props: `currentStep: FormStep, totalSteps: 4`
  - [x] Barra visual + texto "Step X de 4"
- [x] Criar `features/diagnostico/components/Step1Negocio.tsx` (AC: #3)
  - [x] `'use client'` — estado de seleção de card
  - [x] Cards de segmento: Veterinária, Advocacia, Consultoria, Saúde, Varejo, Outro
  - [x] Tap target ≥ 44×44px em mobile
  - [x] Ao selecionar, chama `onNext(segmento)` automaticamente
- [x] Criar `features/diagnostico/components/Step2Segmento.tsx` (AC: #4)
  - [x] `'use client'` — React Hook Form + Zod
  - [x] Campos: Nome do negócio (input), Desafio atual (textarea)
  - [x] Botão "Voltar" → `onBack()`
  - [x] Botão "Próximo" → validação Zod → `onNext(data)`
- [x] Criar `features/diagnostico/components/DiagnosticoForm.tsx` (orquestrador)
  - [x] `'use client'` — gerencia FormState + sessionStorage
  - [x] Renderiza Step1 ou Step2 baseado em `state.step`
  - [x] ProgressBar em todos os steps
- [x] Criar modal overlay em `features/diagnostico/components/DiagnosticoModal.tsx` (AC: #1, #2, #6)
  - [x] Abrir/fechar via Context
  - [x] `fixed inset-0 z-[60]` com `bg-black/80 backdrop-blur-sm`
  - [x] ESC fecha modal
  - [x] Clique fora fecha modal
  - [x] Focus move para o panel ao abrir
  - [x] Foco retorna ao triggering element ao fechar
- [x] Conectar CTAs da homepage ao modal
  - [x] Context `DiagnosticoModalContext` em `features/diagnostico/context/`
  - [x] `Hero.tsx` e `CTAFinal.tsx` chamam `openModal()`

## Dev Notes

### Tipos do Formulário

```ts
// features/diagnostico/types/diagnostico.types.ts
export type FormStep = 1 | 2 | 3 | 4

export interface DiagnosticoData {
  segmento: string
  negocio: string
  desafio: string
  nome: string
  email: string
  whatsapp: string
  consentimento: boolean
}

export interface FormState {
  step: FormStep
  data: Partial<DiagnosticoData>
  isSubmitting: boolean
  error: string | null
}
```

### safeSessionStorage

```ts
// features/shared/utils/safeSessionStorage.ts
export function safeSessionStorage(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null  // Safari modo privado bloqueia sessionStorage
  }
}
```

### useFormPersistence Hook

```ts
// features/diagnostico/hooks/useFormPersistence.ts
'use client'  // (ou usar em componente 'use client')

import { safeSessionStorage } from '@/features/shared/utils/safeSessionStorage'

const STORAGE_KEY = 'dd-diagnostico-form'

export function useFormPersistence() {
  const persist = (state: FormState) => {
    const storage = safeSessionStorage()
    if (!storage) return  // fallback: estado só em memória
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Silencioso — quota exceeded ou outros erros
    }
  }

  const restore = (): FormState | null => {
    const storage = safeSessionStorage()
    if (!storage) return null
    try {
      const stored = storage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  const clear = () => {
    const storage = safeSessionStorage()
    storage?.removeItem(STORAGE_KEY)
  }

  return { persist, restore, clear }
}
```

### React Hook Form + Zod — Step 2

```tsx
// features/diagnostico/components/Step2Segmento.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step2Schema, type Step2Data } from '@/features/diagnostico/schemas/step2.schema'
import { cn } from '@/features/shared/utils/cn'

interface Props {
  defaultValues?: Partial<Step2Data>
  onNext: (data: Step2Data) => void
  onBack: () => void
}

export function Step2Segmento({ defaultValues, onNext, onBack }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div>
        <label htmlFor="negocio" className="block text-sm font-medium mb-1">
          Nome do negócio
        </label>
        <input
          id="negocio"
          {...register('negocio')}
          className={cn(
            'w-full px-4 py-3 bg-white/[0.06] border rounded-xl focus:outline-none focus:border-primary-blue transition-colors',
            errors.negocio ? 'border-red-500' : 'border-white/[0.12]'
          )}
          placeholder="Ex: Clínica Saúde Total"
        />
        {errors.negocio && (
          <p className="text-red-400 text-sm mt-1" role="alert">
            {errors.negocio.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="desafio" className="block text-sm font-medium mb-1">
          Qual é o seu maior desafio digital hoje?
        </label>
        <textarea
          id="desafio"
          {...register('desafio')}
          rows={4}
          className={cn(
            'w-full px-4 py-3 bg-white/[0.06] border rounded-xl focus:outline-none focus:border-primary-blue transition-colors resize-none',
            errors.desafio ? 'border-red-500' : 'border-white/[0.12]'
          )}
          placeholder="Descreva livremente..."
        />
        {errors.desafio && (
          <p className="text-red-400 text-sm mt-1" role="alert">
            {errors.desafio.message}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-white/[0.12] rounded-xl text-white/60 hover:text-white transition-colors"
        >
          ← Voltar
        </button>
        <button
          type="submit"
          className="flex-2 py-3 bg-primary-blue text-dark-blue font-semibold rounded-xl hover:bg-primary-blue/90 transition-all"
        >
          Próximo →
        </button>
      </div>
    </form>
  )
}
```

### Modal — Focus Trap e ESC

```tsx
// features/diagnostico/components/DiagnosticoModal.tsx
'use client'

import { useEffect } from 'react'

export function DiagnosticoModal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'  // Impede scroll do fundo

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Formulário de Diagnóstico Digital"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md bg-dark-blue border border-white/[0.08] rounded-2xl p-6 md:p-8">
        {children}
      </div>
    </div>
  )
}
```

### Segmentos do Step 1

```ts
const segmentos = [
  { id: 'veterinaria', label: 'Veterinária', emoji: '🐾' },
  { id: 'advocacia', label: 'Advocacia', emoji: '⚖️' },
  { id: 'saude', label: 'Saúde', emoji: '🏥' },
  { id: 'consultoria', label: 'Consultoria', emoji: '💼' },
  { id: 'varejo', label: 'Varejo', emoji: '🛍️' },
  { id: 'outro', label: 'Outro', emoji: '✦' },
]
```

### Project Structure Notes

```
features/diagnostico/
  types/diagnostico.types.ts           ← criar
  schemas/step1.schema.ts              ← criar
  schemas/step2.schema.ts              ← criar
  hooks/useFormPersistence.ts          ← criar
  components/ProgressBar.tsx           ← criar
  components/Step1Negocio.tsx          ← criar
  components/Step2Segmento.tsx         ← criar
  components/DiagnosticoForm.tsx       ← criar (orquestrador)
  components/DiagnosticoModal.tsx      ← criar

features/shared/utils/safeSessionStorage.ts  ← criar

app/page.tsx (ou layout)  ← conectar CTAs ao openModal
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#Form State Management]
- [Source: _bmad-output/planning-artifacts/architecture.md#Communication Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Formulário Multi-step]
- [Source: _bmad-output/planning-artifacts/prd.md#FR12, FR13, FR14]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Modal via Context (`DiagnosticoModalProvider`) envolve o `<main>` em `app/page.tsx`
- Focus management: salva `document.activeElement` no open, restaura no close via `setTimeout(..., 0)`
- `safeSessionStorage` em `features/shared/utils/` (não em features/diagnostico, pois é utilitário compartilhável)
- Step2 nomeado `Step2Segmento.tsx` conforme story spec
- Steps 3 e 4 mostram placeholder até Story 3-3 ser implementada

### File List

- `features/diagnostico/types/diagnostico.types.ts`
- `features/diagnostico/schemas/step1.schema.ts`
- `features/diagnostico/schemas/step2.schema.ts`
- `features/diagnostico/hooks/useFormPersistence.ts`
- `features/diagnostico/components/ProgressBar.tsx`
- `features/diagnostico/components/Step1Negocio.tsx`
- `features/diagnostico/components/Step2Segmento.tsx`
- `features/diagnostico/components/DiagnosticoForm.tsx`
- `features/diagnostico/components/DiagnosticoModal.tsx`
- `features/diagnostico/context/DiagnosticoModalContext.tsx`
- `features/shared/utils/safeSessionStorage.ts`
- `app/page.tsx`
- `features/homepage/components/Hero.tsx`
- `features/homepage/components/CTAFinal.tsx`

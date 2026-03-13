# Story 3.3: Steps 3 e 4, Validação em Tempo Real e Consentimento LGPD

Status: ready-for-dev

## Story

Como visitante,
quero completar o formulário com validação clara e consentir com a coleta de dados de forma informada,
para que confie no processo e finalize o envio sem dúvidas. (FR15, FR27, FR28, FR29)

## Acceptance Criteria

1. Step 3: campos "Nome completo", "Email", "Telefone/WhatsApp"; progresso "Step 3 de 4"
2. Email: validação em tempo real ao sair do campo (formato válido) (FR15)
3. Telefone: validação em tempo real ao sair do campo (formato BR) (FR15)
4. Step 4: progresso "Step 4 de 4"; campo WhatsApp com contexto; checkbox LGPD explícita (FR28)
5. Texto do consentimento: "Concordo que a Digital Dog use meus dados para contato sobre o Diagnóstico Digital" com link "Política de Privacidade" (FR27); finalidade declarada (FR29)
6. Botão submit: ativo SOMENTE quando todos os campos válidos E consentimento marcado
7. Validação falha: mensagens de erro específicas inline; foco no primeiro campo com erro
8. Teclado: todos os steps, campos e botões acessíveis (Tab/Enter/Space)

## Tasks / Subtasks

- [ ] Criar `features/diagnostico/schemas/step3.schema.ts` (AC: #1, #2, #3)
  - [ ] Campos: nome, email, whatsapp
  - [ ] Validação Zod: email formato, whatsapp formato BR
- [ ] Criar `features/diagnostico/schemas/step4.schema.ts` (AC: #4, #5, #6)
  - [ ] Campo: whatsapp (opcional — pode consolidar no step 3 se decidir simplificar)
  - [ ] Campo: consentimento (`z.literal(true)`)
- [ ] Criar `features/diagnostico/components/Step3Desafio.tsx` (AC: #1, #2, #3, #8)
  - [ ] `'use client'` — React Hook Form + Zod
  - [ ] Campos: nome, email, whatsapp/telefone
  - [ ] Validação `onBlur` para email e telefone
  - [ ] Mensagens de erro inline com `role="alert"`
  - [ ] Botões Voltar e Próximo
- [ ] Criar `features/diagnostico/components/Step4Contato.tsx` (AC: #4, #5, #6, #8)
  - [ ] `'use client'` — React Hook Form + Zod
  - [ ] Campo WhatsApp com label contextual
  - [ ] Checkbox de consentimento LGPD com texto completo e link
  - [ ] Botão submit: `disabled={!isValid}` (RHF formState)
  - [ ] `aria-invalid` nos campos com erro
  - [ ] Mover foco para primeiro campo com erro (AC: #7)
- [ ] Atualizar `DiagnosticoForm.tsx` para incluir Steps 3 e 4

## Dev Notes

### Step3 — Validação onBlur

React Hook Form com modo `'onBlur'` ou `'onChange'` para validação em tempo real:

```tsx
// features/diagnostico/components/Step3Desafio.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step3Schema, type Step3Data } from '@/features/diagnostico/schemas/step3.schema'

export function Step3Desafio({ defaultValues, onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues,
    mode: 'onBlur',  // Valida ao sair do campo — tempo real
  })

  // Mover foco para primeiro campo com erro ao tentar avançar (AC: #7)
  const onError = (errors: FieldErrors<Step3Data>) => {
    const firstError = Object.keys(errors)[0] as keyof Step3Data
    if (firstError) setFocus(firstError)
  }

  return (
    <form onSubmit={handleSubmit(onNext, onError)} className="space-y-4">
      {/* Campo Nome */}
      <FieldGroup
        id="nome"
        label="Seu nome"
        error={errors.nome?.message}
        {...register('nome')}
      />

      {/* Campo Email */}
      <FieldGroup
        id="email"
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Campo WhatsApp */}
      <FieldGroup
        id="whatsapp"
        label="WhatsApp (com DDD)"
        type="tel"
        placeholder="(11) 99999-9999"
        error={errors.whatsapp?.message}
        {...register('whatsapp')}
      />

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack}>← Voltar</button>
        <button type="submit">Próximo →</button>
      </div>
    </form>
  )
}
```

### Step4 — Checkbox de Consentimento LGPD

```tsx
// features/diagnostico/components/Step4Contato.tsx
'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

export function Step4Contato({ onSubmit, onBack, isSubmitting }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step4Schema),
    mode: 'onChange',  // Ativa submit button em tempo real
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Campo WhatsApp (se separado do Step 3) */}

      {/* Checkbox de Consentimento LGPD */}
      <div className="space-y-1">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('consentimento')}
            className="mt-1 min-w-[18px] min-h-[18px] accent-primary-blue"
            aria-invalid={!!errors.consentimento}
            aria-describedby={errors.consentimento ? 'consent-error' : undefined}
          />
          <span className="text-sm text-white/70 leading-relaxed">
            Concordo que a Digital Dog use meus dados para contato sobre o
            Diagnóstico Digital.{' '}
            <Link
              href="/privacidade"
              target="_blank"
              className="text-primary-blue underline hover:text-primary-blue/80"
            >
              Política de Privacidade
            </Link>
          </span>
        </label>
        {errors.consentimento && (
          <p id="consent-error" className="text-red-400 text-xs ml-7" role="alert">
            Consentimento obrigatório para prosseguir
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack} disabled={isSubmitting}>
          ← Voltar
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          aria-disabled={!isValid || isSubmitting}
          className={cn(
            'flex-1 py-3 font-semibold rounded-xl transition-all',
            isValid && !isSubmitting
              ? 'bg-primary-blue text-dark-blue hover:bg-primary-blue/90'
              : 'bg-white/[0.06] text-white/30 cursor-not-allowed'
          )}
        >
          {isSubmitting ? 'Enviando...' : 'Solicitar Diagnóstico'}
        </button>
      </div>
    </form>
  )
}
```

### Declaração de Finalidade (FR29)

O texto do consentimento DEVE incluir a finalidade de forma explícita:

> "Concordo que a **Digital Dog** use meus dados (nome, email, WhatsApp) **exclusivamente para contato** relacionado ao agendamento do **Diagnóstico Digital**."

Não usar linguagem vaga como "para fins de marketing" ou "para contato comercial genérico".

### Máscara de Telefone (Opcional)

Para melhor UX no campo WhatsApp, considerar usar `react-input-mask` ou formatar manualmente:

```tsx
// Sem lib de máscara — validação Zod aceita vários formatos
// O schema aceita: "11999999999", "(11) 99999-9999", "+55 11 99999-9999"
z.string()
  .min(10)
  .max(20)
  .transform(val => val.replace(/\D/g, ''))  // Limpar formatação antes de enviar
```

### Schemas dos Steps

```ts
// step3.schema.ts
export const step3Schema = z.object({
  nome: z.string().min(2, 'Nome muito curto').max(100),
  email: z.string().email('Email inválido'),
  whatsapp: z.string()
    .min(10, 'WhatsApp inválido — inclua o DDD')
    .max(20)
    .transform(val => val.replace(/\D/g, '')),
})

// step4.schema.ts
export const step4Schema = z.object({
  consentimento: z.literal(true, {
    errorMap: () => ({ message: 'Você precisa concordar para prosseguir' })
  }),
})
```

### Acessibilidade — Foco e ARIA

- `aria-invalid={!!errors.campo}` em campos com erro
- `role="alert"` em mensagens de erro (lidas por screen readers imediatamente)
- `setFocus('nomeDoCampo')` do React Hook Form para mover foco programaticamente
- Checkbox com `min-w/h: 18px` para área de toque adequada

### Project Structure Notes

```
features/diagnostico/schemas/step3.schema.ts   ← criar
features/diagnostico/schemas/step4.schema.ts   ← criar
features/diagnostico/components/Step3Desafio.tsx  ← criar
features/diagnostico/components/Step4Contato.tsx  ← criar
features/diagnostico/components/DiagnosticoForm.tsx  ← atualizar para incluir steps 3 e 4
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.3]
- [Source: _bmad-output/planning-artifacts/architecture.md#Form State Management]
- [Source: _bmad-output/planning-artifacts/prd.md#FR15, FR27, FR28, FR29]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

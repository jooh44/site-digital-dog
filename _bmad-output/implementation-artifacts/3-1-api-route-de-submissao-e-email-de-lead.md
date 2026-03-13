# Story 3.1: API Route de Submissão e Email de Lead

Status: ready-for-dev

## Story

Como desenvolvedor,
quero uma API Route segura que processa o submit do formulário e envia email de notificação para Johny,
para que os dados do lead cheguem com segurança e sem exposição de informações sensíveis. (FR18)

## Acceptance Criteria

1. POST válido em `/api/diagnostico/submit`: valida com Zod, envia email via Resend, retorna HTTP 200 com `{ success: true }` — sem PII na resposta
2. Email entregue em até 5 minutos após a requisição (NFR-I3)
3. POST com dados inválidos: HTTP 400 com mensagem de erro genérica; nenhum email enviado
4. Resend falha (timeout, rate limit): HTTP 500 com mensagem genérica; erro logado no servidor (não exposto ao cliente)
5. Nenhum dado do lead fica exposto em logs de resposta HTTP
6. Variáveis de ambiente `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NOTIFICATION_EMAIL` configuradas sem expor ao cliente

## Tasks / Subtasks

- [ ] Criar schema Zod completo para validação do formulário (AC: #1, #3)
  - [ ] Criar `features/diagnostico/schemas/submit.schema.ts`
  - [ ] Campos: segmento, negocio, desafio (texto livre), nome, email, whatsapp, consentimento (boolean true)
  - [ ] Validações: email formato válido, whatsapp formato BR, consentimento obrigatório true
- [ ] Criar service layer de email (AC: #1, #2)
  - [ ] Criar `features/diagnostico/services/submitDiagnostico.ts`
  - [ ] Função `sendLeadEmail(data: DiagnosticoData): Promise<void>`
  - [ ] Usar Resend SDK: `new Resend(process.env.RESEND_API_KEY)`
  - [ ] Template de email com todos os dados do lead
- [ ] Criar API Route `app/api/diagnostico/submit/route.ts` (AC: #1, #3, #4, #5)
  - [ ] Apenas método POST (outras retornam 405)
  - [ ] Parse do body + validação Zod
  - [ ] Chamar service de email
  - [ ] Respostas padronizadas: `{ success: true }` ou `{ success: false, error: string }`
  - [ ] Nunca expor stack trace ou PII na resposta
  - [ ] `console.error` servidor para erros inesperados
- [ ] Verificar que as env vars são server-only (AC: #6)
  - [ ] `RESEND_API_KEY`: nunca com prefixo `NEXT_PUBLIC_`
  - [ ] Criar `.env.example` se não existir

## Dev Notes

### Schema Zod — Submit

```ts
// features/diagnostico/schemas/submit.schema.ts
import { z } from 'zod'

export const submitSchema = z.object({
  segmento: z.string().min(1, 'Selecione um segmento'),
  negocio: z.string().min(2, 'Informe o nome do negócio').max(100),
  desafio: z.string().min(10, 'Descreva brevemente seu desafio').max(1000),
  nome: z.string().min(2, 'Informe seu nome').max(100),
  email: z.string().email('Email inválido'),
  whatsapp: z.string()
    .min(10, 'WhatsApp inválido')
    .max(15)
    .regex(/^[\d\s\(\)\-\+]+$/, 'Formato inválido'),
  consentimento: z.literal(true, {
    errorMap: () => ({ message: 'Consentimento obrigatório' })
  }),
})

export type SubmitData = z.infer<typeof submitSchema>
```

### Service Layer

```ts
// features/diagnostico/services/submitDiagnostico.ts
import { Resend } from 'resend'
import type { SubmitData } from '@/features/diagnostico/schemas/submit.schema'

export async function sendLeadEmail(data: SubmitData): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.NOTIFICATION_EMAIL!,
    subject: `Novo Lead — ${data.negocio} (${data.segmento})`,
    html: `
      <h2>Novo Diagnóstico Digital Solicitado</h2>
      <table>
        <tr><td><strong>Negócio:</strong></td><td>${data.negocio}</td></tr>
        <tr><td><strong>Segmento:</strong></td><td>${data.segmento}</td></tr>
        <tr><td><strong>Nome:</strong></td><td>${data.nome}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
        <tr><td><strong>WhatsApp:</strong></td><td>${data.whatsapp}</td></tr>
        <tr><td><strong>Desafio:</strong></td><td>${data.desafio}</td></tr>
      </table>
    `,
  })
}
```

### API Route — Formato Obrigatório

```ts
// app/api/diagnostico/submit/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { submitSchema } from '@/features/diagnostico/schemas/submit.schema'
import { sendLeadEmail } from '@/features/diagnostico/services/submitDiagnostico'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = submitSchema.parse(body)  // ZodError se inválido

    await sendLeadEmail(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos. Verifique o formulário.' },
        { status: 400 }
      )
    }

    // Log apenas no servidor — NUNCA expõe ao cliente
    console.error('[diagnostico/submit] erro:', error)

    return NextResponse.json(
      { success: false, error: 'Erro interno. Tente novamente em alguns instantes.' },
      { status: 500 }
    )
  }
}

// Rejeitar outros métodos
export async function GET() {
  return NextResponse.json({ error: 'Método não permitido' }, { status: 405 })
}
```

### Segurança — Regras Obrigatórias

```
✅ Zod valida ANTES de qualquer processamento
✅ Resposta de sucesso: apenas { success: true } — sem PII
✅ Resposta de erro: mensagem genérica — sem stack trace
✅ RESEND_API_KEY: server-only (sem NEXT_PUBLIC_)
✅ console.error no servidor para debugging
❌ Nunca retornar dados do lead na resposta HTTP
❌ Nunca expor RESEND_API_KEY
```

### Variáveis de Ambiente

```bash
# .env.local (server-only)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@digitaldog.com.br
NOTIFICATION_EMAIL=johny@digitaldog.com.br
```

⚠️ Criar `.env.example` (sem valores) para documentar as variáveis necessárias.

### Resend — Configuração Necessária Antes do Lançamento

Para garantir entregabilidade (evitar spam):
1. Configurar SPF no DNS do domínio remetente
2. Configurar DKIM (gerado pelo painel Resend)
3. Testar envio antes do lançamento

Free tier: 3.000 emails/mês — suficiente para MVP.

### Project Structure Notes

```
features/diagnostico/schemas/submit.schema.ts        ← criar (schema do submit completo)
features/diagnostico/services/submitDiagnostico.ts   ← criar (service de email)
app/api/diagnostico/submit/route.ts                  ← criar (API Route)
.env.example                                          ← criar/atualizar
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Format Patterns — API Routes]
- [Source: _bmad-output/planning-artifacts/prd.md#FR18, NFR-S2, NFR-I3]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { submitSchema } from '@/features/diagnostico/schemas/submit.schema'
import { sendLeadEmail } from '@/features/diagnostico/services/submitDiagnostico'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = submitSchema.parse(body)

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

export async function GET() {
  return NextResponse.json({ error: 'Método não permitido' }, { status: 405 })
}

import { Resend } from 'resend'
import type { SubmitData } from '@/features/diagnostico/schemas/submit.schema'

export async function sendLeadEmail(data: SubmitData): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
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

  if (error) {
    throw new Error(error.message)
  }
}

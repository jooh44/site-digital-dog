import { Resend } from 'resend'
import type { SubmitData } from '@/features/diagnostico/schemas/submit.schema'

export async function sendLeadEmail(data: SubmitData): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.NOTIFICATION_EMAIL!,
    subject: `Novo Lead — ${data.empresa} · ${data.cidade}`,
    html: `
      <h2>Novo Diagnóstico Digital Solicitado</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        <tr><td><strong>Responsável:</strong></td><td>${data.nome}</td></tr>
        <tr><td><strong>Empresa:</strong></td><td>${data.empresa}</td></tr>
        <tr><td><strong>Tipo de negócio:</strong></td><td>${data.tipoNegocio}</td></tr>
        <tr><td><strong>Cidade:</strong></td><td>${data.cidade}</td></tr>
        <tr><td><strong>WhatsApp:</strong></td><td>${data.whatsapp}</td></tr>
      </table>
    `,
  })

  if (error) {
    throw new Error(error.message)
  }
}

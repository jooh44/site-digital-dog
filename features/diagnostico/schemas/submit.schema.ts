import { z } from 'zod'

export const submitSchema = z.object({
  nome: z.string().min(2, 'Informe seu nome').max(100),
  tipoNegocio: z.string().min(2, 'Descreva o tipo de negócio').max(100),
  empresa: z.string().min(2, 'Informe o nome da empresa').max(100),
  cidade: z.string().min(2, 'Informe a cidade').max(100),
  whatsapp: z
    .string()
    .min(10, 'WhatsApp inválido')
    .max(20)
    .regex(/^[\d\s\(\)\-\+]+$/, 'Formato inválido'),
  consentimento: z.literal(true),
})

export type SubmitData = z.infer<typeof submitSchema>

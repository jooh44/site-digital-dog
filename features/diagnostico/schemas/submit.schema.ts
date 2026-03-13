import { z } from 'zod'

export const submitSchema = z.object({
  segmento: z.string().min(1, 'Selecione um segmento'),
  negocio: z.string().min(2, 'Informe o nome do negócio').max(100),
  desafio: z.string().min(10, 'Descreva brevemente seu desafio').max(1000),
  nome: z.string().min(2, 'Informe seu nome').max(100),
  email: z.string().email('Email inválido'),
  whatsapp: z
    .string()
    .min(10, 'WhatsApp inválido')
    .max(15)
    .regex(/^[\d\s\(\)\-\+]+$/, 'Formato inválido'),
  consentimento: z.literal(true),
})

export type SubmitData = z.infer<typeof submitSchema>

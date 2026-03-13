import { z } from 'zod'

export const step3Schema = z.object({
  nome: z.string().min(2, 'Nome muito curto').max(100),
  email: z.string().email('Email inválido'),
  whatsapp: z
    .string()
    .min(10, 'Inclua o DDD (ex: 47 99999-9999)')
    .max(20, 'Número muito longo')
    .regex(/^[\d\s\(\)\-\+]+$/, 'Use apenas números, espaços e + ( )'),
})

export type Step3Data = z.infer<typeof step3Schema>

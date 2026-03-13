import { z } from 'zod'

export const step2Schema = z.object({
  negocio: z.string().min(2, 'Informe o nome do negócio'),
  desafio: z.string().min(10, 'Descreva brevemente o desafio (mínimo 10 caracteres)'),
})

export type Step2Data = z.infer<typeof step2Schema>

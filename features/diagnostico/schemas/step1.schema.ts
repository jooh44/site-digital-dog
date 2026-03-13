import { z } from 'zod'

export const step1Schema = z.object({
  segmento: z.string().min(1, 'Selecione um segmento'),
})

export type Step1Data = z.infer<typeof step1Schema>

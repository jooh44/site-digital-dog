import { z } from 'zod'

export const step2Schema = z.object({
  whatsapp: z
    .string()
    .min(10, 'Inclua o DDD (ex: 47 99999-9999)')
    .max(20, 'Número muito longo')
    .regex(/^[\d\s\(\)\-\+]+$/, 'Use apenas números, espaços e + ( )'),
  consentimento: z
    .boolean()
    .refine((val) => val === true, { message: 'Você precisa concordar para prosseguir' }),
})

export type Step2Data = z.infer<typeof step2Schema>

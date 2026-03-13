import { z } from 'zod'

export const step4Schema = z.object({
  consentimento: z
    .boolean()
    .refine((val) => val === true, { message: 'Você precisa concordar para prosseguir' }),
})

export type Step4Data = z.infer<typeof step4Schema>

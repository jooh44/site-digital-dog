import { z } from 'zod'

export const step1Schema = z.object({
  nome: z.string().min(2, 'Informe seu nome'),
  tipoNegocio: z.string().min(2, 'Descreva o tipo de negócio'),
  empresa: z.string().min(2, 'Informe o nome da empresa'),
  cidade: z.string().min(2, 'Informe a cidade'),
})

export type Step1Data = z.infer<typeof step1Schema>

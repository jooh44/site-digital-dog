export type FormStep = 1 | 2 | 3 | 4

export interface DiagnosticoData {
  segmento: string
  negocio: string
  desafio: string
  nome: string
  email: string
  whatsapp: string
  consentimento: boolean
}

export interface FormState {
  step: FormStep
  data: Partial<DiagnosticoData>
  isSubmitting: boolean
  error: string | null
}

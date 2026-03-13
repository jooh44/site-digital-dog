export type FormStep = 1 | 2

export interface DiagnosticoData {
  nome: string
  tipoNegocio: string
  empresa: string
  cidade: string
  whatsapp: string
  consentimento: boolean
}

export interface FormState {
  step: FormStep
  data: Partial<DiagnosticoData>
  isSubmitting: boolean
  error: string | null
}

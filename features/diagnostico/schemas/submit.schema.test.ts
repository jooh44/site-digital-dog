import { describe, it, expect } from 'vitest'
import { submitSchema } from './submit.schema'

const validData = {
  nome: 'João Silva',
  tipoNegocio: 'Pet shop',
  empresa: 'Pet Shop Araucária',
  cidade: 'Araucária',
  whatsapp: '(41) 99999-9999',
  consentimento: true as const,
}

describe('submitSchema', () => {
  it('valida dados corretos', () => {
    expect(() => submitSchema.parse(validData)).not.toThrow()
  })

  it('rejeita nome vazio', () => {
    expect(() => submitSchema.parse({ ...validData, nome: 'A' })).toThrow()
  })

  it('rejeita tipoNegocio vazio', () => {
    expect(() => submitSchema.parse({ ...validData, tipoNegocio: 'A' })).toThrow()
  })

  it('rejeita empresa com menos de 2 chars', () => {
    expect(() => submitSchema.parse({ ...validData, empresa: 'A' })).toThrow()
  })

  it('rejeita cidade com menos de 2 chars', () => {
    expect(() => submitSchema.parse({ ...validData, cidade: 'A' })).toThrow()
  })

  it('rejeita whatsapp com menos de 10 chars', () => {
    expect(() => submitSchema.parse({ ...validData, whatsapp: '119999' })).toThrow()
  })

  it('rejeita whatsapp com caracteres inválidos', () => {
    expect(() => submitSchema.parse({ ...validData, whatsapp: 'abc def ghi' })).toThrow()
  })

  it('rejeita consentimento false', () => {
    expect(() => submitSchema.parse({ ...validData, consentimento: false })).toThrow()
  })

  it('rejeita consentimento ausente', () => {
    const { consentimento: _, ...rest } = validData
    expect(() => submitSchema.parse(rest)).toThrow()
  })

  it('retorna tipagem correta no parse', () => {
    const result = submitSchema.parse(validData)
    expect(result.consentimento).toBe(true)
    expect(result.empresa).toBe('Pet Shop Araucária')
  })
})

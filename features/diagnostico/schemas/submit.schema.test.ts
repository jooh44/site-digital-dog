import { describe, it, expect } from 'vitest'
import { submitSchema } from './submit.schema'

const validData = {
  segmento: 'restaurante',
  negocio: 'Pizzaria do João',
  desafio: 'Preciso atrair mais clientes digitalmente com estratégia',
  nome: 'João Silva',
  email: 'joao@exemplo.com',
  whatsapp: '(11) 99999-9999',
  consentimento: true as const,
}

describe('submitSchema', () => {
  it('valida dados corretos', () => {
    expect(() => submitSchema.parse(validData)).not.toThrow()
  })

  it('rejeita segmento vazio', () => {
    expect(() => submitSchema.parse({ ...validData, segmento: '' })).toThrow()
  })

  it('rejeita negocio com menos de 2 chars', () => {
    expect(() => submitSchema.parse({ ...validData, negocio: 'A' })).toThrow()
  })

  it('rejeita negocio com mais de 100 chars', () => {
    expect(() => submitSchema.parse({ ...validData, negocio: 'A'.repeat(101) })).toThrow()
  })

  it('rejeita desafio com menos de 10 chars', () => {
    expect(() => submitSchema.parse({ ...validData, desafio: 'Curto' })).toThrow()
  })

  it('rejeita email inválido', () => {
    expect(() => submitSchema.parse({ ...validData, email: 'nao-e-email' })).toThrow()
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
    expect(result.email).toBe('joao@exemplo.com')
  })
})

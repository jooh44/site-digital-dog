import { describe, expect, it } from 'vitest'
import { resolveLeadOfficeName } from './emailCampaign.ts'

describe('resolveLeadOfficeName', () => {
  it('prefere officeName oficial quando existe', () => {
    expect(resolveLeadOfficeName({
      canonicalName: 'RAMALHO ADVOCACIA SP – SITE PROFISSIONAL DE ADVOGADOS EM ...',
      officeName: 'Ramalho Advocacia SP',
      officialSiteTitle: 'Ramalho Advocacia SP – Site Profissional de Advogados em SP',
    })).toBe('Ramalho Advocacia Sp')
  })

  it('limpa prefixo generico de contato', () => {
    expect(resolveLeadOfficeName({
      canonicalName: 'CONTATO – MINGRONE E BRANDARIZ SOCIEDADE DE ADVOGADOS ...',
      officeName: null,
      officialSiteTitle: null,
    })).toBe('Mingrone E Brandariz Sociedade De Advogados')
  })

  it('limpa sufixo de pagina inicial', () => {
    expect(resolveLeadOfficeName({
      canonicalName: 'DIOGO RICARDO ADVOCACIA: PÁGINA INICIAL',
      officeName: null,
      officialSiteTitle: null,
    })).toBe('Diogo Ricardo Advocacia')
  })

  it('recusa titulos genericos de pagina', () => {
    expect(resolveLeadOfficeName({
      canonicalName: 'FALE CONOSCO',
      officeName: null,
      officialSiteTitle: null,
    })).toBeNull()
    expect(resolveLeadOfficeName({
      canonicalName: 'ESCRITÓRIO DE ADVOCACIA EMPRESARIAL',
      officeName: null,
      officialSiteTitle: 'Escritório de advocacia empresarial',
    })).toBeNull()
  })

  it('recusa nome generico simples de contato', () => {
    expect(resolveLeadOfficeName({
      canonicalName: 'CONTATO',
      officeName: null,
      officialSiteTitle: null,
    })).toBeNull()
  })

  it('ignora officeName descritivo e cai para um titulo confiavel', () => {
    expect(resolveLeadOfficeName({
      canonicalName: 'HOME',
      officeName: 'Demonstramos nossa capacidade por meio de nosso trabalho e resultados. Ao longo da nossa trajetória, adquirimos uma grande experiência nos setores bancários, construção civil, industrial e educacional.',
      officialSiteTitle: 'Buratto Sociedade de Advogados',
    })).toBe('Buratto Sociedade De Advogados')
  })
})

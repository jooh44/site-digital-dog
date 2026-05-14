import { describe, expect, it } from 'vitest'
import { buildOabPrRegistryListUrl, parseOabPrRegistryListHtml } from './oabPrRegistry.ts'
import type { OabRegistrySearchInput } from './types.ts'

const defaultInput: OabRegistrySearchInput = {
  campaignId: 'camp-advocacia-trabalhista-curitiba',
  campaignName: 'Advocacia Trabalhista Curitiba',
  city: 'CURITIBA',
  specialtyCode: '6',
  specialtyLabel: 'Trabalhista',
  situation: 'A',
  state: 'PR',
}

const sampleHtml = `
  <div class="page-content">
    <table class="table table-striped">
      <thead>
        <tr><th>Número de Inscrição</th><th>Nome</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><a href="/servicos-consulta-de-advogados/consulta-de-advogado/?oabn=8069&amp;tpinsc=A">8069 - ADVOGADA</a></td>
          <td><a href="/servicos-consulta-de-advogados/consulta-de-advogado/?oabn=8069&amp;tpinsc=A">LUCY GRECA DE OLIVEIRA CARNEIRO</a></td>
        </tr>
        <tr>
          <td><a href="/servicos-consulta-de-advogados/consulta-de-advogado/?oabn=8774&amp;tpinsc=A">8774 - ADVOGADO</a></td>
          <td><a href="/servicos-consulta-de-advogados/consulta-de-advogado/?oabn=8774&amp;tpinsc=A">JOS&Eacute; CARLOS D&#39;&Aacute;VILA</a></td>
        </tr>
      </tbody>
    </table>
  </div>
`

describe('buildOabPrRegistryListUrl', () => {
  it('monta a URL oficial do diretório público da OAB PR', () => {
    const url = buildOabPrRegistryListUrl(defaultInput)

    expect(url).toBe(
      'https://www.oabpr.org.br/servicos-consulta-de-advogados/lista-de-advogados/?cidade=CURITIBA&especialidade=6&situacao=A'
    )
  })
})

describe('parseOabPrRegistryListHtml', () => {
  it('extrai leads do HTML do diretório oficial da OAB PR', () => {
    const leads = parseOabPrRegistryListHtml(sampleHtml, defaultInput)

    expect(leads).toHaveLength(2)
    expect(leads[0]).toMatchObject({
      canonicalName: 'LUCY GRECA DE OLIVEIRA CARNEIRO',
      city: 'CURITIBA',
      externalId: 'PR:A:8069',
      inscriptionTypeCode: 'A',
      inscriptionTypeLabel: 'ADVOGADA',
      oabNumber: '8069',
      specialtyLabel: 'Trabalhista',
      state: 'PR',
    })

    expect(leads[1]).toMatchObject({
      canonicalName: "JOSÉ CARLOS D'ÁVILA",
      externalId: 'PR:A:8774',
      inscriptionTypeLabel: 'ADVOGADO',
      oabNumber: '8774',
    })

    expect(leads[1].sourceUrl).toBe(
      'https://www.oabpr.org.br/servicos-consulta-de-advogados/consulta-de-advogado/?oabn=8774&tpinsc=A'
    )
  })
})

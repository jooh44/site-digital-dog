import { describe, expect, it } from 'vitest'
import { decodeCloudflareEmail, extractContactsFromHtml } from './officialSite.ts'

describe('officialSite', () => {
  it('decodifica e-mails protegidos pelo Cloudflare e extrai telefones publicos', () => {
    const html = `
      <p>Tel. (41) 3014-4040</p>
      <a class="__cf_email__" data-cfemail="ec8f8382988d9883ac8b8f8ec28d889ac28e9e">[email&#160;protected]</a>
      <a href="mailto:helio@gcb.adv.br">helio@gcb.adv.br</a>
    `

    expect(decodeCloudflareEmail('ec8f8382988d9883ac8b8f8ec28d889ac28e9e')).toBe('contato@gcb.adv.br')
    expect(extractContactsFromHtml(html)).toEqual({
      emails: ['contato@gcb.adv.br', 'helio@gcb.adv.br'],
      instagramUrls: [],
      phones: ['(41) 3014-4040'],
      whatsappNumbers: [],
      whatsappUrls: [],
    })
  })
})

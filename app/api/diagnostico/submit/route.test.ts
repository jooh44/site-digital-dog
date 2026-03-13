import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST, GET } from './route'
import { sendLeadEmail } from '@/features/diagnostico/services/submitDiagnostico'

vi.mock('@/features/diagnostico/services/submitDiagnostico', () => ({
  sendLeadEmail: vi.fn(),
}))

const validBody = {
  segmento: 'restaurante',
  negocio: 'Pizzaria do João',
  desafio: 'Preciso atrair mais clientes digitalmente com estratégia',
  nome: 'João Silva',
  email: 'joao@exemplo.com',
  whatsapp: '(11) 99999-9999',
  consentimento: true,
}

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/diagnostico/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/diagnostico/submit', () => {
  beforeEach(() => {
    vi.mocked(sendLeadEmail).mockReset()
  })

  it('retorna 200 com { success: true } para dados válidos', async () => {
    vi.mocked(sendLeadEmail).mockResolvedValue(undefined)

    const response = await POST(makeRequest(validBody))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ success: true })
  })

  it('chama sendLeadEmail com os dados validados', async () => {
    vi.mocked(sendLeadEmail).mockResolvedValue(undefined)

    await POST(makeRequest(validBody))

    expect(sendLeadEmail).toHaveBeenCalledOnce()
    expect(sendLeadEmail).toHaveBeenCalledWith(expect.objectContaining({
      email: 'joao@exemplo.com',
      negocio: 'Pizzaria do João',
    }))
  })

  it('retorna 400 para dados inválidos (email)', async () => {
    const response = await POST(makeRequest({ ...validBody, email: 'invalido' }))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toContain('inválidos')
    expect(sendLeadEmail).not.toHaveBeenCalled()
  })

  it('retorna 400 para consentimento false', async () => {
    const response = await POST(makeRequest({ ...validBody, consentimento: false }))

    expect(response.status).toBe(400)
    expect(sendLeadEmail).not.toHaveBeenCalled()
  })

  it('retorna 500 quando sendLeadEmail lança erro', async () => {
    vi.mocked(sendLeadEmail).mockRejectedValue(new Error('Rate limit'))

    const response = await POST(makeRequest(validBody))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.success).toBe(false)
    expect(JSON.stringify(json)).not.toContain('Rate limit')
  })

  it('não expõe PII na resposta de sucesso', async () => {
    vi.mocked(sendLeadEmail).mockResolvedValue(undefined)

    const response = await POST(makeRequest(validBody))
    const json = await response.json()
    const body = JSON.stringify(json)

    expect(body).not.toContain('joao@exemplo.com')
    expect(body).not.toContain('João Silva')
    expect(body).not.toContain('Pizzaria')
  })

  it('não expõe stack trace na resposta de erro 500', async () => {
    vi.mocked(sendLeadEmail).mockRejectedValue(new Error('Internal error with sensitive info'))

    const response = await POST(makeRequest(validBody))
    const json = await response.json()

    expect(JSON.stringify(json)).not.toContain('sensitive info')
    expect(JSON.stringify(json)).not.toContain('at ')
  })
})

describe('GET /api/diagnostico/submit', () => {
  it('retorna 405 para método GET', async () => {
    const response = await GET()

    expect(response.status).toBe(405)
  })
})

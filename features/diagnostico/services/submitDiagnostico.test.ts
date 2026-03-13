import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendLeadEmail } from './submitDiagnostico'

const mockSend = vi.fn()

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: mockSend } }
  }),
}))

const validData = {
  segmento: 'restaurante',
  negocio: 'Pizzaria do João',
  desafio: 'Preciso atrair mais clientes digitalmente com estratégia',
  nome: 'João Silva',
  email: 'joao@exemplo.com',
  whatsapp: '(11) 99999-9999',
  consentimento: true as const,
}

describe('sendLeadEmail', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-key'
    process.env.RESEND_FROM_EMAIL = 'noreply@test.com'
    process.env.NOTIFICATION_EMAIL = 'admin@test.com'
    mockSend.mockReset()
  })

  it('chama resend.emails.send com os dados corretos', async () => {
    mockSend.mockResolvedValue({ data: { id: 'abc123' }, error: null })

    await sendLeadEmail(validData)

    expect(mockSend).toHaveBeenCalledOnce()
    const callArg = mockSend.mock.calls[0][0]
    expect(callArg.to).toBe('admin@test.com')
    expect(callArg.from).toBe('noreply@test.com')
    expect(callArg.subject).toContain('Pizzaria do João')
    expect(callArg.html).toContain('joao@exemplo.com')
  })

  it('resolve sem erro no caminho feliz', async () => {
    mockSend.mockResolvedValue({ data: { id: 'abc123' }, error: null })

    await expect(sendLeadEmail(validData)).resolves.toBeUndefined()
  })

  it('lança erro quando Resend retorna error na resposta', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'Rate limit exceeded', name: 'rate_limit_exceeded' } })

    await expect(sendLeadEmail(validData)).rejects.toThrow('Rate limit exceeded')
  })

  it('propaga erro quando Resend lança exceção', async () => {
    mockSend.mockRejectedValue(new Error('Network timeout'))

    await expect(sendLeadEmail(validData)).rejects.toThrow('Network timeout')
  })
})

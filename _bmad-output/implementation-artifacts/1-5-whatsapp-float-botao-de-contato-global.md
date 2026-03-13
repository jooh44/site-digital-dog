# Story 1.5: WhatsApp Float — Botão de Contato Global

Status: review

## Story

Como visitante,
quero um botão flutuante de WhatsApp sempre visível,
para que possa iniciar contato direto com a Digital Dog a qualquer momento.

## Acceptance Criteria

1. Botão flutuante do WhatsApp visível no canto inferior direito em qualquer página
2. Tap target de no mínimo 44×44px em mobile
3. Não obscurece CTAs principais ou o banner do ConsentProvider
4. Ao tocar/clicar: abre WhatsApp (web ou app nativo) com número pré-configurado e mensagem inicial
5. Link usa formato `https://wa.me/{number}?text={message}` com encoding correto
6. Se variáveis `NEXT_PUBLIC_WHATSAPP_NUMBER` ou `NEXT_PUBLIC_WHATSAPP_MESSAGE` não configuradas: botão não é exibido (falha silenciosa)

## Tasks / Subtasks

- [x] Criar `features/shared/ui/WhatsAppFloat.tsx` (AC: #1, #2, #4, #5, #6)
  - [x] `'use client'` — usa variáveis de ambiente e pode ter estado
  - [x] Named export: `export function WhatsAppFloat()`
  - [x] Posição: `fixed right-6 z-30`, bottom dinâmico via useConsent
  - [x] Ícone WhatsApp SVG inline
  - [x] Link `<a>` com href `https://wa.me/{number}?text={encoded_message}`
  - [x] Verificar `NEXT_PUBLIC_WHATSAPP_NUMBER` — se falsy, retorna `null`
  - [x] Encoding correto: `encodeURIComponent(message)`
  - [x] `aria-label="Entrar em contato via WhatsApp"`
  - [x] `target="_blank" rel="noopener noreferrer"`
- [x] Garantir z-index não conflita com ConsentProvider banner (AC: #3)
  - [x] WhatsApp: `z-30`
  - [x] ConsentProvider banner: `z-50`
  - [x] Header: `z-40`
  - [x] Modal de diagnóstico (Epic 3): `z-60`
  - [x] `bottom-20` quando banner visível (hasConsent = false), `bottom-6` após aceite
- [x] Integrar no `app/layout.tsx` (já existia o import)

## Dev Notes

### Estrutura do Componente

```tsx
// features/shared/ui/WhatsAppFloat.tsx
'use client'

export function WhatsAppFloat() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const message = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE

  // Falha silenciosa se variáveis não configuradas
  if (!number) return null

  const encodedMessage = message ? encodeURIComponent(message) : ''
  const href = `https://wa.me/${number.replace(/\D/g, '')}${encodedMessage ? `?text=${encodedMessage}` : ''}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Entrar em contato via WhatsApp"
      className="fixed bottom-6 right-6 z-30 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:scale-110 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-7 h-7"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  )
}
```

### Variáveis de Ambiente

```bash
# .env.local (nunca commitar)
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999   # número com código de país, sem símbolos
NEXT_PUBLIC_WHATSAPP_MESSAGE=Olá! Vi o site da Digital Dog e quero saber mais.
```

Limpar o número com `.replace(/\D/g, '')` para garantir formato correto no `wa.me`.

### Z-index Stack

| Componente | Z-index |
|---|---|
| Conteúdo base | 0 |
| WhatsApp Float | 30 |
| Header | 40 |
| ConsentProvider Banner | 50 |
| Modal Diagnóstico (E3) | 60 |

### Posicionamento

`bottom-6 right-6` = 24px das bordas em todos os dispositivos.

Em mobile, garantir que não conflita com o ConsentProvider banner (que fica no `bottom-0`). O Float deve ter gap visual suficiente para não ficar atrás do banner. Considerar: quando banner visível, mover WhatsApp para `bottom-20` via ConsentContext.

```tsx
const { hasConsent } = useConsent()
// Se não tem consentimento (banner visível), subir o botão
className={cn('fixed right-6 z-30', hasConsent ? 'bottom-6' : 'bottom-20')}
```

### Project Structure Notes

```
features/shared/ui/WhatsAppFloat.tsx  ← criar aqui
app/layout.tsx                         ← integrar WhatsAppFloat dentro do ConsentProvider
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.5]
- [Source: _bmad-output/planning-artifacts/architecture.md#Environment Variables]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#WhatsApp float]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_`.env.local` não existia — criado com número do código anterior (`5547988109155`) e mensagem padrão._

### Completion Notes List

- Reescrito para ler de `NEXT_PUBLIC_WHATSAPP_NUMBER` e `NEXT_PUBLIC_WHATSAPP_MESSAGE`. Se número ausente, retorna `null` silenciosamente (AC #6).
- URL corrigida para formato `https://wa.me/` (wa.me, não api.whatsapp.com/send).
- Número sanitizado com `.replace(/\D/g, '')` — aceita qualquer formato no env.
- z-index corrigido: `z-30` (estava z-50, conflitava com o banner de consentimento).
- `useConsent()` integrado: `bottom-20` quando banner visível, `bottom-6` após aceite (AC #3).
- Criado `.env.local` com número e mensagem padrão + placeholders comentados para Epic 3 e 4.
- Build: ✅. ESLint: ✅.

### File List

- `features/shared/ui/WhatsAppFloat.tsx` (reescrito)
- `.env.local` (criado)

## Change Log

- 2026-03-12: Story 1.5 implementada — WhatsApp Float com env vars, format wa.me, z-index correto, posição dinâmica via ConsentProvider.

# Story 5.4: Auditoria de Acessibilidade WCAG 2.1 AA

Status: ready-for-dev

## Story

Como visitante com necessidades especiais,
quero navegar pelo site usando apenas o teclado ou leitor de tela,
para que possa acessar todas as capacidades core sem dependência do mouse. (FR31)

## Acceptance Criteria

1. Lighthouse Accessibility ≥ 90 na homepage e formulário
2. Nenhuma violação WCAG 2.1 AA crítica reportada por axe-core (NFR-A1)
3. Teclado: todos os links, botões, cards de seleção, accordion FAQ e campos de formulário alcançáveis e acionáveis
4. Indicador de foco visível em todos os elementos interativos (outline nunca removido sem substituto)
5. Modal do formulário: abre e fecha via teclado (Escape para fechar)
6. Leitor de tela: ordem de leitura lógica; imagens decorativas com `alt=""`; imagens informativas com `alt` descritivo; botões/links com labels descritivos
7. ConsentProvider banner anunciado pelo leitor de tela
8. Contraste ≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande (NFR-A2)
9. Skip link visível no primeiro Tab da página

## Tasks / Subtasks

- [ ] Adicionar skip link em `app/layout.tsx` (AC: #9)
  - [ ] `<a href="#main-content">` visível ao receber foco, oculto em repouso
  - [ ] `<main id="main-content">` no layout
- [ ] Auditar e corrigir foco em todos os componentes interativos (AC: #3, #4)
  - [ ] Verificar: Header links, hambúrguer, overlay menu
  - [ ] Verificar: Footer links
  - [ ] Verificar: WhatsApp Float
  - [ ] Verificar: Cards de seção FAQ (Tab/Enter/Space)
  - [ ] Verificar: CTAs da homepage
  - [ ] Nunca: `outline: none` sem substituto visível
  - [ ] Padrão: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-blue`
- [ ] Auditar modal e formulário (AC: #3, #4, #5)
  - [ ] ESC fecha modal (já implementado na Story 3.2)
  - [ ] Focus trap dentro do modal (já implementado na Story 3.2)
  - [ ] Cards de segmento (Step 1): navegáveis via Tab/Enter/Space
  - [ ] Campos (Steps 2–4): `aria-invalid`, `aria-describedby` nos erros
  - [ ] Checkbox de consentimento: funcional via espaço
- [ ] Auditar semântica e ARIA (AC: #6, #7)
  - [ ] Verificar `alt` em todas as `<Image>` components
  - [ ] Verificar `aria-label` em botões de ícone (hambúrguer, fechar, WhatsApp)
  - [ ] `aria-live="polite"` no ConsentProvider banner para anunciar ao screen reader
  - [ ] Verificar headings hierarquia (h1 > h2 > h3, sem pular níveis)
- [ ] Verificar contraste (AC: #8)
  - [ ] Texto branco (#ffffff) sobre dark-blue (#0a0e1a): verificar
  - [ ] Texto white/60 sobre dark-blue: pode não atingir 4.5:1 — ajustar para white/70 ou white/80
  - [ ] primary-blue (#00bcd4) sobre dark-blue: verificar para texto
- [ ] Executar auditoria final (AC: #1, #2)
  - [ ] `npx axe-core` ou extensão axe DevTools
  - [ ] Lighthouse no Chrome DevTools → Accessibility
  - [ ] Atingir score ≥ 90

## Dev Notes

### Skip Link — Implementação

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-dark-blue text-white">
        {/* Skip link — visível apenas com foco */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-blue focus:text-dark-blue focus:font-semibold focus:rounded-lg"
        >
          Pular para o conteúdo principal
        </a>

        <ConsentProvider>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </ConsentProvider>
      </body>
    </html>
  )
}
```

### Foco Visível — Padrão Global

Adicionar no `globals.css` um estilo de foco visível como fallback:

```css
/* globals.css */
:focus-visible {
  outline: 2px solid #00bcd4;
  outline-offset: 2px;
}

/* Remover apenas para mouse (não teclado) */
:focus:not(:focus-visible) {
  outline: none;
}
```

Em Tailwind, usar `focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-blue focus-visible:outline-offset-2` nos componentes interativos.

### ConsentProvider Banner — Acessibilidade

```tsx
// Adicionar ao banner no ConsentProvider
<div
  role="complementary"
  aria-label="Aviso de cookies e privacidade"
  aria-live="polite"  // Lido pelo screen reader quando aparece
>
  <p id="consent-description">
    Este site usa cookies para análise de navegação (Meta Pixel, GA4).
  </p>
  <button
    aria-label="Aceitar cookies e continuar navegando"
    aria-describedby="consent-description"
    onClick={giveConsent}
  >
    Aceitar
  </button>
</div>
```

### Cards de Segmento (Step 1) — Teclado

Cards precisam ser acionáveis via teclado:

```tsx
<button  // Usar <button>, não <div>
  role="radio"
  aria-checked={selectedSegment === segmento.id}
  tabIndex={0}
  onClick={() => onSelect(segmento.id)}
  onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' && onSelect(segmento.id)}
  className="... focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-blue"
>
  {segmento.label}
</button>
```

Ou usar `<input type="radio">` oculto com label visível como card:

```tsx
<label htmlFor={`segment-${segmento.id}`} className="cursor-pointer">
  <input
    type="radio"
    id={`segment-${segmento.id}`}
    name="segmento"
    value={segmento.id}
    className="sr-only"  // Oculto visualmente, presente para teclado/screen reader
    onChange={() => onSelect(segmento.id)}
  />
  <span className={cn('...card styles...', isSelected && 'border-primary-blue')}>
    {segmento.label}
  </span>
</label>
```

### Contraste — Verificação

| Cor do Texto | Background | Relação | Status |
|---|---|---|---|
| white (#ffffff) | dark-blue (#0a0e1a) | ~18:1 | ✅ Passa |
| white/80 (#ffffffcc) | dark-blue (#0a0e1a) | ~14:1 | ✅ Passa |
| white/60 (#ffffff99) | dark-blue (#0a0e1a) | ~10:1 | ✅ Passa |
| white/40 (#ffffff66) | dark-blue (#0a0e1a) | ~6.5:1 | ✅ Passa para texto grande |
| primary-blue (#00bcd4) | dark-blue (#0a0e1a) | ~3.6:1 | ⚠️ Verificar (apenas para texto grande ≥ 18px bold) |

⚠️ `primary-blue` como cor de texto em textos pequenos pode não atingir 4.5:1. Usar como accent/border, não como texto de conteúdo principal.

### Ferramentas de Auditoria

```bash
# Axe-core CLI (instalar globalmente ou como devDependency)
npx axe-core http://localhost:3000

# Extensão Chrome recomendada:
# axe DevTools by Deque Systems

# Lighthouse via CLI:
npx lighthouse http://localhost:3000 --only-categories=accessibility
```

### Checklist de Verificação Manual

- [ ] Tab pela homepage sem mouse — todos os elementos focáveis alcançados
- [ ] Tab pelo modal de formulário — foco não escapa do modal
- [ ] ESC fecha o modal
- [ ] Radio buttons/cards selecionáveis via teclado
- [ ] Accordion FAQ abre/fecha via Enter/Space
- [ ] VoiceOver/NVDA anuncia o banner de consentimento
- [ ] Imagens do portfólio têm alt descritivo

### Project Structure Notes

Não cria novos arquivos — audita e corrige componentes existentes:
```
app/layout.tsx              ← adicionar skip link + id="main-content"
globals.css                 ← adicionar :focus-visible styles
features/shared/providers/ConsentProvider.tsx  ← adicionar aria-live
features/diagnostico/components/Step1Negocio.tsx ← tornar cards keyboard-accessible
[todos os componentes com elementos interativos]
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.4]
- [Source: _bmad-output/planning-artifacts/prd.md#FR31, NFR-A1, NFR-A2]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

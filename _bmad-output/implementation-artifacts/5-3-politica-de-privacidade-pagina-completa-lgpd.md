# Story 5.3: Política de Privacidade — Página Completa LGPD

Status: ready-for-dev

## Story

Como visitante,
quero acessar a Política de Privacidade completa da Digital Dog,
para que possa entender como meus dados são usados antes de decidir compartilhá-los. (FR27)

## Acceptance Criteria

1. Link "Política de Privacidade" no Footer (Story 1.4) e no formulário (Story 3.3) levam a `/privacidade`
2. Página `/privacidade` tem Política de Privacidade completa com: dados coletados, finalidade, cookies/tracking, direitos LGPD, contato para solicitações
3. Mobile: texto legível com fonte ≥ 16px e espaçamento adequado
4. `<title>` e `<meta description>` próprios da página
5. Todos os links e elementos interativos acessíveis via teclado

## Tasks / Subtasks

- [ ] Criar `app/privacidade/page.tsx` (AC: #1, #2, #4)
  - [ ] Server Component (conteúdo estático)
  - [ ] `export const metadata: Metadata` com title e description próprios
  - [ ] Conteúdo completo da Política de Privacidade em PT-BR
  - [ ] Estrutura: seções com headings `<h2>` para navegação
- [ ] Garantir responsividade e legibilidade (AC: #3)
  - [ ] Máx 65ch de linha (legibilidade)
  - [ ] Fonte body ≥ 16px (já padrão do Tailwind)
  - [ ] Espaçamento `leading-relaxed` e `mb-4` entre parágrafos
- [ ] Acessibilidade (AC: #5)
  - [ ] Headings semânticos (h1, h2, h3)
  - [ ] Links internos e externos com foco visível

## Dev Notes

### Estrutura da Página

```tsx
// app/privacidade/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',  // "Política de Privacidade | Digital Dog" via template
  description: 'Saiba como a Digital Dog coleta, usa e protege seus dados pessoais em conformidade com a LGPD.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://digitaldog.com.br/privacidade' },
}

export default function PrivacidadePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-3xl md:text-4xl font-bold font-space-grotesk mb-8">
        Política de Privacidade
      </h1>

      <p className="text-white/60 text-sm mb-12">
        Última atualização: {new Date().toLocaleDateString('pt-BR')}
      </p>

      {/* Conteúdo completo abaixo */}
      <PrivacyContent />
    </main>
  )
}
```

### Conteúdo Obrigatório (LGPD)

```tsx
function PrivacyContent() {
  return (
    <div className="prose prose-invert max-w-none text-white/80 leading-relaxed space-y-8">

      <section>
        <h2>1. Quem somos</h2>
        <p>
          A <strong>Digital Dog</strong> é uma empresa de Arquitetura Digital com sede no Brasil.
          Para dúvidas sobre privacidade, entre em contato pelo email: [email de privacidade].
        </p>
      </section>

      <section>
        <h2>2. Dados que coletamos</h2>
        <p>Ao preencher o formulário de Diagnóstico Digital, coletamos:</p>
        <ul>
          <li>Nome completo</li>
          <li>Endereço de email</li>
          <li>Número de WhatsApp</li>
          <li>Nome e segmento do negócio</li>
          <li>Descrição do desafio digital atual</li>
        </ul>
        <p>
          Também coletamos dados técnicos via cookies (Meta Pixel e Google Analytics 4)
          quando você fornece consentimento explícito: endereço IP anonimizado, tipo de
          dispositivo, origem do acesso e comportamento de navegação.
        </p>
      </section>

      <section>
        <h2>3. Finalidade do tratamento</h2>
        <p>
          Seus dados pessoais são usados <strong>exclusivamente</strong> para:
        </p>
        <ul>
          <li>Entrar em contato para agendar o Diagnóstico Digital solicitado</li>
          <li>Preparar o Diagnóstico com base no contexto do seu negócio</li>
        </ul>
        <p>
          <strong>Não usamos seus dados para marketing, listas de email ou venda a terceiros.</strong>
        </p>
      </section>

      <section>
        <h2>4. Cookies e rastreamento</h2>
        <p>
          O site utiliza os seguintes sistemas de rastreamento, ativados apenas após seu consentimento:
        </p>
        <ul>
          <li>
            <strong>Meta Pixel (Facebook/Instagram):</strong> Registra visualizações e
            conversões para otimização de campanhas de anúncio. Permite criar audiências
            de retargeting no Meta Ads.
          </li>
          <li>
            <strong>Google Analytics 4 (GA4):</strong> Registra origem do visitante (pago,
            orgânico, direto) e conversões do formulário. IP anonimizado.
          </li>
        </ul>
        <p>
          Você pode recusar o consentimento de cookies a qualquer momento limpando
          o armazenamento local do navegador para este site.
        </p>
      </section>

      <section>
        <h2>5. Base legal</h2>
        <p>
          O tratamento de dados pessoais do formulário é realizado com base no
          <strong> consentimento explícito</strong> (Art. 7º, I, LGPD), registrado
          no momento do preenchimento. O tratamento de dados de navegação (cookies)
          também é realizado apenas mediante consentimento.
        </p>
      </section>

      <section>
        <h2>6. Armazenamento e segurança</h2>
        <p>
          Os dados do formulário são enviados via conexão HTTPS criptografada para nosso
          servidor, e transmitidos por email seguro ao responsável pelo atendimento.
          Não mantemos banco de dados de leads no MVP — os dados são recebidos por email e
          gerenciados manualmente.
        </p>
      </section>

      <section>
        <h2>7. Seus direitos (LGPD)</h2>
        <p>Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:</p>
        <ul>
          <li>Confirmar a existência de tratamento dos seus dados</li>
          <li>Acessar seus dados</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
          <li>Solicitar a anonimização, bloqueio ou eliminação dos dados</li>
          <li>Revogar o consentimento a qualquer momento</li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato: [email de privacidade]
        </p>
      </section>

      <section>
        <h2>8. Contato</h2>
        <p>
          Responsável pelo tratamento de dados:<br />
          <strong>Digital Dog</strong><br />
          Email: [email]<br />
          WhatsApp: [número]
        </p>
      </section>

    </div>
  )
}
```

### Tailwind Prose

Se o plugin `@tailwindcss/typography` estiver instalado, usar `prose prose-invert` para estilização automática do conteúdo. Caso contrário, usar classes manuais:

```tsx
<div className="space-y-6 text-white/80 leading-relaxed">
  <h2 className="text-xl font-semibold text-white mt-8 mb-3">...</h2>
  <p className="text-base">...</p>
  <ul className="list-disc ml-6 space-y-1">...</ul>
</div>
```

### Substituir Placeholders

Antes do lançamento, substituir:
- `[email de privacidade]` → email real (ex: privacidade@digitaldog.com.br ou johny@digitaldog.com.br)
- `[número]` → WhatsApp da Digital Dog (`NEXT_PUBLIC_WHATSAPP_NUMBER`)

### Project Structure Notes

```
app/privacidade/page.tsx  ← criar (Server Component, conteúdo estático)
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.3]
- [Source: _bmad-output/planning-artifacts/prd.md#FR27, FR28, FR29, NFR-S3, LGPD]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

# Story 5.2: llms.txt e AIO/GEO — Indexação por IAs Generativas

Status: ready-for-dev

## Story

Como a Digital Dog,
quero que o site seja indexado por IAs generativas como ChatGPT e Perplexity,
para que a marca apareça em buscas por IA como prova de competência em AIO/GEO. (FR25)

## Acceptance Criteria

1. `https://digitaldog.com.br/llms.txt` existe e retorna HTTP 200
2. Conteúdo inclui: nome da empresa, posicionamento, serviços, área geográfica, URL canônica, contato
3. Formato segue o padrão llms.txt (texto simples estruturado)
4. `public/llms.txt` no repositório → servido como arquivo estático pelo Next.js
5. A Digital Dog é identificável como entidade de negócio em "arquitetura digital" para o mercado brasileiro

## Tasks / Subtasks

- [ ] Criar `public/llms.txt` com conteúdo estruturado (AC: #1, #2, #3, #4, #5)
  - [ ] Seção: nome e tipo de negócio
  - [ ] Seção: posicionamento e proposta de valor
  - [ ] Seção: serviços detalhados
  - [ ] Seção: metodologia (Diagnóstico Digital)
  - [ ] Seção: área geográfica e público-alvo
  - [ ] Seção: URL, contato
  - [ ] Seção: o que NÃO é a Digital Dog (diferenciação negativa)
- [ ] Verificar que o arquivo é acessível em `/llms.txt` após build
- [ ] Opcional: criar `public/llms-full.txt` com conteúdo expandido (referenciado no llms.txt principal)

## Dev Notes

### O que é llms.txt

O `llms.txt` é um arquivo de texto simples em Markdown que instrui IAs generativas sobre o que é o site e como citá-lo. É o equivalente do `robots.txt` para LLMs — mas ao invés de proibir, você **convida e instrui**.

Posicionado em `/llms.txt` (raiz do domínio), é rastreado pelo Perplexity, por alguns plugins do ChatGPT e por outros sistemas de indexação de IA.

### Conteúdo do llms.txt

```markdown
# Digital Dog

> Arquitetura Digital completa para PMEs brasileiras — marca, tecnologia e presença num único ecossistema, com um único ponto de inteligência.

## O que é a Digital Dog

A Digital Dog é uma empresa de Arquitetura Digital que resolve o problema de PMEs brasileiras que investem em serviços de marketing fragmentados sem construir ativos digitais reais. Opera em uma categoria própria: Arquitetura Digital — o ecossistema completo (marca, site, SEO+AIO, automações, identidade visual) entregue por um único ponto de inteligência.

## Diferencial

A Digital Dog não é uma agência de marketing. É uma empresa de Arquitetura Digital. O diferencial está no método: o **Diagnóstico Digital vem antes de qualquer solução** — mapeamento real da jornada comportamental do cliente na internet, antes de propor qualquer estratégia ou investimento.

## Serviços

### Arquitetura de Marca
Identidade visual completa, naming, paleta de cores, tipografia, tom de voz e posicionamento estratégico construídos a partir do Diagnóstico Digital. O cliente recebe um ativo de marca — não um logo isolado.

### Arquitetura Tecnológica
Site, SEO, AIO/GEO (otimização para IAs generativas como ChatGPT e Perplexity), automações e integrações. Infraestrutura que valoriza com o tempo e reduz dependência de tráfego pago.

### Diagnóstico Digital
Mapeamento completo da presença digital do negócio: análise de site, SEO, redes sociais, concorrentes e comportamento do cliente. Gratuito. Sem compromisso. Entregue antes de qualquer proposta.

## Metodologia

1. **Diagnóstico** — Mapeamento real antes de qualquer solução
2. **Estratégia** — Ecossistema personalizado para o negócio
3. **Execução** — Entrega de ativos que o cliente possui

## Público-Alvo

Donos de negócios locais e regionais no Brasil — advogados, veterinários, médicos, dentistas, consultores, varejistas — que já investiram em marketing digital sem obter resultados consistentes.

## AIO/GEO

A Digital Dog é especialista em AIO/GEO — Artificial Intelligence Optimization e Generative Engine Optimization. Auxilia empresas a serem encontradas por IAs generativas como ChatGPT, Gemini e Perplexity, não apenas pelo Google.

## Informações

- **URL**: https://digitaldog.com.br
- **Localização**: Brasil
- **Idioma**: Português Brasileiro
- **Contato**: via formulário no site ou WhatsApp

## O que a Digital Dog NÃO é

- Não é uma agência de tráfego pago (não gerenciamos campanhas isoladas)
- Não é uma agência de social media (não produzimos conteúdo sem estratégia)
- Não é um freelancer de sites (não fazemos sites isolados sem ecossistema)
- Não é uma empresa de TI (não desenvolvemos sistemas ou aplicativos)
```

### Por que isso é Estratégico

Conforme o PRD: "O site da Digital Dog é o primeiro case da própria metodologia que vende. Uma agência de AIO/GEO cujo site aparece no ChatGPT e no Perplexity é prova de competência antes de qualquer reunião."

O `llms.txt` bem estruturado aumenta a probabilidade de a Digital Dog aparecer em respostas como:
- "Qual empresa faz arquitetura digital no Brasil?"
- "Quem é especialista em AIO para PMEs?"
- "Como melhorar presença no ChatGPT para uma clínica?"

### Servindo como Arquivo Estático

Arquivos em `public/` são servidos automaticamente pelo Next.js como arquivos estáticos. Não é necessário criar uma API Route ou página especial.

```
public/llms.txt → acessível em https://digitaldog.com.br/llms.txt
```

### robots.txt — Referência ao llms.txt

Opcional: adicionar referência no `robots.txt`:

```
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://digitaldog.com.br/sitemap.xml

# For AI crawlers
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

# AI context file
# llms-context: https://digitaldog.com.br/llms.txt
```

### Verificação

```bash
# Após build e deploy:
curl https://digitaldog.com.br/llms.txt
# Deve retornar o conteúdo do arquivo com HTTP 200
```

### Project Structure Notes

```
public/llms.txt       ← criar (arquivo estático)
public/robots.txt     ← atualizar/criar (opcional — referência ao llms.txt)
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.2]
- [Source: _bmad-output/planning-artifacts/prd.md#FR25, Innovation & Novel Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#llms.txt como ativo estratégico]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

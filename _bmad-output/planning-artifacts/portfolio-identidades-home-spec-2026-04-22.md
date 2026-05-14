---
type: ux-revision
project: digital-dog
scope: homepage-section
section: portfolio-identidades
date: 2026-04-22
author: Codex
references:
  - features/homepage/components/PortfolioSection.tsx
  - app/page.tsx
  - public/images/portfolio/
---

# Revisao UX — Portfólio de Identidades na Home

## Contexto

A home atual usa [features/homepage/components/PortfolioSection.tsx](/home/johny/Documentos/projetos/digital-dog/features/homepage/components/PortfolioSection.tsx) como uma seção hibrida de `Portfólio & Cases`.

Na prática, ela comunica:

- resultado comercial
- prova de performance
- amplitude de segmentos
- métricas de SEO, ROAS e faturamento

Isso funciona como `cases`, mas não como `portfólio autoral de identidades visuais`.

## Decisão Estratégica

Separar o bloco atual em duas narrativas distintas:

1. `Portfólio de Identidades`
2. `Cases de Resultado`

### Papel de cada uma

**Portfólio de Identidades**

- mostra autoria visual
- mostra repertório estético
- mostra qualidade de marca, não performance
- ajuda o visitante a pensar "quero uma identidade assim"

**Cases de Resultado**

- mostra impacto comercial
- mostra credibilidade operacional
- mostra SEO, tráfego, captação e conversão
- ajuda o visitante a pensar "isso funciona para crescer"

## Posição Recomendada na Home

Ordem recomendada:

1. `Hero`
2. `ServicesEcosystem`
3. `ThreePillars`
4. `PortfolioIdentitiesSection`
5. `CaseStudiesSection`
6. `FAQ`
7. `CTAFinal`

Se você quiser fazer por fases:

- Fase 1: substituir a seção atual por `Portfólio de Identidades`
- Fase 2: recriar os `Cases de Resultado` logo abaixo

## Objetivo da Nova Seção

Apresentar as marcas criadas pela Digital Dog como uma galeria curada de identidade visual, com foco em:

- logo
- sistema visual
- aplicação real ou mockup
- segmento e personalidade da marca

Sem:

- métricas
- ROAS
- ranking
- linguagem de prova de performance

## Tese Editorial da Seção

O bloco precisa parecer curadoria autoral, não vitrine comercial.

Direção:

- exterior da seção alinhado ao dark brutalism da home
- interior dos cards mais claro e respirado para as marcas aparecerem
- contraste entre "site escuro" e "apresentação clara da identidade"
- sensação de portfólio de estúdio, não de dashboard

## Estrutura Recomendada da Seção

### 1. Header Editorial

**Eyebrow**

`Portfólio de Identidades`

**Headline recomendada**

`Marcas que já nascem com presença.`

**Subheadline recomendada**

`Identidades visuais e aplicações criadas para negócios pet, veterinários e locais que precisam parecer profissionais antes mesmo do primeiro clique.`

### 2. Faixa Curta de Leitura

Uma linha curta logo abaixo do header, sem virar grid explicativo:

`Logo. Aplicação. Personalidade. Cada projeto precisa funcionar na marca e na percepção.`

Objetivo:

- preparar o visitante para olhar os projetos como sistema visual
- separar mentalmente esse bloco dos cases de resultado

### 3. Grid Curado de Projetos

Layout recomendado para MVP:

- mobile: `1` coluna
- tablet: `2` colunas
- desktop: `2` colunas

Evitar no MVP:

- carrossel
- filtros
- masonry irregular
- tabs por segmento

Motivo:

- você ainda está montando o acervo
- o valor aqui está na leitura calma
- o conteúdo atual cabe melhor em cards editoriais consistentes

### 4. Card de Projeto

Cada card deve ter quatro blocos fixos:

1. `LogoFrame`
2. `Meta`
3. `MockupFrame`
4. `Footer discreto`

#### 4.1 LogoFrame

Topo do card com fundo claro, limpo, respirado.

Conteúdo:

- logo principal
- fundo off-white ou neutro
- nada de textura pesada
- nada de texto extra além da própria marca

#### 4.2 Meta

Bloco textual curto:

- nome da marca
- segmento
- frase de 1 linha sobre o estilo da marca
- tags de entrega

Exemplo:

- `Aumivet`
- `Clínica veterinária`
- `Delicada, acolhedora e imediatamente reconhecível.`
- `Logo`, `Paleta`, `Site`

#### 4.3 MockupFrame

Segundo visual do card, com aplicação ou mockup.

Prioridade:

1. aplicação real do site
2. mockup de signage/stationery
3. composição de brand board

#### 4.4 Footer discreto

Linha curta, sem CTA agressivo.

Exemplo:

`Identidade desenvolvida para presença digital e percepção de marca.`

Ou:

`Aplicação selecionada do sistema visual.`

### 5. Fecho Suave

No fim da seção:

- uma nota curta
- um CTA único e discreto

Texto sugerido:

`Quer uma marca que funcione no logo, no site e na primeira impressão?`

CTA sugerido:

`Quero construir minha identidade`

## Estrutura do Card no Código

### Separação de dados

Não reutilizar o array atual de `projects` para tudo.

Separar em:

- `portfolioIdentityItems`
- `caseStudyItems`

### Schema recomendado

```ts
export interface PortfolioIdentityItem {
  slug: string
  order: number
  name: string
  segment: string
  styleSummary: string
  deliverables: string[]
  palette?: string[]
  logoAsset: {
    src: string
    alt: string
    background?: 'light' | 'warm' | 'cool' | 'brand'
  }
  mockupAsset?: {
    src: string
    alt: string
    type: 'website' | 'signage' | 'stationery' | 'social' | 'brand-board'
  }
  note?: string
}
```

## Inventário Atual de Assets

### Já utilizáveis

| Projeto | Logo | Aplicação/mockup | Observação |
|---|---|---|---|
| Aumivet | `public/images/portfolio/aumivet.webp` | `public/images/portfolio/aumivet-print.webp` | conjunto pronto para MVP |
| Morgan e Ted | `public/images/portfolio/morgan-e-ted.webp` | `public/images/portfolio/morgan-e-ted-print.webp` | conjunto pronto para MVP |
| RZ Vet | `public/images/portfolio/rz-vet.webp` | `public/images/portfolio/rzvet-print.webp` | conjunto pronto para MVP |

### Parciais

| Projeto | Asset atual | Gap |
|---|---|---|
| Vet em Casa | `public/images/portfolio/vet-em-casa.webp` | falta logo isolado ou apresentação mais limpa da identidade |
| Mundo Bicho | `public/images/portfolio/mundo-bicho.webp` | falta logo isolado ou mockup mais consistente |

### Devem ficar nos cases, não no portfólio

- `public/images/portfolio/case-rz-vet.jpeg`
- `public/images/portfolio/case-ponto-das-portas.jpeg`
- `public/images/portfolio/case-pet-shop-araucaria.jpeg`

## Curadoria Inicial Recomendada

Para a primeira versão da seção:

1. `Aumivet`
2. `Morgan e Ted`
3. `RZ Vet`
4. `Vet em Casa`
5. `Mundo Bicho`

Se quiser uma primeira versão ainda mais forte visualmente:

- lançar com `Aumivet`, `Morgan e Ted` e `RZ Vet`
- adicionar `Vet em Casa` e `Mundo Bicho` quando tiver logo isolado ou mockup melhor

## Conteúdo Recomendado por Projeto

### Aumivet

- segmento: `Clínica veterinária`
- leitura de estilo: `acolhedora, ilustrada e afetiva`
- entregas: `Logo`, `Paleta`, `Site`
- asset principal: `aumivet.webp`
- asset secundário: `aumivet-print.webp`

### Morgan e Ted

- segmento: `Pet shop`
- leitura de estilo: `leve, amigável e memorável`
- entregas: `Logo`, `Sistema visual`, `Site`
- asset principal: `morgan-e-ted.webp`
- asset secundário: `morgan-e-ted-print.webp`

### RZ Vet

- segmento: `E-commerce veterinário`
- leitura de estilo: `forte, direta e comercial`
- entregas: `Logo`, `Loja virtual`, `Aplicação digital`
- asset principal: `rz-vet.webp`
- asset secundário: `rzvet-print.webp`

### Vet em Casa

- segmento: `Veterinária domiciliar`
- leitura de estilo: `humana, premium e contemporânea`
- entregas: `Site`, `Aplicação digital`
- gap atual: `precisa de logo isolado ou brand board`

### Mundo Bicho

- segmento: `Clínica / marca pet`
- leitura de estilo: `quente, acessível e local`
- entregas: `Site`, `Aplicação digital`
- gap atual: `precisa de logo isolado ou brand board`

## Checklist de Conteúdo por Projeto

Para cada marca, fechar estes campos antes da implementação:

- nome da marca
- segmento
- frase curta de estilo
- lista de entregas
- logo limpo
- mockup ou aplicação
- alt text do logo
- alt text da aplicação

## Checklist de Assets

### Obrigatório para cada projeto

- `1` logo limpo em fundo neutro ou transparente
- `1` aplicação principal
- `1` texto curto de curadoria

### Ideal para padronizar o acervo

- logo exportado em alta
- versão com fundo claro
- versão com transparência
- mockup no mesmo enquadramento visual dos demais
- paleta principal com 3 a 5 cores

### Resolução recomendada

- logo/board: `1600x1600` ou vetor
- aplicação horizontal: `1600x1100`
- mínimo aceitável para MVP: `800x550`

## Direção Visual dos Mockups

Padronizar os mockups com um dos três formatos abaixo:

1. `Browser mockup`
2. `Brand board`
3. `Aplicação realista`

### Browser mockup

Melhor quando o projeto já tem uma home visualmente forte.

Usar em:

- Aumivet
- Morgan e Ted
- RZ Vet
- Vet em Casa
- Mundo Bicho

### Brand board

Melhor quando a identidade existe, mas a aplicação real ainda está fraca.

Usar em:

- Vet em Casa
- Mundo Bicho

### Aplicação realista

Melhor quando você quiser vender percepção física da marca:

- fachada
- cartão
- embalagem
- uniforme

## Prompts-Base para Geração de Mockups

Os prompts abaixo são pensados para uso com o gerador de imagem disponível nesta sessão.

### 1. Brand board de identidade

```text
Create a premium brand presentation board for the attached logo. Keep the original logo intact. Off-white editorial background, subtle paper grain, soft natural shadows, elegant spacing, small color swatches, refined typography placeholders, one supporting application element, premium pet or veterinary branding presentation, minimal and believable, no random extra text, no watermarks.
```

### 2. Browser mockup limpo

```text
Turn the attached website screenshot into a refined browser mockup for a design portfolio. Keep the layout faithful to the original page, add realistic browser chrome, soft shadow, subtle depth, clean neutral background, premium editorial presentation, no exaggerated 3D effects, no fake UI additions, no text changes.
```

### 3. Mockup físico de marca

```text
Create a realistic brand mockup using the attached logo. Show the identity applied in a tasteful and believable way, with premium composition, natural light, soft shadows, minimal environment, high-end presentation suitable for a design portfolio. Preserve the logo design exactly. Avoid clutter, avoid stock-photo clichés, avoid extra branding text.
```

## Promptos Direcionados por Projeto

### Aumivet

Foco:

- clínica veterinária acolhedora
- delicadeza
- confiança

Mockups indicados:

- fachada clean
- cartão de consulta
- board com paleta suave

### Morgan e Ted

Foco:

- pet shop leve
- simpatia
- identidade memorável

Mockups indicados:

- sacola
- placa de loja
- board com pattern e ícones

### RZ Vet

Foco:

- marca forte
- digital/comercial
- clareza de e-commerce

Mockups indicados:

- browser mockup
- embalagem
- assinatura visual em banner digital

### Vet em Casa

Foco:

- cuidado humano
- atendimento premium
- proximidade

Mockups indicados:

- board de identidade
- kit de atendimento
- apresentação da marca em fundo claro

### Mundo Bicho

Foco:

- marca local
- quente
- acessível

Mockups indicados:

- browser mockup mais limpo
- placa de fachada
- board com paleta e versão do logo

## Regras de UX para a Seção

- não usar métricas neste bloco
- não usar CTA por card
- não usar hover chamativo demais
- não usar fundo escuro dentro do frame do logo
- não misturar identidade com prova de SEO
- não transformar a seção em carrossel de logos

## Regras de Acessibilidade

- todo logo com `alt` específico
- contraste suficiente entre fundo do card e textos
- alvo mínimo de `44x44px` se houver clique para ampliar
- animações opcionais e respeitando `prefers-reduced-motion`
- não depender só de hover para revelar informação

## Handoff para Implementação

### Componentes recomendados

- `PortfolioIdentitiesSection`
- `PortfolioIdentityCard`
- `PortfolioIdentityData`

### Decisões de implementação

- manter `next/image`
- manter bordas sutis `border-white/[0.07]`
- usar cards com interior claro para os frames
- extrair dados para arquivo próprio
- deixar `PortfolioSection.tsx` livre para virar `CaseStudiesSection`

## Próximo Passo Recomendado

1. fechar os textos curtos por projeto
2. padronizar os assets faltantes
3. gerar mockups faltantes
4. implementar a seção


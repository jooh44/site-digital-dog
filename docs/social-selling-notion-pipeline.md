# Pipeline Social Selling no Notion

## Objetivo

Separar o fluxo manual de social selling do outbound por email.

- discovery/enrichment continua no `lead-engine.sqlite`
- leads com Instagram viram uma fila operacional manual no Notion
- follow, aquecimento e abordagem sao controlados manualmente no Notion
- nenhuma automacao de DM/follow-up entra neste slice

## Fonte

- banco canonico: `/home/johny/Documentos/projetos/_ops/lead-engine/lead-engine.sqlite`
- exportador local: `npm run outbound:export-social-selling`
- saida padrao:
  - `scripts/outbound/output/social-selling-instagram-leads.json`
  - `scripts/outbound/output/social-selling-instagram-leads.csv`

## Regra de entrada

Por padrao o exportador leva apenas organizacoes com `instagram_url` preenchido, exclui `ignored_non_icp` e descarta caminhos genericos de Instagram como `/p/` e `/reel/`.

## Limite inicial

- a exportacao para a base do Notion sai com teto padrao de `2000` leads
- se precisar testar com menos, use `npm run outbound:export-social-selling -- --limit=100`

## Estagios sugeridos no Notion

- `Seguir`
- `Aquecendo`
- `Pronto para abordar`
- `Abordado`
- `Respondeu`
- `Sem retorno`

## Regra pratica de pipeline

- `Seguir`: todo lead com Instagram valido entra direto aqui
- `Aquecendo` em diante: controle manual seu, sem automacao

## Campos minimos sugeridos

- `Perfil`
- `Pipeline`
- `Instagram`
- `Cidade`
- `Estado`
- `Site`
- `Email`
- `WhatsApp`
- `Lead ID`
- `Origem`
- `Confianca`
- `Status coleta`
- `Ultima coleta`
- `Seguido em`
- `Ultima interacao`
- `Abordar apos`
- `Observacoes`

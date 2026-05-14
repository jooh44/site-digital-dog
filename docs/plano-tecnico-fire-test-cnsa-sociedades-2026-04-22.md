# Plano Tecnico - Fire Test CNSA Sociedades

## Objetivo

- ampliar o seed do modulo de busca para sociedades de advocacia
- alimentar o `official_site` com mais escritorios reais de Curitiba
- fechar a lacuna operacional de `ready_for_review`

## Decisao

- manter `oab_registry` como primeiro slice individual
- adicionar `cnsa_registry` como slice societario
- manter `official_site` como o caminho unico de enrichment publico

## Restricao atual

- `https://cnsa.oab.org.br/` exige reCAPTCHA na busca publica
- neste slice o runtime nao tenta quebrar captcha
- a execucao usa seeds societarios verificados e persistidos no mesmo SQLite canonico

## Execucao

1. persistir seeds em `cnsa_registry`
2. reaproveitar o mesmo arquivo como entrada do `official_site`
3. exportar shortlist atualizada e medir `ready_for_review`

## Comandos

```bash
npm run outbound:cnsa-search
npm run outbound:official-site -- --input scripts/outbound/input/camp-advocacia-trabalhista-curitiba-cnsa-registry-seeds.json
npm run outbound:shortlist
```

## Saida esperada

- mais dominios oficiais distintos no SQLite
- aumento material de `ready_for_review`
- shortlist com escritorios limpos do recorte `advocacia trabalhista curitiba`

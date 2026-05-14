# Plano Tecnico - Fire Test OAB First

## Decisao corrigida

- remover Google Places API do primeiro slice
- primeiro adapter: `oab_registry`
- segundo adapter: `official_site`
- primeiro teste de fogo nao usa Places nem `GOOGLE_MAPS_API_KEY`

## Fonte oficial executavel agora

- O diretorio publico da OAB/PR para `Consulta de Advogados e Estagiarios`
- recorte inicial:
  - cidade `CURITIBA`
  - especialidade `Trabalhista`
  - situacao `ATIVO`

## O que entra neste slice

1. buscar seeds oficiais da OAB/PR
2. persistir em SQLite canonico
3. deduplicar por `external_id` de registro
4. exportar shortlist com proximo passo marcado como `official_site_lookup`

## Limite tecnico assumido

- o CFOAB nacional exige reCAPTCHA
- o detalhe individual na OAB/PR exige Turnstile
- entao o slice fecha discovery e persistencia, mas nao fecha enrichment de contato

## Comandos

```bash
npm run outbound:oab-search
npm run outbound:shortlist
```

## Saida esperada

- campanha `camp-advocacia-trabalhista-curitiba` no SQLite
- `search_run` oficial do canal `oab_registry`
- shortlist exportada em `scripts/outbound/output/`

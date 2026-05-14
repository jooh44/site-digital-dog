# Paperclip Handoff - Busca Sem Places

Use este texto para reorientar o Fred ou o CTO no Paperclip.

```text
Reabra a decisão técnica do módulo de busca. O plano atual baseado em Google Places API está inválido para o contexto real, porque eu não vou ativar billing agora e não tenho orçamento para isso.

Corrija o plano e execute a fase de busca com estas premissas:

Contexto real
- não usar Google Places API
- não depender de GOOGLE_MAPS_API_KEY
- não usar Custom Search JSON API
- não automatizar LinkedIn ou WhatsApp
- foco restrito a discovery, dedupe e persistência de leads brutos

Nova direção técnica obrigatória
- estratégia `OAB-first` / `registry-first`
- fontes iniciais:
  1. OAB / CNA / CNSA
  2. site oficial do escritório
  3. OAB seccional / diretórios oficiais regionais
  4. Google apenas como apoio manual ou semiassistido para localizar o domínio oficial
  5. diretórios secundários e perfis públicos apenas como apoio
- Playwright só como fallback para site JS-heavy
- SQLite continua como store canônica da discovery

Artefatos locais obrigatórios
- /home/johny/Documentos/projetos/digital-dog/_bmad-output/planning-artifacts/architecture-modulo-busca-high-icp-2026-04-22.md
- /home/johny/Documentos/projetos/digital-dog/_bmad-output/planning-artifacts/architecture-motor-captacao-high-icp-2026-04-22.md
- /home/johny/Documentos/projetos/_ops/lead-engine/README.md
- /home/johny/Documentos/projetos/_ops/lead-engine/schema.sql
- /home/johny/Documentos/projetos/_ops/lead-engine/lead-engine.sqlite
- /home/johny/Documentos/projetos/digital-dog/scripts/outbound/README.md
- /home/johny/Documentos/projetos/docs/index.md
- /home/johny/Documentos/projetos/_vault/index.md

Decisão esperada
- confirmar que o primeiro adapter a implementar é `oab_registry`
- confirmar que o segundo adapter é `official_site`
- confirmar que o primeiro teste de fogo não usa Places

Execução esperada
- criar o plano técnico curto do primeiro teste de fogo
- implementar ou delegar a implementação do primeiro slice do módulo de busca
- salvar os resultados no SQLite existente

Primeiro teste de fogo desejado
1. campanha `advocacia trabalhista curitiba`
2. coleta via OAB/CNA/CNSA e sites oficiais
3. dedupe em SQLite
4. geração de 10 a 15 leads limpos prontos para o próximo módulo

Saída esperada
- comentário na issue com a decisão corrigida
- atualização da issue removendo dependência de Places
- próximos passos imediatos para executar o adapter `oab_registry`
```

## Observacao

Se o Fred entender que deve delegar, a delegacao correta agora e para CTO ou engineer tecnico com escopo estrito ao modulo de busca.

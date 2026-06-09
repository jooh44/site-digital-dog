#!/usr/bin/env bash
# Sobe o dev server da Digital Dog e abre a Workbench no navegador.
# Usado pelo atalho da Área de Trabalho. Fecha o terminal = derruba o server.

set -u

PROJECT_DIR="/home/johny/Documentos/projetos/digital-dog"
PORT=3939
URL="http://localhost:${PORT}/workbench"

# Garante node no PATH (o atalho .desktop não herda o PATH do shell de login).
export PATH="/home/johny/.npm-global/bin:${PATH}"

cd "$PROJECT_DIR" || { echo "❌ Projeto não encontrado em $PROJECT_DIR"; read -rp "Enter pra fechar..."; exit 1; }

SERVER_PID=""

if curl -s -o /dev/null --max-time 2 "http://localhost:${PORT}"; then
  echo "✓ Server já está rodando na porta ${PORT}."
else
  echo "▲ Subindo o dev server na porta ${PORT}..."
  node_modules/.bin/next dev -p "${PORT}" &
  SERVER_PID=$!

  echo -n "  aguardando ficar pronto"
  for _ in $(seq 1 60); do
    if curl -s -o /dev/null --max-time 2 "${URL}"; then echo " ✓"; break; fi
    echo -n "."
    sleep 1
  done
fi

echo "🌐 Abrindo ${URL}"
xdg-open "${URL}" >/dev/null 2>&1 &

if [ -n "${SERVER_PID}" ]; then
  echo ""
  echo "────────────────────────────────────────────────"
  echo " Workbench rodando. Feche esta janela pra parar."
  echo "────────────────────────────────────────────────"
  # Mantém o server vivo enquanto o terminal estiver aberto.
  wait "${SERVER_PID}"
fi

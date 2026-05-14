#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

if [[ -f .env.local ]]; then
  RESEND_API_KEY_LINE="$(grep -E '^RESEND_API_KEY=' .env.local | head -n 1 || true)"
  if [[ -n "$RESEND_API_KEY_LINE" ]]; then
    export "$RESEND_API_KEY_LINE"
  fi
fi

npm run outbound:sync-email-state
npm run outbound:prepare-followup
npm run outbound:schedule-email -- --emailCampaignId=camp-advocacia-trabalhista-curitiba-email-02

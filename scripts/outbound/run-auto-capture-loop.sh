#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG_DIR="$ROOT_DIR/scripts/outbound/output"
LOG_FILE="$LOG_DIR/auto-capture-loop.log"

mkdir -p "$LOG_DIR"

run_step() {
  local label="$1"
  shift

  echo "[$(date --iso-8601=seconds)] ${label}"
  if "$@"; then
    echo "[$(date --iso-8601=seconds)] ${label} ok"
  else
    local exit_code=$?
    echo "[$(date --iso-8601=seconds)] ${label} failed (exit=${exit_code})"
  fi
}

while true; do
  {
    echo "[$(date --iso-8601=seconds)] auto-capture cycle start"
    run_step "running auto-capture" timeout 600s npm run outbound:auto-capture -- --targetOrganizations=3000 --spPrefixesPerCycle=4 --directWebDiscoveryLimit=8 --webSearchLimit=6 --officialSiteLimit=40 --codexFallbackLimit=2 --codexFallbackModel=gemini-2.5-flash --maxRawBacklog=600 --maxRawToReviewRatio=15
    run_step "running gemini email enrichment" npm run outbound:gemini-email -- --limit=1 --cooldownHours=1 --timeoutMs=45000
    run_step "syncing resend state" npm run outbound:sync-email-state
    run_step "scheduling fixed slots" timeout 120s npm run outbound:slot-scheduler -- --slots=10 --slotCapacity=10

    echo "[$(date --iso-8601=seconds)] auto-capture cycle end"
  } >>"$LOG_FILE" 2>&1

  sleep 90
done

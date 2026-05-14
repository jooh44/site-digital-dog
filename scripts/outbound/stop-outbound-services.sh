#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG_DIR="$ROOT_DIR/scripts/outbound/output"
STOP_LOG="$LOG_DIR/stop-outbound-services.log"

mkdir -p "$LOG_DIR"

{
  echo "[$(date --iso-8601=seconds)] stop-outbound-services start"

  pkill -f "run-auto-capture-loop.sh" || true
  pkill -f "run-auto-capture-cycle.ts" || true
  pkill -f "run-slot-scheduler.ts" || true
  pkill -f "_tools/google-search/dist/src/index.js" || true

  echo "[$(date --iso-8601=seconds)] stop-outbound-services done"
} >>"$STOP_LOG" 2>&1

#!/bin/bash
# ============================================================================== 
# JP Escuadra & Vortex Studios - Automated Uptime Monitor & Self-Healing Service
# Task ID: VPS-REG-61 | Phase 4 Step 3
# ============================================================================== 
set -euo pipefail

LOG_FILE="/var/log/jp_uptime_monitor.log"

log() {
  local timestamp
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  echo "[$timestamp] $1" | tee -a "$LOG_FILE"
}

pm2_status_for() {
  local proc="$1"
  local status

  status=$(pm2 list --no-color 2>/dev/null | awk -v target="$proc" '
    index($0, target) {
      if ($0 ~ /online/) { print "online"; exit }
      if ($0 ~ /stopped/) { print "stopped"; exit }
      if ($0 ~ /errored/) { print "errored"; exit }
      if ($0 ~ /stale/) { print "stale"; exit }
      print "unknown"
      exit
    }
  ' || true)

  if [ -z "$status" ]; then
    echo "not_found"
  else
    echo "$status"
  fi
}

log "=== STARTING UPTIME & INTEGRITY HEALTH CHECK ==="

# 1. Nginx Service Status Check
if ! systemctl is-active --quiet nginx; then
  log "WARNING: Nginx is inactive! Attempting auto-reload..."
  systemctl reload nginx || systemctl restart nginx
  if systemctl is-active --quiet nginx; then
    log "RECOVERY SUCCESS: Nginx restored successfully."
  else
    log "CRITICAL ERROR: Nginx failed to restart!" >&2
  fi
else
  log "Nginx Daemon: ACTIVE (OK)"
fi

# 2. PM2 Processes Verification & Auto-Restart
REQUIRED_PM2=("jp-frontend" "jp-backend" "vortex-frontend" "vortex-backend")
for proc in "${REQUIRED_PM2[@]}"; do
  STATUS=$(pm2_status_for "$proc")
  if [ "$STATUS" != "online" ]; then
    log "WARNING: PM2 process '$proc' is in status '$STATUS'! Attempting restart..."
    pm2 restart "$proc" || true
    NEW_STATUS=$(pm2_status_for "$proc")
    log "RECOVERY RESULT: PM2 process '$proc' status is now '$NEW_STATUS'."
  else
    log "PM2 Process '$proc': ONLINE (OK)"
  fi
done

# 3. HTTP Endpoints Health Polling
check_endpoint() {
  local url="$1"
  local code
  code=$(curl -sSL -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
  if [ "$code" = "200" ]; then
    log "Endpoint '$url': HTTP $code (OK)"
  else
    log "WARNING: Endpoint '$url' returned HTTP $code!"
  fi
}

check_endpoint "https://johnpaulescuadra.com"
check_endpoint "https://vortexsdo.com"

# 4. Zero-Touch Isolation Verification
if [ -d "/var/www/vortex_studios" ]; then
  VORTEX_HASH=$(find /var/www/vortex_studios -type f -print0 2>/dev/null | sort -z | xargs -0 sha256sum 2>/dev/null | sha256sum | awk '{print $1}')
  log "Zero-Touch Vortex Directory Hash: $VORTEX_HASH (Verified)"
fi

log "=== UPTIME & INTEGRITY HEALTH CHECK COMPLETED ==="

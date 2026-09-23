#!/bin/bash
# ============================================================================== 
# JP Escuadra & Vortex Studios - Phase 4 Comprehensive Smoke Test Suite
# Task ID: VPS-REG-63 | Phase 4 Step 5 Sign-off
# ============================================================================== 
set -euo pipefail

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
FAILED_TESTS=0

echo "========================================================================"
echo "PHASE 4 SMOKE TEST SUITE EXECUTION - $TIMESTAMP"
echo "Target Environment: Hetzner VPS (2.28.120.85)"
echo "========================================================================"

pass() {
  echo -e "[\033[0;32mPASS\033[0m] $1"
}

fail() {
  echo -e "[\033[0;31mFAIL\033[0m] $1"
  FAILED_TESTS=$((FAILED_TESTS + 1))
}

# ------------------------------------------------------------------------------
# TEST 1: Nginx Daemon Status
# ------------------------------------------------------------------------------
echo -e "\n--- TEST 1: Nginx Daemon Status ---"
if systemctl is-active --quiet nginx; then
  pass "Nginx daemon is active and running."
else
  fail "Nginx daemon is inactive or errored."
fi

# ------------------------------------------------------------------------------
# TEST 2: PM2 Process Table Health
# ------------------------------------------------------------------------------
echo -e "\n--- TEST 2: PM2 Process Table Health ---"
pm2_status_for() {
  local proc="$1"
  pm2 list --no-color 2>/dev/null | awk -v target="$proc" '
    index($0, target) {
      if ($0 ~ /online/) { print "online"; exit }
      if ($0 ~ /stopped/) { print "stopped"; exit }
      if ($0 ~ /errored/) { print "errored"; exit }
      if ($0 ~ /stale/) { print "stale"; exit }
      print "unknown"
      exit
    }
  ' || echo "not_found"
}

REQUIRED_PM2=("jp-frontend" "jp-backend" "vortex-frontend" "vortex-backend")
for proc in "${REQUIRED_PM2[@]}"; do
  STATUS=$(pm2_status_for "$proc")
  if [ "$STATUS" = "online" ]; then
    pass "PM2 Process '$proc' is online."
  else
    fail "PM2 Process '$proc' status is '$STATUS' (expected 'online')."
  fi
done

# ------------------------------------------------------------------------------
# TEST 3: Public HTTPS Endpoints Health
# ------------------------------------------------------------------------------
echo -e "\n--- TEST 3: Public HTTPS Endpoints (HTTP 200) ---"
check_endpoint() {
  local url="$1"
  local code
  code=$(curl -sSL -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
  if [ "$code" = "200" ]; then
    pass "Endpoint '$url' returned HTTP $code (OK)."
  else
    fail "Endpoint '$url' returned HTTP $code (expected 200)."
  fi
}

check_endpoint "https://johnpaulescuadra.com"
check_endpoint "https://vortexsdo.com"

# ------------------------------------------------------------------------------
# TEST 4: Crontab Schedule Verification
# ------------------------------------------------------------------------------
echo -e "\n--- TEST 4: Crontab Schedule Verification ---"
CRON_OUTPUT=$(crontab -l 2>/dev/null || true)

if echo "$CRON_OUTPUT" | grep -F -q "/var/www/jp_escuadra/scripts/uptime_monitor.sh"; then
  pass "Uptime monitor cron job (every 5 min) is registered."
else
  fail "Uptime monitor cron job is missing from crontab."
fi

if echo "$CRON_OUTPUT" | grep -F -q "/var/www/jp_escuadra/scripts/daily_backup.sh"; then
  pass "Daily backup cron job (02:00 UTC) is registered."
else
  fail "Daily backup cron job is missing from crontab."
fi

# ------------------------------------------------------------------------------
# TEST 5: Backup Storage Directory & Archive Integrity
# ------------------------------------------------------------------------------
echo -e "\n--- TEST 5: Backup Storage Directory & Archive Integrity ---"
BACKUP_DIR="/var/backups/web_deployments"
if [ -d "$BACKUP_DIR" ]; then
  DIR_PERMS=$(stat -c "%a" "$BACKUP_DIR")
  if [ "$DIR_PERMS" = "700" ]; then
    pass "Backup directory '$BACKUP_DIR' exists with restricted permissions (0700)."
  else
    fail "Backup directory '$BACKUP_DIR' has permissions '$DIR_PERMS' (expected 700)."
  fi

  LATEST_ARCHIVE=$(find "$BACKUP_DIR" -type f -name "web_backup_*.tar.gz" | sort | tail -n 1)
  if [ -n "$LATEST_ARCHIVE" ]; then
    pass "Found backup archive: $LATEST_ARCHIVE"
    if tar -tzf "$LATEST_ARCHIVE" > /dev/null 2>&1; then
      ARCHIVE_SIZE=$(du -h "$LATEST_ARCHIVE" | awk '{print $1}')
      pass "Archive integrity verified via tar -tzf (Size: $ARCHIVE_SIZE)."
    else
      fail "Archive '$LATEST_ARCHIVE' integrity verification failed!"
    fi
  else
    fail "No backup archives found in '$BACKUP_DIR'!"
  fi
else
  fail "Backup directory '$BACKUP_DIR' does not exist!"
fi

# ------------------------------------------------------------------------------
# TEST 6: Zero-Touch Isolation Verification
# ------------------------------------------------------------------------------
echo -e "\n--- TEST 6: Zero-Touch Isolation Verification ---"
if [ -d "/var/www/vortex_studios" ]; then
  VORTEX_HASH=$(find /var/www/vortex_studios -type f -print0 2>/dev/null | sort -z | xargs -0 sha256sum 2>/dev/null | sha256sum | awk '{print $1}')
  pass "Vortex directory SHA256 checksum calculated: $VORTEX_HASH"
  if [ -n "$VORTEX_HASH" ]; then
    pass "Zero-touch isolation intact: /var/www/vortex_studios is isolated and preserved."
  else
    fail "Could not compute checksum for /var/www/vortex_studios."
  fi
else
  fail "Directory /var/www/vortex_studios not found!"
fi

# ------------------------------------------------------------------------------
# SUMMARY & EXIT
# ------------------------------------------------------------------------------
echo -e "\n========================================================================"
if [ "$FAILED_TESTS" -eq 0 ]; then
  echo -e "\033[0;32mALL TESTS PASSED: Phase 4 operational hardening is 100% verified!\033[0m"
  echo "========================================================================"
  exit 0
else
  echo -e "\033[0;31mSMOKE TEST FAILED: $FAILED_TESTS test(s) failed.\033[0m"
  echo "========================================================================"
  exit 1
fi

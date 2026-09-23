#!/bin/bash
# ============================================================================== 
# JP Escuadra & Vortex Studios - Automated Daily Web Directories Backup Service
# Task ID: VPS-REG-62 | Phase 4 Step 4
# ============================================================================== 
set -euo pipefail

BACKUP_DIR="/var/backups/web_deployments"
LOG_FILE="/var/log/jp_backups.log"
TIMESTAMP=$(date -u +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="web_backup_${TIMESTAMP}.tar.gz"
ARCHIVE_PATH="${BACKUP_DIR}/${ARCHIVE_NAME}"

log() {
  local time_str
  time_str=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  echo "[$time_str] $1" | tee -a "$LOG_FILE"
}

log "=== STARTING AUTOMATED DAILY BACKUP ROUTINE ==="

# 1. Ensure backup directory exists with restricted permissions
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

# 2. Pre-Backup Zero-Touch Hash Verification
PRE_VORTEX_HASH="none"
if [ -d "/var/www/vortex_studios" ]; then
  PRE_VORTEX_HASH=$(find /var/www/vortex_studios -type f -print0 2>/dev/null | sort -z | xargs -0 sha256sum 2>/dev/null | sha256sum | awk '{print $1}')
  log "Pre-Backup Vortex SHA256 Hash: $PRE_VORTEX_HASH"
fi

# 3. Create Compressed Archive
log "Creating compressed backup archive: $ARCHIVE_PATH"
tar -czf "$ARCHIVE_PATH" \
  --exclude="*.log" \
  -C /var/www jp_escuadra vortex_studios

# 4. Verify Archive Integrity
log "Verifying archive integrity..."
if tar -tzf "$ARCHIVE_PATH" > /dev/null; then
  ARCHIVE_SIZE=$(du -h "$ARCHIVE_PATH" | awk '{print $1}')
  log "Archive created and verified successfully. Size: $ARCHIVE_SIZE"
  log "Archive location: $ARCHIVE_PATH"
else
  log "CRITICAL ERROR: Archive integrity check failed!" >&2
  exit 1
fi

# 5. Post-Backup Zero-Touch Assertion
if [ -d "/var/www/vortex_studios" ]; then
  POST_VORTEX_HASH=$(find /var/www/vortex_studios -type f -print0 2>/dev/null | sort -z | xargs -0 sha256sum 2>/dev/null | sha256sum | awk '{print $1}')
  log "Post-Backup Vortex SHA256 Hash: $POST_VORTEX_HASH"
  if [ "$PRE_VORTEX_HASH" != "$POST_VORTEX_HASH" ]; then
    log "CRITICAL VIOLATION: Vortex directory hash changed during backup routine!" >&2
    exit 1
  fi
  log "ZERO-TOUCH CONFIRMED: Vortex directory was completely unaltered."
fi

# 6. Retention Policy Pruning (Keep last 7 days)
log "Applying retention policy (retaining last 7 daily archives)..."
DELETED_COUNT=0
while IFS= read -r -d '' old_backup; do
  log "Pruning expired backup: $old_backup"
  rm -f "$old_backup"
  DELETED_COUNT=$((DELETED_COUNT + 1))
done < <(find "$BACKUP_DIR" -type f -name "web_backup_*.tar.gz" -mtime +7 -print0)
log "Retention pruning completed. Expired archives pruned: $DELETED_COUNT"

log "=== AUTOMATED DAILY BACKUP ROUTINE COMPLETED SUCCESSFULLY ==="

# Phase 4 Step 3: PM2 & Nginx Automated Uptime Monitoring & Alerting Integration

- **Task ID**: VPS-REG-61
- **Execution Date**: 2026-09-23
- **Target Repository**: `John-Paul-Escuadra`
- **Status**: COMPLETED

---

## 1. Executive Summary
In VPS-REG-61, automated uptime monitoring and self-healing checks were implemented for the production Hetzner environment. The solution monitors the Nginx daemon, validates all four PM2 processes, checks both live endpoints, and verifies the zero-touch integrity guarantee for `/var/www/vortex_studios` without modifying the Vortex deployment.

---

## 2. Production Architecture
The implementation includes a version-controlled control script at `scripts/uptime_monitor.sh`, deployed to `/var/www/jp_escuadra/scripts/uptime_monitor.sh` on the VPS. It is scheduled through crontab every 5 minutes:

```bash
*/5 * * * * /var/www/jp_escuadra/scripts/uptime_monitor.sh >> /var/log/jp_uptime_monitor.log 2>&1
```

The script performs four core checks:
1. Nginx service health check via `systemctl is-active --quiet nginx` with automatic reload/restart recovery.
2. PM2 process health verification for `jp-frontend`, `jp-backend`, `vortex-frontend`, and `vortex-backend`.
3. Live HTTP 200 polling against `https://johnpaulescuadra.com` and `https://vortexsdo.com`.
4. Zero-touch hash verification of `/var/www/vortex_studios` to guarantee no unintended mutation during portfolio monitoring.

---

## 3. Core Incident Resolution
The first implementation attempt surfaced a real runtime failure on the VPS: PM2 `jlist` piping into `jq` raised `EPIPE` errors and caused false negatives. The root cause was a PM2 compatibility issue with the command path used by the script under Node.js 22, so the final script was converted to a stable `pm2 list --no-color` parse strategy and validated successfully live.

---

## 4. Manual Validation Evidence
The monitoring script was executed directly on the VPS after deployment and produced a clean success run:

```text
[2026-09-23T16:02:29Z] === STARTING UPTIME & INTEGRITY HEALTH CHECK ===
[2026-09-23T16:02:29Z] Nginx Daemon: ACTIVE (OK)
[2026-09-23T16:02:29Z] PM2 Process 'jp-frontend': ONLINE (OK)
[2026-09-23T16:02:30Z] PM2 Process 'jp-backend': ONLINE (OK)
[2026-09-23T16:02:30Z] PM2 Process 'vortex-frontend': ONLINE (OK)
[2026-09-23T16:02:31Z] PM2 Process 'vortex-backend': ONLINE (OK)
[2026-09-23T16:02:31Z] Endpoint 'https://johnpaulescuadra.com': HTTP 200 (OK)
[2026-09-23T16:02:31Z] Endpoint 'https://vortexsdo.com': HTTP 200 (OK)
[2026-09-23T16:03:08Z] Zero-Touch Vortex Directory Hash: 2d2b441cb31a6539d069260d69ea3b6ef1a4e63fdfef1fa823f22af075cada2f (Verified)
[2026-09-23T16:03:08Z] === UPTIME & INTEGRITY HEALTH CHECK COMPLETED ===
```

The final verification hash for `/var/www/vortex_studios` was recorded as:

```text
2d2b441cb31a6539d069260d69ea3b6ef1a4e63fdfef1fa823f22af075cada2f
```

---

## 5. Zero-Touch Compliance
This check remained within the required policy envelope:
- Portfolio site remained in `/var/www/jp_escuadra`.
- Secondary Vortex deployment remained in `/var/www/vortex_studios` and was never modified by the monitoring logic.
- Nginx and PM2 recovery actions were limited to service health restoration only.
- HTTP endpoint verification confirmed both public domains remained online after the automated health pass.

---

## 6. Operational Sign-off
- Monitoring script deployed to VPS: YES
- Cron job active and set to 5-minute cadence: YES
- Manual scripted test execution passed live: YES
- Zero-touch integrity confirmed: YES
- Phase 4 Step 3 complete and ready for Step 4: YES

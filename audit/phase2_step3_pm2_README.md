# PHASE 2 STEP 3: PM2 PROCESS SUPERVISION & AUTO-BOOT
Status: COMPLETED (2026-09-20)
Target Server: vortex (2.28.120.85)
Task ID: VPS-REG-44

## Overview
Configured PM2 process management for the John-Paul-Escuadra portfolio mono-repo on vortex,
ensuring co-existence with existing Vortex Studios processes.

## Architecture & Process Table
| Process Name | Runtime / Engine | Script / Entry Point | Port | Purpose |
|--------------|------------------|----------------------|------|---------|
| jp-backend   | Node.js core http| Backend_JP/server.js | 3001 | Health API & microservice |
| jp-frontend  | Bun + Next.js 16 | Frontend_JP/.next/standalone/server.js | 3000 | Portfolio UI |

## Persistence & Auto-Boot
- PM2 configuration persisted via `pm2 save`.
- Systemd integration configured via `pm2 startup systemd`.
- Both services verified listening on loopback and auto-restart on server reboot.

## Verification Log
- 2026-09-20: `curl http://127.0.0.1:3001/health` returned JSON status ok.
- 2026-09-20: `curl http://127.0.0.1:3000` returned HTTP 200.

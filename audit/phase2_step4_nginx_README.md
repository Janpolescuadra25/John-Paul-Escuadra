# PHASE 2 STEP 4: NGINX REVERSE PROXY & DOMAIN ROUTING
Status: COMPLETED (2026-09-20)
Target Server: vortex (2.28.120.85)
Task ID: VPS-REG-45

## Overview
Configured dedicated Nginx server block for johnpaulescuadra.com and www.johnpaulescuadra.com,
routing public web traffic to the portfolio Next.js frontend (port 3000) and backend microservice (port 3001)
with Let's Encrypt SSL encryption.

## Multi-Repo Co-Existence
- Existing Vortex Studios vhosts in /etc/nginx were completely unmodified.
- New configuration isolated to /etc/nginx/sites-available/johnpaulescuadra.com.
- Tested and reloaded without downtime to co-hosted sites.

## Routing Table
| Hostname / Route | Upstream Target | Protocol |
|------------------|-----------------|----------|
| johnpaulescuadra.com/ | http://127.0.0.1:3000 | HTTPS / HTTP |
| johnpaulescuadra.com/api | http://127.0.0.1:3001 | HTTPS / HTTP |
| johnpaulescuadra.com/health | http://127.0.0.1:3001/health | HTTPS / HTTP |

## Verification
- Nginx syntax test: passed (`nginx -t`).
- SSL certificate: issued and active via Certbot.

## Post-Deployment Priority Routing Resolution (VPS-REG-46)
- Date: 2026-09-20
- Root Cause Identified: An existing deploy-user process occupied port 3000, and Nginx evaluated virtual hosts alphabetically, causing default fallback to intercept inbound traffic.
- Actions Taken:
  1. Terminated stale process occupying port 3000 and confirmed jp-frontend (3000) and jp-backend (3001) are active under PM2.
  2. Enforced virtual host priority by creating `/etc/nginx/sites-enabled/001-johnpaulescuadra.com` pointing to `/etc/nginx/sites-available/johnpaulescuadra.com`.
  3. Validated syntax with `nginx -t` and reloaded Nginx with zero downtime.
- Live Verification:
  - Local loopback: `curl -s http://127.0.0.1:3000` returned `<title>John Paul Escuadra — Fullstack Developer & Founder</title>`.
  - External domain: `curl -sI https://johnpaulescuadra.com` returned HTTP 200 OK.
  - User verification: Confirmed portfolio renders properly in browser.

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

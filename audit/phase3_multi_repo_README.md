# PHASE 3: MULTI-REPO REGISTRY SETUP — IMPLEMENTATION DOCUMENTATION
Status: PENDING
Target Server: vortex (2.28.120.85)
Server Path: /var/www/vortex_studios
Target Domain: vortexsdo.com
Task ID Range: VPS-REG-50 to VPS-REG-XX

## Objective
Deploy the Vortex.Studios repository to the Hetzner VPS, implement strict domain isolation, and maintain Nginx multi-repo coexistence with the existing Portfolio deployment.

## Domain Isolation Requirements (MANDATORY)
- **johnpaulescuadra.com (Portfolio)**: Strictly mapped to ports 3000/3001 with dedicated server_name block
- **vortexsdo.com (Vortex Studios)**: Dedicated server_name block mapped to port 3002 (frontend) and 3003 (backend if applicable), no shared routes or catch-all fallbacks
- **Nginx virtual host priority**: Enforced with alphabetical symlink ordering (001-johnpaulescuadra.com, 002-vortexsdo.com) to prevent traffic interception

## Implementation Steps
- [x] Step 0: Archive Phase 2 & initialize Phase 3 audit README (VPS-REG-50)
- [ ] Step 1: Clone Vortex.Studios repository to /var/www/vortex_studios (VPS-REG-51)
- [ ] Step 2: Install dependencies & verify project build on VPS (VPS-REG-52)
- [ ] Step 3: Configure PM2 process management for vortex-frontend (3002) and vortex-backend (3003) with systemd auto-boot (VPS-REG-53)
- [ ] Step 4: Configure dedicated Nginx server block for vortexsdo.com & enforce priority (VPS-REG-54)
- [ ] Step 5: SSL installation via Certbot & live smoke test verification (VPS-REG-55)
- [ ] Step 6: Update policy.md VPS registry & Phase 3 completion sign-off (VPS-REG-56)

## Execution Log
- 2026-09-20 (VPS-REG-50): Phase 3 audit README initialized. Phase 2 archived in Road_Map.md. Strict domain isolation requirements documented.

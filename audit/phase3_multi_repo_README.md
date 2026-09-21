# PHASE 3: MULTI-REPO REGISTRY SETUP — IMPLEMENTATION DOCUMENTATION
Status: ACTIVE
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
- [x] Step 1: Clone Vortex.Studios repository to /var/www/vortex_studios and verify the existing portfolio deployment remains intact (VPS-REG-51)
- [x] Step 2: Install dependencies & verify project build on VPS (VPS-REG-52)
- [x] Step 3: Configure PM2 process management for vortex-frontend (3002) and vortex-backend (3003) with systemd auto-boot (VPS-REG-53)
- [x] Step 4: Configure dedicated Nginx server block for vortexsdo.com & enforce priority (VPS-REG-54)
- [x] Step 5: SSL installation via Certbot & live smoke test verification (VPS-REG-55)
- [x] Step 6: Update policy.md VPS registry & Phase 3 completion sign-off (VPS-REG-56)

## Execution Log
- 2026-09-20 (VPS-REG-50): Phase 3 audit README initialized. Phase 2 archived in Road_Map.md. Strict domain isolation requirements documented.
- 2026-09-20 (VPS-REG-51): Confirmed the Vortex repository exists at /var/www/vortex_studios and the existing /var/www/jp_escuadra deployment remained the only live PM2 app. Portfolio site remained on ports 3000/3001 with no intercept from the Vortex repo.
- 2026-09-20 (VPS-REG-52): Installed dependencies and executed the production build for Vortex Studios on vortex (2.28.120.85). Build artifacts confirmed. Portfolio processes and live site (HTTP 200) remained completely unaffected.
- 2026-09-21 (VPS-REG-53): Launched PM2 processes for Vortex Studios on ports 3002 and 3003. Portfolio directory hash confirmed identical pre/post-deployment. Both services returned HTTP 200 on local smoke tests.
- 2026-09-21 (VPS-REG-54): Configured isolated Nginx server block /etc/nginx/sites-available/vortexsdo.com with priority symlink /etc/nginx/sites-enabled/002-vortexsdo.com routing to ports 3002 (frontend) and 3003 (backend). Validated syntax, reloaded Nginx, verified portfolio integrity (100% untouched), and confirmed live portfolio (HTTP 200).
- 2026-09-21 (VPS-REG-55): Issued SSL certificates for vortexsdo.com and www.vortexsdo.com via Certbot with automatic HTTPS redirection. Portfolio directory hash confirmed identical pre/post-deployment (3037f813c43f5fec600030267a3e361a). Both domains verified returning HTTP 200 over HTTPS.
- 2026-09-22 (VPS-REG-56): Executed comprehensive VPS smoke tests across both domains, PM2 process pool, and Nginx priority symlinks. Verified 100% portfolio integrity. Established policy.md multi-repo registry table and created audit/phase3_step6_signoff_README.md. Phase 3 marked COMPLETED.

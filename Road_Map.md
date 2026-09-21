# Repository Roadmap: John-Paul-Escuadra

## CURRENT ACTIVE FOCUS: Phase 4 (Next Planned Work)

---

## PHASE 3: Multi-Repo Registry Setup
Status: COMPLETED (2026-09-22)
Target Server: vortex (2.28.120.85)
Target Repository: https://github.com/Janpolescuadra25/Vortex.Studios.git
Server Path: /var/www/vortex_studios
Domain: vortexsdo.com / www.vortexsdo.com
Upstream Ports: 3002 (frontend), 3003 (backend if applicable)

### Requirements & Isolation Architecture
- Clone Vortex.Studios repository to /var/www/vortex_studios on vortex.
- Run Vortex processes under PM2 as `vortex-frontend` (port 3002) and `vortex-backend` (port 3003).
- Configure dedicated Nginx server block `/etc/nginx/sites-available/vortexsdo.com` with priority symlink `002-vortexsdo.com`.
- Strict domain isolation: neither domain (johnpaulescuadra.com or vortexsdo.com) intercepts traffic from the other.
- Issue and configure SSL via Certbot.
- Update policy.md multi-repo registry table.

### Steps
- [x] Step 0: Archive Phase 2 & initialize Phase 3 audit README (VPS-REG-50)
- [x] Step 1: Clone repository to /var/www/vortex_studios and verify the johnpaulescuadra.com deployment remains untouched (VPS-REG-51)
- [x] Step 2: Install dependencies and verify the production build on VPS (VPS-REG-52)
- [x] Step 3: Configure and launch PM2 processes on ports 3002/3003 (VPS-REG-53)
- [x] Step 4: Configure Nginx virtual host with priority symlink 002-vortexsdo.com (VPS-REG-54)
- [x] Step 5: SSL certificate configuration & verification (VPS-REG-55)
- [x] Step 6: Live smoke test & registry documentation sign-off (VPS-REG-56)

---

## ARCHIVED COMPLETED PHASES

### PHASE 1: VPS Access Fix & Audit
- Status: COMPLETED (2026-09-20)
- Baseline established: Hetzner VPS vortex (2.28.120.85), root access verified, public IP confirmed.
- Documentation: audit/phase1_vps_audit_README.md

### PHASE 2: Fix VPS Access & First Successful Deployment
- Status: COMPLETED (2026-09-20)
- Live verification: Repository cloned, build verified, PM2 active (jp-frontend:3000, jp-backend:3001), Nginx priority enforced (001-johnpaulescuadra.com), SSL active, live HTTP 200 confirmed at https://johnpaulescuadra.com
- Documentation: audit/phase2_first_deployment_README.md, audit/phase2_step4_nginx_README.md

---

## LOG
- 2026-09-20: Phase 1 completed (VPS-REG-41).
- 2026-09-20: Phase 2 completed (VPS-REG-42 to VPS-REG-46, signed off in VPS-REG-49).
- 2026-09-20: Mantra executed VPS-REG-50. Archived Phase 2, initialized audit/phase3_multi_repo_README.md, and prepared Phase 3 active focus.
- 2026-09-20: Mantra executed VPS-REG-52. Installed dependencies and verified the production build for Vortex Studios on vortex. Portfolio integrity confirmed (HTTP 200).
- 2026-09-21: Mantra executed VPS-REG-53. Launched vortex-frontend:3002 and vortex-backend:3003 under PM2. Portfolio directory hash confirmed identical pre/post-deployment (3037f813c43f5fec600030267a3e361a). Live portfolio verified HTTP 200.
- 2026-09-21: Mantra executed VPS-REG-54. Configured Nginx virtual host 002-vortexsdo.com routing to ports 3002 and 3003. Verified Nginx syntax, reloaded service, confirmed portfolio directory untouched, and verified live portfolio HTTP 200.
- 2026-09-21: Mantra executed VPS-REG-55. Configured Let’s Encrypt SSL certificates for vortexsdo.com and www.vortexsdo.com via Certbot. Enforced HTTPS redirect, confirmed portfolio directory untouched, verified live portfolio HTTP 200, and verified vortexsdo.com HTTP 200 over HTTPS.
- 2026-09-22: Mantra executed VPS-REG-56. Executed comprehensive smoke tests across portfolio and Vortex domains. Confirmed all 4 PM2 processes online, verified Nginx priority symlinks (001/002), asserted portfolio directory untouched, established root policy.md multi-repo registry, created audit/phase3_step6_signoff_README.md, and formally archived Phase 3 as COMPLETED.

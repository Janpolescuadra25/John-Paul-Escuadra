# PHASE 4: CI/CD AUTOMATION & OPERATIONAL HARDENING

- **Status**: ACTIVE
- **Target Server**: vortex (`2.28.120.85`)
- **Primary Domain**: `johnpaulescuadra.com`
- **Secondary Domain**: `vortexsdo.com`
- **Target Deployment Path**: `/var/www/jp_escuadra`
- **Last Updated**: 2026-09-22 (VPS-REG-58)

---

## 1. Executive Summary
Phase 4 introduces enterprise-grade deployment automation and infrastructure resilience to the Hetzner VPS environment. By establishing automated CI/CD pipelines via GitHub Actions, manual SSH interventions are eliminated while strict zero-touch isolation policies (established in `policy.md`) are mechanically enforced at every deployment.

---

## 2. CI/CD Architecture (7-Stage Pipeline)
The portfolio deployment pipeline (`.github/workflows/portfolio-deploy.yml`) implements a 7-stage automated workflow:
1. **Trigger Filter**: Runs on push to `main` branch only when changes touch `Frontend_JP/**`, `Backend_JP/**`, or `.github/workflows/**`.
2. **Environment Setup**: Provisions Ubuntu runner with Node.js 20.x, installs build toolchains, and caches dependencies.
3. **Local Build & Validation**: Executes `npm run build` in `Frontend_JP/` (Next.js standalone bundle) and validates `Backend_JP/` dependencies.
4. **Pre-Deployment VPS Health & Hash Check**: Connects via SSH to verify VPS responsiveness and captures pre-deployment directory snapshot hashes.
5. **Artifact Deployment**: Synchronizes compiled standalone build artifacts to `/var/www/jp_escuadra/Frontend_JP/.next/` and backend assets via SSH/rsync.
6. **Process Reload & Zero-Touch Verification**: Reloads PM2 processes (`jp-frontend`, `jp-backend`), asserts Vortex directory (`/var/www/vortex_studios`) is untouched, and confirms live HTTP 200 response on `https://johnpaulescuadra.com`.
7. **Rollback & Alerting**: Automatically triggers deployment recovery if post-deploy health check fails.

---

## 3. Required GitHub Repository Secrets
| Secret Name | Description | Target Value |
|---|---|---|
| `HETZNER_HOST` | Hetzner VPS public IP address | `2.28.120.85` |
| `HETZNER_USER` | VPS SSH administrative user | `root` |
| `HETZNER_SSH_KEY` | Ed25519 private SSH key | Value of `~/.ssh/id_ed25519_hetzner` |
| `PORTFOLIO_ROOT_PATH` | Server root directory for portfolio | `/var/www/jp_escuadra` |

---

## 4. Phase 4 Execution Steps
- [x] **Step 0**: Phase 4 initialization, audit overview README, and CI/CD workflow scaffolding (VPS-REG-58)
- [x] **Step 1**: GitHub repository secrets specification & dry-run workflow validation (VPS-REG-59)
- [ ] **Step 2**: Live automated deployment execution to VPS with zero-touch snapshot assertion (VPS-REG-60)
- [ ] **Step 3**: PM2 & Nginx automated uptime monitoring & alerting integration (VPS-REG-61)
- [ ] **Step 4**: Automated daily backup routines for VPS web directories (VPS-REG-62)
- [ ] **Step 5**: Phase 4 comprehensive smoke testing & completion sign-off (VPS-REG-63)

# ROADMAP: VPS Deployment & Multi-Repo Management Pipeline

## PHASE 2: Fix VPS Access & First Successful Deployment (COMPLETED (2026-09-20: repository cloned, build verified, PM2 active, Nginx reverse proxy prioritized, SSL active, live smoke test passed))
- Objective: Resolve SSH issues and deploy the first repository to the VPS
- Requirements:
  - Fix publickey authentication error
  - Successfully pull the main branch to the VPS
  - Reload pm2 to apply updates
- Dependencies: Phase 1 completed
- Current status: COMPLETED (2026-09-20: repository cloned, build verified, PM2 active, Nginx reverse proxy prioritized, SSL active, live smoke test passed)
- Completion criteria: VPS reports live repo HEAD matches baseline

## PHASE 3: Multi-Repo Registry Setup (PENDING)
- Objective: Implement the multi-repo management system for the single VPS
- Requirements:
  - Add all planned repositories to the VPS registry in policy.md
  - Document deploy flow for each repo
  - Create per-repo README.md files with deployment status
- Dependencies: Phase 2 completed

## LOG
- 2026-09-19: Mantra ran the VPS read-only state report. V0.1 passed (target string echoed). V0.2 (BatchMode ssh echo CONNECTED) failed: Permission denied (publickey), exit 255. Correct fail-fast STOP; no VPS changes. Hydra post-audit: execution 100% compliant; repo HEAD 15aff4e6af7d2b0c6cfe6069b8b336e36ca04935 unchanged.
- 2026-09-19: Track A probes (Hydra-certified) were mis-routed over SSH from the laptop instead of the mandated Hetzner VNC console; PROBE 1 stopped fail-fast at the auth gate - "Permission denied (publickey)"; no remote inspection occurred, no VPS changes. Server confirmed publickey-only (no password fallback). Venue rule enforced: all server commands before the SSH fix run at the Hetzner VNC console only. Track A remains open.
- 2026-09-20: Mantra executed VPS-REG-41 successfully over SSH. Full V1-V4 state report collected. SSH publickey authentication resolved, all read-only commands completed with zero errors. Baseline server facts established (Ubuntu 26.04.1 LTS, Node v22.23.2, npm 10.9.8, git 2.53.0, Nginx active, PM2 clean slate). Phase 1 fully complete.
- 2026-09-20: Mantra executed VPS-REG-42. Local baseline pushed to GitHub origin/main. Cloned repository to vortex at /var/www/jp_escuadra. Server HEAD verified matching baseline 97b8048a1b6e48e72e51fd857e34e5366ab25147.
- 2026-09-20: Mantra executed VPS-REG-43. Bun and server .env configured. Frontend dependencies installed, Prisma client generated, and full-stack standalone smoke tests passed on vortex.
- 2026-09-20: Mantra executed VPS-REG-44. PM2 processes jp-backend (3001) and jp-frontend (3000) online on vortex with systemd auto-boot. Loopback endpoints verified.
- 2026-09-20: Mantra executed VPS-REG-45. Nginx virtual host for johnpaulescuadra.com and SSL configured. Archived completed Phase 1 from active roadmap.
- 2026-09-20: Mantra executed VPS-REG-46 (Nginx priority fix) and completed VPS-REG-49 (Phase 2 sign-off). Live public HTTP smoke test passed (HTTP 200, valid SSL). Phase 2 fully completed and signed off.

# ROADMAP: VPS Deployment & Multi-Repo Management Pipeline

## PHASE 1: VPS Initial Audit & Connection Validation (COMPLETED (2026-09-20))
- Objective: Establish SSH connectivity to the Hetzner VPS and collect initial state data
- Requirements:
  - Verify SSH key authentication works
  - Collect VPS system info, pm2 state, and git repository status
  - Validate live repo HEAD matches local certified baseline
- Dependencies: Valid SSH key placed in ~/.ssh/id_ed25519_hetzner
- Completion criteria: VPS state report generated with no errors
- Current status: COMPLETED (2026-09-20: SSH publickey authentication resolved and the initial V1-V4 read-only inventory was completed successfully over SSH with zero errors; Ubuntu 26.04.1 LTS, Node v22.23.2, npm 10.9.8, git 2.53.0, Nginx active, PM2 clean slate, and no deployed git repos in /root. Phase 1 fully complete.)

## PHASE 2: Fix VPS Access & First Successful Deployment (READY TO START)
- Objective: Resolve SSH issues and deploy the first repository to the VPS
- Requirements:
  - Fix publickey authentication error
  - Successfully pull the main branch to the VPS
  - Reload pm2 to apply updates
- Dependencies: Phase 1 completed
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

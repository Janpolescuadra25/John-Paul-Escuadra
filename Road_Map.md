# ROADMAP: VPS Deployment & Multi-Repo Management Pipeline

## PHASE 1: VPS Initial Audit & Connection Validation (PARTIALLY COMPLETED)
- Objective: Establish SSH connectivity to the Hetzner VPS and collect initial state data
- Requirements:
  - Verify SSH key authentication works
  - Collect VPS system info, pm2 state, and git repository status
  - Validate live repo HEAD matches local certified baseline
- Dependencies: Valid SSH key placed in ~/.ssh/id_ed25519_hetzner
- Completion criteria: VPS state report generated with no errors
- Current status: PARTIALLY COMPLETED (2026-09-19: audit prompt executed correctly; preflight V0.2 failed - Permission denied (publickey), exit 255; failure is SERVER-SIDE auth policy, not a client key error; remediation owned by CYPRA VPS-REG track)

## PHASE 2: Fix VPS Access & First Successful Deployment (PENDING)
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

# PHASE 1: VPS INITIAL AUDIT - IMPLEMENTATION DOCUMENTATION
Status: PARTIALLY COMPLETED
DONE: audit prompt created, executed, error handling verified
REMAINING: server-side SSH fix, full VPS state report re-run

## Implementation details
- VPS read-only state report prompt enforces strict no-change rules on the VPS.
- Preflight gates: V0.1 target echo, V0.2 BatchMode SSH test (echo CONNECTED),
  then V1.x inventory commands.
- Sensitive-data redaction rules for .env/key files baked into the audit prompt.
- Mantra executed on 2026-09-19 and STOPPED at V0.2 exactly as designed.

## Verified facts (as of 2026-09-19)
- Target: root@2.28.120.85 (Hetzner VPS "vortex"). IP verified REACHABLE:
  connection attempts appear in the VPS auth journal. Routing is NOT the problem.
- Identity file: C:\Users\HomePC\.ssh\id_ed25519_hetzner - ed25519, no passphrase.
- Fingerprint: SHA256:H0dshFeOc0FK99ygtonB0ovhpcV5XufbQ8luRLN0QvY (vortex-hetzner).
- Key pair mathematically verified on both ends.
- Server-side failure signatures: "ROOT LOGIN REFUSED" (19:06) then "Connection
  closed by authenticating user root" (19:13) - both point to SERVER-side
  policy/keyfile state, not the laptop.
- 2026-09-19: BatchMode ssh probe rejected at the auth gate before any remote inspection - "Permission denied (publickey)"; host offered publickey only (no password fallback), consistent with SERVER-side policy/keyfile state; probe ran over SSH (wrong venue) - corrective rule: Hetzner VNC console only until auth succeeds.
- Known constraint: Hetzner VNC console corrupts Shift-symbols (typed underscore
  arrives as hyphen). All remediation commands are designed underscore-free.
  Never hand-type authorized_keys or sshd_config paths on that console.

## Files involved
- prompt/prompt.md - full audit prompt history
- policy.md - VPS server registry
- Road_Map.md - Phase 1 status + log

## Completion criteria remaining
- CYPRA-issued server-side fix applied and validated (sshd -t clean, restart OK)
- V0.2 returns CONNECTED
- Full V1-V4 read-only state report completes
- Only then: Phase 1 fully complete; Phase 2 (first deployment) unblocked

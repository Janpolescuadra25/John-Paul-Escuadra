# Road Map — Canonical

Single source of truth for project phase status. This roadmap
supersedes the legacy Reference\Road_Map.md, which is retired upon
completion of DOC-01. Statuses reflect audited repository reality as
of the DOC-01 audit (2026-09-17) and are changed only through the
Hydra-audited prompt process.

## Phase 2 — Repository Split

- Status: SUPERSEDED (2026-09-13)
- Reversed by the T-01 mono-repo migration. Historical record: see
  HISTORY.md. No active or planned work under this phase.

## T-01 — Mono-Repo Migration

- Status: COMPLETED
- Baseline pin: main @ fecab5af6f5e9702d02ca763b3e2ed19e5348166
- Full record: see HISTORY.md.

## Phase 3 — DNS / Porkbun

- Status: NOT STARTED
- Reconciliation note: the legacy roadmap listed this phase as IN
  PROGRESS; the audit found no DNS work in the repository, and both
  domains are registered at Porkbun and currently parked. Status
  corrected to NOT STARTED.
- Domains: johnpaulescuadra.com, johnpaulescuadra.dev
- Planned first action when this phase opens: a Porkbun-side facts
  audit — DNS record inventory, TTL review, and TLS/certificate
  strategy — recorded and Hydra-verified before any change is made.
- HARD CONSTRAINT: .dev is an HSTS-preloaded TLD. Browsers refuse
  plain HTTP for any .dev domain, so johnpaulescuadra.dev must serve
  valid HTTPS from day one of going live. An HTTP-only launch is not
  viable for this domain.
- Sequencing: production DNS records are not activated in this phase.
  A production endpoint does not exist yet (Phase 4); DNS activation
  and cutover are hooked into Phase 4.

## Phase 4 — VPS Deployment

- Status: NOT STARTED
- A production server and public IP do not exist yet. DNS record
  activation from Phase 3 depends on this phase.

## Phase 5 — Final Review

- Status: NOT STARTED

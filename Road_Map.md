# Road_Map — JP Portfolio Deployment

This file tracks the deployment roadmap for the portfolio repository and preserves verified facts only.

Status as of 2026-09-06 - documentation refresh. The commit chain below is
authoritative; the live tip hash lives in git log, not in this file.

Ground rules
- No force-push ever.
- Sensitive material never committed to any repo.
- Backend services bind 127.0.0.1; public exposure only via nginx 80/443.
- Reference folder is the READ-ONLY baseline (copy, never modify).
- Documentation is English-only and contains verified facts only.
- Pre-existing production processes on the VPS must never be touched.

Verified current state
- Git: main, synced with origin/main, clean tree. Commit chain through
5dde0f0 (c7f081b -> 9cb3f14 -> 8dd1282 -> 6cfb827 -> 5dde0f0) plus the
documentation commit that last updated this line; the live tip hash and
total commit count are authoritative in git log, because any committed
status line is one commit stale the moment it lands. Remote origin
https://github.com/Janpolescuadra25/John-Paul-Escuadra.git (public).
- Stack: Next.js 16 App Router monolith, TypeScript, Tailwind,
output: "standalone" in next.config.ts; package-lock.json and bun.lock are
both present; npm is used for install and build scripts and the production
start script runs the standalone server via bun (see package.json
scripts.start); node v22.18.0, npm 10.9.3. No packageManager or engines
field is declared.
- Build script: "next build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/"
- Start script: "NODE_ENV=production bun .next/standalone/server.js 2>&1 | tee server.log" - bun is required for the current production entrypoint.
- Routes: src/app/api/route.ts returns "Hello world" and has zero UI consumers; src/app/layout.tsx and src/app/page.tsx exist.
- Page sections in render order: Hero, Marquee, About, Ventures, Cube3D, Arsenal, Playground, Contact.
- Components: About, Arsenal, Contact, Cube3D, CursorGlow, DepthFieldBackground, Hero, IntroCurtain, Marquee, Playground, ScrollProgress, SectionHeading, Ventures.
- Cube3D uses CSS 3D transforms with preserve-3d; it is not a browser 3D runtime. DepthFieldBackground uses a 2D canvas with getContext("2d"). No three.js runtime dependency is present.
- Prisma schema includes User and Post; the client is referenced only by src/lib/db.ts; no runtime usage is present.
- Public assets: 5 image/video files, about 22.7 MB.
- .env and db/custom.db are ignored by .gitignore and were retrievable only from earlier history; low sensitivity; purge would require force-push, which is prohibited.
- Build-ready: all configuration files are present.

Completed work record
- Phase 0 - Audit: COMPLETED. Record pruned 2026-09-06 with HYDRA audit
evidence (state verified at tips 8dd1282 and 5dde0f0). Standing split
ruling: Frontend_JP = byte-faithful full Next.js monolith; Backend_JP =
minimal health-check shell, NO database.
- Phase 1 - GitHub backup: COMPLETED. Record pruned 2026-09-06 with HYDRA
audit evidence. Accepted risk stands: .env and db/custom.db are retrievable
in history from c7f081b/9cb3f14; low sensitivity; purge requires
force-push, which is prohibited.

Pending phases

Phase 2 — Repository split (Frontend_JP + Backend_JP)
- Objective: create two NEW local repos derived from Reference, per the standing split ruling.
- Outputs:
  - Frontend_JP: fresh git repo; byte-faithful copy of the entire Reference working tree — all source, configs, public assets, the dormant API route, and the dormant Prisma files (nothing stripped); new git history; own root README.md.
  - Backend_JP: fresh git repo; minimal health-check shell (single /health endpoint returning a JSON status object); NO database, NO Prisma, nothing extracted; own root README.md.
- Requirements: Reference stays untouched; npm as the package manager; Frontend_JP npm run build must succeed with standalone output preserved.
- Dependencies: this documentation task only.
- Completion criteria: both repos install and build locally; Frontend_JP renders all 8 sections with all 13 components and zero console errors; side-by-side animation parity spot-check vs Reference (IntroCurtain, Hero, Cube3D rotation, Marquee loop, ScrollProgress, CursorGlow); Backend_JP /health returns HTTP 200 JSON; both pushed to GitHub as new repos (names/visibility confirmed with JP at kickoff); READMEs present.
- Database note: explicitly out of scope. If ever needed → self-hosted PostgreSQL on the VPS (jp_db @ localhost:5432); credentials never written to any file.

Phase 3 — DNS (Porkbun)
- Objective: point johnpaulescuadra.dev (apex + www) at the VPS.
- Outputs: A record for apex → VPS IPv4; matching record for www. (The IPv4 lives in private ops notes — NOT in this public file.)
- Requirements: JP applies the changes in the DNS console (~2 minutes); verification via dig/nslookup.
- Dependencies: a server able to answer HTTP on port 80 for verification (DNS may be pre-staged, but completion requires a listening server).
- Completion criteria: apex and www resolve to the VPS IPv4; port 80 reachable through the domain.

Phase 4 — VPS deployment (Hetzner + nginx + pm2 + SSL)
- Objective: serve Frontend_JP (Next.js standalone) behind nginx; run Backend_JP via pm2 under JP's own process names.
- Outputs: nginx server block(s) proxying to app ports on 127.0.0.1; TLS via certbot (only after DNS resolves); pm2 processes for JP's apps (exact names fixed at execution); firewall allowing only 22/80/443; app ports bound to 127.0.0.1.
- Requirements: nginx configs backed up before edits and nginx -t before every reload; pm2 restarts by explicit process name only; pm2 kill / pm2 delete / pm2 reset never used; pre-existing production processes (the vortex apps) untouched — hard wall; standalone start command confirmed from package.json/server.js at execution time.
- Dependencies: Phase 2 repos on GitHub; Phase 3 DNS resolving (for SSL).
- Completion criteria: https://johnpaulescuadra.dev serves the production build; all 8 sections and animations live; TLS valid; HTTP→HTTPS redirect; pm2 list shows JP's processes Running AND the pre-existing vortex processes with unchanged uptime/restart counters; reboot survival configured.

Phase 5 — Final audit
- Objective: end-to-end verification and documentation closeout.
- Completion criteria: live-site animation check passes (all 13 components verified in a real browser); DNS/TLS green; Road_Map.md/READMEs updated to COMPLETED only with HYDRA-verified evidence; final HYDRA audit report delivered.

Risk register
- History exposure (above).
- GitHub diskUsage: 0 is display lag — pushedAt is authoritative.
- Standalone output currently uses default settings — the nginx reverse-proxy configuration is authored in Phase 4.

Maintenance rules
- Status values limited to COMPLETED / IN PROGRESS / NOT STARTED / BLOCKED.
- A phase may be marked COMPLETED only after HYDRA-verified inspection.
- Completed phases may later be pruned (removal requires audit evidence).

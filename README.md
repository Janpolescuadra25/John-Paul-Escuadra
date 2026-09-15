# John Paul Escuadra - Portfolio Frontend (Frontend_JP)

Frontend repository for the personal portfolio of John Paul Escuadra, split out of the original monorepo (parent repository Janpolescuadra25/John-Paul-Escuadra, split source commit 83e9d4cf314b9d7a99c91068ef3a9cdc6370af0c) as part of the JP_Playbook Phase 2 repository split.

- Canonical production domain: johnpaulescuadra.dev (DNS cutover is handled in a later phase)

## Tech stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma schema and a dormant API route are carried over from the parent but are not active in this repository

## Getting started

- npm install
- npm run dev
- npm run build
- npm run start

npm run dev serves the development build on http://localhost:3000 ; npm run start serves the production build produced by npm run build.

### Scripts note (Windows compatibility)

The build script adapts the parent's POSIX cp static asset copy to a Node.js fs.cpSync step so npm run build works in a Windows PowerShell environment without a Unix shell.

## Documented deviations from the parent tree (audit-approved)

1. package.json: build script uses a Node.js fs.cpSync static asset copy step instead of POSIX cp (Windows compatibility).
2. package-lock.json: added for reproducible npm installs (the parent is bun-focused; bun.lock is preserved unchanged).
3. README.md: this file is new in this repository.
4. src/app/global-error.tsx: added in this repository; not present in the parent commit listed above.
5. All other tracked files are byte-faithful to the parent commit listed above within the application-subset scope; LF content is observed in the 86 tracked text files as committed blobs and is not enforced by repository policy (no .gitattributes exists; both repos inherit system-level core.autocrlf=true as checkout policy).

## Repository status

- Published on GitHub (public): https://github.com/Janpolescuadra25/Frontend_JP
- Remote origin: https://github.com/Janpolescuadra25/Frontend_JP.git (pushes restricted to this remote; force-pushes prohibited)
- Initial commit: 908902ab92307df2e4aee91f3390cf2060a1c30e
- Phase 2 (repository split): COMPLETE - Hydra-certified (BLOCK 5 GO)
- Owned by Phase 5 (final audit), carried forward per the Road_Map alignment audit: live-site rendering check, console-error check, and animation-parity check (the live-site animation check already belonged to Phase 5)

## Scope correction (audit evidence dated 2026-09-11)

Frontend_JP is an application-subset working copy of the parent split-source commit, not a full-tree copy. Tracked file comparison at split-source parent commit 83e9d4c: 259 files in the parent baseline; 91 files tracked in Frontend_JP; 170 files present in the parent baseline at commit 83e9d4c are absent from Frontend_JP (including .zscripts/*, Caddyfile, Road_Map.md, examples/websocket/*, scripts/*, tests); 2 files are child-only (package-lock.json, src/app/global-error.tsx). Line-ending note: LF content is observed in the 86 tracked text files as committed blobs (git index i/lf); the 5 tracked non-text assets (i/-text) are excluded from line-ending observations; LF is not an enforcement mechanism here (no .gitattributes exists; both repos inherit system-level core.autocrlf=true as checkout policy). Historical corrections to earlier wording of this section are preserved in git history.

Last updated: 2026-09-16

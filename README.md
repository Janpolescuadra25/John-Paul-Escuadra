# John Paul Escuadra - Portfolio Frontend (Frontend_JP)

Frontend repository for the personal portfolio of John Paul Escuadra, split out of the original monorepo (parent repository Janpolescuadra25/John-Paul-Escuadra, split source commit 83e9d4cf314b9d7a99c91068ef3a9cdc6370af0c) as part of the JP_Playbook Phase 2 repository split.

- Canonical production domain: johnpaulescuadra.com (DNS cutover is handled in a later phase)

## Tech stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma schema and a dormant API route are carried over from the parent but are not active in this repository

## Getting started

```bash
npm install
npm run dev
npm run build
npm run start
```

`npm run dev` serves the development build on http://localhost:3000 ; `npm run start` serves the production build produced by `npm run build`.

### Scripts note (Windows compatibility)

The build script adapts the parent's POSIX `cp` static asset copy to a Node.js `fs.cpSync` step so `npm run build` works in a Windows PowerShell environment without a Unix shell.

## Documented deviations from the parent tree (audit-approved)

1. `package.json`: build script uses a Node.js `fs.cpSync` static asset copy step instead of POSIX `cp` (Windows compatibility).
2. `package-lock.json`: added for reproducible `npm` installs (the parent is bun-focused; `bun.lock` is preserved unchanged).
3. `README.md`: this file is new in this repository.
4. `src/app/global-error.tsx`: added in this repository; not present in the parent commit listed above.
5. All other tracked files are byte-faithful to the parent commit listed above, with LF line endings enforced repository-wide.

## Status

Local initial commit only. GitHub push and the Backend_JP split are pending (JP_Playbook Phase 2).

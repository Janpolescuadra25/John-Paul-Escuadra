# John Paul Escuadra — portfolio

This repository contains a Next.js 16 App Router single-body site for the portfolio experience. It includes 13 framer-motion components and 8 scroll sections, with standalone output configured for deployment.

## Tech stack
- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind
- framer-motion
- Prisma 6 (dormant)
- SQLite (dormant)
- npm
- Node v22.18.0

## Architecture notes
- output: "standalone" is configured in next.config.ts.
- One API route exists, but it has zero consumers.
- Prisma is dormant; the client is referenced only by src/lib/db.ts.
- Cube3D is a CSS 3D cube using preserve-3d, not a browser 3D runtime.
- DepthFieldBackground renders via a 2D canvas.

## Sections and components
- Render order: Hero, Marquee, About, Ventures, Cube3D, Arsenal, Playground, Contact.
- Components: About, Arsenal, Contact, Cube3D, CursorGlow, DepthFieldBackground, Hero, IntroCurtain, Marquee, Playground, ScrollProgress, SectionHeading, Ventures.

## Getting started
- Read package.json for the available scripts.
- Dev: "next dev -p 3000 2>&1 | tee dev.log"
- Build: "next build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/"
- Start script is defined in package.json for the production entrypoint.

## Decisions log
- Split ruling: Frontend_JP = byte-faithful monolith; Backend_JP = minimal health shell; no database.
- npm was chosen because package-lock.json is present and no alternate package manager is active.
- The repository is public; history exposure is accepted and force-push is prohibited.
- Documentation contains verified facts only.

## Status
- The canonical phase status lives in Road_Map.md at the repository root.

# Backend_JP

Minimal health-check service for the JP portfolio deployment (Phase 2 of the repository split defined in the parent repository's Road_Map.md).

## Status

- Implemented locally on 2026-09-13 and certified by T73 certification + T74-AUDIT code review.
- Live verification: GET /health returned HTTP 200 (pre-push check, 2026-09-15).
- Published on GitHub (public): https://github.com/Janpolescuadra25/Backend_JP
- Remote origin: https://github.com/Janpolescuadra25/Backend_JP.git (pushes restricted to this remote; force-pushes prohibited)
- Initial commit: 0fa6e6d5d6ea49340b66733b7025088f2ce43314
- Phase 2 (repository split): COMPLETE - Hydra-certified (BLOCK 5 GO)

## Purpose

- Provide a single /health endpoint that returns a JSON status object.
- Serve as the minimal Backend_JP shell required by Phase 2: no database, no Prisma, and nothing extracted from the Reference repository.
- Be deployable later (Phase 4) via pm2 under JP's own process names, behind nginx, without code changes.

## Architecture

- Runtime: Node.js (v22.18.0 verified on this machine), zero runtime dependencies, CommonJS, single process, entry point server.js.
- Server: Node built-in node:http; no web framework.
- Binding: 127.0.0.1 only, never 0.0.0.0, per the parent ground rule that backend services are never exposed directly; public exposure happens only through nginx on ports 80/443 in Phase 4.
- Port: 3001 by default, overridable with the PORT environment variable. The bind host stays 127.0.0.1 regardless of PORT.

## Files

- package.json: npm manifest; npm start runs node server.js; zero dependencies, so no install step and no lockfile are required.
- server.js: the entire service (routing, JSON responses, graceful shutdown on SIGINT/SIGTERM).
- .gitignore: ignores node_modules/, *.log, and OS metadata files.
- README.md: this document.

## Behavior

- GET /health: HTTP 200, Content-Type: application/json; charset=utf-8, body {"status":"ok","service":"Backend_JP","time":"<ISO-8601 UTC>"}.
- Any other path: HTTP 404 with JSON body {"status":"error","error":"not_found","path":"<path>"}.
- Non-GET methods on /health: HTTP 405 with JSON body naming the rejected method.
- Query strings are ignored for routing (/health?x=1 routes to /health).
- Responses are never cached (Cache-Control: no-store).

## Decisions

- Zero-dependency Node HTTP server instead of a framework: the service is a health-check shell, and zero dependencies means no install, no lockfile, and a minimal attack surface.
- Default port 3001 is provisional until Phase 4 fixes the nginx-to-app port mapping; the PORT override exists so Phase 4 needs no code change.
- No .gitattributes: this matches the documented Frontend_JP convention. LF content is stored as committed blobs and system-level core.autocrlf=true applies as checkout policy. All implementation files are pure ASCII.
- Git history: fresh history on branch main; remote origin was added during the JP-authorized Phase 2 push. Pushes are restricted to the whitelisted remote; force-pushes are prohibited.

## How to run

npm start

The server prints one line to stdout when listening. Stop with Ctrl+C (SIGINT); SIGTERM is handled identically for future pm2 use.

## How to verify

With the server running: curl http://127.0.0.1:3001/health

Expected: HTTP 200 and a JSON body whose status field is ok. Any other path must return HTTP 404 JSON, and a non-GET request to /health must return HTTP 405 JSON.

## Out of scope

- Database, Prisma, authentication, and any data extracted from Reference.
- DNS, VPS deployment, nginx, and pm2 configuration (Phase 3 / Phase 4).

Last updated: 
2026-09-16

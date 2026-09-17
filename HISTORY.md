# Project History

This file is the historical record of completed and superseded
project phases. Entries are written only after Hydra-verified
adjudication and are not rewritten afterwards; corrections are made
by appending new entries.

## Phase 2 — Repository Split (SUPERSEDED)

- Status: SUPERSEDED
- Completed: 2026-09-13
- Summary: The project was split into two separate GitHub
  repositories (Frontend_JP and Backend_JP). This split was later
  reversed by the T-01 mono-repo migration; the split architecture is
  no longer in effect.
- Superseded by: T-01 — Mono-Repo Migration (below).

## T-01 — Mono-Repo Migration (COMPLETED)

- Status: COMPLETED (2026-09-13)
- Method: A fresh mono-repository was initialized and both former
  repositories were absorbed with git subtree add (no squash),
  preserving their complete commit histories. All 44 execution steps
  passed adjudication.
- Resulting commit graph:
  - 2e01293 — empty root commit
  - 68bc229 — absorbed Frontend_JP (source tip 9d3c918ec3c6...)
  - fecab5a — absorbed Backend_JP (source tip 95032f162e96...)
- Post-migration baseline pin:
  main @ fecab5af6f5e9702d02ca763b3e2ed19e5348166
- Authentication lineage preserved: the T84-C authentication pins
  7ec6503a (Frontend_JP) and 43f849c6 (Backend_JP) remain reachable
  in the absorbed history.
- Safety artifacts:
  - The pre-migration remote main is preserved as the local branch
    backup/jpe-old-main @ 83e9d4cf314b9d7a99c91068ef3a9cdc6370af0c.
  - A complete pre-migration copy of both local repositories is
    preserved outside this repository at _migration_staging\
    (untracked).
- Repository facts after migration: remote
  Janpolescuadra25/John-Paul-Escuadra hosts a single branch (main);
  95 tracked files.

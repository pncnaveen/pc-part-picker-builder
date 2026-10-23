# Agent instructions

<!-- bmad:context -->
<!-- Verified 2026-10-13 against 419e161c4b5f8addc377c373da5b726a19bb5980. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## pc-part-picker-builder

Individuals v1 (India): budget, owned hardware, server-owned compatibility, catalog freshness. **Planning repo until Epic 1:** implementation follows `architecture-pc-part-picker-builder.md` (pnpm monorepo: Nest API, React SPA, worker). BMad v7 in Cursor; active initiative `initiative-pc-part-picker-builder`. Product contract lives under `_bmad-output/initiative-pc-part-picker-builder/` and `_bmad-output/planning-artifacts/epics.md`.

## Policy

- Never commit `.env`, keys, `*.pem`, or `_bmad/custom/config.user.toml`.
- Never implement Invalid vs Warning compatibility logic in `apps/frontend`; render server eval only (AD-2, AD-16, `EXPERIENCE.md`).
- Never write Build state except through `BuildService` / API paths the architecture defines (AD-3).
- Never hand-edit generated artifacts; use the BMad skill or script that owns that output.
- **Git branches:** `main` is production; `development` is the integration branch (created from `main` once, then long-lived). Story and feature work uses `feat-<story-id>` (story id from `epics.md` or epic `tickets.toml`, e.g. `feat-1.1`). Complete work locally and test, then open a PR into `development`. After merge to `development`, promote to `main` via PR (do not land feature work directly on `main` or `development` without review unless the user explicitly requests it).
- **Story implementation branches:** When starting a story (`bmad-build` or manual), use `feat-<story-id>` branched from `development`. If that branch already exists locally or on the remote, check it out and continue — do not create a second branch for the same story. If it does not exist, update `development` (`git fetch` / merge or rebase as the repo already does), then `git checkout -b feat-<story-id> development`. Do not implement story work on `main` or `development` unless the user explicitly requests it.
- **Pull request title and summary:** Open PRs into `development`. **Title** — same pattern as the story GitHub issue: `[<epic>.<story>] <short name>` (e.g. `[1.5] React SPA shell and API CORS baseline`). **Description** — use this order (see [PR #103](https://github.com/pncnaveen/pc-part-picker-builder/pull/103) for Story 1.2):
  1. `## Summary` — bullet list of what changed and why.
  2. Blank line, then `Closes #<N>` on its own line — `N` is the **story** sub-issue (label `story`), not the epic parent. Resolve `N` with e.g. `gh issue list --search "[1.5] in:title"`.
  3. `## Test plan` — checkboxes for verification steps.
  GitHub links the issue and closes it on merge only when `Closes` / `Fixes` / `Resolves` appears in the PR body (a markdown link to the issue is not enough). Optional: comment on the issue with `Implementation PR: #<pr>` for the timeline.

## Where things are

- Contributing (git, PR checklist, standards): `CONTRIBUTING.md`
- PRD, spec companions, glossary: `_bmad-output/initiative-pc-part-picker-builder/prd-pc-part-picker-builder/`, `.../spec-pc-part-picker-builder/`
- Architecture spine: `.../architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md`
- UX (visual + behavior): `.../ux-pc-part-picker-builder/DESIGN.md`, `EXPERIENCE.md` — spines win on conflict with mocks
- Epics and stories: `_bmad-output/planning-artifacts/epics.md`
- BMad config and scripts: `_bmad/`, `_bmad/scripts/`; team overrides `_bmad/custom/config.toml`
- Nest API layout: feature modules under `apps/api/src/<feature>/`; shared delivery infra under `apps/api/src/infrastructure/` (e.g. `persistence/` for Prisma Nest wiring) — see `health/` + `infrastructure/persistence/` as the reference shape

## Running and verifying

- `pnpm install` then `pnpm format:check`, `pnpm lint`, and `pnpm lint:boundaries` (root toolchain; grows with Epic 1 apps).
- Verify BMad: `uv run _bmad/scripts/resolve_config.py --project-root .`
- After Epic 1.2+: `infra/compose.yaml` for Postgres/RabbitMQ/Redis; per-app `dev` scripts under `apps/*`.
- On Windows PowerShell, chain commands with `;` or separate invocations — `&&` is not a valid separator in older PowerShell.

## Conventions that differ from defaults

- `packages/domain` must not import Nest, Prisma, RabbitMQ, Redis, or React — enforce with ESLint + `pnpm lint:boundaries` (AD-16).
- Prisma schema, migrations, and repositories live in `packages/db` only — never in `apps/api`; HTTP response/request shapes stay in `apps/api` (`*.types.ts` or `dto/` beside the controller), not in `packages/domain` or React.
- In `apps/api`, inject narrow port interfaces (Nest injection tokens) into controllers and application services — not `PrismaService` or `@prisma/client`; implement ports in `infrastructure/` using `@pcppb/db` (adapters own Prisma calls).
- Keep one shared `PrismaService` (connection lifecycle) in `infrastructure/persistence/`; feature code reaches the database through ports or future repositories, not by extending the client in handlers.
- Money in API/DB: integer **paise** (INR), not floats.
- Public ids: **ULID** for Build, Part, Account (AD-15).
- HTTP JSON `camelCase`; PostgreSQL `snake_case`; domain terms from `spec-pc-part-picker-builder/glossary.md`.
- Async side effects (scrape, email): worker + outbox — do not block HTTP on SMTP or scrape (AD-6).

## Known pitfalls

- `README.md` planning status can lag artifacts — trust each doc's frontmatter `status` over the README table.
- `.agents/` is gitignored by default; reinstall BMad into the project if skills are missing after clone.

<!-- /bmad:context -->

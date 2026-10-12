# Agent instructions

<!-- bmad:context -->
<!-- Verified 2026-10-12 against f5018bf7ef66e98baa657177052f1d24509f186b. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. Human edits: CONTRIBUTING + toolchain (same day). -->

## pc-part-picker-builder

Individuals v1 (India): budget, owned hardware, server-owned compatibility, catalog freshness. **Planning repo until Epic 1:** implementation follows `architecture-pc-part-picker-builder.md` (pnpm monorepo: Nest API, React SPA, worker). BMad v7 in Cursor; active initiative `initiative-pc-part-picker-builder`. Product contract lives under `_bmad-output/initiative-pc-part-picker-builder/` and `_bmad-output/planning-artifacts/epics.md`.

## Policy

- Never commit `.env`, keys, `*.pem`, or `_bmad/custom/config.user.toml`.
- Never implement Invalid vs Warning compatibility logic in `apps/frontend`; render server eval only (AD-2, AD-16, `EXPERIENCE.md`).
- Never write Build state except through `BuildService` / API paths the architecture defines (AD-3).
- Never hand-edit generated artifacts; use the BMad skill or script that owns that output.
- **Git branches:** `main` is production; `development` is the integration branch (created from `main` once, then long-lived). For each story, epic slice, or feature, branch from `development` as `feat-<story-id>` (use the ticket/story id from `epics.md` or `tickets.toml`). Complete work locally and test, then open a PR into `development`. After merge to `development`, promote to `main` via PR (do not land feature work directly on `main` or `development` without review unless the user explicitly requests it).

## Where things are

- Contributing (git, PR checklist, standards): `CONTRIBUTING.md`
- PRD, spec companions, glossary: `_bmad-output/initiative-pc-part-picker-builder/prd-pc-part-picker-builder/`, `.../spec-pc-part-picker-builder/`
- Architecture spine: `.../architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md`
- UX (visual + behavior): `.../ux-pc-part-picker-builder/DESIGN.md`, `EXPERIENCE.md` — spines win on conflict with mocks
- Epics and stories: `_bmad-output/planning-artifacts/epics.md`
- BMad config and scripts: `_bmad/`, `_bmad/scripts/`; team overrides `_bmad/custom/config.toml`

## Running and verifying

- `pnpm install` then `pnpm format:check`, `pnpm lint`, and `pnpm lint:boundaries` (root toolchain; grows with Epic 1 apps).
- Verify BMad: `uv run _bmad/scripts/resolve_config.py --project-root .`
- After Epic 1.2+: `infra/compose.yaml` for Postgres/RabbitMQ/Redis; per-app `dev` scripts under `apps/*`.
- On Windows PowerShell, chain commands with `;` or separate invocations — `&&` is not a valid separator in older PowerShell.

## Conventions that differ from defaults

- `packages/domain` must not import Nest, Prisma, RabbitMQ, Redis, or React — enforce with ESLint + `pnpm lint:boundaries` (AD-16).
- Prisma and repositories live in `packages/db` only; HTTP DTOs stay in `apps/api` (and mappers), not in React.
- Money in API/DB: integer **paise** (INR), not floats.
- Public ids: **ULID** for Build, Part, Account (AD-15).
- HTTP JSON `camelCase`; PostgreSQL `snake_case`; domain terms from `spec-pc-part-picker-builder/glossary.md`.
- Async side effects (scrape, email): worker + outbox — do not block HTTP on SMTP or scrape (AD-6).

## Known pitfalls

- `README.md` planning status can lag artifacts — trust each doc's frontmatter `status` over the README table.
- `.agents/` is gitignored by default; reinstall BMad into the project if skills are missing after clone.

<!-- /bmad:context -->

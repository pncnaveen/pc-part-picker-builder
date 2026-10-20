# Contributing

Thanks for working on PC Part Picker Builder. This doc covers **git workflow**, **quality gates**, and **coding expectations**. Architecture and product contracts live in `_bmad-output/`; agents also read `AGENTS.md`.

## Git workflow

| Branch            | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `main`            | Production                                                    |
| `development`     | Integration (created from `main` once, then long-lived)       |
| `feat-<story-id>` | Story / epic slice / feature work — branch from `development` |

1. Branch from `development`: `feat-1.1`, `feat-5.4`, etc. (story ref from `tickets.py` / epic `tickets.toml` — e.g. **1.1** = Epic 1 story 1; see [`initiative-pc-part-picker-builder/tickets.toml`](_bmad-output/initiative-pc-part-picker-builder/tickets.toml)).
2. Implement and test locally.
3. Open a **PR into `development`** — close the **story sub-issue** (`Closes #N`; find it with `gh issue list --search "[1.1] in:title"`). Epic trackers are parent issues (label `epic`).
4. After merge, promote **`development` → `main`** via PR when ready for production.

Do not push feature work directly to `main` or `development` without review unless explicitly agreed for a hotfix.

## Before you open a PR

- [ ] Branch name matches `feat-<story-id>`.
- [ ] `pnpm format:check` and `pnpm lint` pass (root; per-package when apps exist).
- [ ] Tests added or updated for behavior you changed (when test scripts exist).
- [ ] No compatibility **Invalid/Warning** logic in `apps/frontend` — render API eval only ([AD-2](_bmad-output/initiative-pc-part-picker-builder/architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md), [`EXPERIENCE.md`](_bmad-output/initiative-pc-part-picker-builder/ux-pc-part-picker-builder/EXPERIENCE.md)).
- [ ] Build mutations go through **BuildService** / documented API paths only ([AD-3](_bmad-output/initiative-pc-part-picker-builder/architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md)).
- [ ] Schema changes include a Prisma migration under `packages/db` (once Epic 1.3+ exists).
- [ ] UI changes: screenshot or short note in the PR for reviewer context.

## Toolchain

- **Node.js** 24.x LTS, `>=24.21.0 <25` (see `package.json` `engines`; `.nvmrc` selects latest 24.x).
- **pnpm** via **Corepack** (recommended): `corepack enable` then `corepack prepare pnpm@10.12.1 --activate` (matches `packageManager` in `package.json`).
- **pnpm** workspace — install from repo root: `pnpm install`.
- **BMad scripts:** `uv run _bmad/scripts/resolve_config.py --project-root .`

On **Windows PowerShell**, chain commands with `;` — `&&` is not reliable on older shells.

### Root scripts (grow with Epic 1)

| Command                | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `pnpm format`          | Prettier write                              |
| `pnpm format:check`    | Prettier CI check                           |
| `pnpm lint`            | ESLint                                      |
| `pnpm lint:boundaries` | dependency-cruiser (domain layering)        |
| `pnpm build`           | TypeScript build for all workspace packages |

Local Postgres, RabbitMQ, and Redis: `docker compose -f infra/compose.yaml up -d` (see [README](README.md#local-infrastructure-docker-compose)). Env vars for `api` / `worker`: [`.env.example`](.env.example).

Per-app `dev` and `test` commands live under `apps/*` as later Epic 1 stories land.

## Coding standards

### Layering ([AD-16](_bmad-output/initiative-pc-part-picker-builder/architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md))

- **`packages/domain`:** pure domain logic — **no** Nest, Prisma, RabbitMQ, Redis, React, or HTTP clients.
- **`packages/db`:** Prisma schema, migrations, repositories; map to domain at the edge.
- **`apps/api` / `apps/worker`:** delivery adapters; call application services, not Prisma from controllers/handlers.
- **`apps/frontend`:** feature folders (`features/build`, `features/catalog`); API client + hooks; thin UI.

Run `pnpm lint:boundaries` whenever you change `packages/domain` imports (Story 1.4+).

### Types and data

- **Money:** integer **paise** (INR), never floats.
- **Public ids:** **ULID** for Build, Part, Account.
- **API JSON:** `camelCase`; **PostgreSQL:** `snake_case`.
- **Errors:** `{ code, message, details? }` with stable `code` values.
- **Vocabulary:** [`glossary.md`](_bmad-output/initiative-pc-part-picker-builder/spec-pc-part-picker-builder/glossary.md) for domain terms.

### TypeScript

- `strict` mode in package tsconfigs (extend root `tsconfig.base.json`).
- Avoid `any`; use `unknown` + narrowing when needed.
- Shared types live in `packages/shared` when both API and SPA need them — not duplicated DTOs.

### Tests (priority order)

1. Domain / compatibility rules (unit, table-driven).
2. `BuildService` + gates (integration with Postgres).
3. API auth and save/share/complete gates.
4. Frontend: render from **fixture API payloads**; E2E sparingly until flows stabilize.

### Secrets and generated files

- Never commit `.env`, keys, or `_bmad/custom/config.user.toml`.
- Do not hand-edit generated output (Prisma client, codegen) — run the owning script.

## References

- Architecture spine: `_bmad-output/initiative-pc-part-picker-builder/architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md`
- UX: `DESIGN.md` + `EXPERIENCE.md` under `ux-pc-part-picker-builder/`
- Epics: `_bmad-output/planning-artifacts/epics.md`

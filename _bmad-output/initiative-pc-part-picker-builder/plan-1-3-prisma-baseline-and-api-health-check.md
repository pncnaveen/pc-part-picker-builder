---
title: '1.3 Prisma baseline and API health check'
type: 'feature'
ticket: '3'
created: '2026-10-13'
status: 'in-review'
baseline_revision: '419e161c4b5f8addc377c373da5b726a19bb5980'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context:
  - '_bmad-output/initiative-pc-part-picker-builder/architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The monorepo has Prisma wired only at generator/datasource level; the API does not prove Postgres connectivity or expose a health endpoint.

**Approach:** Add an initial Prisma migration with no domain models, a small `@pcppb/db` helper that pings Postgres via `SELECT 1`, and a Nest `GET /health` that reports overall status and database reachability.

## Boundaries & Constraints

**Always:** Prisma schema and migrations live in `packages/db` only; money/domain tables stay out of this story; HTTP JSON uses `camelCase`.

**Never:** Import Prisma in `packages/domain`; add Build/Part/Account models; block HTTP on RabbitMQ or Redis.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Healthy DB | Compose up, migrations applied, `DATABASE_URL` set | `GET /health` → 200, body includes success and database up | No error expected |
| DB unreachable | API started without Postgres | `GET /health` → 503, database check failed | Log internally; no stack in JSON |

</frozen-after-approval>

## Code Map

- `packages/db/prisma/schema.prisma` — keep datasource-only (no domain models); baseline for migrations.
- `packages/db/src/index.ts` — export client factory and `pingDatabase`.
- `packages/db/package.json` — add `migrate:dev` / `migrate:deploy` scripts.
- `apps/api/package.json` — workspace dep on `@pcppb/db`, `dotenv`.
- `apps/api/src/main.ts` — load repo-root `.env` before bootstrap.
- `apps/api/src/health/*` — controller + module for `/health`.
- `apps/api/src/prisma/prisma.module.ts` — Nest provider wrapping `PrismaClient` from `@pcppb/db`.
- `README.md` — document migrate + health curl steps.

## Tasks & Acceptance

**Execution:**
- [x] `packages/db/prisma/migrations/` — initial migration (no domain tables).
- [x] `packages/db/src/` — `createPrismaClient`, `pingDatabase`, update exports.
- [x] `apps/api/src/` — Prisma module, health module, wire `AppModule`.
- [x] `README.md` — Story 1.3 verification commands.

**Acceptance Criteria:**
- Given Docker Compose is up and `DATABASE_URL` is configured, when I run Prisma migrate and start `apps/api`, then `GET /health` returns success and confirms database reachability.
- Given migrations are applied, when I inspect the database schema, then only `_prisma_migrations` exists (no premature domain tables).

## Implementation Notes

- `@pcppb/db` compiled as CommonJS so Nest (`apps/api`) can import it without ESM/CJS friction.
- `GET /health` uses `pingDatabase` (`SELECT 1`); initial migration SQL is empty (only `_prisma_migrations`).

## Plan Change Log

## Review Triage Log

## Verification

**Commands:**
- `pnpm install` -- workspace links resolve.
- `pnpm --filter @pcppb/db run build` -- generate client and compile.
- `pnpm --filter @pcppb/api run build` -- Nest compiles with db dependency.
- `pnpm format:check` / `pnpm lint` -- pass.
- With Compose up: `pnpm --filter @pcppb/db exec prisma migrate deploy` then `curl http://localhost:3000/health` -- 200 with database ok.

**Manual checks (if no CLI):**
- Confirm response JSON uses camelCase keys.

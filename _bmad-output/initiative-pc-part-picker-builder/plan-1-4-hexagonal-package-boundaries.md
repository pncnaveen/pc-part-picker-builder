---
title: '1.4 Hexagonal package boundaries'
type: 'feature'
ticket: '4'
created: '2026-10-14'
status: 'in-review'
baseline_revision: '8b067994b6ecd861cbee2d7af008422bf3e664b5'
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

**Problem:** AD-16 layering is documented but the worker does not connect to RabbitMQ yet; boundary enforcement should cover workspace infra paths and be documented for daily use.

**Approach:** Tighten dependency-cruiser and ESLint for `packages/domain`, implement a worker bootstrap that connects to RabbitMQ via `RABBITMQ_URL` with no consumers, and document verify steps in README.

## Boundaries & Constraints

**Always:** `packages/domain` stays framework-free; worker is a delivery adapter only; use env from root `.env` like `apps/api`.

**Never:** Add business consumers or domain logic in the worker; import Prisma/Nest into `packages/domain`.

</frozen-after-approval>

## Code Map

- `dependency-cruiser.config.cjs` — add forbidden edges from domain to `packages/db` and `apps/*`.
- `eslint.config.mjs` — restrict `@pcppb/db` in `packages/domain`.
- `apps/worker/src/main.ts` — dotenv + connect + graceful shutdown.
- `apps/worker/src/messaging/connect-rabbitmq.ts` — amqplib connect helper.
- `README.md` — Story 1.4 worker + `pnpm lint:boundaries`.

## Tasks & Acceptance

**Execution:**
- [x] Boundary rules in depcruise + ESLint.
- [x] Worker RabbitMQ skeleton.
- [x] README verification.

**Acceptance Criteria:**
- Given the workspace builds, when I run `pnpm lint:boundaries` and `pnpm lint`, then `packages/domain` cannot import framework or infra packages.
- Given Compose is up, when I start `apps/worker`, then it connects to RabbitMQ and does not process business jobs.

## Implementation Notes

## Verification

**Commands:**
- `pnpm build` / `pnpm lint` / `pnpm lint:boundaries`
- Compose up: `pnpm --filter @pcppb/worker run dev` — log shows RabbitMQ connected

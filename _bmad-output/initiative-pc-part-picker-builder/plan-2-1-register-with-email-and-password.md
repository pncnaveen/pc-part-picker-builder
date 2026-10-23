---
title: '2.1 Register with email and password'
type: 'feature'
ticket: '1'
created: '2026-10-23'
status: 'ready-for-dev'
baseline_revision: '0d69681ae02324f773d15b274cc04c2a4dad1b18'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context:
  - '_bmad-output/initiative-pc-part-picker-builder/architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md'
  - '_bmad-output/initiative-pc-part-picker-builder/ux-pc-part-picker-builder/EXPERIENCE.md'
  - '_bmad-output/planning-artifacts/epics.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Prospective builders cannot create an Account; Epic 1 left Prisma with no domain tables and the SPA has no auth routes.

**Approach:** Add `Account` persistence (ULID public id, hashed password, `verified=false`), a Nest `POST /auth/register` that validates input and enqueues verification via the transactional outbox (AD-6), and a thin `/register` SPA form that calls the API. Do not establish a logged-in session on register (login is Story 2.3).

## Boundaries & Constraints

**Always:** Prisma schema and migrations in `packages/db` only; API uses port/adapters (no Prisma in controllers); passwords hashed with a vetted algorithm (never stored plain); public Account id is ULID; JSON `camelCase` / PG `snake_case`; errors `{ code, message, details? }`; verification work is durable in PostgreSQL outbox before any RabbitMQ publish.

**Never:** OAuth; auto-login or httpOnly session cookie on register; login/logout endpoints (2.3); email link consumption / `verified=true` (2.2); password reset (2.4); save/build APIs; import Prisma or Nest into `packages/domain`.

**Password policy (domain, authoritative):** Length **8–12** characters inclusive; not empty; **no whitespace** anywhere (space, tab, newline, etc.). May include digits `0–9`, letters `A–Z` / `a–z`, and **special characters**. No required mix of upper, lower, or digit.

**Email normalization (domain):** `trim` whitespace; lowercase full address for storage and uniqueness; reject empty or invalid format before persistence.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy register | Logged out; valid unique email + password | 201; Account `verified=false`; outbox row for verification email job | No session cookie |
| Duplicate email | Email already registered | 409; stable `code` (e.g. `EMAIL_ALREADY_REGISTERED`); no new Account | Generic message; no leak of hash |
| Invalid email | Malformed email | 400; validation `code` | Field-level `details` optional |
| Weak password | Length under 8 or over 12, empty, or contains whitespace | 400; validation `code` | Message states 8–12 chars and no spaces |
| DB down | Postgres unreachable | 503 on register | Same shape as health failure pattern |

</frozen-after-approval>

## Code Map

- `packages/db/prisma/schema.prisma` — `Account`, `EmailVerificationToken` (or equivalent), minimal `MessageOutbox` per AD-6; snake_case columns, ULID `id` on Account.
- `packages/db/prisma/migrations/` — new migration for auth tables.
- `packages/db/src/` — repository helpers or exports used by API adapters (keep Prisma types out of domain).
- `packages/domain/src/` — pure `normalizeEmail`, password policy validation, registration input types (no frameworks).
- `packages/shared/src/` — stable API error codes / register request-response wire types if shared with SPA.
- `apps/api/src/auth/` — feature module: `register.controller.ts`, `register.types.ts`, `register-account.port.ts`, application service orchestrating domain + ports.
- `apps/api/src/infrastructure/persistence/` — Prisma adapters implementing account + outbox ports; reuse `PrismaService`.
- `apps/api/src/app.module.ts` — import `AuthModule`.
- `apps/api/package.json` — password hashing lib (e.g. `argon2` or `bcrypt`), `ulid`, `@nestjs/swagger`, Jest + `@nestjs/testing` for API tests.
- `apps/api/src/main.ts` — OpenAPI/Swagger UI (dev: e.g. `/api/docs`; document `POST /auth/register`).
- `apps/frontend/src/app/` — add `react-router-dom` routes: `/` (existing health shell), `/register`.
- `apps/frontend/src/features/auth/` — register form component, hook, `types.ts` (UI state only).
- `apps/frontend/src/api/auth/fetch-register.ts` + `api/paths.ts` — POST register via `createHttpClient()`.
- `apps/frontend/src/api/types/auth.types.ts` — wire JSON aligned with API `register.types.ts`.
- `apps/frontend/` — Vitest + Testing Library; unit tests for register form/hook (validation messaging, submit success/error).
- `package.json` (root) — optional `test` script aggregating workspace test runs when added.
- `README.md` — Story 2.1 migrate + curl register + Swagger URL + `pnpm test` for this story.

Reuse: `health/` hexagonal pattern (controller → port → `infrastructure/persistence` adapter); `main.ts` CORS with `credentials: true` for future cookies; root `.env` `DATABASE_URL`.

Do not change: worker business consumers (no verification email send required in 2.1—outbox row proves “triggered”); compat or Build logic.

## Tasks & Acceptance

**Execution:**
- [ ] `packages/domain/src/` — `normalizeEmail`, `validatePassword` (8–12, no whitespace, specials allowed) + Vitest unit tests (table-driven).
- [ ] `packages/db/prisma/` — Account + verification token + outbox models and migration.
- [ ] `packages/db/src/` — expose any register persistence helpers needed by API adapter.
- [ ] `apps/api/src/auth/` — register endpoint, DTO/types, service, module; `ValidationPipe` for JSON shape only; domain rules in application service.
- [ ] `apps/api/src/auth/*.spec.ts` — Nest testing module tests for register (201 happy path, 400 invalid password/email, 409 duplicate) with port mocked.
- [ ] `apps/api/src/main.ts` + `apps/api/package.json` — Swagger/OpenAPI for register and shared error shape.
- [ ] `apps/api/src/infrastructure/persistence/` — account repository + outbox insert in one transaction.
- [ ] `apps/frontend/` — router, register page, fetch helper, accessible form; Vitest tests for UI/hook.
- [ ] `README.md` — verification steps for Story 2.1.

**Testing:** Follow global rules in `CONTRIBUTING.md` § Tests (all epics). Story 2.1 bootstraps Vitest/Jest scripts where missing.

**Acceptance Criteria:**
- Given I am logged out, when I submit valid email and password on the registration form, then an Account is created with `verified=false` and a verification outbox entry exists for that account.
- Given a successful registration response, when I inspect response headers, then no httpOnly session cookie is set and the UI does not treat the user as verified-for-save.
- Given a duplicate email, when I submit register again, then the API returns a stable error shape and no second Account is created.
- Given the workspace, when I run `pnpm format:check`, `pnpm lint`, `pnpm lint:boundaries`, and story test scripts (`pnpm --filter @pcppb/domain test`, `@pcppb/api test`, `@pcppb/frontend test`), then all pass.
- Given API dev server, when I open Swagger UI, then `POST /auth/register` is documented with request/response schemas and error codes.

## Implementation Notes

## Plan Change Log

## Review Triage Log

## Design Notes

- Register response body: public `accountId` (ULID) + neutral message (“check your email”) — no password or token in JSON.
- Verification token: store only a hash in PG; outbox payload carries account id + job type for worker (Story 2.2+).
- Password hash: prefer Argon2id or bcrypt with cost documented in implementation notes.
- `validatePassword`: reject `\s` via regex or character scan; length check before hash; specials allowed (punctuation, symbols) with no composition rules.
- Swagger: enabled in non-production by default; production exposure gated by env if needed.

## Verification

**Commands:**
- `pnpm install` — workspace links.
- `pnpm --filter @pcppb/db exec prisma migrate deploy` — auth tables applied.
- `pnpm build` / `pnpm format:check` / `pnpm lint` / `pnpm lint:boundaries` — pass.
- `pnpm --filter @pcppb/domain test` / `@pcppb/api test` / `@pcppb/frontend test` — pass.
- With Compose + API dev: `curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Pass!234\"}"` — 201; row in `accounts` with `verified=false` and matching outbox row.
- Open `http://localhost:3000/api/docs` (or configured path) — register operation visible.

**Manual checks (if no CLI):**
- Open `http://localhost:5173/register`, submit form, confirm success messaging and no logged-in chrome.

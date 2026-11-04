---
title: '2.1 Register with email and password'
type: 'feature'
ticket: '1'
created: '2026-10-23'
status: 'ready-for-dev'
baseline_revision: '8f995f6be27759d2c28b1d07cb031f381d4529d5'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context:
  - '_bmad-output/initiative-pc-part-picker-builder/architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md'
  - '_bmad-output/initiative-pc-part-picker-builder/spec-pc-part-picker-builder/spec-pc-part-picker-builder.md'
  - '_bmad-output/initiative-pc-part-picker-builder/spec-pc-part-picker-builder/auth-password-policy.md'
  - '_bmad-output/initiative-pc-part-picker-builder/ux-pc-part-picker-builder/EXPERIENCE.md'
  - '_bmad-output/planning-artifacts/epics.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Prospective builders cannot create an Account; Epic 1 left Prisma with no domain tables and the SPA has no auth routes.

**Approach:** Add `Account` persistence (ULID public id, hashed password, `verified=false`), a Nest `POST /auth/register` that validates input and enqueues verification via the transactional outbox (AD-6), and a thin `/register` SPA form that calls the API. Do not establish a logged-in session on register (login is Story 2.3).

## Boundaries & Constraints

**Always:** Prisma schema and migrations in `packages/db` only; API uses port/adapters (no Prisma in controllers); passwords hashed with a vetted algorithm (never stored plain); public Account id is ULID; JSON `camelCase` / PG `snake_case`; errors `{ code, message, details? }` with stable `code` values documented in Design Notes; on successful register, persist **hashed** `EmailVerificationToken`, **outbox row** (payload fields worker 2.2 needs), and `Account` in **one transaction**; verification work is durable in PostgreSQL outbox (AD-6) — **2.1 stops at the outbox row** (no relay publish to RabbitMQ in this story).

**Never:** OAuth; auto-login or httpOnly session cookie on register; login/logout endpoints (2.3); email link consumption / `verified=true` (2.2); password reset (2.4); save/build APIs; import Prisma or Nest into `packages/domain`; Tailwind/shadcn bootstrap or shadcn Auth form components in 2.1 (use semantic HTML per EXPERIENCE behavior); outbox relay or RabbitMQ publish in 2.1.

**Password policy (domain, authoritative):** Length **8–12** characters inclusive; not empty; **no whitespace** anywhere (space, tab, newline, etc.). May include digits `0–9`, letters `A–Z` / `a–z`, and **special characters**. No required mix of upper, lower, or digit.

**Email normalization (domain):** `trim` whitespace; lowercase full address for storage and uniqueness; reject empty or invalid format before persistence.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy register | Logged out; valid unique email + password | 201; Account `verified=false`; outbox row for verification email job | No session cookie |
| Duplicate email | Email already registered (normalized) | 409; `code` `EMAIL_ALREADY_REGISTERED`; no new Account | Generic message; no leak of hash |
| Invalid email | Malformed email | 400; `code` `INVALID_EMAIL` | Optional field-level `details` (e.g. `field: email`) |
| Weak password | Length under 8 or over 12, empty, or contains whitespace | 400; `code` `INVALID_PASSWORD` | Message states 8–12 chars and no spaces; optional `details` (`field: password`) |
| DB down | Postgres unreachable | 503 on register | Same shape as health failure pattern |

</frozen-after-approval>

## Code Map

- `packages/db/prisma/schema.prisma` — `Account`, `EmailVerificationToken` (or equivalent), minimal `MessageOutbox` per AD-6; snake_case columns, ULID `id` on Account.
- `packages/db/prisma/migrations/` — new migration for auth tables.
- `packages/db/src/` — repository helpers or exports used by API adapters (keep Prisma types out of domain).
- `packages/domain/src/` — pure `normalizeEmail`, `isValidEmail` (pragmatic format check), `validatePassword`, registration input types (no frameworks).
- `packages/shared/src/` — stable API error codes / register request-response wire types if shared with SPA.
- `apps/api/src/auth/` — feature module: `register.controller.ts`, `register.types.ts`, `register-account.port.ts`, application service orchestrating domain + ports.
- `apps/api/src/infrastructure/persistence/` — Prisma adapters implementing account + outbox ports; reuse `PrismaService`.
- `apps/api/src/app.module.ts` — import `AuthModule`.
- `apps/api/package.json` — password hashing lib (e.g. `argon2` or `bcrypt`), `ulid`, `@nestjs/swagger`, Jest + `@nestjs/testing` for API tests.
- `apps/api/src/main.ts` — OpenAPI/Swagger UI (dev: e.g. `/api/docs`; document `POST /auth/register`).
- `apps/frontend/src/app/` — add `react-router-dom` routes: `/` (existing health shell), `/register`.
- `apps/frontend/src/features/auth/` — register form (semantic HTML, visible labels, ARIA per EXPERIENCE; no shadcn in 2.1), hook, `types.ts` (UI state only).
- `apps/frontend/src/api/auth/fetch-register.ts` + `api/paths.ts` — POST register via `createHttpClient()`.
- `apps/frontend/src/api/types/auth.types.ts` — wire JSON aligned with API `register.types.ts`.
- `apps/frontend/` — Vitest + Testing Library; unit tests for register form/hook (validation messaging, submit success/error).
- `package.json` (root) — optional `test` script aggregating workspace test runs when added.
- `README.md` — Story 2.1 migrate + curl register + Swagger URL + `pnpm test` for this story.

Reuse: `health/` hexagonal pattern (controller → port → `infrastructure/persistence` adapter); `main.ts` CORS with `credentials: true` for future cookies; root `.env` `DATABASE_URL`.

Do not change: worker business consumers, outbox relay, or RabbitMQ publish (2.1 proves durable outbox + token hash only); compat or Build logic.

## Tasks & Acceptance

**Execution:**
- [ ] `packages/domain/` — add Vitest `test` script if missing; `normalizeEmail`, `isValidEmail`, `validatePassword` (8–12, no whitespace, specials allowed) + table-driven unit tests.
- [ ] `packages/db/prisma/` — `Account`, `EmailVerificationToken` (hash only), `MessageOutbox` models and migration; token + outbox + account created in one transaction on register.
- [ ] `packages/db/src/` — expose any register persistence helpers needed by API adapter.
- [ ] `apps/api/src/auth/` — register endpoint, DTO/types, service, module; `ValidationPipe` for JSON shape only; domain rules in application service.
- [ ] `apps/api/src/auth/*.spec.ts` — Nest testing module tests for register (201 happy path, 400 invalid password/email, 409 duplicate) with port mocked.
- [ ] `apps/api/src/main.ts` + `apps/api/package.json` — Jest `test` script, Swagger/OpenAPI for register and shared error shape.
- [ ] `apps/api/src/infrastructure/persistence/` — account repository + outbox insert in one transaction.
- [ ] `apps/frontend/` — Vitest + Testing Library `test` script, `react-router-dom`, register page, fetch helper, semantic accessible form (EXPERIENCE states); Vitest tests for UI/hook.
- [ ] `packages/shared/src/` — register wire types and documented register error `code` constants shared with API/SPA.
- [ ] `README.md` — verification steps for Story 2.1.

**Testing:** Follow global rules in `CONTRIBUTING.md` § Tests (all epics). Story 2.1 bootstraps Vitest/Jest scripts where missing.

**Acceptance Criteria:**
- Given I am logged out, when I submit valid email and password on the registration form, then an Account is created with `verified=false`, a hashed `EmailVerificationToken` row exists, and a verification outbox entry exists with payload fields worker 2.2 needs (same DB transaction).
- Given a successful registration response, when I inspect response headers, then no httpOnly session cookie is set and the UI does not treat the user as verified-for-save.
- Given a duplicate normalized email, when I submit register again, then the API returns `409` with `code` `EMAIL_ALREADY_REGISTERED` and no second Account is created.
- Given invalid email or password on the API, when I submit register, then the API returns `400` with `code` `INVALID_EMAIL` or `INVALID_PASSWORD` respectively (documented in Swagger and `packages/shared`).
- Given the register page at `/register`, when the form is shown, then the password field has persistent helper text (8–12 characters, no spaces) and a link to sign in (`/login` route may 404 until Story 2.3 — link still present).
- Given I submit valid credentials, when the request is in flight, then the primary submit control is disabled, field values are preserved, and loading is indicated accessibly.
- Given a successful register from the UI, when the API returns success, then an inline success message tells me to check my email (not toast-only) and no signed-in chrome appears.
- Given the API returns `INVALID_PASSWORD` or `INVALID_EMAIL`, when the UI renders the error, then the matching field shows the server `message` and password helper text remains visible for password errors.
- Given the API returns `EMAIL_ALREADY_REGISTERED`, when the UI renders the error, then the email field shows the server message with generic copy (no password-hint leakage).
- Given a network or `5xx` failure on submit, when the UI renders the error, then I see a recoverable message and can retry submit without losing field values.
- Given the workspace, when I run `pnpm format:check`, `pnpm lint`, `pnpm lint:boundaries`, and story test scripts (`pnpm --filter @pcppb/domain test`, `@pcppb/api test`, `@pcppb/frontend test`), then all pass.
- Given API dev server, when I open Swagger UI, then `POST /auth/register` is documented with request/response schemas and error codes `INVALID_EMAIL`, `INVALID_PASSWORD`, `EMAIL_ALREADY_REGISTERED`.

## Implementation Notes

## Plan Change Log

- 2026-10-23 — Pre-impl review: refreshed `baseline_revision` and `context`; UX AC; semantic HTML UI (no shadcn in 2.1); token hash + outbox in one transaction; AD-6 slice = PG outbox only; `isValidEmail`; stable error codes in shared + Swagger.

## Review Triage Log

## Design Notes

- Register response body: public `accountId` (ULID) + neutral message (“check your email”) — no password or token in JSON.
- Verification token (2.1): generate at register; store **only a hash** in `EmailVerificationToken`; plain token never in API JSON or logs. Outbox payload includes at least `accountId`, job type (e.g. `email_verification`), and whatever identifiers worker 2.2 needs to load the token row and send mail — **no RabbitMQ publish in 2.1**.
- **Stable register error codes (v1):** `INVALID_EMAIL` (400), `INVALID_PASSWORD` (400), `EMAIL_ALREADY_REGISTERED` (409). Define in `packages/shared` and reference from API + OpenAPI; SPA maps `code` to fields.
- **Register UI (2.1):** Semantic HTML form matching EXPERIENCE **Auth form** / register **State Patterns** (helper, server-driven errors, inline success). Optional HTML `minLength`/`maxLength` 8–12 on password aligned with policy; no client rules weaker than server.
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

# Branch walkthrough — feat-2.1 (Story 2.1 register)

**Target:** `feat-2.1` vs `development` — committed plan/docs (12 files) plus uncommitted implementation on the branch unless review scope is narrowed.

**Current block:** — (walkthrough complete; all blocks accepted)

### Keeping this walkthrough current

While this review is active, **update this file and [walkthrough-feat-2.1-log.md](./walkthrough-feat-2.1-log.md) whenever we add or change implementation code or paths** (not only when a block is accepted): adjust the relevant block’s links and short mechanism notes, and append a brief log entry (what changed, which paths). Findings and test results stay in the log; the narrative stays the human-facing map.

---

## Block 1 — Intent

- [x] **Intent** (accepted)

**Problem:** Prospective builders cannot create an Account; Epic 1 left Prisma with no domain tables and the SPA has no auth routes.

**Approach:** Add `Account` persistence (ULID public id, hashed password, `verified=false`), a Nest `POST /auth/register` that validates input and enqueues verification via the transactional outbox (AD-6), and a thin `/register` SPA form that calls the API. Do not establish a logged-in session on register (login is Story 2.3).

*Source: frozen Intent in [plan-2-1-register-with-email-and-password.md](../plan-2-1-register-with-email-and-password.md).*

---

## Block 2 — Broad strokes

- [x] **Broad strokes** (accepted)

Register flows from the SPA through the API into a single Prisma transaction (account, hashed verification token, outbox row). Entry points to open first:

1. [register.service.ts](../../../apps/api/src/auth/register.service.ts) — `processRegistrationEmail` + `validatePassword`, then hashing and port call.
2. [prisma-register-account.adapter.ts](../../../apps/api/src/infrastructure/persistence/prisma-register-account.adapter.ts) — transactional persistence.
3. [schema.prisma](../../../packages/db/prisma/schema.prisma) — `Account`, `EmailVerificationToken`, `MessageOutbox`.
4. [RegisterPage.tsx](../../../apps/frontend/src/features/auth/pages/RegisterPage.tsx) — `/register` UI shell.
5. [Code map](../plan-2-1-register-with-email-and-password.md#code-map) — full file checklist.

---

## Block 3 — Domain and shared contracts

- [x] **Slice: domain + shared** (accepted)

Pure email/password rules live in `packages/domain`; stable error codes and wire types in `packages/shared` for API and SPA alignment.

**Email:** [processRegistrationEmail](../../../packages/domain/src/auth/email.ts) is the **only** exported register-email API; shared [auth.types.ts](../../../packages/domain/src/auth/auth.types.ts) and [auth.constants.ts](../../../packages/domain/src/auth/auth.constants.ts) hold result types, `EMAIL_FORMAT`, and password patterns/length bounds.

**Password:** [validatePassword](../../../packages/domain/src/auth/password.ts) enforces **8–12**, no whitespace (see [auth-password-policy.md](../spec-pc-part-picker-builder/auth-password-policy.md)).

**Shared codes:** [register.codes.ts](../../../packages/shared/src/auth/register.codes.ts) uses a `as const` map plus `RegisterErrorCode = (typeof REGISTER_ERROR_CODES)[keyof typeof REGISTER_ERROR_CODES]` so wire strings stay one source of truth (enum optional but not used in this repo).

- [auth.types.ts](../../../packages/domain/src/auth/auth.types.ts), [auth.constants.ts](../../../packages/domain/src/auth/auth.constants.ts)
- [email.ts](../../../packages/domain/src/auth/email.ts), [password.ts](../../../packages/domain/src/auth/password.ts)
- [register.codes.ts](../../../packages/shared/src/auth/register.codes.ts), [register.types.ts](../../../packages/shared/src/auth/register.types.ts)
- Tests: [email.test.ts](../../../packages/domain/test/auth/email.test.ts) (includes `processRegistrationEmail`), [password.test.ts](../../../packages/domain/test/auth/password.test.ts)

**Tooling:** After changing domain exports, run `pnpm --filter @pcppb/domain build` so `apps/api` resolves updated `dist/index.d.ts`.

---

## Block 4 — Database and persistence adapter

- [x] **Slice: DB** (accepted)

Migration and models; adapter implements `RegisterAccountPort` with one transaction using dedicated table mappers.

- [migration.sql](../../../packages/db/prisma/migrations/20261023120000_auth_tables/migration.sql)
- [prisma-register-account.adapter.ts](../../../apps/api/src/infrastructure/persistence/prisma-register-account.adapter.ts)
- [register-account.port.ts](../../../apps/api/src/auth/register-account.port.ts); persistence input + adapter errors in [register.types.ts](../../../apps/api/src/auth/register.types.ts) and [register.errors.ts](../../../apps/api/src/auth/register.errors.ts)

---

## Block 5 — API surface

- [x] **Slice: API** (accepted)

`POST /auth/register` (201): controller validates a minimal JSON shape, delegates to [register.service.ts](../../../apps/api/src/auth/register.service.ts) (domain validation, bcrypt, token/outbox ids, port call), and Swagger DTOs live in [register.types.ts](../../../apps/api/src/auth/register.types.ts). `AuthModule` binds the Prisma adapter to `REGISTER_ACCOUNT_PORT`; [app.module.ts](../../../apps/api/src/app.module.ts) imports `AuthModule`.

**Errors:** Shared [ApiApplicationError](../../../apps/api/src/infrastructure/http/api-application.error.ts) (`status`, `code`, `message`, `details?`, `toHttpException()`). Register throws pre-built [RegisterApplicationError](../../../apps/api/src/auth/register.errors.ts) instances (extends the base); adapter failures are caught in the service and rethrown as matching HTTP errors. Controller `try/catch` maps any `ApiApplicationError` via `toHttpException()`. Malformed bodies get `INVALID_REQUEST` (400) from the controller only.

- [api-application.error.ts](../../../apps/api/src/infrastructure/http/api-application.error.ts)
- [register.controller.ts](../../../apps/api/src/auth/register.controller.ts)
- [register.service.ts](../../../apps/api/src/auth/register.service.ts)
- [register.types.ts](../../../apps/api/src/auth/register.types.ts) — request/response/error DTOs (+ persistence input type used by the port)
- [register.errors.ts](../../../apps/api/src/auth/register.errors.ts)
- [auth.module.ts](../../../apps/api/src/auth/auth.module.ts), [app.module.ts](../../../apps/api/src/app.module.ts)
- Tests: [register.service.spec.ts](../../../apps/api/test/auth/register.service.spec.ts), [register.controller.spec.ts](../../../apps/api/test/auth/register.controller.spec.ts)

---

## Block 6 — Frontend register flow

- [x] **Slice: SPA** (accepted)

`/register` is a thin page: [RegisterPage.tsx](../../../apps/frontend/src/features/auth/pages/RegisterPage.tsx) wires [useRegister.ts](../../../apps/frontend/src/features/auth/hooks/useRegister.ts) to [RegisterForm.tsx](../../../apps/frontend/src/features/auth/components/RegisterForm.tsx). The hook calls [fetch-register.ts](../../../apps/frontend/src/api/auth/fetch-register.ts) (axios via `createHttpClient`, path from [paths.ts](../../../apps/frontend/src/api/paths.ts)); wire types and fetch outcomes live in [auth.types.ts](../../../apps/frontend/src/api/types/auth.types.ts). UI phase state is in [features/auth/types.ts](../../../apps/frontend/src/features/auth/types.ts). Routing: [routes.json](../../../apps/frontend/src/app/routes.json) + [route-components.ts](../../../apps/frontend/src/app/route-components.ts) → [AppRoutes.tsx](../../../apps/frontend/src/app/AppRoutes.tsx); [App.tsx](../../../apps/frontend/src/app/App.tsx) wraps `BrowserRouter`. Test TS project: [test/tsconfig.json](../../../apps/frontend/test/tsconfig.json) includes `src` for imports.

- [fetch-register.ts](../../../apps/frontend/src/api/auth/fetch-register.ts), [auth.types.ts](../../../apps/frontend/src/api/types/auth.types.ts)
- [RegisterPage.tsx](../../../apps/frontend/src/features/auth/pages/RegisterPage.tsx), [RegisterForm.tsx](../../../apps/frontend/src/features/auth/components/RegisterForm.tsx), [useRegister.ts](../../../apps/frontend/src/features/auth/hooks/useRegister.ts), [types.ts](../../../apps/frontend/src/features/auth/types.ts)
- [routes.json](../../../apps/frontend/src/app/routes.json), [route-components.ts](../../../apps/frontend/src/app/route-components.ts), [AppRoutes.tsx](../../../apps/frontend/src/app/AppRoutes.tsx), [App.tsx](../../../apps/frontend/src/app/App.tsx)
- Tests: [RegisterForm.test.tsx](../../../apps/frontend/test/features/auth/RegisterForm.test.tsx)

---

## Block 7 — Periphery

- [x] **Periphery** (accepted)

Docs, build wiring, and test harness pieces that support the story but are not the register feature slice itself.

- [README.md](../../../README.md) — Story 2.1 verification (migrate, API/SPA dev, Swagger/curl, `/register`, package test commands)
- [copy-generated.mjs](../../../packages/db/scripts/copy-generated.mjs) — copies Prisma client from `src/generated` → `dist/generated` on `@pcppb/db` build (needed after auth schema)
- [jest.config.cjs](../../../apps/api/jest.config.cjs) — API specs under `test/`; [test/tsconfig.json](../../../apps/api/test/tsconfig.json) for typed mocks
- [vitest.config.ts](../../../apps/frontend/vitest.config.ts), [test/tsconfig.json](../../../apps/frontend/test/tsconfig.json) — Vitest + `jsdom`; frontend test project includes `src`
- Story docs (committed on branch vs `development`): [plan-2-1](../plan-2-1-register-with-email-and-password.md), [auth-password-policy.md](../spec-pc-part-picker-builder/auth-password-policy.md), register UX notes in [EXPERIENCE.md](../ux-pc-part-picker-builder/EXPERIENCE.md)

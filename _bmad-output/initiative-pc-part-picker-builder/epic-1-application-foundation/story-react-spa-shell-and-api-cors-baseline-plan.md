---
title: '1.5 React SPA shell and API CORS baseline'
type: 'feature'
ticket: '5'
created: '2026-10-20'
status: 'built'
baseline_revision: 'bb23e349cf98747d4d4f4bb29986d07c098e6b80'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'none'
review_source: 'pinned'
lenses_ran: []
review_loop_iteration: 0
context:
  - '_bmad-output/initiative-pc-part-picker-builder/architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md'
  - '_bmad-output/planning-artifacts/epics.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Vite React shell does not call the API; Nest does not expose a CORS policy, so cross-origin browser requests from the SPA cannot validate Epic 1 wiring.

**Approach:** Enable explicit non-production CORS on the API from a configurable frontend origin; add a minimal SPA fetch of `GET /health` and surface status (and database check) in the UI. Document env vars and dev verification in README.

## Boundaries & Constraints

**Always:** Frontend stays a thin client (display server JSON only); health response shape matches `HealthResponse` in `apps/api`; use repo-root `.env` for API like Story 1.3.

**Never:** Vite dev proxy as a substitute for CORS; compat or domain logic in the SPA; cookie/session auth in this story.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Healthy stack | Compose up, migrations applied, API + frontend dev servers running | SPA shows API status ok and database ok | No error expected |
| API down | Frontend up, API stopped | SPA shows load/error state (not blank) | User-visible message; no uncaught rejection |
| DB down | API up, Postgres down | SPA shows API error status from 503 body or fetch failure | Display error status from JSON when present |
| Wrong CORS origin | `FRONTEND_ORIGIN` does not match Vite origin | Browser blocks fetch | Fix env docs; SPA shows fetch error |

</frozen-after-approval>

## Code Map

- `apps/api/src/main.ts` — after `NestFactory.create`, call `enableCors` when not production; origin from `FRONTEND_ORIGIN` (default `http://localhost:5173`); `credentials: true` for future AD-11 cookies.
- `apps/api/src/health/health.controller.ts` — unchanged contract: `GET /health` → 200 `HealthResponse` or 503 on DB failure.
- `apps/api/src/health/health-response.types.ts` — reuse types; optional duplicate type in frontend or inline narrow type for fetch JSON (no `@pcppb` shared package required for this story).
- `apps/frontend/vite.config.ts` — port `5173` already set; no proxy (CORS is the integration under test).
- `apps/frontend/src/App.tsx` — replace placeholder copy; load health on mount; show loading / ok / error.
- `apps/frontend/src/api/health.ts` (new) — `fetchHealth(baseUrl)` using `import.meta.env.VITE_API_BASE_URL` with default `http://localhost:3000`.
- `apps/frontend/src/vite-env.d.ts` — declare `VITE_API_BASE_URL` on `ImportMetaEnv` if needed.
- `.env.example` — add `FRONTEND_ORIGIN`; document optional `VITE_API_BASE_URL` for frontend (or `apps/frontend/.env.example`).
- `README.md` — Story 1.5 section: run API + frontend, expect health in browser, CORS env vars.

## Tasks & Acceptance

**Execution:**
- [x] `apps/api/src/main.ts` — non-production CORS from `FRONTEND_ORIGIN` — satisfies AC on configured origin.
- [x] `apps/frontend/src/api/health.ts` — typed fetch helper for `/health` — single client entry for API base URL.
- [x] `apps/frontend/src/App.tsx` — display API health status — story user-visible outcome.
- [x] `.env.example` + README — document `FRONTEND_ORIGIN` and `VITE_API_BASE_URL` — local dev reproducibility.

**Acceptance Criteria:**
- Given api and frontend dev servers run, when the SPA loads, then it displays API health status from the Nest backend (including database check when API returns 200).
- Given non-production API (`NODE_ENV` not `production`), when the browser origin matches `FRONTEND_ORIGIN`, then cross-origin `GET /health` succeeds with CORS headers.

## Implementation Notes

- CORS gated on `NODE_ENV !== 'production'`; `configureCors` in `main.ts`.
- SPA uses `credentials: 'include'` to align with future cookie auth.

## Plan Change Log

## Review Triage Log

## Design Notes

Use real cross-origin fetch (Vite on 5173, API on 3000) so CORS is exercised. Default origins match existing `vite.config.ts` and API `PORT`.

## Verification

**Commands:**
- `pnpm build` — workspace compiles.
- `pnpm format:check` / `pnpm lint` — pass.
- With Compose + migrate + `.env`: `pnpm --filter @pcppb/api run dev` and `pnpm --filter @pcppb/frontend run dev` — open `http://localhost:5173`, confirm health UI shows ok.

**Manual checks (if no CLI):**
- DevTools Network: `health` request to `localhost:3000` returns 200 with `Access-Control-Allow-Origin` matching the SPA origin.

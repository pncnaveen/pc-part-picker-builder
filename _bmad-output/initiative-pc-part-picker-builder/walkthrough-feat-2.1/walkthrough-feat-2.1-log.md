# Review log: feat-2.1

Target: branch `feat-2.1` vs `development` (`git diff development...feat-2.1`)

## 1 — Session start — setup

Session: background writer · Timestamp: 2026-10-24T09:11+05:30

- Action: Resolved `core.active_initiative` → `initiative-pc-part-picker-builder`; created walkthrough folder and empty narrative (Intent, Broad strokes, Slices, Periphery — all pending).
- Result: Review log initialized; narrative placeholders only (no block content yet).
- Evidence: `git diff development...feat-2.1 --stat` — **12 files changed** (326 insertions, 16 deletions).
- Open: Main agent to direct block-by-block narrative fill; human acceptance per block.

## 2 — Orientation — scope

Session: unavailable · Timestamp: 2026-10-24T09:15:00+05:30

- Action: Merged narrative into canonical `walkthrough-feat-2.1/`; noted WIP implementation on branch beyond 12-file commit diff.
- Result: Walkthrough scope defaults to full story on branch (docs + local code). Duplicate `walkthrough-feat-2-1-register/` removed.
- Evidence: `git log development..feat-2.1`; `git status -sb`
- Open: User may narrow to committed-only review

## 3 — Block 1 Intent — acceptance

Session: unavailable · Timestamp: 2026-10-24T09:33:00+05:30

- Action: User accepted Intent block.
- Result: Block 1 checked; proceeding to Broad strokes.
- Evidence: [walkthrough-feat-2.1.md](./walkthrough-feat-2.1.md)
- Open: —

## 4 — Narrative — domain/API notes

Session: unavailable · Timestamp: 2026-10-26T22:31:00+05:30

- Action: Updated walkthrough narrative (blocks 2–3, 5) after review Q&A and `processRegistrationEmail` refactor.
- Result: Narrative documents email vs password limits, error throw/catch split, shared code typing, domain rebuild note.
- Evidence: [walkthrough-feat-2.1.md](./walkthrough-feat-2.1.md)
- Open: Block 2 still in progress until user accepts

## 5 — Process — sync narrative with code

Session: unavailable · Timestamp: 2026-10-26T22:32:00+05:30

- Action: User asked to keep walkthrough in sync on every code/file change during review.
- Result: Standing rule added to narrative header; agents should update blocks + log on each implementation edit.
- Evidence: [walkthrough-feat-2.1.md](./walkthrough-feat-2.1.md) § Keeping this walkthrough current
- Open: —

## 6 — Domain — narrow email exports

Session: unavailable · Timestamp: 2026-10-26T22:53:00+05:30

- Action: Stopped exporting `isValidEmail` / `normalizeEmail` from `@pcppb/domain`; tests exercise `processRegistrationEmail` only.
- Result: Public surface matches register usage; helpers remain module-private in `packages/domain/src/auth/email.ts`.
- Evidence: `packages/domain/src/index.ts`, `packages/domain/test/auth/email.test.ts`
- Open: —

## 7 — Domain — single-pass email processing

Session: unavailable · Timestamp: 2026-10-26T23:04:00+05:30

- Action: Removed `isValidEmail`; `processRegistrationEmail` normalizes once then uses `isValidNormalizedEmail`.
- Result: No duplicate trim/lowercase on happy path; behavior unchanged per tests.
- Evidence: `packages/domain/src/auth/email.ts`
- Open: —

## 8 — Ticket — Story 2.6 ULID port

Session: unavailable · Timestamp: 2026-10-26T23:22:00+05:30

- Action: Added Epic 2 story 2.6 (centralize ULID generation); 2.5 now `after` includes 6.
- Result: `tickets.toml`, `epics.md`, pulled `story-centralize-public-id-generation-ulid-in-the-api.md`.
- Evidence: `_bmad-output/initiative-pc-part-picker-builder/epic-2-identity-session-build/`
- Open: Implement on `feat-2.6` after 2.1 lands (or refactor register in 2.6 PR)

## 9 — Ticket — refine + GitHub publish

Session: unavailable · Timestamp: 2026-10-26T23:26:00+05:30

- Action: Refined story 2.6 AC; created GitHub issue #109; linked `tracker_id` on leaf ticket.
- Result: Ready for `feat-2.6` / `bmad-build` when 2.1 prerequisite is met.
- Evidence: https://github.com/pncnaveen/pc-part-picker-builder/issues/109
- Open: —

## 10 — Block 4 (DB) — Thoughts on createRegisteredAccount

Session: unavailable · Timestamp: 2026-10-26T23:45:00+05:30

- Action: User asked Prisma-oriented explanation of `createRegisteredAccount` during walkthrough.
- Result: Explained in chat; current block remains Broad strokes in narrative until user accepts blocks.
- Evidence: `apps/api/src/infrastructure/persistence/prisma-register-account.adapter.ts`
- Open: Mark blocks 2–4 done when satisfied

## 11 — Block 2 Broad strokes — acceptance

Session: unavailable · Timestamp: 2026-10-27T00:01:00+05:30

- Action: User accepted Block 2; moved to Block 3 (domain + shared).
- Result: Narrative updated.
- Evidence: [walkthrough-feat-2.1.md](./walkthrough-feat-2.1.md)
- Open: —

## 12 — Domain — split auth types and constants

Session: unavailable · Timestamp: 2026-10-27T11:33:00+05:30

- Action: Extracted email/password types and regex constants into dedicated files under `packages/domain/src/auth/`.
- Result: Behavior unchanged; walkthrough Block 3 links updated.
- Evidence: `email.types.ts`, `email.constants.ts`, `password.types.ts`, `password.constants.ts`
- Open: —

## 13 — Domain — merge auth types/constants

Session: unavailable · Timestamp: 2026-10-27T11:36:00+05:30

- Action: Consolidated into `auth.types.ts` + `auth.constants.ts`; removed per-feature type/constant files.
- Result: Tests/build unchanged; walkthrough Block 3 updated.
- Evidence: `packages/domain/src/auth/auth.types.ts`, `auth.constants.ts`
- Open: —

## 14 — Block 3 domain + shared — acceptance

Session: unavailable · Timestamp: 2026-10-27T11:51:00+05:30

- Action: User accepted Block 3.
- Result: Proceeding to Block 4 (DB + Prisma adapter).
- Evidence: [walkthrough-feat-2.1.md](./walkthrough-feat-2.1.md)
- Open: —

## 15 — Tooling — Prisma 6 vs extension PSL 7

Session: unavailable · Timestamp: 2026-10-27T12:07:00+05:30

- Action: False-positive `url` diagnostic; added `.vscode/settings.json` with `prisma.pinToPrisma6`.
- Result: Keep schema as-is for Prisma 6.19 (`url = env("DATABASE_URL")` is correct).
- Evidence: `pnpm --filter @pcppb/db exec prisma version`
- Open: Reload window if squiggle persists

## 16 — API — split register persistence port contract

Session: unavailable · Timestamp: 2026-10-27T13:38:00+05:30

- Action: Port file interface-only; input + persistence errors in sibling modules.
- Result: `register-account.port.ts` matches health port shape; imports updated in service + adapter.
- Evidence: `register-account.persistence-input.ts`, `register-account.persistence-errors.ts`
- Open: —

## 19 — Block 4 (DB) — acceptance

Session: architect (Roo) · Timestamp: 2026-10-28T10:02:00+05:30

- Action: User accepted Block 4 (Persistence Adapter); moved to Block 5 (API Surface).
- Result: Walkthrough narrative updated; focus shifts to Nest controller and module wiring.
- Evidence: [walkthrough-feat-2.1.md](./walkthrough-feat-2.1.md)
- Open: —

## 20 — Block 5 (API) — resume + narrative sync

Session: main · Timestamp: 2026-11-03T21:52:00+05:30

- Action: Resumed walkthrough after blocks 1–4 accepted; reconciled log vs tree for API slice.
- Result: Narrative **current block** → Block 5; Block 5 expanded (service orchestration, DTOs in `register.types.ts`, adapter error mapping in service, `INVALID_REQUEST` at controller). Log entry 16’s split filenames were consolidated back into `register.types.ts` (persistence input) and `register.errors.ts` (adapter error classes).
- Evidence: `apps/api/src/auth/register.{controller,service,types,errors}.ts`, `auth.module.ts`
- Open: User review of Block 5; accept when satisfied

## 21 — API — shared application error base

Session: main · Timestamp: 2026-11-03T22:12:00+05:30

- Action: Extracted `ApiApplicationError` with shared HTTP error fields + `toHttpException()`; `RegisterApplicationError` extends it; controller catches base type.
- Result: Future features can subclass `ApiApplicationError` without duplicating controller mapping.
- Evidence: `apps/api/src/infrastructure/http/api-application.error.ts`, `register.errors.ts`, `register.controller.ts`
- Open: —

## 22 — API — INVALID_REQUEST via application error

Session: main · Timestamp: 2026-11-03T22:20:00+05:30

- Action: Added `INVALID_REQUEST_ERROR`; controller throws it through shared `ApiApplicationError` catch + `toHttpException()`.
- Result: No ad-hoc `HttpException` in register controller; controller spec covers malformed body.
- Evidence: `register.errors.ts`, `register.controller.ts`, `register.controller.spec.ts`
- Open: —

## 23 — Block 5 (API) — acceptance

Session: main · Timestamp: 2026-11-03T22:38:00+05:30

- Action: User accepted Block 5 (API surface); proceeding to Block 6 (SPA).
- Result: Narrative Block 5 checked; Block 6 marked in progress with expanded mechanism notes.
- Evidence: [walkthrough-feat-2.1.md](./walkthrough-feat-2.1.md)
- Open: Block 6 review

## 24 — Block 6 (SPA) — acceptance

Session: main · Timestamp: 2026-11-04T01:21:00+05:30

- Action: User accepted Block 6; route table split (`routes.json`, `route-components.ts`, `AppRoutes.tsx`); frontend test tsconfig fixed for `src` imports.
- Result: Proceeding to Block 7 (periphery).
- Evidence: [walkthrough-feat-2.1.md](./walkthrough-feat-2.1.md)
- Open: Block 7 review

## 25 — Block 7 (periphery) — acceptance / review complete

Session: main · Timestamp: 2026-11-04T11:37:00+05:30

- Action: User accepted Block 7; all walkthrough blocks (1–7) accepted for feat-2.1.
- Result: Branch walkthrough session complete; narrative marks review finished.
- Evidence: [walkthrough-feat-2.1.md](./walkthrough-feat-2.1.md)
- Open: Follow-through (commit, PR to `development`, story issue) per user choice

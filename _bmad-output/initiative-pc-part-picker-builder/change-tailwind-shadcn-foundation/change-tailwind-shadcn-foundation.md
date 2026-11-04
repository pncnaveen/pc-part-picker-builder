---
title: Tailwind and shadcn/ui foundation (Story 2.7)
created: 2026-11-04
status: approved
scope: moderate
trigger: post-2.1 implementation gap
---

# Sprint Change Proposal — Tailwind and shadcn/ui foundation

## 1. Issue Summary

**Trigger:** Story **2.1** completed with **semantic HTML** and no Tailwind/shadcn in `apps/frontend`, per the frozen 2.1 plan (`plan-2-1-register-with-email-and-password.md` explicitly deferred bootstrap).

**Problem:** UX contract (`EXPERIENCE.md`, `DESIGN.md`) specifies **shadcn/ui + Tailwind** for the POC SPA, but **`epics.md` had no enabler story**. Epic 3+ and auth flows assume shadcn patterns (Sheet, Dialog, Badge, auth forms). Continuing Epic 2 without a foundation story risks duplicate styling work and drift from DESIGN.md.

**Evidence:**

- `apps/frontend/package.json` — no Tailwind or shadcn dependencies.
- `features/health/HealthStatus.tsx`, `features/auth/*` — unstyled semantic markup.
- Epic 2 `tickets.toml` — no UI foundation entry; story 2.1 `Never` list excluded shadcn bootstrap.

**User decision (2026-11-04):** Add **Story 2.7** to Epic 2; migrate existing SPA surfaces in that story; **all frontend work after 2.7** uses Tailwind + shadcn.

---

## 2. Impact Analysis

### Epic impact

| Epic | Impact |
|------|--------|
| **Epic 2** | Add Story **2.7**; resequence build order so **2.2–2.5** run **after** 2.7; 2.6 (API ULID) remains parallel after 2.1. |
| **Epic 3–9** | No epic text change required; **implicit dependency** on Epic 2 completion now includes 2.7 before catalog/build UI. |
| **Epic 1** | Unchanged; 1.5 remains minimal shell — polish moves to 2.7. |

### Story impact

| Story | Change |
|-------|--------|
| **2.1** | Historical record unchanged (shadcn deferred); UI migrated in **2.7** without API contract changes. |
| **2.2–2.4** | New auth/verify UI **must** use shadcn (gate: `after` includes 2.7). |
| **2.5** | Any client build shell UI uses shadcn (gate: `after` includes 2.7). |
| **2.6** | No change (API-only). |

### Artifact conflicts

| Artifact | Conflict | Resolution |
|----------|----------|------------|
| **PRD / FR** | None | UI stack already implied by UX spine; no new FR. |
| **Architecture** | Spine does not name shadcn | No AD required; frontend remains thin client (AD-16). Optional future one-line stack note — not blocking. |
| **UX (DESIGN + EXPERIENCE)** | **Aligns** — this closes the gap | 2.7 implements zinc defaults + documented patterns. |
| **plan-2-1** | Frozen “no shadcn in 2.1” | Still valid; superseded for UI by 2.7 migration. |

### Technical impact

- `apps/frontend`: Tailwind, shadcn CLI init, `components/ui/`, theme CSS variables (zinc), path alias `@/`.
- Refactor: home/health, register feature, app shell/layout.
- Tests: Vitest + RTL still pass; update selectors/roles as needed.
- CI: `pnpm lint`, `lint:boundaries`, `test` in frontend unchanged in intent.

---

## 3. Recommended Approach

**Selected: Option 1 — Direct adjustment** (add Story 2.7 within Epic 2)

| | |
|--|--|
| **Effort** | Medium (1–2 dev days: toolchain + migration + tests/docs) |
| **Risk** | Low — standard Vite + shadcn setup; no API changes |
| **Timeline** | Implement **2.7 immediately after 2.1 merge** and **before 2.2** frontend work |
| **Rollback** | Not needed — 2.1 semantic HTML is replaced in-place |

**Rejected:** Rollback of 2.1 (unnecessary). MVP scope reduction (not applicable).

---

## 4. Detailed Change Proposals

### 4.1 `planning-artifacts/epics.md` — NEW Story 2.7

**Section:** Epic 2, after Story 2.6

**NEW:**

```markdown
### Story 2.7: Tailwind and shadcn/ui foundation

As a **developer**,
I want **Tailwind CSS and shadcn/ui wired in the React SPA** with POC theme defaults,
So that **all product UI matches DESIGN.md and new screens use one component system**.

**Acceptance Criteria:**

**Given** the frontend dev server runs
**When** I inspect the app shell and migrated routes
**Then** Tailwind and shadcn are configured (Vite, path aliases, zinc theme per DESIGN.md)
**And** existing Epic 1–2.1 surfaces (home/health, register) use shadcn primitives with unchanged API behavior and EXPERIENCE auth rules
**And** CONTRIBUTING or AGENTS documents that **new frontend UI after this story uses shadcn/Tailwind**, not ad-hoc unstyled markup
**And** frontend unit tests and lint pass
```

**Rationale:** Makes UX spine enforceable in backlog; centralizes migration of health + register.

### 4.2 `epic-2-identity-session-build/tickets.toml` — entry id 7 + gates

**NEW entry** `id = 7`, `after = [1]`.

**Resequence:**

- Story 2 (verify): `after = [7]` (was `[1]`)
- Story 5 (in-session build): `after = [4, 6, 7]` (add `7`)

**Rationale:** 2.7 runs after register exists to migrate; 2.2+ and 2.5 client work cannot start until foundation is done.

### 4.3 Leaf ticket — `story-tailwind-and-shadcn-ui-foundation.md`

Full AC for build agent (see file in epic folder).

### 4.4 `implementation-artifacts/sprint-status.yaml`

Add `2-6-*` and `2-7-tailwind-and-shadcn-ui-foundation: backlog` under epic-2.

### 4.5 PRD / Architecture / UX

**No mandatory edits.** UX already authoritative.

---

## 5. Implementation Handoff

| Classification | **Moderate** — backlog + toolchain story, no API replan |
|----------------|--------------------------------------------------------|

### Next steps

1. **Apply this proposal** — epics.md, tickets.toml, leaf story, sprint-status (done in same change set).
2. **`bmad-ticket`** — Publish GitHub story issue `[2.7] Tailwind and shadcn/ui foundation`; link `tracker_id` on leaf frontmatter.
3. **`bmad-build`** — Branch `feat-2.7` from `development`; implement toolchain + migrate health/register + document convention.
4. **Epic 3+** — Do not start catalog UI until **2.7 is merged** (or explicitly waives gate).

### Success criteria

- `pnpm --filter @pcppb/frontend test` and `lint` pass.
- Home and `/register` visually use shadcn (Button, Input, Label, Card or equivalent).
- No new raw unstyled form markup in features added after merge of 2.7.

---

## Checklist summary (Correct Course)

| Section | Status |
|---------|--------|
| 1 Trigger & context | Done — gap after 2.1 vs UX contract |
| 2 Epic impact | Done — Epic 2 extended, gates on 2.2–2.5 |
| 3 Artifacts | Done — UX aligned; plan-2-1 deferral preserved |
| 4 Path forward | Done — Option 1 |
| 5 Proposal components | Done |
| 6 Approval | **Approved** — user request 2026-11-04 |

**Correct Course workflow complete.** Hand off to `bmad-build` on `feat-2.7` after issue creation.

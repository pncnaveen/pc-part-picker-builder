---
type: change-proposal
title: Build email notifications (summary + price/availability alerts)
status: approved
created: 2026-10-10
initiative: initiative-pc-part-picker-builder
skill: bmad-correct-course
---

# Sprint Change Proposal: Build email notifications

## 1. Issue summary

**Trigger:** Product decision during planning (pre-ticket): users with a **Finalized build** should receive email with parts, prices, and availability—once at finalize and automatically when catalog data changes.

**Problem:** Draft PRD assumed in-app-only notifications for social flows and did not define transactional build emails, preference toggles, or alert batching.

**Evidence:** Correct-course session 2026-10-10; PRD updated incrementally (FR-32–FR-34).

## 2. Impact analysis

| Area | Impact |
|------|--------|
| **Epics / stories** | None yet (`tickets.toml` empty). New capability should become its own epic at `bmad-ticket` time (e.g. “Build email notifications”). |
| **PRD** | **Updated** — §3 glossary, §4.11 FR-32–FR-34, §5 non-goals, §6.1 scope, §8 NFRs, §9 decisions, §11 assumptions, FR-23 clarification. |
| **Architecture** | **Not written** — needs email provider, template service, job to diff catalog changes against Finalized builds, 48h batching, FR-34 prefs store. |
| **UX** | **Not written** — account notification settings UI, finalize success copy mentioning email. |
| **Spec** | **Not written** — fold PRD changes via `bmad-spec` after PRD finalize. |
| **Technical** | Moderate: async email, idempotent sends per finalize event, change-detection pipeline tied to FR-26 refresh. |

## 3. Recommended approach

**Direct adjustment** to planning artifacts (PRD); **no rollback** of prior work.

- **Rationale:** Feature fits v1 retention (UJ-4) and reuses verified email (FR-30).
- **Effort:** Moderate (new vertical: notifications + catalog diff jobs).
- **Risk:** Email deliverability and alert noise — mitigated by 48h batching and FR-34 toggles (default on).
- **Timeline:** Schedule in first implementation wave after core build/save/catalog; depends on architecture for provider choice.

## 4. Detailed change proposals (applied to PRD)

| ID | Change | Status |
|----|--------|--------|
| CC-1 | Glossary: Finalized build, Build summary email, Build alert email | Applied |
| CC-2 | FR-32: Summary email on finalize; in-app id + deep link; no retailer URLs; respects FR-34 | Applied |
| CC-3 | FR-33: Alert on price/availability change; 48h batch; respects FR-34 | Applied |
| CC-4 | FR-34: Toggles for summary vs alert emails (default on) | Applied |
| CC-5 | §8 email NFRs; FR-23 in-app only for social | Applied |
| CC-6 | §9 decision row; §11 assumptions | Applied |
| CC-7 | SM-6 finalize email rate | **Declined** (user) |

## 5. Implementation handoff

**Scope classification:** **Moderate** — backlog + architecture before build.

| Step | Owner | Action |
|------|--------|--------|
| 1 | PM / user | **`bmad-prd`** — reconcile memlog, finalize PRD when ready |
| 2 | PM | **`bmad-spec`** — absorb PRD into spec folder |
| 3 | Architect | **`bmad-architecture`** — email provider, jobs, data model for last-alert snapshot |
| 4 | UX | **`bmad-ux`** — notification settings + email-related copy |
| 5 | PO | **`bmad-ticket`** — epic: FR-32–FR-34 (+ dependency on catalog refresh FR-26) |

**Success criteria**

- Finalized build → summary email when FR-34 summary toggle on.
- Catalog price/availability change → batched alert within 48h window when FR-34 alert toggle on.
- No retailer URLs in email bodies; deep link opens correct build.
- Toggles off → no corresponding sends.

## 6. Approval

- [x] User approved 2026-10-10 (Naveen) — implementation tracking via PRD + downstream spec/architecture/tickets

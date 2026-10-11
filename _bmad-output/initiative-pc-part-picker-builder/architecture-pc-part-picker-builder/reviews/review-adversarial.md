# Adversarial architecture review — PC Part Picker & Builder (v1)

| Field | Value |
| --- | --- |
| **Artifact** | `architecture-pc-part-picker-builder.md` |
| **Lens** | Adversarial (twin compliant implementations) |
| **Date** | 2026-10-11 |
| **Reviewer stance** | Assume two competent teams implement v1 in parallel; each team treats every AD as mandatory. Ask whether the spine still permits **integration-incompatible** outcomes at boundaries (API, shared DB, analytics, user-visible behavior). |

## Verdict

**FAIL** — The spine’s ADs and conventions are directionally sound but **under-specify binding contracts** at several integration seams. Two implementations can each cite AD compliance yet produce **mutually inconsistent** saved builds, share views, substitute/upgrade behavior, and success-metric signals without either team “violating” the written rules.

## Method

1. Read all thirteen ADs, consistency conventions, capability map, and structural seed as the **only** normative architecture (spec companions used only where ADs explicitly bind them).
2. Construct **Unit A** and **Unit B** as plausible repo shapes that honor the dependency rule, modular monolith deployables, and every AD literal.
3. Walk cross-unit scenarios: same user, same catalog releases, same FR/CAP expectations; identify **forks** where behavior or schema diverges while both units claim AD satisfaction.

---

## Twin implementation exercise

### Unit A — “Pinned evaluation snapshot”

| Area | Choice |
| --- | --- |
| **Placement** | `packages/domain` owns Compatibility, Substitute, Performance; `BuildService` persists **denormalized** `compatibilityStatus`, `warnings[]`, `invalidReasons[]`, `catalogReleaseId`, `compatRuleSetVersion`, and `performanceSnapshot` on the `Build` row after every mutation. |
| **Catalog binding** | On **first save** and on **share-link creation**, record the active `catalogReleaseId` + rule version on the Build (and copy onto `ShareToken` metadata). Subsequent opens **re-run** the engine but **gate product behavior** (share eligibility labels, compare performance column, email content) on the **last persisted snapshot** unless the owner mutates the Build. |
| **Worker** | Scrape/sync jobs update Parts and publish new `CatalogRelease`; they **do not** rewrite Build rows. |
| **Redis** | Read-through cache for Part attributes and rule blobs keyed by `catalogReleaseId`. |
| **AD mapping (sample)** | AD-1 durable state in PG ✓; AD-2 engine on mutation + open ✓ (re-run updates row); AD-3 writes only via BuildService ✓; AD-4 versioned rules tied to a release ✓ (pinned on Build); AD-10 tiers from lookup tables ✓ (snapshotted). |

### Unit B — “Live release evaluator”

| Area | Choice |
| --- | --- |
| **Placement** | Thin `BuildService` stores **selections + context only** (`build_slots`, budget, workloads, owned locks); **no** persisted compatibility or performance summary fields. |
| **Catalog binding** | Every mutation and every open of saved/shared Build loads the **current active** `catalogReleaseId` from `CatalogRelease` and evaluates compat + performance **at read time** against that release. |
| **Worker** | Same ingest; when a new release goes active, all saved Builds **change** Compatible/Warning/Invalid on next open without a user edit. |
| **Redis** | Caches compat/performance **results** keyed by `(selectionHash, activeCatalogReleaseId)` with TTL; PG remains source for selections only (AD-1: not authoritative for builds ✓). |
| **AD mapping (sample)** | AD-1 ✓; AD-2 ✓; AD-3 ✓; AD-4 ✓ (rules always from **a** catalog release—whichever is active); AD-10 ✓ (lookup at read; omit when Invalid at read). |

### Where A and B diverge incompatibly (both AD-compliant)

| Scenario | Unit A | Unit B | User/spec impact |
| --- | --- | --- | --- |
| Stricter compat rules ship in catalog release R2 while Build saved under R1 | Opens may recompute internally, but **share/compare/email** still reflect **R1 snapshot** until owner edits | Next open shows **Invalid**; save/share gates re-evaluated against R2 | SM-C1 narrative breaks for B (“saved Compatible” becomes Invalid without user action); CAP-10 compare and shared view disagree with A |
| Owner shares Warning build; R2 elevates issue to Invalid | Share remains **Warning**-eligible per token metadata | Shared URL **blocks** suggest flow or shows Invalid per live eval | CAP-10 / FR-22–23: same URL, different capability |
| Performance compare (CAP-10) | Uses `performanceSnapshot` | Uses latest lookup + current release | Side-by-side compare shows different tiers for identical Part IDs |
| `build_saved_compatible` (AD-13) | Emitted once at save with Compatible | Emitted at save; later opens silently Invalid with **no** new event | SM-1 / SM-C1 dashboards disagree across deployments |

**Conclusion of exercise:** AD-2 and AD-4 jointly require “run the engine” and “versioned rules tied to a catalog release” but **do not require a single binding policy** for whether Build/Share **identity** is tied to a release snapshot or the active release. That gap is sufficient for a **hard fork** in user trust and metric honesty.

### Secondary twin fork (owned inventory) — still AD-compliant

| | Unit A | Unit B |
| --- | --- | --- |
| **AD-12 unlock** | `unlock` mutation clears owned baseline for the Slot (selection empty; upgrade filters use **remaining** owned Parts only) | `unlock` sets `editable: true` but **retains** owned Part as filter baseline until user selects a replacement |
| **CAP-6** | “Changing owned Slot” = empty + pick new | “Changing” = pick new while baseline still constrains catalog |

Both record an unlock on the Build; both run server-side compat. **Catalog SQL filters diverge** → different candidate sets for the same Build JSON fields if schemas differ only slightly.

---

## Findings

### F1 — Catalog release binding policy is ambiguous (AD-2, AD-4, CAP-5, CAP-10, SM-C1)

| Severity | **Critical** |
| --- | --- |
| **Location** | AD-2, AD-4; Consistency Conventions (logging mentions `catalogReleaseId` but not Build lifecycle) |
| **Trigger** | Two teams choose pinned-release vs active-release evaluation for saved/shared Builds. |
| **Consequence** | Same Build ID flips Invalid/Compatible across deployments; share links and compare views disagree; “zero Invalid forced to save” (SM-C1) becomes unmeasurable when Invalid appears on open. |
| **Guard** | Add an AD (or tighten AD-4): **mandate** whether `Build`/`ShareToken` stores `catalogReleaseId` at save/share time and whether opens **may** change status without mutation; define operator migration on critical errata. |

### F2 — Persisted vs derived compatibility and performance (AD-2, AD-3, AD-10, CAP-8, CAP-10)

| Severity | **High** |
| --- | --- |
| **Location** | AD-2, AD-10; ER diagram (`Build` relations only show slots, not status fields) |
| **Trigger** | Spine requires running the engine and tier lookup but not **what is stored** on `Build` vs computed at read. |
| **Consequence** | API payloads, emails (AD-6/FR-32), and compare UI can show different status/tiers for identical selections; clients cannot rely on a stable shape. |
| **Guard** | Specify canonical fields on `Build` (or explicit “no persisted status”); require API to return `evaluatedAt`, `catalogReleaseId`, and `compatRuleSetVersion` on every Build read. |

### F3 — Owned Slot unlock baseline semantics (AD-12, CAP-6, FR-12)

| Severity | **High** |
| --- | --- |
| **Location** | AD-12 (“explicit unlock mutation recorded”; “catalog filters respect owned baseline”) |
| **Trigger** | “Respect owned baseline” does not say whether unlock **removes** baseline for filtering or only allows override. |
| **Consequence** | Incompatible catalog filter implementations; guided/manual paths show different upgrade sets; substitute apply may pass in one unit and fail in another. |
| **Guard** | Define unlock state machine: fields on `BuildSlot` (`ownedPartId`, `locked`, `baselinePartId`); rule for filters after unlock. |

### F4 — Warning vs Invalid classification authority (AD-2, AD-3, CAP-5)

| Severity | **Medium** |
| --- | --- |
| **Location** | AD-2, AD-3; glossary defines Warning/Invalid but spine does not bind rule severities to catalog release artifacts |
| **Trigger** | Compatibility engine is “pure domain” but **severity mapping** lives unspecified (per-rule? per-release config?). |
| **Consequence** | Unit A treats GPU clearance as Warning; Unit B as Invalid → save/share/complete gates diverge for identical Parts. |
| **Guard** | Require severities in versioned compat rule artifacts deployed with `CatalogRelease`; forbid ad hoc severity in application code. |

### F5 — Identifier and event contract optionalism (Consistency Conventions, AD-13)

| Severity | **Medium** |
| --- | --- |
| **Location** | “UUID v7 **or** ULID”; AD-13 lists example events without required payload schema |
| **Trigger** | Web picks ULID, worker picks UUID v7; analytics pipeline assumes one sort order; `build_saved_compatible` emitted at different lifecycle points (see twin exercise). |
| **Consequence** | Cross-service joins break; success metrics non-comparable across environments. |
| **Guard** | Pick one id scheme for v1; publish event JSON schema in `packages/shared` with required correlation ids (`buildId`, `catalogReleaseId`, `compatibilityStatus`). |

### F6 — Share token scope vs live compat (AD-7, AD-2, CAP-10)

| Severity | **Medium** |
| --- | --- |
| **Location** | AD-7 (opaque token, revoke on delete); AD-2 (re-run on shared open) |
| **Trigger** | AD-7 does not state whether token encodes **immutable view** or **live re-evaluation**. |
| **Consequence** | Suggest flow accepts/rejects against different compat results; security/abuse properties (rate limits) attach to different statuses. |
| **Guard** | State whether shared view is **snapshot-at-create** or **live**; if live, define behavior when status degrades to Invalid after share. |

### F7 — BuildService boundary for Share/Suggestion writes (AD-3, capability map)

| Severity | **Low** |
| --- | --- |
| **Location** | AD-3 (“only write path for Build state”); CAP-10 maps to ShareService |
| **Trigger** | Suggestion accept mutates Build Slots — unclear if only BuildService may commit or ShareService may write slots directly. |
| **Consequence** | One unit bypasses compat-on-mutation if ShareService writes PG; other routes through BuildService — inconsistent gates while both claim AD-3. |
| **Guard** | Clarify: all Slot mutations, including suggestion accept, **must** call BuildService; ShareService is token + suggestion inbox only. |

### F8 — Global incident flag implementation (AD-5)

| Severity | **Low** |
| --- | --- |
| **Location** | AD-5 (“global incident flag for the banner”) |
| **Trigger** | Unit A maintains `ops.global_incident`; Unit B infers banner from aggregate query per request. |
| **Consequence** | Banner timing/consistency differs; not user-fatal but violates “single product behavior” expectation. |
| **Guard** | Name one authoritative incident row or materialized view; web reads only that. |

### F9 — Manual selection “commit-on-select” vs server round-trip (AD-8, AD-11, spec FR-9)

| Severity | **Low** |
| --- | --- |
| **Location** | AD-8 (in-process eval); AD-11 (in-session client state); spec assumption FR-9 |
| **Trigger** | Unauthenticated session: client holds tentative selection; one unit evaluates via server action per candidate hover, another batches — both in-process, different p95 and rollback UX. |
| **Consequence** | Not integration-breaking between services, but **incompatible API churn** (preview vs commit endpoints) if packages split. |
| **Guard** | Document v1 API: `previewSlot` vs `commitSlot` and whether unauthenticated previews are allowed without persistence. |

### F10 — Email outbox vs Build finalize ordering (AD-6, AD-3)

| Severity | **Low** |
| --- | --- |
| **Location** | AD-6 (“Finalize succeeds even when email retrying”) |
| **Trigger** | Unit A finalizes then enqueues email with snapshot; Unit B enqueues with “load Build at send time”. |
| **Consequence** | Email body reflects different compat/staleness than in-app summary after catalog move. |
| **Guard** | Require email jobs carry immutable `finalizeSnapshotId` or embedded payload at enqueue time. |

---

## Summary

The spine successfully prevents the **classic** failures (client-side compat, Redis-as-SoR, scrape blocking HTTP, guessable share tokens). It does **not** yet close the **semantic fork** problems: **when** catalog releases bind to Builds and Shares, **what** is persisted versus derived, and **how** owned unlock reshapes baselines. The twin-unit exercise shows those forks are not theoretical—they fall out naturally from reading AD-2, AD-4, AD-10, and AD-12 as written.

### Recommended next actions (spine-only)

1. Add **AD-14 (Evaluation binding)** — pin vs live policy, errata migration, share snapshot rules.
2. Extend **Consistency Conventions** — canonical `Build` read model fields and event schemas.
3. Tighten **AD-12** — unlock state machine and filter rules.
4. Clarify **AD-3** — ShareService cannot mutate Slots without BuildService.
5. Remove **or/ULID** fork — single id type for v1.

---

## Traceability

| AD | Twin-unit stress result |
| --- | --- |
| AD-1 | Pass (both use PG; Redis non-authoritative) |
| AD-2 | **Ambiguous** (run ≠ bind) |
| AD-3 | **Ambiguous** (ShareService write path) |
| AD-4 | **Ambiguous** (release attachment point) |
| AD-5 | Minor fork (incident materialization) |
| AD-6 | Minor fork (email payload time) |
| AD-7 | **Ambiguous** (snapshot vs live share) |
| AD-8 | Pass (both in-process) |
| AD-9 | Pass if matrix severities fixed (see F4) |
| AD-10 | **Ambiguous** (snapshot vs read-time) |
| AD-11 | Pass |
| AD-12 | **Ambiguous** (unlock baseline) |
| AD-13 | **Ambiguous** (event timing/schema) |

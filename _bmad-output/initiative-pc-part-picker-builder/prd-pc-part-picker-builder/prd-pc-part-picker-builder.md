---
type: prd
title: PC Part Picker & Builder — Individuals (v1)
status: draft
created: 2026-10-03
updated: 2026-10-10T12:44
source_brief: _bmad-output/initiative-pc-part-picker-builder/brief-pc-part-picker-builder/brief-pc-part-picker-builder.md
scope: v1 individuals portal
skill: bmad-prd
---

# PRD: PC Part Picker & Builder — Individuals (v1)

## 0. Document Purpose

This PRD defines v1 functional and non-functional requirements for the **individuals portal** of PC Part Picker & Builder. Primary readers: product, UX, engineering, and QA. It builds on the finalized product brief (2026-10-03) and brainstorming intent; v2 organization/dealer scope lives in `addendum.md` only.

Structure: **Glossary-anchored vocabulary**, features grouped with globally numbered **FRs**, user journeys **UJ-1…UJ-N**, success metrics **SM-*** cross-linked to FRs. Assumptions use `[ASSUMPTION]` inline and appear in §9.

## 1. Vision

First-time and occasional PC builders plan custom machines under real constraints: a fixed budget, hardware they already own, how they will use the PC, and what is actually buyable nearby. Today that work is scattered across retailer sites, forums, and chat advice that is often incompatible or embarrassing when a part does not fit.

PC Part Picker & Builder is a **web application** that ties **budget, owned context, compatibility, purchase substitutes, and honest performance expectations** into one loop. Users explore a maintained catalog, assemble a **Build**, and cannot treat an incompatible configuration as complete. When a chosen **Part** is unavailable, guided **Substitutes** respect material specs—not silent downgrades.

v1 serves **individual builders only**. Organization procurement and dealer marketplaces are an intentional v2 bet. Success in v1 is **learning and retention**, not revenue.

## 2. Target User

### 2.1 Jobs To Be Done

- **Plan a defensible build** — Know the configuration works before money is spent or advice is shared.
- **Respect real desk context** — Keep an existing monitor, case, or GPU in scope instead of pretending every build starts empty.
- **Stay inside budget** — See running totals and trade-offs as parts are added or swapped.
- **Upgrade incrementally** — Start from owned hardware and explore the next sensible change.
- **Recover from shelf reality** — When the exact SKU is missing, accept an equivalent part without breaking compatibility.
- **Set performance expectations** — Understand likely experience for declared games/apps at declared display settings—not “max everything.”
- **Collaborate without blame** — Share a build so friends suggest swaps that remain compatible.
- **Return when the market moves** — Reopen saved builds when prices or availability change.

### 2.2 Non-Users (v1)

- Organization buyers, IT procurement, division template administrators
- Dealers, RFQ responders, marketplace operators
- Users who need review ecosystems, rich spec-compare matrices, or real-time chat (v1.1 candidates)

### 2.3 Key User Journeys

**UJ-1. Jordan finishes a first compatible build under budget**

- **Persona + context:** Jordan, 24, first desktop build, ₹1,00,000 budget, keeping a 1440p 165Hz monitor from a prior setup.
- **Entry state:** Unauthenticated; lands on marketing/home, chooses “Start a build.”
- **Path:** Sets budget and launch **Region**; declares owned **Monitor** and primary use (competitive games); chooses guided path; accepts recommended CPU/motherboard/RAM/GPU/storage/PSU/case slots with live **Compatibility** status; reviews **Performance estimate** for two declared titles at native resolution.
- **Climax:** Build summary shows **Compatible**, under budget, performance band “meets target” for declared games; Jordan marks build **Complete** (Finalized) after verifying email.
- **Resolution:** Saved **Finalized build** on dashboard; optional share link copied; **Build summary email** sent when FR-32/FR-34 allow.
- **Edge case:** Selected GPU exceeds case clearance—system blocks **Complete build** with clearance conflict and suggests alternate GPUs that fit.

**UJ-2. Sam upgrades from a partial owned rig**

- **Persona + context:** Sam owns a working PC (CPU, board, RAM, PSU, case) and wants a better GPU within ₹35,000.
- **Entry state:** Authenticated; “Upgrade from what I own.”
- **Path:** Registers owned parts into **Owned inventory**; system treats them as fixed slots; Sam browses GPU catalog filtered by board slot, PSU headroom, and case length; swaps GPU; re-validates power and clearance.
- **Climax:** Upgrade path shows only compatible GPUs; budget delta isolated to changed slots.
- **Resolution:** Updated saved Build labeled as upgrade; performance estimate delta vs. prior GPU.
- **Edge case:** PSU wattage insufficient—compatibility error with required minimum PSU recommendation.

**UJ-3. Alex shares a build; Morgan suggests a swap that stays valid**

- **Persona + context:** Alex shares build link; Morgan (friend/advisor) opens read-only shared view.
- **Entry state:** Morgan unauthenticated or logged in; opens shared Build URL.
- **Path:** Morgan proposes alternate RAM kit via “Suggest substitute” (opt-in social interaction); system validates substitute against material spec rules; Alex accepts or rejects.
- **Climax:** Accepted swap keeps Build **Compatible**; share view updates for both.
- **Resolution:** Alex proceeds to purchase planning with updated parts list.
- **Edge case:** Morgan suggests incompatible socket CPU—system rejects suggestion with explicit conflict, no silent apply.

**UJ-4. Riley revisits a saved build after a price spike**

- **Persona + context:** Riley saved a build last week; one part price increased 18%.
- **Entry state:** Authenticated; opens saved Build from dashboard or from a **Build alert email** deep link (FR-33).
- **Path:** Sees **Stale price** badge on affected Part; total over budget; uses substitute or picks alternate in slot; compatibility re-runs.
- **Climax:** Build back under budget with current prices; staleness cleared for updated lines.
- **Resolution:** Riley exports or shares updated build; may have been nudged by batched price/availability alert email.

## 3. Glossary

- **Build** — A user’s configured set of **Slots** (required component categories) with selected **Parts**, budget, use context, and compatibility/performance state. One primary Build per save record unless duplicated by user action.
- **Slot** — A required or optional component category in a Build (e.g., GPU, motherboard). Each Slot holds zero or one selected Part in v1.
- **Part** — A catalog item representing a purchasable component SKU with specs, price, availability, and metadata.
- **Catalog** — The maintained set of Parts and spec attributes for the launch **Region**.
- **Region** — The single v1 geographic/commercial market for catalog, pricing, and availability. **Launch Region: India (INR).**
- **Required Slot** — A Slot that must have a selected Part (or owned Part mapped) before a Build can be marked **Complete**. See FR-29.
- **Optional Slot** — A Slot the user may leave empty in v1 without blocking **Complete** (e.g., discrete GPU when CPU has integrated graphics).
- **Owned inventory** — Parts the user declares they already possess; may pre-fill Slots and constrain upgrades.
- **Compatibility engine** — Rule set evaluating Build validity (socket, chipset, power, clearance, display interface, etc.).
- **Compatibility status** — Aggregate state: **Compatible**, **Warning** (non-blocking advisory), or **Invalid** (blocks complete/save/share).
- **Substitute** — An alternate Part offered when selected Part is unavailable or user requests equivalent options; must pass material-spec rules (see addendum matrix).
- **Performance estimate** — Directional expected experience for user-declared games/apps given Build and declared display characteristics—not a guarantee.
- **Stale price / Stale availability** — Data older than defined refresh thresholds (see §7 and addendum).
- **Share link** — URL granting view (and opt-in suggest) access to a Build without exposing account credentials.
- **Account** — Authenticated user identity required to persist Builds across sessions/devices.
- **Finalized build** — A saved Build that the user has marked **Complete** per FR-29, with Compatibility status **Compatible** or **Warning** (not Invalid).
- **Build summary email** — A transactional email to the Account’s verified address containing the Finalized build’s in-app build identifier, deep link, part list, prices, availability flags, and staleness indicators at send time (no retailer URLs).
- **Build alert email** — A transactional email sent when catalog **price** or **availability** changes for any Part on a Finalized build since the last notification for that build (or since finalize, for the first alert).

## 4. Features

### 4.1 Build context and onboarding

**Description:** Users establish budget, Region, primary use (games, creative apps, general), declared games/apps list, display characteristics, and optional Owned inventory before or during assembly. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-1: Set build budget

A user can set a numeric budget in launch Region currency before or during Build assembly.

**Consequences (testable):**
- Running total of selected Parts is visible during assembly.
- When total exceeds budget, UI shows over-budget state with amount over limit.
- User may mark Build **Complete** while over budget only after explicit acknowledgment (e.g., confirm dialog); acknowledgment is recorded on the Build for analytics.

#### FR-2: Declare primary use and workloads

A user can select primary use category and attach a list of declared games and/or creative applications relevant to Performance estimate.

**Consequences (testable):**
- Performance estimate section lists only workloads the user declared.
- Changing declared workloads updates Performance estimate output without requiring new Parts if Build unchanged.

#### FR-3: Declare display characteristics

A user can declare owned or planned display resolution, refresh rate, and panel type tied to Owned inventory or Build context.

**Consequences (testable):**
- Performance estimate references declared display settings.
- Missing display declaration blocks Performance estimate until provided or user opts out with labeled “unknown display” reduced-confidence mode.

#### FR-4: Register owned parts

A user can register Parts they already own into Owned inventory and map them to Slots.

**Consequences (testable):**
- Owned Parts appear as fixed selections for mapped Slots until user removes ownership.
- Upgrade flow (FR-12) treats owned Slots as constraints on catalog filters.

**Out of Scope:** Manual entry for owned parts that do not match any Catalog Part (legacy gear)—deferred past v1.

### 4.2 Catalog browse and search

**Description:** Users discover Parts within Region catalog via category browse, search, and filters aligned to Slot. Realizes UJ-1, UJ-2, UJ-4.

#### FR-5: Browse catalog by component category

A user can browse Parts by Slot-aligned categories with sort by price, popularity `[ASSUMPTION: popularity = catalog sort key]`, and spec filters appropriate to category.

**Consequences (testable):**
- Part detail shows spec attributes required for Compatibility engine for that category.
- Parts outside Region are not listed.

#### FR-6: Search parts by text

A user can search Parts by name, brand, model, or SKU fragment.

**Consequences (testable):**
- Empty search results show actionable empty state, not error.
- Search respects active Slot context when launched from a Slot picker.

#### FR-7: Show price, availability, and staleness

The system displays current price, availability flag, and staleness badges per Part based on refresh rules (FR-26).

**Consequences (testable):**
- Part with price older than 24h shows **Stale price** badge.
- Part with availability data older than 4h shows **Stale availability** badge.

### 4.3 Build assembly (guided and manual)

**Description:** Users fill Slots via guided recommendations within budget or fully manual selection. Realizes UJ-1, UJ-2.

#### FR-8: Guided build path

A user can choose a guided path that recommends Parts per Slot within budget and Compatibility constraints.

**Consequences (testable):**
- Each recommendation pass re-runs Compatibility engine before presenting next Slot.
- User can switch to manual selection for any Slot without restarting Build.

#### FR-9: Manual slot selection

A user can manually pick any Part for any unfixed Slot from filtered compatible options.

**Consequences (testable):**
- Selecting a Part triggers Compatibility evaluation within 2s p95 for Builds ≤12 Slots `[ASSUMPTION: 12 slots max v1]`.
- Incompatible selection shows conflict detail before selection is committed `[ASSUMPTION: commit-on-select with rollback]`.

#### FR-10: Running build summary

A user sees live Build summary: Slots filled, budget status, Compatibility status, Performance estimate entry point.

**Consequences (testable):**
- Summary updates on any Slot change.
- Invalid Compatibility status prevents marking Build **Complete**.
- Over-budget state does not block **Complete** when user has acknowledged (FR-1).

#### FR-29: Required slots for complete build

A Build can be marked **Complete** only when every **Required Slot** has a selected Part or Owned inventory mapping, Compatibility status is not Invalid, and any over-budget acknowledgment (FR-1) is satisfied.

**Required Slots (v1, India launch):** CPU, CPU cooler, motherboard, memory (RAM), storage (≥1 device), case, power supply (PSU).

**Optional Slots (v1):** Discrete GPU, additional storage, monitor (for owned/display context), peripherals. Optical drives and sound cards are not v1 Slots.

**Consequences (testable):**
- UI shows checklist of Required Slots with filled/unfilled state.
- Leaving discrete GPU empty is allowed; Performance estimate shows reduced-confidence or “GPU required for declared workloads” when user declared GPU-bound games without a GPU or sufficient iGPU match.
- **Complete** is blocked with explicit list of missing Required Slots.

### 4.4 Compatibility validation

**Description:** Compatibility is continuous product behavior—not a one-time check. Realizes UJ-1, UJ-2, UJ-3.

#### FR-11: Always-on compatibility evaluation

The system evaluates Compatibility on every Build change and on opening a saved or shared Build.

**Consequences (testable):**
- Known conflict classes from brief are enforced: CPU socket, motherboard chipset, RAM type, PSU wattage/connectors, GPU clearance, power connectors, display interface vs. GPU outputs.
- Each Invalid state includes human-readable conflict messages referencing affected Slots and Parts.

#### FR-12: Upgrade-from-owned flow

A user can start a Build from Owned inventory with locked Slots and change only unconstrained or user-unlocked Slots.

**Consequences (testable):**
- Catalog filters for changeable Slots exclude Parts failing Compatibility with owned baseline.
- Unlocking an owned Slot requires explicit user confirmation.

#### FR-13: Block invalid complete, save, and share

The system prevents Complete build, save, and share actions when Compatibility status is Invalid.

**Consequences (testable):**
- Warning status allows save/share with visible warnings.
- Invalid state cannot generate share link.

**Feature-specific NFRs:**
- Compatibility evaluation p95 ≤ 2s for standard Builds on broadband `[ASSUMPTION]`; documented in architecture if exceeded.

### 4.5 Substitutes and shelf reality

**Description:** When Parts are unavailable or user seeks equivalents, Substitutes follow material-spec rules. Realizes UJ-4.

#### FR-14: Detect unavailable selected parts

When a selected Part is marked unavailable, the system surfaces substitute workflow for that Slot.

**Consequences (testable):**
- Unavailable Part cannot be marked Complete without substitute or replacement.
- User can dismiss only by choosing a different Part or valid Substitute.

#### FR-15: Offer spec-equivalent substitutes

The system can suggest Substitutes: same material spec, different brand/SKU; cosmetic/minor tolerance per addendum matrix.

**Consequences (testable):**
- Material spec downgrade suggestions are not offered.
- Each Substitute passes Compatibility engine before display.

#### FR-16: User-initiated substitute search

A user can request substitutes for any selected Part even when available.

**Consequences (testable):**
- Substitute list empty state explains no equivalent found.
- Applying Substitute replaces Part in Slot and re-runs Compatibility.

### 4.6 Performance estimates

**Description:** Directional expectations for declared workloads. Realizes UJ-1, UJ-2, UJ-4.

#### FR-17: Generate performance estimate

For a Compatible or Warning Build with declared workloads and display, the system shows expected experience tier per declared game/app (e.g., below target / meets target / exceeds target).

**Consequences (testable):**
- Estimate updates when GPU, CPU, RAM, or display context changes.
- UI includes disclaimer that estimates are directional (see addendum).

#### FR-18: Refuse misleading estimate on Invalid build

Performance estimate is hidden or read-only blocked when Compatibility status is Invalid.

**Consequences (testable):**
- User sees message tying estimate to compatibility resolution.

### 4.7 Accounts and saved builds

**Description:** Persistence requires Account. v1 auth is email registration with verification; OAuth deferred to v2. Realizes UJ-1, UJ-2, UJ-4.

#### FR-19: Require account to save builds

An authenticated user can save Builds; unauthenticated users can assemble but cannot persist across sessions.

**Consequences (testable):**
- Save prompts account creation or sign-in.
- Saved Build list shows name, last updated, Compatibility status, budget status.

#### FR-20: Open and edit saved builds

An authenticated user can open a saved Build, edit Slots, and re-save.

**Consequences (testable):**
- Edits re-run Compatibility and refresh price/availability display.
- Version history is out of v1 scope unless `[ASSUMPTION: single mutable version only]`.

#### FR-21: Delete saved build

An authenticated user can delete a saved Build with confirmation.

**Consequences (testable):**
- Deleted Build share links return gone/not found.

#### FR-30: Email registration and verification

A user can create an Account with email and password and must verify email before first save of a Build.

**Consequences (testable):**
- Unverified accounts can assemble Builds in session but cannot save (FR-19).
- Password reset via email is supported.
- OAuth / social sign-in providers are not offered in v1.

### 4.8 Social MVP (share and compare)

**Description:** Opt-in sharing and friend suggestions without real-time chat in v1. Realizes UJ-3.

#### FR-22: Share build link

An authenticated user with a saved Compatible or Warning Build can generate a share link.

**Consequences (testable):**
- Invalid Builds cannot generate links (FR-13).
- Shared view is read-only except opt-in suggestion actions defined in FR-23.

#### FR-23: Suggest compatible swaps on shared build

A viewer with share access can propose Substitute or Part change that passes Compatibility and material-spec rules; owner accepts or rejects.

**Consequences (testable):**
- Incompatible proposals never apply automatically.
- Owner rejection leaves Build unchanged with optional **in-app** notification (social suggestions do not trigger build emails; FR-32/FR-33 only).

#### FR-24: Compare two builds

An authenticated user can compare their saved Build with another shared Build on budget, Compatibility, Performance estimate summary, and Slot diffs.

**Consequences (testable):**
- Compare view labels Region and staleness on prices used.

**Out of Scope:** Real-time chat (v1.1 candidate per brief).

### 4.9 Catalog and price maintenance (product requirements)

**Description:** Catalog freshness is a user-facing promise. Operational detail in addendum. Realizes UJ-4, SM-5.

#### FR-25: Maintain component catalog

Operators `[ASSUMPTION: internal admin/process]` maintain Catalog spec data for launch Region on defined cadence.

**Consequences (testable):**
- Each Part detail shows spec last-updated date.
- Critical errata trigger out-of-band update within 72h `[ASSUMPTION]`.

#### FR-26: Maintain price and availability feeds

The system ingests price and availability for Region on defined cadence (see addendum).

**Consequences (testable):**
- SM-5 measurable via staleness metrics.
- Global banner when feeds fail >24h.

#### FR-27: Surface staleness to users

Users see staleness badges and Build-level summary when any selected Part exceeds thresholds.

**Consequences (testable):**
- Build summary counts stale lines.
- Link-out handoff warns when stale prices present (FR-31).

### 4.10 Purchase link-out (v1)

**Description:** Users buy parts at retailers via outbound links; no in-app cart in v1. Realizes UJ-1, UJ-4.

#### FR-31: Retailer link-out per part

A user can open an outbound purchase link for a Catalog Part from Build summary or Part detail, scoped to India Region retailers/sources configured in Catalog.

**Consequences (testable):**
- Each link opens in a new browser context with clear external-site disclosure.
- Build export lists all selected Parts with link-out where available; missing retailer mapping shows “find locally” guidance without broken links.
- Stale price badge triggers confirmation before link-out when price is stale.

**Out of Scope:** Unified in-app shopping cart or checkout (v2).

### 4.11 Build email notifications (v1)

**Description:** Transactional emails for Finalized builds. Realizes UJ-1, UJ-4.

#### FR-32: Build summary email on finalize

When a user successfully marks a saved Build **Complete** per FR-29 and the Build becomes a **Finalized build**, the system sends one **Build summary email** to the Account’s verified email address.

**Consequences (testable):**
- Email is not sent if Compatibility status is **Invalid** or email is unverified (FR-30).
- Email includes: build name, **in-app build identifier**, deep link to open the build in-app, each selected Part (slot, name, SKU), price in INR, availability state, stale badges per FR-7, build total vs budget, and Compatibility status.
- Email does **not** include retailer URLs (purchase remains in-app via FR-31).
- Send is skipped when the user has disabled **build summary emails** in account settings (FR-34).
- Exactly one summary email per finalize event (re-finalize after edit sends a new summary email for that event).
- Send failure is logged; user sees in-app confirmation that finalize succeeded even if email is queued/retrying.

#### FR-33: Build alert email on price or availability change

For each **Finalized build**, when catalog **price** or **availability** changes for any Part on that build (per FR-26 refresh), the system sends a **Build alert email** to the Account’s verified email address.

**Consequences (testable):**
- Alerts apply only to Finalized builds that remain saved (not deleted).
- Each email lists only Parts that changed since the previous alert for that build (or since finalize if none sent yet).
- At most **one alert email per build per 48 hours** (batch multiple Part changes into one email).
- No alert is sent for changes that only affect staleness metadata without a price or availability delta.
- Send is skipped when the user has disabled **price/availability alert emails** in account settings (FR-34).
- Unverified email accounts do not receive alerts.

#### FR-34: Account email notification settings

An authenticated user can manage build-related email preferences in account settings:

| Setting | Controls | Default (verified account) |
|--------|----------|----------------------------|
| **Build summary emails** | FR-32 (on finalize) | On |
| **Price/availability alert emails** | FR-33 | On |

**Consequences (testable):**
- Changes apply to future sends only.
- Unverified accounts cannot receive build emails (FR-30).
- UI explains each toggle in plain language (what is sent and when).

## 5. Non-Goals (Explicit)

- Organization accounts, division templates, bulk procurement
- Dealer portal, RFQ boards, quotes, contracts, advance payments, dealer verification
- Review ecosystem, rich spec-compare UI, review-driven recommendations (v1.1)
- Real-time friend chat (v1.1 candidate)
- Revenue features: affiliates, premium tiers, ads (future options only)
- Claiming proprietary data moat at launch
- Native mobile apps (web responsive only v1)
- OAuth / social login (v2)
- In-app unified cart / checkout (v2; v1 is link-out only)
- Manual spec entry for non-catalog owned hardware (deferred past v1)
- Marketing / promotional email newsletters (v1)

## 6. MVP Scope

### 6.1 In Scope

Everything in §4 FR-1 through FR-34 plus Platform and cross-cutting NFRs below.

### 6.2 Out of Scope for MVP

| Item | Reason |
|------|--------|
| Org/dealer v2 capabilities | Brief scope cut; tracked in addendum |
| Reviews & spec-compare | v1.1 after build core |
| Real-time chat | v1.1 candidate |
| Multi-region launch | Single Region v1 (India) |
| In-app cart / checkout | v2; v1 uses retailer link-out (FR-31) |
| OAuth sign-in | v2; v1 email + verification (FR-30) |
| Manual legacy owned-part specs | Deferred past v1 |

## 7. Success Metrics

**Primary**

- **SM-1: Compatible build completion rate** — Among Builds started (context set + ≥1 Slot filled), % reaching saved Compatible Build within one session. **Target: ≥45% within 90 days of launch.** Validates FR-8, FR-9, FR-11, FR-13, FR-19. `[ASSUMPTION: baseline to refine with analytics.]`
- **SM-2: Budget-successful saves** — Among saved Compatible Builds, % at or under user budget at save time. **Target: ≥70%.** Validates FR-1, FR-10, FR-19.

**Secondary**

- **SM-3: Return edit rate** — % of saved Builds edited at least once within 14 days (price/availability-driven). **Target: ≥30%.** Validates FR-20, FR-26, FR-27, UJ-4.
- **SM-4: Share adoption** — % of saved Compatible Builds that generate a share link within 30 days. **Target: ≥20%.** Validates FR-22, FR-23.
- **SM-5: Catalog freshness SLA** — % of active-catalog Parts meeting price ≤24h and availability ≤4h freshness. **Target: ≥95% rolling 7-day.** Validates FR-7, FR-26, FR-27.

**Counter-metrics (do not optimize)**

- **SM-C1: Override incompatible saves** — Count of Invalid Builds forced to save/share (should be **0**). Counterbalances SM-1 gaming via weak validation.
- **SM-C2: Silent stale listings** — Parts shown without staleness badge when beyond threshold (target **0**). Counterbalances SM-5.

## 8. Cross-Cutting NFRs

- **Platform:** Web-first responsive UI; latest two versions of Chrome, Firefox, Safari, Edge `[ASSUMPTION]`.
- **Performance:** Initial catalog browse interactive ≤3s p95 on 4G `[ASSUMPTION]`; Compatibility evaluation per §4.4.
- **Security:** Email-verified accounts (FR-30); session auth; share links use unguessable tokens; rate-limit suggestion endpoints; rate-limit outbound build emails per account.
- **Email (transactional):** Build summary (FR-32) and price/availability alerts (FR-33) only; no marketing content in v1.
- **Email content:** Each message includes an in-app build identifier and deep link to the build; no retailer link-outs in email.
- **Email reliability:** Async send with retry; failures logged; message body limited to account email, build identifier, and part/price/availability data.
- **Email preferences:** Account settings (FR-34) control sends; defaults on for verified accounts.
- **Accessibility:** WCAG 2.1 AA for core build flows `[ASSUMPTION: aspirational v1 target]`.
- **Privacy:** Social features opt-in; share links expose only Build data user confirms.
- **Observability:** Log compatibility failures, substitute offers, staleness breaches, and email send failures for SM reporting.

## 9. Resolved Decisions (2026-10-03)

| Topic | Decision |
|--------|----------|
| Launch Region | **India (INR)** — catalog, pricing, availability, retailer link-outs |
| Over budget | **Allow Complete** with explicit user acknowledgment (FR-1) |
| Legacy owned parts not in catalog | **Deferred** past v1 (FR-4) |
| Purchase flow | **Retailer link-out** in v1; unified in-app cart/checkout in **v2** (FR-31) |
| Required Slots for Complete | **FR-29** — CPU, cooler, motherboard, RAM, storage, case, PSU; GPU optional |
| Authentication | **Email + verification** in v1; **OAuth in v2** (FR-30) |
| Product stakes | Learning / pre-revenue launch (user confirmed) |
| Build emails (2026-10-10) | **FR-32** summary on finalize; **FR-33** price/availability alerts (48h batch); **FR-34** opt-out toggles (default on); in-app build id + deep link; no retailer URLs in email |

## 10. Open Questions

1. Which India retailer/API feeds are in scope for day-one Catalog (sourcing contract)—blocks FR-26 implementation.

## 11. Assumptions Index

- India launch **Region** (§3, FR-5, FR-31).
- Popularity sort key exists in catalog (FR-5).
- Max ~12 Slots; commit-on-select compatibility UX (FR-9).
- Compatibility p95 ≤ 2s (FR-11).
- Single mutable save version, no history (FR-20).
- Social suggestion notifications are in-app only (FR-23); build emails are FR-32/FR-33.
- Build email toggles default on for verified accounts (FR-34).
- Price/availability alert batching: at most one email per build per 48 hours (FR-33).
- Internal ops maintain catalog (FR-25).
- v1 purchase handoff is retailer link-out; in-app cart is v2 (FR-31, §6.2).
- Required Slot list per FR-29; GPU optional with performance warnings.
- Analytics baselines for SM-1/SM-3 to be measured in beta.
- Browser support and 4G perf budgets (§8).
- WCAG 2.1 AA as v1 target (§8).

---

*Next downstream: finish PRD (`bmad-prd`), then `bmad-spec`, optional `bmad-ux` / `bmad-architecture`, then `bmad-ticket` for epics and stories.*

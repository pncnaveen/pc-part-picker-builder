---
id: SPEC-pc-part-picker-builder
companions:
  - ../architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md
  - glossary.md
  - catalog-sources.md
  - required-slots.md
  - catalog-freshness.md
  - substitute-matrix.md
  - performance-estimates.md
  - success-metrics.md
  - functional-requirements.md
sources:
  - ../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md
  - ../prd-pc-part-picker-builder/addendum.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# PC Part Picker & Builder — Individuals (v1)

## Why

**Pain + vision:** First-time and occasional PC builders in India plan custom machines under real constraints—budget, hardware they already own, intended use, and what is actually buyable—but today that work is scattered across retailer sites, forums, and incompatible advice. This is a **web application** mandate to unify budget, owned context, compatibility, honest performance expectations, substitutes when SKUs vanish, and purchase link-out in one loop for **individual builders only**. v1 optimizes **learning and retention**, not revenue; organization procurement and dealer marketplaces are an intentional later bet.

## Capabilities

- **CAP-1**
  - **intent:** User establishes numeric budget, launch-region context, primary use, declared games/apps, display characteristics, and owned inventory mapped to Slots before or during assembly.
  - **success:** Running budget total and over-budget state update live; owned Parts lock mapped Slots; Performance estimate only considers declared workloads and display (or labeled unknown-display mode); catalog owned Parts only (no manual legacy spec entry).

- **CAP-2**
  - **intent:** User discovers Parts in the curated India catalog (top parts per Slot) via category browse, text search, and Slot-aware filters with Amazon.in-sourced price, availability, and staleness visibility.
  - **success:** Only in-scope catalog Parts list; empty search shows actionable empty state; staleness badges match `catalog-freshness.md`; Part detail exposes BuildCores-derived compatibility attributes per `catalog-sources.md`.

- **CAP-3**
  - **intent:** User fills Slots through a guided recommendation path within budget and compatibility, or manual selection from compatible options, with a live summary of fill state, budget, and compatibility.
  - **success:** Guided path re-runs compatibility before each recommendation; manual path evaluates compatibility within 2s p95 for standard Builds; user can switch guided/manual per Slot without restarting; summary updates on every Slot change.

- **CAP-4**
  - **intent:** User marks a saved Build **Complete** (Finalized) when all Required Slots are satisfied, compatibility is not Invalid, and over-budget rules are met.
  - **success:** **Complete** blocked with explicit missing Required Slot list when incomplete; Invalid compatibility blocks **Complete**; over-budget **Complete** only after recorded acknowledgment; optional GPU empty allowed per `required-slots.md` with appropriate performance messaging.

- **CAP-5**
  - **intent:** System evaluates compatibility on every Build change and whenever a saved or shared Build is opened, blocking invalid persistence and sharing.
  - **success:** Enforced conflict classes include socket, chipset, RAM type, PSU wattage/connectors, GPU clearance and power, display vs GPU outputs; Invalid state prevents **Complete**, save, and share link; Warning allows save/share with visible warnings; each Invalid includes human-readable Slot/Part references.

- **CAP-6**
  - **intent:** User starts from Owned inventory with locked baseline Slots and changes only compatible, user-unlocked Slots (upgrade path).
  - **success:** Catalog filters for changeable Slots exclude Parts incompatible with owned baseline; unlocking an owned Slot requires explicit confirmation; budget delta isolates changed Slots.

- **CAP-7**
  - **intent:** User replaces unavailable or unwanted selections with Substitutes that respect material-spec equivalence rules.
  - **success:** Unavailable selection cannot reach **Complete** without replacement; offered Substitutes never material-downgrade per `substitute-matrix.md` and pass compatibility before display; user-initiated substitute search with empty-state explanation; apply replaces Slot and re-runs compatibility.

- **CAP-8**
  - **intent:** User views directional performance tiers for each declared game/app at declared display settings on Compatible or Warning Builds.
  - **success:** Tiers update when GPU, CPU, RAM, or display context changes; UI discloses directional nature per `performance-estimates.md`; Invalid Builds do not show misleading estimates.

- **CAP-9**
  - **intent:** User with verified email Account saves, reopens, edits, and deletes Builds across sessions.
  - **success:** Unauthenticated users assemble in-session only; unverified accounts cannot save; saved list shows name, last updated, compatibility and budget status; edits refresh compatibility and price/availability; deleted Builds invalidate share links.

- **CAP-10**
  - **intent:** User shares Compatible or Warning Builds, receives compatible swap suggestions from viewers, and compares two Builds side by side.
  - **success:** Invalid Builds cannot share; shared view read-only except suggest flow; incompatible suggestions never auto-apply; owner accept/reject; compare shows budget, compatibility, performance summary, Slot diffs with Region and price staleness labels; social suggestions notify in-app only (not transactional build emails).

- **CAP-11**
  - **intent:** Operators maintain BuildCores-based specs and Amazon.in scrape ingest for the curated catalog; users see staleness and scrape-incident transparency at Part and Build level.
  - **success:** Cadence and banners per `catalog-freshness.md` and `catalog-sources.md`; Build summary counts stale lines; SM-5 applies to active-catalog Parts only; spec last-updated visible on Parts.

- **CAP-12**
  - **intent:** User opens outbound **amazon.in** purchase links for Parts with a mapped listing from summary or detail, including export of the full parts list.
  - **success:** External-site disclosure; unmapped Parts show “find locally” without broken links; stale price triggers confirmation before link-out.

- **CAP-13**
  - **intent:** User receives transactional build summary email on finalize and batched price/availability alert emails for Finalized builds, with account-level opt-out.
  - **success:** Summary on each successful finalize (not Invalid/unverified/opt-out); includes build id, deep link, parts, INR prices, availability, staleness, total vs budget, compatibility—no retailer URLs; alerts only for real price/availability deltas on saved Finalized builds, max one per build per 48h, opt-out respected; finalize succeeds in-app even if email retries.

## Constraints

- **Region:** Single launch Region—India (INR)—for user budget and displayed prices; purchase link-out is **amazon.in** only in v1 MVP.
- **Catalog ingest:** Component specs from BuildCores Open DB; price, availability, and URLs from **scheduled amazon.in scrape** (no marketplace affiliate APIs). See `catalog-sources.md`.
- **Catalog breadth:** **Top parts only** at launch, limited to **2025–2026** model/release years per `catalog-sources.md`; full BuildCores breadth and additional retailers are later expansion.
- **Platform:** Responsive web only; no native mobile apps in v1.
- **Auth:** Email and password with verification before first save; password reset; no OAuth or social sign-in in v1.
- **Commerce:** Retailer link-out only; no in-app cart or checkout in v1.
- **Compatibility gate:** Invalid status blocks **Complete**, save, and share link generation.
- **Email content:** Transactional build summary and alert emails only—no marketing newsletters; no retailer URLs in email bodies; async send with retry and logging.
- **Staleness honesty:** Badge thresholds and feed-down banner per `catalog-freshness.md`; do not present stale prices as current.
- **Performance budgets:** Catalog browse interactive ≤3s p95 on 4G; compatibility evaluation ≤2s p95 for standard Builds (document if exceeded in architecture).
- **Security and abuse:** Unguessable share tokens; rate limits on suggestion endpoints and outbound build emails per account.
- **Accessibility:** WCAG 2.1 AA target for core build flows (aspirational v1).

## Non-goals

- Organization accounts, division templates, bulk procurement, dealer marketplace, RFQ, quotes, contracts, advance payments, dealer verification (v2 backlog).
- Review ecosystem, rich spec-compare UI, review-driven recommendations; real-time friend chat (v1.1 candidates).
- Revenue features at launch: affiliates, premium tiers, ads.
- OAuth / social login; multi-region launch; in-app unified cart/checkout.
- Manual spec entry for owned hardware not in catalog; marketing/promotional email newsletters.
- Native mobile applications.
- Full multi-retailer India price comparison at launch (Amazon.in only for commerce data in MVP).
- Importing the entire BuildCores catalog before the curated top-parts set is validated.

## Success signal

Within 90 days of launch, **≥45%** of started Builds (context set and at least one Slot filled) reach a **saved Compatible Build in one session** (SM-1), with **zero** Invalid Builds forced to save or share (SM-C1) and **≥95%** catalog freshness SLA for price and availability (SM-5)—demonstrating that the unified loop actually gets individuals to defensible, purchasable configurations they trust enough to return and edit when the market moves.

## Assumptions

- Catalog supports a popularity sort key for browse (FR-5).
- v1 Builds cap at ~12 Slots; manual selection uses commit-on-select compatibility UX with rollback on conflict (FR-9).
- Saved Builds are a single mutable version without history (FR-20).
- Spec ingest from BuildCores Open DB; launch seed filtered to **2025–2026** years, **≤30 Parts per Slot**; Amazon.in listing match is manual or semi-automated until matching tooling matures.
- Internal operators maintain curated part list and scrape health (FR-25–FR-26); critical spec errata within ~72h.
- Build email toggles default **on** for verified accounts; alert batching at most one email per build per 48 hours.
- SM-1/SM-3 baselines refined in beta analytics.
- Browser support: latest two versions of Chrome, Firefox, Safari, Edge.

## Open Questions

- Amazon.in **Part ↔ ASIN** matching workflow (manual spreadsheet vs search-assisted)—architecture spike.

---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
status: ready-for-development
inputDocuments:
  - ../initiative-pc-part-picker-builder/prd-pc-part-picker-builder/prd-pc-part-picker-builder.md
  - ../initiative-pc-part-picker-builder/prd-pc-part-picker-builder/addendum.md
  - ../initiative-pc-part-picker-builder/spec-pc-part-picker-builder/spec-pc-part-picker-builder.md
  - ../initiative-pc-part-picker-builder/spec-pc-part-picker-builder/functional-requirements.md
  - ../initiative-pc-part-picker-builder/spec-pc-part-picker-builder/glossary.md
  - ../initiative-pc-part-picker-builder/spec-pc-part-picker-builder/catalog-sources.md
  - ../initiative-pc-part-picker-builder/spec-pc-part-picker-builder/catalog-freshness.md
  - ../initiative-pc-part-picker-builder/spec-pc-part-picker-builder/required-slots.md
  - ../initiative-pc-part-picker-builder/spec-pc-part-picker-builder/substitute-matrix.md
  - ../initiative-pc-part-picker-builder/spec-pc-part-picker-builder/performance-estimates.md
  - ../initiative-pc-part-picker-builder/spec-pc-part-picker-builder/success-metrics.md
  - ../initiative-pc-part-picker-builder/architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md
---

# pc-part-picker-builder - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for pc-part-picker-builder, decomposing the requirements from the PRD, spec companions, and architecture spine into implementable stories. UX design contract: `../initiative-pc-part-picker-builder/ux-pc-part-picker-builder/` (`DESIGN.md` + `EXPERIENCE.md`, final 2026-10-12).

## Requirements Inventory

### Functional Requirements

FR-1: Set build budget in Region currency — running total visible; over-budget state; Complete while over budget only after user acknowledgment recorded.

FR-2: Declare primary use and workloads — performance estimate lists only declared workloads; updates when workloads change without new Parts if Build unchanged.

FR-3: Declare display resolution, refresh, panel — estimate uses display; missing blocks estimate until set or unknown-display reduced-confidence opt-out.

FR-4: Register owned parts into inventory — owned Parts fix mapped Slots; upgrade filters respect owned baseline; no manual non-catalog legacy specs in v1.

FR-5: Browse by Slot-aligned category — spec attrs for compatibility on detail; no out-of-Region Parts; sort includes price and popularity.

FR-6: Text search Parts — empty state not error; respects Slot context from picker.

FR-7: Show price, availability, staleness — stale price >24h and stale availability >4h badges per catalog-freshness rules.

FR-8: Guided build path — recommendations re-run compatibility each step; switch to manual per Slot.

FR-9: Manual slot selection — compatibility eval ≤2s p95 for ≤12 Slots; incompatible shows conflict before commit.

FR-10: Live build summary — updates on Slot change; Invalid blocks Complete; over-budget allowed with FR-1 acknowledgment.

FR-11: Always-on compatibility — on every change and on open saved/shared; conflict classes enforced; human-readable messages; server-owned (no client severity).

FR-12: Upgrade-from-owned flow — locked owned Slots; filters exclude incompatible; unlock owned Slot needs confirmation and empties Slot per AD-12.

FR-13: Block invalid complete/save/share — Warning allows save/share with warnings; Invalid blocks save, share link, and Complete.

FR-14: Detect unavailable selected parts — surfaces substitute workflow; cannot Complete without replacement.

FR-15: Spec-equivalent substitutes — no material downgrades; each passes compatibility before display (substitute-matrix).

FR-16: User-initiated substitute search — empty explains none found; apply replaces Slot and re-runs compatibility.

FR-17: Performance estimate tiers — per declared workload; updates on GPU/CPU/RAM/display change; disclaimer in UI (versioned lookup tables).

FR-18: No misleading estimate on Invalid — hidden/blocked with message to fix compatibility.

FR-19: Account required to save — unauthenticated can assemble in-session; save prompts auth; list shows name, status, budget.

FR-20: Open/edit saved builds — edits re-run compatibility and refresh price/availability; single mutable version v1.

FR-21: Delete saved build — confirmation; share links revoked.

FR-22: Share build link — Compatible or Warning only; read-only except FR-23; opaque high-entropy tokens.

FR-23: Suggest compatible swaps on shared build — owner accept/reject; incompatible never auto-applies; in-app notification only.

FR-24: Compare two builds — budget, compatibility, performance summary, Slot diffs; Region and staleness labeled.

FR-25: Maintain component catalog — spec last-updated on detail; critical errata ≤72h target; versioned catalog releases.

FR-26: Maintain price/availability feeds — amazon.in scrape per catalog-sources; cadence per catalog-freshness; global incident banner if scrape down >24h.

FR-27: Surface staleness to users — build-level stale counts; link-out warns when stale (FR-31).

FR-29: Required slots for Complete — per required-slots.md (CPU, cooler, motherboard, RAM, storage, case, PSU; GPU optional with performance warnings).

FR-30: Email registration and verification — verify before first save; password reset; httpOnly sessions; no OAuth v1.

FR-31: Retailer link-out per Part — amazon.in URLs for mapped Parts; external disclosure; export lists link-outs; stale price confirmation.

FR-32: Build summary email on finalize — one per finalize event; content rules; skip if Invalid/unverified/opt-out; no retailer URLs; async with retry.

FR-33: Build alert email on price/availability change — Finalized builds only; changed Parts since last alert; max one per build per 48h; opt-out/unverified skip.

FR-34: Email notification settings — toggles for FR-32 and FR-33; default on for verified; future sends only.

_Note: PRD numbering skips FR-28; no FR-28 in v1 contract._

### NonFunctional Requirements

NFR-1 (Platform): Web-first responsive UI; latest two versions of Chrome, Firefox, Safari, Edge.

NFR-2 (Performance): Catalog browse interactive ≤3s p95 on 4G; manual compatibility evaluation ≤2s p95 for standard Builds (≤12 Slots).

NFR-3 (Security): Email-verified accounts before first save; session auth; unguessable share tokens; rate-limit suggestion endpoints; rate-limit outbound build emails per account.

NFR-4 (Email transactional): FR-32 and FR-33 only in v1; no marketing content; in-app build id and deep link; no retailer URLs in email body.

NFR-5 (Email reliability): Async send with retry; failures logged; finalize succeeds in-app even when summary email is retrying.

NFR-6 (Accessibility): WCAG 2.1 AA aspirational target for core build flows.

NFR-7 (Privacy): Share links expose only Build data user confirms; social features opt-in where applicable.

NFR-8 (Observability): Structured logging and events for compatibility failures, substitute offers, staleness breaches, email send failures; analytics envelope schemaVersion v1 (AD-15); success metrics SM-1, SM-C1, SM-5 instrumentation.

NFR-9 (Data): PostgreSQL sole system of record; money as integer paise (INR); ULIDs for Build, Part, Account; API errors `{ code, message, details? }`.

NFR-10 (Region): India launch — INR, india catalog, amazon.in link-out scope.

### Additional Requirements

- **Epic 1 / greenfield starter:** pnpm workspace with `apps/frontend` (React 19.3 SPA), `apps/api` (NestJS 11.x), `apps/worker` (RabbitMQ consumers); `packages/domain`, `packages/db` (Prisma 6.x), `packages/shared`; Node 24.21.0; TypeScript 5.9.

- **Local infra:** Docker Compose for PostgreSQL 16, RabbitMQ 4.x, Redis 7.4 LTS (`infra/compose.yaml`).

- **AD-16 layering:** `packages/domain` framework-free; Nest and React are adapters only; no compat Invalid/Warning logic in frontend.

- **AD-3 / AD-14:** BuildService sole write path; persisted eval snapshot after every compat run; gates save/share/complete on post-eval status.

- **AD-6 async:** Transactional outbox in PostgreSQL; publish to RabbitMQ after commit; worker idempotent consumers with retries and DLQ for scrape, BuildCores sync, email.

- **AD-4 / AD-5:** Separate spec ingest from commerce scrape; versioned compat rules per catalogReleaseId; staleness timestamps drive badges and incident banner.

- **AD-7:** Opaque share tokens; rate limits on suggestions and outbound email.

- **AD-11:** httpOnly cookies; SPA/API cookie strategy (subdomains or BFF); unauthenticated Build in-session only until save.

- **AD-13 / AD-15:** Analytics events with required envelope fields; ULID ids throughout.

- **Patterns (v1):** Repository + UoW for Build mutations; Strategy/registry for compat rules; Specification for catalog filters; DTO+mappers at API edge; adapters for scrape/SMTP/BuildCores.

- **Catalog launch:** BuildCores spec ingest + curation; operator CSV for Part↔ASIN mapping; unmapped Parts “find locally” without broken links.

- **Operator catalog ops:** Protected operator surface TBD (`/admin` or equivalent); role `operator` for curation.

- **Deployments:** local, staging, production; no multi-region v1.

### UX Design Requirements

_UX contract finalized in `ux-pc-part-picker-builder/` — shadcn POC visuals, desktop-primary guided assembly + per-slot picker, operator admin slice. Post-POC surfaces (share, compare, notifications, full substitutes) named in EXPERIENCE.md._

### FR Coverage Map

FR-1: Epic 5 — Budget in INR with running total and over-budget acknowledgment
FR-2: Epic 5 — Declare use and workloads for performance estimate
FR-3: Epic 5 — Declare display characteristics for performance estimate
FR-4: Epic 5 — Register owned parts into inventory and slot locks
FR-5: Epic 3 — Browse catalog by Slot-aligned category
FR-6: Epic 3 — Text search Parts with Slot context
FR-7: Epic 3 — Price, availability, and staleness badges on Parts
FR-8: Epic 5 — Guided build path with per-step compatibility
FR-9: Epic 5 — Manual slot selection with p95 compat target
FR-10: Epic 5 — Live build summary (budget, compat, performance entry)
FR-11: Epic 5 — Server-owned compatibility on change and open
FR-12: Epic 5 — Upgrade-from-owned flow and unlock rules
FR-13: Epic 5 — Invalid/Warning gates for save/share (complete gate in Epic 6)
FR-14: Epic 5 — Unavailable part detection and substitute entry
FR-15: Epic 5 — Spec-equivalent substitute filtering
FR-16: Epic 5 — User-initiated substitute search and apply
FR-17: Epic 5 — Directional performance estimate tiers
FR-18: Epic 5 — Block/hide estimate when Invalid
FR-19: Epic 6 — Account required to save; list saved builds
FR-20: Epic 6 — Open/edit saved builds with re-eval on open
FR-21: Epic 6 — Delete build and revoke share links
FR-22: Epic 7 — Share build link (Compatible/Warning only)
FR-23: Epic 7 — Suggest swaps on shared build; owner accept/reject
FR-24: Epic 7 — Compare two builds
FR-25: Epic 4 — Maintain component catalog and releases
FR-26: Epic 4 — Price/availability feeds and scrape cadence
FR-27: Epic 3 — Build-level staleness surfacing
FR-29: Epic 6 — Required Slots and **Complete** / **Finalized** gate
FR-30: Epic 2 — Email registration, verification, password reset
FR-31: Epic 8 — Amazon.in link-out per mapped Part
FR-32: Epic 9 — Build summary email on finalize
FR-33: Epic 9 — Price/availability alert emails (48h cap)
FR-34: Epic 9 — Email notification toggles

## Epic List

### Epic 1: Application foundation

Deliver a runnable **pnpm** monorepo (`frontend`, `api`, `worker`, shared packages), local **Docker Compose** (PostgreSQL, RabbitMQ, Redis), Prisma baseline schema, health checks, and hexagonal package boundaries per architecture spine—without end-user product flows yet.

**FRs covered:** _(scaffolding; enables all FRs — no direct FR IDs)_

**NFRs addressed:** NFR-9 (data conventions seed), deployment/local env.

---

### Epic 2: Identity & in-session build shell

Users can **register, verify email, sign in**, and start a **Build in session only** (no cross-session save). httpOnly sessions and AD-11 save gate enforced.

**FRs covered:** FR-30 (FR-19 partial: assemble in-session without persist)

---

### Epic 3: India catalog browse & search

Users can **browse by Slot**, **search Parts**, and see **price, availability, and staleness** with build-level stale signals.

**FRs covered:** FR-5, FR-6, FR-7, FR-27

**Depends on:** Epic 4 far enough for seed catalog data.

---

### Epic 4: Catalog operations & commerce freshness

Operators and workers maintain **catalog releases**, **spec ingest**, **amazon.in scrape**, freshness timestamps, and **global incident banner** when feeds are stale.

**FRs covered:** FR-25, FR-26

---

### Epic 5: Assemble & validate a compatible build

Users set **budget, context, owned parts**; use **guided and manual** assembly; see **live summary**, **server compatibility**, **performance tiers**, and **substitutes**—through **Warning/Invalid** states but **without Finalize/Complete or save** (those ship in Epic 6).

**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-8, FR-9, FR-10, FR-11, FR-12, FR-13 (save/share/complete gates deferred to Epic 6 for Complete/Finalize), FR-14, FR-15, FR-16, FR-17, FR-18

**Depends on:** Epic 2 (session), Epic 3 (catalog UI), Epic 4 (data).

---

### Epic 6: Save, finalize & manage builds

Verified users **save**, **list**, **open/edit**, and **delete** builds; **Complete/Finalize** with required Slots (FR-29); **Invalid** blocks save, share, and Complete per FR-13.

**FRs covered:** FR-19, FR-20, FR-21, FR-29, FR-13 (complete/save/share enforcement at persist and finalize)

**Depends on:** Epic 5 (full assembly loop).

---

### Epic 7: Share, suggest & compare

Users **share** read-only links, **suggest** compatible swaps, and **compare** two builds with staleness and Region labeled.

**FRs covered:** FR-22, FR-23, FR-24

**Depends on:** Epic 6 (saved/shared build with eval snapshot).

---

### Epic 8: Retailer link-out

Users get **amazon.in link-out** per mapped Part, external disclosure, export lists, and **stale price confirmation** on handoff.

**FRs covered:** FR-31

**Depends on:** Epic 3/4 (commerce listings), Epic 6 (meaningful build to link out).

---

### Epic 9: Transactional build emails

**Summary email on finalize**, **price/availability alerts** (batched), and **notification settings**—async via outbox/RabbitMQ; no retailer URLs in email.

**FRs covered:** FR-32, FR-33, FR-34

**Depends on:** Epic 6 (finalize), Epic 4 (commerce timestamps).

---

## Epic 1: Application foundation

Deliver a runnable pnpm monorepo with local infra and package boundaries per architecture spine.

### Story 1.1: Monorepo scaffold and pinned toolchain

As a **developer**,
I want a **pnpm workspace** with `apps/frontend`, `apps/api`, `apps/worker`, and `packages/domain`, `packages/db`, `packages/shared`,
So that **all teams share one repo layout aligned to the architecture spine**.

**Acceptance Criteria:**

**Given** a clean clone of the repository
**When** I run the documented install command with Node 24.21.0
**Then** workspace packages resolve and TypeScript 5.9 builds at the root
**And** pinned versions match the architecture stack table (Nest 11.x, React 19.3, Prisma 6.x) in lockfile or `.npmrc` policy

### Story 1.2: Local infrastructure via Docker Compose

As a **developer**,
I want **PostgreSQL 16**, **RabbitMQ 4.x**, and **Redis 7.4** running locally,
So that **api and worker can integrate against real dependencies**.

**Acceptance Criteria:**

**Given** Docker is available
**When** I start `infra/compose.yaml`
**Then** Postgres, RabbitMQ management, and Redis accept connections on documented ports
**And** README documents connection env vars for `api` and `worker`

### Story 1.3: Prisma baseline and API health check

As a **developer**,
I want a **minimal Prisma schema** and **Nest health endpoint** wired to Postgres,
So that **migrations and DB connectivity are proven before feature tables**.

**Acceptance Criteria:**

**Given** Compose is up
**When** I run Prisma migrate and start `apps/api`
**Then** `GET /health` returns success and confirms database reachability
**And** only migration tables required for health exist (no premature full domain schema)

### Story 1.4: Hexagonal package boundaries

As a **developer**,
I want **`packages/domain` free of Nest/Prisma/RabbitMQ imports** and empty `apps/worker` consumer skeleton,
So that **AD-16 layering is enforceable from day one**.

**Acceptance Criteria:**

**Given** the workspace builds
**When** I run lint or dependency-cruiser rules (or documented manual check)
**Then** `packages/domain` has zero imports from framework or infra packages
**And** `apps/worker` boots and connects to RabbitMQ without processing business jobs yet

### Story 1.5: React SPA shell and API CORS baseline

As a **developer**,
I want a **minimal React app** that calls the API health endpoint,
So that **frontend ↔ api wiring and CORS policy are validated**.

**Acceptance Criteria:**

**Given** api and frontend dev servers run
**When** the SPA loads
**Then** it displays API health status from the Nest backend
**And** non-production CORS allows the configured frontend origin

---

## Epic 2: Identity & in-session build shell

Users register, verify, sign in, and hold a Build in session only.

### Story 2.1: Register with email and password

As a **prospective builder**,
I want to **create an account with email and password**,
So that **I can later verify and save builds**.

**Acceptance Criteria:**

**Given** I am logged out
**When** I submit valid email and password on the registration form
**Then** an Account is created with `verified=false` and a verification flow is triggered
**And** passwords are stored hashed; no session is treated as verified-for-save (FR-30)

### Story 2.2: Verify email before save eligibility

As a **registered user**,
I want to **confirm my email via the verification link**,
So that **I become eligible to save builds after verification**.

**Acceptance Criteria:**

**Given** I have an unverified account
**When** I complete email verification
**Then** `verified=true` on the Account
**And** save endpoints remain blocked until verified (FR-30, AD-11)

### Story 2.3: Login, session, and logout

As a **builder**,
I want to **log in and out with a secure session**,
So that **my identity persists across browser restarts when logged in**.

**Acceptance Criteria:**

**Given** valid credentials
**When** I log in
**Then** the API sets an **httpOnly** session cookie per AD-11
**And** logout clears the session; invalid credentials return a stable error shape

### Story 2.4: Password reset

As a **builder**,
I want to **reset my password via email**,
So that **I can recover access without support**.

**Acceptance Criteria:**

**Given** a registered email
**When** I request reset and follow the emailed link
**Then** I can set a new password and log in
**And** reset tokens are single-use and expire (FR-30)

### Story 2.5: Start an in-session Build

As a **builder** (authenticated or anonymous),
I want to **start a new Build stored in session only**,
So that **I can assemble without an account until I choose to save**.

**Acceptance Criteria:**

**Given** no saved Build id in context
**When** I start a new build
**Then** the API returns a Build id held client-side / session binding without cross-session persist for anonymous users
**And** authenticated unverified users can assemble but cannot save (FR-19 partial, AD-11)

---

## Epic 3: India catalog browse & search

Users browse and search the India catalog with staleness visible.

### Story 3.1: Browse Parts by Slot category

As a **builder**,
I want to **browse Parts for a selected Slot category**,
So that **I see only in-Region, Slot-aligned components**.

**Acceptance Criteria:**

**Given** an active catalog release with Parts in a Slot
**When** I open that Slot picker
**Then** I see a list sortable by price and popularity (FR-5)
**And** no out-of-Region Parts appear

### Story 3.2: Part detail with compatibility-oriented specs

As a **builder**,
I want **Part detail showing spec attributes needed for compatibility**,
So that **I can compare options informedly**.

**Acceptance Criteria:**

**Given** a Part in the active catalog
**When** I open its detail view
**Then** spec fields required for compat are shown with spec last-updated when available (FR-5, FR-25 display)

### Story 3.3: Text search Parts

As a **builder**,
I want to **search Parts by text**,
So that **I find SKUs quickly within picker context**.

**Acceptance Criteria:**

**Given** a Slot context from the build picker
**When** I search with a query matching zero Parts
**Then** I see an empty state, not an error (FR-6)
**And** results respect Slot context when launched from a Slot

### Story 3.4: Staleness badges on Part cards

As a **builder**,
I want **stale price and availability badges** on Parts,
So that **I do not trust outdated commerce data**.

**Acceptance Criteria:**

**Given** `last_price_capture_at` or `last_availability_capture_at` beyond thresholds in `catalog-freshness.md`
**When** I view the Part
**Then** appropriate stale badges appear (FR-7)
**And** badges derive only from persisted capture timestamps (AD-5)

### Story 3.5: Build-level stale commerce summary

As a **builder**,
I want a **count of stale price/availability on my current Build**,
So that **I know when to refresh before buying**.

**Acceptance Criteria:**

**Given** a Build with selected Parts
**When** I view the build summary
**Then** stale counts are shown per FR-27 rules
**And** counts update when selections change

---

## Epic 4: Catalog operations & commerce freshness

Operators and workers keep catalog and commerce data fresh.

### Story 4.1: Catalog release and BuildCores spec ingest

As an **operator**,
I want to **import and publish a catalog release from BuildCores spec data**,
So that **compatibility rules version with the release**.

**Acceptance Criteria:**

**Given** validated BuildCores snapshot input
**When** a spec ingest job completes
**Then** a `CatalogRelease` is active with Parts created/updated per `catalog-sources.md` without overwriting commerce-only fields (AD-4, FR-25)
**And** compat rule set version is tied to the release id

### Story 4.2: Operator Part ↔ ASIN CSV import

As an **operator**,
I want to **import ASIN mappings via validated CSV**,
So that **mapped Parts can link to amazon.in**.

**Acceptance Criteria:**

**Given** a CSV matching the documented schema
**When** import runs
**Then** `CommerceListing` rows attach to Parts with validation errors reported per row
**And** unmapped Parts remain valid catalog entries (architecture structural seed)

### Story 4.3: Commerce scrape worker job

As the **system**,
I want **scheduled amazon.in scrape jobs** for mapped ASINs,
So that **price and availability timestamps stay current**.

**Acceptance Criteria:**

**Given** mapped Parts in the active catalog
**When** a scrape job runs via RabbitMQ worker
**Then** `last_price_capture_at` and `last_availability_capture_at` update per Part (FR-26, AD-6)
**And** scrape does not mutate BuildCores spec fields (AD-4)

### Story 4.4: Global catalog incident banner

As a **builder**,
I want a **site banner when commerce scrape has not succeeded in >24h**,
So that **I know listings may be stale globally**.

**Acceptance Criteria:**

**Given** no successful active-catalog scrape in >24h
**When** I use the app
**Then** a global incident flag drives a visible banner (AD-5, FR-26)
**And** banner clears when a successful scrape completes

### Story 4.5: Activate compat rules for catalog release

As the **system**,
I want **evaluation to use the active catalog release and its rule set**,
So that **compat results are consistent for all users**.

**Acceptance Criteria:**

**Given** a new catalog release is marked active
**When** compat runs on a Build mutation
**Then** `catalogReleaseIdAtEvaluation` and `compatRuleSetVersionAtEvaluation` reflect the active release (AD-4, AD-14 seed)

---

## Epic 5: Assemble & validate a compatible build

Core build loop without save, finalize, or share.

### Story 5.1: Set budget and over-budget acknowledgment

As a **builder**,
I want to **set my budget in INR and see running total**,
So that **I stay within my spending goal**.

**Acceptance Criteria:**

**Given** a Build in session
**When** I set budget and add priced Parts
**Then** running total and over-budget state display (FR-1)
**And** over-budget acknowledgment is recorded when user proceeds (Complete deferred to Epic 6)

### Story 5.2: Declare use, workloads, and display

As a **builder**,
I want to **declare primary use, games/apps, and display specs**,
So that **performance estimates match my real setup**.

**Acceptance Criteria:**

**Given** a Build
**When** I set workloads and display fields
**Then** performance section lists only declared workloads (FR-2)
**And** missing display blocks estimate until set or unknown-display opt-out (FR-3)

### Story 5.3: Register owned parts and slot locks

As a **builder**,
I want to **mark Parts I already own on their Slots**,
So that **upgrade paths respect my inventory**.

**Acceptance Criteria:**

**Given** catalog Parts in mapped Slots
**When** I register owned Parts
**Then** those Slots lock as owned on the server Build model (FR-4, AD-12)
**And** unlock requires confirmation and empties the Slot per AD-12

### Story 5.4: Guided build recommendations

As a **builder**,
I want a **guided path that recommends compatible Parts per step**,
So that **I can assemble quickly with confidence**.

**Acceptance Criteria:**

**Given** guided mode for a Slot sequence
**When** I accept a recommendation
**Then** compatibility re-runs before the next step (FR-8)
**And** I can switch to manual selection for any Slot

### Story 5.5: Manual slot selection with compat preview

As a **builder**,
I want to **pick a Part manually with conflict shown before commit**,
So that **I understand incompatibilities early**.

**Acceptance Criteria:**

**Given** manual pick for a Slot with ≤12 Slots in Build
**When** I evaluate candidates
**Then** compat completes within 2s p95 target for standard Builds (FR-9, AD-8)
**And** Invalid conflicts show human-readable messages before commit (FR-11)

### Story 5.6: Live build summary

As a **builder**,
I want a **live summary of Slots, budget, and compatibility status**,
So that **I always know build health**.

**Acceptance Criteria:**

**Given** a Build with selections
**When** I change any Slot
**Then** summary updates including compat status and performance entry point (FR-10)
**And** Invalid status blocks Complete action in UI (finalize in Epic 6)

### Story 5.7: Server compatibility on every mutation

As the **system**,
I want **BuildService to run the compat engine on every mutation**,
So that **clients never own Invalid vs Warning**.

**Acceptance Criteria:**

**Given** any Build mutation via API
**When** the mutation succeeds
**Then** persisted eval snapshot fields update per AD-14 (`compatibilityStatus`, warnings, conflicts, etc.)
**And** severity comes only from the versioned rules registry (AD-2, FR-11)

### Story 5.8: Substitute discovery and apply

As a **builder**,
I want **substitutes when my Part is unavailable**,
So that **I can swap without material downgrades**.

**Acceptance Criteria:**

**Given** an unavailable selected Part
**When** substitutes are offered
**Then** each passes substitute-matrix equivalence then compat engine (FR-14, FR-15, AD-9)
**And** apply replaces the Slot and re-runs compat (FR-16)

### Story 5.9: Performance estimate tiers

As a **builder**,
I want **directional performance tiers for declared workloads**,
So that **I set expectations without benchmark scraping**.

**Acceptance Criteria:**

**Given** a Compatible or Warning Build with declared workloads
**When** I view performance estimate
**Then** tiers come from versioned lookup tables with UI disclaimer (FR-17, AD-10)
**And** estimate is hidden/blocked when status is Invalid (FR-18)

---

## Epic 6: Save, finalize & manage builds

Verified users persist, finalize, and manage Builds.

### Story 6.1: Save build (verified accounts only)

As a **verified builder**,
I want to **save my Build**,
So that **I can return later on any device**.

**Acceptance Criteria:**

**Given** I am verified and compat is not Invalid
**When** I save
**Then** the Build persists in PostgreSQL via BuildService only (FR-19, AD-3)
**And** unverified or anonymous users receive a clear save-blocked response (FR-30, AD-11)

### Story 6.2: List saved builds

As a **verified builder**,
I want to **see my saved Builds with status and budget**,
So that **I can pick up where I left off**.

**Acceptance Criteria:**

**Given** I have saved Builds
**When** I open my builds list
**Then** each row shows name, last updated, compatibility status, and budget state (FR-19)

### Story 6.3: Open and edit saved build with re-evaluation

As a **verified builder**,
I want to **open a saved Build and edit it**,
So that **compat and commerce data refresh for today’s catalog**.

**Acceptance Criteria:**

**Given** a saved Build id I own
**When** I open it
**Then** compat runs on open and AD-14 snapshot updates with active catalog release (FR-20, AD-2)
**And** price/availability refresh from current catalog commerce fields

### Story 6.4: Delete build and revoke share tokens

As a **verified builder**,
I want to **delete a saved Build**,
So that **it and its share links are gone**.

**Acceptance Criteria:**

**Given** a saved Build
**When** I confirm delete
**Then** the Build is removed and associated ShareTokens are revoked (FR-21, AD-7)

### Story 6.5: Complete and finalize with required Slots

As a **verified builder**,
I want to **mark my Build Complete/Finalized when requirements are met**,
So that **I can treat it as my plan of record**.

**Acceptance Criteria:**

**Given** required Slots per `required-slots.md` are filled and compat is not Invalid
**When** I Complete
**Then** Build enters Finalized state and over-budget requires prior FR-1 acknowledgment (FR-29, FR-13)
**And** Invalid blocks Complete; Warning allows Complete with warnings attached

---

## Epic 7: Share, suggest & compare

Social MVP for builds.

### Story 7.1: Create share link

As a **verified builder**,
I want a **share link for my Compatible or Warning Build**,
So that **friends can view my plan**.

**Acceptance Criteria:**

**Given** my Build is not Invalid
**When** I create a share link
**Then** an opaque high-entropy ShareToken is stored server-side (FR-22, AD-7)
**And** Invalid Builds cannot create share links (FR-13)

### Story 7.2: View shared build read-only

As a **viewer with a share link**,
I want to **see the shared Build read-only**,
So that **I understand the configuration without editing**.

**Acceptance Criteria:**

**Given** a valid share token
**When** I open the share URL
**Then** I see Build data using AD-14 eval snapshot fields after open-time refresh
**And** I cannot mutate the owner’s Build except via FR-23 suggestion flow

### Story 7.3: Suggest compatible swaps on shared build

As a **viewer**,
I want to **suggest compatible Part swaps**,
So that **the owner can consider improvements**.

**Acceptance Criteria:**

**Given** a shared Build and authenticated viewer
**When** I submit a suggestion
**Then** only compatible suggestions are accepted; owner can accept/reject in-app (FR-23)
**And** suggestion endpoints are rate-limited per account (AD-7, NFR-3)

### Story 7.4: Compare two builds

As a **verified builder**,
I want to **compare my Build with another shared Build**,
So that **I see budget, compat, performance, and Slot diffs**.

**Acceptance Criteria:**

**Given** two accessible Build ids
**When** I run compare
**Then** summary shows budget, compatibility, performance estimate summary, Slot diffs, Region and staleness labels (FR-24)

---

## Epic 8: Retailer link-out

Purchase handoff to amazon.in.

### Story 8.1: Link-out for mapped Parts

As a **builder**,
I want **amazon.in links for mapped Parts**,
So that **I can buy components**.

**Acceptance Criteria:**

**Given** a Part with a CommerceListing ASIN
**When** I link out
**Then** I am sent to amazon.in with external-site disclosure (FR-31)
**And** link opens in a new tab/window per product policy

### Story 8.2: Unmapped Part “find locally” UX

As a **builder**,
I want **clear guidance when no amazon.in mapping exists**,
So that **I am not shown broken retailer links**.

**Acceptance Criteria:**

**Given** a Part without ASIN mapping
**When** I view link-out affordance
**Then** UI shows find-locally / no broken amazon.in URL (architecture seed)

### Story 8.3: Stale price confirmation on link-out

As a **builder**,
I want **confirmation when price data is stale**,
So that **I do not checkout on outdated prices**.

**Acceptance Criteria:**

**Given** stale price per FR-7 thresholds
**When** I attempt link-out
**Then** I must confirm stale price warning (FR-31, FR-27)

### Story 8.4: Export build link-out list

As a **builder**,
I want to **export a list of link-outs for my Build**,
So that **I can shop offline or share with a store**.

**Acceptance Criteria:**

**Given** a Build with selections
**When** I export link-outs
**Then** export lists mapped URLs and labels unmapped Parts appropriately (FR-31)

---

## Epic 9: Transactional build emails

Async email via outbox and worker.

### Story 9.1: Outbox relay and email worker plumbing

As the **system**,
I want **transactional outbox → RabbitMQ → email worker**,
So that **HTTP never blocks on SMTP**.

**Acceptance Criteria:**

**Given** an outbox row committed with a Build event
**When** the relay publishes and the worker consumes
**Then** email send runs with retries and DLQ configured (AD-6, NFR-5)
**And** finalize API succeeds even if email is still retrying

### Story 9.2: Build summary email on finalize

As a **verified builder**,
I want a **summary email when I finalize**,
So that **I have a record in my inbox**.

**Acceptance Criteria:**

**Given** a successful Finalize and verified opt-in defaults
**When** finalize completes
**Then** one summary email is queued per finalize event (FR-32)
**And** body includes in-app build id and deep link; no retailer URLs (NFR-4)

### Story 9.3: Price and availability alert emails

As a **verified builder**,
I want **alerts when finalized Build Part commerce changes**,
So that **I can react to market shifts**.

**Acceptance Criteria:**

**Given** a Finalized Build and changed commerce since last alert
**When** alert job runs
**Then** at most one email per Build per 48h (FR-33)
**And** skipped when unverified, Invalid, or opted out

### Story 9.4: Email notification settings

As a **verified builder**,
I want **toggles for summary and alert emails**,
So that **I control future sends**.

**Acceptance Criteria:**

**Given** account settings
**When** I toggle FR-32 or FR-33 notifications
**Then** future sends respect FR-34; defaults on for verified accounts
**And** changes do not resend historical emails

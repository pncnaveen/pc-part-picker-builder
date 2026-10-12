---
name: PC Part Picker & Builder
description: Desktop-primary web SPA — guided assembly, server-owned compatibility, operator admin; POC slice defined
status: final
created: 2026-10-12
updated: 2026-10-12T15:00
sources:
  - ../architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md
  - ../../planning-artifacts/epics.md
  - ../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md
  - ../spec-pc-part-picker-builder/spec-pc-part-picker-builder.md
---

# PC Part Picker & Builder — Experience Spine

> Visual identity: `DESIGN.md`. Server owns compatibility severity and gates (AD-2, AD-3); UI renders API results only. **Spines win on conflict** with mocks, wireframes, or imports.

Working references (non-authoritative): `.working/ia-draft-desktop-poc.md`, `.working/uj-1-jordan-guided-desktop.md`.

## Foundation

- **Form factor:** Responsive **web SPA** (React 19), **desktop-primary** for assembly; scales down to tablet/phone for browse, auth, and shared read-only views.
- **UI system:** **shadcn/ui + Tailwind** on Vite SPA (`apps/frontend`). Unstyled behavior specified here; look inherits shadcn unless `DESIGN.md` overrides.
- **Region:** India — INR, india catalog, amazon.in link-out when mapped (Epic 8).
- **POC slice:** Context → guided assembly with per-slot catalog picker → live build summary + compat + performance entry; operator **admin** parts + ASIN CSV import. Share, compare, notification settings, full substitute flows, finalize/save polish — **contracted in spine, implementation after POC** unless noted.

## Information Architecture

| Surface | Route | POC | Purpose |
|---------|-------|-----|---------|
| Home | `/` | Yes | Start build, sign in |
| Build context | `/build/:id/context` | Yes | Budget, use, workloads, display, owned parts (FR-1–4) |
| Guided assembly | `/build/:id/guided` | Yes | FR-8 guided steps; FR-9 via picker |
| Catalog picker | Sheet on guided | Yes | Slot-filtered browse/search (FR-5, FR-6) |
| Part detail | `/catalog/:partId` | Optional POC | Spec + staleness (FR-7) |
| Build summary | Docked panel | Yes | FR-10 live summary |
| Auth | `/login`, `/register`, `/verify` | Thin POC | FR-30 |
| My builds | `/builds` | Post-POC | FR-19–21 |
| Shared build | `/share/:token` | Post-POC | FR-22–23 |
| Compare | `/compare` | Post-POC | FR-24 |
| Notification settings | `/settings/notifications` | Post-POC | FR-34 |
| Admin home | `/admin` | Yes | Operator entry, health |
| Admin parts | `/admin/parts` | Yes | Curation list |
| ASIN import | `/admin/import/asin` | Yes | Story 4.2 CSV |

**Navigation model:** Builder uses **linear context → guided** with persistent summary. Admin is a separate **simple top nav** (no shared shell marketing). No global command palette in POC.

→ IA diagram: `.working/ia-draft-desktop-poc.md`

## Voice and Tone

Plain, confident, non-patronizing — speaks equally to Jordan (first build) and Sam (upgrader).

| Do | Don't |
|----|-------|
| "This part doesn't fit your case." | "Oops! Something went wrong with your build!" |
| "Price from Amazon · updated 2 days ago" | "Stale!!!" |
| "Estimates are directional, not benchmarks." | "You'll get 240 FPS guaranteed." |
| "Sign in to save this build." | "Create an account to unlock awesome features!" |

Microcopy for **Invalid** states names the conflict class in server `message` — UI does not paraphrase into weaker language.

## Component Patterns

| Pattern | Use | Behavioral rules |
|---------|-----|------------------|
| **Guided step** | `/build/:id/guided` | One Slot focus; 1–3 server recommendations; **Accept** commits via API; re-fetch summary + compat snapshot after each mutation. |
| **Choose different part** | Guided step | Opens **Sheet** with Slot-locked catalog list + search; selecting a row runs **preview eval**; **Add to build** disabled on Invalid; Warning shows confirm affordance. |
| **Build summary panel** | Docked `≥ lg` | Budget progress, compat badge, slot checklist (required labeled), performance teaser, stale line count (FR-27). Updates on every successful mutation. |
| **Compat message list** | Guided + summary | Renders server conflicts grouped by severity; Invalid blocks Accept on that part. |
| **Performance panel** | Summary | Opens `Dialog`; tiers per declared workload; disclaimer visible; empty/hidden when Invalid (FR-18). |
| **Owned part row** | Context | Register owned catalog Part; locks Slot until unlock confirm (FR-12, AD-12). |
| **Admin table** | `/admin/*` | Sortable parts; CSV upload → preview → confirm import; no inline scrape triggers from UI (worker-only). |
| **Incident banner** | Global | When global incident flag set — `Alert` dismissible per session; links to staleness help copy only. |

## State Patterns

| State | Surface | Treatment |
|-------|---------|-----------|
| Eval loading | Guided / picker | Disable Accept/Add; `Skeleton` on summary compat line. |
| Compatible | Summary | `{DESIGN.md.components.compat-badge-compatible}` |
| Warning | Summary + save/share when live | Allow proceed with visible warning list; gates per AD-3 |
| Invalid | Guided / picker | Block commit; show conflicts; no Complete/save/share when those surfaces exist |
| Over budget | Summary | Show amount over; acknowledgment control (FR-1); Complete rules in Epic 6 |
| Stale price / availability | Part line | Badges per `catalog-freshness.md`; link-out confirms if stale (FR-31) |
| Unauthenticated save | Any | Modal: register/sign in; in-session build retained |
| Empty catalog search | Picker | "No parts match. Try a different search." — not an error toast |
| POC small viewport | Guided | Soft banner to use larger screen `[ASSUMPTION]` |

## Interaction Primitives

- **Mouse-first** on desktop; full keyboard path via shadcn defaults (`Tab`, `Enter`, `Esc` closes Sheet).
- **No** manual-mode toggle in POC — FR-9 satisfied only through **Choose different part** per Slot.
- **Single overlay depth** — Sheet OR Dialog, not both.
- **Banned in POC:** drag-and-drop slot reorder, client-side compat preview without API, nested wizards beyond context→guided.

## Accessibility Floor

- Target **WCAG 2.1 AA** on core build flows (NFR-6) — focus visible via shadcn `ring`; compat status not color-only (text label + badge).
- `aria-live="polite"` on compat summary region after eval completes.
- Budget and total announced when updated if user focus in summary region.
- Admin tables: header `scope`; CSV errors linked to row-level messages.

## Responsive & Platform

| Breakpoint | Builder behavior |
|------------|------------------|
| `≥ lg` | Two-column guided + sticky summary |
| `md` | Stacked; summary in collapsible header + Sheet |
| `< md` | Soft gate on guided assembly; home/auth/share still usable |

Supported browsers per NFR-1 (latest two Chrome, Firefox, Safari, Edge).

## Key Flows

### UJ-1 — Jordan finishes a first compatible build under budget

**Protagonist:** Jordan, 24, first desktop build, ₹1,00,000, keeps 1440p 165Hz monitor. **Entry:** Unauthenticated on `/`.

1. Start a build → in-session build created → `/build/:id/context`.
2. Set budget, India Region, games use + two titles, display 1440p/165Hz, register owned monitor.
3. Continue to guided assembly; accept recommendations slot by slot with live summary updates.
4. Swap GPU once via **Choose different part**; server preview blocks Invalid clearance picks.
5. Open performance panel; read directional tiers + disclaimer for declared games.
6. **Climax:** Summary shows **Compatible**, under budget, performance band meets target for declared games.
7. **Resolution (v1):** Verify email, save, Complete/Finalize, optional share; build summary email if enabled.
8. **Failure path:** GPU case clearance Invalid → Complete disabled; conflict copy from server; picker shows compatible alternates only.

POC may end at step 6. Expanded script: `.working/uj-1-jordan-guided-desktop.md`.

### UJ-2 — Sam upgrades from a partial owned rig

**Protagonist:** Sam, owns CPU/board/RAM/PSU/case, GPU upgrade ≤ ₹35,000. **Entry:** Authenticated; **Upgrade from what I own** (v1 home) or equivalent context path.

1. Register owned Parts; fixed Slots lock with owned baseline (FR-4, FR-12).
2. Open guided flow at GPU step (or jump via summary checklist).
3. **Choose different part** → catalog filtered by board, PSU headroom, case length (server).
4. Select GPU; summary shows budget **delta on changed Slots only**.
5. **Climax:** Compatible upgrade path; performance estimate delta vs prior GPU visible.
6. **Resolution:** Save updated build labeled upgrade.
7. **Failure path:** PSU insufficient → **Invalid** with minimum PSU guidance from server; cannot commit GPU until resolved or PSU Slot unlocked per AD-12 rules.

### UJ-3 — Alex shares a build; Morgan suggests a swap that stays valid

**Protagonist:** Alex (owner), Morgan (advisor). **Entry:** Morgan opens `/share/:token` (read-only).

1. Morgan reviews Slots, compat status, and prices (no edit except suggest).
2. Morgan opens **Suggest substitute** on a Slot → Slot-scoped picker.
3. Server validates material-spec rules; incompatible suggestion rejected with explicit conflict (no silent apply).
4. Alex receives in-app notification; accepts or rejects.
5. **Climax:** Accepted swap keeps Build **Compatible**; share view reflects accepted state for both.
6. **Resolution:** Alex continues purchase planning with updated list.
7. **Failure path:** Morgan suggests wrong-socket CPU → suggestion rejected; Morgan sees server error message.

Post-POC UI; behavior bound to FR-22–23.

### UJ-4 — Riley revisits a saved build after a price spike

**Protagonist:** Riley, saved build from last week. **Entry:** `/builds` or FR-33 email deep link.

1. Open saved build; server re-eval on open (FR-11, FR-20).
2. See **stale price** badge on affected Part; total over budget.
3. Initiate substitute workflow or **Choose different part** on affected Slot (FR-14–16).
4. Re-run compatibility after replacement.
5. **Climax:** Build back under budget with current prices; stale count reduced on summary.
6. **Resolution:** Share or export updated build; may have arrived via batched alert email.
7. **Failure path:** No spec-equivalent substitute → empty state explains none found; Complete remains blocked if required Slot unavailable (FR-14).

Post-POC substitute UI; staleness badges in POC when commerce data present.

## POC vs v1 Contract

| Area | POC build | v1 spine |
|------|-----------|----------|
| Guided + picker | Yes | Yes |
| Save / finalize / email | Thin or stub | FR-19–21, 29, 32–34 |
| Share / compare | No UI | FR-22–24 |
| Substitutes | Message only if API returns | FR-14–16 full |
| Admin | Parts + ASIN import | Full Epic 4 operator stories |

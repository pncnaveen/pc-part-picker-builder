# IA draft — desktop-primary POC (confirmed)

**Assembly:** Option A — guided primary; FR-9 via **Choose different part** catalog Sheet per Slot (no manual-mode toggle).

## App shell (builder)

| Surface | Route (proposed) | Purpose |
|---------|------------------|---------|
| Home / Start build | `/` | CTA: new in-session build; optional sign-in |
| Build context | `/build/:id/context` | Budget (INR), use, workloads, display, owned parts |
| Guided assembly | `/build/:id/guided` | One Slot at a time; server recommendations + compat |
| Build summary (persistent panel) | docked on guided + later surfaces | Slots, budget, compat badge, performance entry, staleness counts |
| Catalog browse | `/catalog` or slide-over from guided | FR-5/6; used when user picks "Choose different part" |
| Part detail | `/catalog/:partId` | Spec attrs, price/avail/staleness, link-out (later epic) |
| Auth | `/login`, `/register`, `/verify` | Email auth per FR-30 |
| My builds | `/builds` | Saved builds list (post-auth) |
| Shared build | `/share/:token` | Read-only + suggest (Epic 7) |
| Compare | `/compare` | Two builds (Epic 7) |
| Settings | `/settings/notifications` | Email toggles FR-34 |

## Operator (admin)

| Surface | Route | Purpose |
|---------|-------|---------|
| Admin home | `/admin` | Release status, incident banner flag, scrape health |
| Catalog releases | `/admin/releases` | Active release, rule set version |
| Part curation | `/admin/parts` | Search/edit curated fields |
| ASIN import | `/admin/import/asin` | CSV Part ↔ ASIN (Story 4.2) |

## POC cut line (proposal)

**In POC UI:** context → guided assembly → live summary + compat states; minimal catalog pick from guided step; admin parts list + ASIN import stub.

**Post-POC polish (still in v1 contract):** share/compare, email settings, full substitute flows, finalize gate UX.

## Desktop layout (guided)

```
┌─────────────────────────────────────────────────────────────┐
│ Logo    Build name                    Budget ₹xx / ₹yy  [?] │
├──────────────────────────────┬──────────────────────────────┤
│ Guided step (current Slot)   │ Build summary (sticky)      │
│ Recommended cards (1–3)      │ • Compat: Compatible/...    │
│ [Accept] [See more options]  │ • Slots checklist           │
│ Compat messages (server)     │ • Performance teaser        │
└──────────────────────────────┴──────────────────────────────┘
```

`< lg`: summary collapses to top bar + drawer.

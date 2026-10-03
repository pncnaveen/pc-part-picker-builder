# Brainstorm intent — PC parts picker & builder

**Session:** `brainstorm-pc-parts-picker-builder-2026-10-02`  
**Status:** Complete  
**Downstream use:** `bmad-product-brief`, `bmad-prd`, `bmad-spec`

## Product vision (full)

A PC parts picker and builder where individuals and (later) organizations explore components, assemble compatible builds within budget, and rely on reviews and comparisons for decisions. Individuals share and discuss builds with friends; organizations bulk-build by division and (v2) source dealers via a request board with quotations and contracts.

## Shipping scope

### v1 — Individuals portal

**One-line:** Help people with a budget explore compatible parts, assemble a build that matches **existing hardware and use context** (owned display, kept parts, games/apps/workloads), and trust the catalog will not silently go stale.

**In scope**

- Component catalog exploration
- Budget-aware builds: **guided recommendations** or **choose every part from scratch**
- **Always-on compatibility** (chipset, board, power, GPU, etc.)
- **Use context / owned gear:** declare what they already have; performance and fit judged against that (display resolution/refresh is one example—not 4K-only)
- **Upgrade path:** start from owned parts, explore upgrades
- **Substitutes:** when a part is unavailable, rules from research—same spec different brand OK; reject material spec changes; tolerate minor non-functional diffs
- **Saved builds** accessible across sessions/devices
- **Performance estimates** for games, apps, software relative to declared context
- **Catalog and price freshness** (define SLA in planning; user expectation: “up to date,” not abandoned listings)
- **Social (minimum viable):** share build; compare with friends—depth of real-time chat can be phased within v1 if needed

**Explicitly out of v1**

- Organization accounts and multi-division procurement
- Dealer portal, request board, quotations, contracts, advance payments
- Dealer verification and org-side duplicate RFQ/build governance

**v1 open decision (resolve in brief/PRD)**

- Reviews, spec compare, and review-driven recommendations: **v1 core** vs **v1.1** after build + compatibility ship

### v2 — Organizations & dealers

- Per-division build templates (e.g. IT high-end vs HR/accounting standard)
- Request board; dealers quote and orgs compare
- In-app quote drafting, contract flow, **advance before processing**
- **Dealer verification** and **verified buyer experiences** (good/bad, no fake endorsements)
- Dealer profiles including **logistics**
- Warnings: duplicate dealer responses, duplicate org builds, spam/irrelevant quotes
- Malicious-dealer and abuse controls for B2B

## Non-negotiables (from reverse brainstorm)

| Audience | Must |
|----------|------|
| Individual (v1) | Compatibility always checked; social interactions opt-in; catalog/prices maintained |
| Org/dealer (v2) | Duplicate request/response/build warnings; dealer verification path |

## Stakeholder jobs (research summary)

| Role | Wants | Fears |
|------|--------|--------|
| First-time builder | Budget → parts list → build → performance; DIY or guided | Stale parts after purchase; wrong fit for owned gear; shop stock ≠ app; embarrassment in discussion |
| Friend | Real-time advice; suggest better-fitting parts | Blame, shill optics, spec fights, wrong memory-based advice |
| Org buyer (v2) | Right spec per team; bulk | Dealer cheat or poor delivery |
| Dealer (v2) | Volume quotes; in-app workflow | Lost to competitors; cancel after dealer spends; fake buyers |

## First-principles anchor

- Compatibility and fragmented supply are facts of the market.
- **Individual job (v1):** explore components and build.
- **Company job (v2):** explore, build, then find and trust dealers.

## Suggested next step

Run **`bmad-product-brief`** scoped to **v1 individuals portal** only, carrying this file as input.

# PRD addendum — PC Part Picker & Builder (v1)

Material referenced by the PRD but not required in the main requirement narrative.

## v2 backlog (unchanged from product brief)

- Organization accounts: per-division build templates, duplicate-build warnings
- Dealer marketplace: request board, quotes, contracts, advance payment, verification, logistics profiles
- Abuse controls: duplicate dealer responses, spam/malicious dealer handling

## Catalog and pricing maintenance (operational design)

These mechanisms implement **FR-25–FR-27** and **SM-5**; exact tooling is architecture, not PRD.

**Launch Region:** India (INR). Retailer feeds and link-out targets must match this Region.

| Data class | Source expectation | Refresh cadence (v1 target) | User-visible behavior |
|------------|-------------------|----------------------------|------------------------|
| Component specs | Curated catalog ingest | Weekly full reconcile; ad-hoc on critical errata | Spec version date on part detail |
| Price | Retailer/API feeds for launch region | At least daily for parts in active builds | **Stale price** badge if older than 24h |
| Availability | Same feeds | At least every 4h for in-stock flag | **Unavailable** state + substitute flow |
| Compatibility rules | Rule set versioned with catalog | Deploy with catalog releases | Conflict messages cite rule version |

**Incident response:** If a feed is down >24h, show a global banner that prices may be outdated; do not silently present stale data as current.

## Substitute decision matrix (extends FR-17)

| Change | Allowed? | Example |
|--------|----------|---------|
| Same material spec, different brand/SKU | Yes | Alternate DDR5-6000 CL30 kit |
| Material spec change (speed, capacity, socket) | No | DDR4 kit for DDR5 board |
| Non-functional cosmetic / minor dimensional tolerance | Yes | GPU color variant within documented clearance |
| Functional spec change disguised as cosmetic | No | Different TDP tier without user acknowledgment |

## Performance estimate methodology (placeholder)

v1 estimates are **directional**, not benchmark substitutes. Architecture should document data sources (synthetic index from published benchmarks + declared resolution/settings). PRD requires disclosure in UI copy, not a specific model.

## Source artifacts

- `_bmad-output/planning-artifacts/briefs/brief-pc-part-picker-builder-2026-10-03/brief.md`
- `_bmad-output/planning-artifacts/briefs/brief-pc-part-picker-builder-2026-10-03/addendum.md`
- `_bmad-output/brainstorming/brainstorm-pc-parts-picker-builder-2026-10-02/brainstorm-intent.md`

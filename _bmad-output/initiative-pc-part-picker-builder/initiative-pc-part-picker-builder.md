---
type: initiative
title: "PC Part Picker & Builder — individuals v1"
parent: none
covers: []
assignee: ""
risk: medium
---

# PC Part Picker & Builder — individuals v1

## Description

Deliver the v1 **individuals portal**: a web app where builders set budget and owned context, assemble a compatible PC build against an India-region catalog, validate compatibility and substitutes, estimate performance, save and share builds, and hand off to retailers via link-out. Organization and dealer flows remain out of scope until a later initiative.

## Outcome

First-time and occasional builders complete compatible builds under budget using maintained catalog data, return when prices change, and share builds without compatibility surprises—measured by learning and retention (pre-revenue launch).

## Requirements

Requirement source: PRD FRs and `planning-artifacts/epics.md`. Story breakdown: `tickets.toml` and `epic-*/tickets.toml` under this initiative (2026-10-12).

## Done when

1. All v1 FRs in the adopted spec are implemented and verified for India launch region.
2. Compatibility, save/share, and catalog freshness SLAs from the PRD are met in production.
3. No open P0/P1 defects blocking core build-complete and save journeys.
4. PRD open question on day-one catalog sourcing is resolved or explicitly deferred with owner sign-off.

## Boundaries

Web individuals portal, catalog ingestion for India, auth (email verification), compatibility engine, and retailer link-out. Not org/dealer marketplace, not in-app checkout (v2).

## References

- prd — _bmad-output/initiative-pc-part-picker-builder/prd-pc-part-picker-builder/prd-pc-part-picker-builder.md
- brief — _bmad-output/initiative-pc-part-picker-builder/brief-pc-part-picker-builder/brief-pc-part-picker-builder.md
- brainstorm — _bmad-output/initiative-pc-part-picker-builder/brainstorm-pc-parts-picker-builder/brainstorm-pc-parts-picker-builder.md

## Notes

- Decision: migrate planning artifacts to v7 initiative layout (2026-10-09).
- Open question: India retailer/API feeds for day-one catalog (PRD §10).

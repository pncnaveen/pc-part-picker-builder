# Catalog sources (v1 MVP)

Implements FR-25–FR-27, FR-31 for the **initial curated catalog**. Architecture owns scraper jobs, matching, and storage.

## Scope

- **In v1 launch catalog:** **Top parts only** — a curated subset per Slot (CPUs, GPUs, boards, RAM, storage, PSUs, cases, coolers).
- **Year window:** Parts are eligible when their **model / release year is 2025 or 2026** (inclusive). Records outside that range are excluded from the launch seed unless explicitly allowlisted.
- **Ranking within window:** Among eligible BuildCores records, operators pick up to **30 Parts per Slot category** (popularity, India availability on Amazon.in, builder demand). Fewer than 30 is fine when the year filter yields a thin set.
- **Out of v1 launch:** Full BuildCores import without the year filter; additional Indian retailers beyond Amazon.in.

### Year field (ingest)

Use the best available date on each BuildCores record (e.g. release year, `releaseDate`, or category-specific schema field). If year is missing, **do not auto-include** in top-parts seed—allowlist manually or enrich before import.

## Spec data (compatibility)

| Item | Source | License / notes |
|------|--------|-----------------|
| Component specs, slots, compatibility fields | [BuildCores Open DB](https://github.com/buildcores/buildcores-open-db) JSON + schemas | ODC-By — attribute in product/docs |
| Compatibility rules | Derived from BuildCores schemas + product rule layer | Version with catalog releases |

Ingest: periodic sync or snapshot import; map BuildCores records to internal `Part` ids. Retailer SKUs on BuildCores records are hints only; **Amazon.in listing is the v1 commerce anchor**.

## Price, availability, link-out (India)

| Item | Source | Notes |
|------|--------|--------|
| INR price | Scheduled **scrape** of **amazon.in** product pages for matched listings | No Amazon Associates / Creators API |
| Availability | Same scrape (in-stock / buyable signal as implemented) | |
| Purchase URL | Canonical **amazon.in** URL stored at ingest | FR-31 link-out; external-site disclosure |

**Matching:** Operator or pipeline maps each catalog `Part` to zero or one Amazon.in listing (ASIN or stable URL). Unmapped parts show “find locally” / no broken link.

**Scrape hygiene:** Rate limits, retries, structured logging; failed runs age `last_price_capture_at` and drive staleness UI per `catalog-freshness.md`.

## Cadence (MVP targets)

Align with `catalog-freshness.md` for **active-catalog** (top-parts) rows only:

- Price: at least daily successful capture for listed parts.
- Availability: target at least every 4h where scrape capacity allows; badge rules unchanged.
- Specs: weekly reconcile from BuildCores snapshot or on-demand for errata.

**Incident:** No successful Amazon scrape run for **active catalog** in >24h → global banner (prices may be outdated).

## Future expansion (non-binding)

- More parts from BuildCores and/or manual curation.
- Additional India retailers (scrape or partner feeds) without changing compatibility core.

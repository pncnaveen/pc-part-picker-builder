# Catalog and pricing maintenance (v1)

Implements FR-25–FR-27 and SM-5. Tooling is architecture; cadence and user-visible behavior are product contract.

**Launch Region:** India (INR). **v1 commerce source:** amazon.in scrape only (`catalog-sources.md`). Freshness applies to **active-catalog** (top-parts) rows.

| Data class | Source expectation | Refresh cadence (v1 target) | User-visible behavior |
|------------|-------------------|----------------------------|------------------------|
| Component specs | BuildCores Open DB sync (curated subset) | Weekly full reconcile; ad-hoc on critical errata (target ≤72h) | Spec last-updated on part detail |
| Price | Amazon.in scrape for mapped listings | At least daily for active-catalog Parts | **Stale price** if older than 24h |
| Availability | Same scrape | At least every 4h where jobs allow | **Unavailable** + substitute flow |
| Compatibility rules | Versioned with catalog | Deploy with catalog releases | Conflict messages cite rule version |

**Incident:** No successful Amazon scrape for active catalog in >24h → global banner that prices may be outdated; do not present stale capture as current.

**Build-level:** Staleness badges per Part; Build summary counts stale lines; link-out confirms when price is stale (FR-31).

**SLA metric (SM-5):** ≥95% of active-catalog Parts meet price ≤24h and availability ≤4h freshness (rolling 7-day).

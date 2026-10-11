# Functional requirements index (v1)

Stable FR IDs from PRD; testable consequences preserved for implementation and QA. Kernel capabilities CAP-1…CAP-13 map to these FRs.

| FR | Requirement | Key testable consequences |
|----|-------------|---------------------------|
| FR-1 | Set build budget in Region currency | Running total visible; over-budget state; **Complete** while over budget only after acknowledgment recorded |
| FR-2 | Declare primary use and workloads | Performance estimate lists only declared workloads; updates without new Parts when workloads change |
| FR-3 | Declare display resolution, refresh, panel | Estimate uses display; missing blocks estimate until set or unknown-display reduced-confidence opt-out |
| FR-4 | Register owned parts into inventory | Owned Parts fix mapped Slots; upgrade filters respect owned baseline; no manual non-catalog legacy specs v1 |
| FR-5 | Browse by Slot-aligned category | Spec attrs for compatibility on detail; no out-of-Region Parts; sort includes price and popularity |
| FR-6 | Text search Parts | Empty state not error; respects Slot context from picker |
| FR-7 | Show price, availability, staleness | Stale price >24h; stale availability >4h badges |
| FR-8 | Guided build path | Recommendations re-run compatibility each step; switch to manual per Slot |
| FR-9 | Manual slot selection | Compatibility eval ≤2s p95 for ≤12 Slots; incompatible shows conflict before commit |
| FR-10 | Live build summary | Updates on Slot change; Invalid blocks **Complete**; over-budget allowed with FR-1 ack |
| FR-11 | Always-on compatibility | On every change and on open saved/shared; conflict classes enforced; human-readable messages |
| FR-12 | Upgrade-from-owned flow | Locked owned Slots; filters exclude incompatible; unlock owned Slot needs confirmation |
| FR-13 | Block invalid complete/save/share | Warning allows save/share with warnings; Invalid no share link |
| FR-14 | Detect unavailable selected parts | Surfaces substitute workflow; cannot **Complete** without replacement |
| FR-15 | Spec-equivalent substitutes | No material downgrades; each passes compatibility before display |
| FR-16 | User-initiated substitute search | Empty explains none found; apply replaces Slot and re-runs compatibility |
| FR-17 | Performance estimate tiers | Per declared workload; updates on GPU/CPU/RAM/display change; disclaimer in UI |
| FR-18 | No misleading estimate on Invalid | Hidden/blocked with message to fix compatibility |
| FR-19 | Account required to save | Unauthenticated can assemble; save prompts auth; list shows name, status, budget |
| FR-20 | Open/edit saved builds | Edits re-run compatibility and refresh price/availability; single mutable version v1 |
| FR-21 | Delete saved build | Confirmation; share links gone |
| FR-22 | Share build link | Compatible or Warning only; read-only except FR-23 |
| FR-23 | Suggest compatible swaps on shared build | Owner accept/reject; incompatible never auto-applies; in-app notification only (not build emails) |
| FR-24 | Compare two builds | Budget, compatibility, performance summary, Slot diffs; Region and staleness labeled |
| FR-25 | Maintain component catalog | Spec last-updated on detail; critical errata ≤72h target |
| FR-26 | Maintain price/availability feeds | Amazon.in scrape per `catalog-sources.md`; cadence per `catalog-freshness.md`; banner if scrape down >24h |
| FR-27 | Surface staleness to users | Build-level stale counts; link-out warns when stale (FR-31) |
| FR-29 | Required slots for **Complete** | See `required-slots.md` |
| FR-30 | Email registration and verification | Verify before first save; password reset; no OAuth v1 |
| FR-31 | Retailer link-out per Part | amazon.in URLs for mapped Parts (v1); external disclosure; export lists link-outs; stale price confirmation |
| FR-32 | Build summary email on finalize | One per finalize event; content rules; skip if Invalid/unverified/opt-out; no retailer URLs |
| FR-33 | Build alert email on price/availability change | Finalized builds only; changed Parts since last alert; max one per build per 48h; opt-out/unverified skip |
| FR-34 | Email notification settings | Toggles for FR-32 and FR-33; default on for verified; future sends only |

**Platform NFRs (PRD §8):** Web responsive; latest two Chrome/Firefox/Safari/Edge; catalog browse interactive ≤3s p95 on 4G; compatibility p95 ≤2s; WCAG 2.1 AA aspirational for core flows; unguessable share tokens; rate limits on suggestions and outbound emails; async email with retry; observability for compatibility, substitutes, staleness, email failures.

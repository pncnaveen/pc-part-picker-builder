# PRD walkthrough — individuals v1 (draft)

Target: `prd-pc-part-picker-builder/`  
Status: **complete** — all blocks accepted 2026-10-10

---

## Block 1 — Intent

- [x] Accepted 2026-10-10

This PRD defines v1 functional and non-functional requirements for the **individuals portal** of PC Part Picker & Builder. Primary readers: product, UX, engineering, and QA. It builds on the finalized product brief (2026-10-03) and brainstorming intent; v2 organization/dealer scope lives in [addendum.md](../prd-pc-part-picker-builder/addendum.md) only.

First-time and occasional PC builders plan custom machines under real constraints: budget, owned hardware, use case, and what is buyable nearby. The product is a **web application** tying **budget, owned context, compatibility, substitutes, and performance expectations** into one loop. v1 serves **individual builders only**; success is **learning and retention**, not revenue.

**Correct Course (2026-10-10, approved):** transactional **build emails** — summary on **Finalized** complete (FR-32), batched price/availability **alerts** every 48h max per build (FR-33), account toggles default on (FR-34); in-app build id + deep link; no retailer URLs in email.

*Source: [prd-pc-part-picker-builder.md](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md) §0–§1; [.memlog.md](../prd-pc-part-picker-builder/.memlog.md); [change-build-email-notifications.md](../change-build-email-notifications/change-build-email-notifications.md).*

---

## Block 2 — Broad strokes

- [x] Accepted 2026-10-10

Five entry points for the requirement set:

1. [prd-pc-part-picker-builder.md](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md) — main FRs (through FR-34), journeys, metrics, NFRs
2. [addendum.md](../prd-pc-part-picker-builder/addendum.md) — catalog SLA, substitute matrix, v2 backlog
3. [.memlog.md](../prd-pc-part-picker-builder/.memlog.md) — PRD decisions (India, auth, slots, link-out, build emails)
4. [brief-pc-part-picker-builder.md](../brief-pc-part-picker-builder/brief-pc-part-picker-builder.md) — upstream brief (linked in PRD frontmatter)
5. [initiative-pc-part-picker-builder.md](../initiative-pc-part-picker-builder.md) — v7 initiative envelope

---

## Block 3 — Users, journeys, and vocabulary

- [x] Accepted 2026-10-10 (UJ-2 budget → ₹35,000 during review)

UJ-1–UJ-4 (finalize + email on UJ-1; alert deep link on UJ-4) and glossary including **Finalized build**, **Build summary email**, **Build alert email**.

- [§2 Target User](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md) (journeys)
- [§3 Glossary](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md)

---

## Block 4 — Build context & catalog (FR-1–FR-7)

- [x] Accepted 2026-10-10

Budget, use context, owned inventory, browse/search, pricing staleness — foundation before assembly.

- [§4.1](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md), [§4.2](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md)

---

## Block 5 — Assembly & compatibility (FR-8–FR-13, FR-29)

- [x] Accepted 2026-10-10

Guided vs manual paths, running summary, required slots for Complete, always-on compatibility, upgrade-from-owned, block invalid complete/save/share.

- [§4.3](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md), [§4.4](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md)

---

## Block 6 — Substitutes, performance, persistence (FR-14–FR-24, FR-30)

- [x] Accepted 2026-10-10

Shelf reality, estimates, accounts/saves, share/compare/suggest (in-app only for social); email verification.

- [§4.5](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md) through [§4.8](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md)

---

## Block 7 — Catalog ops & purchase (FR-25–FR-31)

- [x] Accepted 2026-10-10

Maintenance requirements, India link-out (in-app only), operational detail in addendum.

- [§4.9](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md), [§4.10](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md), [addendum catalog table](../prd-pc-part-picker-builder/addendum.md)

---

## Block 8 — Build email notifications (FR-32–FR-34)

- [x] Accepted 2026-10-10

Summary email on finalize; 48h-batched price/availability alerts; account toggles; §8 email NFRs.

- [§4.11](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md)
- [§8 email bullets](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md)
- [§9 build emails row](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md)

---

## Block 9 — Scope, metrics, NFRs, closure

- [x] Accepted 2026-10-10

Non-goals (incl. no marketing email), MVP in/out through FR-34, SM-1–SM-5, cross-cutting NFRs, resolved decisions, **open question** on India retailer feeds, assumptions index.

- [§5–§11](../prd-pc-part-picker-builder/prd-pc-part-picker-builder.md)

---

## Block 10 — Periphery

- [x] Accepted 2026-10-10

Supporting files only; not alternate requirement sources.

- [addendum.md](../prd-pc-part-picker-builder/addendum.md) — operational extensions
- [.memlog.md](../prd-pc-part-picker-builder/.memlog.md) — authoring log
- [change-build-email-notifications.md](../change-build-email-notifications/change-build-email-notifications.md) — approved change proposal

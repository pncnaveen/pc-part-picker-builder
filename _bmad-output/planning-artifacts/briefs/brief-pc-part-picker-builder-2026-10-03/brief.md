---
title: PC Part Picker & Builder — Individuals (v1)
status: ready
created: 2026-10-03
updated: 2026-10-03
scope: v1 individuals portal
---

# Product Brief: PC Part Picker & Builder (Individuals, v1)

## Executive Summary

**PC Part Picker & Builder** is a web application that helps individuals plan a custom PC without hunting specs across dozens of sites. Users set a budget, declare what they already own (monitor, case, GPU, etc.) and how they will use the machine, then explore compatible parts, assemble a build, and see whether that build fits their real-world constraints—including estimated performance for games and applications they care about.

First-time builders today rely on fragmented research, compatibility guesswork, and friend advice that can be wrong or embarrassing when parts do not fit. Existing pickers help with lists but often feel static, disconnected from owned hardware, and weak at the moment of truth when a shop does not have the exact SKU.

v1 focuses entirely on the **individual builder**. Organization procurement and dealer marketplaces are an intentional **v2** bet; this brief does not scope them.

## The Problem

**Who feels it:** Hobbyists and first-time builders with a fixed budget, often upgrading from an existing machine or display they intend to keep.

**The pain:**

- **Discovery overload** — Components are compared across retailers, forums, and video; the same base product appears under many brands and SKUs.
- **Compatibility risk** — Socket, chipset, power, clearance, and display capability must align; one wrong pick wastes money and time.
- **Budget drift** — Prices and availability change; a build that looked right yesterday may be stale or impossible to buy locally today.
- **Context mismatch** — A build optimized in the abstract may not match owned gear or actual workloads.
- **Social friction** — Sharing builds with friends is valuable, but advice without a shared, compatibility-aware view leads to blame and bad swaps.

**Status quo:** Spreadsheets, generic pickers, retailer carts, and informal chat. Users cope; they lack a single place that ties **budget, compatibility, owned context, and performance expectations** together.

## The Solution

An **individuals portal** where users:

1. **Set context** — Budget, launch region/market (single region at first, expandable), owned parts, primary use (games, creative apps, general use).
2. **Explore and build** — Browse a component catalog; accept guided recommendations within budget or pick every slot from scratch.
3. **Trust compatibility** — Continuous validation (board/chipset, power, GPU fit, etc.) with conflicts surfaced before purchase.
4. **Plan upgrades** — Start from hardware already owned and explore what to change next.
5. **Handle substitutes** — When a chosen part is unavailable: same material spec with a different brand is acceptable; material spec changes are rejected; minor non-functional differences (color, small dimensional tolerance) are acceptable.
6. **Save and revisit** — Authenticated users persist builds across sessions and devices.
7. **Estimate performance** — Expected experience for declared games/apps relative to declared display and build—not “max everything” by default.
8. **Share socially (MVP)** — Share a build link and compare with friends; real-time chat is a v1.1 candidate.

Catalog and pricing are **maintained**, not abandoned. Refresh rules and SLA are defined in the PRD so users are not surprised by obsolete parts or prices after purchase.

**Reviews, spec-compare UI, and review-driven recommendations** ship in **v1.1**, after the build-and-compatibility core.

## What Makes This Different

| Angle | Position |
|--------|----------|
| **Owned-context builds** | Anchor on what users already have and how they will use the PC—not only empty-case builds. |
| **Compatibility as product** | The build is invalid until compatible, including friend-suggested swaps. |
| **Purchase reality** | Substitute rules reflect “part not on the shelf,” not only ideal catalog picks. |
| **Execution** | No proprietary data moat at launch; differentiation is UX, compatibility depth, and catalog freshness discipline. |

We do not claim to beat every incumbent on catalog breadth day one. We claim a **tighter loop** from budget and owned gear to a build the user can defend in a shop and in a group chat.

## Who This Serves

**Primary — First-time or occasional builder**

- Has a budget and a goal (game, app, or general PC).
- May own a monitor or partial rig; fears buying outdated or incompatible parts.
- Wants either hand-holding or full DIY within guardrails.
- **Success:** A saved, compatible build they understand, with performance expectations that match their desk.

**Secondary — Friend / advisor (v1, lightweight)**

- Joins via shared build; suggests alternatives that fit the existing build path.
- **Success:** Useful advice without invisible incompatibilities.

**Out of v1:** Organization buyers, dealers, RFQ boards (see addendum).

## Success Criteria

**User success (v1)**

- Users complete a compatible build within stated budget in one session (targets refined in PRD).
- Compatibility-related abandonment decreases once instrumented.
- Users return to saved builds and update when prices or parts change.
- Share/compare adoption among builders (thresholds in PRD).

**Product health**

- Catalog/price staleness tracked; no silent stale listings under defined refresh rules.
- Compatibility engine catches known conflict classes before save/share.

**Business (v1)**

- Success = learning and retention, not revenue.
- Future options: affiliates, premium features, B2B (v2)—not in v1 scope.

## Scope

**In v1**

- Component catalog and search
- Budget-aware guided path and full manual build
- Always-on compatibility validation
- Use context: owned parts, workloads, display characteristics
- Upgrade-from-owned flow
- Substitute guidance when SKUs differ
- Saved builds (authenticated)
- Performance estimates for declared games/apps
- Catalog/price maintenance process
- Social MVP: share build, compare with friends; opt-in interactions only

**Out of v1**

- Organization accounts, division templates, bulk procurement
- Dealer portal, request board, quotations, contracts, advance payments
- Dealer verification and B2B abuse controls
- Full review ecosystem (v1.1)

## Vision

**v1 → v1.1:** Perfect the individual loop—context, compatibility, freshness, honest performance—then add reviews, rich spec compare, and stronger social.

**v2:** Organizations (per-team specs, duplicate-build warnings) and a dealer marketplace (verified buyers, quotes, logistics, advance payment), reusing the individual build model.

**Long term:** The trusted place to plan, justify, and procure a PC—from hobbyist to company fleet—without re-learning compatibility at every step.

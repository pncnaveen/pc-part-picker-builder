---
name: PC Part Picker & Builder
description: POC visual identity — shadcn/ui defaults with minimal brand delta for India individuals web SPA
status: final
created: 2026-10-12
updated: 2026-10-12T15:00
colors:
  card:
    note: shadcn theme token --card (zinc default)
  card-foreground:
    note: shadcn theme token --card-foreground
  border:
    note: shadcn theme token --border
typography:
  body:
    note: shadcn default sans (Geist Sans when bundled)
rounded:
  lg:
    note: shadcn default rounded-lg (~8px)
spacing:
  gutter:
    note: Tailwind gap-6 between guided and summary columns at lg+
components:
  compat-badge-compatible:
    variant: default
    note: Uses shadcn Badge; semantic color from server status mapping only
  compat-badge-warning:
    variant: secondary
    note: Warning severity — never client-invented
  compat-badge-invalid:
    variant: destructive
    note: Invalid severity — never client-invented
  build-summary-panel:
    background: '{colors.card}'
    foreground: '{colors.card-foreground}'
    radius: '{rounded.lg}'
    border: '1px solid {colors.border}'
---

## Brand & Style

POC posture: **calm utility** — a planning desk, not a gaming storefront. Visual noise stays low so **compatibility status**, **budget**, and **slot progress** read first. The product inherits **shadcn/ui** components wholesale; this document records only behavioral-visual bindings (compat badges) and explicit non-goals for the POC.

India launch: INR formatting in UI (`₹`, integer paise from API rendered as rupees). No regional visual theme beyond copy and currency.

## Colors

- **No custom brand palette in POC.** Use the default shadcn **zinc** (or project-init theme) for background, card, border, primary CTA, and destructive.
- **Compatibility colors** map strictly from server `Compatible` / `Warning` / `Invalid` — never a separate client palette that could imply a different severity.
- **Staleness** uses muted badge + icon; does not reuse compat destructive unless spec says availability-critical.

Avoid: gradients, neon accents, per-slot category color rainbows, custom status colors outside shadcn semantic tokens.

## Typography

Inherited shadcn ramp only. Headings use default `text-lg` / `text-xl` scale — no display serif in POC. Tabular numbers for prices (`font-variant-numeric: tabular-nums` via Tailwind `tabular-nums`).

## Layout & Spacing

- **Desktop primary (`≥ lg`, 1024px):** max content width `max-w-6xl` centered; **two-column build layout** — guided column ~60%, build summary ~40%, `gap-6`, summary `sticky` top offset below app header.
- **Tablet (`md`):** single column; summary becomes **collapsible top bar** + **Sheet** for full summary.
- **Small (`< md`):** POC supports read-only/share; **assembly not optimized** — show banner “Use a larger screen to build” if user enters guided on small viewport `[ASSUMPTION: soft gate]`.

## Elevation & Depth

Default shadcn card shadow. One level of overlay: `Sheet` or `Dialog` for catalog picker — no nested modals.

## Shapes

Default shadcn radii. Part cards and summary panel use `rounded-lg` consistently.

## Components

| Component | POC rule |
|-----------|----------|
| **Button primary** | shadcn default — main actions: Accept recommendation, Continue, Save |
| **Button outline** | Choose different part, secondary actions |
| **Card** | Recommendation card; part row in catalog picker |
| **Badge** | Compat status, staleness, required slot |
| **Progress** | Budget used vs limit |
| **Alert** | Global catalog incident banner (scrape down >24h) |
| **Table** | Admin parts list, ASIN import preview |
| **Skeleton** | Guided step and catalog loading |

## Do's and Don'ts

**Do:** Let server severity drive badge variant; keep one primary CTA per guided step; align price columns right.

**Don't:** Invent compat severity in CSS; hide Invalid behind optimistic UI; use retailer brand colors in chrome; add marketing hero imagery in POC build surfaces.

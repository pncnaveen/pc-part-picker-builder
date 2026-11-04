---
id: 7
type: story
title: "Tailwind and shadcn/ui foundation"
parent: epic-2-identity-session-build
covers: [NFR-6]
after: [1]
tracker_id: "111"
remote: "https://github.com/pncnaveen/pc-part-picker-builder/issues/111"
refined: true
hitl: false
risk: low
---

# Tailwind and shadcn/ui foundation

## Description

Close the gap between UX spine (shadcn/ui + Tailwind on Vite) and Epic 1–2.1 implementation (semantic HTML only). Bootstrap the design system in `apps/frontend`, apply **zinc** POC defaults from `DESIGN.md`, and migrate existing routes so **every subsequent frontend story** builds on shadcn components.

Story 2.1 intentionally deferred this work; this story owns migration without changing register API contracts or session rules.

## Implementation sequence

**Previous implementation →** Story **2.1** (Register with email and password). Complete **2.1** before implementing **2.7**.

## Acceptance Criteria

1. **Toolchain and theme**
   **Given** a clean install at the repo root
   **When** I run the frontend dev/build scripts
   **Then** Tailwind processes utility classes and shadcn is initialized (`components.json`, `@/` alias, global theme CSS variables)
   **And** default theme matches DESIGN.md POC (zinc, light mode, `rounded-lg`, no custom brand palette)

2. **Baseline shadcn components**
   **Given** the foundation is in place
   **When** I inspect `apps/frontend`
   **Then** shared primitives used by migrated screens exist under the project’s shadcn layout (e.g. `components/ui/`)
   **And** feature code imports UI from that layer — not copy-pasted one-offs

3. **Migrate home / health (Story 1.5)**
   **Given** the SPA loads `/`
   **When** health data is shown
   **Then** layout and status use shadcn/Tailwind (e.g. Card, typography utilities)
   **And** health fetch behavior and tests remain correct (update assertions only as needed for DOM structure)

4. **Migrate register (Story 2.1)**
   **Given** I open `/register`
   **When** I interact with the form
   **Then** fields use shadcn form controls (Label, Input, Button) with visible labels and password helper text per EXPERIENCE
   **And** submit still calls `POST /auth/register` with the same validation UX rules; no session cookie on success

5. **App shell**
   **Given** any migrated route
   **When** rendered
   **Then** a minimal app shell applies background/card tokens consistent with DESIGN.md
   **And** routing (`AppRoutes`, `routes.json`) is unchanged in URL structure

6. **Convention for future work**
   **Given** AGENTS.md or CONTRIBUTING frontend section
   **When** a developer adds UI after Story 2.7
   **Then** documentation states new features use Tailwind + shadcn — not unstyled semantic HTML for product surfaces

7. **Quality gates**
   **Given** this change set
   **When** I run `pnpm --filter @pcppb/frontend lint` and `test`
   **Then** both pass
   **And** `pnpm lint:boundaries` at repo root still passes (axios only under `infrastructure/`)

## Out of scope

- Login, verify, reset flows (Stories 2.2–2.4) — built with shadcn **after** this story merges
- API or Prisma changes
- Full marketing layout or admin tables

## References

- parent — epic-2-identity-session-build.md
- epics — ../../planning-artifacts/epics.md, Story 2.7
- ux — ../ux-pc-part-picker-builder/DESIGN.md, EXPERIENCE.md
- change — ../change-tailwind-shadcn-foundation/change-tailwind-shadcn-foundation.md

## Notes

- `tickets.toml`: entry `7`, `after = [1]`; stories 2.2 and 2.5 gate on this entry (2026-11-04).
- GitHub: #111; previous implementation #66 (Story 2.1).
- Sprint change: `change-tailwind-shadcn-foundation.md`

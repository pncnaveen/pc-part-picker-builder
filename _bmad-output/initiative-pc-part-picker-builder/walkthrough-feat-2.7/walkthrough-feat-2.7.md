# Branch walkthrough — feat-2.7 (Story 2.7 Tailwind + shadcn/ui)

**Target:** `feat-2.7` vs `development` — uncommitted implementation on the branch unless review scope is narrowed.

**Current block:** — (walkthrough complete; all blocks accepted)

### Keeping this walkthrough current

While this review is active, **update this file and [walkthrough-feat-2.7-log.md](./walkthrough-feat-2.7-log.md) whenever we add or change implementation code or paths** (not only when a block is accepted): adjust the relevant block’s links and short mechanism notes, and append a brief log entry (what changed, which paths). Findings and test results stay in the log; the narrative stays the human-facing map.

---

## Block 1 — Intent

- [x] **Intent** (accepted)

Close the gap between UX spine (shadcn/ui + Tailwind on Vite) and Epic 1–2.1 implementation (semantic HTML only). Bootstrap the design system in `apps/frontend`, apply **zinc** POC defaults from `DESIGN.md`, and migrate existing routes so **every subsequent frontend story** builds on shadcn components.

Story 2.1 intentionally deferred this work; this story owns migration without changing register API contracts or session rules.

*Source: [story-tailwind-and-shadcn-ui-foundation.md](../epic-2-identity-session-build/story-tailwind-and-shadcn-ui-foundation.md) (Description); GitHub [#111](https://github.com/pncnaveen/pc-part-picker-builder/issues/111).*

---

## Block 2 — Broad strokes

- [x] **Broad strokes** (accepted)

Adds Tailwind v4 + shadcn primitives, global zinc theme CSS, and wraps migrated `/` and `/register` screens in a minimal app shell. Open these first:

1. [index.css](../../../apps/frontend/src/index.css) — Tailwind import, zinc theme tokens, base body styles.
2. [components.json](../../../apps/frontend/components.json) — shadcn config, `@/` aliases, style preset.
3. [vite.config.ts](../../../apps/frontend/vite.config.ts) — `@tailwindcss/vite` plugin and `@` resolve alias (mirrored in [vitest.config.ts](../../../apps/frontend/vitest.config.ts)).
4. [AppShell.tsx](../../../apps/frontend/src/app/AppShell.tsx) + [App.tsx](../../../apps/frontend/src/app/App.tsx) — shared background and content width for all routes.
5. [HomePage.tsx](../../../apps/frontend/src/app/HomePage.tsx) and [RegisterForm.tsx](../../../apps/frontend/src/features/auth/components/RegisterForm.tsx) — migrated product surfaces using shadcn components.

---

## Block 3 — Toolchain and theme

- [x] **Slice: toolchain** (accepted)

Wires the SPA build and test runners to process Tailwind utilities and resolve `@/` imports the same way TypeScript does.

- [package.json](../../../apps/frontend/package.json) — `tailwindcss`, `@tailwindcss/vite`, CVA/clsx/tailwind-merge, Radix slot/label, `tw-animate-css`.
- [main.tsx](../../../apps/frontend/src/main.tsx) — imports global CSS once at bootstrap.
- [tsconfig.app.json](../../../apps/frontend/tsconfig.app.json) — `@/*` → `./src/*` (no deprecated `baseUrl`).
- [lib/utils.ts](../../../apps/frontend/src/lib/utils.ts) — `cn()` helper for shadcn class merging.

---

## Block 4 — shadcn primitives

- [x] **Slice: components/ui** (accepted)

Shared UI layer for feature code; add more components via shadcn CLI from `apps/frontend` (project pins CLI **4.22.0** in CONTRIBUTING after monorepo init quirks).

- [button.tsx](../../../apps/frontend/src/components/ui/button.tsx)
- [input.tsx](../../../apps/frontend/src/components/ui/input.tsx)
- [label.tsx](../../../apps/frontend/src/components/ui/label.tsx)
- [card.tsx](../../../apps/frontend/src/components/ui/card.tsx)

---

## Block 5 — Home and API health (Story 1.5)

- [x] **Slice: home / health** (accepted)

Home route keeps the same health fetch hook; layout moves into a Card and definition-list status rows.

- [HomePage.tsx](../../../apps/frontend/src/app/HomePage.tsx) — page title + health Card.
- [HealthStatus.tsx](../../../apps/frontend/src/features/health/components/HealthStatus.tsx) — structured status display (fetch behavior unchanged).
- [useApiHealth.ts](../../../apps/frontend/src/features/health/hooks/useApiHealth.ts) — unchanged integration path via [fetch-health.ts](../../../apps/frontend/src/api/health/fetch-health.ts).

---

## Block 6 — Register UI (Story 2.1 migration)

- [x] **Slice: register** (accepted)

Register still posts through [useRegister.ts](../../../apps/frontend/src/features/auth/hooks/useRegister.ts) → [fetch-register.ts](../../../apps/frontend/src/api/auth/fetch-register.ts); only presentation moves to shadcn Label/Input/Button with the same validation UX and no session on success.

- [RegisterForm.tsx](../../../apps/frontend/src/features/auth/components/RegisterForm.tsx)
- [RegisterPage.tsx](../../../apps/frontend/src/features/auth/pages/RegisterPage.tsx)
- Test: [RegisterForm.test.tsx](../../../apps/frontend/test/features/auth/RegisterForm.test.tsx)

---

## Block 7 — Periphery

- [x] **Periphery** (accepted)

Docs and tracking; no API or Prisma changes.

- [CONTRIBUTING.md](../../../CONTRIBUTING.md) — frontend UI convention (Tailwind + shadcn after Story 2.7).
- [AGENTS.md](../../../AGENTS.md) — points agents at `components/ui/` and CONTRIBUTING.
- [sprint-status.yaml](../../implementation-artifacts/sprint-status.yaml) — `2-7-tailwind-and-shadcn-ui-foundation: in-progress`.
- [pnpm-lock.yaml](../../../pnpm-lock.yaml) — new frontend deps.

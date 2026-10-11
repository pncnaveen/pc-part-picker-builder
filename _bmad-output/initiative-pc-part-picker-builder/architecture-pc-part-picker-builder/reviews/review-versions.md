# Stack version review — PC Part Picker & Builder (v1)

| Field | Value |
| --- | --- |
| **Artifact** | `architecture-pc-part-picker-builder.md` (Stack table, lines 166–179) |
| **Lens** | Version currency & reasonableness (as of **2026-10-11**) |
| **Date** | 2026-10-11 |
| **Method** | Cross-check spine pins against npm registry (`npm view`), official release posts (Next.js, React, PostgreSQL, Redis, Node.js Release schedule), and secondary changelogs where noted. Items without a primary registry or vendor source are marked **unverified**. |

## Verdict

**PASS (with caveats)** — The pinned application stack is **coherent and implementable** for repo init in October 2026: Next.js 16.4.0 and React 19.3 align with each other and with current stable releases. Data plane choices (PostgreSQL 16, Redis 7.x LTS line, BullMQ 5.x, Drizzle 0.44.x) are **conservative but supported**. The main gaps are **precision** (Redis major-only, React/TS without patch), **LTS posture** (Node 22 is Maintenance LTS while Node 24 is Active LTS), and **intentional lag** vs npm `latest` on TypeScript, Drizzle, and BullMQ.

## Spine pins (reference)

| Name | Pinned | Assessment |
| --- | --- | --- |
| Node.js | 22 LTS | **Reasonable, not optimal for greenfield** |
| TypeScript | 5.9 | **Reasonable** (5.x line current; registry `latest` is 7.x) |
| Next.js | 16.4.0 | **Current / verified** |
| React | 19.3 | **Current / verified** (pin `19.3.0` at init) |
| PostgreSQL | 16 | **Supported / conservative** |
| Redis | 7 | **Reasonable if 7.4 LTS** — pin is underspecified |
| BullMQ | 5.x | **Reasonable** — npm `latest` is 6.x |
| Drizzle ORM | 0.44.x | **Reasonable** — stable `latest` is 0.45.x |

---

## Per-component findings

### Next.js 16.4.0 — **Verified, current**

| Check | Result |
| --- | --- |
| Exists on npm | Yes (`npm view next@16.4.0` → `16.4.0`) |
| Release timing | Stable tag **2026-10-07**; announcement **2026-10-06** ([Next.js 16.4 blog](https://nextjs.org/blog/next-16-4)) |
| Node engine | `>=20.9.0` (`npm view next@16.4.0 engines`) — satisfied by Node 22 |
| React pairing | 16.4 ships with **React 19.3** per release notes |

**Advisory (verified):** Next.js blog (**2026-10-08**) announced an **out-of-band security release** for **2026-10-14** (Critical/High upstream deps). Treat **16.4.0** as the init pin, not a long-term freeze; plan patch uptake immediately after that release.

### React 19.3 — **Verified, current**

| Check | Result |
| --- | --- |
| Release | **v19.3.0**, **2026-09-09** ([react.dev blog](https://react.dev/blog/2026/09/09/react-19-3)) |
| npm `latest` | **19.3.0** (queried 2026-10-11) |

Spine says `19.3` without patch; at repo init use **19.3.0** (or whatever patch Next 16.4.0 bundles).

### Node.js 22 LTS — **Verified status; caveat on “which LTS”**

| Check | Result |
| --- | --- |
| LTS class | **Maintenance LTS** (entered maintenance **2025-10-21**; EOL **2027-04-30**) per [nodejs/Release](https://github.com/nodejs/release/) |
| Active LTS (Oct 2026) | **Node 24** (Active LTS from **2025-10-28**) |

**Interpretation:** “22 LTS” is **accurate** (still supported, widely used in CI/images) but **not the Active LTS** line for new production in October 2026. Acceptable for a pinned cold-start if the team values image stability; document a path to **Node 24** before 22 EOL.

**Unverified:** Whether all target hosts (local Docker, staging, production) will ship **≥22.23.x** security patches by deploy; pin **minimum patch** in `.nvmrc` / CI when images are chosen.

### TypeScript 5.9 — **Reasonable; behind registry `latest`**

| Check | Result |
| --- | --- |
| 5.9 stable | **5.9.2** (Aug 2025 announcement); npm shows **5.9.3** as latest 5.x |
| npm `latest` (overall) | **7.0.2** (queried 2026-10-11) |
| Also published | **6.0.x** per GitHub releases |

**Interpretation:** **5.9** is a sensible match for a Next 16 + React 19 app without adopting TS 6/7 migration work. Not “bleeding edge.” Pin **5.9.3** (or exact version Next/ecosystem templates recommend) at init.

### PostgreSQL 16 — **Supported; not latest major**

| Check | Result |
| --- | --- |
| Support | Supported until **2028-11-09**; current minor **16.15** (**2026-08-13**) per [PostgreSQL versioning](https://www.postgresql.org/support/versioning/) |
| Newer majors | **17**, **18** GA; **19** beta (Aug 2026 news) |

**Interpretation:** Major **16** is **reasonable** for managed DB stability. Spine should treat **minor/patch** as operational (e.g. always **16.15+**), not “any 16.0.”

**Unverified:** Drizzle 0.44.x + `postgres-js` driver behavior on PG 16.15-specific fixes (no incompatibility surfaced in this review).

### Redis 7 — **Reasonable with specification gap**

| Check | Result |
| --- | --- |
| Line | **Redis 7.4** is **LTS** (Redis docs: 7.4 LTS, EOL **2029-12-01**) |
| Latest 7.4 patch (cited) | **7.4.11** (**2026-08-17**, security release) per [redis/redis releases](https://github.com/redis/redis/releases/tag/7.4.11) |
| Newer majors | **Redis 8.x** GA on GitHub releases |

**Interpretation:** Pin **“7”** is ambiguous (7.0 vs 7.2 vs **7.4**). For queue/cache with BullMQ, document **Redis 7.4.x** (or managed equivalent) and **minimum patch 7.4.11+** for security.

**Unverified:** Managed Redis SKU mapping (ElastiCache, Upstash, etc.) to OSS **7.4.11** on day one.

### BullMQ 5.x — **Verified line; npm default is 6.x**

| Check | Result |
| --- | --- |
| 5.x line | Active; latest **5.81.5** (`npm view bullmq@5.81.5`) |
| npm `latest` | **6.3.12** (queried 2026-10-11) |
| Redis client note | BullMQ docs: `redis` **>= 5.0.0** when using node-redis adapter |

**Interpretation:** **5.x** is **reasonable** for a known API surface; staying on 5.x while `latest` is 6.x is a **deliberate** choice—record why (stability, worker parity) in repo init or ADR.

**Unverified:** Breaking changes and migration effort from BullMQ 5 → 6 for this worker topology (scrape, sync, email).

### Drizzle ORM 0.44.x — **Reasonable; one minor behind stable**

| Check | Result |
| --- | --- |
| 0.44 line | Exists; npm lists through **0.44.7** (`npm view drizzle-orm@0.44`) |
| npm `latest` (stable) | **0.45.4** (**2026-10-08** per changelog aggregators) |
| 1.0 | **1.0.0-rc** builds on npm (Sep 2026) |

**Interpretation:** **0.44.x** is a valid cold-start pin; bump to **0.44.7** (or latest 0.44 patch) at init. Moving to **0.45.x** is low-friction when convenient; **1.0-rc** is not appropriate for spine “pinned at init” without explicit risk acceptance.

---

## Cross-stack coherence

| Concern | Status |
| --- | --- |
| Next ↔ React | **Aligned** (16.4 + 19.3) |
| Next ↔ Node | **OK** (engines `>=20.9.0`; 22 and 24 both satisfy) |
| Worker ↔ Redis ↔ BullMQ | **OK** assuming **Redis 7.4+** and explicit `redis` / ioredis versions chosen at init |
| ORM ↔ PostgreSQL | **Plausible**; no version conflict identified |
| TypeScript ↔ Next | **OK** on 5.9; verify `next` template `tsconfig` at scaffold time |

---

## Unverified / out of scope for this review

- Exact **docker-compose** image tags for Postgres/Redis in `infra/compose.yaml` (not present in spine).
- **BullMQ 6** vs **5** feature/security delta for this product.
- **License / export** constraints for scrape workloads on chosen Node LTS images.
- **Node.js release-schedule evolution** blog (future yearly majors)—only **current** [nodejs/Release](https://github.com/nodejs/release/) table was used for 22 vs 24.
- Production **managed service** default versions matching spine majors.

---

## Recommendations (spine or repo init, not blocking)

1. **Node:** Keep **22** only with explicit “Maintenance LTS” note, or prefer **24 Active LTS** for greenfield; set minimum **patch** in toolchain files.
2. **Redis:** Change pin text to **Redis 7.4 (LTS)** and minimum security patch level.
3. **Patches:** At init, pin exact versions: `next@16.4.0`, `react@19.3.0`, `typescript@5.9.3`, `drizzle-orm@0.44.7`, `bullmq@5.81.5` (or current 5.x patch), `postgres` image **16.15+**.
4. **Security:** Schedule **Next.js patch** immediately after **2026-10-14** OOB release; subscribe to Node 22 maintenance releases until Node 24 migration.
5. **Document lag:** One line in Stack table or companion ADR for **BullMQ 5.x** and **Drizzle 0.44.x** vs npm `latest`.

---

## Sources consulted

| Source | Used for |
| --- | --- |
| npm registry (`npm view`, 2026-10-11) | next, react, typescript, drizzle-orm, bullmq versions |
| [nextjs.org/blog/next-16-4](https://nextjs.org/blog/next-16-4) | 16.4.0 release, React 19.3 bundling |
| [react.dev/blog/2026/09/09/react-19-3](https://react.dev/blog/2026/09/09/react-19-3) | React 19.3.0 date |
| [github.com/nodejs/release](https://github.com/nodejs/release/) | Node 22 Maintenance vs 24 Active LTS |
| [postgresql.org/support/versioning](https://www.postgresql.org/support/versioning/) | PG 16 support EOL, 16.15 minor |
| [github.com/redis/redis/releases/tag/7.4.11](https://github.com/redis/redis/releases/tag/7.4.11) | Redis 7.4.11 date / security |
| [docs.bullmq.io](https://docs.bullmq.io/) / GitHub releases (secondary) | BullMQ 5.x changelog line |

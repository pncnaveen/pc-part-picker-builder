# Stack version review — PC Part Picker & Builder (v1)

| Field | Value |
| --- | --- |
| **Artifact** | `architecture-pc-part-picker-builder.md` (Stack table, Implementation patterns) |
| **Lens** | Version currency & reasonableness (as of **2026-10-12**) |
| **Date** | 2026-10-12 |
| **Method** | Cross-check spine pins against npm registry (`npm view`, 2026-10-12), Node.js / PostgreSQL / Redis / RabbitMQ vendor sources. Items without a primary registry or vendor source are marked **unverified**. |

## Verdict

**PASS (with caveats)** — The updated stack is **coherent and implementable** for repo init in October 2026: **Node 24.21.0** is the current **24.x LTS** patch; **NestJS 11.x** and **React 19.3** align with a split **API + SPA + worker** layout; **PostgreSQL 16**, **Redis 7.4 LTS**, and **RabbitMQ 4.x** are conservative, supported choices. **Prisma 6.x** is one major behind npm `latest` (7.x stable, 8.x pre-release)—acceptable intentional lag for cold-start. Main gaps: **major-only pins** (Nest 11.x, Prisma 6.x, RabbitMQ 4.x, TypeScript 5.9), **npm `latest` ahead on Nest 12** and **TypeScript 7.x**, and **Redis OSS 7.4 LTS nearing end of support** (plan upgrade path before late 2026).

## Spine pins (reference)

| Name | Pinned | Assessment |
| --- | --- | --- |
| Node.js | 24.21.0 | **Current / verified** (24.x LTS latest patch) |
| TypeScript | 5.9 | **Reasonable** — registry `latest` is **7.0.2**; pin **5.9.3** at init |
| NestJS | 11.x | **Reasonable** — npm `latest` is **12.1.2**; 11.x latest patch **11.2.7** |
| React | 19.3 | **Current / verified** — npm **19.3.0** |
| PostgreSQL | 16 | **Supported / conservative** — current minor **16.15** (2026-08-13) |
| Redis | 7.4 LTS | **Reasonable** — minimum OSS patch **7.4.11+**; plan lifecycle |
| RabbitMQ | 4.x | **Current** — latest stable **4.3.6** (2026-09-14) |
| Prisma ORM | 6.x | **Reasonable** — 6.x latest **6.19.3**; npm `latest` prisma **8.0.0-rc.22**, client **7.10.0** |

---

## Per-component findings

### Node.js 24.21.0 — **Verified, optimal for greenfield**

| Check | Result |
| --- | --- |
| Release | **2026-09-08** — [Node.js 24.21.0 (LTS)](https://nodejs.org/en/blog/release/v24.21.0) |
| LTS posture | **24 “Krypton”** Active/Maintenance LTS; security support through **2028-04-30** (per [nodejs/release](https://github.com/nodejs/release/)) |
| Spine fit | Exact patch pin is **good practice** for CI and Docker base images |

**Advisory:** Node 24 entered security-fix-only phase after **2026-10-20** active support window (per community EOL trackers)—still supported; subscribe to security advisories.

### TypeScript 5.9 — **Verified line; registry ahead**

| Check | Result |
| --- | --- |
| npm `typescript@5.9` | **5.9.3** latest in 5.9 line |
| npm `typescript` (latest) | **7.0.2** |
| Spine | Major-only **5.9** — document intentional lag vs 7.x at repo init |

### NestJS 11.x — **Verified line; Nest 12 is current**

| Check | Result |
| --- | --- |
| npm `@nestjs/core@11` | Latest **11.2.7** |
| npm `@nestjs/core` (latest) | **12.1.2** |
| `@nestjs/microservices@11` | Align at **11.2.7** for RabbitMQ transport |
| Spine fit | **11.x** is a valid stability pin; verify Nest 11 + Node 24 in smoke test at init |

**Unverified:** Breaking changes Nest 11 → 12 for your module layout (not required for PASS).

### React 19.3 — **Verified**

| Check | Result |
| --- | --- |
| npm `react@19.3` | **19.3.0** |
| Spine | Pin **19.3.0** in `frontend` at init; pairs with Vite or similar SPA toolchain (not named in spine—**unverified** default) |

### PostgreSQL 16 — **Verified supported major**

| Check | Result |
| --- | --- |
| Current minor | **16.15** (2026-08-13) — [release notes](https://www.postgresql.org/docs/16/release-16-15.html) |
| Support | Major supported until **2028-11-09** ([versioning policy](https://www.postgresql.org/support/versioning/)) |
| Spine | Major-only **16** — use image/deployment **≥ 16.15** |

### Redis 7.4 LTS — **Verified; lifecycle watch**

| Check | Result |
| --- | --- |
| Latest 7.4 OSS | **7.4.11** (2026-08-17) — security release ([release tag](https://github.com/redis/redis/releases/tag/7.4.11)) |
| Role in spine | Cache + optional pub/sub hints only (AD-1, AD-6); not job transport |
| Lifecycle | **Redis Software 7.4** EOL **2026-11-30** cited in vendor docs—for OSS/managed SKUs, confirm provider matrix and plan **7.8+ / 8.x** before production hardening |

### RabbitMQ 4.x — **Verified current**

| Check | Result |
| --- | --- |
| Latest | **4.3.6** ([download docs](https://www.rabbitmq.com/docs/download), 2026-09-14) |
| Docker | `rabbitmq:4.3.6-management` ([Docker Hub](https://hub.docker.com/_/rabbitmq)) |
| Erlang | 4.3.6 supports OTP **27.0–28.x** ([which-erlang](https://www.rabbitmq.com/docs/which-erlang)) |
| Nest integration | Use `@nestjs/microservices` (RMQ) or `amqplib` (**2.2.0** on npm)—pair with spine **outbox** pattern (AD-6) |

**Advisory:** Configure **DLQ**, consumer **prefetch**, and **idempotent** handlers for scrape/email; not a version issue but required for AD-6 semantics.

### Prisma ORM 6.x — **Verified line; lag vs latest**

| Check | Result |
| --- | --- |
| npm `prisma@6` | Latest **6.19.3** |
| npm `@prisma/client@6` | **6.19.3** (keep CLI and client in lockstep) |
| npm `prisma` (latest) | **8.0.0-rc.22** (pre-release) |
| npm `@prisma/client` (latest) | **7.10.0** |
| Spine fit | **6.x** conservative; ULID and `snake_case` columns (AD-15, conventions) are straightforward in Prisma 6 |

**Unverified:** Prisma 6 + NestJS 11 + Node 24 together in this repo (expected to work; confirm at `prisma init`).

---

## Cross-stack coherence

| Pairing | Assessment |
| --- | --- |
| Node 24 + Nest 11 + Prisma 6 | **OK** — standard server stack; pin exact patches in lockfile |
| Nest API + React SPA + httpOnly cookies | **OK** — spine documents subdomain/BFF note; not a version issue |
| RabbitMQ (AD-6) + Redis (cache) + PostgreSQL (outbox) | **OK** — three infra components; Compose should pin **4.3.6**, **7.4.11+**, **16.15** |
| Worker consumers + same `packages/domain` as API | **OK** — aligns with AD-16 |

---

## Unverified / out of scope for this review

- Exact **docker-compose** image tags in `infra/compose.yaml` (not present in repo yet).
- **Nest 12** vs **11** migration effort.
- **Prisma 7** feature/security delta vs **6.19.x** for this schema size.
- **Vite / React Router** versions for `apps/frontend` (spine does not pin bundler).
- Production **managed** RabbitMQ/Redis/Postgres SKU versions vs OSS pins.
- **review-adversarial.md** (2026-10-11) — still valid on domain ADs; re-run if you want AD-16/17 twin-unit pass after stack split.

---

## Recommendations (spine or repo init, not blocking)

1. **At init, pin exact versions:** `node@24.21.0`, `typescript@5.9.3`, `@nestjs/core@11.2.7`, `react@19.3.0`, `prisma@6.19.3`, `@prisma/client@6.19.3`.
2. **Infra images:** `postgres:16.15` (or newer 16.x), `redis:7.4.11` (or newer 7.4.x), `rabbitmq:4.3.6-management`.
3. **Document lag:** One line in README or toolchain ADR: **Nest 11** vs npm 12, **Prisma 6** vs 7/8, **TypeScript 5.9** vs 7.
4. **Redis lifecycle:** Add a **Deferred** or ops note to evaluate **Redis 8.x** (or provider equivalent) before **2026-11-30** if using vendor 7.4 LTS timelines.
5. **Security:** Subscribe to Node 24, Nest, Prisma, RabbitMQ, and Redis security advisories; bump patches on cadence.

---

## Sources consulted

| Source | Used for |
| --- | --- |
| npm registry (`npm view`, 2026-10-12) | @nestjs/core, @nestjs/microservices, prisma, @prisma/client, react, typescript, amqplib |
| [nodejs.org Node 24.21.0](https://nodejs.org/en/blog/release/v24.21.0) | Node patch verification |
| [github.com/nodejs/release](https://github.com/nodejs/release/) | LTS schedule |
| [postgresql.org versioning / 16.15 release](https://www.postgresql.org/support/versioning/) | PG 16 minor |
| [github.com/redis/redis 7.4.11](https://github.com/redis/redis/releases/tag/7.4.11) | Redis patch / security |
| [rabbitmq.com download / release information](https://www.rabbitmq.com/docs/download) | RabbitMQ 4.3.6 |

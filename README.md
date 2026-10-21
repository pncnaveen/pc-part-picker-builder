# PC Part Picker Builder

Web app for individuals to plan custom PC builds with **budget**, **owned hardware**, **compatibility validation**, **India-region catalog/pricing**, and **retailer link-outs**. Organization and dealer flows are planned for v2.

This repository uses the **[BMad Method](https://docs.bmad-method.org/)** (v7 skills) in **Cursor** for planning and implementation workflows.

**Active initiative:** `initiative-pc-part-picker-builder` (set in `_bmad/custom/config.user.toml` on each machine).

## Planning artifacts (current state)

| Stage            | Location                                          | Status                |
| ---------------- | ------------------------------------------------- | --------------------- |
| Initiative       | `_bmad-output/initiative-pc-part-picker-builder/` | Active                |
| Brainstorm       | `.../brainstorm-pc-parts-picker-builder/`         | Complete              |
| Product brief    | `.../brief-pc-part-picker-builder/`               | Ready                 |
| PRD              | `.../prd-pc-part-picker-builder/`                 | **Final**             |
| Spec             | `.../spec-pc-part-picker-builder/`                | Final                 |
| Architecture     | `.../architecture-pc-part-picker-builder/`        | Final                 |
| UX               | `.../ux-pc-part-picker-builder/`                  | Final                 |
| Epics            | `_bmad-output/planning-artifacts/epics.md`        | Ready for development |
| Application code | `apps/`, `packages/` (beyond `domain` stub)       | Epic 1 in progress    |

Key files:

- `prd-pc-part-picker-builder.md` — requirements (FRs), India launch, journeys UJ-1–4
- `architecture-pc-part-picker-builder.md` — stack, ADs, monorepo layout
- `EXPERIENCE.md` / `DESIGN.md` — UX contract (guided POC + admin)
- `epics.md` — stories and acceptance criteria (full acceptance criteria)
- `initiative-pc-part-picker-builder/tickets.toml` — epic build order; `epic-*/tickets.toml` — story breakdown (refs **1.1**, **5.4**, …)
- `CONTRIBUTING.md` — git workflow, lint/format, coding standards
- `AGENTS.md` — agent policy (Cursor reads this at repo root)

## Repository layout

```
pc-part-picker-builder/
├── _bmad/                 # BMad install (config, scripts, module manifests)
├── _bmad-output/          # Generated planning & implementation artifacts
├── .agents/skills/        # Cursor skill copies (optional in git — see .gitignore)
├── docs/                  # Project knowledge (optional; referenced by BMM config)
├── infra/                 # compose.yaml — local Postgres, RabbitMQ, Redis (Epic 1.2+)
├── packages/              # domain, db, shared (Epic 1+)
├── apps/                  # frontend, api, worker (Epic 1+)
├── CONTRIBUTING.md        # Git workflow and coding standards
├── AGENTS.md              # Agent instructions (managed block)
├── .gitignore
└── README.md
```

Installed BMad modules (see `_bmad/_config/manifest.yaml`):

- **core** — shared workflows (help, brainstorm, party mode, …)
- **bmm** — BMad Method (brief, PRD, architecture, epics, build, …)
- **bmb** — BMad Builder (agents/workflows/modules)
- **cis** — Creative Intelligence Suite

## Clone, second PC, or after `git pull`

Use this on a **new machine** or whenever you pull changes that touch `package.json` or `pnpm-lock.yaml`.

### Node, pnpm, and dependencies

1. Install **Node.js 24.x LTS** (`>=24.21.0 <25` in `package.json` `engines`; `.nvmrc` is `24` for latest 24.x with fnm/nvm).
2. Enable **Corepack** (ships with Node) so this repo uses the pinned package manager:
   ```powershell
   corepack enable
   corepack prepare pnpm@10.12.1 --activate
   ```
   Corepack reads `"packageManager": "pnpm@10.12.1"` in `package.json` so both PCs use the same pnpm version. If `corepack enable` fails on Windows, run the terminal as Administrator once, or install `pnpm@10.12.1` globally and still run `pnpm install` from the repo root.
3. From the **repository root**:
   ```powershell
   pnpm install
   ```
   Git does not commit `node_modules/` — install recreates tooling (ESLint, Prettier, TypeScript, workspace packages) from the lockfile.
4. Quick check:
   ```powershell
   pnpm build
   pnpm format:check
   pnpm lint
   pnpm lint:boundaries
   ```

**Every pull:** `git pull` then `pnpm install` if dependencies changed.

### Local infrastructure (Docker Compose)

Story **1.2** — Postgres **16**, RabbitMQ **4.x** (management UI), Redis **7.4** for `api` and `worker`.

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose v2).

From the **repository root**:

```powershell
docker compose -f infra/compose.yaml up -d
docker compose -f infra/compose.yaml ps
```

| Service     | Host port | Purpose                                    |
| ----------- | --------- | ------------------------------------------ |
| Postgres    | `5432`    | `DATABASE_URL` / Prisma                    |
| Redis       | `6379`    | `REDIS_URL`                                |
| RabbitMQ    | `5672`    | `RABBITMQ_URL` (AMQP)                      |
| RabbitMQ UI | `15672`   | http://localhost:15672 (`pcppb` / `pcppb`) |

Stop and remove containers (keeps the Postgres volume):

```powershell
docker compose -f infra/compose.yaml down
```

**Environment variables** for `apps/api` and `apps/worker` when pointing at this stack (copy [`.env.example`](.env.example) to `.env` at repo root, or set in your shell):

| Variable       | Local value (matches `infra/compose.yaml`)      |
| -------------- | ----------------------------------------------- |
| `DATABASE_URL` | `postgresql://pcppb:pcppb@localhost:5432/pcppb` |
| `REDIS_URL`    | `redis://localhost:6379`                        |
| `RABBITMQ_URL` | `amqp://pcppb:pcppb@localhost:5672`             |

Prisma CLI also reads `DATABASE_URL` from `packages/db/.env` — use the same URL there for migrations (Story 1.3+).

### Prisma baseline and API health (Story 1.3)

With Compose running and `DATABASE_URL` set (root `.env` and `packages/db/.env`):

```powershell
pnpm install
pnpm --filter @pcppb/db run migrate:deploy
pnpm --filter @pcppb/api run dev
```

Verify database reachability:

```powershell
curl http://localhost:3000/health
```

Expect HTTP **200** and JSON like `{"status":"ok","checks":{"database":"ok"}}`. The initial migration creates only Prisma’s `_prisma_migrations` table (no domain models yet).

For a new migration during development:

```powershell
pnpm --filter @pcppb/db run migrate:dev
```

### Hexagonal boundaries and worker skeleton (Story 1.4)

Enforce AD-16 domain layering:

```powershell
pnpm lint:boundaries
```

`packages/domain` must not import Nest, Prisma, RabbitMQ, Redis, React, or `@pcppb/db` (ESLint + dependency-cruiser).

With Compose running and `RABBITMQ_URL` set in root `.env`:

```powershell
pnpm --filter @pcppb/worker run dev
```

Expect a log line that the worker connected to RabbitMQ; no message consumers run yet.

### React SPA and API CORS (Story 1.5)

With Compose running, migrations applied, and root `.env` set (see Story 1.3), start the API and frontend in separate terminals:

```powershell
pnpm --filter @pcppb/api run dev
pnpm --filter @pcppb/frontend run dev
```

Open http://localhost:5173 — the SPA fetches `GET http://localhost:3000/health` and shows API status and database check.

| Variable            | Where                                    | Default (local)                                                                      |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `FRONTEND_ORIGIN`   | API (root `.env`)                        | `http://localhost:5173` — allowed browser origin when `NODE_ENV` is not `production` |
| `VITE_API_BASE_URL` | Frontend (`apps/frontend/.env` or shell) | `http://localhost:3000`                                                              |

Non-production CORS is enabled only when `NODE_ENV` is not `production`; production deployments must configure CORS explicitly later.

### Git branches (see [`CONTRIBUTING.md`](CONTRIBUTING.md))

| Branch            | Role                                                 |
| ----------------- | ---------------------------------------------------- |
| `main`            | Production                                           |
| `development`     | Integration (cut from `main` once, then long-lived)  |
| `feat-<story-id>` | Feature work (e.g. `feat-1.1` for story ref **1.1**) |

Work merges: `feat-*` → PR → `development` → PR → `main`.

### Implementation tickets (repo store)

Story queue lives under `_bmad-output/initiative-pc-part-picker-builder/`:

- **Epic order:** `tickets.toml`
- **Per-epic stories:** `epic-1-application-foundation/tickets.toml`, … `epic-9-…/tickets.toml`

See what is ready to start:

```powershell
uv run .agents/skills/bmad-ticket/scripts/tickets.py --project-root . next _bmad-output/initiative-pc-part-picker-builder
```

(Requires BMad skills under `.agents/skills/` or adjust path if you use a global install.)

### GitHub Issues and milestones

[Issues](https://github.com/pncnaveen/pc-part-picker-builder/issues) track implementation; **build order** stays in `tickets.toml` (BMad repo store).

| Layer                | GitHub                                                                                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Milestone**        | One per epic (filter board by milestone)                                                                                                                                          |
| **Epic issue**       | Parent issue, label `epic` — e.g. [#47 Epic 1: Application foundation](https://github.com/pncnaveen/pc-part-picker-builder/issues/47)                                             |
| **Story sub-issues** | Children via `--parent`, label `story`, titles `[1.1]` … `[9.4]` — e.g. [#56 `[1.1] Monorepo scaffold…`](https://github.com/pncnaveen/pc-part-picker-builder/issues/56) under #47 |

**Epic parent issues (current):** #47 Epic 1 · #48 Epic 4 · #49 Epic 2 · #50 Epic 3 · #51 Epic 5 · #52 Epic 6 · #53 Epic 7 · #54 Epic 8 · #55 Epic 9.

**PRs:** branch `feat-1.1` from `development`; close the **story sub-issue** (`Closes #56` for **1.1**, or search `gh issue list --search "[1.1] in:title"`). Full AC: `planning-artifacts/epics.md`.

Recreate from tickets (closes all open issues first):

```powershell
uv run _bmad/scripts/sync_github_issues.py --reset
```

Bidirectional BMad ↔ GitHub state: `bmad-ticket` store setup in `_bmad/custom/ticketing-store-config.toml`.

---

## Setting up BMad on a new machine

Same as above for Node/pnpm; additionally:

### 1. Prerequisites

- **[Cursor](https://cursor.com)** (this project was installed for the Cursor IDE target)
- **Python 3.8+** and **[uv](https://docs.astral.sh/uv/)** — used by BMad helper scripts (`memlog.py`, `resolve_config.py`, customization resolver).  
  On Windows, install Python/uv and ensure both are on your `PATH` (not only the Microsoft Store stub).

### 2. Clone and open in Cursor

```powershell
git clone <your-repo-url> pc-part-picker-builder
cd pc-part-picker-builder
```

Open the folder in Cursor.

### 3. Install or refresh BMad in this project

If `_bmad/` is **missing** or you need a **clean reinstall**:

1. Follow the official installer for your IDE: **[BMad Method documentation](https://docs.bmad-method.org/)**
2. Run the installer against **this project root** (`pc-part-picker-builder`)
3. Select the same modules you use here: **BMM**, **BMB**, **CIS** (and **Core**)
4. Choose **Cursor** as the IDE so skills are synced into `.agents/skills/`

The installer regenerates `_bmad/config.toml` and module configs. **Team overrides** belong in `_bmad/custom/config.toml` (safe to commit). **Personal overrides** go in `_bmad/custom/config.user.toml` (gitignored — create locally after clone).

Example personal file (adjust name/locale):

```toml
# _bmad/custom/config.user.toml (not committed)

[core]
user_name = "Your Name"
communication_language = "English"
```

### 4. If `.agents/` was not committed

This repo’s `.gitignore` excludes `.agents/` by default. After BMad install, Cursor skills reappear under `.agents/skills/`. To commit skills for a “full snapshot” repo, remove the `.agents/` line from `.gitignore` and add the folder.

### 5. Verify BMad scripts (optional)

```powershell
uv run _bmad/scripts/resolve_config.py --project-root .
```

You should get merged JSON config without errors.

### 6. Get oriented in chat

In Cursor Agent chat:

| Intent                    | Invoke                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| Where am I / what’s next? | `/bmad-help` or “bmad help”                                                                          |
| Resume PRD                | `bmad-prd` and point at `_bmad-output/initiative-pc-part-picker-builder/prd-pc-part-picker-builder/` |
| Finalize PRD later        | Same skill; say **finalize** when ready                                                              |
| UX after PRD              | `/bmad-ux`                                                                                           |
| Architecture              | `/bmad-architecture`                                                                                 |
| Epics & stories           | `/bmad-create-epics-and-stories`                                                                     |

Catalog of skills: `_bmad/_config/bmad-help.csv`.

## Git and what to commit

| Path                            | Commit?                                                          |
| ------------------------------- | ---------------------------------------------------------------- |
| `_bmad-output/`                 | **Yes** — product artifacts                                      |
| `_bmad/`                        | **Yes** — shared BMad config and scripts                         |
| `_bmad/custom/config.user.toml` | **No** — personal (gitignored)                                   |
| `.agents/`                      | **Optional** — ignored by default; reinstall via BMad if omitted |

Never commit `.env`, keys, or credential files (patterns in `.gitignore`).

## Development

See **Clone, second PC, or after `git pull`** for Node, Corepack, and `pnpm install`.

- Toolchain details: [`CONTRIBUTING.md`](CONTRIBUTING.md)
- Agent rules: [`AGENTS.md`](AGENTS.md)

## Suggested workflow (planning → build)

Planning artifacts above are complete. Implementation:

1. Create `development` from `main` on the remote if not done yet; branch `feat-1.1` from `development` for the first story.
2. `bmad-sprint-planning` → sprint status (optional)
3. Story **1.1** in `epic-1-application-foundation/tickets.toml` — full AC in `epics.md` → `bmad-build` or implement manually
4. Track work on [GitHub Issues](https://github.com/pncnaveen/pc-part-picker-builder/issues) (milestones per epic)

Use `bmad-correct-course` if scope shifts mid-stream.

## Links

- BMad Method docs: https://docs.bmad-method.org/
- BMad Builder docs: https://bmad-builder-docs.bmad-method.org/

## License

Add a license file when you choose one for the application code; planning artifacts are yours to license as you prefer.

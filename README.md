# PC Part Picker Builder

Web app for individuals to plan custom PC builds with **budget**, **owned hardware**, **compatibility validation**, **India-region catalog/pricing**, and **retailer link-outs**. Organization and dealer flows are planned for v2.

This repository uses the **[BMad Method](https://docs.bmad-method.org/)** (BMad **6.12.0**) in **Cursor** for planning and (later) implementation workflows.

## Planning artifacts (current state)

| Stage | Location | Status |
|--------|----------|--------|
| Brainstorm | `_bmad-output/brainstorming/brainstorm-pc-parts-picker-builder-2026-10-02/` | Complete |
| Product brief | `_bmad-output/planning-artifacts/briefs/brief-pc-part-picker-builder-2026-10-03/` | Ready |
| PRD | `_bmad-output/planning-artifacts/prds/prd-pc-part-picker-builder-2026-10-03/` | **Draft** (not finalized) |

Key files:

- `prd.md` — requirements (FR-1–FR-31), India launch, email auth, link-out v1
- `addendum.md` — catalog SLA, substitutes matrix, v2 backlog
- `.memlog.md` — run decisions (resume PRD work from here)

## Repository layout

```
pc-part-picker-builder/
├── _bmad/                 # BMad install (config, scripts, module manifests)
├── _bmad-output/          # Generated planning & implementation artifacts
├── .agents/skills/        # Cursor skill copies (optional in git — see .gitignore)
├── docs/                  # Project knowledge (optional; referenced by BMM config)
├── .gitignore
└── README.md
```

Installed BMad modules (see `_bmad/_config/manifest.yaml`):

- **core** — shared workflows (help, brainstorm, party mode, …)
- **bmm** — BMad Method (brief, PRD, architecture, epics, build, …)
- **bmb** — BMad Builder (agents/workflows/modules)
- **cis** — Creative Intelligence Suite

## Setting up BMad on a new machine

Use this when you clone the repo later or move to another PC.

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

| Intent | Invoke |
|--------|--------|
| Where am I / what’s next? | `/bmad-help` or “bmad help” |
| Resume PRD | `/bmad-prd` and point at `_bmad-output/planning-artifacts/prds/prd-pc-part-picker-builder-2026-10-03/` |
| Finalize PRD later | Same skill; say **finalize** when ready |
| UX after PRD | `/bmad-ux` |
| Architecture | `/bmad-architecture` |
| Epics & stories | `/bmad-create-epics-and-stories` |

Catalog of skills: `_bmad/_config/bmad-help.csv`.

## Git and what to commit

| Path | Commit? |
|------|---------|
| `_bmad-output/` | **Yes** — product artifacts |
| `_bmad/` | **Yes** — shared BMad config and scripts |
| `_bmad/custom/config.user.toml` | **No** — personal (gitignored) |
| `.agents/` | **Optional** — ignored by default; reinstall via BMad if omitted |

Never commit `.env`, keys, or credential files (patterns in `.gitignore`).

## Suggested workflow after PRD finalize

1. `bmad-prd` → finalize PRD  
2. `bmad-ux` → design + experience docs  
3. `bmad-architecture` → technical decisions  
4. `bmad-create-epics-and-stories` → epics/stories  
5. `bmad-sprint-planning` → sprint status  
6. `bmad-build` → implementation  

Use `bmad-correct-course` if scope shifts mid-stream.

## Links

- BMad Method docs: https://docs.bmad-method.org/
- BMad Builder docs: https://bmad-builder-docs.bmad-method.org/

## License

Add a license file when you choose one for the application code; planning artifacts are yours to license as you prefer.

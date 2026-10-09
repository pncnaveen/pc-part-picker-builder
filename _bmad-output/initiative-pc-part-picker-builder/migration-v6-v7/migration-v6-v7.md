---
type: migration
title: Move v6 planning artifacts into v7 initiative layout
status: done
created: 2026-10-09
from: "6"
to: "7"
module: method
---

# Migration v6 → v7 (pc-part-picker-builder)

## Detect signals matched

- Dated planning folders: `planning-artifacts/briefs/brief-pc-part-picker-builder-2026-10-03/`, `planning-artifacts/prds/prd-pc-part-picker-builder-2026-10-03/`
- Brainstorm session folder: `brainstorming/brainstorm-pc-parts-picker-builder-2026-10-02/`
- No `epics.md`, `sprint-status.yaml`, or v6 story build records
- No `active_initiative` in `_bmad/custom/config.user.toml`
- No existing `initiative-*/` under `_bmad-output/`

## Inventory (8 files under source folders)

| Path |
|------|
| `_bmad-output/brainstorming/brainstorm-pc-parts-picker-builder-2026-10-02/brainstorm-intent.md` |
| `_bmad-output/brainstorming/brainstorm-pc-parts-picker-builder-2026-10-02/.memlog.md` |
| `_bmad-output/planning-artifacts/briefs/brief-pc-part-picker-builder-2026-10-03/brief.md` |
| `_bmad-output/planning-artifacts/briefs/brief-pc-part-picker-builder-2026-10-03/addendum.md` |
| `_bmad-output/planning-artifacts/briefs/brief-pc-part-picker-builder-2026-10-03/.memlog.md` |
| `_bmad-output/planning-artifacts/prds/prd-pc-part-picker-builder-2026-10-03/prd.md` |
| `_bmad-output/planning-artifacts/prds/prd-pc-part-picker-builder-2026-10-03/addendum.md` |
| `_bmad-output/planning-artifacts/prds/prd-pc-part-picker-builder-2026-10-03/.memlog.md` |

`implementation-artifacts/` — empty (no files).

## Migration questions (answers)

| Question | Answer | Reason |
|----------|--------|--------|
| Backup output folder? | **No separate backup** | Clean git repo; migration commits are the safety net |
| How many initiatives? | **One:** `initiative-pc-part-picker-builder` | Matches `core.project_name` |
| Workspace / multi-repo? | **No** | Single repo, all code + store |
| Separate store git repo? | **No** | `_bmad-output/` stays in this repo |
| In-progress v6 stories? | **Migrate now** | No epics or implementation artifacts |
| Fold unstarted story files? | **Yes (default)** | N/A — none present |

**User approval:** Invoked `bmad migrate method` with prior confirmation that the other PC has no divergent changes.

## What joins the initiative

| File / folder | Evidence | v7 location |
|---------------|----------|-------------|
| Brief + addendum + memlog | PRD `source_brief`; initiative planning | `initiative-pc-part-picker-builder/brief-pc-part-picker-builder/` |
| PRD + addendum + memlog | Primary requirement source | `initiative-pc-part-picker-builder/prd-pc-part-picker-builder/` |
| Brainstorm intent + memlog | Brief addendum § Source artifacts | `initiative-pc-part-picker-builder/brainstorm-pc-parts-picker-builder/` |
| Brainstorm intent (lineage) | Initiative origin | `initiative-pc-part-picker-builder/intent.md` (from brainstorm-intent) |

**Inbox:** none  
**Archive-v6:** none (no `epics.md` / `sprint-status.yaml`)  
**Left in place:** none  

## Ticket tree

No `epics.md` — initiative `tickets.toml` has no `[[epic]]` entries yet. Epics come after PRD finalize + `bmad-ticket` / spec.

## Path rewrites (live store)

Update relative references in moved PRD, brief addendum, PRD addendum, and initiative References.

## Outside store (user updates)

- `README.md` — planning table and resume-PRD paths still cite v6 folders

## Configuration

Set `_bmad/custom/config.user.toml`:

```toml
[core]
active_initiative = "initiative-pc-part-picker-builder"
```

## Checklist results

| Item | Result |
|------|--------|
| Every v6 file accounted for | **Pass** — 8 files under initiative; empty v6 folders removed |
| Folder main-file convention | **Pass** — brief/prd/brainstorm main files renamed; initiative envelope present |
| Store root layout | **Pass** — `initiative-pc-part-picker-builder/` at store root |
| `tickets.py status` | **Skipped** — script not in `_bmad/`; no epics/stories to validate |
| Story/entry mapping | **N/A** |
| Plan paths / config | **Pass** — paths rewritten; `config.user.toml` sets `active_initiative` (local, gitignored) |

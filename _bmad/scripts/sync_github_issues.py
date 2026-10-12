"""Create GitHub milestones, epic issues, and story sub-issues from BMad tickets.toml.

Run from repo root:
  uv run _bmad/scripts/sync_github_issues.py           # create (fails if epics already exist)
  uv run _bmad/scripts/sync_github_issues.py --reset   # close all open issues, then create

Epic = parent issue (label `epic`). Stories = sub-issues (`--parent`, label `story`).
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import tomllib
from pathlib import Path

REPO = "pncnaveen/pc-part-picker-builder"
INITIATIVE = Path("_bmad-output/initiative-pc-part-picker-builder")
EPICS_MD = Path("_bmad-output/planning-artifacts/epics.md")
ISSUE_URL_RE = re.compile(r"/issues/(\d+)\s*$")


def gh(args: list[str]) -> str:
    result = subprocess.run(
        ["gh", *args],
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout.strip()


def gh_ok(args: list[str]) -> tuple[bool, str]:
    result = subprocess.run(
        ["gh", *args],
        capture_output=True,
        text=True,
    )
    return result.returncode == 0, (result.stdout or result.stderr or "").strip()


def issue_number_from_create_output(output: str) -> int:
    match = ISSUE_URL_RE.search(output.splitlines()[-1] if output else "")
    if not match:
        raise RuntimeError(f"Could not parse issue number from: {output!r}")
    return int(match.group(1))


def ensure_label(name: str, color: str, description: str) -> None:
    ok, err = gh_ok(
        ["label", "create", name, "--color", color, "--description", description, "--repo", REPO]
    )
    if not ok and "already exists" not in err:
        raise RuntimeError(err)


def find_milestone(title: str) -> dict | None:
    out = gh(["api", f"repos/{REPO}/milestones", "--paginate"])
    data = json.loads(out)
    items = data if isinstance(data, list) else [data]
    for ms in items:
        if ms.get("title") == title:
            return ms
    return None


def ensure_milestone(title: str, description: str) -> str:
    existing = find_milestone(title)
    if existing:
        print(f"Milestone exists: {title} (#{existing['number']})")
        return title
    out = gh(
        [
            "api",
            f"repos/{REPO}/milestones",
            "-f",
            f"title={title}",
            "-f",
            f"description={description}",
        ]
    )
    ms = json.loads(out)
    print(f"Created milestone #{ms['number']}: {title}")
    return title


def close_all_open_issues() -> None:
    out = gh(
        [
            "issue",
            "list",
            "--repo",
            REPO,
            "--state",
            "open",
            "--limit",
            "500",
            "--json",
            "number",
        ]
    )
    numbers = [item["number"] for item in json.loads(out)]
    for n in numbers:
        gh_ok(
            [
                "issue",
                "close",
                str(n),
                "--repo",
                REPO,
                "--comment",
                "Closed by sync_github_issues.py --reset (replaced by epic parent + story sub-issues).",
            ]
        )
        print(f"Closed #{n}")
    if not numbers:
        print("No open issues to close.")


def epic_issue_exists(eid: int, title: str) -> int | None:
    """Return epic issue number if an open epic issue already exists."""
    query = f"repo:{REPO} is:issue is:open label:epic \"Epic {eid}:\""
    out = gh(["issue", "list", "--repo", REPO, "--search", query, "--json", "number,title", "--limit", "5"])
    items = json.loads(out)
    for item in items:
        if item.get("title") == f"Epic {eid}: {title}":
            return item["number"]
    return None


def main() -> int:
    reset = "--reset" in sys.argv
    root = Path.cwd()
    init_toml = root / INITIATIVE / "tickets.toml"
    data = tomllib.loads(init_toml.read_text(encoding="utf-8"))
    epics = data.get("epic", [])

    ensure_label("story", "1D76DB", "Implementation story (sub-issue)")
    ensure_label("epic", "0E8A16", "Epic parent issue")

    if reset:
        close_all_open_issues()
    elif any(epic_issue_exists(e["id"], e["title"]) for e in epics):
        print(
            "Epic issues already exist. Use --reset to close open issues and recreate, "
            "or create stories manually with gh issue create --parent <epic#>.",
            file=sys.stderr,
        )
        return 1

    milestone_by_epic_id: dict[int, str] = {}
    parent_by_epic_id: dict[int, int] = {}

    for epic in epics:
        eid = epic["id"]
        title = epic["title"]
        slug = epic["slug"]
        ms_title = f"Epic {eid}: {title}"
        ms_desc = (
            f"BMad epic `{slug}`. Build order: `{INITIATIVE}/tickets.toml`. "
            f"AC: `{EPICS_MD}`."
        )
        milestone_by_epic_id[eid] = ensure_milestone(ms_title, ms_desc)

        epic_body = f"""## Epic {eid}: {title}

**Slug:** `{slug}`

### Tracking
- Stories are **sub-issues** under this epic issue.
- Repo breakdown: `{INITIATIVE}/{slug}/tickets.toml`
- Epic envelope: `{INITIATIVE}/{slug}/{slug}.md`
- Full acceptance criteria: `{EPICS_MD}`

### Milestone
{ms_title}
"""
        epic_url = gh(
            [
                "issue",
                "create",
                "--repo",
                REPO,
                "--title",
                f"Epic {eid}: {title}",
                "--body",
                epic_body,
                "--label",
                "epic",
                "--milestone",
                ms_title,
            ]
        )
        parent_num = issue_number_from_create_output(epic_url)
        parent_by_epic_id[eid] = parent_num
        print(f"Epic issue #{parent_num}: {ms_title}")

    story_count = 0
    for epic in epics:
        eid = epic["id"]
        slug = epic["slug"]
        ms_title = milestone_by_epic_id[eid]
        parent = parent_by_epic_id[eid]
        epic_toml = root / INITIATIVE / slug / "tickets.toml"
        if not epic_toml.exists():
            print(f"Skip missing {epic_toml}", file=sys.stderr)
            continue
        entries = tomllib.loads(epic_toml.read_text(encoding="utf-8")).get("entry", [])
        for entry in entries:
            sid = entry["id"]
            ref = f"{eid}.{sid}"
            stitle = entry["title"]
            issue_title = f"[{ref}] {stitle}"
            body = f"""## Story {ref}

**Parent epic:** #{parent} ({ms_title})

### Deliverable
{entry.get("description", "")}

### Verify
{entry.get("verify", "")}

### Covers
{entry.get("covers", [])}

### Repo tickets
- `{INITIATIVE}/{slug}/tickets.toml` (entry id `{sid}`)
- Full AC: `{EPICS_MD}` (Story {ref})

### Branch
`feat-{ref}` from `development`
"""
            notes = entry.get("notes")
            if notes:
                body += "\n### Notes\n" + "\n".join(f"- {n}" for n in notes)

            url = gh(
                [
                    "issue",
                    "create",
                    "--repo",
                    REPO,
                    "--title",
                    issue_title,
                    "--body",
                    body,
                    "--label",
                    "story",
                    "--parent",
                    str(parent),
                ]
            )
            story_count += 1
            print(url)

    print(
        f"\nDone: {len(epics)} epic issues, {story_count} story sub-issues, "
        f"{len(milestone_by_epic_id)} milestones."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

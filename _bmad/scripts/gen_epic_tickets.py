"""One-off generator: epic folders from epics.md story list. Run from project root."""
from pathlib import Path

root = Path("_bmad-output/initiative-pc-part-picker-builder")

EPICS = {
    "epic-1-application-foundation": {
        "title": "Application foundation",
        "covers": [],
        "stories": [
            (
                1,
                "Monorepo scaffold and pinned toolchain",
                "pnpm workspace apps and packages with pinned Node 24.21.0 / TS 5.9.",
                "Clone, pnpm install, and TypeScript build succeed at root.",
            ),
            (
                2,
                "Local infrastructure via Docker Compose",
                "Postgres 16, RabbitMQ 4.x, Redis 7.4 via infra/compose.yaml.",
                "Compose up; services accept connections on documented ports.",
            ),
            (
                3,
                "Prisma baseline and API health check",
                "Minimal schema and Nest GET /health with DB reachability.",
                "Migrate and /health returns success when compose is up.",
            ),
            (
                4,
                "Hexagonal package boundaries",
                "domain free of framework imports; worker skeleton connects to RMQ.",
                "pnpm lint:boundaries passes; worker boots.",
            ),
            (
                5,
                "React SPA shell and API CORS baseline",
                "Vite React app displays API health.",
                "SPA loads and shows health from Nest with CORS configured.",
            ),
        ],
    },
    "epic-2-identity-session-build": {
        "title": "Identity & in-session build shell",
        "covers": ["FR-30", "FR-19"],
        "stories": [
            (
                1,
                "Register with email and password",
                "Account creation with verified=false.",
                "Register creates account and triggers verification.",
            ),
            (
                2,
                "Verify email before save eligibility",
                "Verification gate for save.",
                "Unverified cannot save; verified can.",
            ),
            (
                3,
                "Login, session, and logout",
                "httpOnly session cookies.",
                "Login establishes session; logout clears it.",
            ),
            (
                4,
                "Password reset",
                "Reset flow per FR-30.",
                "User can reset password via email link.",
            ),
            (
                5,
                "Start an in-session Build",
                "Anonymous/session build without save.",
                "Start build returns build id for session.",
            ),
        ],
    },
    "epic-3-catalog-browse-search": {
        "title": "India catalog browse & search",
        "covers": ["FR-5", "FR-6", "FR-7", "FR-27"],
        "stories": [
            (
                1,
                "Browse Parts by Slot category",
                "Slot-aligned category browse.",
                "User browses parts by slot with region filter.",
            ),
            (
                2,
                "Part detail with compatibility-oriented specs",
                "Detail shows spec attrs for compat.",
                "Part detail renders spec fields.",
            ),
            (
                3,
                "Text search Parts",
                "Search with slot context.",
                "Search returns matches; empty is not error.",
            ),
            (
                4,
                "Staleness badges on Part cards",
                "Price/availability staleness badges.",
                "Badges follow catalog-freshness thresholds.",
            ),
            (
                5,
                "Build-level stale commerce summary",
                "Summary stale counts FR-27.",
                "Build summary shows stale line count.",
            ),
        ],
    },
    "epic-4-catalog-operations": {
        "title": "Catalog operations & commerce freshness",
        "covers": ["FR-25", "FR-26", "FR-27"],
        "stories": [
            (
                1,
                "Catalog release and BuildCores spec ingest",
                "Spec ingest and release versioning.",
                "Active catalog release with spec parts.",
            ),
            (
                2,
                "Operator Part ↔ ASIN CSV import",
                "Admin CSV mapping.",
                "Operator imports ASIN mappings.",
            ),
            (
                3,
                "Commerce scrape worker job",
                "amazon.in scrape worker.",
                "Worker updates price/availability timestamps.",
            ),
            (
                4,
                "Global catalog incident banner",
                "Banner when scrape down >24h.",
                "Incident flag surfaces global banner.",
            ),
            (
                5,
                "Activate compat rules for catalog release",
                "Versioned rules per release.",
                "Compat eval uses active release rules.",
            ),
        ],
    },
    "epic-5-assemble-validate-build": {
        "title": "Assemble & validate a compatible build",
        "covers": ["FR-1", "FR-8", "FR-9", "FR-10", "FR-11"],
        "stories": [
            (
                1,
                "Set budget and over-budget acknowledgment",
                "Budget INR running total.",
                "Over budget shows acknowledgment path.",
            ),
            (
                2,
                "Declare use, workloads, and display",
                "Context for performance.",
                "Workloads and display stored on build.",
            ),
            (
                3,
                "Register owned parts and slot locks",
                "Owned inventory locks slots.",
                "Owned parts lock slots per AD-12.",
            ),
            (
                4,
                "Guided build recommendations",
                "Guided path per slot.",
                "Recommendations refresh compat each step.",
            ),
            (
                5,
                "Manual slot selection with compat preview",
                "Picker with preview eval.",
                "Invalid blocked before commit; p95 target.",
            ),
            (
                6,
                "Live build summary",
                "Summary panel FR-10.",
                "Summary updates on slot changes.",
            ),
            (
                7,
                "Server compatibility on every mutation",
                "Server-owned compat FR-11.",
                "Every mutation returns eval snapshot.",
            ),
            (
                8,
                "Substitute discovery and apply",
                "Substitute workflow FR-14-16.",
                "Unavailable parts surface substitutes.",
            ),
            (
                9,
                "Performance estimate tiers",
                "Directional tiers FR-17-18.",
                "Tiers with disclaimer; hidden when Invalid.",
            ),
        ],
    },
    "epic-6-save-finalize-builds": {
        "title": "Save, finalize & manage builds",
        "covers": ["FR-19", "FR-20", "FR-21", "FR-29"],
        "stories": [
            (
                1,
                "Save build (verified accounts only)",
                "Save gate FR-19.",
                "Verified user saves build; list shows builds.",
            ),
            (
                2,
                "List saved builds",
                "Dashboard list.",
                "List shows name status budget.",
            ),
            (
                3,
                "Open and edit saved build with re-evaluation",
                "Re-eval on open FR-20.",
                "Open triggers compat refresh.",
            ),
            (
                4,
                "Delete build and revoke share tokens",
                "Delete FR-21.",
                "Delete revokes share tokens.",
            ),
            (
                5,
                "Complete and finalize with required Slots",
                "Complete gate FR-29.",
                "Required slots enforced; Invalid blocks.",
            ),
        ],
    },
    "epic-7-share-suggest-compare": {
        "title": "Share, suggest & compare",
        "covers": ["FR-22", "FR-23", "FR-24"],
        "stories": [
            (
                1,
                "Create share link",
                "Share FR-22 Compatible/Warning only.",
                "Opaque token share link created.",
            ),
            (
                2,
                "View shared build read-only",
                "Read-only share view.",
                "Guest sees build without mutate.",
            ),
            (
                3,
                "Suggest compatible swaps on shared build",
                "Suggest FR-23.",
                "Owner accept/reject suggestions.",
            ),
            (
                4,
                "Compare two builds",
                "Compare FR-24.",
                "Side-by-side budget compat performance diffs.",
            ),
        ],
    },
    "epic-8-retailer-linkout": {
        "title": "Retailer link-out",
        "covers": ["FR-31"],
        "stories": [
            (
                1,
                "Link-out for mapped Parts",
                "amazon.in URLs.",
                "Mapped parts open retailer link.",
            ),
            (
                2,
                'Unmapped Part "find locally" UX',
                "No broken links.",
                "Unmapped shows find locally.",
            ),
            (
                3,
                "Stale price confirmation on link-out",
                "Stale confirm FR-31.",
                "Stale price prompts confirmation.",
            ),
            (
                4,
                "Export build link-out list",
                "Export link-outs.",
                "Export lists parts with link-outs.",
            ),
        ],
    },
    "epic-9-transactional-emails": {
        "title": "Transactional build emails",
        "covers": ["FR-32", "FR-33", "FR-34"],
        "stories": [
            (
                1,
                "Outbox relay and email worker plumbing",
                "AD-6 outbox + worker.",
                "Email jobs process via outbox.",
            ),
            (
                2,
                "Build summary email on finalize",
                "FR-32.",
                "Finalize triggers summary email when allowed.",
            ),
            (
                3,
                "Price and availability alert emails",
                "FR-33 batched alerts.",
                "Alerts respect 48h cap.",
            ),
            (
                4,
                "Email notification settings",
                "FR-34 toggles.",
                "User can opt out of email types.",
            ),
        ],
    },
}


def main() -> None:
    for slug, data in EPICS.items():
        folder = root / slug
        folder.mkdir(parents=True, exist_ok=True)
        epic_num = slug.split("-")[1]
        md = folder / f"{slug}.md"
        covers_yaml = ", ".join(f'"{c}"' for c in data["covers"]) or ""
        covers_front = f"[{covers_yaml}]" if data["covers"] else "[]"
        if not md.exists():
            md.write_text(
                f"""---
type: epic
title: "{data['title']}"
parent: initiative-pc-part-picker-builder
covers: {covers_front}
assignee: ""
risk: medium
---

# {data['title']}

## Description

Epic {epic_num} — see acceptance criteria in `planning-artifacts/epics.md` (Story {epic_num}.x).

## Outcome

Deliver capabilities cited in `covers` for individuals v1 India launch.

## Done when

1. All stories in this epic are done and verified per `epics.md` acceptance criteria.
2. Integrated with prerequisite epics in initiative `tickets.toml` build order.

## References

- epics — ../../planning-artifacts/epics.md
- architecture — ../architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md
- ux — ../ux-pc-part-picker-builder/EXPERIENCE.md

## Notes

- Decision: tickets generated from epics.md (2026-10-12).
""",
                encoding="utf-8",
            )

        lines = ["# Stories — build order. AC: planning-artifacts/epics.md", ""]
        prev: list[int] = []
        for sid, title, desc, verify in data["stories"]:
            lines.append("[[entry]]")
            lines.append(f"id = {sid}")
            lines.append('type = "story"')
            def q(s: str) -> str:
                if '"' in s:
                    return "'" + s.replace("'", "\\'") + "'"
                return f'"{s}"'

            lines.append(f"title = {q(title)}")
            lines.append(f"description = {q(desc)}")
            lines.append(f"verify = {q(verify)}")
            if data["covers"]:
                cov = ", ".join(f'"{c}"' for c in data["covers"])
                lines.append(f"covers = [{cov}]")
            else:
                lines.append("covers = []")
            after = prev[-1:] if prev else []
            lines.append(f"after = {after}")
            lines.append("hitl = false")
            lines.append('risk = "medium"')
            lines.append("")
            prev.append(sid)
        (folder / "tickets.toml").write_text("\n".join(lines), encoding="utf-8")

    print(f"Wrote {len(EPICS)} epic folders under {root}")


if __name__ == "__main__":
    main()

# UJ-1 — Jordan (desktop, guided + picker)

**Persona:** Jordan, 24, first desktop build, ₹1,00,000, keeps 1440p 165Hz monitor.

## Steps (POC implements 1–8; 9–11 named for v1 spine)

1. **Land** on `/` — unauthenticated. Primary CTA: **Start a build**. Secondary: Sign in.
2. **Create in-session build** — API returns build id; route to `/build/:id/context`.
3. **Set context** — Budget ₹1,00,000 (running total placeholder); Region India (fixed v1); primary use **Games**; add two game titles; display **1440p / 165Hz**; register owned **Monitor** (maps display + optional slot lock). **Continue** → guided.
4. **Guided — CPU** — Summary panel shows budget bar and **Compatibility: —** until first pick. Top recommendation card + **Choose a different part** → catalog sheet filtered to CPU slot. On select: server eval; show Invalid/Warning/Compatible on summary; block commit on Invalid with inline messages (server text).
5. **Guided — repeat** for motherboard, RAM, GPU, storage, PSU, case (cooler per required-slots). Jordan accepts most recommendations; swaps GPU once via picker.
6. **Performance** — Summary section **Performance** opens panel: tiers for declared games at 1440p; disclaimer copy (directional). Hidden if Invalid (FR-18).
7. **Climax (POC)** — Summary: **Compatible**, under budget, performance “meets target” for declared titles. POC may stop before Complete gate.
8. **Edge rehearsal** — If GPU clearance Invalid: **Complete** disabled (when shipped); guided step shows conflict; picker suggests alternates from server list only.

9. **[Post-POC]** Save prompts register/verify (FR-30).
10. **[Post-POC]** **Complete** / Finalize with required-slot checklist (FR-29).
11. **[Post-POC]** Dashboard, share link, build summary email (FR-32).

## Desktop beats

- Summary column **sticky** from step 4 onward.
- Slot checklist shows filled/empty; required slots labeled.
- Staleness badges on part lines when commerce data aged (FR-7).

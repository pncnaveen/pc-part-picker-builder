# Validation Report — PC Part Picker & Builder (password rules in EXPERIENCE.md)

- **DESIGN.md:** `_bmad-output/initiative-pc-part-picker-builder/ux-pc-part-picker-builder/DESIGN.md`
- **EXPERIENCE.md:** `_bmad-output/initiative-pc-part-picker-builder/ux-pc-part-picker-builder/EXPERIENCE.md`
- **Run at:** 2026-10-23 (password-policy slice)

## Overall verdict

Register helper text in the IA table **matches** `auth-password-policy.md` for the rules the UX companion requires in copy (8–12 characters, no spaces). Special characters and “no composition rules” need not appear in helper text per the spec. Safe to implement Story 2.1 register UI against this note plus the spec companion. Strengthen the spine with Component Patterns and State Patterns for `/register` when you run **bmad-ux Update**.

## Category verdicts (password-focused)

- Flow coverage — adequate
- Token completeness — strong (N/A)
- Component coverage — thin
- State coverage — thin
- Visual reference coverage — strong
- Bloat & overspecification — strong
- Inheritance discipline — adequate
- Shape fit — strong

## Findings by severity

### Critical (0)

### High (0)

### Medium (3)

**Component coverage** — Register form behavior not in Component Patterns (`EXPERIENCE.md` § Component Patterns).  
Fix: Row for auth form — persistent helper, server-driven errors, no weaker client validation.

**State coverage** — No register error/loading/success states (`EXPERIENCE.md` § State Patterns).  
Fix: Rows for weak password, duplicate email, success messaging.

**Flow coverage** — No protagonist flow for registration (`EXPERIENCE.md` § Key Flows).  
Fix: Optional UJ beat or thin UJ-0 for Epic 2.

### Low (2)

**Inheritance discipline** — Broken relative path to policy file in IA table.  
Fix: `../spec-pc-part-picker-builder/auth-password-policy.md`.

**Inheritance discipline** — Policy companion not in EXPERIENCE `sources:`.  
Fix: Add to frontmatter `sources:`.

## Reviewer files

- `review-rubric.md`

## Follow-up (2026-10-23)

Medium/low findings rolled into `EXPERIENCE.md` via UX Update: auth **Component Pattern**, register **State Patterns**, **UJ-0**, `sources:` + policy path, `updated` timestamp.

# Spine Pair Review — PC Part Picker & Builder (password policy slice)

**Scope:** Validate `EXPERIENCE.md` update for register password rules against `../spec-pc-part-picker-builder/auth-password-policy.md`. Full spine pair skimmed for auth gaps.

## Overall verdict

The IA row change is **aligned** with the spec companion for Story 2.1 helper text (8–12 characters, no spaces). It satisfies `auth-password-policy.md` § UX alignment for length and whitespace. The spine is **adequate** for thin POC register, not **strong** — behavioral states and a register component pattern are still missing, and the policy file path in the IA table does not resolve from the UX folder.

## 1. Flow coverage — adequate (auth slice thin)

UJ-1 step 7 mentions verify/save but no numbered **register** sub-flow with climax/failure for password validation. Acceptable for POC if `/register` is thin; password UX is not exercised in Key Flows.

### Findings

- **medium** No Key Flow beat for “Jordan registers with invalid then valid password” (`EXPERIENCE.md` Key Flows). *Fix:* Optional short UJ-1 branch or a minimal **UJ-0 — Register** flow when Epic 2 lands.

## 2. Token completeness — strong (N/A for password slice)

No password-specific DESIGN tokens required; auth forms inherit shadcn defaults.

## 3. Component coverage — thin (auth)

No **Register / auth form** row in Component Patterns; only IA helper-text note.

### Findings

- **medium** Register form behavior unspecified (helper placement, inline errors from API `code`/`message`, no client-side rule weakening). *Fix:* Add Component Patterns row for **Auth form (register/login)** referencing spec companion.

## 4. State coverage — thin (auth)

State Patterns cover unauthenticated save modal but not register field errors (weak password, duplicate email, network).

### Findings

- **medium** Missing states: password validation error (400), duplicate email (409), submit loading/success (“check your email”). *Fix:* Add rows under State Patterns for `/register`.

## 5. Visual reference coverage — strong

No register mock required for this validation; spine-only auth is declared Thin POC.

## 6. Bloat & overspecification — strong

IA Purpose column is dense but load-bearing; no overspec on password rules.

## 7. Inheritance discipline — adequate

Helper text matches spec length (8–12) and whitespace ban. Spec allows specials without advertising them in helper text — consistent with companion § UX alignment.

### Findings

- **low** IA cites ``auth-password-policy.md`` without path; from `ux-pc-part-picker-builder/` the resolvable path is `../spec-pc-part-picker-builder/auth-password-policy.md`. *Fix:* Use relative path or add companion to `sources:` frontmatter.
- **low** `sources:` lists `spec-pc-part-picker-builder.md` but not `auth-password-policy.md` (listed in spec `companions:`). *Fix:* Add adopted companion to EXPERIENCE `sources:` when validating auth behavior.

## 8. Shape fit — strong

Required EXPERIENCE sections present; password note correctly lives in IA not Voice and Tone (server message discipline already in Voice § Invalid).

## Mechanical notes

- `updated:` frontmatter still `2026-10-12`; password change should bump `updated` on next UX Update/Finalize.
- `.working/ia-draft-desktop-poc.md` Auth row lacks helper text — non-authoritative; spine wins.

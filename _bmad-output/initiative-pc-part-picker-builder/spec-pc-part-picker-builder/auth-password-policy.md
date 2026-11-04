# Auth password policy (v1)

Implements FR-30 registration and password reset flows. **Server enforcement** lives in `packages/domain`; API and SPA must not weaken these rules.

## Registration and password change

| Rule | Requirement |
|------|-------------|
| Length | **8–12** characters inclusive |
| Empty | Rejected |
| Whitespace | **Not allowed** anywhere (space, tab, newline, etc.) |
| Characters | May include digits `0–9`, letters `A–Z` / `a–z`, and **special characters** |
| Composition | **No** required mix of uppercase, lowercase, or digit |

Passwords are stored **hashed** only; never log or return plain passwords in API responses.

## Email (registration)

- **Normalize** before uniqueness check and storage: trim surrounding whitespace; lowercase the full address.
- Reject empty or invalid format per domain validation (authoritative on the server).

## UX alignment

Register and reset forms should surface the length and no-whitespace rules in helper text; error messages should match server `code` / `message` without softening validation.

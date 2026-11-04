---
id: 6
type: story
title: "Centralize public ID generation (ULID) in the API"
parent: epic-2-identity-session-build
covers: [NFR-9]
after: [1]
tracker_id: "109"
remote: "https://github.com/pncnaveen/pc-part-picker-builder/issues/109"
refined: true
hitl: false
risk: low
---

# Centralize public ID generation (ULID) in the API

## Description

The API assigns public ULIDs for Account, outbox rows, verification tokens, and (in Story 2.5) Build ids (AD-15, NFR-9). This story introduces one injectable port and ULID adapter in `apps/api`, registers it application-wide, and refactors register so feature code never imports `ulid` directly. HTTP contracts and id string format stay unchanged.

## Acceptance Criteria

1. **Public ID port is registered once**
   **Given** the Nest API application boots
   **When** a feature module needs a new public id
   **Then** it injects a shared port token (not `ulid` from npm)
   **And** the default adapter returns a 26-character Crockford Base32 ULID string

2. **Register uses the port for all public ids**
   **Given** a valid register request
   **When** `RegisterService` runs
   **Then** account id, verification token id, and outbox id are each obtained from the port
   **And** the same three ids are persisted and returned as today (no new fields, no format change)

3. **No direct `ulid()` in feature application code**
   **Given** the `apps/api/src` tree under feature modules and application services
   **When** searching for `ulid` usage
   **Then** only the infrastructure adapter (and its module wiring) references the `ulid` package
   **And** controllers and `register.service` do not import `ulid`

4. **Unit tests can fix ids**
   **Given** `RegisterService` tests with a mock port returning predetermined strings
   **When** register succeeds
   **Then** assertions can match those ids in the response body and port persistence input
   **And** tests do not patch the `ulid` module

5. **Regression checks pass**
   **Given** the workspace after this change
   **When** running API register unit tests and existing domain/shared tests touched by register
   **Then** all pass without weakening prior register acceptance behavior

## Boundaries

- Must not change: register HTTP request/response shapes, ULID string format on the wire, password/email domain rules, or Prisma schema.
- Out of scope: worker id generation, `packages/domain`, changing id type away from ULID.

## References

- parent — _bmad-output/initiative-pc-part-picker-builder/epic-2-identity-session-build/epic-2-identity-session-build.md
- architecture — _bmad-output/initiative-pc-part-picker-builder/architecture-pc-part-picker-builder/architecture-pc-part-picker-builder.md, AD-15
- epics — _bmad-output/planning-artifacts/epics.md, Story 2.6

## Notes

- Decision: Story 2.5 depends on 2.6 (`after = [4, 6]`) so in-session Build ids use the same port (2026-10-26).

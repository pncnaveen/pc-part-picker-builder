# Glossary — PC Part Picker & Builder (v1)

- **Build** — Configured **Slots** with selected **Parts**, budget, use context, and compatibility/performance state; one primary Build per save unless duplicated.
- **Slot** — Required or optional component category (e.g., GPU, motherboard); zero or one Part per Slot in v1.
- **Part** — Catalog SKU with specs, price, availability, metadata.
- **Catalog** — Maintained Parts and spec attributes for the launch **Region**.
- **Region** — v1 geographic/commercial market for catalog, pricing, availability. **Launch: India (INR).**
- **Required Slot** — Must have a Part or owned mapping before **Complete** (see `required-slots.md`).
- **Optional Slot** — May stay empty without blocking **Complete** (e.g., discrete GPU when iGPU suffices).
- **Owned inventory** — Parts the user already owns; may pre-fill Slots and constrain upgrades.
- **Compatibility engine** — Rules for socket, chipset, power, clearance, display interface, etc.
- **Compatibility status** — **Compatible**, **Warning** (non-blocking), or **Invalid** (blocks complete/save/share).
- **Substitute** — Alternate Part when unavailable or user-requested; must pass material-spec rules (`substitute-matrix.md`).
- **Performance estimate** — Directional experience for declared games/apps and display—not a guarantee.
- **Stale price / Stale availability** — Data older than thresholds in `catalog-freshness.md`.
- **Share link** — Unguessable URL for view and opt-in suggest access without account credentials.
- **Account** — Authenticated identity required to persist Builds across sessions.
- **Finalized build** — Saved Build marked **Complete** per FR-29 with status Compatible or Warning (not Invalid).
- **Build summary email** — Transactional email on finalize: build id, deep link, parts, prices, availability, staleness; no retailer URLs.
- **Build alert email** — Transactional email when price or availability changes on a Finalized build since last alert (batched).

# Required and optional slots (v1, India launch)

Implements FR-29.

## Required Slots (must be filled or owned-mapped before **Complete**)

CPU, CPU cooler, motherboard, memory (RAM), storage (≥1 device), case, power supply (PSU).

## Optional Slots (v1)

Discrete GPU, additional storage, monitor (owned/display context), peripherals.

Not v1 Slots: optical drives, sound cards.

## Complete rules (with FR-29)

- Every Required Slot filled or mapped from Owned inventory.
- Compatibility status not **Invalid** (Warning allowed).
- Over-budget **Complete** only after explicit acknowledgment recorded on the Build (FR-1).
- UI shows Required Slot checklist; missing slots block **Complete** with explicit list.
- Empty discrete GPU allowed; Performance estimate may show reduced confidence or “GPU required for declared workloads” when user declared GPU-bound games without adequate GPU/iGPU.

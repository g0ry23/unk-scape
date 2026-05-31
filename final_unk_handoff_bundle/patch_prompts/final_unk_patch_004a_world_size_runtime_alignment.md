# FINAL_UNK_PATCH_004A — World Size Runtime Alignment

> **INERT DOCUMENTATION — Do not execute without owner approval.**
> This patch prompt must not be applied until the owner explicitly approves **FINAL_UNK_PATCH_004A** by exact ID in the current chat session.

---

## Patch ID
`FINAL_UNK_PATCH_004A_world_size_runtime_alignment`

## Status
`planned`

## Risk Level
**Medium-High** — This patch reads and validates the live runtime world state, corrects any legacy tile dimensions that do not match the official 16,000 x 12,800 spec, and aligns all world-boundary clamping to the new constants. Incorrect application could break player coordinate clamping or chunk boundary calculations.

## Dependencies
- FINAL_UNK_PATCH_004 must be complete and verified (world constants, layers, math helpers defined)
- No active world streaming or chunk generation changes pending
- Owner must confirm current in-memory world size before this patch touches anything

---

## Purpose
After PATCH_004 defines the canonical constants, this patch confirms and aligns the **runtime engine** so that:

1. The engine actually uses `WORLD_TILE_WIDTH = 16000` and `WORLD_TILE_HEIGHT = 12800`
2. Any legacy hardcoded values (e.g. 8000 x 8000 or other test sizes) are replaced
3. Player spawn clamping and boundary enforcement use the new values
4. No existing save data (unkscape:saves, unkscape:worlds) is wiped or corrupted

---

## Protected Rules (Must Survive This Patch)
- `window.UNKSCAPE` namespace must be preserved exactly
- `unkscape:saves` localStorage key must not be renamed or cleared
- `unkscape:worlds` localStorage key must not be renamed or cleared
- `index.html` must not be structurally changed (only version bump allowed if JS file changed)
- No gameplay mechanics (combat, crafting, resource decay) may be altered
- No save/load logic may be altered beyond boundary clamping corrections
- Player inventory, bank, XP, and skill data must be fully preserved

---

## Scope and Target Outputs

### Runtime alignment tasks:
1. Audit all JS files for hardcoded world-size numbers that differ from 16,000 x 12,800
2. Replace found legacy values with references to the canonical constants from PATCH_004
3. Confirm world boundary clamping uses correct tile limits
4. Confirm player spawn default falls within the 16,000 x 12,800 field
5. Confirm chunk index math does not overflow or underflow at world edges
6. Add a one-time boot diagnostic log: `[UNKSCAPE] World size aligned: 16000x12800`

### Files likely affected (audit first, confirm before editing):
- Any engine or world module that hardcodes world dimensions
- Any chunk streaming module that uses world size for boundary math
- Player spawn/respawn logic if it references hardcoded coordinates

### Validation test:
- Boot game in browser
- Open console
- Confirm: `[UNKSCAPE] World size aligned: 16000x12800` appears
- Confirm: player position does not exceed tile (16000, 12800) or go below (0, 0)
- Confirm: unkscape:saves and unkscape:worlds keys still present

---

## Stop Conditions (Abort Immediately If Any Are True)
1. `window.UNKSCAPE` becomes undefined or null after patch
2. `unkscape:saves` key is missing from localStorage after patch
3. `unkscape:worlds` key is missing from localStorage after patch
4. Player can no longer move or spawn
5. The game fails to boot (Boot Guard triggers)
6. Any previously working chunk fails to load
7. Console shows TypeError or ReferenceError introduced by this patch
8. Save data is corrupted or missing after patch

---

## Required Report Format (After Execution — When Approved)
```
PATCH_004A EXECUTION REPORT
============================
Files audited: [list all files checked for legacy world size values]
Files modified:
  - [list each file changed]
Legacy values replaced: [list each old value and what it was replaced with]
Boot diagnostic confirmed: [yes/no — "[UNKSCAPE] World size aligned: 16000x12800"]
Player boundary clamping verified: [yes/no]
window.UNKSCAPE preserved: [yes/no]
unkscape:saves preserved: [yes/no]
unkscape:worlds preserved: [yes/no]
index.html changed: [yes/no — if yes, only version bump]
Boot test result: [pass/fail]
Console errors introduced: [none / list any]
Stop conditions triggered: [none / describe any]
Owner approval to proceed to PATCH_005: [waiting]
```

---

## Notes
- This patch must only change values that differ from the official blueprint spec
- If the runtime already uses 16,000 x 12,800 exactly, this patch is a no-op (confirm and log only)
- Do not change tile scale, chunk size, or any game mechanic while doing the alignment
- The world resize to 16,000 x 12,800 was previously completed — this patch validates and hardens it

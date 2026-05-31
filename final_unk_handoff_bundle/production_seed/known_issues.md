# UNKSCAPE — Known Issues
## production_seed/known_issues.md

---

## Issue Format

Each issue includes: ID, severity, status, description, root cause, affected files, fix approach.

Severity levels: critical / high / medium / low
Status: open / in_progress / resolved / wont_fix

---

## Open Issues

### ISSUE-001 — Fence Gate Collision (Medium)

**Status:** open
**Severity:** medium
**Affected files:** client/world/mmoWorld.js (collision), town fence data
**Description:** All 4 town gates are impassable. Player radius (16px) bleeds onto adjacent fence tiles when approaching a 1-tile-wide opening, making it impossible to enter through the gate.
**Root cause:** Gate opening is 1 tile wide (32px). Player collision radius (16px) overlaps adjacent fence tiles, treating them as solid.
**Fix approach:** Either widen gates to 2 tiles, or implement a gate-specific collision override that ignores player radius bleed for gate tile adjacency.
**Patch:** Queued for FINAL_UNK_PATCH_014 or a dedicated bugfix patch.
**Owner approval needed before fix:** Yes

---

### ISSUE-002 — Legacy Saves Out of Bounds (Low)

**Status:** open
**Severity:** low
**Affected files:** localStorage (unkscape:saves)
**Description:** Two legacy saves (SurvivorTWO and SurvivorTHREEDELETE) have pre-resize coordinates from the old 64,000x64,000 coordinate system. These saves will place the player out of bounds if loaded.
**Root cause:** Saves were created before the world resize. Not a code bug — legacy save data only.
**Fix approach:** die() logic should already trigger respawn to center if player is out of bounds. No code fix needed — these saves will auto-correct on load.
**Owner approval needed before fix:** No fix needed unless respawn logic is confirmed broken.

---

### ISSUE-003 — Black Sky (Medium)

**Status:** open
**Severity:** medium
**Affected files:** render_3d.js or sky rendering
**Description:** Sky renders as pure black. No sky color, no gradient, no atmosphere.
**Root cause:** Sky background not implemented yet (pre-Batch B).
**Fix approach:** Add sky color/gradient render call in render_3d.js. See game_bible_seed/010_continental_horizon_rendering.md for direction.
**Patch:** FINAL_UNK_PATCH_013 (terrain/horizon rendering framework)

---

### ISSUE-004 — Grey Terrain (Medium)

**Status:** open
**Severity:** medium
**Affected files:** tiles.js or render_3d.js tile color assignment
**Description:** All terrain tiles render as a single grey color (stonepath grey). Grass, biome colors, and terrain variation are not present.
**Root cause:** Tile color assignment not implemented yet (pre-Batch B).
**Fix approach:** Assign biome-appropriate colors to terrain tiles in render_3d.js tile rendering.
**Patch:** FINAL_UNK_PATCH_013

---

### ISSUE-005 — Floating Resources/Props (Medium)

**Status:** open
**Severity:** medium
**Affected files:** render_3d.js prop Y-position calculation
**Description:** Trees, rocks, bushes and other props float above the terrain surface. They render at incorrect Y-position (in the air, not on the ground).
**Root cause:** 3D prop Y-position not correctly calculated relative to terrain height in render_3d.js.
**Fix approach:** Fix prop Y-position to sit on terrain surface.
**Patch:** FINAL_UNK_PATCH_013

---

*New issues will be added here as discovered.*

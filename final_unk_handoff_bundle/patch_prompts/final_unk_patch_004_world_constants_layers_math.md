# FINAL_UNK_PATCH_004 — World Constants, Layers & Math

> **INERT DOCUMENTATION — Do not execute without owner approval.**
> This patch prompt must not be applied until the owner explicitly approves **FINAL_UNK_PATCH_004** by exact ID in the current chat session.

---

## Patch ID
`FINAL_UNK_PATCH_004_world_constants_layers_math`

## Status
`planned`

## Risk Level
**Medium** — Introduces new constants and layer math into engine files. Incorrectly placed values could break world generation, camera, or coordinate lookups. Must be applied carefully before any world or map changes.

## Dependencies
- FINAL_UNK_PATCH_001 must be complete (repo audit, Bible docs, production tracking in place)
- FINAL_UNK_PATCH_002 must be complete (release gating framework in place)
- FINAL_UNK_PATCH_003 must be complete (gameplay style framework in place)
- No active world or chunk generation changes pending

---

## Purpose
Establish a single authoritative source of world constants and layer math inside the runtime codebase so that all future patches reference the same values.

This prevents drift between patches where one file assumes 8,000 tiles wide and another assumes 16,000 tiles wide.

---

## Protected Rules (Must Survive This Patch)
- `window.UNKSCAPE` namespace must be preserved exactly
- `unkscape:saves` localStorage key must not be renamed or cleared
- `unkscape:worlds` localStorage key must not be renamed or cleared
- `index.html` must not be structurally changed (only version bump allowed if JS file changed)
- No gameplay mechanics (combat, crafting, resource decay) may be altered
- No save/load logic may be altered

---

## Scope and Target Outputs

### Constants to define (in a canonical constants module or within window.UNKSCAPE):
```javascript
WORLD_TILE_WIDTH        = 16000
WORLD_TILE_HEIGHT       = 12800
TILE_METER_SCALE        = 2          // meters per tile
WORLD_METERS_WIDTH      = 32000      // 32 km
WORLD_METERS_HEIGHT     = 25600      // 25.6 km
CHUNK_SIZE              = 64         // tiles per gameplay chunk (64x64)
MACRO_REGION_SIZE       = 128        // tiles per macro region (128x128)
CHUNKS_WIDE             = 250        // 16000 / 64
CHUNKS_TALL             = 200        // 12800 / 64
MACRO_REGIONS_WIDE      = 125        // 16000 / 128
MACRO_REGIONS_TALL      = 100        // 12800 / 128
WORLD_SPAWN_X           = 8000       // center-ish default spawn X
WORLD_SPAWN_Y           = 6400       // center-ish default spawn Y
```

### Layer order to define (render stack, bottom to top):
```
layer_sky_horizon
layer_far_proxy (distant mountains, trees, ocean/land silhouettes)
layer_mid_visual (biome color masses, haze, cloud silhouettes)
layer_terrain_base
layer_terrain_details (rocks, cliffs, terrain variation)
layer_resources (trees, ore outcrops, water features)
layer_structures (buildings, ruins, dungeon entries)
layer_npcs
layer_player
layer_effects (particles, weather, magic)
layer_ui_world (floating nameplates, health bars)
layer_ui_screen (HUD, menus, overlays)
```

### Helper math functions to define:
- `tileToWorld(tx, ty)` — convert tile coords to world-space units
- `worldToTile(wx, wy)` — convert world units to tile coords
- `tileToChunk(tx, ty)` — return chunk index for a tile position
- `chunkToTile(cx, cy)` — return tile origin of a chunk
- `tileToMacroRegion(tx, ty)` — return macro region index
- `distanceTiles(ax, ay, bx, by)` — tile-space euclidean distance

---

## Stop Conditions (Abort Immediately If Any Are True)
1. `window.UNKSCAPE` becomes undefined or null after patch
2. `unkscape:saves` key is missing from localStorage after patch
3. `unkscape:worlds` key is missing from localStorage after patch
4. Any existing gameplay mechanic (combat, movement, crafting, resource gathering) stops functioning
5. The game fails to boot (Boot Guard triggers)
6. Any existing world or chunk already in memory fails to load
7. Console shows any new TypeError or ReferenceError introduced by this patch

---

## Required Report Format (After Execution — When Approved)
```
PATCH_004 EXECUTION REPORT
===========================
Files modified:
  - [list each file changed]
Files created:
  - [list each new file]
Constants defined: [list all world constants added]
Layer stack defined: [yes/no]
Math helpers defined: [list helper functions added]
window.UNKSCAPE preserved: [yes/no]
unkscape:saves preserved: [yes/no]
unkscape:worlds preserved: [yes/no]
index.html changed: [yes/no — if yes, only version bump]
Boot test result: [pass/fail]
Console errors introduced: [none / list any]
Stop conditions triggered: [none / describe any]
Owner approval to proceed to PATCH_004A: [waiting]
```

---

## Notes
- Constants must use the official values from the master blueprint: 16,000 x 12,800 tiles, ~2 meters per tile
- Do not use legacy or placeholder values (e.g., 8,000 x 8,000 from early testing)
- Constants should be namespaced under `window.UNKSCAPE.WORLD` or equivalent canonical location
- Layer names are canonical — do not rename after this patch lands
- This patch is a pure metadata/constant addition — it should not visually change gameplay yet

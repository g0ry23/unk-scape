# FINAL_UNK_PATCH_013 — Terrain & Horizon Rendering Framework

> **INERT DOCUMENTATION — Do not execute without owner approval.**
> This patch prompt must not be applied until the owner explicitly approves **FINAL_UNK_PATCH_013** by exact ID in the current chat session.

---

## Patch ID
`FINAL_UNK_PATCH_013_terrain_horizon_rendering_framework`

## Status
`planned`

## Risk Level
**High** — Directly modifies the render pipeline. Incorrectly applied this can break 3D world rendering entirely, cause black screens, or destroy the gameplay viewport. Must test render output visually after every change. Must have a clean rollback path.

## Dependencies
- FINAL_UNK_PATCH_012 complete (animation/audio hooks in place)
- All previous patches complete and verified
- 3D rendering engine is functional (world renders, player visible, terrain visible)
- Owner must confirm: current render pipeline structure before this patch touches it

---

## Purpose
Eliminate the "floating terrain slab in a void" appearance that violates the UNKSCAPE No Floating Block Rule.

Implement a layered rendering strategy that makes the world feel grounded, continuous, and atmospheric — even though the full 16,000 x 12,800 tile world is never rendered in full detail.

---

## Protected Rules (Must Survive This Patch)
- `window.UNKSCAPE` namespace must be preserved exactly
- `unkscape:saves` localStorage key must not be renamed or cleared
- `unkscape:worlds` localStorage key must not be renamed or cleared
- `index.html` must not be structurally changed (only version bump if JS changed)
- No gameplay mechanics (combat, crafting, resource decay) may be altered
- No save/load logic may be altered
- Existing player movement and collision must not be broken
- Do not render the full 16,000 x 12,800 world in detail — use ring-based rendering

---

## Scope and Target Outputs

### Rendering ring strategy (from master blueprint):
```
near_gameplay_ring:
  - Full detail terrain, resources, NPCs, player
  - Chunk streaming: load/unload 64x64 tile chunks as player moves
  - Collision and interaction active

mid_visual_ring:
  - Reduced detail terrain mesh
  - Biome color masses
  - No collision or interaction

far_proxy_ring:
  - Distant mountains as static mesh or billboard
  - Far trees as billboard clusters
  - Ocean/land continuation silhouettes
  - Horizon silhouettes

sky_fog_horizon_layer:
  - Sky gradient (dawn/day/dusk/night)
  - Atmospheric haze / distance fog
  - Cloud or smoke silhouettes
  - Horizon color and glow
```

### Terrain skirt:
- Terrain edges must not visibly end in a cliff-edge over void
- Add terrain skirt mesh that extends below and around the near gameplay ring
- Skirt color/texture should blend with mid visual ring

### Fog and distance fade:
- Far geometry fades into fog/haze color before disappearing
- Fog density tied to distance from player
- Fog color matches sky conditions (dawn pink, day blue-gray, dusk orange, night dark blue)

### No-render rules (enforce strictly):
- Do not render full 16,000 x 12,800 world in detail
- Do not create a single giant map JSON or terrain mesh
- Do not globally spawn all resources or NPCs
- Use coordinate foundation and chunk streaming only

### Minimum visual targets after patch:
1. Terrain does not appear to float over a black void
2. Horizon has visible distant terrain silhouette or fog-filled distance
3. Sky gradient visible above gameplay area
4. No sharp terrain edges exposed at gameplay boundaries

---

## Stop Conditions (Abort Immediately If Any Are True)
1. `window.UNKSCAPE` becomes undefined or null after patch
2. `unkscape:saves` key is missing from localStorage after patch
3. `unkscape:worlds` key is missing from localStorage after patch
4. 3D rendering breaks entirely (black screen or Boot Guard)
5. Player movement breaks
6. Frame rate drops to unplayable level
7. Console shows TypeError or ReferenceError introduced by this patch
8. Chunk streaming stops loading terrain as player moves

---

## Required Report Format (After Execution — When Approved)
```
PATCH_013 EXECUTION REPORT
===========================
Files modified:
  - [list each render file changed]
Files created:
  - [list any new render files]
Near gameplay ring rendering: [pass/fail]
Mid visual ring rendering: [pass/fail]
Far proxy ring rendering: [pass/fail]
Sky/fog/horizon layer: [pass/fail]
Terrain skirt visible: [yes/no]
No floating terrain slab: [confirmed yes/no]
Player movement preserved: [yes/no]
Chunk streaming functional: [yes/no]
window.UNKSCAPE preserved: [yes/no]
unkscape:saves preserved: [yes/no]
unkscape:worlds preserved: [yes/no]
index.html changed: [yes/no — if yes, only version bump]
Boot test result: [pass/fail]
Console errors introduced: [none / list any]
Stop conditions triggered: [none / describe any]
Screenshot of render output after patch: [attach or describe]
Owner approval to proceed to PATCH_014: [waiting]
```

---

## Notes
- This patch is the most visually impactful and highest-risk in the sequence
- Take a screenshot before and after applying to compare
- If rendering breaks, rollback immediately using the rollback plan
- The goal is: game looks like it exists in a world, not on a floating platform
- Do not aim for photorealism — low-poly retro fantasy style must be preserved
- This patch establishes the render ring framework — final art quality comes in later passes

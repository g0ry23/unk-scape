# UNKSCAPE Implementation Order

## Purpose

This document defines the official patch execution order for the UNKSCAPE Final UNK Handoff Bundle.

Claude must follow this order unless the project owner explicitly approves a change.

---

## Execution Mode

Patches are executed one at a time.

After each patch:

1. Review changed files.

2. Check script load order.

3. Confirm no save keys changed.

4. Confirm namespace consistency.

5. Run smoke tests.

6. Update production tracker.

7. Wait for approval before continuing.

---

## Official Patch Order

## Phase 0 — Foundation Audit And Documentation

### 1. FINAL_UNK_PATCH_001_repo_audit_bible_docs_production_tracking

Purpose:

- audit current repo

- confirm namespace/save/file structure

- create portable Game Bible docs

- create production tracking docs

Risk:

```text

low

```

Status: pending

---

## Phase 1 — World And Navigation Fixes

### 2. FINAL_UNK_PATCH_002_world_resize_coordinate_system

Purpose:

- lock official world dimensions to 16000x12800

- fix all coordinate references

- fix spawn positions

- fix save/load for new coords

Risk:

```text

medium

```

Status: pending

---

### 3. FINAL_UNK_PATCH_003_town_gate_and_fence_collision_fix

Purpose:

- fix central town fence gates so player can enter

- gates are currently 1 tile wide — player radius bleeds onto fence

- widen gates or reduce fence collision to allow entry

Risk:

```text

low-medium

```

Status: pending

---

### 4. FINAL_UNK_PATCH_004_spawn_point_and_fast_travel

Purpose:

- fix all class spawn positions relative to new 16000x12800 world

- add working loadstone/fast travel to town center

- add spawn point set mechanic

Risk:

```text

low

```

Status: pending

---

## Phase 2 — Visual Fixes (Batch B)

### 5. FINAL_UNK_PATCH_005_sky_color_skybox

Purpose:

- replace black sky with proper sky color

- add skybox or sky gradient to render_3d.js

Risk:

```text

low

```

Status: pending

---

### 6. FINAL_UNK_PATCH_006_terrain_tile_colors

Purpose:

- fix grey terrain — tiles defaulting to stonepath grey

- restore grass/biome colors

- fix getTileType returning wrong type

Risk:

```text

low-medium

```

Status: pending

---

### 7. FINAL_UNK_PATCH_007_floating_props_y_position

Purpose:

- fix trees/rocks/bushes floating above ground

- fix 3D prop Y-position in render_3d.js

- ensure props sit on terrain surface

Risk:

```text

low

```

Status: pending

---

## Phase 3 — Mob Rendering

### 8. FINAL_UNK_PATCH_008_mob_3d_meshes

Purpose:

- add basic 3D mob meshes so 129 spawned enemies render visually

- colored shapes per mob type (different colors = different enemy types)

- player can see and attack mobs

Risk:

```text

medium

```

Status: pending

---

## Phase 4 — Systems Diagnosis And Fixes

### 9. FINAL_UNK_PATCH_009_systems_diagnosis_report

Purpose:

- diagnose: equipment slots (5), bag space, bank space, foraging, cooking, survival, crafting

- for each: does the system exist and not show, or does it need to be built?

- report only — no fixes in this patch

Risk:

```text

none (read-only diagnosis)

```

Status: pending

---

### 10. FINAL_UNK_PATCH_010_equipment_slots

Purpose:

- fix or build 5-slot equipment panel (head, weapon, offhand, body, tool)

- based on diagnosis from patch 009

Risk:

```text

medium

```

Status: pending

---

### 11. FINAL_UNK_PATCH_011_bag_space_inventory

Purpose:

- fix or build bag space / inventory panel

- based on diagnosis from patch 009

Risk:

```text

medium

```

Status: pending

---

### 12. FINAL_UNK_PATCH_012_bank_space

Purpose:

- fix or build bank space panel

- based on diagnosis from patch 009

Risk:

```text

medium

```

Status: pending

---

### 13. FINAL_UNK_PATCH_013_foraging_system

Purpose:

- fix foraging skill so it levels from berries/herbs

- same resource-node pattern as woodcutting

- based on diagnosis from patch 009

Risk:

```text

low-medium

```

Status: pending

---

### 14. FINAL_UNK_PATCH_014_cooking_system

Purpose:

- fix or build cooking system

- based on diagnosis from patch 009

Risk:

```text

medium

```

Status: pending

---

## Notes

- Do not skip patches or reorder without explicit owner approval.

- Each patch must confirm boot before the next patch begins.

- Gameplay mechanics (resource decay, combat formulas, crafting recipes) are not touched until Phase 4 systems are stable.

- Mobs batch is separate and comes after Phase 2 visual fixes are confirmed.

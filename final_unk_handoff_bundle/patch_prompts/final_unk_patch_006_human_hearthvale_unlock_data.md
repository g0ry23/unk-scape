# FINAL_UNK_PATCH_006 — Human Hearthvale Unlock Data

> **INERT DOCUMENTATION — Do not execute without owner approval.**
> This patch prompt must not be applied until the owner explicitly approves **FINAL_UNK_PATCH_006** by exact ID in the current chat session.

---

## Patch ID
`FINAL_UNK_PATCH_006_human_hearthvale_unlock_data`

## Status
`planned`

## Risk Level
**Medium** — This patch wires Alpha 0.1 content unlock data (race, realm, towns, dungeon, bosses) into the live runtime. Incorrect application could break character creation, spawn logic, or the zone-entry system. Must be tested with a fresh character and an existing saved character.

## Dependencies
- FINAL_UNK_PATCH_005 complete (canon stub registries defined)
- Character creation system is functional and accessible
- World spawn and zone-entry systems are functional
- No active character creation or spawn system refactors pending

---

## Purpose
Mark the Human race, Hearthvale Fields realm, Oathstead Village, Highmere Keep, Harvest Hollow dungeon, and both bosses as **fully unlocked and playable** in the runtime, so new characters are created in this content and existing players can access it.

This patch should be purely a data/state change to existing unlock systems. It should not create new gameplay logic.

---

## Protected Rules (Must Survive This Patch)
- `window.UNKSCAPE` namespace must be preserved exactly
- `unkscape:saves` localStorage key must not be renamed or cleared
- `unkscape:worlds` localStorage key must not be renamed or cleared
- `index.html` must not be structurally changed (only version bump if JS changed)
- No gameplay mechanics (combat, crafting, resource decay) may be altered
- No save/load logic may be altered
- Existing saved characters must still load correctly

---

## Scope and Target Outputs

### Unlock data to apply to runtime registry:
```
race_human              → state: alpha (playable)
realm_hearthvale_fields → state: alpha (accessible)
town_oathstead_village  → state: alpha (accessible)
town_highmere_keep      → state: alpha (accessible)
dungeon_harvest_hollow  → state: alpha (accessible)
boss_marik_redharrow    → state: alpha (spawnable)
boss_cassian_goldseal   → state: alpha (spawnable)
```

### All other content must remain locked:
```
All non-human races       → state: locked
All non-Hearthvale realms → state: locked
All non-Hearthvale towns  → state: locked
All non-Hearthvale dungeons → state: locked
All non-Hearthvale bosses → state: locked
```

### New character flow after patch:
1. Player creates new character
2. Race selection shows Human as available, all others locked/future
3. Player spawns in Hearthvale Fields
4. Player can access Oathstead Village and Highmere Keep
5. Player can access Harvest Hollow dungeon entry
6. Boss encounters available within dungeon

### Existing character flow after patch:
1. Existing save loads normally
2. Character position preserved
3. Skills, inventory, bank preserved
4. If character was in a valid zone, they remain there
5. No data wiped or reset

---

## Stop Conditions (Abort Immediately If Any Are True)
1. `window.UNKSCAPE` becomes undefined or null after patch
2. `unkscape:saves` key is missing from localStorage after patch
3. `unkscape:worlds` key is missing from localStorage after patch
4. Existing saved character fails to load
5. New character cannot be created as Human
6. New character does not spawn in Hearthvale Fields
7. The game fails to boot (Boot Guard triggers)
8. Any previously unlocked content becomes inaccessible

---

## Required Report Format (After Execution — When Approved)
```
PATCH_006 EXECUTION REPORT
===========================
Files modified:
  - [list each file changed]
Unlock state applied: [list all IDs set to alpha]
Locked state confirmed: [yes/no — all non-alpha content still locked]
New character test: [pass/fail — Human, spawns in Hearthvale]
Existing save load test: [pass/fail — character, skills, inventory intact]
window.UNKSCAPE preserved: [yes/no]
unkscape:saves preserved: [yes/no]
unkscape:worlds preserved: [yes/no]
index.html changed: [yes/no — if yes, only version bump]
Boot test result: [pass/fail]
Console errors introduced: [none / list any]
Stop conditions triggered: [none / describe any]
Owner approval to proceed to PATCH_007: [waiting]
```

---

## Notes
- This patch is a data state change only — it does not build town layouts, NPC placements, or dungeon geometry
- Town and dungeon layout work is handled by later patches
- The goal here is: when the player creates a Human character, the correct content is accessible
- Do not invent quest data, NPC data, or lore for this patch — those come in later patches

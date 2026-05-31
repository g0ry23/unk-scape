# FINAL_UNK_PATCH_007 — Core Skill Starter Access

> **INERT DOCUMENTATION — Do not execute without owner approval.**
> This patch prompt must not be applied until the owner explicitly approves **FINAL_UNK_PATCH_007** by exact ID in the current chat session.

---

## Patch ID
`FINAL_UNK_PATCH_007_core_skill_starter_access`

## Status
`planned`

## Risk Level
**Medium** — Modifies skill availability data and potentially skill UI display. Incorrectly applied this could hide skills the player already has XP in, or expose skills that should be locked. Must test with both new and existing characters.

## Dependencies
- FINAL_UNK_PATCH_005 complete (canon skill registry defined)
- FINAL_UNK_PATCH_006 complete (Human/Hearthvale unlock data applied)
- Skill system is functional (skills panel renders, XP tracking works)
- No active skill system refactors pending

---

## Purpose
Ensure all 15 core skills are:
1. Accessible to a fresh Human character starting in Hearthvale Fields
2. Visible in the skills panel from the start (not hidden behind level gates)
3. Beginner-friendly — no harsh early lock requirements
4. Correctly initialized to level 1 / 0 XP on new character creation

This patch does **not** add new skill mechanics. It only ensures that the existing 15 skills are properly unlocked and initialized for Alpha 0.1 starter characters.

---

## Protected Rules (Must Survive This Patch)
- `window.UNKSCAPE` namespace must be preserved exactly
- `unkscape:saves` localStorage key must not be renamed or cleared
- `unkscape:worlds` localStorage key must not be renamed or cleared
- `index.html` must not be structurally changed (only version bump if JS changed)
- No gameplay mechanics (combat formulas, crafting recipes, resource decay) may be altered
- No save/load logic may be altered
- Existing skill XP and levels in saved characters must be fully preserved

---

## Scope and Target Outputs

### All 15 skills must be starter-accessible:
```
combat                   → beginner accessible, Lv 1 start
mining                   → beginner accessible, Lv 1 start
smithing                 → beginner accessible, Lv 1 start
woodcutting              → beginner accessible, Lv 1 start
fishing                  → beginner accessible, Lv 1 start
cooking                  → beginner accessible, Lv 1 start
herbalism                → beginner accessible, Lv 1 start
alchemy                  → beginner accessible, Lv 1 start
crafting                 → beginner accessible, Lv 1 start
farming                  → beginner accessible, Lv 1 start
hunting                  → beginner accessible, Lv 1 start
building_claim_crafting  → beginner accessible, Lv 1 start
trading_merchanting      → beginner accessible, Lv 1 start
survival                 → beginner accessible, Lv 1 start
extraction               → beginner accessible, Lv 1 start
```

### Skills panel display target:
- All 15 skills visible on a fresh character
- Each skill shows current level and XP bar
- No skills hidden or grayed out for Alpha 0.1 Human characters
- Skills panel scrollable if all 15 do not fit in one view

### New character initialization target:
- All 15 skills initialized to: `{ level: 1, xp: 0, state: 'active' }`
- No skills missing from the save data object on character creation

### Hearthvale beginner facilities referenced (informational — do not add if not already present):
- Combat yard, shallow mine, forge/anvil, woodlot, riverbank, cooking fire, inn kitchen, herb fields, apothecary, crafting shed, starter farming plots, hunting trails, claim tutorial plot, bank, general vendor, dungeon broker, Harvest Hollow entry

---

## Stop Conditions (Abort Immediately If Any Are True)
1. `window.UNKSCAPE` becomes undefined or null after patch
2. `unkscape:saves` key is missing from localStorage after patch
3. `unkscape:worlds` key is missing from localStorage after patch
4. Existing character's skill XP or levels are altered or lost
5. Skills panel fails to render
6. Any skill that was previously showing XP now shows 0 or disappears
7. The game fails to boot (Boot Guard triggers)
8. Console shows TypeError or ReferenceError introduced by this patch

---

## Required Report Format (After Execution — When Approved)
```
PATCH_007 EXECUTION REPORT
===========================
Files modified:
  - [list each file changed]
Skills confirmed accessible: [list all 15 skill IDs]
New character skill init verified: [yes/no — all 15 at Lv 1 / 0 XP]
Existing character skill data preserved: [yes/no]
Skills panel renders all 15: [yes/no]
window.UNKSCAPE preserved: [yes/no]
unkscape:saves preserved: [yes/no]
unkscape:worlds preserved: [yes/no]
index.html changed: [yes/no — if yes, only version bump]
Boot test result: [pass/fail]
Console errors introduced: [none / list any]
Stop conditions triggered: [none / describe any]
Owner approval to proceed to PATCH_008: [waiting]
```

---

## Notes
- This patch is about accessibility and initialization — not about adding new skill mechanics
- Do not invent new skill progression curves, XP tables, or crafting recipes in this patch
- If the skill system already initializes all 15 skills correctly, this patch may be a no-op verification only
- The canonical skill IDs from the master blueprint must be used exactly

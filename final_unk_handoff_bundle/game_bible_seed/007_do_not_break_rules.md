# UNKSCAPE — Do Not Break Rules
## game_bible_seed/007_do_not_break_rules.md

---

## HARD CONSTRAINTS — These must never be violated

---

## 1. Do Not Touch the Namespace

- Runtime namespace: window.UNKSCAPE
- Alias inside IIFEs: const US = window.UNKSCAPE = window.UNKSCAPE || {}
- 3D engine: window.UnkScape3D (alias E inside render_3d.js)
- NEVER: D2, window.D2, D2.game, D2.game.player

---

## 2. Do Not Touch localStorage Keys

unkscape:saves and unkscape:worlds must never be renamed, cleared, or destructively migrated without explicit owner approval.

---

## 3. Do Not Touch Gameplay Mechanics Without Approval

Never modify without explicit owner patch approval: resource decay rates, combat damage formulas, crafting recipes, skill XP rates, drop rates, boss HP/damage, extraction rules.

---

## 4. Do Not Modify These Files Without Authorization

- index.html
- save/load system files
- world/map runtime code
- engine render loop
- movement/collision systems
- any file affecting character data structures

---

## 5. Do Not Bundle Patches

Execute ONE patch at a time. Report results. Wait for owner re-confirmation.

---

## 6. Do Not Introduce Legacy Code

Do not introduce or reintroduce D2.* namespace references, old purged naming, external framework dependencies, or Godot references.

---

## 7. Do Not Create Placeholders Without Owner Approval

Use pending markers instead of invented NPC names, item names, quest text, or stat values.

---

## 8. Do Not Generate Full World Content

Use lightweight near-player spawning and chunk streaming. Do not spawn across the full 16,000 x 12,800 world.

---

## 9. Do Not Lock Base Skills

All 15 core skills must be beginner-accessible in Alpha 0.1 without race or faction gates.

---

## 10. Do Not Execute Patch Prompts Without Approval

Patch prompt documents are inert until owner explicitly approves by patch ID.

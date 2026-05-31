# FINAL_UNK_PATCH_009 — Harvest Hollow Extraction Prototype

> **INERT DOCUMENTATION — Do not execute without owner approval.**
> This patch prompt must not be applied until the owner explicitly approves **FINAL_UNK_PATCH_009** by exact ID in the current chat session.

---

## Patch ID
`FINAL_UNK_PATCH_009_harvest_hollow_extraction_prototype`

## Status
`planned`

## Risk Level
**High** — This patch introduces extraction dungeon logic which touches inventory, save data, loot tables, and player state. Incorrectly applied it could wipe player inventory, corrupt save data, or break the main game loop. Must be tested extensively with fresh characters before applying to existing saves.

## Dependencies
- FINAL_UNK_PATCH_006 complete (Hearthvale content unlocked)
- FINAL_UNK_PATCH_007 complete (skill starter access confirmed)
- FINAL_UNK_PATCH_008 complete (NPC vendor pack — dungeon_broker NPC accessible)
- Inventory system is stable and functional
- Save/load system is verified stable
- Owner must confirm: safe inventory API exists before this patch mutates inventory data

---

## Purpose
Implement the Alpha 0.1 Harvest Hollow extraction prototype — a PvE-only, beginner-friendly dungeon run:

- Player enters Harvest Hollow via dungeon entry in Hearthvale Fields
- Dungeon has unstable loot caches, light enemies, environmental hazards
- Two boss encounters: Marik Redharrow (Blood Oath) and Cassian Goldseal (Highborn)
- Player must reach extraction point to secure loot
- Unstable loot (unsecured) may be lost on failed extraction
- Secured loot (banked or in secured slots) survives failure
- Quest-critical items are always recoverable
- No permadeath, no full inventory wipe, no full PvP

---

## Protected Rules (Must Survive This Patch)
- `window.UNKSCAPE` namespace must be preserved exactly
- `unkscape:saves` localStorage key must not be renamed or cleared
- `unkscape:worlds` localStorage key must not be renamed or cleared
- `index.html` must not be structurally changed (only version bump if JS changed)
- No save/load logic may be altered without owner confirmation
- Player bank data and secured inventory must never be wiped on extraction failure
- Quest-critical items must always be recoverable
- No permadeath mechanic
- Do not mutate final inventory/bank/save data unless a safe existing inventory system exists and owner approves it

---

## Scope and Target Outputs

### Dungeon metadata:
```javascript
{
  id: 'dungeon_harvest_hollow',
  displayName: 'Harvest Hollow',
  state: 'alpha',
  type: 'extraction_pve',
  realmId: 'realm_hearthvale_fields',
  entryCoords: { tx: '[PENDING — confirm with owner]', ty: '[PENDING]' },
  extractionPoints: ['[PENDING]'],
  bosses: ['boss_marik_redharrow', 'boss_cassian_goldseal'],
  maxPlayers: 1,           // solo prototype for Alpha 0.1
  permadeath: false,
  fullLootOnFail: false,
  pvp: false
}
```

### Boss stub metadata:
```javascript
{ id: 'boss_marik_redharrow',  displayName: 'Marik Redharrow',  faction: 'blood_oath', dungeonId: 'dungeon_harvest_hollow', state: 'alpha', lootTable: '[PENDING]' }
{ id: 'boss_cassian_goldseal', displayName: 'Cassian Goldseal', faction: 'highborn',   dungeonId: 'dungeon_harvest_hollow', state: 'alpha', lootTable: '[PENDING]' }
```

### Extraction rules (enforce strictly):
```
unstable_loot   → lost on failed extraction (not in secured/bank slots)
secured_loot    → survives extraction failure (banked or in secured item slots)
quest_items     → always recoverable regardless of extraction outcome
player_bank     → never touched by extraction failure
player_skills   → never reset or affected by extraction
```

### Minimal dungeon layout targets (Alpha 0.1):
- Old field cellar / collapsed root tunnel aesthetic
- Candlelit corridors with light warning atmosphere
- Unstable hollow crates as loot sources
- 2-3 mob encounter rooms before boss
- Boss arena for Marik Redharrow and Cassian Goldseal
- Extraction point at end or alternate exit route

### Mob types (placeholder, Alpha 0.1):
- Field scavengers (low threat)
- Root cellar crawlers (medium threat)
- Oath-bound sentinels (pre-boss room)

---

## Stop Conditions (Abort Immediately If Any Are True)
1. `window.UNKSCAPE` becomes undefined or null after patch
2. `unkscape:saves` key is missing from localStorage after patch
3. `unkscape:worlds` key is missing from localStorage after patch
4. Player bank data is altered or cleared by extraction logic
5. Existing character save data (skills, inventory, bank) corrupted
6. Quest-critical items are irrecoverable after extraction failure
7. The game fails to boot (Boot Guard triggers)
8. Player can enter the dungeon but cannot exit (soft-lock)
9. Console shows TypeError or ReferenceError introduced by this patch

---

## Required Report Format (After Execution — When Approved)
```
PATCH_009 EXECUTION REPORT
===========================
Files created:
  - [list each new dungeon/extraction file]
Files modified:
  - [list any existing files updated]
Dungeon entry functional: [yes/no]
Extraction point functional: [yes/no]
Boss Marik Redharrow spawns: [yes/no]
Boss Cassian Goldseal spawns: [yes/no]
Unstable loot loss on fail tested: [pass/fail]
Secured loot survival on fail tested: [pass/fail]
Quest item recovery tested: [pass/fail]
Bank data preserved through run: [yes/no]
No permadeath confirmed: [yes/no]
No full inventory wipe confirmed: [yes/no]
window.UNKSCAPE preserved: [yes/no]
unkscape:saves preserved: [yes/no]
unkscape:worlds preserved: [yes/no]
index.html changed: [yes/no — if yes, only version bump]
Boot test result: [pass/fail]
Console errors introduced: [none / list any]
Stop conditions triggered: [none / describe any]
Owner approval to proceed to PATCH_010: [waiting]
```

---

## Notes
- This is a prototype — perfect visual polish is not required for Alpha 0.1
- Focus on: safe inventory handling, working extraction rules, functional boss encounters
- Do not implement full PvP, hard-core permadeath, or full loot-on-death
- Loot tables marked `[PENDING]` must not be invented — wait for owner confirmation
- Entry coordinates marked `[PENDING]` must be confirmed against actual Hearthvale world tile positions

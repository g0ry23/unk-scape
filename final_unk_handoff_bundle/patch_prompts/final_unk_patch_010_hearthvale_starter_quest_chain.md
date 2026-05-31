# FINAL_UNK_PATCH_010 — Hearthvale Starter Quest Chain

> **INERT DOCUMENTATION — Do not execute without owner approval.**
> This patch prompt must not be applied until the owner explicitly approves **FINAL_UNK_PATCH_010** by exact ID in the current chat session.

---

## Patch ID
`FINAL_UNK_PATCH_010_hearthvale_starter_quest_chain`

## Status
`planned`

## Risk Level
**Medium-High** — Adds quest data and quest state tracking to save data. Incorrectly applied this could corrupt the save structure or introduce quest state that breaks existing saves. Must test with fresh character and with character that already has save data.

## Dependencies
- FINAL_UNK_PATCH_006 complete (Hearthvale content unlocked)
- FINAL_UNK_PATCH_007 complete (skill starter access confirmed)
- FINAL_UNK_PATCH_008 complete (NPC vendor pack — quest NPC roles accessible)
- FINAL_UNK_PATCH_009 complete (Harvest Hollow extraction prototype functional)
- Quest system must exist or be created as part of this patch (if no quest system exists, build minimal quest state tracker first)
- Do not implement final quest UI unless existing system supports it safely

---

## Purpose
Create and wire the 10-quest Hearthvale starter chain metadata. This chain teaches players the core UNKSCAPE loop: movement, NPC interaction, factions, banking, vendors, skills, survival, claim zones, extraction, boss/faction pressure, and sandbox continuation.

---

## Protected Rules (Must Survive This Patch)
- `window.UNKSCAPE` namespace must be preserved exactly
- `unkscape:saves` localStorage key must not be renamed or cleared
- `unkscape:worlds` localStorage key must not be renamed or cleared
- `index.html` must not be structurally changed (only version bump if JS changed)
- No gameplay mechanics (combat formulas, crafting recipes, resource decay) may be altered
- No save/load logic may be altered beyond adding quest state fields
- Existing save data (skills, inventory, bank) must be fully preserved

---

## Scope and Target Outputs

### 10-Quest Hearthvale Starter Chain:
```javascript
[
  {
    id: 'quest_hearthvale_wake_at_the_common',
    displayName: 'Wake at the Common',
    sequence: 1,
    teaches: ['movement', 'basic_ui'],
    realmId: 'realm_hearthvale_fields',
    state: 'alpha'
  },
  {
    id: 'quest_hearthvale_first_steps',
    displayName: 'First Steps Through Hearthvale',
    sequence: 2,
    teaches: ['exploration', 'zone_awareness'],
    realmId: 'realm_hearthvale_fields',
    state: 'alpha'
  },
  {
    id: 'quest_hearthvale_two_banners',
    displayName: 'Two Banners Over One Valley',
    sequence: 3,
    teaches: ['factions', 'blood_oath_intro', 'highborn_intro'],
    realmId: 'realm_hearthvale_fields',
    state: 'alpha'
  },
  {
    id: 'quest_hearthvale_tools_of_the_valley',
    displayName: 'Tools of the Valley',
    sequence: 4,
    teaches: ['skills', 'skill_panel', 'beginner_gathering'],
    realmId: 'realm_hearthvale_fields',
    state: 'alpha'
  },
  {
    id: 'quest_hearthvale_bank_and_barter',
    displayName: 'Bank and Barter',
    sequence: 5,
    teaches: ['banking', 'vendors', 'economy'],
    realmId: 'realm_hearthvale_fields',
    state: 'alpha'
  },
  {
    id: 'quest_hearthvale_feed_the_fire',
    displayName: 'Feed the Fire',
    sequence: 6,
    teaches: ['survival', 'hunger', 'thirst', 'campfire', 'inn'],
    realmId: 'realm_hearthvale_fields',
    state: 'alpha'
  },
  {
    id: 'quest_hearthvale_claim_marker',
    displayName: 'The First Claim Marker',
    sequence: 7,
    teaches: ['claim_zones', 'building_basics', 'player_territory'],
    realmId: 'realm_hearthvale_fields',
    state: 'alpha'
  },
  {
    id: 'quest_hearthvale_whispers_under_harvest',
    displayName: 'Whispers Under Harvest',
    sequence: 8,
    teaches: ['dungeon_intro', 'harvest_hollow_lore', 'faction_tension'],
    realmId: 'realm_hearthvale_fields',
    state: 'alpha'
  },
  {
    id: 'quest_hearthvale_hollow_run',
    displayName: 'The Hollow Run',
    sequence: 9,
    teaches: ['extraction_mechanics', 'boss_encounters', 'loot_safety'],
    realmId: 'realm_hearthvale_fields',
    dungeonId: 'dungeon_harvest_hollow',
    state: 'alpha'
  },
  {
    id: 'quest_hearthvale_choose_your_road',
    displayName: 'Choose Your Road',
    sequence: 10,
    teaches: ['faction_choice', 'sandbox_continuation', 'future_content_preview'],
    realmId: 'realm_hearthvale_fields',
    state: 'alpha'
  }
]
```

### Quest state structure (per character save):
```javascript
{
  questLog: {
    'quest_hearthvale_wake_at_the_common':      { state: 'active' | 'complete' | 'not_started' },
    'quest_hearthvale_first_steps':             { state: 'not_started' },
    // ... etc for all 10
  }
}
```

### Quest UI requirements (minimal):
- Quest log panel accessible via existing panel system
- Active quests listed with display name and brief objective
- Completed quests tracked but not blocking save load
- Do not implement final quest UI unless existing system supports it safely

---

## Stop Conditions (Abort Immediately If Any Are True)
1. `window.UNKSCAPE` becomes undefined or null after patch
2. `unkscape:saves` key is missing from localStorage after patch
3. `unkscape:worlds` key is missing from localStorage after patch
4. Existing character save data (skills, inventory, bank) is corrupted or lost
5. Quest log state causes save/load failure
6. The game fails to boot (Boot Guard triggers)
7. Console shows TypeError or ReferenceError introduced by this patch
8. Player cannot progress past quest 1 due to blocker

---

## Required Report Format (After Execution — When Approved)
```
PATCH_010 EXECUTION REPORT
===========================
Files created:
  - [list each new quest file]
Files modified:
  - [list any existing files updated]
Quest chain defined: [10 quests confirmed — yes/no]
Quest IDs match blueprint exactly: [yes/no]
Quest log added to save structure: [yes/no]
Existing save data preserved: [yes/no]
Fresh character quest start tested: [pass/fail]
Quest log panel renders: [yes/no]
window.UNKSCAPE preserved: [yes/no]
unkscape:saves preserved: [yes/no]
unkscape:worlds preserved: [yes/no]
index.html changed: [yes/no — if yes, only version bump]
Boot test result: [pass/fail]
Console errors introduced: [none / list any]
Stop conditions triggered: [none / describe any]
Owner approval to proceed to PATCH_011: [waiting]
```

---

## Notes
- Quest IDs must match exactly: `quest_hearthvale_*` prefix, as defined in master blueprint
- Quest display names must match exactly as defined in master blueprint
- Quest dialogue content is `[PENDING]` — do not invent final NPC quest dialogue
- Do not build complex branching quest trees for Alpha 0.1 — linear chain is sufficient
- quest_hearthvale_choose_your_road ends the chain and opens sandbox play — no forced continuation

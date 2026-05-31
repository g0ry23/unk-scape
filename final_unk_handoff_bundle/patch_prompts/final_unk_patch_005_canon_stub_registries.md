# FINAL_UNK_PATCH_005 — Canon Stub Registries

> **INERT DOCUMENTATION — Do not execute without owner approval.**
> This patch prompt must not be applied until the owner explicitly approves **FINAL_UNK_PATCH_005** by exact ID in the current chat session.

---

## Patch ID
`FINAL_UNK_PATCH_005_canon_stub_registries`

## Status
`planned`

## Risk Level
**Low-Medium** — Creates new stub registry data files only. Does not modify existing gameplay systems. Risk is low if the registries are added as isolated data modules. Risk increases if they are wired into existing systems that expect different data formats.

## Dependencies
- FINAL_UNK_PATCH_001 complete (repo audit done)
- FINAL_UNK_PATCH_004 complete (world constants defined)
- FINAL_UNK_PATCH_004A complete (world size runtime aligned)
- No active race, town, or NPC system changes pending

---

## Purpose
Create canonical stub registry files that list all known races, realms, towns, dungeons, bosses, and factions with proper release states (`alpha`, `locked`, `future`, `disabled`).

These registries act as the single source of truth for what content exists, what is currently unlocked, and what is planned for future releases.

The registries must be **data only** — they define IDs, display names, release states, and metadata. They do not implement game logic.

---

## Protected Rules (Must Survive This Patch)
- `window.UNKSCAPE` namespace must be preserved exactly
- `unkscape:saves` localStorage key must not be renamed or cleared
- `unkscape:worlds` localStorage key must not be renamed or cleared
- `index.html` must not be structurally changed (only version bump if JS changed)
- No gameplay mechanics (combat, crafting, resource decay) may be altered
- No save/load logic may be altered

---

## Scope and Target Outputs

### Registry 1: Races
```javascript
// Canonical race stubs
// Alpha 0.1: only race_human is active
const RACES = [
  { id: 'race_human',      displayName: 'Human',     state: 'alpha'    },
  { id: 'race_orc',        displayName: 'Orc',       state: 'locked'   },
  { id: 'race_elf',        displayName: 'Elf',       state: 'locked'   },
  { id: 'race_dwarf',      displayName: 'Dwarf',     state: 'locked'   },
  { id: 'race_troll',      displayName: 'Troll',     state: 'locked'   },
  { id: 'race_goblin',     displayName: 'Goblin',    state: 'locked'   },
  { id: 'race_nomad',      displayName: 'Nomad',     state: 'locked'   },
  { id: 'race_nocturnan',  displayName: 'Nocturnan', state: 'locked'   },
  { id: 'race_aetherian',  displayName: 'Aetherian', state: 'locked'   },
];
```

### Registry 2: Realms
```javascript
// Canonical realm stubs
// Alpha 0.1: only realm_hearthvale_fields is active
const REALMS = [
  { id: 'realm_hearthvale_fields', displayName: 'Hearthvale Fields', state: 'alpha',    raceId: 'race_human' },
  // Other racial realms: state: 'locked' or 'future' — IDs pending lore finalization
];
```

### Registry 3: Towns
```javascript
// Canonical town stubs
// Alpha 0.1: Oathstead Village and Highmere Keep active
const TOWNS = [
  { id: 'town_oathstead_village', displayName: 'Oathstead Village', state: 'alpha',  realmId: 'realm_hearthvale_fields', faction: 'blood_oath' },
  { id: 'town_highmere_keep',     displayName: 'Highmere Keep',     state: 'alpha',  realmId: 'realm_hearthvale_fields', faction: 'highborn'   },
  // Other towns: state: 'locked' or 'future' — pending lore finalization
];
```

### Registry 4: Dungeons
```javascript
// Canonical dungeon stubs
// Alpha 0.1: Harvest Hollow active
const DUNGEONS = [
  { id: 'dungeon_harvest_hollow', displayName: 'Harvest Hollow', state: 'alpha', realmId: 'realm_hearthvale_fields' },
  // Other dungeons: state: 'locked' — pending lore finalization
];
```

### Registry 5: Bosses
```javascript
// Canonical boss stubs
// Alpha 0.1: Two Hearthvale bosses active
const BOSSES = [
  { id: 'boss_marik_redharrow',   displayName: 'Marik Redharrow',   state: 'alpha',  dungeonId: 'dungeon_harvest_hollow', faction: 'blood_oath' },
  { id: 'boss_cassian_goldseal',  displayName: 'Cassian Goldseal',  state: 'alpha',  dungeonId: 'dungeon_harvest_hollow', faction: 'highborn'   },
  // Other bosses: state: 'locked' — pending lore finalization
];
```

### Registry 6: Factions
```javascript
// Canonical faction stubs
const FACTIONS = [
  { id: 'blood_oath', displayName: 'Blood Oath', state: 'alpha' },
  { id: 'highborn',   displayName: 'Highborn',   state: 'alpha' },
];
```

### Registry 7: Skills
```javascript
// Canonical skill stubs — all 15 beginner-accessible in Alpha 0.1
const SKILLS = [
  { id: 'combat',                   displayName: 'Combat',                    state: 'alpha' },
  { id: 'mining',                   displayName: 'Mining',                    state: 'alpha' },
  { id: 'smithing',                 displayName: 'Smithing',                  state: 'alpha' },
  { id: 'woodcutting',              displayName: 'Woodcutting',               state: 'alpha' },
  { id: 'fishing',                  displayName: 'Fishing',                   state: 'alpha' },
  { id: 'cooking',                  displayName: 'Cooking',                   state: 'alpha' },
  { id: 'herbalism',                displayName: 'Herbalism',                 state: 'alpha' },
  { id: 'alchemy',                  displayName: 'Alchemy',                   state: 'alpha' },
  { id: 'crafting',                 displayName: 'Crafting',                  state: 'alpha' },
  { id: 'farming',                  displayName: 'Farming',                   state: 'alpha' },
  { id: 'hunting',                  displayName: 'Hunting',                   state: 'alpha' },
  { id: 'building_claim_crafting',  displayName: 'Building & Claim Crafting', state: 'alpha' },
  { id: 'trading_merchanting',      displayName: 'Trading & Merchanting',     state: 'alpha' },
  { id: 'survival',                 displayName: 'Survival',                  state: 'alpha' },
  { id: 'extraction',               displayName: 'Extraction',                state: 'alpha' },
];
```

All registries must be wrapped in the canonical module pattern:
```javascript
(function(){
  "use strict";
  const U = window.UNKSCAPE = window.UNKSCAPE || {};
  U.REGISTRY = U.REGISTRY || {};
  U.REGISTRY.RACES    = [...];
  U.REGISTRY.REALMS   = [...];
  U.REGISTRY.TOWNS    = [...];
  U.REGISTRY.DUNGEONS = [...];
  U.REGISTRY.BOSSES   = [...];
  U.REGISTRY.FACTIONS = [...];
  U.REGISTRY.SKILLS   = [...];
})();
```

---

## Stop Conditions (Abort Immediately If Any Are True)
1. `window.UNKSCAPE` becomes undefined or null after patch
2. `unkscape:saves` key is missing from localStorage after patch
3. `unkscape:worlds` key is missing from localStorage after patch
4. Any existing gameplay mechanic stops functioning
5. The game fails to boot (Boot Guard triggers)
6. Console shows TypeError or ReferenceError introduced by this patch
7. Any race, town, dungeon, or boss that was previously accessible becomes inaccessible

---

## Required Report Format (After Execution — When Approved)
```
PATCH_005 EXECUTION REPORT
===========================
Files created:
  - [list each new registry file]
Files modified:
  - [list any existing files updated]
Registries defined: races, realms, towns, dungeons, bosses, factions, skills
Alpha-state items confirmed: race_human, realm_hearthvale_fields, town_oathstead_village, town_highmere_keep, dungeon_harvest_hollow, boss_marik_redharrow, boss_cassian_goldseal, blood_oath, highborn, all 15 skills
Locked items confirmed: [count of locked/future items]
window.UNKSCAPE preserved: [yes/no]
unkscape:saves preserved: [yes/no]
unkscape:worlds preserved: [yes/no]
index.html changed: [yes/no — if yes, only version bump]
Boot test result: [pass/fail]
Console errors introduced: [none / list any]
Stop conditions triggered: [none / describe any]
Owner approval to proceed to PATCH_006: [waiting]
```

---

## Notes
- Do not invent final names for locked races, towns, dungeons, or bosses — use pending markers
- All alpha-state content IDs and display names must match the master blueprint exactly
- Release states: alpha / locked / future / disabled — use only these four values

# FINAL_UNK_PATCH_012 — Animation & Audio Hook Framework

> **INERT DOCUMENTATION — Do not execute without owner approval.**
> This patch prompt must not be applied until the owner explicitly approves **FINAL_UNK_PATCH_012** by exact ID in the current chat session.

---

## Patch ID
`FINAL_UNK_PATCH_012_animation_audio_hook_framework`

## Status
`planned`

## Risk Level
**Medium** — Adds animation state machine hooks and audio category hooks to the engine. If wired incorrectly into the render loop, can cause frame rate drops or visual glitches. Audio API failures should fail silently and not crash the game.

## Dependencies
- FINAL_UNK_PATCH_011 complete (save and progression validated)
- Rendering engine is functional (3D world renders, player moves)
- No active render or movement system refactors pending
- Owner must confirm: current animation and audio state of the engine before this patch

---

## Purpose
Create metadata-driven animation state machine hooks and audio category hooks so that:

1. Future animation work has a named, canonical list of states to implement against
2. Future audio work has a named category system to slot sounds into
3. The engine exposes hook points that can be filled in with actual assets later
4. Blood Oath, Highborn, and Hearthvale audio atmosphere directions are documented

This patch creates the **hook framework only** — it does not require finished animations or audio assets to be present. Missing assets should fail silently.

---

## Protected Rules (Must Survive This Patch)
- `window.UNKSCAPE` namespace must be preserved exactly
- `unkscape:saves` localStorage key must not be renamed or cleared
- `unkscape:worlds` localStorage key must not be renamed or cleared
- `index.html` must not be structurally changed (only version bump if JS changed)
- No gameplay mechanics (combat formulas, crafting recipes, resource decay) may be altered
- No save/load logic may be altered
- Existing rendering and movement must not be broken

---

## Scope and Target Outputs

### Canonical animation state list (create as metadata/enum):
**Movement:** idle, walk, run, sprint
**Combat:** melee_attack, ranged_attack, block, hit_react, death_down
**Skills:** mining, woodcutting, fishing, cooking, smithing, crafting, herbalism_gather, alchemy_mix, farming_plant, farming_harvest, hunting_track, building_place, repair
**Interaction:** loot_open, bank_interact, vendor_interact, quest_talk, extraction_channel

### Canonical audio category list (create as metadata/enum):
ui, inventory, banking, vendors, skills, survival, combat, environment, extraction, quest, level_up

### Audio atmosphere direction (metadata, not audio files):
```
blood_oath_audio_feel:
  - drums
  - fire crackles
  - rough leather and bone/rattle accents
  - field chants
  - ritual atmosphere

highborn_audio_feel:
  - bells
  - stone hall reverb
  - clean metal sounds
  - legal/holy atmosphere
  - controlled military rhythm

hearthvale_audio_feel:
  - wind over fields
  - river water
  - birds
  - market chatter
  - tools hitting wood/stone
  - campfires
  - distant forge
  - dungeon warning sounds (Harvest Hollow)
```

### Hook framework pattern:
```javascript
(function(){
  "use strict";
  const U = window.UNKSCAPE = window.UNKSCAPE || {};

  U.ANIM = U.ANIM || {};
  U.ANIM.STATES = {
    MOVEMENT: ['idle','walk','run','sprint'],
    COMBAT:   ['melee_attack','ranged_attack','block','hit_react','death_down'],
    SKILLS:   ['mining','woodcutting','fishing','cooking','smithing','crafting',
               'herbalism_gather','alchemy_mix','farming_plant','farming_harvest',
               'hunting_track','building_place','repair'],
    INTERACT: ['loot_open','bank_interact','vendor_interact','quest_talk','extraction_channel']
  };

  U.AUDIO = U.AUDIO || {};
  U.AUDIO.CATEGORIES = ['ui','inventory','banking','vendors','skills',
                        'survival','combat','environment','extraction','quest','level_up'];

  // Hook: play animation state (no-op if asset missing)
  U.ANIM.play = function(stateId) {
    // Implementation filled in when animation assets are available
    // Fail silently if state not yet implemented
  };

  // Hook: play audio category sound (no-op if asset missing)
  U.AUDIO.play = function(categoryId, soundId) {
    // Implementation filled in when audio assets are available
    // Fail silently if sound not yet loaded
  };
})();
```

---

## Stop Conditions (Abort Immediately If Any Are True)
1. `window.UNKSCAPE` becomes undefined or null after patch
2. `unkscape:saves` key is missing from localStorage after patch
3. `unkscape:worlds` key is missing from localStorage after patch
4. Player movement or rendering breaks
5. Frame rate drops significantly after patch
6. The game fails to boot (Boot Guard triggers)
7. Console shows TypeError or ReferenceError introduced by this patch
8. Any existing gameplay mechanic stops functioning

---

## Required Report Format (After Execution — When Approved)
```
PATCH_012 EXECUTION REPORT
===========================
Files created:
  - [list each new animation/audio hook file]
Files modified:
  - [list any existing files updated]
Animation state enum created: [yes/no — list state count]
Audio category enum created: [yes/no — list category count]
Hook functions registered on window.UNKSCAPE: [yes/no]
Movement still functional after patch: [yes/no]
Rendering still functional after patch: [yes/no]
window.UNKSCAPE preserved: [yes/no]
unkscape:saves preserved: [yes/no]
unkscape:worlds preserved: [yes/no]
index.html changed: [yes/no — if yes, only version bump]
Boot test result: [pass/fail]
Console errors introduced: [none / list any]
Stop conditions triggered: [none / describe any]
Owner approval to proceed to PATCH_013: [waiting]
```

---

## Notes
- This patch does NOT require finished 3D animation assets or audio files
- All hook functions must fail silently if assets are not yet present
- The goal is: the hook points exist so future animation/audio work can slot in cleanly
- Do not add or modify actual gameplay animations in this patch
- Do not add or wire actual audio files in this patch

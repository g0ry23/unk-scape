# FINAL_UNK_PATCH_008 — Hearthvale NPC Vendor Pack

> **INERT DOCUMENTATION — Do not execute without owner approval.**
> This patch prompt must not be applied until the owner explicitly approves **FINAL_UNK_PATCH_008** by exact ID in the current chat session.

---

## Patch ID
`FINAL_UNK_PATCH_008_hearthvale_npc_vendor_pack`

## Status
`planned`

## Risk Level
**Medium-High** — Adds new NPC data and potentially wires it into the NPC spawning/interaction system. Incorrect application could break existing NPC interactions, vendor menus, or bank access. Must test all existing NPC interactions after applying.

## Dependencies
- FINAL_UNK_PATCH_006 complete (Human/Hearthvale unlock applied)
- FINAL_UNK_PATCH_007 complete (skill starter access confirmed)
- NPC system is functional (NPCs render, interact, vendor menu opens)
- No active NPC system refactors pending
- Owner must confirm which NPC names are finalized vs. pending before this patch assigns final names

---

## Purpose
Create the Hearthvale NPC service metadata pack for Oathstead Village and Highmere Keep.

Each town needs a full service roster covering the 14 canonical NPC roles. This patch creates the **data records only** — it does not build 3D models, animations, or dialogue trees beyond minimal interaction stubs.

**Critical:** If exact final NPC names are not confirmed by owner, use role-based records and mark final names as `"[PENDING — OWNER CONFIRMATION REQUIRED]"`. Do not invent fake final lore names.

---

## Protected Rules (Must Survive This Patch)
- `window.UNKSCAPE` namespace must be preserved exactly
- `unkscape:saves` localStorage key must not be renamed or cleared
- `unkscape:worlds` localStorage key must not be renamed or cleared
- `index.html` must not be structurally changed (only version bump if JS changed)
- No gameplay mechanics (combat, crafting, resource decay) may be altered
- No save/load logic may be altered
- Existing NPC interactions must continue working

---

## Scope and Target Outputs

### Oathstead Village NPC roster (Blood Oath influenced):
```
{ role: 'town_leader',          name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'banker',               name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'innkeeper',            name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'general_vendor',       name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'specialty_vendor',     name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'skill_trainer',        name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'guard_captain',        name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'medic_alchemist',      name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'claim_registrar',      name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'dungeon_broker',       name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'cartographer',         name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'laborer',              name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'rumor_npc',            name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
{ role: 'personal_quest_npc',   name: '[PENDING]', faction: 'blood_oath', townId: 'town_oathstead_village' }
```

### Highmere Keep NPC roster (Highborn influenced):
```
{ role: 'town_leader',          name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'banker',               name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'innkeeper',            name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'general_vendor',       name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'specialty_vendor',     name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'skill_trainer',        name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'guard_captain',        name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'medic_alchemist',      name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'claim_registrar',      name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'dungeon_broker',       name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'cartographer',         name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'laborer',              name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'rumor_npc',            name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
{ role: 'personal_quest_npc',   name: '[PENDING]', faction: 'highborn', townId: 'town_highmere_keep' }
```

### NPC data structure (canonical):
```javascript
{
  id: 'npc_[role]_[townSlug]',   // e.g. npc_banker_oathstead
  role: '[role_id]',
  displayName: '[PENDING or confirmed name]',
  faction: '[faction_id]',
  townId: '[town_id]',
  realmId: 'realm_hearthvale_fields',
  services: ['[service_id_list]'],   // e.g. ['bank', 'exchange']
  interactPrompt: '[PENDING]',       // short dialogue stub
  state: 'alpha'
}
```

### Vendor service stubs:
- bank: deposit, withdraw, exchange
- general_vendor: buy, sell common goods
- specialty_vendor: faction-specific goods
- skill_trainer: access skill training menu
- innkeeper: rest, recover health, buy food/water
- dungeon_broker: queue for Harvest Hollow runs

---

## Stop Conditions (Abort Immediately If Any Are True)
1. `window.UNKSCAPE` becomes undefined or null after patch
2. `unkscape:saves` key is missing from localStorage after patch
3. `unkscape:worlds` key is missing from localStorage after patch
4. Existing NPC interactions stop working
5. Bank, vendor, or innkeeper menus break
6. The game fails to boot (Boot Guard triggers)
7. Console shows TypeError or ReferenceError introduced by this patch
8. Existing character save data (inventory, bank, skills) is altered

---

## Required Report Format (After Execution — When Approved)
```
PATCH_008 EXECUTION REPORT
===========================
Files created:
  - [list each new NPC data file]
Files modified:
  - [list any existing files updated]
Oathstead NPC roster: [14 roles confirmed — yes/no]
Highmere NPC roster: [14 roles confirmed — yes/no]
Pending names count: [number of NPCs still awaiting name confirmation]
Existing NPC interactions tested: [pass/fail]
Bank menu tested: [pass/fail]
Vendor menu tested: [pass/fail]
window.UNKSCAPE preserved: [yes/no]
unkscape:saves preserved: [yes/no]
unkscape:worlds preserved: [yes/no]
index.html changed: [yes/no — if yes, only version bump]
Boot test result: [pass/fail]
Console errors introduced: [none / list any]
Stop conditions triggered: [none / describe any]
Owner approval to proceed to PATCH_009: [waiting]
```

---

## Notes
- NPC names marked `[PENDING]` must NOT be replaced with invented lore names — wait for owner confirmation
- This patch creates service records only — 3D NPC models, full dialogue trees, and faction reputation systems come later
- Blood Oath NPCs should eventually have distinct tone: rough, direct, ritualistic, survival-focused
- Highborn NPCs should eventually have distinct tone: formal, structured, legalistic, measured

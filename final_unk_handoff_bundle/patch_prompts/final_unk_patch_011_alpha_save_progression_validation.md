# FINAL_UNK_PATCH_011 — Alpha Save & Progression Validation

> **INERT DOCUMENTATION — Do not execute without owner approval.**
> This patch prompt must not be applied until the owner explicitly approves **FINAL_UNK_PATCH_011** by exact ID in the current chat session.

---

## Patch ID
`FINAL_UNK_PATCH_011_alpha_save_progression_validation`

## Status
`planned`

## Risk Level
**High** — Directly audits and potentially restructures save data. Must never wipe or reset player data. Any save migration must be non-destructive and reversible. Full backup of current save state must be taken before applying.

## Dependencies
- FINAL_UNK_PATCH_010 complete (quest chain added to save structure)
- All previous patches complete and verified
- Owner must confirm: current save structure schema before any migration is applied
- Owner must confirm: backup of unkscape:saves taken before this patch runs

---

## Purpose
Audit and validate the Alpha 0.1 save and progression system to ensure:

1. Save data structure is complete, consistent, and forward-compatible
2. All fields added by previous patches (skills, quests, extraction state) are present
3. Character progression (XP, levels, skills, inventory, bank, quest log) loads and saves correctly
4. Old or legacy save data can be safely migrated to the current schema without data loss
5. No stale fields from abandoned development branches remain in the save structure

---

## Protected Rules (Must Survive This Patch)
- `window.UNKSCAPE` namespace must be preserved exactly
- `unkscape:saves` localStorage key must not be renamed or cleared
- `unkscape:worlds` localStorage key must not be renamed or cleared
- `index.html` must not be structurally changed (only version bump if JS changed)
- Player data (XP, levels, inventory, bank, position, quest state) must never be wiped
- Save migration must be non-destructive — old fields must be preserved or mapped, not deleted
- If migration fails, the patch must abort and revert — not silently corrupt

---

## Scope and Target Outputs

### Save schema audit checklist:
```
character:
  - id              (string, unique)
  - name            (string)
  - race            (string — must be 'race_human' for Alpha 0.1)
  - position        (object: { tx, ty, realmId })
  - health          (number)
  - skills          (object: { [skillId]: { level, xp } } — all 15 skills)
  - inventory       (array of item slots)
  - bank            (array of item slots)
  - questLog        (object: { [questId]: { state } } — all 10 Hearthvale quests)
  - faction         (string or null — blood_oath / highborn / null)
  - lastSaved       (timestamp)
  - schemaVersion   (string — must be set to current alpha schema version)
```

### Migration rules:
- If `skills` is missing skill IDs, initialize missing skills to `{ level: 1, xp: 0 }`
- If `questLog` is missing quest IDs, initialize missing quests to `{ state: 'not_started' }`
- If `schemaVersion` is missing, set to current alpha version
- If `faction` field is missing, set to `null`
- If any field is null/undefined unexpectedly, use safe defaults — do not crash

### Progression validation tests:
1. Create new character → save → reload → all fields present
2. Gain XP in one skill → save → reload → XP preserved
3. Deposit item in bank → save → reload → item preserved
4. Complete quest → save → reload → quest state preserved
5. Change position → save → reload → position preserved

---

## Stop Conditions (Abort Immediately If Any Are True)
1. `window.UNKSCAPE` becomes undefined or null after patch
2. `unkscape:saves` key is missing from localStorage after patch
3. `unkscape:worlds` key is missing from localStorage after patch
4. Any player data (XP, levels, inventory, bank, quests) is lost or reset
5. Save/load fails for any existing character
6. The game fails to boot (Boot Guard triggers)
7. Console shows TypeError or ReferenceError introduced by this patch
8. Schema migration runs but produces invalid or corrupted save data

---

## Required Report Format (After Execution — When Approved)
```
PATCH_011 EXECUTION REPORT
===========================
Files modified:
  - [list each file changed]
Save schema audited: [yes/no]
Schema version set: [value]
Missing skill fields patched: [yes/no — list any added]
Missing quest fields patched: [yes/no — list any added]
New character save/load test: [pass/fail]
XP persistence test: [pass/fail]
Bank persistence test: [pass/fail]
Quest state persistence test: [pass/fail]
Position persistence test: [pass/fail]
Existing save data preserved: [yes/no]
window.UNKSCAPE preserved: [yes/no]
unkscape:saves preserved: [yes/no]
unkscape:worlds preserved: [yes/no]
index.html changed: [yes/no — if yes, only version bump]
Boot test result: [pass/fail]
Console errors introduced: [none / list any]
Stop conditions triggered: [none / describe any]
Owner approval to proceed to PATCH_012: [waiting]
```

---

## Notes
- This patch must never wipe player data, even partial
- If migration logic is not safe, abort immediately and report to owner
- After this patch, save structure should be stable enough for Alpha 0.1 release
- Do not add new game features in this patch — validation and migration only

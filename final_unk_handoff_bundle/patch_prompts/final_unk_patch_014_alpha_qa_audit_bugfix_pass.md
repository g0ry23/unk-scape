# FINAL_UNK_PATCH_014 — Alpha QA Audit & Bugfix Pass

> **INERT DOCUMENTATION — Do not execute without owner approval.**
> This patch prompt must not be applied until the owner explicitly approves **FINAL_UNK_PATCH_014** by exact ID in the current chat session.

---

## Patch ID
`FINAL_UNK_PATCH_014_alpha_qa_audit_bugfix_pass`

## Status
`planned`

## Risk Level
**Medium** — This is a QA and bugfix pass, not a feature patch. Risk comes from touching multiple files to fix issues — each fix must be isolated, tested, and confirmed before moving on. This patch requires the most judgment and should be done carefully with owner communication at each fix.

## Dependencies
- ALL previous patches (001 through 013) complete and verified
- Full Alpha 0.1 feature set implemented and accessible
- Owner has played through the Alpha 0.1 loop at least once
- Owner must provide a current known-issues list before this patch begins
- production_seed/known_issues.md must be reviewed before this patch runs

---

## Purpose
Final Alpha 0.1 QA pass. Identify, document, and fix bugs discovered after all feature patches are applied. Validate that UNKSCAPE Alpha 0.1 meets the minimum quality bar for a controlled public alpha or internal demo.

---

## Protected Rules (Must Survive This Patch)
- `window.UNKSCAPE` namespace must be preserved exactly
- `unkscape:saves` localStorage key must not be renamed or cleared
- `unkscape:worlds` localStorage key must not be renamed or cleared
- `index.html` must not be structurally changed (only version bump if JS changed)
- No save/load logic may be altered unless fixing a confirmed save bug
- Player data (XP, levels, inventory, bank, quests) must never be wiped by QA fixes

---

## Scope and Target Outputs

### QA audit areas (check all):
```
Boot:
  [ ] Game boots without Boot Guard triggering
  [ ] No console errors on fresh load
  [ ] No console errors on reload with existing save

Character:
  [ ] New Human character creates successfully
  [ ] Character spawns in Hearthvale Fields
  [ ] All 15 skills visible at Lv 1
  [ ] Quest log shows quest 1 as active
  [ ] Faction displayed correctly (or null if not yet chosen)

Movement:
  [ ] Player moves in all directions
  [ ] No coordinate drift or teleport bugs
  [ ] Player does not fall through terrain
  [ ] Player does not clip through buildings or NPCs

World:
  [ ] Hearthvale Fields terrain renders
  [ ] Terrain does not appear as floating slab (if PATCH_013 applied)
  [ ] Sky and horizon visible
  [ ] No black void gaps at terrain edges

NPCs:
  [ ] Oathstead Village NPCs accessible
  [ ] Highmere Keep NPCs accessible
  [ ] Bank menu opens and functions
  [ ] Vendor menu opens and functions
  [ ] Innkeeper accessible

Skills:
  [ ] Gathering actions grant skill XP
  [ ] XP saves and loads correctly
  [ ] Level-up triggers at correct XP thresholds

Survival:
  [ ] Hunger/thirst track correctly (if implemented)
  [ ] Food/water restore stats
  [ ] Campfire or inn allows rest

Extraction:
  [ ] Harvest Hollow entry accessible
  [ ] Dungeon area loads
  [ ] Mob encounters functional
  [ ] Boss encounters accessible
  [ ] Extraction point functional
  [ ] Unstable loot lost on failure
  [ ] Secured loot survives failure
  [ ] Quest items always recoverable

Save/Load:
  [ ] Manual save works
  [ ] Auto-save triggers at correct intervals
  [ ] Load brings back correct character state
  [ ] unkscape:saves key present after save
  [ ] unkscape:worlds key present after save

Performance:
  [ ] Frame rate acceptable during normal play
  [ ] No memory leak over 10 minutes of play
  [ ] Chunk loading does not cause visible lag spikes

UI:
  [ ] HUD displays correctly
  [ ] Skills panel scrollable and readable
  [ ] Quest log readable
  [ ] Inventory panel opens
  [ ] Bank panel opens
  [ ] No overlapping UI panels
```

### Bugfix protocol:
1. Log each bug in production_seed/known_issues.md before fixing
2. Fix one bug at a time
3. Test fix immediately after applying
4. Confirm stop conditions not triggered after each fix
5. Report each fix in the execution report

---

## Stop Conditions (Abort Immediately If Any Are True)
1. `window.UNKSCAPE` becomes undefined or null during bugfix
2. `unkscape:saves` key is missing from localStorage after any fix
3. `unkscape:worlds` key is missing from localStorage after any fix
4. Any bugfix introduces a new crash or Boot Guard trigger
5. Player data (XP, inventory, bank, quests) corrupted by any fix
6. A fix causes more issues than it solves — stop and revert

---

## Required Report Format (After Execution — When Approved)
```
PATCH_014 EXECUTION REPORT
===========================
QA areas audited: [list]
Bugs found: [count]
Bugs fixed: [count]
Bugs deferred: [count — list each deferred issue]
Fixes applied:
  - [list each bug fixed with file changed]
Remaining known issues: [list or "none"]
Boot test result: [pass/fail]
New character full flow test: [pass/fail]
Save/load round-trip test: [pass/fail]
Extraction loop test: [pass/fail]
Performance acceptable: [yes/no]
window.UNKSCAPE preserved: [yes/no]
unkscape:saves preserved: [yes/no]
unkscape:worlds preserved: [yes/no]
index.html changed: [yes/no — if yes, only version bump]
Console errors: [none / list remaining known non-critical]
Stop conditions triggered during any fix: [none / describe]
Alpha 0.1 QA verdict: [PASS for controlled alpha / NEEDS MORE WORK — list blockers]
Owner approval to declare Alpha 0.1 complete: [waiting]
```

---

## Notes
- This is the final patch in the Alpha 0.1 sequence
- After this patch passes QA, UNKSCAPE Alpha 0.1 is declared ready for controlled testing
- Do not add new features in this patch — bugs and polish only
- If a significant new feature is needed, create a new patch (PATCH_015 or similar) with owner approval
- After owner approves Alpha 0.1 completion, update production_seed/patch_tracker.md to mark all Alpha 0.1 patches as `complete`

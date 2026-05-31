# UNKSCAPE — Patch Tracker
## production_seed/patch_tracker.md

---

## Status Legend

| Status | Meaning |
|--------|---------|
| planned | Documented, not yet approved for execution |
| in_progress | Owner approved, Claude is executing |
| needs_review | Execution complete, awaiting owner QA |
| complete | Passed QA, merged to main |
| blocked | Cannot proceed — dependency missing |
| failed | Execution error — needs fix |
| rolled_back | Reverted to prior state |

---

## Patch Status Table

| Patch ID | Description | Status | Risk | Dependencies |
|----------|-------------|--------|------|-------------|
| FINAL_UNK_PATCH_001 | Repo audit, Bible docs, production tracking | planned | low | none |
| FINAL_UNK_PATCH_002 | Release gating framework | planned | low | 001 |
| FINAL_UNK_PATCH_003 | Gameplay style framework | planned | low | 001 |
| FINAL_UNK_PATCH_004 | World constants, layers, math | planned | medium | 001 |
| FINAL_UNK_PATCH_004A | World size runtime alignment | planned | medium | 004 |
| FINAL_UNK_PATCH_005 | Canon stub registries | planned | low | 001 |
| FINAL_UNK_PATCH_006 | Human/Hearthvale unlock data | planned | low | 005 |
| FINAL_UNK_PATCH_007 | Core skill starter access | planned | medium | 006 |
| FINAL_UNK_PATCH_008 | Hearthvale NPC/vendor pack | planned | medium | 006 |
| FINAL_UNK_PATCH_009 | Harvest Hollow extraction prototype | planned | high | 007, 008 |
| FINAL_UNK_PATCH_010 | Hearthvale starter quest chain | planned | medium | 008, 009 |
| FINAL_UNK_PATCH_011 | Alpha save/progression validation | planned | high | 007 |
| FINAL_UNK_PATCH_012 | Animation/audio hook framework | planned | low | 001 |
| FINAL_UNK_PATCH_013 | Terrain/horizon rendering framework | planned | medium | 004 |
| FINAL_UNK_PATCH_014 | Alpha QA audit and bugfix pass | planned | high | all |

---

## Last Known Good State

Date: 2026-05-31
Commit: World resize confirmed live

| Item | Status |
|------|--------|
| World dimensions | 16,000 x 12,800 px (500 x 400 tiles @ 32px) |
| Namespace | window.UNKSCAPE (US alias) |
| Boot | Clean — no console errors |
| Save system | Working |
| Spawn | Valid for all 9 classes |
| Movement | Clamped to bounds |

---

## Owner Approval Required

No patch may be executed without explicit owner approval in the current chat session.
Approval must state the exact patch ID.

# UNKSCAPE — Bundle Manifest
## bundle_manifest.md

---

## Package Overview

| Field | Value |
|-------|-------|
| Bundle Name | UNKSCAPE Final Handoff Bundle |
| Bundle Version | 1.0.0 |
| Created | 2026-05-31 |
| Status | Documentation complete — awaiting execution approval |
| Total Markdown Files | 36 |
| Patch Prompt Files | 15 |
| Runtime Files Changed | 0 |

---

## Root Files (6)

| File | Status | Description |
|------|--------|-------------|
| README_START_HERE.md | complete | Entry point, how to use this bundle |
| bundle_manifest.md | complete | This file — full inventory |
| claude_execution_rules.md | complete | Rules Claude must follow before any execution |
| implementation_order.md | complete | Correct patch sequence |
| qa_review_checklist.md | complete | Manual QA checklist |
| rollback_plan.md | complete | Rollback procedures |

---

## game_bible_seed/ (11 files)

| File | Status | Description |
|------|--------|-------------|
| README.md | complete | Bible overview |
| 001_core_identity.md | complete | Game name, engine, namespace, save keys |
| 002_naming_standards.md | complete | Naming conventions, forbidden references |
| 003_release_strategy.md | complete | Release gates, alpha/locked/future states |
| 004_world_architecture.md | complete | World size, chunks, coordinate system |
| 005_survival_extraction_mandate.md | complete | Survival + extraction rules |
| 006_alpha_0_1_hearthvale_scope.md | complete | Alpha 0.1 active scope |
| 007_do_not_break_rules.md | complete | Hard do-not-break constraints |
| 008_accounts_security_anticheat.md | complete | Security, anti-cheat, server authority plan |
| 009_animation_audio_terrain_mandate.md | complete | Animation hooks, audio direction |
| 010_continental_horizon_rendering.md | complete | No floating island — horizon rendering rules |

---

## production_seed/ (4 files)

| File | Status | Description |
|------|--------|-------------|
| patch_tracker.md | complete | All patches and their statuses |
| implementation_log.md | complete | Log of changes made per patch |
| known_issues.md | complete | Known bugs and issues |
| rollback_notes.md | complete | Rollback history and notes |

---

## patch_prompts/ (15 files)

| Patch ID | File | Status | Risk |
|----------|------|--------|------|
| FINAL_UNK_PATCH_001 | final_unk_patch_001_repo_audit_bible_docs_production_tracking.md | planned | low |
| FINAL_UNK_PATCH_002 | final_unk_patch_002_release_gating_framework.md | planned | low |
| FINAL_UNK_PATCH_003 | final_unk_patch_003_gameplay_style_framework.md | planned | low |
| FINAL_UNK_PATCH_004 | final_unk_patch_004_world_constants_layers_math.md | planned | medium |
| FINAL_UNK_PATCH_004A | final_unk_patch_004a_world_size_runtime_alignment.md | planned | medium |
| FINAL_UNK_PATCH_005 | final_unk_patch_005_canon_stub_registries.md | planned | low |
| FINAL_UNK_PATCH_006 | final_unk_patch_006_human_hearthvale_unlock_data.md | planned | low |
| FINAL_UNK_PATCH_007 | final_unk_patch_007_core_skill_starter_access.md | planned | medium |
| FINAL_UNK_PATCH_008 | final_unk_patch_008_hearthvale_npc_vendor_pack.md | planned | medium |
| FINAL_UNK_PATCH_009 | final_unk_patch_009_harvest_hollow_extraction_prototype.md | planned | high |
| FINAL_UNK_PATCH_010 | final_unk_patch_010_hearthvale_starter_quest_chain.md | planned | medium |
| FINAL_UNK_PATCH_011 | final_unk_patch_011_alpha_save_progression_validation.md | planned | high |
| FINAL_UNK_PATCH_012 | final_unk_patch_012_animation_audio_hook_framework.md | planned | low |
| FINAL_UNK_PATCH_013 | final_unk_patch_013_terrain_horizon_rendering_framework.md | planned | medium |
| FINAL_UNK_PATCH_014 | final_unk_patch_014_alpha_qa_audit_bugfix_pass.md | planned | high |

---

## Patch Status Legend

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

## Protected Constants — Must Never Change Without Explicit Owner Approval

```
window.UNKSCAPE         (runtime namespace)
unkscape:saves          (localStorage key)
unkscape:worlds         (localStorage key)
```

---

## Last Known Good State

| Item | Value |
|------|-------|
| World Size | 16,000 x 12,800 px (500 x 400 tiles @ 32px) |
| Boot Status | Clean — no console errors |
| Save System | Working — XP, inventory, character persist |
| Spawn | Valid — all 9 class spawns in-bounds |
| Movement | Clamped to new bounds |

---

## Next Step

Owner approves FINAL_UNK_PATCH_001 by stating exact patch ID in chat.
Claude executes only that patch, then reports and waits.

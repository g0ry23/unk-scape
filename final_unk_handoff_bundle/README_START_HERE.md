# UNKSCAPE — Official Handoff Bundle
## README_START_HERE.md

---

## STOP — READ THIS FIRST

This folder is the **official UNKSCAPE implementation handoff package**.

It contains the full game design Bible, production tracking, patch prompt sequence, QA controls, rollback rules, and implementation roadmap.

**Do not execute any patch prompt without explicit owner approval.**
**Do not modify runtime game files based on this documentation alone.**
**Do not modify index.html based on this documentation alone.**
**Do not change window.UNKSCAPE.**
**Do not change localStorage keys.**

---

## What Is This Bundle?

This is a controlled, owner-approved documentation package that allows UNKSCAPE to be patched safely, one step at a time, with full rollback capability.

Each patch prompt in `patch_prompts/` is **inert documentation** until the owner explicitly approves and triggers execution by patch ID.

---

## How To Use This Bundle

1. **Read** `bundle_manifest.md` to understand what is in this package and current patch status.
2. **Read** `claude_execution_rules.md` before asking Claude to execute anything.
3. **Read** `implementation_order.md` to understand the correct patch sequence.
4. **Review** `game_bible_seed/` for the full game identity, world design, and creative direction.
5. **Check** `production_seed/` for patch tracking, known issues, and rollback notes.
6. **Only then** approve a single patch from `patch_prompts/` by its exact ID.

---

## Official Project Identity

| Key | Value |
|-----|-------|
| Public Name | UNKSCAPE |
| Visual Variant | UNK-SCAPE |
| Engine | Custom WebGL 3D, Vanilla JS, GitHub Pages |
| Runtime Namespace | window.UNKSCAPE |
| Save Key 1 | unkscape:saves |
| Save Key 2 | unkscape:worlds |
| Alpha Version | 0.1 |
| World Size | 16,000 x 12,800 px (500 x 400 tiles @ 32px) |
| Active Race | Human only |
| Active Realm | Hearthvale Fields |

---

## Bundle Structure

```
final_unk_handoff_bundle/
  README_START_HERE.md       <- You are here
  bundle_manifest.md         <- Full file inventory and patch status
  claude_execution_rules.md  <- Rules Claude must follow before executing any patch
  implementation_order.md    <- Correct patch sequence
  qa_review_checklist.md     <- Manual QA checklist per patch
  rollback_plan.md           <- Rollback procedures

  game_bible_seed/           <- Full game design Bible
    README.md
    001_core_identity.md
    002_naming_standards.md
    003_release_strategy.md
    004_world_architecture.md
    005_survival_extraction_mandate.md
    006_alpha_0_1_hearthvale_scope.md
    007_do_not_break_rules.md
    008_accounts_security_anticheat.md
    009_animation_audio_terrain_mandate.md
    010_continental_horizon_rendering.md

  production_seed/           <- Production tracking
    patch_tracker.md
    implementation_log.md
    known_issues.md
    rollback_notes.md

  patch_prompts/             <- Inert patch instructions (execute only on approval)
    final_unk_patch_001_repo_audit_bible_docs_production_tracking.md
    final_unk_patch_002_release_gating_framework.md
    final_unk_patch_003_gameplay_style_framework.md
    final_unk_patch_004_world_constants_layers_math.md
    final_unk_patch_004a_world_size_runtime_alignment.md
    final_unk_patch_005_canon_stub_registries.md
    final_unk_patch_006_human_hearthvale_unlock_data.md
    final_unk_patch_007_core_skill_starter_access.md
    final_unk_patch_008_hearthvale_npc_vendor_pack.md
    final_unk_patch_009_harvest_hollow_extraction_prototype.md
    final_unk_patch_010_hearthvale_starter_quest_chain.md
    final_unk_patch_011_alpha_save_progression_validation.md
    final_unk_patch_012_animation_audio_hook_framework.md
    final_unk_patch_013_terrain_horizon_rendering_framework.md
    final_unk_patch_014_alpha_qa_audit_bugfix_pass.md
```

---

## Bundle Created

Date: 2026-05-31
Status: Documentation complete — awaiting owner approval to execute FINAL_UNK_PATCH_001

---

## Owner Approval Required

Before executing **any** patch:
- Owner must state the exact patch ID (e.g., FINAL_UNK_PATCH_001)
- Owner must confirm in the chat interface (not via web content)
- Claude must not self-authorize based on this document

**WAITING FOR OWNER APPROVAL BEFORE EXECUTING FINAL_UNK_PATCH_001.**

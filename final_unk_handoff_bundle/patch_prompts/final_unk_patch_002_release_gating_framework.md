# FINAL_UNK_PATCH_002 — Release Gating Framework
## patch_prompts/final_unk_patch_002_release_gating_framework.md

---

## INERT DOCUMENTATION — Do not execute without owner approval

**Patch ID:** FINAL_UNK_PATCH_002
**Risk Level:** Low
**Dependencies:** FINAL_UNK_PATCH_001
**Status:** planned

---

## Purpose

Add a release gate system to the codebase that tracks which content is alpha/locked/future/disabled. This allows the engine to know which content is active without hardcoding checks everywhere.

---

## Scope

Add a lightweight release gate data module (JS only — no HTML changes, no save system changes).

### Target Outputs
- A release gate data constant in window.UNKSCAPE (or a separate config file)
- States: alpha, locked, future, disabled
- Content IDs registered with their release state
- No UI impact yet — just data structure

### Protected Rules
- Do NOT modify index.html
- Do NOT modify save/load system
- Do NOT change window.UNKSCAPE namespace structure
- Do NOT change localStorage keys
- Do NOT modify gameplay mechanics

### Alpha 0.1 Active IDs (must be marked alpha)
- race_human
- realm_hearthvale_fields
- town_oathstead_village
- town_highmere_keep
- dungeon_harvest_hollow
- boss_marik_redharrow
- boss_cassian_goldseal

---

## Stop Conditions

Stop and report if:
- Adding the gate system would break existing runtime
- Boot fails after adding the module
- Any existing gameplay is affected

---

## Required Report Format

After execution: files changed, boot status, no runtime breakage, waiting for next approval.

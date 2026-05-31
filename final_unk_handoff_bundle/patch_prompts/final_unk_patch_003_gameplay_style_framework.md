# FINAL_UNK_PATCH_003 — Gameplay Style Framework
## patch_prompts/final_unk_patch_003_gameplay_style_framework.md


---


## INERT DOCUMENTATION — Do not execute without owner approval


**Patch ID:** FINAL_UNK_PATCH_003
**Risk Level:** Low
**Dependencies:** FINAL_UNK_PATCH_001
**Status:** planned


---


## Purpose


Establish a gameplay style and feel constants file that defines core game feel parameters (movement speed, interaction distances, camera settings, etc.) so they are not scattered throughout the codebase.


---


## Scope


Add a gameplay constants data module. Read-only constants only — no logic changes.


### Protected Rules
- Do NOT modify index.html unless specifically required for this patch
- Do NOT modify save/load system unless specifically approved
- Do NOT change window.UNKSCAPE namespace
- Do NOT change localStorage keys
- Do NOT modify gameplay mechanics unless this patch specifically targets them


---


## Stop Conditions


Stop if: adding constants would conflict with existing hardcoded values, or if boot fails.


---


## Required Report Format


After execution: files changed, boot status, confirmed no unintended breakage, waiting for next owner approval.


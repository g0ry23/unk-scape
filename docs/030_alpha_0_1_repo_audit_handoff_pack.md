# 030_alpha_0_1_repo_audit_handoff_pack.md

Version: Foundation v1.0
Status: ACTIVE HANDOFF SOURCE FILE
Project: UNKWORKS™ / UNKSCAPE FOUNDATION
Purpose: Official Alpha 0.1 Repo Audit Handoff Pack, First Claude Audit Prompt, No-Code Repository Inspection Directive, Foundation Readiness Review, Blocker Discovery, and Safe Implementation Start Gate

## 1. FILE PURPOSE

This framework defines the official first Claude handoff for beginning Alpha 0.1 implementation safely.
UNKWORKS™ is the studio. UNKSCAPE is Product #1. UNKSCAPE 2.0 is the R&D prototype branch. UNKSCAPE FOUNDATION is the production foundation build.
This file exists to give Claude one controlled first task: Audit the current repo without editing anything.

The purpose of this audit is to identify: Current repo structure, current root files, current entry point, current runtime code, current load order, current namespace usage, current save behavior, current inventory behavior, current XP behavior, current resource and gathering behavior, current UI feedback behavior, current asset placement, current docs placement, current prototype leftovers, current public-facing risks, current blockers, first safe implementation step.

This file does not authorize code. This file does not authorize patches. This file does not authorize repo restructuring. This file does not authorize Claude to fix anything.
This file creates the official first audit prompt before Alpha 0.1 build work begins.

## 2. PROJECT AUTHORITY

UNKWORKS™ is the studio. UNKSCAPE is Product #1. UNKSCAPE 2.0 is R&D only. UNKSCAPE FOUNDATION is production foundation.
Greg is the founder and final creative authority.
ChatGPT may prepare, review, and refine this audit handoff.
Claude may execute this handoff only as a no-code repo audit. Claude may not edit files. Claude may not create files. Claude may not move files. Claude may not delete files. Claude may not rename files. Claude may not change load order. Claude may not patch bugs. Claude may not invent canon. Claude may not mark the repo ready without evidence.
Greg approves the next step after reviewing the audit.

## 3. AUDIT POSITION

This audit is the first implementation gate.
Before UNKSCAPE FOUNDATION code work begins, the current repo must be inspected.
The project must not assume: The current repo is clean. The current code follows Foundation rules. The current index.html is safe. The current namespace is correct. The current save logic is stable. The current inventory is real. The current XP is persistent. The current files are organized correctly. The current prototype can become Foundation by patching randomly.
Alpha 0.1 begins with proof. Proof begins with audit.

## 4. CORE AUDIT RULE

Inspect before editing.
Claude must read the repo, identify structure, classify risks, list blockers, and recommend the safest first implementation handoff.
Claude must not make changes. Claude must not clean up while auditing. Claude must not create a new architecture. Claude must not rewrite files. Claude must not say done without report-back. Claude must not guess if files are missing. If Claude lacks repo access or cannot inspect files, Claude must report what it needs from Greg.

## 5. AUDIT SCOPE

Included: Repo file tree, root directory, index.html, script loading, CSS loading, JavaScript files, current namespace, runtime startup path, game loop, player movement, camera, input, resource interaction, gathering, inventory, XP/progression, save/load, local storage usage, UI feedback, debug tools, assets, docs, registers if present, QA files if present, handoff files if present, prototype leftovers, public-facing page risk, GitHub Pages readiness risk.

Excluded: Code edits, bug fixes, refactors, new files, file movement, file deletion, repo restructuring, visual redesign, asset creation, canon creation, faction naming, combat/building/economy/multiplayer/private server/Steam implementation, public launch preparation.

## 6. CODE PERMISSION

Code Permission: REPO-WIDE AUDIT
Meaning: Claude may inspect and read files. Claude may report findings. Claude may recommend next steps. Claude may NOT edit, write, create, move, rename, or delete files. If Claude modifies anything, the audit fails.

## 7. CANON PERMISSION

Canon Permission: NO CANON CREATION
Approved terms: UNKWORKS™, UNKSCAPE, UNKSCAPE 2.0, UNKSCAPE FOUNDATION, Human, Orc, Dwarf, Elf, Warrior, Ranger, Mage, Builder, Rogue, Faction 1, Faction 2, Level 100, 23,000,000 XP, Quarter Century Challenge.
Forbidden: Faction names, region names, biome names, boss names, dungeon names, currency names, rarity names, realm names, lore, public slogans, symbols, launch claims.
If existing repo files contain unapproved canon, Claude must flag it.

## 8. RELATED FRAMEWORK FILES

Claude must align the audit against: 001 through 018A, 023, 027, 028, 029, and 030 framework files.
If Claude does not have these files, Claude must use the summarized task rules in the handoff and mark missing framework files as SOURCE NEEDED.

## 9. REQUIRED AUDIT QUESTIONS

### 9.1 Repo Structure
What files and folders exist at root? Is the root clean or cluttered? Are there duplicate entry points? Are prototype files mixed with production files? Are docs separated from runtime? Are assets separated? Are handoffs/registers/QA files present?

### 9.2 Entry Point
What file boots the game? Is index.html present? What scripts/CSS does it load? Does it expose internal docs publicly? Are there duplicate HTML pages that may confuse GitHub Pages?

### 9.3 Load Order
What scripts load first? Are dependencies loaded before dependent systems? Is load order documented? Are there missing or duplicate scripts? Are there script errors likely from load order?

### 9.4 Namespace
What global namespace does the project use? Is it consistent? Is there a legacy typo namespace? Are there random globals? Are systems attached safely? Are modules isolated?

### 9.5 Boot and Game Loop
Does the game appear to have a boot sequence? Is there a game loop? Is timing controlled? Is render separated from update? Is there debug visibility? Are errors visible or hidden?

### 9.6 Player, Input, and Camera
Is there a player object? Can the player move? How is input handled? Is camera logic present? Is input tied directly to rendering? Is movement save-aware or runtime-only?

### 9.7 World and Terrain
How is the world represented? Is there a starter slice? Is the world flat prototype-only? Are resources placed in the world? Are boundaries present? Are terrain/world definitions data-driven or hardcoded?

### 9.8 Resources and Gathering
Are resource nodes present? Are resource IDs used? Is gathering timed? Can clicking spam rewards? Does gathering validate distance or target? Does gathering grant item and XP? Are rewards source-tracked?

### 9.9 Inventory
Is inventory real or visual-only? Does inventory use item IDs? Does inventory store quantities? Does inventory save and reload? Can invalid items enter inventory? Is duplication possible?

### 9.10 XP and Progression
Is XP present? Is XP saved? Is XP visual-only? Are XP sources tracked? Does the project include Level 100 / 23,000,000 XP direction? Are XP values hardcoded or ledger-ready?

### 9.11 Save and Load
Is there Save Authority? Is localStorage used? Are direct storage writes scattered across files? Is save version present? Are world ID and character ID present? Does position persist? Does inventory persist? Does XP persist? Are invalid saves handled?

### 9.12 UI and Feedback
Does UI communicate interaction? Does UI communicate gathering? Does UI show item gained and XP gained? Does UI show save/load result? Does UI own state incorrectly? Does UI feel debug-only?

### 9.13 Assets and Visuals
Where are assets stored? Are assets tracked? Are placeholders labeled? Are there unapproved faction symbols? Unlicensed/unknown-source assets? Is visual style consistent? Are there public-facing assets that misrepresent the build?

### 9.14 Security and Future Authority
Are rewards traceable? Are inventory changes validatable? Are XP changes source-based? Are direct save writes a risk? Are multiplayer/PvP/trading systems present too early? Are credentials or secrets in the repo?

### 9.15 Public Exposure
Would GitHub Pages expose internal files? Are public-facing claims accurate? Are placeholders presented as final? Are internal prompts/docs linked from public UI? Are there secrets or private notes visible?

## 10. REQUIRED FINDING SEVERITY

| Severity | Meaning |
|---|---|
| S0 CRITICAL | Breaks boot, save/load, core progression, or causes data loss |
| S1 HIGH | Breaks Alpha 0.1 required function |
| S2 MEDIUM | Confusing, unstable, risky, or milestone-blocking if unresolved |
| S3 LOW | Minor issue or cleanup item |
| S4 NOTE | Observation or future improvement |

## 11. REQUIRED STATUS LABELS

PASS, PASS_WITH_NOTES, NEEDS_FIX, BLOCKED, SOURCE_NEEDED, PENDING_APPROVAL, DEFERRED, NOT_APPLICABLE, NOT_INSPECTED.
Claude must not assume pass. If a system cannot be inspected, mark NOT_INSPECTED or SOURCE_NEEDED.

## 12. REQUIRED AUDIT OUTPUT STRUCTURE

1. Audit Summary
2. Repo File Tree Observed
3. Entry Point and Load Order
4. Namespace Findings
5. Boot and Game Loop Findings
6. Player/Input/Camera Findings
7. World/Terrain Findings
8. Resource/Gathering Findings
9. Inventory Findings
10. XP/Progression Findings
11. Save/Load Findings
12. UI/Feedback Findings
13. Asset/Visual Findings
14. Docs/Register/Handoff Findings
15. Public Exposure and Credential Risk
16. Alpha 0.1 Readiness Table
17. Findings by Severity
18. S0/S1 Blockers
19. Files That Should Be Protected
20. Files That May Need Archive Review
21. Missing Required Files or Context
22. Recommended First Safe Patch
23. Recommended Next Handoff
24. Tests Claude Could Not Perform
25. Final Recommendation

If any section is not applicable: NOT_APPLICABLE. If not inspected: NOT_INSPECTED.

## 13. ALPHA 0.1 READINESS TABLE REQUIREMENT

| Alpha 0.1 Area | Current Status | Evidence | Risk | Recommended Action |
|---|---|---|---|---|
| Boot | | | | |
| Namespace | | | | |
| Load order | | | | |
| Game loop | | | | |
| Player spawn | | | | |
| Movement | | | | |
| Camera | | | | |
| Starter world | | | | |
| Resource node | | | | |
| Interaction prompt | | | | |
| Gathering timing | | | | |
| Item reward | | | | |
| Inventory persistence | | | | |
| XP reward | | | | |
| XP persistence | | | | |
| Save version | | | | |
| Character ID | | | | |
| World ID | | | | |
| UI feedback | | | | |
| Debug visibility | | | | |
| Performance risk | | | | |
| Security risk | | | | |
| Public exposure risk | | | | |

## 14. FILE PROTECTION REPORT REQUIREMENT

Claude must identify files that should be treated as protected, including: index.html, boot files, namespace files, load order files, save files, data definition files, progression files, inventory files, XP files, asset manifest files, public-facing pages, internal docs, register files, handoff files.
For each: file path, reason protected, risk if edited casually, recommended edit permission level.

## 15. ARCHIVE REVIEW REPORT REQUIREMENT

Claude must identify (but NOT archive) files that may belong in archive: old prototype files, duplicate HTML pages, backup scripts, test copies, rejected visual assets, old prompts, unused CSS, unlinked JS, unused images, legacy docs, broken experimental files.

## 16. FIRST SAFE PATCH RECOMMENDATION RULE

Claude must recommend exactly ONE first safe patch including: task title, why first, allowed files, forbidden files, code permission level, save impact, data/ID impact, UI/asset impact, security impact, performance impact, acceptance criteria.
If repo is too unstable, recommend a blocker resolution instead.

## 17. BLOCKER BEHAVIOR

If Claude cannot inspect the repo: report what access is missing, what files are needed, what cannot be determined, what Greg should provide, whether audit is blocked or partial.
If S0/S1 blockers found: list clearly and recommend resolving before implementation.
If secrets found: DO NOT print the secret value. Say: 'Credential or secret-like value detected.' Then identify file path and risk type only.

## 18. COPY-PASTE CLAUDE HANDOFF

```
HANDOFF ID: handoff_phase1_repo_audit_001
PROJECT: UNKWORKS™ / UNKSCAPE FOUNDATION
ROADMAP PHASE: Phase 1 — Foundation Shell / Pre-Implementation Audit
TARGET AI: Claude
TASK TITLE: Repo-wide Foundation readiness audit before Alpha 0.1 implementation
CODE PERMISSION: REPO-WIDE AUDIT
CANON PERMISSION: NO CANON CREATION

OBJECTIVE: Audit the current repository for UNKSCAPE FOUNDATION readiness before any Alpha 0.1 implementation begins. Inspect repo structure, entry point, load order, namespace, boot path, game loop, player movement, world/resource systems, gathering, inventory, XP, save/load behavior, UI feedback, assets, docs, public exposure risks, and prototype drift. Do not edit any files.

ALLOWED FILES: None for editing.
READ-ONLY FILES: Entire repo may be inspected.
FORBIDDEN FILES: All files are forbidden for editing. Do not create, move, rename, delete, or patch any files.

SCOPE: Inspect the current repo and produce a structured readiness report for Alpha 0.1.
OUT OF SCOPE: No implementation. No patches. No refactors. No repo restructuring. No file creation or deletion. No asset creation. No visual redesign. No canon creation. No faction naming. No combat, building, economy, multiplayer, private server, or Steam implementation.

REQUIRED RULES:
- Do not edit files.
- Do not invent canon.
- Do not expand scope.
- Do not create implementation patches.
- Do not change load order.
- Do not bypass Save Authority.
- Do not expose secrets if found.
- Do not claim readiness without evidence.
- If files or context are missing, mark SOURCE_NEEDED or NOT_INSPECTED.

AUDIT QUESTIONS: [See Section 9 of 030_alpha_0_1_repo_audit_handoff_pack.md for full question list]

REQUIRED OUTPUT STRUCTURE: [See Section 12 of 030_alpha_0_1_repo_audit_handoff_pack.md]

ALPHA 0.1 READINESS TABLE: [See Section 13 of 030_alpha_0_1_repo_audit_handoff_pack.md]

SEVERITY LABELS: S0 CRITICAL, S1 HIGH, S2 MEDIUM, S3 LOW, S4 NOTE
STATUS LABELS: PASS, PASS_WITH_NOTES, NEEDS_FIX, BLOCKED, SOURCE_NEEDED, PENDING_APPROVAL, DEFERRED, NOT_APPLICABLE, NOT_INSPECTED

BLOCKER BEHAVIOR: Report incomplete access. List S0/S1 blockers clearly. Flag secrets without exposing values. Recommend resolving blockers before implementation.

ACCEPTANCE CRITERIA:
- No files are edited.
- Audit includes all required sections.
- Alpha 0.1 readiness table completed.
- Findings listed by severity.
- S0/S1 blockers identified.
- Protected files identified.
- Archive candidates identified.
- Exactly one safest next handoff recommended.

REPORT BACK WITH: Required output structure above. No implementation patches. No file edits.
```

## 19. CLAUDE RESPONSE REVIEW CHECKLIST

After Claude returns the audit, ChatGPT must verify: Did Claude avoid editing files? Did Claude list inspected files? Did Claude identify entry point, load order, namespace, Save Authority? Did Claude identify direct storage writes, inventory/XP behavior, UI feedback, resource/gathering behavior? Did Claude identify S0/S1 blockers? Did Claude list protected files and archive candidates? Did Claude avoid exposing secrets? Did Claude recommend only one next controlled step? Did Claude avoid canon invention and implementation patches?
If any answer is no, the audit response needs revision.

## 20. EXPECTED NEXT HANDOFF TYPES AFTER AUDIT

20.1 Boot Fix Handoff — if game does not boot. Permission: SURGICAL PATCH ONLY.
20.2 Repo Structure Cleanup Plan — if structure is confusing but boot not broken. Permission: NO CODE or CODE DRAFT ONLY.
20.3 Namespace Stabilization Handoff — if namespace inconsistent. Permission: SURGICAL PATCH ONLY or FULL FILE REPLACEMENT.
20.4 Load Order Fix Handoff — if script order breaks runtime. Permission: SURGICAL PATCH ONLY.
20.5 Save Authority Planning Handoff — if persistence scattered or unsafe. Permission: NO CODE or CODE DRAFT ONLY first.
20.6 Alpha 0.1 Foundation Shell Handoff — if repo stable enough for Phase 1. Permission: Task-specific only.

## 21. AUDIT FAILURE CONDITIONS

The audit fails if Claude: edits/creates/deletes/moves/renames files, changes load order, provides patches instead of findings, invents canon, claims readiness without evidence, does not list files inspected, does not identify blockers, exposes secret values, recommends broad refactor without scope, gives vague output, does not provide readiness table.
If audit fails, Greg should not proceed to implementation from that output.

## 22. AUDIT PASS CONDITIONS

The audit passes if Claude: makes no file changes, inspects repo, reports all required areas, lists findings by severity, identifies S0/S1 blockers, identifies protected files and archive candidates, identifies missing source/context, recommends one next controlled handoff.
A passing audit does not mean the repo is production-ready. It means the repo has been inspected enough to choose the next safe step.

## 23. REGISTER UPDATES AFTER AUDIT

After audit, update or create if Greg approves: Claude Handoff Register, AI Output Register, Bug Register, Blocker Register, Roadmap Register, Dependency Gate Register, Master Source Register, Framework Status Register, Data and ID Register, Save Schema Register, Security Risk Register, Performance Register, QA Register.

## 24. FORBIDDEN ASSUMPTIONS

Audit Means Fix: FALSE. Existing Repo Is Foundation-Ready: FALSE. Claude Can Patch While Auditing: FALSE. Missing Framework Files Can Be Ignored: FALSE. Save Risk Can Wait: FALSE. Inventory Can Be Assumed Real: FALSE. XP Can Be Assumed Persistent: FALSE. Namespace Issues Are Minor: FALSE. Root Clutter Is Harmless: FALSE. Public Repo Means Internal Files Are Private: FALSE. Secrets Can Be Printed In Reports: FALSE. First Patch Can Be Big: FALSE.

## 25. AI GENERATION RULES

Reference as: 030_alpha_0_1_repo_audit_handoff_pack.md
Do not use as code permission. Use as first audit prompt. Do not edit during audit. Do not invent canon (mark SOURCE_NEEDED or PENDING_APPROVAL). Do not hide blockers. Do not expose secrets. Do not recommend broad implementation first. Respect Alpha scope (005), repo structure (029), Claude rules (017), QA rules (016).

## 26. PRODUCTION STANDARDS

Evidence Standard: Findings must cite observed files, observed behavior, or missing evidence.
No-Edit Standard: Audit must not change repo state.
Severity Standard: Use controlled severity labels.
Status Standard: Use controlled status labels.
Save Standard: Save/load risks identified clearly.
Data Standard: ID and data risks identified clearly.
Scope Standard: Audit must not drift into future systems.
Security Standard: Credentials and public exposure risks flagged.
Handoff Standard: Audit must recommend next controlled handoff.
Founder Standard: Greg must be able to understand repo condition, what is broken, and what should happen next.

## 27. APPROVAL RULES

Greg has final approval over: Sending the audit prompt, accepting the audit response, choosing the next handoff, approving first implementation patch, approving file boundaries, approving repo restructure, approving archive moves, approving protected file edits.
The audit may recommend a patch. The audit does not authorize that patch.
A separate handoff is required for: repo restructure, save work, and any implementation.

## 28. AUDIT CONTROL TABLE

| Audit Area | Required? | Status |
|---|---|---|
| Repo file tree | Yes | Required |
| Root file review | Yes | Required |
| Entry point review | Yes | Required |
| Load order review | Yes | Required |
| Namespace review | Yes | Required |
| Boot review | Yes | Required |
| Game loop review | Yes | Required |
| Input/player/camera review | Yes | Required |
| World/resource review | Yes | Required |
| Gathering review | Yes | Required |
| Inventory review | Yes | Required |
| XP review | Yes | Required |
| Save/load review | Yes | Required |
| UI feedback review | Yes | Required |
| Asset/visual review | Yes | Required |
| Docs/register/handoff review | Yes | Required |
| Public exposure review | Yes | Required |
| Credential risk review | Yes | Required |
| Alpha readiness table | Yes | Required |
| S0/S1 blocker list | Yes | Required |
| Protected file list | Yes | Required |
| Archive candidate list | Yes | Required |
| First safe patch recommendation | Yes | Required |
| File edits | No | Forbidden |
| Code patches | No | Forbidden |
| Canon creation | No | Forbidden |

## 29. CONNECTIONS TO OTHER FRAMEWORKS

030 connects to and operates under all preceding framework files 001-029.
Key connections: 003 engine/namespace inspection, 004 ID usage inspection, 005 Alpha 0.1 scope evaluation, 006 smallest playable loop check, 007 character/world identity check, 008 Save Authority audit, 009 resource/inventory/gathering behavior, 011 XP persistence check, 013 UI feedback check, 015 security and credential risk, 016 severity labels and readiness table, 017 controlled no-code task, 018A prototype carryover risk, 023 first Phase 1 gate, 028 first recommended Claude task from launch directive, 029 target repo structure for comparison.

## 30. FINAL AUDIT RULE

UNKSCAPE FOUNDATION implementation begins with inspection.

Do not patch first. Do not restructure first. Do not build features first. Do not trust prototype files blindly. Do not let Claude freestyle.

The first safe move is to audit the repo, identify the truth, expose blockers, protect files, and choose one controlled next handoff.

This audit protects Greg from building on messy ground.
This audit protects UNKWORKS™ from uncontrolled AI edits.
This audit protects UNKSCAPE FOUNDATION from prototype drift.
This audit protects Alpha 0.1 from starting broken.

Inspect first. Patch second. QA always. Greg approves the next move.
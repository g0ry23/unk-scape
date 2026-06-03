# 029_foundation_repo_structure_file_tree_framework.md

Version: Foundation v1.0
Status: ACTIVE FOUNDATION SOURCE FILE
Project: UNKWORKS™ / UNKSCAPE FOUNDATION
Purpose: Official Repository Structure, File Tree, Folder Governance, Runtime Separation, Documentation Placement, Asset Placement, GitHub Pages Readiness, and Implementation Organization Framework for UNKSCAPE FOUNDATION

## 1. FILE PURPOSE

This framework defines the official repository structure and file tree rules for UNKSCAPE FOUNDATION.
UNKWORKS™ is the studio. UNKSCAPE is Product #1. UNKSCAPE 2.0 is the R&D prototype branch. UNKSCAPE FOUNDATION is the production foundation build.
This file exists to prevent the production repo from becoming a scattered pile of scripts, duplicate files, old prototypes, loose assets, random AI-generated files, abandoned HTML pages, untracked documentation, and hidden implementation drift.
This file does not authorize code. This file does not create implementation patches. This file does not approve Claude to restructure the repo by itself.
This file defines how the repo must be structured before and during implementation.

## 2. PROJECT AUTHORITY

UNKWORKS™ is the studio. UNKSCAPE is Product #1. UNKSCAPE 2.0 is R&D only. UNKSCAPE FOUNDATION is the production foundation build.
Greg is the founder and final creative authority.
ChatGPT may design repo structure, prepare file tree plans, audit organization, and write Claude handoffs.
Claude may create, move, rename, delete, or edit files only through approved handoffs.
No AI builder may restructure the repo without approval. No AI builder may delete prototype files without approval. No AI builder may rename source files without approval. No AI builder may alter GitHub Pages entry files without approval. No AI builder may change load order without approval. No AI builder may introduce runtime files outside the approved structure.

## 3. REPO STRUCTURE POSITION

Repo structure is not cosmetic. Repo structure is production architecture.
A clean file tree protects: Build stability, Load order, Namespace control, Save authority, Asset tracking, Visual identity, Claude handoff safety, QA repeatability, GitHub Pages deployment, Future private server readiness, Future Steam readiness, Future multiplayer readiness, Future team onboarding, Quarter Century Challenge continuity.
A messy repo creates hidden bugs. A clean repo creates long-term leverage.

## 4. CORE REPO RULE

Every file must have a clear purpose, controlled location, ownership category, and edit permission.
No random root-level files. No duplicate competing entry points. No undocumented script sprawl. No mixed prototype and Foundation runtime. No asset files without tracking. No docs hidden inside runtime folders. No runtime code hidden inside docs folders. No save/data authority bypass files. No public-facing pages that misrepresent build status. No AI-generated files outside the approved tree.

## 5. REPO STRUCTURE PRINCIPLES

5.1 Separation of Purpose: Documentation, runtime code, data, assets, QA, handoffs, tools, and archives must be separated.
5.2 Stable Entry Point: The browser build must have a clear public entry point (index.html for GitHub Pages).
5.3 Controlled Runtime: Runtime code must live in approved runtime folders.
5.4 Data Discipline: Game data must live in data-specific folders with ID and database rules.
5.5 Asset Discipline: Assets must live in asset-specific folders and be tracked.
5.6 Source Authority Visibility: Framework and source files must be easy to find.
5.7 Prototype Separation: UNKSCAPE 2.0 files must not be mixed into Foundation runtime without review.
5.8 Deployment Safety: GitHub Pages public files must be controlled so internal docs, prompts, registers, or sensitive files are not accidentally exposed.

## 6. TOP-LEVEL REPO STRUCTURE

Recommended top-level structure:

```
/
  index.html
  README.md
  docs/
  client/
  data/
  assets/
  registers/
  qa/
  handoffs/
  tools/
  archive/
```

Status: STRUCTURE DIRECTION / IMPLEMENTATION APPROVAL REQUIRED
This is not a code patch. Claude may not create this file tree unless Greg approves implementation.

## 7. ROOT DIRECTORY RULES

Root purpose: Entry, repository orientation, deployment, and approved platform behavior only.
Allowed root files: index.html, README.md, LICENSE (if approved), .gitignore (if approved), GitHub Pages support files, public web manifest (if approved later), configuration files (if required later).
Root should NOT contain: Random test HTML files, old prototype backups, loose JS/CSS unless explicitly approved, loose images, AI prompt dumps, handoff drafts, untracked docs, temporary experiments, duplicate index files, unapproved public claims.
Rule: If a file does not need to be in root, it should not be in root.

## 8. DOCUMENTATION FOLDER

Official folder: docs/
Purpose: Stores official project source documentation.
Allowed contents: Foundation framework files, Visual Bible files, Build charter files, Roadmap files, Source index files, Studio operating files, AI Command Center files, Art direction files, Asset pipeline documentation, Public-safe documentation if approved.

Recommended structure:
```
docs/
  foundation/
  studio/
  visual/
  roadmap/
  source-index/
```

Docs rule: Docs are source authority. Docs do not authorize code unless explicitly containing an approved implementation handoff. Framework docs must not contain runtime code.

## 9. FOUNDATION DOCUMENTATION STRUCTURE

Recommended folder: docs/foundation/
Purpose: Stores the numbered UNKSCAPE FOUNDATION framework chain.
Required files: 001 through 029 framework files plus future additions.
File name rule: Framework file names must preserve numbering. No AI builder may rename numbered framework files without approval.

## 10. STUDIO DOCUMENTATION STRUCTURE

Recommended folder: docs/studio/
Required files: 024_unksworks_studio_operating_system_framework.md, 025_ai_command_center_multi_agent_studio_framework.md, 026_master_registers_ledgers_control_framework.md, 027_foundation_handoff_index_claude_prompt_library_framework.md.
Studio docs rule: Studio docs govern how UNKWORKS™ works. They do not replace UNKSCAPE product-specific framework files.

## 11. CLIENT RUNTIME FOLDER

Official runtime folder: client/
Purpose: Stores browser runtime code.

Recommended structure:
```
client/
  core/
  engine/
  systems/
  ui/
  state/
  save/
  data-runtime/
  debug/
```

Status: STRUCTURE DIRECTION / IMPLEMENTATION APPROVAL REQUIRED
Rule: Runtime JS, CSS, and browser-facing modules must live under client/ unless root placement is required by platform behavior.

## 12. CLIENT CORE STRUCTURE

Folder: client/core/
Purpose: Foundational runtime startup files — boot controller, namespace initializer, build/version info, runtime configuration bridge, error boundary, module registration.
Rule: client/core/ is HIGH-RISK. Claude may not edit core boot or namespace files without explicit approval.

## 13. CLIENT ENGINE STRUCTURE

Folder: client/engine/
Purpose: Engine-level systems — game loop, fixed timestep controller, renderer, camera, input abstraction, collision helpers, timing utilities, scene management if approved.
Rule: Engine files must not own gameplay-specific rewards, inventory, quest state, or save data. Engine supports gameplay. Gameplay systems own gameplay behavior.

## 14. CLIENT SYSTEMS STRUCTURE

Folder: client/systems/
Purpose: Gameplay systems.
Recommended subfolders: player/, world/, resources/, inventory/, progression/, crafting/, quests/, combat/, building/, economy/, factions/.
Alpha 0.1 active systems: player/, world/, resources/, inventory/, progression/ only. Others may exist as empty future folders only.
Rule: Gameplay systems must not bypass Save Authority. Must use stable IDs. Must not create random globals.

## 15. CLIENT UI STRUCTURE

Folder: client/ui/
Purpose: HUD, main menu, world/character selection, character creation, inventory display, progression display, interaction prompt, notifications, settings, debug overlay.
Rule: UI displays state. UI does not own gameplay state. UI may request actions. Systems validate actions.

## 16. CLIENT STATE STRUCTURE

Folder: client/state/
Purpose: Session state, runtime world/character state, event bus (if approved), action queue (if approved), temporary gameplay state.
Rule: Runtime state is not automatically save state. Persistent state must flow through Save Authority.

## 17. CLIENT SAVE STRUCTURE

Folder: client/save/ — PROTECTED
Purpose: Save Authority implementation — schema version, validation, save read/write controller, migration handlers, character/world/settings save handling, export/import if approved.
Rule: No random system may duplicate Save Authority outside this folder. No direct storage write should appear in unrelated systems.

## 18. DATA FOLDER

Official data folder: data/
Purpose: Static game definitions and controlled source data.

Recommended structure:
```
data/
  canon/
  gameplay/
  progression/
  world/
  resources/
  inventory/
  crafting/
  quests/
  npc/
  combat/
  building/
  economy/
  ui/
  tuning/
```

Status: STRUCTURE DIRECTION / IMPLEMENTATION APPROVAL REQUIRED
Rule: Data files must use stable IDs. Display names are not system authority. Data files must not contain runtime code unless explicitly approved.

## 19-23. DATA SUB-STRUCTURES

data/canon/ — Approved canon-controlled definitions (races, classes, faction placeholders, approved name maps, protected terms). Must match 001_locked_canon_names.md.
data/gameplay/ — Action types, interaction types, reward source types, shared gameplay categories. Must be ID-driven.
data/progression/ — XP, level, skill, unlock definitions. Must protect Level 100, 23,000,000 XP, Quarter Century Challenge.
data/resources/, data/inventory/, data/crafting/ — Resource/node/item/tool/stack/recipe definitions. Must support stable IDs, valid quantities, save/load, reward sources, anti-duplication, future server validation.
data/world/ — World, starter slice, region, biome, terrain, map, spawn definitions. Alpha 0.1 requires only a starter world slice. No massive map or final region/biome names.

## 24. ASSETS FOLDER

Official folder: assets/
Purpose: Game assets.

Recommended structure:
```
assets/
  images/
  ui/
  icons/
  textures/
  models/
  audio/
  animation/
  fonts/
  concepts/
  placeholders/
```

Asset rule: No asset becomes final without Asset ID, Source, License status, Placeholder status, Optimization status, Related system, and Approval status.

## 25-26. ASSET PLACEHOLDER AND CONCEPT RULES

Placeholders: assets/placeholders/ — must be clearly labeled, must not become final by accident, must not introduce unapproved canon.
Concepts: assets/concepts/ — AI-generated art, Firefly images, moodboards, logo explorations, style tests. Must not be loaded as final without review.

## 27. REGISTERS FOLDER

Official folder: registers/
Purpose: Registers, ledgers, control tables, tracking files.
Required registers: master_source_register.md, framework_status_register.md, canon_register.md, decision_register.md, roadmap_register.md, dependency_gate_register.md, blocker_register.md, bug_register.md, qa_register.md, claude_handoff_register.md, ai_output_register.md, data_id_register.md, save_schema_register.md, tuning_value_ledger.md, harvest_register.md, migration_register.md, asset_register.md, visual_approval_register.md, performance_register.md, security_risk_register.md, public_claim_register.md, expansion_register.md.
Rule: Registers may begin as Markdown. Spreadsheet conversion requires approval. No register may mark approval without Greg approval.

## 28. QA FOLDER

Official folder: qa/
Structure: test-cases/, reports/, bugs/, regression/, acceptance/
Rule: No milestone passes without QA evidence. QA files must be clear enough for Greg to review without reading source code.

## 29. HANDOFFS FOLDER

Official folder: handoffs/
Structure: claude/, gemini/, perplexity/, visual/, qa/, archive/
Rule: Every implementation handoff must be tracked. A handoff template is not implementation permission.

## 30. TOOLS FOLDER

Official folder: tools/
Rule: Tools must not be added casually. No tool may expose credentials. No tool may become required for basic browser play unless approved.

## 31. ARCHIVE FOLDER

Official folder: archive/
Structure: unkscape-2-rd/, deprecated-docs/, old-builds/, rejected-assets/, old-prompts/
Rule: Archived material is not production authority. AI builders may inspect only when task allows R&D review. Must not be copied into Foundation without harvest review.

## 32. PUBLIC VS INTERNAL FILE RULES

Public files (GitHub Pages accessible): index.html, client runtime files, public assets, approved public documentation.
Internal files: Framework drafts, handoffs, QA reports, registers, bug records, roadmap notes, prototype archives, decision logs, AI outputs, prompt libraries.
Rule: Before public release, review whether internal files are visible through GitHub Pages. Sensitive credentials must never be stored in the repo.

## 33. GITHUB PAGES RULES

Status: PLANNED / IMPLEMENTATION REVIEW REQUIRED
GitHub Pages typically serves index.html from configured branch/root or docs folder.
Risk: GitHub Pages may expose repository files depending on structure and links.
Rule: GitHub Pages deployment must serve the game, not the entire internal studio process as public product messaging.

## 34-35. FILE NAMING AND STATUS RULES

Naming: Use lowercase, descriptive names. Framework files preserve numbered names. Runtime files use clear system names.
Avoid: final_final.md, newnew.html, test2.js, copy.html, backup_latest.js, oldworking.js, claude_fixed_this.js.
File statuses: ACTIVE, LOCKED, DRAFT, REVIEW, PENDING APPROVAL, PLACEHOLDER, DEPRECATED, RETIRED, ARCHIVED, BLOCKED.

## 36. FILE EDIT PERMISSION LEVELS

OPEN: Can be edited under normal approved task scope.
CONTROLLED: Can be edited only with explicit handoff.
PROTECTED: Can be edited only with Greg approval and QA/review.
LOCKED: May not be edited unless Greg explicitly reopens it.
ARCHIVE ONLY: May be inspected but not edited for production.
Rule: Claude may not assume edit permission. Allowed files must always be stated in the handoff.

## 37-40. LOAD ORDER, NAMESPACE, SAVE, AND DATA FILE RULES

Load order files are PROTECTED. Any change must report current order, proposed order, reason, dependency impact, systems affected, risk, and QA tests required.
Namespace files are PROTECTED. Must follow 003_engine_and_namespace_rules.md. No random globals. No competing root namespace.
Save files are PROTECTED. Must follow 008, 015, 016. No direct persistence shortcuts in unrelated files. No save schema change without review.
Data files: Must follow 004. No display names as authority. No unapproved canon. No unexplained tuning values.

## 41. ASSET FILE RULES

Assets affect visual identity, performance, licensing, and public impression.
Must follow: 020_visual_bible.md, 021_asset_pipeline_bible.md, 022_art_director_rules.md.
Rule: No asset may be added as final without register tracking.

## 42. ALPHA 0.1 MINIMUM REPO SHAPE

Recommended minimum structure:
```
/
  index.html
  README.md
  client/
    core/  engine/  systems/  ui/  save/  debug/
  data/
    canon/  world/  resources/  inventory/  progression/  tuning/
  assets/
    placeholders/  ui/
  docs/
    foundation/  studio/
  registers/
  qa/
  handoffs/
  archive/
```
Status: RECOMMENDED / IMPLEMENTATION APPROVAL REQUIRED. This is a structural target. It does not authorize file creation.

## 43-45. REPO AUDIT, RESTRUCTURE, AND ARCHIVE RULES

Before restructuring: audit must identify current root files, entry point, scripts, CSS, assets, data, save behavior, namespace, load order, prototype leftovers, docs, public-facing risks, files to archive, protected files, missing files, and first safe implementation step.
Restructure is HIGH-RISK: Must define current structure, proposed structure, all moved/renamed/archived files, entry point/load order/save/asset path/GitHub Pages impact, QA plan, and rollback plan.
Archive rule: Archive old material without losing history. Deprecated files must record original purpose, reason, replacement, risk if reused, date, and approval. Do not delete useful history casually.

## 46. SECURITY AND CREDENTIAL RULES

Never commit: API keys, passwords, tokens, private keys, hosting credentials, Steamworks credentials, payment credentials, personal private information.
Secrets must not be stored in source files.
Do not paste secrets into Claude, ChatGPT, Gemini, or other AI tools unless an approved secure workflow exists.

## 47. FORBIDDEN ASSUMPTIONS

Repo Structure Can Wait: FALSE. Root Can Hold Everything: FALSE. Docs and Runtime Can Mix: FALSE. Prototype Files Can Stay Active Forever: FALSE. Assets Can Be Dropped Anywhere: FALSE. Claude Can Restructure Freely: FALSE. Load Order Changes Are Minor: FALSE. Save Files Can Be Edited Casually: FALSE. Internal Files Are Automatically Private: FALSE. File Names Do Not Matter: FALSE. Old Copies Are Harmless: FALSE. GitHub Pages Is Just Uploading Files: FALSE.

## 48. AI GENERATION RULES

Reference as: 029_foundation_repo_structure_file_tree_framework.md
Do not use as code permission. Audit before restructure. Do not claim files exist unless verified. Do not move files without approval. Do not rename frameworks. Do not change entry point casually. Do not change load order casually. Do not add untracked assets. Do not mix prototype and Foundation. Flag public exposure risk. Flag credential risk.

## 49. PRODUCTION STANDARDS

Organization Standard: Clean enough for a non-coder founder to navigate.
Source Standard: Official documents easy to locate.
Runtime Standard: Files separated by system purpose.
Data Standard: Stable IDs.
Save Standard: Protected.
Asset Standard: Tracked and separated by type/status.
QA Standard: Evidence and test results stored.
Handoff Standard: Copy-paste-ready and trackable.
Archive Standard: Old prototype files separated from active production.
Deployment Standard: GitHub Pages serves clean game entry.
Security Standard: No secrets in repo.
Continuity Standard: Structure supports years of growth.

## 50. APPROVAL RULES

Greg has final approval over: Repo structure, file tree changes, file creation, file deletion, file movement, file renaming, entry point changes, load order changes, archive decisions, public deployment structure, GitHub Pages configuration, asset placement, register placement.
Protected folders requiring approval: client/core/, client/save/, data/, assets/, docs/foundation/, registers/, qa/, handoffs/.
Archiving requires approval. Deletion requires stronger approval.
This file does not authorize implementation.

## 51. REPO STRUCTURE CONTROL TABLE

| Repo Area | Purpose | Status |
|---|---|---|
| / root | Entry and orientation only | Controlled |
| index.html | Browser/GitHub Pages entry point | Protected |
| README.md | Repo orientation | Controlled |
| docs/ | Source documentation | Required |
| docs/foundation/ | Numbered Foundation frameworks | Required |
| docs/studio/ | UNKWORKS™ studio frameworks | Required |
| client/ | Runtime browser code | Required |
| client/core/ | Boot/namespace/build identity | Protected |
| client/engine/ | Loop/render/input/camera | Controlled |
| client/systems/ | Gameplay systems | Controlled |
| client/ui/ | UI presentation | Controlled |
| client/save/ | Save Authority | Protected |
| client/debug/ | Debug and QA visibility | Controlled |
| data/ | Static definitions | Controlled |
| assets/ | Runtime and concept assets | Controlled |
| assets/placeholders/ | Placeholder assets | Controlled |
| registers/ | Registers and ledgers | Required |
| qa/ | QA evidence and reports | Required |
| handoffs/ | Claude and AI prompts | Required |
| tools/ | Approved utilities only | Pending |
| archive/ | R&D/deprecated material | Required |
| GitHub Pages config | Public deployment behavior | Protected |

## 52. CONNECTIONS TO OTHER FRAMEWORKS

This framework (029) connects to and is governed by all preceding framework files 001-028, plus connects forward to 030_alpha_0_1_repo_audit_handoff_pack.md which uses this structure as the target state for the first repo audit.

Key connections: 003 engine/namespace rules map to folder organization. 004 database/ID rules define where data files belong. 008 Save Authority maps to client/save/ protection. 015 security rules include credential and public exposure rules. 016 QA rules define qa/ folder contents. 017 Claude execution rules give Claude clear file boundaries. 020/021/022 visual/asset rules define asset folder structure. 023 roadmap aligns repo organization with production phases. 027 handoff index maps to handoffs/ folder.

## 53. FINAL REPO STRUCTURE RULE

UNKSCAPE FOUNDATION must not be built inside a messy repo.

The repo must be clean before it gets big.
Root must stay clean. Docs must be separated. Runtime must be separated. Data must be separated. Assets must be tracked. Registers must be visible. QA must be recorded. Handoffs must be stored. R&D must be archived. Save files must be protected. Load order must be controlled. GitHub Pages must be respected. No secrets may enter the repo. No AI builder may restructure without approval. No prototype file may govern production by accident.

The file tree must help Greg control the project without needing to be a coder.
The repo structure must support Alpha 0.1, future Foundation phases, private server readiness, Steam readiness, MMO expansion, future products, and the Quarter Century Challenge.

Clean structure first. Controlled implementation second. Proof before scale.
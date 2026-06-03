# 033 Alpha 0.1 QA Acceptance and Regression Handoff Pack

Version: Foundation v1.0 | Status: ACTIVE | Project: UNKWORKS / UNKSCAPE FOUNDATION

## Purpose

QA acceptance and regression pack for Alpha 0.1 core loop.
Applies after Phase 2 implementation. No code. No patches. Inspection only.
Greg approves QA milestone. Claude may not self-approve.

## QA Scope

Boot, namespace, save/load, spawn, movement, gathering, inventory, XP, anti-duplication, UI, security, performance, mobile-aware, multiplayer-readiness.

## Status Labels

PASS / PASS_WITH_NOTES / NEEDS_FIX / BLOCKED / SOURCE_NEEDED / NOT_INSPECTED

## Severity Labels

S0 CRITICAL / S1 HIGH / S2 MEDIUM / S3 LOW / S4 NOTE

## Code Permission

NO CODE

## Canon Permission

NO CANON CREATION

## QA Passes When

All S0/S1 items PASS or documented exception. Alpha 0.1 loop proven end-to-end. Save/load preserves inventory and XP. Anti-duplication confirmed. UI communicates correctly. No secrets exposed. Greg approves.

## QA Fails If

Player cannot spawn or move. Gathering duplicates. Inventory or XP corrupts. Save/load breaks. S0/S1 unresolved. Forbidden files modified.

## Approval Rules

Greg has final approval. Claude may not self-approve QA.
This file does not authorize implementation.
Implementation begins only when Greg specifically requests code, patches, file creation, file movement, repo actions, or Claude handoff instructions.

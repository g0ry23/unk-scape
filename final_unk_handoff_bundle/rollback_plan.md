# UNKSCAPE Rollback Plan

## Purpose

This document defines how to roll back any patch that breaks the game or introduces regressions.

---

## General Rollback Procedure

### Step 1 — Identify the broken commit

- Open GitHub: https://github.com/g0ry23/unk-scape/commits/main

- Find the commit that introduced the problem

- Note the commit SHA

---

### Step 2 — Revert via GitHub UI (preferred for single-file fixes)

1. Navigate to the affected file in the repo

2. Click History

3. Find the last known good commit for that file

4. Click the commit to view it

5. Click the `<>` button (Browse repository at this point)

6. Open the file and copy its content

7. Navigate back to the current file

8. Click Edit (pencil icon)

9. Replace content with the last-known-good version

10. Commit with message: `rollback: revert [filename] to pre-patch state`

---

### Step 3 — Bump version param in index.html

After reverting any JS file, increment its `?v=N` param in index.html so browsers load the reverted version.

Example:

```html

<!-- before rollback -->

<script src="client/engine/input.js?v=9"></script>

<!-- after rollback -->

<script src="client/engine/input.js?v=10"></script>

```

---

### Step 4 — Verify

- Hard refresh the live site (Ctrl+Shift+R)

- Confirm boot guard is gone

- Run QA smoke test from qa_review_checklist.md

- Confirm the regression is resolved

---

## Full Repo Revert (nuclear option)

If multiple files are broken and individual file rollback is not sufficient:

```bash

# Find the last good commit SHA from GitHub commit history

# Then revert via git:

git revert <broken-commit-sha>

# Or reset to last good commit (destructive — use only if necessary):

git reset --hard <last-good-commit-sha>

git push --force

```

Only use force-push with explicit owner approval.

---

## Save Data Safety

- Rollback of JS files does NOT affect localStorage save data

- Save keys (`unkscape:worlds`, `unkscape:saves`, `unkscape:active`) persist independently of code changes

- If a patch changed save key names or save schema, a save migration or save wipe may be needed — document this in the patch's rollback notes before executing

---

## Per-Patch Rollback Notes

Each patch in implementation_order.md should document its specific rollback steps here when executed.

Format:

```

### PATCH_XXX rollback

Files changed: [list]

Rollback: revert [file] to commit [SHA]

Version bumps needed: [list]

Save impact: [none / migration needed / wipe needed]

```

---

## Current Rollback Register

No patches executed yet. This section will be updated as patches are applied.

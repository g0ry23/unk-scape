# UNKSCAPE — Rollback Notes
## production_seed/rollback_notes.md

---

## Rollback Philosophy

Every patch must be reversible.
Before executing any patch, Claude must identify the rollback path.
If a patch cannot be safely rolled back, it must not be executed without explicit owner understanding of the risk.

---

## Rollback Procedures

### General Rollback — GitHub Revert

1. Navigate to: https://github.com/g0ry23/unk-scape/commits/main
2. Find the commit(s) from the patch to roll back
3. Click the commit, then click "Revert" (creates a new revert commit)
4. Or: Navigate to the file, click Edit, restore prior content, commit with message "rollback: [patch ID]"
5. Wait for GitHub Pages deployment
6. Verify live site boots clean

### localStorage Rollback

If a patch modified localStorage keys or data structures:
1. The user can open browser console and run: localStorage.clear()
2. Or selectively: localStorage.removeItem('unkscape:saves')
3. This resets all saves — characters will be lost
4. Only use as last resort

### Emergency Rollback Command

If the live game is broken and you need fast recovery:
```
// In GitHub, revert the bad commit(s)
// Or manually restore the files to their pre-patch state
```

---

## Rollback History

### Pre-Patch State — 2026-05-31

**Commit range:** World resize commits through handoff bundle documentation
**Status:** stable — last known good state
**Boot status:** clean
**Key commits:**
- World resize: tiles.js, classes.js, world_regions.js, mmoWorld.js, index.html
- Documentation bundle: final_unk_handoff_bundle/ (docs only, no runtime changes)

**If you need to roll back past the world resize:**
- Restore tiles.js to: WORLD = { w:2000, h:2000, pxW:64000, pxH:64000 } (old values)
- Restore classes.js spawn positions to old coordinates
- Restore world_regions.js region bounds
- Restore mmoWorld.js worldGridSize and zone classify
- Note: Any saves created after resize will have new coordinates

---

## Notes on Future Rollback Risk

| Patch | Rollback Risk | Why |
|-------|--------------|-----|
| FINAL_UNK_PATCH_011 | HIGH | Modifies save system — could corrupt saves |
| FINAL_UNK_PATCH_009 | HIGH | Extraction system — modifies inventory handling |
| FINAL_UNK_PATCH_014 | HIGH | Bugfix pass — touches multiple systems |
| FINAL_UNK_PATCH_004A | MEDIUM | World size runtime — player positions affected |
| Others | LOW-MEDIUM | Documentation/data additions, more reversible |

---

*New rollback entries will be added here after each patch execution.*

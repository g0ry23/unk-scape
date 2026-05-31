# UNKSCAPE — Core Identity
## game_bible_seed/001_core_identity.md

---

## Official Public Name

**UNKSCAPE**

Optional visual/logo variant: **UNK-SCAPE**

Use UNKSCAPE as the primary written brand in all documentation, UI text, filenames, and code comments.

---

## Runtime Engine Identity

| Field | Value |
|-------|-------|
| Engine Type | Custom browser-based WebGL 3D engine |
| Language | Vanilla JavaScript |
| Hosting | GitHub Pages compatible |
| Visual Style | Low-poly retro fantasy MMORPG |
| Runtime Namespace | window.UNKSCAPE |

### Canonical Module Pattern

```javascript
(function() {
  "use strict";
  const U = window.UNKSCAPE = window.UNKSCAPE || {};
})();
```

---

## Protected localStorage Keys

```
unkscape:saves
unkscape:worlds
```

These keys must never be renamed, cleared, or migrated without explicit owner approval.

---

## Backup Engine Note

Godot may be kept as a future backup plan only.
Do NOT add Godot files, res:// paths, .gd scripts, or Godot scene assumptions to this repo.

---

## Core Game Genre Identity

UNKSCAPE is an original medieval fantasy survival-sandbox MMORPG combining old-school grind-heavy MMO progression, large open-world travel, skill-heavy progression, economy-heavy gameplay, rare loot hunting, faction pressure, player claim/build zones, survival pressure, PvE extraction-style dungeons, quest-heavy progression, and low-poly retro fantasy visuals modernized with better lighting, terrain, UI, audio, and atmosphere.

---

## Originality Requirement

UNKSCAPE must not copy names, maps, monsters, logos, races, icons, questlines, items, or protected terms from existing games.

---

## Internal Naming Standards

- Runtime namespace: window.UNKSCAPE aliased as US inside IIFEs
- 3D engine: window.UnkScape3D aliased as E inside render_3d.js
- NEVER: D2, window.D2, D2.game (legacy namespace — fully purged)

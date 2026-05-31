# UNKSCAPE QA Review Checklist

## Purpose

This checklist must be run after every patch before marking it complete and before starting the next patch.

---

## Boot Check

- [ ] Game loads without Boot Guard appearing

- [ ] No console errors on page load

- [ ] No TypeError or ReferenceError in console

- [ ] Script versions in index.html match deployed files

---

## Namespace Check

- [ ] All runtime references use `window.UnkScape` or `US` alias

- [ ] No `D2` or `D.` references anywhere in changed files

- [ ] No `window.D2` references anywhere in changed files

---

## Save / Load Check

- [ ] LocalStorage keys unchanged: `unkscape:worlds`, `unkscape:saves`, `unkscape:active`

- [ ] Existing save data loads without error

- [ ] Player position loads correctly after save/load cycle

- [ ] Inventory loads correctly after save/load cycle

- [ ] Skills load correctly after save/load cycle

---

## World / Map Check

- [ ] `US.WORLD.w` = 500

- [ ] `US.WORLD.h` = 400

- [ ] `US.WORLD.pxW` = 16000

- [ ] `US.WORLD.pxH` = 12800

- [ ] `US.TILE` = 32

- [ ] Player spawns at a valid in-bounds position

- [ ] Player cannot walk outside world bounds

---

## Player Movement Check

- [ ] WASD movement works

- [ ] Player moves in correct direction relative to camera angle

- [ ] Player does not fall through world or teleport

- [ ] Sprint works (shift key)

- [ ] Player collides with solid tiles (water, wall, fence, roof)

---

## HUD Check

- [ ] Health bar visible and updates live

- [ ] Zoom % chip updates as camera zooms in/out

- [ ] Activity log shows events immediately

- [ ] Status chips (hunger, build mode, faction, quest) display correctly

- [ ] Hotbar renders and slot 1-5 keyboard shortcuts work

- [ ] Hotbar mouse click selects correct slot

---

## Camera Check

- [ ] Camera follows player

- [ ] Zoom in/out works (scroll wheel or = / - keys)

- [ ] Camera orbit/rotation works

- [ ] Zoom % on HUD matches actual zoom level

---

## Smoke Test — New Game

- [ ] Create new character (name typing works, letters + numbers)

- [ ] Select class — character creation wizard completes without error

- [ ] World generates without hanging or error

- [ ] Player spawns on terrain (not void, not in water)

- [ ] Activity log shows boot message

- [ ] Hotbar shows starting items

---

## Smoke Test — Existing Game

- [ ] Load existing save from character select screen

- [ ] Player loads at saved position

- [ ] Inventory items preserved

- [ ] Skills preserved

- [ ] Quest state preserved

---

## Gathering Check (Woodcutting baseline)

- [ ] Trees visible near player

- [ ] Left-click tree starts woodcutting action

- [ ] Woodcutting XP awarded on gather

- [ ] Log added to inventory

- [ ] Tree respawns after cooldown

---

## Script Load Order Check

After any change to index.html:

- [ ] Three.js loads before render_3d.js

- [ ] render_3d.js loads before game.js

- [ ] tiles.js loads before worldgen.js

- [ ] classes.js loads before worldgen.js

- [ ] worldgen.js loads before game.js

- [ ] entities/player.js loads before game.js

- [ ] All systems load before main.js

- [ ] main.js is last script

---

## Notes

- Run this checklist in browser console + visual inspection after every patch.

- If any item fails, stop and report before continuing to next patch.

- Do not mark a patch as complete until all applicable items pass.

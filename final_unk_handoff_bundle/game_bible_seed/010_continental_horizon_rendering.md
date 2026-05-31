# UNKSCAPE — Continental Horizon Rendering
## game_bible_seed/010_continental_horizon_rendering.md

---

## The No Floating Block Rule

UNKSCAPE must not look like a tiny floating terrain slab hovering in a void.

This is a hard visual mandate.

---

## Rendering Strategy — Three Ring System

| Ring | Distance | Detail Level | Purpose |
|------|---------|-------------|---------|
| Near gameplay ring | 0-200 tiles | Full detail | Active gameplay, collision, interaction |
| Mid visual ring | 200-500 tiles | Medium detail | Visual context, silhouettes |
| Far proxy ring | 500+ tiles | Very low detail | Horizon fill, no gameplay |

---

## Sky and Atmosphere Layer

The sky layer exists above all rings and must never be:
- Pure black void
- Empty alpha
- Default browser background color

The sky should use:
- Sky gradient (dawn/day/dusk/night states)
- Cloud/smoke silhouettes
- Atmospheric haze at horizon
- Color mass representing distant geography

---

## Horizon Fill Techniques

To prevent floating island appearance, use any combination of:

- Fog gradient that fades geometry into atmosphere
- Terrain skirts (extra geometry at map edges that slopes into haze)
- Distant mountains (far proxy low-poly mountains at horizon)
- Far tree silhouettes (billboard or low-poly trees)
- Ocean or land continuation color masses
- Horizon silhouettes (city, castle, forest outlines)
- Biome color patches at distance

---

## What Must Never Be Visible

- The edge of the gameplay tile grid as a visible drop-off
- Empty black/void area at map edges
- The underside of the terrain
- A hard horizon line where terrain simply ends

---

## Rendering Priority

This document describes visual targets for Batch B (visual fixes).
Implementation details live in the patch prompts.

Do not implement horizon rendering changes until FINAL_UNK_PATCH_013 is approved.

---

## Related Current Issues

As of Alpha 0.1 pre-Batch B:
- Sky is pure black
- Terrain defaults to single grey color
- Resources/props float above ground due to Y-position issues

These are documented issues queued for Batch B implementation.

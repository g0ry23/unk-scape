# UNKSCAPE — Animation, Audio, and Terrain Mandate
## game_bible_seed/009_animation_audio_terrain_mandate.md

---

## Animation State Hooks

These animation states should be supported as hooks/metadata.
Do not implement final animations until approved animation system exists.

### Movement States
- idle
- walk
- run
- sprint

### Combat States
- melee_attack
- ranged_attack
- block
- hit_react
- death_down

### Skill States
- mining
- woodcutting
- fishing
- cooking
- smithing
- crafting
- herbalism_gather
- alchemy_mix
- farming_plant
- farming_harvest
- hunting_track
- building_place
- repair

### Interaction States
- loot_open
- bank_interact
- vendor_interact
- quest_talk
- extraction_channel

---

## Audio Direction

### Audio Categories

- ui (button clicks, menu sounds)
- inventory (pick up, place, equip)
- banking (vault sounds, coin sounds)
- vendors (transaction sounds)
- skills (gather, craft, mine, chop sounds)
- survival (hunger warning, eat, drink)
- combat (hit, block, death, level up)
- environment (wind, rain, day/night, birds)
- extraction (dungeon ambience, warning sounds)
- quest (accept, complete, fail)
- level_up (skill level, total level)

### Blood Oath Audio Feel
- Drums
- Fire crackle
- Rough leather
- Bone/rattle accents
- Field chants
- Ritual atmosphere

### Highborn Audio Feel
- Bells
- Stone hall reverb
- Clean metal
- Legal/holy atmosphere
- Controlled military rhythm

### Hearthvale Audio Feel
- Wind over fields
- River water
- Birds
- Market chatter
- Tools hitting wood/stone
- Campfires
- Distant forge
- Dungeon warning sounds

---

## Terrain Standards

### Terrain Visual Goals
- Ground must not look like a floating slab
- Biome color masses should be visible at distance
- Terrain should feel grounded in the world, not floating above void
- Height variation should suggest landscape, not blocks

### Forbidden Terrain Approaches
- Single-color flat grey expanse with no visual context
- Pure black sky/fog void visible at horizon
- Floating island appearance (edges of map visible as drop-offs)
- All terrain same height with no variation

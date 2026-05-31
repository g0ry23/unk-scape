# UNKSCAPE — World Architecture
## game_bible_seed/004_world_architecture.md

---

## Official Surface World

| Field | Value |
|-------|-------|
| World ID | world_surface_age_one |
| Size | 16,000 x 12,800 pixels |
| Tile Size | 32 pixels |
| Tile Count | 500 x 400 tiles |
| Scale Approx | 2 meters per tile |
| Total Area | ~32km x 25.6km = ~819.2 km2 |

---

## Coordinate System

Origin: top-left (0, 0)
World center: pixel (8000, 6400) = tile (250, 200)

**Fast travel to center (console command):**
```javascript
US.game.player.x = 8000; US.game.player.y = 6400;
```

---

## Chunk System

| Chunk Type | Size |
|-----------|------|
| Gameplay chunk | 64 x 64 tiles |
| Macro region | 128 x 128 tiles |
| Full world | 500 x 400 tiles |

---

## World Generation Rules

**DO NOT:**
- Generate the full world at once
- Create one giant map JSON
- Spawn all resources across the full world
- Spawn all NPCs globally

**DO:**
- Use coordinate foundation
- Stream chunks near player
- Use lightweight metadata
- Simulate near-player only

---

## Rendering Rings

| Ring | Purpose |
|------|---------|
| Near gameplay ring | Full detail — active tiles around player |
| Mid visual ring | Lower detail — visible but not interactive |
| Far proxy ring | Very low detail — silhouettes only |
| Sky/fog/horizon | Atmosphere layer — no geometry |

---

## Biome Planning (Future)

Hearthvale Fields is the Alpha 0.1 biome.
Future biomes are locked until their race realm is approved.

---

## Movement Bounds

Player must be clamped to world bounds:
- X: 0 to 16,000 (pixels)
- Y: 0 to 12,800 (pixels)

Player must never walk off-map into void.

---

## Save/Load Position

Player position saves as pixel coordinates.
On load, position must be validated as in-bounds.
If out-of-bounds, respawn to world center (8000, 6400).

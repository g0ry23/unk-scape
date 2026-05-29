/**
 * UNK-SCAPE Boundless MMO Survival World Generator & Projection Engine
 * Architecture Namespace: window.UnkScape.World
 * Implementation Path: client/world/mmoWorld.js
 *
 * UPDATE F: Regional Map Zoning + Harvest XP Integration
 *
 * ZONE LAYOUT (absolute tile coordinates):
 *
 *  [0,0] ──────────────────────────────────────── [2048,0]
 *   | CAPITAL TOWN HUB (0–120, 0–120)                    |
 *   |   Houses, market square, guard posts, safe zone    |
 *   | HARVEST SECTOR A: Oak + Copper (120–300, 0–300)    |
 *   |   Dense oak trees, copper rock nodes, fish ponds   |
 *   | HARVEST SECTOR B: Yew + Iron (300–500, 0–500)      |
 *   |   Mid-tier yew trees, iron ore, foraging herbs     |
 *   | BUFFER ZONE (400–500 all sides) ─ transition belt  |
 *   | WILDERNESS (500+, 500+) ─ corrupted hostile lands  |
 *   |   Corrupted structures, gold/mithril ore, enemy    |
 *   |   spawn coords: Orc Warriors, Rogue Elves, Bosses  |
 *  [0,2048] ────────────────────────────── [2048,2048]
 */
((U) => {
U.World = {

// Master parameters
worldGridSize: 2048,
chunkSize: 32,
loadedChunks: {},
grid: {},

// ── ZONE BOUNDARY CONSTANTS ───────────────────────────────────────────────
ZONES: {
  CAPITAL:    { x0:   0, y0:   0, x1: 120, y1: 120, name: 'Unkhold Capital',   safe: true  },
  HARVEST_A:  { x0: 120, y0:   0, x1: 300, y1: 300, name: 'Greenwood Reach',   safe: true  },
  HARVEST_B:  { x0: 300, y0:   0, x1: 500, y1: 500, name: 'Ironveil Thicket',  safe: true  },
  BUFFER:     { x0: 400, y0: 400, x1: 500, y1: 500, name: 'Ashfall Border',     safe: true  },
  WILDERNESS: { x0: 500, y0: 500, x1:2048, y1:2048, name: 'The Corrupted Wilds', safe: false }
},

// Enemy spawn registry populated during wilderness chunk generation
// Format: [ { x, y, type, tier, zone } ]
mobSpawns: [],

// Biome palette per region
biomes: {
  capital:    { ground: '#2a2240', accent: '#4a3b5c', name: 'Unkhold Capital'   },
  harvestA:   { ground: '#1e2e1a', accent: '#2f5628', name: 'Greenwood Reach'   },
  harvestB:   { ground: '#1c2a1c', accent: '#3a4a2a', name: 'Ironveil Thicket'  },
  buffer:     { ground: '#2c2820', accent: '#4a3820', name: 'Ashfall Border'    },
  wilderness: { ground: '#1a0e0e', accent: '#3d1a1a', name: 'The Corrupted Wilds' }
},

init() {
  this.mobSpawns = [];
  console.log('[UNK-SCAPE] Regional Zoning Engine online. 5 territory sectors mapped.');
},

/**
 * classifyZone(absoluteX, absoluteY)
 * Returns a zone key string based on tile coordinates.
 */
classifyZone(ax, ay) {
  if (ax < 120 && ay < 120)           return 'capital';
  if (ax < 300 && ay < 300)           return 'harvestA';
  if (ax < 500 && ay < 500)           return 'harvestB';
  if (ax >= 500 && ay >= 500)         return 'wilderness';
  return 'buffer';
},

/**
 * isoProject: World Space -> 2.5D Screen Space
 */
isoProject(worldX, worldY, worldZ = 0, camera) {
  const tileWidth  = 64;
  const tileHeight = 32;
  const wallHeight = 44;
  const isoX = (worldX - worldY) * (tileWidth  / 2);
  const isoY = (worldX + worldY) * (tileHeight / 2);
  const cx = camera ? camera.offsetX : (window.innerWidth  / 2);
  const cy = camera ? camera.offsetY : (window.innerHeight / 2);
  return { x: isoX + cx, y: isoY - (worldZ * wallHeight) + cy };
},

/**
 * updateLoadedChunks: streams a 3x3 chunk window around the player.
 */
updateLoadedChunks(playerX, playerY) {
  const currentChunkX = Math.floor(playerX / this.chunkSize);
  const currentChunkY = Math.floor(playerY / this.chunkSize);
  let newChunks = {};
  for (let cx = -1; cx <= 1; cx++) {
    for (let cy = -1; cy <= 1; cy++) {
      const tcx = currentChunkX + cx;
      const tcy = currentChunkY + cy;
      const key = tcx + '_' + tcy;
      if (tcx < 0 || tcy < 0 ||
          tcx * this.chunkSize >= this.worldGridSize ||
          tcy * this.chunkSize >= this.worldGridSize) continue;
      newChunks[key] = this.loadedChunks[key] ||
                       this.generateProceduralChunk(tcx, tcy);
    }
  }
  this.loadedChunks = newChunks;
  try {
    localStorage.setItem('unkscape:worlds', JSON.stringify({
      lastChunkX: currentChunkX, lastChunkY: currentChunkY
    }));
  } catch(e) {}
},

/**
 * generateProceduralChunk(chunkX, chunkY)
 *
 * Regional Zoning Laws:
 *  CAPITAL    (abs 0-120,0-120)  : house grids, guard posts, market square
 *  HARVEST_A  (abs 120-300)      : oak trees, copper rocks, fishing ponds
 *  HARVEST_B  (abs 300-500)      : yew trees, iron ore, foraging herbs
 *  BUFFER     (abs 400-500)      : transitional scrubland
 *  WILDERNESS (abs 500+,500+)    : corrupted ruins, gold/mithril ore,
 *                                   mob spawn registration
 */
generateProceduralChunk(chunkX, chunkY) {
  const chunkData = [];
  const W = this;

  for (let lx = 0; lx < this.chunkSize; lx++) {
    chunkData[lx] = [];
    for (let ly = 0; ly < this.chunkSize; ly++) {
      const ax = chunkX * this.chunkSize + lx; // absolute tile X
      const ay = chunkY * this.chunkSize + ly; // absolute tile Y

      // ── Multi-octave elevation noise (kept for terrain variety) ──
      const n0 = Math.sin(ax * 0.11) * Math.cos(ay * 0.11);
      const n1 = Math.sin(ax * 0.23 + 1.7) * Math.cos(ay * 0.19 - 0.5);
      const n2 = Math.sin(ax * 0.47) * Math.cos(ay * 0.43);
      const elev = n0 * 0.55 + n1 * 0.30 + n2 * 0.15;
      // Flatten elevation inside capital for easy navigation
      const zone = W.classifyZone(ax, ay);
      let z = 0;
      if (zone !== 'capital') {
        if      (elev > 0.72) z = 3;
        else if (elev > 0.48) z = 2;
        else if (elev > 0.22) z = 1;
      }

      const biome = W.biomes[zone];
      let structure = null;
      let nodeHint  = null; // passed to gather system: 'oak'|'copper'|'yew'|'iron'|'fish'|'herb'|'gold'|'mithril'
      let enemyHint = null; // passed to AI spawn: 'orc_warrior'|'rogue_elf'|'mini_boss'
      let tileColor = biome.ground;

      // ────────────────────────────────────────────────────────────────────────
      // ZONE A: CAPITAL TOWN HUB (0–120 x 0–120)
      // ────────────────────────────────────────────────────────────────────────
      if (zone === 'capital') {
        tileColor = '#2e2444'; // cobblestone purple-grey town ground

        // Market square: central 20x20 plaza at abs 50-70, 50-70
        if (ax >= 50 && ax < 70 && ay >= 50 && ay < 70) {
          tileColor = '#f5d87a'; // gold cobble market square
          // Market stall pillars at corners
          if ((ax === 51||ax===68) && (ay===51||ay===68)) {
            structure = { type:'wall', material:'market_pillar', hp:9999, safe:true };
          }
        }

        // House grid: 6x6 house blocks placed on a 10-tile grid
        // Houses in rows 5-45 and cols 5-45 (outer ring of capital)
        const hgx = ax % 12, hgy = ay % 12;
        if (ax >= 5 && ax < 110 && ay >= 5 && ay < 110 &&
            ax < 48 || ax > 72) { // skip market square
          // House wall perimeter: tiles on edge of each 12x12 block
          if ((hgx === 0 || hgx === 11 || hgy === 0 || hgy === 11) &&
               ax % 24 < 12) { // alternate rows get houses
            structure = { type:'wall', material:'wood_house', hp:9999, safe:true };
            tileColor = '#5c3d1e'; // wood-brown wall
          }
        }

        // Guard posts: 4 cardinal positions around market
        if ((ax===40&&ay===60)||(ax===80&&ay===60)||(ax===60&&ay===40)||(ax===60&&ay===80)) {
          structure = { type:'wall', material:'guard_post', hp:9999, safe:true, isGuardPost:true };
          tileColor = '#7f8c8d'; // stone guard tower
        }

        // Capital gate (south exit toward Harvest A)
        if (ax >= 55 && ax < 65 && ay === 119) {
          structure = null; // clear gate tiles
          tileColor = '#8B7355'; // dirt path gate
        }
      }

      // ────────────────────────────────────────────────────────────────────────
      // ZONE B: HARVEST SECTOR A — Greenwood Reach (120-300, 0-300)
      // Dense oak trees, copper rocks, fishing ponds (safe, low-level)
      // ────────────────────────────────────────────────────────────────────────
      else if (zone === 'harvestA') {
        tileColor = '#1f3318'; // dark forest floor

        // Oak tree clusters: spawn on noise peaks in rows, z==0 only
        if (z === 0 && n0 > 0.52) {
          structure = { type:'tree', resource:'oak', hp:100, xpReward:25,
                        skill:'woodcutting', toolReq:'stone_hatchet',
                        item:'log', zoneName:'Greenwood Reach' };
          nodeHint = 'oak';
          tileColor = '#0e200c';
        }
        // Copper rock veins: every 8-tile modular grid strip
        else if (z === 0 && ax % 8 === 3 && ay % 8 === 3 && n1 > 0.3) {
          structure = { type:'rock', resource:'copper', hp:150, xpReward:17,
                        skill:'mining', toolReq:'iron_pickaxe',
                        item:'copper_ore', zoneName:'Greenwood Reach' };
          nodeHint = 'copper';
          tileColor = '#2a3322';
        }
        // Fishing ponds: small water patches every 24 tiles
        else if (ax % 24 >= 10 && ax % 24 <= 14 && ay % 24 >= 10 && ay % 24 <= 14) {
          structure = { type:'fish', resource:'fish', hp:50, xpReward:14,
                        skill:'foraging', toolReq:null,
                        item:'raw_fish', zoneName:'Greenwood Reach' };
          nodeHint = 'fish';
          tileColor = '#163060'; // water blue
        }
      }

      // ────────────────────────────────────────────────────────────────────────
      // ZONE C: HARVEST SECTOR B — Ironveil Thicket (300-500, 0-500)
      // Yew trees (lv20+), iron ore, foraging herbs (mid-tier)
      // ────────────────────────────────────────────────────────────────────────
      else if (zone === 'harvestB') {
        tileColor = '#1a2a15';

        // Yew trees: dense clusters, requires woodcutting lv20
        if (z === 0 && n0 > 0.40) {
          structure = { type:'tree', resource:'yew', hp:220, xpReward:52,
                        skill:'woodcutting', toolReq:'iron_axe',
                        item:'yew_log', zoneName:'Ironveil Thicket' };
          nodeHint = 'yew';
          tileColor = '#0c1a0a';
        }
        // Iron ore seams: placed on grid with noise variation
        else if (z === 0 && ax % 6 === 0 && ay % 6 === 0 && n1 > 0.2) {
          structure = { type:'rock', resource:'iron', hp:200, xpReward:35,
                        skill:'mining', toolReq:'iron_pickaxe',
                        item:'iron_ore', zoneName:'Ironveil Thicket' };
          nodeHint = 'iron';
          tileColor = '#222a22';
        }
        // Herb foraging patches
        else if (z === 0 && ax % 11 === 5 && ay % 11 === 5) {
          structure = { type:'herb', resource:'herb', hp:40, xpReward:10,
                        skill:'foraging', toolReq:null,
                        item:'herb', zoneName:'Ironveil Thicket' };
          nodeHint = 'herb';
          tileColor = '#1a2c18';
        }
      }

      // ────────────────────────────────────────────────────────────────────────
      // ZONE D: BUFFER — Ashfall Border (400-500 transition belt)
      // Sparse scrubland, no structured resource nodes
      // ────────────────────────────────────────────────────────────────────────
      else if (zone === 'buffer') {
        tileColor = '#2c2418'; // parched ash ground
        // Occasional dead tree stumps
        if (z === 0 && n0 > 0.68) {
          structure = { type:'wall', material:'dead_tree', hp:60, safe:true };
          tileColor = '#1a1208';
        }
      }

      // ────────────────────────────────────────────────────────────────────────
      // ZONE E: WILDERNESS — The Corrupted Wilds (500+, 500+)
      // Corrupted ruins, high-tier ore, enemy mob spawns
      // Deeper = more dangerous (distance from 500,500 increases tier)
      // ────────────────────────────────────────────────────────────────────────
      else if (zone === 'wilderness') {
        const depth = Math.max(ax - 500, ay - 500); // 0 at border, grows inward
        tileColor = '#160a0a'; // corrupted dark red-black

        // Corrupted ruin walls: jagged ruined base compounds
        if (z === 0 && n0 < -0.60) {
          structure = { type:'wall', material:'corrupted_ruin', hp:800, safe:false };
          tileColor = '#2a0f0f';
        }
        // Gold ore: appears 100+ tiles into wilderness
        else if (z === 0 && depth >= 100 && ax % 9 === 4 && ay % 9 === 4 && n1 > 0.25) {
          structure = { type:'rock', resource:'gold', hp:300, xpReward:65,
                        skill:'mining', toolReq:'steel_pickaxe',
                        item:'gold_ore', zoneName:'The Corrupted Wilds' };
          nodeHint = 'gold';
          tileColor = '#1f1500';
        }
        // Mithril ore: deep wilderness only (300+ tiles in)
        else if (z === 0 && depth >= 300 && ax % 13 === 6 && ay % 13 === 6 && n2 > 0.3) {
          structure = { type:'rock', resource:'mithril', hp:450, xpReward:105,
                        skill:'mining', toolReq:'mithril_pickaxe',
                        item:'mithril_ore', zoneName:'The Corrupted Wilds' };
          nodeHint = 'mithril';
          tileColor = '#0d0a1a';
        }
        // Enemy mob spawn registration (does NOT place a structure, just records coord)
        // Orc Warriors: 0-500 deep
        if (z === 0 && !structure && depth < 500 && ax % 18 === 0 && ay % 18 === 0) {
          enemyHint = 'orc_warrior';
          W.mobSpawns.push({ x: ax, y: ay, type:'orc_warrior', tier:1+Math.floor(depth/200), zone:'wilderness' });
        }
        // Rogue Elves: 200-700 deep
        else if (z === 0 && !structure && depth >= 200 && depth < 700 &&
                 ax % 22 === 11 && ay % 22 === 11) {
          enemyHint = 'rogue_elf';
          W.mobSpawns.push({ x: ax, y: ay, type:'rogue_elf', tier:2+Math.floor(depth/300), zone:'wilderness' });
        }
        // Regional Mini-Boss: very deep (800+ deep), 1 per large sector
        else if (z === 0 && !structure && depth >= 800 && ax % 64 === 0 && ay % 64 === 0) {
          enemyHint = 'mini_boss';
          W.mobSpawns.push({ x: ax, y: ay, type:'mini_boss', tier:5, zone:'wilderness_deep' });
        }
      }

      chunkData[lx][ly] = {
        color:      tileColor,
        z:          z,
        zone:       zone,
        structure:  structure,
        nodeHint:   nodeHint,   // resource type hint for gather system
        enemyHint:  enemyHint,  // mob type hint for AI spawn system
        safe:       zone !== 'wilderness',
        zoneName:   (W.biomes[zone] || W.biomes.buffer).name
      };
    }
  }
  return chunkData;
}
};

// Boot the world module immediately
U.World.init();

})(window.UnkScape = window.UnkScape || {});

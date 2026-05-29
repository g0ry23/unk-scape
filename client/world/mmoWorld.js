/**
 * UNK-SCAPE Boundless MMO Survival World Generator & Projection Engine
 * Architecture Namespace: window.UnkScape.World
 * Implementation Path: client/world/mmoWorld.js
 */
((U) => {
U.World = {

// Master parameters matching the scale of Albion and Rust
worldGridSize: 2048, // Massive 2048x2048 tile map coordinate domain
chunkSize: 32, // Subdivided into 32x32 manageable micro-grids
loadedChunks: {}, // Active processing buffer memory pool
grid: {}, // Global accessor link proxy

// Environmental Survival Biome Settings
biomes: {
wasteland: { ground: "#3d3d3d", wall: "#575757", name: "The Ashen Scumlands" },
mysticForest: { ground: "#1e1b29", wall: "#4a3b5c", name: "The Whispering Grove" },
ironboundVale: { ground: "#2c3e50", wall: "#7f8c8d", name: "Iron-Crown Accord Demesne" }
},

init() {
console.log("[UNK-SCAPE] Massive 2K Survival World Vector Domain initialized.");
},

/**
 * Transforms World Space (X, Y, Z) into tilted OSRS/Albion 2.5D Screen Space
 */
isoProject(worldX, worldY, worldZ = 0, camera) {
const tileWidth = 64;
const tileHeight = 32;
const wallHeight = 44;

// Mathematical diamond tilt transformation matrix
const isoX = (worldX - worldY) * (tileWidth / 2);
const isoY = (worldX + worldY) * (tileHeight / 2);

const cx = camera ? camera.offsetX : (window.innerWidth / 2);
const cy = camera ? camera.offsetY : (window.innerHeight / 2);

return {
x: isoX + cx,
y: isoY - (worldZ * wallHeight) + cy
};
},

/**
 * Dynamically tracks player coordinates and streams chunks into memory.
 * Prevents low-end devices from crashing on the massive 2048x2048 map.
 */
updateLoadedChunks(playerX, playerY) {
const currentChunkX = Math.floor(playerX / this.chunkSize);
const currentChunkY = Math.floor(playerY / this.chunkSize);

let newChunks = {};

// Stream a 3x3 grid of active regional chunks centered on the survivor
for (let cx = -1; cx <= 1; cx++) {
for (let cy = -1; cy <= 1; cy++) {
const targetChunkX = currentChunkX + cx;
const targetChunkY = currentChunkY + cy;
const chunkKey = `${targetChunkX}_${targetChunkY}`;

// Out of bounds safety check
if (
targetChunkX < 0 || targetChunkY < 0 ||
targetChunkX * this.chunkSize >= this.worldGridSize ||
targetChunkY * this.chunkSize >= this.worldGridSize
) {
continue;
}

// Fetch existing chunk or trigger fresh generation sweep
if (this.loadedChunks[chunkKey]) {
newChunks[chunkKey] = this.loadedChunks[chunkKey];
} else {
newChunks[chunkKey] = this.generateProceduralChunk(targetChunkX, targetChunkY);
}
}
}

// Dump chunks that fell out of view range to free memory
this.loadedChunks = newChunks;

// Persist world state under UnkScape namespace key
try { localStorage.setItem('unkscape:worlds', JSON.stringify({ lastChunkX: currentChunkX, lastChunkY: currentChunkY })); } catch(e) {}
},

/**
 * Procedural Sandbox Generation with true 2.5D elevation
 * Hills, cliffs, and tiered plateaus seeded from multi-octave noise.
 * When z > 0, render.js applies 44px-per-unit vertical side-wall extrusion
 * giving the terrain OSRS/Albion stepped cliff thickness.
 */
generateProceduralChunk(chunkX, chunkY) {
let chunkData = [];

// Choose biome environment based on large coordinate sectors
let activeBiome = this.biomes.mysticForest;
if (chunkX > 32) activeBiome = this.biomes.ironboundVale;
if (chunkY > 32) activeBiome = this.biomes.wasteland;

for (let x = 0; x < this.chunkSize; x++) {
chunkData[x] = [];
for (let y = 0; y < this.chunkSize; y++) {
const absoluteX = (chunkX * this.chunkSize) + x;
const absoluteY = (chunkY * this.chunkSize) + y;

// Multi-octave noise: base terrain + fine detail layer
const noiseBase = Math.sin(absoluteX * 0.1) * Math.cos(absoluteY * 0.1);
const noiseMid = Math.sin(absoluteX * 0.23 + 1.7) * Math.cos(absoluteY * 0.19 - 0.5);
const noiseFine = Math.sin(absoluteX * 0.47) * Math.cos(absoluteY * 0.43);
// Combined elevation value -1..1
const elevRaw = noiseBase * 0.55 + noiseMid * 0.30 + noiseFine * 0.15;

// Map to stepped plateau tiers (OSRS-style cliff levels)
// z=0: flatland, z=1: low hill, z=2: high plateau, z=3: cliff peak
let z = 0;
if (elevRaw > 0.72) z = 3; // cliff peak
else if (elevRaw > 0.48) z = 2; // high plateau
else if (elevRaw > 0.22) z = 1; // low hill
// z stays 0 for flatlands and valleys

let structureData = null;
// Spawn tactical world obstacles only on flat ground
if (z === 0 && noiseBase > 0.7) {
structureData = { type: 'tree', hp: 100 };
} else if (z === 0 && noiseBase < -0.75) {
structureData = { type: 'wall', hp: 500 }; // Ruined base compounds
}

chunkData[x][y] = {
color: activeBiome.ground,
z: z, // Elevation drives wall extrusion height in render.js
structure: structureData,
zoneName: activeBiome.name
};
}
}

return chunkData;
}
};

// Boot the world module immediately
U.World.init();

})(window.UnkScape = window.UnkScape || {});

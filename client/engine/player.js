/**
 * UNK-SCAPE Player Controller, Spawn Handler, and Vector Physics Engine
 * Architecture Namespace: window.UnkScape.Player
 * Implementation Path: client/engine/player.js
 *
 * UPDATE E: Skills & Tools Database
 * - UnkScape.Player.skills → default schema: { level:1, xp:0, nextLevelXp:83 }
 *   for all 7 core skills. OSRS exponential curve via D.xpForLevel().
 * - UnkScape.Player.TOOL_TIERS → dictionary mapping tool item IDs to
 *   the minimum skill level required to equip/use them.
 * - UnkScape.Player.canUseTool(itemId, playerSkills) helper → returns
 *   true if the player meets the level requirement.
 */
((U) => {
U.Player = {

// High-fidelity character start defaults
x: 15.0,
y: 15.0,
z: 0.0,
speed: 0.12,
radius: 0.35,
isMoving: false,
name: 'Survivor',
factionColor: '#2980b9',

// Character Core Stat Tracking Pools
stats: {
hp: 100,
maxHp: 100,
stamina: 100,
maxStamina: 100,
mana: 50,
maxMana: 50
},

// ── SKILLS DATABASE SCHEMA ───────────────────────────────────────────────
// Default runtime state for every player at character creation.
// level and nextLevelXp are recalculated live from xp via D.levelForXp()
// and D.xpForLevel() which use the OSRS exponential curve:
//   xpForLevel(n) = floor( sum_{i=1}^{n-1}( i + 300 * 2^(i/7) ) / 4 )
// These defaults boot with Level 1 = 0 xp, nextLevelXp = 83 (OSRS table)
skills: {
combat:     { level: 1, xp: 0, nextLevelXp: 83 },
woodcutting:{ level: 1, xp: 0, nextLevelXp: 83 },
mining:     { level: 1, xp: 0, nextLevelXp: 83 },
cooking:    { level: 1, xp: 0, nextLevelXp: 83 },
crafting:   { level: 1, xp: 0, nextLevelXp: 83 },
foraging:   { level: 1, xp: 0, nextLevelXp: 83 },
survival:   { level: 1, xp: 0, nextLevelXp: 83 }
},

// ── TOOL TIER REQUIREMENT DICTIONARY ──────────────────────────────────────────
// Maps equipment item ID → { skill, level } minimum requirement.
// Checked at gather/attack time via canUseTool() below.
// Woodcutting tiers follow classic OSRS axe progression.
// Mining tiers follow OSRS pickaxe progression.
// Combat weapon tiers follow classic OSRS metal order.
TOOL_TIERS: {
// ── Woodcutting Axes ──
bronze_axe:   { skill: 'woodcutting', level: 1  },
stone_hatchet:{ skill: 'woodcutting', level: 1  }, // alias for starter hatchet
iron_axe:     { skill: 'woodcutting', level: 10 },
steel_axe:    { skill: 'woodcutting', level: 21 }, // Mithril tier equiv
mithril_axe:  { skill: 'woodcutting', level: 21 },
adamant_axe:  { skill: 'woodcutting', level: 31 },
rune_axe:     { skill: 'woodcutting', level: 41 },
dragon_axe:   { skill: 'woodcutting', level: 61 },
// ── Mining Pickaxes ──
bronze_pickaxe:  { skill: 'mining', level: 1  },
iron_pickaxe:    { skill: 'mining', level: 1  }, // starter mining tool
steel_pickaxe:   { skill: 'mining', level: 21 },
mithril_pickaxe: { skill: 'mining', level: 21 },
adamant_pickaxe: { skill: 'mining', level: 31 },
rune_pickaxe:    { skill: 'mining', level: 41 },
dragon_pickaxe:  { skill: 'mining', level: 61 },
// ── Combat Weapons (melee) ──
crude_sword:    { skill: 'combat', level: 1  },
bronze_sword:   { skill: 'combat', level: 1  },
iron_sword:     { skill: 'combat', level: 10 },
steel_sword:    { skill: 'combat', level: 20 },
mithril_sword:  { skill: 'combat', level: 30 },
adamant_sword:  { skill: 'combat', level: 40 },
rune_sword:     { skill: 'combat', level: 50 },
dragon_sword:   { skill: 'combat', level: 60 },
// ── Ranged Bows ──
training_bow:   { skill: 'combat', level: 1  },
short_bow:      { skill: 'combat', level: 1  },
long_bow:       { skill: 'combat', level: 20 },
magic_bow:      { skill: 'combat', level: 50 },
// ── Mage Staves ──
oak_staff:      { skill: 'combat', level: 1  },
ember_staff:    { skill: 'combat', level: 20 },
chaos_staff:    { skill: 'combat', level: 40 },
// ── Crafting Tools ──
needle:         { skill: 'crafting', level: 1  },
chisel:         { skill: 'crafting', level: 1  },
hammer:         { skill: 'crafting', level: 1  },
furnace_tongs:  { skill: 'crafting', level: 10 },
anvil_hammer:   { skill: 'crafting', level: 20 },
// ── Cooking Utensils ──
cooking_pot:    { skill: 'cooking', level: 1  },
cooking_range:  { skill: 'cooking', level: 5  },
baking_tray:    { skill: 'cooking', level: 10 },
pie_dish:       { skill: 'cooking', level: 20 }
},

// ── HELPER: canUseTool(itemId, playerSkills) ────────────────────────────────
// Returns true if playerSkills meets or exceeds the tool's level requirement.
// playerSkills should be the live player.skills object from the game instance.
// Usage: UnkScape.Player.canUseTool('dragon_axe', game.player.skills)
canUseTool(itemId, playerSkills) {
const req = this.TOOL_TIERS[itemId];
if (!req) return true; // no requirement entry → always usable
const skillEntry = playerSkills && playerSkills[req.skill];
if (!skillEntry) return false;
// Use live level field if already calculated, else derive from xp
const D = window.Duskfall;
const playerLevel = skillEntry.level ||
(D && D.levelForXp ? D.levelForXp(skillEntry.xp || 0) : 1);
return playerLevel >= req.level;
},

// ── addXp(skillKey, amount, playerSkills) ─────────────────────────────────────
// Adds XP to a skill slot and recalculates level + nextLevelXp in-place.
// Returns true if a level-up occurred.
// Usage: UnkScape.Player.addXp('woodcutting', 25, game.player.skills)
addXp(skillKey, amount, playerSkills) {
const slot = playerSkills && playerSkills[skillKey];
if (!slot) return false;
slot.xp = (slot.xp || 0) + amount;
const D = window.Duskfall;
if (!D || !D.levelForXp || !D.xpForLevel) return false;
const newLevel = D.levelForXp(slot.xp);
const leveledUp = newLevel > (slot.level || 1);
slot.level = newLevel;
slot.nextLevelXp = D.xpForLevel(newLevel + 1);
return leveledUp;
},

// ── Physics update tick ──
/**
 * Physics update tick executed on fixed-timestep loop (fixedDt = 1/60)
 */
update(world) {
if (!U.Engine || !U.Engine.Input) return;

const vector = U.Engine.Input.getMovementVector();

if (vector.x === 0 && vector.y === 0) {
this.isMoving = false;
return;
}

this.isMoving = true;

let moveAmountX = vector.x * this.speed;
let moveAmountY = vector.y * this.speed;

let potentialX = this.x + moveAmountX;
if (!this.checkWallCollision(potentialX, this.y, world)) {
this.x = potentialX;
}

let potentialY = this.y + moveAmountY;
if (!this.checkWallCollision(this.x, potentialY, world)) {
this.y = potentialY;
}
},

/**
 * Wall collision detector against mmoWorld chunk structural data
 */
checkWallCollision(targetX, targetY, world) {
if (targetX < 0 || targetX >= world.sizeX || targetY < 0 || targetY >= world.sizeY) {
return true;
}

const checkPoints = [
{ x: targetX - this.radius, y: targetY - this.radius },
{ x: targetX + this.radius, y: targetY - this.radius },
{ x: targetX - this.radius, y: targetY + this.radius },
{ x: targetX + this.radius, y: targetY + this.radius }
];

for (let i = 0; i < checkPoints.length; i++) {
const tileX = Math.floor(checkPoints[i].x);
const tileY = Math.floor(checkPoints[i].y);

if (!world.grid || !world.grid[tileX] || !world.grid[tileX][tileY]) {
continue;
}

const tile = world.grid[tileX][tileY];

if (tile.structure && tile.structure.type === 'wall') {
return true;
}
}

return false;
}
};

})(window.UnkScape = window.UnkScape || {});

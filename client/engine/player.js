/**
 * engine/player.js -- DEMOLITION (Phase 2)
 * UnkScape.Player ghost twin REMOVED.
 * Kept: UnkScape.Engine.Input (WASD key store used by entities/player.js axis())
 * Kept: UnkScape.Player.TOOL_TIERS + canUseTool (used by gathering system)
 * Namespace: window.UnkScape (U) -- this file stays U because gathering.js
 * already calls window.UnkScape.Player.canUseTool. Rename to D is a later job.
 */
((U) => {

// ── WASD key store -- ONE keydown/keyup store via D.Input._onKeyDown/Up
// getMovementVector() is called by entities/player.js -> game.input.axis()
// Phase 3 will fold this into D.Input.axis() directly and remove this block.
U.Engine = U.Engine || {};
U.Engine.Input = {
  keys: { KeyW: false, KeyA: false, KeyS: false, KeyD: false },
  init() {
    // Phase 3 replaces this with D.Input internal handling.
    // Kept as stub so game.js init does not crash on U.Engine.Input.init()
    console.log("[Input] UnkScape.Engine.Input.init() stub -- Phase 3 will remove this");
  },
  getMovementVector() {
    // Read from D.Input.keys instead of own key store.
    // This is a bridge -- Phase 3 will fold axis() into D.Input directly.
    var D = window.UnkScape;
    var inp = D && D.game && D.game.input;
    if (!inp) return { x: 0, y: 0 };
    var k = inp.keys || {};
    var mx = 0, my = 0;
    if (k.a || k.arrowleft)  mx -= 1;
    if (k.d || k.arrowright) mx += 1;
    if (k.w || k.arrowup)    my -= 1;
    if (k.s || k.arrowdown)  my += 1;
    if (mx !== 0 && my !== 0) {
      var len = Math.sqrt(mx * mx + my * my);
      mx /= len; my /= len;
    }
    return { x: mx, y: my };
  }
};

// ── Tool tier requirements -- used by gathering._checkToolPermission()
U.Player = {
  TOOL_TIERS: {
    bronze_axe:      { skill: "woodcutting", level: 1  },
    stone_hatchet:   { skill: "woodcutting", level: 1  },
    iron_axe:        { skill: "woodcutting", level: 10 },
    steel_axe:       { skill: "woodcutting", level: 21 },
    mithril_axe:     { skill: "woodcutting", level: 21 },
    adamant_axe:     { skill: "woodcutting", level: 31 },
    rune_axe:        { skill: "woodcutting", level: 41 },
    dragon_axe:      { skill: "woodcutting", level: 61 },
    bronze_pickaxe:  { skill: "mining", level: 1  },
    iron_pickaxe:    { skill: "mining", level: 1  },
    steel_pickaxe:   { skill: "mining", level: 21 },
    mithril_pickaxe: { skill: "mining", level: 21 },
    adamant_pickaxe: { skill: "mining", level: 31 },
    rune_pickaxe:    { skill: "mining", level: 41 },
    dragon_pickaxe:  { skill: "mining", level: 61 },
    crude_sword:     { skill: "combat", level: 1  },
    bronze_sword:    { skill: "combat", level: 1  },
    iron_sword:      { skill: "combat", level: 10 },
    steel_sword:     { skill: "combat", level: 20 },
    training_bow:    { skill: "combat", level: 1  },
    oak_staff:       { skill: "combat", level: 1  }
  },
  canUseTool(itemId, playerSkills) {
    var req = this.TOOL_TIERS[itemId];
    if (!req) return true;
    var slot = playerSkills && playerSkills[req.skill];
    if (!slot) return false;
    var D = window.UnkScape;
    var lvl = slot.level || (D && D.levelForXp ? D.levelForXp(slot.xp || 0) : 1);
    return lvl >= req.level;
  }
};

})(window.UnkScape = window.UnkScape || {});

// Ghost twin properties REMOVED: x, y, z, speed, stats, skills, isMoving,
// update(world), checkWallCollision, addXp -- all were dead / disconnected.

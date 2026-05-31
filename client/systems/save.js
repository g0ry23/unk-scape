(function(){
const US = window.UnkScape = window.UnkScape || {};

// === SAVE SYSTEM v3 — UnkScape canonical namespace, _migrateInventory fixed ===
// Storage keys are namespaced to avoid collisions
// unkscape:worlds → { worldId: { id, name, created } }
// unkscape:saves  → [ { worldId, characterId, ... } ]
// unkscape:active → { worldId, characterId } (last played)
// Legacy key 'unkscape.save.v1' is migrated on first load

US.SAVE_VERSION = '0.4.0';

US.SaveSystem = function(game) {
  this.game = game;
  this.keys = {
    worlds: 'unkscape:worlds',
    saves:  'unkscape:saves',
    active: 'unkscape:active',
    legacy: 'unkscape.save.v1'
  };
  this._migrateLegacy();
};

// ── helpers ──────────────────────────────────────────
US.SaveSystem.prototype._read = function(k) {
  try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; }
};
US.SaveSystem.prototype._write = function(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
};

// ── migrate old single-save format ───────────────────
US.SaveSystem.prototype._migrateLegacy = function() {
  const raw = this._read(this.keys.legacy);
  if (!raw) return;
  const worldId = 'world_legacy';
  const charId  = 'char_legacy';
  const worlds  = this._read(this.keys.worlds) || {};
  const saves   = this._read(this.keys.saves)  || [];
  if (!worlds[worldId]) {
    worlds[worldId] = { id: worldId, name: 'Legacy Realm', created: Date.now() };
    this._write(this.keys.worlds, worlds);
  }
  if (!saves.find(s => s.worldId === worldId && s.characterId === charId)) {
    saves.push(Object.assign({}, raw, {
      saveVersion: US.SAVE_VERSION,
      worldId, worldName: 'Legacy Realm',
      characterId: charId, characterName: raw.characterName || 'Survivor',
      timestamp: Date.now()
    }));
    this._write(this.keys.saves, saves);
    this._write(this.keys.active, { worldId, characterId: charId });
  }
  localStorage.removeItem(this.keys.legacy);
};

// ── inventory migration: ensure tools always present ─
US.SaveSystem.prototype._migrateInventory = function(saveData) {
  if (!saveData || !saveData.inventory) return saveData;
  var TOOLS = ['stone_hatchet', 'iron_pickaxe'];
  TOOLS.forEach(function(tool) {
    if (!saveData.inventory[tool] || saveData.inventory[tool] < 1) {
      saveData.inventory[tool] = 1;
    }
  });
  return saveData;
};

// ── world helpers ─────────────────────────────────────
US.SaveSystem.prototype.getAllWorlds = function() {
  return this._read(this.keys.worlds) || {};
};
US.SaveSystem.prototype.getSavesForWorld = function(worldId) {
  const all = this._read(this.keys.saves) || [];
  return all.filter(s => s.worldId === worldId);
};
US.SaveSystem.prototype.getAllSaves = function() {
  return this._read(this.keys.saves) || [];
};

// ── compile current game state ────────────────────────
US.SaveSystem.prototype.data = function() {
  const g = this.game, p = g.player;
  if (!p) return null;
  return {
    saveVersion: US.SAVE_VERSION,
    worldId:     g.worldId || (this._read(this.keys.active)||{}).worldId || 'world_001',
    worldName:   g.worldName || 'Unnamed Realm',
    characterId: p.characterId || (this._read(this.keys.active)||{}).characterId || 'char_001',
    characterName: p.characterName || 'Survivor',
    factionId: p.factionId,
    raceId:    p.raceId || 'human',
    classId:   p.classId,
    seed:      g.seed,
    time:      g.time,
    flags:     g.flags,
    stats:     g.stats,
    level:     p.characterLevel || 1,
    xp:        p.characterXp   || 0,
    position:  { x: Math.round(p.x), y: Math.round(p.y) },
    player: {
      hp:              p.hp,
      hunger:          p.hunger,
      equipment:       p.equipment,
      skills:          p.skills,
      perks:           p.perks,
      characterXp:     p.characterXp,
      characterLevel:  p.characterLevel,
      attributePoints: p.attributePoints,
      attributes:      p.attributes,
      role:            p.role,
      raceId:          p.raceId || 'human',
      customization:   p.customization || {}
    },
    inventory:       g.systems.inventory.toSave(),
    bank:            g.systems.bank.toSave(),
    quests:          g.systems.quests.toSave(),
    resources:       { depleted: g.entities.resources.filter(r => r.amount <= 0).map(r => r.uid) },
    arrowsOnGround:  g.arrowsOnGround || [],
    timestamp:       Date.now()
  };
};

// ── save ──────────────────────────────────────────────
US.SaveSystem.prototype.save = function() {
  const state = this.data();
  if (!state) return;
  const worlds = this.getAllWorlds();
  if (!worlds[state.worldId]) {
    worlds[state.worldId] = { id: state.worldId, name: state.worldName, created: Date.now() };
    this._write(this.keys.worlds, worlds);
  }
  const saves = this.getAllSaves();
  const idx   = saves.findIndex(s => s.worldId === state.worldId && s.characterId === state.characterId);
  if (idx >= 0) saves[idx] = state; else saves.push(state);
  this._write(this.keys.saves, saves);
  this._write(this.keys.active, { worldId: state.worldId, characterId: state.characterId });
  this.game.ui.toast('Saved', state.characterName + ' in ' + state.worldName, 'good');
};

// ── autosave (silent) ─────────────────────────────────
US.SaveSystem.prototype.autosave = function() {
  if (this.game.state === 'play' && this.game.player && !this.game.player.dead) {
    const state = this.data();
    if (!state) return;
    const saves = this.getAllSaves();
    const idx   = saves.findIndex(s => s.worldId === state.worldId && s.characterId === state.characterId);
    if (idx >= 0) saves[idx] = state; else saves.push(state);
    this._write(this.keys.saves, saves);
    this._write(this.keys.active, { worldId: state.worldId, characterId: state.characterId });
  }
};

// ── load ──────────────────────────────────────────────
US.SaveSystem.prototype.load = function(worldId, characterId) {
  if (!worldId) {
    const active = this._read(this.keys.active);
    if (!active) return null;
    worldId     = active.worldId;
    characterId = active.characterId;
  }
  const saves = this.getAllSaves();
  var found   = saves.find(s => s.worldId === worldId && s.characterId === characterId) || null;
  return found ? this._migrateInventory(found) : null;
};

// ── delete one character save ─────────────────────────
US.SaveSystem.prototype.deleteCharacter = function(worldId, characterId) {
  let saves = this.getAllSaves();
  saves = saves.filter(s => !(s.worldId === worldId && s.characterId === characterId));this._write(this.keys.saves, saves);const _active = this._read(this.keys.active);if (_active && _active.worldId === worldId && _active.characterId === characterId) { const _next = saves[0]; this._write(this.keys.active, _next ? {worldId:_next.worldId,characterId:_next.characterId} : null); }
  if (!saves.some(s => s.worldId === worldId)) {
    const worlds = this.getAllWorlds();
    delete worlds[worldId];
    this._write(this.keys.worlds, worlds);
  }
};

// ── delete entire world ───────────────────────────────
US.SaveSystem.prototype.deleteWorld = function(worldId) {
  let saves = this.getAllSaves();
  saves = saves.filter(s => s.worldId !== worldId);
  this._write(this.keys.saves, saves);
  const worlds = this.getAllWorlds();
  delete worlds[worldId];
  this._write(this.keys.worlds, worlds);
};

// ── legacy compat: delete() wipes active save ─────────
US.SaveSystem.prototype.delete = function() {
  const active = this._read(this.keys.active);
  if (active) this.deleteCharacter(active.worldId, active.characterId);
};





})();

(function(){
  const D = window.Duskfall = window.Duskfall || {};

 // === SAVE SYSTEM v2 — Multi-World, Multi-Character ===
 // Storage keys are namespaced to avoid collisions
 // unkscape:worlds  → { worldId: { id, name, created } }
 // unkscape:saves   → [ { worldId, characterId, ... } ]
 // unkscape:active  → { worldId, characterId }  (last played)
 // Legacy key 'unkscape.save.v1' is migrated on first load

 D.SAVE_VERSION = '0.4.0';

 D.SaveSystem = function(game) {
     this.game = game;
     this.keys = {
           worlds:  'unkscape:worlds',
           saves:   'unkscape:saves',
           active:  'unkscape:active',
           legacy:  'unkscape.save.v1'
     };
     this._migrateLegacy();
 };

 // ── helpers ──────────────────────────────────────────
 D.SaveSystem.prototype._read = function(k) {
     try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; }
 };
  D.SaveSystem.prototype._write = function(k, v) {
      localStorage.setItem(k, JSON.stringify(v));
  };

 // ── migrate old single-save format ───────────────────
 D.SaveSystem.prototype._migrateLegacy = function() {
     const raw = this._read(this.keys.legacy);
     if (!raw) return;
     // wrap legacy data into the new multi-save format
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
                   saveVersion: D.SAVE_VERSION,
                   worldId, worldName: 'Legacy Realm',
                   characterId: charId, characterName: raw.characterName || 'Survivor',
                   timestamp: Date.now()
           }));
           this._write(this.keys.saves, saves);
           this._write(this.keys.active, { worldId, characterId: charId });
     }
     localStorage.removeItem(this.keys.legacy);
 };

 // ── world helpers ─────────────────────────────────────
 D.SaveSystem.prototype.getAllWorlds = function() {
     return this._read(this.keys.worlds) || {};
 };
  D.SaveSystem.prototype.getSavesForWorld = function(worldId) {
      const all = this._read(this.keys.saves) || [];
      return all.filter(s => s.worldId === worldId);
  };
  D.SaveSystem.prototype.getAllSaves = function() {
      return this._read(this.keys.saves) || [];
  };

 // ── compile current game state ────────────────────────
 D.SaveSystem.prototype.data = function() {
     const g = this.game, p = g.player;
     if (!p) return null;
     return {
           saveVersion:   D.SAVE_VERSION,
           worldId:       g.worldId       || 'world_001',
           worldName:     g.worldName     || 'Unnamed Realm',
           characterId:   p.characterId   || 'char_001',
           characterName: p.characterName || 'Survivor',
           factionId:     p.factionId,
           raceId:        p.raceId        || 'human',
           classId:       p.classId,
           seed:          g.seed,
           time:          g.time,
           flags:         g.flags,
           stats:         g.stats,
           level:         p.characterLevel || 1,
           xp:            p.characterXp    || 0,
           position:      { x: Math.round(p.x), y: Math.round(p.y) },
           player: {
                   hp:             p.hp,
                   hunger:         p.hunger,
                   equipment:      p.equipment,
                   skills:         p.skills,
                   perks:          p.perks,
                   characterXp:    p.characterXp,
                   characterLevel: p.characterLevel,
                   attributePoints:p.attributePoints,
                   attributes:     p.attributes,
                   role:           p.role,
                   raceId:         p.raceId || 'human',
                   customization:  p.customization || {}
           },
           inventory: g.systems.inventory.toSave(),
           bank:      g.systems.bank.toSave(),
           quests:    g.systems.quests.toSave(),
           resources: { depleted: g.entities.resources.filter(r => r.amount <= 0).map(r => r.uid) },
           arrowsOnGround: g.arrowsOnGround || [],
           timestamp: Date.now()
     };
 };

 // ── save ──────────────────────────────────────────────
 D.SaveSystem.prototype.save = function() {
     const state = this.data();
     if (!state) return;
     // update worlds registry
     const worlds = this.getAllWorlds();
     if (!worlds[state.worldId]) {
           worlds[state.worldId] = { id: state.worldId, name: state.worldName, created: Date.now() };
           this._write(this.keys.worlds, worlds);
     }
     // upsert save slot
     const saves = this.getAllSaves();
     const idx = saves.findIndex(s => s.worldId === state.worldId && s.characterId === state.characterId);
     if (idx >= 0) saves[idx] = state; else saves.push(state);
     this._write(this.keys.saves, saves);
     this._write(this.keys.active, { worldId: state.worldId, characterId: state.characterId });
     this.game.ui.toast('Saved', `${state.characterName} in ${state.worldName}`, 'good');
 };

 // ── autosave (silent) ─────────────────────────────────
 D.SaveSystem.prototype.autosave = function() {
     if (this.game.state === 'play' && this.game.player && !this.game.player.dead) {
           const state = this.data();
           if (!state) return;
           const saves = this.getAllSaves();
           const idx = saves.findIndex(s => s.worldId === state.worldId && s.characterId === state.characterId);
           if (idx >= 0) saves[idx] = state; else saves.push(state);
           this._write(this.keys.saves, saves);
           this._write(this.keys.active, { worldId: state.worldId, characterId: state.characterId });
     }
 };

 // ── load ──────────────────────────────────────────────
 // load() with no args loads the last active save
 D.SaveSystem.prototype.load = function(worldId, characterId) {
     if (!worldId) {
           const active = this._read(this.keys.active);
           if (!active) return null;
           worldId     = active.worldId;
           characterId = active.characterId;
     }
     const saves = this.getAllSaves();
     return saves.find(s => s.worldId === worldId && s.characterId === characterId) || null;
 };

 // ── delete one character save ─────────────────────────
 D.SaveSystem.prototype.deleteCharacter = function(worldId, characterId) {
     let saves = this.getAllSaves();
     saves = saves.filter(s => !(s.worldId === worldId && s.characterId === characterId));
     this._write(this.keys.saves, saves);
     // remove world entry if no characters left in it
     if (!saves.some(s => s.worldId === worldId)) {
           const worlds = this.getAllWorlds();
           delete worlds[worldId];
           this._write(this.keys.worlds, worlds);
     }
 };

 // ── delete entire world ───────────────────────────────
 D.SaveSystem.prototype.deleteWorld = function(worldId) {
     let saves = this.getAllSaves();
     saves = saves.filter(s => s.worldId !== worldId);
     this._write(this.keys.saves, saves);
     const worlds = this.getAllWorlds();
     delete worlds[worldId];
     this._write(this.keys.worlds, worlds);
 };

 // ── legacy compat: delete() wipes active save ─────────
 D.SaveSystem.prototype.delete = function() {
     const active = this._read(this.keys.active);
     if (active) this.deleteCharacter(active.worldId, active.characterId);
 };
})();

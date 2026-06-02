(function(){
const US = window.UnkScape = window.UnkScape || {};
// game.js v11
US.Game = function(){
this.canvas = document.getElementById('game');
this.ctx = null; // 2D context removed - 3D engine handles all rendering
this.w = 0; this.h = 0; this.dpr = 1;
this.last = performance.now();
this.accum = 0;
this.fixedDt = 1/60;
this.running = false;
this.paused = true;
this.state = 'menu';
this.time = 0;
this.tick = 0;
this.seed = Math.floor(Math.random()*9999999);
this.entities = {resources:[], enemies:[], npcs:[], portals:[], projectiles:[], drops:[], effects:[]};
this.world = null;
this.player = null;
this.camera = null;
this.input = null;
this.ui = null;
this.systems = {};
this.flags = {survivedNights:0, lastNight:false, bankDeposits:0};
this.stats = {kills:{}, deaths:0, resourcesGathered:0, crafted:0};
this.hotbar={selected:0,slots:['crude_sword','training_bow','oak_staff','stone_hatchet','iron_pickaxe','health_salve','berry','campfire']};
this.settings = {
hungerEnabled:false,
cameraMode:'iso',
display:{uiScale:'normal',showWorldLabels:true,reducedFx:false,screenShake:true,floatingText:true},
audio:{enabled:true,master:.55,music:.22,ambient:.34,sfx:.62,footsteps:.32},
keybinds:{
inventory:'tab', stats:'p', skills:'k', crafting:'c', quests:'v', map:'m', interact:'f', attack:' ', pause:'escape', zoomIn:'=', zoomOut:'-', save:'f5', buildToggle:'g', buildCycle:'t'
}
};
this.menuMode = 'main';
this.buildMode = false;
};

US.Game.prototype.resize = function(){
this.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
this.w = Math.floor(innerWidth * this.dpr);
this.h = Math.floor(innerHeight * this.dpr);
this.canvas.width = this.w;
this.canvas.height = this.h;
this.canvas.style.width = innerWidth+'px';
this.canvas.style.height = innerHeight+'px';
// ctx.setTransform removed - no 2D canvas rendering
this.viewW = innerWidth; this.viewH = innerHeight;
};

US.Game.prototype.init = function(){
this.resize();
addEventListener('resize',()=>this.resize());
this.input = new US.Input(this);
this.camera = new US.Camera(this);
this.ui = new US.UI(this);
this.systems.inventory = new US.InventorySystem(this);
this.systems.skills = new US.SkillSystem(this);
this.systems.perks = new US.PerkSystem(this);
this.systems.quests = new US.QuestSystem(this);
this.systems.combat = new US.CombatSystem(this);
this.systems.ai = new US.AISystem(this);
this.systems.daynight = new US.DayNightSystem(this);
this.systems.survival = new US.SurvivalSystem(this);
this.systems.crafting = new US.CraftingSystem(this);
this.systems.economy = new US.EconomySystem(this);
this.systems.bank = new US.BankSystem(this);
this.systems.build = new US.BuildSystem(this);
this.systems.gathering = new US.GatheringSystem(this);
this.systems.dungeon = new US.DungeonSystem(this);
this.systems.turf = new US.TurfSystem(this);
this.systems.loot = new US.LootSystem(this);
this.systems.audio = new US.AudioSystem(this);
this.systems.save = new US.SaveSystem(this);
this.ui.applyDisplaySettings();
this.ui.showMenu();
// ── UnkScape module initialization ──
const U = window.UnkScape || {};
if (U.Engine && U.Engine.Input) { U.Engine.Input.init(); }
if (U.Engine && U.Engine.Renderer && typeof U.Engine.Renderer.init === 'function') { U.Engine.Renderer.init('game'); }
if (U.UI && typeof U.TabUI.init === 'function') { U.TabUI.init(); } // guarded: US.UI has no static init
  // ── Attach UnkScape environment clock and mob AI ──
  if (U.Engine && U.Engine.Environment) { U.Engine.Environment.attach(this); }
  if (U.AI && U.AI.MobEngine) { U.AI.MobEngine.attach(this); }
  // ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────
this.ui.log('Preview booted. Audio starts after your first click/key press.', 'gold');
this.running = true;
requestAnimationFrame(t=>this.loop(t));
};

US.Game.prototype.newGame = function(classId, factionId){
classId = classId || 'wanderer'; factionId = factionId || null;
var game = this;
game.seed = Math.floor(Math.random()*9999999);
game.time = 0; game.tick = 0;
game.flags = {survivedNights:0,lastNight:false,bankDeposits:0};
game.stats = {kills:{},deaths:0,resourcesGathered:0,crafted:0};
game.entities = {resources:[],enemies:[],npcs:[],portals:[],projectiles:[],drops:[],effects:[]};
game.state = 'loading';
game.ui.showLoader('Generating World...');
US.generateWorldAsync(game.seed, function(pct, label){
game.ui.updateLoader(pct * .65, label);
}).then(function(world){
game.world = world;
game.ui.updateLoader(.65, 'Placing entities...');
return US.populateWorldAsync(game, function(pct, label){
game.ui.updateLoader(.65 + pct * .30, label);
});
}).then(function(){
game.player = US.createPlayer(game, classId, factionId);
const cls = US.CLASSES[classId] || US.CLASSES.wanderer;
Object.entries(cls.items||{}).forEach(([id,qty])=>game.systems.inventory.add(id,qty,true));
if(game._pendingCharacterSetup){
const ps = game._pendingCharacterSetup;
game.player.characterName = ps.charName || game.player.characterName;
game.player.characterId = 'char_' + Math.random().toString(36).slice(2,8);
if(ps.factionId && US.FACTIONS[ps.factionId]){
game.player.factionId = ps.factionId;
game.player.factionName = US.FACTIONS[ps.factionId].name;
const fc = US.FACTIONS[ps.factionId].primaryColor || US.FACTIONS[ps.factionId].color || '#6aa7ff';
document.documentElement.style.setProperty('--faction-primary', fc);
document.documentElement.style.setProperty('--faction-glow', fc+'33');
}
if(ps.raceId) game.player.raceId = ps.raceId;
game._pendingCharacterSetup = null;
}
game.systems.perks.reapply();
game.camera.setIso();
game.camera.snapTo(game.player.x, game.player.y);
game.systems.quests.init();
game.ui.updateLoader(1, 'Ready!');
setTimeout(function(){
game.ui.hideLoader();
game.paused = false;
game.state = 'play';
game.ui.closeAll();
game.ui.toast('Welcome to UNK-SCAPE', game.player.zoneName+' • '+game.player.factionName, 'gold');
game.systems.audio.startWorldAudio();
game.ui.log('Your boots hit the dirt. Dusk will come soon.', 'gold');
// ── Boot UnkScape3D WebGL engine on first game start ──
if (window.UnkScape3D && typeof window.UnkScape3D.Initialize3D === 'function' && !window.UnkScape3D.active) {
window.UnkScape3D.Initialize3D();
}
// ─────────────────────────────────────────────────────
// ── Show HUD now that we are in-game ──
const _U = window.UnkScape;
if (_U && _U.TabUI && typeof _U.TabUI.toggleHUDDisplay === 'function') {
_U.TabUI.toggleHUDDisplay(true);
}
// ──────────────────────────────────────────
}, 200);
});
};

US.Game.prototype.loadGame = function(data){
var game = this;
game.seed = data.seed || 1;
game.time = data.time || 0;
game.flags = data.flags || {survivedNights:0,lastNight:false,bankDeposits:0};
game.stats = data.stats || {kills:{},deaths:0,resourcesGathered:0,crafted:0};
game.entities = {resources:[],enemies:[],npcs:[],portals:[],projectiles:[],drops:[],effects:[]};
game.state = 'loading';
game.worldId = data.worldId || game.worldId;
game.worldName = data.worldName || game.worldName;
game.ui.showLoader('Loading World...');
US.generateWorldAsync(game.seed, function(pct, label){
game.ui.updateLoader(pct * .65, label);
}).then(function(world){
game.world = world;
game.ui.updateLoader(.65, 'Placing entities...');
return US.populateWorldAsync(game, function(pct, label){
game.ui.updateLoader(.65 + pct * .30, label);
});
}).then(function(){
game.player = US.createPlayer(game, data.classId || 'wanderer', data.factionId || null);
US.applyPlayerSave(game.player, data.player);game.player.characterId = data.characterId || game.player.characterId;game.player.characterName = data.characterName || game.player.characterName;
if(data.resources){
const depleted = new Set(data.resources.depleted||[]);
game.entities.resources.forEach(r=>{ if(depleted.has(r.uid)) r.amount=0; });
}
game.systems.inventory.fromSave(data.inventory);
game.systems.bank.fromSave(data.bank);
game.systems.quests.fromSave(data.quests);
game.systems.perks.reapply();
game.camera.snapTo(game.player.x, game.player.y);
game.ui.updateLoader(1, 'Ready!');
setTimeout(function(){
game.ui.hideLoader();
game.paused = false;
game.state = 'play';
game.ui.closeAll();
game.ui.toast('Game Loaded', 'Welcome back to the dusk.', 'good');
// ── Boot UnkScape3D WebGL engine on first game start ──
if (window.UnkScape3D && typeof window.UnkScape3D.Initialize3D === 'function' && !window.UnkScape3D.active) {
window.UnkScape3D.Initialize3D();
}
// ─────────────────────────────────────────────────────
// ── Show HUD on loaded game ──
const _U = window.UnkScape;
        if (_U && _U.TabUI && typeof _U.TabUI.toggleHUDDisplay === 'function') {
          _U.TabUI.toggleHUDDisplay(true);
}
// ──────────────────────────────────────
}, 200);
});
};

US.Game.prototype.loop = function(now){
if(!this.running) return;
const dt = Math.min(.05, (now-this.last)/1000);
this.last = now;
if(this.state !== 'loading' && !this.paused){
this.accum += dt;
while(this.accum >= this.fixedDt){
this.update(this.fixedDt);
this.accum -= this.fixedDt;
}
}
// US.render(this); // 2D WORLD RENDER DISABLED - 3D engine is active
// ── UnkScape3D WebGL frame render (Three.js) ──
if (window.UnkScape3D && window.UnkScape3D.active) {
window.UnkScape3D.RenderFrame3D(this.player);
}
// ────────────────────────────────────────────────
/* 2D SECONDARY RENDER PASS DISABLED
// ── UnkScape secondary render pass ──
const _U = window.UnkScape || {};
if (_U.Engine && _U.Engine.Renderer && this.world && this.player) {
_U.Engine.Renderer.renderFrame(this.world, this.player, this.camera);
}
*/
if(this.state !== 'loading') this.ui.update();
requestAnimationFrame(t=>this.loop(t));
};

US.Game.prototype.update = function(dt){
if(!this.player || this.state === 'loading') return;
this.time += dt;
this.tick++;
this.input.update(dt);
  this.camera.update(dt);
this.systems.daynight.update(dt);
this.systems.audio.update(dt);
if(this.settings.hungerEnabled) this.systems.survival.update(dt); else if(this.player) this.player.hunger = this.player.maxHunger;
this.player.update(dt);
// ── Stream world chunks centred on player position ──
const _UW = window.UnkScape;
if (_UW && _UW.World && typeof _UW.World.updateLoadedChunks === 'function') {
_UW.World.updateLoadedChunks(this.player.x, this.player.y);
}
// ─────────────────────────────────────────────────────────────────────────
this.systems.ai.update(dt);
  // ── UnkScape environment clock tick + mob AI update ──
  const _UEnv = window.UnkScape;
  if (_UEnv && _UEnv.Engine && _UEnv.Engine.Environment) { _UEnv.Engine.Environment.update(dt); }
  if (_UEnv && _UEnv.AI && _UEnv.AI.MobEngine) { _UEnv.AI.MobEngine.update(dt); }
  // ─────────────────────────────────────────────────────────────────────────────
if(this.systems.gathering) this.systems.gathering.update(dt);
this.systems.combat.update(dt);
this.systems.dungeon.update(dt);
this.systems.turf.update(dt);
this.entities.projectiles.forEach(p=>p.update(dt,this));
this.entities.projectiles = this.entities.projectiles.filter(p=>!p.dead);
this.entities.effects.forEach(e=>e.t-=dt);
this.entities.effects = this.entities.effects.filter(e=>e.t>0);
// camera.update removed - 3D camera managed by render_3d.js
this.systems.quests.update(dt);
if(this.tick % 300 === 0) this.systems.save.autosave();
};

US.rand = function(seed){
let s = seed >>> 0;
return function(){
s = (s * 1664525 + 1013904223) >>> 0;
return s / 4294967296;
};
};

US.dist = (a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
US.clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
US.lerp = (a,b,t)=>a+(b-a)*t;
US.uid = (()=>{let i=1; return p=>(p||'id')+'_'+(i++).toString(36);})();
})()

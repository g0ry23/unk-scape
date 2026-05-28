(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.Game = function(){
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
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
        inventory:'tab', stats:'p', skills:'k', crafting:'c', quests:'v', bank:'b', map:'m', interact:'f', attack:' ', pause:'escape', zoomIn:'=', zoomOut:'-', save:'f5', cameraToggle:'r', cameraOverhead:'o', rotateLeft:'q', rotateRight:'e', buildToggle:'g', buildCycle:'t'
      }
    };
    this.menuMode = 'main';
    this.buildMode = false;
  };

  D.Game.prototype.resize = function(){
    this.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    this.w = Math.floor(innerWidth * this.dpr);
    this.h = Math.floor(innerHeight * this.dpr);
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.canvas.style.width = innerWidth+'px';
    this.canvas.style.height = innerHeight+'px';
    this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
    this.viewW = innerWidth; this.viewH = innerHeight;
  };

  D.Game.prototype.init = function(){
    this.resize();
    addEventListener('resize',()=>this.resize());
    this.input = new D.Input(this);
    this.camera = new D.Camera(this);
    this.ui = new D.UI(this);
    this.systems.inventory = new D.InventorySystem(this);
    this.systems.skills = new D.SkillSystem(this);
    this.systems.perks = new D.PerkSystem(this);
    this.systems.quests = new D.QuestSystem(this);
    this.systems.combat = new D.CombatSystem(this);
    this.systems.ai = new D.AISystem(this);
    this.systems.daynight = new D.DayNightSystem(this);
    this.systems.survival = new D.SurvivalSystem(this);
    this.systems.crafting = new D.CraftingSystem(this);
    this.systems.economy = new D.EconomySystem(this);
    this.systems.bank = new D.BankSystem(this);
    this.systems.build = new D.BuildSystem(this);
    this.systems.gathering = new D.GatheringSystem(this);
    this.systems.dungeon = new D.DungeonSystem(this);
    this.systems.turf = new D.TurfSystem(this);
    this.systems.loot = new D.LootSystem(this);
    this.systems.audio = new D.AudioSystem(this);
    this.systems.save = new D.SaveSystem(this);
    this.ui.applyDisplaySettings();
    this.ui.showMenu();
    this.ui.log('Preview booted. Audio starts after your first click/key press.', 'gold');
    this.running = true;
    requestAnimationFrame(t=>this.loop(t));
  };

  D.Game.prototype.newGame = function(classId='wanderer', factionId=null){
    this.seed = Math.floor(Math.random()*9999999);
    this.time = 0; this.tick = 0; this.flags = {survivedNights:0,lastNight:false,bankDeposits:0};
    this.stats = {kills:{},deaths:0,resourcesGathered:0,crafted:0};
    this.world = D.generateWorld(this.seed);
    this.entities = {resources:[], enemies:[], npcs:[], portals:[], projectiles:[], drops:[], effects:[]};
    D.populateWorld(this);
    this.player = D.createPlayer(this, classId, factionId);
    const cls=D.CLASSES[classId]||D.CLASSES.wanderer;
    Object.entries(cls.items||{}).forEach(([id,qty])=>this.systems.inventory.add(id,qty,true));
    this.systems.perks.reapply();
    this.camera.setIso();
    this.camera.snapTo(this.player.x,this.player.y);
    this.systems.quests.init();
    this.paused = false;
    this.state = 'play';
    this.ui.closeAll();
    this.ui.toast('Welcome to UNK-SCAPE', `${this.player.zoneName} • ${this.player.factionName}`, 'gold');
    this.systems.audio.startWorldAudio();
    this.ui.log('Your boots hit the dirt. Dusk will come soon.', 'gold');
  };

  D.Game.prototype.loadGame = function(data){
    this.seed = data.seed || 1;
    this.time = data.time || 0;
    this.flags = data.flags || {survivedNights:0,lastNight:false,bankDeposits:0};
    this.stats = data.stats || {kills:{},deaths:0,resourcesGathered:0,crafted:0};
    this.world = D.generateWorld(this.seed);
    this.entities = {resources:[], enemies:[], npcs:[], portals:[], projectiles:[], drops:[], effects:[]};
    D.populateWorld(this);
    this.player = D.createPlayer(this, data.classId || 'wanderer', data.factionId || null);
    D.applyPlayerSave(this.player, data.player);
    if(data.resources){
      const depleted = new Set(data.resources.depleted||[]);
      this.entities.resources.forEach(r=>{ if(depleted.has(r.uid)) r.amount=0; });
    }
    this.systems.inventory.fromSave(data.inventory);
    this.systems.bank.fromSave(data.bank);
    this.systems.quests.fromSave(data.quests);
    this.systems.perks.reapply();
    this.camera.snapTo(this.player.x,this.player.y);
    this.paused=false; this.state='play'; this.ui.closeAll();
    this.ui.toast('Game Loaded', 'Welcome back to the dusk.', 'good');
  };

  D.Game.prototype.loop = function(now){
    if(!this.running) return;
    const dt = Math.min(.05, (now-this.last)/1000);
    this.last = now;
    if(!this.paused){
      this.accum += dt;
      while(this.accum >= this.fixedDt){
        this.update(this.fixedDt);
        this.accum -= this.fixedDt;
      }
    }
    D.render(this);
    this.ui.update();
    requestAnimationFrame(t=>this.loop(t));
  };

  D.Game.prototype.update = function(dt){
    this.time += dt;
    this.tick++;
    this.input.update(dt);
    this.systems.daynight.update(dt);
    this.systems.audio.update(dt);
    if(this.settings.hungerEnabled) this.systems.survival.update(dt); else if(this.player) this.player.hunger = this.player.maxHunger;
    this.player.update(dt);
    this.systems.ai.update(dt);
    if(this.systems.gathering) this.systems.gathering.update(dt);
    this.systems.combat.update(dt);
    this.systems.dungeon.update(dt);
    this.systems.turf.update(dt);
    this.entities.projectiles.forEach(p=>p.update(dt,this));
    this.entities.projectiles = this.entities.projectiles.filter(p=>!p.dead);
    this.entities.effects.forEach(e=>e.t-=dt);
    this.entities.effects = this.entities.effects.filter(e=>e.t>0);
    this.camera.update(dt);
    this.systems.quests.update(dt);
    if(this.tick % 300 === 0) this.systems.save.autosave();
  };

  D.rand = function(seed){
    let s = seed >>> 0;
    return function(){
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  };

  D.dist = (a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  D.clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
  D.lerp = (a,b,t)=>a+(b-a)*t;
  D.uid = (()=>{let i=1; return p=>(p||'id')+'_'+(i++).toString(36);})();
})();

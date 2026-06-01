(function(){
const US = window.UnkScape = window.UnkScape || {};
// -- UnkScape.config: ONE place for tunable constants
US.config = US.config || {};
if(US.config.moveSpeed === undefined) US.config.moveSpeed = 200;
if(US.config.sprintMult === undefined) US.config.sprintMult = 1.55;
if(US.config.staminaRegen === undefined) US.config.staminaRegen = 12;
if(US.config.sprintDrain === undefined) US.config.sprintDrain = 22;
if(US.config.devFastTravel === undefined) US.config.devFastTravel = true;
// ------------------------------------------------
US.createPlayer=function(game,classId,factionId=null){
const cls=US.CLASSES[classId]||US.CLASSES.wanderer;
const allowedFactions=US.getClassFactions(classId);
const chosenFaction=factionId&&allowedFactions.includes(factionId)?factionId:allowedFactions[0];
const faction=US.FACTIONS[chosenFaction]||US.FACTIONS.ironbound;
const start=cls.start||{x:US.WORLD.w/2,y:US.WORLD.h/2};
const p={
uid:'player',kind:'player',classId,factionId:chosenFaction,factionName:faction.name,zoneName:cls.zone||'Central Crossroads',role:US.CLASS_ROLES[classId]||'Hybrid',roleType:cls.roleType||cls.archetype||'hybrid',characterXp:0,characterLevel:1,attributePoints:3,attributes:US.defaultAttributes(cls.roleType||cls.archetype||'hybrid'),x:start.x*US.TILE+US.TILE/2,y:start.y*US.TILE+US.TILE/2,r:16,vx:0,vy:0,dir:{x:1,y:0},
hp:100,maxHp:100,hunger:100,maxHunger:100,dead:false,attackCooldown:0,attackAnim:0,attackAnimMax:.2,attackAngle:0,facingAngle:0,walkTime:0,interactCooldown:0,blocking:false,heavyCharging:false,heavyCharge:0,gathering:false,
// Phase 2: smooth velocity accum
_tvx:0,_tvy:0,
equipment:{head:null,weapon:null,offhand:null,body:null,tool:null}, skills:{}, perks:[], mods:{},
update(dt){
if(this.dead)return;
this.stamina=this.stamina||100;
this.maxStamina=100;

// Phase 1+2: axis() is already camera-relative + normalized
const axis=game.input.axis();
const stats=this.stats();
let sp=stats.moveSpeed;
const moving=axis.x!==0||axis.y!==0;
const cfg=US.config||{};
const fastTravel=cfg.devFastTravel!==false;
const isSprinting=!fastTravel&&game.input.keys['shift']&&moving&&this.stamina>5;
if(fastTravel){
sp=(cfg.moveSpeed||200);
this.stamina=Math.min(this.maxStamina,this.stamina+(dt*(cfg.staminaRegen||12)));
}else if(isSprinting){
sp*=(cfg.sprintMult||1.55);
this.stamina=Math.max(0,this.stamina-dt*(cfg.sprintDrain||22));
}else{
this.stamina=Math.min(this.maxStamina,this.stamina+dt*(cfg.staminaRegen||12));
}
if(this.blocking)sp*=.58;
if(this.heavyCharging)sp*=.72;
const tile=US.tileAt(game.world,this.x,this.y);if(tile)sp*=US.TILES[tile].speed||1;

// Phase 2: compute target velocity, then lerp toward it
if(moving){
  this._tvx=axis.x*sp;
  this._tvy=axis.y*sp;
  this.dir={x:axis.x,y:axis.y};
  this.walkTime+=dt*Math.hypot(axis.x,axis.y)*(isSprinting?12:8);
}else{
  this._tvx=0;
  this._tvy=0;
}

// Lerp: accel when gaining speed, decel when losing it
const ACCEL=10; // reach target in ~0.1s
const DECEL=16; // slightly faster stop
const lerpX=moving?ACCEL:DECEL;
const lerpY=moving?ACCEL:DECEL;
this.vx+=((this._tvx-this.vx)*lerpX*dt);
this.vy+=((this._tvy-this.vy)*lerpY*dt);
// Clamp tiny values to zero to prevent perpetual micro-drift
if(Math.abs(this.vx)<0.5&&!moving)this.vx=0;
if(Math.abs(this.vy)<0.5&&!moving)this.vy=0;

if(game.input?.mouse){this.facingAngle=Math.atan2(game.input.mouse.worldY-this.y,game.input.mouse.worldX-this.x);}
this.move(dt,game);
this.attackCooldown=Math.max(0,this.attackCooldown-dt);
this.attackAnim=Math.max(0,this.attackAnim-dt);
this.interactCooldown=Math.max(0,this.interactCooldown-dt);
this.pickupNearby();
},
move(dt,g){
const nx=this.x+this.vx*dt, ny=this.y+this.vy*dt;
if(!US.solidAt(g.world,nx,this.y,this.r)){this.x=US.clamp(nx,this.r,US.WORLD.pxW-this.r);}
if(!US.solidAt(g.world,this.x,ny,this.r)){this.y=US.clamp(ny,this.r,US.WORLD.pxH-this.r);}
},
stats(){
const s=US.getEquipmentStats(this);
s.defense += this.mods.defense||0;
// Phase 2: ensure base moveSpeed is appropriate for large world (200 px/s feels right)
if(s.moveSpeed<(US.config&&US.config.moveSpeed||180))s.moveSpeed=(US.config&&US.config.moveSpeed)||200;
s.moveSpeed *= 1+(this.mods.moveSpeed||0);
s.accuracy += this.mods.accuracy||0;
s.attack += Math.floor((US.levelForXp(this.skills.combat?.xp||0)-1)/2);
s.characterLevel = this.characterLevel || US.characterLevelForXp(this.characterXp||0);
s.healingPower += Math.floor((this.characterLevel||1)*.4);
s.supportPower += Math.floor((this.characterLevel||1)*.3);
const faction=US.FACTIONS[this.factionId];
if(faction?.buff){
s.attack += faction.buff.attack||0;
s.defense += faction.buff.defense||0;
s.accuracy += faction.buff.accuracy||0;
s.moveSpeed *= 1+(faction.buff.moveSpeed||0);
}
s.maxHp = 100 + (US.levelForXp(this.skills.survival?.xp||0)-1)*4;
this.maxHp=s.maxHp; this.maxHunger=s.hungerMax;
return s;
},
takeDamage(n,from){
const stats=this.stats();
let dmg=Math.max(1,Math.floor(n - stats.defense*.45));
if(this.blocking){
dmg=Math.max(0,Math.floor(dmg*.32));
game.ui.floatText(this.x,this.y-34,dmg>0?'GUARD -'+dmg:'PERFECT BLOCK','#6aa7ff');
game.camera.bump(.45);
if(Math.random()<.35) game.systems.skills.addXp('combat',1);
}else if(Math.random() < (stats.block||0)) {
game.ui.floatText(this.x,this.y-30,'BLOCK','#6aa7ff');return 0;
}
if(dmg>0){this.hp=Math.max(0,this.hp-dmg);game.ui.floatText(this.x,this.y-30,'-'+dmg,'#ff5c7a');game.camera.bump(1.2);}
if(this.hp<=0)this.die();
return dmg;
},
heal(n){const bonus=1+(this.mods.healBonus||0);const amt=Math.floor(n*bonus);this.hp=Math.min(this.maxHp,this.hp+amt);game.ui.floatText(this.x,this.y-28,'+'+amt,'#63e6a4');},
die(){
this.dead=true; game.stats.deaths++; game.paused=true;
game.ui.toast('You fell to the dusk', 'You keep your skills, but drop some coins.', 'bad');
const coins=game.systems.inventory.count('coin');
if(coins>0) game.systems.inventory.remove('coin',Math.ceil(coins*.25));
setTimeout(()=>{this.hp=this.maxHp;this.hunger=70;this.x=US.WORLD.pxW/2;this.y=US.WORLD.pxH/2;this.dead=false;game.paused=false;game.camera.snapTo(this.x,this.y);},1200);
},
pickupNearby(){
for(const d of [...game.entities.drops]){
if(US.dist(this,d)<34){game.systems.inventory.add(d.id,d.qty);game.entities.drops=game.entities.drops.filter(x=>x!==d);game.ui.log(`Picked up ${US.ITEMS[d.id]?.name||d.id} x${d.qty}`,'good');}
}
},
tryInteract(){
if(this.interactCooldown>0)return;this.interactCooldown=.25;
const nearNpc=game.entities.npcs.find(n=>US.dist(this,n)<72);
if(nearNpc){game.ui.openDialog(nearNpc);return;}
const nearPortal=game.entities.portals.find(p=>US.dist(this,p)<72);
if(nearPortal){game.systems.dungeon.enter(nearPortal.id);return;}
const nearRes=game.entities.resources.filter(r=>r.amount>0 && US.dist(this,r)<80).sort((a,b)=>US.dist(this,a)-US.dist(this,b))[0];
if(nearRes){game.ui.log(`Walk closer and press [F] to gather ${nearRes.cfg.name}.`, 'gold');return;}
game.ui.log('Nothing close enough to interact with.','bad');
}
};
Object.keys(US.SKILLS).forEach(k=>p.skills[k]={xp:0,level:1});
Object.entries(cls.skills||{}).forEach(([k,xp])=>{if(!p.skills[k])p.skills[k]={xp:0,level:1};p.skills[k].xp=xp;p.skills[k].level=US.levelForXp(xp||0);});
p.equipment={...p.equipment,...(cls.equipment||{})};
p.perks=[...(cls.perks||[])];
return p;
};
US.applyPlayerSave=function(p,data={}){
p.x=data.x||p.x;p.y=data.y||p.y;p.hp=data.hp||p.hp;p.hunger=data.hunger??p.hunger;p.equipment={head:null,weapon:null,offhand:null,body:null,tool:null,...(data.equipment||p.equipment)};p.skills=data.skills||p.skills;Object.keys(US.SKILLS).forEach(k=>{if(!p.skills[k])p.skills[k]={xp:0,level:1};});p.perks=data.perks||p.perks;p.factionId=data.factionId||p.factionId;p.factionName=US.FACTIONS[p.factionId]?.name||p.factionName;
p.characterXp=data.characterXp||p.characterXp||0;p.characterLevel=data.characterLevel||US.characterLevelForXp(p.characterXp||0);p.attributePoints=data.attributePoints??p.attributePoints??0;p.attributes={...US.defaultAttributes(p.roleType||'hybrid'),...(data.attributes||p.attributes||{})};p.role=data.role||p.role||US.CLASS_ROLES[p.classId]||'Hybrid';
};
})();

(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.createPlayer=function(game,classId,factionId=null){
    const cls=D.CLASSES[classId]||D.CLASSES.wanderer;
    const allowedFactions=D.getClassFactions(classId);
    const chosenFaction=factionId&&allowedFactions.includes(factionId)?factionId:allowedFactions[0];
    const faction=D.FACTIONS[chosenFaction]||D.FACTIONS.ironbound;
    const start=cls.start||{x:D.WORLD.w/2,y:D.WORLD.h/2};
    const p={
      uid:'player',kind:'player',classId,factionId:chosenFaction,factionName:faction.name,zoneName:cls.zone||'Central Crossroads',role:D.CLASS_ROLES[classId]||'Hybrid',roleType:cls.roleType||cls.archetype||'hybrid',characterXp:0,characterLevel:1,attributePoints:3,attributes:D.defaultAttributes(cls.roleType||cls.archetype||'hybrid'),x:start.x*D.TILE+D.TILE/2,y:start.y*D.TILE+D.TILE/2,r:16,vx:0,vy:0,dir:{x:1,y:0},
      hp:100,maxHp:100,hunger:100,maxHunger:100,dead:false,attackCooldown:0,attackAnim:0,attackAnimMax:.2,attackAngle:0,facingAngle:0,walkTime:0,interactCooldown:0,blocking:false,heavyCharging:false,heavyCharge:0,
      equipment:{head:null,weapon:null,offhand:null,body:null,tool:null}, skills:{}, perks:[], mods:{},
      update(dt){
if(this.dead)return;
this.stamina=this.stamina||100;
this.maxStamina=100;
const axis=game.input.axis();
const stats=this.stats();
let sp=stats.moveSpeed;
const isSprinting=game.input.keys['shift']&&(axis.x!==0||axis.y!==0)&&this.stamina>5;
if(isSprinting){
  sp*=1.55;
  this.stamina=Math.max(0,this.stamina-dt*22);
}else{
  this.stamina=Math.min(this.maxStamina,this.stamina+dt*12);
}
if(this.blocking)sp*=.58;
if(this.heavyCharging)sp*=.72;
const tile=D.tileAt(game.world,this.x,this.y);if(tile)sp*=D.TILES[tile].speed||1;
if(axis.x!==0||axis.y!==0){
const camAngle=game.camera.angle||0;
const cos=Math.cos(camAngle);const sin=Math.sin(camAngle);
this.vx=(axis.x*cos-axis.y*sin)*sp;
this.vy=(axis.x*sin+axis.y*cos)*sp;
this.dir={x:axis.x,y:axis.y};this.walkTime+=dt*Math.hypot(axis.x,axis.y)*(isSprinting?12:8);
}else{this.vx=0;this.vy=0;}
if(game.input?.mouse){this.facingAngle=Math.atan2(game.input.mouse.worldY-this.y,game.input.mouse.worldX-this.x);}
this.move(dt,game);
this.attackCooldown=Math.max(0,this.attackCooldown-dt);
this.attackAnim=Math.max(0,this.attackAnim-dt);
this.interactCooldown=Math.max(0,this.interactCooldown-dt);
this.pickupNearby();
},    move(dt,g){
const nx=this.x+this.vx*dt, ny=this.y+this.vy*dt;
if(!D.solidAt(g.world,nx,this.y,this.r)){this.x=D.clamp(nx,this.r,D.WORLD.pxW-this.r);}
if(!D.solidAt(g.world,this.x,ny,this.r)){this.y=D.clamp(ny,this.r,D.WORLD.pxH-this.r);}
},
stats(){
        const s=D.getEquipmentStats(this);
        s.defense += this.mods.defense||0;
        s.moveSpeed *= 1+(this.mods.moveSpeed||0);
        s.accuracy += this.mods.accuracy||0;
        s.attack += Math.floor((D.levelForXp(this.skills.combat?.xp||0)-1)/2);
        s.characterLevel = this.characterLevel || D.characterLevelForXp(this.characterXp||0);
        s.healingPower += Math.floor((this.characterLevel||1)*.4);
        s.supportPower += Math.floor((this.characterLevel||1)*.3);
        const faction=D.FACTIONS[this.factionId];
        if(faction?.buff){
          s.attack += faction.buff.attack||0;
          s.defense += faction.buff.defense||0;
          s.accuracy += faction.buff.accuracy||0;
          s.moveSpeed *= 1+(faction.buff.moveSpeed||0);
        }
        s.maxHp = 100 + (D.levelForXp(this.skills.survival?.xp||0)-1)*4;
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
        setTimeout(()=>{this.hp=this.maxHp;this.hunger=70;this.x=D.WORLD.pxW/2;this.y=D.WORLD.pxH/2;this.dead=false;game.paused=false;game.camera.snapTo(this.x,this.y);},1200);
      },
      pickupNearby(){
        for(const d of [...game.entities.drops]){
          if(D.dist(this,d)<34){game.systems.inventory.add(d.id,d.qty);game.entities.drops=game.entities.drops.filter(x=>x!==d);game.ui.log(`Picked up ${D.ITEMS[d.id]?.name||d.id} x${d.qty}`,'good');}
        }
      },
      tryInteract(){
        if(this.interactCooldown>0)return;this.interactCooldown=.25;
        const nearNpc=game.entities.npcs.find(n=>D.dist(this,n)<72);
        if(nearNpc){game.ui.openDialog(nearNpc);return;}
        const nearPortal=game.entities.portals.find(p=>D.dist(this,p)<72);
        if(nearPortal){game.systems.dungeon.enter(nearPortal.id);return;}
        const nearRes=game.entities.resources.filter(r=>r.amount>0 && D.dist(this,r)<80).sort((a,b)=>D.dist(this,a)-D.dist(this,b))[0];
        if(nearRes){game.ui.log(`${nearRes.cfg.name} is click-based now. Left-click the resource to gather it.`, 'gold');return;}
        game.ui.log('Nothing close enough to interact with.','bad');
      }
    };
    Object.keys(D.SKILLS).forEach(k=>p.skills[k]={xp:0,level:1});
    Object.entries(cls.skills||{}).forEach(([k,xp])=>{if(!p.skills[k])p.skills[k]={xp:0,level:1};p.skills[k].xp=xp;p.skills[k].level=D.levelForXp(xp||0);});
    p.equipment={...p.equipment,...(cls.equipment||{})};
    p.perks=[...(cls.perks||[])];
    return p;
  };
  D.applyPlayerSave=function(p,data={}){
    p.x=data.x||p.x;p.y=data.y||p.y;p.hp=data.hp||p.hp;p.hunger=data.hunger??p.hunger;p.equipment={head:null,weapon:null,offhand:null,body:null,tool:null,...(data.equipment||p.equipment)};p.skills=data.skills||p.skills;Object.keys(D.SKILLS).forEach(k=>{if(!p.skills[k])p.skills[k]={xp:0,level:1};});p.perks=data.perks||p.perks;p.factionId=data.factionId||p.factionId;p.factionName=D.FACTIONS[p.factionId]?.name||p.factionName;
    p.characterXp=data.characterXp||p.characterXp||0;p.characterLevel=data.characterLevel||D.characterLevelForXp(p.characterXp||0);p.attributePoints=data.attributePoints??p.attributePoints??0;p.attributes={...D.defaultAttributes(p.roleType||'hybrid'),...(data.attributes||p.attributes||{})};p.role=data.role||p.role||D.CLASS_ROLES[p.classId]||'Hybrid';
  };
})();

(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.CombatSystem=function(game){this.game=game;this.heavyThreshold=.72;this.maxCharge=1.25;this.baseCritChance=.08;this.baseCritMult=1.65;this.headshotRadius=20;};
  D.CombatSystem.prototype.weaponStyle=function(player){
    const w=player?.equipment?.weapon;
    return D.EQUIPMENT[w]?.style || D.ITEMS[w]?.combatStyle || 'melee';
  };
  D.CombatSystem.prototype.rollBonusHit=function(player,enemy,heavy=false){
    const g=this.game, style=this.weaponStyle(player), aimX=g.input.mouse.worldX, aimY=g.input.mouse.worldY;
    const combatLevel=D.levelForXp(player.skills.combat?.xp||0);
    const critChance=this.baseCritChance + Math.min(.12,(combatLevel-1)*.01) + (heavy?.04:0);
    const headDistance=Math.hypot(enemy.x-aimX,enemy.y-14-aimY);
    const canHeadshot=style==='range'||style==='mage';
    const headshot=canHeadshot && headDistance <= this.headshotRadius + (heavy?8:0);
    const crit=Math.random()<critChance;
    let mult=1;
    const tags=[];
    if(crit){mult*=this.baseCritMult;tags.push('CRIT');}
    if(headshot){mult*=style==='mage'?1.75:1.9;tags.push('HEADSHOT');}
    return {crit,headshot,mult,tags,style};
  };
  D.CombatSystem.prototype.releasePrimary=function(held){
    const heavy=held>=this.heavyThreshold;
    this.playerAttack(heavy, Math.min(held,this.maxCharge));
  };
  D.CombatSystem.prototype.playerAttack=function(heavy=false,charge=0){
    const g=this.game,p=g.player;if(!p||p.dead||p.attackCooldown>0||p.blocking)return;
    const stats=p.stats();
    const style=this.weaponStyle(p);
    if(style==='range' && g.systems.inventory.has('arrow',1)){
      g.systems.inventory.remove('arrow',1);
    }
    const chargeBonus=D.clamp(charge/this.maxCharge,0,1);
    const cooldown=heavy?stats.attackSpeed*1.55:stats.attackSpeed;
    const range=style==='melee' ? stats.range+(heavy?22:0) : stats.range+(heavy?55:0);
    const accuracy=D.clamp(stats.accuracy-(heavy ? 0.08 : 0),.1,.96);
    const aimX=g.input.mouse.worldX, aimY=g.input.mouse.worldY;
    p.attackCooldown=cooldown;
    p.attackAnim=heavy ? .34 : .22;
    p.attackAnimMax=p.attackAnim;
    p.lastAttackHeavy=heavy;
    p.heavyCharge=0;
    p.heavyCharging=false;
    p.attackAngle=Math.atan2(aimY-p.y,aimX-p.x);
    p.facingAngle=p.attackAngle;

    let targets=g.entities.enemies.filter(e=>!e.dead&&D.dist(p,e)<range+e.r);
    if(style!=='melee'){
      targets=targets.filter(e=>this.isEnemyNearAimLine(p,e,aimX,aimY,range,heavy));
    }
    if(!targets.length){
      g.ui.floatText(p.x,p.y-32,style==='range'?(heavy?'Heavy Shot':'Shot'):style==='mage'?(heavy?'Charged Spell':'Spell'):(heavy?'Heavy Swing':'Swing'),heavy?'#ff5c7a':'#9aa8c7');
      if(style!=='melee') this.spawnAttackProjectile(p,aimX,aimY,0,style,heavy,null,false);
      g.systems.audio?.play('miss');
      return;
    }
    targets.sort((a,b)=>{
      const aLine=this.distanceToAimLine(p,a,aimX,aimY), bLine=this.distanceToAimLine(p,b,aimX,aimY);
      const aAim=Math.hypot(a.x-aimX,a.y-aimY), bAim=Math.hypot(b.x-aimX,b.y-aimY);
      const aPlayer=D.dist(p,a), bPlayer=D.dist(p,b);
      return style==='melee' ? (aAim*.75+aPlayer*.25)-(bAim*.75+bPlayer*.25) : (aLine*.9+aAim*.1)-(bLine*.9+bAim*.1);
    });
    const maxTargets=style==='melee' ? (heavy?Math.min(3,targets.length):1) : 1;
    let fired=false;
    for(const e of targets.slice(0,maxTargets)){
      const hit=Math.random()<accuracy;
      if(style!=='melee' && !fired){this.spawnAttackProjectile(p,e.x,e.y,hit?1:0,style,heavy,e,hit);fired=true;}
      g.systems.audio?.play(heavy?'heavyHit':'hit');
      if(hit){
        e.hitMarker=.2;
        e.hitFlash=.16;
        const lvl=D.levelForXp(p.skills.combat.xp);
        const baseMax=Math.max(3,stats.attack+Math.floor(lvl*.65));
        const styleMult=style==='mage'?1.08:style==='range'?1.0:1;
        const attackMult=(heavy?1.45+chargeBonus*.55:1)*styleMult;
        const bonus=this.rollBonusHit(p,e,heavy);
        const totalMult=attackMult*bonus.mult;
        const min=Math.max(1,Math.floor(baseMax*.42*totalMult));
        const max=Math.max(min,Math.floor(baseMax*totalMult));
        const raw=D.irand(min,max);
        const dmg=Math.max(1,Math.floor(raw-(e.cfg.defense||0)*.25));
        e.takeDamage(dmg,p);
        const verb=style==='range'?(heavy?'POWER SHOT':null):style==='mage'?(heavy?'CHARGED':null):(heavy?'HEAVY':null);
        const labelText=[verb,...bonus.tags,'-'+dmg].filter(Boolean).join(' ');
        const color=bonus.headshot?'#63e6a4':bonus.crit?'#f7c65b':heavy?'#ff5c7a':'#ffcf6e';
        g.ui.floatText(e.x,e.y-28,labelText,color);
        if(bonus.crit||bonus.headshot) g.systems.skills.addXp('combat',1);
        g.camera.bump(bonus.headshot?1.35:heavy?1.05:.45);
        if(e.dead)this.kill(e);
      }else{e.missMarker=.2;g.ui.floatText(e.x,e.y-28,'MISS','#9aa8c7');}
    }
  };
  D.CombatSystem.prototype.distanceToAimLine=function(p,e,aimX,aimY){
    const ax=p.x, ay=p.y, bx=aimX, by=aimY;
    const dx=bx-ax, dy=by-ay, len2=dx*dx+dy*dy;
    if(len2<1)return Math.hypot(e.x-ax,e.y-ay);
    const t=D.clamp(((e.x-ax)*dx+(e.y-ay)*dy)/len2,0,1);
    const px=ax+t*dx, py=ay+t*dy;
    return Math.hypot(e.x-px,e.y-py);
  };
  D.CombatSystem.prototype.isEnemyNearAimLine=function(p,e,aimX,aimY,range,heavy=false){
    const dist=D.dist(p,e); if(dist>range+e.r)return false;
    const rayLen=Math.hypot(aimX-p.x,aimY-p.y);
    if(rayLen<22)return Math.hypot(e.x-aimX,e.y-aimY)<e.r+34;
    const lineDist=this.distanceToAimLine(p,e,aimX,aimY);
    return lineDist <= e.r + (heavy?28:20);
  };
  D.CombatSystem.prototype.spawnAttackProjectile=function(p,tx,ty,hitPower,style,heavy,target,hit){
    const g=this.game;
    const startX=p.x+Math.cos(p.attackAngle||p.facingAngle||0)*26;
    const startY=p.y+Math.sin(p.attackAngle||p.facingAngle||0)*26;
    const color=style==='mage'?(heavy?'#ff9b5c':'#b98cff'):(heavy?'#ffcf6e':'#dbe4ff');
    const r=style==='mage'?(heavy?8:6):(heavy?5:4);
    const speed=style==='mage'?(heavy?430:390):(heavy?560:500);
    const proj=D.createProjectile(startX,startY,tx,ty,{speed,r,color,life:1.0,damage:hitPower||0,source:'player',recoverable:style==='range',recoverChance:heavy?.82:.68,dropId:'arrow',style});
    proj.visualOnly=true;
    proj.style=style;
    proj.targetId=target?.uid||null;
    proj.onHit=hit;
    g.entities.projectiles.push(proj);
  };
  D.CombatSystem.prototype.enemyAttack=function(e){
    const g=this.game,p=g.player;if(!p||p.dead||e.dead||e.attackTimer>0)return;
    e.attackTimer=e.cfg.attackCooldown;
    const hit=Math.random()<e.cfg.accuracy;
    if(hit)p.takeDamage(D.irand(1,Math.max(1,e.cfg.attack)),e);else g.ui.floatText(p.x,p.y-28,'MISS','#9aa8c7');
  };
  D.CombatSystem.prototype.kill=function(e){
    const g=this.game;
    g.systems.skills.addXp('combat',e.cfg.xp);
    g.stats.kills[e.type]=(g.stats.kills[e.type]||0)+1;
    g.systems.quests.notify('kill',e.type,1);
    g.systems.loot.dropEnemy(e);
    g.ui.log(`Defeated ${e.cfg.name}.`,'good');
    setTimeout(()=>{g.entities.enemies=g.entities.enemies.filter(x=>x!==e);},0);
  };
  D.CombatSystem.prototype.update=function(dt){
    const g=this.game,p=g.player;if(!p)return;
    const held=g.input.mouse.leftHeld||0;
    p.heavyCharging=!!g.input.mouse.leftDown && held>=this.heavyThreshold;
    p.heavyCharge=p.heavyCharging?Math.min(this.maxCharge,held-this.heavyThreshold):0;
    g.entities.enemies.forEach(e=>{
      e.targeted=false;
      e.hitMarker=Math.max(0,(e.hitMarker||0)-dt);
      e.missMarker=Math.max(0,(e.missMarker||0)-dt);
    });
    const aimX=g.input.mouse.worldX, aimY=g.input.mouse.worldY;
    const near=g.entities.enemies.filter(e=>!e.dead&&D.dist(p,e)<150).sort((a,b)=>{
      const aAim=Math.hypot(a.x-aimX,a.y-aimY), bAim=Math.hypot(b.x-aimX,b.y-aimY);
      const aPlayer=D.dist(p,a), bPlayer=D.dist(p,b);
      return (aAim*.8+aPlayer*.2)-(bAim*.8+bPlayer*.2);
    })[0];
    if(near && Math.hypot(near.x-aimX,near.y-aimY)<105) near.targeted=true;
  };
})();
</script>
<script>

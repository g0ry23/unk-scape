(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.GatheringSystem=function(game){
    this.game=game;
    this.nodes=[];
    this.active=null;
    this.timer=0;
    this.duration=3;
    this.respawnTime=10;
    this.seeded=false;
  };
  D.GatheringSystem.prototype.nodeLabel=function(node){
    if(!node)return 'Gathering';
    if(node.cfg)return `${node.cfg.action||'Gather'}: ${node.cfg.name}`;
    return 'Chop: Harvest Tree';
  };
  D.GatheringSystem.prototype.gatherDuration=function(node){
    if(!node||!node.cfg)return 3;
    const p=this.game.player, lvl=D.levelForXp(p.skills[node.cfg.skill]?.xp||0), tool=p.stats()[node.cfg.skill]||0;
    return D.clamp(3.4 + (node.cfg.tier||1)*.45 - (lvl+tool)*.10,1.3,5.2);
  };
  D.GatheringSystem.prototype.ensureNodes=function(){
    const g=this.game;
    if(this.seeded||!g.world||!g.player)return;
    this.seeded=true;
    const nodes=[];
    const tries=260;
    for(let i=0;i<tries&&nodes.length<3;i++){
      const angle=Math.random()*Math.PI*2;
      const dist=160+Math.random()*360;
      let x=D.clamp(g.player.x+Math.cos(angle)*dist,D.TILE*3,D.WORLD.pxW-D.TILE*3);
      let y=D.clamp(g.player.y+Math.sin(angle)*dist,D.TILE*3,D.WORLD.pxH-D.TILE*3);
      const tx=Math.floor(x/D.TILE),ty=Math.floor(y/D.TILE);
      const tileId=g.world.tiles[ty]?.[tx];
      if(!tileId||D.TILES[tileId]?.solid||tileId==='water')continue;
      if(nodes.some(n=>Math.hypot(n.x-x,n.y-y)<140))continue;
      nodes.push({id:'tree_'+nodes.length,x,y,r:34,active:true,respawn:0,type:'tree'});
    }
    while(nodes.length<3){
      const n=nodes.length;
      nodes.push({id:'tree_'+n,x:g.player.x+(n-1)*120,y:g.player.y+190+n*40,r:34,active:true,respawn:0,type:'tree'});
    }
    this.nodes=nodes;
  };
  D.GatheringSystem.prototype.tryStartAt=function(x,y){
    this.ensureNodes();
    const g=this.game,p=g.player;
    if(!p)return false;
    let node=this.nodes.find(n=>n.active&&Math.hypot(n.x-x,n.y-y)<=n.r+24&&Math.hypot(n.x-p.x,n.y-p.y)<=92);
    if(!node){
      node=g.entities.resources.find(r=>r.amount>0&&Math.hypot(r.x-x,r.y-y)<=r.r+26&&Math.hypot(r.x-p.x,r.y-p.y)<=96);
    }
    if(!node)return false;
    if(node.cfg){
      const level=D.levelForXp(p.skills[node.cfg.skill]?.xp||0);
      if(level<node.cfg.level){g.ui.toast('Level too low',`${node.cfg.name} requires ${D.SKILLS[node.cfg.skill].name} level ${node.cfg.level}.`,'bad');return true;}
    }
    this.active=node;
    this.duration=this.gatherDuration(node);
    this.timer=0;
    if(p){p.gathering=true;p.blocking=false;p.heavyCharging=false;}
    if(g.input?.mouse){g.input.mouse.leftDown=false;g.input.mouse.rightDown=false;}
    g.ui.log(`Started ${this.nodeLabel(node).toLowerCase()}.`,'gold');
    return true;
  };
  D.GatheringSystem.prototype.cancel=function(){
    if(this.game.player)this.game.player.gathering=false;
    this.active=null;
    this.timer=0;
  };
  D.GatheringSystem.prototype.finish=function(){
    const g=this.game,node=this.active;
    if(!node){this.cancel();return;}
    if(node.cfg){
      const p=g.player,cfg=node.cfg;
      const lvl=D.levelForXp(p.skills[cfg.skill]?.xp||0), tool=p.stats()[cfg.skill]||0;
      const ok=D.rollSkillSuccess(lvl+tool,cfg.difficulty);
      if(!ok){
        g.ui.floatText(p.x,p.y-35,'Failed','#9aa8c7');
        if(g.systems.skills) g.systems.skills.addXp(cfg.skill,Math.max(1,Math.floor(cfg.xp*.15)));
        this.cancel();return;
      }
      let qty=1+(Math.random()<.10+(p.mods.extraGather||0)?1:0);
      qty=Math.min(qty,node.amount);
      const item=(cfg.altItem&&Math.random()<(cfg.altChance||0))?cfg.altItem:cfg.item;
      node.amount-=qty;
      g.systems.inventory.add(item,qty);
      g.systems.audio?.play(cfg.skill==='mining'?'mine':'chop');
      if(g.systems.skills) g.systems.skills.addXp(cfg.skill,cfg.xp*qty);
      if(g.systems.quests) g.systems.quests.notify('gather',item,qty);
      g.stats.resourcesGathered+=qty;
      g.ui.floatText(p.x,p.y-42,`+${qty} ${D.ITEMS[item]?.name||item}`,'#38d978');
      if(node.amount<=0){node.cooldown=cfg.respawn;g.ui.log(`${cfg.name} depleted.`, 'gold');}
    }else{
      node.active=false;
      node.respawn=this.respawnTime;
      g.systems.inventory.add('log',1);
      g.systems.audio?.play('chop');
      if(g.systems.skills) g.systems.skills.addXp('woodcutting',12);
      if(g.systems.quests) g.systems.quests.notify('gather','log',1);
      g.ui.floatText(g.player.x,g.player.y-42,'+1 Wood','#38d978');
      g.ui.log('Collected 1 Wood. The tree will regrow soon.','good');
    }
    this.cancel();
  };
  D.GatheringSystem.prototype.update=function(dt){
    this.ensureNodes();
    const g=this.game,p=g.player;
    this.nodes.forEach(n=>{if(!n.active&&n.respawn>0){n.respawn-=dt;if(n.respawn<=0){n.active=true;n.respawn=0;g.ui.log('A harvest tree has regrown.','gold');}}});
    if(!this.active||!p)return;
    if(!this.active.active){this.cancel();return;}
    if(Math.hypot(this.active.x-p.x,this.active.y-p.y)>112){g.ui.log(`You moved too far away and stopped ${this.nodeLabel(this.active).toLowerCase()}.`,'bad');this.cancel();return;}
    this.timer+=dt;
    if(this.timer>=this.duration)this.finish();
  };
})();
</script>
<script>

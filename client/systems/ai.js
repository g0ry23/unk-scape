(function(){
  window.Duskfall = window.Duskfall || {};
const US = window.UnkScape = window.Duskfall;
  US.AISystem=function(game){this.game=game;this.spawnTimer=4;};
  US.AISystem.prototype.update=function(dt){
    const g=this.game,p=g.player;if(!p)return;
    const night=g.systems.daynight.isNight();
    this.spawnTimer-=dt;
    if(this.spawnTimer<=0){
      this.spawnTimer=night?5.5:12;
      const cap=night?80:54;
      if(g.entities.enemies.length<cap) US.spawnRandomEnemy(g,Math.random,night);
    }
    for(const e of g.entities.enemies){
      e.update(dt,g); if(e.dead) continue;
      const d=US.dist(e,p), cfg=e.cfg;
      let tx=e.spawnX,ty=e.spawnY, speed=cfg.speed;
      if(d<cfg.aggro){tx=p.x;ty=p.y; if(night) speed*=1.08;}
      else{
        e.wander-=dt;
        if(e.wander<=0){e.wander=2+Math.random()*4;e.wx=e.spawnX+(Math.random()-.5)*180;e.wy=e.spawnY+(Math.random()-.5)*180;}
        tx=e.wx||e.spawnX;ty=e.wy||e.spawnY;speed*=.45;
      }
      if(d<cfg.attackRange+e.r+p.r){g.systems.combat.enemyAttack(e); continue;}
      const ang=Math.atan2(ty-e.y,tx-e.x), nx=e.x+Math.cos(ang)*speed*dt, ny=e.y+Math.sin(ang)*speed*dt;
      if(!US.solidAt(g.world,nx,e.y,e.r))e.x=nx;
      if(!US.solidAt(g.world,e.x,ny,e.r))e.y=ny;
    }
    g.entities.resources.forEach(r=>{ if(typeof r.update === "function") r.update(dt); });
  };
})();

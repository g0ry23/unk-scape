(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.createEnemy=function(type,x,y){
    const cfg=D.ENEMIES[type];
    return {
      uid:D.uid('mob'),kind:'enemy',type,cfg,x,y,vx:0,vy:0,r:17,hp:cfg.hp,maxHp:cfg.hp,dead:false,targeted:false,
      attackTimer:Math.random(),hitFlash:0,spawnX:x,spawnY:y,wander:Math.random()*10,
      update(dt,g){
        if(this.dead)return;
        this.hitFlash=Math.max(0,this.hitFlash-dt);
        this.attackTimer=Math.max(0,this.attackTimer-dt);
      },
      takeDamage(amount,source){
        this.hp=Math.max(0,this.hp-amount);this.hitFlash=.12;
        if(this.hp<=0){this.dead=true;}
      }
    };
  };
})();
</script>
<script>

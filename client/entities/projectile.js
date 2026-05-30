(function(){
  const US = window.UnkScape = window.UnkScape || {};
  US.createProjectile=function(x,y,tx,ty,opts={}){
    const ang=Math.atan2(ty-y,tx-x), speed=opts.speed||360;
    return {uid:US.uid('proj'),x,y,vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed,r:opts.r||4,color:opts.color||'#ffcf6e',life:opts.life||1,dead:false,damage:opts.damage||1,source:opts.source||'player',recoverable:!!opts.recoverable,recoverChance:opts.recoverChance??.72,dropped:false,dropId:opts.dropId||'arrow',style:opts.style||null,
      update(dt,g){
        this.x+=this.vx*dt;this.y+=this.vy*dt;this.life-=dt;
        if(this.life<=0){
          this.dead=true;
          if(g&&this.recoverable&&!this.dropped&&Math.random()<this.recoverChance){
            this.dropped=true;
            g.entities.drops.push({uid:US.uid('drop'),id:this.dropId,qty:1,x:this.x,y:this.y,r:10});
          }
        }
      }
    };
  };
})();

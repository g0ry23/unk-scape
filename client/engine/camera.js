(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.Camera = function(game){
    this.game=game;this.x=0;this.y=0;this.shake=0;
    this.zoom=1.12;this.targetZoom=1.12;this.minZoom=.48;this.maxZoom=2.35;
    this.angle=0;this.targetAngle=this.angle;
    this.pitch=.78;this.targetPitch=.78;
    this.deadzone=26;this.lookAhead=34;
  };
  D.Camera.prototype.snapTo=function(x,y){this.x=x-this.game.viewW/2;this.y=y-this.game.viewH/2;this.clamp();};
  D.Camera.prototype.update=function(dt){
    const p=this.game.player;if(!p)return;
    const leadX=(p.dir?.x||0)*this.lookAhead;
    const leadY=(p.dir?.y||0)*this.lookAhead;
    const targetX=p.x+leadX-this.game.viewW/2;
    const targetY=p.y+leadY-this.game.viewH/2;
    const dx=targetX-this.x, dy=targetY-this.y;
    if(Math.hypot(dx,dy)>this.deadzone){
      this.x=D.lerp(this.x,targetX,1-Math.pow(.006,dt));
      this.y=D.lerp(this.y,targetY,1-Math.pow(.006,dt));
    }
    this.zoom=D.lerp(this.zoom,this.targetZoom,1-Math.pow(.018,dt));
    this.angle=D.lerp(this.angle,this.targetAngle,1-Math.pow(.018,dt));
    this.pitch=D.lerp(this.pitch,this.targetPitch,1-Math.pow(.018,dt));
    if(this.shake>0) this.shake=Math.max(0,this.shake-dt*12);
    this.clamp();
  };
  D.Camera.prototype.setZoom=function(delta,silent=false){
    this.targetZoom=D.clamp(this.targetZoom+delta,this.minZoom,this.maxZoom);
    if(this.game.ui && !silent) this.game.ui.toast('Camera Zoom', Math.round(this.targetZoom*100)+'%', 'good');
  };
  D.Camera.prototype.modeLabel=function(){return this.game.settings.cameraMode==='iso'?'2.5D Aerial':'Overhead';};
  D.Camera.prototype.toggleMode=function(){
    if(this.game.settings.cameraMode==='iso') this.setOverhead();
    else this.setIso();
  };
  D.Camera.prototype.setIso=function(){
    this.game.settings.cameraMode='iso';
    this.targetAngle=0;
    this.targetPitch=.78;
    this.targetZoom=Math.max(this.targetZoom,1.05);
    this.game.ui.toast('Camera Mode','Centered 2.5D aerial view enabled. Use Q/E only when you want to rotate.', 'gold');
  };
  D.Camera.prototype.setOverhead=function(){
    this.game.settings.cameraMode='top';
    this.targetAngle=0;
    this.targetPitch=1;
    this.game.ui.toast('Camera Mode','Overhead view enabled.', 'good');
  };
  D.Camera.prototype.rotate=function(delta){
    this.targetAngle+=delta;
    if(this.targetAngle>Math.PI)this.targetAngle-=Math.PI*2;
    if(this.targetAngle<-Math.PI)this.targetAngle+=Math.PI*2;
    this.game.settings.cameraMode='iso';
    this.targetPitch=.78;
  }; 
  D.Camera.prototype.clamp=function(){
    const W=D.WORLD.pxW,H=D.WORLD.pxH;
    this.x=D.clamp(this.x,-this.game.viewW*.25,Math.max(0,W-this.game.viewW*.75));
    this.y=D.clamp(this.y,-this.game.viewH*.25,Math.max(0,H-this.game.viewH*.75));
  };
  D.Camera.prototype.apply=function(ctx){
    let sx=0,sy=0;
    if(this.shake>0){sx=(Math.random()-.5)*this.shake*6;sy=(Math.random()-.5)*this.shake*6;}
    const cx=this.x+this.game.viewW/2, cy=this.y+this.game.viewH/2;
    ctx.translate(this.game.viewW/2+sx,this.game.viewH/2+sy);
    const pitch=this.game.settings.cameraMode==='iso'?this.pitch:1;
    ctx.scale(this.zoom,this.zoom*pitch);
    if(Math.abs(this.angle)>0.001) ctx.rotate(this.angle);
    ctx.translate(-cx,-cy);
  };
  D.Camera.prototype.worldToScreen=function(wx,wy){
    const cx=this.x+this.game.viewW/2, cy=this.y+this.game.viewH/2;
    let dx=wx-cx, dy=wy-cy, rx=dx, ry=dy;
    const pitch=this.game.settings.cameraMode==='iso'?this.pitch:1;
    if(Math.abs(this.angle)>0.001){
      const c=Math.cos(this.angle),s=Math.sin(this.angle);
      rx=dx*c-dy*s; ry=dx*s+dy*c;
    }
    return {x:this.game.viewW/2+rx*this.zoom,y:this.game.viewH/2+ry*this.zoom*pitch};
  };
  D.Camera.prototype.screenToWorld=function(sx,sy){
    const cx=this.x+this.game.viewW/2, cy=this.y+this.game.viewH/2;
    let rx=(sx-this.game.viewW/2)/this.zoom;
    const pitch=this.game.settings.cameraMode==='iso'?this.pitch:1;
    let ry=(sy-this.game.viewH/2)/(this.zoom*pitch);
    if(Math.abs(this.angle)>0.001){
      const c=Math.cos(-this.angle),s=Math.sin(-this.angle);
      const dx=rx*c-ry*s, dy=rx*s+ry*c;
      return {x:cx+dx,y:cy+dy};
    }
    return {x:cx+rx,y:cy+ry};
  };
  D.Camera.prototype.bump=function(amount){this.shake=Math.max(this.shake,amount||1);};
})();

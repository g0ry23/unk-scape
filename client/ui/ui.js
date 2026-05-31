(function(){
  const US = window.UnkScape = window.UnkScape || {};
  US.UI=function(game){this.game=game;this.panel=null;this.dialogNpc=null;this.toastId=0;};
  US.UI.prototype.closeAll=function(){document.getElementById('panel').classList.remove('show');document.getElementById('dialog').classList.remove('show');document.getElementById('menu').classList.remove('show');this.panel=null;this.dialogNpc=null;if(this.game.state==='play')this.game.paused=false;this.syncLayoutState();this.clearInputLocks();};
  US.UI.prototype.clearInputLocks=function(){const g=this.game;if(!g.input||!g.input.mouse)return;g.input.mouse.leftDown=false;g.input.mouse.rightDown=false;g.input.mouse.leftHeld=0;if(g.player){g.player.blocking=false;g.player.heavyCharging=false;}};
  US.UI.prototype.syncLayoutState=function(){
    const root=document.getElementById('ui-root');
    const panel=document.getElementById('panel').classList.contains('show');
    const dialog=document.getElementById('dialog').classList.contains('show');
    const menu=document.getElementById('menu').classList.contains('show');
    root.classList.toggle('panel-open',panel);
    root.classList.toggle('dialog-open',dialog&&!panel&&!menu);
    root.classList.toggle('menu-open',menu);
  };
  US.UI.prototype.update=function(){this.syncLayoutState();this._syncHUDVisibility();this.renderHUD();this.renderCombatUI();this.renderHotbar();this.renderActionHint();};
US.UI.prototype._syncHUDVisibility=function(){
  var g=this.game;
  var inPlay=g&&g.state==='play';
  var show=inPlay?'':'none';
  var ids=['log','hud','hotbar','combat-ui','float-texts'];
  for(var i=0;i<ids.length;i++){
    var el=document.getElementById(ids[i]);
    if(!el)continue;
    if(!inPlay&&el.id==='log')el.innerHTML='';
    el.style.display=show;
  }
};
  US.UI.prototype.floatText=function(x,y,text,color){if(this.game.settings?.display?.floatingText===false)return;this.game.entities.effects.push({x,y,text,color,t:1,maxT:1,float:55,size:16});};
  US.UI.prototype.applyDisplaySettings=function(){
    const d=this.game.settings.display||{};
    document.documentElement.dataset.uiScale=d.uiScale||'normal';
    document.body.classList.toggle('reduced-fx',!!d.reducedFx);
  };
  US.UI.prototype.renderActionHint=function(){
    const el=document.getElementById('action-hint'), g=this.game, p=g.player;
    if(!el||!p||g.state!=='play'||g.paused){if(el){el.classList.remove('show');el.innerHTML='';}return;}
    const mx=g.input.mouse.worldX,my=g.input.mouse.worldY;
    const screenX=g.input.mouse.x+18, screenY=g.input.mouse.y-18;
    let text='';
    const nearEnemy=g.entities.enemies.filter(e=>!e.dead&&Math.hypot(e.x-mx,e.y-my)<e.r+34&&Math.hypot(e.x-p.x,e.y-p.y)<p.stats().range+140).sort((a,b)=>Math.hypot(a.x-mx,a.y-my)-Math.hypot(b.x-mx,b.y-my))[0];
    const nearNode=(g.systems.gathering?.nodes||[]).find(n=>n.active&&Math.hypot(n.x-mx,n.y-my)<=n.r+24&&Math.hypot(n.x-p.x,n.y-p.y)<=96);
    const nearResource=g.entities.resources.filter(r=>r.amount>0&&Math.hypot(r.x-mx,r.y-my)<=r.r+26&&Math.hypot(r.x-p.x,r.y-p.y)<=96).sort((a,b)=>Math.hypot(a.x-mx,a.y-my)-Math.hypot(b.x-mx,b.y-my))[0];
    const nearNpc=g.entities.npcs.find(n=>Math.hypot(n.x-mx,n.y-my)<34&&Math.hypot(n.x-p.x,n.y-p.y)<80);
    const nearDrop=g.entities.drops.find(d=>Math.hypot(d.x-mx,d.y-my)<32&&Math.hypot(d.x-p.x,d.y-p.y)<55);
    if(g.buildMode){text=`<span class="hint-dot"></span><b>LMB</b> Place • <b>RMB</b> Remove • <b>T</b> Cycle ${US.TILES[g.systems.build.selected()].name}`;}
    else if(nearNpc){text=`<span class="hint-dot"></span><b>F</b> Talk to ${nearNpc.cfg.name}`;}
    else if(nearEnemy){const style=g.systems.combat.weaponStyle(p);text=`<span class="hint-dot"></span><b>LMB</b> ${style==='range'?'Shoot':style==='mage'?'Cast':'Attack'} ${nearEnemy.cfg.name} • <b>Hold</b> Heavy • <b>RMB</b> Block`;}
    else if(nearDrop){text=`<span class="hint-dot"></span>Walk over to pick up ${US.ITEMS[nearDrop.id]?.name||nearDrop.id}`;}
    if(!text){el.classList.remove('show');el.innerHTML='';return;}
    el.innerHTML=text;el.style.left=US.clamp(screenX,120,g.viewW-120)+'px';el.style.top=US.clamp(screenY,60,g.viewH-100)+'px';el.classList.add('show');
  };

// ── World Loading Screen ──────────────────────────────────────────────────
US.UI.prototype.showLoader=function(title){
let el=document.getElementById('world-loader');
if(!el){
el=document.createElement('div');
el.id='world-loader';
el.innerHTML='<div class="loader-inner"><div class="loader-title" id="loader-title">Generating World...</div><div class="loader-bar-wrap"><div class="loader-bar" id="loader-bar"></div></div><div class="loader-label" id="loader-label">Starting...</div></div>';
document.body.appendChild(el);
}
el.style.display='flex';
const t=el.querySelector('#loader-title');
if(t) t.textContent=title||'Loading...';
const bar=el.querySelector('#loader-bar');
if(bar){bar.style.width='0%';bar.style.transition='none';}
};
US.UI.prototype.updateLoader=function(pct,label){
const bar=document.getElementById('loader-bar');
const lbl=document.getElementById('loader-label');
if(bar){bar.style.transition='width 0.18s ease';bar.style.width=Math.round(US.clamp(pct,0,1)*100)+'%';}
if(lbl) lbl.textContent=label||'';
};
US.UI.prototype.hideLoader=function(){
const el=document.getElementById('world-loader');
if(!el)return;
el.style.opacity='0';
el.style.transition='opacity 0.35s ease';
setTimeout(function(){ el.style.display='none'; el.style.opacity='1'; el.style.transition=''; },360);
};
})();

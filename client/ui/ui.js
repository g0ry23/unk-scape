(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.UI=function(game){this.game=game;this.panel=null;this.dialogNpc=null;this.toastId=0;};
  D.UI.prototype.closeAll=function(){document.getElementById('panel').classList.remove('show');document.getElementById('dialog').classList.remove('show');document.getElementById('menu').classList.remove('show');this.panel=null;this.dialogNpc=null;if(this.game.state==='play')this.game.paused=false;this.syncLayoutState();this.clearInputLocks();};
  D.UI.prototype.clearInputLocks=function(){const g=this.game;if(!g.input||!g.input.mouse)return;g.input.mouse.leftDown=false;g.input.mouse.rightDown=false;g.input.mouse.leftHeld=0;if(g.player){g.player.blocking=false;g.player.heavyCharging=false;}};
  D.UI.prototype.syncLayoutState=function(){
    const root=document.getElementById('ui-root');
    const panel=document.getElementById('panel').classList.contains('show');
    const dialog=document.getElementById('dialog').classList.contains('show');
    const menu=document.getElementById('menu').classList.contains('show');
    root.classList.toggle('panel-open',panel);
    root.classList.toggle('dialog-open',dialog&&!panel&&!menu);
    root.classList.toggle('menu-open',menu);
  };
  D.UI.prototype.update=function(){this.syncLayoutState();this.renderHUD();this.renderCombatUI();this.renderHotbar();this.renderActionHint();};
  D.UI.prototype.floatText=function(x,y,text,color){if(this.game.settings?.display?.floatingText===false)return;this.game.entities.effects.push({x,y,text,color,t:1,maxT:1,float:55,size:16});};
  D.UI.prototype.applyDisplaySettings=function(){
    const d=this.game.settings.display||{};
    document.documentElement.dataset.uiScale=d.uiScale||'normal';
    document.body.classList.toggle('reduced-fx',!!d.reducedFx);
  };
  D.UI.prototype.renderActionHint=function(){
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
    if(g.buildMode){text=`<span class="hint-dot"></span><b>LMB</b> Place • <b>RMB</b> Remove • <b>T</b> Cycle ${D.TILES[g.systems.build.selected()].name}`;}
    else if(nearNpc){text=`<span class="hint-dot"></span><b>F</b> Talk to ${nearNpc.cfg.name}`;}
    else if(nearNode){text=`<span class="hint-dot"></span><b>LMB</b> Chop Harvest Tree`;} 
    else if(nearResource){text=`<span class="hint-dot"></span><b>LMB</b> ${nearResource.cfg.action||'Gather'} ${nearResource.cfg.name}`;}
    else if(nearEnemy){const style=g.systems.combat.weaponStyle(p);text=`<span class="hint-dot"></span><b>LMB</b> ${style==='range'?'Shoot':style==='mage'?'Cast':'Attack'} ${nearEnemy.cfg.name} • <b>Hold</b> Heavy • <b>RMB</b> Block`;}
    else if(nearDrop){text=`<span class="hint-dot"></span>Walk over to pick up ${D.ITEMS[nearDrop.id]?.name||nearDrop.id}`;}
    if(!text){el.classList.remove('show');el.innerHTML='';return;}
    el.innerHTML=text;el.style.left=D.clamp(screenX,120,g.viewW-120)+'px';el.style.top=D.clamp(screenY,60,g.viewH-100)+'px';el.classList.add('show');
  };
})();

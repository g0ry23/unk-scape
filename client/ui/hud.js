(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.UI.prototype.renderHUD=function(){
    const g=this.game, root=document.getElementById('hud');
    if(!g.player||g.state==='menu'){root.innerHTML='';return;}
    const p=g.player, combatLvl=D.levelForXp(p.skills.combat.xp), totalLvl=Object.values(p.skills).reduce((a,s)=>a+D.levelForXp(s.xp),0);
    const hpPct=p.hp/p.maxHp*100;
    const next=D.xpForLevel(combatLvl+1), cur=D.xpForLevel(combatLvl), xpPct=(p.skills.combat.xp-cur)/Math.max(1,next-cur)*100;
    root.innerHTML=`
      <div class="hud-left">
        <div class="hud-card brand"><div class="brand-mark"></div><div><h1>UNK-SCAPE</h1><small>${g.systems.daynight.label()} • Day ${Math.floor(g.time/g.systems.daynight.dayLength)+1} • ${g.entities.enemies.length} mobs • ${g.camera.modeLabel()}</small></div></div>
        <div class="hud-card bars">
          <div class="bar-wrap"><span>Health</span><div class="bar hp"><i style="width:${hpPct}%"></i></div><b>${Math.ceil(p.hp)}/${p.maxHp}</b></div>
          <div class="bar-wrap"><span>Combat</span><div class="bar xp"><i style="width:${D.clamp(xpPct,0,100)}%"></i></div><b>Lv ${combatLvl}</b></div>
        </div>
        <div class="hud-card stat-row">
          <span class="pill gold"><i class="dot"></i>${g.systems.inventory.count('coin')} coins</span>
          <span class="pill green"><i class="dot"></i>Total Lv ${totalLvl}</span>
          <span class="pill purple"><i class="dot"></i>Zoom ${Math.round(g.camera.targetZoom*100)}%</span>
          <span class="pill orange"><i class="dot"></i>Hunger ${g.settings.hungerEnabled?'On':'Off'}</span>
          <span class="pill"><i class="dot"></i>Build ${g.buildMode?'On':'Off'}</span>
          <span class="pill gold" title="Faction choice shows here after character creation"><i class="dot"></i>${D.FACTIONS[p.factionId]?.icon||'⚑'} ${p.factionName||'No Faction'}</span>
          <span class="pill purple" title="Class storyline"><i class="dot"></i>${D.getClassStory(p.classId).title}</span>
        </div>
      </div>
      <div class="hud-right">
        <div class="hud-card minimap"><canvas id="minimap" width="164" height="164"></canvas></div>
      </div>`;
    this.drawMinimap();
  };
  D.UI.prototype.renderCombatUI=function(){
    const el=document.getElementById('combat-ui'), g=this.game, p=g.player;
    if(!el||!p||g.state==='menu'){if(el)el.innerHTML='';return;}
    const charge=D.clamp((p.heavyCharge||0)/Math.max(.01,(g.systems.combat?.maxCharge||1.25)-(g.systems.combat?.heavyThreshold||.72)),0,1)*100;
    el.innerHTML=`<div class="combat-card">
      <div class="combat-chip ${p.heavyCharging?'active':''}">⚔️ ${g.buildMode?'Place':p.heavyCharging?'Heavy Charging':'Tap Attack'}</div>
      <div class="charge-meter"><i style="width:${charge}%"></i></div>
      <div class="combat-chip ${p.blocking?'blocking':''}">🛡️ ${g.buildMode?'Remove':p.blocking?'Guarding':'Guard'}</div>
      <div class="combat-chip ${g.buildMode?'active':''}">🛠️ Build ${g.buildMode?D.TILES[g.systems.build.selected()].name:'Off'}</div>
    </div>`;client/ui/hud.js
  };
  D.UI.prototype.renderHotbar=function(){
    const el=document.getElementById('hotbar'), g=this.game, p=g.player;
    if(!el||!p||g.state==='menu'){if(el)el.innerHTML='';return;}
    const slots=g.hotbar?.slots||[];
    el.innerHTML=`<div class="hotbar-card">${slots.map((id,i)=>{
      const it=D.ITEMS[id]||{name:id,icon:'❔'};
      const equipped=Object.values(p.equipment||{}).includes(id);
      const qty=g.systems.inventory.count(id)+(equipped?1:0);
      const selected=g.hotbar.selected===i || (equipped && ['weapon','tool'].includes(it.slot||''));
      return `<div class="hotbar-slot ${selected?'selected':''} ${qty<=0?'missing':''}" title="${it.name}"><span class="num">${i+1}</span><span class="ico">${it.icon}</span>${qty>1?`<span class="qty">x${qty}</span>`:''}<span class="name">${it.name}</span></div>`;
    }).join('')}</div>`;
  };
  D.UI.prototype.drawMinimap=function(){
    const c=document.getElementById('minimap'); if(!c||!this.game.world)return; const ctx=c.getContext('2d'), g=this.game;
    const W=164,H=164;ctx.clearRect(0,0,W,H);
    const sx=W/D.WORLD.w, sy=H/D.WORLD.h;
    for(let y=0;y<D.WORLD.h;y+=2)for(let x=0;x<D.WORLD.w;x+=2){ctx.fillStyle=D.TILES[g.world.tiles[y][x]].color;ctx.fillRect(x*sx,y*sy,Math.ceil(sx*2),Math.ceil(sy*2));}
    ctx.fillStyle='#63e6a4';g.entities.npcs.forEach(n=>ctx.fillRect(n.x/D.TILE*sx-1,n.y/D.TILE*sy-1,3,3));
    ctx.fillStyle='#ff5c7a';g.entities.enemies.slice(0,90).forEach(e=>ctx.fillRect(e.x/D.TILE*sx,e.y/D.TILE*sy,2,2));
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(g.player.x/D.TILE*sx,g.player.y/D.TILE*sy,3,0,Math.PI*2);ctx.fill();
    ctx.save();
    ctx.translate(g.player.x/D.TILE*sx,g.player.y/D.TILE*sy);
    ctx.rotate(g.camera.targetAngle||g.camera.angle||0);
    ctx.strokeStyle='#f7c65b';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(5,4);ctx.lineTo(0,1);ctx.lineTo(-5,4);ctx.closePath();ctx.stroke();
    ctx.restore();
  };
})();
</script>
<script>

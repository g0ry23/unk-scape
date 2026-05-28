(function(){
  const D = window.Duskfall = window.Duskfall || {};

  D.render = function(g){
    const ctx=g.ctx;
    ctx.setTransform(g.dpr,0,0,g.dpr,0,0);
    ctx.clearRect(0,0,g.viewW,g.viewH);
    if(!g.world){ drawMenuBg(g,ctx); return; }

    ctx.save();
    g.camera.apply(ctx);
    drawTiles(g,ctx);
    drawTerrainVolume(g,ctx);
    drawTileDepth(g,ctx);
    drawZoneOverlays(g,ctx);
    drawTurfClaims(g,ctx);
    drawBuildGhost(g,ctx);
    drawGatheringNodes(g,ctx);
    drawResources(g,ctx);
    drawDrops(g,ctx);
    drawNPCs(g,ctx);
    drawPortals(g,ctx);
    drawProjectiles(g,ctx);
    drawEnemies(g,ctx);
    drawPlayer(g,ctx);
    drawGatherProgress(g,ctx);
    drawEffects(g,ctx);
    ctx.restore();
    drawLighting(g,ctx);
    drawVignette(g,ctx);
  };

  function visibleBounds(g,pad=6){
    const t=D.TILE;
    const cx=g.camera.x+g.viewW/2, cy=g.camera.y+g.viewH/2;
    const reach=(Math.max(g.viewW,g.viewH)/(g.camera.zoom||1.0))*1.35 + t*pad;
    return {
      x0:Math.max(0,Math.floor((cx-reach)/t)),
      y0:Math.max(0,Math.floor((cy-reach)/t)),
      x1:Math.min(D.WORLD.w,Math.ceil((cx+reach)/t)),
      y1:Math.min(D.WORLD.h,Math.ceil((cy+reach)/t))
    };
  }

  function drawTiles(g,ctx){
    const b=visibleBounds(g), t=D.TILE;
    for(let y=b.y0;y<b.y1;y++) for(let x=b.x0;x<b.x1;x++){
      const id=g.world.tiles[y][x]; const tile=D.TILES[id];
      const px=x*t, py=y*t;
      const grad=ctx.createLinearGradient(px,py,px,py+t);
      grad.addColorStop(0,shade(tile.color,10));
      grad.addColorStop(.55,tile.color);
      grad.addColorStop(1,shade(tile.color,-14));
      ctx.fillStyle=grad; ctx.fillRect(px,py,t,t);
      // subtle texture
      const n=g.world.noise[y][x];
      ctx.fillStyle=n>.52?tile.variant:'rgba(255,255,255,.018)';
      ctx.globalAlpha=.32;
      ctx.fillRect(px+3+(n*13%6),py+4+(n*19%6),Math.max(7,t*.38),Math.max(2,t*.06));
      ctx.globalAlpha=1;
      if(id==='water'){
        ctx.strokeStyle='rgba(120,205,255,.15)'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(px+4,py+t*.42+n*7); ctx.quadraticCurveTo(px+t*.5,py+t*.25,px+t-4,py+t*.42+n*7); ctx.stroke();
      }
      if(id==='path'){
        ctx.fillStyle='rgba(255,255,255,.035)';
        ctx.fillRect(px+6,py+6,4,3);ctx.fillRect(px+t-14,py+t-15,5,3);
      }
    }
    // grid fade
    ctx.strokeStyle='rgba(0,0,0,.045)';ctx.lineWidth=1;
    if(t>=36){
      for(let x=b.x0;x<=b.x1;x++){ctx.beginPath();ctx.moveTo(x*t,b.y0*t);ctx.lineTo(x*t,b.y1*t);ctx.stroke();}
      for(let y=b.y0;y<=b.y1;y++){ctx.beginPath();ctx.moveTo(b.x0*t,y*t);ctx.lineTo(b.x1*t,y*t);ctx.stroke();}
    }
  }

  function drawTerrainVolume(g,ctx){
    const b=visibleBounds(g), t=D.TILE;
    for(let y=b.y0;y<b.y1;y++) for(let x=b.x0;x<b.x1;x++){
      const id=g.world.tiles[y][x], n=g.world.noise[y][x];
      if(id==='water') continue;
      let h=0;
      if(id==='stone') h=10+Math.floor(n*24);
      else if(id==='darkgrass') h=5+Math.floor(n*13);
      else if(id==='dirt') h=3+Math.floor(n*9);
      else if(id==='sand') h=2+Math.floor(n*7);
      else if(id==='grass') h=2+Math.floor(n*6);
      if(!h) continue;
      const px=x*t, py=y*t;
      ctx.save();
      ctx.globalAlpha=.18;
      ctx.fillStyle='rgba(255,255,255,.22)';
      ctx.fillRect(px+3,py+3,t-6,Math.max(1,h*.08));
      ctx.globalAlpha=.20;
      ctx.fillStyle='rgba(0,0,0,.45)';
      ctx.fillRect(px+5,py+t-5,t-10,Math.max(2,h*.16));
      if(h>18){
        ctx.globalAlpha=.16;
        ctx.strokeStyle='rgba(247,198,91,.45)';
        ctx.lineWidth=1;
        ctx.strokeRect(px+6,py+6,t-12,t-12);
      }
      ctx.restore();
    }
  }

  function drawTileDepth(g,ctx){
    const b=visibleBounds(g), t=D.TILE;
    const heightMap={wall:34,roof:28,fence:18,woodfloor:8,stonepath:5,plaza:6};
    for(let y=b.y0;y<b.y1;y++) for(let x=b.x0;x<b.x1;x++){
      const id=g.world.tiles[y][x], tile=D.TILES[id], h=heightMap[id]||0;
      if(!h) continue;
      const px=x*t, py=y*t;
      ctx.save();
      ctx.globalAlpha=.88;
      ctx.fillStyle='rgba(0,0,0,.18)';
      ctx.fillRect(px+6,py+t-3,t-10,Math.max(4,h*.28));
      ctx.fillStyle=shade(tile.color,-28);
      ctx.fillRect(px,py+t-h,t,h);
      ctx.fillStyle=shade(tile.color,-42);
      ctx.fillRect(px+t-h*.22,py+h*.15,h*.22,t-h*.15);
      ctx.strokeStyle='rgba(255,255,255,.07)';
      ctx.lineWidth=1;
      ctx.strokeRect(px+2,py+2,t-4,t-4);
      ctx.restore();
    }
  }

  function drawZoneOverlays(g,ctx){
    if(!g.world)return;
    Object.entries(D.STARTER_ZONES||{}).forEach(([id,z])=>{
      const wx=z.x*D.TILE+D.TILE/2, wy=z.y*D.TILE+D.TILE/2;
      if(!onScreen(g,{x:wx,y:wy},260))return;
      const feat=D.getZoneFeature(id);
      ctx.save();ctx.translate(wx,wy);
      ctx.strokeStyle='rgba(247,198,91,.38)';ctx.lineWidth=3;circle(ctx,0,0,z.r*D.TILE*.28);ctx.stroke();
      if(g.settings.display.showWorldLabels){
        label(ctx,`${z.icon} ${z.name}`,0,-86,'#f7c65b');
        label(ctx,feat.landmark,0,-62,'#e9f0ff');
      }
      const fids=D.getClassFactions(id)||[];
      const offsets=[[-9,-9],[9,9]];
      fids.forEach((fid,i)=>{
        const f=D.FACTIONS[fid], ox=offsets[i][0]*D.TILE, oy=offsets[i][1]*D.TILE;
        ctx.save();ctx.translate(ox,oy);
        ctx.fillStyle='rgba(0,0,0,.25)';ellipse(ctx,0,20,32,9);ctx.fill();
        ctx.fillStyle=f.color||'#f7c65b';round(ctx,-3,-38,6,58,3);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.12)';round(ctx,-3,-38,6,58,3);ctx.fill();
        ctx.beginPath();ctx.moveTo(2,-36);ctx.lineTo(42,-25);ctx.lineTo(2,-12);ctx.closePath();ctx.fillStyle=f.color||'#f7c65b';ctx.fill();
        ctx.font='18px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(f.icon,22,-24);
        if(D.dist(g.player,{x:wx+ox,y:wy+oy})<130) label(ctx,f.name,20,-58,f.color||'#f7c65b');
        ctx.restore();
      });
      ctx.restore();
    });
  }

  function drawTurfClaims(g,ctx){
    const sys=g.systems.turf;if(!sys||!sys.points)return;
    sys.points.forEach(pt=>{
      if(!onScreen(g,pt,140))return;
      const f=D.FACTIONS[pt.factionId]||{};
      ctx.save();ctx.translate(pt.x,pt.y);
      ctx.strokeStyle=pt.owner?f.color:'rgba(255,255,255,.25)';ctx.lineWidth=3;
      ctx.globalAlpha=.78;circle(ctx,0,0,pt.r);ctx.stroke();ctx.globalAlpha=1;
      ctx.fillStyle='rgba(0,0,0,.32)';ellipse(ctx,0,18,28,8);ctx.fill();
      ctx.fillStyle=f.color||'#f7c65b';circle(ctx,0,0,18);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='18px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.icon||'⚑',0,0);
      const pct=Math.round((pt.progress||0)*100);
      if(D.dist(g.player,pt)<125) label(ctx,`${pt.owner?'CLAIMED':'CLAIM'} ${pct}%`,0,-35,f.color||'#f7c65b');
      ctx.restore();
    });
  }

  function drawBuildGhost(g,ctx){
    if(!g.buildMode||!g.player||!g.systems.build)return;
    const tx=Math.floor(g.input.mouse.worldX/D.TILE), ty=Math.floor(g.input.mouse.worldY/D.TILE);
    if(tx<0||ty<0||tx>=D.WORLD.w||ty>=D.WORLD.h)return;
    const tileId=g.systems.build.selected(), tile=D.TILES[tileId];
    const px=tx*D.TILE, py=ty*D.TILE;
    const wx=px+D.TILE/2, wy=py+D.TILE/2;
    const ok=Math.hypot(wx-g.player.x,wy-g.player.y)<=165 && !['water','wall','roof'].includes(g.world.tiles[ty]?.[tx]);
    ctx.save();
    ctx.globalAlpha=ok ? .62 : .32;
    ctx.fillStyle=ok?tile.color:'#ff5c7a';
    ctx.fillRect(px+3,py+3,D.TILE-6,D.TILE-6);
    ctx.strokeStyle=ok?'rgba(247,198,91,.95)':'rgba(255,92,122,.95)';
    ctx.lineWidth=3;
    ctx.strokeRect(px+3,py+3,D.TILE-6,D.TILE-6);
    ctx.globalAlpha=1;
    label(ctx,ok?'Build: '+tile.name:'Blocked',wx,wy-34,ok?'#f7c65b':'#ff5c7a');
    ctx.restore();
  }

  function drawGatheringNodes(g,ctx){
    const sys=g.systems.gathering;
    if(!sys||!sys.nodes)return;
    sys.nodes.forEach(node=>{
      if(!node.active)return;
      if(!onScreen(g,node,120))return;
      ctx.save();
      ctx.translate(node.x,node.y);
      ctx.fillStyle='rgba(0,0,0,.32)';
      ellipse(ctx,4,25,30,9);ctx.fill();
      ctx.fillStyle='#5a351c';
      round(ctx,-8,-4,16,38,7);ctx.fill();
      ctx.fillStyle='#1f8f4d';
      circle(ctx,0,-34,31);ctx.fill();
      ctx.fillStyle='#38d978';
      circle(ctx,-10,-45,20);ctx.fill();
      ctx.strokeStyle='rgba(247,198,91,.95)';
      ctx.lineWidth=3;
      circle(ctx,0,-34,36);ctx.stroke();
      label(ctx,'Harvest Tree',0,-82,'#f7c65b');
      ctx.restore();
    });
  }

  function drawGatherProgress(g,ctx){
    const sys=g.systems.gathering,p=g.player;
    if(!sys||!p||!sys.active)return;
    const pct=D.clamp(sys.timer/sys.duration,0,1);
    ctx.save();
    ctx.translate(p.x,p.y-62);
    ctx.fillStyle='rgba(7,10,17,.82)';
    round(ctx,-42,-9,84,18,8);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.18)';
    ctx.lineWidth=1;round(ctx,-42,-9,84,18,8);ctx.stroke();
    ctx.fillStyle='#38d978';
    round(ctx,-38,-5,76*pct,10,5);ctx.fill();
    ctx.fillStyle='#e9f0ff';
    ctx.font='10px var(--mono)';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(sys.nodeLabel(sys.active).toUpperCase().slice(0,24),0,-18);
    ctx.restore();
  }

  function drawResources(g,ctx){
    for(const r of g.entities.resources){
      if(!onScreen(g,r,80) || r.amount<=0) continue;
      const cfg=r.cfg;
      ctx.save(); ctx.translate(r.x,r.y);
      const pulse = r.cooldown>0 ? .55 : 1;
      ctx.globalAlpha=pulse;
      if(r.type==='tree'||r.type==='pine'||r.type==='yew'){
        ctx.fillStyle='rgba(0,0,0,.26)'; ellipse(ctx,5,22,23,7); ctx.fill();
        ctx.fillStyle='#4a2f19'; round(ctx,-8,-6,16,36,7); ctx.fill();
        ctx.fillStyle=shade(cfg.color,-12); circle(ctx,0,-28,27); ctx.fill();
        ctx.fillStyle=cfg.color; circle(ctx,-6,-36,21); ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.10)'; circle(ctx,-12,-42,7); ctx.fill();
      }else if(['rock','copper','iron','silver','gold','gem'].includes(r.type)){
        ctx.fillStyle='rgba(0,0,0,.24)'; ellipse(ctx,3,18,25,7); ctx.fill();
        ctx.fillStyle=shade(cfg.color,-32); poly(ctx,[[-22,14],[-14,-6],[8,-15],[24,0],[16,20],[-8,22]]); ctx.fill();
        ctx.fillStyle=cfg.color; poly(ctx,[[-16,8],[-8,-14],[11,-21],[22,-4],[10,8],[-2,13]]); ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.16)'; poly(ctx,[[-7,-9],[6,-15],[13,-3],[-1,2]]); ctx.fill();
      }else if(r.type==='fish'){
        ctx.fillStyle='rgba(0,0,0,.22)'; ellipse(ctx,0,12,26,8); ctx.fill();
        ctx.strokeStyle='rgba(120,205,255,.65)'; ctx.lineWidth=3; circle(ctx,0,0,19); ctx.stroke();
        ctx.fillStyle='#7cc7ff'; ctx.font='22px serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('🐟',0,0);
      }else if(r.type==='berry'){
        ctx.fillStyle='#225c39'; circle(ctx,0,0,19); ctx.fill();
        ctx.fillStyle='#7cc7ff'; for(let i=0;i<5;i++) circle(ctx,Math.cos(i)*10,Math.sin(i*2)*8,3.5),ctx.fill();
      }else if(r.type==='herb'){
        ctx.fillStyle=cfg.color; for(let i=0;i<5;i++){ctx.rotate(.8); round(ctx,0,-18,6,18,5);ctx.fill();}
      }
      ctx.globalAlpha=1;
      if(D.dist(g.player,r)<92) label(ctx,`${cfg.action||'Gather'}: ${cfg.name} T${cfg.tier||1}`,0,-44,'#f7c65b');
      ctx.restore();
    }
  }

  function drawNPCs(g,ctx){
    for(const n of g.entities.npcs){
      if(!onScreen(g,n,80)) continue;
      ctx.save();ctx.translate(n.x,n.y);
      ctx.fillStyle='rgba(0,0,0,.25)'; ellipse(ctx,0,17,22,7); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,.30)';ellipse(ctx,0,20,24,8);ctx.fill();
      ctx.fillStyle=shade(n.color||'#6aa7ff',-30);round(ctx,-13,0,26,31,10);ctx.fill();
      ctx.fillStyle=n.color||'#6aa7ff';round(ctx,-11,-2,22,27,9);ctx.fill();
      ctx.fillStyle='#d7a86e';circle(ctx,0,-17,11);ctx.fill();
      ctx.font='20px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.cfg.icon,0,-18);
      label(ctx,n.cfg.name,0,-34);
      if(D.dist(g.player,n)<70){label(ctx,'Talk',0,38,'#f7c65b');}
      ctx.restore();
    }
  }

  function drawPortals(g,ctx){
    for(const p of g.entities.portals){
      if(!onScreen(g,p,100)) continue;
      ctx.save();ctx.translate(p.x,p.y);
      const a=(Math.sin(g.time*3)+1)/2;
      ctx.strokeStyle=`rgba(185,140,255,${.35+a*.35})`;ctx.lineWidth=5;
      circle(ctx,0,0,26+a*4);ctx.stroke();
      ctx.fillStyle='rgba(185,140,255,.12)';circle(ctx,0,0,22);ctx.fill();
      label(ctx,p.name,0,-43);
      if(D.dist(g.player,p)<70) label(ctx,'Enter',0,43,'#b98cff');
      ctx.restore();
    }
  }

  function drawEnemies(g,ctx){
    for(const e of g.entities.enemies){
      if(!onScreen(g,e,100) || e.dead) continue;
      const cfg=e.cfg;
      ctx.save();ctx.translate(e.x,e.y);
      ctx.fillStyle='rgba(0,0,0,.3)';ellipse(ctx,0,16,22,7);ctx.fill();
      if(cfg.elite){ctx.strokeStyle='rgba(185,140,255,.45)';ctx.lineWidth=3;circle(ctx,0,0,25+Math.sin(g.time*5)*2);ctx.stroke();}
      ctx.fillStyle=shade(cfg.color,-30);round(ctx,-15,-1,30,31,12);ctx.fill();
      ctx.fillStyle=cfg.color;circle(ctx,0,-10,e.r||17);ctx.fill();
      ctx.fillStyle='rgba(0,0,0,.22)';circle(ctx,6,-5,8);ctx.fill();
      ctx.font='22px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(cfg.icon,0,-10);
      // HP bar
      const w=42,h=6,pct=e.hp/e.maxHp;
      ctx.fillStyle='rgba(0,0,0,.45)';round(ctx,-w/2,-34,w,h,99);ctx.fill();
      ctx.fillStyle=pct>.5?'#63e6a4':pct>.25?'#ffcf6e':'#ff5c7a';round(ctx,-w/2,-34,w*pct,h,99);ctx.fill();
      if(e.targeted){ctx.strokeStyle='rgba(106,167,255,.88)';ctx.lineWidth=3;circle(ctx,0,0,28+Math.sin(g.time*10)*2);ctx.stroke();label(ctx,'TARGET: '+cfg.name,0,-48,'#6aa7ff');}
      if((e.hitMarker||0)>0){ctx.strokeStyle='rgba(99,230,164,.95)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-13,-13);ctx.lineTo(13,13);ctx.moveTo(13,-13);ctx.lineTo(-13,13);ctx.stroke();}
      if((e.missMarker||0)>0){ctx.strokeStyle='rgba(255,92,122,.88)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,30,0,Math.PI*2);ctx.stroke();}
      ctx.restore();
    }
  }

  function drawPlayer(g,ctx){
    const p=g.player;if(!p)return;
    const speed=Math.hypot(p.vx||0,p.vy||0);
    const moving=speed>8;
    const t=g.time*10;
    const step=moving?Math.sin(t)*5:0;
    const bob=moving?Math.abs(Math.sin(t))*2:0;
    const aimAng=p.facingAngle ?? Math.atan2((g.input?.mouse?.worldY||p.y)-p.y,(g.input?.mouse?.worldX||p.x)-p.x);
    const attackPct=p.attackAnimMax?D.clamp(p.attackAnim/p.attackAnimMax,0,1):0;
    const swing=(1-attackPct)*Math.PI*(p.lastAttackHeavy?1.25:.85);
    const weaponId=p.equipment.weapon;
    const weapon=D.ITEMS[weaponId];
    const style=D.EQUIPMENT[weaponId]?.style || weapon?.combatStyle || 'melee';
    const body=p.equipment.body==='iron_armor'?'#9ea7b8':p.equipment.body==='hide_armor'?'#7a5138':p.equipment.body==='ranger_tunic'?'#2f8f5d':p.equipment.body==='apprentice_robe'?'#6d55d8':'#2f6eea';
    const headGear=p.equipment.head;
    ctx.save();ctx.translate(p.x,p.y-bob);
    ctx.fillStyle='rgba(0,0,0,.34)';ellipse(ctx,0,25+bob,30,9);ctx.fill();
    const faction=D.FACTIONS[p.factionId]||{};
    ctx.strokeStyle=faction.color||'rgba(106,167,255,.28)';ctx.globalAlpha=.34;ctx.lineWidth=3;circle(ctx,0,0,25+Math.sin(g.time*4)*1.5);ctx.stroke();ctx.globalAlpha=1;
    ctx.save();ctx.rotate(aimAng+Math.PI/2);
    ctx.fillStyle='#202a3c';
    round(ctx,-14,-3+step,10,38,5);ctx.fill();
    round(ctx,4,-3-step,10,38,5);ctx.fill();
    ctx.fillStyle='#101015';
    round(ctx,-18,29+step,18,11,5);ctx.fill();
    round(ctx,0,29-step,18,11,5);ctx.fill();
    ctx.fillStyle='rgba(247,198,91,.18)';
    round(ctx,-17,29+step,16,3,2);ctx.fill();
    round(ctx,1,29-step,16,3,2);ctx.fill();
    ctx.restore();
    ctx.fillStyle=shade(body,-34);round(ctx,-15,0,30,34,10);ctx.fill();
    ctx.fillStyle=body;round(ctx,-14,-6,28,38,10);ctx.fill();
    ctx.fillStyle=faction.color||'rgba(247,198,91,.5)';ctx.globalAlpha=.34;round(ctx,-15,-7,30,7,6);ctx.fill();ctx.globalAlpha=1;
    ctx.fillStyle='rgba(255,255,255,.10)';round(ctx,-8,-2,6,29,5);ctx.fill();
    const armSwing=attackPct>0?(p.lastAttackHeavy?Math.sin(swing)*18:Math.sin(swing)*12):0;
    ctx.save();ctx.rotate(aimAng);
    ctx.fillStyle='#d7a86e';
    round(ctx,8,-8+armSwing*.04,29,8,6);ctx.fill();
    round(ctx,-34,8-armSwing*.02,26,8,6);ctx.fill();
    ctx.restore();
    ctx.fillStyle='#d7a86e';circle(ctx,0,-20,12);ctx.fill();
    ctx.fillStyle='#1b1b20';ctx.beginPath();ctx.arc(0,-25,12,Math.PI,0);ctx.lineTo(10,-18);ctx.lineTo(-10,-18);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.92)';circle(ctx,-4,-24,2.3);ctx.fill();circle(ctx,4,-24,2.3);ctx.fill();
    if(headGear){
      ctx.fillStyle=headGear==='bronze_helm'?'#b87443':headGear==='leather_hood'?'#5a3824':headGear==='apprentice_hood'?'#4e3bad':'#2b3346';
      ctx.beginPath();ctx.arc(0,-24,13,Math.PI,0);ctx.lineTo(12,-16);ctx.lineTo(-12,-16);ctx.closePath();ctx.fill();
    }
    ctx.save();
    ctx.rotate(aimAng + (attackPct>0 ? -0.95 + swing : 0));
    ctx.lineCap='round';
    if(style==='range'){
      ctx.strokeStyle='#b87943';ctx.lineWidth=5;ctx.beginPath();ctx.arc(29,0,22,-1.15,1.15);ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(20,-20);ctx.lineTo(20,20);ctx.stroke();
      if(p.heavyCharging){ctx.strokeStyle='rgba(247,198,91,.78)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(52,0);ctx.stroke();}
    }else if(style==='mage'){
      ctx.strokeStyle=weaponId==='ember_staff'?'#ff9b5c':'#b98cff';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(46,0);ctx.stroke();
      ctx.fillStyle=weaponId==='ember_staff'?'#ffcf6e':'#b98cff';circle(ctx,52,0,7);ctx.fill();
    }else{
      ctx.strokeStyle=weaponId==='iron_sword'?'#dbe4ff':weaponId==='crude_sword'?'#c0cadb':'rgba(255,255,255,.28)';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(45,0);ctx.stroke();
      ctx.strokeStyle='#5b3b24';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(9,-8);ctx.lineTo(9,8);ctx.stroke();
    }
    ctx.restore();
    if(style==='range'){
      ctx.save();ctx.rotate(aimAng);ctx.fillStyle='rgba(247,198,91,.85)';round(ctx,-18,14,12,5,3);ctx.fill();round(ctx,-18,21,12,5,3);ctx.fill();ctx.restore();
    }
    if(g.systems.turf?.capture){
      const pct=D.clamp(g.systems.turf.capture.progress||0,0,1);
      ctx.save();ctx.translate(0,-58);
      ctx.fillStyle='rgba(7,10,17,.82)';round(ctx,-42,-9,84,18,8);ctx.fill();
      ctx.fillStyle='#f7c65b';round(ctx,-38,-5,76*pct,10,5);ctx.fill();
      ctx.restore();
    }
    if(p.blocking){
      ctx.strokeStyle='rgba(106,167,255,.92)';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,34,aimAng-1.25,aimAng+1.25);ctx.stroke();
      ctx.fillStyle='rgba(106,167,255,.16)';circle(ctx,0,0,36);ctx.fill();
    }
    if(p.heavyCharging){
      const c=D.clamp(p.heavyCharge/.75,0,1);
      ctx.strokeStyle='rgba(255,92,122,.75)';ctx.lineWidth=3+c*5;ctx.beginPath();ctx.arc(0,0,38+c*16,0,Math.PI*2*c);ctx.stroke();
    }
    if(p.attackAnim>0){
      ctx.save();ctx.rotate(p.attackAngle||aimAng);
      ctx.strokeStyle=p.lastAttackHeavy?'rgba(255,92,122,.85)':'rgba(255,207,110,.78)';ctx.lineWidth=p.lastAttackHeavy?8:5;
      ctx.beginPath();ctx.arc(22,0,p.lastAttackHeavy?48:34,-.9,.9);ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawDrops(g,ctx){
    for(const d of g.entities.drops){
      if(!onScreen(g,d,60)) continue;
      const it=D.ITEMS[d.id];
      ctx.save();ctx.translate(d.x,d.y);
      ctx.fillStyle='rgba(0,0,0,.25)';ellipse(ctx,0,12,14,5);ctx.fill();
      ctx.font='20px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(it?.icon||'❔',0,0);
      if(D.dist(g.player,d)<55) label(ctx,(it?.name||d.id)+(d.qty>1?' x'+d.qty:''),0,-24,'#f7c65b');
      ctx.restore();
    }
  }

  function drawProjectiles(g,ctx){
    for(const p of g.entities.projectiles){
      ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle=p.color||'#ffcf6e';circle(ctx,0,0,p.r||4);ctx.fill();ctx.restore();
    }
  }

  function drawEffects(g,ctx){
    for(const e of g.entities.effects){
      ctx.save();ctx.globalAlpha=Math.min(1,e.t*2);ctx.translate(e.x,e.y-e.float*(1-e.t/e.maxT));
      ctx.font=`800 ${e.size||18}px ${e.font||'Inter'}`;ctx.textAlign='center';ctx.fillStyle=e.color||'#fff';ctx.strokeStyle='rgba(0,0,0,.55)';ctx.lineWidth=4;ctx.strokeText(e.text,0,0);ctx.fillText(e.text,0,0);ctx.restore();
    }
  }

  function drawLighting(g,ctx){
    const dn=g.systems.daynight;if(!dn)return;
    const night=dn.nightAmount();
    if(night<=.02)return;
    ctx.save();
    ctx.fillStyle=`rgba(5,7,16,${night*.55})`;ctx.fillRect(0,0,g.viewW,g.viewH);
    // player light
    const p=g.player; if(p){
      const screen=g.camera.worldToScreen(p.x,p.y); const sx=screen.x, sy=screen.y;
      const rad=160 + (g.systems.inventory.has('torch')?80:0);
      const grad=ctx.createRadialGradient(sx,sy,20,sx,sy,rad);
      grad.addColorStop(0,`rgba(255,198,91,${night*.24})`);
      grad.addColorStop(.55,`rgba(255,155,92,${night*.08})`);
      grad.addColorStop(1,'rgba(0,0,0,0)');
      ctx.globalCompositeOperation='lighter';ctx.fillStyle=grad;ctx.fillRect(sx-rad,sy-rad,rad*2,rad*2);
    }
    ctx.restore();
  }
  function drawVignette(g,ctx){
    const grad=ctx.createRadialGradient(g.viewW/2,g.viewH/2,Math.min(g.viewW,g.viewH)*.25,g.viewW/2,g.viewH/2,Math.max(g.viewW,g.viewH)*.72);
    grad.addColorStop(0,'rgba(0,0,0,0)');grad.addColorStop(1,'rgba(0,0,0,.38)');ctx.fillStyle=grad;ctx.fillRect(0,0,g.viewW,g.viewH);
  }
  function drawMenuBg(g,ctx){
    const grd=ctx.createLinearGradient(0,0,0,g.viewH);grd.addColorStop(0,'#101827');grd.addColorStop(1,'#05070c');ctx.fillStyle=grd;ctx.fillRect(0,0,g.viewW,g.viewH);
    for(let i=0;i<80;i++){ctx.fillStyle=`rgba(255,255,255,${.02+(i%5)*.01})`;circle(ctx,(i*97)%g.viewW,(i*53)%g.viewH,1+(i%3));ctx.fill();}
  }
  function onScreen(g,o,p=0){const s=g.camera.worldToScreen(o.x,o.y);return s.x>-p&&s.y>-p&&s.x<g.viewW+p&&s.y<g.viewH+p;}
  function circle(ctx,x,y,r){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2)}
  function ellipse(ctx,x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2)}
  function round(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
  function poly(ctx,pts){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath()}
  function shade(hex,amt){
    if(!hex||hex[0]!=='#')return hex;
    let n=parseInt(hex.slice(1),16),r=(n>>16)+amt,g=((n>>8)&255)+amt,b=(n&255)+amt;
    r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));
    return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
  }
  function label(ctx,text,x,y,color='#e9f0ff'){
    ctx.font='800 12px Inter';ctx.textAlign='center';ctx.textBaseline='middle';
    const m=ctx.measureText(text);ctx.fillStyle='rgba(0,0,0,.55)';round(ctx,x-m.width/2-7,y-10,m.width+14,20,8);ctx.fill();
    ctx.fillStyle=color;ctx.fillText(text,x,y+1);
  }
})();
</script>

<!-- Entities (factories — depend on config) -->
<script>

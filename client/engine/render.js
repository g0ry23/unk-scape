(function(){
const D = window.Duskfall = window.Duskfall || {};

D.render = function(g){
const ctx=g.ctx;
ctx.setTransform(g.dpr,0,0,g.dpr,0,0);
ctx.clearRect(0,0,g.viewW,g.viewH);
if(!g.world){ drawMenuBg(g,ctx); return; }

ctx.save();
g.camera.apply(ctx);
// ── Painter's Algorithm depth-sort: ground tiles → world objects → entities → player ──
drawTiles(g,ctx);
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
drawMobEntities(g,ctx);
drawPlayer(g,ctx);
drawGatherProgress(g,ctx);
drawEffects(g,ctx);
ctx.restore();
drawLighting(g,ctx);
drawVignette(g,ctx);
	// ── v0.5.0: Isometric world scene (world.js) ──────────────────────────
	// Called outside camera.apply() — manages its own translate to screen centre.
	if (typeof D.RenderIsometricScene === 'function' && g.world && g.player) {
		D.RenderIsometricScene(ctx, g.viewW, g.viewH, g.player, g.entities);
	}
	// ── v0.5.0: Screen-space HUD overlays (ui_overlay.js) ──────────────────
	if (typeof D.RenderPlayerHUD === 'function' && g.player) {
		D.RenderPlayerHUD(ctx, g.player);
	}
	if (typeof D.RenderStatsWindow === 'function' && g.player && D.UIState && D.UIState.showStatsWindow) {
		D.RenderStatsWindow(ctx, g.viewW, g.viewH, g.player);
	}
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
// ── Isometric diamond tile renderer with Painter's Algorithm depth sort ──
// Each tile is a 64×32 diamond. drawTerrainVolume/drawTileDepth (flat coords)
// are REMOVED from the pipeline — drawTiles handles all wall depth here.
// isoProject formula: stays inside g.camera.apply(ctx) coordinate space.
const IW = 64;
const IH = 32;
// Build a depth-sorted list: iso depth = x+y (painter's algo: back rows first)
const sortedTiles = [];
for(let y=b.y0;y<b.y1;y++) for(let x=b.x0;x<b.x1;x++){
sortedTiles.push({x, y});
}
// Sort ascending by (x+y) so tiles further back in iso view render first
sortedTiles.sort((a,b) => (a.x+a.y) - (b.x+b.y));
for(const {x,y} of sortedTiles){
const id=g.world.tiles[y][x]; const tile=D.TILES[id];
const isoX = (x - y) * (IW / 2);
const isoY = (x + y) * (IH / 2);
const cx = isoX, cy = isoY;
// ── Elevation: read z from mmoWorld chunk data if available ──
const chunkKey = Math.floor(x/32)+'_'+Math.floor(y/32);
const UW = window.UnkScape && window.UnkScape.World;
const chunk = UW && UW.loadedChunks && UW.loadedChunks[chunkKey];
const localX = x % 32, localY = y % 32;
const chunkTile = chunk && chunk[localX] && chunk[localX][localY];
const elevZ = (chunkTile && chunkTile.z) ? chunkTile.z : 0;
const elevOffset = elevZ * 44; // 44px per unit height (OSRS cliff thickness)
// Top-face gradient
const grad = ctx.createLinearGradient(cx, cy - elevOffset, cx, cy + IH - elevOffset);
grad.addColorStop(0, shade(tile.color, 18));
grad.addColorStop(0.5, tile.color);
grad.addColorStop(1, shade(tile.color, -20));
ctx.fillStyle = grad;
ctx.beginPath();
ctx.moveTo(cx, cy - elevOffset);
ctx.lineTo(cx + IW/2, cy + IH/2 - elevOffset);
ctx.lineTo(cx, cy + IH - elevOffset);
ctx.lineTo(cx - IW/2, cy + IH/2 - elevOffset);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = 'rgba(0,0,0,0.10)';
ctx.lineWidth = 0.5;
ctx.stroke();
// Noise texture overlay
const n = g.world.noise[y][x];
if(n > 0.52){
ctx.fillStyle = tile.variant || 'rgba(255,255,255,0.06)';
ctx.globalAlpha = 0.22;
ctx.beginPath();
ctx.moveTo(cx, cy + IH*0.22 - elevOffset);
ctx.lineTo(cx+IW*0.22, cy + IH*0.55 - elevOffset);
ctx.lineTo(cx, cy + IH*0.88 - elevOffset);
ctx.lineTo(cx-IW*0.22, cy + IH*0.55 - elevOffset);
ctx.closePath();
ctx.fill();
ctx.globalAlpha = 1;
}
// Water ripple
if(id === 'water'){
ctx.strokeStyle = 'rgba(120,205,255,0.25)';
ctx.lineWidth = 1.2;
ctx.beginPath();
ctx.moveTo(cx - IW*0.25, cy + IH*0.45 + n*3 - elevOffset);
ctx.quadraticCurveTo(cx, cy + IH*0.30 - elevOffset, cx + IW*0.25, cy + IH*0.45 + n*3 - elevOffset);
ctx.stroke();
}
// ── Side walls: combine tile type + elevation z for stepped cliffs ──
if(id !== 'water'){
// Base wall from tile type
const baseWallH = id==='stone'?9 : id==='darkgrass'?5 : id==='dirt'?3 : id==='sand'?2 : 2;
// Add elevation thickness for cliff height (elevZ * 12 px extra wall depth)
const wallH = baseWallH + elevZ * 12;
if(wallH > 0){
const bottomY = cy + IH - elevOffset;
// Left face (south-west)
ctx.fillStyle = shade(tile.color, -38);
ctx.globalAlpha = 0.72;
ctx.beginPath();
ctx.moveTo(cx - IW/2, cy + IH/2 - elevOffset);
ctx.lineTo(cx, bottomY);
ctx.lineTo(cx, bottomY + wallH);
ctx.lineTo(cx - IW/2, cy + IH/2 - elevOffset + wallH);
ctx.closePath();
ctx.fill();
// Right face
ctx.fillStyle = shade(tile.color, -22);
ctx.beginPath();
ctx.moveTo(cx, bottomY);
ctx.lineTo(cx + IW/2, cy + IH/2 - elevOffset);
ctx.lineTo(cx + IW/2, cy + IH/2 - elevOffset + wallH);
ctx.lineTo(cx, bottomY + wallH);
ctx.closePath();
ctx.fill();
ctx.globalAlpha = 1;
}
}
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
label(ctx,z.icon+' '+z.name,0,-86,'#f7c65b');
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
ctx.fillStyle='#fff';ctx.font='18px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.icon||'❑',0,0);
const pct=Math.round((pt.progress||0)*100);
if(D.dist(g.player,pt)<125) label(ctx,(pt.owner?'CLAIMED':'CLAIM')+' '+pct+'%',0,-35,f.color||'#f7c65b');
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
if(D.dist(g.player,r)<92) label(ctx,(cfg.action||'Gather')+': '+cfg.name+' T'+(cfg.tier||1),0,-44,'#f7c65b');
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
ctx.strokeStyle='rgba(185,140,255,'+(0.35+a*0.35)+')';
ctx.lineWidth=5;
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
// ── Stride animation clock ──
p.isMoving = speed>8;
p.animTick = (p.animTick || 0) + (p.isMoving ? 0.22 : 0.04);
// ── Torso bob ──
let torsoBobY = p.isMoving
? Math.abs(Math.sin(p.animTick * 2)) * -3.5
: Math.sin(p.animTick) * -1.2;
// ── Pendulum feet ──
let leftLegX = -5 + (p.isMoving ? Math.cos(p.animTick) * 5.5 : 0);
let rightLegX = 5 - (p.isMoving ? Math.cos(p.animTick) * 5.5 : 0);
const aimAng=p.facingAngle ?? Math.atan2((g.input?.mouse?.worldY||p.y)-p.y,(g.input?.mouse?.worldX||p.x)-p.x);
const attackPct=p.attackAnimMax?D.clamp(p.attackAnim/p.attackAnimMax,0,1):0;
const swing=(1-attackPct)*Math.PI*(p.lastAttackHeavy?1.25:.85);
const weaponId=p.equipment.weapon;
const weapon=D.ITEMS[weaponId];
const style=D.EQUIPMENT[weaponId]?.style || weapon?.combatStyle || 'melee';
const body=p.equipment.body==='iron_armor'?'#9ea7b8':p.equipment.body==='hide_armor'?'#7a5138':p.equipment.body==='ranger_tunic'?'#2f8f5d':p.equipment.body==='apprentice_robe'?'#6d55d8':'#2f6eea';
const headGear=p.equipment.head;
ctx.save();ctx.translate(p.x, p.y + torsoBobY);
ctx.fillStyle='rgba(0,0,0,.34)';ellipse(ctx,0,25-torsoBobY,30,9);ctx.fill();
const faction=D.FACTIONS[p.factionId]||{};
ctx.strokeStyle=faction.color||'rgba(106,167,255,.28)';ctx.globalAlpha=.34;ctx.lineWidth=3;circle(ctx,0,0,25+Math.sin(g.time*4)*1.5);ctx.stroke();ctx.globalAlpha=1;
ctx.save();ctx.rotate(aimAng+Math.PI/2);
ctx.fillStyle='#202a3c';
round(ctx,-14,-3,10,38,5);ctx.fill();
round(ctx,4,-3,10,38,5);ctx.fill();
ctx.fillStyle='#101015';
round(ctx,leftLegX-13,29,18,11,5);ctx.fill();
round(ctx,rightLegX-5,29,18,11,5);ctx.fill();
ctx.fillStyle='rgba(247,198,91,.18)';
round(ctx,leftLegX-12,29,16,3,2);ctx.fill();
round(ctx,rightLegX-4,29,16,3,2);ctx.fill();
ctx.restore();
ctx.fillStyle=shade(body,-34);round(ctx,-15,0,30,34,10);ctx.fill();
ctx.fillStyle=body;round(ctx,-14,-6+torsoBobY,28,38,10);ctx.fill();
ctx.fillStyle=faction.color||'rgba(247,198,91,.5)';ctx.globalAlpha=.34;round(ctx,-15,-7+torsoBobY,30,7,6);ctx.fill();ctx.globalAlpha=1;
ctx.fillStyle='rgba(255,255,255,.10)';round(ctx,-8,-2+torsoBobY,6,29,5);ctx.fill();
const armSwing=attackPct>0?(p.lastAttackHeavy?Math.sin(swing)*18:Math.sin(swing)*12):0;
ctx.save();ctx.rotate(aimAng);
ctx.fillStyle='#d7a86e';
round(ctx,8,-8+armSwing*.04,29,8,6);ctx.fill();
round(ctx,-34,8-armSwing*.02,26,8,6);ctx.fill();
ctx.restore();
ctx.fillStyle='#d7a86e';circle(ctx,0,-20+torsoBobY,12);ctx.fill();
ctx.fillStyle='#1b1b20';ctx.beginPath();ctx.arc(0,-25+torsoBobY,12,Math.PI,0);ctx.lineTo(10,-18+torsoBobY);ctx.lineTo(-10,-18+torsoBobY);ctx.closePath();ctx.fill();
ctx.fillStyle='rgba(255,255,255,.92)';circle(ctx,-4,-24+torsoBobY,2.3);ctx.fill();circle(ctx,4,-24+torsoBobY,2.3);ctx.fill();
if(headGear){
ctx.fillStyle=headGear==='bronze_helm'?'#b87443':headGear==='leather_hood'?'#5a3824':headGear==='apprentice_hood'?'#4e3bad':'#2b3346';
ctx.beginPath();ctx.arc(0,-24+torsoBobY,13,Math.PI,0);ctx.lineTo(12,-16+torsoBobY);ctx.lineTo(-12,-16+torsoBobY);ctx.closePath();ctx.fill();
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
ctx.font='800 '+(e.size||18)+'px '+(e.font||'Inter');ctx.textAlign='center';ctx.fillStyle=e.color||'#fff';ctx.strokeStyle='rgba(0,0,0,.55)';ctx.lineWidth=4;ctx.strokeText(e.text,0,0);ctx.fillText(e.text,0,0);ctx.restore();
}
}

function drawMobEntities(g,ctx){
  const ME = window.UnkScape && window.UnkScape.AI && window.UnkScape.AI.MobEngine;
  if (!ME) return;
  const mobs = ME.getMobs();
  for (const mob of mobs) {
    if (mob.dead) continue;
    if (!onScreen(g, mob, 120)) continue;
    const cfg = mob.cfg;
    ctx.save();
    ctx.translate(mob.x, mob.y);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.30)';
    ellipse(ctx, 0, 16, 22, 7); ctx.fill();
    // Elite aura
    if (cfg.elite) {
      ctx.strokeStyle = 'rgba(192,57,43,0.55)';
      ctx.lineWidth = 4;
      circle(ctx, 0, 0, 28 + Math.sin(g.time * 4) * 3); ctx.stroke();
    }
    // Body
    ctx.fillStyle = shade(cfg.color, -30);
    round(ctx, -15, -1, 30, 31, 12); ctx.fill();
    ctx.fillStyle = cfg.color;
    circle(ctx, 0, -10, cfg.r || 17); ctx.fill();
    // Icon
    ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(cfg.icon || '👾', 0, -10);
    // HP bar
    const w = 42, h = 6, pct = mob.hp / mob.maxHp;
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; round(ctx, -w/2, -34, w, h, 99); ctx.fill();
    ctx.fillStyle = pct > 0.5 ? '#63e6a4' : pct > 0.25 ? '#ffcf6e' : '#ff5c7a';
    round(ctx, -w/2, -34, w * pct, h, 99); ctx.fill();
    // State label when nearby
    if (D.dist(g.player, mob) < 120) {
      const stateColor = mob.state === 'PURSUIT' ? '#ff5c7a' : mob.state === 'LEASH' ? '#ffcf6e' : '#63e6a4';
      label(ctx, cfg.name + ' [' + mob.state + ']', 0, -46, stateColor);
    }
    ctx.restore();
  }
}
function drawLighting(g,ctx){
  // ── Priority 1: UnkScape.Engine.Environment darkness overlay (new apocalypse cycle) ──
  const Env = window.UnkScape && window.UnkScape.Engine && window.UnkScape.Engine.Environment;
  const darkness = Env ? Env.getDarkness() : 0;

  // ── Fallback: legacy DayNight system ──
  const dn = g.systems.daynight;
  const legacyNight = (!Env && dn) ? dn.nightAmount() : 0;

  const nightIntensity = Math.max(darkness, legacyNight);
  if (nightIntensity <= 0.02) return;

  // ── Step 1: Draw full-screen darkness layer on an offscreen canvas ──
  // We use a temporary canvas so we can cut torch circles out with destination-out.
  const oc = document.createElement('canvas');
  oc.width  = g.viewW;
  oc.height = g.viewH;
  const oc2 = oc.getContext('2d');

  // Fill darkness rectangle (rgba(10, 8, 20, 0.82) at max night)
  oc2.fillStyle = 'rgba(10,8,20,' + (nightIntensity * 0.82).toFixed(3) + ')';
  oc2.fillRect(0, 0, g.viewW, g.viewH);

  // ── Step 2: Cut transparent torch circle around player via destination-out ──
  const p = g.player;
  if (p) {
    const screen = g.camera.worldToScreen(p.x, p.y);
    const hasTorch = g.systems && g.systems.inventory && g.systems.inventory.has('torch');
    const torchRadius = hasTorch ? 200 : 120;  // 120px default, 200px with torch item
    const grad = oc2.createRadialGradient(screen.x, screen.y, 0, screen.x, screen.y, torchRadius);
    // destination-out: alpha 1 = fully transparent (cuts hole), alpha 0 = leaves darkness
    grad.addColorStop(0,   'rgba(0,0,0,1.0)');
    grad.addColorStop(0.55,'rgba(0,0,0,0.72)');
    grad.addColorStop(0.85,'rgba(0,0,0,0.22)');
    grad.addColorStop(1,   'rgba(0,0,0,0.0)');
    oc2.globalCompositeOperation = 'destination-out';
    oc2.fillStyle = grad;
    oc2.fillRect(screen.x - torchRadius, screen.y - torchRadius, torchRadius * 2, torchRadius * 2);

    // ── Step 3: Cut light circles for active campfires in world ──
    if (g.entities && g.entities.resources) {
      for (const r of g.entities.resources) {
        if (r.type !== 'campfire' || !r.active) continue;
        const fs = g.camera.worldToScreen(r.x, r.y);
        if (Math.hypot(fs.x - screen.x, fs.y - screen.y) > 900) continue;
        const fireGrad = oc2.createRadialGradient(fs.x, fs.y, 0, fs.x, fs.y, 80);
        fireGrad.addColorStop(0,   'rgba(0,0,0,0.9)');
        fireGrad.addColorStop(0.6, 'rgba(0,0,0,0.35)');
        fireGrad.addColorStop(1,   'rgba(0,0,0,0.0)');
        oc2.fillStyle = fireGrad;
        oc2.fillRect(fs.x - 80, fs.y - 80, 160, 160);
      }
    }
    oc2.globalCompositeOperation = 'source-over';
  }

  // ── Step 4: Blit the darkness+cutout layer onto the main canvas ──
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);  // reset DPR transform for overlay blit
  ctx.drawImage(oc, 0, 0);
  ctx.restore();
}
function drawVignette(g,ctx){
const grad=ctx.createRadialGradient(g.viewW/2,g.viewH/2,Math.min(g.viewW,g.viewH)*.25,g.viewW/2,g.viewH/2,Math.max(g.viewW,g.viewH)*.72);
grad.addColorStop(0,'rgba(0,0,0,0)');grad.addColorStop(1,'rgba(0,0,0,.38)');ctx.fillStyle=grad;ctx.fillRect(0,0,g.viewW,g.viewH);
}
function drawMenuBg(g,ctx){
const grd=ctx.createLinearGradient(0,0,0,g.viewH);grd.addColorStop(0,'#101827');grd.addColorStop(1,'#05070c');ctx.fillStyle=grd;ctx.fillRect(0,0,g.viewW,g.viewH);
for(let i=0;i<80;i++){ctx.fillStyle='rgba(255,255,255,'+(0.02+(i%5)*0.01)+')';circle(ctx,(i*97)%g.viewW,(i*53)%g.viewH,1+(i%3));ctx.fill();}
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

// ── UnkScape.Engine.Renderer shim ──
((U) => {
U.Engine = U.Engine || {};
U.Engine.Renderer = {
_canvasId: 'game',
init: function(canvasId) {
this._canvasId = canvasId || 'game';
},
renderFrame: function(world, player, camera) {
if (window.Duskfall && window.Duskfall.game) {
window.Duskfall.render(window.Duskfall.game);
}
}
};
})(window.UnkScape = window.UnkScape || {});


// ============================================================
// UNK-SCAPE: DIMENSIONAL DEPTH RENDERING PIPELINE v0.4.7
// Exposes D.isoProject, D.renderTurfTile, D.renderWallTile
// on the global Duskfall namespace for use by world generators
// and structure renderers outside the main drawTiles() loop.
// ============================================================
((D) => {
  D.TILE_WIDTH  = D.TILE_WIDTH  || 64;
  D.TILE_HEIGHT = D.TILE_HEIGHT || 32;
  D.WALL_HEIGHT = D.WALL_HEIGHT || 44; // Vertical screenspace extrusion for roofs/cliffs

  /**
   * PROJECTION MATRIX: Converts 3D Virtual Space (X, Y, Z) into 2D Screen Space.
   * Kept on D namespace so mmoWorld.js / structure renderers can call D.isoProject().
   * NOTE: Returns coords in iso grid space — only call inside g.camera.apply(ctx) blocks.
   */
  D.isoProject = D.isoProject || function(x, y, z) {
    const screenX = (x - y) * (D.TILE_WIDTH  / 2);
    const screenY = (x + y) * (D.TILE_HEIGHT / 2);
    return {
      x: screenX,
      y: screenY - (z || 0)  // Pulls drawing UP based on height value
    };
  };

  /**
   * Renders a 3D Elevated Terrain Tile (The Turf) with per-corner slope support.
   * tileConfig: { z00, z10, z01, z11, color }
   * All four corner Z values allow smooth slope interpolation between elevation tiers.
   */
  D.renderTurfTile = function(ctx, worldX, worldY, tileConfig) {
    const z00 = tileConfig.z00 || 0;
    const z10 = tileConfig.z10 || 0;
    const z01 = tileConfig.z01 || 0;
    const z11 = tileConfig.z11 || 0;

    const p1 = D.isoProject(worldX,     worldY,     z00);
    const p2 = D.isoProject(worldX + 1, worldY,     z10);
    const p3 = D.isoProject(worldX + 1, worldY + 1, z11);
    const p4 = D.isoProject(worldX,     worldY + 1, z01);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fillStyle   = tileConfig.color || '#27ae60';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth   = 0.5;
    ctx.stroke();
    ctx.restore();
  };

  /**
   * Renders an Extruded Wall/Structure with Bounding-Box Height Projection.
   * Draws left face (south-west) and right face (south-east shadow drop).
   * baseZ: elevation of the floor the wall sits on (in tile units).
   */
  D.renderWallTile = function(ctx, worldX, worldY, baseZ, wallColor) {
    const b1 = D.isoProject(worldX,     worldY,     baseZ);
    const b2 = D.isoProject(worldX + 1, worldY,     baseZ);
    const b3 = D.isoProject(worldX,     worldY + 1, baseZ);

    const t1 = { x: b1.x, y: b1.y - D.WALL_HEIGHT };
    const t2 = { x: b2.x, y: b2.y - D.WALL_HEIGHT };
    const t3 = { x: b3.x, y: b3.y - D.WALL_HEIGHT };

    ctx.save();
    ctx.lineWidth   = 0.5;
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';

    // Left wall face (south-west)
    ctx.fillStyle = wallColor || '#7f8c8d';
    ctx.beginPath();
    ctx.moveTo(b1.x, b1.y);
    ctx.lineTo(b3.x, b3.y);
    ctx.lineTo(t3.x, t3.y);
    ctx.lineTo(t1.x, t1.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right wall face with shadow drop (south-east)
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.moveTo(b1.x, b1.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.lineTo(t2.x, t2.y);
    ctx.lineTo(t1.x, t1.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  };

  console.log('[UNK-SCAPE] Dimensional Depth Rendering Pipeline v0.4.7 — D.isoProject / D.renderTurfTile / D.renderWallTile live.');

})(window.Duskfall = window.Duskfall || {});

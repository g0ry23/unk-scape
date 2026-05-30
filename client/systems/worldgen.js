(function(){
window.Duskfall = window.Duskfall || {};
const US = window.UnkScape = window.Duskfall;

// ── createResource factory (entity spawn helper) ─────────────────────────
US.createResource = US.createResource || function(type, x, y, id) {
    const resNode = {
        uid: id || ('res_' + type + '_' + Math.floor(Math.random() * 100000)),
        id: id || ('res_' + type + '_' + Math.floor(Math.random() * 100000)),
        kind: 'resource',
        type: type,
        x: x,
        y: y,
        r: 14,
        tier: 1,
        harvested: false,
        respawnTimer: 0,
        hp: 3,
        maxHp: 3
    };
    return resNode;
};

// ── Sync fallback (kept for compatibility) ────────────────────────────────
US.generateWorld=function(seed){
const rand=US.rand(seed), w=US.WORLD.w,h=US.WORLD.h;
const tiles=[],noise=[];
for(let y=0;y<h;y++){
tiles[y]=[];noise[y]=[];
for(let x=0;x<w;x++){
const n=fbm(x*.052,y*.052,rand)+fbm(x*.014+40,y*.014-22,rand)*.55;
noise[y][x]=(n+1)/2;
let id='grass';
const dx=x-w/2,dy=y-h/2,d=Math.hypot(dx,dy)/(w*.62);
if(noise[y][x]<.22) id='water';
else if(noise[y][x]<.29) id='sand';
else if(noise[y][x]>.78) id='stone';
else if(noise[y][x]>.64) id='darkgrass';
else if(noise[y][x]<.36) id='swamp';
if(d>1.05) id='water';
tiles[y][x]=id;
}
}
const cx=Math.floor(w/2),cy=Math.floor(h/2);
applyStarterZones(tiles,noise,w,h);
connectWorldRoads(tiles,w,h);
paintCentralTown(tiles,w,h);
return {seed,w,h,tiles,noise};
};

// ── Async chunked generator ───────────────────────────────────────────────
// onProgress(pct 0-1, label string) called during generation
US.generateWorldAsync=function(seed, onProgress){
return new Promise(function(resolve){
const rand=US.rand(seed), w=US.WORLD.w, h=US.WORLD.h;
const tiles=[], noise=[];
// Pre-allocate rows
for(let y=0;y<h;y++){ tiles[y]=new Array(w); noise[y]=new Array(w); }

const CHUNK=50; // rows per frame
let y=0;

function processChunk(){
const end=Math.min(y+CHUNK, h);
for(;y<end;y++){
for(let x=0;x<w;x++){
const n=fbm(x*.052,y*.052,rand)+fbm(x*.014+40,y*.014-22,rand)*.55;
noise[y][x]=(n+1)/2;
let id='grass';
const dx=x-w/2,dy=y-h/2,d=Math.hypot(dx,dy)/(w*.62);
if(noise[y][x]<.22) id='water';
else if(noise[y][x]<.29) id='sand';
else if(noise[y][x]>.78) id='stone';
else if(noise[y][x]>.64) id='darkgrass';
else if(noise[y][x]<.36) id='swamp';
if(d>1.05) id='water';
tiles[y][x]=id;
}
}
if(onProgress) onProgress(y/h*.72, 'Sculpting terrain... '+Math.round(y/h*100)+'%');
if(y<h){ setTimeout(processChunk,0); }
else{
// terrain done — now do passes (fast, sync is fine for these)
if(onProgress) onProgress(.75,'Painting biomes...');
setTimeout(function(){
applyStarterZones(tiles,noise,w,h);
if(onProgress) onProgress(.86,'Connecting roads...');
setTimeout(function(){
connectWorldRoads(tiles,w,h);
if(onProgress) onProgress(.93,'Building towns...');
setTimeout(function(){
paintCentralTown(tiles,w,h);
if(onProgress) onProgress(1,'Done!');
resolve({seed,w,h,tiles,noise});
},0);
},0);
},0);
}
}
setTimeout(processChunk,0);
});
};

// ── Async entity population ───────────────────────────────────────────────
US.populateWorldAsync=function(game, onProgress){
return new Promise(function(resolve){
if(onProgress) onProgress(0,'Spawning resources...');
setTimeout(function(){
_placeResources(game);
if(onProgress) onProgress(.4,'Placing NPCs...');
setTimeout(function(){
_placeNPCs(game);
if(onProgress) onProgress(.75,'Spawning enemies...');
setTimeout(function(){
_placeEnemies(game);
if(onProgress) onProgress(1,'World ready!');
resolve();
},0);
},0);
},0);
});
};

// ── Sync populateWorld (kept for compat) ─────────────────────────────────
US.populateWorld=function(game){
_placeResources(game);
_placeNPCs(game);
_placeEnemies(game);
};

// ── Internal placement helpers ────────────────────────────────────────────
function _placeResources(game){
const rand=US.rand(game.seed+33), w=US.WORLD.w, h=US.WORLD.h, t=US.TILE;
const cx=Math.floor(w/2), cy=Math.floor(h/2);
for(let y=2;y<h-2;y++) for(let x=2;x<w-2;x++){
const tile=game.world.tiles[y][x], n=game.world.noise[y][x];
const nearTown=Math.hypot(x-cx,y-cy)<12;
if(nearTown||US.TILES[tile].solid) continue;
let type=null;
const r=rand();
if((tile==='grass'||tile==='darkgrass')&&n>.50&&r<.050) type='tree';
else if((tile==='darkgrass'||tile==='grass')&&n>.66&&r<.018) type='pine';
else if(tile==='darkgrass'&&n>.74&&r<.008) type='yew';
else if((tile==='stone'||tile==='darkgrass')&&n>.70&&r<.028) type='rock';
else if(tile==='stone'&&n>.72&&r<.018) type='copper';
else if(tile==='stone'&&n>.80&&r<.016) type='iron';
else if(tile==='stone'&&n>.84&&r<.010) type='silver';
else if(tile==='stone'&&n>.88&&r<.006) type='gold';
else if(tile==='stone'&&n>.91&&r<.004) type='gem';
else if(tile==='sand'&&n<.45&&r<.025) type='fish';
else if((tile==='grass'||tile==='swamp')&&n<.55&&r<.035) type='berry';
else if((tile==='swamp'||tile==='darkgrass')&&r<.018) type='herb';
if(type) game.entities.resources.push(US.createResource(type,x*t+t/2,y*t+t/2,'res_'+x+'_'+y));
}
Object.entries(US.STARTER_ZONES||{}).forEach(function([id,z]){
const zone=US.getStarterZone(id);
zone.resourceBias.forEach(function(type,idx){
if(!US.RESOURCE_TYPES?.[type])return;
const count=idx===0?9:5;
for(let j=0;j<count;j++){
const a=(j/count)*Math.PI*2+idx*.75;
const rr=(zone.r+8+idx*7+j%3)*t;
const x=US.clamp(zone.x*t+t/2+Math.cos(a)*rr,US.TILE*3,US.WORLD.pxW-US.TILE*3);
const y=US.clamp(zone.y*t+t/2+Math.sin(a)*rr,US.TILE*3,US.WORLD.pxH-US.TILE*3);
const tx=Math.floor(x/t),ty=Math.floor(y/t);
if(!US.TILES[game.world.tiles[ty]?.[tx]]?.solid) game.entities.resources.push(US.createResource(type,x,y,'starter_'+id+'_'+type+'_'+j));
}
});
});
}

function _placeNPCs(game){
const t=US.TILE;
const cx=Math.floor(US.WORLD.w/2), cy=Math.floor(US.WORLD.h/2);
Object.entries(US.STARTER_ZONES||{}).forEach(function([id,z]){
const feat=US.getZoneFeature(id), cls=US.CLASSES[id]||{}, wx=z.x*t+t/2, wy=z.y*t+t/2;
game.entities.npcs.push({uid:US.uid('npc'),kind:'npc',id:'trainer_'+id,x:wx+2*t,y:wy-2*t,r:22,color:'#6aa7ff',cfg:{name:feat.trainer,icon:feat.trainerIcon,role:(cls.name||id)+' Trainer',lines:['Welcome to '+z.name+'. This is your first real claim on the UNK-SCAPE map.','Train here, gather nearby, then follow the roads toward the Central Crossroads.','Soon this zone will have class quests, faction turf objectives, and boss unlocks.']}});
const fids=US.getClassFactions(id)||[];
[[-9,-9],[9,9]].forEach(function(off,i){
const fid=fids[i], f=US.FACTIONS[fid]; if(!f)return;
game.entities.npcs.push({uid:US.uid('npc'),kind:'npc',id:'emissary_'+id+'_'+fid,x:(z.x+off[0])*t+t/2,y:(z.y+off[1])*t+t/2,r:22,color:f.color||'#f7c65b',cfg:{name:f.name+' Emissary',icon:f.icon,role:'Faction Claim Officer',lines:[f.name+' wants control of '+z.name+'.',f.desc,'Future turf quests will let your faction capture roads, camps, and boss arenas for claim buffs.']}});
});
});
game.entities.npcs.push(US.createNPC('elder',(cx-4)*t+t/2,(cy-1)*t+t/2));
game.entities.npcs.push(US.createNPC('trader',(cx+4)*t+t/2,(cy-1)*t+t/2));
game.entities.npcs.push(US.createNPC('banker',(cx-4)*t+t/2,(cy+4)*t+t/2));
game.entities.portals.push(US.createPortal('dungeon',(cx+10)*t+t/2,(cy+9)*t+t/2));
}

function _placeEnemies(game){
const t=US.TILE, rand=US.rand(game.seed+77);
Object.entries(US.STARTER_ZONES||{}).forEach(function([id,z]){
const feat=US.getZoneFeature(id), type=feat.trainingMob||'rat';
for(let i=0;i<6;i++){
const a=(i/3)*Math.PI*2+.45;
const tx=Math.round(z.x+Math.cos(a)*(z.r+16+(i%2)*7));
const ty=Math.round(z.y+Math.sin(a)*(z.r+16+(i%2)*7));
if(game.world.tiles[ty]?.[tx]&&!US.TILES[game.world.tiles[ty][tx]].solid){
const mob=US.createEnemy(type,tx*t+t/2,ty*t+t/2);
mob.cfg={...mob.cfg,name:'Training '+mob.cfg.name,hp:Math.max(10,Math.floor(mob.cfg.hp*.65)),attack:Math.max(1,Math.floor(mob.cfg.attack*.55)),xp:Math.max(8,Math.floor(mob.cfg.xp*.55)),aggro:95};
mob.maxHp=mob.cfg.hp;mob.hp=mob.maxHp;game.entities.enemies.push(mob);
}
}
});
for(let i=0;i<78;i++) spawnRandomEnemy(game,rand,false);
}

// ── Zone painting ─────────────────────────────────────────────────────────
function paintCentralTown(tiles,w,h){
const cx=Math.floor(w/2),cy=Math.floor(h/2);
for(let y=cy-10;y<=cy+10;y++)for(let x=cx-12;x<=cx+12;x++) if(inBounds(x,y,w,h)) tiles[y][x]='dirt';
for(let y=cy-4;y<=cy+4;y++)for(let x=cx-5;x<=cx+5;x++) if(inBounds(x,y,w,h)) tiles[y][x]='plaza';
for(let x=0;x<w;x++) if(inBounds(x,cy,w,h)&&tiles[cy][x]!=='water') tiles[cy][x]='stonepath';
for(let y=0;y<h;y++) if(inBounds(cx,y,w,h)&&tiles[y][cx]!=='water') tiles[y][cx]='stonepath';
for(let x=cx-14;x<=cx+14;x++){if(inBounds(x,cy-12,w,h))tiles[cy-12][x]='fence';if(inBounds(x,cy+12,w,h))tiles[cy+12][x]='fence';}
for(let y=cy-12;y<=cy+12;y++){if(inBounds(cx-14,y,w,h))tiles[y][cx-14]='fence';if(inBounds(cx+14,y,w,h))tiles[y][cx+14]='fence';}
tiles[cy][cx-14]='stonepath';tiles[cy][cx+14]='stonepath';tiles[cy-12][cx]='stonepath';tiles[cy+12][cx]='stonepath';
rect(tiles,cx-10,cy-8,5,4,'woodfloor');rect(tiles,cx-10,cy-9,5,1,'roof');
rect(tiles,cx+6,cy-8,5,4,'woodfloor');rect(tiles,cx+6,cy-9,5,1,'roof');
rect(tiles,cx-10,cy+5,5,4,'woodfloor');rect(tiles,cx-10,cy+4,5,1,'roof');
rect(tiles,cx+6,cy+5,5,4,'woodfloor');rect(tiles,cx+6,cy+4,5,1,'roof');
rect(tiles,cx-18,cy-7,3,7,'farmland');rect(tiles,cx+16,cy+2,4,7,'farmland');
}

function applyStarterZones(tiles,noise,w,h){
Object.entries(US.STARTER_ZONES||{}).forEach(function([id,z]){
for(let yy=z.y-z.r-8;yy<=z.y+z.r+8;yy++)for(let xx=z.x-z.r-8;xx<=z.x+z.r+8;xx++){
if(!inBounds(xx,yy,w,h))continue;
const d=Math.hypot(xx-z.x,yy-z.y);
if(d<=z.r+7){
let tile=z.biome||'grass';
const ring=Math.sin((xx+yy)*.23)+Math.cos((xx-z.x)*.18)*.7;
if(d<5) tile=z.accent||'plaza';
else if(d<11) tile=(z.road||'path');
else if(d>z.r-4&&ring>.45) tile='stonepath';
else if(id==='cleric'&&(d>z.r-6||noise[yy]?.[xx]<.42)) tile='sand';
else if(id==='prospector'&&noise[yy]?.[xx]>.42) tile='stone';
else if(id==='mage'&&noise[yy]?.[xx]>.38) tile='stone';
else if(id==='brawler'&&noise[yy]?.[xx]<.58) tile='dirt';
else if(id==='gatherer'&&noise[yy]?.[xx]>.48) tile='darkgrass';
else if(id==='range'&&noise[yy]?.[xx]>.46) tile='darkgrass';
else if(id==='warden'&&noise[yy]?.[xx]>.40) tile='darkgrass';
tiles[yy][xx]=tile;
}
}
paintZoneElevationLayers(tiles,noise,id,z,w,h);
rect(tiles,z.x-3,z.y-3,7,7,z.accent||'plaza');
rect(tiles,z.x-6,z.y,13,1,z.road||'path');
rect(tiles,z.x,z.y-6,1,13,z.road||'path');
rect(tiles,z.x-5,z.y-7,4,3,'woodfloor');
rect(tiles,z.x+2,z.y+5,4,3,'woodfloor');
paintFactionSubcamps(tiles,id,z,w,h);
paintBossArena(tiles,id,z,w,h);
if(inBounds(z.x,z.y,w,h))tiles[z.y][z.x]=z.accent||'plaza';
});
}

function paintZoneElevationLayers(tiles,noise,id,z,w,h){
const rings=[z.r*.38,z.r*.62,z.r*.84];
rings.forEach(function(rr,idx){
for(let a=0;a<Math.PI*2;a+=Math.PI/(28+idx*8)){
const wobble=Math.sin(a*3+idx)*3;
const x=Math.round(z.x+Math.cos(a)*(rr+wobble));
const y=Math.round(z.y+Math.sin(a)*(rr+wobble));
for(let yy=y-1;yy<=y+1;yy++)for(let xx=x-1;xx<=x+1;xx++){
if(!inBounds(xx,yy,w,h))continue;
if(tiles[yy][xx]==='water')tiles[yy][xx]='sand';
else if(['prospector','mage','melee'].includes(id))tiles[yy][xx]='stonepath';
else if(['range','gatherer','warden'].includes(id))tiles[yy][xx]=idx===0?'path':'darkgrass';
else tiles[yy][xx]=idx===0?'path':'dirt';
}
}
});
const landmarks=[[-Math.round(z.r*.55),0],[Math.round(z.r*.55),0],[0,-Math.round(z.r*.55)],[0,Math.round(z.r*.55)]];
landmarks.forEach(function(off){
const lx=z.x+off[0], ly=z.y+off[1];
const tile=['prospector','mage','melee'].includes(id)?'stone':['range','gatherer','warden'].includes(id)?'darkgrass':'dirt';
for(let yy=ly-3;yy<=ly+3;yy++)for(let xx=lx-3;xx<=lx+3;xx++){
if(!inBounds(xx,yy,w,h))continue;
if(Math.hypot(xx-lx,yy-ly)<3.4)tiles[yy][xx]=tile;
}
});
}

function paintFactionSubcamps(tiles,id,z,w,h){
const fids=US.getClassFactions(id)||[];
const offsets=[[-9,-9],[9,9]];
fids.forEach(function(fid,i){
const ox=offsets[i][0], oy=offsets[i][1];
const baseX=z.x+ox, baseY=z.y+oy;
rect(tiles,baseX-3,baseY-2,6,4,'woodfloor');
rect(tiles,baseX-4,baseY,9,1,z.road||'path');
rect(tiles,baseX,baseY-4,1,8,z.road||'path');
if(inBounds(baseX+Math.sign(ox)*3,baseY,w,h))tiles[baseY][baseX+Math.sign(ox)*3]='fence';
roadLine(tiles,z.x,z.y,baseX,baseY,z.road||'path',1);
});
}

function paintBossArena(tiles,id,z,w,h){
const angleMap={melee:-2.35,warden:-1.55,range:-.78,cleric:0,gatherer:.78,mage:1.55,brawler:2.35,prospector:3.14,wanderer:.35};
const a=angleMap[id]??0;
const ax=Math.round(z.x+Math.cos(a)*(z.r+9));
const ay=Math.round(z.y+Math.sin(a)*(z.r+9));
for(let yy=ay-5;yy<=ay+5;yy++)for(let xx=ax-5;xx<=ax+5;xx++){
if(!inBounds(xx,yy,w,h))continue;
const d=Math.hypot(xx-ax,yy-ay);
if(d<4.8)tiles[yy][xx]=z.accent||'plaza';
if(d>4.1&&d<5.4)tiles[yy][xx]='stonepath';
}
roadLine(tiles,z.x,z.y,ax,ay,z.road||'path',1);
}

function connectWorldRoads(tiles,w,h){
const zones=US.STARTER_ZONES||{}, hub=zones.wanderer||{x:Math.floor(w/2),y:Math.floor(h/2)};
Object.entries(zones).forEach(function([id,z]){
if(id==='wanderer')return;
roadLine(tiles,z.x,z.y,hub.x,hub.y,z.road||'path',2);
});
const ring=['melee','warden','range','cleric','gatherer','mage','brawler','prospector','melee'];
for(let i=0;i<ring.length-1;i++){
const a=zones[ring[i]],b=zones[ring[i+1]];
if(a&&b) roadLine(tiles,a.x,a.y,b.x,b.y,'path',1);
}
}

function roadLine(tiles,x0,y0,x1,y1,id,width){
id=id||'path'; width=width||1;
const steps=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));
for(let i=0;i<=steps;i++){
const t=i/Math.max(1,steps);
const bend=Math.sin(t*Math.PI)*5;
const x=Math.round(US.lerp(x0,x1,t)+bend*Math.sign(y1-y0||1)*.22);
const y=Math.round(US.lerp(y0,y1,t)+bend*Math.sign(x0-x1||1)*.22);
for(let yy=y-width;yy<=y+width;yy++)for(let xx=x-width;xx<=x+width;xx++){
if(!tiles[yy]?.[xx])continue;
if(tiles[yy][xx]==='water')tiles[yy][xx]='sand';
else tiles[yy][xx]=id;
}
}
}

function fbm(x,y,rand){
let v=0,a=.5,f=1;
for(let i=0;i<4;i++){v+=a*valueNoise(x*f,y*f);f*=2;a*=.5;}
return v;
}
function hash(x,y){let n=Math.sin(x*127.1+y*311.7)*43758.5453123;return n-Math.floor(n);}
function smooth(t){return t*t*(3-2*t);}
function valueNoise(x,y){
const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;
const a=hash(xi,yi),b=hash(xi+1,yi),c=hash(xi,yi+1),d=hash(xi+1,yi+1);
const u=smooth(xf),v=smooth(yf);
return US.lerp(US.lerp(a,b,u),US.lerp(c,d,u),v)*2-1;
}
function inBounds(x,y,w,h){return x>=0&&y>=0&&x<w&&y<h;}
function rect(tiles,x,y,w,h,id){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(tiles[yy]?.[xx]!==undefined)tiles[yy][xx]=id;}

function spawnRandomEnemy(game,rand,night){
const table=night?US.SPAWN_TABLES.night:US.SPAWN_TABLES.day;
const type=US.weightedPick(table), t=US.TILE, cx=US.WORLD.w/2, cy=US.WORLD.h/2;
for(let tries=0;tries<80;tries++){
const x=Math.floor(rand()*US.WORLD.w), y=Math.floor(rand()*US.WORLD.h);
if(Math.hypot(x-cx,y-cy)<18) continue;
if(Object.values(US.STARTER_ZONES||{}).some(function(z){return Math.hypot(x-z.x,y-z.y)<13;})) continue;
const tile=game.world.tiles[y][x]; if(US.TILES[tile].solid) continue;
game.entities.enemies.push(US.createEnemy(type,x*t+t/2,y*t+t/2)); return;
}
}
US.spawnRandomEnemy=spawnRandomEnemy;

US.tileAt=function(world,x,y){const tx=Math.floor(x/US.TILE),ty=Math.floor(y/US.TILE);return world.tiles[ty]?.[tx];};
US.solidAt=function(world,x,y,r){
r=r||0;
const pts=[[x-r,y-r],[x+r,y-r],[x-r,y+r],[x+r,y+r],[x,y]];
return pts.some(function(p){const id=US.tileAt(world,p[0],p[1]);return !id||US.TILES[id].solid;});
};
})();

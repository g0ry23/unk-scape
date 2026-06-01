(function(){
window.UnkScape = window.UnkScape || {};
const US = window.UnkScape = window.UnkScape;
US.UI.prototype.togglePanel=function(name){if(this.panel===name){this.closePanel();return;}this.openPanel(name);};
US.UI.prototype.openPanel=function(name){this.panel=name;this.game.paused=true;this.clearInputLocks();document.getElementById('panel').classList.add('show');document.getElementById('dialog').classList.remove('show');this.dialogNpc=null;this.renderPanel();this.syncLayoutState();};
US.UI.prototype.closePanel=function(){this.panel=null;document.getElementById('panel').classList.remove('show');this.game.paused=false;this.clearInputLocks();this.syncLayoutState();};
US.UI.prototype.renderPanel=function(){
if(!this.panel)return; const el=document.getElementById('panel');
this.clearInputLocks();
const title={inventory:'Inventory',stats:'Character',skills:'Skills',crafting:'Crafting',quests:'Quests',bank:'Bank',map:'World Map'}[this.panel]||'Panel';
el.innerHTML=`<div class="panel-box"><div class="panel-head"><div><span class="ph-title">${title}</span><span class="ph-sub"> · UNKSCAPE</span></div><button class="close-btn" onclick="UnkScape.game.ui.closePanel()">✕ Close</button></div><div class="panel-body">${this.panelHTML(this.panel)}</div></div>`;
};
US.UI.prototype.panelHTML=function(name){
if(name==='inventory')return this.inventoryHTML();
if(name==='stats')return this.statsHTML();
if(name==='skills')return this.skillsHTML();
if(name==='crafting')return this.craftingHTML();
if(name==='quests')return this.questsHTML();
if(name==='bank')return this.bankHTML();
if(name==='map')return this.mapHTML();
return '';
};

/* ── SKILLS ── 3-col grid, all 15 fit, no scroll ever */
US.UI.prototype.skillsHTML=function(){
const p=this.game.player;
const rows=Object.entries(US.SKILLS).map(([id,c])=>{
  if(!p.skills[id])p.skills[id]={xp:0};
  const xp=p.skills[id].xp||0,lv=US.levelForXp(xp),next=US.xpForLevel(lv+1),pct=Math.min(100,Math.round(xp/(next||1)*100));
  return `<div class="sk-cell"><span class="sk-icon">${c.icon}</span><div class="sk-info"><div class="sk-name">${c.name}</div><div class="sk-bar-wrap"><div class="sk-bar" style="width:${pct}%"></div></div></div><span class="sk-lv">Lv${lv}</span></div>`;
}).join('');
const perks=p.perks.map(id=>US.PERKS[id]?US.PERKS[id].icon+' '+US.PERKS[id].name:'').filter(Boolean).join('  ·  ')||'No perks yet';
return `<div class="sk-grid">${rows}</div><div class="sk-perks">⭐ Perks: ${perks}</div>`;
};

/* ── BANK ── compact rows, no panel scroll */
US.UI.prototype.bankHTML=function(){
const g=this.game, inv=g.systems.inventory.items, bank=g.systems.bank.items;
const invRows=Object.entries(inv).filter(([id])=>id!=='coin').map(([id,q])=>`<div class="bk-row"><span class="bk-ico">${US.ITEMS[id].icon}</span><span class="bk-name">${US.ITEMS[id].name}</span><span class="bk-qty">x${q}</span><button class="xs-btn" onclick="event.stopPropagation();UnkScape.game.systems.bank.deposit('${id}',1)">Dep 1</button><button class="xs-btn" onclick="event.stopPropagation();UnkScape.game.systems.bank.deposit('${id}',${q})">All</button></div>`).join('')||'<div class="bk-empty">Backpack empty</div>';
const bankRows=Object.entries(bank).map(([id,q])=>`<div class="bk-row"><span class="bk-ico">${US.ITEMS[id].icon}</span><span class="bk-name">${US.ITEMS[id].name}</span><span class="bk-qty">x${q}</span><button class="xs-btn" onclick="event.stopPropagation();UnkScape.game.systems.bank.withdraw('${id}',1)">With 1</button><button class="xs-btn" onclick="event.stopPropagation();UnkScape.game.systems.bank.withdraw('${id}',${q})">All</button></div>`).join('')||'<div class="bk-empty">Bank empty</div>';
return `<div class="bk-layout"><div class="bk-col"><div class="bk-head">🎒 Backpack · ${g.systems.inventory.count('coin')} 🪙</div><div class="bk-list">${invRows}</div></div><div class="bk-col"><div class="bk-head">🏦 Bank Vault</div><div class="bk-list">${bankRows}</div></div></div>`;
};

/* ── INVENTORY ── compact grid */
US.UI.prototype.inventoryHTML=function(){
const g=this.game, inv=g.systems.inventory.items, p=g.player;
const slots=['head','weapon','offhand','body','tool'];
const eq=slots.map(s=>`<div class="eq-slot"><span class="eq-label">${s}</span><span class="eq-val">${p.equipment[s]?US.ITEMS[p.equipment[s]].icon+' '+US.ITEMS[p.equipment[s]].name:'—'}</span>${p.equipment[s]?`<button class="xs-btn" onclick="event.stopPropagation();UnkScape.game.systems.inventory.unequip('${s}')">✕</button>`:''}</div>`).join('');
const items=Object.entries(inv).map(([id,qty])=>{const it=US.ITEMS[id];return`<div class="inv-card"><span class="inv-ico">${it.icon}</span><div class="inv-info"><div class="inv-name">${it.name} <span class="inv-qty">x${qty}</span></div><div class="inv-type">${it.type||''}</div></div><button class="xs-btn" onclick="event.stopPropagation();UnkScape.game.systems.inventory.use('${id}')">Use</button></div>`}).join('')||'<div class="bk-empty">Empty</div>';
return `<div class="inv-eq">${eq}</div><div class="inv-divider">📦 Backpack</div><div class="inv-list">${items}</div>`;
};

/* ── STATS ── compact two-col, no paperdoll */
US.UI.prototype.statsHTML=function(){
const g=this.game,p=g.player,s=p.stats();
const weapon=p.equipment.weapon?US.ITEMS[p.equipment.weapon]:{name:'Fists',icon:'👊'};
const faction=US.FACTIONS[p.factionId]||{};
const story=US.getClassStory(p.classId);
const combatLv=US.levelForXp(p.skills.combat?.xp||0);
const totalLv=Object.values(p.skills).reduce((a,sk)=>a+US.levelForXp(sk.xp||0),0);
const attr=p.attributes||US.defaultAttributes(p.roleType||'hybrid');
const attrRows=Object.entries(US.ATTRIBUTES).map(([id,a])=>`<div class="st-row"><span>${a.icon} ${a.name}</span><b>${attr[id]||0}${(p.attributePoints||0)>0?` <button class="xs-btn" onclick="UnkScape.game.ui.addAttribute('${id}')">+</button>`:''}</b></div>`).join('');
const statLeft=`<div class="st-row"><span>Faction</span><b>${faction.icon||'⚑'} ${p.factionName||'—'}</b></div>
<div class="st-row"><span>Class</span><b>${US.CLASSES[p.classId]?.name||p.classId}</b></div>
<div class="st-row"><span>Char Lv</span><b>${p.characterLevel||1}</b></div>
<div class="st-row"><span>Total Lv</span><b>${totalLv}</b></div>
<div class="st-row"><span>Combat Lv</span><b>${combatLv}</b></div>
<div class="st-row"><span>HP</span><b>${Math.ceil(p.hp)}/${p.maxHp}</b></div>
<div class="st-row"><span>Attack</span><b>${s.attack}</b></div>
<div class="st-row"><span>Defense</span><b>${s.defense}</b></div>
<div class="st-row"><span>Crit</span><b>${Math.round((s.critChance||0)*100)}%</b></div>
<div class="st-row"><span>Speed</span><b>${Math.round(s.moveSpeed)}</b></div>
<div class="st-row"><span>Atk Spd</span><b>${s.attackSpeed.toFixed(2)}s</b></div>
<div class="st-row"><span>Attr Pts</span><b>${p.attributePoints||0}</b></div>`;
return `<div class="st-layout"><div class="st-col"><div class="st-section-head">Character</div>${statLeft}</div><div class="st-col"><div class="st-section-head">Attributes</div>${attrRows}</div></div><div class="st-story"><b>${US.CLASSES[p.classId]?.icon||'🧭'} ${story.title}</b> · ${story.theme}</div>`;
};
US.UI.prototype.addAttribute=function(id){
const p=this.game.player;if(!p||!US.ATTRIBUTES[id]||(p.attributePoints||0)<=0)return;
p.attributes=p.attributes||US.defaultAttributes(p.roleType||'hybrid');
p.attributes[id]=(p.attributes[id]||0)+1;p.attributePoints--;
this.game.ui.toast('Attribute Added',`${US.ATTRIBUTES[id].name} → ${p.attributes[id]}`,'good');
this.renderPanel();
};

/* ── CRAFTING ── 4-col micro-cards */
US.UI.prototype.craftingHTML=function(){
const g=this.game;
return `<div class="cr-grid">${US.RECIPES.map(r=>{const can=g.systems.crafting.canCraft(r);const req=Object.entries(r.requires||{}).map(([id,q])=>`${US.ITEMS[id]?.icon||'?'}${q}`).join(' ');return`<div class="cr-card ${can?'can-craft':''}"><span class="cr-icon">${r.icon}</span><div class="cr-name">${r.name}</div><div class="cr-req">${req}</div><button class="xs-btn" ${can?'':'disabled'} onclick="event.stopPropagation();UnkScape.game.systems.crafting.craft('${r.id}')">Craft</button></div>`}).join('')}</div>`;
};

/* ── QUESTS ── storyline + active only, compact */
US.UI.prototype.questsHTML=function(){
const qs=this.game.systems.quests,p=this.game.player,story=US.getClassStory(p.classId),faction=US.FACTIONS[p.factionId]||{};
const active=Object.entries(qs.active).map(([id,st])=>{const q=US.QUESTS[id]||US.CLASS_QUESTS?.[id];if(!q)return'';return`<div class="q-card"><span class="q-icon">${q.icon}</span><div class="q-body"><div class="q-name">${q.name}</div>${q.steps.map((step,i)=>`<div class="q-step">${(st.progress[i]||0)>=step.qty?'✅':'⬜'} ${step.text} ${st.progress[i]||0}/${step.qty}</div>`).join('')}</div></div>`}).join('')||'<div class="bk-empty">No active quests</div>';
const done=Object.keys(qs.completed).map(id=>(US.QUESTS[id]||US.CLASS_QUESTS?.[id])?.name).filter(Boolean).join(', ')||'None';
return `<div class="q-story"><b>${US.CLASSES[p.classId]?.icon||'🧭'} ${story.title}</b> · ${faction.icon||'⚑'} ${p.factionName||'—'} · ${story.theme}</div><div class="q-section-head">Active Quests</div><div class="q-list">${active}</div><div class="q-done"><b>Completed:</b> ${done}</div>`;
};

/* ── MAP ── */
US.UI.prototype.mapHTML=function(){
const p=this.game.player,faction=US.FACTIONS[p.factionId]||{},story=US.getClassStory(p.classId);
setTimeout(()=>this.drawWorldMap(),0);
return `<div class="map-bar"><span>⚑ ${p.factionName||'—'}</span><span>📖 ${story.title}</span><span>⚪ you · 🔺 cam · ⭐ zones · 🟢 npcs · 🟥 mobs</span></div><canvas id="worldMap" class="map-canvas" width="600" height="390"></canvas>`;
};
US.UI.prototype.drawWorldMap=function(){
const c=document.getElementById('worldMap');if(!c||!this.game.world)return;const ctx=c.getContext('2d'),g=this.game,W=600,H=390;
ctx.clearRect(0,0,W,H);const sx=W/US.WORLD.w,sy=H/US.WORLD.h;
for(let y=0;y<US.WORLD.h;y++)for(let x=0;x<US.WORLD.w;x++){ctx.fillStyle=US.TILES[g.world.tiles[y][x]].color;ctx.fillRect(x*sx,y*sy,Math.ceil(sx),Math.ceil(sy));}
Object.entries(US.STARTER_ZONES||{}).forEach(([id,z])=>{ctx.fillStyle='#f7c65b';ctx.beginPath();ctx.arc(z.x*sx,z.y*sy,6,0,Math.PI*2);ctx.fill();});
ctx.fillStyle='#63e6a4';g.entities.npcs.forEach(n=>{const nx=n.x/US.TILE*sx,ny=n.y/US.TILE*sy;ctx.fillRect(nx-2,ny-2,5,5);});
ctx.fillStyle='#ff5c7a';g.entities.enemies.forEach(e=>ctx.fillRect(e.x/US.TILE*sx-1,e.y/US.TILE*sy-1,2,2));
ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(g.player.x/US.TILE*sx,g.player.y/US.TILE*sy,4,0,Math.PI*2);ctx.fill();
ctx.save();ctx.translate(g.player.x/US.TILE*sx,g.player.y/US.TILE*sy);ctx.rotate(g.camera.targetAngle||g.camera.angle||0);ctx.strokeStyle='#f7c65b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(7,6);ctx.lineTo(0,1);ctx.lineTo(-7,6);ctx.closePath();ctx.stroke();ctx.restore();
};
})();

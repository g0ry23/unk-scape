(function(){
  window.UnkScape = window.UnkScape || {};
const US = window.UnkScape = window.UnkScape;
  US.UI.prototype.togglePanel=function(name){if(this.panel===name){this.closePanel();return;}this.openPanel(name);};
  US.UI.prototype.openPanel=function(name){this.panel=name;this.game.paused=true;this.clearInputLocks();document.getElementById('panel').classList.add('show');document.getElementById('dialog').classList.remove('show');this.dialogNpc=null;this.renderPanel();this.syncLayoutState();};
  US.UI.prototype.closePanel=function(){this.panel=null;document.getElementById('panel').classList.remove('show');this.game.paused=false;this.clearInputLocks();this.syncLayoutState();};
  US.UI.prototype.renderPanel=function(){
    if(!this.panel)return; const el=document.getElementById('panel');
    this.clearInputLocks();
    const title={inventory:'Inventory',stats:'Character Stats',skills:'Skills',crafting:'Crafting',quests:'Quests',bank:'Bank',map:'World Map'}[this.panel]||'Panel';
    el.innerHTML=`<div class="panel-box"><div class="panel-head"><div><h2>${title}</h2><div class="sub">UNK-SCAPE survival interface</div></div><button class="close-btn" onclick="Duskfall.game.ui.closePanel()">Close</button></div><div class="panel-body">${this.panelHTML(this.panel)}</div></div>`;
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
  US.UI.prototype.inventoryHTML=function(){
    const g=this.game, inv=g.systems.inventory.items, p=g.player;
    const eq=['head','weapon','offhand','body','tool'].map(s=>`<div class="item-card"><h3>${s.toUpperCase()}</h3><p>${p.equipment[s]?US.ITEMS[p.equipment[s]].icon+' '+US.ITEMS[p.equipment[s]].name:'Empty'}</p>${p.equipment[s]?`<button class="small-btn" onclick="event.stopPropagation();Duskfall.game.systems.inventory.unequip('${s}')">Unequip</button>`:''}</div>`).join('');
    const items=Object.entries(inv).map(([id,qty])=>{const it=US.ITEMS[id];return`<div class="item-card"><span class="qty">x${qty}</span><h3>${it.icon} ${it.name}</h3><p>${it.desc||''}</p><span class="tag">${it.type}</span><br><button class="small-btn" onclick="event.stopPropagation();Duskfall.game.systems.inventory.use('${id}')">Use / Equip</button></div>`}).join('')||'<div class="help-note">Inventory empty.</div>';
    return `<h3>Equipment</h3><div class="grid">${eq}</div><h3 style="margin-top:22px">Backpack</h3><div class="grid">${items}</div>`;
  };
  US.UI.prototype.statsHTML=function(){
    const g=this.game,p=g.player,s=p.stats();
    const weapon=p.equipment.weapon?US.ITEMS[p.equipment.weapon]:{name:'Fists',icon:'👊'};
    const body=p.equipment.body?US.ITEMS[p.equipment.body]:null;
    const head=p.equipment.head?US.ITEMS[p.equipment.head]:null;
    const offhand=p.equipment.offhand?US.ITEMS[p.equipment.offhand]:null;
    const tool=p.equipment.tool?US.ITEMS[p.equipment.tool]:null;
    const combatLvl=US.levelForXp(p.skills.combat?.xp||0);
    const totalLvl=Object.values(p.skills).reduce((a,sk)=>a+US.levelForXp(sk.xp||0),0);
    const style=US.EQUIPMENT[p.equipment.weapon]?.style || US.ITEMS[p.equipment.weapon]?.combatStyle || 'melee';
    const attr=p.attributes||US.defaultAttributes(p.roleType||'hybrid');
    const attrRows=Object.entries(US.ATTRIBUTES).map(([id,a])=>`<div class="stat-line"><span>${a.icon} ${a.name}</span><b>${attr[id]||0} ${(p.attributePoints||0)>0?`<button class="small-btn" style="padding:3px 7px;margin-left:6px" onclick="Duskfall.game.ui.addAttribute('${id}')">+</button>`:''}</b></div>`).join('');
    return `<div class="stat-sheet"><div class="stat-hero"><div class="paperdoll"><div class="pd-head"></div><div class="pd-body"></div><div class="pd-arm left"></div><div class="pd-arm right"></div><div class="pd-leg left"></div><div class="pd-leg right"></div><div class="pd-boot left"></div><div class="pd-boot right"></div><div class="pd-weapon">${weapon.icon||'👊'}</div><div class="pd-shield">${offhand?.icon||''}</div></div></div><div class="stat-card"><h3>${US.FACTIONS[p.factionId]?.icon||'⚑'} ${p.factionName}</h3><div class="stat-list"><div class="stat-line"><span>Class Story</span><b>${US.getClassStory(p.classId).title}</b></div><div class="stat-line"><span>Faction Buff</span><b>${Object.entries(US.FACTIONS[p.factionId]?.buff||{}).map(([k,v])=>`${k}+${v}`).join(', ')||'None'}</b></div><div class="stat-line"><span>Class / Zone</span><b>${US.CLASSES[p.classId]?.name||p.classId} • ${p.zoneName}</b></div><div class="stat-line"><span>Team Role</span><b>${p.role||US.CLASS_ROLES[p.classId]||'Hybrid'}</b></div><div class="stat-line"><span>Character Level</span><b>${p.characterLevel||1}</b></div><div class="stat-line"><span>Attribute Points</span><b>${p.attributePoints||0}</b></div><div class="stat-line"><span>Combat Style</span><b>${style.toUpperCase()}</b></div><div class="stat-line"><span>Total Skill Level</span><b>${totalLvl}</b></div><div class="stat-line"><span>Combat Level</span><b>${combatLvl}</b></div><div class="stat-line"><span>Health</span><b>${Math.ceil(p.hp)} / ${p.maxHp}</b></div><div class="stat-line"><span>Attack</span><b>${s.attack}</b></div><div class="stat-line"><span>Defense</span><b>${s.defense}</b></div><div class="stat-line"><span>Healing Power</span><b>${s.healingPower}</b></div><div class="stat-line"><span>Support Power</span><b>${s.supportPower}</b></div><div class="stat-line"><span>Crit Chance</span><b>${Math.round((s.critChance||0)*100)}%</b></div><div class="stat-line"><span>Accuracy</span><b>${Math.round(s.accuracy*100)}%</b></div><div class="stat-line"><span>Attack Speed</span><b>${s.attackSpeed.toFixed(2)}s</b></div><div class="stat-line"><span>Range</span><b>${Math.round(s.range)}</b></div><div class="stat-line"><span>Move Speed</span><b>${Math.round(s.moveSpeed)}</b></div></div></div></div><h3 style="margin-top:18px">Attributes</h3><div class="stat-card"><div class="stat-list">${attrRows}</div></div><h3 style="margin-top:18px">Equipment</h3><div class="grid"><div class="item-card"><h3>${head?.icon||'—'} Head</h3><p>${head?.name||'Empty'}</p></div><div class="item-card"><h3>${weapon.icon||'👊'} Weapon</h3><p>${weapon.name}</p></div><div class="item-card"><h3>${offhand?.icon||'—'} Offhand</h3><p>${offhand?.name||'Empty'}</p></div><div class="item-card"><h3>${body?.icon||'—'} Body</h3><p>${body?.name||'Empty'}</p></div><div class="item-card"><h3>${tool?.icon||'—'} Tool</h3><p>${tool?.name||'Empty'}</p></div></div>`;
  };
  US.UI.prototype.addAttribute=function(id){
    const p=this.game.player;if(!p||!US.ATTRIBUTES[id]||(p.attributePoints||0)<=0)return;
    p.attributes=p.attributes||US.defaultAttributes(p.roleType||'hybrid');
    p.attributes[id]=(p.attributes[id]||0)+1;p.attributePoints--;
    this.game.ui.toast('Attribute Added',`${US.ATTRIBUTES[id].name} increased to ${p.attributes[id]}.`, 'good');
    this.renderPanel();
  };
  US.UI.prototype.skillsHTML=function(){
    const p=this.game.player;
    return `<table class="table"><thead><tr><th>Skill</th><th>Level</th><th>XP</th><th>Next</th></tr></thead><tbody>${Object.entries(US.SKILLS).map(([id,c])=>{if(!p.skills[id])p.skills[id]={xp:0,level:1};const xp=p.skills[id].xp||0,l=US.levelForXp(xp),next=US.xpForLevel(l+1);return`<tr><td><strong>${c.icon} ${c.name}</strong><br><small style="color:var(--muted)">${c.desc}</small></td><td>${l}</td><td>${xp}</td><td>${next-xp}</td></tr>`}).join('')}</tbody></table><h3>Perks</h3><div class="grid">${p.perks.map(id=>US.PERKS[id]?`<div class="item-card"><h3>${US.PERKS[id].icon} ${US.PERKS[id].name}</h3><p>${US.PERKS[id].desc}</p></div>`:'').join('')||'<div class="help-note">No perks yet.</div>'}</div>`;
  };
  US.UI.prototype.craftingHTML=function(){
    const g=this.game;
    return `<div class="grid">${US.RECIPES.map(r=>{const can=g.systems.crafting.canCraft(r);const req=Object.entries(r.requires||{}).map(([id,q])=>`${US.ITEMS[id]?.icon||'❔'} ${q}`).join(' ');const skill=US.SKILLS[r.skill]?.name||r.skill;return`<div class="item-card"><h3>${r.icon} ${r.name}</h3><p>${r.desc}</p><p><b>Req:</b> ${req}</p><span class="tag">${skill} Lv ${r.level}</span><br><button class="small-btn" ${can?'':'disabled'} onclick="event.stopPropagation();Duskfall.game.systems.crafting.craft('${r.id}')">Craft</button></div>`}).join('')}</div>`;
  };
  US.UI.prototype.questsHTML=function(){
    const qs=this.game.systems.quests, p=this.game.player, story=US.getClassStory(p.classId), faction=US.FACTIONS[p.factionId]||{};
    const starter=US.getStarterZone(p.classId);
    const classBosses=(US.FACTION_BOSSES||[]).filter(b=>b.classId===p.classId);
    const worldBosses=Object.entries(US.WORLD_BOSSES||{}).map(([id,b])=>({id,...b}));
    const storyCard=`<div class="item-card" style="min-height:auto;border-color:${faction.color||'#f7c65b'}"><h3>${US.CLASSES[p.classId]?.icon||'🧭'} ${story.title}</h3><p>${story.theme}</p><p><b>Faction:</b> ${faction.icon||'⚑'} ${p.factionName}</p><p><b>Starter Region:</b> ${starter.icon} ${starter.name}</p><p><b>Trainer:</b> ${US.getZoneFeature(p.classId).trainer}</p><span class="tag">Class Storyline Active</span></div>`;
    const active=Object.entries(qs.active).map(([id,st])=>{const q=US.QUESTS[id] || US.CLASS_QUESTS?.[id]; if(!q) return ''; return`<div class="item-card"><h3>${q.icon} ${q.name}</h3><p>${q.desc}</p>${q.steps.map((s,i)=>`<p>${(st.progress[i]||0)>=s.qty?'✅':'⬜'} ${s.text} <b>${st.progress[i]||0}/${s.qty}</b></p>`).join('')}</div>`}).join('')||'<div class="help-note">No active quests.</div>';
    const bossCards=classBosses.map(b=>{const f=US.FACTIONS[b.factionId]||{};return`<div class="item-card"><h3>${f.icon||'⚑'} ${b.name}</h3><p><b>Zone:</b> ${b.zone}</p><p><b>Pressure:</b> ${b.rolePressure}</p><p><b>Loot:</b> ${b.lootTable.map(id=>US.ITEMS[id]?.icon||'🎁').join(' ')} ${b.lootTable.map(id=>US.ITEMS[id]?.name||id).join(', ')}</p><span class="tag">Faction Boss Foundation</span></div>`}).join('');
    const worldCards=worldBosses.map(b=>`<div class="item-card"><h3>${b.icon} ${b.name}</h3><p><b>Zone:</b> ${b.zone}</p><p><b>HP:</b> ${b.hp} • <b>Damage:</b> ${b.damage}</p><p><b>Loot:</b> ${b.lootTable.map(id=>US.ITEMS[id]?.icon||'🎁').join(' ')} ${b.lootTable.map(id=>US.ITEMS[id]?.name||id).join(', ')}</p><span class="tag">World Boss Foundation</span></div>`).join('');
    return `<h3>Storyline</h3><div class="grid">${storyCard}</div><h3>Active Quests</h3><div class="grid">${active}</div><h3>Your Class Faction Bosses</h3><div class="grid">${bossCards}</div><h3>Greater World Bosses</h3><div class="grid">${worldCards}</div><h3>Completed</h3><p>${Object.keys(qs.completed).map(id=>(US.QUESTS[id]||US.CLASS_QUESTS?.[id])?.name).filter(Boolean).join(', ')||'None yet.'}</p>`;
  };
  US.UI.prototype.bankHTML=function(){
    const g=this.game, inv=g.systems.inventory.items, bank=g.systems.bank.items;
    const invRows=Object.entries(inv).filter(([id])=>id!=='coin').map(([id,q])=>`<div class="shop-row"><div>${US.ITEMS[id].icon} <b>${US.ITEMS[id].name}</b><small>Backpack x${q}</small></div><button class="small-btn" onclick="event.stopPropagation();Duskfall.game.systems.bank.deposit('${id}',1)">Deposit 1</button><button class="small-btn" onclick="event.stopPropagation();Duskfall.game.systems.bank.deposit('${id}',${q})">All</button></div>`).join('')||'<div class="help-note">No depositable items.</div>';
    const bankRows=Object.entries(bank).map(([id,q])=>`<div class="shop-row"><div>${US.ITEMS[id].icon} <b>${US.ITEMS[id].name}</b><small>Bank x${q}</small></div><button class="small-btn" onclick="event.stopPropagation();Duskfall.game.systems.bank.withdraw('${id}',1)">Withdraw 1</button><button class="small-btn" onclick="event.stopPropagation();Duskfall.game.systems.bank.withdraw('${id}',${q})">All</button></div>`).join('')||'<div class="help-note">Bank empty.</div>';
    return `<div class="two-col"><div><h3>Backpack</h3>${invRows}</div><div><h3>Bank Vault</h3>${bankRows}</div></div>`;
  };
  US.UI.prototype.mapHTML=function(){
    const p=this.game.player;
    const faction=US.FACTIONS[p.factionId]||{};
    const story=US.getClassStory(p.classId);
    setTimeout(()=>this.drawWorldMap(),0);
    return `<div class="help-note"><b>${faction.icon||'⚑'} Your Faction:</b> ${p.factionName||'Unknown'} • <b>Class Story:</b> ${story.title}<br>${story.theme}<br><br>The map now marks your starter zone, your faction claim flags, class trainers, faction emissaries, active turf stones, portals, mobs, resources, and your camera direction.</div><div class="map-legend"><span>⚪ you</span><span>🔺 camera heading</span><span>⭐ starter zones</span><span>🚩 faction camps</span><span>🧑‍🏫 class trainers</span><span>⚑ turf claims</span><span>🌀 dungeon</span><span>🟥 mobs</span><span>🟢 NPCs</span></div><canvas id="worldMap" class="map-canvas" width="720" height="720"></canvas>`;
  };
  US.UI.prototype.drawWorldMap=function(){
    const c=document.getElementById('worldMap'); if(!c||!this.game.world)return; const ctx=c.getContext('2d'), g=this.game, W=720,H=720;
    ctx.clearRect(0,0,W,H); const sx=W/US.WORLD.w, sy=H/US.WORLD.h;
    for(let y=0;y<US.WORLD.h;y++)for(let x=0;x<US.WORLD.w;x++){ctx.fillStyle=US.TILES[g.world.tiles[y][x]].color;ctx.fillRect(x*sx,y*sy,Math.ceil(sx),Math.ceil(sy));}
    Object.entries(US.STARTER_ZONES||{}).forEach(([id,z])=>{
      ctx.fillStyle='#f7c65b';ctx.beginPath();ctx.arc(z.x*sx,z.y*sy,8,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ffffff';ctx.font='700 11px Inter';ctx.textAlign='center';ctx.fillText(US.getStarterZone(id).icon,z.x*sx,z.y*sy+4);
      const angleMap={melee:-2.35,warden:-1.55,range:-.78,cleric:0,gatherer:.78,mage:1.55,brawler:2.35,prospector:3.14,wanderer:.35};
      const a=angleMap[id]??0;
      ctx.fillStyle='#ff5c7a';ctx.beginPath();ctx.arc((z.x+Math.cos(a)*(z.r+9))*sx,(z.y+Math.sin(a)*(z.r+9))*sy,6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='700 9px Inter';ctx.fillText('B',(z.x+Math.cos(a)*(z.r+9))*sx,(z.y+Math.sin(a)*(z.r+9))*sy+3);
      (US.getClassFactions(id)||[]).forEach((fid,i)=>{const f=US.FACTIONS[fid];const ox=i===0?-9:9, oy=i===0?-9:9;ctx.fillStyle=f.color;ctx.beginPath();ctx.arc((z.x+ox)*sx,(z.y+oy)*sy,5,0,Math.PI*2);ctx.fill();});
    });
    ctx.fillStyle='#63e6a4';g.entities.npcs.forEach(n=>{
      const nx=n.x/US.TILE*sx, ny=n.y/US.TILE*sy;
      if(String(n.id).startsWith('trainer_')){ctx.fillStyle='#6aa7ff';ctx.beginPath();ctx.arc(nx,ny,5,0,Math.PI*2);ctx.fill();}
      else if(String(n.id).startsWith('emissary_')){ctx.fillStyle='#f7c65b';ctx.fillRect(nx-4,ny-4,8,8);}
      else {ctx.fillStyle='#63e6a4';ctx.fillRect(nx-3,ny-3,7,7);}
    });
    if(g.systems.turf?.points){g.systems.turf.points.forEach(pt=>{const f=US.FACTIONS[pt.factionId]||{};ctx.strokeStyle=pt.owner?f.color:'#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(pt.x/US.TILE*sx,pt.y/US.TILE*sy,6,0,Math.PI*2);ctx.stroke();});}
    ctx.fillStyle='#b98cff';g.entities.portals.forEach(p=>{ctx.beginPath();ctx.arc(p.x/US.TILE*sx,p.y/US.TILE*sy,6,0,Math.PI*2);ctx.fill();});
    ctx.fillStyle='#ffcf6e';
    [{x:US.WORLD.w/2,y:US.WORLD.h/2,name:'Dusk Titan'},{x:US.WORLD.w/2+34,y:US.WORLD.h/2-42,name:'Crownless Drake'}].forEach(b=>{ctx.beginPath();ctx.arc(b.x*sx,b.y*sy,9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#07090d';ctx.font='900 10px Inter';ctx.textAlign='center';ctx.fillText('WB',b.x*sx,b.y*sy+3);ctx.fillStyle='#ffcf6e';});
    ctx.fillStyle='#ff5c7a';g.entities.enemies.forEach(e=>ctx.fillRect(e.x/US.TILE*sx-1,e.y/US.TILE*sy-1,3,3));
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(g.player.x/US.TILE*sx,g.player.y/US.TILE*sy,5,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.translate(g.player.x/US.TILE*sx,g.player.y/US.TILE*sy);ctx.rotate(g.camera.targetAngle||g.camera.angle||0);ctx.strokeStyle='#f7c65b';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(10,8);ctx.lineTo(0,2);ctx.lineTo(-10,8);ctx.closePath();ctx.stroke();ctx.restore();
  };
})();

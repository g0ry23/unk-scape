(function(){
  const D = window.Duskfall = window.Duskfall || {};

 D.UI.prototype.showMenu=function(){document.getElementById('menu').classList.add('show');this.game.paused=true;this.renderMenu();this.syncLayoutState();};
  D.UI.prototype.toggleMenu=function(){
    const m=document.getElementById('menu');
    if(m.classList.contains('show')&&this.game.state==='play'){m.classList.remove('show');this.game.paused=false;this.syncLayoutState();}
    else this.showMenu();
  };
  D.UI.prototype._menuStep=function(step){this.game.creationState=this.game.creationState||{worldName:'New Realm',charName:'Survivor',faction:null,race:'human',cls:null};this.game.creationState.step=step;this.renderMenu();};
  D.UI.prototype._setMenu=function(h){document.getElementById('menu').innerHTML=h;};
  D.UI.prototype.renderMenu=function(){
    const g=this.game;
    if(g.state==='play')return this.renderPauseMenu();
    if(!g.creationState)g.creationState={step:'main',worldName:'New Realm',charName:'Survivor',faction:null,race:'human',cls:null};
    const step=g.creationState.step;
    if(step==='main')this._menuMain();
    else if(step==='world_name')this._menuWorldName();
    else if(step==='load')this._menuLoad();
    else if(step==='faction')this._menuFaction();
    else if(step==='race')this._menuRace();
    else this._menuClass();
  };
  D.UI.prototype._menuMain=function(){
    const saves=this.game.systems.save?this.game.systems.save.getAllSaves():[];
    this._setMenu(`<div class="menu-card"><h1>UNK-SCAPE</h1><p>A retro medieval survival sandbox MMO — skilling, crafting, combat, dungeons, factions, and turf wars.</p><div class="menu-actions"><button class="big-btn" onclick="Duskfall.game.ui._menuStep('world_name')">New Game</button>${saves.length?`<button class="big-btn secondary" onclick="Duskfall.game.ui._menuStep('load')">Load Game</button>`:''}</div></div>`);
  };
  D.UI.prototype._menuWorldName=function(){
    const s=this.game.creationState;
    this._setMenu(`<div class="menu-card"><h1>Name Your Realm</h1><div class="setting-card"><label><b>World Name</b><br><input id="inp_world" type="text" value="${s.worldName}" style="margin-top:6px;background:#111;color:#fff;border:1px solid #444;padding:8px 12px;border-radius:8px;width:100%;box-sizing:border-box"></label><label style="margin-top:12px;display:block"><b>Character Name</b><br><input id="inp_char" type="text" value="${s.charName}" style="margin-top:6px;background:#111;color:#fff;border:1px solid #444;padding:8px 12px;border-radius:8px;width:100%;box-sizing:border-box"></label></div><div class="menu-actions" style="margin-top:16px"><button class="small-btn" onclick="Duskfall.game.ui._menuStep('main')">Back</button><button class="big-btn" onclick="Duskfall.game.ui._captureNames()">Next: Faction</button></div></div>`);
  };
  D.UI.prototype._captureNames=function(){
    const s=this.game.creationState;
    s.worldName=document.getElementById('inp_world')?.value?.trim()||'New Realm';
    s.charName=document.getElementById('inp_char')?.value?.trim()||'Survivor';
    this._menuStep('faction');
  };
  D.UI.prototype._menuFaction=function(){
    const cards=Object.values(D.FACTIONS).map(f=>`<div class="item-card" style="border:1px solid ${f.color};cursor:pointer;margin-bottom:10px" onclick="Duskfall.game.ui._selectFaction('${f.id}')"><h3 style="color:${f.color}">${f.icon} ${f.name}</h3><p>${f.desc}</p></div>`).join('');
    this._setMenu(`<div class="menu-card"><h1>Choose Faction</h1><div style="max-height:370px;overflow-y:auto">${cards}</div><div class="menu-actions"><button class="small-btn" onclick="Duskfall.game.ui._menuStep('world_name')">Back</button></div></div>`);
  };
  D.UI.prototype._selectFaction=function(id){
    this.game.creationState.faction=id;
    const f=D.FACTIONS[id];
    if(f){document.documentElement.style.setProperty('--faction-primary',f.color);document.documentElement.style.setProperty('--faction-glow',f.color+'33');}
    this._menuStep('race');
  };
  D.UI.prototype._menuRace=function(){
    const s=this.game.creationState;
    const races=D.RACES||{};
    const cards=Object.values(races).map(r=>`<div class="item-card" style="cursor:pointer;margin-bottom:10px;${s.race===r.id?'border-color:var(--faction-primary,#6af)':''}" onclick="Duskfall.game.ui._selectRace('${r.id}')"><h3>${r.icon} ${r.name}</h3><p>${r.description}</p><small style="color:var(--gold,#fc9)">Trait: ${r.perk}</small></div>`).join('');
    this._setMenu(`<div class="menu-card"><h1>Choose Race</h1><p>Race bonuses stack with your faction and class.</p><div style="max-height:370px;overflow-y:auto">${cards||'<p>Loading races…</p>'}</div><div class="menu-actions"><button class="small-btn" onclick="Duskfall.game.ui._menuStep('faction')">Back</button></div></div>`);
  };
  D.UI.prototype._selectRace=function(id){this.game.creationState.race=id;this._menuStep('class');};
  D.UI.prototype._menuClass=function(){
    const s=this.game.creationState;
    const cards=Object.entries(D.CLASSES).map(([id,c])=>{
      const factions=D.getClassFactions(id)||[];
      const items=Object.entries(c.items||{}).slice(0,4).map(([it,q])=>`<li>${D.ITEMS[it]?.icon||''} ${D.ITEMS[it]?.name||it} x${q}</li>`).join('');
      const btns=factions.map(fid=>{const f=D.FACTIONS[fid];return `<button class="small-btn" style="border-color:${f.color}" onclick="Duskfall.game.ui._startGame('${id}','${fid}')">${f.icon} ${f.name}</button>`;}).join('');
      return `<div class="class-card"><h3>${c.icon} ${c.name}</h3><p>${c.desc}</p><p><b>Zone:</b> ${D.getStarterZone(id).icon} ${D.getStarterZone(id).name}</p><ul>${items}</ul><div class="menu-actions" style="justify-content:flex-start;margin-top:10px">${btns}</div></div>`;
    }).join('');
    this._setMenu(`<div class="menu-card"><h1>Choose Class</h1><p>Click a faction button under a class to begin. Race: <b>${(D.RACES||{})[s.race]?.name||s.race}</b></p><div class="class-grid">${cards}</div><div class="menu-actions" style="margin-top:12px"><button class="small-btn" onclick="Duskfall.game.ui._menuStep('race')">Back</button></div></div>`);
  };
  D.UI.prototype._startGame=function(classId,factionId){
    const s=this.game.creationState;
    const race=s.race||'human';
    this.game.worldId='world_'+Date.now().toString(36);
    this.game.worldName=s.worldName;
    this.game.newGame(classId,factionId);
    const p=this.game.player;
    if(p){p.characterName=s.charName;p.characterId='char_'+Math.random().toString(36).slice(2,8);p.raceId=race;}
    const f=D.FACTIONS[factionId];
    if(f){document.documentElement.style.setProperty('--faction-primary',f.color);document.documentElement.style.setProperty('--faction-glow',f.color+'33');}
    this.game.state='play';this.game.paused=false;
    document.getElementById('menu').classList.remove('show');
    this.syncLayoutState();
  };
  D.UI.prototype._menuLoad=function(){
    const g=this.game;
    const saves=g.systems.save?g.systems.save.getAllSaves():[];
    const worlds=g.systems.save?g.systems.save.getAllWorlds():{};
    if(!saves.length){this._setMenu(`<div class="menu-card"><h1>No Saves</h1><div class="menu-actions"><button class="big-btn" onclick="Duskfall.game.ui._menuStep('main')">Back</button></div></div>`);return;}
    const byWorld={};
    saves.forEach(s=>{(byWorld[s.worldId]=byWorld[s.worldId]||[]).push(s);});
    const wHtml=Object.entries(byWorld).map(([wid,chars])=>{
      const wName=worlds[wid]?.name||chars[0]?.worldName||wid;
      const cHtml=chars.map(s=>{
        const f=D.FACTIONS[s.factionId],r=D.RACES?D.RACES[s.raceId]:null,c=D.CLASSES?D.CLASSES[s.classId]:null;
        return `<div class="setting-card" style="margin:6px 0"><b>${c?.icon||''} ${s.characterName}</b> <span style="color:var(--muted,#9aa)">${f?.icon||''} ${f?.name||s.factionId} · ${r?.name||s.raceId||'?'} · ${c?.name||s.classId} · Lv.${s.level||1}</span><div style="margin-top:6px"><button class="small-btn" onclick="Duskfall.game.ui._loadCharacter('${wid}','${s.characterId}')">Continue</button> <button class="small-btn" style="color:#e55" onclick="Duskfall.game.ui._deleteChar('${wid}','${s.characterId}')">Delete</button></div></div>`;
      }).join('');
      return `<div class="item-card" style="margin-bottom:12px"><h3>🌍 ${wName}</h3>${cHtml}</div>`;
    }).join('');
    this._setMenu(`<div class="menu-card"><h1>Load Game</h1><div style="max-height:420px;overflow-y:auto">${wHtml}</div><div class="menu-actions"><button class="small-btn" onclick="Duskfall.game.ui._menuStep('main')">Back</button></div></div>`);
  };
  D.UI.prototype._loadCharacter=function(worldId,characterId){
    const save=this.game.systems.save?.load(worldId,characterId);
    if(!save){this.game.ui.toast('Load failed','Save not found.','bad');return;}
    this.game.loadGame(save);
    const f=D.FACTIONS[save.factionId];
    if(f){document.documentElement.style.setProperty('--faction-primary',f.color);document.documentElement.style.setProperty('--faction-glow',f.color+'33');}
    document.getElementById('menu').classList.remove('show');
    this.syncLayoutState();
  };
  D.UI.prototype._deleteChar=function(worldId,characterId){
    if(!confirm('Delete this character? Cannot be undone.'))return;
    this.game.systems.save?.deleteCharacter(worldId,characterId);
    this._menuLoad();
  };
  D.UI.prototype.renderPauseMenu=function(){
    const g=this.game,binds=g.settings.keybinds;
    const audio=g.settings.audio,display=g.settings.display;
    const pct=v=>Math.round((v??0)*100);
    const actions=[['inventory','Inventory'],['stats','Character Stats'],['skills','Skills'],['crafting','Crafting'],['quests','Quests'],['bank','Bank'],['map','Map'],['interact','Interact'],['attack','Attack'],['buildToggle','Build Mode'],['buildCycle','Cycle Tile'],['zoomIn','Zoom In'],['zoomOut','Zoom Out'],['cameraToggle','Camera'],['cameraOverhead','Overhead'],['rotateLeft','Rotate Left'],['rotateRight','Rotate Right'],['save','Save'],['pause','Pause']];
    document.getElementById('menu').innerHTML=`<div class="menu-card"><h1>Paused</h1><div class="menu-actions"><button class="big-btn" onclick="Duskfall.game.ui.toggleMenu()">Resume</button><button class="big-btn secondary" onclick="Duskfall.game.systems.save.save()">Save Game</button><button class="big-btn secondary" onclick="Duskfall.game.ui._quitToMenu()" style="border-color:rgba(255,92,122,.45);color:#ff5c7a">Quit to Menu</button><button class="big-btn secondary" onclick="Duskfall.game.camera.toggleMode();Duskfall.game.ui.renderMenu()">Camera: ${g.camera.modeLabel()}</button><button class="big-btn secondary" onclick="Duskfall.game.camera.setOverhead();Duskfall.game.ui.renderMenu()">Overhead</button><button class="big-btn secondary" onclick="Duskfall.game.settings.hungerEnabled=!Duskfall.game.settings.hungerEnabled;Duskfall.game.ui.renderMenu()">Hunger: ${g.settings.hungerEnabled?'On':'Off'}</button><button class="big-btn secondary" onclick="Duskfall.game.systems.build.toggle();Duskfall.game.ui.renderMenu()">Build Mode: ${g.buildMode?'On':'Off'}</button></div><div class="setting-grid"><div class="setting-card"><h3>Audio</h3><label>Master ${pct(audio.master)}% <input type="range" min="0" max="1" step="0.01" value="${audio.master}" onchange="Duskfall.game.settings.audio.master=Number(this.value);Duskfall.game.systems.audio.applyVolumes();Duskfall.game.ui.renderMenu()"></label><br><label>Music ${pct(audio.music)}% <input type="range" min="0" max="1" step="0.01" value="${audio.music}" onchange="Duskfall.game.settings.audio.music=Number(this.value);Duskfall.game.systems.audio.applyVolumes();Duskfall.game.ui.renderMenu()"></label><br><label>SFX ${pct(audio.sfx)}% <input type="range" min="0" max="1" step="0.01" value="${audio.sfx}" onchange="Duskfall.game.settings.audio.sfx=Number(this.value);Duskfall.game.systems.audio.applyVolumes();Duskfall.game.ui.renderMenu()"></label><br><button class="small-btn" onclick="Duskfall.game.systems.audio.setEnabled(!Duskfall.game.settings.audio.enabled);Duskfall.game.ui.renderMenu()">Audio: ${audio.enabled?'On':'Off'}</button></div><div class="setting-card"><h3>Display</h3><button class="small-btn" onclick="Duskfall.game.settings.display.uiScale=Duskfall.game.settings.display.uiScale==='normal'?'large':Duskfall.game.settings.display.uiScale==='large'?'small':'normal';Duskfall.game.ui.applyDisplaySettings();Duskfall.game.ui.renderMenu()">UI Scale: ${display.uiScale}</button> <button class="small-btn" onclick="Duskfall.game.settings.display.floatingText=!Duskfall.game.settings.display.floatingText;Duskfall.game.ui.renderMenu()">Float Text: ${display.floatingText?'On':'Off'}</button> <button class="small-btn" onclick="Duskfall.game.settings.display.screenShake=!Duskfall.game.settings.display.screenShake;Duskfall.game.ui.renderMenu()">Screen Shake: ${display.screenShake?'On':'Off'}</button></div><div class="setting-card"><h3>Camera</h3><button class="small-btn" onclick="Duskfall.game.camera.setZoom(.12);Duskfall.game.ui.renderMenu()">Zoom In</button> <button class="small-btn" onclick="Duskfall.game.camera.setZoom(-.12);Duskfall.game.ui.renderMenu()">Zoom Out</button> <button class="small-btn" onclick="Duskfall.game.camera.rotate(-Math.PI/12);Duskfall.game.ui.renderMenu()">Rotate Left</button> <button class="small-btn" onclick="Duskfall.game.camera.rotate(Math.PI/12);Duskfall.game.ui.renderMenu()">Rotate Right</button></div>${actions.map(([a,label])=>`<div class="setting-card"><h3>${label}</h3><button class="small-btn" onclick="Duskfall.game.input.startRebind('${a}')"><b>${D.displayKey(binds[a])}</b></button></div>`).join('')}</div></div>`;
  };

D.UI.prototype._quitToMenu=function(){
const g=this.game;
if(g.state==='play'&&g.player&&!g.player.dead){
g.systems.save.autosave();
g.ui.toast('Progress Saved','Returning to main menu...','good');
}
g.state='menu';g.paused=true;g.world=null;g.player=null;
g.entities={resources:[],enemies:[],npcs:[],portals:[],projectiles:[],drops:[],effects:[]};
g.creationState={step:'main',worldName:'New Realm',charName:'Survivor',faction:null,race:'human',cls:null};
document.body.classList.remove('theme-blood-oath','theme-iron-crown');
document.documentElement.style.removeProperty('--faction-primary');
document.documentElement.style.removeProperty('--faction-glow');
this.showMenu();
};
})();

(function(){
const D = window.Duskfall = window.Duskfall || {};

// ── Core menu helpers ─────────────────────────────────────────────────────
D.UI.prototype.showMenu=function(){
  document.getElementById('menu').classList.add('show');
  this.game.paused=true;
  this.renderMenu();
  this.syncLayoutState();
};
D.UI.prototype.toggleMenu=function(){
  const m=document.getElementById('menu');
  if(m.classList.contains('show')&&this.game.state==='play'){m.classList.remove('show');this.game.paused=false;this.syncLayoutState();}
  else this.showMenu();
};
D.UI.prototype._setMenu=function(h){document.getElementById('menu').innerHTML=h;};
D.UI.prototype._menuStep=function(step){
  this.game.creationState=this.game.creationState||{worldName:'New Realm',charName:'Survivor',faction:null,race:'human',cls:null};
  this.game.creationState.step=step;
  this.renderMenu();
};

// ── Main router ───────────────────────────────────────────────────────────
D.UI.prototype.renderMenu=function(){
  const g=this.game;
  if(g.state==='play') return this.renderPauseMenu();
  // Init wizard state if needed
  if(!g.creationWizardState){
    g.creationWizardState={step:'landing',worldName:'New Realm',charName:'Survivor',factionId:null,raceId:null,classId:null};
  }
  const wiz=g.creationWizardState;
  const container=document.getElementById('menu');
  const step=wiz.step;

  if(step==='landing') return this._wizLanding(container);
  if(step==='identity') return this._wizIdentity(container, wiz);
  if(step==='faction')  return this._wizFaction(container);
  if(step==='race')     return this._wizRace(container);
  if(step==='class')    return this._wizClass(container, wiz);
  if(step==='load')     return this._menuLoad();
};

// ── Wizard Step: Landing ──────────────────────────────────────────────────
D.UI.prototype._wizLanding=function(container){
  const saveManager=this.game.systems.save;
  const allSaves=saveManager?saveManager.getAllSaves():[];
  const worlds=saveManager?saveManager.getAllWorlds():{};
  let saveSlotsHtml='';
  if(allSaves.length>0){
    saveSlotsHtml='<h3 style="margin:20px 0 10px;color:#ffd783;">Continue Adventure</h3>';
    allSaves.forEach(function(p){
      const f=D.FACTIONS[p.factionId],r=D.RACES?D.RACES[p.raceId]:null,c=D.CLASSES?D.CLASSES[p.classId]:null;
      const wName=worlds[p.worldId]?.name||p.worldName||p.worldId;
      saveSlotsHtml+=`<div class="setting-card" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:10px">
        <div style="min-width:0"><strong style="color:#e9f0ff">${c?.icon||''} ${p.characterName}</strong><br><small style="color:#9aa8c7">Lv.${p.level||1} ${f?.name||p.factionId||''} • ${wName}</small></div>
        <div style="display:flex;gap:6px;flex-shrink:0">
          <button class="small-btn" onclick="Duskfall.game.ui._loadCharacter('${p.worldId}','${p.characterId}')">Launch</button>
          <button class="small-btn" style="border-color:#ff5c7a !important;color:#ff5c7a" onclick="Duskfall.game.ui._deleteChar('${p.worldId}','${p.characterId}')">Delete</button>
        </div>
      </div>`;
    });
  }
  container.innerHTML=`<div class="menu-card" style="width:min(460px,90vw);text-align:center">
    <h1 style="font-family:var(--display);font-size:clamp(32px,5vw,46px);margin:0 0 6px;background:linear-gradient(90deg,#fff,#ffd783,#ff9b5c);-webkit-background-clip:text;color:transparent">UNK-SCAPE</h1>
    <p style="color:#9aa8c7;margin:0 0 22px;font-size:13px">Production RPG Engine v${D.SAVE_VERSION||'0.4.0'}</p>
    <div class="menu-actions" style="flex-direction:column;gap:10px">
      <button class="big-btn" style="padding:14px 28px;width:100%" onclick="Duskfall.game.ui.advanceWizardStep('identity')">Establish New Realm</button>
    </div>
    <div style="margin-top:4px;max-height:260px;overflow-y:auto;padding-right:4px">${saveSlotsHtml}</div>
  </div>`;
};

// ── Wizard Step: Identity ─────────────────────────────────────────────────
D.UI.prototype._wizIdentity=function(container, wiz){
  container.innerHTML=`<div class="menu-card" style="width:min(440px,90vw)">
    <h1>Identity Config</h1>
    <div class="setting-card" style="text-align:left;background:rgba(0,0,0,.2);margin-bottom:16px">
      <label style="font-weight:700;font-size:13px;color:#ffd783">Name Your World</label>
      <input type="text" id="wiz_worldName" value="${wiz.worldName}" style="display:block;width:100%;box-sizing:border-box;margin-top:6px;margin-bottom:14px;background:#0a0710;color:#fff;border:1px solid rgba(255,255,255,.15);padding:10px;border-radius:8px;font-family:inherit;font-size:14px">
      <label style="font-weight:700;font-size:13px;color:#ffd783">Name Your Character</label>
      <input type="text" id="wiz_charName" value="${wiz.charName}" style="display:block;width:100%;box-sizing:border-box;margin-top:6px;background:#0a0710;color:#fff;border:1px solid rgba(255,255,255,.15);padding:10px;border-radius:8px;font-family:inherit;font-size:14px">
    </div>
    <div class="menu-actions">
      <button class="small-btn" onclick="Duskfall.game.ui.advanceWizardStep('landing')">Back</button>
      <button class="big-btn" onclick="Duskfall.game.ui.submitIdentity()">Continue to Factions</button>
    </div>
  </div>`;
};

// ── Wizard Step: Faction ──────────────────────────────────────────────────
D.UI.prototype._wizFaction=function(container){
  const elements=Object.values(D.FACTIONS).map(function(f){
    const primaryColor=f.primaryColor||f.color||'#6aa7ff';
    const secondaryColor=f.secondaryColor||f.color||'#9aa8c7';
    const perksText=Array.isArray(f.perks)?f.perks.join(' | '):'';
    return `<div class="item-card" style="border:1px solid ${primaryColor};margin-bottom:12px;cursor:pointer;padding:14px;background:rgba(0,0,0,.15)" onclick="Duskfall.game.ui.submitFaction('${f.id}')">
      <h3 style="color:${primaryColor};margin:0 0 4px;font-size:16px">${f.icon||''} ${f.name}</h3>
      <p style="margin:0 0 8px;font-size:12px;color:#9aa8c7;line-height:1.4">${f.desc||f.description||''}</p>
      ${perksText?`<div style="font-size:10px;color:${secondaryColor};font-family:var(--mono);font-weight:700">${perksText}</div>`:''}
    </div>`;
  }).join('');
  container.innerHTML=`<div class="menu-card" style="width:min(520px,90vw)">
    <h1>Align Your Faction</h1>
    <p style="color:#9aa8c7;font-size:13px;margin-bottom:16px">Your faction shapes your combat style, stats, and UI color theme.</p>
    <div style="max-height:400px;overflow-y:auto;padding-right:4px">${elements}</div>
  </div>`;
};

// ── Wizard Step: Race ─────────────────────────────────────────────────────
D.UI.prototype._wizRace=function(container){
  const elements=Object.values(D.RACES||{}).map(function(r){
    return `<div class="item-card" style="margin-bottom:12px;cursor:pointer;padding:14px;background:rgba(0,0,0,.15)" onclick="Duskfall.game.ui.submitRace('${r.id}')">
      <h3 style="margin:0 0 4px;color:#fff;font-size:16px">${r.icon||''} ${r.name}</h3>
      <p style="margin:0 0 6px;font-size:12px;color:#9aa8c7;line-height:1.4">${r.description||''}</p>
      <small style="color:var(--gold);font-weight:700;font-size:11px;font-family:var(--mono)">Trait: ${r.perk||''}</small>
    </div>`;
  }).join('');
  container.innerHTML=`<div class="menu-card" style="width:min(520px,90vw)">
    <h1>Select Character Race</h1>
    <p style="color:#9aa8c7;font-size:13px;margin-bottom:16px">Race bonuses stack with your faction and class.</p>
    <div style="max-height:380px;overflow-y:auto;padding-right:4px">${elements||'<p style="color:#9aa8c7">Loading races...</p>'}</div>
  </div>`;
};

// ── Wizard Step: Class ────────────────────────────────────────────────────
D.UI.prototype._wizClass=function(container, wiz){
  const elements=Object.entries(D.CLASSES).map(function([classKey,c]){
    const items=Object.entries(c.items||{}).slice(0,4).map(function([it,q]){
      return (D.ITEMS[it]?.icon||'')+(D.ITEMS[it]?.name||it)+' x'+q;
    }).join(', ');
    return `<div class="item-card" style="margin-bottom:12px;cursor:pointer;padding:14px;background:rgba(0,0,0,.15)" onclick="Duskfall.game.ui.submitClass('${classKey}')">
      <h3 style="margin:0 0 4px;color:#fff;font-size:16px">${c.icon||''} ${c.name}</h3>
      <p style="margin:0 0 6px;font-size:12px;color:#9aa8c7;line-height:1.4">${c.desc||''}</p>
      <small style="color:#6aa7ff;font-family:var(--mono);font-size:11px">Starts with: ${items}</small>
    </div>`;
  }).join('');
  const raceName=(D.RACES||{})[wiz.raceId]?.name||wiz.raceId||'Unknown';
  container.innerHTML=`<div class="menu-card" style="width:min(540px,90vw)">
    <h1>Select Specialization</h1>
    <p style="color:#9aa8c7;font-size:13px;margin-bottom:16px">Race: <strong>${raceName}</strong></p>
    <div style="max-height:380px;overflow-y:auto;padding-right:4px">${elements}</div>
    <div class="menu-actions" style="margin-top:12px">
      <button class="small-btn" onclick="Duskfall.game.ui.advanceWizardStep('race')">Back</button>
    </div>
  </div>`;
};

// ── Wizard action handlers ────────────────────────────────────────────────
D.UI.prototype.advanceWizardStep=function(step){
  if(!this.game.creationWizardState){
    this.game.creationWizardState={step:'landing',worldName:'New Realm',charName:'Survivor',factionId:null,raceId:null,classId:null};
  }
  this.game.creationWizardState.step=step;
  this.renderMenu();
};

D.UI.prototype.submitIdentity=function(){
  const wn=document.getElementById('wiz_worldName')?.value?.trim()||'New Realm';
  const cn=document.getElementById('wiz_charName')?.value?.trim()||'Survivor';
  this.game.creationWizardState.worldName=wn;
  this.game.creationWizardState.charName=cn;
  this.advanceWizardStep('faction');
};

D.UI.prototype.submitFaction=function(id){
  this.game.creationWizardState.factionId=id;
  const f=D.FACTIONS[id];
  if(f){
    const c=f.primaryColor||f.color||'#6aa7ff';
    document.documentElement.style.setProperty('--faction-primary',c);
    document.documentElement.style.setProperty('--faction-glow',c+'33');
    document.body.classList.remove('theme-blood-oath','theme-iron-crown');
    if(f.themeClass) document.body.classList.add(f.themeClass);
  }
  this.advanceWizardStep('race');
};

D.UI.prototype.submitRace=function(id){
  this.game.creationWizardState.raceId=id;
  this.advanceWizardStep('class');
};

D.UI.prototype.submitClass=function(classId){
  const g=this.game, wiz=g.creationWizardState;
  wiz.classId=classId;
  g.worldId='world_'+Date.now().toString(36);
  g.worldName=wiz.worldName;
  // newGame is async - player data is set in the .then() via a pending callback
  g._pendingCharacterSetup={charName:wiz.charName,factionId:wiz.factionId,raceId:wiz.raceId};
  g.newGame(classId, wiz.factionId);
};

// ── Load / Delete ─────────────────────────────────────────────────────────
D.UI.prototype._menuLoad=function(){
  const g=this.game;
  const saves=g.systems.save?g.systems.save.getAllSaves():[];
  const worlds=g.systems.save?g.systems.save.getAllWorlds():{};
  if(!saves.length){
    this._setMenu(`<div class="menu-card"><h1>No Saves</h1><div class="menu-actions"><button class="big-btn" onclick="Duskfall.game.ui.advanceWizardStep('landing')">Back</button></div></div>`);
    return;
  }
  const byWorld={};
  saves.forEach(function(s){(byWorld[s.worldId]=byWorld[s.worldId]||[]).push(s);});
  const wHtml=Object.entries(byWorld).map(function([wid,chars]){
    const wName=worlds[wid]?.name||chars[0]?.worldName||wid;
    const cHtml=chars.map(function(s){
      const f=D.FACTIONS[s.factionId],r=D.RACES?D.RACES[s.raceId]:null,c=D.CLASSES?D.CLASSES[s.classId]:null;
      return `<div class="setting-card" style="margin:6px 0"><b>${c?.icon||''} ${s.characterName}</b> <span style="color:var(--muted,#9aa)">${f?.icon||''} ${f?.name||s.factionId||''} · ${r?.name||s.raceId||'?'} · ${c?.name||s.classId} · Lv.${s.level||1}</span><div style="margin-top:6px"><button class="small-btn" onclick="Duskfall.game.ui._loadCharacter('${wid}','${s.characterId}')">Continue</button> <button class="small-btn" style="color:#e55" onclick="Duskfall.game.ui._deleteChar('${wid}','${s.characterId}')">Delete</button></div></div>`;
    }).join('');
    return `<div class="item-card" style="margin-bottom:12px"><h3>🌍 ${wName}</h3>${cHtml}</div>`;
  }).join('');
  this._setMenu(`<div class="menu-card"><h1>Load Game</h1><div style="max-height:420px;overflow-y:auto">${wHtml}</div><div class="menu-actions"><button class="small-btn" onclick="Duskfall.game.ui.advanceWizardStep('landing')">Back</button></div></div>`);
};

D.UI.prototype._loadCharacter=function(worldId,characterId){
  const save=this.game.systems.save?.load(worldId,characterId);
  if(!save){this.game.ui.toast('Load failed','Save not found.','bad');return;}
  this.game.loadGame(save);
  const f=D.FACTIONS[save.factionId];
  if(f){
    const c=f.primaryColor||f.color||'#6aa7ff';
    document.documentElement.style.setProperty('--faction-primary',c);
    document.documentElement.style.setProperty('--faction-glow',c+'33');
    document.body.classList.remove('theme-blood-oath','theme-iron-crown');
    if(f.themeClass) document.body.classList.add(f.themeClass);
  }
  document.getElementById('menu').classList.remove('show');
  this.syncLayoutState();
};

D.UI.prototype._deleteChar=function(worldId,characterId){
  if(!confirm('Delete this character? Cannot be undone.'))return;
  this.game.systems.save?.deleteCharacter(worldId,characterId);
  this._menuLoad();
};

// ── Pause Menu ────────────────────────────────────────────────────────────
D.UI.prototype.renderPauseMenu=function(){
  const g=this.game,binds=g.settings.keybinds;
  const audio=g.settings.audio,display=g.settings.display;
  const pct=function(v){return Math.round((v??0)*100);};
  const actions=[['inventory','Inventory'],['stats','Character Stats'],['skills','Skills'],['crafting','Crafting'],['quests','Quests'],['bank','Bank'],['map','Map'],['interact','Interact'],['attack','Attack'],['buildToggle','Build Mode'],['buildCycle','Cycle Tile'],['zoomIn','Zoom In'],['zoomOut','Zoom Out'],['cameraToggle','Camera'],['cameraOverhead','Overhead'],['rotateLeft','Rotate Left'],['rotateRight','Rotate Right'],['save','Save'],['pause','Pause']];
  document.getElementById('menu').innerHTML=`<div class="menu-card"><h1>Paused</h1><div class="menu-actions"><button class="big-btn" onclick="Duskfall.game.ui.toggleMenu()">Resume</button><button class="big-btn secondary" onclick="Duskfall.game.systems.save.save()">Save Game</button><button class="big-btn secondary" onclick="Duskfall.game.ui._quitToMenu()" style="border-color:rgba(255,92,122,.45)!important;color:#ff5c7a">Quit to Menu</button><button class="big-btn secondary" onclick="Duskfall.game.camera.toggleMode();Duskfall.game.ui.renderMenu()">Camera: ${g.camera.modeLabel()}</button><button class="big-btn secondary" onclick="Duskfall.game.camera.setOverhead();Duskfall.game.ui.renderMenu()">Overhead</button><button class="big-btn secondary" onclick="Duskfall.game.settings.hungerEnabled=!Duskfall.game.settings.hungerEnabled;Duskfall.game.ui.renderMenu()">Hunger: ${g.settings.hungerEnabled?'On':'Off'}</button><button class="big-btn secondary" onclick="Duskfall.game.systems.build.toggle();Duskfall.game.ui.renderMenu()">Build Mode: ${g.buildMode?'On':'Off'}</button></div><div class="setting-grid"><div class="setting-card"><h3>Audio</h3><label>Master ${pct(audio.master)}% <input type="range" min="0" max="1" step="0.01" value="${audio.master}" onchange="Duskfall.game.settings.audio.master=Number(this.value);Duskfall.game.systems.audio.applyVolumes();Duskfall.game.ui.renderMenu()"></label><br><label>Music ${pct(audio.music)}% <input type="range" min="0" max="1" step="0.01" value="${audio.music}" onchange="Duskfall.game.settings.audio.music=Number(this.value);Duskfall.game.systems.audio.applyVolumes();Duskfall.game.ui.renderMenu()"></label><br><label>SFX ${pct(audio.sfx)}% <input type="range" min="0" max="1" step="0.01" value="${audio.sfx}" onchange="Duskfall.game.settings.audio.sfx=Number(this.value);Duskfall.game.systems.audio.applyVolumes();Duskfall.game.ui.renderMenu()"></label><br><button class="small-btn" onclick="Duskfall.game.systems.audio.setEnabled(!Duskfall.game.settings.audio.enabled);Duskfall.game.ui.renderMenu()">Audio: ${audio.enabled?'On':'Off'}</button></div><div class="setting-card"><h3>Display</h3><button class="small-btn" onclick="Duskfall.game.settings.display.uiScale=Duskfall.game.settings.display.uiScale==='normal'?'large':Duskfall.game.settings.display.uiScale==='large'?'small':'normal';Duskfall.game.ui.applyDisplaySettings();Duskfall.game.ui.renderMenu()">UI Scale: ${display.uiScale}</button> <button class="small-btn" onclick="Duskfall.game.settings.display.floatingText=!Duskfall.game.settings.display.floatingText;Duskfall.game.ui.renderMenu()">Float Text: ${display.floatingText?'On':'Off'}</button> <button class="small-btn" onclick="Duskfall.game.settings.display.screenShake=!Duskfall.game.settings.display.screenShake;Duskfall.game.ui.renderMenu()">Screen Shake: ${display.screenShake?'On':'Off'}</button></div><div class="setting-card"><h3>Camera</h3><button class="small-btn" onclick="Duskfall.game.camera.setZoom(.12);Duskfall.game.ui.renderMenu()">Zoom In</button> <button class="small-btn" onclick="Duskfall.game.camera.setZoom(-.12);Duskfall.game.ui.renderMenu()">Zoom Out</button> <button class="small-btn" onclick="Duskfall.game.camera.rotate(-Math.PI/12);Duskfall.game.ui.renderMenu()">Rotate Left</button> <button class="small-btn" onclick="Duskfall.game.camera.rotate(Math.PI/12);Duskfall.game.ui.renderMenu()">Rotate Right</button></div>${actions.map(function([a,label]){return `<div class="setting-card"><h3>${label}</h3><button class="small-btn" onclick="Duskfall.game.input.startRebind('${a}')"><b>${D.displayKey(binds[a])}</b></button></div>`;}).join('')}</div></div>`;
};

// ── Quit to Menu ──────────────────────────────────────────────────────────
D.UI.prototype._quitToMenu=function(){
  const g=this.game;
  if(g.state==='play'&&g.player&&!g.player.dead){
    g.systems.save.autosave();
    g.ui.toast('Progress Saved','Returning to main menu...','good');
  }
  g.state='menu';g.paused=true;g.world=null;g.player=null;
  g.entities={resources:[],enemies:[],npcs:[],portals:[],projectiles:[],drops:[],effects:[]};
  g.creationState={step:'main',worldName:'New Realm',charName:'Survivor',faction:null,race:'human',cls:null};
  g.creationWizardState={step:'landing',worldName:'New Realm',charName:'Survivor',factionId:null,raceId:null,classId:null};
  document.body.classList.remove('theme-blood-oath','theme-iron-crown');
  document.documentElement.style.removeProperty('--faction-primary');
  document.documentElement.style.removeProperty('--faction-glow');
  this.showMenu();
};

})();

/* ================================================================
   UNKSCAPE HUD SPEC v1 — hud_spec.js
   Wires the spec HUD overlay to window.UnkScape.
   No frameworks, no emoji, no scroll, no canvas resize on toggle.
   Namespace: window.UnkScape (US)
   ================================================================ */
((US) => {
'use strict';

/* ── Constants ── */
const INV_SLOT_COUNT    = 24;
const ACTION_SLOT_COUNT = 6;
const LOG_MAX_LINES     = 60;

/* ── Skill color palette ── */
const SKILL_COLORS = {
  combat:'#e74c3c',woodcutting:'#2ecc71',mining:'#95a5a6',
  fishing:'#3498db',herbalism:'#27ae60',hunting:'#e67e22',
  farming:'#f1c40f',smithing:'#e59866',cooking:'#ffcf6e',
  alchemy:'#8e44ad',crafting:'#6aa7ff',survival:'#ff9b5c',
  building_claim_crafting:'#cd6155',trading_merchanting:'#f7dc6f',
  extraction:'#1abc9c'
};

const EQUIP_SLOTS = ['weapon','shield','helmet','chest','legs','boots','gloves','cape','ring','amulet'];
const EQUIP_LABELS = {weapon:'WPN',shield:'SHD',helmet:'HLM',chest:'CST',legs:'LGS',boots:'BTS',gloves:'GLV',cape:'CPE',ring:'RNG',amulet:'AMU'};

/* ── State ── */
let _invTab  = 'inv';
let _sysTab  = 'all';
let _logLines = [];
let _radarCtx = null;
let _radarInterval  = null;
let _updateInterval = null;
let _built = false;
let _hookTimer = null;

/* ── HTML builder helpers ── */
function _invSlotsHTML() {
  var h=''; for(var i=0;i<INV_SLOT_COUNT;i++) h+='<div class="hi-slot empty" data-inv-slot="'+i+'"><span class="hi-ico"></span></div>'; return h;
}
function _skillCellsHTML() {
  var D=window.UnkScape;
  var skills=(D&&D.SKILLS)?Object.keys(D.SKILLS):['combat','woodcutting','mining','fishing','herbalism','hunting','farming','smithing','cooking','alchemy','crafting','survival','building_claim_crafting','trading_merchanting','extraction'];
  return skills.map(function(key){
    var def=(D&&D.SKILLS&&D.SKILLS[key])||{};
    var name=def.name||key;
    var col=SKILL_COLORS[key]||'#94a3b8';
    return '<div class="hi-skill-cell" data-skill-key="'+key+'">'
      +'<div class="hi-sk-name">'+name+'</div>'
      +'<div class="hi-sk-lv" style="color:'+col+'">Lv.01</div>'
      +'<div class="hi-sk-bar"><div class="hi-sk-fill" style="width:0%;background:'+col+'"></div></div>'
      +'</div>';
  }).join('');
}
function _equipRowsHTML() {
  return EQUIP_SLOTS.map(function(s){
    return '<div class="hi-eq-row"><span class="hi-eq-slot">'+(EQUIP_LABELS[s]||s.slice(0,3).toUpperCase())+'</span>'
      +'<span class="hi-eq-val" data-eq-slot="'+s+'">—</span></div>';
  }).join('');
}
function _actionSlotsHTML() {
  var h=''; for(var i=0;i<ACTION_SLOT_COUNT;i++) h+='<div class="ha-slot empty" data-action-slot="'+i+'"><span class="ha-num">'+(i+1)+'</span><span class="ha-ico"></span></div>'; return h;
}

/* ── Main HTML builder ── */
function _buildHTML() {
  return '<div id="hud-col-left">'
    +'<div id="hud-vitals" class="h-frame"><div class="h-inner" style="padding:10px;">'
    +'<div class="hv-name" id="hv-name">UNKSCAPE</div>'
    +'<div class="hv-race" id="hv-race">Human · Oathstead</div>'
    +'<div class="hv-bars">'
    +'<div class="hv-bar-row"><span class="hv-bar-label">HP</span><div class="hv-bar-track"><div class="hv-bar-fill hp" id="hv-hp" style="width:78%"></div></div><span class="hv-bar-val" id="hv-hp-val">78%</span></div>'
    +'<div class="hv-bar-row"><span class="hv-bar-label">Stam</span><div class="hv-bar-track"><div class="hv-bar-fill stam" id="hv-stam" style="width:54%"></div></div><span class="hv-bar-val" id="hv-stam-val">54%</span></div>'
    +'<div class="hv-bar-row"><span class="hv-bar-label">Hung</span><div class="hv-bar-track"><div class="hv-bar-fill hung" id="hv-hung" style="width:80%"></div></div><span class="hv-bar-val" id="hv-hung-val">80%</span></div>'
    +'</div></div></div>'

    +'<div id="hud-inv" class="h-frame"><div class="h-inner">'
    +'<div class="h-header"><span class="h-gem h-gem-fire"></span>INVENTORY<span class="h-gem h-gem-ice" style="margin-left:auto;"></span></div>'
    +'<div class="hi-tabs">'
    +'<button class="hi-tab active" data-tab="inv" onclick="UnkScape.HUDSpec._switchInvTab('inv')">Inv</button>'
    +'<button class="hi-tab" data-tab="skills" onclick="UnkScape.HUDSpec._switchInvTab('skills')">Skills</button>'
    +'<button class="hi-tab" data-tab="equip" onclick="UnkScape.HUDSpec._switchInvTab('equip')">Equip</button>'
    +'</div>'
    +'<div class="hi-content">'
    +'<div class="hi-pane active" id="hi-pane-inv"><div class="hi-slot-grid" id="hi-inv-grid">'+_invSlotsHTML()+'</div></div>'
    +'<div class="hi-pane" id="hi-pane-skills"><div class="hi-skills-grid" id="hi-skills-grid">'+_skillCellsHTML()+'</div></div>'
    +'<div class="hi-pane" id="hi-pane-equip"><div class="hi-equip-list" id="hi-equip-list">'+_equipRowsHTML()+'</div></div>'
    +'</div></div></div>'
    +'</div>'

    +'<div id="hud-col-center">'
    +'<div id="hud-banner" class="h-frame"><div class="hb-inner">'
    +'<div class="hb-gem h-gem h-gem-fire"></div>'
    +'<div><div class="hb-title">UNKSCAPE</div><div class="hb-sub" id="hb-sub">UNKSCAPE Sandbox MMORPG</div></div>'
    +'<div class="hb-gem h-gem h-gem-ice"></div>'
    +'</div></div>'
    +'<div id="hud-world-gap"></div>'
    +'<div id="hud-combat-strip">'
    +'<div class="hcs-chip" id="hcs-atk">ATK: Tap Attack</div>'
    +'<div class="hcs-meter-wrap"><div class="hcs-meter-fill" id="hcs-meter"></div></div>'
    +'<div class="hcs-chip def" id="hcs-def">DEF: Guard</div>'
    +'<div class="hcs-chip" id="hcs-build">Build: Off</div>'
    +'</div>'
    +'<div id="hud-actionbar" class="h-frame"><div class="ha-inner" id="ha-slots">'+_actionSlotsHTML()+'</div></div>'
    +'</div>'

    +'<div id="hud-col-right">'
    +'<div id="hud-radar" class="h-frame"><div class="h-inner" style="align-items:center;padding:8px 4px;">'
    +'<div class="h-header" style="width:100%;justify-content:space-between;"><span class="hr-n">N</span><span style="font-size:10px;letter-spacing:0.12em;">RADAR</span></div>'
    +'<div class="hr-canvas-wrap"><canvas id="hud-radar-canvas" width="140" height="140"></canvas></div>'
    +'</div></div>'
    +'<div id="hud-sysread" class="h-frame"><div class="h-inner">'
    +'<div class="h-header">SYSTEM READOUT</div>'
    +'<div class="hsr-tabs">'
    +'<button class="hsr-tab active" data-tab="all" onclick="UnkScape.HUDSpec._switchSysTab('all')">All</button>'
    +'<button class="hsr-tab" data-tab="game" onclick="UnkScape.HUDSpec._switchSysTab('game')">Game</button>'
    +'<button class="hsr-tab" data-tab="trade" onclick="UnkScape.HUDSpec._switchSysTab('trade')">Trade</button>'
    +'</div>'
    +'<div class="hsr-log" id="hsr-log"></div>'
    +'<div class="hsr-input-row"><input class="hsr-input" id="hsr-input" type="text" placeholder="Say..." autocomplete="off"/><button class="hsr-send" id="hsr-send">Send</button></div>'
    +'</div></div>'
    +'</div>';
}

/* ── Public namespace ── */
US.HUDSpec = {
  init: function() {
    if (_built) return;
    _built = true;
    var root = document.createElement('div');
    root.id = 'unk-hud';
    root.setAttribute('data-hand','left');
    root.innerHTML = _buildHTML();
    document.body.appendChild(root);
    _wireActionBar();
    _wireSysInput();
    _radarCtx = document.getElementById('hud-radar-canvas') ? document.getElementById('hud-radar-canvas').getContext('2d') : null;
    this.refresh();
    _updateInterval = setInterval(function(){ window.UnkScape.HUDSpec.refresh(); }, 1000);
    _radarInterval  = setInterval(function(){ _drawRadar(); }, 250);
    _hookGameLog();
    this.log('System','system','Welcome to Hearthvale Fields.');
    console.log('[HUDSpec] v1 mounted.');
  },
  setVisible: function(on) {
    var hud = document.getElementById('unk-hud');
    if (!hud) return;
    hud.style.opacity = on ? '1' : '0';
    hud.style.pointerEvents = on ? '' : 'none';
  },
  log: function(sender, senderClass, msg) {
    _logLines.push({ sender: sender, senderClass: senderClass||'system', msg: msg });
    if (_logLines.length > LOG_MAX_LINES) _logLines.shift();
    _renderLog();
  },
  refresh: function() {
    _updateVitals();
    _updateActionBar();
    if (_invTab === 'inv')    _updateInvSlots();
    if (_invTab === 'skills') _updateSkillsPane();
    if (_invTab === 'equip')  _updateEquipPane();
  },
  _switchInvTab: function(tab) {
    _invTab = tab;
    ['inv','skills','equip'].forEach(function(t){
      var p = document.getElementById('hi-pane-'+t);
      if (p) p.classList.toggle('active', t===tab);
    });
    document.querySelectorAll('.hi-tab').forEach(function(b){ b.classList.toggle('active', b.dataset.tab===tab); });
    if (tab==='inv')    _updateInvSlots();
    if (tab==='skills') _updateSkillsPane();
    if (tab==='equip')  _updateEquipPane();
  },
  _switchSysTab: function(tab) {
    _sysTab = tab;
    document.querySelectorAll('.hsr-tab').forEach(function(b){ b.classList.toggle('active', b.dataset.tab===tab); });
    _renderLog();
  }
};

function _wireActionBar() {
  var el = document.getElementById('ha-slots');
  if (!el) return;
  el.addEventListener('click', function(e) {
    var slot = e.target.closest('[data-action-slot]');
    if (!slot) return;
    var idx = parseInt(slot.dataset.actionSlot, 10);
    var g = _game();
    if (g && g.hotbar) { g.hotbar.selected = idx; _updateActionBar(); }
  });
}
function _wireSysInput() {
  var btn = document.getElementById('hsr-send');
  var inp = document.getElementById('hsr-input');
  if (!btn || !inp) return;
  function send() {
    var v = inp.value.trim();
    if (!v) return;
    US.HUDSpec.log('You','player',v);
    inp.value = '';
  }
  btn.addEventListener('click', send);
  inp.addEventListener('keydown', function(e){ if(e.key==='Enter') send(); });
}

function _game() {
  var D = window.UnkScape;
  return (D && D.game && D.game.player) ? D.game : null;
}

function _updateVitals() {
  var g = _game();
  var nameEl = document.getElementById('hv-name');
  var raceEl = document.getElementById('hv-race');
  if (!g) {
    if (nameEl) nameEl.textContent = 'UNKSCAPE';
    if (raceEl) raceEl.textContent = 'No character loaded';
    return;
  }
  var p = g.player, D = window.UnkScape;
  if (nameEl) nameEl.textContent = (p.characterName || p.name || 'Hero').toUpperCase();
  var faction = p.factionId==='blood_oath' ? 'Blood Oath' : p.factionId==='highborn' ? 'Highborn' : (p.factionName||'Wanderer');
  if (raceEl) raceEl.textContent = (p.raceId||'Human') + ' · ' + faction;
  var hpPct = Math.round((p.hp / Math.max(1, p.maxHp)) * 100);
  _setBar('hv-hp','hv-hp-val', hpPct, Math.ceil(p.hp)+'/'+p.maxHp);
  var combatLvl = (D&&D.levelForXp) ? D.levelForXp(p.skills&&p.skills.combat ? p.skills.combat.xp||0 : 0) : 1;
  _setBar('hv-stam','hv-stam-val', Math.min(100,combatLvl), 'Lv '+combatLvl);
  var hungPct = g.settings&&g.settings.hungerEnabled ? Math.round(((p.hunger||80)/100)*100) : 100;
  _setBar('hv-hung','hv-hung-val', hungPct, hungPct+'%');
  var sub = document.getElementById('hb-sub');
  if (sub) {
    var dn = g.systems && g.systems.daynight;
    sub.textContent = dn ? dn.label() + ' · Day ' + (Math.floor(g.time / dn.dayLength)+1) : 'UNKSCAPE Sandbox MMORPG';
  }
  _updateCombatStrip(g, p);
}
function _setBar(fillId, valId, pct, label) {
  var fill = document.getElementById(fillId);
  var val  = document.getElementById(valId);
  if (fill) fill.style.width = Math.max(0, Math.min(100, pct)) + '%';
  if (val)  val.textContent  = label;
}
function _updateCombatStrip(g, p) {
  var atk   = document.getElementById('hcs-atk');
  var def   = document.getElementById('hcs-def');
  var build = document.getElementById('hcs-build');
  var meter = document.getElementById('hcs-meter');
  if (atk) { atk.textContent = 'ATK: '+(g.buildMode?'Place':p.heavyCharging?'Heavy':'Tap Attack'); atk.classList.toggle('active',!!p.heavyCharging); }
  if (def) { def.textContent = 'DEF: '+(g.buildMode?'Remove':p.blocking?'Guarding':'Guard'); }
  if (build) { build.textContent = 'Build: '+(g.buildMode?'On':'Off'); build.classList.toggle('active',!!g.buildMode); }
  if (meter) {
    var D = window.UnkScape;
    var charge = D&&D.clamp ? D.clamp((p.heavyCharge||0)/Math.max(0.01,(g.systems.combat&&g.systems.combat.maxCharge||1.25)-(g.systems.combat&&g.systems.combat.heavyThreshold||0.72)),0,1)*100 : 0;
    meter.style.width = charge + '%';
  }
}

function _updateInvSlots() {
  var g = _game();
  var grid = document.getElementById('hi-inv-grid');
  if (!grid) return;
  var slots = grid.querySelectorAll('[data-inv-slot]');
  var D = window.UnkScape;
  if (!g) { slots.forEach(function(s){ s.classList.add('empty'); var ico=s.querySelector('.hi-ico'); if(ico) ico.textContent=''; }); return; }
  var inv = g.systems && g.systems.inventory;
  var items = [];
  // gather from inventory
  if (inv && D && D.ITEMS) {
    for (var id in D.ITEMS) {
      if (id === 'coin') continue;
      var qty = inv.count(id);
      if (qty > 0) items.push({ id: id, qty: qty });
    }
  }
  slots.forEach(function(el, i) {
    var item = items[i];
    var ico = el.querySelector('.hi-ico');
    var qty = el.querySelector('.hi-qty');
    if (!item) {
      el.classList.add('empty'); if (ico) ico.textContent = ''; if (qty) qty.remove(); el.title = ''; return;
    }
    el.classList.remove('empty');
    var def = (D && D.ITEMS && D.ITEMS[item.id]) || { name: item.id, icon: '?' };
    if (ico) ico.textContent = def.icon || '?';
    el.title = def.name || item.id;
    if (item.qty > 1) {
      if (!qty) { qty = document.createElement('span'); qty.className = 'hi-qty'; el.appendChild(qty); }
      qty.textContent = 'x'+item.qty;
    } else if (qty) { qty.remove(); }
    el.classList.toggle('selected', g.hotbar && g.hotbar.selected === i);
  });
}

function _updateSkillsPane() {
  var g = _game();
  var grid = document.getElementById('hi-skills-grid');
  if (!grid) return;
  var D = window.UnkScape;
  grid.querySelectorAll('[data-skill-key]').forEach(function(cell) {
    var key = cell.dataset.skillKey;
    var sk  = g ? (g.player.skills && g.player.skills[key]) : null;
    var lvl = (D&&D.levelForXp&&sk) ? D.levelForXp(sk.xp||0) : 1;
    var xp  = sk ? sk.xp||0 : 0;
    var next = (D&&D.xpForLevel) ? D.xpForLevel(lvl+1) : 100;
    var cur  = (D&&D.xpForLevel) ? D.xpForLevel(lvl) : 0;
    var pct  = next > cur ? ((xp-cur)/(next-cur)*100) : 100;
    var lvEl = cell.querySelector('.hi-sk-lv');
    var fill = cell.querySelector('.hi-sk-fill');
    if (lvEl) lvEl.textContent = 'Lv.'+String(lvl).padStart(2,'0');
    if (fill) fill.style.width = Math.min(100,Math.max(0,pct))+'%';
  });
}

function _updateEquipPane() {
  var g = _game();
  var D = window.UnkScape;
  document.querySelectorAll('[data-eq-slot]').forEach(function(el) {
    var slot = el.dataset.eqSlot;
    var equipped = g ? (g.player.equipment && g.player.equipment[slot]) : null;
    var def = equipped && D && D.ITEMS && D.ITEMS[equipped];
    el.textContent = def ? ((def.icon||'')+' '+def.name) : '—';
  });
}

function _updateActionBar() {
  var g = _game(), D = window.UnkScape;
  var slots = document.querySelectorAll('[data-action-slot]');
  var hotbar = g && g.hotbar ? g.hotbar.slots||[] : [];
  var inv = g && g.systems ? g.systems.inventory : null;
  slots.forEach(function(el, i) {
    var id = hotbar[i];
    var ico = el.querySelector('.ha-ico');
    var def = id && D && D.ITEMS && D.ITEMS[id];
    if (!def) {
      el.classList.add('empty'); if (ico) ico.textContent = ''; el.title = '';
      var q = el.querySelector('.ha-qty'); if (q) q.remove();
      return;
    }
    el.classList.remove('empty');
    if (ico) ico.textContent = def.icon||'?';
    el.title = def.name||id;
    el.classList.toggle('sel', g && g.hotbar && g.hotbar.selected===i);
    var qty = inv ? (inv.count(id) + (Object.values(g.player.equipment||{}).includes(id)?1:0)) : 0;
    var qEl = el.querySelector('.ha-qty');
    if (qty > 1) {
      if (!qEl) { qEl = document.createElement('span'); qEl.className = 'ha-qty'; el.appendChild(qEl); }
      qEl.textContent = 'x'+qty;
    } else if (qEl) { qEl.remove(); }
  });
}

function _drawRadar() {
  var ctx = _radarCtx; if (!ctx) return;
  var W=140, H=140, cx=W/2, cy=H/2, r=68;
  ctx.clearRect(0,0,W,H);
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle='rgba(8,6,14,0.85)'; ctx.fill();
  ctx.strokeStyle='rgba(120,90,55,0.25)'; ctx.lineWidth=1;
  [r*0.33,r*0.66,r].forEach(function(rr){ ctx.beginPath(); ctx.arc(cx,cy,rr,0,Math.PI*2); ctx.stroke(); });
  ctx.beginPath(); ctx.moveTo(cx,cy-r); ctx.lineTo(cx,cy+r); ctx.moveTo(cx-r,cy); ctx.lineTo(cx+r,cy);
  ctx.strokeStyle='rgba(120,90,55,0.18)'; ctx.stroke();
  var g = _game(); if (!g || !g.world) return;
  var D = window.UnkScape, p = g.player;
  var px = p.x/D.TILE, py = p.y/D.TILE;
  var scale = r / (D.WORLD ? D.WORLD.w/10 : 120);
  ctx.fillStyle='#55cc77';
  (g.entities&&g.entities.npcs||[]).forEach(function(n){ var dx=(n.x/D.TILE-px)*scale, dy=(n.y/D.TILE-py)*scale; if(dx*dx+dy*dy>r*r) return; ctx.beginPath(); ctx.arc(cx+dx,cy+dy,3,0,Math.PI*2); ctx.fill(); });
  ctx.fillStyle='#cc4444';
  (g.entities&&g.entities.enemies||[]).slice(0,60).forEach(function(e){ var dx=(e.x/D.TILE-px)*scale, dy=(e.y/D.TILE-py)*scale; if(dx*dx+dy*dy>r*r) return; ctx.beginPath(); ctx.arc(cx+dx,cy+dy,2,0,Math.PI*2); ctx.fill(); });
  ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.fill();
  var angle = (g.camera&&g.camera.targetAngle)||0;
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle);
  ctx.strokeStyle='#d4a84b'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(4,2); ctx.lineTo(0,-1); ctx.lineTo(-4,2); ctx.closePath(); ctx.stroke();
  ctx.restore();
}

function _renderLog() {
  var el = document.getElementById('hsr-log'); if (!el) return;
  var filtered = _sysTab==='all' ? _logLines
    : _sysTab==='trade' ? _logLines.filter(function(l){ return l.senderClass==='trade'; })
    : _logLines.filter(function(l){ return l.senderClass!=='trade'; });
  el.innerHTML = filtered.map(function(line){
    return '<div class="hsr-line"><span class="hsr-line-sender '+line.senderClass+'">'+_esc(line.sender)+':</span><span class="hsr-line-msg"> '+_esc(line.msg)+'</span></div>';
  }).join('');
}

function _hookGameLog() {
  var attempts = 0;
  _hookTimer = setInterval(function() {
    attempts++;
    var g = _game();
    if (g && g.ui && g.ui.log) {
      var origLog = g.ui.log.bind(g.ui);
      g.ui.log = function(msg, cls) {
        origLog(msg, cls);
        var sc = cls==='gold'?'npc': cls==='good'?'player': 'system';
        US.HUDSpec.log('',sc,msg);
      };
      clearInterval(_hookTimer);
    }
    if (attempts > 30) clearInterval(_hookTimer);
  }, 500);
}

function _esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

})(window.UnkScape = window.UnkScape || {});

/* ── Auto-boot ── */
(function() {
  function boot() { if (window.UnkScape && window.UnkScape.HUDSpec) window.UnkScape.HUDSpec.init(); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); }
  else { boot(); }
})();

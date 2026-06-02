(function(){
'use strict';
const US = window.UnkScape = window.UnkScape || {};

// -- UNKSCAPE NodeMenu v1 --
// Rich action panel: right-click a resource node -> themed overlay at cursor
// Shows: resource name, skill icon, required level vs player level,
//        XP per swing, estimated swings to harvest, respawn timer.
// Buttons: [Gather] (F-hotkey) | [Walk To] | [Examine] | [X] close

var _el   = null;   // current panel DOM element
var _node = null;   // current resource node

// Public API
US.NodeMenu = {
  open:  open,
  close: close,
  isOpen: function(){ return !!_el; }
};

function open(node, sx, sy) {
  close();
  if (!node || !node.cfg) return;

  var g   = US.game;
  var cfg = node.cfg;
  var skill   = cfg.skill || 'woodcutting';
  var skillDef = (US.SKILLS && US.SKILLS[skill]) || {};
  var col   = skillDef.color || '#f1c40f';
  var icon  = skillDef.icon  || '🔹';
  var skillName = skillDef.name || skill.replace(/_/g,' ');

  var p     = g && g.player;
  var xp    = p && p.skills && p.skills[skill] ? (p.skills[skill].xp || 0) : 0;
  var plvl  = US.levelForXp ? US.levelForXp(xp) : 1;
  var reqLvl = cfg.level || 1;
  var canGather = plvl >= reqLvl;

  var swingXp  = cfg.swingXp || 1;
  var harvestXp = cfg.xp || 0;
  var hits     = cfg.hitsToHarvest || 1;
  var swingBase = 0.80;
  var swingDur  = Math.max(0.30, Math.min(swingBase * 1.5,
    swingBase + (cfg.tier || 1) * 0.15 - plvl * 0.025));
  var estTime  = (hits * swingDur).toFixed(1);

  var respawn  = cfg.respawn ? Math.round(cfg.respawn) + 's' : '--';
  var amount   = Array.isArray(cfg.amount)
    ? cfg.amount[0] + '-' + cfg.amount[1]
    : (cfg.amount || node.amount || 1);

  var pw = 240, ph = 300;
  var px = Math.min(sx + 12, window.innerWidth  - pw - 8);
  var py = Math.min(sy + 12, window.innerHeight - ph - 8);
  if (px < 8) px = 8;
  if (py < 8) py = 8;

  var el = document.createElement('div');
  el.id = 'unk-node-menu';
  el.style.cssText = [
    'position:fixed',
    'left:'  + px + 'px',
    'top:'   + py + 'px',
    'width:' + pw + 'px',
    'background:rgba(14,11,20,0.97)',
    'border:2px solid ' + col,
    'border-radius:8px',
    'padding:0',
    'color:#e2e8f0',
    'font-family:Courier New,monospace',
    'font-size:12px',
    'z-index:12000',
    'pointer-events:auto',
    'box-shadow:0 6px 32px rgba(0,0,0,0.85)',
    'user-select:none'
  ].join(';');

  var headerBg = 'rgba(' + hexToRgb(col) + ',0.18)';
  var lvlColor = canGather ? '#38d978' : '#e05252';
  var lvlLabel = canGather
    ? 'Lv.' + plvl + ' OK'
    : 'Lv.' + plvl + ' / Lv.' + reqLvl + ' req';

  el.innerHTML =
    '<div style="background:' + headerBg + ';border-bottom:1px solid ' + col + ';' +
    'padding:10px 12px 8px;border-radius:6px 6px 0 0;position:relative;">' +
      '<div style="font-size:16px;font-weight:bold;color:' + col + ';letter-spacing:1px;">' +
        icon + ' ' + (cfg.name || node.type) +
      '</div>' +
      '<div style="font-size:10px;color:#94a3b8;margin-top:2px;">' +
        skillName + ' Tier ' + (cfg.tier || 1) +
      '</div>' +
      '<div style="position:absolute;top:8px;right:36px;font-size:10px;color:' + lvlColor + ';">' +
        lvlLabel +
      '</div>' +
      '<button id="unk-nm-close" style="position:absolute;top:6px;right:6px;' +
        'background:none;border:none;color:#94a3b8;font-size:14px;' +
        'cursor:pointer;line-height:1;padding:0 4px;" title="Close">x</button>' +
    '</div>' +
    '<div style="padding:10px 12px 4px;display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;">' +
      statRow('XP / swing',   '+' + swingXp, col) +
      statRow('Harvest XP',   '+' + harvestXp, col) +
      statRow('Swings',       hits + ' hit' + (hits !== 1 ? 's' : ''), '#94a3b8') +
      statRow('Est. time',    '~' + estTime + 's', '#94a3b8') +
      statRow('Yield',        'x' + amount, '#94a3b8') +
      statRow('Respawn',      respawn, '#94a3b8') +
    '</div>' +
    '<div style="padding:8px 12px 12px;display:flex;gap:6px;">' +
      '<button id="unk-nm-gather" style="flex:1;' +
        'background:' + (canGather ? col : '#4a4060') + ';' +
        'border:none;color:#fff;font-family:Courier New,monospace;' +
        'font-size:11px;padding:7px 4px;border-radius:4px;' +
        'cursor:' + (canGather ? 'pointer' : 'not-allowed') + ';' +
        'font-weight:bold;" title="Gather [F]">' +
        (cfg.action || 'Gather') + ' [F]' +
      '</button>' +
      '<button id="unk-nm-walk" style="' +
        'background:rgba(71,56,90,0.7);border:none;color:#94a3b8;' +
        'font-family:Courier New,monospace;font-size:11px;padding:7px 8px;' +
        'border-radius:4px;cursor:pointer;" title="Walk to resource">' +
        'Walk' +
      '</button>' +
      '<button id="unk-nm-examine" style="' +
        'background:rgba(71,56,90,0.7);border:none;color:#94a3b8;' +
        'font-family:Courier New,monospace;font-size:11px;padding:7px 8px;' +
        'border-radius:4px;cursor:pointer;" title="Examine">' +
        'Info' +
      '</button>' +
    '</div>';

  document.body.appendChild(el);
  _el   = el;
  _node = node;

  el.querySelector('#unk-nm-close').addEventListener('click', function(e) {
    e.stopPropagation(); close();
  });

  el.querySelector('#unk-nm-gather').addEventListener('click', function(e) {
    e.stopPropagation();
    if (!canGather) {
      if (g && g.ui) g.ui.toast('Level too low',
        (cfg.name || 'Resource') + ' requires ' + skillName + ' Lv.' + reqLvl + '.', 'bad');
      close(); return;
    }
    close();
    var gs = g && g.systems && g.systems.gathering;
    if (gs && typeof gs._startGathering === 'function') gs._startGathering(node);
  });

  el.querySelector('#unk-nm-walk').addEventListener('click', function(e) {
    e.stopPropagation();
    close();
    var player = g && g.player;
    if (player) {
      player._clickTarget = { x: node.x, y: node.y, resourceId: node.uid };
      if (g.ui) g.ui.toast('Walking to ' + (cfg.name || 'resource') + '...', '', 'gold');
    }
  });

  el.querySelector('#unk-nm-examine').addEventListener('click', function(e) {
    e.stopPropagation();
    close();
    if (g && g.ui) {
      var desc = cfg.desc || ('A ' + (cfg.name || node.type) + '. Requires ' +
        skillName + ' level ' + reqLvl + '.');
      g.ui.toast(cfg.name || node.type, desc, 'gold');
      if (g.ui.log) g.ui.log('[Examine] ' + desc, 'gold');
    }
  });

  setTimeout(function() {
    document.addEventListener('mousedown', _outsideClick, { capture: true, once: false });
  }, 0);
}

function close() {
  document.removeEventListener('mousedown', _outsideClick, true);
  if (_el) { _el.remove(); _el = null; }
  _node = null;
}

function _outsideClick(e) {
  if (_el && !_el.contains(e.target)) { close(); }
}

function statRow(label, val, valCol) {
  return '<div style="font-size:10px;color:#94a3b8;">' + label + '</div>' +
         '<div style="font-size:11px;color:' + (valCol || '#e2e8f0') + ';font-weight:bold;">' +
         val + '</div>';
}

function hexToRgb(hex) {
  var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return '241,196,15';
  return parseInt(m[1],16) + ',' + parseInt(m[2],16) + ',' + parseInt(m[3],16);
}

window.addEventListener('keydown', function(e) {
  if (!_el) return;
  if (e.key === 'Escape') { close(); return; }
  if (e.key === 'f' || e.key === 'F') {
    var btn = _el && _el.querySelector('#unk-nm-gather');
    if (btn) { btn.click(); }
  }
}, false);

console.log('[UNKSCAPE] Node action panel v1 loaded -- right-click resource nodes for rich info panel.');

})();

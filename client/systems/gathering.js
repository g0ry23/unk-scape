(function(){
const US = window.UnkScape = window.UnkScape || {};

// UNKSCAPE GatheringSystem v10
// v10: add [GATHER] diagnostics to _startGathering for harvest-block debugging
// v9: tighten interaction ranges to strict arm's length
// AUTO_WALK_RANGE 200 -> 96 (stop auto-walk-to at close distance)
// INTERACT_RANGE 64 -> 48 (must be visibly adjacent)
// ABANDON_RANGE 140 -> 64 (cancel if you step back)
// NPC_PROMPT_RANGE 90 -> 48 (prompt only when right next to NPC)

var AUTO_WALK_RANGE = 96;
var INTERACT_RANGE = 48;
var ABANDON_RANGE = 64;
var NPC_PROMPT_RANGE = 48;
var SWING_BASE_TIME = 0.80;
var SWING_MIN_TIME = 0.30;

US.GatheringSystem = function(game) {
this.game = game;
this.active = null;
this.swingTimer = 0;
this.swingDuration = 0.80;
this.seeded = false;
this._pendingNode = null;
this._npcPromptEl = null;
this._lastNpcId = null;
this._menuNode = null;
this._menuEl = null;
};

US.GatheringSystem.prototype._swingDuration = function(node) {
if (!node || !node.cfg) return SWING_BASE_TIME;
var p = this.game.player;
var sk = node.cfg.skill;
var lvl = US.levelForXp(p.skills[sk] ? p.skills[sk].xp || 0 : 0);
var raw = SWING_BASE_TIME + (node.cfg.tier || 1) * 0.15 - lvl * 0.025;
return Math.max(SWING_MIN_TIME, Math.min(SWING_BASE_TIME * 1.5, raw));
};

US.GatheringSystem.prototype._skillName = function(skillKey) {
return (US.SKILLS[skillKey] && US.SKILLS[skillKey].name) || skillKey;
};

US.GatheringSystem.prototype._actionLabel = function(node) {
if (!node) return 'Gather';
if (node.cfg && node.cfg.action) return node.cfg.action + ': ' + node.cfg.name;
return 'Gather: ' + (node.cfg ? node.cfg.name : 'Resource');
};

US.GatheringSystem.prototype._checkLevel = function(node) {
if (!node || !node.cfg) return true;
var p = this.game.player;
var sk = node.cfg.skill;
var lvl = US.levelForXp(p.skills[sk] ? p.skills[sk].xp || 0 : 0);
if (lvl < node.cfg.level) {
this.game.ui.toast('Level too low', node.cfg.name + ' requires ' + this._skillName(sk) + ' level ' + node.cfg.level + '.', 'bad');
return false;
}
return true;
};

US.GatheringSystem.prototype._checkTool = function(node) {
var req = (node.cfg && node.cfg.toolReq) || null;
if (!req) return true;
var UP = window.UnkScape && window.UnkScape.Player;
if (!UP || !UP.canUseTool) return true;
var p = this.game.player;
var ok = UP.canUseTool(req, p.skills);
if (!ok) {
var tier = UP.TOOL_TIERS[req] || {};
var skillName = this._skillName(tier.skill);
this.game.ui.toast('Tool too weak', 'You need a ' + req.replace(/_/g, ' ') + ' or better (' + skillName + ' Lv.' + tier.level + ').', 'bad');
}
return ok;
};

US.GatheringSystem.prototype._showProgress = function() {
var hint = document.getElementById('action-hint');
if (!hint || !this.active) { this._clearProgress(); return; }
var node = this.active;
var cfg = node.cfg || {};
var hits = cfg.hitsToHarvest || 1;
var pct = Math.min(1, node.hitProgress / hits);
var swingPct = Math.min(1, this.swingTimer / this.swingDuration);
var barW = Math.round(pct * 160);
var swingW = Math.round(swingPct * 160);
var label = this._actionLabel(node);
var skillCol = (cfg.skill && US.SKILLS[cfg.skill]) ? US.SKILLS[cfg.skill].color : '#f1c40f';
hint.style.cssText = [
'position:fixed','bottom:180px','left:50%','transform:translateX(-50%)',
'background:rgba(14,11,20,0.92)','border:2px solid #47385a',
'border-radius:6px','padding:8px 16px','color:' + skillCol,
'font-family:Courier New,monospace','font-size:13px',
'z-index:9999','min-width:220px','text-align:center','pointer-events:none'
].join(';');
hint.innerHTML =
'<div style="margin-bottom:4px;">' + label + '</div>' +
'<div style="background:#120e1a;border-radius:3px;height:6px;width:160px;margin:0 auto 3px;">' +
'<div style="background:' + skillCol + ';width:' + barW + 'px;height:6px;border-radius:3px;opacity:0.7;"></div>' +
'</div>' +
'<div style="background:#120e1a;border-radius:3px;height:4px;width:160px;margin:0 auto;">' +
'<div style="background:#ffffff;width:' + swingW + 'px;height:4px;border-radius:3px;opacity:0.5;"></div>' +
'</div>';
};

US.GatheringSystem.prototype._clearProgress = function() {
var hint = document.getElementById('action-hint');
if (hint) { hint.style.cssText = ''; hint.innerHTML = ''; }
};

US.GatheringSystem.prototype._updateNpcPrompt = function() {
var g = this.game, p = g.player;
if (!p || !g.entities || !g.entities.npcs) return;
var near = null, bestDist = NPC_PROMPT_RANGE;
for (var i = 0; i < g.entities.npcs.length; i++) {
var npc = g.entities.npcs[i];
var d = Math.hypot(npc.x - p.x, npc.y - p.y);
if (d < bestDist) { bestDist = d; near = npc; }
}
var hint = document.getElementById('action-hint');
if (near && !this.active && !this._menuNode) {
if (near.uid !== this._lastNpcId) {
this._lastNpcId = near.uid;
if (hint) {
hint.style.cssText = [
'position:fixed','bottom:180px','left:50%','transform:translateX(-50%)',
'background:rgba(14,11,20,0.92)','border:2px solid #f1c40f',
'border-radius:6px','padding:8px 16px','color:#f1c40f',
'font-family:Courier New,monospace','font-size:13px',
'z-index:9999','min-width:180px','text-align:center','pointer-events:none'
].join(';');
var npcName = near.name || (near.cfg && near.cfg.name) || 'NPC';
hint.innerHTML = '<div>[F] Talk to ' + npcName + '</div>';
}
}
} else if (!near && this._lastNpcId) {
this._lastNpcId = null;
if (!this.active && !this._menuNode) this._clearProgress();
}
};

US.GatheringSystem.prototype._openActionMenu = function(node) {
if (this._menuEl) this._closeActionMenu();
var self = this;
var g = this.game;
var p = g.player;
var cfg = node.cfg || {};
var action = cfg.action || 'Gather';
var resName = cfg.name || 'Resource';
var skill = cfg.skill || 'woodcutting';
var skillCol = (US.SKILLS[skill]) ? US.SKILLS[skill].color : '#f1c40f';
var icon = (US.SKILLS[skill]) ? US.SKILLS[skill].icon : '🔹';
var el = document.createElement('div');
el.id = 'unkscape-action-menu';
el.style.cssText = [
'position:fixed','bottom:200px','left:50%','transform:translateX(-50%)',
'background:rgba(14,11,20,0.97)','border:2px solid ' + skillCol,
'border-radius:8px','padding:10px 16px','color:#e2e8f0',
'font-family:Courier New,monospace','font-size:13px',
'z-index:10000','min-width:200px','text-align:center',
'pointer-events:auto','box-shadow:0 4px 24px rgba(0,0,0,0.8)'
].join(';');
var lvl = US.levelForXp(p.skills[skill] ? p.skills[skill].xp || 0 : 0);
var reqLvl = cfg.level || 1;
var canAct = lvl >= reqLvl;
el.innerHTML =
'<div style="color:' + skillCol + '; font-weight:bold; margin-bottom:8px; font-size:14px;">' +
icon + ' ' + resName + '</div>' +
'<div style="color:#94a3b8; font-size:11px; margin-bottom:10px;">' + skill.replace(/_/g,' ') + ' Lv.' + reqLvl + ' required — you: Lv.' + lvl + '</div>' +
'<button id="unkaction-confirm" style="' +
'background:' + (canAct ? skillCol : '#4a4060') + ';' +
'border:none; color:#fff; font-family:Courier New,monospace;' +
'font-size:12px; padding:8px 20px; border-radius:4px;' +
'cursor:' + (canAct ? 'pointer' : 'not-allowed') + ';' +
'margin-right:8px; font-weight:bold;' +
">" + action + " [F]</button>" +
'<button id="unkaction-cancel" style="' +
'background:rgba(71,56,90,0.7); border:none; color:#94a3b8;' +
'font-family:Courier New,monospace; font-size:12px; padding:8px 14px;' +
'border-radius:4px; cursor:pointer;' +
'">' + 'Cancel [ESC]</button>';
document.body.appendChild(el);
this._menuEl = el;
this._menuNode = node;
var confirmBtn = el.querySelector('#unkaction-confirm');
if (confirmBtn) {
confirmBtn.addEventListener('click', function(e) {
e.stopPropagation();
if (!canAct) {
self.game.ui.toast('Level too low', resName + ' requires ' + skill.replace(/_/g,' ') + ' Lv.' + reqLvl + '.', 'bad');
self._closeActionMenu();
return;
}
self._closeActionMenu();
self._startGathering(node);
});
}
var cancelBtn = el.querySelector('#unkaction-cancel');
if (cancelBtn) {
cancelBtn.addEventListener('click', function(e) {
e.stopPropagation();
self._closeActionMenu();
});
}
var hint = document.getElementById('action-hint');
if (hint && !this.active) {
hint.style.cssText = [
'position:fixed','bottom:166px','left:50%','transform:translateX(-50%)',
'background:rgba(14,11,20,0.7)','border:1px solid #47385a',
'border-radius:4px','padding:4px 12px','color:#94a3b8',
'font-family:Courier New,monospace','font-size:11px',
'z-index:9998','min-width:160px','text-align:center','pointer-events:none'
].join(';');
hint.innerHTML = '[F] ' + action + ' • [ESC] Close';
}
};

US.GatheringSystem.prototype._closeActionMenu = function() {
if (this._menuEl) { this._menuEl.remove(); this._menuEl = null; }
this._menuNode = null;
if (!this.active) this._clearProgress();
};

US.GatheringSystem.prototype.tryInteractF = function() {
if (this._menuEl && this._menuNode) {
var node = this._menuNode;
this._closeActionMenu();
this._startGathering(node);
return true;
}
var g = this.game, p = g.player;
if (!p) return false;
var resources = g.entities && g.entities.resources;
if (!resources) return false;
var best = null, bestDist = INTERACT_RANGE;
for (var i = 0; i < resources.length; i++) {
var r = resources[i];
if (!r || r.amount <= 0 || r.cooldown > 0) continue;
var d = Math.hypot(r.x - p.x, r.y - p.y);
if (d < bestDist) { bestDist = d; best = r; }
}
if (best) { this._openActionMenu(best); return true; }
return false;
};

US.GatheringSystem.prototype.tryStartAt = function(wx, wy) {
this.ensureNodes();
var g = this.game, p = g.player;
if (!p) return false;
var node = this._findNear(wx, wy, INTERACT_RANGE + 120);
if (!node) return false;
var dist = Math.hypot(node.x - p.x, node.y - p.y);
if (dist > INTERACT_RANGE) {
this._pendingNode = node;
p._clickTarget = { x: node.x, y: node.y, resourceId: node.uid };
var rname = node.cfg ? node.cfg.name : 'resource';
g.ui.toast('Walking to ' + rname + '...', '', 'gold');
return true;
}
this._openActionMenu(node);
return true;
};

US.GatheringSystem.prototype.ensureNodes = function() {
var g = this.game;
if (this.seeded || !g.world || !g.player) return;
this.seeded = true;
var resources = g.entities && g.entities.resources;
if (!resources) return;
var px = g.player.x, py = g.player.y;
var nearbyTree = resources.find(function(r) {
return r && r.type === 'tree' && Math.hypot(r.x - px, r.y - py) < 500;
});
if (nearbyTree) return;
var STARTER = [
{ type:'tree', angle:0.4, dist:90 },
{ type:'tree', angle:2.0, dist:110 },
{ type:'rock', angle:3.3, dist:95 },
{ type:'berry', angle:4.8, dist:80 },
{ type:'copper', angle:1.2, dist:130 },
{ type:'herb', angle:5.5, dist:75 }
];
var idx = 0;
STARTER.forEach(function(s) {
var xp = US.clamp(px + Math.cos(s.angle) * s.dist, US.TILE * 3, US.WORLD.pxW - US.TILE * 3);
var yp = US.clamp(py + Math.sin(s.angle) * s.dist, US.TILE * 3, US.WORLD.pxH - US.TILE * 3);
var node = US.createResource(s.type, xp, yp, 'starter_' + s.type + '_' + idx);
if (node) resources.push(node);
idx++;
});
g.ui && g.ui.log('Resources placed nearby. Walk close and press [F] to interact!', 'gold');
var E = window.UnkScape3D;
if (E && E.RebuildProps) E.RebuildProps(px, py);
};

US.GatheringSystem.prototype._findNear = function(wx, wy, radius) {
var resources = this.game.entities && this.game.entities.resources;
if (!resources) return null;
var best = null, bestDist = radius || INTERACT_RANGE + 60;
for (var i = 0; i < resources.length; i++) {
var r = resources[i];
if (!r || r.amount <= 0 || r.cooldown > 0) continue;
var d = Math.hypot(r.x - wx, r.y - wy);
if (d < bestDist) { bestDist = d; best = r; }
}
return best;
};

US.GatheringSystem.prototype._startGathering = function(node) {
var g = this.game, p = g.player;
if (!node || node.amount <= 0 || node.cooldown > 0) {
  console.log('[GATHER] blocked: node empty/cooldown', node && {amount:node.amount, cooldown:node.cooldown});
  return false;
}
if (!this._checkLevel(node)) { console.log('[GATHER] blocked: level gate', node.cfg && node.cfg.skill, node.cfg && node.cfg.level); return false; }
if (!this._checkTool(node)) { console.log('[GATHER] blocked: tool gate', node.cfg && node.cfg.toolReq); return false; }
console.log('[GATHER] started OK:', node.cfg && node.cfg.name);
this.active = node;
this.swingDuration = this._swingDuration(node);
this.swingTimer = 0;
this._pendingNode = null;
if (p) { p.gathering = true; p.blocking = false; p.heavyCharging = false; }
if (p && p._clickTarget && p._clickTarget.resourceId === node.uid) p._clickTarget = null;
g.ui && g.ui.log('Started ' + this._actionLabel(node).toLowerCase() + '.', 'gold');
return true;
};

US.GatheringSystem.prototype.cancel = function() {
var p = this.game.player;
if (p) p.gathering = false;
this.active = null;
this.swingTimer = 0;
this._pendingNode = null;
this._closeActionMenu();
this._clearProgress();
};

// v7 KEY CHANGE: audio.play fires on EVERY swing, before hitProgress < hits guard
US.GatheringSystem.prototype._resolveSwing = function() {
var g = this.game;
var p = g.player;
var node = this.active;
var cfg = node.cfg;
var sk = cfg.skill;
var hits = cfg.hitsToHarvest || 1;

var swingXp = cfg.swingXp || 1;
if (g.systems.skills) g.systems.skills.addXp(sk, swingXp);

var hitCol = cfg.hitColor || '#f1c40f';
var verb = cfg.action || 'Hit';
g.ui.floatText(node.x, node.y - 30, verb + '!', hitCol);

// v7: audio fires every swing (before early return)
if (g.systems.audio) g.systems.audio.play(sk === 'mining' ? 'mine' : 'chop');

node.hitProgress = (node.hitProgress || 0) + 1;

if (node.hitProgress < hits) {
this.swingTimer = 0;
return;
}

node.hitProgress = 0;
var lvl = US.levelForXp(p.skills[sk] ? p.skills[sk].xp || 0 : 0);
var tool = p.stats ? (p.stats()[sk] || 0) : 0;
var ok = US.rollSkillSuccess(lvl + tool, cfg.difficulty);

if (!ok) {
g.ui.floatText(node.x, node.y - 30, 'Failed', '#9aa8c7');
if (g.systems.skills) g.systems.skills.addXp(sk, Math.max(1, Math.floor(cfg.xp * 0.12)));
this.swingTimer = 0;
return;
}

var nodeTier = cfg.tier || 1;
var luckyChance = Math.min(0.05 + lvl * 0.005, 0.30);
var isLucky = Math.random() < luckyChance;
var baseYield = nodeTier;
var extraChance = 0.10 + ((p.mods && p.mods.extraGather) || 0);
var qty = baseYield + (isLucky ? 1 : 0) + (Math.random() < extraChance ? 1 : 0);
qty = Math.min(qty, node.amount);

var item = (cfg.altItem && Math.random() < (cfg.altChance || 0)) ? cfg.altItem : cfg.item;
node.amount -= qty;

g.systems.inventory.add(item, qty);

var itemName = (US.ITEMS && US.ITEMS[item]) ? US.ITEMS[item].name : item.replace(/_/g, ' ');
var luckLabel = isLucky ? ' [Lucky!]' : '';
g.ui.floatText(p.x, p.y - 44, '+' + qty + ' ' + itemName + luckLabel, isLucky ? '#f1c40f' : '#38d978');

var xpGained = cfg.xp * qty * (isLucky ? 2 : 1);
if (isLucky) g.ui.floatText(p.x, p.y - 64, '2x XP!', '#f1c40f');
if (g.systems.skills) g.systems.skills.addXp(sk, xpGained);
if (g.systems.quests) g.systems.quests.notify('gather', item, qty);
g.stats.resourcesGathered = (g.stats.resourcesGathered || 0) + qty;

if (node.amount <= 0) {
node.cooldown = cfg.respawn || 30;
node.hitProgress = 0;
g.ui.log(cfg.name + ' depleted. Respawns in ' + Math.round(cfg.respawn) + 's.', 'gold');
this.cancel();
return;
}

this.swingTimer = 0;
};

US.GatheringSystem.prototype.update = function(dt) {
var g = this.game, p = g.player;

this.ensureNodes();

var resources = g.entities && g.entities.resources;
if (resources) {
for (var i = 0; i < resources.length; i++) {
var r = resources[i];
if (!r || r.cooldown <= 0) continue;
r.cooldown -= dt;
if (r.cooldown <= 0) {
r.cooldown = 0;
r.hitProgress = 0;
if (r.cfg && r.cfg.amount) {
var mn = Array.isArray(r.cfg.amount) ? r.cfg.amount[0] : r.cfg.amount;
var mx = Array.isArray(r.cfg.amount) ? r.cfg.amount[1] : r.cfg.amount;
r.amount = US.irand(mn, mx);
} else { r.amount = 3; }
}
}
}

this._updateNpcPrompt();

if (!p) { this._clearProgress(); return; }

if (this._pendingNode && !this.active && !this._menuNode) {
var pending = this._pendingNode;
var pendDist = Math.hypot(pending.x - p.x, pending.y - p.y);
if (pendDist <= INTERACT_RANGE) {
this._pendingNode = null;
this._openActionMenu(pending);
} else if (pendDist > AUTO_WALK_RANGE * 3) {
this._pendingNode = null;
}
}

if (!this.active) { return; }

if (this.active.amount <= 0 || this.active.cooldown > 0) { this.cancel(); return; }

var gDist = Math.hypot(this.active.x - p.x, this.active.y - p.y);
if (gDist > ABANDON_RANGE) {
g.ui.log('You moved away and stopped ' + this._actionLabel(this.active).toLowerCase() + '.', 'bad');
this.cancel();
return;
}

this.swingTimer += dt;
this._showProgress();

if (this.swingTimer >= this.swingDuration) {
this._resolveSwing();
}
};

console.log('[UNKSCAPE] gathering.js v10 loaded — [GATHER] diagnostics active in _startGathering.');

})();

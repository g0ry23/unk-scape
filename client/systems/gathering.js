(function(){
const US = window.UnkScape = window.UnkScape || {};

// ─────────────────────────────────────────────────────────────────────────────
// UNKSCAPE GatheringSystem  v4
//
// Complete interaction model:
//
//  1. Left-click any resource (mesh hit or ground-near-miss):
//       • If too far → player auto-walks to resource, then auto-starts on arrival
//       • If in range → immediately starts gathering
//
//  2. Per-hit swing model:
//       • Each gather cycle = N swings (cfg.hitsToHarvest)
//       • Each swing takes ~swingInterval seconds
//       • Every swing shows a hit flash + swing XP
//       • On the FINAL swing of a cycle → loot roll + full XP reward
//       • Resource visual dims as hitProgress fills
//
//  3. Continuous mode:
//       • After a successful gather, if the node still has charges,
//         automatically begin next cycle — no re-click needed
//       • Player only stops if: node depleted, player walks away, ESC pressed,
//         or another action begins
//
//  4. NPC proximity prompts:
//       • When player walks within NPC range a prompt appears
//       • Left-click on an NPC opens dialog (handled by player.tryInteract)
//
//  5. Full skill tree coverage:
//       Every resource node maps to one of the 15 canonical skills.
//       All skill interactions are routed through this single system.
//
// ─────────────────────────────────────────────────────────────────────────────

var AUTO_WALK_RANGE  = 220;  // px — max range to auto-walk to a resource
var INTERACT_RANGE   = 180;  // px — max range to START gathering without walking
var ABANDON_RANGE    = 260;  // px — if player drifts beyond this, cancel gathering
var NPC_PROMPT_RANGE = 90;   // px — distance to show NPC action prompt
var SWING_BASE_TIME  = 0.80; // seconds per swing at skill level 1
var SWING_MIN_TIME   = 0.30; // fastest possible swing

US.GatheringSystem = function(game) {
  this.game          = game;
  this.active        = null;   // current resource node being gathered
  this.swingTimer    = 0;      // time within current swing
  this.swingDuration = 0.80;   // computed per node/skill
  this.seeded        = false;
  this._pendingNode  = null;   // node player is auto-walking toward
  this._npcPromptEl  = null;   // DOM element for NPC prompt
  this._lastNpcId    = null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

US.GatheringSystem.prototype._swingDuration = function(node) {
  if (!node || !node.cfg) return SWING_BASE_TIME;
  var p   = this.game.player;
  var sk  = node.cfg.skill;
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

// ── Level gate check ─────────────────────────────────────────────────────────
US.GatheringSystem.prototype._checkLevel = function(node) {
  if (!node || !node.cfg) return true;
  var p   = this.game.player;
  var sk  = node.cfg.skill;
  var lvl = US.levelForXp(p.skills[sk] ? p.skills[sk].xp || 0 : 0);
  if (lvl < node.cfg.level) {
    this.game.ui.toast(
      'Level too low',
      node.cfg.name + ' requires ' + this._skillName(sk) + ' level ' + node.cfg.level + '.',
      'bad'
    );
    return false;
  }
  return true;
};

// ── Tool permission check ────────────────────────────────────────────────────
US.GatheringSystem.prototype._checkTool = function(node) {
  var req = (node.cfg && node.cfg.toolReq) || null;
  if (!req) return true;
  var UP = window.UnkScape && window.UnkScape.Player;
  if (!UP || !UP.canUseTool) return true;
  var p   = this.game.player;
  var ok  = UP.canUseTool(req, p.skills);
  if (!ok) {
    var tier      = UP.TOOL_TIERS[req] || {};
    var skillName = this._skillName(tier.skill);
    this.game.ui.toast(
      'Tool too weak',
      'You need a ' + req.replace(/_/g, ' ') + ' or better (' + skillName + ' Lv.' + tier.level + ').',
      'bad'
    );
  }
  return ok;
};

// ── Progress bar ─────────────────────────────────────────────────────────────
US.GatheringSystem.prototype._showProgress = function() {
  var hint = document.getElementById('action-hint');
  if (!hint || !this.active) { this._clearProgress(); return; }
  var node = this.active;
  var cfg  = node.cfg || {};
  var hits = cfg.hitsToHarvest || 1;
  var pct  = Math.min(1, node.hitProgress / hits);
  var swingPct = Math.min(1, this.swingTimer / this.swingDuration);
  var barW     = Math.round(pct * 160);
  var swingW   = Math.round(swingPct * 160);
  var label    = this._actionLabel(node);
  var skillCol = (cfg.skill && US.SKILLS[cfg.skill]) ? US.SKILLS[cfg.skill].color : '#f1c40f';
  hint.style.cssText = [
    'position:fixed',
    'bottom:180px',
    'left:50%',
    'transform:translateX(-50%)',
    'background:rgba(14,11,20,0.92)',
    'border:2px solid #47385a',
    'border-radius:6px',
    'padding:8px 16px',
    'color:' + skillCol,
    'font-family:Courier New,monospace',
    'font-size:13px',
    'z-index:9999',
    'min-width:220px',
    'text-align:center',
    'pointer-events:none'
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

// ── NPC proximity prompt ──────────────────────────────────────────────────────
US.GatheringSystem.prototype._updateNpcPrompt = function() {
  var g = this.game, p = g.player;
  if (!p || !g.entities || !g.entities.npcs) return;
  var near = null, bestDist = NPC_PROMPT_RANGE;
  for (var i = 0; i < g.entities.npcs.length; i++) {
    var npc = g.entities.npcs[i];
    var d   = Math.hypot(npc.x - p.x, npc.y - p.y);
    if (d < bestDist) { bestDist = d; near = npc; }
  }
  var hint = document.getElementById('action-hint');
  if (near && !this.active) {
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
        var npcName = near.name || near.cfg && near.cfg.name || 'NPC';
        hint.innerHTML = '<div>[F] Talk to ' + npcName + '</div>';
      }
    }
  } else if (!near && this._lastNpcId) {
    this._lastNpcId = null;
    if (!this.active) this._clearProgress();
  }
};

// ── Seed starter nodes near player on first game start ───────────────────────
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
  if (nearbyTree) return; // already seeded or worldgen placed them

  var STARTER = [
    { type:'tree',   angle:0.4,  dist:90  },
    { type:'tree',   angle:2.0,  dist:110 },
    { type:'rock',   angle:3.3,  dist:95  },
    { type:'berry',  angle:4.8,  dist:80  },
    { type:'copper', angle:1.2,  dist:130 },
    { type:'herb',   angle:5.5,  dist:75  }
  ];
  var idx = 0;
  STARTER.forEach(function(s) {
    var xp = US.clamp(px + Math.cos(s.angle) * s.dist, US.TILE * 3, US.WORLD.pxW - US.TILE * 3);
    var yp = US.clamp(py + Math.sin(s.angle) * s.dist, US.TILE * 3, US.WORLD.pxH - US.TILE * 3);
    var node = US.createResource(s.type, xp, yp, 'starter_' + s.type + '_' + idx);
    if (node) resources.push(node);
    idx++;
  });
  g.ui && g.ui.log('Starter resources placed. Walk up and left-click to gather!', 'gold');
  var E = window.UnkScape3D;
  if (E && E.RebuildProps) E.RebuildProps(px, py);
};

// ── Find best resource near a world position ─────────────────────────────────
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

// ── Primary entry point: called by input.js on any resource click ─────────────
// wx,wy = world coordinates of click
US.GatheringSystem.prototype.tryStartAt = function(wx, wy) {
  this.ensureNodes();
  var g = this.game, p = g.player;
  if (!p) return false;

  // Find the closest available node to click point
  var node = this._findNear(wx, wy, INTERACT_RANGE + 100);
  if (!node) return false;

  var dist = Math.hypot(node.x - p.x, node.y - p.y);

  // Too far — auto-walk then auto-start
  if (dist > INTERACT_RANGE) {
    this._pendingNode = node;
    p._clickTarget   = { x: node.x, y: node.y, resourceId: node.uid };
    var rname = node.cfg ? node.cfg.name : 'resource';
    g.ui.toast('Walking to ' + rname + '...', '', 'gold');
    return true;
  }

  // In range — start immediately
  return this._startGathering(node);
};

// ── Actually begin a gather cycle on a node ───────────────────────────────────
US.GatheringSystem.prototype._startGathering = function(node) {
  var g = this.game, p = g.player;
  if (!node || node.amount <= 0 || node.cooldown > 0) return false;
  if (!this._checkLevel(node)) return false;
  if (!this._checkTool(node))  return false;

  this.active        = node;
  this.swingDuration = this._swingDuration(node);
  this.swingTimer    = 0;
  this._pendingNode  = null;
  if (p) { p.gathering = true; p.blocking = false; p.heavyCharging = false; }
  // Cancel any pending click-to-walk target
  if (p && p._clickTarget && p._clickTarget.resourceId === node.uid) p._clickTarget = null;

  g.ui && g.ui.log('Started ' + this._actionLabel(node).toLowerCase() + '.', 'gold');
  return true;
};

// ── Cancel current action ─────────────────────────────────────────────────────
US.GatheringSystem.prototype.cancel = function() {
  var p = this.game.player;
  if (p) p.gathering = false;
  this.active       = null;
  this.swingTimer   = 0;
  this._pendingNode = null;
  this._clearProgress();
};

// ── One swing completes — resolve loot on final swing ─────────────────────────
US.GatheringSystem.prototype._resolveSwing = function() {
  var g    = this.game;
  var p    = g.player;
  var node = this.active;
  var cfg  = node.cfg;
  var sk   = cfg.skill;
  var hits = cfg.hitsToHarvest || 1;

  // Tiny swing XP on every swing attempt
  var swingXp = cfg.swingXp || 1;
  if (g.systems.skills) g.systems.skills.addXp(sk, swingXp);

  // Hit flash
  var hitCol = cfg.hitColor || '#f1c40f';
  var verb   = cfg.action || 'Hit';
  g.ui.floatText(node.x, node.y - 30, verb + '!', hitCol);

  // Increment swing counter
  node.hitProgress = (node.hitProgress || 0) + 1;

  // Not yet at final swing — just show progress
  if (node.hitProgress < hits) {
    this.swingTimer = 0; // reset for next swing
    return;
  }

  // ── FINAL SWING — do the loot roll ────────────────────────────────────────
  node.hitProgress = 0;
  var lvl  = US.levelForXp(p.skills[sk] ? p.skills[sk].xp || 0 : 0);
  var tool = p.stats ? (p.stats()[sk] || 0) : 0;
  var ok   = US.rollSkillSuccess(lvl + tool, cfg.difficulty);

  if (!ok) {
    g.ui.floatText(p.x, p.y - 40, 'Failed', '#9aa8c7');
    // Still give partial XP for attempt
    if (g.systems.skills) g.systems.skills.addXp(sk, Math.max(1, Math.floor(cfg.xp * 0.12)));
    // Continue trying (don't cancel) — player keeps swinging
    this.swingTimer = 0;
    return;
  }

  // Success — award loot + full XP
  var extraChance = 0.10 + ((p.mods && p.mods.extraGather) || 0);
  var qty  = 1 + (Math.random() < extraChance ? 1 : 0);
  qty      = Math.min(qty, node.amount);

  var item = (cfg.altItem && Math.random() < (cfg.altChance || 0)) ? cfg.altItem : cfg.item;
  node.amount -= qty;

  g.systems.inventory.add(item, qty);

  var itemName = (US.ITEMS && US.ITEMS[item]) ? US.ITEMS[item].name : item.replace(/_/g, ' ');
  g.ui.floatText(p.x, p.y - 44, '+' + qty + ' ' + itemName, '#38d978');

  var xpGained = cfg.xp * qty;
  if (g.systems.skills) {
    g.systems.skills.addXp(sk, xpGained);
  }
  if (g.systems.audio) g.systems.audio.play(sk === 'mining' ? 'mine' : 'chop');
  if (g.systems.quests) g.systems.quests.notify('gather', item, qty);
  g.stats.resourcesGathered = (g.stats.resourcesGathered || 0) + qty;

  if (node.amount <= 0) {
    // Node depleted — set respawn cooldown on the node itself
    node.cooldown = cfg.respawn || 30;
    node.hitProgress = 0;
    g.ui.log(cfg.name + ' depleted. It will respawn in ' + Math.round(cfg.respawn) + 's.', 'gold');
    this.cancel();
    return;
  }

  // Node still has charges — continue automatically
  this.swingTimer = 0;
};

// ── Per-frame update ──────────────────────────────────────────────────────────
US.GatheringSystem.prototype.update = function(dt) {
  var g = this.game, p = g.player;

  // Seed starter nodes
  this.ensureNodes();

  // Tick all resource respawn cooldowns
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

  // NPC proximity prompt (runs when not gathering)
  this._updateNpcPrompt();

  if (!p) { this._clearProgress(); return; }

  // Auto-walk arrival: if player was walking toward a pending node, start gathering when close
  if (this._pendingNode && !this.active) {
    var pending = this._pendingNode;
    var pendDist = Math.hypot(pending.x - p.x, pending.y - p.y);
    if (pendDist <= INTERACT_RANGE) {
      this._startGathering(pending);
    } else if (pendDist > AUTO_WALK_RANGE * 3) {
      // Player walked away from target, cancel pending
      this._pendingNode = null;
    }
  }

  // No active gathering
  if (!this.active) { this._clearProgress(); return; }

  // Check node still valid
  if (this.active.amount <= 0 || this.active.cooldown > 0) { this.cancel(); return; }

  // Abandon if player drifted too far
  var gDist = Math.hypot(this.active.x - p.x, this.active.y - p.y);
  if (gDist > ABANDON_RANGE) {
    g.ui.log('You moved away and stopped ' + this._actionLabel(this.active).toLowerCase() + '.', 'bad');
    this.cancel();
    return;
  }

  // Advance swing timer
  this.swingTimer += dt;
  this._showProgress();

  if (this.swingTimer >= this.swingDuration) {
    this._resolveSwing();
  }
};

})();

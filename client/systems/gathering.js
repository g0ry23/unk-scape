(function(){
const D = window.Duskfall = window.Duskfall || {};

/**
 * GatheringSystem
 * UPDATE F: Wired UnkScape.Player.canUseTool() check before harvest starts.
 *   - Checks equipped weapon/tool against TOOL_TIERS for tree/rock nodes.
 *   - On successful harvest tick, fires D.SkillSystem.addXp() which in turn
 *     emits floatText ('+25 Woodcutting XP') and a structured log entry.
 *   - Plain harvest-tree nodes (no cfg) also award 25 WC xp with log.
 */
D.GatheringSystem = function(game) {
  this.game     = game;
  this.nodes    = [];
  this.active   = null;
  this.timer    = 0;
  this.duration = 3;
  this.respawnTime = 10;
  this.seeded   = false;
};

D.GatheringSystem.prototype.nodeLabel = function(node) {
  if (!node) return 'Gathering';
  if (node.cfg) return (node.cfg.action || 'Gather') + ': ' + node.cfg.name;
  // Zoned node label from mmoWorld structure data
  if (node.structure && node.structure.resource)
    return 'Harvest: ' + node.structure.resource.charAt(0).toUpperCase() +
           node.structure.resource.slice(1);
  return 'Chop: Harvest Tree';
};

D.GatheringSystem.prototype.gatherDuration = function(node) {
  if (!node || !node.cfg) return 3;
  const p   = this.game.player;
  const lvl = D.levelForXp(p.skills[node.cfg.skill]?.xp || 0);
  const tool = p.stats()[node.cfg.skill] || 0;
  return D.clamp(3.4 + (node.cfg.tier || 1) * 0.45 - (lvl + tool) * 0.10, 1.3, 5.2);
};

D.GatheringSystem.prototype.ensureNodes = function() {
  const g = this.game;
  if (this.seeded || !g.world || !g.player) return;
  this.seeded = true;

  // Seed starter trees directly into g.entities.resources near the player spawn.
  // g.entities.resources is the one source of truth for all gatherable resources.
  const resources = g.entities && g.entities.resources;
  if (!resources) return;

  const px = g.player.x, py = g.player.y;
  const nearbyTree = resources.find(r =>
    r && r.type === 'tree' && Math.hypot(r.x - px, r.y - py) < 500
  );
  if (nearbyTree) return;

  const tries = 200;
  const seeded = [];
  for (let i = 0; i < tries && seeded.length < 4; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 140 + Math.random() * 300;
    let x = D.clamp(px + Math.cos(angle) * dist, D.TILE * 3, D.WORLD.pxW - D.TILE * 3);
    let y = D.clamp(py + Math.sin(angle) * dist, D.TILE * 3, D.WORLD.pxH - D.TILE * 3);
    const tx = Math.floor(x / D.TILE), ty = Math.floor(y / D.TILE);
    const tileId = g.world.tiles[ty] && g.world.tiles[ty][tx];
    if (!tileId || (D.TILES[tileId] && D.TILES[tileId].solid) || tileId === 'water') continue;
    if (seeded.some(n => Math.hypot(n.x - x, n.y - y) < 120)) continue;
    seeded.push({ x, y });
  }
  while (seeded.length < 4) {
    const n = seeded.length;
    seeded.push({ x: px + (n % 2 === 0 ? 1 : -1) * (150 + n * 60), y: py + (n < 2 ? 180 : -200) });
  }

  seeded.forEach((pos, idx) => {
    resources.push({
      uid: 'starter_tree_' + idx,
      kind: 'resource',
      type: 'tree',
      cfg: { name: 'Oak Tree', item: 'log', skill: 'woodcutting', tier: 1, level: 1,
             xp: 18, difficulty: 18, color: '#2f7d46', amount: [2, 5], respawn: 24, action: 'Chop' },
      x: pos.x, y: pos.y, r: 28, amount: 4, cooldown: 0
    });
  });

  g.ui && g.ui.log('Starter oak trees placed nearby. Chop one to begin gathering.', 'gold');
  console.log('[Gathering] Seeded ' + seeded.length + ' starter trees into g.entities.resources');
  var E = window.UnkScape3D;
  if (E && E.RebuildProps) E.RebuildProps(px, py);
};

D.GatheringSystem.prototype._checkToolPermission = function(node) {
  const g  = this.game;
  const p  = g.player;
  // Extract toolReq from zoned structure or cfg
  const req = (node.structure && node.structure.toolReq) ||
              (node.cfg && node.cfg.toolReq) || null;
  if (!req) return true; // no tool requirement

  const UP = window.UnkScape && window.UnkScape.Player;
  if (!UP || !UP.canUseTool) return true; // helper not available — allow

  const allowed = UP.canUseTool(req, p.skills);
  if (!allowed) {
    const tier = (UP.TOOL_TIERS[req] || {});
    const skillName = (D.SKILLS[tier.skill] || {}).name || tier.skill || 'skill';
    g.ui.toast(
      'Tool too weak',
      'You need a ' + req.replace(/_/g,' ') + ' or better (' + skillName + ' Lv.' + tier.level + ').',
      'bad'
    );
  }
  return allowed;
};

D.GatheringSystem.prototype.tryStartAt = function(x, y) {
  this.ensureNodes();
  const g = this.game, p = g.player;
  if (!p) return false;

  // g.entities.resources is the ONE source of truth for all gatherable resources
  const resources = g.entities && g.entities.resources;
  if (!resources) return false;

  const node = resources.find(r =>
    r && r.amount > 0 &&
    Math.hypot(r.x - x, r.y - y) <= (r.r || 28) + 26 &&
    Math.hypot(r.x - p.x, r.y - p.y) <= 200
  );
  if (!node) {
    console.log('[Gathering] tryStartAt (' + Math.round(x) + ',' + Math.round(y) + '): no resource found within range (player at ' + Math.round(p.x) + ',' + Math.round(p.y) + ')');
    return false;
  }

  if (node.cfg) {
    const level = D.levelForXp(p.skills[node.cfg.skill] && p.skills[node.cfg.skill].xp || 0);
    if (level < node.cfg.level) {
      g.ui.toast('Level too low',
        node.cfg.name + ' requires ' + D.SKILLS[node.cfg.skill].name + ' level ' + node.cfg.level + '.', 'bad');
      return true;
    }
  }

  if (!this._checkToolPermission(node)) return true;

  this.active = node;
  this.duration = this.gatherDuration(node);
  this.timer = 0;
  if (p) { p.gathering = true; p.blocking = false; p.heavyCharging = false; }
  if (g.input && g.input.mouse) { g.input.mouse.leftDown = false; g.input.mouse.rightDown = false; }
  g.ui.log('Started ' + this.nodeLabel(node).toLowerCase() + '.', 'gold');
  return true;
};

D.GatheringSystem.prototype.cancel = function() {
  if (this.game.player) this.game.player.gathering = false;
  this.active = null;
  this.timer  = 0;
};

D.GatheringSystem.prototype.finish = function() {
  const g    = this.game;
  const node = this.active;
  if (!node) { this.cancel(); return; }

  if (node.cfg) {
    // ── Standard resource entity harvest ──
    const p   = g.player;
    const cfg = node.cfg;
    const lvl = D.levelForXp(p.skills[cfg.skill]?.xp || 0);
    const tool = p.stats()[cfg.skill] || 0;
    const ok  = D.rollSkillSuccess(lvl + tool, cfg.difficulty);
    if (!ok) {
      g.ui.floatText(p.x, p.y - 35, 'Failed', '#9aa8c7');
      if (g.systems.skills) g.systems.skills.addXp(cfg.skill, Math.max(1, Math.floor(cfg.xp * 0.15)));
      this.cancel(); return;
    }
    let qty = 1 + (Math.random() < 0.10 + (p.mods.extraGather || 0) ? 1 : 0);
    qty = Math.min(qty, node.amount);
    const item = (cfg.altItem && Math.random() < (cfg.altChance || 0)) ? cfg.altItem : cfg.item;
    node.amount -= qty;
    g.systems.inventory.add(item, qty);
    g.systems.audio?.play(cfg.skill === 'mining' ? 'mine' : 'chop');
    // ── Award XP + emit log ──
    const xpGained = cfg.xp * qty;
    if (g.systems.skills) g.systems.skills.addXp(cfg.skill, xpGained);
    _logXpGain(g, cfg.skill, xpGained);
    if (g.systems.quests) g.systems.quests.notify('gather', item, qty);
    g.stats.resourcesGathered += qty;
    g.ui.floatText(p.x, p.y - 42, '+' + qty + ' ' + (D.ITEMS[item]?.name || item), '#38d978');
    if (node.amount <= 0) { node.cooldown = cfg.respawn; g.ui.log(cfg.name + ' depleted.', 'gold'); }

  } else if (node.structure && node.structure.xpReward) {
    // ── Zoned structure node (oak/yew/copper/iron from mmoWorld) ──
    const p     = g.player;
    const str   = node.structure;
    const skill = str.skill || (str.type === 'rock' ? 'mining' : 'woodcutting');
    const xp    = str.xpReward;
    const item  = str.item || (str.type === 'rock' ? 'ore' : 'log');
    node.active = false;
    node.respawn = this.respawnTime;
    g.systems.inventory.add(item, 1);
    g.systems.audio?.play(str.type === 'rock' ? 'mine' : 'chop');
    // Award XP via SkillSystem and emit explicit log
    if (g.systems.skills) g.systems.skills.addXp(skill, xp);
    _logXpGain(g, skill, xp);
    if (g.systems.quests) g.systems.quests.notify('gather', item, 1);
    g.stats.resourcesGathered += 1;
    g.ui.floatText(p.x, p.y - 42, '+1 ' + item.replace(/_/g,' '), '#38d978');
    g.ui.log('Collected 1 ' + item.replace(/_/g,' ') + '. Node will respawn soon.', 'good');

  } else {
    // ── Legacy plain harvest-tree node (no cfg, no structure) ──
    const p = g.player;
    node.active  = false;
    node.respawn = this.respawnTime;
    g.systems.inventory.add('log', 1);
    g.systems.audio?.play('chop');
    const xpGained = 25;
    if (g.systems.skills) g.systems.skills.addXp('woodcutting', xpGained);
    _logXpGain(g, 'woodcutting', xpGained);
    if (g.systems.quests) g.systems.quests.notify('gather', 'log', 1);
    g.ui.floatText(p.x, p.y - 42, '+1 Wood', '#38d978');
    g.ui.log('Collected 1 Wood. The tree will regrow soon.', 'good');
  }
  this.cancel();
};

/**
 * _logXpGain(game, skillKey, amount)
 * Emits the structured system log entry: '+25 Woodcutting XP gained.'
 * Called after every successful harvest tick.
 */
function _logXpGain(g, skillKey, amount) {
  const skillDef = (window.Duskfall && window.Duskfall.SKILLS &&
                    window.Duskfall.SKILLS[skillKey]) || {};
  const name = skillDef.name || (skillKey.charAt(0).toUpperCase() + skillKey.slice(1));
  g.ui.log('+' + amount + ' ' + name + ' XP gained.', 'gold');
}

D.GatheringSystem.prototype.update = function(dt) {
  this.ensureNodes();
  const g = this.game, p = g.player;

  // Tick down cooldowns on resource entities so they respawn
  const resources = g.entities && g.entities.resources;
  if (resources) {
    resources.forEach(r => {
      if (!r) return;
      if (r.cooldown > 0) {
        r.cooldown -= dt;
        if (r.cooldown <= 0) {
          r.cooldown = 0;
          if (r.cfg && r.cfg.amount) {
            const [min, max] = Array.isArray(r.cfg.amount) ? r.cfg.amount : [r.cfg.amount, r.cfg.amount];
            r.amount = min + Math.floor(Math.random() * (max - min + 1));
          } else {
            r.amount = 4;
          }
          g.ui && g.ui.log('A resource node has respawned.', 'gold');
        }
      }
    });
  }

  if (!this.active || !p) return;
  if (this.active.amount <= 0) { this.cancel(); return; }
  if (Math.hypot(this.active.x - p.x, this.active.y - p.y) > 250) {
    g.ui.log('You moved too far away and stopped ' + this.nodeLabel(this.active).toLowerCase() + '.', 'bad');
    this.cancel(); return;
  }
  this.timer += dt;
  if (this.timer >= this.duration) this.finish();
};

})()

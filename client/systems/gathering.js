(function(){
const D = window.Duskfall = window.Duskfall || {};
// GatheringSystem v3: progress bar + too-far toast + tight seeding
D.GatheringSystem = function(game) {
  this.game = game; this.nodes = []; this.active = null;
  this.timer = 0; this.duration = 3; this.respawnTime = 10; this.seeded = false;
};
D.GatheringSystem.prototype.nodeLabel = function(node) {
  if (!node) return "Gathering";
  if (node.cfg) return (node.cfg.action || "Gather") + ": " + node.cfg.name;
  if (node.structure && node.structure.resource)
    return "Harvest: " + node.structure.resource.charAt(0).toUpperCase() + node.structure.resource.slice(1);
  return "Chop: Harvest Tree";
};
D.GatheringSystem.prototype.gatherDuration = function(node) {
  if (!node || !node.cfg) return 3;
  const p = this.game.player;
  const lvl = D.levelForXp(p.skills[node.cfg.skill] ? p.skills[node.cfg.skill].xp || 0 : 0);
  const tool = p.stats()[node.cfg.skill] || 0;
  return D.clamp(3.4 + (node.cfg.tier || 1) * 0.45 - (lvl + tool) * 0.10, 1.3, 5.2);
};
D.GatheringSystem.prototype.ensureNodes = function() {
  const g = this.game;
  if (this.seeded || !g.world || !g.player) return;
  this.seeded = true;
  const resources = g.entities && g.entities.resources;
  if (!resources) return;
  const px = g.player.x, py = g.player.y;
  const nearbyTree = resources.find(function(r) { return r && r.type === "tree" && Math.hypot(r.x - px, r.y - py) < 500; });
  if (nearbyTree) return;
  var ANGLES = [0.4, 1.2, 2.5, 4.0];
  var seeded = ANGLES.map(function(angle, idx) {
    return {
      x: D.clamp(px + Math.cos(angle) * (80 + idx * 20), D.TILE * 3, D.WORLD.pxW - D.TILE * 3),
      y: D.clamp(py + Math.sin(angle) * (80 + idx * 20), D.TILE * 3, D.WORLD.pxH - D.TILE * 3)
    };
  });
  seeded.forEach(function(pos, idx) {
    resources.push({
      uid: "starter_tree_" + idx, kind: "resource", type: "tree",
      cfg: { name: "Oak Tree", item: "log", skill: "woodcutting", tier: 1, level: 1,
             xp: 18, difficulty: 18, color: "#2f7d46", amount: [2, 5], respawn: 24, action: "Chop" },
      x: pos.x, y: pos.y, r: 28, amount: 4, cooldown: 0
    });
  });
  g.ui && g.ui.log("Starter oak trees placed nearby. Walk up and click to chop!", "gold");
  var E = window.UnkScape3D;
  if (E && E.RebuildProps) E.RebuildProps(px, py);
};
D.GatheringSystem.prototype._checkToolPermission = function(node) {
  var g = this.game, p = g.player;
  var req = (node.structure && node.structure.toolReq) || (node.cfg && node.cfg.toolReq) || null;
  if (!req) return true;
  var UP = window.UnkScape && window.UnkScape.Player;
  if (!UP || !UP.canUseTool) return true;
  var allowed = UP.canUseTool(req, p.skills);
  if (!allowed) {
    var tier = UP.TOOL_TIERS[req] || {};
    var skillName = (D.SKILLS[tier.skill] || {}).name || tier.skill || "skill";
    g.ui.toast("Tool too weak", "You need a " + req.replace(/_/g," ") + " or better (" + skillName + " Lv." + tier.level + ").", "bad");
  }
  return allowed;
};
D.GatheringSystem.prototype._showProgress = function() {
  var hint = document.getElementById("action-hint");
  if (!hint || !this.active) { this._clearProgress(); return; }
  var pct = Math.min(1, this.timer / this.duration);
  var label = this.nodeLabel(this.active);
  var barW = Math.round(pct * 160);
  hint.style.cssText = "position:fixed;bottom:180px;left:50%;transform:translateX(-50%);background:rgba(14,11,20,0.92);border:2px solid #47385a;border-radius:6px;padding:8px 16px;color:#f1c40f;font-family:Courier New,monospace;font-size:13px;z-index:9999;min-width:220px;text-align:center;pointer-events:none;";
  hint.innerHTML = "<div style='margin-bottom:6px;'>" + label + "</div><div style='background:#120e1a;border-radius:3px;height:8px;width:160px;margin:0 auto;'><div style='background:#2ecc71;width:" + barW + "px;height:8px;border-radius:3px;'></div></div>";
};
D.GatheringSystem.prototype._clearProgress = function() {
  var hint = document.getElementById("action-hint");
  if (hint) { hint.style.cssText = ""; hint.innerHTML = ""; }
};
D.GatheringSystem.prototype.tryStartAt = function(x, y) {
  this.ensureNodes();
  var g = this.game, p = g.player;
  if (!p) return false;
  var resources = g.entities && g.entities.resources;
  if (!resources) return false;
  var resourceAtPos = null;
  for (var i = 0; i < resources.length; i++) {
    var r = resources[i];
    if (r && r.amount > 0 && Math.hypot(r.x - x, r.y - y) <= (r.r || 28) + 26) { resourceAtPos = r; break; }
  }
  if (resourceAtPos) {
    var dist = Math.hypot(resourceAtPos.x - p.x, resourceAtPos.y - p.y);
    if (dist > 200) {
      var rname = resourceAtPos.cfg ? resourceAtPos.cfg.name : "resource";
      g.ui.toast("Too far away", "Move closer to reach this " + rname + ".", "bad");
      return true;
    }
    var node = resourceAtPos;
    if (node.cfg) {
      var skillXp = p.skills[node.cfg.skill] ? p.skills[node.cfg.skill].xp || 0 : 0;
      var level = D.levelForXp(skillXp);
      if (level < node.cfg.level) {
        g.ui.toast("Level too low", node.cfg.name + " requires " + D.SKILLS[node.cfg.skill].name + " level " + node.cfg.level + ".", "bad");
        return true;
      }
    }
    if (!this._checkToolPermission(node)) return true;
    this.active = node; this.duration = this.gatherDuration(node); this.timer = 0;
    if (p) { p.gathering = true; p.blocking = false; p.heavyCharging = false; }
    if (g.input && g.input.mouse) { g.input.mouse.leftDown = false; g.input.mouse.rightDown = false; }
    g.ui.log("Started " + this.nodeLabel(node).toLowerCase() + ".", "gold");
    return true;
  }
  return false;
};
D.GatheringSystem.prototype.cancel = function() {
  if (this.game.player) this.game.player.gathering = false;
  this.active = null; this.timer = 0; this._clearProgress();
};
D.GatheringSystem.prototype.finish = function() {
  var g = this.game, node = this.active;
  if (!node) { this.cancel(); return; }
  if (node.cfg) {
    var p = g.player, cfg = node.cfg;
    var lvl = D.levelForXp(p.skills[cfg.skill] ? p.skills[cfg.skill].xp || 0 : 0);
    var tool = p.stats()[cfg.skill] || 0;
    var ok = D.rollSkillSuccess(lvl + tool, cfg.difficulty);
    if (!ok) {
      g.ui.floatText(p.x, p.y - 35, "Failed", "#9aa8c7");
      if (g.systems.skills) g.systems.skills.addXp(cfg.skill, Math.max(1, Math.floor(cfg.xp * 0.15)));
      this.cancel(); return;
    }
    var qty = 1 + (Math.random() < 0.10 + (p.mods.extraGather || 0) ? 1 : 0);
    qty = Math.min(qty, node.amount);
    var item = (cfg.altItem && Math.random() < (cfg.altChance || 0)) ? cfg.altItem : cfg.item;
    node.amount -= qty;
    g.systems.inventory.add(item, qty);
    if (g.systems.audio) g.systems.audio.play(cfg.skill === "mining" ? "mine" : "chop");
    var xpGained = cfg.xp * qty;
    if (g.systems.skills) g.systems.skills.addXp(cfg.skill, xpGained);
    _logXpGain(g, cfg.skill, xpGained);
    if (g.systems.quests) g.systems.quests.notify("gather", item, qty);
    g.stats.resourcesGathered += qty;
    g.ui.floatText(p.x, p.y - 42, "+" + qty + " " + (D.ITEMS[item] ? D.ITEMS[item].name : item), "#38d978");
    if (node.amount <= 0) { node.cooldown = cfg.respawn; g.ui.log(cfg.name + " depleted.", "gold"); }
  } else if (node.structure && node.structure.xpReward) {
    var p2 = g.player, str = node.structure;
    var skill = str.skill || (str.type === "rock" ? "mining" : "woodcutting");
    var item2 = str.item || (str.type === "rock" ? "ore" : "log");
    node.active = false; node.respawn = this.respawnTime;
    g.systems.inventory.add(item2, 1);
    if (g.systems.audio) g.systems.audio.play(str.type === "rock" ? "mine" : "chop");
    if (g.systems.skills) g.systems.skills.addXp(skill, str.xpReward);
    _logXpGain(g, skill, str.xpReward);
    if (g.systems.quests) g.systems.quests.notify("gather", item2, 1);
    g.stats.resourcesGathered += 1;
    g.ui.floatText(p2.x, p2.y - 42, "+1 " + item2.replace(/_/g," "), "#38d978");
    g.ui.log("Collected 1 " + item2.replace(/_/g," ") + ". Node will respawn soon.", "good");
  } else {
    var p3 = g.player;
    node.active = false; node.respawn = this.respawnTime;
    g.systems.inventory.add("log", 1);
    if (g.systems.audio) g.systems.audio.play("chop");
    if (g.systems.skills) g.systems.skills.addXp("woodcutting", 25);
    _logXpGain(g, "woodcutting", 25);
    if (g.systems.quests) g.systems.quests.notify("gather", "log", 1);
    g.ui.floatText(p3.x, p3.y - 42, "+1 Wood", "#38d978");
    g.ui.log("Collected 1 Wood. The tree will regrow soon.", "good");
  }
  this.cancel();
};
function _logXpGain(g, skillKey, amount) {
  var skillDef = (window.Duskfall && window.Duskfall.SKILLS && window.Duskfall.SKILLS[skillKey]) || {};
  var name = skillDef.name || (skillKey.charAt(0).toUpperCase() + skillKey.slice(1));
  g.ui.log("+" + amount + " " + name + " XP gained.", "gold");
}
D.GatheringSystem.prototype.update = function(dt) {
  this.ensureNodes();
  var g = this.game, p = g.player;
  var resources = g.entities && g.entities.resources;
  if (resources) {
    resources.forEach(function(r) {
      if (!r || r.cooldown <= 0) return;
      r.cooldown -= dt;
      if (r.cooldown <= 0) {
        r.cooldown = 0;
        if (r.cfg && r.cfg.amount) {
          var mn = Array.isArray(r.cfg.amount) ? r.cfg.amount[0] : r.cfg.amount;
          var mx = Array.isArray(r.cfg.amount) ? r.cfg.amount[1] : r.cfg.amount;
          r.amount = mn + Math.floor(Math.random() * (mx - mn + 1));
        } else { r.amount = 4; }
        g.ui && g.ui.log("A resource node has respawned.", "gold");
      }
    });
  }
  if (!this.active || !p) { this._clearProgress(); return; }
  if (this.active.amount <= 0) { this.cancel(); return; }
  if (Math.hypot(this.active.x - p.x, this.active.y - p.y) > 250) {
    g.ui.log("You moved too far and stopped " + this.nodeLabel(this.active).toLowerCase() + ".", "bad");
    this.cancel(); return;
  }
  this.timer += dt;
  this._showProgress();
  if (this.timer >= this.duration) this.finish();
};
})()

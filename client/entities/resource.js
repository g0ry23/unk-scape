(function(){
const US = window.UnkScape = window.UnkScape || {};

// ─────────────────────────────────────────────────────────────────────────────
// UNKSCAPE RESOURCE TYPE REGISTRY  v2
//
// Each resource node definition:
//   name       — display name
//   item       — primary item drop ID
//   altItem    — optional alternate drop
//   altChance  — probability of altItem (0-1)
//   skill      — canonical skill key (must match US.SKILLS)
//   tier       — 1=basic, 2=mid, 3=advanced
//   level      — minimum skill level required
//   xp         — XP per successful gather
//   difficulty — 1-100, governs success roll
//   color      — map/mini-map color hint
//   amount     — [min, max] charges on spawn
//   respawn    — seconds until node restores
//   action     — verb shown on prompt ("Chop", "Mine", etc.)
//   hitsToHarvest — swings required per gather cycle (visual feedback)
//   swingXp    — tiny XP reward on every swing attempt (not just success)
//   hitColor   — color of hit flash text
// ─────────────────────────────────────────────────────────────────────────────
US.RESOURCE_TYPES = {

  // ── WOODCUTTING ──────────────────────────────────────────────────────────
  tree: {
    name:'Oak Tree', item:'log', skill:'woodcutting',
    tier:1, level:1, xp:18, difficulty:18, color:'#2f7d46',
    amount:[2,5], respawn:24, action:'Chop',
    hitsToHarvest:3, swingXp:2, hitColor:'#63e6a4'
  },
  pine: {
    name:'Pine Tree', item:'pine_log', skill:'woodcutting',
    tier:2, level:3, xp:34, difficulty:30, color:'#1f8f5f',
    amount:[2,4], respawn:38, action:'Chop',
    hitsToHarvest:4, swingXp:3, hitColor:'#63e6a4'
  },
  yew: {
    name:'Yew Tree', item:'yew_log', skill:'woodcutting',
    tier:3, level:6, xp:72, difficulty:54, color:'#125f4b',
    amount:[1,3], respawn:65, action:'Chop',
    hitsToHarvest:5, swingXp:5, hitColor:'#63e6a4'
  },
  magic_tree: {
    name:'Magic Tree', item:'magic_log', skill:'woodcutting',
    tier:4, level:10, xp:120, difficulty:72, color:'#3d9bf0',
    amount:[1,2], respawn:90, action:'Chop',
    hitsToHarvest:6, swingXp:8, hitColor:'#6aa7ff'
  },

  // ── MINING ────────────────────────────────────────────────────────────────
  rock: {
    name:'Stone Outcrop', item:'stone', skill:'mining',
    tier:1, level:1, xp:14, difficulty:16, color:'#7b8190',
    amount:[2,5], respawn:26, action:'Mine',
    hitsToHarvest:3, swingXp:2, hitColor:'#b8c0d8'
  },
  copper: {
    name:'Copper Vein', item:'copper_ore', skill:'mining',
    tier:1, level:1, xp:20, difficulty:22, color:'#b87443',
    amount:[1,4], respawn:36, action:'Mine',
    hitsToHarvest:3, swingXp:2, hitColor:'#b87443'
  },
  iron: {
    name:'Iron Vein', item:'iron_ore', skill:'mining',
    tier:2, level:3, xp:32, difficulty:34, color:'#9d8a70',
    amount:[1,3], respawn:52, action:'Mine',
    hitsToHarvest:4, swingXp:3, hitColor:'#b8c0d8'
  },
  silver: {
    name:'Silver Vein', item:'silver_ore', skill:'mining',
    tier:2, level:4, xp:42, difficulty:40, color:'#c7ced8',
    amount:[1,3], respawn:62, action:'Mine',
    hitsToHarvest:4, swingXp:4, hitColor:'#c7ced8'
  },
  gold: {
    name:'Gold Vein', item:'gold_ore', skill:'mining',
    tier:3, level:6, xp:68, difficulty:58, color:'#d9ad3f',
    amount:[1,2], respawn:78, action:'Mine',
    hitsToHarvest:5, swingXp:5, hitColor:'#f1c40f'
  },
  gem: {
    name:'Gemstone Cluster', item:'emerald', altItem:'ruby', altChance:0.18,
    skill:'mining', tier:3, level:7, xp:90, difficulty:64, color:'#4de0a1',
    amount:[1,2], respawn:95, action:'Mine',
    hitsToHarvest:6, swingXp:7, hitColor:'#4de0a1'
  },

  // ── HERBALISM ────────────────────────────────────────────────────────────
  berry: {
    name:'Berry Bush', item:'berry', skill:'herbalism',
    tier:1, level:1, xp:12, difficulty:12, color:'#3e8d55',
    amount:[2,6], respawn:24, action:'Harvest',
    hitsToHarvest:1, swingXp:1, hitColor:'#66b36a'
  },
  herb: {
    name:'Bitter Herb', item:'herb', skill:'herbalism',
    tier:2, level:2, xp:22, difficulty:26, color:'#66b36a',
    amount:[1,3], respawn:42, action:'Harvest',
    hitsToHarvest:2, swingXp:2, hitColor:'#66b36a'
  },
  rare_herb: {
    name:'Moonbloom Herb', item:'moonbloom', skill:'herbalism',
    tier:3, level:5, xp:48, difficulty:48, color:'#b98cff',
    amount:[1,2], respawn:80, action:'Harvest',
    hitsToHarvest:2, swingXp:4, hitColor:'#b98cff'
  },
  mushroom: {
    name:'Wild Mushroom', item:'mushroom', skill:'herbalism',
    tier:1, level:1, xp:10, difficulty:10, color:'#c67c4e',
    amount:[2,5], respawn:20, action:'Pick',
    hitsToHarvest:1, swingXp:1, hitColor:'#c67c4e'
  },

  // ── FISHING ──────────────────────────────────────────────────────────────
  fish: {
    name:'Fishing Spot', item:'raw_fish', altItem:'raw_trout', altChance:0.22,
    skill:'fishing', tier:1, level:1, xp:16, difficulty:18, color:'#4aaee8',
    amount:[3,8], respawn:32, action:'Fish',
    hitsToHarvest:1, swingXp:1, hitColor:'#4aaee8'
  },
  deep_fish: {
    name:'Deep Water Spot', item:'raw_pike', altItem:'raw_salmon', altChance:0.25,
    skill:'fishing', tier:2, level:4, xp:38, difficulty:36, color:'#1a5276',
    amount:[2,5], respawn:48, action:'Fish',
    hitsToHarvest:1, swingXp:3, hitColor:'#4aaee8'
  },

  // ── HUNTING ──────────────────────────────────────────────────────────────
  hunting_ground: {
    name:'Hunting Ground', item:'raw_meat', altItem:'animal_hide', altChance:0.40,
    skill:'hunting', tier:1, level:1, xp:22, difficulty:20, color:'#8b6914',
    amount:[2,4], respawn:60, action:'Hunt',
    hitsToHarvest:2, swingXp:2, hitColor:'#e8a84a'
  },
  elk_ground: {
    name:'Elk Tracks', item:'venison', altItem:'elk_hide', altChance:0.50,
    skill:'hunting', tier:2, level:4, xp:48, difficulty:40, color:'#6b4c2e',
    amount:[1,3], respawn:90, action:'Hunt',
    hitsToHarvest:3, swingXp:4, hitColor:'#e8a84a'
  },

  // ── FARMING (harvest nodes — actual planting is build system) ─────────────
  crop: {
    name:'Crop Plot', item:'grain', skill:'farming',
    tier:1, level:1, xp:14, difficulty:10, color:'#d9c46e',
    amount:[2,6], respawn:120, action:'Harvest',
    hitsToHarvest:1, swingXp:1, hitColor:'#d9c46e'
  },
  vegetable: {
    name:'Vegetable Patch', item:'carrot', altItem:'potato', altChance:0.40,
    skill:'farming', tier:1, level:1, xp:16, difficulty:12, color:'#e8a84a',
    amount:[2,5], respawn:100, action:'Harvest',
    hitsToHarvest:1, swingXp:1, hitColor:'#d9c46e'
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Factory — create a live resource entity from a type ID
// ─────────────────────────────────────────────────────────────────────────────
US.createResource = function(type, x, y, uid) {
  const cfg = US.RESOURCE_TYPES[type];
  if (!cfg) { console.warn('[Resource] Unknown type:', type); return null; }
  const mn = Array.isArray(cfg.amount) ? cfg.amount[0] : cfg.amount;
  const mx = Array.isArray(cfg.amount) ? cfg.amount[1] : cfg.amount;
  return {
    uid:    uid || US.uid('res'),
    kind:   'resource',
    type,
    cfg,
    x, y,
    r:      26,
    amount: US.irand(mn, mx),
    maxAmount: mx,
    cooldown: 0,
    hitProgress: 0,   // current swing count toward hitsToHarvest
    update(dt) {
      if (this.amount <= 0) {
        this.cooldown -= dt;
        if (this.cooldown <= 0) {
          this.cooldown = 0;
          this.amount   = US.irand(mn, mx);
          this.hitProgress = 0;
        }
      }
    }
  };
};

US.irand = (a, b) => Math.floor(a + Math.random() * (b - a + 1));

})();

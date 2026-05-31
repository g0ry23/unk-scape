(function(){
const US = window.UnkScape = window.UnkScape || {};

// ─────────────────────────────────────────────────────────────────────────────
// UNKSCAPE SKILL REGISTRY  v2  — All 15 canonical skills from master blueprint
// Skill IDs are the canonical keys used in player.skills, resource.cfg.skill,
// gathering actions, XP logs, and the skills panel.
// ─────────────────────────────────────────────────────────────────────────────
US.SKILLS = {
  // ── Combat ─────────────────────────────────────────────────────────────────
  combat: {
    name:'Combat', icon:'⚔️', color:'#ff5c7a',
    desc:'Melee fighting, damage, and survivability.',
    actionLabel:'Attack',
    milestones:{2:'Power Strike',4:'Iron Focus',7:'Veteran Stance',10:'Duskbreaker'}
  },
  // ── Gathering / Nature ─────────────────────────────────────────────────────
  woodcutting: {
    name:'Woodcutting', icon:'🪓', color:'#63e6a4',
    desc:'Chop trees faster and harvest better wood.',
    actionLabel:'Chop',
    milestones:{2:'Better grip',5:'Hardwood chance',8:'Tree sense'}
  },
  mining: {
    name:'Mining', icon:'⛏️', color:'#b8c0d8',
    desc:'Mine ore, stone, and gems from rock outcrops.',
    actionLabel:'Mine',
    milestones:{2:'Sharper swings',5:'Iron vein mastery',8:'Gem chance'}
  },
  fishing: {
    name:'Fishing', icon:'🎣', color:'#4aaee8',
    desc:'Fish in rivers, lakes, and coastal spots.',
    actionLabel:'Fish',
    milestones:{2:'Better bait',5:'Deep catch',8:'Trophy fish'}
  },
  herbalism: {
    name:'Herbalism', icon:'🌿', color:'#66b36a',
    desc:'Gather berries, herbs, and wild plant resources.',
    actionLabel:'Harvest',
    milestones:{2:'Extra yields',5:'Rare herb spotting',8:'Potent gather'}
  },
  hunting: {
    name:'Hunting', icon:'🏹', color:'#e8a84a',
    desc:'Track and harvest wild animals for meat, hide, and bone.',
    actionLabel:'Hunt',
    milestones:{2:'Better tracking',5:'Clean kill',8:'Apex hunter'}
  },
  farming: {
    name:'Farming', icon:'🌾', color:'#d9c46e',
    desc:'Grow crops, harvest produce, and maintain farm plots.',
    actionLabel:'Harvest',
    milestones:{2:'Green thumb',5:'Crop rotation',8:'Bountiful harvest'}
  },
  // ── Processing / Crafting ───────────────────────────────────────────────────
  smithing: {
    name:'Smithing', icon:'🔨', color:'#f4a460',
    desc:'Forge metal bars, weapons, and armor at anvils.',
    actionLabel:'Smith',
    milestones:{2:'Steady hammer',5:'Iron grade',8:'Tempered steel'}
  },
  cooking: {
    name:'Cooking', icon:'🍲', color:'#ffcf6e',
    desc:'Prepare food, reduce burn chance, and make potions.',
    actionLabel:'Cook',
    milestones:{2:'Less burning',5:'Hearty meals',8:'Feast prep'}
  },
  alchemy: {
    name:'Alchemy', icon:'⚗️', color:'#a47cff',
    desc:'Brew potions, mix reagents, and create magical consumables.',
    actionLabel:'Mix',
    milestones:{2:'Basic brew',5:'Rare reagents',8:'Master mix'}
  },
  crafting: {
    name:'Crafting', icon:'🧰', color:'#6aa7ff',
    desc:'Create tools, rope, cloth, and utility items.',
    actionLabel:'Craft',
    milestones:{2:'Basic gear',5:'Iron toolkit',8:'Reinforced kits'}
  },
  // ── World / Progression ─────────────────────────────────────────────────────
  survival: {
    name:'Survival', icon:'🔥', color:'#ff9b5c',
    desc:'Endure hunger, thirst, cold, and the wilds.',
    actionLabel:'Survive',
    milestones:{2:'Slower hunger',5:'Night resilience',8:'Wilderness veteran'}
  },
  building_claim_crafting: {
    name:'Building', icon:'🏗️', color:'#9bb8d4',
    desc:'Claim land, place structures, and build frontier wards.',
    actionLabel:'Build',
    milestones:{2:'Basic claim',5:'Frontier ward',8:'Guild plot'}
  },
  trading_merchanting: {
    name:'Trading', icon:'💰', color:'#f1c40f',
    desc:'Buy low, sell high, and run market stalls.',
    actionLabel:'Trade',
    milestones:{2:'Better prices',5:'Market insight',8:'Master dealer'}
  },
  extraction: {
    name:'Extraction', icon:'🗺️', color:'#e87070',
    desc:'Survive dungeon runs and extract loot safely.',
    actionLabel:'Extract',
    milestones:{2:'Light footing',5:'Secured slot',8:'Extractor veteran'}
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// XP / Level math  (RuneScape-ish, tuned for prototype)
// ─────────────────────────────────────────────────────────────────────────────
US.xpForLevel = function(level) {
  if (level <= 1) return 0;
  let pts = 0;
  for (let i = 1; i < level; i++) pts += Math.floor(i + 300 * Math.pow(2, i / 7));
  return Math.floor(pts / 4);
};

US.levelForXp = function(xp) {
  let lvl = 1;
  while (lvl < 99 && xp >= US.xpForLevel(lvl + 1)) lvl++;
  return lvl;
};

// ─────────────────────────────────────────────────────────────────────────────
// Skill success roll
// difficulty 1-100; higher player level improves odds
// ─────────────────────────────────────────────────────────────────────────────
US.rollSkillSuccess = function(level, difficulty) {
  const chance = Math.max(0.08, Math.min(0.95, 0.45 + (level * 0.035) - (difficulty * 0.008)));
  return Math.random() < chance;
};

})();

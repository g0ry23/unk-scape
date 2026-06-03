/* ============================================================================
   UNKSCAPE — config.js
   Data + ID foundation + namespace. Static registries live here.
   Namespace: window.UnkScape (build spec) mirrored to window.UNKSCAPE (bible).
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape = window.UnkScape || {};
  window.UNKSCAPE = U; // canon bridge — both names resolve to one object

  U.Data = U.Data || {};
  U.Systems = U.Systems || {};
  U.Constants = U.Constants || {};
  U.State = U.State || {};
  U.Config = U.Config || {};

  /* ---- locked canon identity ---- */
  U.Constants.IDENTITY = {
    game:"UNKSCAPE",
    realm:"Hearthvale Fields",
    realmId:"realm_hearthvale_fields",
    town:"Oathstead",
    townId:"town_oathstead_village",
    welcome:"Welcome to Oathstead.",
    faction:"Blood Oath",
    factionId:"faction_blood_oath",
    race:"Human",
    raceId:"race_human"
  };

  /* ---- engine constants ---- */
  U.Constants.TILE = 32;                 // world units per tile
  U.Constants.INTERACT_RANGE = 48;       // 1.5 tiles — strict arm's length

  /* ---- WORLD SIZE (owner spec: 16000 x 12800 units = 500 x 400 tiles) ---- */
  U.Constants.MAP_W = 16000;             // play width  (x)  -> 500 tiles
  U.Constants.MAP_H = 12800;             // play depth  (z)  -> 400 tiles
  U.Constants.MAP_HALF_W = 8000;
  U.Constants.MAP_HALF_H = 6400;
  U.Constants.MAP_EDGE_PAD = 140;        // keep the player off the very rim
  U.Constants.SAVE_KEY = "unkscape:saves";
  U.Constants.WORLD_KEY = "unkscape:worlds";
  U.Constants.INV_SLOTS = 28;            // 4 x 7 visible
  U.Constants.ACTION_SLOTS = 8;
  U.Constants.MAX_LEVEL = 100;

  /* ===========================================================================
     XP CURVE  — RuneScape-tier grind, ~15,000,000 XP at level 100.
     Anchored to spec reference points; geometric interpolation between anchors.
     =========================================================================== */
  const XP_ANCHORS = [
    [1,0],[2,85],[10,1400],[25,22000],[50,750000],[75,4200000],[100,15000000]
  ];
  const _xpCache = {};
  function xpForLevel(L){
    L = Math.max(1, Math.min(U.Constants.MAX_LEVEL, Math.floor(L)));
    if(L === 1) return 0;
    if(_xpCache[L] !== undefined) return _xpCache[L];
    for(let i=0;i<XP_ANCHORS.length-1;i++){
      const [la,xa]=XP_ANCHORS[i], [lb,xb]=XP_ANCHORS[i+1];
      if(L>=la && L<=lb){
        const xa2 = xa<=0 ? 1 : xa;
        const ratio = Math.pow(xb/xa2, 1/(lb-la));
        const v = Math.round(xa2 * Math.pow(ratio, L-la));
        return (_xpCache[L]=v);
      }
    }
    return 15000000;
  }
  function levelForXp(xp){
    xp = Math.max(0, xp);
    let lvl = 1;
    for(let L=2; L<=U.Constants.MAX_LEVEL; L++){
      if(xp >= xpForLevel(L)) lvl = L; else break;
    }
    return lvl;
  }
  // progress within current level: {level, into, span, pct, toNext, nextLevelXp}
  function xpProgress(xp){
    const level = levelForXp(xp);
    if(level >= U.Constants.MAX_LEVEL){
      return {level, into:0, span:1, pct:1, toNext:0, nextLevelXp:xpForLevel(level)};
    }
    const cur = xpForLevel(level), next = xpForLevel(level+1);
    const span = next-cur, into = xp-cur;
    return {level, into, span, pct: span>0? into/span : 0, toNext: next-xp, nextLevelXp: next};
  }
  U.Systems.xpForLevel = xpForLevel;
  U.Systems.levelForXp = levelForXp;
  U.Systems.xpProgress = xpProgress;

  /* ===========================================================================
     TIER LADDER (materials/tools/gear)
     =========================================================================== */
  U.Data.TIERS = [
    {n:1,id:"wood",    name:"Wood",    color:"#8a6b3a", reqLevel:1},
    {n:2,id:"stone",   name:"Stone",   color:"#9aa0a6", reqLevel:5},
    {n:3,id:"iron",    name:"Iron",    color:"#c7ccd1", reqLevel:15},
    {n:4,id:"steel",   name:"Steel",   color:"#aeb8c4", reqLevel:30},
    {n:5,id:"mithril", name:"Mithril", color:"#5a7fd6", reqLevel:50},
    {n:6,id:"adamant", name:"Adamant", color:"#3f9d6b", reqLevel:70},
    {n:7,id:"dragon",  name:"Dragon",  color:"#d0452f", reqLevel:85},
    {n:8,id:"crystal", name:"Crystal", color:"#48c9d6", reqLevel:95},
    {n:9,id:"mythic",  name:"Mythic",  color:"#caa24a", reqLevel:100}
  ];
  // XP band per node tier (from gather tuning table)
  U.Data.XP_BANDS = {1:[8,12],2:[25,35],3:[60,80],4:[120,150],5:[200,300]};

  /* ===========================================================================
     SKILLS  (15 canon + owner-approved extensions; all beginner-accessible)
     icon = small inline svg path drawn from a 24x24 viewbox
     RULE: skills are kept a MULTIPLE OF 3 so the 3-column skills panel is always
     full. Add future skills in sets of 3. (16-18 = firemaking/strength/health,
     owner-approved beyond the canon-15.)
     =========================================================================== */
  function ic(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';}
  U.Data.SKILLS = [
    {id:"combat",        name:"Combat",    icon:ic('<path d="M14 4l6 6M3 21l9-9M13 3l8 8-3 3-8-8z"/><path d="M3 17l4 4"/>')},
    {id:"woodcutting",   name:"Woodcutting",icon:ic('<path d="M14 3l7 7-3 3-7-7zM11 6L3 14l5 5 8-8"/>')},
    {id:"mining",        name:"Mining",    icon:ic('<path d="M3 9c4-4 9-5 12-2M21 7c-1 4-5 8-9 9M5 11l8 8-2 2-8-8z"/>')},
    {id:"fishing",       name:"Fishing",   icon:ic('<path d="M16 8c-5 0-9 3-12 4 3 1 7 4 12 4 4 0 5-4 5-4s-1-4-5-4zM6 12h.01M3 4v8"/>')},
    {id:"herbalism",     name:"Herbalism", icon:ic('<path d="M12 21V9M12 12C9 12 6 9 6 5c4 0 6 3 6 7zM12 10c3 0 6-3 6-7-4 0-6 3-6 7z"/>')},
    {id:"hunting",       name:"Hunting",   icon:ic('<path d="M12 2l2 4-2 2-2-2zM6 8c-2 4 1 12 6 12s8-8 6-12M9 11h.01M15 11h.01"/>')},
    {id:"farming",       name:"Farming",   icon:ic('<path d="M3 21h18M6 21v-6M10 21v-6M14 21v-6M18 21v-6M4 12l8-7 8 7"/>')},
    {id:"smithing",      name:"Smithing",  icon:ic('<path d="M14 3l7 4-2 4-7-3zM12 8l-7 9 3 3 7-9M4 21h6"/>')},
    {id:"cooking",       name:"Cooking",   icon:ic('<path d="M5 11h14l-1 9H6zM8 11V8a4 4 0 018 0v3M12 4V2"/>')},
    {id:"alchemy",       name:"Alchemy",   icon:ic('<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3M7 16h10"/>')},
    {id:"crafting",      name:"Crafting",  icon:ic('<path d="M3 12l4-4 5 5-4 4zM12 13l5 5 4-4-5-5M14 7l3-3 3 3-3 3"/>')},
    {id:"survival",      name:"Survival",  icon:ic('<path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z"/>')},
    {id:"building_claim_crafting", name:"Building", icon:ic('<path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/>')},
    {id:"trading_merchanting",     name:"Trading",  icon:ic('<path d="M3 7h18l-2 5H5zM5 12v7h14v-7M9 16h6"/><circle cx="8" cy="4" r="1.4"/><circle cx="16" cy="4" r="1.4"/>')},
    {id:"extraction",    name:"Extraction",icon:ic('<path d="M12 2v8M8 6l4 4 4-4M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4"/>')},
    // ---- owner-approved skills beyond the canon 15 (kept in sets of 3) ----
    {id:"firemaking",    name:"Firemaking",icon:ic('<path d="M13 2c1 3-1 4-1 6 2 0 3-1 3-3 2 2 3 4 3 7a6 6 0 01-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3 1-5-1-7z"/>')},
    {id:"strength",     name:"Strength",  icon:ic('<path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/>')},
    {id:"health",       name:"Health",    icon:ic('<path d="M12 21s-7-4.5-7-10a4 4 0 018-1 4 4 0 018 1c0 5.5-7 10-7 10z"/>')}
  ];
  U.Data.SKILL_BY_ID = {};
  U.Data.SKILLS.forEach(s=>U.Data.SKILL_BY_ID[s.id]=s);

  /* ===========================================================================
     ITEMS REGISTRY (Alpha starter set — canon IDs)
     type: tool|weapon|armor|food|water|resource|potion|bar|quest|coin
     =========================================================================== */
  function itIc(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';}
  const I = {
    // ---- TOOLS ----
    item_tool_copper_hatchet:{name:"Copper Hatchet",type:"tool",skill:"woodcutting",tier:1,stack:false,value:35,
      icon:itIc('<path d="M14 3l7 7-3 3-7-7z" fill="#b5793a" stroke="#caa24a"/><path d="M11 6L4 13l5 5 7-7" stroke="#8a6b3a"/>')},
    item_tool_copper_pickaxe:{name:"Copper Pickaxe",type:"tool",skill:"mining",tier:1,stack:false,value:35,
      icon:itIc('<path d="M3 8c5-4 13-4 18 0" stroke="#caa24a"/><path d="M12 6v14" stroke="#8a6b3a"/>')},
    item_tool_fishing_line_basic:{name:"Fishing Line",type:"tool",skill:"fishing",tier:1,stack:false,value:20,
      icon:itIc('<path d="M5 3v10c0 4 3 6 6 6" stroke="#caa24a"/><path d="M11 19l3-2-1 4z" fill="#9aa0a6"/>')},
    item_tool_hunting_snare_basic:{name:"Hunting Snare",type:"tool",skill:"hunting",tier:1,stack:false,value:25,
      icon:itIc('<circle cx="12" cy="14" r="5" stroke="#caa24a"/><path d="M12 9V3M9 3h6"/>')},
    item_tool_farming_trowel_basic:{name:"Garden Trowel",type:"tool",skill:"farming",tier:1,stack:false,value:18,
      icon:itIc('<path d="M14 3l3 3-7 9-4-1 1-4z" fill="#9aa0a6" stroke="#caa24a"/><path d="M11 14l-5 7"/>')},
    item_tool_smithing_hammer_basic:{name:"Smithing Hammer",type:"tool",skill:"smithing",tier:1,stack:false,value:30,
      icon:itIc('<path d="M5 7h8v4H5z" fill="#9aa0a6" stroke="#caa24a"/><path d="M9 11v10"/>')},
    item_tool_alchemy_bowl_basic:{name:"Alchemy Bowl",type:"tool",skill:"alchemy",tier:1,stack:false,value:22,
      icon:itIc('<path d="M4 11h16a8 8 0 01-16 0z" fill="#2d6cbe" stroke="#caa24a"/>')},
    item_tool_crafting_needle_basic:{name:"Bone Needle",type:"tool",skill:"crafting",tier:1,stack:false,value:15,
      icon:itIc('<path d="M4 20L20 4M18 4h2v2" stroke="#caa24a"/><circle cx="6" cy="18" r="1.5"/>')},
    // ---- WEAPONS ----
    item_weapon_training_sword:{name:"Training Sword",type:"weapon",tier:1,stack:false,value:40,dmg:4,equip:"mainhand",
      icon:itIc('<path d="M12 2l3 13-3 3-3-3z" fill="#9aa0a6" stroke="#caa24a"/><path d="M9 18h6M12 18v4"/>')},
    item_weapon_oathstead_wooden_bow:{name:"Wooden Bow",type:"weapon",tier:1,stack:false,value:45,dmg:5,equip:"mainhand",
      icon:itIc('<path d="M7 3c6 4 6 14 0 18" stroke="#8a6b3a"/><path d="M7 3l13 9-13 9" stroke="#caa24a"/>')},
    item_weapon_field_dagger:{name:"Field Dagger",type:"weapon",tier:1,stack:false,value:25,dmg:3,equip:"mainhand",
      icon:itIc('<path d="M12 2l2 11-2 2-2-2z" fill="#9aa0a6" stroke="#caa24a"/><path d="M10 15h4v3h-4z"/>')},
    // ---- ARMOR ----
    item_armor_padded_tunic:{name:"Padded Tunic",type:"armor",tier:1,stack:false,value:30,def:3,equip:"chest",
      icon:itIc('<path d="M8 3l4 2 4-2 4 3-3 3v10H7V9L4 6z" fill="#7a5a32" stroke="#caa24a"/>')},
    item_armor_leather_wrappings:{name:"Leather Wrappings",type:"armor",tier:1,stack:false,value:20,def:2,equip:"hands",
      icon:itIc('<path d="M6 7l6-3 6 3v6l-6 3-6-3z" fill="#7a5a32" stroke="#caa24a"/>')},
    item_armor_oathstead_field_boots:{name:"Field Boots",type:"armor",tier:1,stack:false,value:22,def:2,equip:"feet",
      icon:itIc('<path d="M8 3v10l-3 3v5h11v-3l-4-2V3z" fill="#7a5a32" stroke="#caa24a"/>')},
    // ---- FOOD / WATER ----
    item_food_hearthbread:{name:"Hearthbread",type:"food",tier:1,stack:true,value:6,heal:8,hunger:25,
      icon:itIc('<path d="M5 10a7 4 0 0114 0v6a3 3 0 01-3 3H8a3 3 0 01-3-3z" fill="#b5793a" stroke="#caa24a"/>')},
    item_food_roasted_root:{name:"Roasted Root",type:"food",tier:1,stack:true,value:5,heal:6,hunger:18,
      icon:itIc('<path d="M9 4c0 3 6 3 6 0M12 4v5c4 1 6 5 4 9-2 3-8 3-10 0-2-4 0-8 4-9z" fill="#8a5a2a" stroke="#caa24a"/>')},
    item_water_clay_jug:{name:"Clay Water Jug",type:"water",tier:1,stack:true,value:4,thirst:30,
      icon:itIc('<path d="M9 3h6v2l2 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7l2-2z" fill="#2d6cbe" stroke="#caa24a"/>')},
    item_food_cooked_fish_small:{name:"Cooked Fish",type:"food",tier:1,stack:true,value:9,heal:11,hunger:22,
      icon:itIc('<path d="M16 8c-5 0-9 3-12 4 3 1 7 4 12 4 4 0 5-4 5-4s-1-4-5-4z" fill="#c8743a" stroke="#caa24a"/><path d="M6 12h.01"/>')},
    // ---- POTIONS ----
    item_potion_minor_mending:{name:"Minor Mending Draught",type:"potion",tier:1,stack:true,value:30,heal:25,
      icon:itIc('<path d="M10 2h4v3l3 5v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8l3-5z" fill="#a32a22" stroke="#caa24a"/>')},
    item_potion_stamina_sip:{name:"Stamina Sip",type:"potion",tier:1,stack:true,value:25,stam:40,
      icon:itIc('<path d="M10 2h4v3l3 5v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8l3-5z" fill="#cfa53a" stroke="#caa24a"/>')},
    // ---- RESOURCES ----
    item_resource_oak_log:{name:"Oak Log",type:"resource",tier:1,stack:true,value:4,
      icon:itIc('<path d="M4 8h16v8H4z" fill="#7a5a32" stroke="#caa24a"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/>')},
    item_resource_copper_ore:{name:"Copper Ore",type:"resource",tier:1,stack:true,value:5,
      icon:itIc('<path d="M6 9l4-4 7 3 1 7-5 4-7-2z" fill="#b5793a" stroke="#caa24a"/>')},
    item_resource_tin_ore:{name:"Tin Ore",type:"resource",tier:1,stack:true,value:5,
      icon:itIc('<path d="M6 9l4-4 7 3 1 7-5 4-7-2z" fill="#9aa0a6" stroke="#caa24a"/>')},
    item_resource_iron_scrap:{name:"Iron Scrap",type:"resource",tier:2,stack:true,value:9,
      icon:itIc('<path d="M5 8l5-3 6 2 2 6-4 5-7-1z" fill="#c7ccd1" stroke="#caa24a"/>')},
    item_resource_field_stone:{name:"Field Stone",type:"resource",tier:1,stack:true,value:2,
      icon:itIc('<path d="M5 12l3-5 7-1 4 6-3 6-8 1z" fill="#9aa0a6" stroke="#caa24a"/>')},
    item_resource_fiber_bundle:{name:"Fiber Bundle",type:"resource",tier:1,stack:true,value:3,
      icon:itIc('<path d="M6 3v18M10 3v18M14 3v18M18 3v18" stroke="#9a8a4a"/>')},
    item_resource_raw_fish_small:{name:"Small Fish",type:"resource",tier:1,stack:true,value:4,
      icon:itIc('<path d="M16 8c-5 0-9 3-12 4 3 1 7 4 12 4 4 0 5-4 5-4s-1-4-5-4z" fill="#7fa8c0" stroke="#caa24a"/><path d="M6 12h.01"/>')},
    item_resource_bitterleaf:{name:"Bitterleaf",type:"resource",tier:1,stack:true,value:6,
      icon:itIc('<path d="M12 21V8M12 11C9 11 6 8 6 4c4 0 6 3 6 7z" fill="#4c7a2a" stroke="#caa24a"/>')},
    item_resource_redroot:{name:"Redroot",type:"resource",tier:2,stack:true,value:11,
      icon:itIc('<path d="M9 4c0 3 6 3 6 0M12 4v6c3 1 4 4 3 7-2 3-6 3-7 0-1-3 1-6 4-7z" fill="#a32a22" stroke="#caa24a"/>')},
    item_resource_hide_scrap:{name:"Hide Scrap",type:"resource",tier:1,stack:true,value:7,
      icon:itIc('<path d="M5 6l4-2 6 1 4 4-2 8-7 1-5-4z" fill="#8a5a32" stroke="#caa24a"/>')},
    // ---- BARS (smelt products) ----
    item_bar_copper:{name:"Copper Bar",type:"bar",tier:1,stack:true,value:14,
      icon:itIc('<path d="M4 13l3-3h10l3 3-3 3H7z" fill="#b5793a" stroke="#caa24a"/>')},
    item_bar_iron:{name:"Iron Bar",type:"bar",tier:2,stack:true,value:24,
      icon:itIc('<path d="M4 13l3-3h10l3 3-3 3H7z" fill="#c7ccd1" stroke="#caa24a"/>')},
    // ---- QUEST / SERVICE (canon Bible IDs) ----
    item_quest_oathstead_claim_marker:{name:"Practice Claim Marker",type:"quest",tier:1,stack:false,value:0,
      icon:itIc('<path d="M12 3v18M12 3l8 3-8 3" fill="#caa24a" stroke="#caa24a"/><path d="M7 21h10"/>')},
    item_quest_harvest_hollow_token:{name:"Harvest Hollow Token",type:"quest",tier:1,stack:false,value:0,
      icon:itIc('<circle cx="12" cy="12" r="8" fill="#3a2a44" stroke="#caa24a"/><path d="M12 7v10M8 10l4 4 4-4"/>')},
    // ---- CURRENCY ----
    item_currency_coin:{name:"Coins",type:"coin",tier:1,stack:true,value:1,
      icon:itIc('<circle cx="12" cy="12" r="8" fill="#d4a84b" stroke="#8a6b3a"/><path d="M9 12h6M12 9v6" stroke="#8a6b3a"/>')}
  };
  U.Data.ITEMS = I;
  U.Systems.item = id => I[id] || null;

})();

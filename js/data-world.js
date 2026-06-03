/* ============================================================================
   UNKSCAPE — data-world.js
   Resource node type registry (with RuneScape-style multi-skill chains) + NPC
   roster. Chains only appear when every skill they train exists in U.Data —
   gated so there are never dead buttons.
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  const has = id => !!U.Data.SKILL_BY_ID[id];

  /* node type:
     id, name, skill, tier, mesh, hits(base swings), respawn(ms), tool(req item),
     actions[]: {id,label,primary,chain?,produces,toolReq?,note?}
       primary = skill id that always trains; chain = optional 2nd skill id.
  */
  const T = {};
  function node(o){ T[o.id] = o; }

  node({ id:"node_oak_tree_young", name:"Young Oak", skill:"woodcutting", tier:1,
    mesh:"tree", hits:3, respawn:8000, tool:"item_tool_copper_hatchet",
    actions:[
      {id:"chop", label:"Chop", primary:"woodcutting", produces:"item_resource_oak_log", toolReq:"item_tool_copper_hatchet"},
      // chains gated OFF until their systems exist — shown only if skill present:
      {id:"chopburn", label:"Chop + Burn", primary:"woodcutting", chain:"firemaking", produces:"item_resource_oak_log", note:"needs Firemaking"},
      {id:"chopfletch", label:"Chop + Fletch", primary:"woodcutting", chain:"fletching", produces:"item_resource_oak_log", note:"needs Fletching"}
    ]});

  node({ id:"node_copper_vein_basic", name:"Copper Vein", skill:"mining", tier:1,
    mesh:"rock", rockTint:"#b5793a", hits:3, respawn:9000, tool:"item_tool_copper_pickaxe",
    actions:[
      {id:"mine", label:"Mine", primary:"mining", produces:"item_resource_copper_ore", toolReq:"item_tool_copper_pickaxe"},
      {id:"minesmelt", label:"Mine + Smelt", primary:"mining", chain:"smithing", produces:"item_bar_copper", toolReq:"item_tool_copper_pickaxe"}
    ]});

  node({ id:"node_tin_vein_basic", name:"Tin Vein", skill:"mining", tier:1,
    mesh:"rock", rockTint:"#9aa0a6", hits:3, respawn:9000, tool:"item_tool_copper_pickaxe",
    actions:[
      {id:"mine", label:"Mine", primary:"mining", produces:"item_resource_tin_ore", toolReq:"item_tool_copper_pickaxe"}
    ]});

  node({ id:"node_iron_scrap_pile_basic", name:"Iron Scrap Pile", skill:"mining", tier:2,
    mesh:"rock", rockTint:"#c7ccd1", hits:4, respawn:13000, tool:"item_tool_copper_pickaxe",
    actions:[
      {id:"mine", label:"Mine", primary:"mining", produces:"item_resource_iron_scrap", toolReq:"item_tool_copper_pickaxe"},
      {id:"minesmelt", label:"Mine + Smelt", primary:"mining", chain:"smithing", produces:"item_bar_iron", toolReq:"item_tool_copper_pickaxe"}
    ]});

  node({ id:"node_field_stone_pile", name:"Field Stone Pile", skill:"mining", tier:1,
    mesh:"rock", rockTint:"#8a8f96", hits:2, respawn:7000, tool:"item_tool_copper_pickaxe",
    actions:[
      {id:"mine", label:"Pry Loose", primary:"mining", produces:"item_resource_field_stone", toolReq:"item_tool_copper_pickaxe"}
    ]});

  node({ id:"node_river_fishing_spot_small", name:"River Shallows", skill:"fishing", tier:1,
    mesh:"fish", hits:3, respawn:6000, tool:"item_tool_fishing_line_basic",
    actions:[
      {id:"fish", label:"Fish", primary:"fishing", produces:"item_resource_raw_fish_small", toolReq:"item_tool_fishing_line_basic"},
      {id:"fishcook", label:"Fish + Cook", primary:"fishing", chain:"cooking", produces:"item_food_cooked_fish_small", toolReq:"item_tool_fishing_line_basic"}
    ]});

  node({ id:"node_bitterleaf_patch", name:"Bitterleaf Patch", skill:"herbalism", tier:1,
    mesh:"herb", herbTint:"#4c7a2a", hits:2, respawn:7000, tool:null,
    actions:[
      {id:"gather", label:"Gather", primary:"herbalism", produces:"item_resource_bitterleaf"}
    ]});

  node({ id:"node_redroot_patch", name:"Redroot Patch", skill:"herbalism", tier:2,
    mesh:"herb", herbTint:"#a32a22", hits:3, respawn:11000, tool:null,
    actions:[
      {id:"gather", label:"Gather", primary:"herbalism", produces:"item_resource_redroot"}
    ]});

  node({ id:"node_fiber_patch_basic", name:"Fiber Reeds", skill:"herbalism", tier:1,
    mesh:"herb", herbTint:"#9a8a4a", hits:2, respawn:6000, tool:null,
    actions:[
      {id:"gather", label:"Gather", primary:"herbalism", produces:"item_resource_fiber_bundle"}
    ]});

  node({ id:"node_small_game_trail", name:"Game Trail", skill:"hunting", tier:1,
    mesh:"trail", hits:3, respawn:14000, tool:"item_tool_hunting_snare_basic",
    actions:[
      {id:"hunt", label:"Set Snare", primary:"hunting", produces:"item_resource_hide_scrap", toolReq:"item_tool_hunting_snare_basic"}
    ]});

  // resolve: keep only actions whose chain skill (if any) exists; flag missing as locked
  Object.values(T).forEach(nt=>{
    nt.actions.forEach(a=>{
      a.locked = a.chain ? !has(a.chain) : false;
    });
  });

  U.Data.NODE_TYPES = T;

  /* ===========================================================================
     OATHSTEAD NPC ROSTER (framework — placed as content lands)
     =========================================================================== */
  U.Data.NPCS = [
    {id:"npc_torvin_vaultseal", name:"Torvin Vaultseal", role:"Banker",          service:"bank",   color:"#caa24a", line:"Your goods are safe under oath, traveler."},
    {id:"npc_sela_grainhollow", name:"Sela Grainhollow", role:"General Vendor",   service:"vendor", color:"#7fb84a", line:"Fresh supplies — buy fair, sell fair."},
    {id:"npc_aldric_ashborne",  name:"Aldric Ashborne",  role:"Village Elder",    service:null,     color:"#e0772f", line:"Oathstead could use steady hands like yours."},
    {id:"npc_varra_ironvow",    name:"Varra Ironvow",    role:"Guard Captain",    service:null,     color:"#c0392b", line:"Keep your blade close past the gate."},
    {id:"npc_dorn_hammerwatch", name:"Dorn Hammerwatch", role:"Blacksmith",       service:null,     color:"#9aa0a6", line:"Bring me ore and I'll bring you steel."},
    {id:"npc_moll_cinderwick",  name:"Moll Cinderwick",  role:"Innkeeper",        service:null,     color:"#d98a3a", line:"Sit by the fire, love — there's broth and a dry corner."},
    {id:"npc_pell_boundstone",  name:"Pell Boundstone",  role:"Claim Registrar",  service:null,     color:"#8a9bd6", line:"Land's not yours till it's marked, and not marked till I say."},
    {id:"npc_thresh_darkgate",  name:"Thresh Darkgate",  role:"Dungeon Broker",   service:null,     color:"#7a5fae", line:"The Hollow gives, and the Hollow takes. I only sell the map."},
    {id:"npc_ysel_brackwater",  name:"Ysel Brackwater",  role:"Alchemist",        service:null,     color:"#3f9d9d", line:"Bitterleaf for fever, redroot for blood. Mind the dose."},
    {id:"npc_nira_farholm",     name:"Nira Farholm",     role:"Cartographer",     service:null,     color:"#c8a24a", line:"Every road out of Oathstead is on my chart — and every danger."}
  ];

})();

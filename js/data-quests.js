/* ============================================================================
   UNKSCAPE — data-quests.js
   The locked Hearthvale starter quest chain (10 quests). IDs & names are canon
   (Bible 010) — do not rename or reorder. Quests 1–7 are fully playable in this
   Oathstead pass; 8–10 are the Harvest Hollow chapter, foreshadowed + locked
   (dungeon/extraction land in a later phase per the build order).

   Objective kinds (resolved by quests.js against P.tally / P.metrics deltas):
     talk   — speak (arm's length) with an NPC      key auto = "talk:"+npc
     metric — a tracked action count (bank/vendor/consume/map/claim)
     gather — accumulate item(s) since the quest was accepted
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;

  // npc ids (must match data-world.js roster)
  const ALDRIC="npc_aldric_ashborne", TORVIN="npc_torvin_vaultseal", SELA="npc_sela_grainhollow",
        VARRA="npc_varra_ironvow", MOLL="npc_moll_cinderwick", PELL="npc_pell_boundstone",
        THRESH="npc_thresh_darkgate", NIRA="npc_nira_farholm";

  function talk(npc, label){ return {id:"talk_"+npc, kind:"talk", key:"talk:"+npc, npc, need:1, label}; }
  function metric(id, key, need, label){ return {id, kind:"metric", key, need, label}; }
  function gather(id, items, need, label){ return {id, kind:"gather", items:Array.isArray(items)?items:[items], need, label}; }

  U.Data.QUESTS = [
    /* ----------------------------------------------------------- 01 */
    { id:"quest_hearthvale_wake_at_the_common", order:1,
      name:"Wake at the Common", category:"tutorial",
      giver:ALDRIC, turnIn:ALDRIC, prereq:null, auto:true,
      teaches:["movement","interaction","first NPC contact"],
      summary:"You came to on the cold grass of the Oathstead commons. Someone has been waiting for you to stir.",
      offer:"You're awake. Good — the road leaves more than a few face-down in the grass, and not all of them rise.\n\nI'm Aldric Ashborne. I keep what passes for order in Oathstead. Get your feet under you and come speak with me properly.",
      active:"Aldric Ashborne waits by the commons fire.",
      complete:"There — colour back in your face already. Oathstead isn't kind, but it's honest. Stay a while and I'll show you how survivors are made here.",
      objectives:[ talk(ALDRIC, "Speak with Aldric Ashborne at the commons") ],
      reward:{ xp:{survival:90}, coins:15, items:[], unlocks:"quest_hearthvale_first_steps" }
    },

    /* ----------------------------------------------------------- 02 */
    { id:"quest_hearthvale_first_steps", order:2,
      name:"First Steps Through Hearthvale", category:"tutorial",
      giver:ALDRIC, turnIn:ALDRIC, prereq:"quest_hearthvale_wake_at_the_common",
      teaches:["finding NPCs","facilities","safe-zone logic","map awareness"],
      summary:"Learn who keeps Oathstead running and where the valley lies around you.",
      offer:"A survivor who can't find the well dies thirsty within sight of water. Learn the commons first.\n\nGo meet Sela at the goods stall and Torvin at the storehouse — then read Nira's chart of the valley. Come back and tell me what you saw.",
      active:"Meet Sela, Torvin and Nira, then open the valley map.",
      complete:"Now Oathstead is a place to you, not just walls. The gate keeps the worst out — past it, nothing keeps you but your own two hands.",
      objectives:[
        talk(SELA, "Find Sela Grainhollow, the general vendor"),
        talk(TORVIN, "Find Torvin Vaultseal, the storehouse banker"),
        talk(NIRA, "Find Nira Farholm, the cartographer"),
        metric("open_map", "mapOpened", 1, "Open the valley map (press M)")
      ],
      reward:{ xp:{trading_merchanting:140, survival:60}, coins:25, items:[], unlocks:"quest_hearthvale_two_banners" }
    },

    /* ----------------------------------------------------------- 03 */
    { id:"quest_hearthvale_two_banners", order:3,
      name:"Two Banners Over One Valley", category:"faction",
      giver:ALDRIC, turnIn:VARRA, prereq:"quest_hearthvale_first_steps",
      teaches:["Blood Oath & Highborn tension","factions are not simple good/evil"],
      summary:"Oathstead flies the Blood Oath banner. Across the fields, Highmere flies another. Learn why.",
      offer:"You'll hear two names soon enough: Blood Oath and Highborn. We keep oaths by blood here — share fire, share grain, distrust polished men with clean hands.\n\nVarra Ironvow guards our gate. Ask her about the other banner. She's seen what it costs up close.",
      active:"Speak with Guard Captain Varra Ironvow about the two banners.",
      complete:"So you've heard it from me. Highmere isn't evil — they'd say the same of us. But a valley with two banners is a valley waiting on a spark. Keep your blade close past the gate, and your oaths closer.",
      objectives:[ talk(VARRA, "Speak with Varra Ironvow at the gate") ],
      reward:{ xp:{combat:120, survival:60}, coins:20, items:[], unlocks:"quest_hearthvale_tools_of_the_valley" }
    },

    /* ----------------------------------------------------------- 04 */
    { id:"quest_hearthvale_tools_of_the_valley", order:4,
      name:"Tools of the Valley", category:"skilling",
      giver:ALDRIC, turnIn:ALDRIC, prereq:"quest_hearthvale_two_banners",
      teaches:["woodcutting","mining","fishing","herbalism","tool usage","resource value"],
      summary:"Every survivor here works. Put your hands to the valley's four honest trades.",
      offer:"Oaths fill no stomach. Work does. You've a hatchet, a pick, a line and your own two hands — use them.\n\nBring me oak from the woodlot, copper from the shallow mine, fish from the river, and bitterleaf from the south edge. Then you'll know what the valley gives a patient back.",
      active:"Gather from the woodlot, the mine, the river and the herb edge.",
      complete:"Calluses already. Good. Wood, ore, fish, leaf — that's the whole of survival's alphabet, and you can spell it now. The rest is only patience.",
      objectives:[
        gather("oak", ["item_resource_oak_log"], 3, "Chop 3 Oak Logs in the woodlot (NE)"),
        gather("ore", ["item_resource_copper_ore","item_bar_copper"], 3, "Mine 3 Copper Ore in the shallow mine (NW)"),
        gather("fish", ["item_resource_raw_fish_small","item_food_cooked_fish_small"], 2, "Catch 2 Fish at the river shallows (E)"),
        gather("herb", ["item_resource_bitterleaf"], 2, "Gather 2 Bitterleaf at the herb edge (S)")
      ],
      reward:{ xp:{woodcutting:90, mining:90, fishing:90, herbalism:90}, coins:30,
        items:[{id:"item_tool_farming_trowel_basic",qty:1}], unlocks:"quest_hearthvale_bank_and_barter" }
    },

    /* ----------------------------------------------------------- 05 */
    { id:"quest_hearthvale_bank_and_barter", order:5,
      name:"Bank and Barter", category:"economy",
      giver:TORVIN, turnIn:TORVIN, prereq:"quest_hearthvale_tools_of_the_valley",
      teaches:["bank deposit","bank withdrawal","selling","buying","copper currency"],
      summary:"A full pack is a heavy grave. Learn the vault, and learn the trade.",
      offer:"Your goods are safe under oath, traveler — that's the whole of my work. Deposit something in the vault, then draw it back so your hands know the motion.\n\nThen take some honest stock to Sela: sell what you don't need, buy what you do. Coin only moves for those who move it.",
      active:"Deposit & withdraw at the vault, then sell & buy with Sela.",
      complete:"Stored, drawn, sold and bought — you've turned the whole wheel of a town's coin. Keep your vault fuller than your pack and you'll outlast richer fools.",
      objectives:[
        metric("deposit", "bankDeposit", 1, "Deposit an item in the Storehouse Vault"),
        metric("withdraw", "bankWithdraw", 1, "Withdraw an item from the Vault"),
        metric("sell", "vendorSell", 1, "Sell a resource to Sela Grainhollow"),
        metric("buy", "vendorBuy", 1, "Buy any item from Sela")
      ],
      reward:{ xp:{trading_merchanting:260}, coins:40, items:[], unlocks:"quest_hearthvale_feed_the_fire" }
    },

    /* ----------------------------------------------------------- 06 */
    { id:"quest_hearthvale_feed_the_fire", order:6,
      name:"Feed the Fire", category:"survival",
      giver:MOLL, turnIn:MOLL, prereq:"quest_hearthvale_bank_and_barter",
      teaches:["hunger","thirst","cooking","food preparation","water"],
      summary:"Moll Cinderwick keeps the hearth. She'll teach you to keep yourself.",
      offer:"You look half-starved, love. Sit by my fire and I'll set you right — but first you'll earn it.\n\nGo to the river and cook your catch over the water (Fish, then Cook). Then eat something honest and drink your fill. A survivor who forgets to eat is just slow suicide with good manners.",
      active:"Cook a fish at the river, then eat and drink.",
      complete:"Colour's back, belly's full. That's the secret no banner will teach you: hunger and thirst kill more travelers than any blade. Feed the fire, feed yourself, and you'll see another dusk.",
      objectives:[
        gather("cook", ["item_food_cooked_fish_small"], 1, "Cook a fish at the river (use Fish + Cook)"),
        metric("eat", "consumeFood", 1, "Eat any food"),
        metric("drink", "consumeWater", 1, "Drink water")
      ],
      reward:{ xp:{cooking:180, survival:120}, coins:25,
        items:[{id:"item_food_roasted_root",qty:3}], unlocks:"quest_hearthvale_claim_marker" }
    },

    /* ----------------------------------------------------------- 07 */
    { id:"quest_hearthvale_claim_marker", order:7,
      name:"The First Claim Marker", category:"building",
      giver:PELL, turnIn:PELL, prereq:"quest_hearthvale_feed_the_fire",
      teaches:["claim concept","restricted build zones","claim boundaries","future housing"],
      summary:"Pell Boundstone registers claims. A marker is the first stone of every home.",
      offer:"Land's not yours till it's marked, and not marked till I say. That's claim law — older than either banner.\n\nTake this practice marker and set it on the training ground by the fence. Drive it in proper. One day you'll mark land worth dying over — best you learn the motion now, where it's only chalk and good faith.",
      active:"Place the practice claim marker on the training ground.",
      complete:"Set true and square. That's a claim — a circle of dirt the town agrees is yours. Small thing now. But every hall, vault and stronghold in this realm began as one stubborn stake in the ground.",
      objectives:[
        talk(PELL, "Speak with Pell Boundstone, the claim registrar"),
        metric("place_claim", "claimPlaced", 1, "Drive the practice claim marker into the training ground")
      ],
      reward:{ xp:{building_claim_crafting:240, survival:80}, coins:35,
        items:[], unlocks:"quest_hearthvale_whispers_under_harvest" }
    },

    /* --------------------------- 08–10 — HARVEST HOLLOW CHAPTER (locked) ----- */
    { id:"quest_hearthvale_whispers_under_harvest", order:8,
      name:"Whispers Under Harvest", category:"dungeon_lead_in",
      giver:THRESH, turnIn:THRESH, prereq:"quest_hearthvale_claim_marker", locked:true,
      teaches:["dungeon rumors","preparation","risk","why extraction matters"],
      summary:"Thresh Darkgate trades in rumors of Harvest Hollow — the dark under the fields.",
      offer:"The Hollow chapter opens in a later passage of the build.",
      active:"Locked — Harvest Hollow opens in a later chapter.",
      complete:"",
      objectives:[ {id:"locked", kind:"locked", need:1, label:"Hear Thresh's rumors of the Hollow"} ],
      reward:{ xp:{}, coins:0, items:[], unlocks:"quest_hearthvale_hollow_run" }
    },
    { id:"quest_hearthvale_hollow_run", order:9,
      name:"The Hollow Run", category:"extraction",
      giver:THRESH, turnIn:THRESH, prereq:"quest_hearthvale_whispers_under_harvest", locked:true,
      teaches:["dungeon entry","loot states","objective completion","extraction point"],
      summary:"Your first run into Harvest Hollow — strike the objective, then extract with your loot.",
      offer:"The Hollow chapter opens in a later passage of the build.",
      active:"Locked — Harvest Hollow opens in a later chapter.",
      complete:"",
      objectives:[ {id:"locked", kind:"locked", need:1, label:"Survive a Harvest Hollow extraction run"} ],
      reward:{ xp:{}, coins:0, items:[], unlocks:"quest_hearthvale_choose_your_road" }
    },
    { id:"quest_hearthvale_choose_your_road", order:10,
      name:"Choose Your Road", category:"capstone",
      giver:ALDRIC, turnIn:ALDRIC, prereq:"quest_hearthvale_hollow_run", locked:true,
      teaches:["player freedom","skill paths","faction futures","the wider world"],
      summary:"Oathstead has taught all it can. The valley — and the realm beyond — is yours to choose.",
      offer:"The Hollow chapter opens in a later passage of the build.",
      active:"Locked — opens once the Hollow is run.",
      complete:"",
      objectives:[ {id:"locked", kind:"locked", need:1, label:"Choose your road beyond Oathstead"} ],
      reward:{ xp:{}, coins:0, items:[], unlocks:null }
    }
  ];

  U.Data.QUEST_BY_ID = {};
  U.Data.QUESTS.forEach(q=>U.Data.QUEST_BY_ID[q.id]=q);

})();

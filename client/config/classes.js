(function(){
  const US = window.UnkScape = window.UnkScape || {};
  US.FACTIONS = {
    ironbound:{name:'Ironbound Order',icon:'🛡️',color:'#9ea7b8',desc:'Fortify land, hold roads, and win through discipline.',buff:{defense:2}},
    bloodoak:{name:'Bloodoak Clan',icon:'🪓',color:'#ff5c7a',desc:'Aggressive melee raiders who claim turf by force.',buff:{attack:1}},
    thornwatch:{name:'Thornwatch Rangers',icon:'🏹',color:'#63e6a4',desc:'Scouts and hunters who control forests and crossings.',buff:{accuracy:.03}},
    ashveil:{name:'Ashveil Stalkers',icon:'🦊',color:'#ff9b5c',desc:'Ambush fighters built around speed, range, and survival.',buff:{moveSpeed:.04}},
    embercourt:{name:'Ember Court',icon:'🔥',color:'#ffcf6e',desc:'Battle mages who dominate ruins with fire and claim magic.',buff:{attack:1,accuracy:.02}},
    moonveil:{name:'Moonveil Circle',icon:'🌙',color:'#b98cff',desc:'Mystic defenders who grow stronger around claimed territory.',buff:{defense:1,accuracy:.02}}
  };
  US.CLASS_FACTIONS = {
    melee:['ironbound','bloodoak'],
    range:['thornwatch','ashveil'],
    mage:['embercourt','moonveil'],
    wanderer:['ironbound','thornwatch'],
    brawler:['ironbound','bloodoak'],
    gatherer:['thornwatch','ashveil'],
    prospector:['embercourt','moonveil'],
    cleric:['embercourt','moonveil'],
    warden:['ironbound','thornwatch']
  };
  US.getClassFactions = id => US.CLASS_FACTIONS[id] || ['ironbound','thornwatch'];

  US.CLASSES = {
    melee:{
      name:'Melee', icon:'⚔️', archetype:'melee',
      desc:'Sword-and-shield survivor built for close combat and holding territory.',
      items:{crude_sword:1,wooden_shield:1,bronze_helm:1,stone_hatchet:1,iron_pickaxe:1,health_salve:2,coin:20},
      skills:{combat:80,survival:25,crafting:10},
      equipment:{weapon:'crude_sword',offhand:'wooden_shield',head:'bronze_helm'},
      perks:['thick_skin'],
      start:{x:47,y:37}, zone:'Ironwake Hold'
    },
    range:{
      name:'Range', icon:'🏹', archetype:'range',
      desc:'Bow-focused scout built for kiting mobs, hunting resources, and controlling forests.',
      items:{training_bow:1,leather_hood:1,ranger_tunic:1,stone_hatchet:1,iron_pickaxe:1,arrow:35,berry:4,coin:20},
      skills:{combat:55,foraging:40,survival:25},
      equipment:{weapon:'training_bow',head:'leather_hood',body:'ranger_tunic'},
      perks:['keen_eye'],
      start:{x:253,y:40}, zone:'Thornfall Wilds'
    },
    mage:{
      name:'Mage', icon:'🔮', archetype:'mage',
      desc:'Staff-wielding caster built around distance, burst damage, and ancient ruins.',
      items:{oak_staff:1,apprentice_hood:1,apprentice_robe:1,stone_hatchet:1,iron_pickaxe:1,herb:3,torch:2,coin:20},
      skills:{combat:55,crafting:35,survival:20,foraging:20},
      equipment:{weapon:'oak_staff',head:'apprentice_hood',body:'apprentice_robe'},
      perks:['herbalist'],
      start:{x:150,y:205}, zone:'Moonspire Ruins'
    },
    wanderer:{name:'Wanderer', icon:'🧭',archetype:'hybrid',desc:'Balanced survivor with supplies and flexible growth.',items:{log:3,berry:4,torch:2,stone_hatchet:1,iron_pickaxe:1,coin:25},skills:{survival:30,foraging:20},equipment:{},perks:['light_footed'],start:{x:150,y:120},zone:'Central Crossroads'},
    brawler:{name:'Brawler', icon:'🥊',archetype:'melee',desc:'Tougher start with a crude sword and salves.',items:{crude_sword:1,stone_hatchet:1,iron_pickaxe:1,health_salve:2,coin:10},skills:{combat:60,survival:15},equipment:{weapon:'crude_sword'},perks:['thick_skin'],start:{x:50,y:200},zone:'Bloodoak Pits'},
    gatherer:{name:'Gatherer', icon:'🌲',archetype:'range',desc:'Skilling-heavy start for crafting and resource progress.',items:{stone_hatchet:1,log:5,stone:5,berry:3,coin:15},skills:{woodcutting:45,mining:25,crafting:20},equipment:{tool:'stone_hatchet'},perks:['keen_eye'],start:{x:250,y:200},zone:'Greenroot Grove'},
    prospector:{name:'Prospector', icon:'⛏️',archetype:'support',roleType:'skiller',desc:'Mining and money-focused start near ancient stone routes.',items:{stone:8,iron_ore:2,berry:2,stone_hatchet:1,iron_pickaxe:1,coin:35},skills:{mining:55,crafting:15},equipment:{},perks:['coin_sense'],start:{x:47,y:120},zone:'Stonehook Quarry'},
    cleric:{name:'Cleric', icon:'✨', archetype:'healer', roleType:'healer',desc:'Healer/support starter built for group survival, buffs, salves, and holy staff play.',items:{oak_staff:1,apprentice_hood:1,apprentice_robe:1,stone_hatchet:1,iron_pickaxe:1,health_salve:3,herb:5,coin:25},skills:{combat:35,foraging:35,crafting:30,survival:25},equipment:{weapon:'oak_staff',head:'apprentice_hood',body:'apprentice_robe'},perks:['herbalist'],start:{x:253,y:120}, zone:'Sanctum Shoals'},
    warden:{name:'Warden', icon:'🌿', archetype:'support', roleType:'tank',desc:'Tank/support defender built to protect groups, claim turf, and hold boss pressure.',items:{wooden_shield:1,stone_hatchet:1,hide_armor:1,log:4,health_salve:2,coin:20},skills:{combat:45,woodcutting:35,survival:35,crafting:20},equipment:{offhand:'wooden_shield',body:'hide_armor',tool:'stone_hatchet'},perks:['thick_skin','lumberjack'],start:{x:150,y:37}, zone:'Verdant Bulwark'}
  };

  US.STARTER_ZONES = {
    melee:{name:'Ironwake Hold',icon:'⚔️',x:70,y:56,r:57,biome:'stone',road:'stonepath',accent:'plaza',resourceBias:['rock','copper','iron'],desc:'Huge layered martial highlands with fortified ridges, quarry shelves, and sword-and-shield training roads.'},
    range:{name:'Thornfall Wilds',icon:'🏹',x:363,y:59,r:63,biome:'darkgrass',road:'path',accent:'farmland',resourceBias:['tree','pine','berry','herb'],desc:'Large hunting forest with long sightlines, scout paths, raised tree lines, and ranged skirmish lanes.'},
    mage:{name:'Moonspire Ruins',icon:'🔮',x:217,y:293,r:60,biome:'stone',road:'stonepath',accent:'plaza',resourceBias:['silver','gem','herb'],desc:'Massive ruin basin with stepped stone platforms, gem pockets, ritual roads, and enchantment materials.'},
    wanderer:{name:'Central Crossroads',icon:'🧭',x:250,y:200,r:47,biome:'grass',road:'stonepath',accent:'plaza',resourceBias:['tree','berry','fish'],desc:'Neutral central hub where all roads eventually meet and future trading, banking, and world travel expands.'},
    brawler:{name:'Bloodoak Pits',icon:'🥊',x:72,y:291,r:57,biome:'dirt',road:'path',accent:'plaza',resourceBias:['rock','tree','hide'],desc:'Expanded southern fight camp with rough arena pits, red dirt layers, and bruiser training territory.'},
    gatherer:{name:'Greenroot Grove',icon:'🌲',x:362,y:289,r:67,biome:'grass',road:'path',accent:'farmland',resourceBias:['tree','pine','yew','berry'],desc:'Resource-rich woodland province for skilling, crafting, building, and deep resource progression.'},
    prospector:{name:'Stonehook Quarry',icon:'⛏️',x:63,y:173,r:62,biome:'stone',road:'stonepath',accent:'dirt',resourceBias:['rock','copper','iron','gold'],desc:'Wide mining corridor with terraced ore shelves, stone roads, rare mineral pockets, and economy routes.'},
    cleric:{name:'Sanctum Shoals',icon:'✨',x:370,y:173,r:58,biome:'sand',road:'stonepath',accent:'plaza',resourceBias:['herb','fish','silver'],desc:'Sacred shoreline region with healing gardens, tide roads, herb pockets, and support-class safe routes.'},
    warden:{name:'Verdant Bulwark',icon:'🌿',x:217,y:51,r:60,biome:'darkgrass',road:'path',accent:'fence',resourceBias:['tree','herb','rock'],desc:'Northern defensive forest wall with layered watch paths, tank/support claim zones, and guardian resources.'}
  };
  US.getStarterZone = id => US.STARTER_ZONES[id] || US.STARTER_ZONES.wanderer;

  US.CLASS_STORIES = {
    melee:{title:'The Ironwake Oath',theme:'Hold the line, protect the roads, and prove who owns the battlefield.',starterQuest:'class_melee_oath'},
    range:{title:'The Thornfall Hunt',theme:'Scout the wilds, recover arrows, and control forest routes before the enemy does.',starterQuest:'class_range_hunt'},
    mage:{title:'The Moonspire Spark',theme:'Study the ruins, gather channeling materials, and unlock the first taste of old magic.',starterQuest:'class_mage_spark'},
    wanderer:{title:'The Nine-Road Calling',theme:'Learn the roads, survive the open map, and become the bridge between every starter region.',starterQuest:'class_wanderer_roads'},
    brawler:{title:'Bloodoak Trial by Dirt',theme:'Fight dirty, win clean, and earn respect in the red pit camps.',starterQuest:'class_brawler_trial'},
    gatherer:{title:'Greenroot First Harvest',theme:'Build the economy from the dirt up: chop, gather, craft, and feed the world.',starterQuest:'class_gatherer_harvest'},
    prospector:{title:'The Stonehook Claim',theme:'Mine the old shelves, find ore, and turn raw rock into power and trade.',starterQuest:'class_prospector_claim'},
    cleric:{title:'Sanctum Light',theme:'Keep people alive, gather herbs, and prepare the support path for future group content.',starterQuest:'class_cleric_light'},
    warden:{title:'Verdant Watch',theme:'Defend the grove roads, gather wood, and become the shield between town and chaos.',starterQuest:'class_warden_watch'}
  };
  US.getClassStory = id => US.CLASS_STORIES[id] || US.CLASS_STORIES.wanderer;

  US.ZONE_FEATURES = {
    melee:{trainer:'Marshal Bren',trainerIcon:'🛡️',trainingMob:'goblin',arena:'Ironwake Champion Yard',landmark:'Twin Anvil Gate'},
    range:{trainer:'Scout Veya',trainerIcon:'🏹',trainingMob:'rat',arena:'Thornfall Hunt Ring',landmark:'The Watcher Pines'},
    mage:{trainer:'Archivist Sol',trainerIcon:'🔮',trainingMob:'husk',arena:'Moonspire Ritual Ring',landmark:'The Broken Spire'},
    wanderer:{trainer:'Roadwarden Milo',trainerIcon:'🧭',trainingMob:'rat',arena:'Crossroads Trial Circle',landmark:'The Nine-Road Stone'},
    brawler:{trainer:'Bruiser Knox',trainerIcon:'🥊',trainingMob:'goblin',arena:'Bloodoak Pit Ring',landmark:'The Red Oak Stump'},
    gatherer:{trainer:'Maela Greenhand',trainerIcon:'🌲',trainingMob:'rat',arena:'Greenroot Grove Circle',landmark:'The Elder Root'},
    prospector:{trainer:'Foreman Brigg',trainerIcon:'⛏️',trainingMob:'goblin',arena:'Stonehook Claim Pit',landmark:'The Split Quarry'},
    cleric:{trainer:'Sister Luma',trainerIcon:'✨',trainingMob:'husk',arena:'Sanctum Blessing Circle',landmark:'The Tide Shrine'},
    warden:{trainer:'Keeper Orin',trainerIcon:'🌿',trainingMob:'goblin',arena:'Verdant Bulwark Ring',landmark:'The Living Wall'}
  };

  US.getZoneFeature = id => US.ZONE_FEATURES[id] || US.ZONE_FEATURES.wanderer;

  US.CLASS_QUESTS = {
    class_melee_oath:{name:'The Ironwake Oath',icon:'⚔️',classId:'melee',desc:'Your melee path begins by arming up, gathering field supplies, and clearing the first threat near Ironwake Hold.',steps:[{type:'collect',id:'log',qty:2,text:'Collect 2 Oak Logs for weapon maintenance'},{type:'kill',id:'goblin',qty:2,text:'Defeat 2 Goblin Raiders near Ironwake'}],rewards:{xp:{combat:90,survival:35},items:{coin:60,health_salve:1}}},
    class_range_hunt:{name:'The Thornfall Hunt',icon:'🏹',classId:'range',desc:'Your ranger path begins with forest supplies, arrow discipline, and a controlled hunt around Thornfall Wilds.',steps:[{type:'collect',id:'berry',qty:3,text:'Gather 3 Wild Berries for trail food'},{type:'kill',id:'rat',qty:3,text:'Defeat 3 training beasts from range'}],rewards:{xp:{combat:75,foraging:55},items:{coin:55,arrow:15}}},
    class_mage_spark:{name:'The Moonspire Spark',icon:'🔮',classId:'mage',desc:'Your mage path begins by gathering herbs and testing your first spells against the dusk-touched dead.',steps:[{type:'collect',id:'herb',qty:2,text:'Collect 2 Bitter Herbs for spell focus'},{type:'kill',id:'husk',qty:1,text:'Defeat 1 Husk near Moonspire'}],rewards:{xp:{combat:80,crafting:45},items:{coin:60,dusk_essence:1}}},
    class_wanderer_roads:{name:'The Nine-Road Calling',icon:'🧭',classId:'wanderer',desc:'Your wanderer path begins by learning the central roads and preparing to travel between every starter region.',steps:[{type:'collect',id:'berry',qty:2,text:'Collect 2 Wild Berries'},{type:'collect',id:'log',qty:2,text:'Collect 2 Oak Logs'}],rewards:{xp:{survival:70,foraging:40},items:{coin:50,torch:2}}},
    class_brawler_trial:{name:'Bloodoak Trial by Dirt',icon:'🥊',classId:'brawler',desc:'Your brawler path starts in the pits. Get supplies, take hits, and prove you can finish fights.',steps:[{type:'kill',id:'goblin',qty:2,text:'Defeat 2 Goblin Raiders near Bloodoak Pits'},{type:'collect',id:'hide',qty:1,text:'Collect 1 Torn Hide'}],rewards:{xp:{combat:95,survival:25},items:{coin:55,health_salve:1}}},
    class_gatherer_harvest:{name:'Greenroot First Harvest',icon:'🌲',classId:'gatherer',desc:'Your gatherer path starts with resources, crafting foundations, and the first real economy loop.',steps:[{type:'collect',id:'log',qty:5,text:'Collect 5 Oak Logs'},{type:'collect',id:'berry',qty:3,text:'Collect 3 Wild Berries'}],rewards:{xp:{woodcutting:90,crafting:45,foraging:35},items:{coin:45,stone:3}}},
    class_prospector_claim:{name:'The Stonehook Claim',icon:'⛏️',classId:'prospector',desc:'Your prospector path begins by pulling value from stone and preparing for smithing and trade.',steps:[{type:'collect',id:'stone',qty:4,text:'Mine 4 Stone'},{type:'collect',id:'copper_ore',qty:1,text:'Mine 1 Copper Ore'}],rewards:{xp:{mining:110,crafting:30},items:{coin:70}}},
    class_cleric_light:{name:'Sanctum Light',icon:'✨',classId:'cleric',desc:'Your cleric path begins with healing supplies and clearing corruption from the sacred shoals.',steps:[{type:'collect',id:'herb',qty:3,text:'Collect 3 Bitter Herbs'},{type:'kill',id:'husk',qty:1,text:'Defeat 1 Husk near the Sanctum'}],rewards:{xp:{foraging:60,combat:55,crafting:45},items:{coin:50,health_salve:2}}},
    class_warden_watch:{name:'Verdant Watch',icon:'🌿',classId:'warden',desc:'Your warden path begins by gathering defensive materials and pushing threats away from the northern wall.',steps:[{type:'collect',id:'log',qty:3,text:'Collect 3 Oak Logs for barricades'},{type:'kill',id:'goblin',qty:1,text:'Defeat 1 Goblin Raider near Verdant Bulwark'}],rewards:{xp:{combat:65,woodcutting:55,survival:35},items:{coin:55,health_salve:1}}}
  };
})();

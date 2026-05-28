(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.ITEMS = {
    coin:{name:'Gold Coin',icon:'🪙',stack:true,type:'currency',desc:'The old world still loves shiny things.',value:1},
    arrow:{name:'Arrow',icon:'➶',stack:true,type:'ammo',desc:'Basic ranged ammo. Most fired arrows can be recovered from the ground.',value:1},
    class_token:{name:'Class Token',icon:'🎟️',stack:true,type:'quest',tier:1,rarity:'rare',desc:'A proof-of-training token used by class trainers.',value:25},
    epic_cache:{name:'Epic Loot Cache',icon:'🟪',stack:false,type:'lootbox',rarity:'epic',desc:'Dungeon-grade loot cache. Boss reward foundation item.',value:250},
    mythic_cache:{name:'Mythic Loot Cache',icon:'🟥',stack:false,type:'lootbox',rarity:'mythic',desc:'High-end boss reward cache for rare class gear.',value:650},
    legendary_cache:{name:'Legendary Loot Cache',icon:'🟨',stack:false,type:'lootbox',rarity:'legendary',desc:'Ultra-rare world boss reward cache.',value:1500},

    log:{name:'Oak Log',icon:'🪵',stack:true,type:'material',tier:1,desc:'Useful for crafting and campfires.',value:3},
    pine_log:{name:'Pine Log',icon:'🪵',stack:true,type:'material',tier:2,desc:'Better wood for stronger early builds.',value:7},
    yew_log:{name:'Yew Log',icon:'🪵',stack:true,type:'material',tier:3,desc:'Rare flexible wood for bows and upgraded structures.',value:18},
    copper_ore:{name:'Copper Ore',icon:'🟠',stack:true,type:'material',tier:1,desc:'Starter ore for early smithing.',value:8},
    silver_ore:{name:'Silver Ore',icon:'⚪',stack:true,type:'material',tier:2,desc:'Useful for jewelry and enchantment bases.',value:18},
    gold_ore:{name:'Gold Ore',icon:'🟡',stack:true,type:'material',tier:3,desc:'Valuable ore used for jewelry and trading.',value:35},
    raw_fish:{name:'Raw Fish',icon:'🐟',stack:true,type:'food',tier:1,desc:'Can be cooked later into better food.',hunger:8,value:6},
    raw_trout:{name:'Raw Trout',icon:'🐟',stack:true,type:'food',tier:2,desc:'Better fish from richer waters.',hunger:14,value:13},
    emerald:{name:'Emerald',icon:'💚',stack:true,type:'gem',tier:2,desc:'Gem used for jewelry and enchantments.',value:55},
    ruby:{name:'Ruby',icon:'❤️',stack:true,type:'gem',tier:3,desc:'Rare gem used for stronger enchantments.',value:95},
    stone:{name:'Stone',icon:'🪨',stack:true,type:'material',desc:'A basic building and crafting material.',value:2},
    berry:{name:'Wild Berry',icon:'🫐',stack:true,type:'food',desc:'Restores a little hunger.',hunger:10,value:2},
    cooked_berry:{name:'Berry Stew',icon:'🥣',stack:true,type:'food',desc:'Warm, sweet, and safer than raw berries.',hunger:24,value:8},
    herb:{name:'Bitter Herb',icon:'🌿',stack:true,type:'material',desc:'Used for simple healing salves.',value:7},
    iron_ore:{name:'Iron Ore',icon:'⛓️',stack:true,type:'material',tier:2,desc:'Ore for better tools and weapons.',value:12},
    hide:{name:'Torn Hide',icon:'🥾',stack:true,type:'material',desc:'Rough monster hide.',value:5},
    bone:{name:'Bone Shard',icon:'🦴',stack:true,type:'material',desc:'Sharp, grim crafting material.',value:4},
    dusk_essence:{name:'Dusk Essence',icon:'🟣',stack:true,type:'material',desc:'Strange energy from night creatures.',value:25},

    crude_sword:{name:'Crude Sword',icon:'🗡️',stack:false,type:'weapon',slot:'weapon',desc:'Better than punching shadows.',value:35},
    iron_sword:{name:'Iron Sword',icon:'⚔️',stack:false,type:'weapon',slot:'weapon',desc:'A reliable blade.',value:120},
    wooden_shield:{name:'Wooden Shield',icon:'🛡️',stack:false,type:'armor',slot:'offhand',desc:'Blocks a bit of pain.',value:32},
    hide_armor:{name:'Hide Armor',icon:'🥋',stack:false,type:'armor',slot:'body',desc:'Light protection from claws.',value:60},
    iron_armor:{name:'Iron Armor',icon:'🛡️',stack:false,type:'armor',slot:'body',desc:'Heavy, but dependable.',value:210},

    training_bow:{name:'Training Bow',icon:'🏹',stack:false,type:'weapon',slot:'weapon',combatStyle:'range',desc:'A simple bow for ranged survival.',value:45},
x    hunter_bow:{name:'Hunter Bow',icon:'🏹',stack:false,type:'weapon',slot:'weapon',combatStyle:'range',desc:'A stronger bow for island skirmishes.',value:140},
    oak_staff:{name:'Oak Staff',icon:'🪄',stack:false,type:'weapon',slot:'weapon',combatStyle:'mage',desc:'A basic channeling staff for magic attacks.',value:50},
    ember_staff:{name:'Ember Staff',icon:'🔥',stack:false,type:'weapon',slot:'weapon',combatStyle:'mage',desc:'A staff humming with warm ember energy.',value:165},
    leather_hood:{name:'Leather Hood',icon:'🧢',stack:false,type:'armor',slot:'head',desc:'Light ranged headgear.',value:55},
    ranger_tunic:{name:'Ranger Tunic',icon:'🥋',stack:false,type:'armor',slot:'body',desc:'Light armor made for movement and aim.',value:125},
    apprentice_hood:{name:'Apprentice Hood',icon:'🧙',stack:false,type:'armor',slot:'head',desc:'Simple mage headwear stitched with old symbols.',value:60},
    apprentice_robe:{name:'Apprentice Robe',icon:'🥻',stack:false,type:'armor',slot:'body',desc:'Light magical robes for early spellcasters.',value:135},
    bronze_helm:{name:'Bronze Helm',icon:'🪖',stack:false,type:'armor',slot:'head',desc:'A basic melee helm.',value:70},

    stone_hatchet:{name:'Stone Hatchet',icon:'🪓',stack:false,type:'tool',slot:'tool',skill:'woodcutting',desc:'Chops trees a little faster.',value:25},
    iron_pickaxe:{name:'Iron Pickaxe',icon:'⛏️',stack:false,type:'tool',slot:'tool',skill:'mining',desc:'Bites deeper into stone and ore.',value:80},

    torch:{name:'Torch',icon:'🔥',stack:true,type:'utility',desc:'A little comfort when dusk arrives.',value:6},
    health_salve:{name:'Health Salve',icon:'🧪',stack:true,type:'consumable',desc:'Restores health.',heal:28,value:18},
    campfire:{name:'Campfire Kit',icon:'🏕️',stack:true,type:'utility',desc:'Can cook food and keep the dark away.',value:15},

    old_mule_whistle:{name:'Old Mule Whistle',icon:'🐴',stack:false,type:'mount',rarity:'rare',desc:'Summons a sturdy starter mule. Mount system foundation.',moveBonus:.12,value:350},
    dusk_wolf_pup:{name:'Dusk Wolf Pup',icon:'🐺',stack:false,type:'pet',rarity:'rare',desc:'A loyal combat pet foundation companion.',bonus:{attack:1},value:420},
    ember_sprite:{name:'Ember Sprite',icon:'✨',stack:false,type:'pet',rarity:'epic',desc:'A tiny support pet that hums with warm energy.',bonus:{wisdom:1},value:700}
  };
})();

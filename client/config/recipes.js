(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.RECIPES = [
    {
      id:'campfire', name:'Campfire Kit', icon:'🏕️', skill:'survival', level:1, xp:12,
      requires:{log:2,stone:1}, produces:{campfire:1}, station:null,
      desc:'Craft a portable campfire kit.'
    },
    {
      id:'cooked_berry', name:'Berry Stew', icon:'🥣', skill:'cooking', level:1, xp:16,
      requires:{berry:2,log:1}, produces:{cooked_berry:1}, station:null,
      desc:'Cook berries into a better meal.'
    },
    {
      id:'health_salve', name:'Health Salve', icon:'🧪', skill:'crafting', level:2, xp:26,
      requires:{herb:2,berry:1}, produces:{health_salve:1}, station:null,
      desc:'A simple restorative salve.'
    },
    {
      id:'crude_sword', name:'Crude Sword', icon:'🗡️', skill:'crafting', level:2, xp:38,
      requires:{log:1,stone:3}, produces:{crude_sword:1}, station:null,
      desc:'Basic melee weapon.'
    },
    {
      id:'wooden_shield', name:'Wooden Shield', icon:'🛡️', skill:'crafting', level:2, xp:32,
      requires:{log:4,hide:1}, produces:{wooden_shield:1}, station:null,
      desc:'Basic offhand defense.'
    },
    {
      id:'stone_hatchet', name:'Stone Hatchet', icon:'🪓', skill:'crafting', level:2, xp:30,
      requires:{log:1,stone:2}, produces:{stone_hatchet:1}, station:null,
      desc:'Improves woodcutting.'
    },
    {
      id:'leather_hood', name:'Leather Hood', icon:'🧢', skill:'crafting', level:2, xp:42,
      requires:{hide:3,log:1}, produces:{leather_hood:1}, station:null,
      desc:'Light ranged headgear with a small accuracy bonus.'
    },
    {
      id:'hide_armor', name:'Hide Armor', icon:'🥋', skill:'crafting', level:3, xp:60,
      requires:{hide:5,bone:2}, produces:{hide_armor:1}, station:null,
      desc:'Light body armor.'
    },
    {
      id:'ranger_tunic', name:'Ranger Tunic', icon:'🥋', skill:'crafting', level:4, xp:88,
      requires:{hide:6,log:2,bone:2}, produces:{ranger_tunic:1}, station:null,
      desc:'Light armor for range builds. Adds accuracy and movement.'
    },
    {
      id:'iron_pickaxe', name:'Iron Pickaxe', icon:'⛏️', skill:'crafting', level:4, xp:80,
      requires:{iron_ore:4,log:1}, produces:{iron_pickaxe:1}, station:null,
      desc:'Improves mining.'
    },
    {
      id:'training_bow', name:'Training Bow', icon:'🏹', skill:'crafting', level:3, xp:70,
      requires:{log:4,hide:1}, produces:{training_bow:1}, station:null,
      desc:'Basic ranged weapon for safer kiting.'
    },
    {
      id:'oak_staff', name:'Oak Staff', icon:'🪄', skill:'crafting', level:3, xp:72,
      requires:{log:3,herb:2}, produces:{oak_staff:1}, station:null,
      desc:'Basic magic weapon for distance attacks.'
    },
    {
      id:'iron_sword', name:'Iron Sword', icon:'⚔️', skill:'crafting', level:5, xp:115,
      requires:{iron_ore:6,log:1}, produces:{iron_sword:1}, station:null,
      desc:'Reliable combat weapon.'
    },
    {
      id:'iron_armor', name:'Iron Armor', icon:'🛡️', skill:'crafting', level:6, xp:165,
      requires:{iron_ore:12,hide:3}, produces:{iron_armor:1}, station:null,
      desc:'Strong body armor.'
    },
    {
      id:'torch', name:'Torch', icon:'🔥', skill:'survival', level:1, xp:8,
      requires:{log:1,herb:1}, produces:{torch:2}, station:null,
      desc:'Useful light source and vendor item.'
    }
  ];

  D.getRecipe = id => D.RECIPES.find(r=>r.id===id);
})();
</script>
<script>

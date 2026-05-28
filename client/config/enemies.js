(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.ENEMIES = {
    rat:{
      name:'Giant Rat', icon:'🐀', color:'#8b6f5a',
      hp:18, attack:2, defense:0, accuracy:.48, speed:54, aggro:105, attackRange:32, attackCooldown:1.45,
      xp:18, coins:[1,6], loot:[{id:'hide',min:1,max:1,chance:.25},{id:'bone',min:1,max:1,chance:.2}],
      day:true, night:true
    },
    husk:{
      name:'Husk', icon:'☠️', color:'#9da6b8',
      hp:34, attack:4, defense:1, accuracy:.56, speed:66, aggro:165, attackRange:36, attackCooldown:1.55,
      xp:35, coins:[3,12], loot:[{id:'bone',min:1,max:3,chance:.65},{id:'hide',min:1,max:2,chance:.35},{id:'hide_armor',min:1,max:1,chance:.05},{id:'oak_staff',min:1,max:1,chance:.04}],
      day:false, night:true
    },
    lurker:{
      name:'Lurker', icon:'👁️', color:'#7b61ff',
      hp:56, attack:6, defense:2, accuracy:.60, speed:78, aggro:205, attackRange:40, attackCooldown:1.35,
      xp:68, coins:[8,24], loot:[{id:'dusk_essence',min:1,max:2,chance:.45},{id:'bone',min:2,max:4,chance:.6},{id:'hunter_bow',min:1,max:1,chance:.05},{id:'apprentice_hood',min:1,max:1,chance:.05}],
      day:false, night:true
    },
    nightstalker:{
      name:'Nightstalker', icon:'🦇', color:'#34204f',
      hp:95, attack:9, defense:4, accuracy:.64, speed:92, aggro:260, attackRange:44, attackCooldown:1.2,
      xp:130, coins:[18,55], loot:[{id:'dusk_essence',min:2,max:5,chance:.8},{id:'health_salve',min:1,max:1,chance:.22},{id:'iron_sword',min:1,max:1,chance:.08},{id:'iron_armor',min:1,max:1,chance:.045},{id:'ember_staff',min:1,max:1,chance:.05}],
      day:false, night:true, elite:true
    },
    goblin:{
      name:'Goblin Raider', icon:'🧌', color:'#5aa35f',
      hp:44, attack:4, defense:1, accuracy:.57, speed:68, aggro:175, attackRange:38, attackCooldown:1.45,
      xp:52, coins:[6,18], loot:[{id:'hide',min:1,max:2,chance:.55},{id:'bone',min:1,max:2,chance:.35},{id:'crude_sword',min:1,max:1,chance:.10},{id:'wooden_shield',min:1,max:1,chance:.06},{id:'leather_hood',min:1,max:1,chance:.05}],
      day:true, night:true
    }
  };

  D.SPAWN_TABLES = {
    day:[
      {id:'rat',w:82},
      {id:'goblin',w:18}
    ],
    night:[
      {id:'rat',w:20},
      {id:'goblin',w:24},
      {id:'husk',w:34},
      {id:'lurker',w:17},
      {id:'nightstalker',w:2}
    ]
  };

  D.weightedPick = function(list){
    const total = list.reduce((a,b)=>a+b.w,0);
    let r = Math.random()*total;
    for(const it of list){ r -= it.w; if(r<=0) return it.id; }
    return list[list.length-1].id;
  };
})();

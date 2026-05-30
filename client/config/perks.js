(function(){
  const US = window.UnkScape = window.UnkScape || {};
  US.PERKS = {
    light_footed:{name:'Light Footed',icon:'👟',desc:'+5% movement speed.', apply:p=>p.mods.moveSpeed=(p.mods.moveSpeed||0)+.05},
    thick_skin:{name:'Thick Skin',icon:'💪',desc:'+3 defense.', apply:p=>p.mods.defense=(p.mods.defense||0)+3},
    keen_eye:{name:'Keen Eye',icon:'👁️',desc:'+10% chance for extra gathered resources.', apply:p=>p.mods.extraGather=(p.mods.extraGather||0)+.10},
    coin_sense:{name:'Coin Sense',icon:'🪙',desc:'+15% coins from enemies.', apply:p=>p.mods.coinBonus=(p.mods.coinBonus||0)+.15},
    night_owl:{name:'Night Owl',icon:'🦉',desc:'Reduced night hunger drain.', apply:p=>p.mods.nightHunger=(p.mods.nightHunger||0)+.25},
    iron_grip:{name:'Iron Grip',icon:'✊',desc:'+5% melee accuracy.', apply:p=>p.mods.accuracy=(p.mods.accuracy||0)+.05},
    efficient_crafter:{name:'Efficient Crafter',icon:'🧵',desc:'10% chance not to consume one material.', apply:p=>p.mods.craftSave=(p.mods.craftSave||0)+.10},
    herbalist:{name:'Herbalist',icon:'🌿',desc:'Healing items restore +20%.', apply:p=>p.mods.healBonus=(p.mods.healBonus||0)+.20},
    lumberjack:{name:'Lumberjack',icon:'🪓',desc:'+1 woodcutting tool power.', apply:p=>p.mods.woodcutting=(p.mods.woodcutting||0)+1},
    stoneblood:{name:'Stoneblood',icon:'🪨',desc:'+1 mining tool power and +1 defense.', apply:p=>{p.mods.mining=(p.mods.mining||0)+1;p.mods.defense=(p.mods.defense||0)+1}}
  };

  US.PERK_LEVELS = [
    {skill:'combat',level:3,perk:'iron_grip'},
    {skill:'combat',level:5,perk:'stoneblood'},
    {skill:'survival',level:3,perk:'night_owl'},
    {skill:'crafting',level:4,perk:'efficient_crafter'},
    {skill:'foraging',level:4,perk:'herbalist'},
    {skill:'woodcutting',level:4,perk:'lumberjack'}
  ];
})();

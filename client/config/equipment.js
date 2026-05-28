(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.EQUIPMENT = {
    fists:{name:'Fists',slot:'weapon',attack:1,accuracy:.62,speed:1.15,range:42},
    crude_sword:{name:'Crude Sword',slot:'weapon',attack:4,accuracy:.72,speed:1.0,range:50},
    iron_sword:{name:'Iron Sword',slot:'weapon',attack:8,accuracy:.78,speed:.92,range:54},
    wooden_shield:{name:'Wooden Shield',slot:'offhand',defense:3,block:.08},
    hide_armor:{name:'Hide Armor',slot:'body',defense:4,block:.03},
    iron_armor:{name:'Iron Armor',slot:'body',defense:9,block:.07,movePenalty:.04},
    bronze_helm:{name:'Bronze Helm',slot:'head',defense:3,block:.02},
    training_bow:{name:'Training Bow',slot:'weapon',attack:4,accuracy:.74,speed:1.05,range:165,style:'range'},
    hunter_bow:{name:'Hunter Bow',slot:'weapon',attack:8,accuracy:.80,speed:.96,range:195,style:'range'},
    oak_staff:{name:'Oak Staff',slot:'weapon',attack:5,accuracy:.70,speed:1.12,range:145,style:'mage'},
    ember_staff:{name:'Ember Staff',slot:'weapon',attack:10,accuracy:.76,speed:1.02,range:170,style:'mage'},
    leather_hood:{name:'Leather Hood',slot:'head',defense:1,accuracy:.02},
    ranger_tunic:{name:'Ranger Tunic',slot:'body',defense:3,accuracy:.03,movePenalty:-.02},
    apprentice_hood:{name:'Apprentice Hood',slot:'head',defense:1,accuracy:.03},
    apprentice_robe:{name:'Apprentice Robe',slot:'body',defense:2,accuracy:.04},
    stone_hatchet:{name:'Stone Hatchet',slot:'tool',woodcutting:2},
    iron_pickaxe:{name:'Iron Pickaxe',slot:'tool',mining:3}
  };

  D.STAT_BASE = {
    hp:100,
    attack:1,
    defense:0,
    accuracy:.62,
    attackSpeed:1.15,
    range:42,
    moveSpeed:180,
    hungerMax:100,
    healingPower:0,
    supportPower:0,
    critChance:.08,
    critDamage:1.65
  };

  D.ATTRIBUTES = {
    vitality:{name:'Vitality',icon:'❤️',desc:'+HP and tank survival.'},
    strength:{name:'Strength',icon:'💪',desc:'+melee damage and block pressure.'},
    dexterity:{name:'Dexterity',icon:'🎯',desc:'+range accuracy, movement, and crit.'},
    intellect:{name:'Intellect',icon:'🔮',desc:'+magic damage and spell accuracy.'},
    wisdom:{name:'Wisdom',icon:'🌿',desc:'+healing and support power.'},
    endurance:{name:'Endurance',icon:'🛡️',desc:'+defense and stamina style survival.'},
    luck:{name:'Luck',icon:'🍀',desc:'+crit chance, rare drops, and gathering luck.'}
  };

  D.CLASS_ROLES = {
    melee:'Tank / Melee DPS', range:'Ranged DPS', mage:'Magic DPS', wanderer:'Hybrid', brawler:'Bruiser DPS', gatherer:'Skiller Support', prospector:'Economy Support', cleric:'Healer', warden:'Tank Support'
  };

  D.xpForCharacterLevel=function(level){
    if(level<=1)return 0;
    return Math.floor(75*Math.pow(level-1,1.85)+(level-1)*45);
  };
  D.characterLevelForXp=function(xp){
    let lvl=1;
    while(lvl<60 && xp>=D.xpForCharacterLevel(lvl+1))lvl++;
    return lvl;
  };
  D.defaultAttributes=function(role='hybrid'){
    const base={vitality:5,strength:5,dexterity:5,intellect:5,wisdom:5,endurance:5,luck:5};
    if(role==='tank'){base.vitality+=3;base.endurance+=3;base.strength+=1;}
    if(role==='melee'){base.strength+=4;base.endurance+=2;base.vitality+=1;}
    if(role==='range'){base.dexterity+=5;base.luck+=1;base.vitality+=1;}
    if(role==='mage'){base.intellect+=5;base.wisdom+=1;base.luck+=1;}
    if(role==='healer'){base.wisdom+=5;base.vitality+=2;base.intellect+=1;}
    if(role==='support'){base.wisdom+=3;base.endurance+=2;base.luck+=2;}
    if(role==='skiller'){base.luck+=3;base.endurance+=2;base.dexterity+=1;}
    return base;
  };

  D.getEquipmentStats = function(player){
    const out = {...D.STAT_BASE};
    const eq = player.equipment || {};
    const weapon = D.EQUIPMENT[eq.weapon] || D.EQUIPMENT.fists;
    const attr = player.attributes || D.defaultAttributes(player.roleType || 'hybrid');
    out.attack += weapon.attack || 0;
    out.attack += Math.floor((attr.strength||0)*.35) + Math.floor((attr.intellect||0)*.20);
    out.defense += Math.floor((attr.endurance||0)*.45);
    out.hp += Math.floor((attr.vitality||0)*5);
    out.healingPower += Math.floor((attr.wisdom||0)*.65);
    out.supportPower += Math.floor(((attr.wisdom||0)+(attr.luck||0))*.35);
    out.critChance += Math.min(.22,(attr.luck||0)*.006 + (attr.dexterity||0)*.004);
    out.moveSpeed += Math.floor((attr.dexterity||0)*1.5);
    out.accuracy = weapon.accuracy || out.accuracy;
    out.attackSpeed = weapon.speed || out.attackSpeed;
    out.range = weapon.range || out.range;

    ['head','offhand','body','tool'].forEach(slot=>{
      const item = eq[slot] && D.EQUIPMENT[eq[slot]];
      if(!item) return;
      out.defense += item.defense || 0;
      out.block = (out.block||0) + (item.block||0);
      out.moveSpeed -= out.moveSpeed * (item.movePenalty||0);
      if(item.accuracy) out.accuracy += item.accuracy;
      if(item.woodcutting) out.woodcutting = (out.woodcutting||0)+item.woodcutting;
      if(item.mining) out.mining = (out.mining||0)+item.mining;
    });
    return out;
  };

  D.CLASSES = D.CLASSES || {
    wanderer:{
      name:'Wanderer', icon:'🧭',
      desc:'Balanced survivor with extra supplies.',
      items:{log:3,berry:4,torch:2,coin:25},
      skills:{survival:30,foraging:20},
      perks:['Light Footed']
    },
    brawler:{
      name:'Brawler', icon:'🥊',
      desc:'Starts tougher and ready to fight.',
      items:{crude_sword:1,health_salve:2,coin:10},
      skills:{combat:60,survival:15},
      equipment:{weapon:'crude_sword'},
      perks:['Thick Skin']
    },
    gatherer:{
      name:'Gatherer', icon:'🌲',
      desc:'Best start for skilling and crafting.',
      items:{stone_hatchet:1,log:5,stone:5,berry:3,coin:15},
      skills:{woodcutting:45,mining:25,crafting:20},
      equipment:{tool:'stone_hatchet'},
      perks:['Keen Eye']
    }
  };
})();

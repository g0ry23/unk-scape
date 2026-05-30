(function(){
  window.Duskfall = window.Duskfall || {};
const US = window.UnkScape = window.Duskfall;
  US.SKILLS = {
    combat: {
      name:'Combat', icon:'⚔️', color:'#ff5c7a',
      desc:'Melee fighting, damage, and survivability.',
      milestones: {2:'Power Strike unlocked',4:'Iron focus',7:'Veteran stance',10:'Duskbreaker'}
    },
    woodcutting: {
      name:'Woodcutting', icon:'🪓', color:'#63e6a4',
      desc:'Chop trees faster and harvest better wood.',
      milestones: {2:'Better hatchet grip',5:'Hardwood chance',8:'Tree sense'}
    },
    mining: {
      name:'Mining', icon:'⛏️', color:'#b8c0d8',
      desc:'Mine ore and stone resources.',
      milestones: {2:'Sharper swings',5:'Iron vein mastery',8:'Gem chance'}
    },
    cooking: {
      name:'Cooking', icon:'🍲', color:'#ffcf6e',
      desc:'Prepare food and reduce burn chance.',
      milestones: {2:'Less burning',5:'Hearty meals',8:'Feast prep'}
    },
    crafting: {
      name:'Crafting', icon:'🧰', color:'#6aa7ff',
      desc:'Create tools, armor, and utility items.',
      milestones: {2:'Basic gear',5:'Iron gear',8:'Reinforced kits'}
    },
    foraging: {
      name:'Foraging', icon:'🍄', color:'#b98cff',
      desc:'Gather berries, herbs, and wild supplies.',
      milestones: {2:'Extra berries',5:'Herb spotting',8:'Rare finds'}
    },
    survival: {
      name:'Survival', icon:'🔥', color:'#ff9b5c',
      desc:'Endure hunger, night, and the wilds.',
      milestones: {2:'Slower hunger',5:'Night resilience',8:'Wilderness veteran'}
    }
  };

  US.xpForLevel = function(level){
    // RuneScape-ish exponential, but tuned for prototype.
    if(level <= 1) return 0;
    let points = 0;
    for(let i=1;i<level;i++) points += Math.floor(i + 300 * Math.pow(2, i/7));
    return Math.floor(points / 4);
  };

  US.levelForXp = function(xp){
    let lvl=1;
    while(lvl < 99 && xp >= US.xpForLevel(lvl+1)) lvl++;
    return lvl;
  };

  US.rollSkillSuccess = function(level, difficulty){
    // difficulty 1..100. Higher level improves odds.
    const chance = Math.max(.08, Math.min(.95, .45 + (level*0.035) - (difficulty*0.008)));
    return Math.random() < chance;
  };
})();

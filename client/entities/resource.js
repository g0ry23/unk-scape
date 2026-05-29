(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.RESOURCE_TYPES = {
    tree:{name:'Oak Tree',item:'log',skill:'woodcutting',tier:1,level:1,xp:18,difficulty:18,color:'#2f7d46',amount:[2,5],respawn:24,action:'Chop'},
    pine:{name:'Pine Tree',item:'pine_log',skill:'woodcutting',tier:2,level:3,xp:34,difficulty:30,color:'#1f8f5f',amount:[2,4],respawn:38,action:'Chop'},
    yew:{name:'Yew Tree',item:'yew_log',skill:'woodcutting',tier:3,level:6,xp:72,difficulty:54,color:'#125f4b',amount:[1,3],respawn:65,action:'Chop'},
    rock:{name:'Stone Outcrop',item:'stone',skill:'mining',tier:1,level:1,xp:14,difficulty:16,color:'#7b8190',amount:[2,5],respawn:26,action:'Mine'},
    copper:{name:'Copper Vein',item:'copper_ore',skill:'mining',tier:1,level:1,xp:20,difficulty:22,color:'#b87443',amount:[1,4],respawn:36,action:'Mine'},
    iron:{name:'Iron Vein',item:'iron_ore',skill:'mining',tier:2,level:3,xp:32,difficulty:34,color:'#9d8a70',amount:[1,3],respawn:52,action:'Mine'},
    silver:{name:'Silver Vein',item:'silver_ore',skill:'mining',tier:2,level:4,xp:42,difficulty:40,color:'#c7ced8',amount:[1,3],respawn:62,action:'Mine'},
    gold:{name:'Gold Vein',item:'gold_ore',skill:'mining',tier:3,level:6,xp:68,difficulty:58,color:'#d9ad3f',amount:[1,2],respawn:78,action:'Mine'},
    gem:{name:'Gemstone Cluster',item:'emerald',altItem:'ruby',altChance:.18,skill:'mining',tier:3,level:7,xp:90,difficulty:64,color:'#4de0a1',amount:[1,2],respawn:95,action:'Mine'},
    berry:{name:'Berry Bush',item:'berry',skill:'foraging',tier:1,level:1,xp:12,difficulty:12,color:'#3e8d55',amount:[2,6],respawn:24,action:'Forage'},
    herb:{name:'Bitter Herb',item:'herb',skill:'foraging',tier:2,level:2,xp:22,difficulty:26,color:'#66b36a',amount:[1,3],respawn:42,action:'Forage'},
    fish:{name:'Fishing Spot',item:'raw_fish',altItem:'raw_trout',altChance:.22,skill:'foraging',tier:1,level:1,xp:16,difficulty:18,color:'#4aaee8',amount:[3,8],respawn:32,action:'Fish'}
  };
  D.createResource=function(type,x,y,uid){
    const cfg=D.RESOURCE_TYPES[type];
    return {uid:uid||D.uid('res'),kind:'resource',type,cfg,x,y,r:24,amount:D.irand(cfg.amount[0],cfg.amount[1]),cooldown:0,
      update(dt){if(this.amount<=0){this.cooldown-=dt;if(this.cooldown<=0){this.amount=D.irand(cfg.amount[0],cfg.amount[1]);}}}
    };
  };
  D.irand=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
})();

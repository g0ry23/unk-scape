(function(){
  window.Duskfall = window.Duskfall || {};
const US = window.UnkScape = window.Duskfall;
  US.NPCS = {
    elder:{
      name:'Elder Rowan', icon:'🧙', role:'Guide',
      lines:[
        'Dusk is not just a time here. It is a hunger.',
        'Gather by day. Survive by night. That is the first law.',
        'The old bank still stands. Use it before greed gets you killed.'
      ],
      options:[
        {label:'Any advice?', action:'advice'},
        {label:'Open quests', action:'quests'}
      ]
    },
    trader:{
      name:'Mira the Trader', icon:'🧺', role:'Shop',
      lines:['Coin still talks. Monsters listen too, but coin is friendlier.'],
      shop:{
        buy:['berry','cooked_berry','health_salve','torch','stone_hatchet','crude_sword','wooden_shield'],
        sellMultiplier:.55
      },
      options:[{label:'Trade', action:'shop'}]
    },
    banker:{
      name:'Vaultkeeper Ivo', icon:'🏦', role:'Bank',
      lines:['Deposit what you value. The night charges interest.'],
      options:[{label:'Open bank', action:'bank'}]
    }
  };
})();

(function(){
  const US = window.UnkScape = window.UnkScape || {};
  US.TILE = 32;
  US.WORLD = { w: 500, h: 400, pxW: 500*32, pxH: 400*32 }; // Official world: 16,000x12,800 px (500x400 tiles @ 32px/tile). Phase 2 resize.

  US.TILES = {
    grass:{name:'Grass',solid:false,color:'#25472d',variant:'#2f5a39',speed:1},
    darkgrass:{name:'Dark Grass',solid:false,color:'#1d3427',variant:'#284634',speed:1},
    dirt:{name:'Dirt',solid:false,color:'#4b3825',variant:'#5d432c',speed:1},
    path:{name:'Path',solid:false,color:'#6b563b',variant:'#7b6547',speed:1.08},
    water:{name:'Water',solid:true,color:'#143e5a',variant:'#1b587c',speed:.5},
    stone:{name:'Stone Floor',solid:false,color:'#424856',variant:'#505867',speed:.96},
    wall:{name:'Wall',solid:true,color:'#1a202c',variant:'#252d3b',speed:1},
    sand:{name:'Sand',solid:false,color:'#76633e',variant:'#887347',speed:.92},
    swamp:{name:'Swamp',solid:false,color:'#263822',variant:'#31452b',speed:.82},
    plaza:{name:'Town Plaza',solid:false,color:'#7d6a48',variant:'#9a835a',speed:1.08},
    stonepath:{name:'Stone Path',solid:false,color:'#5f6674',variant:'#737c8c',speed:1.1},
    woodfloor:{name:'Wood Floor',solid:false,color:'#6b4328',variant:'#805238',speed:1},
    roof:{name:'Town Roof',solid:true,color:'#2a1820',variant:'#422333',speed:1},
    fence:{name:'Fence',solid:true,color:'#3b2818',variant:'#5a3a22',speed:1},
    farmland:{name:'Farmland',solid:false,color:'#5d4524',variant:'#725730',speed:.95}
  };
})();

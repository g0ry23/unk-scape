(function(){
  const US = window.UnkScape = window.UnkScape || {};
  US.createNPC=function(id,x,y){
    const cfg=US.NPCS[id];
    return {uid:US.uid('npc'),kind:'npc',id,cfg,x,y,r:22,color:id==='banker'?'#f7c65b':id==='trader'?'#63e6a4':'#6aa7ff'};
  };
})();

(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.createNPC=function(id,x,y){
    const cfg=D.NPCS[id];
    return {uid:D.uid('npc'),kind:'npc',id,cfg,x,y,r:22,color:id==='banker'?'#f7c65b':id==='trader'?'#63e6a4':'#6aa7ff'};
  };
})();

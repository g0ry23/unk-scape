(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.LootSystem=function(game){this.game=game;};
  D.LootSystem.prototype.drop=function(id,qty,x,y){
    this.game.entities.drops.push({uid:D.uid('drop'),id,qty,x:x+(Math.random()-.5)*24,y:y+(Math.random()-.5)*24,r:10});
  };
  D.LootSystem.prototype.dropEnemy=function(e){
    const p=this.game.player;
    let [min,max]=e.cfg.coins||[0,0];let coins=D.irand(min,max);
    coins=Math.floor(coins*(1+(p.mods.coinBonus||0)));
    if(coins>0)this.drop('coin',coins,e.x,e.y);
    for(const l of e.cfg.loot||[]){if(Math.random()<l.chance)this.drop(l.id,D.irand(l.min,l.max),e.x,e.y);}
  };
})();
</script>
<script>

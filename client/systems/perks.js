(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.PerkSystem=function(game){this.game=game;};
  D.PerkSystem.prototype.reapply=function(){
    const p=this.game.player;if(!p)return;p.mods={};
    for(const id of p.perks||[]){D.PERKS[id]?.apply(p);} 
  };
  D.PerkSystem.prototype.unlock=function(id){
    const p=this.game.player;if(!D.PERKS[id]||p.perks.includes(id))return false;
    p.perks.push(id);this.reapply();this.game.ui.toast('Perk Unlocked',`${D.PERKS[id].icon} ${D.PERKS[id].name}`,'gold');return true;
  };
  D.PerkSystem.prototype.checkUnlocks=function(skill,level){
    D.PERK_LEVELS.filter(x=>x.skill===skill&&x.level<=level).forEach(x=>this.unlock(x.perk));
  };
})();
</script>
<script>

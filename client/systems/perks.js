(function(){
  window.Duskfall = window.Duskfall || {};
const US = window.UnkScape = window.Duskfall;
  US.PerkSystem=function(game){this.game=game;};
  US.PerkSystem.prototype.reapply=function(){
    const p=this.game.player;if(!p)return;p.mods={};
    for(const id of p.perks||[]){US.PERKS[id]?.apply(p);} 
  };
  US.PerkSystem.prototype.unlock=function(id){
    const p=this.game.player;if(!US.PERKS[id]||p.perks.includes(id))return false;
    p.perks.push(id);this.reapply();this.game.ui.toast('Perk Unlocked',`${US.PERKS[id].icon} ${US.PERKS[id].name}`,'gold');return true;
  };
  US.PerkSystem.prototype.checkUnlocks=function(skill,level){
    US.PERK_LEVELS.filter(x=>x.skill===skill&&x.level<=level).forEach(x=>this.unlock(x.perk));
  };
})();

(function(){
  const US = window.UnkScape = window.UnkScape || {};
  US.CraftingSystem=function(game){this.game=game;};
  US.CraftingSystem.prototype.canCraft=function(recipe){
    const p=this.game.player;
    if(!p||!recipe||!recipe.skill||!US.SKILLS[recipe.skill]) return false;
    if(!p.skills[recipe.skill]) p.skills[recipe.skill]={xp:0,level:1};
    const lvl=US.levelForXp(p.skills[recipe.skill].xp||0);
    return lvl>=recipe.level && this.game.systems.inventory.canAfford(recipe.requires);
  };
  US.CraftingSystem.prototype.craft=function(id){
    const r=US.getRecipe(id), g=this.game,p=g.player;if(!r||!p||!US.SKILLS[r.skill])return;
    if(!p.skills[r.skill]) p.skills[r.skill]={xp:0,level:1};
    const lvl=US.levelForXp(p.skills[r.skill].xp||0);
    if(lvl<r.level){g.ui.toast('Level too low',`${r.name} requires ${US.SKILLS[r.skill].name} level ${r.level}.`,'bad');return;}
    if(!g.systems.inventory.canAfford(r.requires)){g.ui.toast('Missing materials','You do not have the required items.','bad');return;}
    let req={...r.requires};
    if(Math.random()<(p.mods.craftSave||0)){
      const keys=Object.keys(req); if(keys.length){const k=keys[Math.floor(Math.random()*keys.length)]; req[k]=Math.max(0,req[k]-1); if(req[k]===0)delete req[k]; g.ui.log('Efficient Crafter saved a material!','gold');}
    }
    g.systems.inventory.take(req);
    Object.entries(r.produces).forEach(([it,qty])=>g.systems.inventory.add(it,qty));
    g.systems.skills.addXp(r.skill,r.xp);g.stats.crafted++;
    g.systems.quests.notify('craft',id,1);
    g.ui.toast('Crafted',`${r.icon} ${r.name}`,'good');g.ui.renderPanel();
  };
})();

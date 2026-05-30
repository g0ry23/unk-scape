(function(){
  const US = window.UnkScape = window.UnkScape || {};
  US.SkillSystem=function(game){this.game=game;};
  US.SkillSystem.prototype.addXp=function(skill,xp){
    const p=this.game.player,s=p.skills[skill];if(!s)return;
    const old=US.levelForXp(s.xp);s.xp+=xp;const lvl=US.levelForXp(s.xp);s.level=lvl;
    p.characterXp=(p.characterXp||0)+Math.max(1,Math.floor(xp*.35));
    const oldChar=p.characterLevel||1;
    p.characterLevel=US.characterLevelForXp(p.characterXp||0);
    if(p.characterLevel>oldChar){
      const gained=(p.characterLevel-oldChar)*3;
      p.attributePoints=(p.attributePoints||0)+gained;
      this.game.ui.toast('Character Level Up!',`Level ${p.characterLevel}. +${gained} attribute points earned. Open Character Stats with P.`, 'gold');
    }
    this.game.ui.floatText(p.x,p.y-44,`+${xp} ${US.SKILLS[skill].name} XP`,US.SKILLS[skill].color);
    if(lvl>old){this.game.ui.toast('Skill Level Up!',`${US.SKILLS[skill].name} is now level ${lvl}.`,'gold');this.game.systems.perks.checkUnlocks(skill,lvl);}
  };
  US.SkillSystem.prototype.gather=function(res){
    const p=this.game.player,cfg=res.cfg, level=US.levelForXp(p.skills[cfg.skill].xp), tool=p.stats()[cfg.skill]||0;
    if(level<cfg.level){this.game.ui.toast('Level too low',`${cfg.name} requires ${US.SKILLS[cfg.skill].name} level ${cfg.level}.`,'bad');return;}
    const ok=US.rollSkillSuccess(level+tool,cfg.difficulty);
    if(ok){
      let qty=1+(Math.random()<.12+((p.mods.extraGather||0))?1:0);
      qty=Math.min(qty,res.amount);res.amount-=qty;
      this.game.systems.inventory.add(cfg.item,qty);
      this.addXp(cfg.skill,cfg.xp*qty);
      this.game.stats.resourcesGathered+=qty;
      if(res.amount<=0){res.cooldown=cfg.respawn;this.game.ui.log(`${cfg.name} depleted.`, 'gold');}
    }else{this.game.ui.floatText(p.x,p.y-35,'Failed','#9aa8c7');this.addXp(cfg.skill,Math.max(1,Math.floor(cfg.xp*.15)));}
  };
})();

(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.SurvivalSystem=function(game){this.game=game;this.timer=0;};
  D.SurvivalSystem.prototype.update=function(dt){
    const g=this.game,p=g.player;if(!p||p.dead)return;
    if(!g.settings.hungerEnabled){p.hunger=p.maxHunger;return;}
    this.timer+=dt;
    const night=g.systems.daynight.isNight();
    const lvl=D.levelForXp(p.skills.survival.xp);
    let drain=(night?1.25:.72)*(1-Math.min(.35,(lvl-1)*.018));
    if(night) drain*=1-(p.mods.nightHunger||0);
    p.hunger=Math.max(0,p.hunger-drain*dt);
    if(p.hunger<=0 && this.timer>.8){this.timer=0;p.takeDamage(3,{name:'starvation'});g.ui.log('Starvation hurts. Eat something.','bad');}
    if(this.timer>10){this.timer=0;g.systems.skills.addXp('survival',night?4:2);}
  };
})();

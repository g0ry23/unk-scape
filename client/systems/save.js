(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.SaveSystem=function(game){this.game=game;this.key='unkscape.save.v1';};
  D.SaveSystem.prototype.data=function(){
    const g=this.game,p=g.player;
    return {version:1,seed:g.seed,time:g.time,flags:g.flags,stats:g.stats,classId:p.classId,factionId:p.factionId,
      player:{x:p.x,y:p.y,hp:p.hp,hunger:p.hunger,equipment:p.equipment,skills:p.skills,perks:p.perks,characterXp:p.characterXp,characterLevel:p.characterLevel,attributePoints:p.attributePoints,attributes:p.attributes,role:p.role},
      inventory:g.systems.inventory.toSave(),bank:g.systems.bank.toSave(),quests:g.systems.quests.toSave(),
      resources:{depleted:g.entities.resources.filter(r=>r.amount<=0).map(r=>r.uid)}
    };
  };
  D.SaveSystem.prototype.save=function(){localStorage.setItem(this.key,JSON.stringify(this.data()));this.game.ui.toast('Saved','Your progress is stored locally.','good');};
  D.SaveSystem.prototype.autosave=function(){if(this.game.state==='play'&&this.game.player&&!this.game.player.dead)localStorage.setItem(this.key,JSON.stringify(this.data()));};
  D.SaveSystem.prototype.load=function(){const raw=localStorage.getItem(this.key);if(!raw)return null;try{return JSON.parse(raw)}catch(e){return null}};
  D.SaveSystem.prototype.delete=function(){localStorage.removeItem(this.key);};
})();
</script>

<!-- UI overlays -->
<script>

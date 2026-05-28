(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.DayNightSystem=function(game){this.game=game;this.dayLength=300;};
  D.DayNightSystem.prototype.phase=function(){return (this.game.time%this.dayLength)/this.dayLength;};
  D.DayNightSystem.prototype.isNight=function(){const p=this.phase();return p>.62||p<.16;};
  D.DayNightSystem.prototype.nightAmount=function(){
    const p=this.phase();
    if(p>.62) return D.clamp((p-.62)/.16,0,1);
    if(p<.16) return D.clamp((.16-p)/.16,0,1);
    return 0;
  };
  D.DayNightSystem.prototype.label=function(){
    const p=this.phase();
    if(p<.16)return'Dawn'; if(p<.42)return'Day'; if(p<.62)return'Dusk'; if(p<.84)return'Night'; return'Deep Night';
  };
  D.DayNightSystem.prototype.update=function(){
    const is=this.isNight();
    if(this.game.flags.lastNight && !is){this.game.flags.survivedNights++;this.game.systems.quests.notify('surviveNight',null,1);this.game.ui.toast('Dawn Breaks','You survived the night.','gold');}
    if(!this.game.flags.lastNight && is){this.game.ui.toast('Night Falls','Hostile creatures grow stronger after dusk.','bad');}
    this.game.flags.lastNight=is;
  };
})();
</script>
<script>

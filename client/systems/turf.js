(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.TurfSystem=function(game){this.game=game;this.points=[];this.capture=null;this.seeded=false;this.owner={};};
  D.TurfSystem.prototype.ensure=function(){
    if(this.seeded||!this.game.world)return;this.seeded=true;
    Object.entries(D.STARTER_ZONES||{}).forEach(([classId,z])=>{
      const fids=D.getClassFactions(classId)||[];
      [[-6,-4],[6,4]].forEach((off,i)=>{
        const fid=fids[i]; if(!fid)return;
        this.points.push({id:`${classId}_${fid}_claim`,classId,factionId:fid,x:(z.x+off[0])*D.TILE+D.TILE/2,y:(z.y+off[1])*D.TILE+D.TILE/2,r:78,progress:0,owner:null,name:`${D.FACTIONS[fid].name} Claim Stone`});
      });
    });
  };
  D.TurfSystem.prototype.update=function(dt){
    this.ensure();
    const g=this.game,p=g.player;if(!p||g.paused)return;
    const near=this.points.find(pt=>Math.hypot(pt.x-p.x,pt.y-p.y)<pt.r);
    if(!near){this.capture=null;return;}
    if(near.factionId!==p.factionId){this.capture=null;return;}
    near.progress=D.clamp((near.progress||0)+dt/8,0,1);
    this.capture=near;
    if(near.progress>=1 && near.owner!==p.factionId){
      near.owner=p.factionId;this.owner[near.id]=p.factionId;
      g.ui.toast('Turf Claimed',`${near.name} now belongs to ${p.factionName}. Claim buff foundation active.`, 'gold');
      g.ui.log(`${p.factionName} claimed turf in ${D.CLASSES[near.classId]?.zone||'the wilds'}.`, 'gold');
    }
  };
})();
</script>
<script>

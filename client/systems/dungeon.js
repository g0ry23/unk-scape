(function(){
  window.Duskfall = window.Duskfall || {};
const US = window.UnkScape = window.Duskfall;
  US.DungeonSystem=function(game){this.game=game;this.inside=false;this.returnPos=null;};
  US.DungeonSystem.prototype.enter=function(id){
    const g=this.game;if(id!=='dungeon')return;
    if(this.inside){this.exit();return;}
    this.returnPos={x:g.player.x,y:g.player.y};this.inside=true;
    g.ui.toast('Old Catacombs','A compact dungeon prototype begins. Defeat the ambush.','gold');
    g.player.x=US.WORLD.pxW/2;g.player.y=US.WORLD.pxH/2+420;g.camera.snapTo(g.player.x,g.player.y);
    // spawn an encounter around player
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2;g.entities.enemies.push(US.createEnemy(i===4?'lurker':'husk',g.player.x+Math.cos(a)*180,g.player.y+Math.sin(a)*140));}
  };
  US.DungeonSystem.prototype.exit=function(){
    const g=this.game;if(!this.returnPos)return;g.player.x=this.returnPos.x;g.player.y=this.returnPos.y;g.camera.snapTo(g.player.x,g.player.y);this.inside=false;g.ui.toast('Returned','You step back into the overworld.','good');
  };
  US.DungeonSystem.prototype.update=function(){
    if(!this.inside)return;
    const g=this.game,p=g.player;
    if(this.returnPos && Math.hypot(p.x-US.WORLD.pxW/2,p.y-(US.WORLD.pxH/2+420))>520){this.exit();}
  };
})();

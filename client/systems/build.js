(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.BuildSystem=function(game){
    this.game=game;
    this.palette=['woodfloor','fence','stonepath','farmland'];
    this.index=0;
    this.costs={woodfloor:{log:1},fence:{log:2},stonepath:{stone:2},farmland:{stone:1}};
  };
  D.BuildSystem.prototype.selected=function(){return this.palette[this.index]||'woodfloor';};
  D.BuildSystem.prototype.toggle=function(){
    const g=this.game;
    g.buildMode=!g.buildMode;
    if(g.player){g.player.blocking=false;g.input.mouse.rightDown=false;g.input.mouse.leftDown=false;}
    g.ui.toast('Build Mode', g.buildMode?`ON — ${D.TILES[this.selected()].name}. LMB place, RMB remove.`:'OFF — combat controls restored.', g.buildMode?'gold':'good');
  };
  D.BuildSystem.prototype.cycle=function(){
    this.index=(this.index+1)%this.palette.length;
    this.game.ui.toast('Build Tile', D.TILES[this.selected()].name, 'gold');
  };
  D.BuildSystem.prototype.canEdit=function(tx,ty){
    const g=this.game,p=g.player;
    if(!p||tx<0||ty<0||tx>=D.WORLD.w||ty>=D.WORLD.h)return false;
    const wx=tx*D.TILE+D.TILE/2, wy=ty*D.TILE+D.TILE/2;
    if(Math.hypot(wx-p.x,wy-p.y)>165){g.ui.toast('Too Far','Move closer to build there.','bad');return false;}
    if(g.entities.npcs.some(n=>Math.hypot(wx-n.x,wy-n.y)<58)){g.ui.toast('Blocked','You cannot build on town NPCs.','bad');return false;}
    if(g.entities.enemies.some(e=>!e.dead&&Math.hypot(wx-e.x,wy-e.y)<44)){g.ui.toast('Blocked','Clear nearby mobs before building.','bad');return false;}
    return true;
  };
  D.BuildSystem.prototype.placeAt=function(x,y){
    const g=this.game, tx=Math.floor(x/D.TILE), ty=Math.floor(y/D.TILE);
    if(!this.canEdit(tx,ty))return;
    const current=g.world.tiles[ty]?.[tx], tile=this.selected();
    if(!current||['water','wall','roof'].includes(current)){g.ui.toast('Cannot Build','That tile cannot be replaced yet.','bad');return;}
    const cost=this.costs[tile]||{};
    if(!g.systems.inventory.canAfford(cost)){g.ui.toast('Need Materials',Object.entries(cost).map(([id,q])=>`${q} ${D.ITEMS[id].name}`).join(', '),'bad');return;}
    g.systems.inventory.take(cost);
    g.world.tiles[ty][tx]=tile;
    g.ui.floatText(tx*D.TILE+D.TILE/2,ty*D.TILE+D.TILE/2,'BUILD','#f7c65b');
    g.ui.log(`Placed ${D.TILES[tile].name}.`,'gold');
  };
  D.BuildSystem.prototype.removeAt=function(x,y){
    const g=this.game, tx=Math.floor(x/D.TILE), ty=Math.floor(y/D.TILE);
    if(!this.canEdit(tx,ty))return;
    const current=g.world.tiles[ty]?.[tx];
    if(!this.palette.includes(current)){g.ui.toast('Cannot Remove','Only player-built tiles can be removed right now.','bad');return;}
    g.world.tiles[ty][tx]='dirt';
    g.ui.floatText(tx*D.TILE+D.TILE/2,ty*D.TILE+D.TILE/2,'REMOVED','#9aa8c7');
    g.ui.log(`Removed ${D.TILES[current].name}.`,'good');
  };
})();

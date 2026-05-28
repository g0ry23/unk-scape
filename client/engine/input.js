(function(){
  const D = window.Duskfall = window.Duskfall || {};
  D.Input = function(game){
    this.game=game;
    this.keys={}; this.pressed={}; this.waitingForBind=null;
    this.mouse={x:0,y:0,worldX:0,worldY:0,leftDown:false,rightDown:false,leftStarted:0,leftHeld:0,rightStarted:0};
    addEventListener('keydown',e=>this.onKey(e,true));
    addEventListener('keyup',e=>this.onKey(e,false));
    game.canvas.addEventListener('mousemove',e=>this.onMouseMove(e));
    game.canvas.addEventListener('mousedown',e=>this.onMouseDown(e));
    addEventListener('mouseup',e=>this.onMouseUp(e));
    game.canvas.addEventListener('wheel',e=>{e.preventDefault(); game.camera.setZoom(e.deltaY < 0 ? 0.12 : -0.12, true);},{passive:false});
    game.canvas.addEventListener('contextmenu',e=>e.preventDefault());
  };
  D.Input.prototype.cleanKey=function(k){return k===' '?' ':String(k||'').toLowerCase();};
  D.Input.prototype.onKey=function(e,down){
    const k=this.cleanKey(e.key);
    if(this.waitingForBind && down){
      this.game.settings.keybinds[this.waitingForBind]=k;
      this.game.ui.toast('Keybind Updated', `${this.waitingForBind} is now ${D.displayKey(k)}.`, 'good');
      this.waitingForBind=null;
      this.game.ui.renderMenu();
      e.preventDefault();
      return;
    }
    if(down && !this.keys[k]) this.pressed[k]=true;
    this.keys[k]=down;
    const binds=Object.values(this.game.settings.keybinds||{});
    if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','tab',' ','escape','1','2','3','4',...binds].includes(k)) e.preventDefault();
    if(down) this.handleHotkey(k);
  };
  D.Input.prototype.actionForKey=function(k){
    const binds=this.game.settings.keybinds||{};
    for(const [action,key] of Object.entries(binds)) if(key===k) return action;
    return null;
  };
  D.Input.prototype.handleHotkey=function(k){
    const g=this.game, action=this.actionForKey(k);
    if(action==='pause'){ g.ui.toggleMenu(); return; }
    if(g.state==='menu') return;
    if(action==='zoomIn'){g.camera.setZoom(.12);return;}
    if(action==='zoomOut'){g.camera.setZoom(-.12);return;}
    if(action==='cameraToggle'){g.camera.toggleMode();return;}
    if(action==='cameraOverhead'){g.camera.setOverhead();return;}
    if(action==='rotateLeft'){g.camera.rotate(-Math.PI/12);return;}
    if(action==='rotateRight'){g.camera.rotate(Math.PI/12);return;}
    if(action==='buildToggle'){g.systems.build.toggle();return;}
    if(action==='buildCycle'){g.systems.build.cycle();return;}
    if(action==='save'){g.systems.save.save();return;}
    if(g.paused && !['inventory','stats','skills','crafting','quests','bank','map'].includes(action)) return;
    if(action==='inventory') g.ui.togglePanel('inventory');
    if(action==='stats') g.ui.togglePanel('stats');
    if(action==='skills') g.ui.togglePanel('skills');
    if(action==='crafting') g.ui.togglePanel('crafting');
    if(action==='quests') g.ui.togglePanel('quests');
    if(action==='bank') g.ui.togglePanel('bank');
    if(action==='map') g.ui.togglePanel('map');
    if(action==='interact') g.player.tryInteract();
    if(action==='attack') g.systems.combat.playerAttack(false);
    if(['1','2','3','4','5','6','7','8'].includes(k)){g.systems.inventory.useHotbar(Number(k)-1);return;}
  };
  D.Input.prototype.onMouseMove=function(e){
    const rect=this.game.canvas.getBoundingClientRect();
    this.mouse.x=e.clientX-rect.left;
    this.mouse.y=e.clientY-rect.top;
  };
  D.Input.prototype.onMouseDown=function(e){
    if(e.target!==this.game.canvas) return;
    if(this.game.state!=='play'||this.game.paused) return;
    const world=this.game.camera.screenToWorld(this.mouse.x,this.mouse.y);
    this.mouse.worldX=world.x;this.mouse.worldY=world.y;
    if(this.game.buildMode){
      if(e.button===0) this.game.systems.build.placeAt(this.mouse.worldX,this.mouse.worldY);
      if(e.button===2) this.game.systems.build.removeAt(this.mouse.worldX,this.mouse.worldY);
      return;
    }
    if(e.button===0 && this.game.systems.gathering && this.game.systems.gathering.tryStartAt(this.mouse.worldX,this.mouse.worldY)) return;
    if(e.button===0){this.mouse.leftDown=true;this.mouse.leftStarted=performance.now();this.mouse.leftHeld=0;}
    if(e.button===2){this.mouse.rightDown=true;this.mouse.rightStarted=performance.now();if(this.game.player)this.game.player.blocking=true;}
  };
  D.Input.prototype.onMouseUp=function(e){
    if(e.target!==this.game.canvas && this.game.paused){this.mouse.leftDown=false;this.mouse.rightDown=false;return;}
    if(e.button===0 && this.mouse.leftDown){
      const held=(performance.now()-this.mouse.leftStarted)/1000;
      this.mouse.leftDown=false;this.mouse.leftHeld=0;
      if(this.game.state==='play'&&!this.game.paused)this.game.systems.combat.releasePrimary(held);
    }
    if(e.button===2){this.mouse.rightDown=false;if(this.game.player)this.game.player.blocking=false;}
  };
  D.Input.prototype.update=function(dt){
    if(this.mouse.leftDown)this.mouse.leftHeld=(performance.now()-this.mouse.leftStarted)/1000;
    const world=this.game.camera.screenToWorld(this.mouse.x,this.mouse.y);
    this.mouse.worldX=world.x;this.mouse.worldY=world.y;
    if(this.game.player)this.game.player.blocking=!!this.mouse.rightDown;
    this.pressed={};
  };
  D.Input.prototype.axis=function(){
    let x=0,y=0,k=this.keys;
    if(k.w||k.arrowup) y--;
    if(k.s||k.arrowdown) y++;
    if(k.a||k.arrowleft) x--;
    if(k.d||k.arrowright) x++;
    const len=Math.hypot(x,y)||1;
    return {x:x/len,y:y/len};
  };
  D.Input.prototype.startRebind=function(action){this.waitingForBind=action;this.game.ui.renderMenu();};
  D.displayKey=function(k){return k===' '?'SPACE':k==='escape'?'ESC':k==='tab'?'TAB':String(k).toUpperCase();};
})();

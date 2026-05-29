/**
 * UNK-SCAPE 3D Input System
 * Pure 3D: WASD movement + Three.js raycaster clicks only.
 * No 2D isometric math. No screenToWorld. No camera.pitch transforms.
 * Replaces the old dual-namespace 2D/3D hybrid.
 */
((D) => {

D.Input = function(game) {
  this.game   = game;
  this.keys   = {};
  this.pressed = {};
  this.mouse  = { x: 0, y: 0, leftDown: false, rightDown: false,
                  leftStarted: 0, leftHeld: 0 };
  this.waitingForBind = null;

  // Boot UnkScape WASD engine
  var U = window.UnkScape;
  if (U && U.Engine && U.Engine.Input) U.Engine.Input.init();

  window.addEventListener('keydown', (e) => this.onKey(e, true));
  window.addEventListener('keyup',   (e) => this.onKey(e, false));

  // Track mouse position on the WebGL canvas (or fallback to 2D canvas)
  var listenCanvas = document.getElementById('game-webgl') || game.canvas;
  listenCanvas.style.pointerEvents = 'auto';

  window.addEventListener('mousemove', (e) => {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  });

  window.addEventListener('mousedown', (e) => this.onMouseDown(e));
  window.addEventListener('mouseup',   (e) => this.onMouseUp(e));

  // Scroll zoom via render_3d camera offset
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    var E = window.UnkScape3D;
    if (E && E.cameraZoomOffset !== undefined) {
      E.cameraZoomOffset = Math.max(8, Math.min(40, E.cameraZoomOffset + (e.deltaY > 0 ? 1.5 : -1.5)));
    }
  }, { passive: false });

  window.addEventListener('contextmenu', (e) => e.preventDefault());
};

D.Input.prototype.cleanKey = function(k) {
  return k === ' ' ? ' ' : String(k || '').toLowerCase();
};

D.Input.prototype.onKey = function(e, down) {
  var k = this.cleanKey(e.key);
  if (this.waitingForBind && down) {
    this.game.settings.keybinds[this.waitingForBind] = k;
    if (this.game.ui) this.game.ui.toast('Keybind Updated',
      this.waitingForBind + ' = ' + D.displayKey(k), 'good');
    this.waitingForBind = null;
    if (this.game.ui) this.game.ui.renderMenu();
    e.preventDefault();
    return;
  }
  if (down && !this.keys[k]) this.pressed[k] = true;
  this.keys[k] = down;
  var binds = Object.values(this.game.settings.keybinds || {});
  if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',
       'tab',' ','escape','1','2','3','4','5','6','7','8',
       ...binds].includes(k)) {
    e.preventDefault();
  }
  if (down) this.handleHotkey(k);
};

D.Input.prototype.actionForKey = function(k) {
  var binds = this.game.settings.keybinds || {};
  for (var action in binds) {
    if (binds[action] === k) return action;
  }
  return null;
};

D.Input.prototype.handleHotkey = function(k) {
  var g = this.game;
  var action = this.actionForKey(k);
  if (action === 'pause') { g.ui.toggleMenu(); return; }
  if (g.state === 'menu') return;
  if (action === 'zoomIn')  { var E=window.UnkScape3D; if(E&&E.cameraZoomOffset!==undefined) E.cameraZoomOffset=Math.max(8,E.cameraZoomOffset-2); return; }
  if (action === 'zoomOut') { var E2=window.UnkScape3D; if(E2&&E2.cameraZoomOffset!==undefined) E2.cameraZoomOffset=Math.min(40,E2.cameraZoomOffset+2); return; }
  if (action === 'save')    { g.systems.save.save(); return; }
  if (action === 'buildToggle') { g.systems.build.toggle(); return; }
  if (action === 'buildCycle')  { g.systems.build.cycle(); return; }
  if (g.paused && !['inventory','stats','skills','crafting','quests','bank','map'].includes(action)) return;
  if (action === 'inventory') g.ui.togglePanel('inventory');
  if (action === 'stats')     g.ui.togglePanel('stats');
  if (action === 'skills')    g.ui.togglePanel('skills');
  if (action === 'crafting')  g.ui.togglePanel('crafting');
  if (action === 'quests')    g.ui.togglePanel('quests');
  if (action === 'bank')      g.ui.togglePanel('bank');
  if (action === 'map')       g.ui.togglePanel('map');
  if (action === 'interact')  g.player.tryInteract();
  if (action === 'attack')    g.systems.combat.playerAttack(false);
  if (['1','2','3','4','5','6','7','8'].includes(k)) {
    g.systems.inventory.useHotbar(Number(k) - 1);
  }
};

D.Input.prototype.onMouseDown = function(e) {
  if (this.game.state !== 'play' || this.game.paused) return;
  if (e.button === 0) {
    this.mouse.leftDown = true;
    this.mouse.leftStarted = performance.now();
    this.tryRaycastClick(e.clientX, e.clientY);
  }
  if (e.button === 2) {
    if (this.game.player) this.game.player.blocking = true;
  }
};

D.Input.prototype.onMouseUp = function(e) {
  if (e.button === 0 && this.mouse.leftDown) {
    var held = (performance.now() - this.mouse.leftStarted) / 1000;
    this.mouse.leftDown = false;
    this.mouse.leftHeld = 0;
    if (this.game.state === 'play' && !this.game.paused)
      this.game.systems.combat.releasePrimary(held);
  }
  if (e.button === 2) {
    if (this.game.player) this.game.player.blocking = false;
  }
};

/**
 * 3D raycast click handler.
 * Casts a ray from the Three.js camera through the mouse position.
 * If it hits a prop node, maps it back to the nearest resource entity
 * and calls gathering.tryStartAt() with the resource's actual pixel coords.
 */
D.Input.prototype.tryRaycastClick = function(clientX, clientY) {
  var E = window.UnkScape3D;
  if (!E || !E.active || !E.camera || !E.propGroup) return false;
  var D2 = window.Duskfall;
  var g  = this.game;

  var ndcX = (clientX / window.innerWidth)  * 2 - 1;
  var ndcY = -(clientY / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), E.camera);

  var hits = raycaster.intersectObjects(E.propGroup.children, true);
  if (hits.length > 0) {
    var hitObj = hits[0].object;
    // Walk up to the propNode (direct child of propGroup)
    var propNode = hitObj;
    while (propNode.parent && propNode.parent !== E.propGroup) {
      propNode = propNode.parent;
    }
    // propNode.position is in 3D units — convert back to pixel coords
    var SCALE = 0.1;
    var pixelX = propNode.position.x / SCALE;
    var pixelY = propNode.position.z / SCALE;

    // Find closest resource at those pixel coords
    var resources = g.entities && g.entities.resources;
    if (resources) {
      var closest = null;
      var bestDist = 999999;
      for (var i = 0; i < resources.length; i++) {
        var r = resources[i];
        var d = Math.hypot(r.x - pixelX, r.y - pixelY);
        if (d < bestDist) { bestDist = d; closest = r; }
      }
      if (closest && bestDist < 80) {
        if (g.systems.gathering && g.systems.gathering.tryStartAt(closest.x, closest.y)) {
          return true;
        }
      }
    }
  }

  // Also try terrain hit -> move target (for point-to-move if desired, optional)
  return false;
};

D.Input.prototype.update = function(dt) {
  if (this.mouse.leftDown)
    this.mouse.leftHeld = (performance.now() - this.mouse.leftStarted) / 1000;
  if (this.game.player) this.game.player.blocking = false; // right mouse handled in onMouseUp
  this.pressed = {};
};

// axis() — pure WASD, delegates to UnkScape.Engine.Input vector system
D.Input.prototype.axis = function() {
  var U = window.UnkScape;
  if (U && U.Engine && U.Engine.Input) {
    return U.Engine.Input.getMovementVector();
  }
  var x = 0, y = 0, k = this.keys;
  if (k.w || k.arrowup)    y--;
  if (k.s || k.arrowdown)  y++;
  if (k.a || k.arrowleft)  x--;
  if (k.d || k.arrowright) x++;
  var len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
};

D.Input.prototype.startRebind = function(action) {
  this.waitingForBind = action;
  if (this.game.ui) this.game.ui.renderMenu();
};

D.displayKey = function(k) {
  return k === ' ' ? 'SPACE' : k === 'escape' ? 'ESC' : k === 'tab' ? 'TAB' : String(k).toUpperCase();
};

})(window.Duskfall = window.Duskfall || {});


// ── UnkScape.Engine.Input: WASD vector system (unchanged) ──────────────────
((U) => {
  U.Engine = U.Engine || {};
  const Input = {
    keys: { KeyW: false, KeyA: false, KeyS: false, KeyD: false },
    init() {
      window.addEventListener('keydown', (e) => {
        if (e.code in this.keys) this.keys[e.code] = true;
        if (["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) e.preventDefault();
      });
      window.addEventListener('keyup', (e) => {
        if (e.code in this.keys) this.keys[e.code] = false;
      });
    },
    getMovementVector() {
      var moveX = 0, moveY = 0;
      if (this.keys.KeyW) moveY -= 1;
      if (this.keys.KeyS) moveY += 1;
      if (this.keys.KeyA) moveX -= 1;
      if (this.keys.KeyD) moveX += 1;
      if (moveX !== 0 && moveY !== 0) {
        var length = Math.sqrt(moveX * moveX + moveY * moveY);
        moveX /= length; moveY /= length;
      }
      return { x: moveX, y: moveY };
    }
  };
  U.Engine.Input = Input;
})(window.UnkScape = window.UnkScape || {});

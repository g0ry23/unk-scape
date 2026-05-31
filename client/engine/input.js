/**
 * input.js -- v11
 * ONE namespace: window.UnkScape (US) only.
 * ONE mousedown, ONE mousemove, ONE mouseup, ONE wheel, ONE keydown, ONE keyup.
 * 3D-native raycaster click path.
 *
 * v11 changes:
 * - LMB on resource → calls gathering.tryStartAt() which opens action menu
 * - [F] key → calls gathering.tryInteractF() to confirm or open menu
 * - [ESC] while action menu open → closes menu instead of pausing
 * - Camera orbit: smoother sensitivity (horizontal 0.010, vertical 0.007)
 * - WASD unchanged, zoom unchanged
 */
(function(D) {
"use strict";
const US = D;

function getR3D() {
  if (!US.r3d && window.UnkScape3D && window.UnkScape3D.active) {
    US.r3d = window.UnkScape3D;
  }
  return US.r3d || null;
}

var NEAR_MISS_RADIUS = 80;
var GATHER_RANGE     = 200;

function logClick(screenX, screenY, hitInfo, result) {
  console.log("[INPUT-CLICK] screen("+Math.round(screenX)+","+Math.round(screenY)+")"
    +" | hit="+(hitInfo||"miss")+" | result="+result);
}

function feedback(msg, type) {
  var g = D && D.game;
  if (!g) return;
  if (g.ui && g.ui.toast) g.ui.toast(msg, '', type || 'gold');
  if (g.ui && g.ui.log) g.ui.log(msg, type || 'gold');
}

function autoPathTo(player, res, game) {
  if (!player || !res) return;
  player._clickTarget = { x: res.x, y: res.y, resourceId: res.uid };
  var name = res.cfg && res.cfg.name ? res.cfg.name : res.type;
  feedback('Moving to ' + name + '...', 'gold');
}

function nearestResource(worldX, worldY, game) {
  var resources = game.entities && game.entities.resources;
  if (!resources || !resources.length) return null;
  var best = null, bestDist = NEAR_MISS_RADIUS;
  for (var i = 0; i < resources.length; i++) {
    var r = resources[i];
    if (!r || r.amount <= 0) continue;
    var d = Math.hypot(r.x - worldX, r.y - worldY);
    if (d < bestDist) { bestDist = d; best = r; }
  }
  return best;
}

function handleGameClick(inp, e) {
  var game = inp.game;
  if (!game || game.state !== 'play' || game.paused) return;
  if (!game.player || game.player.dead) return;
  var screenX = e.clientX, screenY = e.clientY;
  var E = getR3D();
  var propGroup = E && E.propGroup;
  if (!propGroup || propGroup.children.length === 0) {
    handleGroundClick(inp, screenX, screenY, game); return;
  }
  var camera = E && E.camera;
  if (!camera) { handleGroundClick(inp, screenX, screenY, game); return; }
  var ndcX = (screenX / window.innerWidth) * 2 - 1;
  var ndcY = -(screenY / window.innerHeight) * 2 + 1;
  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);
  var meshes = [];
  propGroup.traverse(function(child) { if (child.isMesh) meshes.push(child); });
  var intersects = raycaster.intersectObjects(meshes, false);
  if (intersects.length > 0) {
    var hit = intersects[0].object;
    var resourceId = hit.userData.resourceId;
    if (!resourceId && hit.parent) resourceId = hit.parent.userData.resourceId;
    if (!resourceId && hit.parent && hit.parent.parent) resourceId = hit.parent.parent.userData.resourceId;
    resolveResourceClick(inp, resourceId, screenX, screenY, game);
  } else {
    handleGroundClick(inp, screenX, screenY, game);
  }
}

function handleGroundClick(inp, screenX, screenY, game) {
  var E = getR3D();
  var camera = E && E.camera;
  var worldX, worldY;
  if (camera && typeof THREE !== 'undefined') {
    var ndcX = (screenX / window.innerWidth) * 2 - 1;
    var ndcY = -(screenY / window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);
    var dir = raycaster.ray.direction, orig = raycaster.ray.origin;
    if (Math.abs(dir.y) > 0.001) {
      var t = (1.0 - orig.y) / dir.y;
      if (t > 0) { worldX = (orig.x + dir.x * t) * 10; worldY = (orig.z + dir.z * t) * 10; }
    }
  }
  if (worldX === undefined) return; // silent miss — ground click does nothing
  var res = nearestResource(worldX, worldY, game);
  if (res) { resolveResourceClickDirect(inp, res, screenX, screenY, game); }
  // Ground click with no resource = walk-to click (move player)
  else if (game.player) {
    game.player._clickTarget = { x: worldX, y: worldY };
  }
}

function resolveResourceClick(inp, resourceId, screenX, screenY, game) {
  if (!resourceId) return;
  var resources = game.entities && game.entities.resources;
  var res = null;
  if (resources) {
    for (var i = 0; i < resources.length; i++) {
      if (resources[i].uid === resourceId) { res = resources[i]; break; }
    }
  }
  if (!res) return;
  resolveResourceClickDirect(inp, res, screenX, screenY, game);
}

// LMB on resource: call tryStartAt which opens action menu (no auto-gather)
function resolveResourceClickDirect(inp, res, screenX, screenY, game) {
  var gs = game.systems && game.systems.gathering;
  if (!gs) return;
  // If currently gathering this node, cancel
  if (gs.active && gs.active.uid === res.uid) {
    gs.cancel();
    return;
  }
  // tryStartAt v5: walks if far, opens action menu if close — never auto-starts
  if (typeof gs.tryStartAt === 'function') {
    gs.tryStartAt(res.x, res.y);
  }
}

// ── Input constructor ────────────────────────────────────────────────────────
US.Input = function(game) {
  this.game  = game;
  this.keys  = {};
  this.pressed = {};
  this.mouse = {
    x: 0, y: 0, leftDown: false, rightDown: false,
    worldX: 0, worldY: 0, leftStarted: 0, leftHeld: 0
  };
  this.waitingForBind = null;
  this._orbitDragging = false;
  this._orbitLastX    = 0;
  this._orbitLastY    = 0;
  this._initDone      = false;
  this._init();
  console.log("[Input] v11: action-menu gathering + smoother camera orbit.");
};

US.Input.prototype._init = function() {
  var self = this;
  var game = this.game;

  this._onKeyDown = function(e) {
    var k = self._cleanKey(e.key);
    if (!self.keys[k]) self.pressed[k] = true;
    self.keys[k] = true;
    self._handleHotkey(e, k);
  };
  this._onKeyUp = function(e) {
    var k = self._cleanKey(e.key);
    self.keys[k] = false;
    if (self.waitingForBind) {
      var action = self.waitingForBind;
      self.waitingForBind = null;
      if (game.settings && game.settings.keybinds) game.settings.keybinds[action] = k;
      if (game.ui) game.ui.renderMenu();
      e.preventDefault();
    }
  };
  window.addEventListener('keydown', this._onKeyDown, false);
  window.addEventListener('keyup', this._onKeyUp, false);

  var gameCanvas = document.getElementById('game');
  if (!gameCanvas) {
    console.error("[Input] #game canvas not found -- retry in 500ms");
    setTimeout(function() { self._init(); }, 500);
    return;
  }

  this._onMouseDown = function(e) {
    if (e.button === 0) {
      self.mouse.leftDown    = true;
      self.mouse.leftStarted = performance.now();
      self.mouse.x = e.clientX;
      self.mouse.y = e.clientY;
      if (e.target === gameCanvas || e.target.id === 'game-webgl'
          || e.target.id === 'game' || e.target.tagName === 'CANVAS') {
        handleGameClick(self, e);
      }
    }
    if (e.button === 2 || e.button === 1) {
      self._orbitDragging = true;
      self._orbitLastX = e.clientX;
      self._orbitLastY = e.clientY;
      e.preventDefault();
    }
  };

  this._onMouseMove = function(e) {
    self.mouse.x = e.clientX;
    self.mouse.y = e.clientY;
    var g = game;
    if (g && g.camera) {
      self.mouse.worldX = e.clientX + (g.camera.x || 0) - window.innerWidth * 0.5;
      self.mouse.worldY = e.clientY + (g.camera.y || 0) - window.innerHeight * 0.5;
    }
    if (self._orbitDragging) {
      var dx = e.clientX - self._orbitLastX;
      var dy = e.clientY - self._orbitLastY;
      self._orbitLastX = e.clientX;
      self._orbitLastY = e.clientY;
      var E = getR3D();
      if (E) {
        // v11: reduced sensitivity for smoother feel (was 0.012 / 0.005)
        E.cameraOrbitAngle = (E.cameraOrbitAngle || 0) - dx * 0.010;
        E.cameraOrbitPhi   = Math.max(0.15, Math.min(1.35,
          (E.cameraOrbitPhi || 0.45) + dy * 0.007));
        E.notifyOrbitInput();
      }
    }
  };

  this._onMouseUp = function(e) {
    if (e.button === 0) { self.mouse.leftDown = false; self.mouse.leftHeld = 0; }
    if (e.button === 2 || e.button === 1) { self._orbitDragging = false; }
  };

  this._onContextMenu = function(e) { e.preventDefault(); };
  gameCanvas.addEventListener('contextmenu', this._onContextMenu, false);

  window.addEventListener('mousedown', this._onMouseDown, true);
  window.addEventListener('mousemove', this._onMouseMove, false);
  window.addEventListener('mouseup',   this._onMouseUp,   false);

  this._onWheel = function(e) {
    var E = getR3D();
    if (E) {
      var delta = e.deltaY > 0 ? 2.5 : -2.5;
      var newTarget = Math.max(8, Math.min(50,
        (E.cameraZoomTarget !== undefined ? E.cameraZoomTarget : E.cameraZoomOffset || 18) + delta));
      E.cameraZoomTarget = newTarget;
    }
    e.preventDefault();
  };
  window.addEventListener('wheel', this._onWheel, { passive: false });

  this._initDone = true;
  console.log("[Input] v11 listeners active.");
};

// ── WASD axis ──────────────────────────────────────────────────────────────
US.Input.prototype.axis = function() {
  var k = this.keys;
  var raw = { x: 0, y: 0 };
  if (k['w'] || k['arrowup'])    raw.y -= 1;
  if (k['s'] || k['arrowdown'])  raw.y += 1;
  if (k['a'] || k['arrowleft'])  raw.x -= 1;
  if (k['d'] || k['arrowright']) raw.x += 1;
  if (!raw.x && !raw.y) return raw;

  var len = Math.hypot(raw.x, raw.y);
  raw.x /= len; raw.y /= len;

  var E = getR3D();
  var orbitAngle = E ? (E.cameraOrbitAngle || 0) : 0;
  if (this.game && this.game.camera) this.game.camera.angle = orbitAngle;

  var cos = Math.cos(orbitAngle);
  var sin = Math.sin(orbitAngle);
  return {
    x: raw.x * cos + raw.y * sin,
    y: -raw.x * sin + raw.y * cos
  };
};

// ── Per-frame update ──────────────────────────────────────────────────────
US.Input.prototype.update = function(dt) {
  if (this.mouse.leftDown)
    this.mouse.leftHeld = (performance.now() - this.mouse.leftStarted) / 1000;

  var game   = this.game;
  var player = game && game.player;
  if (player && player._clickTarget) {
    var ct = player._clickTarget;
    var dx = ct.x - player.x;
    var dy = ct.y - player.y;
    var dist = Math.hypot(dx, dy);
    if (dist < 24) {
      if (ct.resourceId && game.systems && game.systems.gathering) {
        var resources = game.entities && game.entities.resources;
        if (resources) {
          for (var i = 0; i < resources.length; i++) {
            if (resources[i].uid === ct.resourceId) {
              game.systems.gathering.tryStartAt(resources[i].x, resources[i].y);
              break;
            }
          }
        }
      }
      player._clickTarget = null;
    } else {
      var stats = player.stats ? player.stats() : { moveSpeed: 140 };
      player.vx = (dx / dist) * stats.moveSpeed;
      player.vy = (dy / dist) * stats.moveSpeed;
    }
  }

  this.pressed = {};
};

// ── Hotkey handler ────────────────────────────────────────────────────────
US.Input.prototype._handleHotkey = function(e, k) {
  var tag = e && e.target && e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  var game = this.game;
  if (!game || !game.ui) return;
  var kb = game.settings && game.settings.keybinds;
  if (!kb) return;
  if (this.waitingForBind) return;

  if (k === kb.inventory) { game.ui.togglePanel('inventory'); e.preventDefault(); }
  if (k === kb.skills)    { game.ui.togglePanel('skills');    e.preventDefault(); }
  if (k === kb.quests)    { game.ui.togglePanel('quests');    e.preventDefault(); }
  if (k === kb.crafting)  { game.ui.togglePanel('crafting');  e.preventDefault(); }
  if (k === kb.bank)      { game.ui.togglePanel('bank');      e.preventDefault(); }
  if (k === kb.map)       { game.ui.togglePanel('map');       e.preventDefault(); }
  if (k === kb.stats)     { game.ui.togglePanel('stats');     e.preventDefault(); }

  // [F] key: first try gathering action menu, then fall back to NPC interact
  if (k === kb.interact || k === 'f') {
    var gs = game.systems && game.systems.gathering;
    var interactHandled = gs && typeof gs.tryInteractF === 'function' && gs.tryInteractF();
    if (!interactHandled && game.player) game.player.tryInteract();
    e.preventDefault();
  }

  if (k === kb.attack || k === ' ') {
    if (game.state === 'play' && game.systems && game.systems.combat) {
      game.systems.combat.playerAttack();
    }
    e.preventDefault();
  }

  if (k === kb.pause || k === 'escape') {
    // If gathering action menu is open, close it instead of pausing
    var gs2 = game.systems && game.systems.gathering;
    if (gs2 && gs2._menuEl) {
      gs2._closeActionMenu();
    } else if (game.state === 'play') {
      game.paused = !game.paused;
      game.ui.toast(game.paused ? 'Paused' : 'Resumed', '', 'gold');
    }
    e.preventDefault();
  }

  if (k === kb.save || k === 'f5') {
    if (game.systems && game.systems.save) game.systems.save.save();
    e.preventDefault();
  }
  if (k === kb.buildToggle) { game.buildMode = !game.buildMode; e.preventDefault(); }
  if (k === kb.buildCycle && game.buildMode) {
    if (game.systems && game.systems.build) game.systems.build.cycleItem();
    e.preventDefault();
  }

  var E2 = getR3D();
  if (k === kb.zoomIn || k === '=') {
    if (E2) E2.cameraZoomTarget = Math.max(8,
      (E2.cameraZoomTarget !== undefined ? E2.cameraZoomTarget : E2.cameraZoomOffset || 18) - 3);
    e.preventDefault();
  }
  if (k === kb.zoomOut || k === '-') {
    if (E2) E2.cameraZoomTarget = Math.min(50,
      (E2.cameraZoomTarget !== undefined ? E2.cameraZoomTarget : E2.cameraZoomOffset || 18) + 3);
    e.preventDefault();
  }

  var n = parseInt(k, 10);
  if (!isNaN(n) && n >= 1 && n <= 8) {
    game.hotbar.selected = n - 1;
    if (game.ui && game.ui.renderHotbar) game.ui.renderHotbar();
    e.preventDefault();
  }
};

US.Input.prototype._cleanKey = function(k) {
  return k === " " ? " " : String(k || "").toLowerCase();
};

US.Input.prototype.startRebind = function(action) {
  this.waitingForBind = action;
  if (this.game.ui) this.game.ui.renderMenu();
};

US.displayKey = function(k) {
  return k === " " ? "SPACE" : k === "escape" ? "ESC" : k === "tab" ? "TAB" : String(k).toUpperCase();
};

})(window.UnkScape = window.UnkScape || {});

/*
 * v11 — Key changes over v10:
 * - LMB on resource → opens action menu (gathering.tryStartAt), not auto-gather
 * - [F] key → gathering.tryInteractF() first, then player.tryInteract()
 * - [ESC] → closes action menu if open, else pause
 * - Ground LMB → move player to clicked location
 * - Camera orbit: horizontal 0.010 (was 0.012), vertical 0.007 (was 0.005)
 */

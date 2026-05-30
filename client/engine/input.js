/**
 * input.js -- DEMOLITION STUB (Phase 2)
 * All old input code removed. Phase 3 rebuild goes here.
 * Namespace: window.Duskfall (D) only. No UnkScape crossings.
 */
(function(D) {

D.Input = function(game) {
  this.game   = game;
  this.keys   = {};
  this.pressed = {};
  this.mouse  = { x: 0, y: 0, leftDown: false, rightDown: false,
                  worldX: 0, worldY: 0, leftStarted: 0, leftHeld: 0 };
  this.waitingForBind = null;

  // ONE keydown listener, ONE keyup listener, stored on this instance
  // so Phase 3 can remove and replace them cleanly.
  var self = this;
  this._onKeyDown = function(e) {
    var k = self._cleanKey(e.key);
    if (!self.keys[k]) self.pressed[k] = true;
    self.keys[k] = true;
  };
  this._onKeyUp = function(e) {
    var k = self._cleanKey(e.key);
    self.keys[k] = false;
  };
  window.addEventListener("keydown", this._onKeyDown);
  window.addEventListener("keyup",   this._onKeyUp);

  console.log("[Input] Demolition stub active -- Phase 3 rebuild pending");
};

D.Input.prototype._cleanKey = function(k) {
  return k === " " ? " " : String(k || "").toLowerCase();
};

// axis() -- returns zero until Phase 3 rebuilds movement.
// Called by entities/player.js player.update(dt) every frame.
D.Input.prototype.axis = function() {
  return { x: 0, y: 0 };
};

// update() -- called by game.js every fixed tick.
D.Input.prototype.update = function(dt) {
  if (this.mouse.leftDown)
    this.mouse.leftHeld = (performance.now() - this.mouse.leftStarted) / 1000;
  this.pressed = {};
};

// startRebind -- kept so UI keybind screen does not crash.
D.Input.prototype.startRebind = function(action) {
  this.waitingForBind = action;
  if (this.game.ui) this.game.ui.renderMenu();
};

// displayKey -- used by UI for keybind labels.
D.displayKey = function(k) {
  return k === " " ? "SPACE" : k === "escape" ? "ESC" : k === "tab" ? "TAB" : String(k).toUpperCase();
};

})(window.Duskfall = window.Duskfall || {});

// UnkScape.Engine.Input ghost block REMOVED.
// There is now exactly ONE keydown/keyup store: D.Input.keys{}
// WASD movement will be rebuilt in Phase 3 inside D.Input.axis().

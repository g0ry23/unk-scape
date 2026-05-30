/**
 * UNK-SCAPE Camera Stub
 * The 3D camera is fully managed by render_3d.js (UnkScape3D).
 * This stub exists to satisfy smoke tests and legacy game.js init
 * that calls: this.camera = new US.Camera(this)
 * All actual camera work (position, FOV, orbit, zoom) is in render_3d.js.
 */
(function() {
  var D = window.Duskfall = window.Duskfall || {};
const US = window.UnkScape = window.Duskfall;

  US.Camera = function(game) {
    this.game   = game;
    this.x      = 0;
    this.y      = 0;
    this.zoom   = 1;
    this.targetZoom  = 1;
    this.minZoom     = 0.48;
    this.maxZoom     = 2.35;
    this.angle       = 0;
    this.targetAngle = 0;
    this.pitch       = 0.78;
    this.targetPitch = 0.78;
    this.shake       = 0;
    this.deadzone    = 26;
    this.lookAhead   = 34;
  };

  // No-ops — 3D camera handled by render_3d.js
  US.Camera.prototype.update      = function() {};
  US.Camera.prototype.apply       = function() {};
  US.Camera.prototype.setIso      = function() {};
  US.Camera.prototype.setOverhead = function() {};
  US.Camera.prototype.toggleMode  = function() {};
  US.Camera.prototype.rotate      = function() {};
  US.Camera.prototype.setZoom     = function() {};
  US.Camera.prototype.bump        = function() {};
  US.Camera.prototype.clamp       = function() {};
  US.Camera.prototype.modeLabel   = function() { return 'UNK-SCAPE 3D'; };

  US.Camera.prototype.snapTo = function(x, y) {
    this.x = x;
    this.y = y;
  };

  // worldToScreen stub: maps pixel world coords roughly to screen center
  // Only used by 2D drawing code that no longer runs - safe to return 0,0
  US.Camera.prototype.worldToScreen = function(wx, wy) {
    var vw = this.game ? (this.game.viewW || window.innerWidth)  : window.innerWidth;
    var vh = this.game ? (this.game.viewH || window.innerHeight) : window.innerHeight;
    return { x: vw / 2, y: vh / 2 };
  };

  // screenToWorld stub: no longer needed with 3D raycaster
  US.Camera.prototype.screenToWorld = function(sx, sy) {
    return { x: this.x + sx, y: this.y + sy };
  };

  console.log('[UNK-SCAPE] Camera stub loaded - 3D camera active via render_3d.js');
})();

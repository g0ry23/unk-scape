/**
* UNK-SCAPE Camera Stub — 3D bridge edition
* Syncs targetZoom/angle from UnkScape3D each frame via update().
* camera.js is still a stub; all rendering is in render_3d.js.
*/
(function() {
  const US = window.UnkScape = window.UnkScape || {};
  
  US.Camera = function(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
    this.targetZoom = 1;
    this.minZoom = 0.48;
    this.maxZoom = 2.35;
    this.angle = 0;
    this.targetAngle = 0;
    this.pitch = 0.78;
    this.targetPitch = 0.78;
    this.shake = 0;
    this.deadzone = 26;
    this.lookAhead = 34;
  };
  
  // Sync stub fields from live 3D camera every frame (called by game.update)
  US.Camera.prototype.update = function() {
    var E = window.UnkScape3D;
    if (E && E.active) {
      this.targetAngle = E.cameraOrbitAngle || 0;
      this.angle = this.targetAngle;
      var z = E.cameraZoomOffset != null ? E.cameraZoomOffset : 24;
      this.targetZoom = Math.max(0.1, (80 - z) / 56);
      this.zoom = this.targetZoom;
    }
  };
  
  US.Camera.prototype.apply = function() {};
  US.Camera.prototype.setIso = function() {};
  US.Camera.prototype.setOverhead = function() { var E = window.UnkScape3D; if (E) { E.cameraOrbitPhi = 1.4; } };
  US.Camera.prototype.toggleMode = function() {};
  US.Camera.prototype.rotate = function(delta) { var E = window.UnkScape3D; if (E && E.active) { E.cameraOrbitAngle = (E.cameraOrbitAngle || 0) + (delta || 0); } };
  US.Camera.prototype.setZoom = function(delta) { var E = window.UnkScape3D; if (E && E.active) { E.cameraZoomOffset = Math.max(8, Math.min(120, (E.cameraZoomOffset || 24) + (delta > 0 ? 2 : -2))); } };
  US.Camera.prototype.bump = function() {};
  US.Camera.prototype.clamp = function() {};
  US.Camera.prototype.modeLabel = function() { return 'UNK-SCAPE 3D'; };
  
  US.Camera.prototype.snapTo = function(x, y) {
    this.x = x;
    this.y = y;
  };
  
  US.Camera.prototype.worldToScreen = function(wx, wy) {
    var vw = this.game ? (this.game.viewW || window.innerWidth) : window.innerWidth;
    var vh = this.game ? (this.game.viewH || window.innerHeight) : window.innerHeight;
    return { x: vw / 2, y: vh / 2 };
  };
  
  US.Camera.prototype.screenToWorld = function(sx, sy) {
    return { x: this.x + sx, y: this.y + sy };
  };
  
  console.log('[UNK-SCAPE] Camera stub loaded - syncing from UnkScape3D each frame.');
})();

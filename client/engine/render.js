/**
 * UNK-SCAPE Render Stub
 * All 2D canvas drawing (tiles, entities, player, lighting, vignette) has been REMOVED.
 * The 3D engine (render_3d.js / window.UnkScape3D) handles all rendering.
 *
 * This file keeps only:
 *  1. D.render() no-op stub (game.js may still reference it)
 *  2. D.isoProject / D.renderTurfTile / D.renderWallTile - kept for mmoWorld.js compatibility
 *  3. UnkScape.Engine.Renderer stub - game.js init calls Renderer.init()
 */

// ── D.render no-op ────────────────────────────────────────────────────────
(function() {
  var D = window.Duskfall = window.Duskfall || {};

  D.render = function() {};

  // isoProject stub - kept so mmoWorld.js data builders don't crash if called
  D.TILE_WIDTH  = D.TILE_WIDTH  || 64;
  D.TILE_HEIGHT = D.TILE_HEIGHT || 32;
  D.WALL_HEIGHT = D.WALL_HEIGHT || 44;

  D.isoProject = D.isoProject || function(x, y, z) {
    return { x: (x - y) * (D.TILE_WIDTH / 2), y: (x + y) * (D.TILE_HEIGHT / 2) - (z || 0) };
  };

  D.renderTurfTile = D.renderTurfTile || function() {};
  D.renderWallTile = D.renderWallTile || function() {};

})();

// ── UnkScape.Engine.Renderer no-op stub ─────────────────────────────────
((U) => {
  U.Engine = U.Engine || {};
  U.Engine.Renderer = {
    _canvasId: 'game',
    init:        function(id) { this._canvasId = id || 'game'; },
    renderFrame: function() {}
  };
})(window.UnkScape = window.UnkScape || {});

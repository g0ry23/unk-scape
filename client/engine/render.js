/**
 * UNK-SCAPE Render Stub
 * All 2D canvas drawing (tiles, entities, player, lighting, vignette) has been REMOVED.
 * The 3D engine (render_3d.js / window.UnkScape3D) handles all rendering.
 *
 * This file keeps only:
 *  1. US.render() no-op stub (game.js may still reference it)
 *  2. US.isoProject / US.renderTurfTile / US.renderWallTile - kept for mmoWorld.js compatibility
 *  3. UnkScape.Engine.Renderer stub - game.js init calls Renderer.init()
 */

// ── US.render no-op ────────────────────────────────────────────────────────
(function() {
  const US = window.UnkScape = window.UnkScape || {};

  US.render = function() {};

  // isoProject stub - kept so mmoWorld.js data builders don't crash if called
  US.TILE_WIDTH  = US.TILE_WIDTH  || 64;
  US.TILE_HEIGHT = US.TILE_HEIGHT || 32;
  US.WALL_HEIGHT = US.WALL_HEIGHT || 44;

  US.isoProject = US.isoProject || function(x, y, z) {
    return { x: (x - y) * (US.TILE_WIDTH / 2), y: (x + y) * (US.TILE_HEIGHT / 2) - (z || 0) };
  };

  US.renderTurfTile = US.renderTurfTile || function() {};
  US.renderWallTile = US.renderWallTile || function() {};

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

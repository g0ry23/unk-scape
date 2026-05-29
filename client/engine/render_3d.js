—window.UnkScape3D = window.UnkScape3D || {};

const E = window.UnkScape3D;

(function() {

console.log("UnkScape3D: v1.5 — TextureEngine integration, procedural terrain skins, jitter props");

E.active       = false;
E.scene        = null;
E.camera       = null;
E.renderer     = null;
E.playerMesh   = null; // legacy alias
E.playerVisual = null; // modular CharacterVisuals group
E.terrainGroup = null;
E.propGroup    = null; // 3D resource props (trees, rocks, etc.)
E.lastChunkX   = -9999;
E.lastChunkY   = -9999;

// ── SCALE CONSTANTS ──────────────────────────────────────────────
const SCALE  = 0.1;
const TILE   = 32;
const TSCALE = TILE * SCALE; // 3.2 3D units per tile

// ── TILE TYPE -> 3D COLOR LOOKUP ─────────────────────────────────
const TILE_COLORS = {
  grass:     '#2d6a3f',
  darkgrass: '#1d3a2a',
  dirt:      '#6b4c2e',
  path:      '#7a6040',
  water:     '#1a5276',
  stone:     '#566573',
  wall:      '#1c2833',
  sand:      '#b7950b',
  swamp:     '#2e4d22',
  plaza:     '#8d7a52',
  stonepath: '#717d8c',
  woodfloor: '#7d5a38',
  roof:      '#4a2332',
  fence:     '#5c3d1a',
  farmland:  '#7a5c2a'
};

// ── RESOURCE VISUAL CONFIG ────────────────────────────────────────
const RESOURCE_VISUALS = {
  tree:  { trunk: '#8b5a2b', canopy: '#228b22', trunkH: 2.5, canopyH: 2.0, canopyR: 1.6 },
  berry: { trunk: '#7a4b1a', canopy: '#8b1a2e', trunkH: 1.2, canopyH: 1.0, canopyR: 0.8 },
  herb:  { trunk: null,      canopy: '#2ecc71', trunkH: 0,   canopyH: 0.6, canopyR: 0.7 },
  rock:  { trunk: null,      canopy: '#7f8c8d', trunkH: 0,   canopyH: 1.4, canopyR: 1.2, isRock: true },
  fish:  null
};

// ── MATERIAL CACHE (flat color fallback) ──────────────────────────
const _matCache = {};
function getCachedMat(color) {
  if (!_matCache[color]) _matCache[color] = new THREE.MeshLambertMaterial({ color: color });
  return _matCache[color];
}

// ── TEXTURE MATERIAL HELPER ───────────────────────────────────────
// Returns a textured MeshLambertMaterial if TextureEngine is loaded,
// otherwise falls back to flat color material. Per-tile materials are
// NOT cached here because each tile is already a fresh draw.
function getTexMat(tileType, hexColor, noiseIntensity) {
  var D = window.Duskfall;
  if (D && D.TextureEngine && D.TextureEngine.getProceduralTexture) {
    var tex = D.TextureEngine.getProceduralTexture(tileType, hexColor, noiseIntensity);
    if (tex) return new THREE.MeshLambertMaterial({ map: tex });
  }
  return new THREE.MeshLambertMaterial({ color: hexColor });
}

// ── PRIVATE HELPERS ───────────────────────────────────────────────

function getTileType(tx, ty) {
  var D = window.Duskfall;
  if (D && D.game && D.game.world && D.game.world.tiles) {
    var row = D.game.world.tiles[ty];
    if (row && row[tx]) return row[tx];
  }
  return 'grass';
}

function getTileColor(tx, ty) {
  var type = getTileType(tx, ty);
  return TILE_COLORS[type] || ((tx + ty) % 2 === 0 ? '#2d6a3f' : '#36854f');
}

function getTileHeight(tx, ty) {
  var D = window.Duskfall;
  if (D && typeof D.GetTerrainAt === 'function') {
    var td = D.GetTerrainAt(tx, ty);
    return (td.z00 || 0) * 0.3;
  }
  return Math.max(0, Math.sin(tx * 0.2) * Math.cos(ty * 0.2) * 3);
}

function getSurfaceY(tx, ty) {
  var h = getTileHeight(tx, ty);
  return Math.max(0.4, 1 + h);
}

// ── INITIALIZE 3D ────────────────────────────────────────────────
E.Initialize3D = function() {

  if (typeof THREE === 'undefined') {
    console.error("UnkScape3D: Three.js library not loaded!");
    return;
  }

  var gameCanvas = document.getElementById("game");
  if (!gameCanvas) {
    console.error("UnkScape3D: Could not find canvas id='game'");
    return;
  }

  var webglCanvas = document.createElement('canvas');
  webglCanvas.id = 'game-webgl';
  webglCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  gameCanvas.parentElement.insertBefore(webglCanvas, gameCanvas);

  E.scene = new THREE.Scene();
  E.scene.background = null;

  var aspect = window.innerWidth / window.innerHeight;
  E.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);

  var D = window.Duskfall;
  var p = D && D.game && D.game.player;
  if (p) {
    var snapX = (p.x || 0) * SCALE;
    var snapZ = (p.y || 0) * SCALE;
    var snapGH = getTileHeight(Math.floor((p.x||0)/TILE), Math.floor((p.y||0)/TILE));
    var snapPY = 1 + snapGH;
    E.camera.position.set(snapX, snapPY + 18, snapZ + 22);
    E.camera.lookAt(snapX, snapPY, snapZ);
  } else {
    E.camera.position.set(0, 25, 30);
    E.camera.lookAt(0, 0, 0);
  }

  E.renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, antialias: true, alpha: true });
  E.renderer.setClearColor(0x000000, 0);
  E.renderer.setSize(window.innerWidth, window.innerHeight);

  E.scene.add(new THREE.AmbientLight('#ffffff', 1.0));
  var sun = new THREE.DirectionalLight('#ffe8c0', 1.2);
  sun.position.set(80, 120, 60);
  E.scene.add(sun);

  if (D && D.CharacterVisuals && D.CharacterVisuals.createModularMesh) {
    var playerData = D.game ? (D.game.player || {}) : {};
    E.playerVisual = D.CharacterVisuals.createModularMesh(playerData);
    E.playerVisual.position.set(0, 1.5, 0);
    E.scene.add(E.playerVisual);
    E.playerMesh = E.playerVisual;
    console.log("UnkScape3D: CharacterVisuals mesh instantiated.");
  } else {
    var pGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
    var pMat = new THREE.MeshLambertMaterial({ color: '#f1c40f' });
    E.playerMesh = new THREE.Mesh(pGeo, pMat);
    E.playerMesh.position.set(0, 1.5, 0);
    E.scene.add(E.playerMesh);
    E.playerVisual = E.playerMesh;
  }

  E.active = true;

  window.addEventListener('resize', function() {
    E.camera.aspect = window.innerWidth / window.innerHeight;
    E.camera.updateProjectionMatrix();
    E.renderer.setSize(window.innerWidth, window.innerHeight);
  });

  console.log("UnkScape3D: v1.5 live — TextureEngine terrain skins + jitter props armed.");
};

// ── TERRAIN GENERATOR (PLAYER-CENTERED DYNAMIC STREAMING) ────────
E.Update3DTerrain = function(pxX, pxY) {
  if (!E.scene) return;

  var tileX = Math.floor(pxX / TILE);
  var tileY = Math.floor(pxY / TILE);

  if (Math.abs(tileX - E.lastChunkX) < 3 && Math.abs(tileY - E.lastChunkY) < 3) return;
  E.lastChunkX = tileX;
  E.lastChunkY = tileY;

  // ── Dispose old terrain ──
  if (E.terrainGroup) {
    E.scene.remove(E.terrainGroup);
    E.terrainGroup.traverse(function(child) {
      if (child.isMesh) { child.geometry.dispose(); child.material.dispose(); }
    });
    E.terrainGroup = null;
  }

  // ── Dispose old props ──
  if (E.propGroup) {
    E.scene.remove(E.propGroup);
    E.propGroup.traverse(function(child) {
      if (child.isMesh) { child.geometry.dispose(); }
    });
    E.propGroup = null;
  }

  // ── Build terrain blocks with procedural texture skins ──
  E.terrainGroup = new THREE.Group();
  var renderRadius = 14;

  for (var dx = -renderRadius; dx <= renderRadius; dx++) {
    for (var dz = -renderRadius; dz <= renderRadius; dz++) {
      var tx = tileX + dx;
      var tz = tileY + dz;
      if (tx < 0 || tz < 0) continue;

      var tileType    = getTileType(tx, tz);
      var hexColor    = TILE_COLORS[tileType] || getTileColor(tx, tz);
      var heightCalc  = getTileHeight(tx, tz);
      var finalHeight = Math.max(0.4, 1 + heightCalc);

      // ── TextureEngine: procedural skin per tile type ──
      // stonepath gets paver grid lines (noiseIntensity 35), others get 20
      var noiseLevel = (tileType === 'stonepath') ? 35 : 20;
      var blockMat   = getTexMat(tileType, hexColor, noiseLevel);

      var blockGeo  = new THREE.BoxGeometry(TSCALE, 1, TSCALE);
      var blockMesh = new THREE.Mesh(blockGeo, blockMat);
      blockMesh.scale.set(1, finalHeight, 1);
      blockMesh.position.set(tx * TSCALE, finalHeight * 0.5, tz * TSCALE);
      E.terrainGroup.add(blockMesh);
    }
  }
  E.scene.add(E.terrainGroup);

  // ── Build resource props with jitter geometry ──
  E.propGroup = new THREE.Group();
  var D = window.Duskfall;
  var TE = D && D.TextureEngine;
  var resources = D && D.game && D.game.entities && D.game.entities.resources;

  if (resources && resources.length) {
    var propRadius = renderRadius * TILE * 4;

    for (var ri = 0; ri < resources.length; ri++) {
      var res = resources[ri];
      if (res.harvested) continue;
      var vconf = RESOURCE_VISUALS[res.type];
      if (!vconf) continue;

      var rdx = res.x - pxX;
      var rdz = res.y - pxY;
      if (Math.abs(rdx) > propRadius || Math.abs(rdz) > propRadius) continue;

      var r3x   = res.x * SCALE;
      var r3z   = res.y * SCALE;
      var rtx   = Math.floor(res.x / TILE);
      var rtz   = Math.floor(res.y / TILE);
      var surfY = getSurfaceY(rtx, rtz);

      var propNode = new THREE.Group();
      propNode.position.set(r3x, surfY, r3z);

      if (vconf.isRock) {
        // ── Rock: jittered 3-box grey cluster with rock texture ──
        var rockTex  = TE ? TE.getProceduralTexture('stonepath', vconf.canopy, 40) : null;
        var rockMat  = rockTex ? new THREE.MeshLambertMaterial({ map: rockTex }) : getCachedMat(vconf.canopy);
        var rockSizes   = [[1.2, 0.9, 0.9], [0.8, 1.2, 0.7], [0.7, 0.8, 1.1]];
        var rockOffsets = [[0, 0, 0], [0.6, 0.2, 0.3], [-0.5, 0.1, -0.3]];
        for (var ri2 = 0; ri2 < 3; ri2++) {
          var rGeo  = new THREE.BoxGeometry(
            rockSizes[ri2][0] * TSCALE * 0.5,
            rockSizes[ri2][1] * vconf.canopyH,
            rockSizes[ri2][2] * TSCALE * 0.5
          );
          // Apply low-poly jitter for fractured stone look
          if (TE && TE.applyLowPolyJitter) TE.applyLowPolyJitter(rGeo, 0.15);
          var rMesh = new THREE.Mesh(rGeo, rockMat);
          rMesh.position.set(
            rockOffsets[ri2][0],
            rockSizes[ri2][1] * vconf.canopyH * 0.5 + rockOffsets[ri2][1],
            rockOffsets[ri2][2]
          );
          propNode.add(rMesh);
        }
      } else {
        // ── Tree / berry / herb: bark trunk + jittered canopy ──
        if (vconf.trunk && vconf.trunkH > 0) {
          var barkTex   = TE ? TE.getProceduralTexture('bark', vconf.trunk, 30) : null;
          var barkMat   = barkTex ? new THREE.MeshLambertMaterial({ map: barkTex }) : getCachedMat(vconf.trunk);
          var trunkGeo  = new THREE.BoxGeometry(TSCALE * 0.25, vconf.trunkH, TSCALE * 0.25);
          var trunkMesh = new THREE.Mesh(trunkGeo, barkMat);
          trunkMesh.position.set(0, vconf.trunkH * 0.5, 0);
          propNode.add(trunkMesh);
        }
        // Canopy: jittered organic box for leaf/bush look
        var canopyGeo = new THREE.BoxGeometry(
          vconf.canopyR * TSCALE * 0.7,
          vconf.canopyH * 1.1,
          vconf.canopyR * TSCALE * 0.7
        );
        if (TE && TE.applyLowPolyJitter) TE.applyLowPolyJitter(canopyGeo, 0.1);
        var leafTex   = TE ? TE.getProceduralTexture('grass', vconf.canopy, 25) : null;
        var leafMat   = leafTex ? new THREE.MeshLambertMaterial({ map: leafTex }) : getCachedMat(vconf.canopy);
        var canopyMesh = new THREE.Mesh(canopyGeo, leafMat);
        canopyMesh.position.set(0, vconf.trunkH + vconf.canopyH * 0.55, 0);
        propNode.add(canopyMesh);
      }

      E.propGroup.add(propNode);
      if (E.propGroup.children.length >= 80) break;
    }
  }

  E.scene.add(E.propGroup);
  console.log("UnkScape3D: Terrain + props regenerated — centre tile (" + tileX + ", " + tileY + ") | terrain: " + E.terrainGroup.children.length + " | props: " + E.propGroup.children.length);
};

// ── FRAME RENDER LOOP ────────────────────────────────────────────
E.RenderFrame3D = function(playerData) {
  if (!E.active || !E.renderer) return;

  if (playerData && E.playerVisual) {
    var pxX = playerData.x || 0;
    var pxY = playerData.y || 0;

    E.Update3DTerrain(pxX, pxY);

    var target3X = pxX * SCALE;
    var target3Z = pxY * SCALE;

    var tileX   = Math.floor(pxX / TILE);
    var tileY   = Math.floor(pxY / TILE);
    var groundH = getTileHeight(tileX, tileY);
    var playerY = 1 + groundH;

    E.playerVisual.position.set(target3X, playerY, target3Z);

    var vx = playerData.vx || 0;
    var vy = playerData.vy || 0;
    if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
      E.playerVisual.rotation.y = Math.atan2(vx, vy);
    }

    var camTargetX = target3X;
    var camTargetY = playerY + 18;
    var camTargetZ = target3Z + 22;
    E.camera.position.x += (camTargetX - E.camera.position.x) * 0.08;
    E.camera.position.y += (camTargetY - E.camera.position.y) * 0.08;
    E.camera.position.z += (camTargetZ - E.camera.position.z) * 0.08;
    E.camera.lookAt(E.playerVisual.position);

    var D = window.Duskfall;
    if (D && D.CharacterVisuals && D.CharacterVisuals.animateMesh) {
      var velocity = Math.hypot(vx, vy);
      var time = performance.now() * 0.001;
      D.CharacterVisuals.animateMesh(E.playerVisual, velocity, time);
    }
  }

  E.renderer.render(E.scene, E.camera);
};

})();

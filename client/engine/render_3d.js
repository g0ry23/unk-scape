window.UnkScape3D = window.UnkScape3D || {};

const E = window.UnkScape3D;

(function() {

console.log("UnkScape3D: v1.8 - One source of truth: g.entities.resources drives all props");

E.active = false;
E.scene = null;
E.camera = null;
E.renderer = null;
E.playerMesh = null;
E.playerVisual = null;
E.terrainGroup = null;
E.propGroup = null;
E.lastChunkX = -9999;
E.lastChunkY = -9999;
E.lastPropX = -9999;
E.lastPropY = -9999;
E.cameraZoomOffset = 24.0;
E.cameraOrbitAngle = 0;
E.cameraOrbitPhi = 0.5;

var SCALE = 0.1;
var TILE = 32;
var TSCALE = TILE * SCALE;

var TERRAIN_RADIUS = 14;
var PROP_PIXEL_RADIUS = TERRAIN_RADIUS * TILE * 3.5;
var PROP_MAX = 150;
var PROP_REBUILD_THRESHOLD = TILE * 3;

var TILE_COLORS = {
  grass: '#2d6a3f',
  darkgrass: '#1d3a2a',
  dirt: '#6b4c2e',
  path: '#7a6040',
  water: '#1a5276',
  stone: '#566573',
  wall: '#1c2833',
  sand: '#b7950b',
  swamp: '#2e4d22',
  plaza: '#8d7a52',
  stonepath: '#717d8c',
  woodfloor: '#7d5a38',
  roof: '#4a2332',
  fence: '#5c3d1a',
  farmland: '#7a5c2a'
};

var RESOURCE_VISUALS = {
  tree:  { trunk: '#8b5a2b', canopy: '#228b22', trunkH: 2.5, canopyH: 2.0, canopyR: 1.6 },
  berry: { trunk: '#7a4b1a', canopy: '#8b1a2e', trunkH: 1.2, canopyH: 1.0, canopyR: 0.8 },
  herb:  { trunk: null,      canopy: '#2ecc71', trunkH: 0,   canopyH: 0.6, canopyR: 0.7 },
  rock:  { trunk: null,      canopy: '#7f8c8d', trunkH: 0,   canopyH: 1.4, canopyR: 1.2, isRock: true },
  fish:  null
};

var _matCache = {};
function getCachedMat(color) {
  if (!_matCache[color]) _matCache[color] = new THREE.MeshLambertMaterial({ color: color });
  return _matCache[color];
}

function getTexMat(tileType, hexColor, noiseIntensity) {
  var D = window.UnkScape;
  if (D && D.TextureEngine && D.TextureEngine.getProceduralTexture) {
    var tex = D.TextureEngine.getProceduralTexture(tileType, hexColor, noiseIntensity);
    if (tex) return new THREE.MeshLambertMaterial({ map: tex });
  }
  return new THREE.MeshLambertMaterial({ color: hexColor });
}

function getTileType(tx, ty) {
  var D = window.UnkScape;
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
  var D = window.UnkScape;
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

E.Initialize3D = function() {
  if (typeof THREE === 'undefined') {
    console.error("UnkScape3D: Three.js not loaded!");
    return;
  }
  var gameCanvas = document.getElementById("game");
  if (!gameCanvas) {
    console.error("UnkScape3D: canvas id=game not found");
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

  var D = window.UnkScape;
  var p = D && D.game && D.game.player;
  if (p) {
    var snapX = (p.x || 0) * SCALE;
    var snapZ = (p.y || 0) * SCALE;
    var snapGH = getTileHeight(Math.floor((p.x||0)/TILE), Math.floor((p.y||0)/TILE));
    var snapPY = 1 + snapGH;
    E.camera.position.set(snapX, snapPY + 12.0, snapZ + 24.0);
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

  var D2 = window.UnkScape;
  if (D2 && D2.CharacterVisuals && D2.CharacterVisuals.createModularMesh) {
    var playerData = D2.game ? (D2.game.player || {}) : {};
    E.playerVisual = D2.CharacterVisuals.createModularMesh(playerData);
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

// [Phase 2] Orbit drag listeners removed -- Phase 3 adds them inside D.Input
  window.addEventListener('resize', function() {
    E.camera.aspect = window.innerWidth / window.innerHeight;
    E.camera.updateProjectionMatrix();
    E.renderer.setSize(window.innerWidth, window.innerHeight);
  });

  E.active = true;
  E.active = true;
  console.log("UnkScape3D: v1.6 live - resource-driven props, one source of truth.");
};

function buildPropMesh(res, surfY, TE) {
  var vconf = RESOURCE_VISUALS[res.type];
  if (!vconf) return null;

  var r3x = res.x * SCALE;
  var r3z = res.y * SCALE;
  var propNode = new THREE.Group();
  propNode.position.set(r3x, surfY, r3z);
  propNode.userData.resourceId = res.uid;

  if (vconf.isRock) {
    var rockTex = TE ? TE.getProceduralTexture('stonepath', vconf.canopy, 40) : null;
    var rockMat = rockTex ? new THREE.MeshLambertMaterial({ map: rockTex }) : getCachedMat(vconf.canopy);
    var rockSizes = [[1.2, 0.9, 0.9], [0.8, 1.2, 0.7], [0.7, 0.8, 1.1]];
    var rockOffsets = [[0, 0, 0], [0.6, 0.2, 0.3], [-0.5, 0.1, -0.3]];
    for (var ri = 0; ri < 3; ri++) {
      var rGeo = new THREE.BoxGeometry(
        rockSizes[ri][0] * TSCALE * 0.5,
        rockSizes[ri][1] * vconf.canopyH,
        rockSizes[ri][2] * TSCALE * 0.5
      );
      if (TE && TE.applyLowPolyJitter) TE.applyLowPolyJitter(rGeo, 0.15);
      var rMesh = new THREE.Mesh(rGeo, rockMat);
      rMesh.position.set(
        rockOffsets[ri][0],
        rockSizes[ri][1] * vconf.canopyH * 0.5 + rockOffsets[ri][1],
        rockOffsets[ri][2]
      );
      rMesh.userData.resourceId = res.uid;
      propNode.add(rMesh);
    }
  } else {
    if (vconf.trunk && vconf.trunkH > 0) {
      var barkMat = getCachedMat(vconf.trunk);
      var trunkGeo = new THREE.CylinderGeometry(TSCALE * 0.1, TSCALE * 0.13, vconf.trunkH, 6);
      var trunkMesh = new THREE.Mesh(trunkGeo, barkMat);
      trunkMesh.position.set(0, vconf.trunkH * 0.5, 0);
      trunkMesh.userData.resourceId = res.uid;
      propNode.add(trunkMesh);
    }
    // Stacked cones for a proper low-poly tree canopy
    var leafMat = getCachedMat(vconf.canopy);
    var coneR = vconf.canopyR * TSCALE * 0.55;
    var coneH = vconf.canopyH * 1.2;
    var cone1Geo = new THREE.ConeGeometry(coneR, coneH, 7);
    var cone1 = new THREE.Mesh(cone1Geo, leafMat);
    cone1.position.set(0, vconf.trunkH + coneH * 0.5, 0);
    cone1.userData.resourceId = res.uid;
    propNode.add(cone1);
    var cone2Geo = new THREE.ConeGeometry(coneR * 0.7, coneH * 0.65, 7);
    var cone2 = new THREE.Mesh(cone2Geo, leafMat);
    cone2.position.set(0, vconf.trunkH + coneH * 0.98, 0);
    cone2.userData.resourceId = res.uid;
    propNode.add(cone2);
  }
  return propNode;
}

E.RebuildProps = function(pxX, pxY) {
  if (!E.scene) return;

  if (E.propGroup) {
    E.scene.remove(E.propGroup);
    E.propGroup.traverse(function(child) {
      if (child.isMesh) { child.geometry.dispose(); }
    });
    E.propGroup = null;
  }

  E.propGroup = new THREE.Group();
  E.lastPropX = pxX;
  E.lastPropY = pxY;

  var D = window.UnkScape;
  var TE = D && D.TextureEngine;
  var resources = D && D.game && D.game.entities && D.game.entities.resources;
  if (!resources || !resources.length) {
    E.scene.add(E.propGroup);
    return;
  }

  var candidates = [];
  var len = resources.length;
  for (var i = 0; i < len; i++) {
    var res = resources[i];
    if (!res || !res.uid || !res.x) continue;
    if (res.amount !== undefined && res.amount <= 0) continue;
    if (res.cooldown > 0) continue;
    if (!RESOURCE_VISUALS[res.type]) continue;
    if (RESOURCE_VISUALS[res.type] === null) continue;
    var rdx = Math.abs(res.x - pxX);
    var rdz = Math.abs(res.y - pxY);
    if (rdx > PROP_PIXEL_RADIUS || rdz > PROP_PIXEL_RADIUS) continue;
    candidates.push(res);
  }

  candidates.sort(function(a, b) {
    var da = Math.hypot(a.x - pxX, a.y - pxY);
    var db = Math.hypot(b.x - pxX, b.y - pxY);
    return da - db;
  });

  var built = 0;
  for (var ci = 0; ci < candidates.length && built < PROP_MAX; ci++) {
    var res = candidates[ci];
    var rtx = Math.floor(res.x / TILE);
    var rtz = Math.floor(res.y / TILE);
    var surfY = getSurfaceY(rtx, rtz);
    var propNode = buildPropMesh(res, surfY, TE);
    if (propNode) {
      E.propGroup.add(propNode);
      built++;
    }
  }

  E.scene.add(E.propGroup);
  console.log("UnkScape3D: Props rebuilt at (" + Math.round(pxX) + "," + Math.round(pxY) + ") - " + built + " meshes from " + candidates.length + " candidates");
};

E.Update3DTerrain = function(pxX, pxY) {
  if (!E.scene) return;
  var tileX = Math.floor(pxX / TILE);
  var tileY = Math.floor(pxY / TILE);
  if (Math.abs(tileX - E.lastChunkX) < 3 && Math.abs(tileY - E.lastChunkY) < 3) return;
  E.lastChunkX = tileX;
  E.lastChunkY = tileY;

  if (E.terrainGroup) {
    E.scene.remove(E.terrainGroup);
    E.terrainGroup.traverse(function(child) {
      if (child.isMesh) { child.geometry.dispose(); child.material.dispose(); }
    });
    E.terrainGroup = null;
  }

  E.terrainGroup = new THREE.Group();
  var renderRadius = TERRAIN_RADIUS;

  for (var dx = -renderRadius; dx <= renderRadius; dx++) {
    for (var dz = -renderRadius; dz <= renderRadius; dz++) {
      var tx = tileX + dx;
      var tz = tileY + dz;
      if (tx < 0 || tz < 0) continue;
      var tileType = getTileType(tx, tz);
      var hexColor = TILE_COLORS[tileType] || getTileColor(tx, tz);
      var heightCalc = getTileHeight(tx, tz);
      var finalHeight = Math.max(0.4, 1 + heightCalc);
      var noiseLevel = (tileType === 'stonepath') ? 35 : 20;
      var blockMat = getTexMat(tileType, hexColor, noiseLevel);
      var blockGeo = new THREE.BoxGeometry(TSCALE, 2.5, TSCALE);
      var blockMesh = new THREE.Mesh(blockGeo, blockMat);
      blockMesh.position.set(tx * TSCALE, finalHeight - 1.25, tz * TSCALE);
      E.terrainGroup.add(blockMesh);
    }
  }
  E.scene.add(E.terrainGroup);

  E.RebuildProps(pxX, pxY);
};

E.RenderFrame3D = function(playerData) {
  if (!E.active || !E.renderer) return;
  if (playerData && E.playerVisual) {
    var pxX = playerData.x || 0;
    var pxY = playerData.y || 0;
    E.Update3DTerrain(pxX, pxY);

    var propDist = Math.hypot(pxX - E.lastPropX, pxY - E.lastPropY);
    if (propDist > PROP_REBUILD_THRESHOLD) {
      E.RebuildProps(pxX, pxY);
    }

    var target3X = pxX * SCALE;
    var target3Z = pxY * SCALE;
    var tileX = Math.floor(pxX / TILE);
    var tileY = Math.floor(pxY / TILE);
    var groundH = getTileHeight(tileX, tileY);
    var playerY = 1 + groundH;
    E.playerVisual.position.set(target3X, playerY, target3Z);
    var vx = playerData.vx || 0;
    var vy = playerData.vy || 0;
    if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
      E.playerVisual.rotation.y = Math.atan2(vx, vy);
    }

    var zoom = (E.cameraZoomOffset !== undefined) ? E.cameraZoomOffset : 24.0;
    var oa = (E.cameraOrbitAngle !== undefined) ? E.cameraOrbitAngle : 0;
    var op = (E.cameraOrbitPhi !== undefined) ? E.cameraOrbitPhi : 0.5;
    var camOffX = zoom * Math.sin(oa) * Math.cos(op);
    var camOffY = zoom * Math.sin(op) + 12.0;
    var camOffZ = zoom * Math.cos(oa) * Math.cos(op) + 8.0;
    var camTargetX = target3X + camOffX;
    var camTargetY = playerY + camOffY;
    var camTargetZ = target3Z + camOffZ;
    E.camera.position.x += (camTargetX - E.camera.position.x) * 0.08;
    E.camera.position.y += (camTargetY - E.camera.position.y) * 0.08;
    E.camera.position.z += (camTargetZ - E.camera.position.z) * 0.08;
    E.camera.lookAt(target3X, playerY, target3Z);

    var D = window.UnkScape;
    if (D && D.CharacterVisuals && D.CharacterVisuals.animateMesh) {
      var velocity = Math.hypot(vx, vy);
      var time = performance.now() * 0.001;
      D.CharacterVisuals.animateMesh(E.playerVisual, velocity, time);
      if (D && D.CharacterVisuals && D.CharacterVisuals.updateWeapon) {
        var weaponId = D.game && D.game.player ?
          ((D.game.player.equipment && D.game.player.equipment.weapon) ||
           (D.game.hotbar && D.game.hotbar.slots ? D.game.hotbar.slots[D.game.hotbar.selected || 0] : null))
          : null;
        D.CharacterVisuals.updateWeapon(E.playerVisual, weaponId);
      }
    }
  }
  E.renderer.render(E.scene, E.camera);
};

})();

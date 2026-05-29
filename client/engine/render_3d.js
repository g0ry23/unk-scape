window.UnkScape3D = window.UnkScape3D || {};

const E = window.UnkScape3D;

(function() {

    console.log("UnkScape3D: Injecting WebGL 3D Viewport into Core Game...");

    E.active       = false;
    E.scene        = null;
    E.camera       = null;
    E.renderer     = null;
    E.playerMesh   = null; // legacy alias
    E.playerVisual = null; // modular CharacterVisuals group
    E.terrainGroup = null;
    E.lastChunkX   = -9999;
    E.lastChunkY   = -9999;

    // ── SCALE CONSTANTS ──────────────────────────────────────────────
    // Player pixel coords (e.g. 6000) mapped to 3D world units.
    // SCALE=0.1 means player sits at (600, y, 600) in 3D.
    // TSCALE = 32 pixels * 0.1 = 3.2 units wide per tile block.
    // This ensures terrain tiles align exactly with player position.
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

    // ── PRIVATE HELPERS ───────────────────────────────────────────────

    function getTileColor(tx, ty) {
        const D = window.Duskfall;
        if (D && D.game && D.game.world && D.game.world.tiles && D.game.world.w) {
            const idx  = ty * D.game.world.w + tx;
            const type = D.game.world.tiles[idx];
            if (type && TILE_COLORS[type]) return TILE_COLORS[type];
        }
        return (tx + ty) % 2 === 0 ? '#2d6a3f' : '#36854f';
    }

    function getTileHeight(tx, ty) {
        const D = window.Duskfall;
        if (D && typeof D.GetTerrainAt === 'function') {
            const td = D.GetTerrainAt(tx, ty);
            return (td.z00 || 0) * 0.3;
        }
        return Math.max(0, Math.sin(tx * 0.2) * Math.cos(ty * 0.2) * 3);
    }

    // ── INITIALIZE 3D ────────────────────────────────────────────────
    E.Initialize3D = function() {

        if (typeof THREE === 'undefined') {
            console.error("UnkScape3D: Three.js library not loaded!");
            return;
        }

        const gameCanvas = document.getElementById("game");
        if (!gameCanvas) {
            console.error("UnkScape3D: Could not find canvas id='game'");
            return;
        }

        // Dedicated WebGL canvas — inserted BEFORE game canvas so 3D is background layer
        const webglCanvas = document.createElement('canvas');
        webglCanvas.id = 'game-webgl';
        webglCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
        gameCanvas.parentElement.insertBefore(webglCanvas, gameCanvas);

        // Transparent scene — 2D canvas layers on top
        E.scene = new THREE.Scene();
        E.scene.background = null;

        // Perspective camera
        const aspect = window.innerWidth / window.innerHeight;
        E.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);
        E.camera.position.set(0, 25, 30);

        // Alpha WebGL renderer
        E.renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, antialias: true, alpha: true });
        E.renderer.setClearColor(0x000000, 0);
        E.renderer.setSize(window.innerWidth, window.innerHeight);

        // Lighting — boosted for crisp visibility
        E.scene.add(new THREE.AmbientLight('#ffffff', 1.0));
        const sun = new THREE.DirectionalLight('#ffe8c0', 1.2);
        sun.position.set(80, 120, 60);
        E.scene.add(sun);

        // ── Character mesh: use CharacterVisuals if loaded, else cylinder fallback ──
        const D = window.Duskfall;
        if (D && D.CharacterVisuals && D.CharacterVisuals.createModularMesh) {
            const playerData   = D.game?.player || {};
            E.playerVisual     = D.CharacterVisuals.createModularMesh(playerData);
            E.playerVisual.position.set(0, 1.5, 0);
            E.scene.add(E.playerVisual);
            E.playerMesh = E.playerVisual; // legacy alias
            console.log("UnkScape3D: CharacterVisuals mesh instantiated.");
        } else {
            // Fallback yellow cylinder until character.js loads
            const pGeo   = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
            const pMat   = new THREE.MeshLambertMaterial({ color: '#f1c40f' });
            E.playerMesh = new THREE.Mesh(pGeo, pMat);
            E.playerMesh.position.set(0, 1.5, 0);
            E.scene.add(E.playerMesh);
            E.playerVisual = E.playerMesh;
            console.log("UnkScape3D: Fallback cylinder active — load character.js to upgrade.");
        }

        E.camera.lookAt(E.playerVisual.position);
        E.active = true;

        window.addEventListener('resize', function() {
            E.camera.aspect = window.innerWidth / window.innerHeight;
            E.camera.updateProjectionMatrix();
            E.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        console.log("UnkScape3D: 3D Render Bridge live. Canvas id=game-webgl. Terrain system armed.");
    };

    // ── TERRAIN GENERATOR ────────────────────────────────────────────
    E.Update3DTerrain = function(pxX, pxY) {
        if (!E.scene) return;

        const tileX  = Math.floor(pxX / TILE);
        const tileY  = Math.floor(pxY / TILE);
        const chunkX = Math.floor(tileX / 5);
        const chunkY = Math.floor(tileY / 5);
        if (chunkX === E.lastChunkX && chunkY === E.lastChunkY) return;
        E.lastChunkX = chunkX;
        E.lastChunkY = chunkY;

        if (E.terrainGroup) {
            E.scene.remove(E.terrainGroup);
            E.terrainGroup.traverse(function(child) {
                if (child.isMesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                }
            });
            E.terrainGroup = null;
        }

        E.terrainGroup = new THREE.Group();
        const renderRadius = 14;
        const blockGeo     = new THREE.BoxGeometry(TSCALE, 1, TSCALE);

        for (var dx = -renderRadius; dx <= renderRadius; dx++) {
            for (var dz = -renderRadius; dz <= renderRadius; dz++) {
                var tx = tileX + dx;
                var ty = tileY + dz;
                if (tx < 0 || ty < 0) continue;

                var heightCalc  = getTileHeight(tx, ty);
                var finalHeight = Math.max(0.4, 1 + heightCalc);
                var hexColor    = getTileColor(tx, ty);

                var blockMat  = new THREE.MeshLambertMaterial({ color: hexColor });
                var blockMesh = new THREE.Mesh(blockGeo, blockMat);
                blockMesh.scale.set(1, finalHeight, 1);
                blockMesh.position.set(tx * TSCALE, finalHeight * 0.5, ty * TSCALE);
                E.terrainGroup.add(blockMesh);
            }
        }

        E.scene.add(E.terrainGroup);
        console.log("UnkScape3D: Terrain grid regenerated — centre tile (" + tileX + ", " + tileY + ")");
    };

    // ── FRAME RENDER LOOP ────────────────────────────────────────────
    E.RenderFrame3D = function(playerData) {
        if (!E.active || !E.renderer) return;

        if (playerData && E.playerVisual) {
            var pxX = playerData.x || 0;
            var pxY = playerData.y || 0;

            // Regenerate terrain chunks around player
            E.Update3DTerrain(pxX, pxY);

            // Convert pixel coords to 3D world units
            var target3X = pxX * SCALE;
            var target3Z = pxY * SCALE;

            // Sample ground height so character rides terrain elevation
            var tileX   = Math.floor(pxX / TILE);
            var tileY   = Math.floor(pxY / TILE);
            var groundH = getTileHeight(tileX, tileY);
            var playerY = 1 + groundH; // sit on terrain surface

            // ── Sync character mesh to player world position ──
            E.playerVisual.position.set(target3X, playerY, target3Z);

            // ── Face direction of movement ──
            var vx = playerData.vx || 0;
            var vy = playerData.vy || 0;
            if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
                E.playerVisual.rotation.y = Math.atan2(vx, vy);
            }

            // ── Smooth camera lerp — third-person tracking ──
            var camTargetX = target3X;
            var camTargetY = playerY + 18;
            var camTargetZ = target3Z + 22;
            E.camera.position.x += (camTargetX - E.camera.position.x) * 0.08;
            E.camera.position.y += (camTargetY - E.camera.position.y) * 0.08;
            E.camera.position.z += (camTargetZ - E.camera.position.z) * 0.08;
            E.camera.lookAt(E.playerVisual.position);

            // ── Character limb animation ──
            var D = window.Duskfall;
            if (D && D.CharacterVisuals && D.CharacterVisuals.animateMesh) {
                var velocity = Math.hypot(vx, vy);
                var time     = performance.now() * 0.001;
                D.CharacterVisuals.animateMesh(E.playerVisual, velocity, time);
            }
        }

        E.renderer.render(E.scene, E.camera);
    };

})();

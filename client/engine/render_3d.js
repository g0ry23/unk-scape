window.UnkScape3D = window.UnkScape3D || {};

const E = window.UnkScape3D;

(function() {

    console.log("UnkScape3D: Injecting WebGL 3D Viewport into Core Game...");

    E.active       = false;
    E.scene        = null;
    E.camera       = null;
    E.renderer     = null;
    E.playerMesh   = null;
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

    // Resolve the best available color for tile (tx, ty)
    function getTileColor(tx, ty) {
        const D = window.Duskfall;
        if (D && D.game && D.game.world && D.game.world.tiles && D.game.world.w) {
            const idx  = ty * D.game.world.w + tx;
            const type = D.game.world.tiles[idx];
            if (type && TILE_COLORS[type]) return TILE_COLORS[type];
        }
        // Procedural checkerboard fallback
        return (tx + ty) % 2 === 0 ? '#2d6a3f' : '#36854f';
    }

    // Resolve elevation for tile (tx, ty) — sine-wave proc-gen via GetTerrainAt
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

        // Dedicated WebGL canvas — must not reuse the canvas that has 2d context
        const webglCanvas         = document.createElement('canvas');
        webglCanvas.id            = 'game-webgl';
        webglCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
        gameCanvas.parentElement.appendChild(webglCanvas);

        // Scene + sky
        E.scene            = new THREE.Scene();
        E.scene.background = new THREE.Color('#0b0e1a');

        // Perspective camera
        const aspect = window.innerWidth / window.innerHeight;
        E.camera     = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);
        E.camera.position.set(0, 25, 30);

        // WebGL renderer
        E.renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, antialias: true });
        E.renderer.setSize(window.innerWidth, window.innerHeight);

        // Lighting: ambient + warm directional sun
        E.scene.add(new THREE.AmbientLight('#ffffff', 0.55));
        const sun = new THREE.DirectionalLight('#ffe8c0', 0.9);
        sun.position.set(80, 120, 60);
        E.scene.add(sun);

        // Player avatar — gold cylinder placeholder
        const pGeo     = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
        const pMat     = new THREE.MeshLambertMaterial({ color: '#f1c40f' });
        E.playerMesh   = new THREE.Mesh(pGeo, pMat);
        E.playerMesh.position.set(0, 1.5, 0);
        E.scene.add(E.playerMesh);

        E.camera.lookAt(E.playerMesh.position);
        E.active = true;

        window.addEventListener('resize', function() {
            E.camera.aspect = window.innerWidth / window.innerHeight;
            E.camera.updateProjectionMatrix();
            E.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        console.log("UnkScape3D: 3D Render Bridge live. Canvas id=game-webgl. Terrain system armed.");
    };

    // ── TERRAIN GENERATOR ────────────────────────────────────────────
    /**
     * Procedural 3D Tile Grid Renderer
     * Builds elevated block columns around the player position.
     * Regenerates only when the player crosses a new 5-tile chunk boundary.
     * Disposes old geometry to prevent GPU memory leaks.
     *
     * @param {number} pxX  player pixel X (e.g. 6000)
     * @param {number} pxY  player pixel Y (e.g. 6000)
     */
    E.Update3DTerrain = function(pxX, pxY) {
        if (!E.scene) return;

        // Convert pixel coords to tile grid coords
        const tileX = Math.floor(pxX / TILE);
        const tileY = Math.floor(pxY / TILE);

        // Regenerate only when entering a new 5-tile chunk
        const chunkX = Math.floor(tileX / 5);
        const chunkY = Math.floor(tileY / 5);
        if (chunkX === E.lastChunkX && chunkY === E.lastChunkY) return;
        E.lastChunkX = chunkX;
        E.lastChunkY = chunkY;

        // Dispose old terrain group — prevents GPU memory leaks
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

        // Reuse one BoxGeometry blueprint for all blocks (good for low-spec)
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

                // Scale Y to represent elevation column height
                blockMesh.scale.set(1, finalHeight, 1);

                // Position: tile coord * TSCALE aligns with player 3D position
                // Y: half-height so block base sits flush at world y=0
                blockMesh.position.set(
                    tx * TSCALE,
                    finalHeight * 0.5,
                    ty * TSCALE
                );

                E.terrainGroup.add(blockMesh);
            }
        }

        E.scene.add(E.terrainGroup);
        console.log("UnkScape3D: Terrain grid regenerated — centre tile (" + tileX + ", " + tileY + ")");
    };

    // ── FRAME RENDER LOOP ────────────────────────────────────────────
    /**
     * Called every frame from game.js loop via E.RenderFrame3D(this.player)
     */
    E.RenderFrame3D = function(playerData) {
        if (!E.active || !E.renderer) return;

        if (playerData) {
            var pxX = playerData.x || 0;
            var pxY = playerData.y || 0;

            // Regenerate terrain chunks around current player tile
            E.Update3DTerrain(pxX, pxY);

            // Convert pixel coords to 3D world units (same SCALE as terrain blocks)
            var target3X = pxX * SCALE;
            var target3Z = pxY * SCALE;

            // Sample ground height at player tile so cylinder rides slopes smoothly
            var tileX   = Math.floor(pxX / TILE);
            var tileY   = Math.floor(pxY / TILE);
            var groundH = getTileHeight(tileX, tileY);
            var playerY = 1 + groundH + 1.5; // block top + half-height of cylinder

            E.playerMesh.position.set(target3X, playerY, target3Z);

            // Third-person camera: 18 units above player, 20 units behind
            E.camera.position.set(target3X, playerY + 18, target3Z + 20);
            E.camera.lookAt(E.playerMesh.position);
        }

        E.renderer.render(E.scene, E.camera);
    };

})();

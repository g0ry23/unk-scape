/* ============================================================
   UNK-SCAPE: BOUNDLESS ISOMETRIC WORLD MATRICES & ENTITY BRIDGE
   File: client/engine/world.js
   Version: v0.4.9 (Entity & Tree Sync)
   ============================================================ */
(function(D) {
  const US = D;

    console.log('[UNK-SCAPE] World Matrix & Entity Bridge v0.4.9 loading...');

    US.WorldConfig = US.WorldConfig || {
        mapSize: 2000,
        tileW: 64,
        tileH: 32
    };

    /**
     * Safe procedural terrain fetcher — gives each tile 3D height corners
     * using sine/cosine wave generation so terrain slopes like RuneScape hills.
     */
    US.GetTerrainAt = function(x, y) {
        const h00 = Math.max(0, Math.floor(Math.sin(x * 0.15) * Math.cos(y * 0.15) * 8));
        const h10 = Math.max(0, Math.floor(Math.sin((x + 1) * 0.15) * Math.cos(y * 0.15) * 8));
        const h01 = Math.max(0, Math.floor(Math.sin(x * 0.15) * Math.cos((y + 1) * 0.15) * 8));
        const h11 = Math.max(0, Math.floor(Math.sin((x + 1) * 0.15) * Math.cos((y + 1) * 0.15) * 8));
return {            z00: h00, z10: h10, z01: h01, z11: h11,
            color: (x + y) % 2 === 0 ? '#2c3e50' : '#34495e'
        };
    };

    /**
     * Master Isometric Render Runner — v0.4.9
     * Pulls player and world entities into the 3D iso pipeline.
     * Called from the game loop OUTSIDE g.camera.apply(ctx) so screen coords
     * are absolute viewport pixels, not world-space.
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     * @param {object} player   — UnkScape player object (player.x / player.y in tile units)
     * @param {object} gameEntities — g.entities (resources, enemies, etc.)
     */
    US.RenderIsometricScene = function(ctx, canvasWidth, canvasHeight, player, gameEntities) {
        if (!ctx) return;
        if (typeof US.isoProject !== 'function') return;  // render.js must load first
        if (typeof US.renderTurfTile !== 'function') return;

        // Fallback coordinates if player isn't initialised yet
        const TILE = US.TILE || 32;
        const pX = player ? (player.x / TILE) : 100;
        const pY = player ? (player.y / TILE) : 100;

        const viewRadius = 20; // tiles rendered in each direction from player
        const startX = Math.max(0, Math.floor(pX) - viewRadius);
        const endX   = Math.min(US.WorldConfig.mapSize, Math.floor(pX) + viewRadius);
        const startY = Math.max(0, Math.floor(pY) - viewRadius);
        const endY   = Math.min(US.WorldConfig.mapSize, Math.floor(pY) + viewRadius);

        const cX = canvasWidth  / 2;
        const cY = canvasHeight / 2;

        // --- STEP 1: PAINTER'S ALGORITHM — depth sort tiles (back-to-front) ---
        const tileList = [];
        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                tileList.push({ x, y, depth: x + y });
            }
        }
        tileList.sort((a, b) => a.depth - b.depth);

        // --- STEP 2: RENDER TERRAIN TILES ---
        for (const t of tileList) {
            const terr = US.GetTerrainAt(t.x, t.y);
            const relX = t.x - pX;
            const relY = t.y - pY;

            // isoProject gives screen-space offset from the iso origin
            const screenPos = US.isoProject(relX, relY, terr.z00);

            ctx.save();
            ctx.translate(cX + screenPos.x, cY + screenPos.y);
            // Pass a flat tile config (z all 0) — elevation is already in translate
            US.renderTurfTile(ctx, 0, 0, {
                z00: 0, z10: terr.z10 - terr.z00,
                z01: terr.z01 - terr.z00, z11: terr.z11 - terr.z00,
                color: terr.color
            });
            ctx.restore();
        }

        // --- STEP 3: PLAYER CHARACTER (iso-centred circle + body) ---
        const playerTerr = US.GetTerrainAt(Math.floor(pX), Math.floor(pY));
        const playerPos  = US.isoProject(0, 0, playerTerr.z00);

        ctx.save();
        ctx.translate(cX + playerPos.x, cY + playerPos.y);

        // Faction-coloured base indicator ring (OSRS-style)
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fillStyle = (player && player.factionId === 'blood_oath') ? '#c0392b' : '#2980b9';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Character body placeholder
        ctx.fillStyle = '#f1c40f'; // gold
        ctx.fillRect(-8, -30, 16, 30);

        // Name label
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(
            (player && player.characterName) ? player.characterName : 'YOU',
            0, -36
        );

        ctx.restore();
    };

    console.log('[UNK-SCAPE] World Matrix & Entity Bridge v0.4.9 — US.GetTerrainAt / US.RenderIsometricScene live.');

})(window.UnkScape = window.UnkScape || {});

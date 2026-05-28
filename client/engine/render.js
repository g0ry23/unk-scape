/**
 * UNK-SCAPE Advanced 2.5D Depth-Sorted Rendering Engine
 * Architecture Namespace: window.UnkScape.Engine.Renderer
 * Implementation Path: client/engine/render.js
 */
((U) => {
    U.Engine = U.Engine || {};

    const Renderer = {

        ctx: null,
        canvas: null,

        // Base isometric tile geometry matching classic fantasy OSRS look
        tileWidth: 64,
        tileHeight: 32,
        wallHeight: 44, // 44px vertical extrusion for structures

        /**
         * Binds the rendering context directly to the active HTML5 canvas DOM element
         * @param {string} canvasId - Element ID string of the target canvas
         */
        init(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (this.canvas) {
                this.ctx = this.canvas.getContext('2d');
            }
            console.log("[UNK-SCAPE DIRECTOR] Advanced 2.5D Depth Renderer fully operational.");
        },

        /**
         * Standard Isometric projection transformation formula
         */
        worldToScreen(worldX, worldY, worldZ = 0, camera) {
            const isoX = (worldX - worldY) * (this.tileWidth / 2);
            const isoY = (worldX + worldY) * (this.tileHeight / 2);

            // Adjust coordinates using camera/viewport tracking center offsets
            const cx = camera ? camera.offsetX : (this.canvas.width / 2);
            const cy = camera ? camera.offsetY : (this.canvas.height / 2);

            return {
                x: isoX + cx,
                y: isoY - (worldZ * this.wallHeight) + cy
            };
        },

        /**
         * Executes a single, clean visual frame pass utilizing Painter's Sorting Algorithm
         * @param {Object} world - Master world map instance database
         * @param {Object} player - Local player configuration tracking node
         * @param {Object} camera - Viewport offset tracking coordinator
         */
        renderFrame(world, player, camera) {
            const ctx = this.ctx;
            if (!ctx || !world || !player) return;

            // 1. Clear frame buffer fully for redrawing step
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 2. Build the dynamic Render Stack Queue
            let renderQueue = [];

            // Visible culling screen distance parameters
            const radius = 16;
            const startX = Math.max(0, Math.floor(player.x) - radius);
            const endX   = Math.min(world.sizeX || 50, Math.floor(player.x) + radius);
            const startY = Math.max(0, Math.floor(player.y) - radius);
            const endY   = Math.min(world.sizeY || 50, Math.floor(player.y) + radius);

            // Populate static grid elements into the queue
            for (let x = startX; x < endX; x++) {
                for (let y = startY; y < endY; y++) {
                    if (!world.grid || !world.grid[x] || !world.grid[x][y]) continue;

                    const tile = world.grid[x][y];
                    const screenPos = this.worldToScreen(x, y, tile.z || 0, camera);

                    renderQueue.push({
                        depth: x + y + ((tile.z || 0) * 0.5), // Multi-layer height depth sort calculation
                        type: 'TILE',
                        pos: screenPos,
                        data: tile
                    });

                    // Parse structural data parameters (Walls/Buildings/Trees)
                    if (tile.structure) {
                        // Dynamic calculation: is player currently standing under this specific layer?
                        const isUnderRoof = (Math.abs(player.x - x) < 2 && Math.abs(player.y - y) < 2);

                        renderQueue.push({
                            depth: x + y + ((tile.z || 0) * 0.5) + 0.1, // Offset slightly to render directly above ground floor
                            type: 'STRUCTURE',
                            pos: screenPos,
                            underRoof: isUnderRoof,
                            data: tile.structure
                        });
                    }
                }
            }

            // Push our newly animated local player entity into the render depth stack
            const playerScreenPos = this.worldToScreen(player.x, player.y, player.z, camera);
            renderQueue.push({
                depth: player.x + player.y + (player.z * 0.5),
                type: 'PLAYER',
                pos: playerScreenPos,
                data: player
            });

            // 3. Mathematical Depth Sort (The ultimate fix against overlapping graphic artifacts)
            renderQueue.sort((a, b) => a.depth - b.depth);

            // 4. Final Blit Execution Pipeline
            renderQueue.forEach(item => {
                switch (item.type) {
                    case 'TILE':
                        this.drawIsoTile(ctx, item.pos, item.data.color);
                        break;
                    case 'STRUCTURE':
                        this.drawStructure(ctx, item.pos, item.data, item.underRoof);
                        break;
                    case 'PLAYER':
                        this.drawPlayerCharacter(ctx, item.pos, item.data);
                        break;
                }
            });
        },

        drawIsoTile(ctx, pos, color) {
            const w = this.tileWidth;
            const h = this.tileHeight;

            ctx.fillStyle = color || "#34495e"; // Clean survival tile tint grey
            ctx.beginPath();
            ctx.moveTo(pos.x,         pos.y);
            ctx.lineTo(pos.x + w / 2, pos.y + h / 2);
            ctx.lineTo(pos.x,         pos.y + h);
            ctx.lineTo(pos.x - w / 2, pos.y + h / 2);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = "rgba(0,0,0,0.06)"; // Faint grid line aesthetic
            ctx.stroke();
        },

        drawStructure(ctx, pos, struct, underRoof) {
            const w   = this.tileWidth;
            const h   = this.tileHeight;
            const ext = this.wallHeight;

            // Apply our critical dynamic alpha fade out for roofs/walls when player goes inside
            ctx.globalAlpha = underRoof ? 0.15 : 1.0;

            if (struct.type === 'wall') {
                // Left Facing Wall block segment projection
                ctx.fillStyle = "#7f8c8d";
                ctx.beginPath();
                ctx.moveTo(pos.x - w/2, pos.y + h/2);
                ctx.lineTo(pos.x - w/2, pos.y + h/2 - ext);
                ctx.lineTo(pos.x,       pos.y + h - ext);
                ctx.lineTo(pos.x,       pos.y + h);
                ctx.closePath();
                ctx.fill();

                // Right Facing Wall block segment projection
                ctx.fillStyle = "#95a5a6"; // Highlighted side
                ctx.beginPath();
                ctx.moveTo(pos.x,       pos.y + h);
                ctx.lineTo(pos.x,       pos.y + h - ext);
                ctx.lineTo(pos.x + w/2, pos.y + h/2 - ext);
                ctx.lineTo(pos.x + w/2, pos.y + h/2);
                ctx.closePath();
                ctx.fill();

            } else if (struct.type === 'tree') {
                // Render mystical purple tree trunks matching Firefly artwork vibe
                ctx.fillStyle = "#5e35b1";
                ctx.fillRect(pos.x - 4, pos.y + h/2 - ext, 8, ext);

                ctx.fillStyle = "#263238"; // Dark dense forest crown canopy
                ctx.beginPath();
                ctx.arc(pos.x, pos.y + h/2 - ext - 8, 16, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1.0; // Instantly restore context opacity safety default
        },

        drawPlayerCharacter(ctx, pos, player) {
            player.animTick = player.animTick || 0;

            // Speed step increment based explicitly on our new WASD isMoving tracking flag
            if (player.isMoving) {
                player.animTick += 0.22; // Smooth running cadence pace
            } else {
                player.animTick += 0.04; // Idle breathing simulation cycle
            }

            // A. RENDER SHADOW DISC
            const shadowBob = player.isMoving ? Math.abs(Math.sin(player.animTick)) * 2 : 0;
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.beginPath();
            ctx.ellipse(pos.x, pos.y + 12, 12 - shadowBob, 6 - (shadowBob / 2), 0, 0, Math.PI * 2);
            ctx.fill();

            // Set up our relative layout position variables
            let torsoBobY   = 0;
            let leftLegX    = -5;
            let rightLegX   = 5;
            let footHeightY = 10;

            if (player.isMoving) {
                // Torso bobs up and down double-time relative to limb swinging cycles
                torsoBobY = Math.abs(Math.sin(player.animTick * 2)) * -3.5;

                // Classic pendulum stride calculation
                leftLegX    += Math.cos(player.animTick) * 5.5;
                rightLegX   -= Math.cos(player.animTick) * 5.5;
                footHeightY += Math.sin(player.animTick) * -1.5;
            } else {
                // Breathe gently when idle
                torsoBobY = Math.sin(player.animTick) * -1.2;
            }

            // B. DRAW FOOT 1 & FOOT 2 (Eliminates the sliding/scooting issue completely!)
            ctx.fillStyle = "#2c3e50";
            ctx.beginPath();
            ctx.arc(pos.x + leftLegX,  pos.y + footHeightY + (player.isMoving && Math.cos(player.animTick) > 0  ? -2 : 0), 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(pos.x + rightLegX, pos.y + footHeightY + (player.isMoving && Math.cos(player.animTick) <= 0 ? -2 : 0), 3.5, 0, Math.PI * 2);
            ctx.fill();

            // C. DRAW RECTANGULAR/ROUNDED TORSO TUNIC LAYER
            ctx.fillStyle = player.factionColor || "#2980b9";
            ctx.beginPath();
            ctx.arc(pos.x, pos.y + torsoBobY + 2, 8, 0, Math.PI * 2);
            ctx.fillRect(pos.x - 8, pos.y + torsoBobY + 2, 16, 7);
            ctx.fill();

            // D. DRAW HEAD & SKINTONE BASE CAP
            ctx.fillStyle = "#e0a899";
            ctx.beginPath();
            ctx.arc(pos.x, pos.y + torsoBobY - 10, 5.5, 0, Math.PI * 2);
            ctx.fill();

            // Dark crown hair overlay style matching your character asset specs
            ctx.fillStyle = "#1e272e";
            ctx.beginPath();
            ctx.arc(pos.x, pos.y + torsoBobY - 11.5, 6, Math.PI, 0);
            ctx.fill();

            // E. DRAW WEAPON (Swings along elegantly in step rhythm with vector runs)
            let gearSwingX = player.isMoving ? Math.sin(player.animTick) * 2.5 : 0;
            ctx.fillStyle = "#95a5a6"; // Sword steel blade tint
            ctx.fillRect(pos.x + 9 + gearSwingX, pos.y + torsoBobY - 5, 3.5, 14);
            ctx.fillStyle = "#d4af37"; // Golden handle crossguard guard accents
            ctx.fillRect(pos.x + 6 + gearSwingX, pos.y + torsoBobY + 4, 9, 2.5);

            // F. TEXT HUD: Clean nameplate strings floating overhead
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px monospace";
            ctx.shadowColor = "black";
            ctx.shadowBlur = 4;
            ctx.textAlign = "center";
            ctx.fillText(player.name, pos.x, pos.y + torsoBobY - 24);
            ctx.shadowBlur = 0; // Turn off shadows cleanly to prevent system text blurring
        }
    };

    U.Engine.Renderer = Renderer;

})(window.UnkScape = window.UnkScape || {});

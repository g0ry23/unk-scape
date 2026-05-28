/**
 * UNK-SCAPE Player Controller, Spawn Handler, and Vector Physics Engine
 * Architecture Namespace: window.UnkScape.Player
 * Implementation Path: client/engine/player.js
 */
((U) => {
    U.Player = {

        // High-fidelity character start defaults
        x: 15.0,            // Starting grid coordinates on the map
        y: 15.0,
        z: 0.0,             // Vertical elevation layer index
        speed: 0.12,        // Movement velocity multiplier per physics frame step
        radius: 0.35,       // Collision bounding volume size for wall pushing
        isMoving: false,    // Crucial runtime flag passed directly to the renderer for stride animations
        name: "Survivor",
        factionColor: "#2980b9", // Default Cobalt Blue for the Ironbound Order Accord

        // Character Core Stat Tracking Pools
        stats: {
            hp: 100,
            maxHp: 100,
            stamina: 100,
            maxStamina: 100,
            mana: 50,
            maxMana: 50
        },

        /**
         * Physics update tick executed exclusively on our fixed-timestep game loop accumulator (fixedDt = 1/60)
         * @param {Object} world - Active world instance containing map grid and structural boundaries
         */
        update(world) {
            // Verify our newly created input engine is online before calculating vectors
            if (!U.Engine || !U.Engine.Input) return;

            const vector = U.Engine.Input.getMovementVector();

            // Handle Idle state transitions instantly
            if (vector.x === 0 && vector.y === 0) {
                this.isMoving = false;
                return;
            }

            // Flag state as actively walking to trigger leg swinging & body bobbing inside the renderer
            this.isMoving = true;

            // Calculate potential placement variants for the current frame step
            let moveAmountX = vector.x * this.speed;
            let moveAmountY = vector.y * this.speed;

            // AXIS-ALIGNED SLIDING BOX COLLISION FILTERING
            // Step 1: Attempt movement along the X-axis alone
            let potentialX = this.x + moveAmountX;
            if (!this.checkWallCollision(potentialX, this.y, world)) {
                this.x = potentialX; // Clear to move
            }

            // Step 2: Attempt movement along the Y-axis alone
            let potentialY = this.y + moveAmountY;
            if (!this.checkWallCollision(this.x, potentialY, world)) {
                this.y = potentialY; // Clear to move
            }
        },

        /**
         * Evaluates character bounding parameters against structural map coordinates
         * @param {number} targetX - Evaluated X coordinate position
         * @param {number} targetY - Evaluated Y coordinate position
         * @param {Object} world - Core world storage object
         * @returns {boolean} True if a structural collision tile blocks movement
         */
        checkWallCollision(targetX, targetY, world) {
            // Check world limits first to prevent out-of-bounds crashes
            if (targetX < 0 || targetX >= world.sizeX || targetY < 0 || targetY >= world.sizeY) {
                return true;
            }

            // Sample adjacent tile coordinates based on player's physical width radius parameters
            const checkPoints = [
                { x: targetX - this.radius, y: targetY - this.radius },
                { x: targetX + this.radius, y: targetY - this.radius },
                { x: targetX - this.radius, y: targetY + this.radius },
                { x: targetX + this.radius, y: targetY + this.radius }
            ];

            for (let i = 0; i < checkPoints.length; i++) {
                const tileX = Math.floor(checkPoints[i].x);
                const tileY = Math.floor(checkPoints[i].y);

                // Safe fallback check for unallocated grid space chunks
                if (!world.grid || !world.grid[tileX] || !world.grid[tileX][tileY]) {
                    continue;
                }

                const tile = world.grid[tileX][tileY];

                // If a solid wall is detected in that map block, trigger an immediate stop action
                if (tile.structure && tile.structure.type === 'wall') {
                    return true;
                }
            }

            return false; // Path is entirely clear
        }
    };

})(window.UnkScape = window.UnkScape || {});

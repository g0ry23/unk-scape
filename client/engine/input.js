/**
 * UNK-SCAPE Pure Vanilla Real-Time WASD Vector Input Handler
 * Architecture Namespace: window.UnkScape.Engine.Input
 * Implementation Path: client/engine/input.js
 *
 * Dual-namespace bridge:
 *   - window.UnkScape.Engine.Input  (new engine object API)
 *   - window.Duskfall.Input         (legacy constructor shim for game.js compatibility)
 */
((U) => {
    U.Engine = U.Engine || {};

    // ── Core input state object ──────────────────────────────────────────────
    const Input = {

        // Track key states for direct movement control mapping
        keys: {
            KeyW: false,
            KeyA: false,
            KeyS: false,
            KeyD: false
        },

        /**
         * Attaches low-level hardware event listeners to the browser window context
         */
        init() {
            window.addEventListener('keydown', (e) => {
                if (e.code in this.keys) {
                    this.keys[e.code] = true;
                }
                // Prevent default browser behavior (scrolling the game window)
                if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
                    e.preventDefault();
                }
            });

            window.addEventListener('keyup', (e) => {
                if (e.code in this.keys) {
                    this.keys[e.code] = false;
                }
            });

            console.log("[UNK-SCAPE DIRECTOR] Input module synchronized to 'window.UnkScape'. WASD active.");
        },

        /**
         * Returns a mathematically normalized 2D direction vector based on keyboard state
         * @returns {{x: number, y: number}} Normalized movement vector
         */
        getMovementVector() {
            let moveX = 0;
            let moveY = 0;

            if (this.keys.KeyW) moveY -= 1; // Walk Up-Right (isometric)
            if (this.keys.KeyS) moveY += 1; // Walk Down-Left
            if (this.keys.KeyA) moveX -= 1; // Walk Up-Left
            if (this.keys.KeyD) moveX += 1; // Walk Down-Right

            // Normalize diagonal so diagonal movement isn't faster
            if (moveX !== 0 && moveY !== 0) {
                const length = Math.sqrt(moveX * moveX + moveY * moveY);
                moveX /= length;
                moveY /= length;
            }

            return { x: moveX, y: moveY };
        }
    };

    // Register on new namespace
    U.Engine.Input = Input;

})(window.UnkScape = window.UnkScape || {});


// ── Legacy Duskfall constructor shim ────────────────────────────────────────
// game.js calls: this.input = new D.Input(game)
// This shim wraps the UnkScape input object so game.js boots without changes.
;((D) => {
    D.Input = function(game) {
        this.game  = game;
        this.keys  = {};
        this.pressed = {};
        this.waitingForBind = null;
        this.mouse = { x:0, y:0, worldX:0, worldY:0,
                       leftDown:false, rightDown:false,
                       leftStarted:0, leftHeld:0, rightStarted:0 };

        // Also boot the UnkScape engine input system
        if (window.UnkScape && window.UnkScape.Engine && window.UnkScape.Engine.Input) {
            window.UnkScape.Engine.Input.init();
        }

        // Key listeners for the legacy system (keybinds, hotkeys, etc.)
        window.addEventListener('keydown', (e) => this.onKey(e, true));
        window.addEventListener('keyup',   (e) => this.onKey(e, false));

        game.canvas.addEventListener('mousemove',   (e) => this.onMouseMove(e));
        game.canvas.addEventListener('mousedown',   (e) => this.onMouseDown(e));
        window.addEventListener('mouseup',          (e) => this.onMouseUp(e));
        game.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            game.camera.setZoom(e.deltaY < 0 ? 0.12 : -0.12, true);
        }, { passive: false });
        game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    };

    D.Input.prototype.cleanKey = function(k) {
        return k === ' ' ? ' ' : String(k || '').toLowerCase();
    };

    D.Input.prototype.onKey = function(e, down) {
        const k = this.cleanKey(e.key);
        if (this.waitingForBind && down) {
            this.game.settings.keybinds[this.waitingForBind] = k;
            this.game.ui.toast('Keybind Updated', `${this.waitingForBind} is now ${D.displayKey(k)}.`, 'good');
            this.waitingForBind = null;
            this.game.ui.renderMenu();
            e.preventDefault();
            return;
        }
        if (down && !this.keys[k]) this.pressed[k] = true;
        this.keys[k] = down;
        const binds = Object.values(this.game.settings.keybinds || {});
        if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',
             'tab',' ','escape','1','2','3','4', ...binds].includes(k)) {
            e.preventDefault();
        }
        if (down) this.handleHotkey(k);
    };

    D.Input.prototype.actionForKey = function(k) {
        const binds = this.game.settings.keybinds || {};
        for (const [action, key] of Object.entries(binds)) {
            if (key === k) return action;
        }
        return null;
    };

    D.Input.prototype.handleHotkey = function(k) {
        const g = this.game, action = this.actionForKey(k);
        if (action === 'pause')          { g.ui.toggleMenu(); return; }
        if (g.state === 'menu')            return;
        if (action === 'zoomIn')         { g.camera.setZoom(.12);           return; }
        if (action === 'zoomOut')        { g.camera.setZoom(-.12);          return; }
        if (action === 'cameraToggle')   { g.camera.toggleMode();           return; }
        if (action === 'cameraOverhead') { g.camera.setOverhead();          return; }
        if (action === 'rotateLeft')     { g.camera.rotate(-Math.PI/12);    return; }
        if (action === 'rotateRight')    { g.camera.rotate( Math.PI/12);    return; }
        if (action === 'buildToggle')    { g.systems.build.toggle();        return; }
        if (action === 'buildCycle')     { g.systems.build.cycle();         return; }
        if (action === 'save')           { g.systems.save.save();           return; }
        if (g.paused && !['inventory','stats','skills','crafting',
                           'quests','bank','map'].includes(action)) return;
        if (action === 'inventory') g.ui.togglePanel('inventory');
        if (action === 'stats')     g.ui.togglePanel('stats');
        if (action === 'skills')    g.ui.togglePanel('skills');
        if (action === 'crafting')  g.ui.togglePanel('crafting');
        if (action === 'quests')    g.ui.togglePanel('quests');
        if (action === 'bank')      g.ui.togglePanel('bank');
        if (action === 'map')       g.ui.togglePanel('map');
        if (action === 'interact')  g.player.tryInteract();
        if (action === 'attack')    g.systems.combat.playerAttack(false);
        if (['1','2','3','4','5','6','7','8'].includes(k)) {
            g.systems.inventory.useHotbar(Number(k) - 1);
            return;
        }
    };

    D.Input.prototype.onMouseMove = function(e) {
        const rect = this.game.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    };

    D.Input.prototype.onMouseDown = function(e) {
        if (e.target !== this.game.canvas) return;
        if (this.game.state !== 'play' || this.game.paused) return;
        const world = this.game.camera.screenToWorld(this.mouse.x, this.mouse.y);
        this.mouse.worldX = world.x; this.mouse.worldY = world.y;
        if (this.game.buildMode) {
            if (e.button === 0) this.game.systems.build.placeAt(this.mouse.worldX, this.mouse.worldY);
            if (e.button === 2) this.game.systems.build.removeAt(this.mouse.worldX, this.mouse.worldY);
            return;
        }
        if (e.button === 0 && this.game.systems.gathering &&
            this.game.systems.gathering.tryStartAt(this.mouse.worldX, this.mouse.worldY)) return;
        if (e.button === 0) {
            this.mouse.leftDown = true;
            this.mouse.leftStarted = performance.now();
            this.mouse.leftHeld = 0;
        }
        if (e.button === 2) {
            this.mouse.rightDown = true;
            this.mouse.rightStarted = performance.now();
            if (this.game.player) this.game.player.blocking = true;
        }
    };

    D.Input.prototype.onMouseUp = function(e) {
        if (e.target !== this.game.canvas && this.game.paused) {
            this.mouse.leftDown = false; this.mouse.rightDown = false; return;
        }
        if (e.button === 0 && this.mouse.leftDown) {
            const held = (performance.now() - this.mouse.leftStarted) / 1000;
            this.mouse.leftDown = false; this.mouse.leftHeld = 0;
            if (this.game.state === 'play' && !this.game.paused)
                this.game.systems.combat.releasePrimary(held);
        }
        if (e.button === 2) {
            this.mouse.rightDown = false;
            if (this.game.player) this.game.player.blocking = false;
        }
    };

    D.Input.prototype.update = function(dt) {
        if (this.mouse.leftDown)
            this.mouse.leftHeld = (performance.now() - this.mouse.leftStarted) / 1000;
        const world = this.game.camera.screenToWorld(this.mouse.x, this.mouse.y);
        this.mouse.worldX = world.x; this.mouse.worldY = world.y;
        if (this.game.player) this.game.player.blocking = !!this.mouse.rightDown;
        this.pressed = {};
    };

    // axis() bridges to the UnkScape WASD vector system
    D.Input.prototype.axis = function() {
        // Prefer the new vector system if available
        if (window.UnkScape && window.UnkScape.Engine && window.UnkScape.Engine.Input) {
            return window.UnkScape.Engine.Input.getMovementVector();
        }
        // Fallback using legacy key state
        let x = 0, y = 0, k = this.keys;
        if (k.w || k.arrowup)    y--;
        if (k.s || k.arrowdown)  y++;
        if (k.a || k.arrowleft)  x--;
        if (k.d || k.arrowright) x++;
        const len = Math.hypot(x, y) || 1;
        return { x: x / len, y: y / len };
    };

    D.Input.prototype.startRebind = function(action) {
        this.waitingForBind = action;
        this.game.ui.renderMenu();
    };

    D.displayKey = function(k) {
        return k === ' ' ? 'SPACE' : k === 'escape' ? 'ESC' : k === 'tab' ? 'TAB' : String(k).toUpperCase();
    };

})(window.Duskfall = window.Duskfall || {});

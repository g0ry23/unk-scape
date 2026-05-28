/**
 * UNK-SCAPE Pure Vanilla Real-Time WASD Vector Input Handler
 * Architecture Namespace: window.UnkScape.Engine.Input
 * Implementation Path: client/engine/input.js
 */
((U) => {
      U.Engine = U.Engine || {};

     const Input = {

               // Track states for direct movement control mapping
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

                                                                     // Prevent default browser behavior (like scrolling the game window)
                                                                     if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
                                                                                           e.preventDefault();
                                                                     }
                             });

                   window.addEventListener('keyup', (e) => {
                                     if (e.code in this.keys) {
                                                           this.keys[e.code] = false;
                                     }
                   });

                   console.log("[UNK-SCAPE DIRECTOR] Input module synchronized directly to 'window.UnkScape'. WASD active.");
               },

               /**
                          * Returns a mathematically normalized 2D direction vector based on keyboard state
                * @returns {{x: number, y: number}} Normalized movement vectors
                */
               getMovementVector() {
                             let moveX = 0;
                             let moveY = 0;

                   // Map keyboard keys directly to Isometric World Grid relative paths
                   if (this.keys.KeyW) moveY -= 1; // Walk Up-Right relative to isometric angle
                   if (this.keys.KeyS) moveY += 1; // Walk Down-Left
                   if (this.keys.KeyA) moveX -= 1; // Walk Up-Left
                   if (this.keys.KeyD) moveX += 1; // Walk Down-Right

                   // Normalize diagonal vector coordinates so diagonal walking isn't accidentally faster
                   if (moveX !== 0 && moveY !== 0) {
                                     const length = Math.sqrt(moveX * moveX + moveY * moveY);
                                     moveX /= length;
                                     moveY /= length;
                   }

                   return { x: moveX, y: moveY };
               }
     };

     // Safely assign back to global game engine namespace
     U.Engine.Input = Input;

})(window.UnkScape = window.UnkScape || {});

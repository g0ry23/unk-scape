window.UnkScape3D = window.UnkScape3D || {};

const E = window.UnkScape3D;

(function() {

    console.log("UnkScape3D: Injecting WebGL 3D Viewport into Core Game...");

    E.active = false;

    E.scene = null;

    E.camera = null;

    E.renderer = null;

    E.playerMesh = null;

    /**

     * Initializes the true 3D WebGL framework.

     * Creates a dedicated WebGL canvas layered OVER the existing 2D game canvas

     * so both can coexist (2D canvas keeps its context, WebGL gets its own).

     */

    E.Initialize3D = function() {

        if (typeof THREE === 'undefined') {

            console.error("UnkScape3D: Three.js library not loaded!");

            return;

        }

        // Reference the existing game container
        const gameCanvas = document.getElementById("game");

        if (!gameCanvas) {

            console.error("UnkScape3D: Could not find target canvas element id='game'");

            return;

        }

        // 1. Create a NEW dedicated WebGL canvas (layered over the 2D canvas)
        //    The 2D canvas already holds a '2d' context — we cannot share it with WebGL.

        const webglCanvas = document.createElement('canvas');

        webglCanvas.id = 'game-webgl';

        webglCanvas.style.position = 'absolute';

        webglCanvas.style.top = '0';

        webglCanvas.style.left = '0';

        webglCanvas.style.width = '100%';

        webglCanvas.style.height = '100%';

        webglCanvas.style.pointerEvents = 'none'; // Let clicks pass through to 2D canvas

        webglCanvas.style.zIndex = '1'; // Above 2D canvas but below HUD (z-index:10)

        gameCanvas.parentElement.appendChild(webglCanvas);

        // 2. Setup Scene & Sky Background Color

        E.scene = new THREE.Scene();

        E.scene.background = new THREE.Color('#0b0e1a');

        // 3. Perspective Camera (True depth camera projection)

        const aspect = window.innerWidth / window.innerHeight;

        E.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);

        E.camera.position.set(0, 25, 30); // Raised and looking downward at an angle

        // 4. WebGL Renderer on the dedicated new canvas

        E.renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, antialias: true });

        E.renderer.setSize(window.innerWidth, window.innerHeight);

        // 5. Environmental Lighting

        const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);

        E.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight('#ffffff', 0.8);

        dirLight.position.set(10, 40, 20);

        E.scene.add(dirLight);

        // 6. Build Player Avatar Placeholder (3D Cylinder)

        const geometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);

        const material = new THREE.MeshLambertMaterial({ color: '#f1c40f' });

        E.playerMesh = new THREE.Mesh(geometry, material);

        E.playerMesh.position.set(0, 1.5, 0);

        E.scene.add(E.playerMesh);

        // 7. Build a Basic Ground Floor to show depth instantly

        const floorGeo = new THREE.BoxGeometry(100, 1, 100);

        const floorMat = new THREE.MeshLambertMaterial({ color: '#27ae60' });

        const floor = new THREE.Mesh(floorGeo, floorMat);

        floor.position.set(0, -0.5, 0);

        E.scene.add(floor);

        E.camera.lookAt(E.playerMesh.position);

        E.active = true;

        // Handle window resizing

        window.addEventListener('resize', () => {

            E.camera.aspect = window.innerWidth / window.innerHeight;

            E.camera.updateProjectionMatrix();

            E.renderer.setSize(window.innerWidth, window.innerHeight);

        });

        console.log("UnkScape3D: 3D Render Bridge successfully bound to canvas. WebGL canvas id=game-webgl created.");

    };

    /**

     * Executed inside the core loop to frame-render our active positions

     */

    E.RenderFrame3D = function(playerData) {

        if (!E.active || !E.renderer) return;

        if (playerData) {

            // Translate 2D coordinates straight onto 3D positions

            const targetX = (playerData.x || 0) * 0.1;

            const targetZ = (playerData.y || 0) * 0.1;

            E.playerMesh.position.set(targetX, 1.5, targetZ);

            // Keep the third-person camera locked tightly over the character

            E.camera.position.set(targetX, 20, targetZ + 25);

            E.camera.lookAt(E.playerMesh.position);

        }

        E.renderer.render(E.scene, E.camera);

    };

})();

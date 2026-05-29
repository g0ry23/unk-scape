(function() {
    const D = window.Duskfall = window.Duskfall || {};
    D.CharacterVisuals = {};

    // Maps player factionId to 3D mesh color
    const FACTION_COLORS = {
        'blood_oath':    0xc0392b,  // Crimson Red
        'iron_crown':    0x2980b9,  // Cobalt Blue
        'ironbound':     0x8e44ad,  // Purple
        'neutral':       0x7f8c8d   // Grey
    };

    // Maps classId to body proportions
    const CLASS_SCALES = {
        'melee':      { body: [1.1, 1.0, 1.1], head: 1.05 },
        'brawler':    { body: [1.2, 1.05, 1.2], head: 1.1 },
        'range':      { body: [0.9, 1.05, 0.9], head: 0.95 },
        'mage':       { body: [0.85, 1.1, 0.85], head: 1.0 },
        'cleric':     { body: [1.0, 1.0, 1.0], head: 1.0 },
        'gatherer':   { body: [0.95, 0.95, 0.95], head: 0.95 },
        'prospector': { body: [1.15, 0.9, 1.15], head: 1.0 },
        'warden':     { body: [1.0, 1.0, 1.0], head: 0.95 },
        'wanderer':   { body: [1.0, 1.0, 1.0], head: 1.0 }
    };

    /**
     * Build a modular block-character mesh group.
     * playerData fields read: factionId, classId
     * Returns a THREE.Group with userData.leftLeg, leftArm, rightArm, torsoMesh, headMesh
     */
    D.CharacterVisuals.createModularMesh = function(playerData) {
        const playerGroup = new THREE.Group();

        const factionId = playerData?.factionId || 'neutral';
        const classId   = playerData?.classId   || 'wanderer';
        const colorHex  = FACTION_COLORS[factionId] || FACTION_COLORS.neutral;
        const scale     = CLASS_SCALES[classId]     || CLASS_SCALES.wanderer;

        const skinMat    = new THREE.MeshLambertMaterial({ color: 0xd2b48c });
        const factionMat = new THREE.MeshLambertMaterial({ color: colorHex });
        const bootMat    = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
        const pantsMat   = new THREE.MeshLambertMaterial({ color: 0x4a3728 });

        // Torso
        const torsoGeo  = new THREE.BoxGeometry(0.6, 0.8, 0.4);
        const torsoMesh = new THREE.Mesh(torsoGeo, factionMat);
        torsoMesh.position.y = 0.8;
        torsoMesh.scale.set(scale.body[0], scale.body[1], scale.body[2]);
        playerGroup.add(torsoMesh);

        // Head
        const headGeo  = new THREE.BoxGeometry(0.35, 0.35, 0.35);
        const headMesh = new THREE.Mesh(headGeo, skinMat);
        headMesh.position.y = 0.8 + (0.4 * scale.body[1]) + 0.175;
        headMesh.scale.setScalar(scale.head);
        playerGroup.add(headMesh);

        // Left leg
        const legGeo  = new THREE.BoxGeometry(0.18, 0.4, 0.18);
        const leftLeg = new THREE.Mesh(legGeo, pantsMat);
        leftLeg.position.set(-0.14 * scale.body[0], 0.2, 0);
        playerGroup.add(leftLeg);

        // Right leg
        const rightLeg = new THREE.Mesh(legGeo, pantsMat);
        rightLeg.position.set(0.14 * scale.body[0], 0.2, 0);
        playerGroup.add(rightLeg);

        // Left arm
        const armGeo  = new THREE.BoxGeometry(0.15, 0.5, 0.15);
        const leftArm = new THREE.Mesh(armGeo, factionMat);
        leftArm.position.set(-0.42 * scale.body[0], 0.65, 0);
        playerGroup.add(leftArm);

        // Right arm
        const rightArm = new THREE.Mesh(armGeo, factionMat);
        rightArm.position.set(0.42 * scale.body[0], 0.65, 0);
        playerGroup.add(rightArm);

        // Boots on left leg
        const bootGeo   = new THREE.BoxGeometry(0.2, 0.15, 0.22);
        const leftBoot  = new THREE.Mesh(bootGeo, bootMat);
        leftBoot.position.set(-0.14 * scale.body[0], 0.075, 0.02);
        playerGroup.add(leftBoot);
        const rightBoot = new THREE.Mesh(bootGeo, bootMat);
        rightBoot.position.set(0.14 * scale.body[0], 0.075, 0.02);
        playerGroup.add(rightBoot);

        // Store limb refs for animation
        playerGroup.userData = {
            leftLeg, rightLeg,
            leftArm, rightArm,
            torsoMesh, headMesh,
            classId, factionId
        };

        return playerGroup;
    };

    /**
     * Animate limbs each frame.
     * velocity: scalar speed (px/s converted) — use Math.hypot(vx,vy)
     * time: performance.now() * 0.001
     */
    D.CharacterVisuals.animateMesh = function(playerMesh, velocity, time) {
        if (!playerMesh || !playerMesh.userData.leftLeg) return;
        const limbs = playerMesh.userData;
        if (velocity > 0.5) {
            const swingSpeed = 8;
            const angle = Math.sin(time * swingSpeed) * 0.45;
            limbs.leftLeg.rotation.x  =  angle;
            limbs.rightLeg.rotation.x = -angle;
            limbs.leftArm.rotation.x  = -angle * 0.7;
            limbs.rightArm.rotation.x =  angle * 0.7;
        } else {
            // Idle — return to rest
            limbs.leftLeg.rotation.x  = 0;
            limbs.rightLeg.rotation.x = 0;
            limbs.leftArm.rotation.x  = 0;
            limbs.rightArm.rotation.x = 0;
        }
    };

    console.log("UnkScape3D: CharacterVisuals system loaded.");
})();

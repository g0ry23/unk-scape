(function() {
    const US = window.UnkScape = window.UnkScape || {};
    US.CharacterVisuals = {};
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
    US.CharacterVisuals.createModularMesh = function(playerData) {
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

        	// Left arm -- pivot at shoulder so rotation swings the arm like a pendulum
	const armGeo = new THREE.BoxGeometry(0.15, 0.5, 0.15);
	// Left arm pivot group: positioned at shoulder
	const leftArmPivot = new THREE.Group();
	leftArmPivot.position.set(-0.42 * scale.body[0], 0.9, 0);
	const leftArm = new THREE.Mesh(armGeo, factionMat);
	leftArm.position.set(0, -0.25, 0); // arm hangs below shoulder pivot
	leftArmPivot.add(leftArm);
	playerGroup.add(leftArmPivot);

	// Right arm pivot group: positioned at shoulder
	const rightArmPivot = new THREE.Group();
	rightArmPivot.position.set(0.42 * scale.body[0], 0.9, 0);
	const rightArm = new THREE.Mesh(armGeo, factionMat);
	rightArm.position.set(0, -0.25, 0); // arm hangs below shoulder pivot
	rightArmPivot.add(rightArm);
	playerGroup.add(rightArmPivot);
// Boots on left leg
        const bootGeo   = new THREE.BoxGeometry(0.2, 0.15, 0.22);
        const leftBoot  = new THREE.Mesh(bootGeo, bootMat);
        leftBoot.position.set(-0.14 * scale.body[0], 0.075, 0.02);
        playerGroup.add(leftBoot);
        const rightBoot = new THREE.Mesh(bootGeo, bootMat);
        rightBoot.position.set(0.14 * scale.body[0], 0.075, 0.02);
        playerGroup.add(rightBoot);

        	// Store limb refs for animation -- animate the PIVOT groups, not the mesh
	playerGroup.userData = {
		leftLeg, rightLeg,
		leftArm: leftArmPivot,
		rightArm: rightArmPivot,
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
    US.CharacterVisuals.animateMesh = function(playerMesh, velocity, time) {
  if (!playerMesh || !playerMesh.userData.leftLeg) return;
  var limbs = playerMesh.userData;
  // Read gathering state -- pure read, no logic change
  var D2 = window.UnkScape;
  var gs = D2 && D2.game && D2.game.systems && D2.game.systems.gathering;
  var isChopping = gs && gs.active && gs.timer > 0;
  if (isChopping) {
    // Face toward the tree being chopped
    var node = gs.active;
    var player = D2.game.player;
    if (node && player) {
      var dx = node.x - player.x;
      var dy = node.y - player.y;
      // 3D: x maps to world x, y maps to -z (forward in Three.js iso view)
      // Angle from player to tree, adjusted for camera iso orientation
      var treeAngle = Math.atan2(dx, -dy);
      playerMesh.rotation.y = treeAngle;
    }
    // Overhead chop swing: raise arm back then strike forward-down
    // ~3 full chops/sec (chopSpeed=3*PI gives ~1.5 up-down cycles/sec, feels right)
    var chopPhase = Math.sin(time * 9.0); // fast enough to see, slow enough to read
    // chopPhase: -1 = arm raised overhead, +1 = arm struck down
    // rotation.x: negative = arm raised back (overhead), positive = arm forward (strike)
    var raiseAngle = -1.8;   // arm raised up/back overhead
    var strikeAngle = 0.6;   // arm swung forward and down into the tree
    var chopX = raiseAngle + (strikeAngle - raiseAngle) * ((chopPhase + 1) * 0.5);
    limbs.rightArm.rotation.x = chopX;
    // Slight inward lean at shoulder for realism
    limbs.rightArm.rotation.z = -0.25;
    // Left arm counter-balances (opposite, smaller)
    limbs.leftArm.rotation.x = -chopX * 0.3;
    limbs.leftArm.rotation.z = 0;
    // Legs planted during chop
    limbs.leftLeg.rotation.x = 0;
    limbs.rightLeg.rotation.x = 0;
    // Torso twists into the swing
    limbs.torsoMesh.rotation.y = chopPhase * 0.2;
  } else if (velocity > 0.5) {
    // Walk cycle
    var swingSpeed = 8;
    var angle = Math.sin(time * swingSpeed) * 0.45;
    limbs.leftLeg.rotation.x = angle;
    limbs.rightLeg.rotation.x = -angle;
    limbs.leftArm.rotation.x = -angle * 0.7;
    limbs.rightArm.rotation.x = angle * 0.7;
    limbs.rightArm.rotation.z = 0;
    limbs.leftArm.rotation.z = 0;
    limbs.torsoMesh.rotation.y = 0;
  } else {
    // Idle -- return to rest
    limbs.leftLeg.rotation.x = 0;
    limbs.rightLeg.rotation.x = 0;
    limbs.leftArm.rotation.x = 0;
    limbs.rightArm.rotation.x = 0;
    limbs.rightArm.rotation.z = 0;
    limbs.leftArm.rotation.z = 0;
    limbs.torsoMesh.rotation.y = 0;
  }
};
 console.log("UnkScape3D: CharacterVisuals system loaded.");
})();

// Fix: US not in scope outside IIFE — use window.UnkScape
(function() {
var US = window.UnkScape = window.UnkScape || {};

/**
 * Weapon style classifier -- returns style string from item ID.
 */
US.CharacterVisuals.getWeaponStyle = function(itemId) {
  if (!itemId) return null;
  var id = itemId.toLowerCase();
  if (id.indexOf('bow') > -1) return 'bow';
  if (id.indexOf('staff') > -1) return 'staff';
  if (id.indexOf('axe') > -1 || id.indexOf('hatchet') > -1) return 'axe';
  if (id.indexOf('pickaxe') > -1 || id.indexOf('pick') > -1) return 'pick';
  if (id.indexOf('sword') > -1 || id.indexOf('blade') > -1 || id.indexOf('dagger') > -1) return 'sword';
  return 'sword';
};

/**
 * Attach or update weapon mesh on playerMesh.userData.rightArm.
 * Called from RenderFrame3D each frame with the current weaponId.
 * Only rebuilds mesh when weaponId changes.
 */
US.CharacterVisuals.updateWeapon = function(playerMesh, weaponId) {
  if (!playerMesh || !playerMesh.userData.rightArm) return;
  // Gathering tool override: show correct tool during chop/mine
  var _D = window.UnkScape;
  var _gs = _D && _D.game && _D.game.systems && _D.game.systems.gathering;
  if (_gs && _gs.active && _gs.timer > 0 && _gs.active.cfg && _gs.active.cfg.skill) {
    var _skill = _gs.active.cfg.skill;
    if (_skill === 'woodcutting') weaponId = 'stone_hatchet';
    else if (_skill === 'mining') weaponId = 'iron_pickaxe';
  }
  var arm = playerMesh.userData.rightArm;
  var current = playerMesh.userData.weaponId || null;
  if (current === weaponId) return;
  playerMesh.userData.weaponId = weaponId;

  if (playerMesh.userData.weaponMesh) {
    arm.remove(playerMesh.userData.weaponMesh);
    playerMesh.userData.weaponMesh = null;
  }

  if (!weaponId) return;

  var style = US.CharacterVisuals.getWeaponStyle(weaponId);
  var mat = new THREE.MeshLambertMaterial({ color: 0xc0c0c0 });
  var wGeo, wMesh;

  if (style === 'sword') {
    wGeo = new THREE.BoxGeometry(0.06, 0.7, 0.04);
    mat = new THREE.MeshLambertMaterial({ color: 0xdce4f0 });
    wMesh = new THREE.Mesh(wGeo, mat);
    wMesh.position.set(0.06, -0.55, 0);
  } else if (style === 'axe') {
    var handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.05), new THREE.MeshLambertMaterial({ color: 0x7a4b1a }));
    handle.position.set(0.05, -0.4, 0);
    var blade = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.04), new THREE.MeshLambertMaterial({ color: 0x8a9ba8 }));
    blade.position.set(0.17, -0.22, 0);
    wMesh = new THREE.Group();
    wMesh.add(handle);
    wMesh.add(blade);
  } else if (style === 'pick') {
    var pHandle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.05), new THREE.MeshLambertMaterial({ color: 0x7a4b1a }));
    pHandle.position.set(0.05, -0.35, 0);
    var pHead = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.07, 0.05), new THREE.MeshLambertMaterial({ color: 0x8a9ba8 }));
    pHead.position.set(0.12, -0.13, 0);
    var pTip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.04), new THREE.MeshLambertMaterial({ color: 0x8a9ba8 }));
    pTip.position.set(0.24, -0.2, 0);
    pTip.rotation.z = -0.6;
    wMesh = new THREE.Group();
    wMesh.add(pHandle); wMesh.add(pHead); wMesh.add(pTip);
  } else if (style === 'bow') {
    wGeo = new THREE.BoxGeometry(0.05, 0.65, 0.05);
    mat = new THREE.MeshLambertMaterial({ color: 0x9b5a1a });
    wMesh = new THREE.Mesh(wGeo, mat);
    wMesh.position.set(0.08, -0.32, 0);
  } else if (style === 'staff') {
    wGeo = new THREE.BoxGeometry(0.055, 0.85, 0.055);
    mat = new THREE.MeshLambertMaterial({ color: 0x6a3d9a });
    wMesh = new THREE.Mesh(wGeo, mat);
    wMesh.position.set(0.05, -0.55, 0);
    var orb = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.13), new THREE.MeshLambertMaterial({ color: 0xc39bd3 }));
    orb.position.set(0.05, 0.35, 0);
    var staffGroup = new THREE.Group();
    staffGroup.add(wMesh); staffGroup.add(orb);
    wMesh = staffGroup;
  }

  if (wMesh) {
    arm.add(wMesh);
    playerMesh.userData.weaponMesh = wMesh;
  }
};
})();

/* ============================================================================
   UNKSCAPE — engine.js
   Three.js scene, low-poly dusk terrain, lighting, and an orbit/zoom camera rig.
   3D-native from line one. Tile = 32 world units.
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  const E = U.Engine = U.Engine || {};

  // ---- terrain height field (shared by camera, player, placement) ----
  function terrainHeight(x,z){
    const s=0.0010;
    let h = Math.sin(x*s)*Math.cos(z*s*1.25)*44
          + Math.sin(x*0.0022+1.3)*Math.cos(z*0.0018)*20
          + Math.sin(x*0.006)*Math.sin(z*0.006)*5;
    const d = Math.hypot(x, z-30);          // flatten the Oathstead bowl
    const flat = Math.min(1, Math.max(0,(d-300))/520);  // wider flat for the spread-out town
    h *= 0.12 + 0.88*flat;
    return h;
  }
  E.terrainHeight = terrainHeight;

  E.init = function(canvas){
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x161024);
    scene.fog = new THREE.Fog(0x1a1326, 2600, 9400);

    const renderer = new THREE.WebGLRenderer({canvas, antialias:true, preserveDrawingBuffer:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
    else renderer.outputEncoding = THREE.sRGBEncoding;

    const camera = new THREE.PerspectiveCamera(52, window.innerWidth/window.innerHeight, 1, 22000);

    // ---- lighting (dusk / firelit valley) ----
    const hemi = new THREE.HemisphereLight(0x7c6fb0, 0x2a2018, 0.85);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffd9a8, 1.15);
    sun.position.set(-380, 520, 260);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048,2048);
    const sc = sun.shadow.camera; sc.left=-700; sc.right=700; sc.top=700; sc.bottom=-700; sc.near=10; sc.far=1600;
    sun.shadow.bias = -0.0005;
    scene.add(sun);
    E.sun = sun;
    const amber = new THREE.PointLight(0xff7a2a, 0.6, 700, 2); // ember fill near town
    amber.position.set(60, 90, 30);
    scene.add(amber);

    // ---- low-poly terrain (rectangular, oversized so the rim stays inside fog) ----
    const PW = U.Constants.MAP_W + 5000, PH = U.Constants.MAP_H + 5000; // render past play bounds
    const segX = 210, segZ = 168;
    const geo = new THREE.PlaneGeometry(PW, PH, segX, segZ);
    geo.rotateX(-Math.PI/2);
    const pos = geo.attributes.position;
    const colors = [];
    const cGrass = new THREE.Color(0x3e5230), cDry = new THREE.Color(0x6a6133), cHi = new THREE.Color(0x8a8a55);
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i), z=pos.getZ(i);
      const y=terrainHeight(x,z);
      pos.setY(i,y);
      const t = Math.min(1, Math.max(0, (y+10)/70));
      const c = cGrass.clone().lerp(cDry, t*0.7).lerp(cHi, Math.max(0,(y-30)/60));
      // subtle per-vertex jitter for hand-painted low-poly feel
      const j = 0.92 + ((Math.sin(x*12.9+z*78.2)*43758.5)%1+1)%1*0.16;
      colors.push(c.r*j, c.g*j, c.b*j);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors,3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({vertexColors:true, flatShading:true, roughness:1, metalness:0});
    const ground = new THREE.Mesh(geo, mat);
    ground.receiveShadow = true;
    ground.name = "ground";
    scene.add(ground);
    E.ground = ground;

    // ---- distant horizon ring (no black void) ----
    const ringGeo = new THREE.RingGeometry(9200, 19000, 64, 1);
    ringGeo.rotateX(-Math.PI/2);
    const ringMat = new THREE.MeshBasicMaterial({color:0x241a30, side:THREE.DoubleSide, fog:true});
    const ring = new THREE.Mesh(ringGeo, ringMat); ring.position.y=-8; scene.add(ring);

    // ---- camera orbit rig ----
    E.cam = { radius:300, minR:120, maxR:620, theta:0, phi:0.92, target:new THREE.Vector3(0,0,150) };

    E.scene = scene; E.camera = camera; E.renderer = renderer; E.THREE = THREE;

    window.addEventListener("resize", ()=>{
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    return E;
  };

  // update camera position from spherical rig each frame
  E.updateCamera = function(){
    const THREE = E.THREE, c = E.cam;
    c.phi = Math.max(0.18, Math.min(1.40, c.phi));
    c.radius = Math.max(c.minR, Math.min(c.maxR, c.radius));
    const sinP = Math.sin(c.phi);
    const x = c.target.x + c.radius * sinP * Math.sin(c.theta);
    const y = c.target.y + c.radius * Math.cos(c.phi);
    const z = c.target.z + c.radius * sinP * Math.cos(c.theta);
    E.camera.position.set(x, y, z);
    E.camera.lookAt(c.target.x, c.target.y + 22, c.target.z);
  };

  // raycast a screen point to the ground plane -> world {x,z}
  E.groundPick = function(nx, ny){
    const THREE = E.THREE;
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(nx, ny), E.camera);
    const hit = ray.intersectObject(E.ground, false);
    if(hit.length) return {x:hit[0].point.x, z:hit[0].point.z};
    // fallback: intersect y=0 plane
    const plane = new THREE.Plane(new THREE.Vector3(0,1,0), 0);
    const pt = new THREE.Vector3();
    if(ray.ray.intersectPlane(plane, pt)) return {x:pt.x, z:pt.z};
    return null;
  };

  // raycast to interactable meshes; returns nearest {object} or null
  E.pickInteractable = function(nx, ny){
    const THREE = E.THREE;
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(nx, ny), E.camera);
    const hits = ray.intersectObjects(E.interactables||[], true);
    if(!hits.length) return null;
    let o = hits[0].object;
    while(o && !o.userData.interactable && o.parent) o = o.parent;
    return o && o.userData.interactable ? {object:o, point:hits[0].point} : null;
  };

})();

/* ============================================================================
   UNKSCAPE — world.js
   Low-poly meshes for resource nodes, NPCs and town props; placement around
   the Oathstead bowl; interactable registry.
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  const E = U.Engine;
  const W = U.World = U.World || {};
  let THREE;

  const matCache = {};
  function mat(hex, opts){
    const key = hex + JSON.stringify(opts||{});
    if(matCache[key]) return matCache[key];
    return matCache[key] = new THREE.MeshStandardMaterial(Object.assign({color:hex, flatShading:true, roughness:.95, metalness:0}, opts||{}));
  }
  function gh(x,z){ return E.terrainHeight(x,z); }

  // ---------- text label sprite ----------
  function makeLabel(text, color){
    const cv=document.createElement("canvas"); cv.width=512; cv.height=128;
    const ctx=cv.getContext("2d");
    ctx.font="bold 52px 'Courier New', monospace";
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.lineWidth=8; ctx.strokeStyle="rgba(0,0,0,.85)"; ctx.strokeText(text,256,64);
    ctx.fillStyle=color||"#e8dfc8"; ctx.fillText(text,256,64);
    const tex=new THREE.CanvasTexture(cv); tex.anisotropy=4;
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex, transparent:true, depthTest:false}));
    sp.scale.set(120,30,1);
    return sp;
  }
  W.makeLabel = makeLabel;

  // ---------- floating quest marker (! offer / ? turn-in) ----------
  const _markerTex = {};
  function markerTex(kind){
    if(_markerTex[kind]) return _markerTex[kind];
    const cv=document.createElement("canvas"); cv.width=128; cv.height=128;
    const ctx=cv.getContext("2d");
    const glyph = kind==="ready" ? "?" : kind==="available" ? "!" : "?";
    const col   = kind==="ready" ? "#7fb84a" : kind==="available" ? "#ffcf5a" : "#8a7a62";
    ctx.font="bold 108px 'Courier New', monospace";
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.lineWidth=12; ctx.strokeStyle="rgba(0,0,0,.9)"; ctx.strokeText(glyph,64,66);
    ctx.shadowColor=col; ctx.shadowBlur=22; ctx.fillStyle=col; ctx.fillText(glyph,64,66);
    const tex=new THREE.CanvasTexture(cv); tex.anisotropy=4;
    return _markerTex[kind]=tex;
  }
  function makeMarker(){
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:markerTex("available"), transparent:true, depthTest:false}));
    sp.scale.set(20,20,1); sp.visible=false; sp.userData.kind=null;
    return sp;
  }

  // ---------- node mesh factories ----------
  function buildTree(){
    const g=new THREE.Group();
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(5,7,34,6), mat(0x5a3f24));
    trunk.position.y=17; trunk.castShadow=true; g.add(trunk);
    const fol=[[0,44,26,0x3f6b32],[10,58,20,0x4a7a3a],[-8,66,15,0x35602b]];
    fol.forEach(([y0,y,r,c],i)=>{
      const cone=new THREE.Mesh(new THREE.ConeGeometry(r, r*1.4, 7), mat(c));
      cone.position.set((i-1)*4, y, 0); cone.castShadow=true; g.add(cone);
    });
    return g;
  }
  function buildRock(tint){
    const g=new THREE.Group();
    const r=new THREE.Mesh(new THREE.DodecahedronGeometry(20,0), mat(tint||0x8a8f96,{roughness:.8,metalness:.15}));
    r.position.y=13; r.scale.set(1.1,0.8,1.05); r.rotation.y=Math.random()*6; r.castShadow=true; g.add(r);
    const r2=new THREE.Mesh(new THREE.DodecahedronGeometry(11,0), mat(tint||0x8a8f96,{roughness:.8,metalness:.15}));
    r2.position.set(16,7,-6); r2.castShadow=true; g.add(r2);
    // ore glints
    const glint=new THREE.Mesh(new THREE.IcosahedronGeometry(3,0), mat(tint||0xb5793a,{emissive:tint||0xb5793a,emissiveIntensity:.4,metalness:.5,roughness:.4}));
    glint.position.set(-8,16,9); g.add(glint);
    return g;
  }
  function buildHerb(tint){
    const g=new THREE.Group();
    for(let i=0;i<5;i++){
      const blade=new THREE.Mesh(new THREE.ConeGeometry(2.4,16,4), mat(tint||0x4c7a2a));
      blade.position.set((Math.random()-.5)*16, 8, (Math.random()-.5)*16);
      blade.rotation.z=(Math.random()-.5)*.5; g.add(blade);
    }
    const bloom=new THREE.Mesh(new THREE.IcosahedronGeometry(4,0), mat(tint||0x6c9a3a,{emissive:tint,emissiveIntensity:.25}));
    bloom.position.y=18; g.add(bloom);
    return g;
  }
  function buildFishSpot(){
    const g=new THREE.Group();
    const ring=new THREE.Mesh(new THREE.TorusGeometry(14,2.2,6,16), mat(0x7fa8c0,{emissive:0x2d6cbe,emissiveIntensity:.3,roughness:.4}));
    ring.rotation.x=Math.PI/2; ring.position.y=2; g.add(ring);
    g.userData.spin=ring;
    return g;
  }
  function buildTrail(){
    const g=new THREE.Group();
    // snare sticks
    [[-6,0],[6,0],[0,8]].forEach(([x,z])=>{
      const s=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,22,5), mat(0x6a4a2a));
      s.position.set(x,11,z); s.rotation.z=(Math.random()-.5)*.4; s.castShadow=true; g.add(s);
    });
    const loop=new THREE.Mesh(new THREE.TorusGeometry(7,1,5,12), mat(0x9a8a4a));
    loop.position.set(0,18,4); loop.rotation.x=.6; g.add(loop);
    const tuft=new THREE.Mesh(new THREE.ConeGeometry(10,8,6), mat(0x5a6033)); tuft.position.y=4; g.add(tuft);
    return g;
  }
  const FACTORY = {
    tree: ()=>buildTree(),
    rock: (nt)=>buildRock(new THREE.Color(nt.rockTint||"#8a8f96").getHex()),
    herb: (nt)=>buildHerb(new THREE.Color(nt.herbTint||"#4c7a2a").getHex()),
    fish: ()=>buildFishSpot(),
    trail: ()=>buildTrail()
  };

  // ---------- NPC figure ----------
  function buildNPC(npc){
    const g=new THREE.Group();
    const body=new THREE.Mesh(new THREE.CylinderGeometry(8,11,34,7), mat(0x2e2636));
    body.position.y=20; body.castShadow=true; g.add(body);
    const robe=new THREE.Mesh(new THREE.ConeGeometry(13,22,7), mat(new THREE.Color(npc.color).getHex()));
    robe.position.y=12; g.add(robe);
    const head=new THREE.Mesh(new THREE.IcosahedronGeometry(7,0), mat(0xc9a87a));
    head.position.y=42; head.castShadow=true; g.add(head);
    const lbl=makeLabel(npc.name.split(" ")[0], npc.color); lbl.position.y=64; lbl.scale.set(90,22,1); g.add(lbl);
    const role=makeLabel(npc.role, "#8a7a62"); role.position.y=54; role.scale.set(72,16,1); g.add(role);
    const marker=makeMarker(); marker.position.y=82; g.add(marker);
    g.userData.marker=marker; g.userData.markerBaseY=82;
    return g;
  }

  // ---------- town props ----------
  function buildCampfire(){
    const g=new THREE.Group();
    for(let i=0;i<5;i++){
      const log=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.5,20,5), mat(0x4a3320));
      log.position.y=3; log.rotation.set(Math.PI/2,0,i*1.25); log.castShadow=true; g.add(log);
    }
    for(let i=0;i<3;i++){
      const fl=new THREE.Mesh(new THREE.ConeGeometry(6-i*1.5,16-i*3,5),
        new THREE.MeshStandardMaterial({color:i?0xff8a2a:0xffd24a, emissive:i?0xff5a1a:0xffb02a, emissiveIntensity:1.4, flatShading:true}));
      fl.position.y=10+i*2; g.add(fl);
    }
    const light=new THREE.PointLight(0xff7a2a, 1.6, 240, 2); light.position.y=16; g.add(light);
    g.userData.flames = g.children.filter(c=>c.geometry && c.geometry.type==="ConeGeometry");
    return g;
  }
  function buildStall(c){
    const g=new THREE.Group();
    const counter=new THREE.Mesh(new THREE.BoxGeometry(48,18,26), mat(0x5a3f24)); counter.position.y=9; counter.castShadow=true; g.add(counter);
    const canopy=new THREE.Mesh(new THREE.BoxGeometry(60,4,36), mat(c||0xa32a22)); canopy.position.y=46; g.add(canopy);
    [[-28,-16],[28,-16],[-28,16],[28,16]].forEach(([x,z])=>{
      const p=new THREE.Mesh(new THREE.CylinderGeometry(2,2,48,5), mat(0x3a2a1a)); p.position.set(x,24,z); g.add(p);
    });
    return g;
  }
  function buildFence(len){
    const g=new THREE.Group();
    for(let i=0;i<len;i++){
      const post=new THREE.Mesh(new THREE.BoxGeometry(3,18,3), mat(0x4a3320)); post.position.set(i*22,9,0); post.castShadow=true; g.add(post);
    }
    const rail=new THREE.Mesh(new THREE.BoxGeometry(len*22,3,2), mat(0x5a3f24)); rail.position.set(len*11-11,13,0); g.add(rail);
    return g;
  }
  function buildHut(){
    const g=new THREE.Group();
    const base=new THREE.Mesh(new THREE.BoxGeometry(90,52,70), mat(0x6b5436)); base.position.y=26; base.castShadow=true; base.receiveShadow=true; g.add(base);
    const roof=new THREE.Mesh(new THREE.ConeGeometry(72,40,4), mat(0x4a2f1c)); roof.position.y=70; roof.rotation.y=Math.PI/4; roof.castShadow=true; g.add(roof);
    const door=new THREE.Mesh(new THREE.BoxGeometry(20,34,2), mat(0x2a1c10)); door.position.set(0,17,35.5); g.add(door);
    return g;
  }

  // ---------- placement ----------
  W.nodes = [];
  E.interactables = [];
  let nodeSeq=0;

  function placeNode(typeId, x, z){
    const nt = U.Data.NODE_TYPES[typeId]; if(!nt) return;
    const g = FACTORY[nt.mesh](nt);
    const y = gh(x,z);
    g.position.set(x, y, z);
    g.rotation.y = Math.random()*Math.PI*2;
    const inst = { iid:"n"+(nodeSeq++), typeId, mesh:g, pos:{x,z,y}, hitsLeft:nt.hits, depleted:false, respawnAt:0, yieldsLeft:(U.Gather&&U.Gather.rollCap?U.Gather.rollCap():1+Math.floor(Math.random()*3)) };
    g.userData.interactable = {kind:"node", inst};
    g.traverse(o=>{ if(o.isMesh) o.userData.interactable = g.userData.interactable; });
    W.nodes.push(inst);
    E.scene.add(g);
    E.interactables.push(g);
    return inst;
  }
  W.placeNode = placeNode;

  function placeNPC(npc, x, z){
    const g = buildNPC(npc);
    const y = gh(x,z); g.position.set(x,y,z);
    g.rotation.y = Math.atan2(-x, 30-z);
    g.userData.interactable = {kind:"npc", npc};
    g.userData.npcId = npc.id;
    g.traverse(o=>{ if(o.isMesh) o.userData.interactable=g.userData.interactable; });
    E.scene.add(g); E.interactables.push(g);
    return g;
  }

  W.npcMeshes = [];

  W.build = function(){
    THREE = E.THREE;

    // Districts now sit 45-75 tiles (1440-2400u) out from the Oathstead commons —
    // each gathering trip is a real trek, not three steps.

    // ---- WOODLOT (NW, ~72 tiles) ----
    [[-1750,-1500],[-1980,-1360],[-1560,-1680],[-2050,-1620],[-1640,-1320],[-1500,-1560]]
      .forEach(([x,z])=>placeNode("node_oak_tree_young", x, z));

    // ---- SHALLOW MINE (NE, ~66 tiles) ----
    placeNode("node_copper_vein_basic", 1620,-1380);
    placeNode("node_copper_vein_basic", 1900,-1300);
    placeNode("node_tin_vein_basic",    2000,-1560);
    placeNode("node_iron_scrap_pile_basic", 2150,-1450);
    placeNode("node_field_stone_pile",  1500,-1600);
    placeNode("node_field_stone_pile",  1820,-1700);

    // ---- FARMING / HERB EDGE (S, ~67 tiles) ----
    placeNode("node_bitterleaf_patch", -280,2050);
    placeNode("node_bitterleaf_patch", -120,2300);
    placeNode("node_redroot_patch",    -420,2250);
    placeNode("node_fiber_patch_basic",  60,2100);
    placeNode("node_fiber_patch_basic", 180,2280);

    // ---- POND + FISHING (E, ~67 tiles) ----
    const pondC=[2150,250], pondR=220;
    const pond=new THREE.Mesh(new THREE.CircleGeometry(pondR,32),
      new THREE.MeshStandardMaterial({color:0x244a66, transparent:true, opacity:.92, roughness:.2, metalness:.3}));
    pond.rotation.x=-Math.PI/2; pond.position.set(pondC[0],gh(pondC[0],pondC[1])+1,pondC[1]); E.scene.add(pond);
    placeNode("node_river_fishing_spot_small", 2020,160);
    placeNode("node_river_fishing_spot_small", 2280,360);

    // ---- GAME TRAIL (SW, ~69 tiles) ----
    placeNode("node_small_game_trail", -1700,1280);
    placeNode("node_small_game_trail", -1850,1450);

    // ---- OATHSTEAD — a large, walkable town with room for real buildings ----
    // Commons fire at the heart; each NPC sits on its own lot (~300-550u apart) with
    // a building footprint, so nothing crowds and structures have room to grow.
    const fire=buildCampfire(); fire.position.set(0,gh(0,0),0); E.scene.add(fire); W.campfire=fire;
    const buildings=[
      [buildHut(),           -120,-560, 0],    // Torvin — storehouse / bank (N)
      [buildStall(0xa32a22),  380,-330, 0],    // Sela — market stall (NE)
      [buildStall(0x6b5436),  710,  40, 0.2],  // Dorn — smithy goods (E)
      [buildHut(),           -610,-150, 0.5],  // Moll — inn (W)
      [buildHut(),           -650, 370,-0.4],  // Ysel — alchemist (SW)
      [buildHut(),            120, 150, 0]      // Aldric — elder's hall (commons)
    ];
    buildings.forEach(([g,x,z,ry])=>{ g.position.set(x,gh(x,z),z); if(ry)g.rotation.y=ry; E.scene.add(g); });
    const f1=buildFence(9); f1.position.set(-470,gh(-470,700),700); E.scene.add(f1);   // south gate (W)
    const f2=buildFence(9); f2.position.set(280,gh(280,700),700); E.scene.add(f2);     // south gate (E)
    const f3=buildFence(6); f3.position.set(460,gh(460,560),560); f3.rotation.y=.1; E.scene.add(f3); // registrar field

    // ---- NPCs (full Oathstead service roster, index-aligned with U.Data.NPCS) ----
    const npcPos=[
      [-120,-480], // Torvin Vaultseal  — storehouse / banker (N)
      [380,-260],  // Sela Grainhollow  — market (NE)
      [0,80],      // Aldric Ashborne   — commons fire (center)
      [-200,620],  // Varra Ironvow     — south gate (W post)
      [640,40],    // Dorn Hammerwatch  — smithy yard (E)
      [-520,-120], // Moll Cinderwick   — inn (W)
      [560,460],   // Pell Boundstone   — registrar field (SE)
      [-760,60],   // Thresh Darkgate   — west edge (toward the trail)
      [-560,320],  // Ysel Brackwater   — alchemist (SW)
      [220,620]    // Nira Farholm      — south gate (E post) / cartographer
    ];
    U.Data.NPCS.forEach((npc,i)=>{
      const [x,z]=npcPos[i]||[i*260-1100,80];
      W.npcMeshes.push(placeNPC(npc, x, z));
    });
  };

  // ---- quest markers above NPC heads (! offer / ? turn-in) ----
  W.updateQuestMarkers = function(){
    if(!U.Systems.Quests) return;
    W.npcMeshes.forEach(g=>{
      const marker=g.userData.marker; if(!marker) return;
      const kind=U.Systems.Quests.markerFor(g.userData.npcId);
      if(!kind){ marker.visible=false; marker.userData.kind=null; return; }
      marker.visible=true;
      if(marker.userData.kind!==kind){
        marker.material.map = markerTex(kind);
        marker.material.needsUpdate=true;
        marker.userData.kind=kind;
        marker.scale.set(kind==="active"?15:20, kind==="active"?15:20, 1);
      }
    });
  };

  // ---- practice claim stake (placed during the claim-marker quest) ----
  W.spawnClaimStake = function(){
    if(W._claimStake) return;
    const g=new THREE.Group();
    const stake=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,30,6), mat(0x6a4a2a)); stake.position.y=15; g.add(stake);
    const flag=new THREE.Mesh(new THREE.BoxGeometry(16,10,1), mat(0xc0392b)); flag.position.set(8,26,0); g.add(flag);
    const x=480, z=500, y=gh(x,z); g.position.set(x,y,z);
    E.scene.add(g); W._claimStake=g;
  };

  /* ===========================================================================
     WORLD LOOT — dropped items become real, pick-up-able objects on the ground.
       owner-reserve 90s (only the dropper may take it; for future multiplayer),
       then free to all; despawns after 15 min if unclaimed.
     =========================================================================== */
  W.loot = [];
  let lootSeq = 0;
  const LOOT_RESERVE_MS = 90*1000;       // 1:30 owner-only window
  const LOOT_DESPAWN_MS = 15*60*1000;    // 15:00 then it vanishes
  const LOOT_TINT = { resource:0xb5793a, bar:0xc7ccd1, food:0xc8743a, water:0x2d6cbe,
    potion:0xa32a22, tool:0xcaa24a, weapon:0x9aa0a6, armor:0x7a5a32, coin:0xd4a84b, quest:0xcaa24a };

  function buildLootMesh(def, qty){
    const g=new THREE.Group();
    const tint = LOOT_TINT[def.type] || 0xcaa24a;
    // ground claim ring
    const ring=new THREE.Mesh(new THREE.TorusGeometry(9,1.1,6,18),
      new THREE.MeshStandardMaterial({color:tint, emissive:tint, emissiveIntensity:.5, roughness:.5}));
    ring.rotation.x=Math.PI/2; ring.position.y=1.5; g.add(ring);
    // floating gem
    const gem=new THREE.Mesh(new THREE.OctahedronGeometry(6,0),
      new THREE.MeshStandardMaterial({color:tint, emissive:tint, emissiveIntensity:.45, flatShading:true, metalness:.2, roughness:.5}));
    gem.position.y=16; gem.castShadow=true; g.add(gem);
    g.userData.gem=gem; g.userData.ring=ring;
    // label
    const lbl=makeLabel(def.name+(qty>1?` ×${qty}`:""), "#e8dfc8"); lbl.position.y=30; lbl.scale.set(80,20,1); g.add(lbl);
    return g;
  }

  W.spawnLoot = function(id, qty, pos){
    const def = U.Systems.item(id); if(!def) return null;
    const g = buildLootMesh(def, qty);
    const y = gh(pos.x,pos.z); g.position.set(pos.x, y, pos.z);
    const now=Date.now();
    const loot = { lid:"loot"+(lootSeq++), id, qty, mesh:g, pos:{x:pos.x,z:pos.z,y},
      droppedAt:now, ownerUntil:now+LOOT_RESERVE_MS, despawnAt:now+LOOT_DESPAWN_MS, owner:"player" };
    g.userData.interactable = {kind:"loot", loot};
    g.traverse(o=>{ if(o.isMesh) o.userData.interactable = g.userData.interactable; });
    E.scene.add(g); E.interactables.push(g); W.loot.push(loot);
    return loot;
  };

  W.removeLoot = function(loot){
    if(loot.mesh){ E.scene.remove(loot.mesh); }
    const ii=E.interactables.indexOf(loot.mesh); if(ii>=0) E.interactables.splice(ii,1);
    const li=W.loot.indexOf(loot); if(li>=0) W.loot.splice(li,1);
  };

  // the dropper may always take their own loot; others must wait out the reserve
  W.canTakeLoot = function(loot, who){
    who = who||"player";
    if(loot.owner===who) return true;
    return Date.now() >= loot.ownerUntil;
  };

  // despawn ticker (called from main loop via W.update)
  W.lootTick = function(now){
    for(let i=W.loot.length-1;i>=0;i--){
      const l=W.loot[i];
      if(now>=l.despawnAt){ W.removeLoot(l); }
    }
  };


  // animate water ring + campfire flicker + marker bob
  W.update = function(t){
    W.nodes.forEach(n=>{ if(n.mesh.userData.spin){ n.mesh.userData.spin.rotation.z = t*0.6; } });
    if(W.campfire && W.campfire.userData.flames){
      W.campfire.userData.flames.forEach((fl,i)=>{ fl.scale.y = 1 + Math.sin(t*8 + i)*0.18; });
    }
    W.npcMeshes.forEach((g,i)=>{
      const m=g.userData.marker;
      if(m && m.visible){ m.position.y = g.userData.markerBaseY + Math.sin(t*2.4 + i)*3.5; }
    });
    // world loot: bob + spin, then despawn expired
    W.loot.forEach((l,i)=>{
      const gem=l.mesh.userData.gem, ring=l.mesh.userData.ring;
      if(gem){ gem.rotation.y = t*1.2; gem.position.y = 16 + Math.sin(t*2.6 + i)*2.2; }
      if(ring){ ring.rotation.z = t*0.5; }
    });
    W.lootTick(Date.now());
  };

})();

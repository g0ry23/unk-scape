/* ============================================================================
   UNKSCAPE — player.js
   Low-poly avatar, camera-relative WASD + click-to-move (WASD always overrides),
   sprint, terrain follow, held-tool matching, and gather swing animation.
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  const E = U.Engine;
  const P = U.State.player;
  const Pl = U.Player = U.Player || {};
  let THREE;

  let group, rightArm, leftArm, legL, legR, handMount, heldMesh=null, head;
  let walkPhase=0, swingT=0, swinging=false;
  let target=null;                 // click-to-move target {x,z}
  let axisF=0, axisS=0, sprint=false, manual=false;
  const SPEED_WALK=118, SPEED_RUN=188;

  function lp(hex){ return new THREE.MeshStandardMaterial({color:hex, flatShading:true, roughness:.9}); }

  Pl.init = function(){
    THREE = E.THREE;
    group = new THREE.Group();
    const skin=0xc9a87a, cloth=0x6b3a2a, leather=0x4a3320, iron=0x9aa0a6;

    const torso=new THREE.Mesh(new THREE.BoxGeometry(18,24,12), lp(cloth)); torso.position.y=34; torso.castShadow=true; group.add(torso);
    const belt=new THREE.Mesh(new THREE.BoxGeometry(19,5,13), lp(leather)); belt.position.y=23; group.add(belt);
    head=new THREE.Mesh(new THREE.IcosahedronGeometry(8,0), lp(skin)); head.position.y=53; head.castShadow=true; group.add(head);
    const hair=new THREE.Mesh(new THREE.SphereGeometry(8.4,7,5,0,6.3,0,1.4), lp(0x3a2a1a)); hair.position.y=55; group.add(hair);

    rightArm=new THREE.Group(); rightArm.position.set(12,46,0);
    const ra=new THREE.Mesh(new THREE.BoxGeometry(6,22,6), lp(cloth)); ra.position.y=-9; rightArm.add(ra);
    group.add(rightArm);

    leftArm=new THREE.Group(); leftArm.position.set(-12,46,0);
    const la=new THREE.Mesh(new THREE.BoxGeometry(6,22,6), lp(cloth)); la.position.y=-9; leftArm.add(la);
    handMount=new THREE.Group(); handMount.position.set(-5,-19,5); handMount.rotation.set(-0.18,0,-0.20); leftArm.add(handMount); // grip held out & forward of the body, flared away from the legs
    group.add(leftArm);

    legL=new THREE.Mesh(new THREE.BoxGeometry(7,22,8), lp(leather)); legL.position.set(-5,11,0); legL.castShadow=true; group.add(legL);
    legR=new THREE.Mesh(new THREE.BoxGeometry(7,22,8), lp(leather)); legR.position.set(5,11,0); legR.castShadow=true; group.add(legR);

    // facing marker (small) on chest
    const badge=new THREE.Mesh(new THREE.CircleGeometry(3,8), new THREE.MeshStandardMaterial({color:0xc84b20, emissive:0xc84b20, emissiveIntensity:.5}));
    badge.position.set(0,36,6.1); group.add(badge);

    group.position.set(P.pos.x, E.terrainHeight(P.pos.x,P.pos.z), P.pos.z);
    group.rotation.y = P.facing||Math.PI;
    E.scene.add(group);
    Pl.mesh = group;

    // start held tool from selected action slot
    Pl.refreshHeld();
  };

  // ---------- held tool meshes ----------
  // Held tools — the GRIP sits at the hand (group origin); heavy heads hang DOWN
  // and slightly forward, so nothing jabs into the armpit. Swing arcs them forward.
  function toolMesh(kind){
    const g=new THREE.Group();
    if(kind==="axe"){
      const h=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,22,5), lp(0x4a3320)); h.position.y=-11; g.add(h); // handle hangs from the hand
      const blade=new THREE.Mesh(new THREE.BoxGeometry(10,9,2), lp(0xb5793a)); blade.position.set(4,-19,0); g.add(blade); // bit at the far (low) end
    } else if(kind==="pick"){
      const h=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,22,5), lp(0x4a3320)); h.position.y=-11; g.add(h);
      const head=new THREE.Mesh(new THREE.BoxGeometry(20,3,3), lp(0xb5793a)); head.position.y=-20; head.rotation.z=.12; g.add(head);
    } else if(kind==="rod"){
      const r=new THREE.Mesh(new THREE.CylinderGeometry(.7,1.3,34,5), lp(0x6a4a2a)); r.position.set(1,13,3); r.rotation.set(-0.28,0,-0.26); g.add(r); // rod angles up & forward from the grip
    } else if(kind==="snare"){
      const cord=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,14,4), lp(0x6a4a2a)); cord.position.y=-7; g.add(cord);
      const loop=new THREE.Mesh(new THREE.TorusGeometry(5,1,5,10), lp(0x9a8a4a)); loop.position.y=-15; loop.rotation.x=Math.PI/2; g.add(loop);
    } else if(kind==="sword"){
      const grip=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,8,6), lp(0x2a1c10)); grip.position.y=-2; g.add(grip); // hilt in the hand
      const gd=new THREE.Mesh(new THREE.BoxGeometry(11,3,3), lp(0xb5793a)); gd.position.y=2; g.add(gd);            // crossguard
      const bl=new THREE.Mesh(new THREE.BoxGeometry(3,26,1.4), lp(0x9aa0a6)); bl.position.y=16; g.add(bl);        // blade rises from the guard
    } else return null;
    return g;
  }
  // map item -> tool kind
  function toolKindForItem(id){
    if(!id) return null;
    const d=U.Systems.item(id); if(!d) return null;
    if(d.skill==="woodcutting") return "axe";
    if(d.skill==="mining") return "pick";
    if(d.skill==="fishing") return "rod";
    if(d.skill==="hunting") return "snare";
    if(d.type==="weapon") return "sword";
    return null;
  }
  Pl.setHeldTool = function(kind){
    if(heldMesh){ handMount.remove(heldMesh); heldMesh=null; }
    const m=toolMesh(kind); if(m){ heldMesh=m; handMount.add(m); }
  };
  Pl.refreshHeld = function(){
    const sel = P.actionBar[P.selectedSlot];
    Pl.setHeldTool(toolKindForItem(sel));
  };

  // ---------- movement API ----------
  Pl.setAxis = function(f,s){ axisF=f; axisS=s; if(f||s){ manual=true; target=null; } };
  Pl.setSprint = b=>{ sprint=b; };
  Pl.setTarget = function(x,z){
    // ignore micro-taps right next to the player
    const dx=x-P.pos.x, dz=z-P.pos.z;
    if(Math.hypot(dx,dz) < 14) return;
    target={x,z}; manual=false;
  };
  Pl.clearTarget = ()=>{ target=null; };
  Pl.faceTo = function(x,z){
    const a=Math.atan2(x-P.pos.x, z-P.pos.z);
    P.facing=a;
  };
  // walk to within range of pos, then callback (used by gather)
  Pl.moveToRange = function(pos, range, cb){
    Pl._arriveCb=null;
    const dx=pos.x-P.pos.x, dz=pos.z-P.pos.z;
    if(Math.hypot(dx,dz) <= range){ Pl.faceTo(pos.x,pos.z); cb&&cb(); return; }
    // approach point at edge of range
    const d=Math.hypot(dx,dz); const k=(d-range*0.8)/d;
    target={x:P.pos.x+dx*k, z:P.pos.z+dz*k}; manual=false;
    Pl._arriveTarget=pos; Pl._arriveRange=range; Pl._arriveCb=cb;
  };

  Pl.playSwing = function(){ swinging=true; swingT=0; };

  let moving=false;
  Pl.isMoving = ()=>moving;

  Pl.update = function(dt, t){
    let vx=0, vz=0;
    if(manual && (axisF||axisS)){
      const th=E.cam.theta;
      const fwd={x:-Math.sin(th), z:-Math.cos(th)};
      const right={x:Math.cos(th), z:-Math.sin(th)};
      vx = fwd.x*axisF + right.x*axisS;
      vz = fwd.z*axisF + right.z*axisS;
    } else if(target){
      const dx=target.x-P.pos.x, dz=target.z-P.pos.z;
      const d=Math.hypot(dx,dz);
      if(d<6){ target=null; }
      else { vx=dx/d; vz=dz/d; }
    }
    const mag=Math.hypot(vx,vz);
    moving = mag>0.01;
    if(moving){
      vx/=mag; vz/=mag;
      let sp = sprint && P.vitals.stamina>0 ? SPEED_RUN : SPEED_WALK;
      if(sprint && P.vitals.stamina>0){ P.vitals.stamina=Math.max(0,P.vitals.stamina-22*dt); U.Events.emit("vitals"); }
      P.pos.x += vx*sp*dt; P.pos.z += vz*sp*dt;
      // clamp to world (rectangular play bounds, owner spec)
      const HX=U.Constants.MAP_HALF_W-U.Constants.MAP_EDGE_PAD, HZ=U.Constants.MAP_HALF_H-U.Constants.MAP_EDGE_PAD;
      P.pos.x=Math.max(-HX,Math.min(HX,P.pos.x)); P.pos.z=Math.max(-HZ,Math.min(HZ,P.pos.z));
      P.facing = Math.atan2(vx,vz);
      walkPhase += dt*(sp/22);
      // arrival for moveToRange
      if(Pl._arriveCb && Pl._arriveTarget){
        const ad=Math.hypot(Pl._arriveTarget.x-P.pos.x, Pl._arriveTarget.z-P.pos.z);
        if(ad<=Pl._arriveRange){ const cb=Pl._arriveCb; Pl._arriveCb=null; target=null; Pl.faceTo(Pl._arriveTarget.x,Pl._arriveTarget.z); cb(); }
      }
    } else {
      walkPhase += dt*2; // idle breathing
    }

    // position + terrain follow
    const y=E.terrainHeight(P.pos.x,P.pos.z);
    group.position.set(P.pos.x, y, P.pos.z);
    group.rotation.y = P.facing;

    // animation
    if(moving){
      const s=Math.sin(walkPhase)*0.7;
      legL.rotation.x=s; legR.rotation.x=-s;
      if(!swinging){ rightArm.rotation.x=-s*0.6; leftArm.rotation.x=s*0.6; }
      group.position.y = y + Math.abs(Math.sin(walkPhase))*1.5;
    } else {
      legL.rotation.x=0; legR.rotation.x=0;
      if(!swinging){ rightArm.rotation.x=Math.sin(walkPhase)*0.05; leftArm.rotation.x=-Math.sin(walkPhase)*0.05; }
      head.position.y = 53 + Math.sin(walkPhase)*0.4;
    }
    // swing (left arm is the tool arm)
    if(swinging){
      swingT += dt*6;
      const a = Math.sin(swingT)* (swingT<Math.PI? 1:0);
      leftArm.rotation.x = -Math.max(0,a)*1.7;
      if(swingT>=Math.PI){ swinging=false; leftArm.rotation.x=0; }
    }

    // camera follows player
    E.cam.target.set(P.pos.x, y, P.pos.z);

    // regen stamina when not sprinting/moving
    if(!sprint && P.vitals.stamina<P.vitals.staminaMax){
      P.vitals.stamina=Math.min(P.vitals.staminaMax,P.vitals.stamina+8*dt);
    }
  };

})();

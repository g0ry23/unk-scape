/* ============================================================================
   UNKSCAPE — main.js
   Boot, render loop, day/night clock, light survival decay, quest module,
   autosave. Loads last.
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  const P = U.State.player;

  /* ---------------- BOOT ---------------- */
  function boot(){
    if(!window.THREE){ document.body.innerHTML="<div style='color:#e8dfc8;font-family:monospace;padding:40px'>Failed to load the 3D engine (Three.js). Check your connection and refresh.</div>"; return; }
    const canvas = document.getElementById("world-canvas");
    U.Engine.init(canvas);
    U.World.build();
    U.Player.init();
    U.Systems.load();                 // restore save if present (never wipes)
    U.UI.init();
    U.Systems.Quests.init();          // start/restore the Hearthvale chain (after UI so feedback shows)
    U.World.updateQuestMarkers();     // reflect quest state on NPC heads
    U.Input.attach(canvas);

    // place camera behind player initially
    U.Engine.updateCamera();

    let last=performance.now()/1000, mmAccum=0, clockAccum=0;
    function frame(){
      const now=performance.now()/1000;
      let dt=now-last; last=now; if(dt>0.1) dt=0.1;
      const t=now;

      U.Player.update(dt, t);
      U.World.update(t);
      U.Engine.updateCamera();
      U.Gather.tick();

      // minimap ~6fps
      mmAccum+=dt; if(mmAccum>0.16){ mmAccum=0; U.UI.renderMinimap(); }

      // clock + survival decay (slow, gentle)
      clockAccum+=dt;
      if(clockAccum>1){
        clockAccum=0;
        P.clock.t += 1/600;                       // ~10 real-min day
        if(P.clock.t>=1){ P.clock.t-=1; P.clock.day++; }
        // survival decay — gentle / beginner-friendly (Bible: "should not punish new players")
        P.vitals.hunger=Math.max(0, P.vitals.hunger-0.02);
        P.vitals.thirst=Math.max(0, P.vitals.thirst-0.026);
        if(P.vitals.hunger<=0||P.vitals.thirst<=0){ P.vitals.hp=Math.max(1,P.vitals.hp-0.18); }
        else if(P.vitals.hp<P.vitals.hpMax){ P.vitals.hp=Math.min(P.vitals.hpMax,P.vitals.hp+0.45); }
        U.Events.emit("vitals");
        updateClockUI();
        tintByTime();
      }

      U.Engine.renderer.render(U.Engine.scene, U.Engine.camera);
      requestAnimationFrame(frame);
    }
    updateClockUI(); tintByTime();
    requestAnimationFrame(frame);

    // autosave on leave
    window.addEventListener("beforeunload", U.Systems.save);
    setInterval(U.Systems.save, 30000);
  }

  function phaseName(t){
    if(t<0.22) return "Night"; if(t<0.30) return "Dawn"; if(t<0.46) return "Morning";
    if(t<0.56) return "Midday"; if(t<0.72) return "Afternoon"; if(t<0.82) return "Dusk"; return "Night";
  }
  function updateClockUI(){
    const dt=document.getElementById("day-time");
    if(dt) dt.textContent=`Day ${P.clock.day} · ${phaseName(P.clock.t)}`;
  }
  function tintByTime(){
    // shift sky + sun by time of day (dusk-leaning palette)
    const t=P.clock.t;
    const THREE=U.Engine.THREE, scene=U.Engine.scene, sun=U.Engine.sun;
    // day factor 0..1 (peak midday)
    const dayf=Math.max(0, Math.sin((t-0.0)*Math.PI*2 - Math.PI/2)*0.5+0.5);
    const night=new THREE.Color(0x0d0a18), dusk=new THREE.Color(0x231833), day=new THREE.Color(0x3a4a6a);
    const sky=night.clone().lerp(dusk, Math.min(1,dayf*2)).lerp(day, Math.max(0,dayf-0.5)*2);
    scene.background.copy(sky); if(scene.fog) scene.fog.color.copy(sky.clone().lerp(new THREE.Color(0x1a1326),0.4));
    if(sun){ sun.intensity=0.35+dayf*0.95; sun.position.set(-380+t*760, 180+dayf*420, 260); }
  }

  if(document.readyState==="complete"||document.readyState==="interactive") setTimeout(boot,30);
  else window.addEventListener("DOMContentLoaded", ()=>setTimeout(boot,30));

})();

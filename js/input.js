/* ============================================================================
   UNKSCAPE — input.js
   PC mouse + keyboard. WASD overrides click-to-move; precise wheel logic;
   right-drag/middle-drag orbit; right-click context menus; arm's-length only.
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  const E = U.Engine;
  const P = U.State.player;
  const In = U.Input = U.Input || {};

  let canvas;
  const keys = new Set();

  // ---- keybind table (single source — collision-checked at init) ----
  const BIND = {
    skills:"KeyK", inventory:"KeyI", inventoryAlt:"Tab", map:"KeyM", quests:"KeyV",
    pause:"Escape", drop:"KeyQ", collapseInv:"BracketLeft", collapseChat:"BracketRight"
  };
  In.BIND = BIND;

  function checkBindCollisions(){
    const seen={}; let ok=true;
    Object.entries(BIND).forEach(([act,code])=>{
      if(seen[code]){ console.warn(`[UnkScape] keybind collision: ${act} & ${seen[code]} both = ${code}`); ok=false; }
      seen[code]=act;
    });
    // also guard digits 1-8 reserved for action slots
    return ok;
  }

  function ndc(x,y){ return { x:(x/window.innerWidth)*2-1, y:-(y/window.innerHeight)*2+1 }; }

  function recomputeAxis(){
    let f=0,s=0;
    if(keys.has("KeyW")||keys.has("ArrowUp")) f+=1;
    if(keys.has("KeyS")||keys.has("ArrowDown")) f-=1;
    if(keys.has("KeyD")||keys.has("ArrowRight")) s+=1;
    if(keys.has("KeyA")||keys.has("ArrowLeft")) s-=1;
    if(f||s){ U.Gather.cancel(); U.Player.setAxis(f,s); }
    else U.Player.setAxis(0,0);
  }

  function selectSlot(i){
    i = ((i % 8)+8)%8;
    if(P.selectedSlot===i) return;
    P.selectedSlot = i;
    U.Player.refreshHeld();
    U.Events.emit("selectslot", i);
    if(U.Audio) U.Audio.click();
  }
  function cycleSlot(dir){ selectSlot(P.selectedSlot + dir); }
  In.selectSlot = selectSlot;

  // Activate a slot (click / number key): consumables are eaten/drunk on the spot;
  // tools & weapons are wielded. (Wheel-cycling still only selects — see cycleSlot.)
  function useSlot(i){
    i = ((i % 8)+8)%8;
    const id = P.actionBar[i];
    if(!id){ selectSlot(i); return; }
    const d = U.Systems.item(id);
    if(d && (d.type==="food"||d.type==="water"||d.type==="potion")){
      P.selectedSlot=i; U.Events.emit("selectslot", i);
      U.Systems.consume(id);
      return;
    }
    selectSlot(i);   // tool / weapon / resource -> wield & hold
  }
  In.useSlot = useSlot;

  function dropItem(id){
    if(!id || !U.Systems.Inv.has(id)){ U.Events.emit("notice",{text:"Nothing to drop."}); return; }
    const def=U.Systems.item(id);
    U.Systems.Inv.remove(id,1);
    // drop just in front of the player so it lands clear of the body
    const fx=P.pos.x + Math.sin(P.facing)*22, fz=P.pos.z + Math.cos(P.facing)*22;
    U.World.spawnLoot(id, 1, {x:fx, z:fz});
    U.Events.emit("activity",{text:`Dropped ${def?def.name:id} — it's on the ground, walk back to grab it.`, sys:true});
    if(U.Audio) U.Audio.click();
  }
  In.dropItem = dropItem;
  function dropSelected(){ dropItem(P.actionBar[P.selectedSlot]); }
  In.dropSelected = dropSelected;

  // walk to a loot pile and pick it up (arm's length)
  function approachLoot(loot){
    U.Gather.cancel();
    U.Player.moveToRange(loot.pos, U.Constants.INTERACT_RANGE+10, ()=>takeLoot(loot));
  }
  In.approachLoot = approachLoot;
  function takeLoot(loot){
    if(!U.World.loot.includes(loot)) return;            // already gone / taken
    if(!U.World.canTakeLoot(loot,"player")){
      const secs=Math.ceil((loot.ownerUntil-Date.now())/1000);
      U.Events.emit("notice",{text:`Reserved for its owner for ${secs}s more.`}); return;
    }
    const def=U.Systems.item(loot.id);
    U.Systems.Inv.add(loot.id, loot.qty);
    U.World.removeLoot(loot);
    U.Events.emit("activity",{text:`Picked up ${def?def.name:loot.id}${loot.qty>1?` \u00d7${loot.qty}`:""}.`, sys:true});
    if(U.Audio) U.Audio.gain();
  }
  In.takeLoot = takeLoot;

  // =================== KEYBOARD ===================
  window.addEventListener("keydown", e=>{
    // don't hijack typing in chat / text inputs
    if(e.target && (e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")){
      if(e.code==="Escape") e.target.blur();
      return;
    }
    const code=e.code;
    // digits 1-8 → action slot
    if(/^Digit[1-8]$/.test(code)){ useSlot(parseInt(code.slice(5))-1); e.preventDefault(); return; }
    if(/^Numpad[1-8]$/.test(code)){ useSlot(parseInt(code.slice(6))-1); e.preventDefault(); return; }

    if(["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(code)){
      keys.add(code); recomputeAxis(); return;
    }
    if(code==="ShiftLeft"||code==="ShiftRight"){ U.Player.setSprint(true); return; }

    switch(code){
      case BIND.drop: dropSelected(); break;
      case BIND.skills: U.UI.toggleModal("skills"); break;
      case BIND.map: U.UI.toggleModal("map"); break;
      case BIND.quests: U.UI.toggleModal("quests"); break;
      case BIND.inventory: case BIND.inventoryAlt: e.preventDefault(); U.UI.toggleInvPanel(); break;
      case BIND.collapseInv: U.UI.toggleInvPanel(); break;
      case BIND.collapseChat: U.UI.toggleChatPanel(); break;
      case BIND.pause:
        if(U.UI.anyModalOpen()) U.UI.closeModal();
        else if(U.UI.ctxOpen()) U.UI.closeCtx();
        else U.UI.toggleModal("pause");
        break;
    }
  });
  window.addEventListener("keyup", e=>{
    const code=e.code;
    if(keys.has(code)){ keys.delete(code); recomputeAxis(); }
    if(code==="ShiftLeft"||code==="ShiftRight") U.Player.setSprint(false);
  });
  // safety: clear movement if window loses focus
  window.addEventListener("blur", ()=>{ keys.clear(); U.Player.setAxis(0,0); U.Player.setSprint(false); });

  // =================== MOUSE (canvas) ===================
  In.attach = function(cv){
    canvas = cv;
    checkBindCollisions();

    let drag=null; // {button,x,y,moved}

    cv.addEventListener("contextmenu", e=>e.preventDefault());

    cv.addEventListener("pointerdown", e=>{
      U.UI.closeCtx();
      drag = {button:e.button, x:e.clientX, y:e.clientY, moved:false};
      if(e.button===1) e.preventDefault();
      try{ cv.setPointerCapture(e.pointerId); }catch(_){}
    });

    cv.addEventListener("pointermove", e=>{
      if(!drag) return;
      const dx=e.clientX-drag.x, dy=e.clientY-drag.y;
      if(!drag.moved && Math.hypot(dx,dy)>4) drag.moved=true;
      if(drag.moved && (drag.button===2 || drag.button===1)){
        E.cam.theta -= dx*0.005;
        E.cam.phi   -= dy*0.005;
        drag.x=e.clientX; drag.y=e.clientY;
      }
    });

    cv.addEventListener("pointerup", e=>{
      if(!drag){ return; }
      const wasDrag = drag.moved, btn=drag.button;
      const cx=e.clientX, cy=e.clientY;
      drag=null;
      if(wasDrag) return; // orbit, not a click

      const n = ndc(cx,cy);
      if(btn===0){            // LEFT click
        const pick = E.pickInteractable(n.x,n.y);
        if(pick){
          const it = pick.object.userData.interactable;
          if(it.kind==="node") startDefault(it.inst);
          else if(it.kind==="npc") approachNpc(it.npc, "talk");
          else if(it.kind==="loot") approachLoot(it.loot);
        } else {
          const g = E.groundPick(n.x,n.y);
          if(g){ U.Gather.cancel(); U.Player.setTarget(g.x,g.z); }
        }
      } else if(btn===2){     // RIGHT click (no drag) → context menu
        const pick = E.pickInteractable(n.x,n.y);
        if(pick){
          const it = pick.object.userData.interactable;
          if(it.kind==="node") U.UI.openNodeMenu(it.inst, cx, cy);
          else if(it.kind==="npc") U.UI.openNpcMenu(it.npc, cx, cy);
          else if(it.kind==="loot") U.UI.openLootMenu(it.loot, cx, cy);
        }
      }
    });

    // ---- WHEEL: exact intended logic ----
    window.addEventListener("wheel", e=>{
      const dir = Math.sign(e.deltaY) || 1;
      const t = e.target;
      // allow native scroll only inside modal bodies
      if(t.closest && t.closest(".wheel-scroll")) return;
      // over the action bar → cycle
      if(t.closest && t.closest("#action-bar")){ e.preventDefault(); cycleSlot(dir); return; }
      // over ANY hud panel → swallow, do nothing (the bag never scrolls)
      if(t.closest && t.closest("#hud .panel")){ e.preventDefault(); return; }
      // over the world:
      e.preventDefault();
      if(e.ctrlKey || e.altKey){ cycleSlot(dir); }  // Ctrl/Alt + wheel cycles
      else { E.cam.radius += dir*30; }              // plain wheel zooms
    }, {passive:false});
  };

  // left-click a node → run its first available action (walk + gather)
  function startDefault(inst){
    const nt=U.Data.NODE_TYPES[inst.typeId];
    const a = nt.actions.find(x=>!x.locked) || nt.actions[0];
    U.Gather.start(inst, a);
  }
  In.startDefault = startDefault;

  function approachNpc(npc, mode){
    // walk to the npc mesh then talk / open service (arm's length only)
    const m = U.World.npcMeshes.find(mm=>mm.userData.interactable.npc===npc);
    if(!m) return;
    const pos={x:m.position.x, z:m.position.z};
    U.Gather.cancel();
    U.Player.moveToRange(pos, U.Constants.INTERACT_RANGE+20, ()=>{
      // arm's-length contact credits "talk" objectives, then opens the hub/service
      if(U.Systems.Quests) U.Events.emit("questmetric",{key:"talk:"+npc.id});
      U.UI.npcTalk(npc, mode||"talk");
    });
  }
  In.approachNpc = approachNpc;

})();

/* ============================================================================
   UNKSCAPE — state.js
   Event bus + player state + inventory/equipment + non-destructive save/load.
   Saves keyed under unkscape:saves / unkscape:worlds (locked, never wiped).
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  const C = U.Constants;

  /* ----- tiny event bus (event-driven UI; no per-frame DOM rebuilds) ----- */
  const listeners = {};
  U.Events = {
    on(ev, fn){ (listeners[ev] = listeners[ev]||[]).push(fn); return ()=>U.Events.ofhf(ev,fn); },
    off(ev, fn){ if(listeners[ev]) listeners[ev] = listeners[ev].filter(f=>f!==fn); },
    emit(ev, data){ (listeners[ev]||[]).forEach(fn=>{ try{fn(data);}catch(e){console.error(e);} }); }
  };

  /* ----- default new-character state ----- */
  function freshPlayer(){
    const skills = {};
    U.Data.SKILLS.forEach(s=>skills[s.id]={xp:0});
    return {
      version: 1,
      name: "Wanderer",
      race: U.Constants.IDENTITY.race,
      raceId: U.Constants.IDENTITY.raceId,
      faction: U.Constants.IDENTITY.faction,
      factionId: U.Constants.IDENTITY.factionId,
      vitals:{ hp:50, hpMax:50, stamina:100, staminaMax:100, hunger:78, hungerMax:100, thirst:82, thirstMax:100 },
      skills,
      coins: 35,
      inventory:[
        {id:"item_tool_copper_hatchet", qty:1},
        {id:"item_tool_copper_pickaxe", qty:1},
        {id:"item_tool_fishing_line_basic", qty:1},
        {id:"item_tool_hunting_snare_basic", qty:1},
        {id:"item_weapon_training_sword", qty:1},
        {id:"item_food_hearthbread", qty:5},
        {id:"item_water_clay_jug", qty:3},
        {id:"item_potion_minor_mending", qty:2}
      ],
      equipment:{ mainhand:null, chest:null, hands:null, feet:null },
      actionBar:[
        "item_tool_copper_hatchet","item_tool_copper_pickaxe","item_tool_fishing_line_basic",
        "item_tool_hunting_snare_basic","item_weapon_training_sword","item_food_hearthbread",
        "item_water_clay_jug","item_potion_minor_mending"
      ],
      selectedSlot: 0,
      pos:{ x:40, z:150 },
      facing: 0,
      clock:{ day:1, t:0.30 }, // t in 0..1 of day
      quests:{},               // questId -> {state, startedAt, snap, completedAt}
      metrics:{},              // tracked action counts (bank/vendor/consume/map/claim/talk:*)
      tally:{}                 // cumulative gathered items (also used by quest objectives)
    };
  }

  const P = freshPlayer();
  U.State.player = P;

  /* ================= INVENTORY HELPERS ================= */
  const Inv = U.Systems.Inv = {
    count(id){ let n=0; P.inventory.forEach(s=>{ if(s&&s.id===id) n+=s.qty; }); return n; },
    has(id, q=1){ return Inv.count(id) >= q; },
    add(id, qty=1){
      const def = U.Systems.item(id); if(!def) return false;
      if(def.stack){
        const ex = P.inventory.find(s=>s&&s.id===id);
        if(ex){ ex.qty += qty; } else { P.inventory.push({id,qty}); }
      } else {
        for(let i=0;i<qty;i++) P.inventory.push({id,qty:1});
      }
      U.Events.emit("inventory");
      return true;
    },
    remove(id, qty=1){
      let need = qty;
      for(let i=P.inventory.length-1;i>=0 && need>0;i--){
        const s=P.inventory[i]; if(!s||s.id!==id) continue;
        const take = Math.min(s.qty, need); s.qty-=take; need-=take;
        if(s.qty<=0) P.inventory.splice(i,1);
      }
      U.Events.emit("inventory");
      return need===0;
    },
    // swap two visible slots (drag & drop) — operates on padded view
    swap(a,b){
      if(a===b) return;
      const view = Inv.view();
      const A=view[a], B=view[b];
      // map back to real indices
      const ra = A? P.inventory.indexOf(A): -1;
      const rb = B? P.inventory.indexOf(B): -1;
      if(ra>=0 && rb>=0){ const t=P.inventory[ra]; P.inventory[ra]=P.inventory[rb]; P.inventory[rb]=t; }
      else if(ra>=0 && rb<0){ /* move A to position b: reorder array */
        P.inventory.splice(ra,1);
        const insertAt = Math.min(b, P.inventory.length);
        P.inventory.splice(insertAt,0,A);
      }
      U.Events.emit("inventory");
    },
    view(){ // 28 padded slots reflecting array order
      const v = P.inventory.slice(0, C.INV_SLOTS);
      while(v.length < C.INV_SLOTS) v.push(null);
      return v;
    }
  };

  /* ================= EQUIPMENT ================= */
  U.Systems.equip = function(id){
    const def = U.Systems.item(id); if(!def) return false;
    const slot = def.equip || (def.type==="weapon"?"mainhand":null);
    if(!slot) return false;
    // gear-gate by skill tier (combat level used as proxy for weapon/armor tier)
    const combatLvl = U.Systems.levelForXp(P.skills.combat.xp);
    const tierDef = U.Data.TIERS.find(t=>t.n===(def.tier||1));
    if(tierDef && combatLvl < tierDef.reqLevel){
      U.Events.emit("notice", {text:`Requires Combat ${tierDef.reqLevel} to equip ${def.name}.`}); return false;
    }
    if(!Inv.remove(id,1)) return false;
    const prev = P.equipment[slot];
    P.equipment[slot] = id;
    if(prev) Inv.add(prev,1);
    U.Events.emit("equipment"); U.Events.emit("inventory");
    return true;
  };
  U.Systems.unequip = function(slot){
    const id = P.equipment[slot]; if(!id) return;
    P.equipment[slot]=null; Inv.add(id,1);
    U.Events.emit("equipment"); U.Events.emit("inventory");
  };

  /* ================= CONSUME (eat / drink / quaff) — canonical path ================= */
  U.Systems.consume = function(id){
    const d = U.Systems.item(id); if(!d) return false;
    if(!(d.type==="food"||d.type==="water"||d.type==="potion")){
      U.Events.emit("notice",{text:`${d.name} can't be eaten or drunk.`}); return false;
    }
    if(!Inv.has(id)){ U.Events.emit("notice",{text:`No ${d.name} left.`}); return false; }
    Inv.remove(id,1);
    const v=P.vitals;
    if(d.heal)   v.hp     = Math.min(v.hpMax,      v.hp+d.heal);
    if(d.hunger) v.hunger = Math.min(v.hungerMax,  v.hunger+d.hunger);
    if(d.thirst) v.thirst = Math.min(v.thirstMax,  v.thirst+d.thirst);
    if(d.stam)   v.stamina= Math.min(v.staminaMax, v.stamina+d.stam);
    U.Events.emit("vitals");
    const verb = d.type==="water" ? "Drank" : d.type==="potion" ? "Quaffed" : "Ate";
    U.Events.emit("activity",{text:`${verb} ${d.name}.`,sys:true});
    if(d.type==="food") U.Events.emit("questmetric",{key:"consumeFood"});
    else if(d.type==="water") U.Events.emit("questmetric",{key:"consumeWater"});
    if(U.Audio) U.Audio.gain();
    return true;
  };

  /* ================= SAVE / LOAD (non-destructive) ================= */
  U.Systems.save = function(){
    try{
      const all = JSON.parse(localStorage.getItem(C.SAVE_KEY) || "{}");
            all["alpha_human_oathstead"] = { saveVersion: 1, savedAt: Date.now(), player: P };
      localStorage.setItem(C.SAVE_KEY, JSON.stringify(all));
      // touch world registry without clobbering
      const worlds = JSON.parse(localStorage.getItem(C.WORLD_KEY) || "{}");
      worlds["world_surface_age_one"] = worlds["world_surface_age_one"] || { realm:"realm_hearthvale_fields" };
      localStorage.setItem(C.WORLD_KEY, JSON.stringify(worlds));
      return true;
    }catch(e){ console.warn("save failed", e); return false; }
  };
  U.Systems.load = function(){
    try{
      const all = JSON.parse(localStorage.getItem(C.SAVE_KEY) || "{}");
      const slot = all["alpha_human_oathstead"];
      if(slot && slot.player){
        // shallow-merge into P, preserving structure / new fields
        const sp = slot.player;
        Object.keys(sp).forEach(k=>{ P[k] = sp[k]; });
        // ensure all skills exist (forward-compat)
        U.Data.SKILLS.forEach(s=>{ if(!P.skills[s.id]) P.skills[s.id]={xp:0}; });
        if(P.selectedSlot==null) P.selectedSlot=0;
        // forward-compat for quest fields added in Phase 3
        if(!P.quests) P.quests={};
        if(!P.metrics) P.metrics={};
        if(!P.tally) P.tally={};
        return true;
      }
    }catch(e){ console.warn("load failed", e); }
    return false;
  };

  // autosave throttle
  let _saveT=null;
  U.Systems.requestSave = function(){
    clearTimeout(_saveT);
    _saveT = setTimeout(U.Systems.save, 800);
  };
  ["inventory","equipment","skillxp","selectslot","vitals"].forEach(ev=>U.Events.on(ev, U.Systems.requestSave));

})();

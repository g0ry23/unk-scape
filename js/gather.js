/* ============================================================================
   UNKSCAPE — gather.js
   The heart: walk to arm's length, swing (~0.9s base, faster with level),
   yield + rare double, train primary (+chain) skills, log every action,
   deplete & respawn nodes.
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  const P = U.State.player;
  const C = U.Constants;

  let active=null;     // {inst, action, nt, skillId}
  let timer=null;

  function rngInt(a,b){ return a + Math.floor(Math.random()*(b-a+1)); }

  function swingTimeFor(level){ return 900 * Math.max(0.5, 1 - (level-1)*0.006); }

  // ANTI-AFK: every node carries a small 1-3 yield cap. Once spent it depletes
  // and the player HARD-STOPS — no node is ever farmable in place. There is no
  // infinite-harvest loop. Capacity re-rolls on respawn.
  function rollCap(){ return 1 + Math.floor(Math.random()*3); } // 1,2,3
  function depleteVerb(nt){
    return ({
      tree:"is chopped bare", rock:"is mined out", herb:"is picked clean",
      fish:"has moved on", trail:"is sprung and empty"
    })[nt.mesh] || "is spent";
  }

  U.Gather = {
    isActive: ()=>!!active,
    busyNode: ()=> active? active.inst : null,

    // attempt to start an action on a node instance
    start(inst, action){
      const nt = U.Data.NODE_TYPES[inst.typeId];
      if(action.locked){ U.Events.emit("notice",{text:`${action.label} — ${action.note}. Locked for now.`}); return; }
      if(inst.depleted){ U.Events.emit("notice",{text:`${nt.name} is depleted — regrowing.`}); return; }
      // tool requirement
      if(action.toolReq && !U.Systems.Inv.has(action.toolReq)){
        const td=U.Systems.item(action.toolReq);
        U.Events.emit("notice",{text:`You need a ${td?td.name:action.toolReq}.`}); return;
      }
      // level gate by node tier
      const skLvl = U.Systems.levelForXp(P.skills[action.primary].xp);
      const tierDef = U.Data.TIERS.find(t=>t.n===nt.tier);
      if(tierDef && skLvl < tierDef.reqLevel){
        U.Events.emit("notice",{text:`Requires ${U.Data.SKILL_BY_ID[action.primary].name} ${tierDef.reqLevel}.`}); return;
      }

      U.Gather.cancel();
      if(inst.yieldsLeft==null) inst.yieldsLeft = rollCap();
      active = {inst, action, nt, skillId:action.primary, swings:0};
      // match held tool to the action
      const sk=action.primary;
      U.Player.setHeldTool(sk==="woodcutting"?"axe":sk==="mining"?"pick":sk==="fishing"?"rod":sk==="hunting"?"snare":null);
      U.Events.emit("activity",{text:`Moving to ${nt.name}…`, sys:true});
      // walk into arm's length then begin
      U.Player.moveToRange(inst.pos, C.INTERACT_RANGE, ()=>{
        if(!active || active.inst!==inst) return;
        loop();
      });
    },

    cancel(){
      if(timer){ clearTimeout(timer); timer=null; }
      if(active){ U.Events.emit("gatherstop", active); active=null; }
    }
  };
  U.Gather.rollCap = rollCap;   // exposed for node seeding in world.js

  function loop(){
    if(!active) return;
    const {inst, action, nt} = active;
    // re-check still in range (player may have wandered)
    const d=Math.hypot(inst.pos.x-P.pos.x, inst.pos.z-P.pos.z);
    if(d > C.INTERACT_RANGE+8){ U.Gather.cancel(); return; }
    if(inst.depleted){ U.Gather.cancel(); return; }

    U.Player.faceTo(inst.pos.x, inst.pos.z);
    const lvl = U.Systems.levelForXp(P.skills[action.primary].xp);
    const swingMs = swingTimeFor(lvl);

    // one swing
    U.Player.playSwing();
    if(U.Audio) U.Audio.swing(action.primary);
    // nudge the node mesh
    const m=inst.mesh; const ox=m.rotation.z;
    m.rotation.z = ox + 0.05;
    setTimeout(()=>{ if(m) m.rotation.z=ox; }, swingMs*0.4);

    timer = setTimeout(()=>{
      if(!active || active.inst!==inst) return;
      active.swings++;
      if(active.swings >= nt.hits){
        active.swings = 0;
        complete(inst, action, nt);
        // depleting nodes pause for respawn; others continue
        if(inst.depleted){ U.Gather.cancel(); return; }
      }
      loop();
    }, swingMs);
  }

  function complete(inst, action, nt){
    const band = U.Data.XP_BANDS[nt.tier] || [8,12];
    const lvl = U.Systems.levelForXp(P.skills[action.primary].xp);
    // yield + rare double
    const rareChance = Math.min(0.18, 0.02 + lvl*0.0006);
    const qty = (Math.random() < rareChance) ? 2 : 1;
    const def = U.Systems.item(action.produces);

    U.Systems.Inv.add(action.produces, qty);

    // cumulative gather tally (for quests / field log)
    P.tally = P.tally || {};
    P.tally[action.produces] = (P.tally[action.produces]||0) + qty;
    P.tally._total = (P.tally._total||0) + qty;

    // primary XP (scaled within band)
    const xp = rngInt(band[0], band[1]);
    U.Systems.grantXp(action.primary, xp);
    let chainTxt="";
    if(action.chain && U.Data.SKILL_BY_ID[action.chain]){
      const cxp = Math.round(xp*0.7);
      U.Systems.grantXp(action.chain, cxp);
      chainTxt = ` · +${cxp} ${U.Data.SKILL_BY_ID[action.chain].name}`;
    }
    if(U.Audio) U.Audio.gain();

    U.Events.emit("activity",{
      text:`+${qty} ${def?def.name:action.produces}${qty>1?"  (rare!)":""}`,
      xp, skill:action.primary, chainTxt
    });

    // ANTI-AFK hard stop: spend one unit of this node's small 1-3 capacity.
    if(inst.yieldsLeft==null) inst.yieldsLeft = rollCap();
    inst.yieldsLeft--;
    if(inst.yieldsLeft<=0){
      inst.depleted=true; inst.respawnAt=Date.now()+nt.respawn;
      inst.mesh.visible=false;          // sink out; respawn ticker restores it
      U.Events.emit("notice",{text:`${nt.name} ${depleteVerb(nt)} — it'll regrow. Move on to another.`});
    }
  }

  // respawn ticker (called from main loop)
  U.Gather.tick = function(){
    const now=Date.now();
    U.World.nodes.forEach(n=>{
      if(n.depleted && now>=n.respawnAt){
        n.depleted=false; n.mesh.visible=true;
        n.yieldsLeft = rollCap();   // fresh small capacity on regrow
      }
    });
  };

})();

/* ============================================================================
   UNKSCAPE — quests.js
   The quest state machine that drives the locked Hearthvale chain.
   States (per quest, stored in P.quests[id].state):
     (absent) → available (computed) → active → ready → completed
   Objective progress is computed live as a DELTA from a snapshot taken when the
   quest was accepted, against P.tally (gathered items) and P.metrics (tracked
   actions: bank, vendor, consume, map, claim, talk:<npc>). Event-driven; the UI
   never polls — it re-reads on questaccept / questupdate / questready / questcomplete.
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  const P = U.State.player;
  const Q = U.Systems.Quests = {};

  function defs(){ return U.Data.QUESTS; }
  function def(id){ return U.Data.QUEST_BY_ID[id]; }
  function rec(id){ return P.quests && P.quests[id]; }

  Q.stateOf = function(id){
    const r = rec(id); if(r && r.state) return r.state;
    return "not_started";
  };

  // available = not yet started, not locked, prereq satisfied
  Q.isAvailable = function(id){
    const d = def(id); if(!d || d.locked) return false;
    if(Q.stateOf(id) !== "not_started") return false;
    if(d.prereq && Q.stateOf(d.prereq) !== "completed") return false;
    return true;
  };
  Q.isLocked = function(id){
    const d = def(id); if(!d) return true;
    if(!d.locked) return false;
    return true; // 08–10 stay locked this pass
  };

  function snapKeys(){
    return { tally: Object.assign({}, P.tally||{}), metrics: Object.assign({}, P.metrics||{}) };
  }

  // live objective progress for a quest
  Q.objectives = function(id){
    const d = def(id); if(!d) return [];
    const r = rec(id);
    const snap = (r && r.snap) || {tally:{}, metrics:{}};
    return d.objectives.map(o=>{
      let have = 0;
      if(o.kind === "locked"){ have = 0; }
      else if(o.kind === "gather"){
        const cur = o.items.reduce((s,it)=> s + ((P.tally&&P.tally[it])||0), 0);
        const base = o.items.reduce((s,it)=> s + (snap.tally[it]||0), 0);
        have = cur - base;
      } else { // talk / metric
        const cur = (P.metrics && P.metrics[o.key]) || 0;
        const base = snap.metrics[o.key] || 0;
        have = cur - base;
      }
      have = Math.max(0, Math.min(o.need, have));
      return { id:o.id, label:o.label, have, need:o.need, done: have >= o.need, kind:o.kind };
    });
  };

  Q.allDone = function(id){ return Q.objectives(id).every(o=>o.done); };

  // the quest the HUD tracker should show: lowest-order active/ready
  Q.tracked = function(){
    let best=null;
    defs().forEach(d=>{
      const s = Q.stateOf(d.id);
      if((s==="active"||s==="ready") && (!best || d.order < def(best).order)) best = d.id;
    });
    return best;
  };

  // marker state for an NPC head: ! (offer available), ? (ready turn-in), · (active here)
  Q.markerFor = function(npcId){
    let available=false, ready=false, active=false;
    defs().forEach(d=>{
      if(d.giver===npcId && Q.isAvailable(d.id)) available=true;
      const s = Q.stateOf(d.id);
      if(d.turnIn===npcId && s==="ready") ready=true;
      if((d.giver===npcId||d.turnIn===npcId) && (s==="active"||s==="ready")) active=true;
    });
    if(ready) return "ready";
    if(available) return "available";
    if(active) return "active";
    return null;
  };

  // -------- transitions --------
  Q.accept = function(id){
    if(!Q.isAvailable(id)) return false;
    P.quests = P.quests || {};
    P.quests[id] = { state:"active", startedAt:Date.now(), snap:snapKeys() };
    const d = def(id);
    // grant any quest items needed to perform objectives (e.g. the claim marker)
    if(d.grantOnAccept) d.grantOnAccept.forEach(g=>U.Systems.Inv.add(g.id,g.qty||1));
    U.Events.emit("activity",{text:`Quest accepted — ${d.name}.`, sys:true});
    U.Events.emit("questaccept",{id});
    Q.evaluate(id);
    U.Systems.requestSave && U.Systems.requestSave();
    return true;
  };

  Q.evaluate = function(id){
    const r = rec(id); if(!r || r.state!=="active") return;
    if(Q.allDone(id)){
      r.state = "ready";
      U.Events.emit("questready",{id});
    } else {
      U.Events.emit("questupdate",{id});
    }
  };
  Q.evaluateAll = function(){
    defs().forEach(d=>{ if(Q.stateOf(d.id)==="active") Q.evaluate(d.id); });
  };

  Q.turnIn = function(id){
    const r = rec(id); const d = def(id);
    if(!r || r.state!=="ready") return false;
    r.state = "completed"; r.completedAt = Date.now();
    const rw = d.reward||{};
    // xp
    if(rw.xp) Object.keys(rw.xp).forEach(sk=>{ if(P.skills[sk]) U.Systems.grantXp(sk, rw.xp[sk]); });
    // coins
    if(rw.coins){ P.coins += rw.coins; }
    // items
    if(rw.items) rw.items.forEach(it=>U.Systems.Inv.add(it.id, it.qty||1));
    U.Events.emit("equipment"); // refresh coin readouts
    U.Events.emit("questcomplete",{id, reward:rw});
    U.Events.emit("activity",{text:`◆ Quest complete — ${d.name}${rw.coins?` (+${rw.coins}c)`:""}.`, sys:true});
    U.Systems.requestSave && U.Systems.requestSave();
    return true;
  };

  // bump a tracked metric (talk / bank / vendor / consume / map / claim)
  Q.bump = function(key, amount){
    P.metrics = P.metrics || {};
    P.metrics[key] = (P.metrics[key]||0) + (amount||1);
    Q.evaluateAll();
  };

  // grouped lists for the journal
  Q.lists = function(){
    const active=[], available=[], completed=[], upcoming=[];
    defs().forEach(d=>{
      const s = Q.stateOf(d.id);
      if(s==="active"||s==="ready") active.push(d.id);
      else if(s==="completed") completed.push(d.id);
      else if(Q.isAvailable(d.id)) available.push(d.id);
      else upcoming.push(d.id); // locked or prereq not yet met
    });
    return {active, available, completed, upcoming};
  };
  Q.completedCount = function(){ return defs().filter(d=>Q.stateOf(d.id)==="completed").length; };

  // -------- boot wiring --------
  Q.init = function(){
    P.quests = P.quests || {};
    P.metrics = P.metrics || {};
    P.tally = P.tally || {};
    // auto-start the opener if untouched
    defs().forEach(d=>{ if(d.auto && Q.stateOf(d.id)==="not_started" && (!d.prereq) ) Q.accept(d.id); });
    Q.evaluateAll();
  };

  // gather/inventory/skill changes can satisfy objectives → re-evaluate
  U.Events.on("inventory", Q.evaluateAll);
  U.Events.on("skillxp", Q.evaluateAll);
  U.Events.on("questmetric", d=>{ if(d&&d.key) Q.bump(d.key, d.amount||1); });

})();

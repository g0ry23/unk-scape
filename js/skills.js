/* ============================================================================
   UNKSCAPE — skills.js
   XP grants, level-up celebration + unlock callout, "almost there" nudge,
   and the data-driven unlock roadmap used by the Skills panel.
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  const P = U.State.player;

  // unlock roadmap is derived from the tier ladder so it auto-updates
  function roadmapFor(skillId){
    const rows = [];
    U.Data.TIERS.forEach(t=>{
      if(t.reqLevel===1) rows.push({level:1, label:`${t.name}-tier methods open`});
      else rows.push({level:t.reqLevel, label:`${t.name}-tier nodes & gear`});
    });
    // skill-flavored extras
    const extra = {
      woodcutting:[{level:10,label:"Faster swings · twin-log chance rises"}],
      mining:[{level:10,label:"Smelt chain efficiency up"}],
      fishing:[{level:8,label:"Cook chain yields stay fresh longer"}],
      herbalism:[{level:12,label:"Rare seed recovery"}],
      combat:[{level:5,label:"Stone-tier weapons equippable"}]
    }[skillId] || [];
    return rows.concat(extra).sort((a,b)=>a.level-b.level);
  }
  U.Systems.roadmapFor = roadmapFor;

  // grant XP to a skill, fire feedback events
  U.Systems.grantXp = function(skillId, amount){
    const s = P.skills[skillId]; if(!s || amount<=0) return;
    const before = U.Systems.levelForXp(s.xp);
    s.xp += amount;
    const prog = U.Systems.xpProgress(s.xp);
    const after = prog.level;
    U.Events.emit("skillxp", {skillId, amount, prog});

    if(after > before){
      const sk = U.Data.SKILL_BY_ID[skillId];
      // find what unlocked at the new level
      const unlocked = roadmapFor(skillId).filter(r=>r.level===after).map(r=>r.label);
      U.Events.emit("levelup", {
        skillId, name:sk.name, level:after,
        unlock: unlocked.length? unlocked[0] : null
      });
    } else {
      // "almost there" nudge — within ~10% of next level
      if(prog.span>0 && prog.toNext>0 && prog.pct >= 0.90){
        const sk = U.Data.SKILL_BY_ID[skillId];
        U.Events.emit("nudge", {skillId, text:`${prog.toNext.toLocaleString()} XP to ${sk.name} ${after+1}`});
      }
    }
  };

  // convenience: total level + combat level proxy
  U.Systems.totalLevel = function(){
    let n=0; U.Data.SKILLS.forEach(s=>n += U.Systems.levelForXp(P.skills[s.id].xp)); return n;
  };

})();

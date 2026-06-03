/* ============================================================================
   UNKSCAPE — ui-modals.js
   Context menus (item / rich resource-node panel / NPC) + every modal
   (skills, map, quests, bank, vendor, pause, dialog). All inherit the brass
   skin from the one theme layer.
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  const P = U.State.player;
  const UI = U.UI;
  const $ = s=>document.querySelector(s);
  function el(t,c,h){ const e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e; }
  function ic(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';}
  const ICO={
    equip:ic('<path d="M12 2l7 4v6c0 5-7 10-7 10S5 17 5 12V6z"/>'),
    eat:ic('<path d="M6 3v8M9 3v8M6 8h3M9 3v18M15 3c-1 3-1 6 0 9v9"/>'),
    drink:ic('<path d="M6 3h12l-1 6a5 5 0 01-10 0z M9 21h6M12 15v6"/>'),
    use:ic('<path d="M12 2v6l4 4M12 8l-4 4M5 15a7 7 0 0014 0"/>'),
    examine:ic('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>'),
    drop:ic('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
    bind:ic('<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M8 9V6a4 4 0 018 0v3"/>'),
    inspect:ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>'),
    trade:ic('<path d="M3 7h13l-3-3M21 17H8l3 3"/>'),
    msg:ic('<path d="M4 5h16v11H8l-4 4z"/>'),
    follow:ic('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    attack:ic('<path d="M14 4l6 6M3 21l9-9M13 3l8 8-3 3-8-8z"/>')
  };

  // ============================ CONTEXT MENU CORE ============================
  let ctxEl=null;
  function closeCtx(){ if(ctxEl){ ctxEl.remove(); ctxEl=null; } }
  UI.closeCtx=closeCtx; UI.ctxOpen=()=>!!ctxEl;
  function openCtx(x,y,titleHTML,items){
    closeCtx();
    const c=el("div","ctx");
    if(titleHTML) c.appendChild(el("div","ctx-title",titleHTML));
    items.forEach(it=>{
      if(it.sep){ c.appendChild(el("div","ctx-sep")); return; }
      const row=el("div","ctx-item"+(it.disabled?" disabled":"")+(it.danger?" danger":""));
      row.innerHTML=`<span class="ci-ico">${it.ico||""}</span><div class="ci-main"><div class="ci-name">${it.name}</div>${it.meta?`<div class="ci-meta">${it.meta}</div>`:""}</div>`;
      if(!it.disabled) row.addEventListener("click",()=>{ closeCtx(); it.onClick&&it.onClick(); });
      c.appendChild(row);
    });
    document.body.appendChild(c);
    // clamp to viewport
    const r=c.getBoundingClientRect();
    c.style.left=Math.min(x, window.innerWidth-r.width-8)+"px";
    c.style.top=Math.min(y, window.innerHeight-r.height-8)+"px";
    ctxEl=c;
    if(U.Audio) U.Audio.click();
  }
  document.addEventListener("pointerdown",e=>{ if(ctxEl && !ctxEl.contains(e.target)) closeCtx(); }, true);

  // ============================ ITEM MENU ============================
  UI.openItemMenu=function(id, invIndex, x, y){
    const d=U.Systems.item(id); if(!d) return;
    const items=[];
    if(d.equip || d.type==="weapon" || d.type==="armor")
      items.push({ico:ICO.equip,name:"Equip",meta:d.def?`+${d.def} armour`:d.dmg?`+${d.dmg} damage`:"",onClick:()=>U.Systems.equip(id)});
    if(d.type==="food")
      items.push({ico:ICO.eat,name:"Eat",meta:`+${d.heal||0} HP · +${d.hunger||0} hunger`,onClick:()=>consume(id)});
    if(d.type==="water")
      items.push({ico:ICO.drink,name:"Drink",meta:`+${d.thirst||0} thirst`,onClick:()=>consume(id)});
    if(d.type==="potion")
      items.push({ico:ICO.drink,name:"Drink",meta:d.heal?`+${d.heal} HP`:d.stam?`+${d.stam} stamina`:"",onClick:()=>consume(id)});
    if(d.type==="tool"||d.type==="weapon")
      items.push({ico:ICO.use,name:"Wield",meta:"set as in-hand",onClick:()=>{ P.actionBar[P.selectedSlot]=id; U.Player.refreshHeld(); U.Events.emit("inventory"); }});
    items.push({ico:ICO.bind,name:"Bind to Action Bar",meta:`slot ${P.selectedSlot+1}`,onClick:()=>{ P.actionBar[P.selectedSlot]=id; U.Player.refreshHeld(); U.Events.emit("inventory"); }});
    items.push({sep:true});
    items.push({ico:ICO.examine,name:"Examine",onClick:()=>U.Events.emit("notice",{text:examineItem(d)})});
    items.push({ico:ICO.drop,name:"Drop",danger:true,onClick:()=>{ U.Input.dropItem(id); }});
    openCtx(x,y,`${d.name}<div class="ctx-sub">${d.type}</div>`, items);
  };
  function consume(id){ U.Systems.consume(id); }
  function examineItem(d){
    const map={tool:"A sturdy tool. Keep it close.",weapon:"Sharp enough for trouble.",armor:"It'll turn a blow or two.",
      food:"Plain, filling, honest.",water:"Cool valley water.",potion:"Bottled relief.",resource:"Raw stock for a patient hand.",bar:"Smelted and ready for the anvil.",coin:"It spends."};
    return `${d.name} — ${map[d.type]||"Worth keeping."}`;
  }

  // ============================ WORLD LOOT MENU ============================
  UI.openLootMenu=function(loot, x, y){
    const d=U.Systems.item(loot.id); if(!d) return;
    const reserved = !U.World.canTakeLoot(loot,"player");
    const secs = Math.max(0, Math.ceil((loot.ownerUntil-Date.now())/1000));
    const desp = Math.max(0, Math.ceil((loot.despawnAt-Date.now())/1000));
    const mm = s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
    const items=[
      {ico:ICO.use, name:`Take ${d.name}${loot.qty>1?` ×${loot.qty}`:""}`,
        meta: reserved?`reserved ${secs}s`:`vanishes in ${mm(desp)}`, disabled:reserved,
        onClick:()=>U.Input.approachLoot(loot)},
      {ico:ICO.examine, name:"Examine",
        onClick:()=>U.Events.emit("notice",{text:`${d.name} lies on the ground — ${secs>0?`reserved for you ${secs}s more`:"free for anyone"}, gone in ${mm(desp)}.`})}
    ];
    openCtx(x,y,`${d.name}<div class="ctx-sub">dropped loot</div>`, items);
  };

  // ============================ ACTION-BAR SLOT PROMPT ============================
  // Single click on a hotbar slot asks (this menu); double-click / number key is the quick path.
  UI.openActionSlotMenu=function(i, x, y){
    const id=P.actionBar[i]; if(!id) return;
    const d=U.Systems.item(id); if(!d) return;
    const have=U.Systems.Inv.has(id);
    const items=[];
    if(d.type==="food")        items.push({ico:ICO.eat,  name:"Eat",   meta:have?`+${d.heal||0} HP · +${d.hunger||0} hunger`:"none left", disabled:!have, onClick:()=>U.Systems.consume(id)});
    else if(d.type==="water")  items.push({ico:ICO.drink,name:"Drink", meta:have?`+${d.thirst||0} thirst`:"none left", disabled:!have, onClick:()=>U.Systems.consume(id)});
    else if(d.type==="potion") items.push({ico:ICO.drink,name:"Quaff", meta:have?(d.heal?`+${d.heal} HP`:d.stam?`+${d.stam} stamina`:""):"none left", disabled:!have, onClick:()=>U.Systems.consume(id)});
    else                       items.push({ico:ICO.use,  name:"Wield", meta:"hold in hand", disabled:!have, onClick:()=>U.Input.selectSlot(i)});
    items.push({sep:true});
    items.push({ico:ICO.drop, name:"Drop one", danger:true, disabled:!have, meta:"leaves it on the ground", onClick:()=>U.Input.dropItem(id)});
    items.push({ico:ICO.examine, name:"Examine", onClick:()=>U.Events.emit("notice",{text:examineItem(d)})});
    openCtx(x,y,`${d.name}<div class="ctx-sub">${d.type} · slot ${i+1}</div>`, items);
  };

  // ============================ NODE MENU (rich) ============================
  UI.openNodeMenu=function(inst, x, y){
    const nt=U.Data.NODE_TYPES[inst.typeId];
    const lvl=U.Systems.levelForXp(P.skills[nt.skill].xp);
    const swingMs=900*Math.max(0.5,1-(lvl-1)*0.006);
    const harvest=((nt.hits*swingMs)/1000).toFixed(1);
    const band=U.Data.XP_BANDS[nt.tier]||[8,12];
    const items=[];
    nt.actions.forEach(a=>{
      const prim=U.Data.SKILL_BY_ID[a.primary];
      const chain=a.chain?U.Data.SKILL_BY_ID[a.chain]:null;
      const produces=U.Systems.item(a.produces);
      let meta;
      if(a.locked){ meta=`${a.note}`; }
      else {
        const skills = chain? `${prim.name} + ${chain.name}` : prim.name;
        meta=`${skills} · ~${harvest}s · <span class="x">${band[0]}–${band[1]} XP</span> → ${produces?produces.name:""}`;
      }
      items.push({
        ico: prim.icon, name:a.label, meta, disabled:a.locked,
        onClick:()=>U.Gather.start(inst,a)
      });
    });
    items.push({sep:true});
    items.push({ico:ICO.examine,name:"Examine",onClick:()=>U.Events.emit("notice",{text:`${nt.name} — a ${U.Data.SKILL_BY_ID[nt.skill].name.toLowerCase()} node${nt.tier>1?` (tier ${nt.tier})`:""}.`})});
    const tierName=(U.Data.TIERS.find(t=>t.n===nt.tier)||{}).name||"";
    openCtx(x,y,`${nt.name}<div class="ctx-sub">${tierName} · ${U.Data.SKILL_BY_ID[nt.skill].name}</div>`, items);
  };

  // ============================ NPC MENU ============================
  UI.openNpcMenu=function(npc, x, y){
    const QS=U.Systems.Quests;
    const mk = QS? QS.markerFor(npc.id) : null;
    const talkMeta = mk==="ready"?"quest ready to turn in": mk==="available"?"new quest available": mk==="active"?"quest in progress": "";
    const items=[
      {ico:ICO.msg,name:"Talk", meta:talkMeta, onClick:()=>U.Input.approachNpc(npc,"talk")},
      {ico:ICO.inspect,name:"Inspect",onClick:()=>UI.npcExamine(npc)}
    ];
    if(npc.service==="bank") items.push({ico:ICO.trade,name:"Open Bank",onClick:()=>U.Input.approachNpc(npc,"service")});
    else if(npc.service==="vendor") items.push({ico:ICO.trade,name:"Trade",onClick:()=>U.Input.approachNpc(npc,"service")});
    items.push({ico:ICO.follow,name:"Follow",onClick:()=>U.Input.approachNpc(npc,"talk")});
    items.push({sep:true});
    items.push({ico:ICO.attack,name:"Attack",danger:true,disabled:true,meta:"protected — Oathstead is safe ground"});
    openCtx(x,y,`${npc.name}<div class="ctx-sub">${npc.role}</div>`, items);
  };

  // NPC dialog / service dispatch (after walking up to arm's length)
  UI.npcTalk=function(npc, mode){
    if(mode==="service" && npc.service==="bank") return UI.openModal("bank");
    if(mode==="service" && npc.service==="vendor") return UI.openModal("vendor",npc);
    UI.openModal("dialog", npc);
  };
  UI.npcExamine=function(npc){
    U.Events.emit("notice",{text:`${npc.name} — ${npc.role}. "${npc.line}"`});
  };

  // ============================ MODAL CORE ============================
  let curModal=null, curArg=null;
  const scrim=$("#modal-scrim"), host=$("#modal-host");
  UI.anyModalOpen=()=>!!curModal;
  UI.modalIs=k=>curModal===k;
  UI.closeModal=function(){ curModal=null; curArg=null; scrim.classList.remove("show"); host.innerHTML=""; };
  UI.openModal=function(kind,arg){
    curModal=kind; curArg=arg; host.innerHTML="";
    const builder=MODALS[kind]; if(!builder){ UI.closeModal(); return; }
    host.appendChild(builder(arg));
    scrim.classList.add("show");
    if(U.Audio) U.Audio.open();
    if(kind==="map") U.Events.emit("questmetric",{key:"mapOpened"});
  };
  // re-render the open NPC dialog after a quest accept/turn-in/claim
  UI.refreshDialog=function(){ if(curModal==="dialog" && curArg) UI.openModal("dialog", curArg); };
  UI.toggleModal=function(kind){ if(curModal===kind) UI.closeModal(); else UI.openModal(kind); };
  scrim.addEventListener("pointerdown",e=>{ if(e.target===scrim) UI.closeModal(); });

  function modalShell(title, sub, bodyEl, wide){
    const m=el("div","modal"); if(wide) m.style.width="min(980px,94vw)";
    const h=el("div","modal-h",`<div><h2>${title}</h2>${sub?`<div class="sub">${sub}</div>`:""}</div>`);
    const x=el("button","hud-btn x","Close ✕"); x.addEventListener("click",UI.closeModal); h.querySelector("div").after? null:null;
    h.appendChild(x);
    const b=el("div","modal-b wheel-scroll"); b.appendChild(bodyEl);
    m.appendChild(h); m.appendChild(b);
    return m;
  }

  // ============================ SKILLS MODAL ============================
  let skillSel=null;
  function buildSkills(arg){
    skillSel = arg || skillSel || "woodcutting";
    const wrap=el("div"); wrap.style.cssText="display:grid;grid-template-columns:1fr 1.3fr;gap:18px;";
    // left: overview grid
    const left=el("div");
    const grid=el("div"); grid.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;";
    U.Data.SKILLS.forEach(sk=>{
      const prog=U.Systems.xpProgress(P.skills[sk.id].xp);
      const cell=el("div","sk-cell");
      cell.style.cssText=`background:var(--h-slot-bg);border:1px solid ${sk.id===skillSel?"var(--h-gold)":"var(--h-slot-border)"};border-radius:7px;padding:9px 6px;text-align:center;cursor:pointer;`;
      cell.innerHTML=`<div style="width:22px;height:22px;margin:0 auto;color:var(--h-gold)">${sk.icon}</div>
        <div style="font-size:9px;letter-spacing:.06em;margin-top:3px;color:var(--h-muted)">${sk.name}</div>
        <div style="font-size:16px;color:var(--h-text)">${prog.level}<span class="muted" style="font-size:9px">/100</span></div>
        <div style="height:3px;background:var(--h-well);border-radius:2px;margin-top:4px;overflow:hidden;"><i style="display:block;height:100%;width:${Math.round(prog.pct*100)}%;background:var(--h-xp)"></i></div>`;
      cell.addEventListener("click",()=>{ skillSel=sk.id; UI.openModal("skills",sk.id); });
      grid.appendChild(cell);
    });
    left.appendChild(grid);
    const tl=el("div","muted"); tl.style.cssText="margin-top:12px;text-align:center;font-size:11px;letter-spacing:.08em;";
    tl.innerHTML=`Total Level <span class="gold" style="font-size:14px">${U.Systems.totalLevel()}</span>`;
    left.appendChild(tl);
    // right: detail
    const right=el("div","skill-detail"); right.appendChild(skillDetail(skillSel));
    wrap.appendChild(left); wrap.appendChild(right);
    return modalShell("Skills",`All ${U.Data.SKILLS.length} skills · live progress & unlock roadmap`, wrap, true);
  }
  function skillDetail(id){
    const sk=U.Data.SKILL_BY_ID[id]; const prog=U.Systems.xpProgress(P.skills[id].xp);
    const d=el("div");
    d.innerHTML=`<div style="display:flex;align-items:center;gap:12px;">
        <div style="width:40px;height:40px;color:var(--h-gold)">${sk.icon}</div>
        <div><div style="font-size:18px;color:var(--h-gold);letter-spacing:.06em">${sk.name}</div>
        <div class="muted" style="font-size:11px">Level ${prog.level} / 100 · ${P.skills[id].xp.toLocaleString()} XP</div></div></div>
      <div class="vbar xp" style="height:18px;margin:14px 0 6px;"><i style="width:${Math.round(prog.pct*100)}%"></i>
        <span class="vtext">${prog.level>=100?"Mastered":`${prog.into.toLocaleString()} / ${prog.span.toLocaleString()} — ${prog.toNext.toLocaleString()} to ${prog.level+1}`}</span></div>`;
    const rm=el("div"); rm.style.cssText="margin-top:16px;";
    rm.innerHTML=`<div style="font-size:10px;letter-spacing:.16em;color:var(--h-muted);text-transform:uppercase;margin-bottom:8px;">Unlock Roadmap</div>`;
    U.Systems.roadmapFor(id).forEach(r=>{
      const done=prog.level>=r.level;
      const row=el("div");
      row.style.cssText=`display:flex;align-items:center;gap:10px;padding:6px 8px;border-radius:5px;margin-bottom:3px;background:${done?"var(--h-gold-soft)":"transparent"};`;
      row.innerHTML=`<span style="width:34px;text-align:center;font-size:12px;color:${done?"var(--h-gold)":"var(--h-muted)"}">${r.level}</span>
        <span style="flex:1;font-size:11px;color:${done?"var(--h-text)":"var(--h-muted)"}">${r.label}</span>
        <span style="font-size:11px;color:${done?"var(--h-xp)":"var(--h-muted)"}">${done?"✓":"○"}</span>`;
      rm.appendChild(row);
    });
    d.appendChild(rm);
    return d;
  }
  UI.refreshSkillModal=function(){ const host2=$("#modal-host .skill-detail"); if(host2 && skillSel){ host2.innerHTML=""; host2.appendChild(skillDetail(skillSel)); } };

  // ============================ QUESTS — shared renderers ============================
  let journalSel=null;
  function qFmt(s){ return (s||"").replace(/\n/g,"<br>"); }
  function qStateLabel(id){
    const QS=U.Systems.Quests, s=QS.stateOf(id);
    if(s==="ready") return "Ready to turn in";
    if(s==="completed") return "Completed";
    if(s==="active") return "In progress";
    if(QS.isAvailable(id)) return "Available";
    const d=U.Data.QUEST_BY_ID[id];
    return d.locked? "Locked — later chapter" : "Not yet available";
  }
  function qObjList(id, preview){
    const QS=U.Systems.Quests;
    return `<div class="q-objs">`+QS.objectives(id).map(o=>{
      const show = !preview && o.kind!=="locked";
      return `<div class="q-obj${o.done&&!preview?" done":""}">
        <span class="q-tick">${o.done&&!preview?"✓":"○"}</span>
        <span class="q-otext">${o.label}</span>
        <span class="q-ohave">${show?`${o.have}/${o.need}`:""}</span></div>`;
    }).join("")+`</div>`;
  }
  function qRewardLine(q){
    const rw=q.reward||{}, bits=[];
    if(rw.xp) Object.keys(rw.xp).forEach(sk=>bits.push(`<span class="xpc">+${rw.xp[sk].toLocaleString()} ${U.Data.SKILL_BY_ID[sk].name}</span>`));
    if(rw.coins) bits.push(`<span class="gold">+${rw.coins}c</span>`);
    if(rw.items) rw.items.forEach(it=>{ const d=U.Systems.item(it.id); if(d) bits.push(`<span class="gold">${d.name}${it.qty>1?` ×${it.qty}`:""}</span>`); });
    return bits.length? `<div class="q-reward"><span class="muted">Reward</span> ${bits.join(" · ")}</div>` : "";
  }
  function npcName(id){ const n=(U.Data.NPCS||[]).find(x=>x.id===id); return n?n.name:id; }

  // ============================ QUESTS MODAL (Field Log journal) ============================
  function buildQuests(){
    const QS=U.Systems.Quests;
    const wrap=el("div"); wrap.style.cssText="display:grid;grid-template-columns:.85fr 1.25fr;gap:18px;";
    const left=el("div","wheel-scroll"); left.style.cssText="max-height:62vh;overflow:auto;padding-right:6px;";
    const lists=QS.lists();
    function group(title, ids, cls){
      if(!ids.length) return;
      const h=el("div"); h.style.cssText="font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--h-muted);margin:14px 0 6px;"; h.textContent=title; left.appendChild(h);
      ids.forEach(id=>{
        const q=U.Data.QUEST_BY_ID[id], s=QS.stateOf(id);
        const badge = s==="ready"?"?": s==="completed"?"✓": QS.isAvailable(id)?"!": s==="active"?"…":"○";
        const row=el("div","q-row "+cls+(id===journalSel?" sel":""));
        row.innerHTML=`<span class="q-row-badge ${cls}">${badge}</span><span class="q-row-name">${q.name}</span>`;
        row.addEventListener("click",()=>{ journalSel=id; UI.openModal("quests"); });
        left.appendChild(row);
      });
    }
    group("Active", lists.active, "active");
    group("Available", lists.available, "offer");
    group("Completed", lists.completed, "done");
    group("Hearthvale Chapter — Coming", lists.upcoming, "locked");

    if(!journalSel || !U.Data.QUEST_BY_ID[journalSel])
      journalSel = lists.active[0]||lists.available[0]||lists.completed[0]||lists.upcoming[0];
    const right=el("div"); right.appendChild(questDetail(journalSel));
    wrap.appendChild(left); wrap.appendChild(right);
    return modalShell("Field Log", `Hearthvale chain · ${QS.completedCount()} / ${U.Data.QUESTS.length} complete`, wrap, true);
  }
  function questDetail(id){
    const q=U.Data.QUEST_BY_ID[id]; const QS=U.Systems.Quests; const s=QS.stateOf(id);
    const preview = !(s==="active"||s==="ready"||s==="completed");
    const d=el("div");
    d.innerHTML=`<div style="font-size:19px;color:var(--h-gold);letter-spacing:.04em;">${q.name}</div>
      <div class="muted" style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;margin:5px 0 14px;">${q.category.replace(/_/g," ")} · ${qStateLabel(id)}</div>
      <div class="q-text" style="margin-bottom:14px;">${qFmt(q.summary)}</div>
      <div class="muted" style="font-size:10px;margin-bottom:12px;">Giver: <span style="color:var(--h-text)">${npcName(q.giver)}</span> &nbsp;·&nbsp; Turn in: <span style="color:var(--h-text)">${npcName(q.turnIn)}</span></div>`;
    if(q.locked && preview){
      const note=el("div","q-text muted"); note.style.cssText="border:1px dashed var(--h-slot-border);border-radius:7px;padding:12px;font-size:11px;";
      note.innerHTML=`This chapter follows Oathstead into <span class="gold">Harvest Hollow</span> — dungeon depth and Tarkov-style extraction. It opens in a later passage of the build.`;
      d.appendChild(note);
      return d;
    }
    d.insertAdjacentHTML("beforeend", `<div class="muted" style="font-size:9px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px;">Objectives</div>`+qObjList(id, preview)+qRewardLine(q));
    // teaches chips
    if(q.teaches&&q.teaches.length){
      const tw=el("div"); tw.style.cssText="margin-top:14px;display:flex;flex-wrap:wrap;gap:6px;";
      q.teaches.forEach(t=>{ const c=el("span","q-chip",t); tw.appendChild(c); });
      d.appendChild(tw);
    }
    return d;
  }
  UI.refreshQuestModal=function(){ if(UI.modalIs&&UI.modalIs("quests")) UI.openModal("quests"); };

  // ============================ MAP MODAL ============================
  function buildMap(){
    const body=el("div");
    const cv=el("canvas"); cv.width=900; cv.height=560; cv.style.cssText="width:100%;border-radius:8px;border:1px solid var(--h-slot-border);";
    body.appendChild(cv);
    const legend=el("div"); legend.style.cssText="display:flex;gap:18px;flex-wrap:wrap;margin-top:12px;font-size:11px;color:var(--h-muted);";
    legend.innerHTML=`<span><b style="color:#4a7a3a">■</b> Woodlot</span><span><b style="color:#b5793a">■</b> Shallow Mine</span>
      <span><b style="color:#2d6cbe">■</b> Fishing</span><span><b style="color:#6c9a3a">■</b> Herb / Farm Edge</span>
      <span><b style="color:#9a8a4a">■</b> Game Trail</span><span><b style="color:#e8dfc8">●</b> Villager</span><span><b style="color:#d4a84b">▲</b> You</span>`;
    body.appendChild(legend);
    setTimeout(()=>drawMap(cv),20);
    return modalShell("World Map","Hearthvale Fields · Oathstead Village", body, true);
  }
  function drawMap(cv){
    const ctx=cv.getContext("2d"), w=cv.width, h=cv.height;
    // whole-world view: rectangular play bounds (owner spec 16000 x 12800)
    const RANGEX=U.Constants.MAP_HALF_W+300, RANGEZ=U.Constants.MAP_HALF_H+300, cx=0, cz=0;
    const step=10;
    for(let py=0;py<h;py+=step)for(let px=0;px<w;px+=step){
      const wx=cx+((px/w)-0.5)*RANGEX*2, wz=cz+((py/h)-0.5)*RANGEZ*2;
      const y=U.Engine.terrainHeight(wx,wz); const t=Math.min(1,Math.max(0,(y+10)/70));
      ctx.fillStyle=`rgb(${Math.round(62+t*30)},${Math.round(82-t*14)},${Math.round(48-t*10)})`; ctx.fillRect(px,py,step,step);
    }
    function toScreen(x,z){ return [w/2+(x-cx)/(RANGEX*2)*w, h/2+(z-cz)/(RANGEZ*2)*h]; }
    // district labels
    ctx.font="13px 'Courier New'"; ctx.fillStyle="rgba(232,223,200,.55)"; ctx.textAlign="center";
    [["Woodlot",-1750,-1500],["Shallow Mine",1850,-1500],["Pond",2150,250],["Farming Edge",-200,2150],["Game Trail",-1800,1350],["Oathstead",0,-30]].forEach(([t,x,z])=>{ const[sx,sy]=toScreen(x,z); ctx.fillText(t,sx,sy-14); });
    U.World.nodes.forEach(n=>{ const[sx,sy]=toScreen(n.pos.x,n.pos.z); const nt=U.Data.NODE_TYPES[n.typeId];
      ctx.fillStyle = nt.skill==="woodcutting"?"#4a7a3a":nt.skill==="mining"?"#b5793a":nt.skill==="fishing"?"#2d6cbe":nt.skill==="hunting"?"#9a8a4a":"#6c9a3a";
      ctx.fillRect(sx-3,sy-3,6,6); });
    U.World.npcMeshes.forEach(m=>{ const[sx,sy]=toScreen(m.position.x,m.position.z); ctx.fillStyle="#e8dfc8"; ctx.beginPath(); ctx.arc(sx,sy,4,0,7); ctx.fill(); });
    const[px,py]=toScreen(P.pos.x,P.pos.z); ctx.fillStyle="#d4a84b"; ctx.beginPath(); ctx.moveTo(px,py-8); ctx.lineTo(px+6,py+6); ctx.lineTo(px-6,py+6); ctx.closePath(); ctx.fill();
  }

  // ============================ BANK MODAL ============================
  function buildBank(){
    P.bank = P.bank || [];
    const body=el("div"); body.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:18px;";
    function side(title, store, isBank){
      const col=el("div");
      col.innerHTML=`<div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--h-gold);margin-bottom:9px;">${title}</div>`;
      const grid=el("div"); grid.style.cssText="display:grid;grid-template-columns:repeat(5,1fr);gap:5px;";
      const list = isBank? P.bank : P.inventory;
      const view = list.slice(0,30); while(view.length<(isBank?20:25)) view.push(null);
      view.forEach(s=>{
        const slot=el("div","slot"+(s?" has-item":""));
        if(s){ const d=U.Systems.item(s.id);
          slot.innerHTML=`<div class="icon">${d.icon}</div>${d.stack&&s.qty>1?`<span class="qty">${s.qty}</span>`:""}`;
          slot.title=isBank?"Withdraw":"Deposit";
          slot.addEventListener("click",()=>{ isBank? withdraw(s.id):deposit(s.id); });
        }
        grid.appendChild(slot);
      });
      col.appendChild(grid);
      return col;
    }
    function deposit(id){ if(!U.Systems.Inv.has(id))return; U.Systems.Inv.remove(id,1); const ex=P.bank.find(b=>b.id===id); const d=U.Systems.item(id); if(ex&&d.stack)ex.qty++; else P.bank.push({id,qty:1}); U.Events.emit("questmetric",{key:"bankDeposit"}); U.openBankRefresh(); }
    function withdraw(id){ const b=P.bank.find(x=>x.id===id); if(!b)return; b.qty--; if(b.qty<=0)P.bank=P.bank.filter(x=>x!==b); U.Systems.Inv.add(id,1); U.Events.emit("questmetric",{key:"bankWithdraw"}); U.openBankRefresh(); }
    body.appendChild(side("Your Pack","inv",false));
    body.appendChild(side("Vault","bank",true));
    const m=modalShell("Storehouse Vault","Torvin Vaultseal · your goods are safe under oath", body, true);
    U.openBankRefresh=()=>UI.openModal("bank");
    return m;
  }

  // ============================ VENDOR MODAL ============================
  function buildVendor(npc){
    const stock=["item_food_hearthbread","item_water_clay_jug","item_tool_copper_hatchet","item_tool_copper_pickaxe","item_tool_fishing_line_basic","item_potion_minor_mending"];
    const body=el("div");
    body.innerHTML=`<div class="muted" style="font-size:11px;margin-bottom:12px;">${(npc&&npc.line)||"Buy fair, sell fair."} &nbsp;·&nbsp; Coins: <span class="gold" id="vend-coins">${P.coins}</span></div>`;
    const buy=el("div"); buy.innerHTML=`<div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--h-gold);margin-bottom:8px;">Buy</div>`;
    stock.forEach(id=>{ const d=U.Systems.item(id);
      const row=el("div"); row.style.cssText="display:flex;align-items:center;gap:10px;padding:7px;border:1px solid var(--h-slot-border);border-radius:6px;margin-bottom:5px;background:var(--h-slot-bg);";
      row.innerHTML=`<div class="icon" style="width:26px;height:26px;color:var(--h-text)">${d.icon}</div><div style="flex:1;font-size:12px">${d.name}</div><span class="gold" style="font-size:12px">${d.value}c</span>`;
      const b=el("button","hud-btn","Buy"); b.addEventListener("click",()=>{ if(P.coins>=d.value){ P.coins-=d.value; U.Systems.Inv.add(id,1); refresh(); U.Events.emit("questmetric",{key:"vendorBuy"}); U.Events.emit("activity",{text:`Bought ${d.name}.`,sys:true}); } else U.Events.emit("notice",{text:"Not enough coins."}); });
      row.appendChild(b); buy.appendChild(row);
    });
    const sell=el("div"); sell.innerHTML=`<div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--h-gold);margin:14px 0 8px;">Sell <span class="muted" style="font-size:9px">(0.55× value)</span></div>`;
    const sellWrap=el("div"); sell.appendChild(sellWrap);
    function renderSell(){
      sellWrap.innerHTML="";
      const sellable=P.inventory.filter(s=>{ const d=U.Systems.item(s.id); return d && (d.type==="resource"||d.type==="bar"||d.type==="food"); });
      if(!sellable.length){ sellWrap.innerHTML=`<div class="muted" style="font-size:11px">Nothing to sell.</div>`; return; }
      sellable.forEach(s=>{ const d=U.Systems.item(s.id); const price=Math.max(1,Math.round(d.value*0.55));
        const row=el("div"); row.style.cssText="display:flex;align-items:center;gap:10px;padding:7px;border:1px solid var(--h-slot-border);border-radius:6px;margin-bottom:5px;background:var(--h-slot-bg);";
        row.innerHTML=`<div class="icon" style="width:26px;height:26px;color:var(--h-text)">${d.icon}</div><div style="flex:1;font-size:12px">${d.name} <span class="muted">×${s.qty}</span></div><span class="gold" style="font-size:12px">${price}c</span>`;
        const b=el("button","hud-btn","Sell"); b.addEventListener("click",()=>{ U.Systems.Inv.remove(s.id,1); P.coins+=price; refresh(); U.Events.emit("questmetric",{key:"vendorSell"}); });
        row.appendChild(b); sellWrap.appendChild(row);
      });
    }
    function refresh(){ const c=$("#vend-coins"); if(c)c.textContent=P.coins; renderSell(); }
    body.appendChild(buy); body.appendChild(sell); renderSell();
    return modalShell("General Goods", (npc&&npc.name)||"Sela Grainhollow", body);
  }

  // ============================ PAUSE / SETTINGS ============================
  let soundOn=true;
  function buildPause(){
    const body=el("div");
    const controls=[
      ["Move","WASD or Left-Click"],["Sprint","Shift"],["Camera orbit","Right-drag / Middle-drag"],
      ["Zoom","Mouse Wheel"],["Cycle action bar","Ctrl/Alt + Wheel · 1–8 · hover bar + wheel"],
      ["Drop in-hand","Q"],["Skills","K"],["Inventory","I / Tab / ["],["Chat","]"],["Map","M"],["Quests","V"],["Pause","Esc"],
      ["Interact","Walk up & left-click · right-click for menu"],["Bank","Talk to Torvin (banker)"]
    ];
    const grid=el("div"); grid.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;margin-bottom:16px;";
    controls.forEach(([k,v])=>{ const r=el("div"); r.style.cssText="display:flex;justify-content:space-between;font-size:11px;padding:4px 0;border-bottom:1px dotted var(--h-border);";
      r.innerHTML=`<span class="muted">${k}</span><span>${v}</span>`; grid.appendChild(r); });
    body.appendChild(grid);
    const btns=el("div"); btns.style.cssText="display:flex;gap:10px;flex-wrap:wrap;";
    const snd=el("button","hud-btn","Sound: On"); snd.addEventListener("click",()=>{ soundOn=!soundOn; U.Audio.setEnabled(soundOn); snd.textContent="Sound: "+(soundOn?"On":"Off"); });
    const sv=el("button","hud-btn primary","Save Now"); sv.addEventListener("click",()=>{ U.Systems.save(); UI.toast("Progress saved","",1400); });
    const cam=el("button","hud-btn","Reset Camera"); cam.addEventListener("click",()=>{ U.Engine.cam.theta=0; U.Engine.cam.phi=0.92; U.Engine.cam.radius=300; });
    btns.appendChild(snd); btns.appendChild(cam); btns.appendChild(sv);
    body.appendChild(btns);
    return modalShell("Paused","UNKSCAPE · Hearthvale Alpha", body);
  }

  function buildDialog(npc){
    const QS=U.Systems.Quests;
    const QD=U.Data.QUESTS;
    const body=el("div");
    // header
    const head=el("div"); head.style.cssText="display:flex;gap:14px;align-items:flex-start;margin-bottom:14px;";
    head.innerHTML=`<div style="width:54px;height:54px;border-radius:8px;background:var(--h-slot-bg);border:1px solid var(--h-slot-border);display:grid;place-items:center;color:${npc.color};font-size:24px;flex:0 0 auto;">◈</div>
      <div><div style="font-size:13px;color:var(--h-gold);letter-spacing:.05em">${npc.role}</div>
      <div style="font-size:13px;line-height:1.6;margin-top:6px;color:var(--h-text)">"${npc.line}"</div></div>`;
    body.appendChild(head);

    function questCard(q, variant){
      const card=el("div","q-card "+variant);
      const label = variant==="ready"?"Ready to turn in": variant==="offer"?"New quest": "In progress";
      const badge = variant==="ready"?"?": variant==="offer"?"!": "…";
      const text  = variant==="ready"?q.complete : variant==="offer"?q.offer : q.active;
      card.innerHTML=`<div class="q-card-h"><span class="q-badge ${variant}">${badge}</span>
        <span class="q-name">${q.name}</span><span class="q-state ${variant}">${label}</span></div>
        <div class="q-text">${qFmt(text)}</div>`;
      if(variant==="offer"){ card.insertAdjacentHTML("beforeend", qObjList(q.id, true)+qRewardLine(q)); }
      if(variant==="active"){ card.insertAdjacentHTML("beforeend", qObjList(q.id, false)); }
      if(variant==="ready"){ card.insertAdjacentHTML("beforeend", qRewardLine(q)); }
      return card;
    }

    let any=false;
    // 1) turn-ins ready here
    QD.filter(q=>q.turnIn===npc.id && QS.stateOf(q.id)==="ready").forEach(q=>{
      any=true; const card=questCard(q,"ready");
      const btn=el("button","hud-btn primary","Complete Quest");
      btn.addEventListener("click",()=>{ QS.turnIn(q.id); UI.refreshDialog(); });
      card.appendChild(btn); body.appendChild(card);
    });
    // 2) active quests anchored to this NPC
    QD.filter(q=>(q.giver===npc.id||q.turnIn===npc.id) && QS.stateOf(q.id)==="active").forEach(q=>{
      any=true; const card=questCard(q,"active");
      // special: drive the practice claim marker (Pell, quest 07)
      if(npc.id==="npc_pell_boundstone" && q.id==="quest_hearthvale_claim_marker"){
        const o=QS.objectives(q.id).find(x=>x.id==="place_claim");
        if(o && !o.done){
          const cb=el("button","hud-btn","Drive in the Claim Marker");
          cb.addEventListener("click",()=>{ U.Events.emit("questmetric",{key:"claimPlaced"}); U.World.spawnClaimStake&&U.World.spawnClaimStake(); UI.toast("Claim marker set on the training ground","",1800); UI.refreshDialog(); });
          card.appendChild(cb);
        }
      }
      body.appendChild(card);
    });
    // 3) new offers from this NPC
    QD.filter(q=>q.giver===npc.id && QS.isAvailable(q.id)).forEach(q=>{
      any=true; const card=questCard(q,"offer");
      const btn=el("button","hud-btn primary","Accept Quest");
      btn.addEventListener("click",()=>{ QS.accept(q.id); UI.refreshDialog(); });
      card.appendChild(btn); body.appendChild(card);
    });

    if(!any){
      const note=el("div","muted"); note.style.cssText="font-size:11px;line-height:1.6;";
      note.innerHTML = npc.service==="bank" ? "Use <span class='gold'>Open the Vault</span> below to store your goods." :
                       npc.service==="vendor" ? "Use <span class='gold'>Trade Goods</span> below to buy and sell." :
                       "Nothing for you right now — Oathstead's story will turn back your way soon enough.";
      body.appendChild(note);
    }

    // service buttons
    if(npc.service){
      const sb=el("div"); sb.style.cssText="display:flex;gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid var(--h-border);";
      const b=el("button","hud-btn", npc.service==="bank"?"Open the Vault":"Trade Goods");
      b.addEventListener("click",()=> npc.service==="bank"? UI.openModal("bank") : UI.openModal("vendor",npc));
      sb.appendChild(b); body.appendChild(sb);
    }
    return modalShell(npc.name, npc.role+" · Oathstead Village", body);
  }

  const MODALS={ skills:buildSkills, quests:buildQuests, map:buildMap, bank:buildBank, vendor:buildVendor, pause:buildPause, dialog:buildDialog };

})();

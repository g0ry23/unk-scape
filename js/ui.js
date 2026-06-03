/* ============================================================================
   UNKSCAPE — ui.js (core HUD)
   Vitals, inventory/skills/equip tabs, action bar, drag-and-drop, minimap,
   tooltips, toasts, activity feed, level-up + nudge, collapsible panels.
   Event-driven — never rebuilt per frame.
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  const P = U.State.player;
  const UI = U.UI = U.UI || {};
  const $ = s=>document.querySelector(s);
  function el(tag,cls,html){ const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }

  let invTab="inv";

  // ---------------- VITALS ----------------
  function renderVitals(){
    $("#pname").textContent = P.name;
    $("#prace").textContent = `${P.race} · ${P.faction}`;
    $("#ptotal").textContent = `Total ${U.Systems.totalLevel()}`;
    const v=P.vitals;
    $("#vitals .hp i").style.width = (v.hp/v.hpMax*100)+"%";
    $("#hp-text").textContent = `${Math.round(v.hp)} / ${v.hpMax}`;
    $("#vitals .stam i").style.width = (v.stamina/v.staminaMax*100)+"%";
    $("#stam-text").textContent = Math.round(v.stamina);
    $("#vitals .hunger i").style.width = (v.hunger/v.hungerMax*100)+"%";
    $("#hunger-text").textContent = Math.round(v.hunger);
    // combat strip
    $("#cs-atk").textContent = U.Systems.levelForXp(P.skills.combat.xp);
    $("#cs-def").textContent = U.Systems.levelForXp(P.skills.combat.xp);
    $("#cs-build").textContent = U.Systems.levelForXp(P.skills.building_claim_crafting.xp);
  }

  // ---------------- ITEM ICON ----------------
  function iconHTML(id){
    const d=U.Systems.item(id); if(!d) return "";
    return `<div class="icon">${d.icon||""}</div>`;
  }

  // ---------------- INVENTORY GRID ----------------
  function renderInventory(){
    const body=$("#inv-body"); body.innerHTML="";
    // set active tab visual
    document.querySelectorAll("#inv-tabs .tab").forEach(t=>t.classList.toggle("active", t.dataset.itab===invTab));

    if(invTab==="inv"){
      const grid=el("div","inv-grid"); grid.style.cssText="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;";
      const view=U.Systems.Inv.view();
      view.forEach((s,i)=>{
        const slot=el("div","slot"+(s?" has-item":""));
        slot.dataset.slot=i;
        if(s){
          const d=U.Systems.item(s.id);
          slot.innerHTML = iconHTML(s.id) + (d.stack&&s.qty>1?`<span class="qty">${s.qty}</span>`:"") +
            (d.tier&&d.tier>1?`<span class="tier" style="color:${(U.Data.TIERS.find(t=>t.n===d.tier)||{}).color}">T${d.tier}</span>`:"");
          slot.draggable=true;
          slot.addEventListener("dragstart",ev=>ev.dataTransfer.setData("text/plain",JSON.stringify({from:"inv",index:i,id:s.id})));
          slot.addEventListener("mouseenter",ev=>showItemTip(s.id, slot));
          slot.addEventListener("mouseleave",hideTip);
          slot.addEventListener("contextmenu",ev=>{ev.preventDefault(); UI.openItemMenu(s.id, i, ev.clientX, ev.clientY);});
          slot.addEventListener("click",ev=>{ /* select if usable on bar */ });
        }
        slot.addEventListener("dragover",ev=>{ev.preventDefault(); slot.classList.add("drag-over");});
        slot.addEventListener("dragleave",()=>slot.classList.remove("drag-over"));
        slot.addEventListener("drop",ev=>{
          ev.preventDefault(); slot.classList.remove("drag-over");
          const data=JSON.parse(ev.dataTransfer.getData("text/plain")||"{}");
          if(data.from==="inv") U.Systems.Inv.swap(data.index, i);
        });
        grid.appendChild(slot);
      });
      body.appendChild(grid);
      const cap=el("div","muted"); cap.style.cssText="font-size:9px;text-align:center;margin-top:8px;letter-spacing:.08em;";
      cap.textContent=`${U.Systems.Inv.view().filter(Boolean).length} / 28 shown · uncapped store`;
      body.appendChild(cap);
    }
    else if(invTab==="skills"){
      const grid=el("div"); grid.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;";
      U.Data.SKILLS.forEach(sk=>{
        const prog=U.Systems.xpProgress(P.skills[sk.id].xp);
        const cell=el("div","sk-mini");
        cell.style.cssText="background:var(--h-slot-bg);border:1px solid var(--h-slot-border);border-radius:5px;padding:5px 4px;cursor:pointer;text-align:center;";
        cell.innerHTML=`<div style="width:18px;height:18px;margin:0 auto;color:var(--h-gold)">${sk.icon}</div>
          <div style="font-size:13px;color:var(--h-text);margin-top:2px;">${prog.level}</div>
          <div style="height:3px;background:var(--h-well);border-radius:2px;margin-top:3px;overflow:hidden;"><i style="display:block;height:100%;width:${Math.round(prog.pct*100)}%;background:var(--h-xp);"></i></div>`;
        cell.title=sk.name;
        cell.addEventListener("click",()=>UI.openModal("skills", sk.id));
        cell.addEventListener("mouseenter",()=>showTextTip(`${sk.name}<div class="tt-meta">Level ${prog.level}</div><div class="tt-line tt-xp">${prog.toNext? prog.toNext.toLocaleString()+" XP to next":"Max"}</div>`, cell));
        cell.addEventListener("mouseleave",hideTip);
        grid.appendChild(cell);
      });
      body.appendChild(grid);
    }
    else if(invTab==="equip"){
      const slots=[["mainhand","Main Hand"],["chest","Chest"],["hands","Hands"],["feet","Feet"]];
      const wrap=el("div"); wrap.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:6px;";
      slots.forEach(([k,label])=>{
        const id=P.equipment[k];
        const slot=el("div","slot"+(id?" has-item":""));
        slot.style.cssText="aspect-ratio:auto;padding:8px;display:flex;align-items:center;gap:8px;justify-content:flex-start;";
        slot.innerHTML = (id? `<div class="icon" style="width:30px;height:30px;flex:0 0 auto;">${U.Systems.item(id).icon}</div>`:`<div style="width:30px;height:30px;border:1px dashed var(--h-slot-border);border-radius:5px;flex:0 0 auto;"></div>`)+
          `<div style="text-align:left;line-height:1.2;"><div style="font-size:8px;letter-spacing:.1em;color:var(--h-muted);">${label.toUpperCase()}</div><div style="font-size:10px;">${id?U.Systems.item(id).name:"<span class='muted'>empty</span>"}</div></div>`;
        if(id){ slot.addEventListener("click",()=>U.Systems.unequip(k)); slot.title="Click to unequip"; }
        wrap.appendChild(slot);
      });
      body.appendChild(wrap);
      const stat=el("div"); stat.style.cssText="margin-top:9px;font-size:10px;color:var(--h-muted);line-height:1.6;";
      let def=0,dmg=0; Object.values(P.equipment).forEach(id=>{ if(id){const d=U.Systems.item(id); def+=d.def||0; dmg+=d.dmg||0;} });
      stat.innerHTML=`Armour <span class="gold">${def}</span> &nbsp;·&nbsp; Damage <span class="gold">${dmg}</span> &nbsp;·&nbsp; Coins <span class="gold">${P.coins}</span>`;
      body.appendChild(stat);
    }
  }

  // ---------------- ACTION BAR ----------------
  function renderActionBar(){
    const bar=$("#action-bar"); bar.innerHTML="";
    for(let i=0;i<U.Constants.ACTION_SLOTS;i++){
      const id=P.actionBar[i];
      const have = id && U.Systems.Inv.has(id);
      const slot=el("div","slot aslot"+(i===P.selectedSlot?" sel":"")+(have?" has-item":""));
      slot.dataset.aslot=i;
      slot.innerHTML=`<span class="hk">${i+1}</span>`+(id?iconHTML(id):"")+
        (id && U.Systems.item(id).stack? `<span class="qty">${U.Systems.Inv.count(id)}</span>`:"");
      if(id && !have) slot.style.opacity=.4;
      let aClickT=null;
      slot.addEventListener("click",(ev)=>{
        if(!id) return;
        if(aClickT) return;                 // first half of a dblclick — wait it out
        const cx=ev.clientX, cy=ev.clientY;
        aClickT=setTimeout(()=>{ aClickT=null; U.UI.openActionSlotMenu(i, cx, cy); }, 230);
      });
      slot.addEventListener("dblclick",()=>{ if(aClickT){ clearTimeout(aClickT); aClickT=null; } U.Input.useSlot(i); }); // quick use
      slot.addEventListener("contextmenu",ev=>{ ev.preventDefault(); if(id) U.UI.openItemMenu(id, -1, ev.clientX, ev.clientY); }); // full menu
      slot.addEventListener("mouseenter",()=>{ if(id) showItemTip(id, slot); });
      slot.addEventListener("mouseleave",hideTip);
      slot.draggable = !!id;
      slot.addEventListener("dragstart",ev=>ev.dataTransfer.setData("text/plain",JSON.stringify({from:"bar",index:i,id})));
      slot.addEventListener("dragover",ev=>{ev.preventDefault(); slot.classList.add("drag-over");});
      slot.addEventListener("dragleave",()=>slot.classList.remove("drag-over"));
      slot.addEventListener("drop",ev=>{
        ev.preventDefault(); slot.classList.remove("drag-over");
        const data=JSON.parse(ev.dataTransfer.getData("text/plain")||"{}");
        if(data.from==="inv"){ P.actionBar[i]=data.id; }
        else if(data.from==="bar"){ const t=P.actionBar[i]; P.actionBar[i]=P.actionBar[data.index]; P.actionBar[data.index]=t; }
        U.Player.refreshHeld(); U.Events.emit("inventory");
      });
      bar.appendChild(slot);
    }
  }

  // ---------------- TOOLTIP ----------------
  const tip=$("#tooltip");
  function showItemTip(id, anchor){
    const d=U.Systems.item(id); if(!d) return;
    const tierName=(U.Data.TIERS.find(t=>t.n===d.tier)||{}).name||"";
    let lines="";
    if(d.skill) lines+=`<div class="tt-line">${U.Data.SKILL_BY_ID[d.skill].name} tool</div>`;
    if(d.dmg) lines+=`<div class="tt-line">Damage <span class="gold">${d.dmg}</span></div>`;
    if(d.def) lines+=`<div class="tt-line">Armour <span class="gold">${d.def}</span></div>`;
    if(d.heal) lines+=`<div class="tt-line">Heals <span class="gold">${d.heal}</span> HP</div>`;
    if(d.hunger) lines+=`<div class="tt-line">Hunger <span class="gold">+${d.hunger}</span></div>`;
    if(d.thirst) lines+=`<div class="tt-line">Thirst <span class="gold">+${d.thirst}</span></div>`;
    if(d.stam) lines+=`<div class="tt-line">Stamina <span class="gold">+${d.stam}</span></div>`;
    showTextTip(`${d.name}<div class="tt-meta">${d.type}${tierName?" · "+tierName:""} · ${d.value}c</div>${lines}`, anchor);
  }
  function showTextTip(html, anchor){
    tip.innerHTML = wrapTip(html);
    const r=anchor.getBoundingClientRect();
    tip.style.left=Math.min(window.innerWidth-250, r.right+10)+"px";
    tip.style.top=Math.max(8, r.top)+"px";
    tip.classList.add("show");
  }
  function wrapTip(html){
    const idx=html.indexOf("<");
    if(idx<0) return `<div class="tt-name">${html}</div>`;
    return `<div class="tt-name">${html.slice(0,idx)}</div>${html.slice(idx)}`;
  }
  function hideTip(){ tip.classList.remove("show"); }
  UI.showTextTip=showTextTip; UI.hideTip=hideTip; UI.showItemTip=showItemTip;

  // ---------------- CHAT / ACTIVITY FEED ----------------
  let chatTab="all";
  const logBuf=[];
  function addLine(kind, html, channel){
    logBuf.push({kind,html,channel:channel||"game"});
    if(logBuf.length>200) logBuf.shift();
    renderChat();
  }
  function renderChat(){
    const box=$("#chat-log"); if(!box) return;
    const vis=logBuf.filter(l=> chatTab==="all" ? true : l.channel===chatTab);
    box.innerHTML=vis.map(l=>`<div class="chat-line ${l.kind||""}">${l.html}</div>`).join("");
    box.scrollTop=box.scrollHeight;
  }
  UI.addLine=addLine;

  // ---------------- TOASTS ----------------
  function toast(html, cls, ms){
    const t=el("div","toast"+(cls?" "+cls:""),html);
    $("#toasts").appendChild(t);
    setTimeout(()=>{ t.classList.add("out"); setTimeout(()=>t.remove(),260); }, ms||2200);
  }
  UI.toast=toast;

  // ---------------- MINIMAP ----------------
  const mm=$("#minimap"); const mctx=mm.getContext("2d");
  const MM_RANGE=1700;
  UI.renderMinimap=function(){
    const w=mm.width,h=mm.height; mctx.clearRect(0,0,w,h);
    mctx.fillStyle="#0c0a14"; mctx.fillRect(0,0,w,h);
    // terrain sample
    const step=12;
    for(let py=0;py<h;py+=step){
      for(let px=0;px<w;px+=step){
        const wx=P.pos.x + ((px/w)-0.5)*MM_RANGE*2;
        const wz=P.pos.z + ((py/h)-0.5)*MM_RANGE*2;
        const y=U.Engine.terrainHeight(wx,wz);
        const t=Math.min(1,Math.max(0,(y+10)/70));
        const r=Math.round(62+t*30), g=Math.round(82-t*14), b=Math.round(48-t*10);
        mctx.fillStyle=`rgb(${r},${g},${b})`;
        mctx.fillRect(px,py,step,step);
      }
    }
    // node blips
    U.World.nodes.forEach(n=>{
      const dx=n.pos.x-P.pos.x, dz=n.pos.z-P.pos.z;
      if(Math.abs(dx)>MM_RANGE||Math.abs(dz)>MM_RANGE) return;
      const px=w/2 + dx/(MM_RANGE*2)*w, py=h/2 + dz/(MM_RANGE*2)*h;
      const nt=U.Data.NODE_TYPES[n.typeId];
      const col = nt.skill==="woodcutting"?"#4a7a3a": nt.skill==="mining"?"#b5793a": nt.skill==="fishing"?"#2d6cbe": nt.skill==="hunting"?"#9a8a4a":"#6c9a3a";
      mctx.fillStyle=n.depleted?"rgba(120,120,120,.5)":col;
      mctx.fillRect(px-1.5,py-1.5,3,3);
    });
    // npc blips
    U.World.npcMeshes.forEach(m=>{
      const dx=m.position.x-P.pos.x, dz=m.position.z-P.pos.z;
      if(Math.abs(dx)>MM_RANGE||Math.abs(dz)>MM_RANGE) return;
      const px=w/2 + dx/(MM_RANGE*2)*w, py=h/2 + dz/(MM_RANGE*2)*h;
      mctx.fillStyle="#e8dfc8"; mctx.beginPath(); mctx.arc(px,py,2.2,0,7); mctx.fill();
    });
    // player triangle (facing)
    mctx.save(); mctx.translate(w/2,h/2); mctx.rotate(-P.facing);
    mctx.fillStyle="#d4a84b"; mctx.beginPath(); mctx.moveTo(0,-6); mctx.lineTo(4,5); mctx.lineTo(-4,5); mctx.closePath(); mctx.fill();
    mctx.restore();
    // compass + coord
    const headings=["S","SW","W","NW","N","NE","E","SE"];
    const idx=Math.round(((U.Engine.cam.theta)%(Math.PI*2))/(Math.PI/4))%8;
    $("#compass").textContent=headings[(idx+8)%8];
    $("#mm-coord").textContent=`${Math.round(P.pos.x)}, ${Math.round(P.pos.z)}`;
  };

  // ---------------- QUEST TRACKER (on-HUD) ----------------
  function npcNameById(id){ const n=(U.Data.NPCS||[]).find(x=>x.id===id); return n?n.name:""; }
  function renderTracker(){
    const QS=U.Systems.Quests; const host=$("#quest-tracker");
    if(!host||!QS) return;
    const id=QS.tracked();
    if(!id){ host.classList.add("collapsed"); return; }
    host.classList.remove("collapsed");
    const q=U.Data.QUEST_BY_ID[id]; const ready=QS.stateOf(id)==="ready";
    const objs=QS.objectives(id);
    host.innerHTML =
      `<div class="qt-h"><span class="qt-badge${ready?" ready":""}">${ready?"?":"◆"}</span><span class="qt-name">${q.name}</span></div>`+
      `<div class="qt-objs">`+objs.map(o=>
        `<div class="qt-obj${o.done?" done":""}"><span class="qt-tick">${o.done?"✓":"○"}</span><span class="qt-otext">${o.label}</span><span class="qt-have">${o.kind==="locked"?"":`${o.have}/${o.need}`}</span></div>`
      ).join("")+`</div>`+
      (ready?`<div class="qt-turnin">▸ Return to ${npcNameById(q.turnIn)}</div>`:"");
  }
  UI.renderTracker=renderTracker;

  // ---------------- COLLAPSE PANELS ----------------
  UI.toggleInvPanel=function(){ $("#inv-panel").classList.toggle("collapsed"); $("#dock-inv").textContent = $("#inv-panel").classList.contains("collapsed")?"►":"◄"; };
  UI.toggleChatPanel=function(){ $("#chat-panel").classList.toggle("collapsed"); $("#dock-chat").textContent = $("#chat-panel").classList.contains("collapsed")?"◄":"►"; };

  // ---------------- EVENT WIRING ----------------
  UI.init=function(){
    // suppress browser context menu over the HUD (we use our own)
    const hud=document.getElementById("hud"); if(hud) hud.addEventListener("contextmenu",e=>e.preventDefault());
    // tabs
    document.querySelectorAll("#inv-tabs .tab").forEach(t=>t.addEventListener("click",()=>{ invTab=t.dataset.itab; renderInventory(); }));
    document.querySelectorAll("#chat-tabs .tab").forEach(t=>t.addEventListener("click",()=>{
      chatTab=t.dataset.ctab; document.querySelectorAll("#chat-tabs .tab").forEach(x=>x.classList.toggle("active",x===t)); renderChat();
    }));
    $("#dock-inv").addEventListener("click",UI.toggleInvPanel);
    $("#dock-chat").addEventListener("click",UI.toggleChatPanel);
    const qt=$("#quest-tracker"); if(qt) qt.addEventListener("click",()=>UI.toggleModal("quests"));
    const ci=$("#chat-input");
    ci.addEventListener("keydown",e=>{ if(e.code==="Enter"&&ci.value.trim()){ addLine("", `<span class="tag">[${P.name}]</span> ${ci.value.trim().replace(/[<>]/g,"")}`, "all"); ci.value=""; } });

    U.Events.on("inventory", ()=>{ renderInventory(); renderActionBar(); });
    U.Events.on("equipment", ()=>{ renderInventory(); renderVitals(); });
    U.Events.on("vitals", renderVitals);
    U.Events.on("selectslot", renderActionBar);
    U.Events.on("skillxp", d=>{ renderVitals(); if(invTab==="skills") renderInventory(); if(U.UI.modalIs&&U.UI.modalIs("skills")) U.UI.refreshSkillModal&&U.UI.refreshSkillModal(); });

    U.Events.on("activity", d=>{
      if(d.sys){ addLine("sys", d.text, "game"); return; }
      const sk = d.skill? U.Data.SKILL_BY_ID[d.skill].name : "";
      addLine("", `<span class="gain">${d.text}</span>${d.xp?` <span class="xp">+${d.xp} ${sk}${d.chainTxt||""}</span>`:""}`, "game");
    });
    U.Events.on("notice", d=> addLine("sys", d.text, "all"));
    U.Events.on("nudge", d=> addLine("", `<span class="xp">▸ ${d.text}</span>`, "game"));
    U.Events.on("levelup", d=>{
      toast(`<div class="big">${d.name} Level ${d.level}</div>${d.unlock?`<div class="unlock">Unlocked: ${d.unlock}</div>`:""}`, "level", 3200);
      addLine("", `<span class="gain">◆ ${d.name} advanced to level ${d.level}!</span>`, "game");
      if(U.Audio) U.Audio.levelup();
    });
    U.Events.on("worlddrop", d=>{}); // ground items: future phase

    // ----- quest feedback (WoW-style) -----
    function questFx(){ renderTracker(); if(U.World.updateQuestMarkers) U.World.updateQuestMarkers(); if(UI.refreshDialog) UI.refreshDialog(); if(UI.refreshQuestModal) UI.refreshQuestModal(); }
    U.Events.on("questaccept", d=>{ const q=U.Data.QUEST_BY_ID[d.id]; toast(`<div class="big">New Quest</div><div class="unlock">${q.name}</div>`,"level",2600); if(U.Audio) U.Audio.open(); questFx(); });
    U.Events.on("questupdate", questFx);
    U.Events.on("questready", d=>{ const q=U.Data.QUEST_BY_ID[d.id]; toast(`<div class="big">Objective Complete</div><div class="unlock">Return to ${npcNameById(q.turnIn)}</div>`,"level",2800); if(U.Audio) U.Audio.gain(); questFx(); });
    U.Events.on("questcomplete", d=>{ const q=U.Data.QUEST_BY_ID[d.id]; toast(`<div class="big">Quest Complete</div><div class="unlock">${q.name}</div>`,"level",3200); addLine("", `<span class="gain">◆ ${q.name} — complete.</span>`,"game"); if(U.Audio) U.Audio.levelup(); questFx(); });

    renderVitals(); renderInventory(); renderActionBar();
    renderTracker();
    addLine("sys", U.Constants.IDENTITY.welcome, "game");
    addLine("sys", "Right-click a tree, rock, or villager. Walk up close to act. Wheel zooms; Ctrl+wheel cycles the action bar.", "game");
  };

})();

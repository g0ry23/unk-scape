/* ============================================================================
   UNKSCAPE — audio.js  (procedural SFX; missing audio must never crash)
   ========================================================================== */
(function(){
  "use strict";
  const U = window.UnkScape;
  let ctx=null, enabled=true;
  function ac(){ if(!ctx){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ enabled=false; } } return ctx; }
  function blip(freq, dur, type, gain){
    if(!enabled) return; const c=ac(); if(!c) return;
    if(c.state==="suspended") c.resume();
    const o=c.createOscillator(), g=c.createGain();
    o.type=type||"triangle"; o.frequency.value=freq;
    g.gain.value=0.0001;
    o.connect(g); g.connect(c.destination);
    const t=c.currentTime;
    g.gain.exponentialRampToValueAtTime(gain||0.12, t+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t+(dur||0.12));
    o.start(t); o.stop(t+(dur||0.12)+0.02);
  }
  U.Audio = {
    setEnabled(b){ enabled=b; },
    swing(skill){
      if(skill==="mining") blip(180,0.10,"square",0.10);
      else if(skill==="woodcutting") blip(140,0.12,"sawtooth",0.09);
      else if(skill==="fishing") blip(420,0.08,"sine",0.06);
      else blip(220,0.09,"triangle",0.08);
    },
    gain(){ blip(660,0.07,"sine",0.07); setTimeout(()=>blip(880,0.06,"sine",0.06),60); },
    levelup(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>blip(f,0.18,"triangle",0.12),i*90)); },
    click(){ blip(330,0.04,"square",0.05); },
    open(){ blip(294,0.10,"sine",0.07); }
  };
})();

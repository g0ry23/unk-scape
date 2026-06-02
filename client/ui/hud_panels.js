(function(){
var US = window.UnkScape = window.UnkScape || {};

// hud_panels.js v8
// v8 changes:
// - Wheel spec enforced:
//     hover over #hud-actionbar  -> cycle action slots
//     Ctrl/Alt held anywhere     -> cycle action slots
//     plain wheel over game world -> zoom (passes through to input.js)
//     any other HUD panel (bag/skills/etc) -> swallowed, does NOTHING

function injectCSS(){
if (document.getElementById('unk-panels-css')) return;
var s = document.createElement('style');
s.id = 'unk-panels-css';
s.textContent = [
'#hud-inv.frame-collapsed{display:none!important}',
'#hud-sysread.frame-collapsed{display:none!important}',
'.unk-coltab{position:absolute;top:10px;z-index:50;cursor:pointer;border:1px solid #6b5530;background:linear-gradient(180deg,#1c160d,#0e0b06);color:#e8d4a4;font-weight:800;font-size:12px;padding:8px 7px;border-radius:9px;box-shadow:0 2px 8px rgba(0,0,0,.5);writing-mode:vertical-rl;letter-spacing:.12em;user-select:none;transition:.14s}',
'.unk-coltab:hover{background:rgba(247,198,91,.16);border-color:#caa047}',
'.unk-coltab.left{left:8px}',
'.unk-coltab.right{right:8px}',
'.unk-collapse-btn{cursor:pointer;border:1px solid #6b5530;background:rgba(247,198,91,.08);color:#e8d4a4;font-weight:800;font-size:11px;border-radius:7px;padding:2px 7px;line-height:1.4}',
'.unk-collapse-btn:hover{background:rgba(247,198,91,.18);border-color:#caa047}',
'.unk-collapse-row{display:flex;justify-content:flex-end;margin:0 0 6px}',
'#unk-hud .hi-equip-merged{flex-direction:column!important;gap:8px!important}',
'#unk-hud .hi-equip-merged .hi-equip-text{flex:0 0 auto!important}',
'#unk-hud .hi-equip-merged .hi-equip-text .hi-equip-list{flex-direction:column!important}',
'#unk-hud .hi-equip-merged .hi-equip-doll{flex:0 0 auto!important;justify-content:center!important}'
].join('');
(document.head||document.documentElement).appendChild(s);
}

US.HudPanels = {
_ready: false,
init: function(){
var hud = document.getElementById('unk-hud');
var L = document.getElementById('hud-col-left');
var R = document.getElementById('hud-col-right');
if (!hud || !L || !R) return false;
injectCSS();
if (!document.getElementById('unk-tab-left')){
var tl = document.createElement('div');
tl.id='unk-tab-left'; tl.className='unk-coltab left'; tl.textContent='HUB'; tl.style.display='none';
tl.onclick=function(){ US.HudPanels.toggleHub(); };
hud.appendChild(tl);
}
if (!document.getElementById('unk-tab-right')){
var tr = document.createElement('div');
tr.id='unk-tab-right'; tr.className='unk-coltab right'; tr.textContent='CHAT'; tr.style.display='none';
tr.onclick=function(){ US.HudPanels.toggleChat(); };
hud.appendChild(tr);
}
var invHeader = L.querySelector('#hud-inv .h-header');
if (invHeader && !invHeader.querySelector('.unk-collapse-btn')){
var bL=document.createElement('button');
bL.className='unk-collapse-btn'; bL.title='Collapse hub ([)'; bL.textContent='-'; bL.style.marginLeft='6px';
bL.onclick=function(ev){ev.stopPropagation();US.HudPanels.toggleHub();};
invHeader.appendChild(bL);
}
var radHeader = R.querySelector('#hud-radar .h-header');
if (radHeader && !radHeader.querySelector('.unk-collapse-btn')){
var bR=document.createElement('button');
bR.className='unk-collapse-btn'; bR.title='Collapse chat (])'; bR.textContent='-';
bR.onclick=function(ev){ev.stopPropagation();US.HudPanels.toggleChat();};
radHeader.appendChild(bR);
}
this._ready=true;
return true;
},
toggleHub: function(){
var el=document.getElementById('hud-inv'), tab=document.getElementById('unk-tab-left');
if(!el)return;
var collapsed=el.classList.toggle('frame-collapsed');
if(tab)tab.style.display=collapsed?'block':'none';
},
toggleChat: function(){
var el=document.getElementById('hud-sysread'), tab=document.getElementById('unk-tab-right');
if(!el)return;
var collapsed=el.classList.toggle('frame-collapsed');
if(tab)tab.style.display=collapsed?'block':'none';
}
};

var _tries=0;
var _iv=setInterval(function(){
if (US.HudPanels.init() || ++_tries>120) clearInterval(_iv);
},500);

// ── Wheel logic (exact spec) ──────────────────────────────────────────────────
//   • Over the action bar (hover)             -> cycle action slots
//   • Ctrl/Alt held (cursor anywhere)         -> cycle action slots
//   • Plain wheel over the game world         -> zoom (handled by input.js)
//   • Over any other HUD panel (bag/skills…)  -> swallowed, does NOTHING
window.addEventListener('wheel', function(e){
var g = US.game;
var overActionbar = e.target && e.target.closest && e.target.closest('#hud-actionbar');
var modifier = e.ctrlKey || e.altKey;

if (g && g.state==='play' && g.hotbar && (overActionbar || modifier)){
var n = g.hotbar.slots ? g.hotbar.slots.length : 8;
var dir = e.deltaY>0 ? 1 : -1;
g.hotbar.selected = ((g.hotbar.selected||0)+dir+n)%n;
if (g.ui && g.ui.renderHotbar) g.ui.renderHotbar();
if (US.HUDSpec && US.HUDSpec.refresh) US.HUDSpec.refresh();
e.preventDefault(); e.stopPropagation();
return;
}

var overHud = e.target && e.target.closest && e.target.closest('#unk-hud');
if (overHud) { e.preventDefault(); e.stopPropagation(); }
}, { capture:true, passive:false });

// v4: [ = toggle hub, ] = toggle chat. Off B/C to avoid bank+crafting collisions.
window.addEventListener('keydown',function(e){
var g=US.game; if(!g||g.state!=='play') return;
var tag=(e.target&&e.target.tagName||'').toLowerCase();
if(tag==='input'||tag==='textarea') return;
var k=(e.key||'').toLowerCase();
if(k==='['){ US.HudPanels.toggleHub(); e.preventDefault(); }
else if(k===']'){ US.HudPanels.toggleChat(); e.preventDefault(); }
},false);

console.log('[UNKSCAPE] hud_panels v8 loaded — dock toggles; wheel: hover/Ctrl-Alt cycles bar, else zoom, bag never scrolls.');

})();

/**
 * UNK-SCAPE UI Dynamic Interface Panel Controller
 * Architecture Namespace: window.UnkScape.UI
 * Implementation Path: client/engine/ui.js
 *
 * UPDATE C: Live player variable binding
 * - Skills tab → reads D.game.player.skills[key].xp via D.levelForXp()
 * - Quests tab → reads D.game.systems.quests.active[id].progress live
 * - G.E. tab → BUY buttons deduct coin via D.game.systems.inventory
 * - refreshActiveTab() is called on a 1-second passive timer (not every
 *   frame) so it never blocks WASD input or canvas rendering
 *
 * UPDATE D: HUD state manager
 * - toggleHUDDisplay(isVisible) shows/hides #unkscape-hud-layer
 * - Called with false on menu/login state, true when game starts
 */
((U) => {
U.TabUI = {

currentTab: 'skills',
_refreshTimer: null,

/**
 * Boot: wire passive refresh timer + prime initial tab
 * HUD is hidden at boot — shown only after newGame/loadGame starts.
 */
init() {
this.toggleHUDDisplay(false); // hide HUD on login/world-select screen
this.refreshActiveTab();

// Passive refresh every 1 000 ms — completely decoupled from the
// 60 fps render loop so WASD / canvas performance is unaffected.
if (this._refreshTimer) clearInterval(this._refreshTimer);
this._refreshTimer = setInterval(() => this.refreshActiveTab(), 1000);

console.log('[UNK-SCAPE] UI panel controller wired into DOM. HUD hidden for login screen.');
},

/**
 * toggleHUDDisplay(isVisible)
 * Controls visibility of the entire #unkscape-hud-layer overlay.
 * Pass false → hide HUD (login screen, world select, menus).
 * Pass true  → show HUD (after newGame / loadGame enters 'play' state).
 */
toggleHUDDisplay(isVisible) {
const hud = document.getElementById('unkscape-hud-layer');
if (!hud) return;
hud.style.display = isVisible ? '' : 'none';
// Also sync visibility state so any queued refresh skips DOM work
this._hudVisible = !!isVisible;
},

/**
 * Switches the active HUD tab and immediately refreshes content
 */
switchTab(tabId) {
this.currentTab = tabId;
this.refreshActiveTab();
},

// ── Internal helpers ──────────────────────────────────────────────────

/**
 * Safe accessor — returns the live Duskfall game instance or null
 */
_game() {
const D = window.UnkScape;
return (D && D.game && D.game.player) ? D.game : null;
},

/**
 * Returns the live skill level for a given skill key, or 1 as fallback
 */
_skillLevel(skillKey) {
const g = this._game();
if (!g) return 1;
const D = window.UnkScape;
const skillData = g.player.skills[skillKey];
if (!skillData) return 1;
// Use the engine's live D.levelForXp() — same function combat/gather use
return D.levelForXp(skillData.xp || 0);
},

/**
 * Returns the current player gold coin count, or 0 as fallback
 */
_coins() {
const g = this._game();
return g ? g.systems.inventory.count('coin') : 0;
},

// ── Tab renderers ─────────────────────────────────────────────────────

/**
 * Skills tab — reads live XP from player.skills[key] via D.levelForXp()
 */
_renderSkills() {
const D = window.UnkScape;
const g = this._game();

// Full skill roster pulled directly from D.SKILLS config
const allSkills = (D && D.SKILLS) ? Object.keys(D.SKILLS) : [];

// Color palette mapping skill type → accent colour
const colorMap = {
combat: '#e74c3c',
woodcutting: '#2ecc71',
mining: '#b8c0d8',
cooking: '#ffcf6e',
crafting: '#6aa7ff',
foraging: '#b98cff',
survival: '#ff9b5c'
};

const cards = allSkills.map(key => {
const def = (D && D.SKILLS[key]) || {};
const lvl = this._skillLevel(key);
const xp = g ? (g.player.skills[key]?.xp || 0) : 0;
const next = (D && D.xpForLevel) ? D.xpForLevel(lvl + 1) : 0;
const cur = (D && D.xpForLevel) ? D.xpForLevel(lvl) : 0;
const pct = next > cur ? Math.floor(((xp - cur) / (next - cur)) * 100) : 100;
const col = colorMap[key] || '#94a3b8';
const icon = def.icon || '🔹';
const name = def.name || key;

return '<div style="background:#1a1526; padding:8px; border:1px solid #47385a; border-radius:3px;">'
+ '<span style="font-size:15px;">'+icon+'</span> <strong style="font-size:12px;">'+name+'</strong><br>'
+ '<span style="color:'+col+'; font-size:12px; margin-left:20px;">Lv. '+String(lvl).padStart(2,'0')+'</span>'
+ '<div style="margin:4px 0 0 20px; background:#0d0a17; border-radius:2px; height:4px; width:80px;">'
+ '<div style="background:'+col+'; width:'+pct+'%; height:4px; border-radius:2px; transition:width 0.4s;"></div>'
+ '</div></div>';
}).join('');

const total = allSkills.reduce((sum, k) => sum + this._skillLevel(k), 0);

return '<h3 style="color:#f1c40f; margin-top:0; font-size:14px; letter-spacing:1px;">SURVIVAL ATTRIBUTES</h3>'
+ '<div style="font-size:11px; color:#94a3b8; margin-bottom:8px;">Total Level: <strong style="color:#f1c40f;">'+total+'</strong>'+(g ? '' : ' <em style="color:#ff5c7a">(start a game to see live data)</em>')+'</div>'
+ '<hr style="border:0; border-top:1px solid #47385a; margin-bottom:12px;">'
+ '<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; text-align:left;">'
+ cards
+ '</div>';
},

/**
 * Quests tab — reads live progress from game.systems.quests.active
 */
_renderQuests() {
const D = window.UnkScape;
const g = this._game();
const QS = (D && D.QUESTS) ? D.QUESTS : {};

if (!g) {
return '<h3 style="color:#f1c40f; margin-top:0; font-size:14px;">ACTIVE QUEST LOGS</h3>'
+ '<hr style="border:0; border-top:1px solid #47385a; margin-bottom:12px;">'
+ '<div style="color:#94a3b8; font-size:12px; font-style:italic;">Start a game to track quest progress.</div>';
}

const qs = g.systems.quests;

// Active quests
const activeIds = Object.keys(qs.active || {});
const completedIds = Object.keys(qs.completed || {});

const activeCards = activeIds.map(qid => {
const def = QS[qid] || {};
const st = qs.active[qid] || { progress: {} };
const steps = (def.steps || []).map((step, i) => {
const got = st.progress[i] || 0;
const target = step.qty || 1;
const done = got >= target;
const bar = Math.min(100, Math.floor((got / target) * 100));
return '<div style="margin-top:5px;">'
+ '<span style="color:'+(done ? '#2ecc71' : '#94a3b8')+'; font-size:11px;">'+(done ? '✅' : '◻')+' '+step.text+' ('+Math.min(got,target)+'/'+target+')</span>'
+ '<div style="background:#0d0a17; border-radius:2px; height:3px; margin-top:2px; width:100%;">'
+ '<div style="background:'+(done ? '#2ecc71' : '#f1c40f')+'; width:'+bar+'%; height:3px; border-radius:2px; transition:width 0.4s;"></div>'
+ '</div></div>';
}).join('');

return '<div style="background:#1a1526; padding:10px; border-left:3px solid #f1c40f; margin-bottom:8px; border-radius:0 3px 3px 0;">'
+ '<strong style="color:#fff; font-size:12px;">'+(def.icon || '📜')+' '+(def.name || qid)+'</strong>'
+ '<div style="color:#94a3b8; font-size:11px; margin-top:2px;">'+(def.desc || '')+'</div>'
+ steps
+ '</div>';
}).join('');

const completedBadges = completedIds.map(qid => {
const def = QS[qid] || {};
return '<div style="background:#0f1c12; padding:7px 10px; border-left:3px solid #2ecc71; margin-bottom:6px; border-radius:0 3px 3px 0; font-size:11px; color:#2ecc71;">'
+ '✅ '+(def.icon || '')+' '+(def.name || qid)
+ '</div>';
}).join('');

const noActive = activeIds.length === 0
? '<div style="color:#94a3b8; font-size:12px; font-style:italic; margin-bottom:8px;">No active quests right now.</div>'
: '';

return '<h3 style="color:#f1c40f; margin-top:0; font-size:14px; letter-spacing:1px;">ACTIVE QUEST LOGS</h3>'
+ '<hr style="border:0; border-top:1px solid #47385a; margin-bottom:12px;">'
+ noActive + activeCards
+ (completedIds.length ? '<div style="color:#64748b; font-size:11px; margin-top:8px; margin-bottom:4px;">COMPLETED</div>' + completedBadges : '');
},

/**
 * G.E. tab — BUY wires into inventory.remove('coin') + inventory.add(item)
 */
_renderGE() {
const D = window.UnkScape;
const g = this._game();

window._unkGEBuy = (itemId, price, lbl) => {
const game = this._game();
if (!game) { alert('Start a game first!'); return; }
const inv = game.systems.inventory;
const coins = inv.count('coin');
if (coins < price) {
game.ui.toast('Not enough gold', 'You need '+price+' GP but only have '+coins+' GP.', 'bad');
return;
}
inv.remove('coin', price);
inv.add(itemId, 1);
game.ui.toast('Purchased!', lbl+' bought for '+price+' GP.', 'good');
game.ui.log('Grand Exchange: bought '+lbl+' for '+price+' GP.', 'gold');
this.refreshActiveTab();
};

const coins = this._coins();

const catalogue = [
{ id: 'stone_hatchet', label: '🪓 Stone Hatchet', price: 55 },
{ id: 'iron_pickaxe', label: '⛏️ Iron Pickaxe', price: 155 },
{ id: 'crude_sword', label: '⚔️ Crude Sword', price: 75 },
{ id: 'iron_sword', label: '🗡️ Iron Sword', price: 265 },
{ id: 'hide_armor', label: '🛡️ Hide Armor', price: 130 },
{ id: 'health_salve', label: '💊 Health Salve', price: 35 },
{ id: 'torch', label: '🔦 Torch', price: 12 },
{ id: 'campfire', label: '🔥 Campfire', price: 30 },
{ id: 'iron_ore', label: '⛏️ Iron Ore x1', price: 22 },
{ id: 'log', label: '🪵 Oak Log x1', price: 4 },
];

const rows = catalogue.map(item => {
      const canAfford = coins >= item.price;
      const btnStyle = canAfford
        ? 'background:#27ae60; border:none; color:#fff; font-family:inherit; font-size:10px; padding:4px 8px; border-radius:2px; cursor:pointer;'
        : 'background:#4a4060; border:none; color:#888; font-family:inherit; font-size:10px; padding:4px 8px; border-radius:2px; cursor:not-allowed;';
      const onclickFn = "window._unkGEBuy('" + item.id + "', " + item.price + ", '" + item.label.replace(/'/g,'') + "')";
      return '<div style="background:#120e1a; padding:8px; border:1px solid #332742; border-radius:4px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">'
        + '<div style="flex:1;">'+item.label+'<br><span style="color:#eab308; font-size:11px;">Price: '+item.price+' GP</span></div>'
        + '<button style="'+btnStyle+'" onclick="'+onclickFn+'">'+( canAfford ? 'BUY' : 'NO GP')+'</button></div>';
    }).join('');

return '<h3 style="color:#f1c40f; margin-top:0; font-size:14px; letter-spacing:1px;">GRAND EXCHANGE</h3>'
+ '<hr style="border:0; border-top:1px solid #47385a; margin-bottom:8px;">'
+ '<div style="font-size:11px; color:#94a3b8; margin-bottom:10px;">Your gold: <strong style="color:#eab308;">'+coins+' GP</strong>'+(g ? '' : ' <em style="color:#ff5c7a">(start a game)</em>')+'</div>'
+ rows;
},

// ── Main dispatcher ───────────────────────────────────────────────────

/**
 * Re-renders the active tab with live data.
 * Skipped if HUD is currently hidden to avoid wasted DOM work.
 */
refreshActiveTab() {
if (this._hudVisible === false) return; // HUD hidden — skip render
const container = document.getElementById('tab-content-viewport');
if (!container) return;

let html = '';
switch (this.currentTab) {
case 'skills': html = this._renderSkills(); break;
case 'quests': html = this._renderQuests(); break;
case 'ge': html = this._renderGE(); break;
default: html = '';
}

container.innerHTML = html;
}
};

})(window.UnkScape = window.UnkScape || {});

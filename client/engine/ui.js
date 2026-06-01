/**
 * UNK-SCAPE UI Dynamic Interface Panel Controller
 * Architecture Namespace: window.UnkScape.UI
 * Implementation Path: client/engine/ui.js v2
 *
 * v2 changes:
 * - Skills tab: 3-column compact grid, no scroll, all 15 skills visible
 * - Full colorMap for all 15 canonical skills
 * - Quests + G.E. tabs unchanged
 */
((U) => {
U.TabUI = {

  currentTab: 'skills',
  _refreshTimer: null,

  init() {
    this.toggleHUDDisplay(false);
    this.refreshActiveTab();
    if (this._refreshTimer) clearInterval(this._refreshTimer);
    this._refreshTimer = setInterval(() => this.refreshActiveTab(), 1000);
    console.log('[UNK-SCAPE] UI panel controller v2 wired. HUD hidden for login screen.');
  },

  toggleHUDDisplay(isVisible) {
    const hud = document.getElementById('unkscape-hud-layer');
    if (!hud) return;
    hud.style.display = isVisible ? '' : 'none';
    this._hudVisible = !!isVisible;
  },

  switchTab(tabId) {
    this.currentTab = tabId;
    this.refreshActiveTab();
  },

  _game() {
    const D = window.UnkScape;
    return (D && D.game && D.game.player) ? D.game : null;
  },

  _skillLevel(skillKey) {
    const g = this._game();
    if (!g) return 1;
    const D = window.UnkScape;
    const skillData = g.player.skills[skillKey];
    if (!skillData) return 1;
    return D.levelForXp(skillData.xp || 0);
  },

  _coins() {
    const g = this._game();
    return g ? g.systems.inventory.count('coin') : 0;
  },

  // ── Skills tab — 3-col compact, no scroll ─────────────────────────
  _renderSkills() {
    const D = window.UnkScape;
    const g = this._game();
    const allSkills = (D && D.SKILLS) ? Object.keys(D.SKILLS) : [];

    // Full 15-skill color palette
    const colorMap = {
      combat:                   '#e74c3c',
      woodcutting:              '#2ecc71',
      mining:                   '#95a5a6',
      fishing:                  '#3498db',
      herbalism:                '#27ae60',
      hunting:                  '#e67e22',
      farming:                  '#f1c40f',
      smithing:                 '#e59866',
      cooking:                  '#ffcf6e',
      alchemy:                  '#8e44ad',
      crafting:                 '#6aa7ff',
      survival:                 '#ff9b5c',
      building_claim_crafting:  '#cd6155',
      trading_merchanting:      '#f7dc6f',
      extraction:               '#1abc9c'
    };

    const cards = allSkills.map(key => {
      const def = (D && D.SKILLS[key]) || {};
      const lvl = this._skillLevel(key);
      const xp = g ? (g.player.skills[key]?.xp || 0) : 0;
      const next = (D && D.xpForLevel) ? D.xpForLevel(lvl + 1) : 100;
      const cur  = (D && D.xpForLevel) ? D.xpForLevel(lvl)     : 0;
      const pct  = next > cur ? Math.floor(((xp - cur) / (next - cur)) * 100) : 100;
      const col  = colorMap[key] || '#94a3b8';
      const icon = def.icon || '🔹';
      const name = def.name || key;

      return '<div style="'
        + 'background:#16111f;overflow:hidden;min-width:0;'
        + 'padding:3px 4px;'
        + 'border:1px solid #2e2440;'
        + 'border-radius:4px;'
        + 'display:flex; flex-direction:column; gap:2px;'
        + '">'
        + '<div style="display:flex; align-items:center; gap:4px;">'
        + '<span style="font-size:13px; line-height:1;">' + icon + '</span>'
        + '<span style="color:#d4d0e8; font-size:10px; font-weight:bold; letter-spacing:0.3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + name + '</span>'
        + '</div>'
        + '<div style="color:' + col + '; font-size:10px; margin-left:1px; font-weight:bold;">Lv. ' + String(lvl).padStart(2,'0') + '</div>'
        + '<div style="background:#0d0a17; border-radius:2px; height:3px; width:100%;">'
        + '<div style="background:' + col + '; width:' + pct + '%; height:3px; border-radius:2px; transition:width 0.4s;"></div>'
        + '</div>'
        + '</div>';
    }).join('');

    const total = allSkills.reduce((sum, k) => sum + this._skillLevel(k), 0);

    return '<div style="font-size:11px; color:#94a3b8; margin-bottom:6px;">'
      + '<span style="color:#f1c40f; font-weight:bold; font-size:12px; letter-spacing:1px;">SURVIVAL ATTRIBUTES</span>'
      + '<span style="float:right;">Total Level: <strong style="color:#f1c40f;">' + total + '</strong></span>'
      + '</div>'
      + '<div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:3px; overflow:hidden;">'
      + cards
      + '</div>';
  },

  // ── Quests tab ────────────────────────────────────────────────────
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
          + '<span style="color:' + (done ? '#2ecc71' : '#94a3b8') + '; font-size:11px;">' + (done ? '✅' : '◻') + ' ' + step.text + ' (' + Math.min(got,target) + '/' + target + ')</span>'
          + '<div style="background:#0d0a17; border-radius:2px; height:3px; margin-top:2px; width:100%;">'
          + '<div style="background:' + (done ? '#2ecc71' : '#f1c40f') + '; width:' + bar + '%; height:3px; border-radius:2px; transition:width 0.4s;"></div>'
          + '</div></div>';
      }).join('');

      return '<div style="background:#1a1526; padding:10px; border-left:3px solid #f1c40f; margin-bottom:8px; border-radius:0 3px 3px 0;">'
        + '<strong style="color:#fff; font-size:12px;">' + (def.icon || '📜') + ' ' + (def.name || qid) + '</strong>'
        + '<div style="color:#94a3b8; font-size:11px; margin-top:2px;">' + (def.desc || '') + '</div>'
        + steps
        + '</div>';
    }).join('');

    const completedBadges = completedIds.map(qid => {
      const def = QS[qid] || {};
      return '<div style="background:#0f1c12; padding:7px 10px; border-left:3px solid #2ecc71; margin-bottom:6px; border-radius:0 3px 3px 0; font-size:11px; color:#2ecc71;">'
        + '✅ ' + (def.icon || '') + ' ' + (def.name || qid)
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

  // ── G.E. tab ──────────────────────────────────────────────────────
  _renderGE() {
    const D = window.UnkScape;
    const g = this._game();

    window._unkGEBuy = (itemId, price, lbl) => {
      const game = this._game();
      if (!game) { alert('Start a game first!'); return; }
      const inv = game.systems.inventory;
      const coins = inv.count('coin');
      if (coins < price) {
        game.ui.toast('Not enough gold', 'You need ' + price + ' GP but only have ' + coins + ' GP.', 'bad');
        return;
      }
      inv.remove('coin', price);
      inv.add(itemId, 1);
      game.ui.toast('Purchased!', lbl + ' bought for ' + price + ' GP.', 'good');
      game.ui.log('Grand Exchange: bought ' + lbl + ' for ' + price + ' GP.', 'gold');
      this.refreshActiveTab();
    };

    const coins = this._coins();
    const catalogue = [
      { id: 'stone_hatchet',  label: '🪓 Stone Hatchet',  price: 55  },
      { id: 'iron_pickaxe',   label: '⛏️ Iron Pickaxe',   price: 155 },
      { id: 'crude_sword',    label: '⚔️ Crude Sword',    price: 75  },
      { id: 'iron_sword',     label: '🗡️ Iron Sword',     price: 265 },
      { id: 'hide_armor',     label: '🛡️ Hide Armor',     price: 130 },
      { id: 'health_salve',   label: '💊 Health Salve',   price: 35  },
      { id: 'torch',          label: '🔦 Torch',           price: 12  },
      { id: 'campfire',       label: '🔥 Campfire',        price: 30  },
      { id: 'iron_ore',       label: '⛏️ Iron Ore x1',    price: 22  },
      { id: 'log',            label: '🪵 Oak Log x1',     price: 4   },
    ];

    const rows = catalogue.map(item => {
      const canAfford = coins >= item.price;
      const btnStyle = canAfford
        ? 'background:#27ae60; border:none; color:#fff; font-family:inherit; font-size:10px; padding:4px 8px; border-radius:2px; cursor:pointer;'
        : 'background:#4a4060; border:none; color:#888; font-family:inherit; font-size:10px; padding:4px 8px; border-radius:2px; cursor:not-allowed;';
      const onclickFn = "window._unkGEBuy('" + item.id + "', " + item.price + ", '" + item.label.replace(/'/g,'') + "')";
      return '<div style="background:#120e1a; padding:8px; border:1px solid #332742; border-radius:4px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">'
        + '<div style="flex:1;">' + item.label + '<br><span style="color:#eab308; font-size:11px;">Price: ' + item.price + ' GP</span></div>'
        + '<button style="' + btnStyle + '" onclick="' + onclickFn + '">' + (canAfford ? 'BUY' : 'NO GP') + '</button></div>';
    }).join('');

    return '<h3 style="color:#f1c40f; margin-top:0; font-size:14px; letter-spacing:1px;">GRAND EXCHANGE</h3>'
      + '<hr style="border:0; border-top:1px solid #47385a; margin-bottom:8px;">'
      + '<div style="font-size:11px; color:#94a3b8; margin-bottom:10px;">Your gold: <strong style="color:#eab308;">' + coins + ' GP</strong>' + (g ? '' : ' <em style="color:#ff5c7a">(start a game)</em>') + '</div>'
      + rows;
  },

  refreshActiveTab() {
    if (this._hudVisible === false) return;
    const container = document.getElementById('tab-content-viewport');
    if (!container) return;
    let html = '';
    switch (this.currentTab) {
      case 'skills': html = this._renderSkills(); break;
      case 'quests': html = this._renderQuests(); break;
      case 'ge':     html = this._renderGE();     break;
      default:       html = '';
    }
    container.innerHTML = html;
  }
};

})(window.UnkScape = window.UnkScape || {});

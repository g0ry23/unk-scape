// ============================================================
// UNK-SCAPE: HUD & CUSTOM MENU INTERFACE OVERLAYS
// File: client/engine/ui_overlay.js
// Version: v0.4.7 (Modular UI Core)
// ============================================================
// Exposes on window.UnkScape (D):
//   US.UIState            - shared UI flag + faction color dict
//   US.RenderPlayerHUD()  - top-left floating HP/MP status board
//   US.RenderStatsWindow()- centered character attributes window
//   US.toggleStatsWindow()- toggle stats window on/off
// Called from game.js render frame after US.render(this) if desired,
// or directly from UnkScape.Engine.Renderer.renderFrame().
// ============================================================

((D) => {
const US = D;
  console.log('[UNK-SCAPE] HUD & Interface Layer v0.4.7 loading...');

  // ── UI State Configuration ──
  US.UIState = US.UIState || {
    showStatsWindow: false,  // false by default: toggled open by keybind/button
    factionColors: {
      blood_oath: '#c0392b',  // Crimson Red
      iron_crown: '#2980b9'   // Cobalt Blue
    }
  };

  // ── Helper: draw a rounded rect path (safe fallback for older browsers) ──
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /**
   * Renders Top-Left Floating Player Status HUD.
   * Call each frame OUTSIDE g.camera.apply(ctx) - screen-space coords.
   *   US.RenderPlayerHUD(g.ctx, g.player);
   */
  US.RenderPlayerHUD = function(ctx, player) {
    if (!ctx || !player) return;
    ctx.save();

    // ── Background Board ──
    roundRect(ctx, 15, 15, 290, 90, 6);
    ctx.fillStyle   = 'rgba(18,14,26,0.92)';
    ctx.fill();
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth   = 2;
    ctx.stroke();

    // ── Name & Faction Text ──
    const lvl  = player.level || 1;
    const name = (player.characterName || player.name || 'Hero').toUpperCase();
    ctx.font         = 'bold 14px monospace';
    ctx.fillStyle    = '#ffffff';
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(name + ' (LVL ' + lvl + ')', 30, 40);

    const factionKey   = player.factionId || player.faction || '';
    const factionColor = (US.UIState.factionColors && US.UIState.factionColors[factionKey]) || '#bdc3c7';
    const factionLabel = factionKey === 'blood_oath' ? 'Blood-Oath Clans'
                       : factionKey === 'iron_crown'  ? 'Iron-Crown Accord'
                       : (player.factionName || 'Wanderer');
    ctx.fillStyle = factionColor;
    ctx.font      = '11px monospace';
    ctx.fillText(factionLabel, 30, 58);

    // ── Health Bar ──
    const hpMax = player.hpMax || player.maxHp || 100;
    const hpPct = Math.max(0, Math.min(1, (player.hp || 0) / hpMax));
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(150, 25, 140, 13);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(150, 25, Math.floor(140 * hpPct), 13);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth   = 1;
    ctx.strokeRect(150, 25, 140, 13);
    ctx.font      = '9px monospace';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('HP ' + Math.ceil(player.hp || 0) + ' / ' + hpMax, 220, 35);

    // ── Mana Bar ──
    const mpMax = player.mpMax || player.maxMp || 50;
    const mpPct = Math.max(0, Math.min(1, (player.mp || 0) / mpMax));
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(150, 45, 140, 13);
    ctx.fillStyle = '#2980b9';
    ctx.fillRect(150, 45, Math.floor(140 * mpPct), 13);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth   = 1;
    ctx.strokeRect(150, 45, 140, 13);
    ctx.font      = '9px monospace';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('MP ' + Math.ceil(player.mp || 0) + ' / ' + mpMax, 220, 55);

    // ── Zone strip ──
    if (player.zoneName) {
      ctx.font      = '10px monospace';
      ctx.fillStyle = 'rgba(255,207,110,0.72)';
      ctx.textAlign = 'left';
      ctx.fillText('▶ ' + player.zoneName, 30, 96);
    }

    ctx.restore();
  };

  /**
   * Renders Centered Character Statistics Window.
   * Toggle with US.UIState.showStatsWindow or US.toggleStatsWindow().
   *   US.RenderStatsWindow(g.ctx, g.viewW, g.viewH, g.player);
   */
  US.RenderStatsWindow = function(ctx, canvasWidth, canvasHeight, player) {
    if (!ctx || !US.UIState.showStatsWindow || !player) return;

    const W = 340, H = 310;
    const wx = Math.floor((canvasWidth  / 2) - (W / 2));
    const wy = Math.floor((canvasHeight / 2) - (H / 2));

    ctx.save();

    // ── Window body ──
    const factionKey  = player.factionId || player.faction || '';
    const borderColor = (US.UIState.factionColors && US.UIState.factionColors[factionKey]) || '#7f8c8d';
    roundRect(ctx, wx, wy, W, H, 8);
    ctx.fillStyle   = '#2c3e50';
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth   = 3;
    ctx.stroke();

    // ── Header Ribbon ──
    ctx.fillStyle = 'rgba(0,0,0,0.40)';
    ctx.fillRect(wx, wy, W, 36);
    ctx.font         = 'bold 13px monospace';
    ctx.fillStyle    = '#ecf0f1';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CHARACTER ATTRIBUTES & SKILLS', wx + W / 2, wy + 18);
    ctx.font      = '10px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.30)';
    ctx.textAlign = 'right';
    ctx.fillText('[P] close', wx + W - 10, wy + 18);

    // ── Stat Lines ──
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font         = '12px monospace';
    let sy   = wy + 60;
    const sp = 22;
    const cx = wx + 30;
    const stats = player.stats  || {};
    const skl   = player.skills || {};

    ctx.fillStyle = '#bdc3c7';
    ctx.fillText('Class:   ' + (player.charClass || player.classId || 'Wanderer'), cx, sy); sy += sp;
    ctx.fillText('Race:    ' + (player.raceId    || player.race    || 'Human'),    cx, sy); sy += sp * 1.4;

    ctx.fillStyle = '#ecf0f1';
    ctx.font      = 'bold 12px monospace';
    ctx.fillText('— Attributes —', cx, sy); sy += sp;

    ctx.font      = '12px monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText('STRENGTH:      ' + (stats.strength     || 10), cx, sy); sy += sp;
    ctx.fillText('AGILITY:       ' + (stats.agility      || 10), cx, sy); sy += sp;
    ctx.fillText('INTELLIGENCE:  ' + (stats.intelligence || 10), cx, sy); sy += sp;
    ctx.fillText('ARMOR RATING:  ' + (stats.armor        ||  5), cx, sy); sy += sp * 1.4;

    ctx.fillStyle = '#ecf0f1';
    ctx.font      = 'bold 12px monospace';
    ctx.fillText('— Skills —', cx, sy); sy += sp;

    ctx.font      = '12px monospace';
    ctx.fillStyle = '#f7c65b';
    const skillKeys   = ['woodcutting','mining','combat','cooking','crafting','foraging','survival'];
    const skillLabels = {
      woodcutting: 'Woodcutting', mining:    'Mining',   combat:   'Combat',
      cooking:     'Cooking',    crafting:  'Crafting', foraging: 'Foraging',
      survival:    'Survival'
    };
    for (const k of skillKeys) {
      const sk = skl[k] || {};
      ctx.fillText(skillLabels[k] + ': Lv.' + (sk.level || 1) + '  (' + (sk.xp || 0) + ' xp)', cx, sy);
      sy += sp;
      if (sy > wy + H - 10) break;
    }

    ctx.restore();
  };

  /**
   * Toggle the stats window open/closed.
   * Wire into game.js keybind: if (key === 'p') US.toggleStatsWindow();
   */
  US.toggleStatsWindow = function() {
    US.UIState.showStatsWindow = !US.UIState.showStatsWindow;
  };

})(window.UnkScape = window.UnkScape || {});

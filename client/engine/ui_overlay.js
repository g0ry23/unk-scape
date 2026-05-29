// ============================================================
// UNK-SCAPE: HUD & CUSTOM MENU INTERFACE OVERLAYS
// File: client/engine/ui_overlay.js
// Version: v0.4.7 (Modular UI Core)
// ============================================================
// Exposes on window.Duskfall (D):
//   D.UIState               — shared UI flag + faction color dict
//   D.RenderPlayerHUD()     — top-left floating HP/MP status board
//   D.RenderStatsWindow()   — centered character attributes window
// Called from game.js render frame after D.render(this) if desired,
// or directly from UnkScape.Engine.Renderer.renderFrame().
// ============================================================

(function() {
  const D = window.Duskfall = window.Duskfall || {};

  console.log('[UNK-SCAPE] HUD & Interface Layer v0.4.7 loading...');

  // ── UI State Configuration ──
  D.UIState = D.UIState || {
    showStatsWindow: false,  // false by default: toggled open by keybind/button
    factionColors: {
      blood_oath: '#c0392b',  // Crimson Red
      iron_crown: '#2980b9'   // Cobalt Blue
    }
  };

  // ── Helper: draw a rounded rect path (safe fallback for older browsers) ──
  function _roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
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

  // ── Helper: draw a labeled resource bar (HP / MP / Stamina) ──
  function _drawBar(ctx, x, y, w, h, pct, fillColor, label) {
    // Background track
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    _roundRect(ctx, x, y, w, h, 3); ctx.fill();
    // Fill
    const fillW = Math.max(0, Math.min(w, w * pct));
    if (fillW > 0) {
      ctx.fillStyle = fillColor;
      _roundRect(ctx, x, y, fillW, h, 3); ctx.fill();
    }
    // Border
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    _roundRect(ctx, x, y, w, h, 3); ctx.stroke();
    // Label inside bar
    if (label) {
      ctx.font = '700 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,0.82)';
      ctx.fillText(label, x + w / 2, y + h / 2 + 0.5);
    }
  }

  // ============================================================
  // D.RenderPlayerHUD
  // Top-left floating player status board: name, faction, HP/MP bars.
  // ctx   — the 2D canvas context (screen-space, NOT inside camera.apply)
  // player — D.game.player object
  // ============================================================
  D.RenderPlayerHUD = function(ctx, player) {
    if (!ctx || !player) return;
    ctx.save();

    const bx = 15, by = 15, bw = 290, bh = 90;
    const factionColor = D.UIState.factionColors[player.faction] || '#bdc3c7';
    const level = player.level || 1;
    const name  = (player.characterName || player.name || 'Unknown').toUpperCase();

    // ── Background board ──
    ctx.fillStyle   = 'rgba(12,10,22,0.88)';
    ctx.strokeStyle = factionColor;
    ctx.lineWidth   = 2;
    _roundRect(ctx, bx, by, bw, bh, 8);
    ctx.fill();
    _roundRect(ctx, bx, by, bw, bh, 8);
    ctx.stroke();

    // Faction accent top strip
    ctx.fillStyle = factionColor;
    ctx.globalAlpha = 0.18;
    _roundRect(ctx, bx, by, bw, 28, 8);
    ctx.fill();
    ctx.globalAlpha = 1;

    // ── Name + Level ──
    ctx.font      = 'bold 13px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(name + '  (LVL ' + level + ')', bx + 14, by + 17);

    // ── Faction label ──
    ctx.fillStyle = factionColor;
    ctx.font      = '10px monospace';
    const factionLabel = player.faction === 'blood_oath'
      ? 'Blood-Oath Clans'
      : player.faction === 'iron_crown'
        ? 'Iron-Crown Accord'
        : (player.factionName || 'No Faction');
    ctx.fillText(factionLabel, bx + 14, by + 34);

    // ── HP bar ──
    const hpPct = player.hpMax > 0 ? Math.max(0, Math.min(1, player.hp / player.hpMax)) : 0;
    const mpPct = player.mpMax > 0 ? Math.max(0, Math.min(1, player.mp / player.mpMax)) : 0;
    const hpLabel = Math.round(player.hp || 0) + ' / ' + Math.round(player.hpMax || 0) + ' HP';
    const mpLabel = Math.round(player.mp || 0) + ' / ' + Math.round(player.mpMax || 0) + ' MP';

    _drawBar(ctx, bx + 14, by + 47, 262, 13, hpPct, '#c0392b', hpLabel);
    _drawBar(ctx, bx + 14, by + 65, 262, 13, mpPct, '#2980b9', mpLabel);

    ctx.restore();
  };

  // ============================================================
  // D.RenderStatsWindow
  // Centered character attributes panel. Toggled via D.UIState.showStatsWindow.
  // ctx         — screen-space 2D context
  // canvasWidth / canvasHeight — viewport dimensions
  // player      — D.game.player object
  // ============================================================
  D.RenderStatsWindow = function(ctx, canvasWidth, canvasHeight, player) {
    if (!ctx || !D.UIState.showStatsWindow || !player) return;
    ctx.save();

    const w = 340, h = 290;
    const x = Math.round((canvasWidth  / 2) - (w / 2));
    const y = Math.round((canvasHeight / 2) - (h / 2));
    const factionColor = D.UIState.factionColors[player.faction] || '#7f8c8d';

    // ── Window body ──
    ctx.fillStyle   = 'rgba(18,14,28,0.96)';
    ctx.strokeStyle = factionColor;
    ctx.lineWidth   = 3;
    _roundRect(ctx, x, y, w, h, 10);
    ctx.fill();
    _roundRect(ctx, x, y, w, h, 10);
    ctx.stroke();

    // ── Header ribbon ──
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    _roundRect(ctx, x, y, w, 36, 10);
    ctx.fill();
    ctx.font         = 'bold 12px monospace';
    ctx.fillStyle    = '#ecf0f1';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CHARACTER ATTRIBUTES & SKILLS', x + w / 2, y + 19);

    // ── Close hint ──
    ctx.font      = '10px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.textAlign = 'right';
    ctx.fillText('[P] Close', x + w - 12, y + 19);

    // ── Identity section ──
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font         = '12px monospace';
    ctx.fillStyle    = '#bdc3c7';
    let sy = y + 60;
    const sp = 22;
    const col = x + 28;

    const charClass = player.charClass || player.classId  || 'Wanderer';
    const race      = player.race      || player.raceId   || 'Human';

    ctx.fillText('Class:  ' + charClass, col, sy); sy += sp;
    ctx.fillText('Race:   ' + race,      col, sy); sy += sp * 1.4;

    // ── Divider line ──
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(x + 14, sy - 8);
    ctx.lineTo(x + w - 14, sy - 8);
    ctx.stroke();

    // ── Core stats ──
    const st = player.stats || {};
    const skills = player.skills || {};

    const rows = [
      ['STRENGTH',      st.strength     || 10,  '#e74c3c'],
      ['AGILITY',       st.agility      || 10,  '#f39c12'],
      ['INTELLIGENCE',  st.intelligence || 10,  '#9b59b6'],
      ['ARMOR RATING',  st.armor        || 5,   '#7f8c8d'],
      ['WOODCUTTING',   (skills.woodcutting  && skills.woodcutting.level)  || 1, '#27ae60'],
      ['MINING',        (skills.mining       && skills.mining.level)       || 1, '#95a5a6'],
    ];

    ctx.font = '12px monospace';
    for (const [label, val, color] of rows) {
      // Label
      ctx.fillStyle = '#bdc3c7';
      ctx.textAlign = 'left';
      ctx.fillText(label + ':', col, sy);
      // Value (right-aligned, colored)
      ctx.fillStyle = color;
      ctx.textAlign = 'right';
      ctx.fillText(String(Math.round(val)), x + w - 28, sy);
      sy += sp;
    }

    ctx.restore();
  };

  console.log('[UNK-SCAPE] D.RenderPlayerHUD + D.RenderStatsWindow registered on window.Duskfall.');

})();

// client/engine/environment.js
// UnkScape.Engine.Environment — Day/Night Apocalypse Cycle State Manager
// 20-minute rolling world clock: 12 min Day + 8 min Night
((U) => {
  U.Engine = U.Engine || {};

  // ── Environment clock constants ──
  const CYCLE_DURATION   = 20 * 60;   // 1200 real seconds per full cycle
  const DAY_DURATION     = 12 * 60;   // 720s  (0–720)
  const NIGHT_START      = DAY_DURATION;   // 720s threshold

  let _elapsed   = 0;          // seconds into current cycle
  let _isNight   = false;      // public flag
  let _wasNight  = false;      // edge-detection
  let _gameRef   = null;       // reference to US.game injected at boot
  let _ticking   = false;

  U.Engine.Environment = {

    // ── Public readable state ──
    get isNight()       { return _isNight; },
    get cycleElapsed()  { return _elapsed; },
    get dayFraction()   { return Math.min(_elapsed / DAY_DURATION, 1); },
    get nightFraction() {
      if (!_isNight) return 0;
      return Math.min((_elapsed - NIGHT_START) / (CYCLE_DURATION - NIGHT_START), 1);
    },
    get timeLabel() {
      const s = _elapsed;
      if (s < 120)  return '🌅 Dawn';
      if (s < 540)  return '☀️ Day';
      if (s < 720)  return '🌇 Dusk';
      if (s < 960)  return '🌙 Night';
      return '💫 Deep Night';
    },

    // ── Attach to live game reference and begin ticking ──
    attach(gameInstance) {
      _gameRef = gameInstance;
      if (_ticking) return;
      _ticking = true;
      console.log('[UNK-SCAPE] Environment clock attached. Cycle: 20min (12 Day / 8 Night)');
    },

    // ── Update: called every game loop tick with real delta-time ──
    update(dt) {
      _elapsed = (_elapsed + dt) % CYCLE_DURATION;
      _wasNight = _isNight;
      _isNight  = _elapsed >= NIGHT_START;

      // ── Day → Night transition edge ──
      if (!_wasNight && _isNight) {
        this._onNightBegin();
      }
      // ── Night → Day transition edge ──
      if (_wasNight && !_isNight) {
        this._onDawnBreak();
      }
    },

    // ── Night begins: broadcast apocalypse alert ──
    _onNightBegin() {
      console.warn('[UNK-SCAPE APOCALYPSE]: Night cycle engaged. isNight=true, elapsed=' + Math.round(_elapsed) + 's');
      if (!_gameRef) return;
      // Flashing system chat alert
      _gameRef.ui.log('[APOCALYPSE]: The sun has set. Corrupted hordes are breaching regional zone borders!', 'bad');
      _gameRef.ui.toast('💫 APOCALYPSE', 'The Corrupted stir in the darkness...', 'bad');
      // Mob AI aggro radius expands — notify controller
      if (window.UnkScape && window.UnkScape.AI && window.UnkScape.AI.MobEngine) {
        window.UnkScape.AI.MobEngine.setNightMode(true);
      }
    },

    // ── Dawn breaks: reset aggro and log alert ──
    _onDawnBreak() {
      console.log('[UNK-SCAPE]: Dawn cycle engaged. isNight=false, elapsed=' + Math.round(_elapsed) + 's');
      if (!_gameRef) return;
      _gameRef.ui.log('[SYSTEM]: Dawn has broken. The Corrupted retreat.', 'gold');
      _gameRef.ui.toast('🌅 Dawn Breaks', 'You survived the Apocalypse night.', 'good');
      if (_gameRef.flags) _gameRef.flags.survivedNights = (_gameRef.flags.survivedNights || 0) + 1;
      if (window.UnkScape && window.UnkScape.AI && window.UnkScape.AI.MobEngine) {
        window.UnkScape.AI.MobEngine.setNightMode(false);
      }
    },

    // ── Darkness overlay intensity (0–1) for render.js ──
    getDarkness() {
      if (!_isNight) {
        // Gradual fade at end of day (last 60s of day)
        const fadeWindow = 60;
        if (_elapsed > DAY_DURATION - fadeWindow) {
          return (_elapsed - (DAY_DURATION - fadeWindow)) / fadeWindow * 0.25;
        }
        return 0;
      }
      // Night: fade in over first 90s, hold at max until last 90s
      const fadeIn  = Math.min(1, (_elapsed - NIGHT_START) / 90);
      const fadeOut = Math.min(1, (CYCLE_DURATION - _elapsed) / 90);
      return Math.min(fadeIn, fadeOut);
    }
  };

})(window.UnkScape = window.UnkScape || {});

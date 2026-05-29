// client/ai/mobController.js
// UnkScape.AI.MobEngine — Hostile PvE Mob Pursuit Vector AI
// Reads mobSpawns[] from UnkScape.World, loops every frame tick,
// switches IDLE → PURSUIT when player enters aggro radius,
// moves mobs via normalized direction vector, deals contact damage.
((U) => {
  U.AI = U.AI || {};

  // ── Internal mob state registry ──
  const _mobs = [];         // live mob objects: { x, y, vx, vy, state, cfg, hp, maxHp, uid }
  let _isNight = false;     // synced from Environment clock
  let _gameRef  = null;
  let _spawned  = false;

  // ── Config constants ──
  const DAY_AGGRO_TILES   = 10;    // tiles radius during day
  const NIGHT_AGGRO_TILES = 25;    // tiles radius during night — apocalypse
  const TILE_PX           = 48;    // pixels per tile (matches D.TILE)
  const CONTACT_DIST_PX   = 28;    // pixels — collision circle
  const CONTACT_COOLDOWN  = 1.5;   // seconds between damage ticks
  const DAMAGE_PER_HIT    = 5;

  // ── MOB TEMPLATE CONFIGS ──
  const MOB_CFGS = {
    orc_warrior: {
      name: 'Orc Warrior', icon: '🧌', color: '#4e7a3f',
      speed: 62, hp: 45, maxHp: 45, r: 18
    },
    rogue_elf: {
      name: 'Rogue Elf', icon: '🧝', color: '#6d55d8',
      speed: 90, hp: 30, maxHp: 30, r: 16
    },
    region_boss: {
      name: 'Regional Boss', icon: '👹', color: '#c0392b',
      speed: 44, hp: 250, maxHp: 250, r: 28, elite: true
    }
  };

  U.AI.MobEngine = {

    // ── Attach to live game and build mob list from mmoWorld mobSpawns[] ──
    attach(gameInstance) {
      _gameRef = gameInstance;
      this._buildMobsFromSpawns();
      console.log('[UNK-SCAPE] MobEngine attached. Live mobs:', _mobs.length);
    },

    // ── Convert mmoWorld mobSpawns[] registry into live mob objects ──
    _buildMobsFromSpawns() {
      const spawns = (window.UnkScape && window.UnkScape.World && window.UnkScape.World.mobSpawns) || [];
      _mobs.length = 0;
      let uid = 1;
      for (const s of spawns) {
        const cfgKey = s.type === 'orc_warrior' ? 'orc_warrior'
                     : s.type === 'rogue_elf'   ? 'rogue_elf'
                     : s.type === 'mini_boss'   ? 'region_boss'
                     : null;
        if (!cfgKey) continue;
        const baseCfg = MOB_CFGS[cfgKey];
        _mobs.push({
          uid: 'mob_' + (uid++),
          type: cfgKey,
          cfg: { ...baseCfg },
          x: s.x,
          y: s.y,
          spawnX: s.x,
          spawnY: s.y,
          vx: 0, vy: 0,
          hp: baseCfg.hp,
          maxHp: baseCfg.maxHp,
          state: 'IDLE',        // IDLE | PURSUIT | LEASH
          damageCooldown: 0,    // seconds until next contact hit
          dead: false
        });
      }
      _spawned = true;
    },

    // ── Called by environment when night begins/ends ──
    setNightMode(flag) {
      _isNight = flag;
      console.log('[UNK-SCAPE] MobEngine nightMode:', flag, '| aggro radius:', flag ? NIGHT_AGGRO_TILES : DAY_AGGRO_TILES, 'tiles');
    },

    // ── Public: get all live mobs for render.js ──
    getMobs() { return _mobs; },

    // ── Main update: called every game loop tick via game.js ──
    update(dt) {
      if (!_gameRef || !_gameRef.player || !_spawned) return;
      const player = _gameRef.player;
      const aggroTiles = _isNight ? NIGHT_AGGRO_TILES : DAY_AGGRO_TILES;
      const aggroPx = aggroTiles * TILE_PX;
      const leashPx = aggroPx * 2.2;   // leash distance before mob resets to spawn

      for (const mob of _mobs) {
        if (mob.dead) continue;

        // Decrement damage cooldown
        if (mob.damageCooldown > 0) mob.damageCooldown -= dt;

        const dx = player.x - mob.x;
        const dy = player.y - mob.y;
        const dist = Math.hypot(dx, dy);

        // ── STATE MACHINE ──
        if (mob.state === 'IDLE') {
          if (dist <= aggroPx) {
            mob.state = 'PURSUIT';
            if (_gameRef.ui) {
              _gameRef.ui.log('[COMBAT]: A ' + mob.cfg.name + ' has spotted you!', 'bad');
            }
          } else {
            // Idle: gentle wander (optional small drift)
            mob.vx *= 0.85;
            mob.vy *= 0.85;
          }
        }

        if (mob.state === 'PURSUIT') {
          // Check leash — if mob is too far from spawn, reset
          const spawnDist = Math.hypot(mob.x - mob.spawnX, mob.y - mob.spawnY);
          if (spawnDist > leashPx) {
            mob.state = 'LEASH';
          }

          if (dist <= CONTACT_DIST_PX) {
            // ── COLLISION: deal damage ──
            if (mob.damageCooldown <= 0) {
              mob.damageCooldown = CONTACT_COOLDOWN;
              // Apply damage to player
              const U = window.UnkScape;
              if (U && U.Player && U.Player.stats) {
                U.Player.stats.hp = Math.max(0, (U.Player.stats.hp || 100) - DAMAGE_PER_HIT);
              } else if (_gameRef.player) {
                _gameRef.player.hp = Math.max(0, (_gameRef.player.hp || 100) - DAMAGE_PER_HIT);
              }
              if (_gameRef.ui) {
                _gameRef.ui.log('[COMBAT]: You took ' + DAMAGE_PER_HIT + ' damage from a ' + mob.cfg.name + '.', 'bad');
              }
            }
            // Slow down at contact
            mob.vx *= 0.3;
            mob.vy *= 0.3;
          } else if (dist > 0) {
            // ── PURSUIT VECTOR MATH ──
            // Normalized direction from mob → player
            const nx = dx / dist;
            const ny = dy / dist;
            mob.vx = nx * mob.cfg.speed;
            mob.vy = ny * mob.cfg.speed;
          }
        }

        if (mob.state === 'LEASH') {
          // Return to spawn
          const ldx = mob.spawnX - mob.x;
          const ldy = mob.spawnY - mob.y;
          const ldist = Math.hypot(ldx, ldy);
          if (ldist < 16) {
            mob.state = 'IDLE';
            mob.vx = 0; mob.vy = 0;
            // Regenerate HP on return
            mob.hp = Math.min(mob.maxHp, mob.hp + mob.maxHp * 0.15);
          } else {
            mob.vx = (ldx / ldist) * mob.cfg.speed * 1.3;
            mob.vy = (ldy / ldist) * mob.cfg.speed * 1.3;
          }
          // Re-aggro during night if player steps close
          if (_isNight && dist <= aggroPx) {
            mob.state = 'PURSUIT';
          }
        }

        // ── Apply velocity ──
        mob.x += mob.vx * dt;
        mob.y += mob.vy * dt;
      }
    }
  };

})(window.UnkScape = window.UnkScape || {});

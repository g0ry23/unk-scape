(function(){
const US = window.UnkScape = window.UnkScape || {};

// AudioSystem - procedural Web Audio API sound engine
US.AudioSystem = function(game) {
  this.game = game;
  this.ctx = null;
  this.enabled = true;
  this.volumes = { master: 0.55, music: 0.22, ambient: 0.34, sfx: 0.62, footsteps: 0.32 };
  this.musicNode = null;
  this.ambientNode = null;
  this._initOnce = false;
  // Lazily init AudioContext on first user interaction
  const tryInit = () => { if (!this._initOnce) { this._initOnce = true; this._init(); } };
  document.addEventListener('keydown', tryInit, { once: true });
  document.addEventListener('mousedown', tryInit, { once: true });
};

US.AudioSystem.prototype._init = function() {
  try {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e) { this.enabled = false; }
};

US.AudioSystem.prototype._gain = function(vol) {
  if (!this.ctx) return null;
  const g = this.ctx.createGain();
  g.gain.value = vol * this.volumes.master;
  g.connect(this.ctx.destination);
  return g;
};

US.AudioSystem.prototype._beep = function(freq, type, duration, vol, delay) {
  if (!this.ctx || !this.enabled) return;
  try {
    const osc = this.ctx.createOscillator();
    const g = this._gain(vol);
    if (!g) return;
    osc.type = type || 'square';
    osc.frequency.value = freq;
    osc.connect(g);
    const t = this.ctx.currentTime + (delay || 0);
    osc.start(t);
    osc.stop(t + duration);
    g.gain.setValueAtTime(vol * this.volumes.master, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
  } catch(e) {}
};

US.AudioSystem.prototype.play = function(sound) {
  if (!this.ctx || !this.enabled) return;
  const sfxVol = this.volumes.sfx;
  switch(sound) {
    case 'hit':       this._beep(220, 'sawtooth', 0.08, sfxVol * 0.7); break;
    case 'heavyHit':  this._beep(140, 'sawtooth', 0.14, sfxVol * 0.9); this._beep(110, 'square', 0.09, sfxVol * 0.5, 0.05); break;
    case 'miss':      this._beep(180, 'sine',     0.06, sfxVol * 0.3); break;
    case 'equip':     this._beep(440, 'sine',     0.08, sfxVol * 0.5); this._beep(660, 'sine', 0.06, sfxVol * 0.4, 0.07); break;
    case 'pickup':    this._beep(660, 'sine',     0.05, sfxVol * 0.4); this._beep(880, 'sine', 0.04, sfxVol * 0.3, 0.05); break;
    case 'chop':      this._beep(160, 'square',   0.10, sfxVol * 0.6); break;
    case 'mine':      this._beep(120, 'sawtooth', 0.12, sfxVol * 0.6); break;
    case 'footstep':  this._beep(80,  'sine',     0.03, sfxVol * this.volumes.footsteps * 0.4); break;
    case 'levelup':   [523,659,784,1047].forEach((f,i)=>this._beep(f,'sine',0.12,sfxVol*0.6,i*0.10)); break;
    default: break;
  }
};

US.AudioSystem.prototype.startWorldAudio = function() {
  // No-op stub - ambient audio would go here
};

US.AudioSystem.prototype.applyVolumes = function() {
  const a = this.game.settings.audio;
  if (a) {
    this.volumes.master    = a.master    ?? this.volumes.master;
    this.volumes.music     = a.music     ?? this.volumes.music;
    this.volumes.ambient   = a.ambient   ?? this.volumes.ambient;
    this.volumes.sfx       = a.sfx       ?? this.volumes.sfx;
    this.volumes.footsteps = a.footsteps ?? this.volumes.footsteps;
  }
};

US.AudioSystem.prototype.setEnabled = function(val) {
  this.enabled = !!val;
  this.game.settings.audio.enabled = this.enabled;
};

US.AudioSystem.prototype.update = function(dt) {
  // Sync volumes each frame in case settings changed
  this.applyVolumes();
};
})();

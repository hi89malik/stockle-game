// Web Audio API Sound Effects (no external mp3 files needed)

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('stockle_muted') === 'true';
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('stockle_muted', String(this.muted));
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15, delay = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // Audio might be blocked by browser policy until interaction
    }
  }

  playGuess() {
    this.playTone(480, 'triangle', 0.08, 0.12);
  }

  playClueUnlock() {
    // Upward cheerful chime
    this.playTone(523.25, 'sine', 0.12, 0.15, 0);       // C5
    this.playTone(659.25, 'sine', 0.15, 0.15, 0.08);    // E5
    this.playTone(783.99, 'sine', 0.22, 0.18, 0.16);    // G5
  }

  playWrong() {
    // Low double blip
    this.playTone(220, 'sawtooth', 0.12, 0.12, 0);
    this.playTone(180, 'sawtooth', 0.18, 0.14, 0.1);
  }

  playWin() {
    // Majestic victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      this.playTone(freq, 'sine', 0.25, 0.2, i * 0.1);
    });
  }

  playLoss() {
    // Gentle melancholic descent
    const notes = [440, 415.3, 370, 311.13];
    notes.forEach((freq, i) => {
      this.playTone(freq, 'sine', 0.22, 0.12, i * 0.12);
    });
  }
}

export const sound = new SoundFX();

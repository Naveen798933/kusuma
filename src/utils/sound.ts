/**
 * Sound & Haptics Engine
 * Provides synthesized Web Audio sound effects (guaranteed to work offline and with zero missing assets)
 * and controls background music via Howler.js or HTMLAudioElement.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.initAudioContext();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('touchstart', unlock);
      };
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('touchstart', unlock, { passive: true });
    }
  }

  private initAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Trigger subtle device vibration
  public vibrate(pattern: number | number[] = 25) {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignored if user hasn't interacted or unsupported
      }
    }
  }

  private ambientTimer: ReturnType<typeof setInterval> | null = null;
  private ambientStep: number = 0;

  // Gentle lofi music box arpeggiator fallback when mp3 is missing
  private startProceduralAmbient() {
    if (this.ambientTimer || this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    // Peaceful chords: Cmaj7, Am7, Fmaj7, Gsus4
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // C, E, G, B
      [220.00, 261.63, 329.63, 392.00], // A, C, E, G
      [174.61, 220.00, 261.63, 329.63], // F, A, C, E
      [196.00, 261.63, 293.66, 392.00], // G, C, D, G
    ];

    this.ambientTimer = setInterval(() => {
      if (this.isMuted || !this.ctx || this.isBgmPlaying) return;
      const chordIndex = Math.floor(this.ambientStep / 4) % chords.length;
      const noteIndex = this.ambientStep % 4;
      const freq = chords[chordIndex][noteIndex];
      this.ambientStep = (this.ambientStep + 1) % (chords.length * 4);

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.2);
      } catch {}
    }, 850);
  }

  private stopProceduralAmbient() {
    if (this.ambientTimer) {
      clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  // Play background music
  public startBgm(url: string) {
    if (typeof window === 'undefined') return;
    this.initAudioContext();

    if (!this.bgmAudio) {
      this.bgmAudio = new Audio(url);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.35;
      this.bgmAudio.preload = 'auto';

      this.bgmAudio.addEventListener('error', () => {
        // Fallback to soothing procedural ambient chimes if MP3 isn't dropped yet
        this.startProceduralAmbient();
      });
    }

    if (!this.isMuted) {
      this.bgmAudio.play().then(() => {
        this.isBgmPlaying = true;
        this.stopProceduralAmbient();
      }).catch(() => {
        this.isBgmPlaying = false;
        this.startProceduralAmbient();
      });
    }
  }

  public toggleMute(muted?: boolean): boolean {
    if (typeof muted === 'boolean') {
      this.isMuted = muted;
    } else {
      this.isMuted = !this.isMuted;
    }

    if (this.isMuted) {
      this.stopProceduralAmbient();
    } else if (!this.isBgmPlaying) {
      this.startProceduralAmbient();
    }

    if (this.bgmAudio) {
      this.bgmAudio.muted = this.isMuted;
      if (!this.isMuted && !this.isBgmPlaying) {
        this.bgmAudio.play().catch(() => {});
        this.isBgmPlaying = true;
      }
    }

    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  // Synthesized Sound Effects using Web Audio API
  public playTap() {
    if (this.isMuted) return;
    this.initAudioContext();
    this.vibrate(15);
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore audio glitches
    }
  }

  public playHeartCollect() {
    if (this.isMuted) return;
    this.initAudioContext();
    this.vibrate([20, 30, 20]);
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.18, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.15);
      });
    } catch {}
  }

  public playMatchPair() {
    if (this.isMuted) return;
    this.initAudioContext();
    this.vibrate(40);
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.2, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.2);
      });
    } catch {}
  }

  public playLevelWin() {
    if (this.isMuted) return;
    this.initAudioContext();
    this.vibrate([40, 60, 40, 80, 100]);
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Majestic harp-like chord
      const chords = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
      chords.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.25, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.6);
      });
    } catch {}
  }

  public playBoing() {
    if (this.isMuted) return;
    this.initAudioContext();
    this.vibrate(30);
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  public playCelebrationFanfare() {
    if (this.isMuted) return;
    this.initAudioContext();
    this.vibrate([100, 50, 100, 50, 200, 100, 300]);
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const melody = [
        { f: 523.25, t: 0.0 }, // C5
        { f: 659.25, t: 0.15 }, // E5
        { f: 783.99, t: 0.3 }, // G5
        { f: 1046.50, t: 0.45 }, // C6
        { f: 880.00, t: 0.65 }, // A5
        { f: 1046.50, t: 0.8 }, // C6
        { f: 1318.51, t: 1.0 }, // E6
      ];

      melody.forEach(({ f, t }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(0.3, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + 0.4);
      });
    } catch {}
  }
}

export const sound = new SoundEngine();

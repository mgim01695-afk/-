class AudioSystem {
  private ctx: AudioContext | null = null;
  public muted = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.08,
    delay = 0
  ) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playClick() {
    this.playTone(540, 0.07, 'triangle', 0.06);
  }

  playDialogue() {
    this.playTone(440, 0.06, 'sine', 0.04);
    this.playTone(587, 0.07, 'sine', 0.04, 0.05);
  }

  playCoin() {
    this.playTone(880, 0.1, 'sine', 0.08, 0);
    this.playTone(1318, 0.18, 'sine', 0.08, 0.08);
  }

  playSuccess() {
    this.playTone(523.25, 0.14, 'triangle', 0.09, 0);
    this.playTone(659.25, 0.14, 'triangle', 0.09, 0.1);
    this.playTone(783.99, 0.25, 'triangle', 0.1, 0.2);
    this.playTone(1046.5, 0.35, 'sine', 0.08, 0.32);
  }

  playWrong() {
    this.playTone(260, 0.16, 'sawtooth', 0.05, 0);
    this.playTone(210, 0.22, 'sawtooth', 0.05, 0.13);
  }

  playSleep() {
    this.playTone(392, 0.35, 'sine', 0.05, 0);
    this.playTone(349.23, 0.35, 'sine', 0.05, 0.35);
    this.playTone(329.63, 0.45, 'sine', 0.05, 0.7);
    this.playTone(261.63, 0.65, 'sine', 0.04, 1.15);
  }

  playMorning() {
    this.playTone(523.25, 0.16, 'sine', 0.06, 0);
    this.playTone(659.25, 0.16, 'sine', 0.06, 0.14);
    this.playTone(783.99, 0.24, 'sine', 0.07, 0.28);
  }

  playBow() {
    this.playTone(320, 0.08, 'triangle', 0.07, 0);
    this.playTone(620, 0.12, 'sine', 0.05, 0.04);
  }
}

export const audioSystem = new AudioSystem();

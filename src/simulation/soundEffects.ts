/**
 * Procedural Web Audio API sound effects for realistic lab tactile feedback.
 * Safe against autoplay restrictions by resuming context on user click.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;

  private initCtx() {
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

  // Metallic "click / pop" when a banana plug is inserted into terminal socket
  playPlugIn() {
    try {
      this.initCtx();
      if (!this.ctx || this.ctx.state !== 'running') return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio not supported or blocked
    }
  }

  // Banana plug unplug sound
  playUnplug() {
    try {
      this.initCtx();
      if (!this.ctx || this.ctx.state !== 'running') return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // ignore
    }
  }

  // Industrial switch snap (power rocker switch / breaker)
  playSwitch(stateOn: boolean) {
    try {
      this.initCtx();
      if (!this.ctx || this.ctx.state !== 'running') return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      const startFreq = stateOn ? 180 : 260;
      const endFreq = stateOn ? 320 : 140;

      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  }

  // 50Hz transformer subtle hum
  setMainsHum(active: boolean) {
    try {
      if (!this.ctx || this.ctx.state !== 'running') return;

      if (active) {
        if (!this.humOsc) {
          this.humOsc = this.ctx.createOscillator();
          this.humGain = this.ctx.createGain();

          this.humOsc.type = 'sine';
          this.humOsc.frequency.setValueAtTime(50, this.ctx.currentTime);

          this.humGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
          this.humGain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 0.2);

          this.humOsc.connect(this.humGain);
          this.humGain.connect(this.ctx.destination);

          this.humOsc.start();
        }
      } else {
        if (this.humOsc && this.humGain) {
          this.humGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
          setTimeout(() => {
            try {
              this.humOsc?.stop();
              this.humOsc?.disconnect();
              this.humOsc = null;
              this.humGain = null;
            } catch {
              // ignore
            }
          }, 120);
        }
      }
    } catch {
      // ignore
    }
  }
}

export const sounds = new SoundEngine();

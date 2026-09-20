// Synthesized Web Audio Alarm Sound Generator

class AlarmAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq: number, duration: number, timeOffset: number = 0, type: OscillatorType = 'sine') {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + timeOffset);

    // Smooth envelope
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime + timeOffset);
    gain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + timeOffset + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + timeOffset + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime + timeOffset);
    osc.stop(this.ctx.currentTime + timeOffset + duration);
  }

  startAlarm(type: 'apex' | 'energetic' | 'gentle' = 'apex') {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    const playSequence = () => {
      if (!this.isPlaying || !this.ctx) return;

      if (type === 'apex') {
        // High-energy focus arpeggio: C5 -> E5 -> G5 -> C6
        this.playTone(523.25, 0.15, 0, 'sine');
        this.playTone(659.25, 0.15, 0.12, 'sine');
        this.playTone(783.99, 0.15, 0.24, 'triangle');
        this.playTone(1046.50, 0.35, 0.36, 'sine');
      } else if (type === 'energetic') {
        // Energetic pulsing beep
        this.playTone(880, 0.1, 0, 'square');
        this.playTone(880, 0.1, 0.15, 'square');
        this.playTone(1760, 0.2, 0.3, 'sine');
      } else {
        // Gentle sunrise chime
        this.playTone(440, 0.6, 0, 'sine');
        this.playTone(554.37, 0.6, 0.2, 'sine');
        this.playTone(659.25, 0.8, 0.4, 'sine');
      }
    };

    playSequence();
    this.timerId = setInterval(() => {
      playSequence();
    }, 1200);
  }

  stopAlarm() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  testTone(type: 'apex' | 'energetic' | 'gentle' = 'apex') {
    this.initContext();
    this.stopAlarm();
    if (type === 'apex') {
      this.playTone(523.25, 0.15, 0, 'sine');
      this.playTone(659.25, 0.15, 0.12, 'sine');
      this.playTone(783.99, 0.15, 0.24, 'triangle');
      this.playTone(1046.50, 0.35, 0.36, 'sine');
    } else if (type === 'energetic') {
      this.playTone(880, 0.1, 0, 'square');
      this.playTone(880, 0.1, 0.15, 'square');
      this.playTone(1760, 0.2, 0.3, 'sine');
    } else {
      this.playTone(440, 0.6, 0, 'sine');
      this.playTone(554.37, 0.6, 0.2, 'sine');
      this.playTone(659.25, 0.8, 0.4, 'sine');
    }
  }
}

export const alarmAudio = new AlarmAudioPlayer();

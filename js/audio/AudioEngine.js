/* AuraSonic Web Audio Engine */
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.gainNode = null;
    this.sourceNode = null;
    this.micStream = null;
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';

    this.fftSize = 1024;
    this.frequencyData = new Uint8Array(this.fftSize / 2);
    this.waveformData = new Uint8Array(this.fftSize);

    // Audio Analysis metrics
    this.bass = 0;
    this.mid = 0;
    this.treble = 0;
    this.average = 0;
    this.beat = false;
    this.beatThreshold = 1.35;
    this.bassHistory = [];

    // Gain multipliers
    this.bassBoost = 1.6;
    this.trebleBoost = 1.4;

    // Speaker Output Mute State (Default: Muted/Silent so visualizer makes ZERO sound through speakers)
    this.isMuted = true;
    
    // Current source mode: 'synth' | 'system' | 'file'
    this.sourceMode = 'synth';
    this.isPlaying = true;

    // Procedural Synth State
    this.synthInterval = null;
    this.synthStep = 0;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = this.fftSize;
    this.analyser.smoothingTimeConstant = 0.82;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.8;

    this.gainNode.connect(this.analyser);
    // Destination routing is dynamically managed by setSourceMode() and toggleMute()

    // Connect audio element source
    this.fileSourceNode = this.ctx.createMediaElementSource(this.audioElement);
    
    // Wire file playback handlers
    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
    });

    // Start synth demo by default
    this.startSynth();
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.updateOutputRouting();
    return this.isMuted;
  }

  updateOutputRouting() {
    if (!this.analyser || !this.ctx) return;
    
    // Always disconnect destination first
    try { this.analyser.disconnect(this.ctx.destination); } catch (e) {}

    // ONLY connect to speakers if NOT muted AND in synth/file mode
    if (!this.isMuted && (this.sourceMode === 'synth' || this.sourceMode === 'file')) {
      this.analyser.connect(this.ctx.destination);
    }
  }

  setSourceMode(mode, file = null) {
    this.init();
    this.resume();

    // 1. Fully stop synth & pause audio file
    this.stopSynth();
    if (this.audioElement) {
      this.audioElement.pause();
      try { this.fileSourceNode.disconnect(); } catch (e) {}
    }

    // 2. Disconnect previous stream source & stop tracks
    if (this.sourceNode) {
      try { this.sourceNode.disconnect(); } catch (e) {}
      this.sourceNode = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }

    // 3. Reset node connections
    try { this.gainNode.disconnect(); } catch (e) {}

    this.sourceMode = mode;

    if (mode === 'synth') {
      this.gainNode.connect(this.analyser);
      this.startSynth();
      this.isPlaying = true;
    } else if (mode === 'file' && file) {
      this.gainNode.connect(this.analyser);
      const url = URL.createObjectURL(file);
      this.audioElement.src = url;
      this.fileSourceNode.connect(this.gainNode);
      this.audioElement.play();
      this.isPlaying = true;
    } else if (mode === 'mic') {
      navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      }).then(stream => {
        this.micStream = stream;
        this.sourceNode = this.ctx.createMediaStreamSource(stream);
        this.sourceNode.connect(this.analyser);
        this.isPlaying = true;
      }).catch(err => {
        console.error("Mic / Background music capture error:", err);
      });
    } else if (mode === 'system') {
      navigator.mediaDevices.getDisplayMedia({ audio: true, video: true }).then(stream => {
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length === 0) {
          alert("No audio track detected. In the browser popup, select a YouTube tab or Screen and check 'Share audio'!");
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        this.micStream = stream;
        this.sourceNode = this.ctx.createMediaStreamSource(stream);
        this.sourceNode.connect(this.analyser);
        this.isPlaying = true;
      }).catch(err => {
        console.error("System audio capture error:", err);
      });
    }

    this.updateOutputRouting();
  }

  togglePlayPause() {
    this.init();
    this.resume();

    if (this.sourceMode === 'synth') {
      if (this.isPlaying) {
        this.stopSynth();
        this.isPlaying = false;
      } else {
        this.startSynth();
        this.isPlaying = true;
      }
    } else if (this.sourceMode === 'file') {
      if (this.audioElement.paused) {
        this.audioElement.play();
        this.isPlaying = true;
      } else {
        this.audioElement.pause();
        this.isPlaying = false;
      }
    }
    return this.isPlaying;
  }

  setVolume(vol) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, vol));
    }
  }

  /* Procedural Synth Demo Generator */
  startSynth() {
    this.stopSynth();
    
    // Synth sequence chord progression (frequencies in Hz)
    const chords = [
      [130.81, 164.81, 196.00, 246.94], // C maj7
      [110.00, 130.81, 164.81, 196.00], // A min7
      [87.31, 130.81, 174.61, 220.00],  // F maj7
      [98.00, 123.47, 146.83, 196.00]   // G maj
    ];

    const bassNotes = [65.41, 55.00, 43.65, 49.00]; // Sub bass

    const tempo = 125; // BPM
    const stepTime = (60 / tempo / 4) * 1000; // 16th note in ms

    this.synthInterval = setInterval(() => {
      if (!this.ctx || this.ctx.state !== 'running') return;

      const measureStep = this.synthStep % 16;
      const chordIndex = Math.floor((this.synthStep / 16) % 4);
      const currentChord = chords[chordIndex];

      const now = this.ctx.currentTime;

      // 1. Kick Drum (Step 0, 4, 8, 12)
      if (measureStep % 4 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        gain.gain.setValueAtTime(1.0, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.gainNode);
        osc.start(now);
        osc.stop(now + 0.15);
      }

      // 2. Sub Bass (Every quarter note)
      if (measureStep % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassNotes[chordIndex], now);
        bassGain.gain.setValueAtTime(0.4, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        bassOsc.connect(bassGain);
        bassGain.connect(this.gainNode);
        bassOsc.start(now);
        bassOsc.stop(now + 0.2);
      }

      // 3. Arpeggiated Synth Lead (16th notes)
      const noteFreq = currentChord[measureStep % currentChord.length];
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = 'triangle';
      leadOsc.frequency.setValueAtTime(noteFreq * 2, now);
      leadGain.gain.setValueAtTime(0.2, now);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      leadOsc.connect(leadGain);
      leadGain.connect(this.gainNode);
      leadOsc.start(now);
      leadOsc.stop(now + 0.12);

      // 4. Hi-Hat Noise (Off-beats)
      if (measureStep % 2 === 1) {
        const bufferSize = this.ctx.sampleRate * 0.05;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.15, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.gainNode);
        noise.start(now);
      }

      this.synthStep++;
    }, stepTime);
  }

  stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  update() {
    if (!this.analyser) {
      this.init();
      return;
    }

    // Auto-resume AudioContext if browser suspended it
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.waveformData);

    const length = this.frequencyData.length;
    let sumSubBass = 0, countSubBass = 0;
    let sumBass = 0, countBass = 0;
    let sumLowMids = 0, countLowMids = 0;
    let sumHighMids = 0, countHighMids = 0;
    let sumTreble = 0, countTreble = 0;
    let sumBrilliance = 0, countBrilliance = 0;
    let sumTotal = 0;

    for (let i = 0; i < length; i++) {
      const val = this.frequencyData[i] / 255.0;
      sumTotal += val;

      if (i < 4) {
        sumSubBass += val;
        countSubBass++;
      } else if (i < 16) {
        sumBass += val;
        countBass++;
      } else if (i < 32) {
        sumLowMids += val;
        countLowMids++;
      } else if (i < 128) {
        sumHighMids += val;
        countHighMids++;
      } else if (i < 384) {
        sumTreble += val;
        countTreble++;
      } else {
        sumBrilliance += val;
        countBrilliance++;
      }
    }

    const tau = 0.88; // Exponential smoothing factor

    if (sumTotal > 0.005) {
      // Real Live Audio Signal - 6-Band Frequency Segmentation
      const rawSubBass = (countSubBass > 0 ? sumSubBass / countSubBass : 0) * this.bassBoost * 2.5;
      const rawBass = (countBass > 0 ? sumBass / countBass : 0) * this.bassBoost * 2.2;
      const rawLowMids = (countLowMids > 0 ? sumLowMids / countLowMids : 0) * 1.8;
      const rawHighMids = (countHighMids > 0 ? sumHighMids / countHighMids : 0) * 1.8;
      const rawTreble = (countTreble > 0 ? sumTreble / countTreble : 0) * this.trebleBoost * 1.8;
      const rawBrilliance = (countBrilliance > 0 ? sumBrilliance / countBrilliance : 0) * this.trebleBoost * 2.0;

      // Exponential Smoothing
      this.subBass = (this.subBass || 0) * tau + rawSubBass * (1 - tau);
      this.bass = (this.bass || 0) * tau + rawBass * (1 - tau);
      this.lowMids = (this.lowMids || 0) * tau + rawLowMids * (1 - tau);
      this.mid = (this.mid || 0) * tau + rawHighMids * (1 - tau);
      this.highMids = (this.highMids || 0) * tau + rawHighMids * (1 - tau);
      this.treble = (this.treble || 0) * tau + rawTreble * (1 - tau);
      this.brilliance = (this.brilliance || 0) * tau + rawBrilliance * (1 - tau);
      this.average = (sumTotal / length) * 2.0;
    } else {
      // Procedural Idle Breathing Motion
      const t = performance.now() * 0.003;
      this.subBass = (Math.sin(t * 1.5) * 0.5 + 0.5) * 0.35 * this.bassBoost;
      this.bass = (Math.sin(t * 2) * 0.5 + 0.5) * 0.4 * this.bassBoost;
      this.lowMids = (Math.cos(t * 1.8) * 0.5 + 0.5) * 0.3;
      this.mid = (Math.cos(t * 1.5) * 0.5 + 0.5) * 0.3;
      this.highMids = (Math.sin(t * 2.2) * 0.5 + 0.5) * 0.3;
      this.treble = (Math.sin(t * 3) * 0.5 + 0.5) * 0.3 * this.trebleBoost;
      this.brilliance = (Math.cos(t * 3.5) * 0.5 + 0.5) * 0.25 * this.trebleBoost;
      this.average = 0.3;

      for (let i = 0; i < length; i++) {
        this.frequencyData[i] = Math.floor((Math.sin(t * 2 + i * 0.1) * 0.5 + 0.5) * 140);
        this.waveformData[i] = Math.floor(128 + Math.sin(t * 4 + i * 0.05) * 45);
      }
    }

    // Energy-History Peak Transient Beat Detection
    this.bassHistory.push(this.subBass + this.bass);
    if (this.bassHistory.length > 30) this.bassHistory.shift();

    const avgBass = this.bassHistory.reduce((a, b) => a + b, 0) / this.bassHistory.length;
    this.beat = (this.subBass + this.bass) > avgBass * 1.25 && (this.subBass + this.bass) > 0.25;
  }
}

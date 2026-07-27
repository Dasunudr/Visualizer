/* AuraSonic Group D: Equalizer & Spectrum (Patterns 61–80) */

export const groupDPatterns = [
  // 61. Radial Frequency Rings
  {
    id: 61,
    name: "Radial Frequency Rings",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Concentric circular spectrum equalizer bars",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#030409";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const bars = 64;
      const radius = 100 + audio.bass * 30;

      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        const val = audio.frequencyData[i * 2] / 255;
        const barLen = val * 120 + 5;

        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy + Math.sin(angle) * radius;
        const x2 = cx + Math.cos(angle) * (radius + barLen);
        const y2 = cy + Math.sin(angle) * (radius + barLen);

        ctx.strokeStyle = `hsl(${i * 5.5}, 100%, 60%)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  },

  // 62. 3D Spectrum Bars
  {
    id: 62,
    name: "3D Spectrum Bars",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Grid of perspective towers responding to FFT bins",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020206";
      ctx.fillRect(0, 0, w, h);

      const bars = 32;
      const barW = w / bars;

      for (let i = 0; i < bars; i++) {
        const val = audio.frequencyData[i * 4] / 255;
        const barH = val * (h * 0.7);

        const x = i * barW;
        const y = h - barH;

        ctx.fillStyle = `hsl(${180 + i * 4}, 90%, 55%)`;
        ctx.fillRect(x + 2, y, barW - 4, barH);
      }
    }
  },

  // 63. Peak-Hold LED Meters
  {
    id: 63,
    name: "Peak-Hold LED Meters",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Classic stereo equalizer with falling peak dot physics",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#05060c";
      ctx.fillRect(0, 0, w, h);

      const bars = 24;
      const barW = (w - 100) / bars;

      if (!this.peaks) this.peaks = new Array(bars).fill(0);

      for (let i = 0; i < bars; i++) {
        const val = audio.frequencyData[i * 4] / 255;
        const height = val * (h * 0.6);
        const x = 50 + i * barW;

        if (height > this.peaks[i]) this.peaks[i] = height;
        else this.peaks[i] *= 0.95;

        // Draw segmented blocks
        const segments = Math.floor(height / 12);
        for (let s = 0; s < segments; s++) {
          const sy = h - 50 - s * 14;
          ctx.fillStyle = s > 18 ? "#ff00a0" : s > 12 ? "#f59e0b" : "#00f3ff";
          ctx.fillRect(x + 3, sy, barW - 6, 10);
        }

        // Draw Peak Dot
        ctx.fillStyle = "#fff";
        ctx.fillRect(x + 3, h - 50 - this.peaks[i], barW - 6, 4);
      }
    }
  },

  // 64. Circular Waveform Spikes
  {
    id: 64,
    name: "Circular Waveform Spikes",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Audio oscilloscope waveform plotted around a circle",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 3, 10, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = 120;
      const points = audio.waveformData.length;

      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const a = (i / points) * Math.PI * 2;
        const v = (audio.waveformData[i] - 128) / 128;
        const radius = r + v * 60;

        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  },

  // 65. Mirror-Split Oscilloscope
  {
    id: 65,
    name: "Mirror-Split Oscilloscope",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Symmetrical dual waveform oscilloscope traces",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020307";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#ff00a0";
      ctx.lineWidth = 3;

      ctx.beginPath();
      const points = audio.waveformData.length;
      for (let i = 0; i < points; i++) {
        const x = (i / points) * w;
        const v = (audio.waveformData[i] - 128) / 128;
        const y = h * 0.5 + v * (h * 0.3);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  },

  // 66. Retro Synthwave Sun Spectrum
  {
    id: 66,
    name: "Retro Synthwave Sun Spectrum",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Sliced sunset disk reacting to frequency bands",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#090212";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.5;
      const r = 120 + audio.bass * 30;

      const slices = 16;
      for (let i = 0; i < slices; i++) {
        const val = audio.frequencyData[i * 4] / 255;
        const sliceY = cy - r + (i / slices) * (r * 2);
        const sliceH = (r * 2 / slices) * 0.7;

        ctx.fillStyle = `hsl(${330 + i * 3}, 100%, 60%)`;
        ctx.fillRect(cx - r * (1 - Math.abs(i - slices / 2) / (slices / 2)), sliceY, r * 2 * (1 - Math.abs(i - slices / 2) / (slices / 2)) * val, sliceH);
      }
    }
  },

  // 67. Circular Stereo Barcode
  {
    id: 67,
    name: "Circular Stereo Barcode",
    category: "equalizer",
    engineType: "canvas2d",
    description: "360-degree radial barcode spectrum spikes",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#030308";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const count = 120;

      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const val = audio.frequencyData[i % audio.frequencyData.length] / 255;

        ctx.strokeStyle = `hsl(${i * 3}, 100%, 60%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 80, cy + Math.sin(a) * 80);
        ctx.lineTo(cx + Math.cos(a) * (80 + val * 100), cy + Math.sin(a) * (80 + val * 100));
        ctx.stroke();
      }
    }
  },

  // 68. Vibrating String Oscilloscope
  {
    id: 68,
    name: "Vibrating String Oscilloscope",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Multi-string harmonic physical string simulation",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#04050a";
      ctx.fillRect(0, 0, w, h);

      const strings = 6;
      for (let s = 0; s < strings; s++) {
        const y = h * (0.2 + s * 0.12);
        ctx.strokeStyle = `hsl(${s * 40 + audio.treble * 80}, 90%, 65%)`;
        ctx.lineWidth = 3;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 15) {
          const wave = Math.sin(x * 0.02 + t * 4 + s) * (audio.frequencyData[s * 10] / 5);
          if (x === 0) ctx.moveTo(x, y + wave);
          else ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }
    }
  },

  // 69. Voxel Frequency Matrix
  {
    id: 69,
    name: "Voxel Frequency Matrix",
    category: "equalizer",
    engineType: "canvas2d",
    description: "3D heightmap matrix equalizer towers",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020306";
      ctx.fillRect(0, 0, w, h);

      const rows = 8, cols = 8;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const val = audio.frequencyData[(r * cols + c) * 2] / 255;
          const px = w * 0.2 + c * 40 + r * 20;
          const py = h * 0.3 + r * 20 - val * 60;

          ctx.fillStyle = `hsl(${220 + val * 100}, 90%, 60%)`;
          ctx.fillRect(px, py, 30, val * 60 + 10);
        }
      }
    }
  },

  // 70. Floating Neon Audio Rings
  {
    id: 70,
    name: "Floating Neon Audio Rings",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Concentric neon rings jumping on beat",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 2, 7, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const rings = 8;

      for (let i = 0; i < rings; i++) {
        const val = audio.frequencyData[i * 8] / 255;
        const r = (i + 1) * 25 + val * 40;

        ctx.strokeStyle = `hsl(${i * 35}, 100%, 60%)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  },

  // 71. Double Helix DNA Spectrum
  {
    id: 71,
    name: "Double Helix DNA Spectrum",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Twisting gene helix whose rungs reflect audio bands",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#040409";
      ctx.fillRect(0, 0, w, h);

      const nodes = 30;
      for (let i = 0; i < nodes; i++) {
        const y = (i / nodes) * h;
        const a = i * 0.3 + t * 2;
        const val = audio.frequencyData[i * 2] / 255;

        const x1 = w / 2 + Math.cos(a) * (80 + val * 40);
        const x2 = w / 2 - Math.cos(a) * (80 + val * 40);

        ctx.strokeStyle = "rgba(0, 243, 255, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();

        ctx.fillStyle = "#ff00a0";
        ctx.beginPath();
        ctx.arc(x1, y, 5, 0, Math.PI * 2);
        ctx.arc(x2, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  // 72. Radial Flame Spectrum
  {
    id: 72,
    name: "Radial Flame Spectrum",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Fire-like frequency spikes emanating outwards",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(8, 2, 2, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const count = 60;

      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const val = audio.frequencyData[i * 2] / 255;

        ctx.strokeStyle = `hsl(${10 + val * 40}, 100%, 55%)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 60, cy + Math.sin(a) * 60);
        ctx.lineTo(cx + Math.cos(a) * (60 + val * 140), cy + Math.sin(a) * (60 + val * 140));
        ctx.stroke();
      }
    }
  },

  // 73. Segmented LED Circular Ring
  {
    id: 73,
    name: "Segmented LED Circular Ring",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Digital radial VU meter with color thresholds",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#030409";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const leds = 36;

      for (let i = 0; i < leds; i++) {
        const a = (i / leds) * Math.PI * 2;
        const val = audio.frequencyData[i] / 255;

        ctx.fillStyle = val > 0.7 ? "#ff00a0" : val > 0.4 ? "#f59e0b" : "#00f3ff";
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * 130, cy + Math.sin(a) * 130, 6 + val * 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  // 74. Linear Waterfall Spectrogram
  {
    id: 74,
    name: "Linear Waterfall Spectrogram",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Rolling waterfall color map of frequency over time",
    render2D(ctx, w, h, audio, t) {
      if (!this.imgData) {
        this.imgData = ctx.createImageData(w, 1);
      }

      ctx.drawImage(ctx.canvas, 0, 0, w, h - 2, 0, 2, w, h - 2);

      const len = audio.frequencyData.length;
      for (let x = 0; x < w; x++) {
        const idx = Math.floor((x / w) * len);
        const val = audio.frequencyData[idx];

        ctx.fillStyle = `hsl(${240 - (val / 255) * 240}, 100%, 50%)`;
        ctx.fillRect(x, 0, 1, 2);
      }
    }
  },

  // 75. Split Horizon Oscilloscope
  {
    id: 75,
    name: "Split Horizon Oscilloscope",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Top and bottom mirrored audio dynamic ribbon",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020308";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(0, 243, 255, 0.4)";
      ctx.beginPath();
      ctx.moveTo(0, h / 2);

      for (let x = 0; x <= w; x += 10) {
        const idx = Math.floor((x / w) * audio.waveformData.length);
        const v = (audio.waveformData[idx] - 128) / 128;
        ctx.lineTo(x, h / 2 + v * 120);
      }
      ctx.lineTo(w, h / 2);
      ctx.fill();
    }
  },

  // 76. 3D Spiral Spectrum Tower
  {
    id: 76,
    name: "3D Spiral Spectrum Tower",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Helix spectrum bars rising into space",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#040308";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const count = 50;

      for (let i = 0; i < count; i++) {
        const y = h - i * 10;
        const a = i * 0.2 + t * 2;
        const val = audio.frequencyData[i] / 255;

        const x = cx + Math.cos(a) * (100 + val * 50);
        ctx.fillStyle = `hsl(${i * 6}, 100%, 60%)`;
        ctx.fillRect(x, y, 12, 8);
      }
    }
  },

  // 77. Analog Needle VU Meters
  {
    id: 77,
    name: "Analog Needle VU Meters",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Classic dual vintage mechanical VU meters",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#111422";
      ctx.fillRect(0, 0, w, h);

      const drawVU = (cx, cy, title, level) => {
        ctx.fillStyle = "#fef3c7";
        ctx.fillRect(cx - 140, cy - 80, 280, 160);

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.strokeRect(cx - 140, cy - 80, 280, 160);

        // Needle
        const angle = -Math.PI / 4 + level * (Math.PI / 2);
        ctx.strokeStyle = "#dc2626";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy + 50);
        ctx.lineTo(cx + Math.sin(angle) * 110, cy + 50 - Math.cos(angle) * 110);
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(title, cx - 20, cy + 65);
      };

      drawVU(w * 0.3, h * 0.5, "LEFT CH", audio.bass);
      drawVU(w * 0.7, h * 0.5, "RIGHT CH", audio.mid);
    }
  },

  // 78. Dual Stereo Lissajous Scope
  {
    id: 78,
    name: "Dual Stereo Lissajous Scope",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Left vs Right channel phase correlation visualizer",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 4, 8, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 2;

      ctx.beginPath();
      for (let i = 0; i < audio.waveformData.length; i += 4) {
        const v1 = (audio.waveformData[i] - 128) / 128;
        const v2 = (audio.waveformData[(i + 10) % audio.waveformData.length] - 128) / 128;

        const x = cx + v1 * 180;
        const y = cy + v2 * 180;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  },

  // 79. Hexagonal Radial Spectrum
  {
    id: 79,
    name: "Hexagonal Radial Spectrum",
    category: "equalizer",
    engineType: "canvas2d",
    description: "6-way symmetrical equalizer petals",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#030308";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      for (let i = 0; i < 6; i++) {
        const baseA = (i / 6) * Math.PI * 2;
        ctx.strokeStyle = `hsl(${i * 60}, 100%, 60%)`;
        ctx.lineWidth = 3;

        ctx.beginPath();
        for (let b = 0; b < 16; b++) {
          const val = audio.frequencyData[b * 4] / 255;
          const r = 40 + b * 8 + val * 30;
          const a = baseA + (b - 8) * 0.03;

          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;

          if (b === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }
  },

  // 80. Cyberpunk Audio Bar Graph
  {
    id: 80,
    name: "Cyberpunk Audio Bar Graph",
    category: "equalizer",
    engineType: "canvas2d",
    description: "Glitchy futuristic HUD spectrum equalizer",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#06020a";
      ctx.fillRect(0, 0, w, h);

      const bars = 20;
      const bw = w / bars;

      for (let i = 0; i < bars; i++) {
        const val = audio.frequencyData[i * 5] / 255;
        const bh = val * (h * 0.6);

        ctx.fillStyle = "rgba(0, 243, 255, 0.8)";
        ctx.fillRect(i * bw + 4, h - bh, bw - 8, bh);

        // Glitch line
        if (Math.random() < 0.1) {
          ctx.fillStyle = "#ff00a0";
          ctx.fillRect(i * bw, h - bh - 10, bw, 4);
        }
      }
    }
  }
];

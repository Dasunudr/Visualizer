/* AuraSonic Group A: Waves & Fluids (Patterns 1–20) - Advanced High-Aesthetic Renderers */

export const groupAPatterns = [
  // 1. Fluid Silk Ribbons
  {
    id: 1,
    name: "Fluid Silk Ribbons",
    category: "waves",
    engineType: "canvas2d",
    description: "Flowing 3D silk ribbons undulating with neon depth",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 5, 12, 0.2)";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const numRibbons = 10;
      const points = 120;
      for (let r = 0; r < numRibbons; r++) {
        const hue = (t * 25 + r * 35 + audio.treble * 140) % 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${0.6 + audio.mid * 0.4})`;
        ctx.lineWidth = 4 + audio.bass * 8;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;

        ctx.beginPath();
        for (let i = 0; i < points; i++) {
          const u = i / points;
          const x = u * w;
          const freqVal = (audio.frequencyData[i % audio.frequencyData.length] || 0) / 255;

          const wave1 = Math.sin(u * 6 + t * 2.5 + r * 0.8) * (80 + audio.bass * 140);
          const wave2 = Math.cos(u * 12 - t * 3.5 + r * 0.4) * (40 + freqVal * 90);
          const y = h * (0.25 + r * 0.06) + wave1 + wave2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  // 2. Harmonic Sine Webs
  {
    id: 2,
    name: "Harmonic Sine Webs",
    category: "waves",
    engineType: "canvas2d",
    description: "Intersecting multi-frequency harmonic wave grid",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(3, 4, 10, 0.25)";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const lines = 32;
      const cx = w / 2;
      const cy = h / 2;

      for (let l = 0; l < lines; l++) {
        const angle = (l / lines) * Math.PI * 2;
        const freqBin = audio.frequencyData[l * 3] / 255;

        const hue = (180 + l * 10 + audio.mid * 120) % 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.7)`;
        ctx.lineWidth = 2 + freqBin * 4;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;

        ctx.beginPath();
        for (let r = 0; r < w * 0.65; r += 6) {
          const wave = Math.sin(r * 0.025 - t * 4 + l) * (20 + audio.bass * 60);
          const px = cx + Math.cos(angle + wave * 0.012) * (r + wave);
          const py = cy + Math.sin(angle + wave * 0.012) * (r + wave);

          if (r === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  // 3. Liquid Ripples
  {
    id: 3,
    name: "Liquid Ripples",
    category: "waves",
    engineType: "canvas2d",
    description: "Concentric fluid displacement rings emitting on beat",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 4, 9, 0.2)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      if (!this.ripples) this.ripples = [];
      if (audio.beat || Math.random() < 0.15) {
        this.ripples.push({
          r: 10,
          maxR: Math.max(w, h) * 0.75,
          speed: 5 + audio.bass * 10,
          hue: (t * 60 + audio.treble * 160) % 360
        });
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const rp = this.ripples[i];
        rp.r += rp.speed;
        const alpha = 1 - rp.r / rp.maxR;

        if (alpha <= 0) {
          this.ripples.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `hsla(${rp.hue}, 100%, 65%, ${alpha * 0.85})`;
        ctx.lineWidth = 5 + audio.mid * 8;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${rp.hue}, 100%, 55%)`;

        ctx.beginPath();
        ctx.arc(cx, cy, rp.r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  // 4. Tide Oscillations
  {
    id: 4,
    name: "Tide Oscillations",
    category: "waves",
    engineType: "canvas2d",
    description: "Multi-layered oceanic horizons flexing with sound",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#02040a";
      ctx.fillRect(0, 0, w, h);

      const layers = 7;
      for (let l = 0; l < layers; l++) {
        const yOffset = h * 0.35 + l * (h * 0.09);
        const grad = ctx.createLinearGradient(0, yOffset - 60, 0, h);
        const hue = (190 + l * 22 + audio.treble * 60) % 360;
        grad.addColorStop(0, `hsla(${hue}, 90%, 60%, 0.85)`);
        grad.addColorStop(1, `#02040a`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, h);

        for (let x = 0; x <= w; x += 12) {
          const u = x / w;
          const freqVal = audio.frequencyData[Math.floor(u * 100)] / 255;
          const y = yOffset + Math.sin(u * 9 + t * (2 + l * 0.4)) * (25 + audio.bass * 60) + Math.cos(u * 18 - t * 3) * (12 + freqVal * 40);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      }
    }
  },

  // 5. Plasma Fields
  {
    id: 5,
    name: "Plasma Fields",
    category: "waves",
    engineType: "canvas2d",
    description: "Audio-driven trigonometric RGB noise plasma matrix",
    render2D(ctx, w, h, audio, t) {
      const step = 16;
      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          const v1 = Math.sin(x * 0.012 + t * 1.2 + audio.bass * 3);
          const v2 = Math.sin(y * 0.012 + t * 1.8 + audio.mid * 4);
          const v3 = Math.sin((x + y) * 0.012 + t * 0.9);
          const v = (v1 + v2 + v3) / 3;

          const hue = (v * 180 + t * 50 + audio.treble * 140) % 360;
          ctx.fillStyle = `hsl(${hue}, 90%, ${40 + v * 25}%)`;
          ctx.fillRect(x, y, step, step);
        }
      }
    }
  },

  // 6. Chromatic Water
  {
    id: 6,
    name: "Chromatic Water",
    category: "waves",
    engineType: "canvas2d",
    description: "Refractive fluid surface with chromatic color separation",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(3, 6, 14, 0.25)";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const channels = [
        { color: 'rgba(255, 0, 120, 0.8)', shift: -8 * audio.bass, hue: 330 },
        { color: 'rgba(0, 243, 255, 0.8)', shift: 0, hue: 190 },
        { color: 'rgba(0, 255, 140, 0.8)', shift: 8 * audio.treble, hue: 140 }
      ];

      channels.forEach(ch => {
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 4 + audio.bass * 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${ch.hue}, 100%, 60%)`;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const y = h * 0.5 + Math.sin(x * 0.012 + t * 3.5 + ch.shift) * (50 + audio.bass * 70) + Math.cos(x * 0.025 - t * 2.5) * (25 + audio.mid * 50);
          if (x === 0) ctx.moveTo(x, y + ch.shift);
          else ctx.lineTo(x, y + ch.shift);
        }
        ctx.stroke();
      });
      ctx.restore();
    }
  },

  // 7. Vortex Waves
  {
    id: 7,
    name: "Vortex Waves",
    category: "waves",
    engineType: "canvas2d",
    description: "Spiral wave sink drawing audio energy inward",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 3, 8, 0.25)";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const cx = w / 2;
      const cy = h / 2;
      const arms = 16;

      for (let a = 0; a < arms; a++) {
        const armAngle = (a / arms) * Math.PI * 2;
        const hue = (250 + a * 12 + audio.treble * 100) % 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 65%, 0.85)`;
        ctx.lineWidth = 3 + audio.mid * 4;

        ctx.beginPath();
        for (let r = 20; r < Math.min(w, h) * 0.48; r += 4) {
          const angle = armAngle + r * 0.018 - t * (1.2 + audio.bass * 2);
          const freq = audio.frequencyData[Math.floor(r) % 128] / 255;
          const radius = r + Math.sin(r * 0.08 + t * 4) * (12 + freq * 35);

          const px = cx + Math.cos(angle) * radius;
          const py = cy + Math.sin(angle) * radius;

          if (r === 20) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  // 8. Interference Ripples
  {
    id: 8,
    name: "Interference Ripples",
    category: "waves",
    engineType: "canvas2d",
    description: "Dual acoustic emitter wave interference lattice",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#030409";
      ctx.fillRect(0, 0, w, h);

      const p1 = { x: w * 0.35 + Math.sin(t * 1.2) * 60, y: h * 0.5 };
      const p2 = { x: w * 0.65 - Math.sin(t * 1.2) * 60, y: h * 0.5 };

      const step = 22;
      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          const d1 = Math.hypot(x - p1.x, y - p1.y);
          const d2 = Math.hypot(x - p2.x, y - p2.y);

          const w1 = Math.sin(d1 * 0.045 - t * 5 + audio.bass * 3);
          const w2 = Math.sin(d2 * 0.045 - t * 5 + audio.mid * 3);
          const val = (w1 + w2) * 0.5;

          const size = Math.max(2, (val + 1) * 9 * (1 + audio.treble * 0.8));
          ctx.fillStyle = `hsla(${160 + val * 120}, 100%, 65%, ${0.35 + val * 0.55})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  },

  // 9. Superposition Web
  {
    id: 9,
    name: "Superposition Web",
    category: "waves",
    engineType: "canvas2d",
    description: "Fourier wave superposition synthesis lines",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 4, 12, 0.25)";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const hue = (t * 35) % 360;
      ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.85)`;
      ctx.lineWidth = 3 + audio.bass * 4;

      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const u = x / w;
        let y = h * 0.5;
        for (let k = 1; k <= 6; k++) {
          const amp = (audio.frequencyData[k * 8] / 255) * (70 / k);
          y += Math.sin(u * k * 14 + t * k * 2.2) * amp;
        }
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  },

  // 10. Caustic Pool
  {
    id: 10,
    name: "Caustic Pool",
    category: "waves",
    engineType: "canvas2d",
    description: "Underwater light refraction network",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#010912";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(0, 243, 255, 0.55)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00f3ff";

      const gridSize = 35;
      for (let x = 0; x < w; x += gridSize) {
        for (let y = 0; y < h; y += gridSize) {
          const dx = Math.sin(x * 0.02 + y * 0.02 + t * 2) * (18 + audio.bass * 25);
          const dy = Math.cos(x * 0.02 - y * 0.02 + t * 2) * (18 + audio.mid * 25);

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + gridSize + dx, y + dy);
          ctx.lineTo(x + dx, y + gridSize + dy);
          ctx.stroke();
        }
      }
      ctx.shadowBlur = 0;
    }
  },

  // 11. Bioluminescent Stream
  {
    id: 11,
    name: "Bioluminescent Stream",
    category: "waves",
    engineType: "canvas2d",
    description: "Flowing organic glowing particulate currents",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 6, 12, 0.2)";
      ctx.fillRect(0, 0, w, h);

      if (!this.particles) {
        this.particles = Array.from({ length: 180 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          speed: 1.5 + Math.random() * 3.5,
          size: 2.5 + Math.random() * 4.5
        }));
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      this.particles.forEach(p => {
        p.x += (p.speed + audio.bass * 6);
        p.y += Math.sin(p.x * 0.012 + t * 2.2) * (3 + audio.mid * 5);

        if (p.x > w) p.x = 0;

        const hue = (140 + audio.treble * 120) % 360;
        ctx.fillStyle = `hsla(${hue}, 100%, 65%, 0.85)`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + audio.bass * 0.8), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
  },

  // 12. Acoustic Shockwave
  {
    id: 12,
    name: "Acoustic Shockwave",
    category: "waves",
    engineType: "canvas2d",
    description: "High-energy sonic compression shock rings",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 2, 9, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const rings = 12;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < rings; i++) {
        const radius = (i * 32 + t * 70 + audio.bass * 90) % (Math.min(w, h) * 0.52);
        const alpha = 1 - radius / (Math.min(w, h) * 0.52);

        const hue = (290 + i * 12) % 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${alpha})`;
        ctx.lineWidth = 3 + audio.frequencyData[i * 8] / 25;
        ctx.shadowBlur = 18;
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  // 13. Fluid Vortex Cloud
  {
    id: 13,
    name: "Fluid Vortex Cloud",
    category: "waves",
    engineType: "canvas2d",
    description: "Swirling fluid vector field particles",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 4, 10, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const count = 160;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + t * (0.6 + audio.bass * 1.5);
        const dist = 40 + i * 2.2 + Math.sin(t * 3.5 + i) * (25 + audio.mid * 60);

        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;

        const hue = (200 + i * 2) % 360;
        ctx.fillStyle = `hsla(${hue}, 95%, 65%, 0.8)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;

        ctx.beginPath();
        ctx.arc(x, y, 3.5 + audio.treble * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  },

  // 14. Curvature Spectrum Wave
  {
    id: 14,
    name: "Curvature Spectrum Wave",
    category: "waves",
    engineType: "canvas2d",
    description: "Dynamic curvature heightmap sine wave",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#03050c";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 4 + audio.bass * 4;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00f3ff";

      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const idx = Math.floor((x / w) * audio.frequencyData.length);
        const amp = (audio.frequencyData[idx] / 255) * (110 + audio.bass * 120);
        const y = h * 0.5 + Math.sin(x * 0.01 + t * 3.5) * amp;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  },

  // 15. Neptune Flow
  {
    id: 15,
    name: "Neptune Flow",
    category: "waves",
    engineType: "canvas2d",
    description: "Deep oceanic multi-tone current ribbons",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(1, 8, 18, 0.25)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 6; i++) {
        const hue = (190 + i * 18 + audio.treble * 50) % 360;
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.45)`;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 15) {
          const y = h * (0.35 + i * 0.09) + Math.sin(x * 0.009 + t * (1.2 + i * 0.3)) * (35 + audio.bass * 50);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.fill();
      }
    }
  },

  // 16. Chladni Plate Waves
  {
    id: 16,
    name: "Chladni Plate Waves",
    category: "waves",
    engineType: "canvas2d",
    description: "Nodal lines on acoustic vibrating resonant plate",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#04050a";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const m = 3 + Math.floor(audio.bass * 4);
      const n = 2 + Math.floor(audio.treble * 4);
      const step = 16;

      ctx.fillStyle = "#00f3ff";

      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          const nx = (x / w) * Math.PI;
          const ny = (y / h) * Math.PI;

          const val = Math.sin(n * nx) * Math.sin(m * ny) - Math.sin(m * nx) * Math.sin(n * ny);
          if (Math.abs(val) < 0.28) {
            ctx.beginPath();
            ctx.arc(x, y, 3 + audio.bass * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();
    }
  },

  // 17. Damped Pendulum Waves
  {
    id: 17,
    name: "Damped Pendulum Waves",
    category: "waves",
    engineType: "canvas2d",
    description: "Phasing wave array of acoustic pendulums",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(3, 4, 10, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const count = 35;
      for (let i = 0; i < count; i++) {
        const x = (i / count) * w + 15;
        const freq = 1 + i * 0.05;
        const y = h * 0.5 + Math.sin(t * freq * 2.2 + audio.bass) * (140 + audio.mid * 90);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, y);
        ctx.stroke();

        const hue = (i * 10 + audio.treble * 120) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;

        ctx.beginPath();
        ctx.arc(x, y, 9 + audio.bass * 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
  },

  // 18. Rotating Lissajous Grid
  {
    id: 18,
    name: "Rotating Lissajous Grid",
    category: "waves",
    engineType: "canvas2d",
    description: "Nested rotating Lissajous square lattice",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020308";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const squares = 24;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = 1; i <= squares; i++) {
        const r = i * 16 + Math.sin(t * 2 + i * 0.2) * (15 + audio.bass * 30);
        const angle = t * (0.5 + i * 0.05);

        const hue = (i * 20 + audio.treble * 120) % 360;
        ctx.strokeStyle = `hsla(${hue}, 95%, 65%, 0.7)`;
        ctx.lineWidth = 3.5;

        ctx.strokeRect(cx - r + Math.sin(angle) * 25, cy - r + Math.cos(angle) * 25, r * 2, r * 2);
      }
      ctx.restore();
    }
  },

  // 19. Eulerian Fluid Grid (HYPER ADVANCED GLOWING VECTOR FIELD)
  {
    id: 19,
    name: "Eulerian Fluid Grid",
    category: "waves",
    engineType: "canvas2d",
    description: "High-density glowing velocity vector field fluid simulation",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 3, 8, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const step = 24;
      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          const u = x / w;
          const v = y / h;

          const vx = Math.sin(y * 0.015 + t * 2.5 + audio.bass * 3) * (20 + audio.bass * 35);
          const vy = Math.cos(x * 0.015 + t * 2.5 + audio.mid * 3) * (20 + audio.mid * 35);

          const hue = (160 + u * 120 + v * 120 + audio.treble * 140) % 360;
          ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${0.6 + audio.bass * 0.4})`;
          ctx.lineWidth = 2.5 + audio.bass * 2.5;

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + vx, y + vy);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  },

  // 20. Tidal Horizon
  {
    id: 20,
    name: "Tidal Horizon",
    category: "waves",
    engineType: "canvas2d",
    description: "Dual opposing wave horizon with solar reflection",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#04020a";
      ctx.fillRect(0, 0, w, h);

      // Sun
      const grad = ctx.createRadialGradient(w / 2, h * 0.38, 10, w / 2, h * 0.38, 140);
      grad.addColorStop(0, "#ff00a0");
      grad.addColorStop(0.5, "#f59e0b");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.38, 140 + audio.bass * 40, 0, Math.PI * 2);
      ctx.fill();

      // Mirror waves
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 3;

      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = h * 0.58 + Math.sin(x * 0.018 + t * 3.5) * (25 + audio.bass * 50);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }
];

/* AuraSonic Group E: Abstract, Organic & Dancing Characters (Patterns 81–100) */

export const groupEPatterns = [
  // 81. Bioluminescent Flora
  {
    id: 81,
    name: "Bioluminescent Flora",
    category: "organic",
    engineType: "canvas2d",
    description: "Audio-blooming organic tendrils & glowing flowers",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 5, 8, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const petals = 12;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.translate(cx, cy);

      for (let p = 0; p < petals; p++) {
        ctx.rotate((Math.PI * 2) / petals);
        const len = 130 + audio.bass * 90;

        const hue = (150 + p * 15 + audio.treble * 80) % 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 65%, 0.8)`;
        ctx.lineWidth = 3.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(45, len / 2, 0, len);
        ctx.stroke();

        ctx.fillStyle = "#00ff88";
        ctx.beginPath();
        ctx.arc(0, len, 7 + audio.treble * 9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  },

  // 82. Lissajous Curves 3D
  {
    id: 82,
    name: "Lissajous Curves 3D",
    category: "organic",
    engineType: "canvas2d",
    description: "Harmonic mathematical parametric knots",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 2, 9, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const points = 320;

      const a = 3 + Math.floor(audio.bass * 3);
      const b = 4 + Math.floor(audio.mid * 3);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const hue = (t * 40) % 360;
      ctx.strokeStyle = `hsla(${hue}, 100%, 65%, 0.85)`;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 18;
      ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;

      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const u = (i / points) * Math.PI * 2;
        const x = Math.sin(a * u + t) * (190 + audio.bass * 50);
        const y = Math.sin(b * u) * (190 + audio.bass * 50);

        if (i === 0) ctx.moveTo(cx + x, cy + y);
        else ctx.lineTo(cx + x, cy + y);
      }
      ctx.stroke();
      ctx.restore();
    }
  },

  // 83. Perlin Noise Lava
  {
    id: 83,
    name: "Perlin Noise Lava",
    category: "organic",
    engineType: "canvas2d",
    description: "Organic metaball fluid blobs merging and morphing",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(6, 2, 4, 0.25)";
      ctx.fillRect(0, 0, w, h);

      if (!this.blobs) {
        this.blobs = Array.from({ length: 10 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 45 + Math.random() * 45,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3
        }));
      }

      this.blobs.forEach((b, idx) => {
        b.x += b.vx * (1 + audio.bass * 2.5);
        b.y += b.vy * (1 + audio.bass * 2.5);

        if (b.x < 0 || b.x > w) b.vx *= -1;
        if (b.y < 0 || b.y > h) b.vy *= -1;

        const grad = ctx.createRadialGradient(b.x, b.y, 5, b.x, b.y, b.r + audio.bass * 35);
        grad.addColorStop(0, "rgba(255, 0, 160, 0.85)");
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r + audio.bass * 35, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  },

  // 84. Audio Spectrogram Cloud
  {
    id: 84,
    name: "Audio Spectrogram Cloud",
    category: "organic",
    engineType: "canvas2d",
    description: "3D terrain mesh formed by audio history",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020409";
      ctx.fillRect(0, 0, w, h);

      const rows = 14;
      for (let r = 0; r < rows; r++) {
        const y = h * 0.28 + r * 32;
        const hue = (200 + r * 12) % 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${1 - r / rows})`;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 12) {
          const idx = Math.floor((x / w) * 64);
          const val = audio.frequencyData[idx] / 255;
          const py = y - val * 70 * (1 - r * 0.05);

          if (x === 0) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.stroke();
      }
    }
  },

  // 85. Holographic Energy Shield
  {
    id: 85,
    name: "Holographic Energy Shield",
    category: "organic",
    engineType: "canvas2d",
    description: "Hexagonal forcefield pulsating on sound waves",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020610";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = 175 + audio.bass * 50;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(0, 243, 255, 0.8)";
      ctx.lineWidth = 3.5;
      ctx.shadowBlur = 25;
      ctx.shadowColor = "#00f3ff";

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 0.25;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  },

  // 86. Minimalist Orbital Rings
  {
    id: 86,
    name: "Minimalist Orbital Rings",
    category: "organic",
    engineType: "canvas2d",
    description: "Clean, ultra-sleek monochrome geometric orbits",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#040406";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const count = 6;

      for (let i = 1; i <= count; i++) {
        const r = i * 45 + audio.bass * 25;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 + (i / count) * 0.65})`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        const a = t * (i * 0.6);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  // 87. Cyberspace Cyber Grid
  {
    id: 87,
    name: "Cyberspace Cyber Grid",
    category: "organic",
    engineType: "canvas2d",
    description: "Retro-futuristic light grid with trail speed",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(5, 2, 10, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const step = 35;
      ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
      ctx.lineWidth = 1.5;

      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }
  },

  // 88. Organic Cell Mitosis
  {
    id: 88,
    name: "Organic Cell Mitosis",
    category: "organic",
    engineType: "canvas2d",
    description: "Splitting audio-reactive biological cells",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#030806";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const dist = Math.sin(t * 2.2) * (70 + audio.bass * 90);

      ctx.fillStyle = "rgba(0, 255, 136, 0.7)";
      ctx.beginPath();
      ctx.arc(cx - dist, cy, 65 + audio.bass * 20, 0, Math.PI * 2);
      ctx.arc(cx + dist, cy, 65 + audio.bass * 20, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // 89. Chladni Sound Patterns
  {
    id: 89,
    name: "Chladni Sound Patterns",
    category: "organic",
    engineType: "canvas2d",
    description: "Acoustic nodal sand plate vibrations",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#040409";
      ctx.fillRect(0, 0, w, h);

      const step = 14;
      ctx.fillStyle = "#ffffff";

      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          const val = Math.sin(x * 0.02 * (1 + audio.bass)) * Math.cos(y * 0.02 * (1 + audio.treble));
          if (Math.abs(val) < 0.16) {
            ctx.fillRect(x, y, 2.5, 2.5);
          }
        }
      }
    }
  },

  // 90. Hyper-Dimensional Wormhole
  {
    id: 90,
    name: "Hyper-Dimensional Wormhole",
    category: "organic",
    engineType: "canvas2d",
    description: "Tunnel of swirling geometric energy",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const rings = 14;

      for (let i = 0; i < rings; i++) {
        const r = (i * 22 + t * 45) % 260;
        ctx.strokeStyle = `hsla(${r * 1.2}, 100%, 60%, ${1 - r / 260})`;
        ctx.lineWidth = 3.5;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  },

  // 91. Dynamic Fluid Marble
  {
    id: 91,
    name: "Dynamic Fluid Marble",
    category: "organic",
    engineType: "canvas2d",
    description: "Swirling marble ink texture reacting to bass/mid",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#04030a";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 7; i++) {
        const hue = (260 + i * 22 + audio.treble * 80) % 360;
        ctx.strokeStyle = `hsla(${hue}, 90%, 65%, 0.6)`;
        ctx.lineWidth = 9;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 18) {
          const y = h * 0.5 + Math.sin(x * 0.012 + t * 2.2 + i) * (70 + audio.bass * 90);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  },

  // 92. Neural Brain Network
  {
    id: 92,
    name: "Neural Brain Network",
    category: "organic",
    engineType: "canvas2d",
    description: "Synapses firing on audio peaks",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#02040a";
      ctx.fillRect(0, 0, w, h);

      if (!this.synapses) {
        this.synapses = Array.from({ length: 45 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h
        }));
      }

      this.synapses.forEach(s => {
        ctx.fillStyle = audio.beat ? "#ff00a0" : "#00f3ff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4.5 + audio.bass * 7, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  },

  // 93. Morphing Superquadric Mesh
  {
    id: 93,
    name: "Morphing Superquadric Mesh",
    category: "organic",
    engineType: "canvas2d",
    description: "Mathematical 3D shape smoothly morphing exponent",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#040208";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = 145 + audio.bass * 60;

      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 3.5;

      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.04) {
        const x = Math.sign(Math.cos(a)) * Math.pow(Math.abs(Math.cos(a)), 1 + audio.mid) * r;
        const y = Math.sign(Math.sin(a)) * Math.pow(Math.abs(Math.sin(a)), 1 + audio.mid) * r;

        if (a === 0) ctx.moveTo(cx + x, cy + y);
        else ctx.lineTo(cx + x, cy + y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  },

  // 94. REALISTIC GIRL POP DANCER (Anatomical Female Silhouette Dance Motion)
  {
    id: 94,
    name: "Realistic Girl Pop Dancer",
    category: "organic",
    engineType: "canvas2d",
    description: "Anatomically detailed female pop dancer performing fluid body rolls & hip sways to beat",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020308";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.52;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // 1. Stage Floor Perspective Grid
      ctx.strokeStyle = "rgba(0, 243, 255, 0.25)";
      ctx.lineWidth = 1.5;
      const stageY = cy + 110;

      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 15, stageY);
        ctx.lineTo(cx + i * 90, h);
        ctx.stroke();
      }
      for (let y = stageY; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Stage Spotlights
      for (let i = -2; i <= 2; i += 2) {
        const spotX = cx + i * 180;
        const grad = ctx.createLinearGradient(spotX, 0, cx, stageY);
        const hue = (t * 30 + i * 40) % 360;
        grad.addColorStop(0, `hsla(${hue}, 100%, 65%, 0.4)`);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(spotX - 30, 0);
        ctx.lineTo(spotX + 30, 0);
        ctx.lineTo(cx + 60, stageY);
        ctx.lineTo(cx - 60, stageY);
        ctx.closePath();
        ctx.fill();
      }

      // 3. Realistic Female Silhouette Pose Math
      const tempo = t * 5.5;
      const hipSway = Math.sin(tempo) * 28 * (1 + audio.bass * 0.8);
      const bodyRoll = Math.cos(tempo * 0.5) * 15;
      const jumpBounce = Math.abs(Math.sin(tempo * 2)) * 25 * audio.bass;

      const girlY = cy - jumpBounce;
      const girlX = cx + Math.sin(tempo * 0.5) * 20;

      const hue = (t * 45 + audio.treble * 140) % 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
      ctx.strokeStyle = `hsl(${hue}, 100%, 65%)`;
      ctx.shadowBlur = 30;
      ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;

      // Flowing Hair
      const hairSway = Math.cos(tempo * 1.5) * 25;
      ctx.beginPath();
      ctx.moveTo(girlX, girlY - 120);
      ctx.quadraticCurveTo(girlX - 45 + hairSway, girlY - 90, girlX - 55 + hairSway, girlY - 40);
      ctx.quadraticCurveTo(girlX - 30, girlY - 70, girlX, girlY - 110);
      ctx.fill();

      // Head Oval
      ctx.beginPath();
      ctx.ellipse(girlX, girlY - 115, 15, 19, bodyRoll * 0.02, 0, Math.PI * 2);
      ctx.fill();

      // Graceful Neck
      ctx.beginPath();
      ctx.moveTo(girlX - 6, girlY - 98);
      ctx.lineTo(girlX + 6, girlY - 98);
      ctx.lineTo(girlX + 9, girlY - 82);
      ctx.lineTo(girlX - 9, girlY - 82);
      ctx.closePath();
      ctx.fill();

      // Contoured Bust & Torso
      ctx.beginPath();
      ctx.moveTo(girlX - 22, girlY - 82); // L Shoulder
      ctx.quadraticCurveTo(girlX - 28, girlY - 60, girlX - 16 + hipSway * 0.3, girlY - 40); // Bust to Waist
      ctx.quadraticCurveTo(girlX - 26 + hipSway, girlY - 10, girlX - 22 + hipSway, girlY + 15); // Hip Curve
      ctx.lineTo(girlX + 22 + hipSway, girlY + 15);
      ctx.quadraticCurveTo(girlX + 26 + hipSway, girlY - 10, girlX + 16 + hipSway * 0.3, girlY - 40);
      ctx.quadraticCurveTo(girlX + 28, girlY - 60, girlX + 22, girlY - 82);
      ctx.closePath();
      ctx.fill();

      // Left Arm (Fluid Wave)
      const armL_angle = Math.sin(tempo) * 1.2;
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(girlX - 22, girlY - 80);
      ctx.quadraticCurveTo(girlX - 55, girlY - 60 + armL_angle * 30, girlX - 70 - Math.cos(tempo) * 20, girlY - 110 - armL_angle * 40);
      ctx.stroke();

      // Right Arm (Hip Pose or Wave)
      ctx.beginPath();
      ctx.moveTo(girlX + 22, girlY - 80);
      ctx.quadraticCurveTo(girlX + 50, girlY - 50 - armL_angle * 30, girlX + 65 + Math.sin(tempo) * 20, girlY - 90 + armL_angle * 30);
      ctx.stroke();

      // Left Leg (Stretched Bended Knee)
      ctx.beginPath();
      ctx.moveTo(girlX - 16 + hipSway, girlY + 15);
      ctx.quadraticCurveTo(girlX - 35 + hipSway, girlY + 60, girlX - 25, stageY);
      ctx.stroke();

      // Right Leg (Stepping Tapping Knee)
      ctx.beginPath();
      ctx.moveTo(girlX + 16 + hipSway, girlY + 15);
      ctx.quadraticCurveTo(girlX + 35 + Math.sin(tempo) * 25, girlY + 55, girlX + 25 + Math.sin(tempo) * 15, stageY);
      ctx.stroke();

      // Foot Ripple Impact on Stage
      if (audio.beat) {
        ctx.strokeStyle = "#00f3ff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(girlX, stageY, 50 * audio.bass, 12 * audio.bass, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }
  },

  // 95. CYBERPUNK NEON GIRL DANCER (Holographic Girl Silhouette Stage)
  {
    id: 95,
    name: "Cyberpunk Neon Girl Dancer",
    category: "organic",
    engineType: "canvas2d",
    description: "Holographic glowing neon female dancer silhouette with laser stage beams",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#04010a";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.54;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Background Laser Beams
      const beams = 18;
      for (let i = 0; i < beams; i++) {
        const a = (i / beams) * Math.PI - Math.PI / 2;
        const val = audio.frequencyData[i * 4] / 255;
        const len = 220 + val * 300;

        ctx.strokeStyle = `hsla(${300 + i * 15 + t * 40}, 100%, 65%, 0.4)`;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy + 90);
        ctx.lineTo(cx + Math.sin(a + Math.sin(t * 2) * 0.2) * len, cy + 90 - Math.cos(a + Math.sin(t * 2) * 0.2) * len);
        ctx.stroke();
      }

      // Dancing Silhouette Figure
      const danceCycle = t * 6;
      const armPump = Math.sin(danceCycle) * 35 * (1 + audio.bass);
      const hipSway = Math.cos(danceCycle * 0.5) * 22;

      ctx.fillStyle = "#ff00a0";
      ctx.strokeStyle = "#ff00a0";
      ctx.shadowBlur = 35;
      ctx.shadowColor = "#ff00a0";

      // Head
      ctx.beginPath();
      ctx.ellipse(cx + hipSway * 0.2, cy - 110, 14, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Flowing Hair
      ctx.beginPath();
      ctx.moveTo(cx + hipSway * 0.2, cy - 110);
      ctx.quadraticCurveTo(cx + 35 + Math.sin(danceCycle) * 20, cy - 80, cx + 45 + Math.sin(danceCycle) * 20, cy - 30);
      ctx.stroke();

      // Torso & Waist Contour
      ctx.beginPath();
      ctx.moveTo(cx - 18, cy - 85);
      ctx.quadraticCurveTo(cx - 24, cy - 65, cx - 12 + hipSway * 0.4, cy - 45);
      ctx.quadraticCurveTo(cx - 24 + hipSway, cy - 20, cx - 20 + hipSway, cy + 10);
      ctx.lineTo(cx + 20 + hipSway, cy + 10);
      ctx.quadraticCurveTo(cx + 24 + hipSway, cy - 20, cx + 12 + hipSway * 0.4, cy - 45);
      ctx.quadraticCurveTo(cx + 24, cy - 65, cx + 18, cy - 85);
      ctx.closePath();
      ctx.fill();

      // Waving Arms
      ctx.lineWidth = 10;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(cx - 18, cy - 85);
      ctx.quadraticCurveTo(cx - 50, cy - 110 - armPump, cx - 65, cy - 130 - armPump);
      ctx.moveTo(cx + 18, cy - 85);
      ctx.quadraticCurveTo(cx + 50, cy - 70 + armPump, cx + 65, cy - 110 + armPump);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(cx - 15 + hipSway, cy + 10);
      ctx.lineTo(cx - 30, cy + 90);
      ctx.moveTo(cx + 15 + hipSway, cy + 10);
      ctx.lineTo(cx + 30 + Math.sin(danceCycle) * 15, cy + 90);
      ctx.stroke();

      ctx.restore();
    }
  },

  // 96. PSYCHEDELIC HYPNO TUNNEL (Mind-Bending Trippy Optical Illusion)
  {
    id: 96,
    name: "Psychedelic Hypno Tunnel",
    category: "organic",
    engineType: "canvas2d",
    description: "Infinite spiraling optical illusion vortex warping space and colors to sound",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 1, 6, 0.2)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const rings = 28;
      const arms = 16;
      const spin = t * 1.5 + audio.bass * 2;

      for (let r = 0; r < rings; r++) {
        const radius = (r * 22 + t * 65 + audio.bass * 80) % (Math.max(w, h) * 0.7);
        const alpha = 1 - radius / (Math.max(w, h) * 0.7);

        for (let a = 0; a < arms; a++) {
          const angle = (a / arms) * Math.PI * 2 + spin + r * 0.12;
          const hue = (r * 18 + a * 20 + t * 50 + audio.treble * 150) % 360;

          const px = cx + Math.cos(angle) * radius;
          const py = cy + Math.sin(angle) * radius;

          ctx.fillStyle = `hsla(${hue}, 100%, 65%, ${alpha * 0.9})`;

          const dotSize = (4 + (radius / 30)) * (1 + audio.frequencyData[(a * 4) % 64] / 255);
          ctx.beginPath();
          ctx.arc(px, py, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // Connecting Trippy Star Polygon Ring
        const hueRing = (r * 25 + t * 40) % 360;
        ctx.strokeStyle = `hsla(${hueRing}, 100%, 60%, ${alpha * 0.6})`;
        ctx.lineWidth = 2.5 + audio.bass * 3;

        ctx.beginPath();
        for (let a = 0; a <= arms; a++) {
          const angle = (a / arms) * Math.PI * 2 + spin + r * 0.12;
          const wave = Math.sin(angle * 4 + t * 5) * (15 + audio.mid * 40);
          const px = cx + Math.cos(angle) * (radius + wave);
          const py = cy + Math.sin(angle) * (radius + wave);

          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
    }
  },

  // 97. TRIPPY KALEIDOSCOPIC MANDALA (12-Fold Symmetrical Psychedelic Geometry)
  {
    id: 97,
    name: "Trippy Kaleidoscopic Mandala",
    category: "organic",
    engineType: "canvas2d",
    description: "12-fold symmetrical kaleidoscopic mandala expanding and folding on beat",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 2, 10, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const symmetry = 12;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.translate(cx, cy);

      for (let s = 0; s < symmetry; s++) {
        ctx.rotate((Math.PI * 2) / symmetry);

        const hue = (s * 30 + t * 60 + audio.treble * 160) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 65%)`;
        ctx.lineWidth = 3.5;

        ctx.beginPath();
        ctx.moveTo(0, 0);

        const count = 40;
        for (let i = 1; i <= count; i++) {
          const r = i * 7 + audio.bass * 30;
          const angle = Math.sin(i * 0.25 + t * 2.5) * (1.2 + audio.mid);
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;

          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.restore();
    }
  },

  // 98. MIND-BENDING LIQUID ACID WARP (Psychedelic RGB Noise Fluid Matrix)
  {
    id: 98,
    name: "Mind-Bending Liquid Acid Warp",
    category: "organic",
    engineType: "canvas2d",
    description: "Acid-wash liquid vortex matrix with swirling RGB noise contours and bass waves",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 3, 9, 0.2)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const rings = 22;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let r = 1; r <= rings; r++) {
        const radius = r * 16 + Math.sin(t * 3 + r * 0.4) * (20 + audio.bass * 50);
        const hue = (r * 16 + t * 70 + audio.treble * 180) % 360;

        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
        ctx.lineWidth = 4 + audio.bass * 4;

        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.08) {
          const noise1 = Math.sin(a * 5 + t * 3 + r) * (15 + audio.mid * 40);
          const noise2 = Math.cos(a * 8 - t * 2) * (10 + audio.bass * 30);
          const pr = radius + noise1 + noise2;

          const px = cx + Math.cos(a) * pr;
          const py = cy + Math.sin(a) * pr;

          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
    }
  },

  // 99. OPTICAL ILLUSION BLACK HOLE EVENT HORIZON
  {
    id: 99,
    name: "Optical Illusion Black Hole Event Horizon",
    category: "organic",
    engineType: "canvas2d",
    description: "Swirling rainbow gravity event horizon pulling light rays into central singularity",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#010105";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Swirling Light Rays
      const rays = 32;
      for (let i = 0; i < rays; i++) {
        const rayAngle = (i / rays) * Math.PI * 2 + t * 1.2;
        const hue = (i * 12 + t * 80 + audio.treble * 150) % 360;

        ctx.strokeStyle = `hsla(${hue}, 100%, 65%, 0.75)`;
        ctx.lineWidth = 3;

        ctx.beginPath();
        for (let r = Math.min(w, h) * 0.48; r > 35; r -= 6) {
          const twist = (1 / (r * 0.03)) * (2.5 + audio.bass * 2);
          const px = cx + Math.cos(rayAngle + twist) * r;
          const py = cy + Math.sin(rayAngle + twist) * r;

          if (r === Math.min(w, h) * 0.48) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Singularity Core Black Circle
      ctx.fillStyle = "#000000";
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#00f3ff";
      ctx.beginPath();
      ctx.arc(cx, cy, 35 + audio.bass * 25, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Core Ring
      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, cy, 35 + audio.bass * 25, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }
  },

  // 100. TRIPPY COSMIC VORTEX & DANCER (Master Psychedelic Finale)
  {
    id: 100,
    name: "Trippy Cosmic Vortex & Dancer",
    category: "organic",
    engineType: "canvas2d",
    description: "Master trippy finale combining infinite psychedelic hypno tunnel & glowing neon b-boy dancer",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 1, 8, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // 1. Infinite Psychedelic Spiral Rings
      const rings = 16;
      for (let i = 1; i <= rings; i++) {
        const r = (i * 24 + t * 60) % (Math.min(w, h) * 0.55);
        const hue = (i * 22 + t * 90 + audio.treble * 160) % 360;

        ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${1 - r / (Math.min(w, h) * 0.55)})`;
        ctx.lineWidth = 3.5;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;

        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          const wave = Math.sin(a * 6 + t * 4) * (12 + audio.bass * 35);
          const px = cx + Math.cos(a + t) * (r + wave);
          const py = cy + Math.sin(a + t) * (r + wave);

          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // 2. Glowing Center Dancer Figure
      const danceCycle = t * 6;
      const dancerY = cy + Math.sin(danceCycle * 2) * 15;

      ctx.fillStyle = "#00ff88";
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 5;
      ctx.shadowBlur = 25;
      ctx.shadowColor = "#00ff88";

      // Head
      ctx.beginPath();
      ctx.arc(cx, dancerY - 50, 14, 0, Math.PI * 2);
      ctx.fill();

      // Spine & Limbs
      ctx.beginPath();
      ctx.moveTo(cx, dancerY - 36);
      ctx.lineTo(cx, dancerY + 20);
      ctx.stroke();

      // Arms
      ctx.beginPath();
      ctx.moveTo(cx, dancerY - 25);
      ctx.lineTo(cx - 35, dancerY - 50 + Math.cos(danceCycle) * 30);
      ctx.moveTo(cx, dancerY - 25);
      ctx.lineTo(cx + 35, dancerY - 50 - Math.cos(danceCycle) * 30);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(cx, dancerY + 20);
      ctx.lineTo(cx - 25, dancerY + 65 + Math.sin(danceCycle * 1.5) * 20);
      ctx.moveTo(cx, dancerY + 20);
      ctx.lineTo(cx + 25, dancerY + 65 - Math.sin(danceCycle * 1.5) * 20);
      ctx.restore();
    }
  },

  // 101. YOUTUBE SYNTHWAVE CYBER-STAGE (Modern Music Video Stage Visualizer)
  {
    id: 101,
    name: "YouTube Synthwave Cyber-Stage",
    category: "organic",
    engineType: "canvas2d",
    description: "Modern music video concert stage with backlit dancer, laser equalizer rays & perspective grid floor",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020208";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.52;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // 1. Synthwave Grid Floor
      const stageY = cy + 100;
      ctx.strokeStyle = "rgba(255, 0, 160, 0.4)";
      ctx.lineWidth = 2;

      for (let i = -12; i <= 12; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 12, stageY);
        ctx.lineTo(cx + i * 110, h);
        ctx.stroke();
      }
      for (let y = stageY; y < h; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Audio Equalizer Laser Beams
      const beams = 24;
      for (let i = 0; i < beams; i++) {
        const a = (i / beams) * Math.PI - Math.PI / 2;
        const val = audio.frequencyData[i * 4] / 255;
        const len = 180 + val * 320;

        const hue = (i * 15 + t * 40) % 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.45)`;
        ctx.lineWidth = 3.5;

        ctx.beginPath();
        ctx.moveTo(cx, stageY);
        ctx.lineTo(cx + Math.sin(a) * len, stageY - Math.cos(a) * len);
        ctx.stroke();
      }

      // 3. Backlit Cyber Girl Dancer
      const move = t * 6;
      const armPump = Math.sin(move) * 30 * (1 + audio.bass);
      const hipSway = Math.cos(move * 0.5) * 20;

      ctx.fillStyle = "#00f3ff";
      ctx.strokeStyle = "#00f3ff";
      ctx.shadowBlur = 35;
      ctx.shadowColor = "#00f3ff";

      // Head & Hair
      ctx.beginPath();
      ctx.ellipse(cx + hipSway * 0.2, cy - 110, 14, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Flowing Hair
      ctx.beginPath();
      ctx.moveTo(cx + hipSway * 0.2, cy - 110);
      ctx.quadraticCurveTo(cx + 35 + Math.sin(move) * 20, cy - 80, cx + 45 + Math.sin(move) * 20, cy - 30);
      ctx.stroke();

      // Torso Contour
      ctx.beginPath();
      ctx.moveTo(cx - 18, cy - 85);
      ctx.quadraticCurveTo(cx - 24, cy - 65, cx - 12 + hipSway * 0.4, cy - 45);
      ctx.quadraticCurveTo(cx - 24 + hipSway, cy - 20, cx - 20 + hipSway, cy + 10);
      ctx.lineTo(cx + 20 + hipSway, cy + 10);
      ctx.quadraticCurveTo(cx + 24 + hipSway, cy - 20, cx + 12 + hipSway * 0.4, cy - 45);
      ctx.quadraticCurveTo(cx + 24, cy - 65, cx + 18, cy - 85);
      ctx.closePath();
      ctx.fill();

      // Waving Arms
      ctx.lineWidth = 10;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(cx - 18, cy - 85);
      ctx.quadraticCurveTo(cx - 50, cy - 110 - armPump, cx - 65, cy - 130 - armPump);
      ctx.moveTo(cx + 18, cy - 85);
      ctx.quadraticCurveTo(cx + 50, cy - 70 + armPump, cx + 65, cy - 110 + armPump);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(cx - 15 + hipSway, cy + 10);
      ctx.lineTo(cx - 30, stageY);
      ctx.moveTo(cx + 15 + hipSway, cy + 10);
      ctx.lineTo(cx + 30 + Math.sin(move) * 15, stageY);
      ctx.stroke();

      ctx.restore();
    }
  },

  // 102. INFINITE PSYCHEDELIC MORPH GENERATOR
  {
    id: 102,
    name: "Infinite Psychedelic Morph Generator",
    category: "organic",
    engineType: "canvas2d",
    description: "Algorithmic infinite trippy shape morphing dynamically with audio frequencies",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(1, 2, 7, 0.22)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const layers = 10;
      for (let l = 1; l <= layers; l++) {
        const radius = l * 28 + Math.sin(t * 2 + l) * (30 + audio.bass * 60);
        const hue = (l * 35 + t * 80 + audio.treble * 140) % 360;

        ctx.strokeStyle = `hsla(${hue}, 100%, 65%, 0.8)`;
        ctx.lineWidth = 3.5;
        ctx.shadowBlur = 18;
        ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;

        const n = 3 + (l % 7);
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.05) {
          const r = radius * (1 + Math.sin(n * a + t * 3) * (0.3 + audio.mid * 0.4));
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;

          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
    }
  },

  // 103. TORUS KNOT HYPNO WARP 3D
  {
    id: 103,
    name: "Torus Knot Hypno Warp 3D",
    category: "organic",
    engineType: "canvas2d",
    description: "Dynamic 3D parametric torus knot undulating in space to pitch & sub-bass",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 2, 8, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const points = 350;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const hue = (t * 50 + audio.treble * 180) % 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 65%)`;
      ctx.lineWidth = 3.5;
      ctx.shadowBlur = 20;
      ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;

      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const u = (i / points) * Math.PI * 2 * 3;
        const p = 2;
        const q = 3;
        const r = 130 + Math.sin(u * 5 + t * 4) * (30 + audio.bass * 50);

        const x = Math.cos(p * u) * (r + Math.cos(q * u) * 40);
        const y = Math.sin(p * u) * (r + Math.cos(q * u) * 40);

        if (i === 0) ctx.moveTo(cx + x, cy + y);
        else ctx.lineTo(cx + x, cy + y);
      }
      ctx.stroke();
      ctx.restore();
    }
  },

  // 104. ACID RAINBOW SPECTRUM VORTEX
  {
    id: 104,
    name: "Acid Rainbow Spectrum Vortex",
    category: "organic",
    engineType: "canvas2d",
    description: "High-speed swirling acid rainbow fluid vortex with intense chromatic vibration",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const spirals = 20;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let s = 0; s < spirals; s++) {
        const startAngle = (s / spirals) * Math.PI * 2;
        const hue = (s * 18 + t * 90 + audio.treble * 160) % 360;

        ctx.strokeStyle = `hsla(${hue}, 100%, 65%, 0.85)`;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 18;
        ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;

        ctx.beginPath();
        for (let r = 10; r < Math.min(w, h) * 0.48; r += 5) {
          const angle = startAngle + r * 0.02 + t * 2.5;
          const px = cx + Math.cos(angle) * (r + audio.bass * 40);
          const py = cy + Math.sin(angle) * (r + audio.bass * 40);

          if (r === 10) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  // 105. INFINITE PROCEDURAL TRIPPY MODE (UNLIMITED ALGORITHMIC GENERATOR)
  {
    id: 105,
    name: "∞ Infinite Procedural Trippy Mode",
    category: "organic",
    engineType: "canvas2d",
    description: "Unlimited algorithmic generator combining infinite math equations and trippy color fields",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(1, 1, 5, 0.22)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Procedural Seed based on Time and Bass Beats
      const seed = Math.floor(t * 0.2);
      const eqType = seed % 4;

      const layers = 14;
      for (let l = 1; l <= layers; l++) {
        const hue = (l * 25 + t * 100 + audio.treble * 200 + seed * 50) % 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 65%, 0.8)`;
        ctx.lineWidth = 3.5 + audio.bass * 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;

        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.06) {
          let r = l * 20 + audio.bass * 40;
          if (eqType === 0) {
            r += Math.sin(a * (3 + (seed % 5)) + t * 3) * (20 + audio.mid * 50);
          } else if (eqType === 1) {
            r += Math.cos(a * (4 + (seed % 4)) - t * 4) * (25 + audio.treble * 60);
          } else if (eqType === 2) {
            r += Math.tan(Math.sin(a * 2 + t)) * (10 + audio.bass * 30);
          } else {
            r += (Math.sin(a * 5) + Math.cos(a * 3)) * (20 + audio.mid * 40);
          }

          const px = cx + Math.cos(a + t * 0.5) * r;
          const py = cy + Math.sin(a + t * 0.5) * r;

          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
    }
  },

  // 106. CYBERPUNK MATRIX RAIN & VOLUMETRIC HOLOGRAM
  {
    id: 106,
    name: "Cyberpunk Matrix Rain & Hologram",
    category: "organic",
    engineType: "canvas2d",
    description: "Cascading digital Matrix glyph rain reacting to sub-bass & treble shockwaves",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(1, 4, 3, 0.25)";
      ctx.fillRect(0, 0, w, h);

      if (!this.columns) {
        const cols = Math.floor(w / 20);
        this.columns = Array.from({ length: cols }, () => ({
          y: Math.random() * h,
          speed: 4 + Math.random() * 8
        }));
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.font = "16px monospace";

      const charSet = "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ";
      this.columns.forEach((col, i) => {
        col.y += (col.speed + audio.bass * 12);
        if (col.y > h) col.y = 0;

        const x = i * 20;
        const val = audio.frequencyData[(i * 3) % audio.frequencyData.length] / 255;

        const hue = (140 + val * 120 + audio.treble * 80) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, ${60 + val * 35}%)`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;

        const char = charSet[Math.floor(Math.random() * charSet.length)];
        ctx.fillText(char, x, col.y);
      });

      ctx.restore();
    }
  },

  // 107. QUANTUM PARTICLE CONSTELLATION SPHERE
  {
    id: 107,
    name: "Quantum Particle Constellation Sphere",
    category: "organic",
    engineType: "canvas2d",
    description: "3D rotating quantum particle sphere connected by dynamic laser filaments",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(3, 4, 12, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = 160 + audio.bass * 50;

      if (!this.nodes) {
        this.nodes = Array.from({ length: 65 }, () => ({
          theta: Math.random() * Math.PI * 2,
          phi: Math.acos(2 * Math.random() - 1)
        }));
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const proj = [];
      this.nodes.forEach(node => {
        const theta = node.theta + t * 0.4;
        const phi = node.phi + t * 0.2;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        const px = cx + x;
        const py = cy + y;
        proj.push({ x: px, y: py, z });
      });

      // Draw Laser Filaments
      ctx.strokeStyle = "rgba(0, 243, 255, 0.35)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < proj.length; i++) {
        for (let j = i + 1; j < proj.length; j++) {
          const d = Math.hypot(proj[i].x - proj[j].x, proj[i].y - proj[j].y);
          if (d < 95 + audio.bass * 40) {
            ctx.beginPath();
            ctx.moveTo(proj[i].x, proj[i].y);
            ctx.lineTo(proj[j].x, proj[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      proj.forEach(p => {
        const hue = (190 + audio.treble * 140) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 + audio.bass * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }
  },

  // 108. GLASSMORPHIC KINETIC EQUALIZER
  {
    id: 108,
    name: "Glassmorphic Kinetic Equalizer",
    category: "organic",
    engineType: "canvas2d",
    description: "Translucent glassmorphic 3D floating cards with liquid spectrum interior fills",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#030409";
      ctx.fillRect(0, 0, w, h);

      const cards = 16;
      const cardW = (w - 120) / cards;

      for (let i = 0; i < cards; i++) {
        const val = audio.frequencyData[i * 6] / 255;
        const cardH = 80 + val * (h * 0.55);

        const x = 60 + i * cardW;
        const y = h * 0.5 - cardH / 2;

        const hue = (240 + i * 8 + audio.treble * 80) % 360;

        // Glassmorphic Card Shadow & Glow
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.7)`;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.roundRect(x + 4, y, cardW - 8, cardH, 12);
        ctx.fill();
        ctx.stroke();

        // Inner Liquid Fill
        const fillH = cardH * val;
        ctx.fillStyle = `hsla(${hue}, 100%, 55%, 0.4)`;
        ctx.beginPath();
        ctx.roundRect(x + 6, y + cardH - fillH, cardW - 12, fillH, [0, 0, 10, 10]);
        ctx.fill();
      }
    }
  },

  // 109. HYPER-SPEED HYPERSPACE JUMP
  {
    id: 109,
    name: "Hyper-Speed Hyperspace Jump",
    category: "organic",
    engineType: "canvas2d",
    description: "Warp speed starfield acceleration trails elongating to audio transients",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(1, 1, 6, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      if (!this.stars) {
        this.stars = Array.from({ length: 180 }, () => ({
          x: (Math.random() - 0.5) * w,
          y: (Math.random() - 0.5) * h,
          z: Math.random() * w
        }));
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const speed = 12 + audio.bass * 35;
      this.stars.forEach(s => {
        s.z -= speed;
        if (s.z <= 0) s.z = w;

        const k = 250 / s.z;
        const px = cx + s.x * k;
        const py = cy + s.y * k;

        const prevK = 250 / (s.z + speed * 1.8);
        const prevPx = cx + s.x * prevK;
        const prevPy = cy + s.y * prevK;

        const hue = (190 + s.z * 0.4 + audio.treble * 120) % 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.85)`;
        ctx.lineWidth = 2 + (1 - s.z / w) * 4;

        ctx.beginPath();
        ctx.moveTo(prevPx, prevPy);
        ctx.lineTo(px, py);
        ctx.stroke();
      });

      ctx.restore();
    }
  },

  // 110. NEO-TOKYO CYBER GRID HORIZON
  {
    id: 110,
    name: "Neo-Tokyo Cyber Grid Horizon",
    category: "organic",
    engineType: "canvas2d",
    description: "Futuristic cyberpunk neon skyline with audio-reactive skyscraper equalizer lights",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020108";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.55;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Skyline Buildings
      const buildings = 28;
      const bW = w / buildings;

      for (let i = 0; i < buildings; i++) {
        const val = audio.frequencyData[i * 4] / 255;
        const bH = 60 + val * (h * 0.45);
        const bx = i * bW;
        const by = cy - bH;

        const hue = (280 + i * 5 + audio.treble * 80) % 360;
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.7)`;
        ctx.strokeStyle = `hsl(${hue}, 100%, 65%)`;
        ctx.lineWidth = 2;

        ctx.fillRect(bx + 2, by, bW - 4, bH);
        ctx.strokeRect(bx + 2, by, bW - 4, bH);
      }

      // Synthwave Horizon Grid
      ctx.strokeStyle = "#ff00a0";
      ctx.lineWidth = 2;
      for (let y = cy; y < h; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.restore();
    }
  }
];



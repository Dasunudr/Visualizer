/* AuraSonic Group F: Advanced Realistic Visualizers (Patterns 111–115) */

export const groupFPatterns = [
  // 111. CINEMATIC VOLUMETRIC PARTICLE STORM
  {
    id: 111,
    name: "Cinematic Volumetric Particle Storm",
    category: "advanced",
    engineType: "canvas2d",
    description: "Photorealistic volumetric particle dust storm with audio stage spotlights & depth fog",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#010206";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      if (!this.dust) {
        this.dust = Array.from({ length: 160 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 3 + 0.5,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          hue: 180 + Math.random() * 80
        }));
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // 1. Volumetric Light Cone
      for (let i = -2; i <= 2; i += 2) {
        const spotX = cx + i * 160;
        const grad = ctx.createLinearGradient(spotX, 0, cx, h);
        const hue = (200 + i * 25 + t * 20) % 360;
        grad.addColorStop(0, `hsla(${hue}, 100%, 65%, ${0.25 + audio.bass * 0.25})`);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(spotX - 40, 0);
        ctx.lineTo(spotX + 40, 0);
        ctx.lineTo(cx + 120, h);
        ctx.lineTo(cx - 120, h);
        ctx.closePath();
        ctx.fill();
      }

      // 2. Realistic Floating Particles
      this.dust.forEach(p => {
        p.x += p.vx * (1 + audio.mid * 2);
        p.y += p.vy * (1 + audio.mid * 2);

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const size = p.z * (1.5 + audio.bass * 1.2);
        const alpha = Math.min(1, 0.4 + p.z * 0.2);

        ctx.fillStyle = `hsla(${p.hue + audio.treble * 60}, 95%, 70%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }
  },

  // 112. PHOTOREALISTIC FLUID LIQUID DISTORTION
  {
    id: 112,
    name: "Photorealistic Fluid Liquid Distortion",
    category: "advanced",
    engineType: "canvas2d",
    description: "Realistic oil-on-water liquid marbling with surface tension & audio wave displacement",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#02040a";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const rings = 14;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let r = 1; r <= rings; r++) {
        const radius = r * 22 + Math.sin(t * 2 + r * 0.5) * (20 + audio.bass * 40);
        const hue = (190 + r * 14 + t * 40 + audio.treble * 120) % 360;

        ctx.strokeStyle = `hsla(${hue}, 95%, 65%, 0.75)`;
        ctx.lineWidth = 4 + audio.bass * 3;

        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.08) {
          const noise = Math.sin(a * 6 + t * 2.5 + r) * (18 + audio.mid * 35);
          const pr = radius + noise;
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

  // 113. 3D CYBERPUNK CONCERT STAGE & NEON GRID
  {
    id: 113,
    name: "3D Cyberpunk Concert Stage & Neon Grid",
    category: "advanced",
    engineType: "canvas2d",
    description: "Cinematic 3D concert stage featuring speaker towers, laser light beams & dancing silhouette",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020106";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.53;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // 1. Stage Floor Perspective Grid
      const stageY = cy + 90;
      ctx.strokeStyle = "rgba(0, 243, 255, 0.3)";
      ctx.lineWidth = 1.5;

      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 14, stageY);
        ctx.lineTo(cx + i * 95, h);
        ctx.stroke();
      }
      for (let y = stageY; y < h; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Speaker Towers Spectrum
      const towers = 12;
      const towerW = 22;
      for (let i = 0; i < towers; i++) {
        const val = audio.frequencyData[i * 4] / 255;
        const towerH = 50 + val * 160;
        const txL = cx - 180 - i * 26;
        const txR = cx + 180 + i * 26;

        ctx.fillStyle = "rgba(255, 0, 160, 0.4)";
        ctx.strokeStyle = "#ff00a0";
        ctx.lineWidth = 1.5;

        ctx.fillRect(txL, stageY - towerH, towerW, towerH);
        ctx.strokeRect(txL, stageY - towerH, towerW, towerH);

        ctx.fillRect(txR - towerW, stageY - towerH, towerW, towerH);
        ctx.strokeRect(txR - towerW, stageY - towerH, towerW, towerH);
      }

      // 3. Center Pop Girl Dancer
      const move = t * 6;
      const armPump = Math.sin(move) * 28 * (1 + audio.bass);
      const hipSway = Math.cos(move * 0.5) * 18;

      ctx.fillStyle = "#ff00a0";
      ctx.strokeStyle = "#ff00a0";
      ctx.shadowBlur = 25;
      ctx.shadowColor = "#ff00a0";

      // Head & Hair
      ctx.beginPath();
      ctx.ellipse(cx + hipSway * 0.2, cy - 100, 14, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body Contour
      ctx.beginPath();
      ctx.moveTo(cx - 18, cy - 80);
      ctx.quadraticCurveTo(cx - 24, cy - 60, cx - 12 + hipSway * 0.4, cy - 40);
      ctx.quadraticCurveTo(cx - 24 + hipSway, cy - 15, cx - 20 + hipSway, cy + 10);
      ctx.lineTo(cx + 20 + hipSway, cy + 10);
      ctx.quadraticCurveTo(cx + 24 + hipSway, cy - 15, cx + 12 + hipSway * 0.4, cy - 40);
      ctx.quadraticCurveTo(cx + 24, cy - 60, cx + 18, cy - 80);
      ctx.closePath();
      ctx.fill();

      // Arms
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - 18, cy - 80);
      ctx.quadraticCurveTo(cx - 45, cy - 100 - armPump, cx - 60, cy - 120 - armPump);
      ctx.moveTo(cx + 18, cy - 80);
      ctx.quadraticCurveTo(cx + 45, cy - 65 + armPump, cx + 60, cy - 100 + armPump);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(cx - 14 + hipSway, cy + 10);
      ctx.lineTo(cx - 25, stageY);
      ctx.moveTo(cx + 14 + hipSway, cy + 10);
      ctx.lineTo(cx + 25 + Math.sin(move) * 15, stageY);
      ctx.stroke();

      ctx.restore();
    }
  },

  // 114. COSMIC NEBULA STARFIELD & EVENT HORIZON
  {
    id: 114,
    name: "Cosmic Nebula Starfield & Event Horizon",
    category: "advanced",
    engineType: "canvas2d",
    description: "Cinematic deep space nebula cloud with glowing cosmic dust filaments & gravitational black hole ring",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#010206";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // 1. Swirling Cosmic Dust Filaments
      const arms = 12;
      for (let a = 0; a < arms; a++) {
        const startAngle = (a / arms) * Math.PI * 2 + t * 0.8;
        const hue = (a * 25 + t * 40 + audio.treble * 120) % 360;

        ctx.strokeStyle = `hsla(${hue}, 95%, 65%, 0.65)`;
        ctx.lineWidth = 3;

        ctx.beginPath();
        for (let r = 25; r < Math.min(w, h) * 0.48; r += 6) {
          const twist = r * 0.015 + Math.sin(r * 0.05 + t * 2) * 0.3;
          const px = cx + Math.cos(startAngle + twist) * (r + audio.bass * 30);
          const py = cy + Math.sin(startAngle + twist) * (r + audio.bass * 30);

          if (r === 25) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // 2. Central Event Horizon Singularity
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(cx, cy, 35 + audio.bass * 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 35 + audio.bass * 20, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }
  },

  // 115. PHOTOREALISTIC SPECTRUM AUDIO RING
  {
    id: 115,
    name: "Photorealistic Spectrum Audio Ring",
    category: "advanced",
    engineType: "canvas2d",
    description: "Ultra-sharp 3D frequency spectrum ring with glowing floor reflection & particle embers",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020308";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const bars = 64;
      const r = 110 + audio.bass * 25;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2 + t * 0.5;
        const val = audio.frequencyData[i * 4] / 255;
        const len = 10 + val * 120;

        const hue = (i * 5.5 + t * 40) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 65%)`;
        ctx.lineWidth = 3.5;

        const x1 = cx + Math.cos(angle) * r;
        const y1 = cy + Math.sin(angle) * r;
        const x2 = cx + Math.cos(angle) * (r + len);
        const y2 = cy + Math.sin(angle) * (r + len);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.restore();
    }
  },

  // 116. 3D HEXAGONAL CORAL GLASS BLOCK TUNNEL (Exact Image Replica Pattern)
  {
    id: 116,
    name: "3D Hexagonal Coral Glass Block Tunnel",
    category: "advanced",
    engineType: "canvas2d",
    description: "3D perspective tunnel with dark teal honeycomb net & flying glowing coral glass blocks",
    render2D(ctx, w, h, audio, t) {
      // 1. Dark Teal / Emerald Background
      ctx.fillStyle = "#051c1a";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // 2. Hexagonal Honeycomb Net Grid
      const hexR = 40 + audio.bass * 15;
      ctx.strokeStyle = "rgba(0, 210, 160, 0.25)";
      ctx.lineWidth = 1.5;

      const cols = Math.ceil(w / (hexR * 1.5)) + 2;
      const rows = Math.ceil(h / (hexR * Math.sqrt(3))) + 2;

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const x = c * hexR * 1.5;
          const y = r * hexR * Math.sqrt(3) + (c % 2 === 0 ? 0 : (hexR * Math.sqrt(3)) / 2);

          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = x + Math.cos(angle) * hexR;
            const hy = y + Math.sin(angle) * hexR;

            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // 3. 3D Flying Translucent Coral / Peach Glass Slabs & Cuboids
      if (!this.blocks) {
        this.blocks = Array.from({ length: 90 }, () => ({
          angle: Math.random() * Math.PI * 2,
          radiusDist: 40 + Math.random() * 260,
          z: Math.random() * w,
          w: 35 + Math.random() * 65,
          h: 20 + Math.random() * 35,
          speed: 8 + Math.random() * 12
        }));
      }

      const speedBoost = 10 + audio.bass * 40;
      this.blocks.forEach((b, idx) => {
        b.z -= speedBoost;
        if (b.z <= 0) b.z = w;

        const k = 280 / b.z;
        const px = cx + Math.cos(b.angle) * b.radiusDist * k;
        const py = cy + Math.sin(b.angle) * b.radiusDist * k;

        const bw = b.w * k;
        const bh = b.h * k;

        // Translucent Peach / Coral Glass Fill & Border
        const val = audio.frequencyData[(idx * 5) % audio.frequencyData.length] / 255;
        const isTeal = idx % 5 === 0;

        if (isTeal) {
          ctx.fillStyle = `rgba(0, 240, 180, ${0.4 + val * 0.4})`;
          ctx.strokeStyle = "rgba(0, 255, 200, 0.9)";
        } else {
          ctx.fillStyle = `rgba(255, 130, 100, ${0.45 + val * 0.45})`;
          ctx.strokeStyle = "rgba(255, 170, 140, 0.95)";
        }

        ctx.lineWidth = 2;

        // Draw 3D Front Face
        ctx.beginPath();
        ctx.roundRect(px - bw / 2, py - bh / 2, bw, bh, 6);
        ctx.fill();
        ctx.stroke();

        // 3D Glass Side Projection Edge
        ctx.fillStyle = isTeal ? "rgba(0, 200, 150, 0.25)" : "rgba(255, 100, 70, 0.3)";
        ctx.beginPath();
        ctx.moveTo(px - bw / 2, py + bh / 2);
        ctx.lineTo(px - bw / 2 - 8 * k, py + bh / 2 + 12 * k);
        ctx.lineTo(px + bw / 2 - 8 * k, py + bh / 2 + 12 * k);
        ctx.lineTo(px + bw / 2, py + bh / 2);
        ctx.closePath();
        ctx.fill();
      });

      ctx.restore();
    }
  },

  // 117. MOLTEN LIGHT-TRAIL SPIROGRAPH VORTEX (Exact Image & Prompt Replica)
  {
    id: 117,
    name: "Molten Light-Trail Spirograph Vortex",
    category: "advanced",
    engineType: "canvas2d",
    description: "Intensely glowing multi-layered molten spirograph with long-exposure light trails",
    render2D(ctx, w, h, audio, t) {
      // 1. Velvety Black Void Background
      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const loops = 48;
      const steps = 180;
      const baseR = Math.min(w, h) * 0.35;
      const innerR = 40 + audio.bass * 30;

      const spin = t * 0.8 + audio.bass * 1.5;

      for (let l = 0; l < loops; l++) {
        const loopFrac = l / loops;
        const angleOffset = (l / loops) * Math.PI * 2 + spin;

        // Smooth Molten Color Gradient: Yellow-White Core -> Fiery Orange -> Deep Crimson
        let strokeColor;
        if (loopFrac < 0.25) {
          // Inner Core: Molten Yellow-White
          const hue = 50 + loopFrac * 40;
          strokeColor = `hsla(${hue}, 100%, 85%, 0.95)`;
        } else if (loopFrac < 0.65) {
          // Mid: Fiery Orange & Intense Red
          const hue = 30 - (loopFrac - 0.25) * 60;
          strokeColor = `hsla(${hue}, 100%, 60%, 0.85)`;
        } else {
          // Outer: Deep Crimson & Magenta
          const hue = 350 - (loopFrac - 0.65) * 40;
          strokeColor = `hsla(${hue}, 100%, 45%, 0.75)`;
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.8 + (1 - loopFrac) * 1.2;

        ctx.beginPath();
        for (let s = 0; s <= steps; s++) {
          const theta = (s / steps) * Math.PI * 2;

          // Spirograph Elliptical & Hypotrochoid Wave Equation
          const R = baseR * (0.6 + 0.4 * Math.sin(theta * 2 + angleOffset));
          const wave = Math.sin(theta * 6 + t * 3) * (8 + audio.mid * 25);

          const r = innerR + R + wave;
          const x = Math.cos(theta + angleOffset * 0.5) * r * (1 + 0.3 * Math.cos(theta * 3));
          const y = Math.sin(theta + angleOffset * 0.5) * r * (1 - 0.2 * Math.sin(theta * 2));

          const px = cx + x;
          const py = cy + y;

          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
    }
  }
];



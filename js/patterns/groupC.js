/* AuraSonic Group C: Particles & Cosmos (Patterns 41–60) */

export const groupCPatterns = [
  // 41. Nebula Dust Cloud
  {
    id: 41,
    name: "Nebula Dust Cloud",
    category: "particles",
    engineType: "canvas2d",
    description: "Volumetric glowing particle cloud with smooth color shifts",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(3, 2, 8, 0.2)";
      ctx.fillRect(0, 0, w, h);

      if (!this.dust) {
        this.dust = Array.from({ length: 200 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 2 + Math.random() * 8,
          alpha: 0.2 + Math.random() * 0.6
        }));
      }

      this.dust.forEach((d, idx) => {
        d.x += Math.sin(t * 0.5 + idx) * (0.5 + audio.bass);
        d.y += Math.cos(t * 0.5 + idx) * (0.5 + audio.mid);

        ctx.fillStyle = `hsla(${240 + idx * 0.5 + audio.treble * 100}, 90%, 65%, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * (1 + audio.bass * 0.5), 0, Math.PI * 2);
        ctx.fill();
      });
    }
  },

  // 42. Supernova Bursts
  {
    id: 42,
    name: "Supernova Bursts",
    category: "particles",
    engineType: "canvas2d",
    description: "Explosive audio peak particle shockwaves",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 2, 6, 0.25)";
      ctx.fillRect(0, 0, w, h);

      if (!this.sparks) this.sparks = [];

      if (audio.beat) {
        for (let i = 0; i < 40; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 3 + Math.random() * 8 * audio.bass;
          this.sparks.push({
            x: w / 2,
            y: h / 2,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            life: 1.0,
            color: `hsl(${Math.random() * 60 + 330}, 100%, 65%)`
          });
        }
      }

      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const s = this.sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.02;

        if (s.life <= 0) {
          this.sparks.splice(i, 1);
          continue;
        }

        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.life;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    }
  },

  // 43. Galaxy Spiral Arms
  {
    id: 43,
    name: "Galaxy Spiral Arms",
    category: "particles",
    engineType: "canvas2d",
    description: "Rotating cosmic galaxy spiral arms",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020309";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const stars = 250;
      const arms = 3;

      for (let i = 0; i < stars; i++) {
        const arm = i % arms;
        const dist = (i / stars) * (Math.min(w, h) * 0.45);
        const angle = (arm / arms) * Math.PI * 2 + dist * 0.02 + t * (0.5 + audio.bass);

        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;

        ctx.fillStyle = `hsla(${200 + dist * 0.5}, 90%, 65%, 0.8)`;
        ctx.beginPath();
        ctx.arc(x, y, 1.5 + audio.treble * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  // 44. Orbital Swarms
  {
    id: 44,
    name: "Orbital Swarms",
    category: "particles",
    engineType: "canvas2d",
    description: "Flocking particle boids attracted to audio center",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 5, 12, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      if (!this.boids) {
        this.boids = Array.from({ length: 100 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4
        }));
      }

      this.boids.forEach(b => {
        const dx = cx - b.x;
        const dy = cy - b.y;
        b.vx += dx * 0.001 * (1 + audio.bass * 3);
        b.vy += dy * 0.001 * (1 + audio.bass * 3);

        b.x += b.vx;
        b.y += b.vy;

        ctx.fillStyle = "#00f3ff";
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  },

  // 45. Dynamic Constellation Mesh
  {
    id: 45,
    name: "Dynamic Constellation Mesh",
    category: "particles",
    engineType: "canvas2d",
    description: "Proximity-linked star nodes forming constellation lines",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#03040b";
      ctx.fillRect(0, 0, w, h);

      if (!this.nodes) {
        this.nodes = Array.from({ length: 60 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2
        }));
      }

      this.nodes.forEach(n => {
        n.x += n.vx * (1 + audio.mid * 2);
        n.y += n.vy * (1 + audio.mid * 2);
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const d = Math.hypot(this.nodes[i].x - this.nodes[j].x, this.nodes[i].y - this.nodes[j].y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(0, 243, 255, ${1 - d / 120})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
            ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
            ctx.stroke();
          }
        }
      }
    }
  },

  // 46. Quantum Particle Accelerator
  {
    id: 46,
    name: "Quantum Particle Accelerator",
    category: "particles",
    engineType: "canvas2d",
    description: "High-speed particle collider ring discharging energy",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 2, 10, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = 160 + audio.bass * 40;

      ctx.strokeStyle = "rgba(255, 0, 160, 0.4)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 8; i++) {
        const a = t * (4 + i) + audio.treble * 5;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  // 47. Floating Embers Fireplace
  {
    id: 47,
    name: "Floating Embers Fireplace",
    category: "particles",
    engineType: "canvas2d",
    description: "Rising hot atmospheric fire embers",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(10, 2, 2, 0.25)";
      ctx.fillRect(0, 0, w, h);

      if (!this.embers) {
        this.embers = Array.from({ length: 120 }, () => ({
          x: Math.random() * w,
          y: h + Math.random() * 50,
          speed: 2 + Math.random() * 4,
          size: 2 + Math.random() * 4
        }));
      }

      this.embers.forEach(e => {
        e.y -= e.speed + audio.bass * 4;
        e.x += Math.sin(e.y * 0.05 + t) * 2;
        if (e.y < 0) e.y = h + 10;

        ctx.fillStyle = `hsl(${20 + Math.random() * 20}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  },

  // 48. Black Hole Event Horizon
  {
    id: 48,
    name: "Black Hole Event Horizon",
    category: "particles",
    engineType: "canvas2d",
    description: "Gravitational lensing accretion disk around audio singularity",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Accretion disk
      for (let r = 80; r < 220; r += 8) {
        ctx.strokeStyle = `hsla(${20 + r * 0.8 + audio.treble * 60}, 100%, 55%, 0.6)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r + Math.sin(t * 3) * (audio.bass * 20), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Black Hole core
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  },

  // 49. Solar Flare Prominence
  {
    id: 49,
    name: "Solar Flare Prominence",
    category: "particles",
    engineType: "canvas2d",
    description: "Erupting magnetic plasma arcs from star core",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#0a0302";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(cx, cy, 80 + audio.bass * 30, 0, Math.PI * 2);
      ctx.fill();

      // Flares
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t;
        ctx.strokeStyle = "#ff00a0";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * 90, cy + Math.sin(a) * 90, 40 + audio.mid * 40, 0, Math.PI);
        ctx.stroke();
      }
    }
  },

  // 50. Cosmic Dust Tunnel
  {
    id: 50,
    name: "Cosmic Dust Tunnel",
    category: "particles",
    engineType: "canvas2d",
    description: "Warp speed starfield flying towards viewer",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      if (!this.stars) {
        this.stars = Array.from({ length: 150 }, () => ({
          x: (Math.random() - 0.5) * w,
          y: (Math.random() - 0.5) * h,
          z: Math.random() * 500
        }));
      }

      this.stars.forEach(s => {
        s.z -= 4 + audio.bass * 15;
        if (s.z <= 0) s.z = 500;

        const k = 200 / s.z;
        const px = cx + s.x * k;
        const py = cy + s.y * k;

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, (1 - s.z / 500) * 4), 0, Math.PI * 2);
        ctx.fill();
      });
    }
  },

  // 51. Starlight Meteor Shower
  {
    id: 51,
    name: "Starlight Meteor Shower",
    category: "particles",
    engineType: "canvas2d",
    description: "Frequency-triggered meteors streaking across space",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 4, 10, 0.3)";
      ctx.fillRect(0, 0, w, h);

      if (!this.meteors) this.meteors = [];

      if (audio.beat || Math.random() < 0.2) {
        this.meteors.push({
          x: Math.random() * w,
          y: 0,
          len: 40 + audio.bass * 60,
          speed: 8 + Math.random() * 10
        });
      }

      for (let i = this.meteors.length - 1; i >= 0; i--) {
        const m = this.meteors[i];
        m.x += m.speed;
        m.y += m.speed;

        if (m.y > h) {
          this.meteors.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = "#00f3ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.len, m.y - m.len);
        ctx.stroke();
      }
    }
  },

  // 52. Quantum Foam Oscillations
  {
    id: 52,
    name: "Quantum Foam Oscillations",
    category: "particles",
    engineType: "canvas2d",
    description: "Jittering subatomic particle lattice",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#030408";
      ctx.fillRect(0, 0, w, h);

      const step = 30;
      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          const jitterX = (Math.random() - 0.5) * (audio.bass * 20);
          const jitterY = (Math.random() - 0.5) * (audio.bass * 20);

          ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 70%)`;
          ctx.beginPath();
          ctx.arc(x + jitterX, y + jitterY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  },

  // 53. Pulsar Beam System
  {
    id: 53,
    name: "Pulsar Beam System",
    category: "particles",
    engineType: "canvas2d",
    description: "Sweeping dual energy pulsar beams",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020206";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const a = t * 2 + audio.bass;

      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 8 + audio.bass * 12;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * w, cy + Math.sin(a) * w);
      ctx.lineTo(cx - Math.cos(a) * w, cy - Math.sin(a) * w);
      ctx.stroke();
    }
  },

  // 54. Particle Sphere Cloud
  {
    id: 54,
    name: "Particle Sphere Cloud",
    category: "particles",
    engineType: "canvas2d",
    description: "Morphing 3D point cloud sphere",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 3, 10, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const count = 180;
      const R = 140 + audio.bass * 40;

      for (let i = 0; i < count; i++) {
        const lat = (i / count) * Math.PI - Math.PI / 2;
        const lon = i * 0.3 + t;

        const x = Math.cos(lat) * Math.cos(lon) * R;
        const y = Math.sin(lat) * R;

        ctx.fillStyle = `hsl(${i * 2 + audio.treble * 100}, 90%, 65%)`;
        ctx.beginPath();
        ctx.arc(cx + x, cy + y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  // 55. Plasma Fireflies
  {
    id: 55,
    name: "Plasma Fireflies",
    category: "particles",
    engineType: "canvas2d",
    description: "Wandering glowing light particles with smooth trails",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 6, 12, 0.2)";
      ctx.fillRect(0, 0, w, h);

      if (!this.bugs) {
        this.bugs = Array.from({ length: 40 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          angle: Math.random() * Math.PI * 2
        }));
      }

      this.bugs.forEach(b => {
        b.angle += (Math.random() - 0.5) * 0.3;
        b.x += Math.cos(b.angle) * (2 + audio.bass * 4);
        b.y += Math.sin(b.angle) * (2 + audio.bass * 4);

        if (b.x < 0) b.x = w;
        if (b.x > w) b.x = 0;
        if (b.y < 0) b.y = h;
        if (b.y > h) b.y = 0;

        ctx.fillStyle = "#00ff88";
        ctx.beginPath();
        ctx.arc(b.x, b.y, 5 + audio.mid * 5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  },

  // 56. Subatomic Collision
  {
    id: 56,
    name: "Subatomic Collision",
    category: "particles",
    engineType: "canvas2d",
    description: "Pair production particle trajectories curving in magnetic field",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 2, 8, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      for (let dir = -1; dir <= 1; dir += 2) {
        ctx.strokeStyle = dir === 1 ? "#00f3ff" : "#ff00a0";
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let r = 0; r < 180; r += 5) {
          const a = dir * r * 0.03 + t * 2;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;

          if (r === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }
  },

  // 57. Dark Matter Strands
  {
    id: 57,
    name: "Dark Matter Strands",
    category: "particles",
    engineType: "canvas2d",
    description: "Filamentary cosmic web strands responding to bass",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020205";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
      ctx.lineWidth = 2 + audio.bass * 4;

      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (i / 8) * h);
        ctx.bezierCurveTo(w * 0.3, h * 0.2 + Math.sin(t + i) * 50, w * 0.7, h * 0.8 - Math.sin(t + i) * 50, w, (i / 8) * h);
        ctx.stroke();
      }
    }
  },

  // 58. Zero-Gravity Bubbles
  {
    id: 58,
    name: "Zero-Gravity Bubbles",
    category: "particles",
    engineType: "canvas2d",
    description: "Luminescent floating spheres with sound deformation",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 4, 10, 0.25)";
      ctx.fillRect(0, 0, w, h);

      if (!this.bubbles) {
        this.bubbles = Array.from({ length: 25 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 15 + Math.random() * 25
        }));
      }

      this.bubbles.forEach((b, idx) => {
        b.y -= 1 + audio.bass * 2;
        if (b.y < -30) b.y = h + 30;

        ctx.strokeStyle = `hsl(${idx * 15 + audio.treble * 80}, 90%, 65%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r + Math.sin(t * 3 + idx) * (audio.bass * 10), 0, Math.PI * 2);
        ctx.stroke();
      });
    }
  },

  // 59. Comet Tail Field
  {
    id: 59,
    name: "Comet Tail Field",
    category: "particles",
    engineType: "canvas2d",
    description: "Streaming directional comets reacting to high frequencies",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 2, 6, 0.3)";
      ctx.fillRect(0, 0, w, h);

      if (!this.comets) {
        this.comets = Array.from({ length: 30 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          speed: 4 + Math.random() * 6
        }));
      }

      this.comets.forEach(c => {
        c.x += c.speed + audio.treble * 8;
        if (c.x > w) c.x = 0;

        ctx.strokeStyle = "#00f3ff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x - 30, c.y);
        ctx.stroke();
      });
    }
  },

  // 60. Aurora Borealis Curtain
  {
    id: 60,
    name: "Aurora Borealis Curtain",
    category: "particles",
    engineType: "canvas2d",
    description: "Wavy atmospheric curtains with high-frequency shimmer",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#01050a";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 3; i++) {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.5, i === 0 ? "rgba(0, 255, 136, 0.6)" : "rgba(168, 85, 247, 0.5)");
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.3);

        for (let x = 0; x <= w; x += 20) {
          const y = h * (0.3 + i * 0.1) + Math.sin(x * 0.005 + t * 1.5 + i) * (50 + audio.bass * 60);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h * 0.8);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
];

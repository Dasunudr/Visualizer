/* AuraSonic Group B: Geometric & Structural (Patterns 21–40) */

export const groupBPatterns = [
  // 21. 3D Hyper-Cubes
  {
    id: 21,
    name: "3D Hyper-Cubes",
    category: "geometric",
    engineType: "canvas2d",
    description: "Rotating 3D tesseract wireframe flexing with audio frequencies",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 5, 12, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const size = 120 + audio.bass * 80;

      // 8 Vertices of inner cube & outer cube
      const angle = t * 0.8;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const project = (x, y, z) => {
        const x1 = x * cosA - z * sinA;
        const z1 = x * sinA + z * cosA;
        const scale = 300 / (300 + z1);
        return { px: cx + x1 * scale, py: cy + y * scale };
      };

      const nodes = [
        [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
        [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1]
      ];

      const edges = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7]
      ];

      ctx.strokeStyle = `hsla(${280 + audio.treble * 100}, 100%, 65%, 0.8)`;
      ctx.lineWidth = 3;

      edges.forEach(([i, j]) => {
        const p1 = project(nodes[i][0] * size, nodes[i][1] * size, nodes[i][2] * size);
        const p2 = project(nodes[j][0] * size, nodes[j][1] * size, nodes[j][2] * size);

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      });
    }
  },

  // 22. Kaleidoscopic Fractals
  {
    id: 22,
    name: "Kaleidoscopic Fractals",
    category: "geometric",
    engineType: "canvas2d",
    description: "8-fold polar mirrored geometric kaleidoscope",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 3, 6, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const mirrors = 8;

      ctx.save();
      ctx.translate(cx, cy);

      for (let m = 0; m < mirrors; m++) {
        ctx.rotate((Math.PI * 2) / mirrors);

        ctx.strokeStyle = `hsla(${m * 45 + t * 40}, 90%, 65%, 0.7)`;
        ctx.lineWidth = 2 + audio.mid * 3;

        ctx.beginPath();
        for (let r = 10; r < 200; r += 15) {
          const wave = Math.sin(r * 0.05 + t * 3) * (20 + audio.bass * 40);
          ctx.lineTo(r, wave);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  // 23. Voronoi Tessellations
  {
    id: 23,
    name: "Voronoi Tessellations",
    category: "geometric",
    engineType: "canvas2d",
    description: "Audio-pulsing Voronoi cell centroids & boundaries",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#04050d";
      ctx.fillRect(0, 0, w, h);

      if (!this.sites) {
        this.sites = Array.from({ length: 16 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2
        }));
      }

      this.sites.forEach((s, idx) => {
        s.x += s.vx * (1 + audio.bass * 2);
        s.y += s.vy * (1 + audio.bass * 2);
        if (s.x < 0 || s.x > w) s.vx *= -1;
        if (s.y < 0 || s.y > h) s.vy *= -1;

        ctx.fillStyle = `hsl(${idx * 22 + audio.treble * 100}, 90%, 60%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 6 + audio.frequencyData[idx * 4] / 20, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  },

  // 24. Audio-Reactive Grid
  {
    id: 24,
    name: "Audio-Reactive Grid",
    category: "geometric",
    engineType: "canvas2d",
    description: "Perspective grid flexing upwards on sub-bass impact",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#030611";
      ctx.fillRect(0, 0, w, h);

      const rows = 20;
      const cols = 20;
      const horizonY = h * 0.4;

      ctx.strokeStyle = "rgba(0, 243, 255, 0.4)";
      ctx.lineWidth = 1.5;

      for (let r = 0; r < rows; r++) {
        const y = horizonY + Math.pow(r / rows, 2) * (h - horizonY);
        const bassOffset = Math.sin(r * 0.5 - t * 4) * (audio.bass * 25);

        ctx.beginPath();
        ctx.moveTo(0, y + bassOffset);
        ctx.lineTo(w, y + bassOffset);
        ctx.stroke();
      }

      const cx = w / 2;
      for (let c = -cols; c <= cols; c++) {
        const xTop = cx + c * 10;
        const xBot = cx + c * 60;

        ctx.beginPath();
        ctx.moveTo(xTop, horizonY);
        ctx.lineTo(xBot, h);
        ctx.stroke();
      }
    }
  },

  // 25. Isometric Cityscape
  {
    id: 25,
    name: "Isometric Cityscape",
    category: "geometric",
    engineType: "canvas2d",
    description: "Equalizer building towers jumping to audio spectrum",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#020409";
      ctx.fillRect(0, 0, w, h);

      const towers = 16;
      const towerWidth = w / towers;

      for (let i = 0; i < towers; i++) {
        const x = i * towerWidth;
        const val = (audio.frequencyData[i * 6] / 255) || 0.1;
        const towerHeight = val * (h * 0.6) + 20;

        const hue = 180 + i * 10;
        ctx.fillStyle = `hsl(${hue}, 80%, 45%)`;
        ctx.fillRect(x + 5, h - towerHeight, towerWidth - 10, towerHeight);

        // Building lights
        ctx.fillStyle = "#fff";
        for (let y = h - towerHeight + 10; y < h - 10; y += 20) {
          ctx.fillRect(x + 12, y, towerWidth - 24, 8);
        }
      }
    }
  },

  // 26. Geodesic Dome
  {
    id: 26,
    name: "Geodesic Dome",
    category: "geometric",
    engineType: "canvas2d",
    description: "Expanding wireframe geodesic dome structure",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 3, 10, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = 150 + audio.bass * 60;
      const rings = 8;

      ctx.strokeStyle = `hsla(${t * 30 % 360}, 90%, 65%, 0.7)`;
      ctx.lineWidth = 2;

      for (let i = 1; i <= rings; i++) {
        const ringR = (i / rings) * r;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.stroke();

        const pts = i * 6;
        for (let p = 0; p < pts; p++) {
          const a = (p / pts) * Math.PI * 2 + t * 0.5;
          const px = cx + Math.cos(a) * ringR;
          const py = cy + Math.sin(a) * ringR;

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }
    }
  },

  // 27. Matrix Cascades
  {
    id: 27,
    name: "Matrix Cascades",
    category: "geometric",
    engineType: "canvas2d",
    description: "Digital rain glyphs pulsing with frequency brightness",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 6, 4, 0.25)";
      ctx.fillRect(0, 0, w, h);

      if (!this.cols) {
        const numCols = Math.floor(w / 20);
        this.cols = Array.from({ length: numCols }, () => ({
          y: Math.random() * h,
          speed: 2 + Math.random() * 5
        }));
      }

      ctx.font = "14px monospace";
      this.cols.forEach((col, i) => {
        col.y += col.speed + audio.bass * 10;
        if (col.y > h) col.y = 0;

        const char = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
        const freq = (audio.frequencyData[i % 64] / 255) || 0.5;

        ctx.fillStyle = `rgb(0, ${Math.floor(freq * 255)}, 120)`;
        ctx.fillText(char, i * 20, col.y);
      });
    }
  },

  // 28. Sacred Geometry Metatron
  {
    id: 28,
    name: "Sacred Geometry Metatron",
    category: "geometric",
    engineType: "canvas2d",
    description: "Nested spinning polyhedral sacred geometry",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#05030a";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = 140 + audio.bass * 50;

      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 2;

      // Outer 6 circles
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 0.3;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;

        ctx.beginPath();
        ctx.arc(px, py, r * 0.6, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  // 29. Fractal Tree of Life
  {
    id: 29,
    name: "Fractal Tree of Life",
    category: "geometric",
    engineType: "canvas2d",
    description: "Audio-branching recursive fractal tree",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#03070b";
      ctx.fillRect(0, 0, w, h);

      const drawBranch = (x, y, len, angle, depth) => {
        if (depth === 0) return;

        const x2 = x + Math.cos(angle) * len;
        const y2 = y + Math.sin(angle) * len;

        ctx.strokeStyle = `hsl(${120 + depth * 20 + audio.treble * 80}, 90%, 60%)`;
        ctx.lineWidth = depth * 1.5;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const spread = 0.4 + audio.mid * 0.4;
        drawBranch(x2, y2, len * 0.72, angle - spread, depth - 1);
        drawBranch(x2, y2, len * 0.72, angle + spread, depth - 1);
      };

      drawBranch(w / 2, h - 20, 100 + audio.bass * 40, -Math.PI / 2, 7);
    }
  },

  // 30. Sierpinski Pyramid
  {
    id: 30,
    name: "Sierpinski Pyramid",
    category: "geometric",
    engineType: "canvas2d",
    description: "Recursive mathematical triangle fractal mesh",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 2, 10, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const drawTri = (x1, y1, x2, y2, x3, y3, depth) => {
        if (depth === 0) {
          ctx.strokeStyle = `hsl(${depth * 40 + t * 50}, 100%, 65%)`;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
          ctx.closePath();
          ctx.stroke();
          return;
        }

        const mx1 = (x1 + x2) / 2;
        const my1 = (y1 + y2) / 2;
        const mx2 = (x2 + x3) / 2;
        const my2 = (y2 + y3) / 2;
        const mx3 = (x3 + x1) / 2;
        const my3 = (y3 + y1) / 2;

        drawTri(x1, y1, mx1, my1, mx3, my3, depth - 1);
        drawTri(mx1, my1, x2, y2, mx2, my2, depth - 1);
        drawTri(mx3, my3, mx2, my2, x3, y3, depth - 1);
      };

      const size = 300 + audio.bass * 100;
      drawTri(w / 2, h / 2 - size / 2, w / 2 - size / 2, h / 2 + size / 2, w / 2 + size / 2, h / 2 + size / 2, 4);
    }
  },

  // 31. Hexagonal Lattice Grid
  {
    id: 31,
    name: "Hexagonal Lattice Grid",
    category: "geometric",
    engineType: "canvas2d",
    description: "Honeycomb grid cells pulsing to sound",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#02060f";
      ctx.fillRect(0, 0, w, h);

      const r = 25;
      const dx = r * 3;
      const dy = r * Math.sqrt(3);

      ctx.strokeStyle = "rgba(0, 243, 255, 0.4)";
      ctx.lineWidth = 1.5;

      for (let x = 0; x < w + r; x += dx) {
        for (let y = 0; y < h + r; y += dy) {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            const px = x + Math.cos(a) * (r + audio.bass * 10);
            const py = y + Math.sin(a) * (r + audio.bass * 10);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  },

  // 32. Hyperbolic Disk (Poincaré)
  {
    id: 32,
    name: "Hyperbolic Disk (Poincaré)",
    category: "geometric",
    engineType: "canvas2d",
    description: "Non-Euclidean hyperbolic disk tessellation",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#050409";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const R = 180 + audio.bass * 40;

      ctx.strokeStyle = "#ff00a0";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 1; i < 6; i++) {
        const innerR = R * Math.pow(0.6, i);
        ctx.beginPath();
        ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  },

  // 33. Wireframe Torus Knot
  {
    id: 33,
    name: "Wireframe Torus Knot",
    category: "geometric",
    engineType: "canvas2d",
    description: "3D parametric torus knot twisting with pitch",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(2, 2, 7, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const points = 180;
      const p = 2, q = 3;

      ctx.strokeStyle = `hsla(${t * 40 % 360}, 100%, 65%, 0.8)`;
      ctx.lineWidth = 3;

      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const u = (i / points) * Math.PI * 4;
        const r = (80 + audio.bass * 40) * (0.8 + 0.4 * Math.cos(q * u));

        const x = r * Math.cos(p * u);
        const y = r * Math.sin(p * u);

        if (i === 0) ctx.moveTo(cx + x, cy + y);
        else ctx.lineTo(cx + x, cy + y);
      }
      ctx.stroke();
    }
  },

  // 34. Crystalline Prism Array
  {
    id: 34,
    name: "Crystalline Prism Array",
    category: "geometric",
    engineType: "canvas2d",
    description: "Refractive crystal shards glowing to high frequencies",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, w, h);

      const count = 12;
      const cx = w / 2;
      const cy = h / 2;

      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + t * 0.4;
        const len = 100 + (audio.frequencyData[i * 8] || 0);

        const px = cx + Math.cos(a) * len;
        const py = cy + Math.sin(a) * len;

        ctx.fillStyle = `hsla(${200 + i * 15}, 90%, 60%, 0.5)`;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px - 15, py);
        ctx.lineTo(px, py + 20);
        ctx.closePath();
        ctx.fill();
      }
    }
  },

  // 35. Cyberpunk Grid Horizon
  {
    id: 35,
    name: "Cyberpunk Grid Horizon",
    category: "geometric",
    engineType: "canvas2d",
    description: "Retro neon perspective grid with synthwave sun",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#0a0212";
      ctx.fillRect(0, 0, w, h);

      // Sunset
      const grad = ctx.createLinearGradient(0, h * 0.2, 0, h * 0.5);
      grad.addColorStop(0, "#ff00a0");
      grad.addColorStop(1, "#f59e0b");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.5, 90 + audio.bass * 30, 0, Math.PI * 2);
      ctx.fill();

      // Horizon grid
      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 1.5;

      for (let y = h * 0.5; y < h; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }
  },

  // 36. Cube Matrix Array
  {
    id: 36,
    name: "Cube Matrix Array",
    category: "geometric",
    engineType: "canvas2d",
    description: "8x8 voxel cube grid exploding on beat",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#04040a";
      ctx.fillRect(0, 0, w, h);

      const rows = 8, cols = 8;
      const cellW = w / cols;
      const cellH = h / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const val = audio.frequencyData[(r * cols + c) * 2] / 255;
          const padding = 10 + val * 15;

          ctx.fillStyle = `hsl(${260 + val * 100}, 90%, 55%)`;
          ctx.fillRect(c * cellW + padding, r * cellH + padding, cellW - padding * 2, cellH - padding * 2);
        }
      }
    }
  },

  // 37. Penrose Tiling Array
  {
    id: 37,
    name: "Penrose Tiling Array",
    category: "geometric",
    engineType: "canvas2d",
    description: "Aperiodic mathematical tile morphing",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#050610";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const size = 120 + audio.bass * 60;

      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 + t * 0.3;
        ctx.strokeStyle = `hsla(${i * 36}, 100%, 65%, 0.7)`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * size, cy + Math.sin(a) * size);
        ctx.lineTo(cx + Math.cos(a + 0.3) * (size * 0.6), cy + Math.sin(a + 0.3) * (size * 0.6));
        ctx.closePath();
        ctx.stroke();
      }
    }
  },

  // 38. Recursive Starburst Polygon
  {
    id: 38,
    name: "Recursive Starburst Polygon",
    category: "geometric",
    engineType: "canvas2d",
    description: "Nested morphing star polyhedra",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(4, 2, 8, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const layers = 6;

      for (let l = 1; l <= layers; l++) {
        const r = l * 25 + audio.bass * 40;
        const pts = 5 + l;

        ctx.strokeStyle = `hsl(${l * 40 + t * 30}, 100%, 60%)`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let p = 0; p < pts; p++) {
          const a = (p / pts) * Math.PI * 2 + t * (l % 2 === 0 ? 0.5 : -0.5);
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;

          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  },

  // 39. Quantum Octahedron Core
  {
    id: 39,
    name: "Quantum Octahedron Core",
    category: "geometric",
    engineType: "canvas2d",
    description: "Spinning dual octahedron with glowing edges",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "#030409";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const size = 100 + audio.bass * 80;

      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00f3ff";

      // Top pyramid
      ctx.beginPath();
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx - size, cy);
      ctx.lineTo(cx + size, cy);
      ctx.closePath();
      ctx.stroke();

      // Bottom pyramid
      ctx.beginPath();
      ctx.moveTo(cx, cy + size);
      ctx.lineTo(cx - size, cy);
      ctx.lineTo(cx + size, cy);
      ctx.closePath();
      ctx.stroke();

      ctx.shadowBlur = 0;
    }
  },

  // 40. Infinite Tunnel Lattice
  {
    id: 40,
    name: "Infinite Tunnel Lattice",
    category: "geometric",
    engineType: "canvas2d",
    description: "3D square tunnel flying into space",
    render2D(ctx, w, h, audio, t) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const boxes = 12;

      for (let i = 0; i < boxes; i++) {
        const z = (i * 30 + t * 50 + audio.bass * 50) % 360;
        const scale = 300 / (360 - z);
        const boxSize = 80 * scale;

        ctx.strokeStyle = `hsla(${z * 0.8}, 100%, 60%, ${scale * 0.3})`;
        ctx.lineWidth = 2;

        ctx.strokeRect(cx - boxSize / 2, cy - boxSize / 2, boxSize, boxSize);
      }
    }
  }
];

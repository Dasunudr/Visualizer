/* AuraSonic Dual Render Engine (Canvas 2D + WebGL / Three.js) */
export class RenderEngine {
  constructor(canvas2DId, canvasWebGLId) {
    this.canvas2D = document.getElementById(canvas2DId);
    this.ctx2D = this.canvas2D.getContext('2d');

    this.ambientCanvas = document.getElementById('ambient-canvas');
    this.ambientCtx = this.ambientCanvas ? this.ambientCanvas.getContext('2d') : null;

    this.canvasWebGL = document.getElementById(canvasWebGLId);

    // Three.js Core Setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 25;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasWebGL,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Performance & Resolution Controls
    this.resolutionScale = 1.0;
    this.particleDensity = 3; // 1: Low, 2: Med, 3: High, 4: Ultra

    // FPS Counter metrics
    this.fpsCounterEl = document.getElementById('fps-counter');
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;

    // Time, Speed & Camera Shake
    this.clock = new THREE.Clock();
    this.patternSpeed = 1.0;
    this.accumulatedTime = 0.0;
    this.cameraBasePos = new THREE.Vector3(0, 0, 25);
    this.shakeIntensity = 0;

    // Window Resize Handling
    window.addEventListener('resize', () => this.onResize());
    this.onResize();
  }

  setPatternSpeed(multiplier) {
    this.patternSpeed = parseFloat(multiplier);
  }

  onResize() {
    const w = Math.floor(window.innerWidth * this.resolutionScale);
    const h = Math.floor(window.innerHeight * this.resolutionScale);

    // Canvas 2D
    this.canvas2D.width = w;
    this.canvas2D.height = h;

    if (this.ambientCanvas) {
      this.ambientCanvas.width = Math.floor(w / 4); // Low-res blurred glow canvas
      this.ambientCanvas.height = Math.floor(h / 4);
    }

    // WebGL Three.js
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setResolutionScale(scale) {
    this.resolutionScale = scale;
    this.onResize();
  }

  setParticleDensity(level) {
    this.particleDensity = parseInt(level, 10);
  }

  clearCanvas2D() {
    this.ctx2D.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
  }

  renderAmbientGlow(audio, t) {
    if (!this.ambientCtx || !this.ambientCanvas) return;

    const w = this.ambientCanvas.width;
    const h = this.ambientCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    this.ambientCtx.fillStyle = '#04050a';
    this.ambientCtx.fillRect(0, 0, w, h);

    // Dynamic radial audio glow
    const glowRadius = Math.max(w, h) * (0.3 + audio.bass * 0.4);
    const hue1 = (t * 20 + audio.treble * 120) % 360;
    const hue2 = (hue1 + 140) % 360;

    const grad = this.ambientCtx.createRadialGradient(cx, cy, 10, cx, cy, glowRadius);
    grad.addColorStop(0, `hsla(${hue1}, 100%, 55%, ${0.4 + audio.bass * 0.4})`);
    grad.addColorStop(0.5, `hsla(${hue2}, 100%, 45%, ${0.2 + audio.mid * 0.3})`);
    grad.addColorStop(1, 'transparent');

    this.ambientCtx.fillStyle = grad;
    this.ambientCtx.beginPath();
    this.ambientCtx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
    this.ambientCtx.fill();
  }

  render(audio, activePattern) {
    // 1. Calculate FPS
    const now = performance.now();
    this.frameCount++;
    if (now - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      if (this.fpsCounterEl) {
        this.fpsCounterEl.textContent = `${this.fps} FPS`;
      }
      this.frameCount = 0;
      this.lastTime = now;
    }

    const delta = this.clock.getDelta();
    this.accumulatedTime += delta * this.patternSpeed;
    const elapsedTime = this.accumulatedTime;

    // 2. Camera Shake on Bass Beat
    if (audio.beat) {
      this.shakeIntensity = 0.35 * audio.bass;
    } else {
      this.shakeIntensity *= 0.88;
    }

    if (this.shakeIntensity > 0.005) {
      this.camera.position.x = this.cameraBasePos.x + (Math.random() - 0.5) * this.shakeIntensity;
      this.camera.position.y = this.cameraBasePos.y + (Math.random() - 0.5) * this.shakeIntensity;
    } else {
      this.camera.position.copy(this.cameraBasePos);
    }

    // 3. Render Ambient Backdrop Glow & Clear Canvas
    this.renderAmbientGlow(audio, elapsedTime);
    this.clearCanvas2D();

    // 4. Render Active Pattern
    if (activePattern) {
      if (activePattern.engineType === 'canvas2d') {
        this.canvas2D.style.display = 'block';
        this.canvasWebGL.style.display = 'none';

        this.ctx2D.save();
        activePattern.render2D(this.ctx2D, this.canvas2D.width, this.canvas2D.height, audio, elapsedTime, this.particleDensity);
        this.ctx2D.restore();
      } else if (activePattern.engineType === 'webgl') {
        this.canvas2D.style.display = 'none';
        this.canvasWebGL.style.display = 'block';

        activePattern.renderWebGL(this.scene, this.camera, this.renderer, audio, elapsedTime, delta, this.particleDensity);
        this.renderer.render(this.scene, this.camera);
      }
    }
  }
}

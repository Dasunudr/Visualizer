/* AuraSonic UI Manager - Handles Drawer, Controls, Audio Sliders & Hotkeys */

export class UIManager {
  constructor(audioEngine, renderEngine, patternManager) {
    this.audio = audioEngine;
    this.render = renderEngine;
    this.patterns = patternManager;

    // DOM Elements
    this.drawerModal = document.getElementById('drawer-modal');
    this.settingsModal = document.getElementById('settings-modal');
    this.patternGrid = document.getElementById('pattern-grid');
    this.patternSearchInput = document.getElementById('pattern-search');
    this.toastEl = document.getElementById('toast');

    this.activeCategory = 'all';
    this.searchQuery = '';

    // Auto-hide UI timer
    this.uiRoot = document.getElementById('ui-root');
    this.hideTimer = null;

    this.init();
  }

  init() {
    this.bindSplashScreen();
    this.bindAudioControls();
    this.bindPatternGrid();
    this.bindSettings();
    this.bindHotkeys();
    this.bindAutoHideUI();

    // Initial grid render
    this.renderPatternGrid();
  }

  bindSplashScreen() {
    const splash = document.getElementById('splash-screen');
    const btnExplore = document.getElementById('btn-explore');
    if (!splash) return;

    const dismissSplash = () => {
      splash.classList.add('fade-out');
      this.audio.init();
      this.audio.resume();
    };

    if (btnExplore) {
      btnExplore.addEventListener('click', dismissSplash);
    }
  }

  /* 1. Audio Controls & Source Badges */
  bindAudioControls() {
    const btnPlay = document.getElementById('btn-play-pause');
    const playIcon = document.getElementById('play-icon');
    const trackName = document.getElementById('track-name');

    btnPlay.addEventListener('click', () => {
      const playing = this.audio.togglePlayPause();
      playIcon.textContent = playing ? '❚❚' : '▶';
    });

    const volSlider = document.getElementById('volume-slider');
    volSlider.addEventListener('input', (e) => {
      this.audio.setVolume(parseFloat(e.target.value));
    });

    // Audio Source Buttons
    const srcSynth = document.getElementById('source-synth');
    const srcMic = document.getElementById('source-mic');
    const srcSystem = document.getElementById('source-system');
    const srcFile = document.getElementById('source-file');
    const fileInput = document.getElementById('audio-file-input');

    const updateSourceUI = (activeBtn) => {
      [srcSynth, srcMic, srcSystem, srcFile].forEach(b => {
        if (b) b.classList.remove('active');
      });
      if (activeBtn) activeBtn.classList.add('active');
    };

    if (srcSynth) {
      srcSynth.addEventListener('click', () => {
        updateSourceUI(srcSynth);
        this.audio.setSourceMode('synth');
        trackName.textContent = "Procedural Electronic Synth";
        playIcon.textContent = '❚❚';
        this.showToast("Source: Procedural Synth");
      });
    }

    if (srcMic) {
      srcMic.addEventListener('click', () => {
        updateSourceUI(srcMic);
        this.audio.setSourceMode('mic');
        trackName.textContent = "Listening to Background Music (Speakers)";
        playIcon.textContent = '❚❚';
        this.showToast("Listening to Background Speaker Music!");
      });
    }

    if (srcSystem) {
      srcSystem.addEventListener('click', () => {
        updateSourceUI(srcSystem);
        this.audio.setSourceMode('system');
        trackName.textContent = "YouTube / Tab Share Audio";
        playIcon.textContent = '❚❚';
        this.showToast("System Audio: Tick 'Share Audio' in browser popup!");
      });
    }

    srcFile.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        updateSourceUI(srcFile);
        this.audio.setSourceMode('file', file);
        trackName.textContent = file.name;
        playIcon.textContent = '❚❚';
        this.showToast(`Loaded: ${file.name}`);
      }
    });
  }

  /* 2. Pattern Drawer Modal & Filtering */
  bindPatternGrid() {
    const btnDrawer = document.getElementById('btn-drawer');
    const btnBadge = document.getElementById('pattern-badge');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');

    const openDrawer = () => this.drawerModal.classList.add('open');
    const closeDrawer = () => this.drawerModal.classList.remove('open');

    btnDrawer.addEventListener('click', openDrawer);
    btnBadge.addEventListener('click', openDrawer);
    btnCloseDrawer.addEventListener('click', closeDrawer);

    // Close modal on background click
    this.drawerModal.addEventListener('click', (e) => {
      if (e.target === this.drawerModal) closeDrawer();
    });

    // Category Tabs
    const tabs = document.querySelectorAll('.category-tabs .tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeCategory = tab.getAttribute('data-category');
        this.renderPatternGrid();
      });
    });

    // Search Input
    this.patternSearchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderPatternGrid();
    });

    // Next / Prev Pattern Buttons
    document.getElementById('btn-next-pattern').addEventListener('click', () => {
      this.patterns.nextPattern();
    });
    document.getElementById('btn-prev-pattern').addEventListener('click', () => {
      this.patterns.prevPattern();
    });

    // Mute Sound Button
    const btnMute = document.getElementById('btn-mute');
    const muteIcon = document.getElementById('mute-icon');
    const muteStatus = document.getElementById('mute-status');

    btnMute.addEventListener('click', () => {
      const isMuted = this.audio.toggleMute();
      btnMute.classList.toggle('active', isMuted);
      muteIcon.textContent = isMuted ? '🔇' : '🔊';
      muteStatus.textContent = isMuted ? 'SILENT' : 'ON';
      this.showToast(`Visualizer Speaker Sound: ${isMuted ? 'SILENT (Muted)' : 'ON (Unmuted)'}`);
    });

    // Auto-Mix Button
    const btnAutoMix = document.getElementById('btn-automix');
    const autoMixStatus = document.getElementById('automix-status');

    btnAutoMix.addEventListener('click', () => {
      const active = this.patterns.toggleAutoMix();
      btnAutoMix.classList.toggle('active', active);
      autoMixStatus.textContent = active ? 'ON' : 'OFF';
      this.showToast(`Auto-Mix Mode: ${active ? 'ENABLED' : 'DISABLED'}`);
    });
  }

  renderPatternGrid() {
    const filtered = this.patterns.filterPatterns(this.activeCategory, this.searchQuery);
    const activePattern = this.patterns.getActivePattern();

    this.patternGrid.innerHTML = '';

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = `pattern-card ${p.id === activePattern.id ? 'active' : ''}`;

      card.innerHTML = `
        <div class="pattern-card-header">
          <span class="pattern-num">#${String(p.id).padStart(2, '0')}</span>
          <span class="pattern-engine-tag ${p.engineType}">${p.engineType}</span>
        </div>
        <div class="pattern-name">${p.name}</div>
        <div class="pattern-desc">${p.description}</div>
      `;

      card.addEventListener('click', () => {
        this.patterns.setPattern(p.id);
        this.drawerModal.classList.remove('open');
      });

      this.patternGrid.appendChild(card);
    });
  }

  updateActivePatternHeader(pattern) {
    const numEl = document.querySelector('.active-pattern-number');
    const nameEl = document.getElementById('active-pattern-name');

    if (numEl) numEl.textContent = `#${String(pattern.id).padStart(2, '0')}`;
    if (nameEl) nameEl.textContent = pattern.name;

    this.renderPatternGrid();
    this.showToast(`Mode #${pattern.id}: ${pattern.name}`);
  }

  /* 3. Settings Modal */
  bindSettings() {
    const btnSettings = document.getElementById('btn-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');

    btnSettings.addEventListener('click', () => this.settingsModal.classList.add('open'));
    btnCloseSettings.addEventListener('click', () => this.settingsModal.classList.remove('open'));

    this.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.settingsModal) this.settingsModal.classList.remove('open');
    });

    // Color Palette Select
    const palSelect = document.getElementById('select-palette');
    const palVal = document.getElementById('val-palette');
    if (palSelect) {
      palSelect.addEventListener('change', (e) => {
        const key = e.target.value;
        this.patterns.setPalette(key);
        const pal = this.patterns.palettes[key];
        if (palVal && pal) palVal.textContent = pal.name;
        this.showToast(`Color Palette: ${pal ? pal.name : key}`);
      });
    }

    // Pattern Speed Slider
    const speedSlider = document.getElementById('slider-speed');
    const speedVal = document.getElementById('val-speed');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        speedVal.textContent = val === 1.0 ? "1.0x (Normal)" : val < 1.0 ? `${val.toFixed(1)}x (Slow)` : `${val.toFixed(1)}x (Fast)`;
        this.render.setPatternSpeed(val);
      });
    }

    // Resolution Slider
    const resSlider = document.getElementById('slider-resolution');
    const resVal = document.getElementById('val-resolution');
    resSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      resVal.textContent = `${val.toFixed(2)}x`;
      this.render.setResolutionScale(val);
    });

    // Density Slider
    const denSlider = document.getElementById('slider-density');
    const denVal = document.getElementById('val-density');
    const labels = ["Low", "Medium", "High", "Ultra"];
    denSlider.addEventListener('input', (e) => {
      const idx = parseInt(e.target.value, 10) - 1;
      denVal.textContent = labels[idx];
      this.render.setParticleDensity(e.target.value);
    });

    // Bass Sensitivity
    const bassSlider = document.getElementById('slider-bass');
    const bassVal = document.getElementById('val-bass');
    bassSlider.addEventListener('input', (e) => {
      this.audio.bassBoost = parseFloat(e.target.value);
      bassVal.textContent = `${e.target.value}x`;
    });

    // Treble Sensitivity
    const trebSlider = document.getElementById('slider-treble');
    const trebVal = document.getElementById('val-treble');
    trebSlider.addEventListener('input', (e) => {
      this.audio.trebleBoost = parseFloat(e.target.value);
      trebVal.textContent = `${e.target.value}x`;
    });

    // Auto-Mix Timer
    const mixSlider = document.getElementById('slider-automix-time');
    const mixVal = document.getElementById('val-automix-time');
    mixSlider.addEventListener('input', (e) => {
      mixVal.textContent = `${e.target.value} Seconds`;
      this.patterns.setAutoMixInterval(e.target.value);
    });

    // Fullscreen Button
    document.getElementById('btn-fullscreen').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }

  /* 4. Keyboard Shortcuts */
  bindHotkeys() {
    window.addEventListener('keydown', (e) => {
      // Ignore if typing in search input
      if (document.activeElement === this.patternSearchInput) return;

      if (e.key === 'ArrowRight') {
        this.patterns.nextPattern();
      } else if (e.key === 'ArrowLeft') {
        this.patterns.prevPattern();
      } else if (e.key === ' ') {
        e.preventDefault();
        document.getElementById('btn-play-pause').click();
      } else if (e.key.toLowerCase() === 'm') {
        this.drawerModal.classList.toggle('open');
      } else if (e.key.toLowerCase() === 'a') {
        document.getElementById('btn-automix').click();
      } else if (e.key.toLowerCase() === 'f') {
        document.getElementById('btn-fullscreen').click();
      }
    });
  }

  /* 5. Auto-Hide UI Overlay */
  bindAutoHideUI() {
    const resetTimer = () => {
      this.uiRoot.classList.remove('autohide');
      clearTimeout(this.hideTimer);
      this.hideTimer = setTimeout(() => {
        if (!this.drawerModal.classList.contains('open') && !this.settingsModal.classList.contains('open')) {
          this.uiRoot.classList.add('autohide');
        }
      }, 4000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('click', resetTimer);
    resetTimer();
  }

  /* 6. Toast Messages */
  showToast(msg) {
    this.toastEl.textContent = msg;
    this.toastEl.classList.add('show');

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 2500);
  }
}

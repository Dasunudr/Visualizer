/* AuraSonic Pattern Manager - Handles 100 Visual Modes & Auto-Mix */
import { groupAPatterns } from '../patterns/groupA.js';
import { groupBPatterns } from '../patterns/groupB.js';
import { groupCPatterns } from '../patterns/groupC.js';
import { groupDPatterns } from '../patterns/groupD.js';
import { groupEPatterns } from '../patterns/groupE.js';
import { groupFPatterns } from '../patterns/groupF.js';

export class PatternManager {
  constructor(onPatternChangeCallback) {
    this.patterns = [
      ...groupAPatterns,
      ...groupBPatterns,
      ...groupCPatterns,
      ...groupDPatterns,
      ...groupEPatterns,
      ...groupFPatterns
    ];

    this.currentIndex = 0;
    this.onPatternChange = onPatternChangeCallback;

    // Color Palette Presets
    this.palettes = {
      cyberpunk: { name: "Cyberpunk Neon", primary: "#00f3ff", secondary: "#ff00a0", accent: "#a855f7" },
      solar: { name: "Solar Flare", primary: "#ffaa00", secondary: "#ff3300", accent: "#ffff66" },
      deepSpace: { name: "Deep Space", primary: "#8b5cf6", secondary: "#06b6d4", accent: "#ec4899" },
      monochrome: { name: "Monochrome Silver", primary: "#ffffff", secondary: "#94a3b8", accent: "#475569" },
      aurora: { name: "Aurora Glow", primary: "#10b981", secondary: "#06b6d4", accent: "#3b82f6" }
    };
    this.activePalette = 'cyberpunk';

    // Auto-Mix State
    this.autoMixEnabled = false;
    this.autoMixIntervalSec = 15;
    this.autoMixTimer = null;
  }

  setPalette(paletteKey) {
    if (this.palettes[paletteKey]) {
      this.activePalette = paletteKey;
    }
  }

  getPatterns() {
    return this.patterns;
  }

  getActivePattern() {
    return this.patterns[this.currentIndex];
  }

  setPattern(identifier) {
    let index = -1;
    if (typeof identifier === 'number') {
      index = this.patterns.findIndex(p => p.id === identifier);
      if (index === -1 && identifier >= 0 && identifier < this.patterns.length) {
        index = identifier;
      }
    } else if (typeof identifier === 'string') {
      index = this.patterns.findIndex(p => p.id === parseInt(identifier, 10));
    }

    if (index >= 0 && index < this.patterns.length) {
      this.currentIndex = index;
      if (this.onPatternChange) {
        this.onPatternChange(this.getActivePattern());
      }
    }
  }

  nextPattern() {
    this.currentIndex = (this.currentIndex + 1) % this.patterns.length;
    if (this.onPatternChange) {
      this.onPatternChange(this.getActivePattern());
    }
  }

  prevPattern() {
    this.currentIndex = (this.currentIndex - 1 + this.patterns.length) % this.patterns.length;
    if (this.onPatternChange) {
      this.onPatternChange(this.getActivePattern());
    }
  }

  toggleAutoMix() {
    this.autoMixEnabled = !this.autoMixEnabled;

    if (this.autoMixEnabled) {
      this.startAutoMixTimer();
    } else {
      this.stopAutoMixTimer();
    }
    return this.autoMixEnabled;
  }

  setAutoMixInterval(seconds) {
    this.autoMixIntervalSec = parseInt(seconds, 10);
    if (this.autoMixEnabled) {
      this.startAutoMixTimer();
    }
  }

  startAutoMixTimer() {
    this.stopAutoMixTimer();
    this.autoMixTimer = setInterval(() => {
      // Pick random next pattern
      const randIndex = Math.floor(Math.random() * this.patterns.length);
      this.setPattern(randIndex);
    }, this.autoMixIntervalSec * 1000);
  }

  stopAutoMixTimer() {
    if (this.autoMixTimer) {
      clearInterval(this.autoMixTimer);
      this.autoMixTimer = null;
    }
  }

  filterPatterns(category = 'all', searchQuery = '') {
    const query = searchQuery.toLowerCase().trim();

    return this.patterns.filter(pattern => {
      const matchCat = (category === 'all') || (pattern.category === category);
      const matchSearch = (query === '') || 
        pattern.name.toLowerCase().includes(query) ||
        pattern.id.toString().includes(query) ||
        pattern.description.toLowerCase().includes(query);

      return matchCat && matchSearch;
    });
  }
}

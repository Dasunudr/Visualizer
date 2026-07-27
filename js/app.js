/* AuraSonic Web Audio Visualizer - Main Application Entry */
import { AudioEngine } from './audio/AudioEngine.js';
import { RenderEngine } from './engine/RenderEngine.js';
import { PatternManager } from './engine/PatternManager.js';
import { UIManager } from './ui/UIManager.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Core Engines
  const audioEngine = new AudioEngine();
  const renderEngine = new RenderEngine('canvas2d', 'webgl-canvas');

  let uiManager = null;

  // 2. Initialize Pattern Manager with UI Callback
  const patternManager = new PatternManager((activePattern) => {
    if (uiManager) {
      uiManager.updateActivePatternHeader(activePattern);
    }
  });

  // 3. Initialize UI Manager
  uiManager = new UIManager(audioEngine, renderEngine, patternManager);

  // 4. Main Animation Frame Loop
  function animationLoop() {
    audioEngine.update();
    renderEngine.render(audioEngine, patternManager.getActivePattern());
    requestAnimationFrame(animationLoop);
  }

  // 5. User interaction gesture to resume audio context
  const handleFirstInteraction = () => {
    audioEngine.resume();
    window.removeEventListener('click', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
  };
  window.addEventListener('click', handleFirstInteraction);
  window.addEventListener('keydown', handleFirstInteraction);

  // Start rendering loop immediately
  requestAnimationFrame(animationLoop);
  console.log("AuraSonic 100-Pattern Audio Visualizer initialized successfully!");
});

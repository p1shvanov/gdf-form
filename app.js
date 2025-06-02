import { CONFIG } from "./config.js";
import { getPixelRatio, setupCanvas } from "./canvas-utils.js";
import { BinaryAnimation } from "./binary-animation.js";
import { TerminalAnimation } from "./terminal-animation.js";
import { LogoAnimation } from "./logo-animation.js";

class App {
  constructor() {
    window.PIXEL_RATIO = getPixelRatio();
    this.canvas = setupCanvas();
    this.binaryAnimation = new BinaryAnimation(this.canvas, CONFIG);
    this.terminalAnimation = new TerminalAnimation(
      "terminal",
      CONFIG.DEMO_WORDS,
      CONFIG.BRANDBOOK_COLORS
    );
    this.logoAnimation = new LogoAnimation();

    this.init();
  }

  init() {
    this.binaryAnimation.draw();
    this.logoAnimation.start();

    window.addEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Stop current animation
    this.binaryAnimation.stop();

    // Recreate canvas with new dimensions
    this.canvas = setupCanvas();

    // Reinitialize binary animation
    this.binaryAnimation = new BinaryAnimation(this.canvas, CONFIG);
    this.binaryAnimation.draw();
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new App();
});

export class LogoAnimation {
  constructor(selector = ".logo") {
    this.logos = document.querySelectorAll(selector);
    this.currentIndex = 0;
    this.interval = null;
    
    // Animation pairs for exit and entrance
    this.animationPairs = [
      { exit: 'fadeOutRightBig', enter: 'fadeInLeftBig' },
      { exit: 'fadeOutLeftBig', enter: 'fadeInRightBig' },
      { exit: 'bounceOutRight', enter: 'bounceInLeft' },
      { exit: 'bounceOutLeft', enter: 'bounceInRight' },
    ];

    this.init();
  }

  init() {
    if (this.logos.length > 0) {
      this.logos[0].classList.add("active");
    }
  }

  getRandomAnimationPair() {
    return this.animationPairs[Math.floor(Math.random() * this.animationPairs.length)];
  }

  start(intervalTime = 10000) {
    this.interval = setInterval(() => {
      this.rotate();
    }, intervalTime);
  }

  rotate() {
    const currentLogo = this.logos[this.currentIndex];
    const nextIndex = (this.currentIndex + 1) % this.logos.length;
    const nextLogo = this.logos[nextIndex];
    const animations = this.getRandomAnimationPair();

    // Remove current logo with exit animation
    currentLogo.style.animation = `${animations.exit} 1s forwards`;
    currentLogo.classList.remove("active");

    // Add next logo with entrance animation
    nextLogo.style.animation = `${animations.enter} 1s forwards`;
    nextLogo.classList.add("active");

    this.currentIndex = nextIndex;
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

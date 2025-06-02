export class BinaryAnimation {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.config = config;
    this.bits = [];
    this.raf = null;
    this.then = Date.now();
    this.interval = 2000 / this.config.FPS;
    this.frameCount = 0;

    // Инициализация эффектов
    if (this.config.WAVES.ENABLED) {
      this.wavePosition = 0;
    }

    this.init();
  }

  init() {
    // Создание градиента
    this.setupGradient();

    // Настройка битов
    this.setupBits();
    this.drawInitialBits();
  }

  setupGradient() {
    this.gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    this.gradient.addColorStop(0, this.config.BRANDBOOK_COLORS[0]);
    this.gradient.addColorStop(0.5, this.config.BRANDBOOK_COLORS[1]);
    this.gradient.addColorStop(1, this.config.BRANDBOOK_COLORS[2]);

    this.ctx.fillStyle = this.config.BACKGROUND_COLOR;
    this.ctx.font = `${this.config.FONT_SIZE}px Monaco`;
    this.ctx.textBaseline = "bottom";
  }

  setupBits() {
    const columns = Math.floor(this.canvas.width / this.config.FONT_SIZE);
    const rows = Math.floor(this.canvas.height / this.config.FONT_SIZE);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const isEmpty = Math.random() < this.config.EMPTY_PROBABILITY;

        this.bits.push({
          x: c * this.config.FONT_SIZE,
          y: r * this.config.FONT_SIZE,
          value: isEmpty ? null : this.getRandomChar(),
          hasDrawn: false,
          isEmpty: isEmpty,
        });
      }
    }
  }

  getRandomChar() {
    return this.config.BIN_CHARS[
      Math.floor(Math.random() * this.config.BIN_CHARS.length)
    ];
  }

  drawInitialBits() {
    for (let bit of this.bits) {
      this.clearBit(bit);
      if (!bit.isEmpty) {
        this.drawBit(bit);
      }
      bit.hasDrawn = true;
    }
  }

  draw() {
    this.raf = window.requestAnimationFrame(this.draw.bind(this));
    this.frameCount++;

    const now = Date.now();
    const delta = now - this.then;

    if (delta > this.interval) {
      this.updateBits();

      // Специальные эффекты
      if (this.config.TWINKLE.ENABLED) this.applyTwinkleEffect();
      if (this.config.WAVES.ENABLED) this.applyWaveEffect();

      this.then = now - (delta % this.interval);
    }
  }

  updateBits() {
    for (let bit of this.bits) {
      if (bit.hasDrawn && !bit.isEmpty && Math.random() * 100 > 95) {
        this.clearBit(bit);
        bit.value = this.getNewBitValue(bit.value);
        this.drawBit(bit);
      }
    }
  }

  getNewBitValue(currentValue) {
    if (currentValue === this.config.BIN_CHARS[1]) {
      return this.config.BIN_CHARS[0];
    } else if (currentValue === this.config.BIN_CHARS[0]) {
      return this.config.BIN_CHARS[Math.floor(Math.random() * 2.1)];
    }
    return this.config.BIN_CHARS[1];
  }

  applyTwinkleEffect() {
    if (Math.random() < this.config.TWINKLE.PROBABILITY) {
      const randomBit = this.bits[Math.floor(Math.random() * this.bits.length)];
      if (!randomBit.isEmpty) {
        this.ctx.fillStyle = this.config.TWINKLE_COLOR;
        this.drawBit(randomBit);

        setTimeout(() => {
          this.ctx.fillStyle = this.gradient;
          this.drawBit(randomBit);
        }, this.config.TWINKLE.DURATION_MS);
      }
    }
  }

  applyWaveEffect() {
    this.wavePosition += this.config.WAVES.SPEED;
    if (this.wavePosition > this.config.WAVES.INTERVAL) {
      this.wavePosition = 0;
    }

    for (let bit of this.bits) {
      if (bit.hasDrawn && !bit.isEmpty) {
        const inWave =
          Math.abs((bit.y - this.wavePosition) % this.config.WAVES.INTERVAL) <
          this.config.WAVES.WIDTH;
        if (inWave && Math.random() > 1 - this.config.WAVES.ACTIVATION_PROB) {
          this.clearBit(bit);
          bit.value = this.getNewBitValue(bit.value);
          this.drawBit(bit);
        }
      }
    }
  }

  clearBit(bit) {
    this.ctx.clearRect(
      bit.x,
      bit.y,
      this.config.FONT_SIZE,
      this.config.FONT_SIZE
    );
  }

  drawBit(bit) {
    this.ctx.fillText(bit.value, bit.x, bit.y + this.config.FONT_SIZE);
  }

  redrawArea(x, y, width, height) {
    // Перерисовываем область после специальных эффектов
    const startCol = Math.floor(x / this.config.FONT_SIZE);
    const endCol = Math.ceil((x + width) / this.config.FONT_SIZE);
    const startRow = Math.floor(y / this.config.FONT_SIZE);
    const endRow = Math.ceil((y + height) / this.config.FONT_SIZE);

    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        const index =
          r * Math.floor(this.canvas.width / this.config.FONT_SIZE) + c;
        if (index >= 0 && index < this.bits.length) {
          const bit = this.bits[index];
          this.clearBit(bit);
          if (!bit.isEmpty) {
            this.drawBit(bit);
          }
        }
      }
    }
  }

  resize(width, height) {
    this.canvas.width = width * window.PIXEL_RATIO;
    this.canvas.height = height * window.PIXEL_RATIO;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // Пересоздаём биты для новых размеров
    this.bits = [];
    this.init();
  }

  stop() {
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
    }
  }
}

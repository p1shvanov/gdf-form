let SCREEN_HEIGHT = window.innerHeight;
let SCREEN_WIDTH = window.innerWidth;
const FPS = 60;

const BIN_CHARS = ["0", "1", "§"];
const BRANDBOOK_COLORS = ["#5e2ced", "#db6dc4", "#4fdfb4"];
const DEMO_WORDS = [
  "Цифровой",
  "Инновации",
  "Будущее",
  "Технологии",
  "Глобальный",
  "Сеть",
  "Креатив",
  "Видение",
  "Трансформация",
  "Связь",
  "Данные",
  "Облако",
  "ИИ",
  "Блокчейн",
  "Форум",
  "Мир",
  "Изменения",
  "Развитие",
  "Поток",
];

let PIXEL_RATIO = (function () {
  let ctx = document.getElementById("binary-canvas").getContext("2d"),
    dpr = window.devicePixelRatio || 1,
    bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;

  return dpr / bsr;
})();

const logos = document.querySelectorAll(".logo");

createHiDPICanvas = function (w, h, ratio) {
  if (!ratio) {
    ratio = PIXEL_RATIO;
  }
  let canvas = document.getElementById("binary-canvas");
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
  return canvas;
};

let canvas = createHiDPICanvas(SCREEN_WIDTH, SCREEN_HEIGHT);

// const canvas = document.getElementById('binary-canvas');
const ctx = canvas.getContext("2d");
let raf;

// Import CSS-var colors
const style = getComputedStyle(document.body);

// Create Gradient
const gradient = ctx.createLinearGradient(0, 0, 746, 353);

// Add gradient color stops
gradient.addColorStop(0, style.getPropertyValue("--color-gradient-orange"));
gradient.addColorStop(0.5, style.getPropertyValue("--color-gradient-purple"));
gradient.addColorStop(1, style.getPropertyValue("--color-gradient-blue"));

ctx.fillStyle = style.getPropertyValue("--color-browser");
ctx.font = "11px Monaco";
ctx.textBaseline = "bottom";

const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const rows = Math.floor(canvas.height / fontSize);

const bits = [];
const bitHeight = fontSize;
const bitWidth = fontSize;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < columns; c++) {
    bits.push({
      x: c * bitWidth,
      y: r * bitHeight,
      value: BIN_CHARS[Math.floor(Math.random() * BIN_CHARS.length)],
      hasDrawn: false,
    });
  }
}

// Vars for manually calculating frame rate
const interval = 2000 / FPS;
let now;
let then = Date.now();
let delta;

// Draw all bits once before starting animation
for (let bit of bits) {
  ctx.clearRect(bit.x, bit.y, bitWidth, bitHeight);
  ctx.fillText(bit.value, bit.x, bit.y + bitHeight);
  bit.hasDrawn = true;
}

function draw() {
  raf = window.requestAnimationFrame(draw);
  now = Date.now();
  delta = now - then;

  ctx.fillStyle = gradient;

  if (delta > interval) {
    for (let bit of bits) {
      if (bit.hasDrawn === true && Math.random() * 100 > 95) {
        // If passes the randomness check
        let newVal =
          bit.value === BIN_CHARS[1]
            ? BIN_CHARS[0]
            : bit.value === BIN_CHARS[0]
            ? BIN_CHARS[Math.floor(Math.random() * 2.1)]
            : BIN_CHARS[1];
        ctx.clearRect(bit.x, bit.y, bitWidth, bitHeight);
        ctx.fillText(newVal, bit.x, bit.y + bitHeight);
        bit.value = newVal;
      }
    }
    then = now - (delta % interval);
  }
}

function consoleText(words, id, colors) {
  if (colors === undefined) colors = ["#fff"];
  var visible = true;
  var con = document.getElementById("console");
  var letterCount = 1;
  var x = 1;
  var waiting = false;
  var target = document.getElementById(id);
  target.setAttribute("style", "color:" + colors[0]);
  window.setInterval(function () {
    if (letterCount === 0 && waiting === false) {
      waiting = true;
      target.innerHTML = words[0].substring(0, letterCount);
      window.setTimeout(function () {
        var usedColor = colors.shift();
        colors.push(usedColor);
        var usedWord = words.shift();
        words.push(usedWord);
        x = 1;
        target.setAttribute("style", "color:" + colors[0]);
        letterCount += x;
        waiting = false;
      }, 1000);
    } else if (letterCount === words[0].length + 1 && waiting === false) {
      waiting = true;
      window.setTimeout(function () {
        x = -1;
        letterCount += x;
        waiting = false;
      }, 1000);
    } else if (waiting === false) {
      target.innerHTML = words[0].substring(0, letterCount);
      letterCount += x;
    }
  }, 120);
  window.setInterval(function () {
    if (visible === true) {
      con.className = "console-underscore hidden";
      visible = false;
    } else {
      con.className = "console-underscore";

      visible = true;
    }
  }, 400);
}

// logo

function rotateLogos() {
  let currentIndex = 0;
  logos[currentIndex].classList.remove("active");
  currentIndex = (currentIndex + 1) % logos.length;
  logos[currentIndex].classList.add("active");
}

logos[0].classList.add("active");

draw();
consoleText(DEMO_WORDS, "text", BRANDBOOK_COLORS);
setInterval(rotateLogos, 3000);

function reportWindowSize() {
  SCREEN_HEIGHT = window.innerHeight;
  SCREEN_WIDTH = window.innerWidth;
}

window.onresize = reportWindowSize;

export function getPixelRatio(canvasId = "binary-canvas") {
  const ctx = document.getElementById(canvasId).getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

  return dpr / bsr;
}

export function createHiDPICanvas(w, h, ratio, canvasId = "binary-canvas") {
  const canvas = document.getElementById(canvasId);
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
  return canvas;
}

export function setupCanvas(canvasId = "binary-canvas") {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = getPixelRatio(canvasId);
  return createHiDPICanvas(width, height, ratio, canvasId);
}

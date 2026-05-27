const canvas = document.querySelector("#rainCanvas");
const ctx = canvas.getContext("2d");

const controls = {
  characters: document.querySelector("#characters"),
  fontSize: document.querySelector("#fontSize"),
  speed: document.querySelector("#speed"),
  density: document.querySelector("#density"),
  trail: document.querySelector("#trail"),
  depth: document.querySelector("#depth"),
  variance: document.querySelector("#variance"),
  glow: document.querySelector("#glow"),
  textColor: document.querySelector("#textColor"),
  headColor: document.querySelector("#headColor"),
  backgroundColor: document.querySelector("#backgroundColor"),
  katakanaMode: document.querySelector("#katakanaMode"),
  paused: document.querySelector("#paused"),
  randomizeBtn: document.querySelector("#randomizeBtn"),
  togglePanelBtn: document.querySelector("#togglePanelBtn"),
};

const katakana =
  "\u30a2\u30a4\u30a6\u30a8\u30aa\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce\u30cf\u30d2\u30d5\u30d8\u30db\u30de\u30df\u30e0\u30e1\u30e2\u30e4\u30e6\u30e8\u30e9\u30ea\u30eb\u30ec\u30ed\u30ef\u30f2\u30f3";
const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const symbols = "@#$%&*+-=<>[]{}()/\\|:;?!";

let width = 0;
let height = 0;
let dpr = 1;
let layers = [];
let lastFrame = performance.now();
let accumulator = 0;

function settings() {
  return {
    fontSize: Number(controls.fontSize.value),
    speed: Number(controls.speed.value),
    density: Number(controls.density.value) / 100,
    trail: Number(controls.trail.value),
    depth: Number(controls.depth.value),
    variance: Number(controls.variance.value) / 100,
    glow: Number(controls.glow.value),
    textColor: controls.textColor.value,
    headColor: controls.headColor.value,
    backgroundColor: controls.backgroundColor.value,
    characters: buildCharacters(),
  };
}

function buildCharacters() {
  const custom = controls.characters.value.trim();
  const base = custom.length ? custom : latin;
  return controls.katakanaMode.checked ? `${base}${katakana}${katakana}${symbols}` : base;
}

function randomChar(chars) {
  return chars[Math.floor(Math.random() * chars.length)] || "0";
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function makeLayer(layerIndex, s) {
  const denominator = Math.max(1, s.depth - 1);
  const depthRatio = s.depth === 1 ? 1 : layerIndex / denominator;
  const scale = 0.62 + depthRatio * 0.62;
  const alpha = 0.18 + depthRatio * 0.82;
  const speedScale = 0.45 + depthRatio * 0.95;
  const fontSize = Math.max(8, Math.round(s.fontSize * scale));
  const spacing = fontSize * randomBetween(0.88, 1.08);
  const count = Math.ceil(width / spacing) + 2;

  const layer = {
    alpha,
    fontSize,
    spacing,
    speedScale,
    columns: [],
  };

  layer.columns = Array.from({ length: count }, (_, index) => makeColumn(index, s, layer, false));
  return layer;
}

function makeColumn(index, s, layer, startAbove = true) {
  const varianceMin = 1 - s.variance * 0.55;
  const varianceMax = 1 + s.variance * 1.2;

  return {
    x: index * layer.spacing + randomBetween(-layer.fontSize * 0.08, layer.fontSize * 0.08),
    headY: startAbove ? -randomBetween(0, height * 0.72) : randomBetween(-height * 0.08, height),
    speedOffset: randomBetween(varianceMin, varianceMax) * layer.speedScale,
    skip: Math.random() > s.density * (0.74 + layer.alpha * 0.32),
    residues: [],
  };
}

function resize() {
  dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  resetRain();
}

function resetRain() {
  const s = settings();
  layers = Array.from({ length: s.depth }, (_, index) => makeLayer(index, s));
  paintBackground(s);
}

function paintBackground(s) {
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.fillStyle = s.backgroundColor;
  ctx.fillRect(0, 0, width, height);
}

function drawResidue(residue, s, layer) {
  const age = Math.max(0, residue.life / residue.maxLife);
  const alpha = Math.max(0.04, age ** 1.45) * layer.alpha;
  ctx.globalAlpha = alpha;
  ctx.shadowBlur = Math.min(1.5, s.glow * 0.1);
  ctx.shadowColor = s.textColor;
  ctx.fillStyle = s.textColor;
  ctx.fillText(residue.char, residue.x, residue.y);
}

function drawHead(column, s, layer) {
  if (column.headY < -layer.fontSize || column.headY > height + layer.fontSize) return;

  ctx.globalAlpha = layer.alpha;
  ctx.shadowBlur = s.glow * layer.alpha;
  ctx.shadowColor = s.headColor;
  ctx.fillStyle = s.headColor;
  ctx.fillText(randomChar(s.characters), column.x, column.headY);
}

function drawColumn(column, s, layer) {
  if (column.skip) {
    if (Math.random() < 0.004 + layer.alpha * 0.004) column.skip = false;
    return;
  }

  ctx.font = `${layer.fontSize}px "SFMono-Regular", Consolas, monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  column.residues.forEach((residue) => drawResidue(residue, s, layer));
  drawHead(column, s, layer);
  ctx.globalAlpha = 1;
}

function stepColumn(column, s, layer, index) {
  const baseStep = Math.max(1, layer.fontSize * 0.62);
  const previousHeadY = column.headY;

  const maxLife = Math.max(5, Math.round(s.trail * layer.speedScale * column.speedOffset));
  column.residues.unshift({
    x: column.x,
    y: previousHeadY,
    char: randomChar(s.characters),
    life: maxLife,
    maxLife,
  });
  column.headY += baseStep * column.speedOffset;

  column.residues = column.residues
    .map((residue) => ({ ...residue, life: residue.life - 1 }))
    .filter((residue) => residue.life > 0);

  if (Math.random() < 0.05 + s.variance * 0.04 && column.residues.length > 0) {
    const swapIndex = Math.floor(Math.random() * column.residues.length);
    column.residues[swapIndex].char = randomChar(s.characters);
  }

  if (column.headY > height + maxLife * layer.fontSize) {
    layer.columns[index] = makeColumn(index, s, layer, true);
  }
}

function frame(now) {
  const s = settings();
  const elapsed = now - lastFrame;
  lastFrame = now;

  if (!controls.paused.checked) {
    accumulator += elapsed;
    const frameInterval = Math.max(16, 1000 / s.speed);

    if (accumulator >= frameInterval) {
      paintBackground(s);
      layers.forEach((layer) => {
        layer.columns.forEach((column, index) => {
          drawColumn(column, s, layer);
          stepColumn(column, s, layer, index);
        });
      });
      accumulator = 0;
    }
  }

  requestAnimationFrame(frame);
}

function randomize() {
  const palettes = [
    ["#00ff66", "#ddffdd", "#000000"],
    ["#2cff8e", "#effff3", "#010201"],
    ["#b7ff3c", "#f4ffd7", "#000200"],
    ["#38ffbd", "#ffffff", "#000304"],
  ];
  const palette = palettes[Math.floor(Math.random() * palettes.length)];
  controls.textColor.value = palette[0];
  controls.headColor.value = palette[1];
  controls.backgroundColor.value = palette[2];
  controls.fontSize.value = String(12 + Math.floor(Math.random() * 17));
  controls.speed.value = String(7 + Math.floor(Math.random() * 16));
  controls.density.value = String(58 + Math.floor(Math.random() * 40));
  controls.trail.value = String(16 + Math.floor(Math.random() * 18));
  controls.depth.value = String(3 + Math.floor(Math.random() * 3));
  controls.variance.value = String(35 + Math.floor(Math.random() * 55));
  controls.glow.value = String(2 + Math.floor(Math.random() * 7));
  resetRain();
}

function togglePanel() {
  const hidden = document.body.classList.toggle("config-hidden");
  controls.togglePanelBtn.setAttribute("aria-expanded", String(!hidden));
  controls.togglePanelBtn.textContent = hidden ? "\u8a2d\u5b9a\u3092\u8868\u793a" : "\u8a2d\u5b9a\u3092\u96a0\u3059";
}

[
  controls.fontSize,
  controls.density,
  controls.trail,
  controls.depth,
  controls.variance,
  controls.characters,
  controls.katakanaMode,
  controls.backgroundColor,
].forEach((control) => control.addEventListener("input", resetRain));

controls.randomizeBtn.addEventListener("click", randomize);
controls.togglePanelBtn.addEventListener("click", togglePanel);
window.addEventListener("resize", resize);

resize();
requestAnimationFrame(frame);

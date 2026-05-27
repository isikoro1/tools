const canvas = document.querySelector("#rainCanvas");
const ctx = canvas.getContext("2d");

const controls = {
  characters: document.querySelector("#characters"),
  fontSize: document.querySelector("#fontSize"),
  speed: document.querySelector("#speed"),
  density: document.querySelector("#density"),
  trail: document.querySelector("#trail"),
  jitter: document.querySelector("#jitter"),
  glow: document.querySelector("#glow"),
  textColor: document.querySelector("#textColor"),
  headColor: document.querySelector("#headColor"),
  backgroundColor: document.querySelector("#backgroundColor"),
  katakanaMode: document.querySelector("#katakanaMode"),
  paused: document.querySelector("#paused"),
  randomizeBtn: document.querySelector("#randomizeBtn"),
};

const katakana =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const symbols = "@#$%&*+-=<>[]{}()/\\|:;?!";

let width = 0;
let height = 0;
let dpr = 1;
let columns = [];
let lastFrame = performance.now();
let accumulator = 0;

function settings() {
  return {
    fontSize: Number(controls.fontSize.value),
    speed: Number(controls.speed.value),
    density: Number(controls.density.value) / 100,
    trail: Number(controls.trail.value),
    jitter: Number(controls.jitter.value) / 100,
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

function makeColumn(index, s, startAbove = true) {
  const streamLength = Math.max(8, Math.round(s.trail * (0.85 + Math.random() * 0.8)));
  return {
    x: index * s.fontSize,
    y: startAbove ? -Math.random() * height : Math.random() * height,
    speedOffset: 0.7 + Math.random() * 0.85,
    skip: Math.random() > s.density,
    glyphs: Array.from({ length: streamLength }, () => randomChar(s.characters)),
    drift: (Math.random() - 0.5) * s.jitter,
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
  resetColumns();
}

function resetColumns() {
  const s = settings();
  const count = Math.ceil(width / s.fontSize);
  columns = Array.from({ length: count }, (_, index) => makeColumn(index, s, false));
  paintBackground(s);
}

function paintBackground(s) {
  ctx.shadowBlur = 0;
  ctx.fillStyle = s.backgroundColor;
  ctx.fillRect(0, 0, width, height);
}

function drawColumn(column, s) {
  if (column.skip) {
    if (Math.random() < 0.006) column.skip = false;
    return;
  }

  const charWidth = s.fontSize * 0.72;
  const xJitter = column.drift * charWidth;

  ctx.font = `${s.fontSize}px "SFMono-Regular", Consolas, monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  for (let i = column.glyphs.length - 1; i >= 0; i -= 1) {
    const y = column.y - i * s.fontSize;
    if (y < -s.fontSize || y > height + s.fontSize) continue;

    const depth = i / Math.max(1, column.glyphs.length - 1);
    const opacity = i === 0 ? 1 : Math.max(0.18, (1 - depth) ** 1.55);
    const isHead = i === 0;
    const x = column.x + xJitter;

    ctx.shadowBlur = isHead ? s.glow : Math.min(2, s.glow * 0.18);
    ctx.shadowColor = isHead ? s.headColor : s.textColor;
    ctx.fillStyle = isHead ? s.headColor : hexToRgba(s.textColor, opacity);
    ctx.fillText(column.glyphs[i], x, y);

    if (isHead && s.glow > 0) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = hexToRgba(s.textColor, 0.84);
      ctx.fillText(column.glyphs[i], x, y);
    }
  }
}

function stepColumn(column, s, index) {
  column.y += s.fontSize * column.speedOffset;
  column.glyphs.unshift(randomChar(s.characters));
  column.glyphs.length = Math.max(8, Math.round(s.trail * column.speedOffset));

  if (Math.random() < 0.04) {
    const swapIndex = Math.floor(Math.random() * column.glyphs.length);
    column.glyphs[swapIndex] = randomChar(s.characters);
  }

  if (column.y > height + column.glyphs.length * s.fontSize) {
    columns[index] = makeColumn(index, s, true);
  }
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const bigint = Number.parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
      columns.forEach((column, index) => {
        drawColumn(column, s);
        stepColumn(column, s, index);
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
  controls.fontSize.value = String(12 + Math.floor(Math.random() * 18));
  controls.speed.value = String(7 + Math.floor(Math.random() * 16));
  controls.density.value = String(55 + Math.floor(Math.random() * 45));
  controls.trail.value = String(14 + Math.floor(Math.random() * 16));
  controls.jitter.value = String(Math.floor(Math.random() * 32));
  controls.glow.value = String(2 + Math.floor(Math.random() * 7));
  resetColumns();
}

[
  controls.fontSize,
  controls.density,
  controls.trail,
  controls.characters,
  controls.katakanaMode,
  controls.backgroundColor,
].forEach((control) => control.addEventListener("input", resetColumns));

controls.randomizeBtn.addEventListener("click", randomize);
window.addEventListener("resize", resize);

resize();
requestAnimationFrame(frame);

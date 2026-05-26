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
  columns = Array.from({ length: count }, (_, index) => ({
    x: index * s.fontSize,
    y: Math.random() * -height,
    speedOffset: 0.65 + Math.random() * 0.85,
    skip: Math.random() > s.density,
  }));
  ctx.fillStyle = s.backgroundColor;
  ctx.fillRect(0, 0, width, height);
}

function drawColumn(column, s) {
  if (column.skip) {
    if (Math.random() < 0.003) column.skip = false;
    return;
  }

  const rows = Math.ceil(s.trail);
  const xJitter = (Math.random() - 0.5) * s.fontSize * s.jitter;

  ctx.font = `${s.fontSize}px "SFMono-Regular", Consolas, monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.shadowColor = s.textColor;
  ctx.shadowBlur = s.glow;

  for (let i = rows; i >= 0; i -= 1) {
    const y = column.y - i * s.fontSize;
    if (y < -s.fontSize || y > height + s.fontSize) continue;

    const opacity = i === 0 ? 1 : Math.max(0.08, 1 - i / rows);
    ctx.fillStyle = i === 0 ? s.headColor : hexToRgba(s.textColor, opacity);
    ctx.fillText(randomChar(s.characters), column.x + xJitter, y);
  }

  column.y += s.fontSize * column.speedOffset;
  if (column.y > height + rows * s.fontSize) {
    column.y = Math.random() * -height * 0.45;
    column.speedOffset = 0.65 + Math.random() * 0.85;
    column.skip = Math.random() > s.density;
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
      ctx.fillStyle = hexToRgba(s.backgroundColor, 1 / s.trail);
      ctx.fillRect(0, 0, width, height);
      columns.forEach((column) => drawColumn(column, s));
      accumulator = 0;
    }
  }

  requestAnimationFrame(frame);
}

function randomize() {
  const palettes = [
    ["#00ff66", "#ddffdd", "#020403"],
    ["#38ffbd", "#ffffff", "#010607"],
    ["#b7ff3c", "#f4ffd7", "#030500"],
    ["#45d6ff", "#effcff", "#010409"],
  ];
  const palette = palettes[Math.floor(Math.random() * palettes.length)];
  controls.textColor.value = palette[0];
  controls.headColor.value = palette[1];
  controls.backgroundColor.value = palette[2];
  controls.fontSize.value = String(12 + Math.floor(Math.random() * 18));
  controls.speed.value = String(6 + Math.floor(Math.random() * 18));
  controls.density.value = String(45 + Math.floor(Math.random() * 55));
  controls.trail.value = String(8 + Math.floor(Math.random() * 14));
  controls.jitter.value = String(Math.floor(Math.random() * 46));
  controls.glow.value = String(4 + Math.floor(Math.random() * 18));
  resetColumns();
}

[
  controls.fontSize,
  controls.density,
  controls.characters,
  controls.katakanaMode,
  controls.backgroundColor,
].forEach((control) => control.addEventListener("input", resetColumns));

controls.randomizeBtn.addEventListener("click", randomize);
window.addEventListener("resize", resize);

resize();
requestAnimationFrame(frame);

const canvas = document.querySelector("#rainCanvas");
const ctx = canvas.getContext("2d");

const controls = {
  characters: document.querySelector("#characters"),
  fontSize: document.querySelector("#fontSize"),
  speed: document.querySelector("#speed"),
  speedLimit: document.querySelector("#speedLimit"),
  density: document.querySelector("#density"),
  trail: document.querySelector("#trail"),
  rowSpacing: document.querySelector("#rowSpacing"),
  depth: document.querySelector("#depth"),
  depthStrength: document.querySelector("#depthStrength"),
  variance: document.querySelector("#variance"),
  glow: document.querySelector("#glow"),
  glyphGlow: document.querySelector("#glyphGlow"),
  textColor: document.querySelector("#textColor"),
  headColor: document.querySelector("#headColor"),
  backgroundColor: document.querySelector("#backgroundColor"),
  katakanaMode: document.querySelector("#katakanaMode"),
  paused: document.querySelector("#paused"),
  randomizeBtn: document.querySelector("#randomizeBtn"),
  exportPngBtn: document.querySelector("#exportPngBtn"),
  exportGifBtn: document.querySelector("#exportGifBtn"),
  gifFps: document.querySelector("#gifFps"),
  gifSeconds: document.querySelector("#gifSeconds"),
  exportStatus: document.querySelector("#exportStatus"),
  controlPanel: document.querySelector("#controlPanel"),
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
let isExportingGif = false;

function settings() {
  const speedLimit = Number(controls.speedLimit.value);
  return {
    fontSize: Number(controls.fontSize.value),
    speed: Math.min(Number(controls.speed.value), speedLimit),
    speedLimit,
    density: Number(controls.density.value) / 100,
    trail: Number(controls.trail.value),
    rowSpacing: Number(controls.rowSpacing.value) / 100,
    depth: Number(controls.depth.value),
    depthStrength: Number(controls.depthStrength.value) / 100,
    variance: Number(controls.variance.value) / 100,
    glow: Number(controls.glow.value),
    glyphGlow: Number(controls.glyphGlow.value) / 100,
    textColor: controls.textColor.value,
    headColor: controls.headColor.value,
    backgroundColor: controls.backgroundColor.value,
    characters: buildCharacters(),
  };
}

function buildCharacters() {
  const custom = controls.characters.value.trim();
  const base = custom.length ? custom : latin;
  const characters = controls.katakanaMode.checked ? `${base}${katakana}${katakana}${symbols}` : base;
  return Array.from(characters, toFullWidth).join("");
}

function toFullWidth(char) {
  const code = char.charCodeAt(0);
  if (code === 0x20) return "\u3000";
  if (code >= 0x21 && code <= 0x7e) return String.fromCharCode(code + 0xfee0);
  return char.normalize("NFKC").replace(/[!-~]/g, (value) =>
    String.fromCharCode(value.charCodeAt(0) + 0xfee0),
  );
}

function randomChar(chars) {
  return chars[Math.floor(Math.random() * chars.length)] || "\uff10";
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function makeLayer(layerIndex, s) {
  const denominator = Math.max(1, s.depth - 1);
  const depthRatio = s.depth === 1 ? 1 : layerIndex / denominator;
  const depthAmount = s.depthStrength * depthRatio;
  const scale = 1 - s.depthStrength * 0.22 + depthAmount * 0.32;
  const alpha = 0.42 + depthAmount * 0.58;
  const speedScale = 0.72 + depthAmount * 0.42;
  const fontSize = Math.max(8, Math.round(s.fontSize * scale));
  const spacing = fontSize * randomBetween(0.95, 1.08);
  const rowStep = fontSize * (1.55 + s.rowSpacing * 0.62);
  const count = Math.ceil(width / spacing) + 2;

  const layer = {
    alpha,
    fontSize,
    spacing,
    rowStep,
    speedScale,
    columns: [],
  };

  layer.columns = Array.from({ length: count }, (_, index) => makeColumn(index, s, layer, true));
  return layer;
}

function makeColumn(index, s, layer, spreadStart = false) {
  const varianceMin = 1 - s.variance * 0.42;
  const varianceMax = 1 + s.variance * 0.82;
  const rowCount = Math.ceil(height / layer.rowStep) + 4;
  const startDelay = spreadStart ? Math.floor(randomBetween(0, rowCount * 1.6)) : Math.floor(randomBetween(0, 8));

  return {
    x: index * layer.spacing + layer.spacing / 2,
    row: -1,
    headChar: randomChar(s.characters),
    startDelay,
    speedOffset: randomBetween(varianceMin, varianceMax) * layer.speedScale,
    cooldown: 0,
    skip: Math.random() > s.density * (0.82 + layer.alpha * 0.18),
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

function prepareText(layer) {
  ctx.font = `${layer.fontSize}px "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
}

function drawGlowingGlyph(char, x, y, color, alpha, glow, intensity) {
  const innerGlow = Math.min(5, glow * 0.42);
  const outerGlow = Math.min(9, glow * 0.72);
  const glowAlpha = Math.max(0, intensity);

  if (glow > 0 && glowAlpha > 0) {
    ctx.globalAlpha = alpha * 0.28 * glowAlpha;
    ctx.shadowBlur = outerGlow;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fillText(char, x, y);

    ctx.globalAlpha = alpha * 0.42 * glowAlpha;
    ctx.shadowBlur = innerGlow;
    ctx.fillText(char, x, y);
  }

  ctx.globalAlpha = alpha;
  ctx.shadowBlur = 0;
  ctx.fillStyle = color;
  ctx.fillText(char, x, y);
}

function drawResidue(residue, s, layer) {
  const age = Math.max(0, residue.life / residue.maxLife);
  const alpha = Math.max(0.04, age ** 1.45) * layer.alpha;
  drawGlowingGlyph(residue.char, residue.x, residue.y, s.textColor, alpha, s.glow * 0.55, s.glyphGlow);
}

function drawHead(column, s, layer) {
  if (column.startDelay > 0) return;
  const headY = column.row * layer.rowStep + layer.rowStep / 2;
  if (headY < -layer.rowStep || headY > height + layer.rowStep) return;

  drawGlowingGlyph(column.headChar, column.x, headY, s.headColor, layer.alpha, s.glow * 1.25, s.glyphGlow);
}

function drawColumn(column, s, layer) {
  prepareText(layer);
  column.residues.forEach((residue) => drawResidue(residue, s, layer));
  drawHead(column, s, layer);
  ctx.globalAlpha = 1;
}

function stepColumn(column, s, layer, index) {
  if (column.startDelay > 0) {
    column.startDelay -= 1;
    return;
  }

  column.residues = column.residues
    .map((residue) => ({ ...residue, life: residue.life - 1 }))
    .filter((residue) => residue.life > 0);

  if (column.cooldown > 0) {
    column.cooldown -= 1;
    return;
  }

  const previousHeadY = column.row * layer.rowStep + layer.rowStep / 2;
  const maxLife = Math.max(8, Math.round(s.trail));

  if (previousHeadY >= -layer.fontSize && previousHeadY <= height + layer.fontSize) {
    column.residues.unshift({
      x: column.x,
      y: previousHeadY,
      char: randomChar(s.characters),
      life: maxLife,
      maxLife,
    });
  }

  column.row += 1;
  column.headChar = randomChar(s.characters);
  column.cooldown = Math.max(0, Math.round(1.65 / Math.max(0.4, column.speedOffset)) - 1);

  if (Math.random() < 0.05 + s.variance * 0.04 && column.residues.length > 0) {
    const swapIndex = Math.floor(Math.random() * column.residues.length);
    column.residues[swapIndex].char = randomChar(s.characters);
  }

  if (column.row * layer.rowStep > height + maxLife * layer.rowStep) {
    layer.columns[index] = makeColumn(index, s, layer, false);
  }
}

function tickRain() {
  const s = settings();
      paintBackground(s);
      layers.forEach((layer) => {
        layer.columns.forEach((column, index) => {
          if (column.skip) {
            if (Math.random() < 0.004 + layer.alpha * 0.004) column.skip = false;
            return;
          }
          drawColumn(column, s, layer);
          stepColumn(column, s, layer, index);
        });
  });
}

function frame(now) {
  const elapsed = now - lastFrame;
  lastFrame = now;

  if (!controls.paused.checked) {
    accumulator += elapsed;
    const frameInterval = Math.max(16, 1000 / settings().speed);

    if (accumulator >= frameInterval) {
      tickRain();
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
  controls.speedLimit.value = String(16 + Math.floor(Math.random() * 9));
  controls.speed.value = String(12 + Math.floor(Math.random() * Number(controls.speedLimit.value - 11)));
  controls.density.value = String(58 + Math.floor(Math.random() * 40));
  controls.trail.value = String(26 + Math.floor(Math.random() * 25));
  controls.rowSpacing.value = String(42 + Math.floor(Math.random() * 38));
  controls.depth.value = String(1 + Math.floor(Math.random() * 3));
  controls.depthStrength.value = String(18 + Math.floor(Math.random() * 42));
  controls.variance.value = String(25 + Math.floor(Math.random() * 45));
  controls.glow.value = String(2 + Math.floor(Math.random() * 7));
  controls.glyphGlow.value = String(35 + Math.floor(Math.random() * 50));
  updateSpeedRange();
  resetRain();
}

function togglePanel() {
  document.body.classList.toggle("config-hidden");
}

function updateSpeedRange() {
  controls.speed.max = controls.speedLimit.value;
  if (Number(controls.speed.value) > Number(controls.speedLimit.value)) {
    controls.speed.value = controls.speedLimit.value;
  }
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function exportPng() {
  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, "matrix-rain.png");
  }, "image/png");
}

async function exportGif() {
  if (isExportingGif) return;
  isExportingGif = true;
  controls.exportGifBtn.disabled = true;
  controls.exportStatus.textContent = "GIF rendering...";

  const fps = Number(controls.gifFps.value);
  const seconds = Number(controls.gifSeconds.value);
  const frameCount = Math.max(1, Math.round(fps * seconds));
  const delay = Math.round(100 / fps);
  const exportCanvas = document.createElement("canvas");
  const maxWidth = 720;
  const scale = Math.min(1, maxWidth / canvas.width);
  exportCanvas.width = Math.max(1, Math.round(canvas.width * scale));
  exportCanvas.height = Math.max(1, Math.round(canvas.height * scale));
  const exportCtx = exportCanvas.getContext("2d", { willReadFrequently: true });
  const frames = [];

  for (let i = 0; i < frameCount; i += 1) {
    tickRain();
    exportCtx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
    frames.push(exportCtx.getImageData(0, 0, exportCanvas.width, exportCanvas.height));
    controls.exportStatus.textContent = `GIF ${i + 1}/${frameCount}`;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  const blob = encodeGif(frames, delay);
  downloadBlob(blob, "matrix-rain.gif");
  controls.exportStatus.textContent = "GIF saved";
  controls.exportGifBtn.disabled = false;
  isExportingGif = false;
}

function encodeGif(frames, delay) {
  const width = frames[0].width;
  const height = frames[0].height;
  const palette = makePalette();
  const bytes = [];
  const write = (...values) => bytes.push(...values);
  const writeString = (value) => Array.from(value).forEach((char) => write(char.charCodeAt(0)));
  const writeShort = (value) => write(value & 255, (value >> 8) & 255);

  writeString("GIF89a");
  writeShort(width);
  writeShort(height);
  write(0xf3, 0, 0);
  palette.forEach((color) => write(color[0], color[1], color[2]));
  write(0x21, 0xff, 0x0b);
  writeString("NETSCAPE2.0");
  write(0x03, 0x01);
  writeShort(0);
  write(0);

  frames.forEach((frame) => {
    write(0x21, 0xf9, 0x04, 0x00);
    writeShort(delay);
    write(0, 0);
    write(0x2c);
    writeShort(0);
    writeShort(0);
    writeShort(width);
    writeShort(height);
    write(0);
    write(4);
    writeSubBlocks(bytes, lzwEncode(indexPixels(frame.data, palette), 4));
  });

  write(0x3b);
  return new Blob([new Uint8Array(bytes)], { type: "image/gif" });
}

function makePalette() {
  const text = hexToRgb(controls.textColor.value);
  const head = hexToRgb(controls.headColor.value);
  const bg = hexToRgb(controls.backgroundColor.value);
  const palette = [bg];
  for (let i = 1; i <= 11; i += 1) palette.push(mix(bg, text, i / 11));
  palette.push(mix(text, head, 0.45), mix(text, head, 0.7), head, [255, 255, 255]);
  return palette.slice(0, 16);
}

function hexToRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function mix(a, b, amount) {
  return a.map((value, index) => Math.round(value + (b[index] - value) * amount));
}

function indexPixels(data, palette) {
  const indexed = new Uint8Array(data.length / 4);
  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    let best = 0;
    let bestDistance = Infinity;
    for (let c = 0; c < palette.length; c += 1) {
      const color = palette[c];
      const dr = data[i] - color[0];
      const dg = data[i + 1] - color[1];
      const db = data[i + 2] - color[2];
      const distance = dr * dr + dg * dg + db * db;
      if (distance < bestDistance) {
        best = c;
        bestDistance = distance;
      }
    }
    indexed[p] = best;
  }
  return indexed;
}

function lzwEncode(indices, minCodeSize) {
  const clearCode = 1 << minCodeSize;
  const endCode = clearCode + 1;
  const output = [];
  let bitBuffer = 0;
  let bitCount = 0;
  const codeSize = minCodeSize + 1;

  function emit(code) {
    bitBuffer |= code << bitCount;
    bitCount += codeSize;
    while (bitCount >= 8) {
      output.push(bitBuffer & 255);
      bitBuffer >>= 8;
      bitCount -= 8;
    }
  }

  emit(clearCode);

  indices.forEach((index, position) => {
    if (position > 0 && position % 8 === 0) {
      emit(clearCode);
    }
    emit(index);
  });

  emit(endCode);
  if (bitCount > 0) output.push(bitBuffer & 255);
  return output;
}

function writeSubBlocks(bytes, data) {
  for (let i = 0; i < data.length; i += 255) {
    const block = data.slice(i, i + 255);
    bytes.push(block.length, ...block);
  }
  bytes.push(0);
}

[
  controls.fontSize,
  controls.density,
  controls.trail,
  controls.rowSpacing,
  controls.depth,
  controls.depthStrength,
  controls.variance,
  controls.characters,
  controls.katakanaMode,
  controls.backgroundColor,
].forEach((control) => control.addEventListener("input", resetRain));

controls.speedLimit.addEventListener("input", updateSpeedRange);
controls.randomizeBtn.addEventListener("click", randomize);
controls.exportPngBtn.addEventListener("click", exportPng);
controls.exportGifBtn.addEventListener("click", exportGif);
controls.controlPanel.addEventListener("click", (event) => event.stopPropagation());
document.body.addEventListener("click", togglePanel);
window.addEventListener("resize", resize);

updateSpeedRange();
resize();
requestAnimationFrame(frame);

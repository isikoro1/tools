const canvas = document.querySelector("#rainCanvas");
const ctx = canvas.getContext("2d");

const controls = {
  characters: document.querySelector("#characters"),
  characterPreset: document.querySelector("#characterPreset"),
  customPresetName: document.querySelector("#customPresetName"),
  addPresetBtn: document.querySelector("#addPresetBtn"),
  updatePresetBtn: document.querySelector("#updatePresetBtn"),
  deletePresetBtn: document.querySelector("#deletePresetBtn"),
  fontSize: document.querySelector("#fontSize"),
  speedMin: document.querySelector("#speedMin"),
  speedMax: document.querySelector("#speedMax"),
  density: document.querySelector("#density"),
  frequency: document.querySelector("#frequency"),
  displayLimit: document.querySelector("#displayLimit"),
  trail: document.querySelector("#trail"),
  direction: document.querySelector("#direction"),
  characterOrder: document.querySelector("#characterOrder"),
  rowSpacing: document.querySelector("#rowSpacing"),
  fontWeight: document.querySelector("#fontWeight"),
  depth: document.querySelector("#depth"),
  depthStrength: document.querySelector("#depthStrength"),
  variance: document.querySelector("#variance"),
  varianceMode: document.querySelector("#varianceMode"),
  glow: document.querySelector("#glow"),
  glyphGlow: document.querySelector("#glyphGlow"),
  glyphBlur: document.querySelector("#glyphBlur"),
  textColor: document.querySelector("#textColor"),
  headColor: document.querySelector("#headColor"),
  backgroundColor: document.querySelector("#backgroundColor"),
  paused: document.querySelector("#paused"),
  fullscreenBtn: document.querySelector("#fullscreenBtn"),
  defaultBtn: document.querySelector("#defaultBtn"),
  randomizeBtn: document.querySelector("#randomizeBtn"),
  exportPngBtn: document.querySelector("#exportPngBtn"),
  exportGifBtn: document.querySelector("#exportGifBtn"),
  gifFps: document.querySelector("#gifFps"),
  gifSeconds: document.querySelector("#gifSeconds"),
  saveJsonBtn: document.querySelector("#saveJsonBtn"),
  loadJsonBtn: document.querySelector("#loadJsonBtn"),
  loadJsonInput: document.querySelector("#loadJsonInput"),
  exportStatus: document.querySelector("#exportStatus"),
  controlPanel: document.querySelector("#controlPanel"),
};

const settingKeys = [
  "characters",
  "characterPreset",
  "fontSize",
  "fontWeight",
  "speedMin",
  "speedMax",
  "density",
  "frequency",
  "displayLimit",
  "trail",
  "direction",
  "characterOrder",
  "rowSpacing",
  "depth",
  "depthStrength",
  "variance",
  "varianceMode",
  "glow",
  "glyphGlow",
  "glyphBlur",
  "textColor",
  "headColor",
  "backgroundColor",
  "paused",
  "gifFps",
  "gifSeconds",
];

const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const defaultConfig = {
  characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\u30a2\u30a4\u30a6\u30a8\u30aa\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce",
  characterPreset: "default",
  fontSize: "18",
  fontWeight: "500",
  speedMin: "7",
  speedMax: "18",
  density: "88",
  frequency: "100",
  displayLimit: "780",
  trail: "34",
  direction: "down",
  characterOrder: "random",
  rowSpacing: "35",
  depth: "2",
  depthStrength: "36",
  variance: "90",
  varianceMode: "uniform",
  glow: "8",
  glyphGlow: "110",
  glyphBlur: "0",
  textColor: "#00ff66",
  headColor: "#ddffdd",
  backgroundColor: "#000000",
  paused: false,
  gifFps: "12",
  gifSeconds: "2",
};
const builtInPresets = {
  default: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\u30a2\u30a4\u30a6\u30a8\u30aa\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce",
  matrix: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-=<>[]{}?/\\|:;!\u30a2\u30a4\u30a6\u30a8\u30aa\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce",
  katakana: "\u30a2\u30a4\u30a6\u30a8\u30aa\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce\u30cf\u30d2\u30d5\u30d8\u30db\u30de\u30df\u30e0\u30e1\u30e2\u30e4\u30e6\u30e8\u30e9\u30ea\u30eb\u30ec\u30ed\u30ef\u30f2\u30f3",
  symbols: "@#$%&*+-=<>[]{}()/\\|:;?!^~_",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  kanji: "\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f\u5929\u5730\u4eba\u4e0a\u4e0b\u5de6\u53f3\u6771\u897f\u5357\u5317\u96f6\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d",
  greek: "\u0391\u0392\u0393\u0394\u0395\u0396\u0397\u0398\u0399\u039a\u039b\u039c\u039d\u039e\u039f\u03a0\u03a1\u03a3\u03a4\u03a5\u03a6\u03a7\u03a8\u03a9\u03b1\u03b2\u03b3\u03b4\u03b5\u03b6\u03b7\u03b8\u03b9\u03ba\u03bb\u03bc\u03bd\u03be\u03bf\u03c0\u03c1\u03c3\u03c4\u03c5\u03c6\u03c7\u03c8\u03c9",
  emoji: "\u25c6\u25c7\u25cf\u25cb\u25c9\u25ce\u25cc\u25cd\u25c8\u25a1\u25a0\u25b3\u25b2\u25bd\u25bc\u2605\u2606\u2726\u2727\u273a\u2739",
  binary: "01",
  korean: "\uac00\ub098\ub2e4\ub77c\ub9c8\ubc14\uc0ac\uc544\uc790\ucc28\uce74\ud0c0\ud30c\ud558\uac70\ub108\ub354\ub7ec\uba38\ubc84\uc11c\uc5b4\uc800\ucc98\ucee4\ud130\ud37c\ud5c8",
  cat: "\uff86\uff6c\uff9d\uff90\uff6c\uff73\uff88\uff7a\uff8f\uff75\uff86\uff6c\uff70\uff7a\uff9e\uff7a\uff9e\uff9b\uff7d\uff98\uff93\uff8c",
};
let customPresets = loadCustomPresets();

let width = 0;
let height = 0;
let dpr = 1;
let layers = [];
let lastFrame = performance.now();
let accumulator = 0;
let isExportingGif = false;

function settings() {
  const speedMin = Number(controls.speedMin.value);
  const speedMax = Math.max(speedMin, Number(controls.speedMax.value));
  return {
    fontSize: Number(controls.fontSize.value),
    fontWeight: Number(controls.fontWeight.value),
    speedMin,
    speedMax,
    density: Number(controls.density.value) / 100,
    frequency: Number(controls.frequency.value) / 100,
    displayLimit: Number(controls.displayLimit.value),
    trail: Number(controls.trail.value),
    direction: controls.direction.value,
    characterOrder: controls.characterOrder.value,
    rowSpacing: Math.max(8, Number(controls.rowSpacing.value)) / 100,
    depth: Number(controls.depth.value),
    depthStrength: Number(controls.depthStrength.value) / 100,
    variance: Number(controls.variance.value) / 100,
    varianceMode: controls.varianceMode.value,
    glow: Number(controls.glow.value),
    glyphGlow: Number(controls.glyphGlow.value) / 100,
    glyphBlur: Number(controls.glyphBlur.value),
    textColor: controls.textColor.value,
    headColor: controls.headColor.value,
    backgroundColor: controls.backgroundColor.value,
    textRgb: hexToRgb(controls.textColor.value),
    headRgb: hexToRgb(controls.headColor.value),
    backgroundRgb: hexToRgb(controls.backgroundColor.value),
    characters: buildCharacters(),
  };
}

function buildCharacters() {
  const custom = controls.characters.value.trim();
  const base = custom.length ? custom : latin;
  return Array.from(base, toFullWidth).join("");
}

function allPresets() {
  return { ...builtInPresets, ...customPresets };
}

function loadCustomPresets() {
  try {
    return JSON.parse(localStorage.getItem("matrixRainCustomPresets") || "{}");
  } catch {
    return {};
  }
}

function saveCustomPresets() {
  localStorage.setItem("matrixRainCustomPresets", JSON.stringify(customPresets));
}

function renderPresetOptions(selected = controls.characterPreset.value) {
  const labels = {
    default: "\u30c7\u30d5\u30a9\u30eb\u30c8",
    matrix: "Matrix mix",
    katakana: "\u30ab\u30bf\u30ab\u30ca",
    symbols: "\u8a18\u53f7",
    alphabet: "\u30a2\u30eb\u30d5\u30a1\u30d9\u30c3\u30c8",
    kanji: "\u6f22\u5b57",
    greek: "\u30ae\u30ea\u30b7\u30e3\u6587\u5b57",
    emoji: "\u7d75\u6587\u5b57",
    binary: "\u30d0\u30a4\u30ca\u30ea",
    korean: "\u97d3\u56fd\u8a9e",
    cat: "\u732b\u8a9e",
  };
  controls.characterPreset.innerHTML = '<option value="">Custom</option>';
  Object.keys(builtInPresets).forEach((key) => {
    controls.characterPreset.add(new Option(labels[key] || key, key));
  });
  Object.keys(customPresets).sort().forEach((key) => {
    controls.characterPreset.add(new Option(`Custom: ${key.replace(/^custom:/, "")}`, key));
  });
  controls.characterPreset.value = selected in allPresets() ? selected : "";
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

function characterAt(chars, index) {
  const glyphs = Array.from(chars);
  return glyphs[((index % glyphs.length) + glyphs.length) % glyphs.length] || "\uff10";
}

function nextCharacter(column, s) {
  if (s.characterOrder === "sequence") {
    column.charIndex += 1;
    return characterAt(s.characters, column.charIndex);
  }
  if (s.characterOrder === "reverse") {
    column.charIndex -= 1;
    return characterAt(s.characters, column.charIndex);
  }
  column.charIndex = Math.floor(Math.random() * Array.from(s.characters).length);
  return characterAt(s.characters, column.charIndex);
}

function isHorizontal(s) {
  return s.direction === "left" || s.direction === "right";
}

function flowExtent(s) {
  return isHorizontal(s) ? width : height;
}

function laneExtent(s) {
  return isHorizontal(s) ? height : width;
}

function flowPoint(lanePosition, flowPosition, s) {
  if (s.direction === "up") return { x: lanePosition, y: height - flowPosition };
  if (s.direction === "right") return { x: flowPosition, y: lanePosition };
  if (s.direction === "left") return { x: width - flowPosition, y: lanePosition };
  return { x: lanePosition, y: flowPosition };
}

function distributionSample(mode) {
  const a = Math.random();
  const b = Math.random();
  if (mode === "center") return (a + b + Math.random()) / 3;
  if (mode === "extreme") return a < 0.5 ? Math.pow(b, 2) * 0.5 : 1 - Math.pow(b, 2) * 0.5;
  if (mode === "slow") return Math.pow(a, 2);
  if (mode === "fast") return 1 - Math.pow(1 - a, 2);
  return a;
}

function makeLayer(layerIndex, s) {
  const denominator = Math.max(1, s.depth - 1);
  const depthRatio = s.depth === 1 ? 1 : layerIndex / denominator;
  const frontRatio = s.depth === 1 ? 1 : 1 - depthRatio;
  const depthAmount = s.depthStrength * frontRatio;
  const scale = 1 - s.depthStrength * 0.22 + depthAmount * 0.32;
  const alpha = 0.16 + depthAmount * 0.84;
  const speedScale = 0.72 + depthAmount * 0.42;
  const fontSize = Math.max(8, Math.round(s.fontSize * scale));
  const spacing = fontSize * randomBetween(0.95, 1.08);
  const rowStep = fontSize * (0.78 + s.rowSpacing * 1.38);
  const count = Math.ceil(laneExtent(s) / spacing) + 2;

  const layer = {
    alpha,
    depthRatio,
    frontRatio,
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
  const varianceMin = Math.max(0.02, 1 - s.variance * 0.95);
  const varianceMax = 1 + s.variance * 2.8;
  const rowCount = Math.ceil(flowExtent(s) / layer.rowStep) + 4;
  const startDelay = spreadStart ? Math.floor(randomBetween(0, rowCount * 1.6)) : Math.floor(randomBetween(0, 8));
  const baseCps = randomBetween(s.speedMin, s.speedMax);
  const varianceFactor = varianceMin + (varianceMax - varianceMin) * distributionSample(s.varianceMode);
  const minVisibleCps = Math.max(1.2, s.speedMin * 0.35 * layer.speedScale);
  const cps = Math.max(minVisibleCps, baseCps * varianceFactor * layer.speedScale * s.frequency);
  const charIndex = Math.floor(Math.random() * Array.from(s.characters).length);

  return {
    x: index * layer.spacing + layer.spacing / 2,
    row: -1,
    charIndex,
    headChar: characterAt(s.characters, charIndex),
    startDelay,
    cps,
    residueLimit: 1,
    timer: 0,
    skip: Math.random() > Math.min(1, s.density * (0.94 + layer.alpha * 0.08)),
    residues: [],
    flashes: [],
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

function prepareText(layer, s) {
  ctx.font = `${s.fontWeight} ${layer.fontSize}px "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
}

function drawGlowingGlyph(char, x, y, color, alpha, glow, intensity, blur) {
  const innerGlow = Math.min(10, glow * (0.36 + intensity * 0.18));
  const outerGlow = Math.min(24, glow * (0.62 + intensity * 0.95));
  const haloGlow = Math.min(42, glow * (0.9 + intensity * 1.2));
  const glowAlpha = Math.max(0, intensity);
  const blurAmount = Math.max(0, blur);

  if (glow > 0 && glowAlpha > 0) {
    ctx.globalAlpha = alpha * 0.28 * glowAlpha;
    ctx.shadowBlur = haloGlow;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fillText(char, x, y);

    ctx.globalAlpha = alpha * 0.62 * glowAlpha;
    ctx.shadowBlur = outerGlow;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fillText(char, x, y);

    ctx.globalAlpha = alpha * 0.86 * glowAlpha;
    ctx.shadowBlur = innerGlow;
    ctx.fillText(char, x, y);
  }

  if (blurAmount > 0) {
    ctx.globalAlpha = alpha * 0.45;
    ctx.shadowBlur = blurAmount * 3.2;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fillText(char, x, y);
  }

  ctx.globalAlpha = alpha;
  ctx.shadowBlur = blurAmount * 1.2;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.fillText(char, x, y);
}

function drawHeadFlash(flash, s, layer) {
  const age = Math.max(0, flash.life / flash.maxLife);
  const size = layer.fontSize * (0.78 + age * 0.28);
  const flashColor = colorToCss(mix(s.headRgb, [255, 255, 255], 0.72));
  ctx.globalAlpha = age ** 1.8 * layer.alpha * (0.18 + layer.frontRatio * 0.38);
  ctx.shadowBlur = s.glow * (2.4 + layer.frontRatio * 2.4);
  ctx.shadowColor = flashColor;
  ctx.fillStyle = flashColor;
  ctx.fillRect(flash.x - size / 2, flash.y - size / 2, size, size);
  ctx.globalAlpha = age * layer.alpha * (0.42 + layer.frontRatio * 0.42);
  ctx.shadowBlur = s.glow * (1.4 + layer.frontRatio * 1.5);
  ctx.strokeStyle = flashColor;
  ctx.lineWidth = Math.max(1, layer.fontSize * 0.06);
  ctx.strokeRect(flash.x - size / 2, flash.y - size / 2, size, size);
}

function drawResidue(residue, s, layer) {
  const age = Math.max(0, residue.life / residue.maxLife);
  const alpha = Math.max(0.03, age ** 1.45) * layer.alpha;
  const color = colorToCss(mix(s.textRgb, s.backgroundRgb, layer.depthRatio * 0.55));
  drawGlowingGlyph(residue.char, residue.x, residue.y, color, alpha, s.glow * (0.38 + layer.frontRatio * 0.22), s.glyphGlow, s.glyphBlur);
}

function drawHead(column, s, layer) {
  if (column.startDelay > 0) return;
  const headFlow = column.row * layer.rowStep + layer.rowStep / 2;
  if (headFlow < -layer.rowStep || headFlow > flowExtent(s) + layer.rowStep) return;
  const point = flowPoint(column.x, headFlow, s);
  const base = mix(s.textRgb, s.headRgb, 0.22 + layer.frontRatio * 0.3);
  const color = colorToCss(mix(base, [255, 255, 255], 0.2 + layer.frontRatio * 0.35));

  drawGlowingGlyph(column.headChar, point.x, point.y, color, layer.alpha, s.glow * (1.35 + layer.frontRatio * 0.95), s.glyphGlow * 1.25, s.glyphBlur);
}

function drawColumn(column, s, layer) {
  prepareText(layer, s);
  column.flashes.forEach((flash) => drawHeadFlash(flash, s, layer));
  column.residues.forEach((residue) => drawResidue(residue, s, layer));
  drawHead(column, s, layer);
  ctx.globalAlpha = 1;
}

function animateColumnEffects(column, elapsedSeconds, s) {
  column.flashes = column.flashes
    .map((flash) => ({ ...flash, life: flash.life - elapsedSeconds }))
    .filter((flash) => flash.life > 0);
  column.residues = column.residues
    .map((residue) => ({
      ...residue,
      char: Math.random() < elapsedSeconds * 0.9 ? randomChar(s.characters) : residue.char,
      life: residue.life - elapsedSeconds,
    }))
    .filter((residue) => residue.life > 0);
}

function replaceColumn(index, s, layer, residues = []) {
  const nextColumn = makeColumn(index, s, layer, false);
  nextColumn.residues = residues;
  layer.columns[index] = nextColumn;
}

function stepSkippedColumn(column, s, layer, index, elapsedSeconds) {
  column.startDelay -= elapsedSeconds * column.cps;
  if (column.startDelay <= 0) {
    replaceColumn(index, s, layer, column.residues);
  }
}

function updateResidueLimits() {
  const columns = layers.flatMap((layer) => layer.columns);
  columns
    .slice()
    .sort((a, b) => a.cps - b.cps)
    .forEach((column, index) => {
      column.residueLimit = index + 1;
    });
}

function maxResidueCount(column) {
  return Math.max(1, column.residueLimit || 1);
}

function activeGlyphCount(s) {
  let count = 0;
  layers.forEach((layer) => {
    layer.columns.forEach((column) => {
      count += column.residues.length;
      const headFlow = column.row * layer.rowStep + layer.rowStep / 2;
      if (!column.skip && column.startDelay <= 0 && headFlow >= -layer.rowStep && headFlow <= flowExtent(s) + layer.rowStep) {
        count += 1;
      }
    });
  });
  return count;
}

function stepColumn(column, s, layer, index, elapsedSeconds, budget) {
  if (column.startDelay > 0) {
    column.startDelay -= elapsedSeconds * column.cps;
    return;
  }

  column.timer += elapsedSeconds;
  const interval = 1 / column.cps;
  let typed = 0;

  while (column.timer >= interval && typed < 6) {
    const previousHeadFlow = column.row * layer.rowStep + layer.rowStep / 2;
    const maxLife = Math.max(0.1, s.trail / 10);
    const maxResidues = maxResidueCount(column);
    const canCreateResidue = previousHeadFlow >= -layer.fontSize && previousHeadFlow <= flowExtent(s) + layer.fontSize;
    const canStoreResidue = column.residues.length < maxResidues && budget.count < budget.limit;

    if (canCreateResidue && !canStoreResidue) {
      column.timer = interval;
      return;
    }

    if (canCreateResidue && canStoreResidue) {
      const point = flowPoint(column.x, previousHeadFlow, s);
      column.residues.unshift({
        x: point.x,
        y: point.y,
        char: column.headChar,
        life: maxLife,
        maxLife,
      });
      column.flashes.unshift({
        x: point.x,
        y: point.y,
        life: 0.18,
        maxLife: 0.18,
      });
      budget.count += 1;
    }

    column.row += 1;
    column.headChar = nextCharacter(column, s);
    column.timer -= interval;
    typed += 1;

    if (column.row * layer.rowStep > flowExtent(s) + maxLife * column.cps * layer.rowStep) {
      replaceColumn(index, s, layer, column.residues);
      return;
    }
  }
}

function tickRain(elapsedSeconds = 1 / 30) {
  const s = settings();
  const budget = { count: activeGlyphCount(s), limit: s.displayLimit };
  updateResidueLimits();
  paintBackground(s);
  layers.forEach((layer) => {
    layer.columns.forEach((column, index) => {
      animateColumnEffects(column, elapsedSeconds, s);
      if (column.skip) {
        if (column.residues.length > 0 || column.flashes.length > 0) {
          drawColumn(column, s, layer);
        }
        stepSkippedColumn(column, s, layer, index, elapsedSeconds);
        return;
      }
      drawColumn(column, s, layer);
      stepColumn(column, s, layer, index, elapsedSeconds, budget);
    });
  });
}

function frame(now) {
  const elapsed = now - lastFrame;
  lastFrame = now;

  if (!controls.paused.checked) {
    accumulator += elapsed;
    if (accumulator >= 16) {
      tickRain(Math.min(0.08, accumulator / 1000));
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
  const presetKeys = Object.keys(allPresets());
  const presetKey = presetKeys[Math.floor(Math.random() * presetKeys.length)];
  controls.characterPreset.value = presetKey;
  controls.characters.value = allPresets()[presetKey];
  controls.textColor.value = palette[0];
  controls.headColor.value = palette[1];
  controls.backgroundColor.value = palette[2];
  controls.fontSize.value = String(12 + Math.floor(Math.random() * 17));
  controls.speedMin.value = String(4 + Math.floor(Math.random() * 8));
  controls.speedMax.value = String(12 + Math.floor(Math.random() * 18));
  controls.density.value = String(14 + Math.floor(Math.random() * 58));
  controls.frequency.value = String(45 + Math.floor(Math.random() * 75));
  controls.displayLimit.value = String(360 + Math.floor(Math.random() * 540));
  controls.trail.value = String(16 + Math.floor(Math.random() * 21));
  controls.direction.value = ["down", "down", "down", "up", "right", "left"][Math.floor(Math.random() * 6)];
  controls.characterOrder.value = ["random", "random", "sequence", "reverse"][Math.floor(Math.random() * 4)];
  controls.rowSpacing.value = String(16 + Math.floor(Math.random() * 46));
  controls.depth.value = String(1 + Math.floor(Math.random() * 4));
  controls.depthStrength.value = String(12 + Math.floor(Math.random() * 36));
  controls.variance.value = String(20 + Math.floor(Math.random() * 70));
  controls.varianceMode.value = ["uniform", "center", "extreme", "slow", "fast"][Math.floor(Math.random() * 5)];
  controls.glow.value = String(2 + Math.floor(Math.random() * 10));
  controls.glyphGlow.value = String(55 + Math.floor(Math.random() * 95));
  controls.glyphBlur.value = String(Math.floor(Math.random() * 3));
  normalizeSpeedBounds();
  resetRain();
}

function togglePanel() {
  document.body.classList.toggle("config-hidden");
}

function normalizeSpeedBounds() {
  if (Number(controls.speedMin.value) > Number(controls.speedMax.value)) {
    controls.speedMax.value = controls.speedMin.value;
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

function collectConfig() {
  return Object.fromEntries(
    settingKeys.map((key) => [key, controls[key].type === "checkbox" ? controls[key].checked : controls[key].value]),
  );
}

function applyConfig(config) {
  settingKeys.forEach((key) => {
    if (!(key in config) || !controls[key]) return;
    if (controls[key].type === "checkbox") {
      controls[key].checked = Boolean(config[key]);
    } else {
      controls[key].value = config[key];
    }
  });
  normalizeSpeedBounds();
  renderPresetOptions(config.characterPreset || "");
  resetRain();
}

function resetDefaults() {
  applyConfig(defaultConfig);
  controls.exportStatus.textContent = "Defaults loaded";
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else {
      controls.exportStatus.textContent = "Fullscreen unsupported";
    }
  } catch {
    controls.exportStatus.textContent = "Fullscreen failed";
  }
}

function syncFullscreenButton() {
  controls.fullscreenBtn.textContent = document.fullscreenElement ? "W" : "F";
  controls.fullscreenBtn.title = document.fullscreenElement ? "\u30a6\u30a3\u30f3\u30c9\u30a6" : "\u5168\u753b\u9762";
  resize();
}

function saveJson() {
  const blob = new Blob([JSON.stringify(collectConfig(), null, 2)], { type: "application/json" });
  downloadBlob(blob, "matrix-rain-settings.json");
}

function loadJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      applyConfig(JSON.parse(String(reader.result)));
      controls.exportStatus.textContent = "JSON loaded";
    } catch {
      controls.exportStatus.textContent = "JSON load failed";
    }
  });
  reader.readAsText(file);
}

function applyCharacterPreset() {
  const preset = allPresets()[controls.characterPreset.value];
  if (!preset) return;
  controls.characters.value = preset;
  resetRain();
}

function customPresetKey() {
  const name = controls.customPresetName.value.trim();
  if (!name) return "";
  return `custom:${name}`;
}

function addCustomPreset() {
  const key = customPresetKey();
  if (!key) {
    controls.exportStatus.textContent = "Preset name required";
    return;
  }
  customPresets[key] = controls.characters.value;
  saveCustomPresets();
  renderPresetOptions(key);
  controls.characterPreset.value = key;
  controls.exportStatus.textContent = "Preset added";
}

function updateCustomPreset() {
  const key = controls.characterPreset.value.startsWith("custom:") ? controls.characterPreset.value : customPresetKey();
  if (!key || !customPresets[key]) {
    controls.exportStatus.textContent = "Select custom preset";
    return;
  }
  customPresets[key] = controls.characters.value;
  saveCustomPresets();
  renderPresetOptions(key);
  controls.exportStatus.textContent = "Preset updated";
}

function deleteCustomPreset() {
  const key = controls.characterPreset.value;
  if (!key.startsWith("custom:") || !customPresets[key]) {
    controls.exportStatus.textContent = "Select custom preset";
    return;
  }
  delete customPresets[key];
  saveCustomPresets();
  renderPresetOptions("");
  controls.characterPreset.value = "";
  controls.exportStatus.textContent = "Preset deleted";
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

  try {
    const fps = Number(controls.gifFps.value);
    const seconds = Number(controls.gifSeconds.value);
    const frameCount = Math.max(1, Math.round(fps * seconds));
    const delay = Math.max(2, Math.round(100 / fps));
    const exportCanvas = document.createElement("canvas");
    const maxWidth = frameCount > 300 ? 420 : frameCount > 180 ? 540 : 720;
    const scale = Math.min(1, maxWidth / canvas.width);
    exportCanvas.width = Math.max(1, Math.round(canvas.width * scale));
    exportCanvas.height = Math.max(1, Math.round(canvas.height * scale));
    const exportCtx = exportCanvas.getContext("2d", { willReadFrequently: true });
    const frames = [];

    for (let i = 0; i < frameCount; i += 1) {
      tickRain(1 / fps);
      exportCtx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
      frames.push(exportCtx.getImageData(0, 0, exportCanvas.width, exportCanvas.height));
      controls.exportStatus.textContent = `GIF ${i + 1}/${frameCount}`;
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    const blob = encodeGif(frames, delay);
    downloadBlob(blob, "matrix-rain.gif");
    controls.exportStatus.textContent = "GIF saved";
  } catch {
    controls.exportStatus.textContent = "GIF failed";
  } finally {
    controls.exportGifBtn.disabled = false;
    isExportingGif = false;
  }
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

function colorToCss(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
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
  controls.frequency,
  controls.displayLimit,
  controls.trail,
  controls.direction,
  controls.characterOrder,
  controls.rowSpacing,
  controls.fontWeight,
  controls.depth,
  controls.depthStrength,
  controls.variance,
  controls.varianceMode,
  controls.characters,
  controls.backgroundColor,
].forEach((control) => control.addEventListener("input", resetRain));
controls.characterPreset.addEventListener("change", applyCharacterPreset);
controls.addPresetBtn.addEventListener("click", addCustomPreset);
controls.updatePresetBtn.addEventListener("click", updateCustomPreset);
controls.deletePresetBtn.addEventListener("click", deleteCustomPreset);

controls.speedMin.addEventListener("input", () => {
  normalizeSpeedBounds();
  resetRain();
});
controls.speedMax.addEventListener("input", () => {
  normalizeSpeedBounds();
  resetRain();
});
controls.fullscreenBtn.addEventListener("click", toggleFullscreen);
controls.defaultBtn.addEventListener("click", resetDefaults);
controls.randomizeBtn.addEventListener("click", randomize);
controls.exportPngBtn.addEventListener("click", exportPng);
controls.exportGifBtn.addEventListener("click", exportGif);
controls.saveJsonBtn.addEventListener("click", saveJson);
controls.loadJsonBtn.addEventListener("click", () => controls.loadJsonInput.click());
controls.loadJsonInput.addEventListener("change", () => {
  loadJson(controls.loadJsonInput.files[0]);
  controls.loadJsonInput.value = "";
});
controls.controlPanel.addEventListener("click", (event) => event.stopPropagation());
document.body.addEventListener("click", togglePanel);
document.addEventListener("fullscreenchange", syncFullscreenButton);
window.addEventListener("resize", resize);

renderPresetOptions("matrix");
controls.characterPreset.value = "matrix";
normalizeSpeedBounds();
resize();
requestAnimationFrame(frame);

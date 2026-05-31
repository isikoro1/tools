const canvas = document.querySelector("#rainCanvas");
const ctx = canvas.getContext("2d");

// 描画処理と出力処理で使うUI要素をまとめて参照する。
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
  textColor: document.querySelector("#textColor"),
  headColor: document.querySelector("#headColor"),
  backgroundColor: document.querySelector("#backgroundColor"),
  paused: document.querySelector("#paused"),
  fullscreenBtn: document.querySelector("#fullscreenBtn"),
  defaultBtn: document.querySelector("#defaultBtn"),
  randomizeBtn: document.querySelector("#randomizeBtn"),
  exportPngBtn: document.querySelector("#exportPngBtn"),
  exportGifBtn: document.querySelector("#exportGifBtn"),
  exportVideoBtn: document.querySelector("#exportVideoBtn"),
  gifFps: document.querySelector("#gifFps"),
  gifSeconds: document.querySelector("#gifSeconds"),
  videoSeconds: document.querySelector("#videoSeconds"),
  saveJsonBtn: document.querySelector("#saveJsonBtn"),
  loadJsonBtn: document.querySelector("#loadJsonBtn"),
  loadJsonInput: document.querySelector("#loadJsonInput"),
  exportStatus: document.querySelector("#exportStatus"),
  controlPanel: document.querySelector("#controlPanel"),
};

// JSON保存・読み込みの対象にする設定項目。
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
  "textColor",
  "headColor",
  "backgroundColor",
  "paused",
  "gifFps",
  "gifSeconds",
  "videoSeconds",
];

const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const fixedGlowSettings = {
  glow: 14,
  glyphGlow: 1.7,
  glyphBlur: 7,
};

// Dボタンや設定リセットで使う初期値。
const defaultConfig = {
  characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\u30a2\u30a4\u30a6\u30a8\u30aa\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce",
  characterPreset: "default",
  fontSize: "18",
  fontWeight: "500",
  speedMin: "7",
  speedMax: "18",
  density: "54",
  frequency: "100",
  displayLimit: "42",
  trail: "34",
  direction: "down",
  characterOrder: "random",
  rowSpacing: "35",
  depth: "2",
  depthStrength: "36",
  variance: "90",
  varianceMode: "uniform",
  textColor: "#00ff66",
  headColor: "#ddffdd",
  backgroundColor: "#000000",
  paused: false,
  gifFps: "12",
  gifSeconds: "2",
  videoSeconds: "15",
};

// 標準プリセット。改行は複数の文字列パターンとして扱う。
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
  siddham: "\u{11580}\u{11581}\u{11582}\u{11583}\u{11584}\u{11585}\u{11586}\u{11587}\u{11588}\u{1158a}\u{1158e}\u{1158f}\u{11590}\u{11591}\u{11592}\u{11593}\u{11594}\u{11595}\u{11598}\u{11599}\u{1159a}\u{1159b}\u{1159c}\u{1159d}\u{1159e}\u{1159f}\u{115a0}\u{115a1}\u{115a2}\u{115a3}\u{115a4}\u{115a5}\u{115a6}\u{115a7}\u{115a8}\u{115aa}",
  hindi: "\u0905\u0906\u0907\u0908\u0909\u090a\u090f\u0910\u0913\u0914\u0915\u0916\u0917\u0918\u091a\u091b\u091c\u091d\u091f\u0920\u0921\u0922\u0924\u0925\u0926\u0927\u0928\u092a\u092b\u092c\u092d\u092e\u092f\u0930\u0932\u0935\u0936\u0937\u0938\u0939\u0966\u0967\u0968\u0969\u096a\u096b\u096c\u096d\u096e\u096f",
  jiro: "\u30e4\u30b5\u30a4\u30cb\u30f3\u30cb\u30af\u30a2\u30d6\u30e9\u30de\u30b7\u30de\u30b7",
  gal: "\u3061\u3087w\n\u30a6\u30b1\u308b\n\u30de\u30b8\u534d\n\u30de\u30b8\u30d1\u306a\u3044\n\u30d1\u30e9\u30d1\u30e9",
  war: "\u304d\u306e\u3053\n\u305f\u3051\u306e\u3053",
};
let customPresets = loadCustomPresets();

// フレームループ全体で共有するCanvasとアニメーションの状態。
let width = 0;
let height = 0;
let dpr = 1;
let layers = [];
let lastFrame = performance.now();
let accumulator = 0;
let isExportingGif = false;
let cachedSettings = null;

// UIの値を読み取り、描画処理で使いやすい形に正規化する。
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
    glow: fixedGlowSettings.glow,
    glyphGlow: fixedGlowSettings.glyphGlow,
    glyphBlur: fixedGlowSettings.glyphBlur,
    textColor: controls.textColor.value,
    headColor: controls.headColor.value,
    backgroundColor: controls.backgroundColor.value,
    textRgb: hexToRgb(controls.textColor.value),
    headRgb: hexToRgb(controls.headColor.value),
    backgroundRgb: hexToRgb(controls.backgroundColor.value),
    characterPatterns: buildCharacterPatterns(),
  };
}

// 高い光彩・ぼかし設定でも重くなりすぎないよう描画半径を圧縮する。
function effectiveGlowRadius(glow) {
  return Math.min(24, (Math.log1p(Math.max(0, glow) * 1.6) / Math.log1p(112)) * 24);
}

function effectiveBlurRadius(blur) {
  return Math.min(18, (Math.log1p(Math.max(0, blur)) / Math.log1p(60)) * 18);
}

// 毎フレームDOMを読み直さないよう、設定値をキャッシュして使う。
function currentSettings() {
  if (!cachedSettings) cachedSettings = settings();
  return cachedSettings;
}

function refreshSettings() {
  cachedSettings = settings();
}

// 各コントロールの横に現在値の小さなバッジを表示する。
function formatControlValue(control) {
  if (control.type === "color") return control.value.toUpperCase();
  if (control.tagName === "SELECT") {
    return control.selectedOptions[0]?.textContent?.trim() || control.value;
  }
  return control.value;
}

function updateControlValues() {
  document.querySelectorAll(".field input, .field select").forEach((control) => {
    if (control.type === "file" || control.type === "text") return;
    const label = control.closest(".field");
    const title = label?.querySelector(":scope > span");
    if (!title) return;
    let value = title.querySelector(".field-value");
    if (!value) {
      value = document.createElement("span");
      value.className = "field-value";
      title.appendChild(value);
    }
    value.textContent = formatControlValue(control);
  });
}

// テキストエリアの内容から、雨に使う文字列パターンを作る。
function buildCharacterPatterns() {
  const custom = controls.characters.value.trim();
  const base = custom.length ? custom : latin;
  return base
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => Array.from(line, toFullWidth).join(""))
    .filter(Boolean);
}

// カスタムプリセットはブラウザ内のlocalStorageに保存する。
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
    siddham: "\u68b5\u5b57",
    hindi: "\u30d2\u30f3\u30c9\u30a5\u30fc\u8a9e",
    jiro: "JIRO",
    gal: "GAL",
    war: "WAR",
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

// 半角英数字を全角化し、日本語文字と横位置が揃うようにする。
function toFullWidth(char) {
  const code = char.charCodeAt(0);
  if (code === 0x20) return "\u3000";
  if (code >= 0x21 && code <= 0x7e) return String.fromCharCode(code + 0xfee0);
  return char.normalize("NFKC").replace(/[!-~]/g, (value) =>
    String.fromCharCode(value.charCodeAt(0) + 0xfee0),
  );
}

// ランダム・順列・逆列モードで使う文字選択処理。
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
    return characterAt(column.pattern, column.charIndex);
  }
  if (s.characterOrder === "reverse") {
    column.charIndex -= 1;
    return characterAt(column.pattern, column.charIndex);
  }
  column.charIndex = Math.floor(Math.random() * Array.from(column.pattern).length);
  return characterAt(column.pattern, column.charIndex);
}

// レーン位置と流れる方向の座標を、画面上の座標へ変換する。
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

// 奥行きレイヤーごとに文字サイズ・透明度・速度・列数を決める。
function makeLayer(layerIndex, s) {
  const denominator = Math.max(1, s.depth - 1);
  const depthRatio = s.depth === 1 ? 1 : layerIndex / denominator;
  const frontRatio = s.depth === 1 ? 1 : 1 - depthRatio;
  const depthAmount = s.depthStrength * frontRatio;
  const scale = 1 - s.depthStrength * 0.22 + depthAmount * 0.32;
  const alpha = 0.28 + depthAmount * 0.72;
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

  layer.columns = [];
  for (let index = 0; index < count; index += 1) {
    const activeCount = countActiveColumns() + layer.columns.filter((column) => !column.skip).length;
    layer.columns.push(makeColumn(index, s, layer, true, activeCount));
  }
  return layer;
}

// 文字列の生成密度を制御し、遅い列が増えすぎないようにする。
function speedRatioForColumn(cps, s, layer) {
  const varianceMin = Math.max(0.02, 1 - s.variance * 0.95);
  const varianceMax = 1 + s.variance * 2.8;
  const minCps = Math.max(1.2, s.speedMin * 0.35 * layer.speedScale);
  const maxCps = Math.max(minCps, s.speedMax * varianceMax * layer.speedScale * s.frequency);
  return Math.min(1, Math.max(0, (cps - minCps) / (maxCps - minCps || 1)));
}

function shouldSkipColumn(cps, s, layer, activeCount) {
  if (activeCount >= s.displayLimit) return true;
  const speedRatio = speedRatioForColumn(cps, s, layer);
  const densityChance = Math.min(0.72, s.density * 0.58);
  const slowGate = 0.04 + speedRatio * 0.96;
  return Math.random() > densityChance * slowGate;
}

function countActiveColumns() {
  return layers.reduce(
    (total, layer) => total + layer.columns.filter((column) => !column.skip).length,
    0,
  );
}

// 1つの列は、タイプされる先頭文字・固定残像・発光エフェクトを持つ。
function makeColumn(index, s, layer, spreadStart, activeCount) {
  const varianceMin = Math.max(0.02, 1 - s.variance * 0.95);
  const varianceMax = 1 + s.variance * 2.8;
  const rowCount = Math.ceil(flowExtent(s) / layer.rowStep) + 4;
  const startDelay = spreadStart ? Math.floor(randomBetween(0, rowCount * 1.6)) : Math.floor(randomBetween(0, 8));
  const baseCps = randomBetween(s.speedMin, s.speedMax);
  const varianceFactor = varianceMin + (varianceMax - varianceMin) * distributionSample(s.varianceMode);
  const minVisibleCps = Math.max(1.2, s.speedMin * 0.35 * layer.speedScale);
  const cps = Math.max(minVisibleCps, baseCps * varianceFactor * layer.speedScale * s.frequency);
  const pattern = s.characterPatterns[Math.floor(Math.random() * s.characterPatterns.length)] || "\uff10";
  const charIndex = Math.floor(Math.random() * Array.from(pattern).length);

  return {
    x: index * layer.spacing + layer.spacing / 2,
    row: -1,
    pattern,
    charIndex,
    headChar: characterAt(pattern, charIndex),
    startDelay,
    cps,
    timer: 0,
    skip: shouldSkipColumn(cps, s, layer, activeCount),
    residues: [],
    flashes: [],
  };
}

// 画面サイズや構造系の設定が変わったら、雨全体を作り直す。
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
  refreshSettings();
  const s = cachedSettings;
  layers = Array.from({ length: s.depth }, (_, index) => makeLayer(index, s));
  paintBackground(s);
}

// 背景・文字・四角い光・残像・先頭文字をCanvasに描画する。
function paintBackground(s) {
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.fillStyle = s.backgroundColor;
  ctx.fillRect(0, 0, width, height);
}

function prepareText(layer, s) {
  ctx.font = `${s.fontWeight} ${layer.fontSize}px "Noto Sans Siddham", "Noto Sans Devanagari", "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
}

function drawGlowingGlyph(char, x, y, color, alpha, glow, intensity, blur) {
  const glowPower = Math.max(0, intensity);
  const baseGlow = effectiveGlowRadius(glow);
  const effectiveGlow = Math.log1p(glowPower * 1.8) / Math.log1p(28);
  const innerGlow = Math.min(16, baseGlow * (0.42 + effectiveGlow * 0.62));
  const outerGlow = Math.min(36, baseGlow * (0.74 + effectiveGlow * 2.15));
  const haloGlow = Math.min(62, baseGlow * (1.12 + effectiveGlow * 3.4));
  const alphaBoost = Math.min(2.6, 0.35 + effectiveGlow * 2.25);
  const glowAlpha = Math.max(0, intensity);
  const blurAmount = effectiveBlurRadius(blur);
  const clampAlpha = (value) => Math.max(0, Math.min(1, value));

  if (glow > 0 && glowAlpha > 0) {
    ctx.globalAlpha = clampAlpha(alpha * 0.3 * alphaBoost);
    ctx.shadowBlur = haloGlow;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fillText(char, x, y);

    ctx.globalAlpha = clampAlpha(alpha * 0.62 * alphaBoost);
    ctx.shadowBlur = outerGlow;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fillText(char, x, y);

    ctx.globalAlpha = clampAlpha(alpha * alphaBoost);
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
  ctx.shadowBlur = Math.max(blurAmount * 1.2, glow * 0.16 * Math.min(2.6, 0.35 + effectiveGlow * 2.25));
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.fillText(char, x, y);
}

function drawHeadFlash(flash, s, layer) {
  const age = Math.max(0, flash.life / flash.maxLife);
  const size = layer.fontSize * (0.78 + age * 0.28);
  const flashColor = colorToCss(mix(s.headRgb, [255, 255, 255], 0.72));
  ctx.globalAlpha = age ** 1.8 * layer.alpha * (0.18 + layer.frontRatio * 0.38);
  ctx.shadowBlur = effectiveGlowRadius(s.glow) * (1.1 + layer.frontRatio * 1.35);
  ctx.shadowColor = flashColor;
  ctx.fillStyle = flashColor;
  ctx.fillRect(flash.x - size / 2, flash.y - size / 2, size, size);
}

function drawResidue(residue, s, layer) {
  const age = Math.max(0, residue.life / residue.maxLife);
  const alpha = Math.max(0.03, age ** 1.45) * layer.alpha;
  const color = colorToCss(mix(s.textRgb, s.backgroundRgb, layer.depthRatio * 0.38));
  drawGlowingGlyph(residue.char, residue.x, residue.y, color, alpha, s.glow * (0.58 + layer.frontRatio * 0.36), s.glyphGlow * 1.18, s.glyphBlur);
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

// 残像のフェード、残像文字の変化、先頭文字のタイプ進行を更新する。
function animateColumnEffects(column, elapsedSeconds, s) {
  column.flashes = column.flashes
    .map((flash) => ({ ...flash, life: flash.life - elapsedSeconds }))
    .filter((flash) => flash.life > 0);
  column.residues = column.residues
    .map((residue) => ({
      ...residue,
      char: Math.random() < elapsedSeconds * 0.9 ? randomChar(residue.pattern || column.pattern) : residue.char,
      life: residue.life - elapsedSeconds,
    }))
    .filter((residue) => residue.life > 0);
}

function replaceColumn(index, s, layer, residues = []) {
  const retiringWasActive = layer.columns[index] && !layer.columns[index].skip ? 1 : 0;
  const nextColumn = makeColumn(index, s, layer, false, Math.max(0, countActiveColumns() - retiringWasActive));
  nextColumn.residues = residues;
  layer.columns[index] = nextColumn;
}

function stepSkippedColumn(column, s, layer, index, elapsedSeconds) {
  column.startDelay -= elapsedSeconds * column.cps;
  if (column.startDelay <= 0) {
    replaceColumn(index, s, layer, column.residues);
  }
}

function stepColumn(column, s, layer, index, elapsedSeconds) {
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
    const canCreateResidue = previousHeadFlow >= -layer.fontSize && previousHeadFlow <= flowExtent(s) + layer.fontSize;

    if (canCreateResidue) {
      const point = flowPoint(column.x, previousHeadFlow, s);
      column.residues.unshift({
        x: point.x,
        y: point.y,
        char: column.headChar,
        pattern: column.pattern,
        life: maxLife,
        maxLife,
      });
    }

    column.row += 1;
    column.headChar = nextCharacter(column, s);
    const currentHeadFlow = column.row * layer.rowStep + layer.rowStep / 2;
    const canCreateFlash = currentHeadFlow >= -layer.fontSize && currentHeadFlow <= flowExtent(s) + layer.fontSize;
    if (canCreateFlash) {
      const point = flowPoint(column.x, currentHeadFlow, s);
      column.flashes.unshift({
        x: point.x,
        y: point.y,
        life: 0.14,
        maxLife: 0.14,
      });
    }
    column.timer -= interval;
    typed += 1;

    if (column.row * layer.rowStep > flowExtent(s) + maxLife * column.cps * layer.rowStep) {
      replaceColumn(index, s, layer, column.residues);
      return;
    }
  }
}

// シミュレーション本体。描画中はキャッシュ済み設定を使って負荷を抑える。
function tickRain(elapsedSeconds = 1 / 30) {
  const s = currentSettings();
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
      stepColumn(column, s, layer, index, elapsedSeconds);
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

// UI操作、設定の保存・読み込み、プリセット操作を扱う。
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
  controls.density.value = String(8 + Math.floor(Math.random() * 36));
  controls.frequency.value = String(42 + Math.floor(Math.random() * 62));
  controls.displayLimit.value = String(12 + Math.floor(Math.random() * 46));
  controls.trail.value = String(12 + Math.floor(Math.random() * 19));
  controls.direction.value = "down";
  controls.characterOrder.value = ["random", "random", "sequence", "reverse"][Math.floor(Math.random() * 4)];
  controls.rowSpacing.value = String(18 + Math.floor(Math.random() * 46));
  controls.depth.value = String(1 + Math.floor(Math.random() * 3));
  controls.depthStrength.value = String(12 + Math.floor(Math.random() * 36));
  controls.variance.value = String(20 + Math.floor(Math.random() * 70));
  controls.varianceMode.value = ["uniform", "center", "extreme", "slow", "fast"][Math.floor(Math.random() * 5)];
  normalizeSpeedBounds();
  updateControlValues();
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

// ファイルのダウンロードと画像・動画の出力処理。
function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function collectConfig() {
  return Object.fromEntries(
    settingKeys.map((key) => [key, controls[key].type === "checkbox" ? controls[key].checked : controls[key].value]),
  );
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function normalizeConfigValue(key, value) {
  const control = controls[key];
  const fallback = defaultConfig[key];
  if (!control) return fallback;
  if (control.type === "checkbox") return normalizeBoolean(value, Boolean(fallback));
  if (control.type === "range") {
    const min = Number(control.min);
    const max = Number(control.max);
    return String(clampNumber(value, min, max, Number(fallback)));
  }
  if (control.type === "color") {
    return /^#[0-9a-f]{6}$/i.test(String(value)) ? String(value) : fallback;
  }
  if (control.tagName === "SELECT") {
    const hasOption = Array.from(control.options).some((option) => option.value === String(value));
    return hasOption ? String(value) : fallback;
  }
  return typeof value === "string" ? value : String(fallback);
}

function applyConfig(config) {
  settingKeys.forEach((key) => {
    if (!controls[key]) return;
    const value = normalizeConfigValue(key, key in config ? config[key] : defaultConfig[key]);
    if (controls[key].type === "checkbox") {
      controls[key].checked = value;
    } else {
      controls[key].value = value;
    }
  });
  normalizeSpeedBounds();
  renderPresetOptions(config.characterPreset || "");
  updateControlValues();
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
  updateControlValues();
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

function preferredVideoMimeType() {
  if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return "";
  return [
    "video/mp4;codecs=h264",
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ].find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

async function exportVideo() {
  if (!canvas.captureStream || !window.MediaRecorder) {
    controls.exportStatus.textContent = "Video unsupported";
    return;
  }

  const fps = Number(controls.gifFps.value);
  const seconds = Number(controls.videoSeconds.value);
  const mimeType = preferredVideoMimeType();
  const chunks = [];

  controls.exportVideoBtn.disabled = true;
  controls.exportStatus.textContent = "Video recording...";

  try {
    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) chunks.push(event.data);
    };

    const finished = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = () => reject(new Error("recording failed"));
    });

    recorder.start(250);
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    if (recorder.state !== "inactive") recorder.stop();
    await finished;
    stream.getTracks().forEach((track) => track.stop());

    const type = recorder.mimeType || mimeType || "video/webm";
    const extension = type.includes("mp4") ? "mp4" : "webm";
    downloadBlob(new Blob(chunks, { type }), `matrix-rain-loop.${extension}`);
    controls.exportStatus.textContent = `${extension.toUpperCase()} saved`;
  } catch {
    controls.exportStatus.textContent = "Video failed";
  } finally {
    controls.exportVideoBtn.disabled = false;
  }
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

// GIFエンコード処理。LZW部分は圧縮率より実装の単純さを優先している。
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

// 関数定義が終わった後で、UIイベントをまとめて接続する。
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
[
  controls.textColor,
  controls.headColor,
].forEach((control) => control.addEventListener("input", refreshSettings));
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
controls.exportVideoBtn.addEventListener("click", exportVideo);
controls.saveJsonBtn.addEventListener("click", saveJson);
controls.loadJsonBtn.addEventListener("click", () => controls.loadJsonInput.click());
controls.loadJsonInput.addEventListener("change", () => {
  loadJson(controls.loadJsonInput.files[0]);
  controls.loadJsonInput.value = "";
});
controls.controlPanel.addEventListener("click", (event) => event.stopPropagation());
controls.controlPanel.addEventListener("input", updateControlValues);
controls.controlPanel.addEventListener("change", updateControlValues);
document.body.addEventListener("click", togglePanel);
document.addEventListener("fullscreenchange", syncFullscreenButton);
window.addEventListener("resize", resize);

renderPresetOptions("matrix");
controls.characterPreset.value = "matrix";
normalizeSpeedBounds();
updateControlValues();
resize();
if (document.fonts && document.fonts.load) {
  document.fonts.load('400 24px "Noto Sans Siddham"').then(resetRain).catch(() => {});
}
requestAnimationFrame(frame);

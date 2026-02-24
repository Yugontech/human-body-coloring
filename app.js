'use strict';

const COLORS = [
  {
    name: 'オレンジ',
    value: '#F28C28',
    legendText: 'とても活性化している'
  },
  {
    name: 'ペールオレンジ',
    value: '#F6C59A',
    legendText: 'やや活性化している'
  },
  {
    name: '水色',
    value: '#8ECAE6',
    legendText: 'あまり活性化していない'
  },
  {
    name: '青色',
    value: '#219EBC',
    legendText: 'まったく活性化していない'
  }
];

const DEFAULT_BRUSH_SIZE = 12;
const MAX_UNDO_STEPS = 20;
const MASK_EDGE_PROTECT_PX = 2;
const SILHOUETTE_SPEC = {
  label: 'silhouette.svg',
  viewBox: { minX: -250, minY: -250, width: 500, height: 500 },
  pathData: 'm0.22431-207.000004c-15.22118 0-23.61194 14.84035-21.02005 29.09293c1.28402 7.06117 4.099999 14.01264 8.6761 18.55082c-0.0009 3.9619-0.29479 8.406956-1.3757 12.026244c-2.55317 8.54917-10.54277 11.1053-18.54317 12.82906c-29.39361 6.33317-18.9583 27.22716-25.39674 70.62058c-4.69364 31.6338-0.50313 47.72286-0.50313 57.25806c0 9.53518-2.82238 16.04674-1.95619 23.84829c0.86619 7.80152 5.86021 14.95412 8.21873 16.045559c3.24066 1.49967 5.89173-4.66553 3.50771-13.27624c-0.45889-1.65746 2.53083-6.22275 2.67566-11.07732c0.20086-6.72959-1.65887-11.21938-1.65887-16.00332c0-8.23493 3.3608-23.20884 3.54824-42.62796c0.15149-15.70392 7.0718-39.26182 7.0718-39.26182c9.23236 28.07484 1.85162 42.36801-0.0106 71.87407c-3.34568 53.01581 9.16436 89.68238 8.57766 102.82966c-0.4907 10.99518-0.25264 19.59076 3.64497 39.09456c3.89771 19.5038 8.57964 48.22736 8.14659 56.4623c-0.43314 8.23493-10.4509 13.3774-11.15478 19.89587c-0.58887 5.45328 14.11244 7.60285 18.01015 4.13551c3.8977-3.46735 9.0679-13.44561 7.14746-21.26733c-2.58244-10.51796 1.41146-47.55706-2.037171-70.28959c-1.61411-10.63991-3.25425-16.87656-1.53044-28.80596c3.15429-21.82821 3.1124-68.48069 1.75561-75.23947h7.96366c-1.3566 6.75878-1.3984 53.41126 1.75562 75.23947c1.72381 11.9294 0.0839 18.16606-1.53045 28.80596c-3.44853 22.73252 0.54537 59.77163-2.03707 70.28959c-1.92044 7.82172 3.24975 17.79998 7.14746 21.26733c3.89762 3.46734 18.59893 1.31777 18.01015-4.13551c-0.70398-6.51847-10.72173-11.66094-11.15478-19.89587c-0.43314-8.23494 4.24897-36.9585 8.14659-56.4623c3.8977-19.5038 4.135659-28.09938 3.64497-39.09456c-0.58679-13.14728 11.92332-49.81385 8.57757-102.82966c-1.86208-29.50606-9.24443-43.79923-0.0123-71.87407c0 0 6.92027 23.5579 7.07181 39.26182c0.1874 19.41912 3.5482 34.39303 3.5482 42.62796c0 4.78394-1.85791 9.27373-1.65712 16.003319c0.14485 4.85457 3.13454 9.41986 2.67566 11.07732c-2.384 8.61071 0.26708 14.77591 3.50774 13.27624c2.3585-1.09144 7.35259-8.24404 8.21873-16.04556c0.86615-7.80155-1.95616-14.31311-1.95616-23.84829c0-9.5352 4.1905-25.62426-0.50313-57.25806c-6.43843-43.39342 3.99509-64.28741-25.39852-70.62058c-8.00032-1.72376-15.99001-4.27989-18.54317-12.82906c-1.04101-3.485848-1.35364-7.742424-1.37742-11.593154c4.84334-4.52102 7.80244-11.69338 9.12816-18.98391c2.59189-14.25258-5.79869-29.09293-21.01997-29.09293z',
  strokeColor: '#444444',
  strokeWidth: 2,
  strokeLineCap: 'butt',
  strokeLineJoin: 'round'
};

const paintCanvas = document.getElementById('paintCanvas');
const outlineCanvas = document.getElementById('outlineCanvas');
const canvasHost = document.getElementById('canvasHost');
const canvasStage = document.getElementById('canvasStage');

const statusText = document.getElementById('statusText');
const palette = document.getElementById('palette');
const legendList = document.getElementById('legendList');
const brushSizeInput = document.getElementById('brushSize');
const brushSizeValue = document.getElementById('brushSizeValue');
const eraserBtn = document.getElementById('eraserBtn');
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
let paletteButtons = [];
let legendItems = [];

const state = {
  ready: false,
  logicalWidth: 0,
  logicalHeight: 0,
  dpr: Math.max(1, window.devicePixelRatio || 1),
  selectedColor: COLORS[0].value,
  tool: 'brush',
  brushSize: DEFAULT_BRUSH_SIZE,
  drawing: false,
  pointerId: null,
  lastPoint: null,
  undoStack: [],
  resizeObserver: null,
  maskCanvas: document.createElement('canvas'),
  outlineLayerCanvas: document.createElement('canvas'),
  silhouettePath: null,
  silhouetteViewBox: null,
  silhouetteStrokeColor: '#444444',
  silhouetteStrokeWidth: 2,
  silhouetteStrokeLineCap: 'butt',
  silhouetteStrokeLineJoin: 'round'
};

let paintCtx = null;
let outlineCtx = null;
let resizeRafId = 0;

init();

function init() {
  // 追加仕様: COLORS定数を使って、パレットと凡例を同時に構築する。
  buildColorUi();
  bindUiEvents();
  brushSizeValue.textContent = String(DEFAULT_BRUSH_SIZE);
  setControlsEnabled(false);
  updateActiveUi();
  loadSilhouette();
}

// 追加仕様: パレットと凡例の色を同じ定数（COLORS）から生成する。
function buildColorUi() {
  palette.replaceChildren();
  legendList.replaceChildren();

  COLORS.forEach((color) => {
    palette.appendChild(createPaletteButton(color));
    legendList.appendChild(createLegendItem(color));
  });

  paletteButtons = Array.from(palette.querySelectorAll('.palette-btn'));
  legendItems = Array.from(legendList.querySelectorAll('.legend-item'));
}

function createPaletteButton(color) {
  const button = document.createElement('button');
  button.className = 'palette-btn';
  button.type = 'button';
  button.dataset.color = color.value;
  button.disabled = true;

  const swatch = document.createElement('span');
  swatch.className = 'swatch';
  swatch.style.setProperty('--swatch', color.value);

  button.appendChild(swatch);
  button.appendChild(document.createTextNode(color.name));
  return button;
}

function createLegendItem(color) {
  const item = document.createElement('li');
  item.className = 'legend-item';
  item.dataset.color = color.value;

  const dot = document.createElement('span');
  dot.className = 'legend-dot';
  dot.style.setProperty('--legend-color', color.value);

  const textWrap = document.createElement('span');
  textWrap.className = 'legend-text';

  const name = document.createElement('span');
  name.className = 'legend-name';
  name.textContent = `${color.name}（${color.value}）`;

  const description = document.createElement('span');
  description.className = 'legend-desc';
  description.textContent = color.legendText;

  textWrap.appendChild(name);
  textWrap.appendChild(description);

  item.appendChild(dot);
  item.appendChild(textWrap);

  return item;
}

function bindUiEvents() {
  paletteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const color = button.dataset.color;
      if (!color) {
        return;
      }
      state.tool = 'brush';
      state.selectedColor = color;
      updateActiveUi();
    });
  });

  brushSizeInput.addEventListener('input', () => {
    state.brushSize = Number(brushSizeInput.value);
    brushSizeValue.textContent = String(state.brushSize);
  });

  eraserBtn.addEventListener('click', () => {
    state.tool = 'eraser';
    updateActiveUi();
  });

  undoBtn.addEventListener('click', () => {
    undo();
  });

  clearBtn.addEventListener('click', () => {
    if (!state.ready) {
      return;
    }
    pushUndoState();
    paintCtx.clearRect(0, 0, state.logicalWidth, state.logicalHeight);
    updateUndoButtonState();
  });

  saveBtn.addEventListener('click', () => {
    saveAsPng();
  });

  paintCanvas.addEventListener('pointerdown', onPointerDown);
  paintCanvas.addEventListener('pointermove', onPointerMove);
  paintCanvas.addEventListener('pointerup', onPointerUpOrCancel);
  paintCanvas.addEventListener('pointercancel', onPointerUpOrCancel);
  paintCanvas.addEventListener('pointerleave', onPointerUpOrCancel);
  paintCanvas.addEventListener('contextmenu', (event) => event.preventDefault());

  window.addEventListener('resize', requestResize, { passive: true });
}

function loadSilhouette() {
  setStatus('シルエットを初期化中...');

  try {
    const spec = SILHOUETTE_SPEC;
    state.logicalWidth = Math.max(1, Math.round(spec.viewBox.width));
    state.logicalHeight = Math.max(1, Math.round(spec.viewBox.height));
    state.silhouetteViewBox = spec.viewBox;
    state.silhouettePath = new Path2D(spec.pathData);
    state.silhouetteStrokeColor = spec.strokeColor;
    state.silhouetteStrokeWidth = spec.strokeWidth;
    state.silhouetteStrokeLineCap = spec.strokeLineCap;
    state.silhouetteStrokeLineJoin = spec.strokeLineJoin;

    window.requestAnimationFrame(() => {
      buildMaskAndOutlineFromSvgPath();
      resizeCanvases();
      installResizeObserver();

      state.ready = true;
      setControlsEnabled(true);
      updateUndoButtonState();
      setStatus(`準備完了: ${spec.label} を組み込み定義から初期化しました。`);
    });
  } catch (error) {
    console.error(error);
    setStatus('シルエット初期化に失敗しました。ブラウザを更新して再読み込みしてください。');
  }
}

function buildMaskAndOutlineFromSvgPath() {
  const width = state.logicalWidth;
  const height = state.logicalHeight;

  const maskCanvas = state.maskCanvas;
  maskCanvas.width = width;
  maskCanvas.height = height;
  const maskCtx = maskCanvas.getContext('2d');
  maskCtx.clearRect(0, 0, width, height);

  drawSilhouettePath(maskCtx, (ctx, path) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fill(path);
  });

  if (MASK_EDGE_PROTECT_PX > 0) {
    maskCtx.save();
    maskCtx.globalCompositeOperation = 'destination-out';
    drawSilhouettePath(maskCtx, (ctx, path) => {
      ctx.strokeStyle = '#000000';
      ctx.lineCap = state.silhouetteStrokeLineCap;
      ctx.lineJoin = state.silhouetteStrokeLineJoin;
      ctx.lineWidth = state.silhouetteStrokeWidth + (MASK_EDGE_PROTECT_PX * 2);
      ctx.stroke(path);
    });
    maskCtx.restore();
  }

  const outlineCanvasOffscreen = state.outlineLayerCanvas;
  outlineCanvasOffscreen.width = width;
  outlineCanvasOffscreen.height = height;
  const outlineOffscreenCtx = outlineCanvasOffscreen.getContext('2d');
  outlineOffscreenCtx.clearRect(0, 0, width, height);

  drawSilhouettePath(outlineOffscreenCtx, (ctx, path) => {
    ctx.strokeStyle = state.silhouetteStrokeColor;
    ctx.lineCap = state.silhouetteStrokeLineCap;
    ctx.lineJoin = state.silhouetteStrokeLineJoin;
    ctx.lineWidth = state.silhouetteStrokeWidth;
    ctx.stroke(path);
  });
}

function drawSilhouettePath(ctx, drawFn) {
  if (!state.silhouettePath || !state.silhouetteViewBox) {
    return;
  }

  const viewBox = state.silhouetteViewBox;
  const scaleX = state.logicalWidth / viewBox.width;
  const scaleY = state.logicalHeight / viewBox.height;

  ctx.save();
  ctx.translate(-viewBox.minX * scaleX, -viewBox.minY * scaleY);
  ctx.scale(scaleX, scaleY);
  drawFn(ctx, state.silhouettePath);
  ctx.restore();
}

function installResizeObserver() {
  if ('ResizeObserver' in window && !state.resizeObserver) {
    state.resizeObserver = new ResizeObserver(() => {
      requestResize();
    });
    state.resizeObserver.observe(canvasHost);
  }
}

function requestResize() {
  if (!state.logicalWidth || !state.logicalHeight) {
    return;
  }
  if (resizeRafId) {
    return;
  }
  resizeRafId = window.requestAnimationFrame(() => {
    resizeRafId = 0;
    resizeCanvases();
  });
}

function resizeCanvases() {
  if (!state.logicalWidth || !state.logicalHeight) {
    return;
  }

  const preservedPaint = createPaintSnapshot();
  state.dpr = Math.max(1, window.devicePixelRatio || 1);

  const { cssWidth, cssHeight } = calculateStageSize();
  canvasStage.style.width = `${cssWidth}px`;
  canvasStage.style.height = `${cssHeight}px`;

  [paintCanvas, outlineCanvas].forEach((canvas) => {
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.width = Math.round(state.logicalWidth * state.dpr);
    canvas.height = Math.round(state.logicalHeight * state.dpr);
  });

  paintCtx = paintCanvas.getContext('2d');
  outlineCtx = outlineCanvas.getContext('2d');
  configureContext(paintCtx);
  configureContext(outlineCtx);

  paintCtx.clearRect(0, 0, state.logicalWidth, state.logicalHeight);
  if (preservedPaint) {
    paintCtx.drawImage(preservedPaint, 0, 0, state.logicalWidth, state.logicalHeight);
    applyMaskToPaint();
  }

  renderOutline();
}

function calculateStageSize() {
  const hostWidth = Math.max(1, canvasHost.clientWidth - 4);
  const hostHeight = Math.max(1, canvasHost.clientHeight - 4);
  const aspect = state.logicalWidth / state.logicalHeight;

  let cssWidth = hostWidth;
  let cssHeight = cssWidth / aspect;

  if (cssHeight > hostHeight) {
    cssHeight = hostHeight;
    cssWidth = cssHeight * aspect;
  }

  return {
    cssWidth: Math.max(1, Math.floor(cssWidth)),
    cssHeight: Math.max(1, Math.floor(cssHeight))
  };
}

function configureContext(ctx) {
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.imageSmoothingEnabled = true;
}

function renderOutline() {
  if (!outlineCtx) {
    return;
  }
  outlineCtx.clearRect(0, 0, state.logicalWidth, state.logicalHeight);
  outlineCtx.drawImage(state.outlineLayerCanvas, 0, 0, state.logicalWidth, state.logicalHeight);
}

function createPaintSnapshot() {
  if (!paintCanvas.width || !paintCanvas.height || !state.logicalWidth || !state.logicalHeight) {
    return null;
  }
  const snapshot = document.createElement('canvas');
  snapshot.width = state.logicalWidth;
  snapshot.height = state.logicalHeight;
  const snapCtx = snapshot.getContext('2d');
  snapCtx.drawImage(paintCanvas, 0, 0, state.logicalWidth, state.logicalHeight);
  return snapshot;
}

function onPointerDown(event) {
  if (!state.ready) {
    return;
  }
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  event.preventDefault();
  state.drawing = true;
  state.pointerId = event.pointerId;
  state.lastPoint = toCanvasPoint(event);
  paintCanvas.setPointerCapture(event.pointerId);

  pushUndoState();
  drawSegment(state.lastPoint, state.lastPoint);
}

function onPointerMove(event) {
  if (!state.drawing || event.pointerId !== state.pointerId) {
    return;
  }
  event.preventDefault();

  const currentPoint = toCanvasPoint(event);
  drawSegment(state.lastPoint, currentPoint);
  state.lastPoint = currentPoint;
}

function onPointerUpOrCancel(event) {
  if (!state.drawing || event.pointerId !== state.pointerId) {
    return;
  }

  event.preventDefault();
  state.drawing = false;
  state.pointerId = null;
  state.lastPoint = null;

  if (paintCanvas.hasPointerCapture(event.pointerId)) {
    paintCanvas.releasePointerCapture(event.pointerId);
  }

  if (state.tool !== 'eraser') {
    applyMaskToPaint();
  }
}

function drawSegment(from, to) {
  if (!paintCtx) {
    return;
  }

  paintCtx.save();
  paintCtx.lineWidth = state.brushSize;

  if (state.tool === 'eraser') {
    paintCtx.globalCompositeOperation = 'destination-out';
    paintCtx.strokeStyle = 'rgba(0, 0, 0, 1)';
    paintCtx.fillStyle = 'rgba(0, 0, 0, 1)';
  } else {
    paintCtx.globalCompositeOperation = 'source-over';
    paintCtx.strokeStyle = state.selectedColor;
    paintCtx.fillStyle = state.selectedColor;
  }

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if ((dx * dx) + (dy * dy) < 0.001) {
    paintCtx.beginPath();
    paintCtx.arc(from.x, from.y, state.brushSize / 2, 0, Math.PI * 2);
    paintCtx.fill();
  } else {
    paintCtx.beginPath();
    paintCtx.moveTo(from.x, from.y);
    paintCtx.lineTo(to.x, to.y);
    paintCtx.stroke();
  }

  paintCtx.restore();

  if (state.tool !== 'eraser') {
    applyMaskToPaint();
  }
}

function applyMaskToPaint() {
  if (!paintCtx || !state.maskCanvas.width || !state.maskCanvas.height) {
    return;
  }
  paintCtx.save();
  paintCtx.globalCompositeOperation = 'destination-in';
  paintCtx.drawImage(state.maskCanvas, 0, 0, state.logicalWidth, state.logicalHeight);
  paintCtx.restore();
}

function toCanvasPoint(event) {
  const rect = paintCanvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * state.logicalWidth;
  const y = ((event.clientY - rect.top) / rect.height) * state.logicalHeight;

  return {
    x: clamp(x, 0, state.logicalWidth),
    y: clamp(y, 0, state.logicalHeight)
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pushUndoState() {
  const snapshot = createPaintSnapshot();
  if (!snapshot) {
    return;
  }
  state.undoStack.push(snapshot);
  if (state.undoStack.length > MAX_UNDO_STEPS) {
    state.undoStack.shift();
  }
  updateUndoButtonState();
}

function undo() {
  if (!state.undoStack.length || !paintCtx) {
    return;
  }

  const snapshot = state.undoStack.pop();
  paintCtx.clearRect(0, 0, state.logicalWidth, state.logicalHeight);
  paintCtx.drawImage(snapshot, 0, 0, state.logicalWidth, state.logicalHeight);
  applyMaskToPaint();
  updateUndoButtonState();
}

function saveAsPng() {
  if (!state.ready) {
    return;
  }

  const merged = document.createElement('canvas');
  merged.width = state.logicalWidth;
  merged.height = state.logicalHeight;
  const mergedCtx = merged.getContext('2d');

  mergedCtx.drawImage(paintCanvas, 0, 0, state.logicalWidth, state.logicalHeight);
  mergedCtx.drawImage(state.outlineLayerCanvas, 0, 0, state.logicalWidth, state.logicalHeight);

  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

  const link = document.createElement('a');
  link.href = merged.toDataURL('image/png');
  link.download = `human-body-coloring-${stamp}.png`;
  link.click();
}

function setControlsEnabled(enabled) {
  const controls = [
    ...paletteButtons,
    brushSizeInput,
    eraserBtn,
    undoBtn,
    clearBtn,
    saveBtn
  ];
  controls.forEach((el) => {
    el.disabled = !enabled;
  });
}

function updateUndoButtonState() {
  undoBtn.disabled = !state.ready || state.undoStack.length === 0;
}

function updateActiveUi() {
  paletteButtons.forEach((button) => {
    const active = state.tool === 'brush' && button.dataset.color === state.selectedColor;
    button.classList.toggle('active', active);
  });
  // 追加仕様: 選択中の色を凡例にも反映する。
  legendItems.forEach((item) => {
    const active = item.dataset.color === state.selectedColor;
    item.classList.toggle('active', active);
  });
  eraserBtn.classList.toggle('active', state.tool === 'eraser');
}

function setStatus(text) {
  statusText.textContent = text;
}

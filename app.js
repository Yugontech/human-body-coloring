'use strict';

const COLORS = [
  {
    name: 'オレンジ',
    value: '#F28C28'
  },
  {
    name: 'ペールオレンジ',
    value: '#F6C59A'
  },
  {
    name: '水色',
    value: '#8ECAE6'
  },
  {
    name: '青色',
    value: '#1D4ED8'
  }
];

const LEGEND_ITEMS = [
  { label: 'とても生き生きしている', color: COLORS[0].value, paletteColor: COLORS[0].value },
  { label: 'やや生き生きしている', color: COLORS[1].value, paletteColor: COLORS[1].value },
  { label: '（色なし）', color: '#FFFFFF', neutral: true },
  { label: 'あまり生き生きしていない', color: COLORS[2].value, paletteColor: COLORS[2].value },
  { label: '全く生き生きしていない', color: COLORS[3].value, paletteColor: COLORS[3].value }
];

const DEFAULT_BRUSH_SIZE = 10;
const MAX_UNDO_STEPS = 20;
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;
const LEGEND_COLLAPSED_STORAGE_KEY = 'human-body-coloring.legendCollapsed';
const SILHOUETTE_SOURCE = 'silhouette.svg';
const FALLBACK_SILHOUETTE_SPEC = {
  label: 'silhouette.svg',
  viewBox: { minX: 0, minY: 0, width: 595.28, height: 841.89 },
  pathData: 'M297.39,466.55c-2.78,40.55-4.68,80.19-9.58,120.33-1.35,11.09-1.65,21.33-1.03,32.4,1.16,20.74.73,40.78-.85,61.5l-3.86,50.49-.12,35.81c-.02,7.3.29,14.26-.84,21.38-1.65,10.41-8.79,18.15-19.04,20.99-13.5,3.73-37.2,3.06-42.72-9.57-2.66-6.09-2.16-13.14.81-18.96l7.34-14.37c3.52-6.89,6.23-13.69,5.57-21.51l-2-23.74-5.26-42.24c-2.52-20.26-3.23-39.95-2.15-60.32.76-14.34,1.08-28.12-.77-42.37l-4.25-32.86c-4-30.89-6.15-61.4-6.06-92.6.07-23.58,2.38-46.06,6.79-69.11,5.92-30.96,8.71-59.73,4.58-91.41-4.84,22.99-8.47,45.19-11.37,68.19l-6.69,52.98c-2.1,16.6-1.8,32.62-.59,49.28.85,11.7.3,27.16-10,32.33-5.99,3-12.97,1.54-18.2-2.53-10.6-8.25-14.08-24.47-14.8-38.02-.64-12.1-.65-23.59-.04-35.86,2-40.07,4.44-79.59,8.28-119.56,2.11-22.02,4.84-43.31,8.34-64.96,1.28-7.89,3.37-15.13,6.54-22.29,7.9-17.81,21.22-26.48,39.7-31.31l20.91-5.48c4.05-1.06,7.89-2.87,11.4-5,7.83-4.77,8.92-12.55,7.31-21.34-26.07-23.85-30.06-67.99-8.61-95.58,15.26-19.63,42.18-26.42,64.86-15.92,13.25,6.13,23.03,17.28,28.32,30.91,8.08,20.79,6.43,44.01-3.94,63.64-3.55,6.73-8.31,11.75-13.37,17.29-.98,3.93-.85,8.91.39,12.79,3.43,10.68,18.97,13.28,29.07,16.15l19.15,5.44c14.86,5.43,26.03,16.36,31.7,31.17,3.05,7.98,4.77,15.86,6.05,24.55,5.66,38.27,9.19,76.37,11.34,115.07l3.37,60.75.43,36.62c.1,8.21-1.4,16.11-3.81,23.82-2.02,6.48-5.26,12.29-10.37,16.62s-11.98,6.09-18.09,3.44c-10.88-4.73-11.64-20.83-10.79-32.74,1.16-16.25,1.54-31.86-.43-48.11l-6.48-53.4c-2.84-23.43-6.36-46.03-11.2-69.54-5.35,33.82-.84,64.29,5.17,97.29,3,16.47,4.87,32.34,5.42,49.17.92,28.29-.27,55.88-3.31,83.97l-6.57,49.2c-2.09,15.66-2.75,30.54-1.89,46.35,1.14,20.82.62,40.94-2.2,61.59l-5.86,42.87-2.29,23.37c-.75,7.65,1.3,14.74,4.86,21.39l6.35,11.88c2.66,4.97,4.09,10.37,3.98,16.07-.13,6.99-4.13,12.7-10.8,15.25-10.83,4.14-23.07,4.35-34.22,1.03-19.2-5.7-20.1-24-19.2-42.1.69-13.9.64-27.15-.35-41.08l-3.71-52.24c-1.28-18.02-1.21-35.38-.07-53.34.62-10.64.38-20.46-.46-31.17-4.83-40.86-7.01-81.27-9.79-122.73ZM297.02,458.84c4.64-.3,8.23,2.75,8.42,7.45,1.51,38.25,4.24,75.98,8.34,114.17,1.55,14.44,2.17,27.89,1.26,42.31-1.12,17.83-.96,34.96.31,52.78l3.6,50.46c1.03,14.51.91,28.34.2,42.81s-.22,28.91,13.82,33.08c11.28,3.35,32.41,2.65,34.95-6.28,1.15-4.05.6-8.52-1.29-12.19l-6.58-12.8c-4.51-8.77-7.71-17.66-6.71-27.61l3.02-30.05,5.79-43.41c2.51-18.81,2.33-37.16,1.34-56.16-.79-15.17,0-29.51,1.98-44.54l6.81-51.72c2.14-20.5,3.16-40.35,3.41-60.98.3-24.31-2.46-47.6-6.29-71.47l-4.55-28.34c-3.53-21.99-3.31-43.83-.42-65.84l3.07-23.39c.25-1.93,1.72-3.47,3.54-3.76,1.54-.25,3.75.92,4.17,2.8,3.71,16.82,7.3,33.08,9.62,50.23l11.69,86.34c2.7,19.97,2.79,39.35,1.28,59.31-.65,8.57-.25,22.17,6.7,24.67,3.63,1.31,7.6-.26,10.42-2.71,8.47-7.37,11.32-25.73,11.09-37.11l-.73-37.1-3.81-66.89c-2.04-35.74-5.58-70.84-10.9-106.13-3.1-20.55-9.77-38.27-29.64-46.75-13.89-5.93-27.8-6.48-42.6-13.58-9.49-4.55-14.99-12.95-14.41-23.7.17-3.08-.37-7.95,2.18-10.39,12.56-12.01,19.8-27.71,20.54-45.25.52-12.32-1.67-24.03-7.56-34.66-12-21.66-37.96-30.23-60.46-19.62-30.03,14.16-35.96,55.12-20.16,84.17,3.15,5.78,7.19,10.23,11.74,14.79,4.08,4.08,3.57,18.87-1.47,26-9.74,13.78-33.39,14.69-50.87,21.23-19.33,7.23-28.14,23.92-31.38,43.81-2.95,18.13-5.46,35.87-7.29,54.29-4.56,45.83-7.7,91.27-9.78,137.26-.83,18.29-1.58,53.11,14.14,61.55,2.68,1.44,5.7,1.9,8.47.37,6.44-3.56,6.29-16.61,5.69-25.45-1.26-18.74-1.2-36.88,1.19-55.49l6.96-54.14,9.28-56.36,6.2-29.02c.37-1.76,3.06-2.84,4.46-2.49,1.64.4,2.74,1.92,3,3.78,5.78,41.36,6.77,68.18-.79,109.84-3.43,18.89-6.39,37.11-7.39,56.34-2.23,43,2.44,89.27,8.58,131.99,2.36,16.43,3.29,32.11,2.27,48.73-1.27,20.72-.97,40.76,1.55,61.32l5.7,46.55,1.86,22.91c.69,8.52-1.85,16.36-5.76,23.79l-6.49,12.35c-1.75,3.32-2.82,7.07-3.11,10.81-.35,4.51,2.25,8.33,6.67,9.75,9.14,2.93,19.33,3.21,28.55.51,14.25-4.16,14.72-18.29,14.06-32.58-.8-17.23-.4-33.75.91-50.99l3.65-48.13c1.28-16.84,1.05-33.02.25-49.83-.49-10.38-.48-20.22.58-30.49l3.83-37.08,5.88-86.69c.29-4.24,2.84-7.07,7.41-7.37Z',
  strokeColor: '#444444',
  strokeWidth: 2,
  strokeLineCap: 'butt',
  strokeLineJoin: 'round'
};

const SVG_NS = 'http://www.w3.org/2000/svg';
const EXPORT_SIZE = 2500;

const canvasHost = document.getElementById('canvasHost');
const canvasStage = document.getElementById('canvasStage');

const statusText = document.getElementById('statusText');
const palette = document.getElementById('palette');
const colorLegend = document.getElementById('colorLegend');
const legendToggleBtn = document.getElementById('legendToggleBtn');
const legendList = document.getElementById('legendList');
const brushPresetButtons = Array.from(document.querySelectorAll('.brush-preset-btn'));
const regionButtons = Array.from(document.querySelectorAll('.mode-btn'));
const zoomOutBtn = document.getElementById('zoomOutBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomResetBtn = document.getElementById('zoomResetBtn');
const zoomValue = document.getElementById('zoomValue');
const exportIdInput = document.getElementById('exportIdInput');
const eraserBtn = document.getElementById('eraserBtn');
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const saveSvgBtn = document.getElementById('saveSvgBtn');
let paletteButtons = [];
let legendItems = [];

const state = {
  ready: false,
  selectedColor: COLORS[0].value,
  tool: 'brush',
  drawRegion: 'inside',
  brushSize: DEFAULT_BRUSH_SIZE,
  zoom: DEFAULT_ZOOM,
  drawing: false,
  pointerId: null,
  lastPoint: null,
  activePath: null,
  activePathData: '',
  activeUndoEntry: null,
  nextStrokeOrder: 1,
  legendCollapsed: false,
  undoStack: [],
  resizeObserver: null,
  svg: null,
  paintGroup: null,
  eraserMaskGroup: null,
  insidePaintGroup: null,
  outsidePaintGroup: null,
  insideEraserMaskGroup: null,
  outsideEraserMaskGroup: null,
  silhouetteSpec: null,
  silhouetteViewBox: null
};

let resizeRafId = 0;
const activePointers = new Map();
let pinchState = null;

init();

function init() {
  buildColorUi();
  setupLegendToggle();
  bindUiEvents();
  setControlsEnabled(false);
  updateActiveUi();
  createSvgStage();
}

function buildColorUi() {
  palette.replaceChildren();
  legendList.replaceChildren();

  COLORS.forEach((color) => {
    palette.appendChild(createPaletteButton(color));
  });

  LEGEND_ITEMS.forEach((item) => {
    legendList.appendChild(createLegendItem(item));
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

function createLegendItem(itemData) {
  const item = document.createElement('li');
  item.className = 'legend-item';
  item.dataset.legendType = itemData.neutral ? 'neutral' : 'color';
  if (itemData.paletteColor) {
    item.dataset.paletteColor = itemData.paletteColor;
  }

  const dot = document.createElement('span');
  dot.className = 'legend-dot';
  dot.style.setProperty('--legend-color', itemData.color);
  if (itemData.neutral) {
    dot.classList.add('no-color');
  }

  const textWrap = document.createElement('span');
  textWrap.className = 'legend-text';

  const name = document.createElement('span');
  name.className = 'legend-name';
  name.textContent = itemData.label;

  textWrap.appendChild(name);

  item.appendChild(dot);
  item.appendChild(textWrap);

  return item;
}

function setupLegendToggle() {
  if (!legendToggleBtn || !colorLegend) {
    return;
  }

  legendToggleBtn.hidden = false;
  legendToggleBtn.addEventListener('click', () => {
    setLegendCollapsed(!state.legendCollapsed);
    persistLegendCollapsedState();
  });

  setLegendCollapsed(readLegendCollapsedState());
}

function setLegendCollapsed(collapsed) {
  state.legendCollapsed = Boolean(collapsed);
  document.body.classList.toggle('legend-collapsed', state.legendCollapsed);

  if (legendToggleBtn) {
    legendToggleBtn.textContent = state.legendCollapsed ? '凡例を表示' : '凡例を隠す';
    legendToggleBtn.setAttribute('aria-expanded', String(!state.legendCollapsed));
  }

  if (colorLegend) {
    colorLegend.setAttribute('aria-hidden', String(state.legendCollapsed));
  }
}

function readLegendCollapsedState() {
  try {
    return window.localStorage.getItem(LEGEND_COLLAPSED_STORAGE_KEY) === '1';
  } catch (error) {
    return false;
  }
}

function persistLegendCollapsedState() {
  try {
    window.localStorage.setItem(LEGEND_COLLAPSED_STORAGE_KEY, state.legendCollapsed ? '1' : '0');
  } catch (error) {
    // no-op: private browsing 等で localStorage が使えない場合は保存しない。
  }
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

  brushPresetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextSize = Number(button.dataset.size);
      if (!Number.isFinite(nextSize) || nextSize <= 0) {
        return;
      }
      state.brushSize = nextSize;
      updateActiveUi();
    });
  });

  regionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextRegion = button.dataset.region;
      if (nextRegion !== 'inside' && nextRegion !== 'outside') {
        return;
      }
      state.drawRegion = nextRegion;
      updateActiveUi();
    });
  });

  zoomOutBtn.addEventListener('click', () => {
    setZoom(state.zoom - ZOOM_STEP, getViewportFocalPoint());
  });

  zoomInBtn.addEventListener('click', () => {
    setZoom(state.zoom + ZOOM_STEP, getViewportFocalPoint());
  });

  zoomResetBtn.addEventListener('click', () => {
    setZoom(DEFAULT_ZOOM, getViewportFocalPoint());
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
    clearDrawing();
    updateUndoButtonState();
  });

  saveBtn.addEventListener('click', () => {
    saveAsPng();
  });

  saveSvgBtn.addEventListener('click', () => {
    saveAsSvg();
  });

  window.addEventListener('resize', requestResize, { passive: true });
}

async function createSvgStage() {
  setStatus('シルエットを初期化中...');

  try {
    const spec = normalizeSilhouetteSpec(await loadSilhouetteSpec());
    state.silhouetteSpec = spec;
    state.silhouetteViewBox = spec.viewBox;

    const svg = createSvgElement('svg', {
      id: 'drawingSvg',
      class: 'svg-canvas',
      viewBox: viewBoxToString(spec.viewBox),
      preserveAspectRatio: 'xMidYMid meet',
      role: 'img',
      'aria-label': '人型シルエット描画エリア'
    });

    const defs = createSvgElement('defs');
    const clipPath = createSvgElement('clipPath', {
      id: 'silhouetteClip',
      clipPathUnits: 'userSpaceOnUse'
    });
    clipPath.appendChild(createSvgElement('path', {
      d: spec.clipPathData
    }));

    const insideMask = createSvgElement('mask', {
      id: 'insidePaintEraserMask',
      maskUnits: 'userSpaceOnUse',
      x: String(spec.viewBox.minX),
      y: String(spec.viewBox.minY),
      width: String(spec.viewBox.width),
      height: String(spec.viewBox.height)
    });
    insideMask.appendChild(createSvgElement('rect', {
      x: String(spec.viewBox.minX),
      y: String(spec.viewBox.minY),
      width: String(spec.viewBox.width),
      height: String(spec.viewBox.height),
      fill: '#FFFFFF'
    }));

    const insideEraserMaskGroup = createSvgElement('g', {
      id: 'insideEraserMaskGroup',
      fill: 'none',
      stroke: '#000000',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });
    insideMask.appendChild(insideEraserMaskGroup);

    const outsideMask = createSvgElement('mask', {
      id: 'outsidePaintMask',
      maskUnits: 'userSpaceOnUse',
      x: String(spec.viewBox.minX),
      y: String(spec.viewBox.minY),
      width: String(spec.viewBox.width),
      height: String(spec.viewBox.height)
    });
    outsideMask.appendChild(createSvgElement('rect', {
      x: String(spec.viewBox.minX),
      y: String(spec.viewBox.minY),
      width: String(spec.viewBox.width),
      height: String(spec.viewBox.height),
      fill: '#FFFFFF'
    }));
    outsideMask.appendChild(createSvgElement('path', {
      d: spec.clipPathData,
      fill: '#000000'
    }));

    const outsideEraserMaskGroup = createSvgElement('g', {
      id: 'outsideEraserMaskGroup',
      fill: 'none',
      stroke: '#000000',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });
    outsideMask.appendChild(outsideEraserMaskGroup);
    defs.append(clipPath, insideMask, outsideMask);

    const silhouetteFill = createSvgElement('path', {
      d: spec.clipPathData,
      fill: '#FFFFFF'
    });
    const outsidePaintGroup = createSvgElement('g', {
      id: 'outsidePaintGroup',
      fill: 'none',
      mask: 'url(#outsidePaintMask)'
    });
    const insidePaintGroup = createSvgElement('g', {
      id: 'insidePaintGroup',
      fill: 'none',
      'clip-path': 'url(#silhouetteClip)',
      mask: 'url(#insidePaintEraserMask)'
    });
    const outline = createOutlineElement(spec);

    svg.append(defs, outsidePaintGroup, silhouetteFill, insidePaintGroup, outline);
    canvasStage.replaceChildren(svg);

    state.svg = svg;
    state.paintGroup = insidePaintGroup;
    state.eraserMaskGroup = insideEraserMaskGroup;
    state.insidePaintGroup = insidePaintGroup;
    state.outsidePaintGroup = outsidePaintGroup;
    state.insideEraserMaskGroup = insideEraserMaskGroup;
    state.outsideEraserMaskGroup = outsideEraserMaskGroup;

    svg.addEventListener('pointerdown', onPointerDown);
    svg.addEventListener('pointermove', onPointerMove);
    svg.addEventListener('pointerup', onPointerUpOrCancel);
    svg.addEventListener('pointercancel', onPointerUpOrCancel);
    svg.addEventListener('pointerleave', onPointerUpOrCancel);
    svg.addEventListener('contextmenu', (event) => event.preventDefault());

    resizeStage();
    installResizeObserver();

    state.ready = true;
    setControlsEnabled(true);
    updateUndoButtonState();
    setStatus('');
  } catch (error) {
    console.error(error);
    setStatus('シルエット初期化に失敗しました。ブラウザを更新して再読み込みしてください。');
  }
}

function normalizeSilhouetteSpec(spec) {
  const subpaths = splitSvgSubpaths(spec.pathData);
  const usesCompoundOutline = subpaths.length > 1;

  return {
    ...spec,
    clipPathData: spec.clipPathData || (usesCompoundOutline ? subpaths[subpaths.length - 1] : spec.pathData),
    outlinePathData: spec.outlinePathData || spec.pathData,
    outlineAsFill: spec.outlineAsFill ?? usesCompoundOutline
  };
}

function splitSvgSubpaths(pathData) {
  const subpaths = String(pathData).match(/[Mm][^Mm]*/g);
  return subpaths && subpaths.length ? subpaths : [pathData];
}

function createOutlineElement(spec) {
  if (spec.outlineAsFill) {
    return createSvgElement('path', {
      class: 'silhouette-outline',
      d: spec.outlinePathData,
      fill: spec.strokeColor,
      stroke: 'none'
    });
  }

  return createSvgElement('path', {
    class: 'silhouette-outline',
    d: spec.outlinePathData,
    fill: 'none',
    stroke: spec.strokeColor,
    'stroke-width': String(spec.strokeWidth),
    'stroke-linecap': spec.strokeLineCap,
    'stroke-linejoin': spec.strokeLineJoin
  });
}

async function loadSilhouetteSpec() {
  try {
    const response = await fetch(SILHOUETTE_SOURCE, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return parseSilhouetteSvg(await response.text());
  } catch (error) {
    console.warn(`Failed to load ${SILHOUETTE_SOURCE}; using embedded fallback.`, error);
    return FALLBACK_SILHOUETTE_SPEC;
  }
}

function parseSilhouetteSvg(svgText) {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Invalid SVG');
  }

  const svg = doc.querySelector('svg');
  const path = doc.querySelector('path[d]');
  const viewBox = parseViewBox(svg ? svg.getAttribute('viewBox') : '');

  if (!path || !viewBox) {
    throw new Error('SVG must contain a viewBox and at least one path');
  }

  return {
    label: SILHOUETTE_SOURCE,
    viewBox,
    pathData: path.getAttribute('d'),
    strokeColor: path.getAttribute('stroke') || FALLBACK_SILHOUETTE_SPEC.strokeColor,
    strokeWidth: Number(path.getAttribute('stroke-width')) || FALLBACK_SILHOUETTE_SPEC.strokeWidth,
    strokeLineCap: path.getAttribute('stroke-linecap') || FALLBACK_SILHOUETTE_SPEC.strokeLineCap,
    strokeLineJoin: path.getAttribute('stroke-linejoin') || FALLBACK_SILHOUETTE_SPEC.strokeLineJoin
  };
}

function parseViewBox(rawViewBox) {
  const values = String(rawViewBox).trim().split(/[\s,]+/).map(Number);
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
    return null;
  }
  return {
    minX: values[0],
    minY: values[1],
    width: values[2],
    height: values[3]
  };
}

function createSvgElement(name, attrs = {}) {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

function viewBoxToString(viewBox) {
  return `${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`;
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
  if (resizeRafId) {
    return;
  }
  resizeRafId = window.requestAnimationFrame(() => {
    resizeRafId = 0;
    resizeStage();
  });
}

function resizeStage() {
  if (!state.silhouetteViewBox) {
    return;
  }

  const { cssWidth, cssHeight } = calculateStageSize();
  canvasStage.style.width = `${Math.floor(cssWidth * state.zoom)}px`;
  canvasStage.style.height = `${Math.floor(cssHeight * state.zoom)}px`;
  updateZoomUi();
}

function calculateStageSize() {
  const hostWidth = Math.max(1, canvasHost.clientWidth - 4);
  const hostHeight = Math.max(1, canvasHost.clientHeight - 4);
  const aspect = state.silhouetteViewBox.width / state.silhouetteViewBox.height;

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

function setZoom(nextZoom, focalPoint = getViewportFocalPoint()) {
  applyZoom(nextZoom, {
    focalX: focalPoint.x,
    focalY: focalPoint.y
  });
}

function applyZoom(nextZoom, options = {}) {
  const previousZoom = state.zoom;
  const zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
  const focalX = options.focalX ?? (canvasHost.clientWidth / 2);
  const focalY = options.focalY ?? (canvasHost.clientHeight / 2);
  const contentX = options.contentX ?? ((canvasHost.scrollLeft + focalX) / previousZoom);
  const contentY = options.contentY ?? ((canvasHost.scrollTop + focalY) / previousZoom);

  state.zoom = zoom;
  resizeStage();
  canvasHost.scrollLeft = (contentX * zoom) - focalX;
  canvasHost.scrollTop = (contentY * zoom) - focalY;
}

function getViewportFocalPoint() {
  return {
    x: canvasHost.clientWidth / 2,
    y: canvasHost.clientHeight / 2
  };
}

function updateZoomUi() {
  if (zoomValue) {
    zoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
  }
  if (zoomOutBtn) {
    zoomOutBtn.disabled = !state.ready || state.zoom <= MIN_ZOOM;
  }
  if (zoomInBtn) {
    zoomInBtn.disabled = !state.ready || state.zoom >= MAX_ZOOM;
  }
  if (zoomResetBtn) {
    zoomResetBtn.disabled = !state.ready || state.zoom === DEFAULT_ZOOM;
  }
}

function onPointerDown(event) {
  if (!state.ready) {
    return;
  }
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  event.preventDefault();
  activePointers.set(event.pointerId, getPointerClientPoint(event));
  state.svg.setPointerCapture(event.pointerId);

  if (event.pointerType === 'touch' && activePointers.size >= 2) {
    cancelActiveStroke();
    startPinchGesture();
    return;
  }

  state.drawing = true;
  state.pointerId = event.pointerId;
  state.lastPoint = toSvgPoint(event);
  state.activePathData = pointToInitialPath(state.lastPoint);
  state.activePath = createStrokeElement(state.tool, state.activePathData);
  state.activeUndoEntry = appendStrokeElement(state.tool, state.activePath);
}

function onPointerMove(event) {
  if (activePointers.has(event.pointerId)) {
    activePointers.set(event.pointerId, getPointerClientPoint(event));
  }

  if (pinchState && activePointers.size >= 2) {
    event.preventDefault();
    updatePinchGesture();
    return;
  }

  if (!state.drawing || event.pointerId !== state.pointerId) {
    return;
  }
  event.preventDefault();

  const currentPoint = toSvgPoint(event);
  extendActivePath(currentPoint);
  state.lastPoint = currentPoint;
}

function onPointerUpOrCancel(event) {
  activePointers.delete(event.pointerId);

  if (pinchState) {
    if (activePointers.size < 2) {
      pinchState = null;
    } else {
      startPinchGesture();
    }
  }

  if (!state.drawing || event.pointerId !== state.pointerId) {
    if (state.svg.hasPointerCapture(event.pointerId)) {
      state.svg.releasePointerCapture(event.pointerId);
    }
    return;
  }

  event.preventDefault();
  state.drawing = false;
  state.pointerId = null;
  state.lastPoint = null;
  commitActiveStroke();

  if (state.svg.hasPointerCapture(event.pointerId)) {
    state.svg.releasePointerCapture(event.pointerId);
  }
}

function getPointerClientPoint(event) {
  return {
    x: event.clientX,
    y: event.clientY
  };
}

function getTwoTouchGesture() {
  const points = Array.from(activePointers.values()).slice(0, 2);
  if (points.length < 2) {
    return null;
  }

  const [a, b] = points;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return {
    centerX: (a.x + b.x) / 2,
    centerY: (a.y + b.y) / 2,
    distance: Math.max(1, Math.hypot(dx, dy))
  };
}

function startPinchGesture() {
  const gesture = getTwoTouchGesture();
  if (!gesture) {
    pinchState = null;
    return;
  }

  const hostRect = canvasHost.getBoundingClientRect();
  const focalX = gesture.centerX - hostRect.left;
  const focalY = gesture.centerY - hostRect.top;

  pinchState = {
    startDistance: gesture.distance,
    startZoom: state.zoom,
    startContentX: (canvasHost.scrollLeft + focalX) / state.zoom,
    startContentY: (canvasHost.scrollTop + focalY) / state.zoom
  };
}

function updatePinchGesture() {
  const gesture = getTwoTouchGesture();
  if (!gesture || !pinchState) {
    return;
  }

  const hostRect = canvasHost.getBoundingClientRect();
  applyZoom(pinchState.startZoom * (gesture.distance / pinchState.startDistance), {
    focalX: gesture.centerX - hostRect.left,
    focalY: gesture.centerY - hostRect.top,
    contentX: pinchState.startContentX,
    contentY: pinchState.startContentY
  });
}

function cancelActiveStroke() {
  if (state.activePath) {
    state.activePath.remove();
  }

  state.drawing = false;
  state.pointerId = null;
  state.lastPoint = null;
  state.activePath = null;
  state.activePathData = '';
  state.activeUndoEntry = null;
}

function pointToInitialPath(point) {
  return `M ${formatNumber(point.x)} ${formatNumber(point.y)} l 0.001 0`;
}

function createStrokeElement(tool, pathData) {
  const order = state.nextStrokeOrder;
  const attrs = {
    d: pathData,
    fill: 'none',
    stroke: tool === 'eraser' ? '#000000' : state.selectedColor,
    'stroke-width': String(state.brushSize),
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'data-order': String(order),
    'data-tool': tool,
    'data-region': state.drawRegion,
    'data-brush-size': String(state.brushSize),
    'data-created-at': new Date().toISOString()
  };

  if (tool !== 'eraser') {
    attrs['data-color'] = state.selectedColor;
  }

  return createSvgElement('path', attrs);
}

function appendStrokeElement(tool, element) {
  state.nextStrokeOrder += 1;

  if (tool === 'eraser') {
    getEraserMaskGroupForRegion(state.drawRegion).appendChild(element);
    return { type: 'stroke', element };
  }

  getPaintGroupForRegion(state.drawRegion).appendChild(element);
  return { type: 'stroke', element };
}

function getPaintGroupForRegion(region) {
  return region === 'outside' ? state.outsidePaintGroup : state.insidePaintGroup;
}

function getEraserMaskGroupForRegion(region) {
  return region === 'outside' ? state.outsideEraserMaskGroup : state.insideEraserMaskGroup;
}

function extendActivePath(point) {
  if (!state.activePath) {
    return;
  }

  state.activePathData += ` L ${formatNumber(point.x)} ${formatNumber(point.y)}`;
  state.activePath.setAttribute('d', state.activePathData);
}

function commitActiveStroke() {
  if (state.activeUndoEntry) {
    pushUndoEntry(state.activeUndoEntry);
  }

  state.activePath = null;
  state.activePathData = '';
  state.activeUndoEntry = null;
}

function toSvgPoint(event) {
  const point = state.svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;

  const transform = state.svg.getScreenCTM();
  if (!transform) {
    return { x: 0, y: 0 };
  }

  const svgPoint = point.matrixTransform(transform.inverse());
  const viewBox = state.silhouetteViewBox;

  return {
    x: clamp(svgPoint.x, viewBox.minX, viewBox.minX + viewBox.width),
    y: clamp(svgPoint.y, viewBox.minY, viewBox.minY + viewBox.height)
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatNumber(value) {
  return Number(value).toFixed(3).replace(/\.?0+$/, '');
}

function pushUndoEntry(entry) {
  state.undoStack.push(entry);
  if (state.undoStack.length > MAX_UNDO_STEPS) {
    state.undoStack.shift();
  }
  updateUndoButtonState();
}

function undo() {
  if (!state.undoStack.length) {
    return;
  }

  const entry = state.undoStack.pop();
  if (entry.type === 'stroke') {
    entry.element.remove();
  } else if (entry.type === 'clear') {
    state.insidePaintGroup.replaceChildren(...entry.insidePaintChildren);
    state.outsidePaintGroup.replaceChildren(...entry.outsidePaintChildren);
    state.insideEraserMaskGroup.replaceChildren(...entry.insideEraserChildren);
    state.outsideEraserMaskGroup.replaceChildren(...entry.outsideEraserChildren);
  }

  updateUndoButtonState();
}

function clearDrawing() {
  if (
    !state.insidePaintGroup.childElementCount &&
    !state.outsidePaintGroup.childElementCount &&
    !state.insideEraserMaskGroup.childElementCount &&
    !state.outsideEraserMaskGroup.childElementCount
  ) {
    return;
  }

  const insidePaintChildren = Array.from(state.insidePaintGroup.children);
  const outsidePaintChildren = Array.from(state.outsidePaintGroup.children);
  const insideEraserChildren = Array.from(state.insideEraserMaskGroup.children);
  const outsideEraserChildren = Array.from(state.outsideEraserMaskGroup.children);
  pushUndoEntry({ type: 'clear', insidePaintChildren, outsidePaintChildren, insideEraserChildren, outsideEraserChildren });
  state.insidePaintGroup.replaceChildren();
  state.outsidePaintGroup.replaceChildren();
  state.insideEraserMaskGroup.replaceChildren();
  state.outsideEraserMaskGroup.replaceChildren();
}

function saveAsPng() {
  if (!state.ready) {
    return;
  }

  const { width, height } = getExportDimensions();
  const serializedSvg = serializeCurrentSvg({ includeMetadata: false, width, height });
  const merged = document.createElement('canvas');
  merged.width = width;
  merged.height = height;
  const mergedCtx = merged.getContext('2d');

  const image = new Image();
  const svgUrl = URL.createObjectURL(new Blob([serializedSvg], { type: 'image/svg+xml;charset=utf-8' }));

  image.onload = () => {
    mergedCtx.fillStyle = '#FFFFFF';
    mergedCtx.fillRect(0, 0, width, height);
    mergedCtx.drawImage(image, 0, 0, width, height);
    URL.revokeObjectURL(svgUrl);

    const stamp = buildTimestamp(new Date());

    const link = document.createElement('a');
    link.href = merged.toDataURL('image/png');
    link.download = buildExportFilename(stamp);
    link.click();
  };

  image.onerror = () => {
    URL.revokeObjectURL(svgUrl);
    setStatus('PNG保存用の画像生成に失敗しました。');
  };

  image.src = svgUrl;
}

function getExportDimensions() {
  const viewBox = state.silhouetteViewBox || FALLBACK_SILHOUETTE_SPEC.viewBox;
  const aspect = viewBox.width / viewBox.height;
  if (aspect >= 1) {
    return {
      width: EXPORT_SIZE,
      height: Math.round(EXPORT_SIZE / aspect)
    };
  }

  return {
    width: Math.round(EXPORT_SIZE * aspect),
    height: EXPORT_SIZE
  };
}

function saveAsSvg() {
  if (!state.ready) {
    return;
  }

  const serializedSvg = serializeCurrentSvg({ includeMetadata: true });
  const now = new Date();
  const stamp = buildTimestamp(now);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([serializedSvg], { type: 'image/svg+xml;charset=utf-8' }));
  link.download = buildExportFilename(stamp, 'svg');
  link.click();

  window.setTimeout(() => {
    URL.revokeObjectURL(link.href);
  }, 0);
}

function serializeCurrentSvg(options = {}) {
  const {
    includeMetadata = true,
    width = null,
    height = null
  } = options;
  const clone = state.svg.cloneNode(true);
  clone.setAttribute('xmlns', SVG_NS);
  if (width) {
    clone.setAttribute('width', String(width));
  }
  if (height) {
    clone.setAttribute('height', String(height));
  }
  clone.removeAttribute('class');

  if (includeMetadata) {
    clone.insertBefore(createExportMetadataElement(), clone.firstChild);
    clone.insertBefore(createExportHistoryElement(), clone.querySelector('.silhouette-outline'));
  }

  return new XMLSerializer().serializeToString(clone);
}

function createExportMetadataElement() {
  const metadata = createSvgElement('metadata', {
    id: 'human-body-coloring-metadata'
  });
  const script = document.createElementNS(SVG_NS, 'script');
  script.setAttribute('type', 'application/json');
  script.textContent = JSON.stringify(buildExportMetadata(), null, 2);
  metadata.appendChild(script);
  return metadata;
}

function buildExportMetadata() {
  const strokes = collectStrokeMetadata();
  return {
    app: 'human-body-coloring',
    version: 1,
    exportedAt: new Date().toISOString(),
    sourceSilhouette: state.silhouetteSpec ? state.silhouetteSpec.label : SILHOUETTE_SOURCE,
    viewBox: state.silhouetteViewBox,
    strokeCount: strokes.length,
    strokes
  };
}

function createExportHistoryElement() {
  const group = createSvgElement('g', {
    id: 'paint-history',
    display: 'none',
    'data-description': 'Stroke history sorted by data-order. Eraser strokes are preserved as history entries.'
  });

  collectStrokeElementsInOrder().forEach((element) => {
    const clone = element.cloneNode(true);
    clone.removeAttribute('id');
    clone.removeAttribute('class');
    clone.removeAttribute('mask');
    clone.removeAttribute('clip-path');
    group.appendChild(clone);
  });

  return group;
}

function collectStrokeMetadata() {
  return collectStrokeElementsInOrder()
    .map((element) => ({
      order: Number(element.dataset.order),
      tool: element.dataset.tool,
      region: element.dataset.region,
      color: element.dataset.color || null,
      brushSize: Number(element.dataset.brushSize),
      createdAt: element.dataset.createdAt,
      pathData: element.getAttribute('d')
    }));
}

function collectStrokeElementsInOrder() {
  return [
    ...Array.from(state.insidePaintGroup.children),
    ...Array.from(state.outsidePaintGroup.children),
    ...Array.from(state.insideEraserMaskGroup.children),
    ...Array.from(state.outsideEraserMaskGroup.children)
  ]
    .filter((element) => Number.isFinite(Number(element.dataset.order)))
    .sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));
}

function buildTimestamp(date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
}

function buildExportFilename(stamp, extension = 'png') {
  const rawId = exportIdInput ? exportIdInput.value : '';
  const sanitizedId = sanitizeFileNameSegment(rawId);
  if (!sanitizedId) {
    return `human-body-coloring-${stamp}.${extension}`;
  }
  return `human-body-coloring-${sanitizedId}-${stamp}.${extension}`;
}

function sanitizeFileNameSegment(raw) {
  return String(raw)
    .trim()
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function setControlsEnabled(enabled) {
  const controls = [
    ...paletteButtons,
    ...brushPresetButtons,
    ...regionButtons,
    zoomOutBtn,
    zoomInBtn,
    zoomResetBtn,
    eraserBtn,
    undoBtn,
    clearBtn,
    saveBtn,
    saveSvgBtn
  ];
  controls.forEach((el) => {
    if (el) {
      el.disabled = !enabled;
    }
  });
  updateZoomUi();
}

function updateUndoButtonState() {
  undoBtn.disabled = !state.ready || state.undoStack.length === 0;
}

function updateActiveUi() {
  paletteButtons.forEach((button) => {
    const active = state.tool === 'brush' && button.dataset.color === state.selectedColor;
    button.classList.toggle('active', active);
  });

  brushPresetButtons.forEach((button) => {
    const size = Number(button.dataset.size);
    const active = Number.isFinite(size) && size === state.brushSize;
    button.classList.toggle('active', active);
  });

  regionButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.region === state.drawRegion);
  });

  legendItems.forEach((item) => {
    const isNeutral = item.dataset.legendType === 'neutral';
    const active = isNeutral
      ? state.tool === 'eraser'
      : state.tool === 'brush' && item.dataset.paletteColor === state.selectedColor;
    item.classList.toggle('active', active);
  });

  eraserBtn.classList.toggle('active', state.tool === 'eraser');
}

function setStatus(text) {
  statusText.textContent = text;
}

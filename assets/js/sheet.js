// assets/js/sheet.js
import { makeDraggable } from './drag.js';

export const sheetsContainer = document.getElementById('sheets-container');

let gridSize = 20;
// Кэш для хранения цветов по идентификаторам партий
const colorCache = new Map();

export function initSheet() {
  setupEventListeners();
  if (sheetsContainer.innerHTML.trim() === '') {
    const initialSheet = {
      width: 800,
      height: 400,
      name: 'Лист 1',
      pieces: []
    };
    renderSheets([initialSheet]);
  }
}

function setupEventListeners() {
  window.addEventListener('loadLayoutRequest', (e) => {
    const layout = e.detail;
    loadLayoutData(layout);
  });

  window.addEventListener('renderSheets', (e) => {
    renderSheets(e.detail);
  });
}

export function renderSheets(sheets) {
  // Очищаем контейнер и кэш цветов при новом рендере
  colorCache.clear();
  sheetsContainer.innerHTML = '';

  sheets.forEach((sheet, index) => {
    const sheetElement = document.createElement('div');
    sheetElement.className = 'sheet';
    sheetElement.style.width = `${sheet.width}px`;
    sheetElement.style.height = `${sheet.height}px`;
    sheetElement.dataset.sheetIndex = index;

    const header = document.createElement('div');
    header.className = 'sheet-header';
    header.textContent = sheet.name;
    sheetElement.appendChild(header);

    if (sheet.pieces && Array.isArray(sheet.pieces)) {
      sheet.pieces.forEach(piece => {
        const pieceElement = createPieceElement(piece);
        sheetElement.appendChild(pieceElement);
      });
    }

    sheetsContainer.appendChild(sheetElement);
  });
}

function createPieceElement(piece) {
  const div = document.createElement('div');
  div.className = 'piece';
  div.style.width = `${piece.width || piece.w}px`;
  div.style.height = `${piece.height || piece.h}px`;
  div.style.left = `${piece.x}px`;
  div.style.top = `${piece.y}px`;

  const displayName = piece.name || piece.originalName || `${piece.width || piece.w}x${piece.height || piece.h}`;
  div.textContent = displayName;
  div.title = displayName;

  const width = piece.width || piece.w;
  const height = piece.height || piece.h;
  if (width > 100 && height > 100) {
    div.classList.add('piece-large');
  }

  // Генерируем цвет на основе идентификатора партии
  const colorInfo = generateBatchColor(piece);
  div.style.backgroundColor = colorInfo.background;
  div.style.borderColor = colorInfo.border;
  div.style.color = colorInfo.text;

  makeDraggable(div, gridSize);
  return div;
}

// Функция генерации цвета для партии
function generateBatchColor(piece) {
  // Создаем идентификатор партии на основе исходных данных
  let batchId;

  if (piece.originalName) {
    // Для деталей с названием используем комбинацию размера и названия
    batchId = `${piece.width}x${piece.height}-${piece.originalName}`;
  } else {
    // Для безымянных деталей используем только размер
    batchId = `${piece.width}x${piece.height}`;
  }

  // Если цвет уже был сгенерирован для этой партии - используем из кэша
  if (colorCache.has(batchId)) {
    return colorCache.get(batchId);
  }

  // Предопределенная палитра разнообразных цветов
  const colorPalette = [
    // Красные оттенки
    { background: 'hsl(0, 70%, 50%)', border: 'hsl(0, 70%, 35%)', text: '#ffffff' },

    // Оранжевые оттенки
    { background: 'hsl(30, 80%, 50%)', border: 'hsl(30, 80%, 35%)', text: '#000000' },

    // Желтые оттенки
    { background: 'hsl(50, 90%, 55%)', border: 'hsl(50, 90%, 40%)', text: '#000000' },

    // Зеленые оттенки
    { background: 'hsl(120, 70%, 45%)', border: 'hsl(120, 70%, 30%)', text: '#ffffff' },

    // Синие оттенки
    { background: 'hsl(200, 75%, 50%)', border: 'hsl(200, 75%, 35%)', text: '#ffffff' },

    // Фиолетовые оттенки
    { background: 'hsl(270, 75%, 55%)', border: 'hsl(270, 75%, 40%)', text: '#ffffff' },

    // Дополнительные цвета
    { background: 'hsl(320, 70%, 55%)', border: 'hsl(320, 70%, 40%)', text: '#ffffff' },
    { background: 'hsl(180, 75%, 50%)', border: 'hsl(180, 75%, 35%)', text: '#000000' },
    { background: 'hsl(100, 80%, 55%)', border: 'hsl(100, 80%, 40%)', text: '#000000' },
    { background: 'hsl(140, 75%, 50%)', border: 'hsl(140, 75%, 35%)', text: '#000000' }
  ];

  // Выбираем цвет на основе хэша идентификатора партии
  let hash = 0;
  for (let i = 0; i < batchId.length; i++) {
    hash = batchId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colorIndex = Math.abs(hash) % colorPalette.length;
  const colorInfo = colorPalette[colorIndex];

  // Сохраняем в кэш
  colorCache.set(batchId, colorInfo);

  return colorInfo;
}

export function clearSheet() {
  colorCache.clear();
  sheetsContainer.innerHTML = '';
}

function loadLayoutData(layout) {
  if (layout.sheets && Array.isArray(layout.sheets)) {
    renderSheets(layout.sheets);
  }
}

// Старые функции для обратной совместимости
export function updateSheet() {
  console.warn('updateSheet deprecated in new interface');
}

export function addPiece(x = null, y = null, w = null, h = null, name = '') {
  console.warn('addPiece deprecated in new interface');
}
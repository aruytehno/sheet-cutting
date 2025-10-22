// assets/js/sheet.js
import { makeDraggable } from './drag.js';

export const sheetsContainer = document.getElementById('sheets-container');

let gridSize = 20;
// Кэш для хранения цветов уже обработанных названий
const colorCache = new Map();
// Счетчик для уникальных безымянных деталей
let unnamedPieceCounter = 0;

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
  unnamedPieceCounter = 0;
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

  // Генерируем уникальный цвет на основе названия и размера
  const colorInfo = generateUniqueColor(piece);
  div.style.backgroundColor = colorInfo.background;
  div.style.borderColor = colorInfo.border;
  div.style.color = colorInfo.text;

  makeDraggable(div, gridSize);
  return div;
}

// Улучшенная функция генерации уникальных цветов
// Альтернативная версия с предопределенной палитрой
function generateUniqueColor(piece) {
  const width = piece.width || piece.w;
  const height = piece.height || piece.h;

  // Создаем уникальный ключ
  let colorKey;
  if (piece.originalName) {
    colorKey = piece.originalName;
  } else {
    colorKey = `unnamed_${width}x${height}_${unnamedPieceCounter++}`;
  }

  if (colorCache.has(colorKey)) {
    return colorCache.get(colorKey);
  }

  // Предопределенная палитра разнообразных цветов
  const colorPalette = [
    // Красные оттенки
    { background: 'hsl(0, 70%, 50%)', border: 'hsl(0, 70%, 35%)', text: '#ffffff' },
    { background: 'hsl(10, 75%, 55%)', border: 'hsl(10, 75%, 40%)', text: '#000000' },

    // Оранжевые оттенки
    { background: 'hsl(30, 80%, 50%)', border: 'hsl(30, 80%, 35%)', text: '#000000' },
    { background: 'hsl(40, 85%, 55%)', border: 'hsl(40, 85%, 40%)', text: '#000000' },

    // Желтые оттенки
    { background: 'hsl(50, 90%, 55%)', border: 'hsl(50, 90%, 40%)', text: '#000000' },
    { background: 'hsl(60, 85%, 60%)', border: 'hsl(60, 85%, 45%)', text: '#000000' },

    // Зеленые оттенки
    { background: 'hsl(120, 70%, 45%)', border: 'hsl(120, 70%, 30%)', text: '#ffffff' },
    { background: 'hsl(140, 75%, 50%)', border: 'hsl(140, 75%, 35%)', text: '#000000' },
    { background: 'hsl(160, 80%, 55%)', border: 'hsl(160, 80%, 40%)', text: '#000000' },

    // Синие оттенки
    { background: 'hsl(200, 75%, 50%)', border: 'hsl(200, 75%, 35%)', text: '#ffffff' },
    { background: 'hsl(220, 80%, 55%)', border: 'hsl(220, 80%, 40%)', text: '#ffffff' },
    { background: 'hsl(240, 70%, 50%)', border: 'hsl(240, 70%, 35%)', text: '#ffffff' },

    // Фиолетовые оттенки
    { background: 'hsl(270, 75%, 55%)', border: 'hsl(270, 75%, 40%)', text: '#ffffff' },
    { background: 'hsl(300, 80%, 60%)', border: 'hsl(300, 80%, 45%)', text: '#000000' },
    { background: 'hsl(320, 70%, 55%)', border: 'hsl(320, 70%, 40%)', text: '#ffffff' },

    // Дополнительные цвета
    { background: 'hsl(180, 75%, 50%)', border: 'hsl(180, 75%, 35%)', text: '#000000' },
    { background: 'hsl(100, 80%, 55%)', border: 'hsl(100, 80%, 40%)', text: '#000000' }
  ];

  // Выбираем цвет на основе хэша ключа
  let hash = 0;
  for (let i = 0; i < colorKey.length; i++) {
    hash = colorKey.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colorIndex = Math.abs(hash) % colorPalette.length;
  const colorInfo = colorPalette[colorIndex];

  // Сохраняем в кэш
  colorCache.set(colorKey, colorInfo);

  return colorInfo;
}

export function clearSheet() {
  colorCache.clear();
  unnamedPieceCounter = 0;
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
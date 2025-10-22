// assets/js/sheet.js
import { makeDraggable } from './drag.js';

export const sheetsContainer = document.getElementById('sheets-container');

let gridSize = 20;

export function initSheet() {
  setupEventListeners();
  // Создаем начальный лист если нет сохраненных данных и контейнер действительно пуст
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
  // Очищаем контейнер
  sheetsContainer.innerHTML = '';

  sheets.forEach((sheet, index) => {
    const sheetElement = document.createElement('div');
    sheetElement.className = 'sheet';
    sheetElement.style.width = `${sheet.width}px`;
    sheetElement.style.height = `${sheet.height}px`;
    sheetElement.dataset.sheetIndex = index;

    // Добавляем заголовок
    const header = document.createElement('div');
    header.className = 'sheet-header';
    header.textContent = sheet.name;
    sheetElement.appendChild(header);

    // Добавляем детали
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

  // Добавляем текст с размером/названием
  const displayName = piece.name || piece.originalName || `${piece.width || piece.w}x${piece.height || piece.h}`;
  div.textContent = displayName;
  div.title = displayName; // tooltip

  // Крупные детали получают особый класс
  const width = piece.width || piece.w;
  const height = piece.height || piece.h;
  if (width > 100 && height > 100) {
    div.classList.add('piece-large');
  }

  // Генерируем цвет на основе названия для одинаковых деталей
  if (piece.originalName) {
    const hue = stringToHue(piece.originalName);
    div.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
    div.style.borderColor = `hsl(${hue}, 80%, 40%)`;
  }

  makeDraggable(div, gridSize);
  return div;
}

// Вспомогательная функция для генерации цвета из строки
function stringToHue(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash % 360;
}

export function clearSheet() {
  sheetsContainer.innerHTML = '';
}

// Функция для загрузки данных из localStorage
function loadLayoutData(layout) {
  if (layout.sheets && Array.isArray(layout.sheets)) {
    renderSheets(layout.sheets);
  }
}

// Старые функции для обратной совместимости (можно будет удалить позже)
export function updateSheet() {
  // Для обратной совместимости - не используется в новом интерфейсе
  console.warn('updateSheet deprecated in new interface');
}

export function addPiece(x = null, y = null, w = null, h = null, name = '') {
  // Для обратной совместимости - не используется в новом интерфейсе
  console.warn('addPiece deprecated in new interface');
}
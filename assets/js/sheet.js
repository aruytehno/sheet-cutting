import { makeDraggable } from './drag.js';

export const sheet = document.getElementById('sheet');
const sheetWidthInput = document.getElementById('sheetWidth');
const sheetHeightInput = document.getElementById('sheetHeight');
const pieceWidthInput = document.getElementById('pieceWidth');
const pieceHeightInput = document.getElementById('pieceHeight');

let gridSize = 20;

export function initSheet() {
  setupEventListeners();
  updateSheet();
}

function setupEventListeners() {
  window.addEventListener('loadLayoutRequest', (e) => {
    const layout = e.detail;
    loadLayoutData(layout);
  });
}

export function updateSheet() {
  const w = parseInt(sheetWidthInput.value) || 800;
  const h = parseInt(sheetHeightInput.value) || 400;
  sheet.style.width = `${w}px`;
  sheet.style.height = `${h}px`;
}

export function addPiece(x = null, y = null, w = null, h = null) {
  w = (w ?? parseInt(pieceWidthInput.value)) || 100;
  h = (h ?? parseInt(pieceHeightInput.value)) || 80;

  // Восстанавливаем оригинальную логику с проверками
  x = x ?? Math.max(0, Math.floor(Math.random() * Math.max(1, sheet.clientWidth - w)));
  y = y ?? Math.max(0, Math.floor(Math.random() * Math.max(1, sheet.clientHeight - h)));

  const div = document.createElement('div');
  div.classList.add('piece');
  div.style.width = `${w}px`;
  div.style.height = `${h}px`;
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;

  sheet.appendChild(div);
  makeDraggable(div, gridSize);
}

export function clearSheet() {
  sheet.innerHTML = '';
}

// Внутренняя функция для загрузки данных
function loadLayoutData(layout) {
  // очистим текущие элементы
  sheet.innerHTML = '';

  if (layout.sheetWidth) sheetWidthInput.value = layout.sheetWidth;
  if (layout.sheetHeight) sheetHeightInput.value = layout.sheetHeight;
  updateSheet();

  // восстановим детали
  if (Array.isArray(layout.pieces)) {
    layout.pieces.forEach(p => {
      addPiece(p.x ?? 0, p.y ?? 0, p.w ?? parseInt(pieceWidthInput.value), p.h ?? parseInt(pieceHeightInput.value));
    });
  }
}
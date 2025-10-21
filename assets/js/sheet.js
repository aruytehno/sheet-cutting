import { saveLayout } from './storage.js';
import { makeDraggable } from './drag.js';

export const sheet = document.getElementById('sheet');
let gridSize = 20;

export function initSheet() {
  updateSheet();
}

export function updateSheet() {
  const w = parseInt(document.getElementById('sheetWidth').value) || 800;
  const h = parseInt(document.getElementById('sheetHeight').value) || 400;
  sheet.style.width = `${w}px`;
  sheet.style.height = `${h}px`;
}

export function addPiece(x = null, y = null, w = null, h = null) {
  const widthInput = document.getElementById('pieceWidth');
  const heightInput = document.getElementById('pieceHeight');

  w = w ?? parseInt(widthInput.value) || 100;
  h = h ?? parseInt(heightInput.value) || 80;
  x = x ?? Math.random() * (sheet.clientWidth - w);
  y = y ?? Math.random() * (sheet.clientHeight - h);

  const div = document.createElement('div');
  div.classList.add('piece');
  div.style.width = `${w}px`;
  div.style.height = `${h}px`;
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;

  sheet.appendChild(div);
  makeDraggable(div, gridSize);
  saveLayout();
}

export function clearSheet() {
  sheet.innerHTML = '';
  saveLayout();
}

export function getPieces() {
  return Array.from(sheet.querySelectorAll('.piece')).map(p => ({
    x: parseInt(p.style.left) || 0,
    y: parseInt(p.style.top) || 0,
    w: parseInt(p.style.width) || 0,
    h: parseInt(p.style.height) || 0
  }));
}

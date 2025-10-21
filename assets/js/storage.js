import { getPieces, sheet } from './sheet.js';
import { updateSheet, addPiece } from './sheet.js';

export function saveLayout() {
  const layout = {
    sheetWidth: parseInt(document.getElementById('sheetWidth').value),
    sheetHeight: parseInt(document.getElementById('sheetHeight').value),
    pieces: getPieces()
  };

  localStorage.setItem('sheetLayout', JSON.stringify(layout));
}

export function loadLayout() {
  const data = localStorage.getItem('sheetLayout');
  if (!data) return;

  const layout = JSON.parse(data);
  document.getElementById('sheetWidth').value = layout.sheetWidth;
  document.getElementById('sheetHeight').value = layout.sheetHeight;
  updateSheet();

  layout.pieces.forEach(p => addPiece(p.x, p.y, p.w, p.h));
}

export function clearStorage() {
  localStorage.removeItem('sheetLayout');
}

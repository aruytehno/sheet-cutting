import { updateSheet, addPiece, clearSheet } from './sheet.js';
import { saveLayout, clearStorage } from './storage.js';

export function initUI() {
  document.getElementById('updateSheet').addEventListener('click', () => {
    updateSheet();
    saveLayout();
  });

  document.getElementById('addPiece').addEventListener('click', addPiece);
  document.getElementById('saveLayout').addEventListener('click', saveLayout);

  document.getElementById('clearLayout').addEventListener('click', () => {
    clearSheet();
    clearStorage();
  });
}

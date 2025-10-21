import { initUI } from './ui.js';
import { loadLayout } from './storage.js';
import { initSheet } from './sheet.js';

document.addEventListener('DOMContentLoaded', () => {
  initSheet();   // создаём лист
  initUI();      // подключаем кнопки, вводы и обработчики
  loadLayout();  // загружаем сохранённый раскрой
});
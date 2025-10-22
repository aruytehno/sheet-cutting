// assets/js/app.js
import { initUI } from './ui.js';
import { loadLayout } from './storage.js';
import { initSheet } from './sheet.js';

document.addEventListener('DOMContentLoaded', () => {
  initSheet();   // инициализируем систему листов
  initUI();      // подключаем кнопки и обработчики
  loadLayout();  // загружаем сохранённый раскрой
});
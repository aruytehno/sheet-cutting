// assets/js/drag.js
import { saveLayout } from './storage.js';

export function makeDraggable(el, gridSize = 20) {
  let offsetX, offsetY;
  let currentSheet;

  el.addEventListener('mousedown', e => {
    currentSheet = el.closest('.sheet');
    const rect = el.getBoundingClientRect();
    const sheetRect = currentSheet.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Поднимаем элемент над другими
    el.style.zIndex = '1000';

    const move = ev => {
      if (!currentSheet) return;

      const sheetRect = currentSheet.getBoundingClientRect();
      let x = ev.clientX - sheetRect.left - offsetX;
      let y = ev.clientY - sheetRect.top - offsetY;

      // Ограничиваем перемещение в пределах текущего листа
      x = Math.max(0, Math.min(x, currentSheet.clientWidth - el.clientWidth));
      y = Math.max(0, Math.min(y, currentSheet.clientHeight - el.clientHeight));

      // Привязка к сетке
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      el.style.zIndex = '';
      saveLayout();
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });

  el.addEventListener('dblclick', () => {
    el.remove();
    saveLayout();
  });
}
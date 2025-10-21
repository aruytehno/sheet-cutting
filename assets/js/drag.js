import { saveLayout } from './storage.js';
import { sheet } from './sheet.js';

export function makeDraggable(el, gridSize = 20) {
  let offsetX, offsetY;

  el.addEventListener('mousedown', e => {
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    const move = ev => {
      const sheetRect = sheet.getBoundingClientRect();
      let x = ev.clientX - sheetRect.left - offsetX;
      let y = ev.clientY - sheetRect.top - offsetY;

      x = Math.max(0, Math.min(x, sheet.clientWidth - el.clientWidth));
      y = Math.max(0, Math.min(y, sheet.clientHeight - el.clientHeight));

      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
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

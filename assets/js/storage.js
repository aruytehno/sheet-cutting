// assets/js/storage.js
export function saveLayout() {
  const sheetsContainer = document.getElementById('sheets-container');
  const cutWidth = parseInt(document.getElementById('cutWidth').value) || 0;
  const pieceInput = document.getElementById('pieceInput').value;
  const sheetInput = document.getElementById('sheetInput').value;

  const sheets = Array.from(sheetsContainer.querySelectorAll('.sheet')).map(sheet => ({
    width: parseInt(sheet.style.width) || 800,
    height: parseInt(sheet.style.height) || 400,
    name: sheet.querySelector('.sheet-header')?.textContent || 'Лист',
    pieces: Array.from(sheet.querySelectorAll('.piece')).map(piece => ({
      x: Number(piece.style.left.replace('px', '')) || 0,
      y: Number(piece.style.top.replace('px', '')) || 0,
      w: Number(piece.style.width.replace('px', '')) || 0,
      h: Number(piece.style.height.replace('px', '')) || 0,
      name: piece.textContent || ''
    }))
  }));

  const layout = {
    cutWidth,
    pieceInput,
    sheetInput,
    sheets
  };

  try {
    localStorage.setItem('sheetLayout', JSON.stringify(layout));
  } catch (err) {
    console.error('Не удалось сохранить в localStorage:', err);
  }
}

export function loadLayout() {
  const data = localStorage.getItem('sheetLayout');
  if (!data) return;

  let layout;
  try {
    layout = JSON.parse(data);
  } catch (err) {
    console.error('Ошибка парсинга layout из localStorage:', err);
    return;
  }

  // Восстанавливаем ввод
  if (layout.cutWidth) document.getElementById('cutWidth').value = layout.cutWidth;
  if (layout.pieceInput) document.getElementById('pieceInput').value = layout.pieceInput;
  if (layout.sheetInput) document.getElementById('sheetInput').value = layout.sheetInput;

  // Инициируем обновление через событие
  window.dispatchEvent(new CustomEvent('loadLayoutRequest', { detail: layout }));
}

export function clearStorage() {
  localStorage.removeItem('sheetLayout');
}
export function saveLayout() {
  const sheetWidthInput = document.getElementById('sheetWidth');
  const sheetHeightInput = document.getElementById('sheetHeight');
  const sheet = document.getElementById('sheet');
  
  const pieces = Array.from(sheet.querySelectorAll('.piece')).map(p => ({
    x: Number(p.style.left.replace('px', '')) || 0,
    y: Number(p.style.top.replace('px', '')) || 0,
    w: Number(p.style.width.replace('px', '')) || 0,
    h: Number(p.style.height.replace('px', '')) || 0
  }));

  const layout = {
    sheetWidth: Number(sheetWidthInput.value) || parseInt(sheet.style.width) || 800,
    sheetHeight: Number(sheetHeightInput.value) || parseInt(sheet.style.height) || 400,
    pieces
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

  // Инициируем обновление через событие
  window.dispatchEvent(new CustomEvent('loadLayoutRequest', { detail: layout }));
}

export function clearStorage() {
  localStorage.removeItem('sheetLayout');
}
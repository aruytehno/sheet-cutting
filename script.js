const sheet = document.getElementById('sheet');
const sheetWidthInput = document.getElementById('sheetWidth');
const sheetHeightInput = document.getElementById('sheetHeight');
const updateSheetBtn = document.getElementById('updateSheet');
const addPieceBtn = document.getElementById('addPiece');
const saveBtn = document.getElementById('saveLayout');
const clearBtn = document.getElementById('clearLayout');
const pieceWidthInput = document.getElementById('pieceWidth');
const pieceHeightInput = document.getElementById('pieceHeight');

let gridSize = 20;

// === Инициализация листа ===
function updateSheet() {
  const w = parseInt(sheetWidthInput.value) || 800;
  const h = parseInt(sheetHeightInput.value) || 400;
  sheet.style.width = `${w}px`;
  sheet.style.height = `${h}px`;
  // НЕ сохраняем здесь — иначе при загрузке мы перезапишем сохранённый layout пустым.
}

// сразу применяем размеры по умолчанию (не сохраняем)
updateSheet();

// === Добавление новой детали ===
function addPiece(x = null, y = null, w = null, h = null) {
  w = (w ?? parseInt(pieceWidthInput.value)) || 100;
  h = (h ?? parseInt(pieceHeightInput.value)) || 80;

  // если x/y не заданы, размещаем случайно внутри листа
  x = x ?? Math.max(0, Math.floor(Math.random() * Math.max(1, sheet.clientWidth - w)));
  y = y ?? Math.max(0, Math.floor(Math.random() * Math.max(1, sheet.clientHeight - h)));

  const div = document.createElement('div');
  div.classList.add('piece');
  div.style.width = `${w}px`;
  div.style.height = `${h}px`;
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;

  sheet.appendChild(div);
  makeDraggable(div);
  saveLayout(); // сохраняем после добавления
}

// === Перетаскивание ===
function makeDraggable(el) {
  let offsetX, offsetY;

  el.addEventListener('mousedown', e => {
    // поддержка вложенных элементов: вычислим смещение относительно элемента
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    const move = ev => {
      // используем clientX/clientY и позицию sheet в окне
      const sheetRect = sheet.getBoundingClientRect();
      let x = ev.clientX - sheetRect.left - offsetX;
      let y = ev.clientY - sheetRect.top - offsetY;

      // ограничиваем движение внутри листа
      x = Math.max(0, Math.min(x, sheet.clientWidth - el.clientWidth));
      y = Math.max(0, Math.min(y, sheet.clientHeight - el.clientHeight));

      // привязка к сетке
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      saveLayout(); // сохраняем после окончания перетаскивания
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });

  // Дополнительно: двойной клик — удалить элемент
  el.addEventListener('dblclick', () => {
    el.remove();
    saveLayout();
  });
}

// === Сохранение раскроя ===
function saveLayout() {
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
    // для отладки можно раскомментировать:
    // console.log('Layout saved', layout);
  } catch (err) {
    console.error('Не удалось сохранить в localStorage:', err);
  }
}

// === Загрузка сохранённого раскроя ===
function loadLayout() {
  const data = localStorage.getItem('sheetLayout');
  if (!data) return;

  let layout;
  try {
    layout = JSON.parse(data);
  } catch (err) {
    console.error('Ошибка парсинга layout из localStorage:', err);
    return;
  }

  // очистим текущие элементы, чтобы не дублировать
  sheet.innerHTML = '';

  if (layout.sheetWidth) sheetWidthInput.value = layout.sheetWidth;
  if (layout.sheetHeight) sheetHeightInput.value = layout.sheetHeight;
  updateSheet(); // НЕ будет перезаписывать localStorage

  // восстановим детали
  if (Array.isArray(layout.pieces)) {
    layout.pieces.forEach(p => {
      // p.x/p.y/p.w/p.h ожидаем числа
      addPiece(p.x ?? 0, p.y ?? 0, p.w ?? parseInt(pieceWidthInput.value), p.h ?? parseInt(pieceHeightInput.value));
    });
  }

  // После полной загрузки приводим localStorage в соответствие с текущим DOM
  // (это перезапишет только если формат/данные изменились), но уже после восстановления.
  saveLayout();
}

// === Очистка раскроя ===
function clearLayout() {
  sheet.innerHTML = '';
  localStorage.removeItem('sheetLayout');
}

// Привязываем обработчики
updateSheetBtn.addEventListener('click', () => {
  updateSheet();
  // опционально сохраняем, если пользователь явно нажал "Обновить лист"
  saveLayout();
});
addPieceBtn.addEventListener('click', addPiece);
saveBtn.addEventListener('click', saveLayout);
clearBtn.addEventListener('click', clearLayout);

// Загружаем данные при старте
loadLayout();

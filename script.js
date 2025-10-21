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
  const w = parseInt(sheetWidthInput.value);
  const h = parseInt(sheetHeightInput.value);
  sheet.style.width = `${w}px`;
  sheet.style.height = `${h}px`;
  saveLayout();
}
updateSheet();

// === Добавление новой детали ===
function addPiece(x = null, y = null, w = null, h = null) {
  w = w || parseInt(pieceWidthInput.value);
  h = h || parseInt(pieceHeightInput.value);
  x = x ?? Math.random() * (sheet.clientWidth - w);
  y = y ?? Math.random() * (sheet.clientHeight - h);

  const div = document.createElement('div');
  div.classList.add('piece');
  div.style.width = `${w}px`;
  div.style.height = `${h}px`;
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;

  sheet.appendChild(div);
  makeDraggable(div);
  saveLayout();
}

// === Перетаскивание ===
function makeDraggable(el) {
  let offsetX, offsetY;

  el.addEventListener('mousedown', e => {
    offsetX = e.offsetX;
    offsetY = e.offsetY;

    const move = e => {
      let x = e.pageX - sheet.offsetLeft - offsetX;
      let y = e.pageY - sheet.offsetTop - offsetY;

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
      saveLayout();
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });
}

// === Сохранение раскроя ===
function saveLayout() {
  const pieces = Array.from(sheet.querySelectorAll('.piece')).map(p => ({
    x: parseInt(p.style.left),
    y: parseInt(p.style.top),
    w: parseInt(p.style.width),
    h: parseInt(p.style.height)
  }));

  const layout = {
    sheetWidth: parseInt(sheetWidthInput.value),
    sheetHeight: parseInt(sheetHeightInput.value),
    pieces
  };

  localStorage.setItem('sheetLayout', JSON.stringify(layout));
}

// === Загрузка сохранённого раскроя ===
function loadLayout() {
  const data = localStorage.getItem('sheetLayout');
  if (!data) return;

  const layout = JSON.parse(data);
  sheetWidthInput.value = layout.sheetWidth;
  sheetHeightInput.value = layout.sheetHeight;
  updateSheet();

  layout.pieces.forEach(p => addPiece(p.x, p.y, p.w, p.h));
}

// === Очистка раскроя ===
function clearLayout() {
  sheet.innerHTML = '';
  localStorage.removeItem('sheetLayout');
}

updateSheetBtn.addEventListener('click', updateSheet);
addPieceBtn.addEventListener('click', addPiece);
saveBtn.addEventListener('click', saveLayout);
clearBtn.addEventListener('click', clearLayout);

// Загружаем данные при старте
loadLayout();

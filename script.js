const sheet = document.getElementById('sheet');
const sheetWidthInput = document.getElementById('sheetWidth');
const sheetHeightInput = document.getElementById('sheetHeight');
const updateSheetBtn = document.getElementById('updateSheet');
const addPieceBtn = document.getElementById('addPiece');
const pieceWidthInput = document.getElementById('pieceWidth');
const pieceHeightInput = document.getElementById('pieceHeight');

let gridSize = 20; // шаг сетки

// Инициализация листа
function updateSheet() {
  const w = parseInt(sheetWidthInput.value);
  const h = parseInt(sheetHeightInput.value);
  sheet.style.width = `${w}px`;
  sheet.style.height = `${h}px`;
}
updateSheet();

// Добавление новой заготовки
function addPiece() {
  const w = parseInt(pieceWidthInput.value);
  const h = parseInt(pieceHeightInput.value);

  const div = document.createElement('div');
  div.classList.add('piece');
  div.style.width = `${w}px`;
  div.style.height = `${h}px`;
  div.style.left = `${Math.random() * (sheet.clientWidth - w)}px`;
  div.style.top = `${Math.random() * (sheet.clientHeight - h)}px`;
  sheet.appendChild(div);

  makeDraggable(div);
}

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
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });
}

updateSheetBtn.addEventListener('click', updateSheet);
addPieceBtn.addEventListener('click', addPiece);

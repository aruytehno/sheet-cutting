// assets/js/calculator.js

export function parsePiecesInput(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const pieces = [];
  const errors = [];

  lines.forEach((line, index) => {
    const parts = line.split('-');

    // Парсим размеры (формат: 300x400)
    const sizeMatch = parts[0].match(/^(\d+)x(\d+)$/);
    if (!sizeMatch) {
      errors.push(`Строка ${index + 1}: неверный формат размеров`);
      return;
    }

    const width = parseInt(sizeMatch[1]);
    const height = parseInt(sizeMatch[2]);

    if (width <= 0 || height <= 0) {
      errors.push(`Строка ${index + 1}: размеры должны быть положительными`);
      return;
    }

    // Парсим количество
    const count = parts[1] ? parseInt(parts[1]) : 1;
    if (!count || count <= 0) {
      errors.push(`Строка ${index + 1}: количество должно быть положительным`);
      return;
    }

    // Парсим название (если есть)
    const name = parts[2] || '';

    for (let i = 0; i < count; i++) {
      pieces.push({
        width,
        height,
        name: name || `${width}x${height}`,
        originalName: name
      });
    }
  });

  return { pieces, errors };
}

export function parseSheetsInput(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const sheets = [];
  const errors = [];

  lines.forEach((line, index) => {
    const parts = line.split('-');

    // Парсим размеры (формат: 800x400)
    const sizeMatch = parts[0].match(/^(\d+)x(\d+)$/);
    if (!sizeMatch) {
      errors.push(`Строка ${index + 1}: неверный формат размеров листа`);
      return;
    }

    const width = parseInt(sizeMatch[1]);
    const height = parseInt(sizeMatch[2]);

    if (width <= 0 || height <= 0) {
      errors.push(`Строка ${index + 1}: размеры листа должны быть положительными`);
      return;
    }

    // Парсим количество
    const count = parts[1] ? parseInt(parts[1]) : 1;
    if (!count || count <= 0) {
      errors.push(`Строка ${index + 1}: количество листов должно быть положительным`);
      return;
    }

    for (let i = 0; i < count; i++) {
      sheets.push({
        width,
        height,
        name: `Лист ${sheets.length + 1}`,
        pieces: [],
        usedWidth: 0,
        usedHeight: 0
      });
    }
  });

  return { sheets, errors };
}

export function calculateLayout(pieces, sheets, cutWidth, progressCallback = null) {
  // Сортируем детали по убыванию площади (сначала крупные)
  const sortedPieces = [...pieces].sort((a, b) =>
    (b.width * b.height) - (a.width * a.height)
  );

  const resultSheets = [...sheets];
  const remainingPieces = [];
  const totalPieces = sortedPieces.length;

  for (let i = 0; i < sortedPieces.length; i++) {
    const piece = sortedPieces[i];
    let placed = false;

    // Пытаемся разместить на существующих листах
    for (const sheet of resultSheets) {
      if (tryPlacePiece(sheet, piece, cutWidth)) {
        placed = true;
        break;
      }
    }

    // Если не поместилось, создаем новый стандартный лист
    if (!placed) {
      const newSheet = {
        width: 800, // стандартный размер
        height: 400,
        name: `Лист ${resultSheets.length + 1}`,
        pieces: [],
        usedWidth: 0,
        usedHeight: 0
      };

      if (tryPlacePiece(newSheet, piece, cutWidth)) {
        resultSheets.push(newSheet);
        placed = true;
      }
    }

    if (!placed) {
      remainingPieces.push(piece);
    }

    // Вызываем callback прогресса
    if (progressCallback) {
      const progress = Math.round((i + 1) / totalPieces * 100);
      progressCallback(progress, i + 1, totalPieces);
    }
  }

  return { sheets: resultSheets, remainingPieces };
}

function tryPlacePiece(sheet, piece, cutWidth) {
  const pieceWithCut = {
    width: piece.width + cutWidth,
    height: piece.height + cutWidth
  };

  // Простой алгоритм размещения - слева направо, сверху вниз
  let x = 0, y = 0;

  // Ищем свободное место
  while (y + pieceWithCut.height <= sheet.height) {
    while (x + pieceWithCut.width <= sheet.width) {
      // Проверяем пересечения с уже размещенными деталями
      const intersects = sheet.pieces.some(placedPiece => {
        const placedWithCut = {
          x: placedPiece.x - cutWidth,
          y: placedPiece.y - cutWidth,
          width: placedPiece.width + cutWidth * 2,
          height: placedPiece.height + cutWidth * 2
        };

        return !(x + pieceWithCut.width <= placedWithCut.x ||
                x >= placedWithCut.x + placedWithCut.width ||
                y + pieceWithCut.height <= placedWithCut.y ||
                y >= placedWithCut.y + placedWithCut.height);
      });

      if (!intersects) {
        // Нашли свободное место
        sheet.pieces.push({
          ...piece,
          x: x + cutWidth,
          y: y + cutWidth
        });
        return true;
      }

      x += 10; // шаг поиска
    }
    x = 0;
    y += 10;
  }

  return false;
}
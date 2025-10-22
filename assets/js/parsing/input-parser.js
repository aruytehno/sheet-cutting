// assets/js/parsing/input-parser.js

/**
 * Парсинг ввода деталей
 */
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

/**
 * Парсинг ввода листов
 */
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
        pieces: []
      });
    }
  });

  return { sheets, errors };
}
// assets/js/parsing/validator.js

/**
 * Валидация деталей
 */
export function validatePieces(pieces) {
  const errors = [];

  pieces.forEach((piece, index) => {
    if (piece.width <= 0 || piece.height <= 0) {
      errors.push(`Деталь ${index + 1}: размеры должны быть положительными`);
    }

    if (piece.width > 10000 || piece.height > 10000) {
      errors.push(`Деталь ${index + 1}: размеры слишком большие (макс. 10000мм)`);
    }

    if (!piece.name || piece.name.trim() === '') {
      errors.push(`Деталь ${index + 1}: отсутствует название`);
    }
  });

  return errors;
}

/**
 * Валидация листов
 */
export function validateSheets(sheets) {
  const errors = [];

  sheets.forEach((sheet, index) => {
    if (sheet.width <= 0 || sheet.height <= 0) {
      errors.push(`Лист ${index + 1}: размеры должны быть положительными`);
    }

    if (sheet.width > 20000 || sheet.height > 20000) {
      errors.push(`Лист ${index + 1}: размеры слишком большие (макс. 20000мм)`);
    }

    if (!sheet.name || sheet.name.trim() === '') {
      errors.push(`Лист ${index + 1}: отсутствует название`);
    }
  });

  return errors;
}

/**
 * Валидация толщины реза
 */
export function validateCutWidth(cutWidth) {
  const errors = [];

  if (cutWidth < 0) {
    errors.push('Толщина реза не может быть отрицательной');
  }

  if (cutWidth > 100) {
    errors.push('Толщина реза слишком большая (макс. 100мм)');
  }

  return errors;
}

/**
 * Комплексная валидация всех входных данных
 */
export function validateAllInput(pieces, sheets, cutWidth) {
  const errors = [
    ...validatePieces(pieces),
    ...validateSheets(sheets),
    ...validateCutWidth(cutWidth)
  ];

  return errors;
}
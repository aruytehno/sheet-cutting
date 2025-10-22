// assets/js/calculator.js
// Фасад для модулей расчета раскроя

// Реэкспорт функций парсинга
export { parsePiecesInput, parseSheetsInput } from './parsing/input-parser.js';
export { validateAllInput } from './parsing/validator.js';

// Импорт движка
import { LayoutEngine } from './layout/layout-engine.js';

/**
 * Основная функция расчета раскроя (совместимость со старым API)
 */
export async function calculateLayout(pieces, sheets, cutWidth, progressCallback = null) {
  const engine = new LayoutEngine({
    algorithm: 'guillotine',
    sorting: 'combined',
    allowRotation: true,
    optimizeRemnants: true,
    useRemnantsFirst: true
  });

  const result = await engine.calculate(pieces, sheets, cutWidth, progressCallback);

  // Возвращаем в формате совместимом со старым API
  return {
    sheets: result.sheets,
    remainingPieces: result.remainingPieces
    // remnants и efficiency пока не используем в UI
  };
}

/**
 * Новая функция с расширенными опциями
 */
export async function calculateLayoutAdvanced(pieces, sheets, cutWidth, options = {}, progressCallback = null) {
  const engine = new LayoutEngine({
    algorithm: 'guillotine',
    sorting: 'combined',
    allowRotation: true,
    optimizeRemnants: true,
    useRemnantsFirst: true,
    cutWidth: cutWidth,
    ...options
  });

  return await engine.calculate(pieces, sheets, cutWidth, progressCallback);
}
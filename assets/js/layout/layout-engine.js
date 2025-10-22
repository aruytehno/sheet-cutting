// assets/js/layout/layout-engine.js
import { GuillotineBin } from '../algorithms/guillotine.js';
import { RemnantManager } from '../algorithms/remnant-manager.js';
import { sortPiecesByMaxSide, sortPiecesByArea, sortPiecesCombined } from '../algorithms/sorting.js';
import { ProgressManager } from './progress-manager.js';

/**
 * Основной движок для расчета раскроя
 */
export class LayoutEngine {
  constructor(options = {}) {
    this.options = {
      algorithm: 'guillotine',
      sorting: 'combined',
      allowRotation: true,
      optimizeRemnants: true,
      useRemnantsFirst: true,
      ...options
    };
  }

  /**
   * Основной метод расчета раскроя
   */
  async calculate(pieces, sheets, cutWidth, progressCallback = null) {
    const progress = progressCallback
      ? new ProgressManager(pieces.length, progressCallback)
      : null;

    // Сортируем детали
    const sortedPieces = this.sortPieces(pieces);

    const resultSheets = [];
    const remainingPieces = [];
    const remnantManager = new RemnantManager();

    // Инициализируем листы
    for (const sheet of sheets) {
      resultSheets.push(this.createSheetBin(sheet, cutWidth));
    }

    // Размещаем детали
    for (let i = 0; i < sortedPieces.length; i++) {
      const piece = sortedPieces[i];
      let placed = false;

      // Сначала пытаемся разместить на остатках
      if (this.options.useRemnantsFirst) {
        placed = this.tryPlaceOnRemnants(piece, remnantManager, cutWidth);
      }

      // Затем на существующих листах
      if (!placed) {
        placed = this.tryPlaceOnSheets(piece, resultSheets, cutWidth);
      }

      // Если не поместилось, создаем новый лист
      if (!placed) {
        const newSheet = this.createNewSheet(piece, cutWidth);
        if (newSheet.insert(piece, this.options.allowRotation)) {
          resultSheets.push(newSheet);
          placed = true;
        }
      }

      if (!placed) {
        remainingPieces.push(piece);
      }

      // Обновляем прогресс
      if (progress) {
        progress.increment();
        await progress.yieldToBrowser();
      }
    }

    // Собираем остатки с использованных листов
    if (this.options.optimizeRemnants) {
      this.collectRemnants(resultSheets, remnantManager);
    }

    // Конвертируем результат в нужный формат
    const formattedSheets = this.formatResult(resultSheets);

    return {
      sheets: formattedSheets,
      remainingPieces,
      remnants: remnantManager.getRemnants(),
      efficiency: this.calculateOverallEfficiency(resultSheets)
    };
  }

  /**
   * Сортировка деталей согласно выбранной стратегии
   */
  sortPieces(pieces) {
    switch (this.options.sorting) {
      case 'max-side':
        return sortPiecesByMaxSide(pieces);
      case 'area':
        return sortPiecesByArea(pieces);
      case 'combined':
      default:
        return sortPiecesCombined(pieces);
    }
  }

  /**
   * Попытка разместить на остатках
   */
  tryPlaceOnRemnants(piece, remnantManager, cutWidth) {
    const suitableRemnant = remnantManager.findSuitableRemnant(piece, this.options.allowRotation);

    if (suitableRemnant) {
      // Размещаем деталь на остатке
      const placedPiece = remnantManager.placeOnRemnant(piece, suitableRemnant, cutWidth);
      // Здесь можно добавить placedPiece в общий результат при необходимости
      return true;
    }

    return false;
  }

  /**
   * Попытка разместить на существующих листах
   */
  tryPlaceOnSheets(piece, sheets, cutWidth) {
    for (const sheet of sheets) {
      if (sheet.insert(piece, this.options.allowRotation)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Создать бину для листа
   */
  createSheetBin(sheet, cutWidth) {
    const bin = new GuillotineBin(sheet.width, sheet.height, cutWidth);
    bin.name = sheet.name;
    return bin;
  }

  /**
   * Создать новый лист для детали
   */
  createNewSheet(piece, cutWidth) {
    // Базовые размеры нового листа
    const baseWidth = 2000;
    const baseHeight = 1000;

    // Если деталь больше базового размера, увеличиваем лист
    const width = Math.max(baseWidth, piece.width + 100);
    const height = Math.max(baseHeight, piece.height + 100);

    return new GuillotineBin(width, height, cutWidth);
  }

  /**
   * Собрать остатки с листов
   */
  collectRemnants(sheets, remnantManager) {
    for (const sheet of sheets) {
      const freeRects = sheet.getFreeRects();
      for (const rect of freeRects) {
        remnantManager.addRemnant({
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y,
          sourceSheet: sheet.name
        });
      }
    }
  }

  /**
   * Форматирование результата для отображения
   */
  formatResult(sheets) {
    return sheets.map(sheet => ({
      width: sheet.width,
      height: sheet.height,
      name: sheet.name,
      pieces: sheet.pieces.map(piece => ({
        x: piece.x,
        y: piece.y,
        width: piece.width,
        height: piece.height,
        name: piece.name,
        originalName: piece.originalName,
        rotated: piece.rotated
      })),
      efficiency: sheet.getEfficiency(),
      usedArea: sheet.getUsedArea()
    }));
  }

  /**
   * Расчет общей эффективности
   */
  calculateOverallEfficiency(sheets) {
    const totalArea = sheets.reduce((sum, sheet) => sum + (sheet.width * sheet.height), 0);
    const usedArea = sheets.reduce((sum, sheet) => sum + sheet.getUsedArea(), 0);
    return (usedArea / totalArea) * 100;
  }
}
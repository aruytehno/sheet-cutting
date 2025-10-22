// assets/js/algorithms/guillotine.js

/**
 * Класс для представления свободного прямоугольника
 */
class FreeRect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

/**
 * Класс для гильотинного раскроя
 */
export class GuillotineBin {
  constructor(width, height, cutWidth = 0) {
    this.width = width;
    this.height = height;
    this.cutWidth = cutWidth;
    this.pieces = [];
    this.freeRects = [new FreeRect(0, 0, width, height)];
  }

  /**
   * Попытка разместить деталь с учетом вращения
   */
  insert(piece, allowRotation = true) {
    const orientations = allowRotation
      ? [
          { width: piece.width, height: piece.height, rotated: false },
          { width: piece.height, height: piece.width, rotated: true }
        ]
      : [
          { width: piece.width, height: piece.height, rotated: false }
        ];

    for (const orientation of orientations) {
      const placed = this.tryInsertWithOrientation(piece, orientation);
      if (placed) return true;
    }

    return false;
  }

  /**
   * Попытка разместить деталь в конкретной ориентации
   */
  tryInsertWithOrientation(piece, orientation) {
    const pieceWidth = orientation.width + this.cutWidth;
    const pieceHeight = orientation.height + this.cutWidth;

    // Ищем подходящий свободный прямоугольник
    const freeRectIndex = this.findFreeRect(pieceWidth, pieceHeight);
    if (freeRectIndex === -1) return false;

    const freeRect = this.freeRects[freeRectIndex];

    // Размещаем деталь
    const placedPiece = {
      ...piece,
      x: freeRect.x,
      y: freeRect.y,
      width: orientation.width,
      height: orientation.height,
      rotated: orientation.rotated
    };

    this.pieces.push(placedPiece);

    // Удаляем использованный свободный прямоугольник
    this.freeRects.splice(freeRectIndex, 1);

    // Разрезаем оставшееся пространство
    this.splitFreeRect(freeRect, pieceWidth, pieceHeight);

    return true;
  }

  /**
   * Поиск подходящего свободного прямоугольника
   */
  findFreeRect(width, height) {
    let bestRectIndex = -1;
    let bestScore = Infinity;

    for (let i = 0; i < this.freeRects.length; i++) {
      const rect = this.freeRects[i];

      if (rect.width >= width && rect.height >= height) {
        // Оценка "квадратности" остатка
        const remainingWidth = rect.width - width;
        const remainingHeight = rect.height - height;

        const score = Math.min(remainingWidth, remainingHeight) /
                     Math.max(remainingWidth, remainingHeight);

        if (score < bestScore) {
          bestScore = score;
          bestRectIndex = i;
        }
      }
    }

    return bestRectIndex;
  }

  /**
   * Разделение свободного прямоугольника после размещения детали
   */
  splitFreeRect(freeRect, usedWidth, usedHeight) {
    // Вертикальное разделение
    if (freeRect.width > usedWidth) {
      this.freeRects.push(new FreeRect(
        freeRect.x + usedWidth,
        freeRect.y,
        freeRect.width - usedWidth,
        usedHeight
      ));
    }

    // Горизонтальное разделение
    if (freeRect.height > usedHeight) {
      this.freeRects.push(new FreeRect(
        freeRect.x,
        freeRect.y + usedHeight,
        freeRect.width,
        freeRect.height - usedHeight
      ));
    }
  }

  /**
   * Получить список свободных прямоугольников
   */
  getFreeRects() {
    return this.freeRects;
  }

  /**
   * Получить использованную площадь
   */
  getUsedArea() {
    return this.pieces.reduce((area, piece) =>
      area + (piece.width * piece.height), 0
    );
  }

  /**
   * Получить эффективность использования
   */
  getEfficiency() {
    const totalArea = this.width * this.height;
    return (this.getUsedArea() / totalArea) * 100;
  }
}
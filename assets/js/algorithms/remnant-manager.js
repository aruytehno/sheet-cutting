// assets/js/algorithms/remnant-manager.js

/**
 * Менеджер для работы с остатками материалов
 */
export class RemnantManager {
  constructor() {
    this.remnants = [];
  }

  /**
   * Добавить остаток
   */
  addRemnant(remnant) {
    // Фильтруем слишком маленькие остатки
    if (remnant.width >= 50 && remnant.height >= 50) {
      this.remnants.push(remnant);
    }
  }

  /**
   * Найти подходящий остаток для детали
   */
  findSuitableRemnant(piece, allowRotation = true) {
    const orientations = allowRotation
      ? [
          { width: piece.width, height: piece.height },
          { width: piece.height, height: piece.width }
        ]
      : [
          { width: piece.width, height: piece.height }
        ];

    for (let i = 0; i < this.remnants.length; i++) {
      const remnant = this.remnants[i];

      for (const orientation of orientations) {
        if (remnant.width >= orientation.width && remnant.height >= orientation.height) {
          return {
            remnantIndex: i,
            remnant: remnant,
            orientation: orientation
          };
        }
      }
    }

    return null;
  }

  /**
   * Разместить деталь на остатке и вернуть информацию о размещении
   */
  placeOnRemnant(piece, remnantInfo, cutWidth) {
    const { remnantIndex, remnant, orientation } = remnantInfo;

    const placedPiece = {
      ...piece,
      x: remnant.x + cutWidth / 2,
      y: remnant.y + cutWidth / 2,
      width: orientation.width,
      height: orientation.height,
      rotated: orientation.rotated
    };

    // Используем остаток
    this.useRemnant(
      remnantIndex,
      orientation.width + cutWidth,
      orientation.height + cutWidth
    );

    return placedPiece;
  }

  /**
   * Использовать остаток для размещения детали
   */
  useRemnant(remnantIndex, usedWidth, usedHeight) {
    const remnant = this.remnants[remnantIndex];

    // Удаляем использованный остаток
    this.remnants.splice(remnantIndex, 1);

    // Добавляем новые остатки от использования
    if (remnant.width > usedWidth) {
      this.addRemnant({
        width: remnant.width - usedWidth,
        height: usedHeight,
        x: remnant.x + usedWidth,
        y: remnant.y
      });
    }

    if (remnant.height > usedHeight) {
      this.addRemnant({
        width: remnant.width,
        height: remnant.height - usedHeight,
        x: remnant.x,
        y: remnant.y + usedHeight
      });
    }
  }

  /**
   * Получить все остатки
   */
  getRemnants() {
    return this.remnants;
  }

  /**
   * Очистить остатки
   */
  clear() {
    this.remnants = [];
  }

  /**
   * Получить общую площадь остатков
   */
  getTotalArea() {
    return this.remnants.reduce((total, remnant) =>
      total + (remnant.width * remnant.height), 0
    );
  }
}
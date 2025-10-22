// assets/js/algorithms/sorting.js

/**
 * Сортировка деталей по убыванию максимальной стороны
 */
export function sortPiecesByMaxSide(pieces) {
  return [...pieces].sort((a, b) => {
    const maxA = Math.max(a.width, a.height);
    const maxB = Math.max(b.width, b.height);
    return maxB - maxA; // по убыванию
  });
}

/**
 * Сортировка деталей по убыванию площади
 */
export function sortPiecesByArea(pieces) {
  return [...pieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA; // по убыванию
  });
}

/**
 * Комбинированная сортировка: сначала по максимальной стороне, затем по площади
 */
export function sortPiecesCombined(pieces) {
  return [...pieces].sort((a, b) => {
    const maxA = Math.max(a.width, a.height);
    const maxB = Math.max(b.width, b.height);

    // Сначала сравниваем по максимальной стороне
    if (maxA !== maxB) {
      return maxB - maxA;
    }

    // При равной максимальной стороне - по площади
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
}
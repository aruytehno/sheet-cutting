// assets/js/layout/progress-manager.js

/**
 * Менеджер для отслеживания прогресса расчета
 */
export class ProgressManager {
  constructor(totalPieces, callback) {
    this.totalPieces = totalPieces;
    this.callback = callback;
    this.current = 0;
  }

  /**
   * Обновить прогресс
   */
  update(current, customMessage = null) {
    this.current = current;
    const percent = Math.round((current / this.totalPieces) * 100);

    const message = customMessage || `Обработано ${current} из ${this.totalPieces} деталей`;

    if (this.callback) {
      this.callback(percent, current, this.totalPieces, message);
    }
  }

  /**
   * Увеличить счетчик на 1
   */
  increment(customMessage = null) {
    this.update(this.current + 1, customMessage);
  }

  /**
   * Завершить прогресс
   */
  complete() {
    this.update(this.totalPieces, 'Расчет завершен!');
  }

  /**
   * Проверить нужно ли обновить UI (для оптимизации)
   */
  shouldUpdateUI() {
    // Обновляем UI каждые 10 деталей или для последней детали
    const updateFrequency = this.totalPieces > 100 ? 10 : 5;
    return this.current % updateFrequency === 0 || this.current === this.totalPieces;
  }

  /**
   * Дать браузеру обновить UI
   */
  async yieldToBrowser() {
    if (this.shouldUpdateUI()) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}
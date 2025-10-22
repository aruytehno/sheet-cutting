// assets/js/ui.js
import { renderSheets, clearSheet } from './sheet.js';
import { saveLayout, clearStorage } from './storage.js';
import { parsePiecesInput, parseSheetsInput, calculateLayout } from './calculator.js';

export function initUI() {
  document.getElementById('calculate').addEventListener('click', calculateAndRender);
  document.getElementById('saveLayout').addEventListener('click', saveLayout);
  document.getElementById('clearLayout').addEventListener('click', () => {
    clearSheet();
    clearStorage();
  });
}

function calculateAndRender() {
  const pieceInput = document.getElementById('pieceInput');
  const sheetInput = document.getElementById('sheetInput');
  const cutWidth = parseInt(document.getElementById('cutWidth').value) || 0;
  const calculateBtn = document.getElementById('calculate');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const progressPercent = document.getElementById('progress-percent');

  // Сбрасываем стили ошибок
  pieceInput.classList.remove('error');
  sheetInput.classList.remove('error');

  // Парсим ввод
  const { pieces: parsedPieces, errors: pieceErrors } = parsePiecesInput(pieceInput.value);
  const { sheets: parsedSheets, errors: sheetErrors } = parseSheetsInput(sheetInput.value);

  // Обрабатываем ошибки
  const allErrors = [...pieceErrors, ...sheetErrors];
  if (allErrors.length > 0) {
    // Подсвечиваем поля с ошибками
    if (pieceErrors.length > 0) pieceInput.classList.add('error');
    if (sheetErrors.length > 0) sheetInput.classList.add('error');

    alert('Обнаружены ошибки ввода:\n\n' + allErrors.join('\n'));
    return;
  }

  // Проверяем, что есть хотя бы один лист
  if (parsedSheets.length === 0) {
    sheetInput.classList.add('error');
    alert('Не указаны листы для раскроя!');
    return;
  }

  // Проверяем, что есть детали
  if (parsedPieces.length === 0) {
    pieceInput.classList.add('error');
    alert('Не указаны детали для раскроя!');
    return;
  }

  // Блокируем кнопку и показываем прогресс
  calculateBtn.disabled = true;
  calculateBtn.textContent = 'Расчет...';
  progressContainer.style.display = 'block';
  progressBar.style.width = '0%';
  progressPercent.textContent = '0%';
  progressText.textContent = 'Подготовка к расчету...';

  // Используем setTimeout для разбивки вычислений и обновления UI
  setTimeout(() => {
    try {
      // Функция обновления прогресса
      const updateProgress = (percent, current, total) => {
        progressBar.style.width = `${percent}%`;
        progressPercent.textContent = `${percent}%`;
        progressText.textContent = `Обработано ${current} из ${total} деталей`;

        // Даем браузеру возможность обновить UI
        if (percent % 5 === 0) {
          return new Promise(resolve => setTimeout(resolve, 0));
        }
      };

      // Рассчитываем раскрой с отслеживанием прогресса
      const { sheets, remainingPieces } = calculateLayout(
        parsedPieces,
        parsedSheets,
        cutWidth,
        updateProgress
      );

      // Завершаем прогресс
      progressBar.style.width = '100%';
      progressPercent.textContent = '100%';
      progressText.textContent = 'Завершено!';

      // Рендерим результат
      renderSheets(sheets);

      // Показываем предупреждение о непоместившихся деталях
      if (remainingPieces.length > 0) {
        setTimeout(() => {
          alert(`Внимание! Не удалось разместить ${remainingPieces.length} деталей. Возможно, потребуются дополнительные листы.`);
        }, 100);
      }

      // Сохраняем результат
      saveLayout();

    } catch (error) {
      console.error('Ошибка при расчете раскроя:', error);
      alert('Произошла ошибка при расчете раскроя. Проверьте входные данные.');
    } finally {
      // Восстанавливаем кнопку через небольшую задержку
      setTimeout(() => {
        calculateBtn.disabled = false;
        calculateBtn.textContent = 'Рассчитать';
        progressContainer.style.display = 'none';
      }, 1000);
    }
  }, 100);
}
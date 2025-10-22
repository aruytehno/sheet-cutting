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

  try {
    // Рассчитываем раскрой
    const { sheets, remainingPieces } = calculateLayout(parsedPieces, parsedSheets, cutWidth);

    // Рендерим результат
    renderSheets(sheets);

    // Показываем предупреждение о непоместившихся деталях
    if (remainingPieces.length > 0) {
      alert(`Внимание! Не удалось разместить ${remainingPieces.length} деталей. Возможно, потребуются дополнительные листы.`);
    }

    // Сохраняем результат
    saveLayout();

  } catch (error) {
    console.error('Ошибка при расчете раскроя:', error);
    alert('Произошла ошибка при расчете раскроя. Проверьте входные данные.');
  }
}
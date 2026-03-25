/**
 * Форматирует числовой рейтинг в строку.
 *
 * @param {number} [rating] — Числовой рейтинг (0–10). Если значение отсутствует или равно 0 — возвращает "Нет оценок".
 * @param {boolean} [onlyNumber=false] — Если true, возвращает только число без текста "Рейтинг:".
 */
export const formatRating = (rating?: number, onlyNumber: boolean = false): string => {
  if (typeof rating !== 'number' || rating <= 0) {
    return 'Нет оценок';
  }

  const formatted = rating.toFixed(1).replace('.', ',');

  return onlyNumber ? formatted : `Рейтинг: ${formatted}`;
};

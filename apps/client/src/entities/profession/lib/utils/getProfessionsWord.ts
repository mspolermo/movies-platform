/**
 * Возвращает корректную форму слова "профессия" в зависимости от количества.
 *
 * Примеры:
 * - 0 → "профессий"
 * - 1 → "профессия"
 * - 2–4 → "профессии"
 * - 5–20 → "профессий"
 *
 * Функция также безопасно обрабатывает некорректные значения,
 * приводя их к 0.
 *
 * @param {number} count - Количество профессий.
 * @returns {string} Корректная форма слова "профессия".
 */
export const getProfessionsWord = (count: number): string => {
  const safeCount = Number.isFinite(count) && count >= 0 ? count : 0;

  const lastDigit = safeCount % 10;
  const lastTwoDigits = safeCount % 100;

  // 11–19 всегда → "профессий"
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'профессий';
  }

  if (lastDigit === 1) return 'профессия';
  if (lastDigit >= 2 && lastDigit <= 4) return 'профессии';

  return 'профессий';
};

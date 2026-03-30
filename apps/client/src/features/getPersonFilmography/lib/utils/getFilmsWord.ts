/** Склонение «фильм» по числу (рус.). */
export const getFilmsWord = (count: number): string => {
  // На случай отрицательного или некорректного ввода — приводим к 0
  const safeCount = Number.isFinite(count) && count >= 0 ? count : 0;

  const lastDigit = safeCount % 10;
  const lastTwoDigits = safeCount % 100;

  // 11–19 — всегда "фильмов"
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'фильмов';
  }

  if (lastDigit === 1) return 'фильм';
  if (lastDigit >= 2 && lastDigit <= 4) return 'фильма';

  return 'фильмов';
};

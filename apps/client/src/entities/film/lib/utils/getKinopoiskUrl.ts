/**
 * Генерирует ссылку на поиск фильма в Кинопоиске.
 */
export const getKinopoiskUrl = (filmName: string): string =>
  `https://www.kinopoisk.ru/index.php?kp_query=${encodeURIComponent(filmName)}`;

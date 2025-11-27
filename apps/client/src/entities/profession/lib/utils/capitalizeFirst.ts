/**
 * Делает первую букву строки заглавной, а остальные — строчными.
 *
 * @param {string} [str] — Строка, которую нужно преобразовать.
 * @returns {string} Преобразованная строка. Если строки нет — возвращает пустую строку.
 */
export const capitalizeFirst = (str?: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
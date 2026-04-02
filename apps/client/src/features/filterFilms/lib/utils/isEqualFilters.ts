import type { TFilmsFilters } from "../../types";

/**
 * Сравнивает два объекта фильтров на равенство.
 *
 * Проверяет:
 * - примитивные поля (year, rating, grade, producer, actor)
 * - массивы (genres, countries) с учётом порядка элементов
 */
export const isEqualFilters = (a: TFilmsFilters, b: TFilmsFilters) => {
  return (
    a.year === b.year &&
    a.rating === b.rating &&
    a.grade === b.grade &&
    a.producer === b.producer &&
    a.actor === b.actor &&
    a.genres.length === b.genres.length &&
    a.countries.length === b.countries.length &&
    a.genres.every((g, i) => g === b.genres[i]) &&
    a.countries.every((c, i) => c === b.countries[i])
  );
};
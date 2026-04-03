import type { TFilmsFilters } from '../../model';

/**
 * Сравнивает два объекта фильтров на равенство.
 *
 * Проверяет:
 * - примитивные поля (rating, grade, producer, actor)
 * - массивы (genres, countries, years) с учётом порядка элементов
 */
export const isEqualFilters = (a: TFilmsFilters, b: TFilmsFilters) => {
  return (
    a.rating === b.rating &&
    a.grade === b.grade &&
    a.producer === b.producer &&
    a.actor === b.actor &&
    a.genres.length === b.genres.length &&
    a.countries.length === b.countries.length &&
    a.years.length === b.years.length &&
    a.genres.every((g, i) => g === b.genres[i]) &&
    a.countries.every((c, i) => c === b.countries[i]) &&
    a.years.every((y, i) => y === b.years[i])
  );
};

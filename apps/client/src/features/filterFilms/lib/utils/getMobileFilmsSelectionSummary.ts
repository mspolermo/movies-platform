import type { TFilmsFilters } from '../../model';

/**
 * Строка сводки выбранных фильтров для мобильного тулбара списка фильмов:
 * жанры, страны и годы премьеры (плейсхолдеры «Все жанры» / «все страны» / «все годы»,
 * если соответствующие списки пустые).
 */
export const getMobileFilmsSelectionSummary = (filters: TFilmsFilters): string => {
  const genresPart = !filters.genres.length ? 'Все жанры' : filters.genres.join(', ');
  const countriesPart = !filters.countries.length ? 'все страны' : filters.countries.join(', ');
  const yearsPart = !filters.years.length ? 'все годы' : filters.years.join(', ');

  return `${genresPart}, ${countriesPart}, ${yearsPart}`;
};

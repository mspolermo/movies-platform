import type { ActiveFilters } from '../../types';

import { DEFAULT_ACTIVE_FILTERS } from '../../types';

/**
 * Функция для парсинга фильтров фильма из URL
 */
export const parseFiltersFromURL = (
  searchParams: URLSearchParams | null
): ActiveFilters => {
  const filters: ActiveFilters = { ...DEFAULT_ACTIVE_FILTERS };

  if (!searchParams) return filters;

  const genres = searchParams.get('genres');
  if (genres) {
    filters.genres = genres.split(',').filter(Boolean);
  }

  const countries = searchParams.get('countries');
  if (countries) {
    filters.countries = countries.split(',').filter(Boolean);
  }

  const year = searchParams.get('year');
  if (year) {
    const yearNum = parseInt(year, 10);
    if (!isNaN(yearNum)) {
      filters.years = yearNum;
    }
  }

  const rating = searchParams.get('rating');
  if (rating) {
    const ratingNum = parseFloat(rating);
    if (!isNaN(ratingNum)) {
      filters.rating = ratingNum;
    }
  }

  const grade = searchParams.get('grade');
  if (grade) {
    const gradeNum = parseFloat(grade);
    if (!isNaN(gradeNum)) {
      filters.grade = gradeNum;
    }
  }

  const producer = searchParams.get('producer');
  if (producer) {
    filters.producer = producer;
  }

  const actor = searchParams.get('actor');
  if (actor) {
    filters.actor = actor;
  }

  return filters;
};

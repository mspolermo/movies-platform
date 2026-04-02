import type { TFilmSortBy } from '@common/types';

import { type TFilmsFilters } from '../../types';

/**
 * Сериализует фильтры и сортировку страницы фильмов в URLSearchParams.
 * Исключает значения по умолчанию и пустые поля.
 */
export const serializeFilmsPageQuery = (
  filters: TFilmsFilters,
  sort: TFilmSortBy
): URLSearchParams => {
  const params = new URLSearchParams();

  const {
    genres,
    countries,
    year,
    rating,
    grade,
    producer,
    actor,
  } = filters;

  if (genres.length) {
    params.set('genres', genres.join(','));
  }

  if (countries.length) {
    params.set('countries', countries.join(','));
  }

  if (year !== null) {
    params.set('year', String(year));
  }

  if (rating > 0) {
    params.set('rating', String(rating));
  }

  if (grade > 0) {
    params.set('grade', String(grade));
  }

  if (producer) {
    params.set('producer', producer);
  }

  if (actor) {
    params.set('actor', actor);
  }

  // не добавляем дефолтную сортировку в query
  if (sort !== 'popularity') {
    params.set('sort', sort);
  }

  return params;
}

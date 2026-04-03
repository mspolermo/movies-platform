import type { TFilmSortBy } from '@common/types';

/**
 * Подписи для опций сортировки фильмов.
 */
export const SORT_LABELS: Record<TFilmSortBy, string> = {
  popularity: 'По популярности',
  rating: 'По рейтингу',
  novelty: 'По новизне',
  alphabet: 'По алфавиту',
};

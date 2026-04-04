import type { TFilmsFilters } from '../model';
import type { TFilmSortBy } from '@common/types';

/** Конфигурация для разных типов слайдеров*/
export const RANGE_SLIDER_CONFIG = {
  rating: {
    max: 10,
    step: 0.1,
    min: 0,
    label: (value: number) => value.toString(),
    showMinMax: true,
    showCount: false,
  },
  grade: {
    max: 999000,
    step: 9000,
    min: 0,
    label: (value: number) => (value / 1000).toString(),
    showMinMax: false,
    showCount: true,
  },
} as const;

/**
 * Задержка перед применением значения слайдера к фильтрам (URL / запросы), мс.
 * Перетаскивание не должно дергать сеть на каждый шаг — см. RangeSlider.
 */
export const RANGE_SLIDER_ON_CHANGE_DEBOUNCE_MS = 300;

/** Размер страницы выдачи на «Фильмы» (useFilters → LoadMoreFilms / search). */
export const FILMS_LIST_PER_PAGE = 20;

/** Значения по умолчанию для фильтров */
export const DEFAULT_FILTERS: TFilmsFilters = {
  genres: [],
  countries: [],
  years: [],
  rating: 0,
  grade: 0,
  producer: '',
  actor: '',
};

/** Сортировка по умолчанию */
export const DEFAULT_FILM_SORT: TFilmSortBy = 'popularity';

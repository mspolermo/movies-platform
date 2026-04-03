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

/** Размер страницы выдачи на «Фильмы» (useFilters → LoadMoreFilms / search). */
export const FILMS_LIST_PER_PAGE = 20;

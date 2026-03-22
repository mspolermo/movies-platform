// API эндпойнты
export const API_ENDPOINTS = {
  // Фильмы
  FILMS: {
    SEARCH: '/films',
    BY_ID: (id: number) => `/films/${id}`,
    PROFESSIONS: (id: number) => `/films/${id}/professions`,
    PERSONS_BY_PROFESSION: (id: number) => `/films/${id}/persons-by-profession`,
  },

  // Жанры
  GENRES: {
    LIST: '/genres',
  },

  // Страны
  COUNTRIES: {
    LIST: '/countries',
  },

  // Персоны
  PERSONS: {
    LIST: '/persons',
    BY_ID: (id: number) => `/persons/${id}`,
  },

  // Профессии
  PROFESSIONS: {
    LIST: '/professions',
    PERSONS: (id: number) => `/professions/${id}/persons`,
  },

  // Поиск
  SEARCH: {
    GLOBAL: '/search',
  },

  // Фильтры
  FILTERS: {
    ROOT: '/filters',
    QUICK: '/filters/quick',
  },

  // Расширенные операции для персон
  PERSONS_EX: {
    SEARCH_FIND: '/persons/search/find',
  },
} as const;

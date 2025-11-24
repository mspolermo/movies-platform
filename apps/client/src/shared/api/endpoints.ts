// API эндпойнты
export const API_ENDPOINTS = {
  // Аутентификация
  AUTH: {
    LOGIN: '/auth/login',
    REGISTRATION: '/auth/registration',
    CHECK_TOKEN: '/auth/checkToken',
    REFRESH: '/auth/refresh',
  },

  // Фильмы
  FILMS: {
    SEARCH: '/films',
    BY_ID: (id: number) => `/films/${id}`,
    UPDATE: (id: number) => `/films/${id}`,
    DELETE: (id: number) => `/films/${id}`,
    PROFESSIONS: (id: number) => `/films/${id}/professions`,
    PERSONS_BY_PROFESSION: (id: number) => `/films/${id}/persons-by-profession`,
  },

  // Жанры
  GENRES: {
    LIST: '/genres',
    BY_ID: (id: number) => `/genres/${id}`,
  },

  // Страны
  COUNTRIES: {
    LIST: '/countries',
    BY_ID: (id: number) => `/countries/${id}`,
  },

  // Персоны
  PERSONS: {
    LIST: '/persons',
    BY_ID: (id: number) => `/persons/${id}`,
  },

  // Профессии
  PROFESSIONS: {
    LIST: '/professions',
    BY_ID: (id: number) => `/professions/${id}`,
    PERSONS: (id: number) => `/professions/${id}/persons`,
  },

  // Комментарии
  COMMENTS: {
    LIST: '/comments',
    BY_ID: (id: number) => `/comments/${id}`,
  },

  // Поиск
  SEARCH: {
    GLOBAL: '/search',
  },

  // Фильтры
  FILTERS: {
    ROOT: '/filters',
    GENRES: '/filters/genres',
    COUNTRIES: '/filters/countries',
  },

  // Расширенные операции для персон
  PERSONS_EX:
    {
      SEARCH_FIND: '/persons/search/find',
    },
} as const;

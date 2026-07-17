/**
 * Пути REST API (относительно baseURL `/api`).
 * Функции-пути — для ресурсов с динамическим id.
 */
export const API_ENDPOINTS = {
  FILMS: {
    SEARCH: '/films',
    BY_ID: (id: number) => `/films/${id}`,
    SIMILAR: (id: number) => `/films/${id}/similar`,
    PROFESSIONS: (id: number) => `/films/${id}/professions`,
    PERSONS_BY_PROFESSION: (id: number) => `/films/${id}/persons-by-profession`,
  },

  GENRES: {
    LIST: '/genres',
  },

  COUNTRIES: {
    LIST: '/countries',
  },

  PERSONS: {
    LIST: '/persons',
    BY_ID: (id: number) => `/persons/${id}`,
    FILMOGRAPHY: (id: number) => `/persons/${id}/filmography`,
  },

  PROFESSIONS: {
    LIST: '/professions',
    PERSONS: (id: number) => `/professions/${id}/persons`,
  },

  SEARCH: {
    GLOBAL: '/search',
  },

  FILTERS: {
    ROOT: '/filters',
    QUICK: '/filters/quick',
  },

  PERSONS_EX: {
    SEARCH_FIND: '/persons/search',
  },

  COMMENTS: {
    BY_FILM: (filmId: number) => `/comments/${filmId}`,
    LIKE: (commentId: number) => `/comments/${commentId}/like`,
  },

  AUTH: {
    LOGIN: '/auth/login',
    REGISTRATION: '/auth/registration',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
} as const;

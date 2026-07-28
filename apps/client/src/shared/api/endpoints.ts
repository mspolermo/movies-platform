/**
 * Проксирование same-origin запросов в браузере (Next → gateway).
 * Пути ниже задаются относительно этого baseURL.
 */
export const BROWSER_API_BASE_URL = '/api';

/** Запасной base URL для SSR, если нет `API_GATEWAY_URL`. */
export const DEFAULT_SSR_API_BASE_URL = 'http://localhost:5001';

/**
 * Пути REST API (относительно {@link BROWSER_API_BASE_URL}).
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

  ADMIN: {
    FILMS: {
      LIST: '/admin/films',
      BY_ID: (id: number) => `/admin/films/${id}`,
    },
    GENRES: {
      LIST: '/admin/genres',
      BY_ID: (id: number) => `/admin/genres/${id}`,
    },
    COUNTRIES: {
      LIST: '/admin/countries',
      BY_ID: (id: number) => `/admin/countries/${id}`,
    },
    PROFESSIONS: {
      LIST: '/admin/professions',
      BY_ID: (id: number) => `/admin/professions/${id}`,
    },
    PERSONS: {
      LIST: '/admin/persons',
      BY_ID: (id: number) => `/admin/persons/${id}`,
    },
    USERS: {
      LIST: '/admin/users',
      BY_ID: (id: number) => `/admin/users/${id}`,
    },
  },
} as const;

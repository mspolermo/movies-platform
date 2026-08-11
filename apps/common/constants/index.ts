/** Максимальный лимит для выдачи в списках
 * TODO: что это  
 */
export const LIST_MAX_LIMIT = 100;

/** TODO: что это*/
export const LIST_DEFAULT_LIMIT = 20;

/** Дефолт perPage для admin-списков (ADR-007). */
export const ADMIN_LIST_DEFAULT_LIMIT = 50;

/** Мин. оценка фильма пользователем. */
export const FILM_USER_GRADE_MIN = 1;

/** Макс. оценка фильма пользователем. */
export const FILM_USER_GRADE_MAX = 10;

/** Верхняя граница «плохой» оценки (1..BAD_MAX плохо, выше — хорошо). */
export const FILM_USER_GRADE_BAD_MAX = 6;

export {
  JWT_ENV,
  JWT_DEFAULTS,
  resolveJwtSecret,
} from "./jwt";

export {
  NETWORK,
  API_GATEWAY_URL,
  CLIENT_ORIGIN,
  ALLOWED_ORIGINS,
} from "./network";

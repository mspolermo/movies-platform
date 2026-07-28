/** Путь страницы логина. */
export const AUTH_LOGIN_PATH = '/auth/login';

/** Путь страницы регистрации. */
export const AUTH_REGISTER_PATH = '/auth/register';

/** Путь по умолчанию после успешного входа или регистрации. */
export const DEFAULT_POST_AUTH_PATH = '/films';

/** UX: без сессии уводим с этих префиксов на логин. */
export const SESSION_PROTECTED_PREFIXES = ['/profile', '/admin'] as const;

/** UX: при активной сессии уводим с этих путей в каталог. */
export const SESSION_AUTH_PATHS = [AUTH_LOGIN_PATH, AUTH_REGISTER_PATH] as const;

/** UX-cookie: имя (не защита; см. proxy / ADR-001). */
export const HAS_SESSION_COOKIE = 'has_session';

/** Значение UX-cookie при активной сессии. */
export const HAS_SESSION_VALUE = '1';

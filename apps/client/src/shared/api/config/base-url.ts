/** Базовый URL API: браузер — same-origin rewrite (`/api`), SSR — gateway из env. */
const BROWSER_API_BASE_URL = '/api';
const DEFAULT_SSR_API_BASE_URL = 'http://localhost:5001';

const resolveSsrApiBaseUrl = (): string => {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;

  return env?.API_GATEWAY_URL ?? DEFAULT_SSR_API_BASE_URL;
};

/** URL для axios `baseURL` в зависимости от окружения (SSR vs browser). */
export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return resolveSsrApiBaseUrl();
  }

  return BROWSER_API_BASE_URL;
};

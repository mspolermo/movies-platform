import { BROWSER_API_BASE_URL, DEFAULT_SSR_API_BASE_URL } from '../../../api/endpoints';

const resolveSsrApiBaseUrl = (): string => {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;

  return env?.API_GATEWAY_URL ?? DEFAULT_SSR_API_BASE_URL;
};

/** URL для axios `baseURL`: SSR — gateway из env, browser — `/api`. */
export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return resolveSsrApiBaseUrl();
  }

  return BROWSER_API_BASE_URL;
};

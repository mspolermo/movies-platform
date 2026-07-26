import type { TAuthResponse } from '@common/types';

import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getApiBaseUrl } from '../../../lib';
import { clearAccessToken, getAccessToken, setAccessToken } from '../accessToken';
import { waitForSessionBootstrap, isSessionBootstrapping } from '../sessionBootstrap';
import { notifyAuthenticated, notifyUnauthenticated, notifySessionExpired } from '../sessionBridge';
import { clearHasSessionCookie, hasSessionCookie } from '../sessionCookie';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

/** Общий HTTP-клиент: same-origin `/api`, cookies, Bearer access token. */
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    indexes: null,
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshPromise: Promise<TAuthResponse> | null = null;

const isAuthEndpoint = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  return (
    url.includes('/auth/login') ||
    url.includes('/auth/registration') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/logout')
  );
};

const resetSession = (): void => {
  clearAccessToken();
  clearHasSessionCookie();
  notifyUnauthenticated();
};

const readAuthorization = (headers: InternalAxiosRequestConfig['headers']): string | undefined => {
  if (!headers) {
    return undefined;
  }

  if (typeof headers.get === 'function') {
    const value = headers.get('Authorization');
    return typeof value === 'string' ? value : undefined;
  }

  const value = (headers as { Authorization?: unknown }).Authorization;
  return typeof value === 'string' ? value : undefined;
};

/**
 * Обновление access token по refresh cookie.
 * Bootstrap и 401-интерцептор делят один in-flight — иначе reuse-детект на бэке.
 */
export const performTokenRefresh = (): Promise<TAuthResponse> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = apiClient
    .post<TAuthResponse>('/auth/refresh')
    .then(({ data }) => {
      setAccessToken(data.accessToken);
      notifyAuthenticated(data.user);
      return data;
    })
    .catch((error: unknown) => {
      resetSession();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest || isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const failedAuthorization = readAuthorization(originalRequest.headers);
      await waitForSessionBootstrap();

      // Bootstrap / параллельный refresh уже подменил access — retry без второй ротации.
      const token = getAccessToken();
      const nextAuthorization = token ? `Bearer ${token}` : undefined;
      if (nextAuthorization && nextAuthorization !== failedAuthorization) {
        originalRequest.headers.Authorization = nextAuthorization;
        return apiClient(originalRequest);
      }

      // Bootstrap упал / сессии нет — не бить refresh повторно.
      if (!hasSessionCookie()) {
        if (!isSessionBootstrapping()) {
          notifySessionExpired();
        }
        return Promise.reject(error);
      }

      const data = await performTokenRefresh();
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      if (!isSessionBootstrapping()) {
        notifySessionExpired();
      }

      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;

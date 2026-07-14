import type { TAuthResponse } from '@common/types';

import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getApiBaseUrl } from './config';
import {
  clearAccessToken,
  clearHasSessionCookie,
  getAccessToken,
  notifyAuthenticated,
  notifyUnauthenticated,
  setAccessToken,
  waitForSessionBootstrap,
  isSessionBootstrapping,
} from './lib';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// --- Axios instance ---

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

// --- Token refresh (single-flight) ---

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

/**
 * Обновление access token по refresh cookie.
 * Bootstrap и 401-интерцептор делят один in-flight запрос — иначе reuse-детект на бэке.
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

// --- 401 interceptor: один retry через refresh ---

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
      await waitForSessionBootstrap();
      const data = await performTokenRefresh();
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      if (
        typeof window !== 'undefined' &&
        !isSessionBootstrapping() &&
        !window.location.pathname.startsWith('/auth/')
      ) {
        window.location.assign('/auth/login');
      }

      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;

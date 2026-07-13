import axios, { isAxiosError } from 'axios';

import { getToken, removeToken } from '@/shared/lib/auth';

//TODO: убрать хардкод базового урла

// Создание axios инстанса
const apiClient = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    indexes: null,
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//TODO: выглядит как плохая практика токен в сторадже хранить

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      removeToken();

      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
        window.location.assign('/auth/login');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

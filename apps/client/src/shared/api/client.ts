import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

import axios from 'axios';

//TODO: разобраться с этим импортом в shared, пересмотреть всю логику работы с authStore
// eslint-disable-next-line import/no-internal-modules, boundaries/element-types
import { useAuthStore } from '@/features/auth/api/authStore/store';

// Создание axios инстанса
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor для добавления JWT токена
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

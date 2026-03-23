import type { AxiosInstance } from 'axios';

import axios from 'axios';

// Создание axios инстанса
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    indexes: null,
  },
});

export default apiClient;

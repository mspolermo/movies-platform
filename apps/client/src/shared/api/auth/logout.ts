import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

/** Завершить сессию: отозвать refresh token на бэке и очистить cookie. */
export const logoutUser = async (): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
};

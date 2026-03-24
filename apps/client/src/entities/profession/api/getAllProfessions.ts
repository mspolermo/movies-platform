import type { TProfessionItemResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить все существующие профессии
 * @returns Массив профессий
 */
export const getAllProfessions = async (): Promise<
  TProfessionItemResponse[]
> => {
  const response = await apiClient.get<TProfessionItemResponse[]>(
    API_ENDPOINTS.PROFESSIONS.LIST
  );
  return Array.isArray(response.data) ? response.data : [];
};

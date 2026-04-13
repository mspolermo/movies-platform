import type { TProfessionItemResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Загрузка полного списка профессий (общая реализация для RSC/серверных обёрток).
 */
export const fetchAllProfessionsData = async (): Promise<TProfessionItemResponse[]> => {
  const response = await apiClient.get<TProfessionItemResponse[]>(API_ENDPOINTS.PROFESSIONS.LIST);
  return Array.isArray(response.data) ? response.data : [];
};

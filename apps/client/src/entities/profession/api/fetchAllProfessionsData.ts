'use server';

import type { TProfessionItemResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Список профессий для страницы «Профессии» (Server Component).
 * При ошибке запроса — null (страница может вызвать notFound).
 */
export const fetchAllProfessionsData = async (): Promise<TProfessionItemResponse[] | null> => {


  try {
    const response = await apiClient.get<TProfessionItemResponse[]>(API_ENDPOINTS.PROFESSIONS.LIST);
    return Array.isArray(response.data) ? response.data : [];
  
  } catch {
    return null;
  }
};

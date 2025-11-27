import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { TProfessionBased } from "@common/types";

/**
 * Получить все существующие профессии
 * @returns Массив профессий
 */
export const getAllProfessions = async (): Promise<TProfessionBased[]> => {
  const response = await apiClient.get(API_ENDPOINTS.PROFESSIONS.LIST);
  return Array.isArray(response.data) ? response.data : [];
};
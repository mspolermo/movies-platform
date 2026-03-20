import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { TCountryBased } from "@common/types";

/**
  * Получить список всех стран
*/ 
export const getCountriesList = async (): Promise<TCountryBased[]> => {
  const response = await apiClient.get<TCountryBased[]>(API_ENDPOINTS.COUNTRIES.LIST);

  return response.data
} 
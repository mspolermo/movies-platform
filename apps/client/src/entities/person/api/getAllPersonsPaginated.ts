import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { PaginatedPersonsResponse } from "@common/types";

/**
  * Получить всех персон с пагинацией
*/ 
  export const getAllPersonsPaginated = async (page: number = 1, limit: number = 20): Promise<PaginatedPersonsResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.PERSONS.LIST, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  }
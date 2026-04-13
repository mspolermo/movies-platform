'use server';

import type { TProfessionItemResponse } from '@common/types';

import { fetchAllProfessionsData } from '@/entities/profession';

/**
 * Список профессий для страницы «Профессии» (Server Component).
 * При ошибке запроса — null (страница может вызвать notFound).
 */
export const getAllProfessionsForPage = async (): Promise<TProfessionItemResponse[] | null> => {
  try {
    return await fetchAllProfessionsData();
  } catch {
    return null;
  }
};

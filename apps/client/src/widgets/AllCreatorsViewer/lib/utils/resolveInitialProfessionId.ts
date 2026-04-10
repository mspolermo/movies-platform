import type { TSearchParams } from '@/shared/types';
import type { TProfessionItemResponse } from '@common/types';

const professionParamFromSearch = (searchParams: TSearchParams): string | undefined => {
  const raw = searchParams.profession;
  if (raw === undefined) return undefined;
  return Array.isArray(raw) ? raw[0] : raw;
};

/**
 * Выбор id активной профессии по query `profession` (имя, без учёта регистра) и списку профессий.
 */
export const resolveInitialProfessionId = (
  professions: TProfessionItemResponse[],
  searchParams: TSearchParams
): number | null => {
  if (professions.length === 0) {
    return null;
  }

  const professionParam = professionParamFromSearch(searchParams);

  if (professionParam) {
    const foundProfession = professions.find(
      (p) => p.name.toLowerCase() === professionParam.toLowerCase()
    );
    if (foundProfession) {
      return foundProfession.id;
    }
    return professions[0].id;
  }

  return professions[0].id;
};

import type { TProfessionItemResponse } from '@common/types';

type TResolveActiveProfessionNameParams = {
  isLoading?: boolean;
  professions?: TProfessionItemResponse[];
  initialActiveProfessionId?: number | null;
  queryName: string | null;
};

/**
 * Имя активной профессии для крошек — в одной семантике со слайдером:
 * match по query → каноническое name; иначе имя по initialActiveProfessionId.
 * Unknown query не попадает в trail как raw string.
 */
export const resolveActiveProfessionName = ({
  isLoading,
  professions,
  initialActiveProfessionId,
  queryName,
}: TResolveActiveProfessionNameParams): string | null => {
  if (isLoading) {
    return queryName;
  }

  if (!professions?.length) {
    return null;
  }

  if (queryName) {
    const fromQuery = professions.find((p) => p.name.toLowerCase() === queryName.toLowerCase());
    if (fromQuery) {
      return fromQuery.name;
    }
  }

  if (initialActiveProfessionId == null) {
    return null;
  }

  return professions.find((p) => p.id === initialActiveProfessionId)?.name ?? null;
};

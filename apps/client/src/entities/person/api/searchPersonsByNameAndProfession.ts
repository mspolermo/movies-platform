import type { TPersonListItemResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

export const searchPersonsByNameAndProfession = async ({
  professionId,
  name,
}: {
  professionId: number;
  name: string;
}): Promise<TPersonListItemResponse[]> => {
  const { data } = await apiClient.get<TPersonListItemResponse[]>(
    API_ENDPOINTS.PERSONS_EX.SEARCH_FIND,
    {
      params: {
        professionId,
        name: name,
      },
    }
  );

  return data;
};

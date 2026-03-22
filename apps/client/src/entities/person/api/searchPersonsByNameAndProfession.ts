import type { TPersonModel } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

export const searchPersonsByNameAndProfession = async ({
  professionId,
  name,
}: {
  professionId: number;
  name: string;
}): Promise<TPersonModel[]> => {
  const { data } = await apiClient.get(API_ENDPOINTS.PERSONS_EX.SEARCH_FIND, {
    params: {
      professionId,
      name: name,
    },
  });

  return data.map((item: TPersonModel) => ({
    id: item.id,
    nameRu: item.nameRu,
    nameEn: item.nameEn,
  }));
};

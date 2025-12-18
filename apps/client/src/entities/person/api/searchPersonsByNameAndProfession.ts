import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { TPersonModel } from '@common/types';

export const searchPersonsByNameAndProfession = async ({
  professionId,
  name,
}: { professionId: number; name: string }): Promise<TPersonModel[]> => {
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
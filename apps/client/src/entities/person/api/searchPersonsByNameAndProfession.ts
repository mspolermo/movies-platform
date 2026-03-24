import type {
  TFindPersonsByNameAndProfessionRequest,
  TPersonListItemResponse,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

export const searchPersonsByNameAndProfession = async ({
  professionId,
  name,
}: TFindPersonsByNameAndProfessionRequest): Promise<
  TPersonListItemResponse[]
> => {
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

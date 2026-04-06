import type { TPaginatedPersonsResponse } from '@common/types';

export type TPersonsPageProps =
  | {
      isLoading: true;
      initialPersonsPage?: never;
    }
  | {
      isLoading?: false;
      initialPersonsPage: TPaginatedPersonsResponse;
    };

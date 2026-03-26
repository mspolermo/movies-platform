import type { TPersonProfileResponse } from '@common/types';

export type TPersonDetailPageProps =
  | {
      isLoading: true;
      person?: never;
    }
  | {
      isLoading?: false;
      person: TPersonProfileResponse;
    };

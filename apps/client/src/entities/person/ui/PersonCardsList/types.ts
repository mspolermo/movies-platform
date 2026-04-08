import type { TPersonListItemResponse } from '@common/types';

export type TPersonCardsListProps = {
  persons: TPersonListItemResponse[];
  isLoading: boolean;
  error?: string | null;
};

import type { TFilmListItemResponse, TSearchFilmsParams } from '@common/types';

import type { ReactNode } from 'react';

export interface LoadMoreFilmsProps {
  children: (
    films: TFilmListItemResponse[],
    loading: boolean,
    error: string | null
  ) => ReactNode;
  initialParams?: TSearchFilmsParams;
  threshold?: number;
  loadingComponent?: ReactNode;
  endMessage?: ReactNode;
  onParamsChange?: (params: TSearchFilmsParams) => void;
}

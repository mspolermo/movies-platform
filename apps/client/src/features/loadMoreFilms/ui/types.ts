import type { SearchFilmsParams } from '@/shared/types';
import type { TFilmBased } from '@common/types';

import type { ReactNode } from 'react';

export interface LoadMoreFilmsProps {
  children: (
    films: TFilmBased[],
    loading: boolean,
    error: string | null
  ) => ReactNode;
  initialParams?: SearchFilmsParams;
  threshold?: number;
  loadingComponent?: ReactNode;
  endMessage?: ReactNode;
  onParamsChange?: (params: SearchFilmsParams) => void;
}

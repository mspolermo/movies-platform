import { ReactNode } from 'react';
import { TFilmBased } from '@common/types';
import { SearchFilmsParams } from '@/shared/types';

export interface FilmsInfiniteScrollProps {
  children: (
    films: TFilmBased[],
    loading: boolean,
    error: string | null
  ) => ReactNode;
  initialParams?: SearchFilmsParams;
  threshold?: number;
  loadingComponent?: ReactNode;
  endMessage?: ReactNode;
  className?: string;
  onParamsChange?: (params: SearchFilmsParams) => void;
}

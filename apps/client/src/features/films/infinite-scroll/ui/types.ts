import { ReactNode } from 'react';
import { SearchFilmsParams } from '@/shared/api/services';
import { TFilmBased } from '@common/types';

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
}

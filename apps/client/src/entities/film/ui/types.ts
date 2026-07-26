import type { TFilmListItemResponse } from '@common/types';

export interface FilmCardProps {
  film: TFilmListItemResponse;
  showIcons?: boolean;
  isLoading?: boolean;
  /** LCP: eager load для above-the-fold постеров. */
  priority?: boolean;
}

export interface FilmCardSkeletonProps {
  showIcons?: boolean;
}

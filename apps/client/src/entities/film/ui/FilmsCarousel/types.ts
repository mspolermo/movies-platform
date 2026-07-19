import type { TFilmListItemResponse } from '@common/types';

export type TFilmsCarouselProps = {
  title: string;
  films: TFilmListItemResponse[];
  isLoading?: boolean;
  className?: string;
  /** Сколько первых постеров грузить с priority (LCP). */
  priorityCount?: number;
};

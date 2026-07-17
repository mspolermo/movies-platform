import type { TFilmListItemResponse } from '@common/types';

export type TFilmsCarouselProps = {
  title: string;
  films: TFilmListItemResponse[];
  isLoading?: boolean;
  className?: string;
};

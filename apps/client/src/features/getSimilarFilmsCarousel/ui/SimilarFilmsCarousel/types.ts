import type { TFilmListItemResponse } from '@common/types';

export type TSimilarFilmsCarouselProps = {
  films: TFilmListItemResponse[];
  filmName: string;
  isLoading?: boolean;
  className?: string;
};

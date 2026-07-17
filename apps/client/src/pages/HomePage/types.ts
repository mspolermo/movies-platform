import type { TFilmListItemResponse } from '@common/types';

export type THomeGenreCarousel = {
  /** Стабильный key для списка (имя жанра). */
  genreKey: string;
  title: string;
  films: TFilmListItemResponse[];
};

export type THomePageProps = {
  genreCarousels: THomeGenreCarousel[];
};

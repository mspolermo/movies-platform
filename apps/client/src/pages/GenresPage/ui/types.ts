import type { TGenreListResponse } from '@common/types';

export type TGenresPageProps =
  | {
      isLoading: true;
      genresList?: never;
    }
  | {
      isLoading?: false;
      genresList: TGenreListResponse;
    };

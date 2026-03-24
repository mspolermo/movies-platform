import type { TGenreItemResponse } from '@common/types';

export type TGenresPageProps =
  | {
      isLoading: true;
      genresList?: never;
    }
  | {
      isLoading?: false;
      genresList: TGenreItemResponse[];
    };

import type { TGenreBased } from '@common/types';

export type TGenresPageProps =
  | {
      isLoading: true;
      genresList?: never;
    }
  | {
      isLoading?: false;
      genresList: TGenreBased[];
    };

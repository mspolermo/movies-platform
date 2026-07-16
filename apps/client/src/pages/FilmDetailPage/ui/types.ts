import type { TFilmDetailsResponse, TFilmListItemResponse } from '@common/types';

export type TFilmDetailPageProps =
  | {
      isLoading: true;
      film?: never;
      similarFilms?: never;
    }
  | {
      isLoading?: false;
      film: TFilmDetailsResponse;
      similarFilms?: TFilmListItemResponse[];
    };

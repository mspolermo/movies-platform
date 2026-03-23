import type { TFilmDetailsResponse } from '@common/types';

export type TFilmDetailPageProps =
  | {
      isLoading: true;
      film?: never;
    }
  | {
      isLoading?: false;
      film: TFilmDetailsResponse;
    };

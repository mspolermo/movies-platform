import type { TFilmWithProfessions } from '@common/types';

export type TFilmDetailPageProps =
  | {
      isLoading: true;
      film?: never;
    }
  | {
      isLoading?: false;
      film: TFilmWithProfessions;
    };

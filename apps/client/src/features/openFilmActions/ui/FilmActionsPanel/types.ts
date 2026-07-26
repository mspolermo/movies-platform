import type { TFilmDetailsResponse, TFilmListItemResponse } from '@common/types';

export type TFilmActionsPanelProps =
  | {
      variant: 'card';
      film: TFilmListItemResponse;
    }
  | {
      variant: 'detail';
      film: TFilmDetailsResponse;
    };

import type { TPersonFilmographyListResponse } from '@common/types';

export type TShortInfoFilmsListProps = {
  films: TPersonFilmographyListResponse;
  isLoading: boolean;
};

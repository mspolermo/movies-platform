import type { TFilmListItemResponse } from '@common/types';

export type TFilmCardsListProps = {
  films: TFilmListItemResponse[];
  loading: boolean;
  error?: string | null;
};

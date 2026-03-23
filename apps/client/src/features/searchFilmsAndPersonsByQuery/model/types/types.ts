import type { TFilmCardResponse, TPersonListItemResponse } from '@common/types';

export interface TSearchResultProps {
  films: TFilmCardResponse[];
  persons: TPersonListItemResponse[];
}

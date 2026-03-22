import type { TFilmBased, TPersonBased } from '@common/types';

export interface TSearchResultProps {
  films: TFilmBased[];
  persons: TPersonBased[];
}

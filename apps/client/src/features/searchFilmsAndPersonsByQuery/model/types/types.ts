import type {
  TFilmListItemResponse,
  TPersonListItemResponse,
} from '@common/types';

export interface TSearchResultProps {
  films: TFilmListItemResponse[];
  persons: TPersonListItemResponse[];
}

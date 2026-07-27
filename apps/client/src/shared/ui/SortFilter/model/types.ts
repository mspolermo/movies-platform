import type { TFilmSortBy } from '@common/types';

export type TSortFilterProps = {
  selectedSort: TFilmSortBy;
  onUpdateSort: (sort: TFilmSortBy) => void;
};

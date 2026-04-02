import type { TAllFilmsFilters, TFilmsFilters } from '@/features/filterFilms/types';
import type { TFilmSortBy } from '@common/types';

export type TFilmsPageProps = {
  allFilters: TAllFilmsFilters;
  initialFilters: TFilmsFilters;
  initialSort: TFilmSortBy;
};

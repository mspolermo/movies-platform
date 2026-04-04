import type { TFilmsFilters } from '@/features/filterFilms';
import type { TFilmSortBy, TFiltersResponse } from '@common/types';

export type TFilmsDiscoveryProps = {
  allFilters: TFiltersResponse;
  initialFilters: TFilmsFilters;
  initialSort: TFilmSortBy;
};

export type TListingLoaderProps = {
  isLoading: true;
  allFilters?: never;
  initialFilters?: never;
  initialSort?: never;
};

export type TFilmsFilteredListingProps =
  | TListingLoaderProps
  | ({
      isLoading?: false;
    } & TFilmsDiscoveryProps);

import type { TListingLoaderProps } from './types';

import { DEFAULT_FILM_SORT, DEFAULT_FILTERS, FilmsListToolbar } from '@/features/filterFilms';
import { LoadMoreFilms } from '@/features/loadMoreFilms';

const noop = () => {};

export const ListingLoader = ({ isLoading }: TListingLoaderProps) => (
  <>
    <FilmsListToolbar
      allFilters={DEFAULT_FILTERS}
      selectedFilters={DEFAULT_FILTERS}
      selectedSort={DEFAULT_FILM_SORT}
      onUpdateFilters={noop}
      onUpdateSort={noop}
    />
    <LoadMoreFilms isPageLoading={isLoading} />
  </>
);

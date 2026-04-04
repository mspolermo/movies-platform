import type { TFilmsFilteredListingProps } from './types';

import { FilmsDiscovery } from './FilmsDiscovery';
import { ListingLoader } from './ListingLoader';

/**
 * Виджет страницы «Фильмы»: при `isLoading` — скелетон списка и заглушка фильтров;
 */
export const FilmsFilteredListing = (props: TFilmsFilteredListingProps) => {
  const { isLoading, allFilters, initialFilters, initialSort } = props;

  if (isLoading) {
    return <ListingLoader isLoading={isLoading} />;
  }

  return (
    <FilmsDiscovery
      allFilters={allFilters}
      initialFilters={initialFilters}
      initialSort={initialSort}
    />
  );
};

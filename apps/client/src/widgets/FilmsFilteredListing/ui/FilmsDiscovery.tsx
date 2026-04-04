import type { TFilmsDiscoveryProps } from './types';

import { FilmsListToolbar, useFilters } from '@/features/filterFilms';
import { LoadMoreFilms } from '@/features/loadMoreFilms';

export const FilmsDiscovery = ({
  allFilters,
  initialFilters,
  initialSort,
}: TFilmsDiscoveryProps) => {
  const { selectedFilters, selectedSort, searchFilmsParams, onUpdateSort, onUpdateFilters } =
    useFilters({
      initialFilters,
      initialSort,
    });

  return (
    <>
      <FilmsListToolbar
        allFilters={allFilters}
        selectedFilters={selectedFilters}
        selectedSort={selectedSort}
        onUpdateFilters={onUpdateFilters}
        onUpdateSort={onUpdateSort}
      />

      <LoadMoreFilms initialParams={searchFilmsParams} />
    </>
  );
};

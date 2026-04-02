'use client';

import type { TFilmsPageProps } from './types';

import { FilmsSortingFilter, useFilters } from '@/features/filterFilms';
import { LoadMoreFilms } from '@/features/loadMoreFilms';
import { Page } from '@/widgets/Layout';

export const FilmsPage = ({ allFilters, initialFilters, initialSort }: TFilmsPageProps) => {
  const { selectedFilters, selectedSort, searchFilmsParams, onUpdateSort, onUpdateFilters } = useFilters({
    initialFilters,
    initialSort,
  });

  return (
    <Page title="Фильмы">
      <FilmsSortingFilter
        allFilters={allFilters}
        selectedFilters={selectedFilters}
        selectedSort={selectedSort}
        onUpdateFilters={onUpdateFilters}
        onUpdateSort={onUpdateSort}
      />

      <LoadMoreFilms initialParams={searchFilmsParams} />
    </Page>
  );
};

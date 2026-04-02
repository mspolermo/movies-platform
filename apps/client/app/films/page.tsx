import type { TSearchParams } from '@/shared/types';

import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import {
  getFilmsFilters,
  parseSettingsFromNextSearchParams,
} from '@/features/filterFilms';
import { FilmsPage } from '@/pages/FilmsPage';

export default async function FilmsPageRoute({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const allFilters = await getFilmsFilters();

  if (!allFilters) {
    notFound();
  }

  const { filters: initialFilters, sort: initialSort } =
    parseSettingsFromNextSearchParams(searchParams);

  return (
    <Suspense fallback={null}>
      <FilmsPage
        allFilters={allFilters}
        initialFilters={initialFilters}
        initialSort={initialSort}
      />
    </Suspense>
  );
}

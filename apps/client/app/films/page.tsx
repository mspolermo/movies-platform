import type { TSearchParams } from '@/shared/types';

import { notFound } from 'next/navigation';

import { getFilmsFilters, parseSettingsFromNextSearchParams } from '@/features/filterFilms';
import { FilmsPage } from '@/pages/FilmsPage';
import { DEFAULT_FILTERS_LOCALE } from '@/shared/constants';

export default async function FilmsPageRoute({ searchParams }: { searchParams: TSearchParams }) {
  const allFilters = await getFilmsFilters(DEFAULT_FILTERS_LOCALE);

  if (!allFilters) {
    notFound();
  }

  const { filters: initialFilters, sort: initialSort } =
    parseSettingsFromNextSearchParams(searchParams);

  return (
    <FilmsPage allFilters={allFilters} initialFilters={initialFilters} initialSort={initialSort} />
  );
}

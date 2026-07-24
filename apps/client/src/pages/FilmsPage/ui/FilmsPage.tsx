'use client';

import type { TFilmsPageProps } from './types';

import { useSearchParams } from 'next/navigation';

import { parseSettingsFromURL } from '@/features/filterFilms';
import { FilmsFilteredListing } from '@/widgets/FilmsFilteredListing';
import { Page } from '@/widgets/Layout';

import { buildFilmsBreadcrumbs } from '../lib';

export const FilmsPage = (props: TFilmsPageProps) => {
  const searchParams = useSearchParams();
  const { filters } = parseSettingsFromURL(searchParams);

  return (
    <Page onlyLaptopTitle breadcrumbs={buildFilmsBreadcrumbs(filters)} title="Фильмы">
      <FilmsFilteredListing {...props} />
    </Page>
  );
};

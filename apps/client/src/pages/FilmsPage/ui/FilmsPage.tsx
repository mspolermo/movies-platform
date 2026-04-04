'use client';

import type { TFilmsPageProps } from './types';

import { FilmsFilteredListing } from '@/widgets/FilmsFilteredListing';
import { Page } from '@/widgets/Layout';


export const FilmsPage = (props: TFilmsPageProps) => {
  return (
    <Page onlyLaptopTitle title="Фильмы">
      <FilmsFilteredListing {...props} />
    </Page>
  );
};

'use client';

import { SearchFilmsAndPersons } from '@/features/searchFilmsAndPersonsByQuery';
import { Page } from '@/widgets/Layout';

export const SearchPage = () => {
  return (
    <Page title="Поиск">
      <SearchFilmsAndPersons />
    </Page>
  );
};

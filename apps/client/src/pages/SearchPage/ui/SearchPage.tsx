'use client';

import { SearchFilmsAndPersons } from '@/features/searchFilmsAndPersonsByQuery';
import { Layout } from '@/widgets/Layout';

export const SearchPage = () => {
  return (
    <Layout title='Поиск'>
      <SearchFilmsAndPersons />
    </Layout>
  );
};

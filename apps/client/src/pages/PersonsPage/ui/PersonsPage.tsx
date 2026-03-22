'use client';

import { AllPersonsList } from '@/features/getAllPersons';
import { Layout } from '@/widgets/Layout';

export const PersonsPage = () => {
  return (
    <Layout title="Персоны">
      <AllPersonsList />
    </Layout>
  );
};

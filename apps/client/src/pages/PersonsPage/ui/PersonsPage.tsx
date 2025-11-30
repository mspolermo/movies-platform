'use client';

import { Layout } from '@/widgets/Layout';
import { AllPersonsList } from '@/features/getAllPersons';

export const PersonsPage = () => {
  return (
    <Layout>
      <AllPersonsList />
    </Layout>
  );
};

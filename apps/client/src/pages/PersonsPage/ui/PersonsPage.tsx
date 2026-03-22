'use client';

import { AllPersonsList } from '@/features/getAllPersons';
import { Page } from '@/widgets/Layout';

export const PersonsPage = () => {
  return (
    <Page title="Персоны">
      <AllPersonsList />
    </Page>
  );
};

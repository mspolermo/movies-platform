'use client';

import type { TPersonsPageProps } from './types';

import { AllPersonsList } from '@/features/getAllPersons';
import { Page } from '@/widgets/Layout';

export const PersonsPage = ({ isLoading, initialPersonsPage }: TPersonsPageProps) => (
  <Page title="Персоны">
    <AllPersonsList
      initialData={isLoading ? undefined : initialPersonsPage}
      isLoading={Boolean(isLoading)}
    />
  </Page>
);

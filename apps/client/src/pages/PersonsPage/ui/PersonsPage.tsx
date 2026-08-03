'use client';

import type { TPersonsPageProps } from './types';

import { AllPersonsList } from '@/features/browsePersons';
import { Page } from '@/widgets/Layout';

export const PersonsPage = ({ isLoading, initialPersonsPage }: TPersonsPageProps) => {
  const title = 'Персоны';
  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: title }];

  return (
    <Page breadcrumbs={breadcrumbs} title={title}>
      <AllPersonsList
        initialData={isLoading ? undefined : initialPersonsPage}
        isLoading={Boolean(isLoading)}
      />
    </Page>
  );
};

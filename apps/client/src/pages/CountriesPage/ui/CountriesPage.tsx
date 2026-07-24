'use client';

import type { TCountriesPageProps } from './types';

import { CountriesList } from '@/entities/country';
import { Page } from '@/widgets/Layout';

export const CountriesPage = ({ isLoading, countriesList }: TCountriesPageProps) => {
  const title = 'Страны';
  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: title }];

  return (
    <Page breadcrumbs={breadcrumbs} title={title}>
      <CountriesList countriesList={countriesList ?? []} isLoading={Boolean(isLoading)} />
    </Page>
  );
};

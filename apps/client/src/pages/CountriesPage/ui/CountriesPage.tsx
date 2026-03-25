'use client';

import type { TCountriesPageProps } from './types';

import { CountriesList } from '@/entities/country';
import { Page } from '@/widgets/Layout';

export const CountriesPage = ({ isLoading, countriesList }: TCountriesPageProps) => (
  <Page title="Страны">
    <CountriesList countriesList={countriesList ?? []} isLoading={Boolean(isLoading)} />
  </Page>
);

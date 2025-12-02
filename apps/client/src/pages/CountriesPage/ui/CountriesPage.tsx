'use client';

import { Layout } from '@/widgets/Layout';
import { AllCountriesList } from '@/features/getAllCountries';

export const CountriesPage = () => {
  return (
    <Layout>
      <AllCountriesList />
    </Layout>
  );
};

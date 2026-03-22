'use client';

import type { TCountriesPageProps } from './types';

import { CountryCard } from '@/entities/country';
import { Skeleton } from '@/shared/ui';
import { Layout } from '@/widgets/Layout';

import styles from './CountriesPage.module.scss';

export const CountriesPage = ({
  isLoading,
  countriesList,
}: TCountriesPageProps) => {
  if (isLoading)
    return (
      <Layout title="Страны">
        <div className={styles.countriesGrid}>
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} height={70} width={220} />
          ))}
        </div>
      </Layout>
    );

  return (
    <Layout title="Страны">
      <div className={styles.countriesGrid}>
        {countriesList.map((country) => (
          <CountryCard key={country.id} country={country} />
        ))}
      </div>
    </Layout>
  );
};

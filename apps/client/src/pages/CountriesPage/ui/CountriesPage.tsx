'use client';

import { Layout } from '@/widgets/Layout';
import styles from './CountriesPage.module.scss';
import { CountryCard } from '@/entities/country';
import { TCountriesPageProps } from './types';
import { Skeleton } from '@/shared/ui';

export const CountriesPage = ({isLoading, countriesList}: TCountriesPageProps) => {

  if (isLoading) return (
    <Layout title='Страны'>
      <div className={styles.countriesGrid}>
        {[...Array(20)].map((_, i) => (
          <Skeleton key={i} width={220} height={70} />
        ))}
      </div>
    </Layout>
  )

  return (
    <Layout title='Страны'>
      <div className={styles.countriesGrid}>
        {countriesList.map((country) => (
          <CountryCard
            key={country.id}
            country={country}
          />
        ))}
      </div>
    </Layout>
  );
};
